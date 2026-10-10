'use strict';
/**
 * HPO + Orphadata evidence acquisition, using Orphanet's CC BY 4.0 ORPHApacket.
 * Source identity matching is exact unique preferred English label only;
 * no fuzzy names, translations, hierarchy inference or unreviewed auto-publish.
 *
 * node scripts/stage_orpha_hpo_evidence.cjs /tmp/orphapacket/json
 */
const fs=require('node:fs'),path=require('node:path');
const dir=process.argv[2];
if(!dir||!fs.existsSync(dir))throw Error('Pass downloaded Orphanet/orphapacket json directory');
const candidates=JSON.parse(fs.readFileSync('data/orpha_matching_candidates.json','utf8'));
const input=candidates.records.filter(r=>r.status==='unique_exact_candidate' &&
 r.candidate?.match==='exact_label' && r.candidate?.type==='Disease' &&
 Number(r.candidate.hpo)>0);
const normalize=s=>String(s||'').normalize('NFKC').toLowerCase().trim().replace(/\s+/g,' ');
const list=(value,key)=>{
 if(Array.isArray(value))return value;
 if(Array.isArray(value?.[key]))return value[key];
 if(value?.[key])return [value[key]];
 return [];
};
const accepted=[],errors=[],foundCodes=new Set();
for(const match of input){
 const code=Number(match.candidate.code);
 if(foundCodes.has(code))throw Error('Duplicate ORPHAcode in candidate list: '+code);
 foundCodes.add(code);
 const file=path.join(dir,'ORPHApacket_'+code+'.json');
 if(!fs.existsSync(file)){errors.push({id:match.id,code,reason:'source_missing'});continue;}
 let record;
 try{record=JSON.parse(fs.readFileSync(file,'utf8')).Orphapacket;}
 catch(e){errors.push({id:match.id,code,reason:'invalid_json'});continue;}
 if(!record||Number(record.ORPHAcode)!==code||
    normalize(record.Label)!==normalize(match.source_name_en)||
    record.DisorderType?.value!=='Disease'){
    errors.push({id:match.id,code,reason:'identity_inconsistent'});continue;
 }
 // Orphanet's own curated phenotypes; do not import HPO's OMIM IEA annotations
 // because OMIM-related licensing needs separate verification.
 const hpo=list(record.Phenotypes,'Phenotype').map(v=>v.Phenotype||v)
  .filter(v=>/^HP:[0-9]{7}$/.test(String(v?.HPOId||'')))
  .map(v=>({id:v.HPOId,label:v.HPOTerm||'',frequency:v.HPOFrequency||''}));
 const dedupHpo=new Map();
 for(const row of hpo)if(!dedupHpo.has(row.id))dedupHpo.set(row.id,row);
 const genes=list(record.Genes,'Gene').map(v=>v.Gene||v)
  .filter(v=>typeof v?.Symbol==='string'&&v.Symbol.length>0)
  .map(v=>({symbol:v.Symbol,association:v.DisorderGeneAssociationType||''}));
 const uniqueGenes=[...new Map(genes.map(v=>[v.symbol+'|'+v.association,v])).values()];
 const inheritance=list(record.TypeOfInheritances,'TypeOfInheritance').map(v=>v.value||v.Name)
  .filter(v=>typeof v==='string');
 const onset=list(record.AverageAgeOfOnsets,'AverageAgeOfOnset').map(v=>v.AverageAgeOfOnset||v)
  .map(v=>v.value||v.Name).filter(v=>typeof v==='string');
 if(!dedupHpo.size){errors.push({id:match.id,code,reason:'phenotypes_missing'});continue;}
 accepted.push({
   disease_id:match.id,orpha_code:code,original_label:record.Label,
   match_method:'exact_preferred_label_unique',review_status:'unreviewed',
   hpo_annotations:[...dedupHpo.values()],
   gene_associations:uniqueGenes,
   inheritance_terms:[...new Set(inheritance)],
   onset_terms:[...new Set(onset)],
   source_commit:process.env.ORPHAPACKET_COMMIT||'not_pinned',
   source_license:'CC BY 4.0, Orphanet/INSERM'
 });
}
accepted.sort((a,b)=>a.disease_id.localeCompare(b.disease_id,'en'));
if(accepted.length<110)throw Error('ORPHA identity coverage unexpectedly low: '+accepted.length);
fs.mkdirSync('data',{recursive:true});
for(let i=0;i<accepted.length;i+=20){
 const page=String(1+Math.floor(i/20)).padStart(2,'0');
 fs.writeFileSync('data/orpha_hpo_exact_source_'+page+'.json',
  JSON.stringify({source:'https://github.com/Orphanet/orphapacket',
   version:process.env.ORPHAPACKET_COMMIT||'not_pinned',
   status:'unreviewed exact English preferred-name candidate, NOT clinically validated',
   records:accepted.slice(i,i+20)},null,2)+'\n');
}
const totalHpo=accepted.reduce((z,r)=>z+r.hpo_annotations.length,0),
 totalGenes=accepted.reduce((z,r)=>z+r.gene_associations.length,0);
const summary={
 created_utc:new Date().toISOString(),
 source_commit:process.env.ORPHAPACKET_COMMIT||'not_pinned',
 status:'clinical_identity_unreviewed',
 catalog_total:1241,lexical_candidates:input.length,source_confirmed:accepted.length,
 rejected:errors,positive_hpo_annotations:totalHpo,gene_associations:totalGenes,
 no_imputation:true,
 note:'No clinical review. Data are not copied to user-facing diagnosis advice or promoted into verified mappings.'
};
fs.writeFileSync('data/orpha_hpo_exact_source_summary.json',JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
