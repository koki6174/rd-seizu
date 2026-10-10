'use strict';
/**
 * Strict nomenclature-first Orphadata crosswalk audit.
 * Input: local Orphapacket JSON directory (Orphanet CC BY 4.0),
 * and published disease_catalog names. Never maps by edit distance, translation
 * or hierarchical relationship. Outputs audit CANDIDATES, NOT live DB updates.
 *
 * Usage: node scripts/build_orpha_candidates.cjs /path/to/orphapacket/json
 */
const fs=require('node:fs'),path=require('node:path');
const directory=process.argv[2];
if(!directory||!fs.existsSync(directory))throw Error('Provide Orphapacket json directory');
const records=JSON.parse(fs.readFileSync('data/orpha_matching_names_public.json','utf8')).rows;
const normalize=s=>String(s||'').normalize('NFKC').trim().toLowerCase().replace(/\s+/g,' ');
const index=new Map();
let parsed=0;
for(const fname of fs.readdirSync(directory).filter(x=>/^ORPHApacket_\d+\.json$/.test(x))){
 let packet;
 try{packet=JSON.parse(fs.readFileSync(path.join(directory,fname),'utf8')).Orphapacket;}
 catch(error){continue;}
 if(!packet?.ORPHAcode||!packet?.Label)continue;
 const code=Number(packet.ORPHAcode);
 if(!Number.isInteger(code))continue;
 parsed++;
 const synonyms=Array.isArray(packet.Synonyms)?packet.Synonyms.map(x=>x.Synonym).filter(Boolean):[];
 const entry={code,label:packet.Label,type:packet.DisorderType?.value||'unspecified',
   hpo:(Array.isArray(packet.Phenotypes)?packet.Phenotypes:[]).length,
   genes:(Array.isArray(packet.Genes)?packet.Genes:[]).length};
 for(const [term,match] of [[packet.Label,'exact_label'],...synonyms.map(s=>[s,'exact_synonym'])]){
  const key=normalize(term);
  if(key.length<5)continue;
  if(!index.has(key))index.set(key,[]);
  index.get(key).push({...entry,match,source_term:term});
 }
}
const results=[],summary={total:records.length,with_english:0,
  unique_name_or_synonym:0,ambiguous:0,no_match:0,no_english:0};
for(const disease of records){
 const english=String(disease.name_en||'').trim();
 if(!english){summary.no_english++;results.push({id:disease.id,status:'missing_english_name'});continue;}
 summary.with_english++;
 // This is a conservative precision-first pass. English aliases are only used
 // for a suggestion; primary name determines whether a match is high-confidence.
 const matches=index.get(normalize(english))||[];
 const unique=new Map();
 for(const x of matches){
  const old=unique.get(x.code);
  if(!old||x.match==='exact_label')unique.set(x.code,x);
 }
 const candidate=[...unique.values()].sort((a,b)=>
  (a.match==='exact_label'?0:1)-(b.match==='exact_label'?0:1)||a.code-b.code);
 // Never silently promote a disease group, even if its English name is exact.
 const isBroadConcept=disease.concept_kind==='pediatric_disease_group';
 if(candidate.length===1&&!isBroadConcept){
  summary.unique_name_or_synonym++;
  results.push({id:disease.id,status:'unique_exact_candidate',source_name_en:english,
    candidate:candidate[0]});
 }else if(candidate.length){
  summary.ambiguous++;
  results.push({id:disease.id,status:'review_required',source_name_en:english,
    reason:isBroadConcept?'broader_disease_group':'multiple_orpha_concepts',
    candidates:candidate.slice(0,12),count:candidate.length});
 }else{
  summary.no_match++;
  results.push({id:disease.id,status:'not_matched',source_name_en:english});
 }
}
const release={note:'Automated exact-label/synonym candidates, NOT clinically reviewed',
 source:'https://github.com/Orphanet/orphapacket',source_type:'Orpha data snapshot',
 source_file_count:parsed,license:'CC BY 4.0',
 matching_rule:'NFKC + lowercase + whitespace, no edit-distance or translation'};
const output={metadata:release,summary,records:results};
fs.writeFileSync('data/orpha_matching_candidates.json',JSON.stringify(output,null,2)+'\n');
fs.writeFileSync('data/orpha_matching_summary.json',JSON.stringify({metadata:release,summary},null,2)+'\n');
console.log(JSON.stringify({summary,indexTerms:index.size,parsed},null,2));
