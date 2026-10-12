'use strict';
/** Technical content + provenance check; not a medical peer review. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const base=[
 ...[1,2].flatMap(i=>read(`content/disease_guides_top50_part${i}.json`).records),
 ...Array.from({length:12},(_,i)=>i+1).flatMap(i=>read(`content/disease_guides_extra_${String(i).padStart(2,'0')}.json`).records),
 ...read('content/disease_guides_currently_lit_20261011.json').records,
 ...[1,2,3,4,5,6,7,8].flatMap(i=>read(`content/disease_guides_orpha_0${i}.json`).records)
];
const additional=[1,2,3,4].flatMap(i=>read(`content/disease_guides_nando_0${i}.json`).records);
const audit=read('content/disease_guides_nando_78_identity_audit.json');
assert.equal(base.length,553);
assert.equal(additional.length,78);
assert.equal(audit.originallyAuthored,100);
assert.equal(audit.recentlyMergedDuplicate,22);
assert.equal(audit.newArticles,78);
assert.equal(audit.excludedIds.length,22);
assert.equal(new Set(base.map(x=>x.id)).size,553);
assert.equal(new Set([...base,...additional].map(x=>x.id)).size,631);
assert.equal(new Set(additional.map(x=>x.id)).size,78);
const byId=new Map(audit.selected.map(x=>[x.id,x]));
assert.equal(byId.size,78);
let actualChars=0,officialParentLinks=0;
for(const row of additional){
 const matching=byId.get(row.id);
 assert(matching);
 assert.equal(row.name,matching.name_ja);
 assert.equal(row.parentDiseaseId,matching.parent_disease_id);
 assert.equal(row.reviewedAt,'2026-10-12');
 assert.equal(row.reviewStatus,'editorial_draft_subtype_specific_review_pending');
 assert.equal(row.sourceScope,'parent_disease_and_nando_taxonomy_not_full_subtype_clinical_review');
 assert.equal(row.references.length,2);
 assert.equal(row.references[1].scope,'taxonomy');
 assert.equal(row.references[1].url,'https://github.com/NanbyoData/nando');
 for(const ref of row.references){
  const url=new URL(ref.url);
  assert.equal(url.protocol,'https:');
  assert(['www.nanbyou.or.jp','github.com'].includes(url.hostname));
  assert(!url.username&&!url.password);
 }
 const generic=row.references[0].url.includes('/entry/category/');
 assert.equal(row.references[0].scope,generic?'general_index':'parent_disease');
 if(!generic)officialParentLinks++;
 for(const field of ['overview','dailyLife','currentState']){
  const s=row[field];
  assert(typeof s==='string'&&s.length>=45&&s.length<=450);
  assert(!/余命は\d+年|絶対に治る|必ず治る|治癒率100%/.test(s));
  actualChars+=s.length;
 }
}
const loader=fs.readFileSync(path.join(root,'content/disease-guides.js'),'utf8');
assert(loader.includes('map.size!==631'));
for(let i=1;i<=4;i++)assert(loader.includes(`disease_guides_nando_0${i}.json`));
for(const p of ['index.html','disease/index.html']){
 const page=fs.readFileSync(path.join(root,p),'utf8');
 assert(page.includes('disease-guides.js?v=7'));
}
const main=fs.readFileSync(path.join(root,'index.html'),'utf8');
const scene=fs.readFileSync(path.join(root,'lab/scene.js'),'utf8');
assert(main.includes('この病気について知る'));
assert(scene.includes('objects.filter(o=>o.userData.pickable)'));
assert(scene.includes('if(guides && total>0)'));
console.log('PASS: 553 previously published + 78 new distinct = 631 disease guide pages.');
console.log('PASS: source scope, catalog identity, no duplicate or unlit-star regressions.');
console.log('Original new article characters: '+actualChars+'; direct parent sources: '+officialParentLinks);
