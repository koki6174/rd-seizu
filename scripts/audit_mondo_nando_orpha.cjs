'use strict';
/* NANDO/MONDO/Orphanet evidence triangulation.
 * Entry acceptance requires:
 * - exact unique English preferred label in local NANDO legacy catalog and Orphanet
 * - MONDO manually curated NANDO hasDbXref with same MONDO preferred English term
 * - same MONDO explicitly skos:exactMatch the identical ORPHAcode
 * - no ORPHAcode conflicts, no previously reviewed IDs.
 *
 * The NANDO modern identifier is an evidence reference, not an asserted
 * equivalent to the historical legacy NANDO ID. In particular,
 * oboInOwl:hasDbXref is NOT an OWL equivalence relation.
 * Label and taxonomy matching is NOT clinician verification.
 */
const fs=require('node:fs');
const [nandoPath,orphaPath]=process.argv.slice(2);
if(!nandoPath||!orphaPath)throw Error('Pass MONDO NANDO and exact Orphanet SSSOM files');
const repo='data/';
const readJson=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const parse=path=>{
 const lines=fs.readFileSync(path,'utf8').split(/\r?\n/).filter(l=>l&&!l.startsWith('#'));
 const fields=lines.shift().split('\t');
 return lines.map(row=>Object.fromEntries(row.split('\t').map((v,i)=>[fields[i],v])));
};
const norm=s=>String(s||'').normalize('NFKC').toLowerCase()
 .replace(/[\s\u00a0\u200b\u2010-\u2015-]+/g,' ').replace(/\s+/g,' ').trim();
const labels=readJson(repo+'orpha_matching_names_public.json').rows;
const labelMap=new Map(labels.map(r=>[r.id,r]));
const pending=Array.from({length:7},(_,i)=>i+1).flatMap(i=>readJson(`${repo}orpha_hpo_exact_source_0${i}.json`).records);
const already=Array.from({length:5},(_,i)=>i+1).flatMap(i=>readJson(`${repo}orphadata_verified_batch_0${i}.json`).rows);
const reviewedIds=new Set(already.map(r=>r.id));
const reviewedCodes=new Set(already.map(r=>Number(r.code)));
const distinct=new Map(already.map(r=>[r.id,Number(r.code)]));
if(reviewedIds.size!==50||reviewedCodes.size!==50)throw Error('Expected 50 unique current clinical links');
const nandoRows=parse(nandoPath),orphaRows=parse(orphaPath);
const byM=new Map();
for(const o of orphaRows){
 if(o.predicate_id!=='skos:exactMatch')continue;
 let a=byM.get(o.subject_id)||[];
 a.push(o);
 byM.set(o.subject_id,a);
}
const byName=new Map();
for(const n of nandoRows){
 if(n.predicate_id!=='oboInOwl:hasDbXref'||
    n.mapping_justification!=='semapv:ManualMappingCuration')continue;
 const name=norm(n.subject_label);
 if(!name||!/^NANDO:\d+$/.test(n.object_id))continue;
 const a=byName.get(name)||[];a.push(n);byName.set(name,a);
}
const candidates=[];
for(const source of pending){
 const row=labelMap.get(source.disease_id);
 if(!row||norm(row.name_en)!==norm(source.original_label))continue;
 if(reviewedIds.has(source.disease_id))continue;
 const records=byName.get(norm(row.name_en))||[];
 let proofs=[];
 for(const n of records)for(const o of (byM.get(n.subject_id)||[])){
  if(o.object_id!==`Orphanet:${source.orpha_code}`)continue;
  const equalOrphaName=norm(o.object_label)===norm(source.original_label);
  if(!equalOrphaName)continue;
  proofs.push({mondo_id:n.subject_id,mondo_label:n.subject_label,
   nando_modern_id:n.object_id,
   orpha_code:Number(source.orpha_code),
   mondo_to_orpha_predicate:o.predicate_id,
   mondo_to_nando_predicate:n.predicate_id,
   mondo_justification:n.mapping_justification,
   orpha_justification:o.mapping_justification});
 }
 const mono=[...new Set(proofs.map(p=>p.mondo_id))];
 if(mono.length!==1)continue;
 if(!proofs.length)continue;
 const code=Number(source.orpha_code);
 if(reviewedCodes.has(code))throw Error('Already-used ORPHAcode: '+code);
 candidates.push({disease_id:source.disease_id,orpha_code:code,
  local_name_en:row.name_en,local_name_ja:row.name_ja,
  source_nando_legacy_id:source.disease_id,
  original_orpha_name_en:source.original_label,
  relationship:'manual_MONDO_hasDbXref_NANDO + MONDO_exactMatch_ORPHA + exact_preferred_labels',
  evidence:proofs, curator_review:'source_corroborated_not_clinician',
  source_release:'MONDO SSSOM 2026-10-06; OrphaPacket pinned 7a631b4369d8ee85695edf5c099d256a3461665d'});
}
const codeUsage=new Map();
for(const r of candidates)codeUsage.set(r.orpha_code,(codeUsage.get(r.orpha_code)||0)+1);
if(candidates.some(r=>codeUsage.get(r.orpha_code)!==1))throw Error('ORPHAcode collision');
if(new Set(candidates.map(r=>r.disease_id)).size!==candidates.length)throw Error('ID collision');
candidates.sort((a,b)=>a.disease_id.localeCompare(b.disease_id,'en'));
if(candidates.length!==70)throw Error('Expected 70 independent cross-source matches, got '+candidates.length);
const byCandidate=new Map(candidates.map(r=>[r.disease_id,r]));
const batch=pending.filter(r=>byCandidate.has(r.disease_id)).map(r=>{
 const proof=byCandidate.get(r.disease_id);
 return {id:r.disease_id,en:r.original_label,code:Number(r.orpha_code),
 label:r.original_label,synonym:null,match:'mondo_cross_source',
 source_date:proof.source_release,
 phenotypes:r.hpo_annotations,genes:r.gene_associations,
 inheritance:r.inheritance_terms,onset:r.onset_terms,
 verification:proof.relationship,
 source_evidence:proof.evidence};
}).sort((a,b)=>a.id.localeCompare(b.id,'en'));
if(batch.length!==70||batch.some(r=>distinct.has(r.id)))throw Error('Batch crosswalk overlaps vetted cohort');
const audit={meta:{
  matched:70,previous_reviewed:50,projected_reviewed:120,
  originally_staged:pending.length,remaining_initial_staged:pending.length-44-70,
  evidence_level:'cross-source ontology xrefs plus three-way preferred-label equality; not external clinical sign-off',
  limitations:['NANDO hasDbXref is not exactMatch','legacy NANDO ID is not the modern NANDO ID',
  'MONDO-ORPHA exactMatch indicates ontology-level claim, not a diagnostic identity guarantee']},
 matches:candidates};
fs.writeFileSync(repo+'orpha_mondo_crosswalk_evidence_v1.json',JSON.stringify(audit,null,2)+'\n');
fs.writeFileSync(repo+'orphadata_verified_batch_06.json',
 JSON.stringify({status:'ontology-source-corroborated; not independently clinician-reviewed',source:'MONDO NANDO hasDbXref + Orphanet exactMatch + unique identical English labels',rows:batch},null,2)+'\n');
console.log(JSON.stringify({evidence:audit.meta,phenotypes:batch.reduce((n,r)=>n+r.phenotypes.length,0),
 genes:batch.reduce((n,r)=>n+r.genes.length,0)},null,2));
