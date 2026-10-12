'use strict';
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),c=path.join(root,'content'),d=path.join(root,'data');
const j=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const guideFiles=fs.readdirSync(c).filter(n=>/^disease_guides_(top50_part[12]|extra_\d{2}|orpha_\d{2}|currently_lit_20261011)\.json$/.test(n));
const existing=guideFiles.flatMap(n=>j(path.join(c,n)).records);
const usedId=new Set(existing.map(x=>x.id));
const usedCode=new Set(existing.map(x=>Number(x.orphaCode||0)).filter(Boolean));
const cat=j(path.join(d,'orpha_matching_names_public.json')).rows;
const catMap=new Map(cat.map(x=>[x.id,x]));
const candidates=new Map();
function add(id,code,hpo,genes,source,confidence,extra={}){
 if(!catMap.has(id)||usedId.has(id))return;
 let rec=candidates.get(id)||{id,name:catMap.get(id).name_ja,en:catMap.get(id).name_en,parent:catMap.get(id).parent_disease_id,kind:catMap.get(id).concept_kind,orphaCode:null,hpo:0,genes:[],source:[],confidence:0,phenotypes:[],inheritance:[],onset:[]};
 if(rec.orphaCode&&code&&rec.orphaCode!==code){rec.conflict=true;rec.source.push('CONFLICT:'+source);candidates.set(id,rec);return;}
 if(code)rec.orphaCode=Number(code);
 rec.hpo=Math.max(rec.hpo,Number(hpo)||0);
 const sym=(genes||[]).map(g=>typeof g==='string'?g:g.symbol).filter(Boolean);
 rec.genes=[...new Set([...rec.genes,...sym])].slice(0,20);
 rec.source.push(source);rec.confidence=Math.max(confidence,rec.confidence);
 if(extra.phenotypes?.length>rec.phenotypes.length)rec.phenotypes=extra.phenotypes;
 if(extra.inheritance?.length>rec.inheritance.length)rec.inheritance=extra.inheritance;
 if(extra.onset?.length>rec.onset.length)rec.onset=extra.onset;
 candidates.set(id,rec);
}
for(let n=1;n<=7;n++){
 const p=path.join(d,'orpha_hpo_exact_source_'+String(n).padStart(2,'0')+'.json');
 if(!fs.existsSync(p))continue;
 for(const r of j(p).records)add(r.disease_id,r.orpha_code,r.hpo_annotations?.length,r.gene_associations,'exact_orpha_hpo_'+n,2,{phenotypes:r.hpo_annotations,inheritance:r.inheritance_terms,onset:r.onset_terms});
}
for(let n=1;n<=7;n++){
 const p=path.join(d,'orphadata_verified_batch_'+String(n).padStart(2,'0')+'.json');
 if(!fs.existsSync(p))continue;
 for(const r of j(p).rows)add(r.id,r.code,r.phenotypes?.length,r.genes,'corroborated_'+n,4,{phenotypes:r.phenotypes,inheritance:r.inheritance,onset:r.onset});
}
for(const r of j(path.join(d,'full_catalog_mondo_orpha_candidate_evidence_v1.json')).candidates)add(r.disease_id,r.orpha_code,r.phenotypes?.length,r.genes,'mondo_nando_orpha',3,{phenotypes:r.phenotypes,inheritance:r.inheritance,onset:r.onset});
for(const r of j(path.join(d,'orpha_ancestor_chain_audit_v1.json')).records)add(r.disease_id,r.orpha_code,0,[],'orpha_ancestor',r.min_parent_match_depth===null?1:3);
const available=[...candidates.values()].filter(x=>!x.conflict&&x.orphaCode&&!usedCode.has(x.orphaCode)).sort((a,b)=>b.hpo-a.hpo||b.confidence-a.confidence||a.id.localeCompare(b.id));
const uncoded=cat.filter(x=>!usedId.has(x.id)&&!candidates.has(x.id));
const output={asOf:'2026-10-12',existing:existing.length,uniqueExisting:usedId.size,catalog:cat.length,availableSourceCandidates:available.length,missingClinicalEvidence:uncoded.length,withHpo:available.filter(x=>x.hpo>0).length,withStrongSource:available.filter(x=>x.confidence>=3).length,candidates:available,uncoded:uncoded.map(x=>({id:x.id,name:x.name_ja,en:x.name_en,kind:x.concept_kind,parent:x.parent_disease_id}))};
fs.writeFileSync(path.join(d,'guide_candidate_audit_20261012.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({existing:output.existing,uniqueExisting:output.uniqueExisting,available:available.length,withHpo:output.withHpo,strong:output.withStrongSource,uncoded:uncoded.length,first:available.slice(0,30).map(x=>({id:x.id,name:x.name,hpo:x.hpo,code:x.orphaCode}))},null,2));
