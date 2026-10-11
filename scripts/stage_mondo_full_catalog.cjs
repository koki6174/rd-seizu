'use strict';
/**
 * Full-catalog candidate expansion using MONDO NANDO refs and Orphanet exactMatch,
 * with source packet confirmation. Output is a PRIVATE-REVIEW CANDIDATE DATASET.
 * Do not use to automatically assert an equivalence, infer absent symptoms,
 * or overwrite existing patient-facing clinical embeddings.
 *
 * node scripts/stage_mondo_full_catalog.cjs <nando_sssom> <orpha_sssom> <orpha_packet_json_dir>
 */
const fs=require('node:fs'),path=require('node:path');
const [nandoFile,orphaFile,packetDir]=process.argv.slice(2);
if(!nandoFile||!orphaFile||!packetDir)throw Error('Need MONDO SSSOMs and Orphapacket directory');
const repoPath='data/';
const read=name=>JSON.parse(fs.readFileSync(repoPath+name,'utf8'));
const normalize=v=>String(v||'').normalize('NFKC').toLowerCase()
 .replace(/[\s\u00a0\u200b\u2010-\u2015-]+/g,' ').trim();
const parse=filename=>{
 const lines=fs.readFileSync(filename,'utf8').split(/\r?\n/).filter(l=>l&&!l.startsWith('#'));
 const headings=lines.shift().split('\t');
 return lines.map(l=>Object.fromEntries(l.split('\t').map((v,i)=>[headings[i],v])));
};
const codes=Array.from({length:6},(_,i)=>i+1).flatMap(i=>
 read(`orphadata_verified_batch_0${i}.json`).rows);
if(codes.length!==120)throw Error('Current corroborated cohort changed: '+codes.length);
const reviewedIDs=new Set(codes.map(x=>x.id));
const reviewedCodes=new Set(codes.map(x=>Number(x.code)));
const records=read('orpha_matching_names_public.json').rows;
if(records.length!==1241)throw Error('Catalog snapshot should have 1241 concepts');
const m2o=new Map();
for(const record of parse(orphaFile)){
 if(record.predicate_id!=='skos:exactMatch'||record.mapping_justification!=='semapv:ManualMappingCuration')continue;
 let matches=m2o.get(record.subject_id)||[];matches.push(record);m2o.set(record.subject_id,matches);
}
const labels=new Map();
for(const record of parse(nandoFile)){
 if(record.mapping_justification!=='semapv:ManualMappingCuration'
  ||record.predicate_id!=='oboInOwl:hasDbXref'||!/^NANDO:\d+$/.test(record.object_id))continue;
 const key=normalize(record.subject_label);
 if(!key)continue;
 let matches=labels.get(key)||[];matches.push(record);labels.set(key,matches);
}
const preliminary=[];
for(const d of records){
 if(!d.name_en)continue;
 let candidates=[];
 for(const a of labels.get(normalize(d.name_en))||[])
  for(const b of m2o.get(a.subject_id)||[]){
   const code=Number(b.object_id.match(/^Orphanet:(\d+)$/)?.[1]);
   if(!Number.isInteger(code)||normalize(b.object_label)!==normalize(d.name_en))continue;
   candidates.push({orpha_code:code,mondo_id:a.subject_id,modern_nando_id:a.object_id,
    orpha_predicate:b.predicate_id,nando_predicate:a.predicate_id,
    justification_a:a.mapping_justification,justification_b:b.mapping_justification});
  }
 const distinct=[...new Set(candidates.map(x=>x.orpha_code))];
 if(distinct.length!==1)continue;
 preliminary.push({disease_id:d.id,name_ja:d.name_ja,name_en:d.name_en,
  concept_kind:d.concept_kind,orpha_code:distinct[0],proofs:candidates,
  originally_reviewed:reviewedIDs.has(d.id)});
}
const allUsage=new Map();
for(const c of preliminary){const ids=allUsage.get(c.orpha_code)||[];
 ids.push(c.disease_id);allUsage.set(c.orpha_code,ids);}
const expected=preliminary.filter(x=>!x.originally_reviewed && x.concept_kind!=='pediatric_disease_group'
 && allUsage.get(x.orpha_code).length===1 && !reviewedCodes.has(x.orpha_code));
if(expected.length!==75)throw Error('Expected 75 clean novel candidates; got '+expected.length);
const parseList=(v,name)=>Array.isArray(v)?v:Array.isArray(v?.[name])?v[name]:v?.[name]?[v[name]]:[];
const staged=[],errors=[];
for(const row of expected){
 const fname=path.join(packetDir,`ORPHApacket_${row.orpha_code}.json`);
 if(!fs.existsSync(fname)){errors.push({id:row.disease_id,reason:'packet_missing'});continue;}
 let r;
 try{r=JSON.parse(fs.readFileSync(fname,'utf8')).Orphapacket}catch(e){errors.push({id:row.disease_id,reason:'invalid_source'});continue;}
 if(Number(r.ORPHAcode)!==row.orpha_code||normalize(r.Label)!==normalize(row.name_en)){
  errors.push({id:row.disease_id,reason:'label_or_id_not_equal',source:r.Label});continue;
 }
 const phenotypes=new Map();
 for(const x of parseList(r.Phenotypes,'Phenotype')){
  const p=x.Phenotype||x, hp=p?.HPOId;
  if(!/^HP:\d{7}$/.test(String(hp||'')))continue;
  if(String(p.HPOFrequency||'').toLowerCase().includes('excluded'))continue;
  phenotypes.set(hp,{id:hp,label:p.HPOTerm||'',frequency:p.HPOFrequency||''});
 }
 const genes=[...new Map(parseList(r.Genes,'Gene').map(x=>x.Gene||x)
  .filter(x=>x?.Symbol&&x.DisorderGeneAssociationType)
  .map(x=>[x.Symbol+'|'+x.DisorderGeneAssociationType,{
   symbol:x.Symbol,association:x.DisorderGeneAssociationType}])).values()];
 const inheritance=[...new Set(parseList(r.TypeOfInheritances,'TypeOfInheritance')
  .map(x=>x.value||x.Name).filter(Boolean))];
 const onset=[...new Set(parseList(r.AverageAgeOfOnsets,'AverageAgeOfOnset')
  .map(x=>{const val=x.AverageAgeOfOnset||x;return val.value||val.Name;}).filter(Boolean))];
 staged.push({...row,orpha_source_type:r.DisorderType?.value||null,
  name_label_source:r.Label,phenotypes:[...phenotypes.values()],genes,inheritance,onset,
  has_hpo:phenotypes.size>0,clinical_identity_review:'pending_concept_granularity_review'});
}
if(staged.length!==75||errors.length)throw Error('Source evidence failure: '+JSON.stringify(errors.slice(0,8)));
const summary={catalog_total:1241,with_english:records.filter(x=>x.name_en).length,
 lexical_mondo_orpha_matches:preliminary.length,
 additional_name_matched_not_broad:expected.length,
 source_exact_id_label:staged.length,
 clinical_HPO_annotated:staged.filter(x=>x.has_hpo).length,
 disorder_type_counts:Object.fromEntries([...new Set(staged.map(x=>x.orpha_source_type))].sort().map(t=>[t,staged.filter(x=>x.orpha_source_type===t).length])),
 total_hpo_links:staged.reduce((s,x)=>s+x.phenotypes.length,0),
 unique_codes:[...new Set(staged.map(x=>x.orpha_code))].length,
 rows_reviewed_automatically:0,
 note:'Candidate proofs are not clinical confirmation; do not infer equivalence from NANDO hasDbXref alone. No broad pediatric group is auto-joined.'};
const version=process.env.ORPHAPACKET_COMMIT||'upstream_snapshot_at_run';
fs.writeFileSync(repoPath+'full_catalog_mondo_orpha_candidate_evidence_v1.json',
 JSON.stringify({summary,orpha_source_commit:version,mondo_release:'2026-10-06',
 candidates:staged},null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
