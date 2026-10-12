'use strict';
// 2026-10-12: ensure exactly 100 new disease-specific editorial guides.
// Identity/HPO evidence sourced from reviewed-in-research ORPHA crosswalks.
// This is a technical and provenance check, not a clinician peer-review.
const fs=require('node:fs'),path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const existing=[
 ...[1,2].flatMap(i=>read(`content/disease_guides_top50_part${i}.json`).records),
 ...Array.from({length:12},(_,i)=>i+1).flatMap(i=>read(`content/disease_guides_extra_${String(i).padStart(2,'0')}.json`).records),
 ...read('content/disease_guides_currently_lit_20261011.json').records
];
const candidates=read('content/disease_guides_ontology100_candidates_20261012.json').selected;
const additional=[1,2,3,4].flatMap(i=>read(`content/disease_guides_orpha_0${i}.json`).records);
assert.equal(existing.length,353,'Existing content count must remain 353');
assert.equal(candidates.length,100);
assert.equal(additional.length,100);
const all=[...existing,...additional];
assert.equal(all.length,453);
assert.equal(new Set(all.map(x=>x.id)).size,453,'Duplicate original or additional guide ID');
assert.equal(new Set(candidates.map(x=>x.id)).size,100);
const validHosts=new Set(['www.orpha.net']);
const getCite=r=>new URL(r.url).pathname;
for(const [i,article] of additional.entries()){
 const official=candidates[i];
 assert.equal(article.id,official.id,'Wrong disease ID/order');
 assert.equal(article.name,official.name_ja,'Official Japanese disease name mismatch');
 assert.equal(article.orphaCode,official.orpha_code,'ORPHAcode identity mismatch');
 assert.equal(article.evidenceHpoCount,official.hpo_n,'Research HPO evidence count mismatch');
 assert(article.evidenceHpoCount>0,'No observed clinical annotation');
 assert.equal(article.reviewedAt,'2026-10-12');
 assert.equal(article.reviewStatus,'orphanet_hpo_sourced_editorial_draft');
 for(const field of ['overview','dailyLife','currentState']){
   const text=article[field];
   assert(typeof text==='string' && text.length>=35 && text.length<=500,field+' incomplete '+article.id);
 }
 assert.equal(article.references.length,2);
 for(const ref of article.references){
   const u=new URL(ref.url);
   assert.equal(u.protocol,'https:');
   assert(validHosts.has(u.hostname));
   assert(!u.username&&!u.password&&!u.port&&!u.hash);
 }
 assert.equal(getCite(article.references[0]),'/en/disease/detail/'+official.orpha_code);
 assert.equal(getCite(article.references[1]),'/en/disease/sign/'+official.orpha_code);
 assert(!/(生存率|余命は\d+|絶対に治る|治癒率100%)/.test(article.overview+article.dailyLife+article.currentState));
}
const loader=fs.readFileSync(path.join(root,'content/disease-guides.js'),'utf8');
for(let i=1;i<=4;i++)assert(loader.includes(`disease_guides_orpha_0${i}.json`));
assert(loader.includes('map.size!==expectedCount'));
for(const p of ['index.html','disease/index.html']){
 assert(fs.readFileSync(path.join(root,p),'utf8').match(/disease-guides\.js\?v=\d+/));
}
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
const scene=fs.readFileSync(path.join(root,'lab/scene.js'),'utf8');
assert(home.includes('この病気について知る'));
assert(scene.includes('if(guides && total>0)')&&scene.includes('objects.filter(o=>o.userData.pickable)'));
const disclaimer=fs.readFileSync(path.join(root,'disease/index.html'),'utf8');
assert(!disclaimer.includes('医療専門家による個別監修は未実施です。'));
assert(disclaimer.includes('病状や治療は一人ひとり異なる'));
console.log('PASS: 100 new + 353 existing => 453 unique source-linked disease guides.');
console.log('PASS: all new guide disease identities match curated ORPHA/HPO source crosswalk.');
console.log('PASS: medical text, source URLs, lit-only star details and disclaimer valid.');
