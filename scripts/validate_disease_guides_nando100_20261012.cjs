'use strict';
// Validates article identity, official-source scope and publication hygiene.
// This is NOT a clinical peer-review or a guarantee of article accuracy.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const original=[
 ...[1,2].flatMap(i=>read(`content/disease_guides_top50_part${i}.json`).records),
 ...Array.from({length:12},(_,i)=>i+1).flatMap(i=>read(`content/disease_guides_extra_${String(i).padStart(2,'0')}.json`).records),
 ...read('content/disease_guides_currently_lit_20261011.json').records,
 ...[1,2,3,4].flatMap(i=>read(`content/disease_guides_orpha_0${i}.json`).records)
];
const newArticles=[1,2,3,4].flatMap(i=>read(`content/disease_guides_nando_0${i}.json`).records);
const selected=read('content/disease_guides_nando_subtype_candidates_20261012.json').records;
const sources=read('content/disease_guides_subtype_parent_sources_20261012.json').records;
const dict=new Map(sources.map(x=>[x.id,x]));
assert.equal(original.length,453,'Existing 453 guides must not be removed');
assert.equal(newArticles.length,100);
assert.equal(selected.length,100);
assert.equal(new Set(original.map(x=>x.id)).size,453);
assert.equal(new Set([...original,...newArticles].map(x=>x.id)).size,553);
assert.equal(new Set(newArticles.map(x=>x.id)).size,100);
assert.equal(dict.size,100);
let exactParentRefs=0,characters=0;
for(const [i,row] of newArticles.entries()){
 const orig=selected[i],source=dict.get(row.id);
 assert(orig && source,'Missing source-backed NANDO concept');
 assert.equal(row.id,orig.id);assert.equal(row.name,orig.name_ja);
 assert.equal(row.name_en,orig.name_en);
 assert.equal(row.parentDiseaseId,orig.parent_disease_id);
 assert.equal(row.parentDiseaseId,source.parentId);
 assert.equal(row.references[0].url,source.parentUrl);
 assert.equal(row.reviewedAt,'2026-10-12');
 assert.equal(row.reviewStatus,'editorial_draft_subtype_specific_review_pending');
 assert.equal(row.sourceScope,'parent_disease_and_nando_taxonomy_not_full_subtype_clinical_review');
 assert.equal(row.references.length,2);
 for(const x of row.references){
  const u=new URL(x.url);
  assert.equal(u.protocol,'https:');
  assert(!u.username&&!u.password&&!u.port);
  assert(['www.nanbyou.or.jp','github.com'].includes(u.hostname),'Unexpected source host');
 }
 assert.equal(row.references[1].scope,'taxonomy');
 assert.equal(row.references[1].url,'https://github.com/NanbyoData/nando');
 const generic=row.references[0].url.includes('/entry/category/');
 assert.equal(row.references[0].scope,generic?'general_index':'parent_disease');
 if(!generic)exactParentRefs++;
 for(const key of ['overview','dailyLife','currentState']){
  assert(typeof row[key]==='string' && row[key].length>=45 && row[key].length<=450,
    'Insufficient original medical prose '+key+' '+row.id);
  assert(!/(余命は\d+年|絶対に治る|必ず治る|治癒率100%)/.test(row[key]),'Unsafe absolute efficacy claim');
  characters+=row[key].length;
 }
}
const loader=fs.readFileSync(path.join(root,'content/disease-guides.js'),'utf8');
for(let i=1;i<=4;i++)assert(loader.includes(`disease_guides_nando_0${i}.json`));
assert(loader.includes('map.size!==553'));
for(const name of ['index.html','disease/index.html']){
 const html=fs.readFileSync(path.join(root,name),'utf8');
 assert(html.includes('disease-guides.js?v=6'));
}
const article=fs.readFileSync(path.join(root,'disease/index.html'),'utf8');
assert(article.includes('病状や治療は一人ひとり異なる'));
assert(!article.includes('医療専門家による個別監修は未実施です。'));
const scene=fs.readFileSync(path.join(root,'lab/scene.js'),'utf8');
assert(scene.includes('objects.filter(o=>o.userData.pickable)'));
assert(scene.includes('if(guides && total>0)'));
console.log('PASS: 453 existing + 100 NANDO disease subtypes = 553 unique published guides');
console.log('PASS: official source scope explicit; 100 exact catalog IDs and names, '+exactParentRefs+' direct parent URLs');
console.log('New article text Unicode characters:',characters);
