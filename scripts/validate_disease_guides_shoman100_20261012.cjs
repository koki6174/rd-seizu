'use strict';
// 2026-10-12: verify 100 new Shoman category articles, canonical DB names,
// careful source specificity labelling, and complete 653-guide integration.
// This is not a clinician peer review or dynamic penetration test.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=fp=>JSON.parse(fs.readFileSync(path.join(root,fp),'utf8'));
const first=[1,2].flatMap(n=>read('content/disease_guides_top50_part'+n+'.json').records);
const extra=Array.from({length:12},(_,i)=>read('content/disease_guides_extra_'+String(i+1).padStart(2,'0')+'.json').records).flat();
const lit=read('content/disease_guides_currently_lit_20261011.json').records;
const orpha=Array.from({length:8},(_,i)=>read('content/disease_guides_orpha_0'+(i+1)+'.json').records).flat();
const existing=[...first,...extra,...lit,...orpha];
const added=[1,2,3,4].flatMap(n=>read('content/disease_guides_shoman_0'+n+'.json').records);
const snapshot=read('content/disease_guides_shoman_100_catalog_snapshot.json').records;
const all=[...existing,...added];
assert.equal(existing.length,553);
assert.equal(added.length,100);
assert.equal(snapshot.length,100);
assert.equal(all.length,653);
assert.equal(new Set(all.map(x=>x.id)).size,653,'Duplicate ID among 653 articles');
const db=new Map(snapshot.map(x=>[x.id,x]));
assert.equal(db.size,100);
let direct=0, category=0;
for(let i=0;i<added.length;i++){
 const r=added[i], canonical=db.get(r.id);
 assert(canonical,'Not in confirmed published catalog: '+r.id);
 assert.equal(r.name,canonical.name_ja,'DB Japanese disease name mismatch');
 assert.equal(r.reviewStatus,'official_catalog_classified_editorial_draft');
 assert.equal(r.reviewedAt,'2026-10-12');
 assert.equal(r.batch,undefined); // the batch is on each file, not a disease
 assert.equal(r.references.length,2);
 for(const k of ['overview','dailyLife','currentState']){
  assert.equal(typeof r[k],'string');
  assert(r[k].trim().length>=35,'Underlength content '+r.id+' '+k);
 }
 for(const ref of r.references){
  const url=new URL(ref.url);
  assert.equal(url.protocol,'https:');
  assert.equal(url.hostname,'www.shouman.jp','Source is not the designated center');
 }
 assert.equal(r.references[0].sourceScope,canonical.sourceReview);
 if(r.references[0].sourceScope==='condition_specific'){direct++;assert.equal(r.needsIndividualSourceReview,false);}
 else {category++;assert.equal(r.needsIndividualSourceReview,true);}
}
assert.equal(direct+category,100);
const lib=fs.readFileSync(path.join(root,'content/disease-guides.js'),'utf8');
assert(lib.includes('map.size!==653'));
for(let i=1;i<=4;i++)assert(lib.includes('disease_guides_shoman_0'+i+'.json'));
for(const p of ['index.html','disease/index.html']){
 assert(fs.readFileSync(path.join(root,p),'utf8').includes('disease-guides.js?v=7'));
}
const main=fs.readFileSync(path.join(root,'lab/scene.js'),'utf8');
assert(main.includes('if(guides && total>0)'),'Dark-star names must remain hidden');
const n=added.reduce((sum,r)=>sum+r.overview.length+r.dailyLife.length+r.currentState.length,0);
console.log('PASS: 100 new ID/name-matched Shoman articles, total 653 unique guides.');
console.log('Condition-specific source pages:',direct,'category-only source indexes:',category);
console.log('New body text raw character count:',n);
