'use strict';
/* 2026-10-12: verify 100 new article pages and original 153 entries. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const json=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const former=[
 ...[1,2].flatMap(i=>json(`content/disease_guides_top50_part${i}.json`).records),
 ...[1,2,3,4].flatMap(i=>json(`content/disease_guides_extra_0${i}.json`).records),
 ...json('content/disease_guides_currently_lit_20261011.json').records
];
const incoming=[5,6,7,8].flatMap(i=>json(`content/disease_guides_extra_0${i}.json`).records);
const crosswalk=json('content/disease_guides_extra_20261012_catalog_snapshot.json').records;
assert.equal(former.length,153);
assert.equal(incoming.length,100);
assert.equal(crosswalk.length,100);
const all=[...former,...incoming];
assert.equal(new Set(all.map(x=>x.id)).size,253,'Duplicate disease IDs found');
assert.equal(new Set(crosswalk.map(x=>x.id)).size,100);
const official=new Map(crosswalk.map(x=>[x.id,x]));
let specific=0;
for(const [index,x] of incoming.entries()){
 const db=official.get(x.id);
 assert(db,'Unregistered disease ID '+x.id);
 assert(db.published===true,'Unpublished disease '+x.id);
 assert.equal(x.name,db.name_ja,'Disease label is not the exact catalog Japanese name: '+x.id);
 assert.equal(x.designation,db.designation);
 assert.equal(x.id,db.id,'Wrong order or missing ID in new batch');
 assert.equal(x.designation,[...Array(102)].map((_,j)=>j+146).filter(n=>n!==162&&n!==222)[index]);
 assert(x.reviewStatus==='official_primary_sources_editorial_draft');
 assert(x.reviewedAt==='2026-10-12');
 for(const key of ['overview','dailyLife','currentState']){
  assert(typeof x[key]==='string' && x[key].length>=35 && x[key].length<500,`Missing or implausible ${key} for ${x.id}`);
  assert(!/^(この病気は|さまざまな病気)/.test(x[key]) || x[key].length>60);
 }
 assert(x.references.length>=2);
 assert(x.references.some(r=>r.url==='https://www.mhlw.go.jp/stf/newpage_53881.html'));
 assert(x.references.some(r=>new URL(r.url).hostname==='www.nanbyou.or.jp'));
 for(const ref of x.references){
  const u=new URL(ref.url);
  assert.equal(u.protocol,'https:');
  assert(['www.nanbyou.or.jp','www.mhlw.go.jp'].includes(u.hostname));
  assert(!u.username&&!u.password&&!u.port);
  if(ref.verifiedSpecific){
   assert(/^https:\/\/www\.nanbyou\.or\.jp\/entry\/\d+$/.test(ref.url),'Unverified specific page');
  }
 }
 if(x.references[0].verifiedSpecific)specific++;
 assert(!/(生存率は|余命は|完治する|必ず治る)/.test(x.overview+x.dailyLife+x.currentState));
}
assert(specific>=80,'Expected at least 80 exact official disease-specific article URLs');
const loader=fs.readFileSync(path.join(root,'content/disease-guides.js'),'utf8');
for(const n of [5,6,7,8])assert(loader.includes(`disease_guides_extra_0${n}.json`));
assert(loader.includes('map.size!==expectedCount'));
const html=fs.readFileSync(path.join(root,'disease/index.html'),'utf8');
const stars=fs.readFileSync(path.join(root,'lab/scene.js'),'utf8');
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(html.match(/disease-guides\.js\?v=\d+/) && home.match(/disease-guides\.js\?v=\d+/));
assert(!html.includes('医療専門家による個別監修は未実施です。'));
assert(stars.includes('if(guides && total>0)'));
assert(stars.includes('objects.filter(o=>o.userData.pickable)'));
assert(stars.includes("Number(starData.get(id)?.total)>0"));
console.log(`PASS: 100 new exact DB IDs and names, no duplicates, 253 total disease pages; ${specific} individual official disease links.`);
