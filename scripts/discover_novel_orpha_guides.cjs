'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const sourceDir=process.argv[2];if(!sourceDir)throw Error('OrphaPacket json dir missing');
const j=x=>JSON.parse(fs.readFileSync(x,'utf8'));
const cat=j(path.join(root,'data/orpha_matching_names_public.json')).rows;
const contentDir=path.join(root,'content');
const loader=fs.readFileSync(path.join(contentDir,'disease-guides.js'),'utf8');
const sources=[...loader.matchAll(/'([^']+\.json)'/g)].map(x=>x[1]).filter(x=>fs.existsSync(path.join(contentDir,x)));
const records=sources.flatMap(n=>j(path.join(contentDir,n)).records);
const existingIds=new Set(records.map(x=>x.id));
const existingCodes=new Set(records.map(x=>Number(x.orphaCode)).filter(x=>Number.isInteger(x)&&x>0));
const normalize=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[\s\u00a0\u200b\u2010-\u2015-]+/g,' ').trim();
const unlisted=cat.filter(x=>!existingIds.has(x.id)&&!!x.name_en&&x.concept_kind!=='pediatric_disease_group');
const byName=new Map();for(const row of unlisted){const k=normalize(row.name_en);const matches=byName.get(k)||[];matches.push(row);byName.set(k,matches);}
const fname=fs.readdirSync(sourceDir).filter(x=>/^ORPHApacket_\d+\.json$/.test(x));
const candidateList=[];
let skipped=0;
for(const file of fname){
 const raw=j(path.join(sourceDir,file));const src=raw.Orphapacket||raw;
 const id=Number(src.ORPHAcode);if(!Number.isInteger(id)||existingCodes.has(id))continue;
 const name=normalize(src.Label);
 const synonyms=(Array.isArray(src.Synonyms)?src.Synonyms:[]).map(x=>x.Synonym||x.value||'').filter(Boolean);
 const candidateNames=[{label:src.Label,basis:'preferred_name'},...synonyms.filter(x=>normalize(x).length>=10).map(x=>({label:x,basis:'official_synonym'}))];
 const hits=candidateNames.flatMap(c=>(byName.get(normalize(c.label))||[]).map(r=>({r,basis:c.basis,label:c.label})));
 const ids=[...new Set(hits.map(x=>x.r.id))];
 if(ids.length!==1)continue;
 const matched=hits.find(x=>x.basis==='preferred_name')||hits[0];
 const r=matched.r;
 const phenos=src.Phenotypes?.Phenotype;
 const list=Array.isArray(phenos)?phenos:phenos?[phenos]:[];
 const ph=list.map(x=>x.Phenotype||x).filter(x=>/^HP:\d{7}$/.test(String(x.HPOId||''))).filter(x=>!String(x.HPOFrequency||'').toLowerCase().includes('excluded')).map(x=>({id:x.HPOId,name:x.HPOTerm,frequency:x.HPOFrequency}));
 const genes=src.Genes?.Gene;const gl=(Array.isArray(genes)?genes:genes?[genes]:[]).map(x=>x.Gene||x).filter(x=>x.Symbol).map(x=>({symbol:x.Symbol,association:x.DisorderGeneAssociationType||''}));
 candidateList.push({id:r.id,name:r.name_ja,en:r.name_en,code:id,label:src.Label,matchedTerm:matched.label,matchBasis:matched.basis,definition:src.TextSection?.Contents||null,parent:r.parent_disease_id,kind:r.concept_kind,orphaType:src.DisorderType?.value||null,hpo:ph.length,phenotypes:ph,genes:gl,packetFile:file});
}
const seen=new Map();for(const r of candidateList){const arr=seen.get(r.id)||[];arr.push(r.code);seen.set(r.id,arr);}
const selected=candidateList.filter(x=>seen.get(x.id).length===1).sort((a,b)=>Number(a.matchBasis!=='preferred_name')-Number(b.matchBasis!=='preferred_name')||b.hpo-a.hpo||a.id.localeCompare(b.id));
const report={asOf:'2026-10-12',source:'OrphaPacket official repository / HPO',existing:records.length,eligibleUnlisted:unlisted.length,packets:fname.length,exactMatches:candidateList.length,unique:selected.length,withHpo:selected.filter(x=>x.hpo>0).length,exactPreferred:selected.filter(x=>x.matchBasis==='preferred_name').length,viaSynonym:selected.filter(x=>x.matchBasis==='official_synonym').length,selected};
fs.writeFileSync(path.join(root,'data/guide_orpha_exact_candidates_after553_20261012.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({existing:report.existing,packets:report.packets,eligible:report.eligibleUnlisted,exact:report.exactMatches,unique:report.unique,withHpo:report.withHpo,exact:report.exactPreferred,viaSynonym:report.viaSynonym,first:selected.slice(0,20).map(x=>({id:x.id,name:x.name,code:x.code,hpo:x.hpo}))},null,2));
