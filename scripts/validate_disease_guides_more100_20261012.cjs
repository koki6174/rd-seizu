'use strict';
// Validates the independently added 100 disease guides without changing
// the existing 453 guide texts, ranking or public-submission behavior.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,'content',name),'utf8')).records;
const legacy=[
 ...[1,2].flatMap(i=>read('disease_guides_top50_part'+i+'.json')),
 ...[1,2,3,4,5,6,7,8,9,10,11,12].flatMap(i=>read('disease_guides_extra_'+String(i).padStart(2,'0')+'.json')),
 ...read('disease_guides_currently_lit_20261011.json'),
 ...[1,2,3,4].flatMap(i=>read('disease_guides_orpha_0'+i+'.json'))
];
const added=[1,2,3,4,5].flatMap(i=>read('disease_guides_more_0'+i+'.json'));
const official=read('disease_guides_more_20261012_catalog_crosswalk.json');
assert.equal(legacy.length,453,'Existing 453 guides must be preserved');
assert.equal(added.length,100);
assert.equal(official.length,100);
const all=[...legacy,...added];
assert.equal(new Set(all.map(x=>x.id)).size,553,'Duplicate IDs across all articles');
const byId=new Map(official.map(x=>[x.id,x]));
assert.equal(byId.size,100,'Duplicate DB crosswalk IDs');
const allowed=new Set(['www.nanbyou.or.jp','www.mhlw.go.jp']);
let count=0;
for(const item of added){
 assert.match(item.id,/^[a-z0-9-]{2,100}$/);
 const db=byId.get(item.id);
 assert(db&&db.published,'Missing active DB identity: '+item.id);
 assert.equal(item.name,db.name_ja,'DB name mismatch: '+item.id);
 assert.equal(item.reviewedAt,'2026-10-12');
 assert(['parent_disease_reference_editorial_draft','disease_subtype_official_parent_reference_editorial_draft'].includes(item.reviewStatus));
 for(const field of ['overview','dailyLife','currentState']){
  assert(typeof item[field]==='string' && item[field].trim().length>=35,'Missing '+field+' '+item.id);
  assert(item[field].length<500,'Oversized '+field+' '+item.id);
 }
 assert(Array.isArray(item.references)&&item.references.length>=2,'Missing references '+item.id);
 for(const r of item.references){
  const u=new URL(r.url);
  assert.equal(u.protocol,'https:');
  assert(allowed.has(u.hostname),'Unexpected reference host '+u.hostname);
  assert(!u.username&&!u.password&&!u.port,'Unsafe URL '+r.url);
 }
 assert(!/(生存率は|余命は\d+年|絶対に治る|必ず治る)/.test(item.overview+item.dailyLife+item.currentState));
 count+=item.overview.length+item.dailyLife.length+item.currentState.length;
}
const loader=fs.readFileSync(path.join(root,'content/disease-guides.js'),'utf8');
for(let i=1;i<=5;i++)assert(loader.includes('disease_guides_more_0'+i+'.json'));
assert(loader.includes('map.size!==553'));
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
const detail=fs.readFileSync(path.join(root,'disease/index.html'),'utf8');
assert(home.includes('disease-guides.js?v=6')&&detail.includes('disease-guides.js?v=6'));
assert(!detail.includes('医療専門家による個別監修は未実施です。'));
const stars=fs.readFileSync(path.join(root,'lab/scene.js'),'utf8');
assert(stars.includes('if(guides && total>0)'));
assert(stars.includes('objects.filter(o=>o.userData.pickable)'));
assert(stars.includes("Number(starData.get(id)?.total)>0"));
console.log('PASS: 453 original + 100 newly sourced educational drafts = 553 unique disease guides');
console.log('100 new guide text fields:',count,'UTF-16 code units (Python Unicode audit below)');
console.log('Source scope marked as parent-level rather than individually medically verified');
