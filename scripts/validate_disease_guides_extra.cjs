'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
function json(p){return JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));}
const old=[1,2].flatMap(i=>json(`content/disease_guides_top50_part${i}.json`).records);
const added=[1,2,3,4].flatMap(i=>json(`content/disease_guides_extra_0${i}.json`).records);
const snapshot=json('content/disease_guides_extra_catalog_snapshot.json').records;
const names=new Map(snapshot.map(x=>[x.id,x]));
assert.equal(old.length,50);
assert.equal(added.length,100);
assert.equal(names.size,100);
assert.equal(new Set(added.map(x=>x.id)).size,100);
assert.equal(new Set([...old,...added].map(x=>x.id)).size,150);
assert(added.every(x=>x.reviewStatus==='editorial_draft_sources_not_individually_medically_validated'));
for(let i=0;i<added.length;i++){
 const item=added[i],c=names.get(item.id);
 assert(c&&c.published===true, 'Published catalog ID required: '+item.id);
 assert.equal(item.name,c.name_ja,'Official Japanese name must match');
 assert.equal(c.designation>=1&&c.designation<=145,true);
 assert.equal(item.batch,Math.floor(i/25)+1);
 for(const field of ['overview','dailyLife','currentState']){
  assert(typeof item[field]==='string'&&item[field].length>=35,'Short '+field+' '+item.id);
  assert(item[field].length<=400,'Unusually long '+field+' '+item.id);
 }
 assert(item.references.length>=2);
 assert(item.references.some(x=>x.url==='https://www.mhlw.go.jp/stf/newpage_53881.html'));
 assert(item.references.some(x=>new URL(x.url).hostname==='www.nanbyou.or.jp'));
 for(const ref of item.references){
  const u=new URL(ref.url);
  assert.equal(u.protocol,'https:');
  assert(['www.mhlw.go.jp','www.nanbyou.or.jp'].includes(u.hostname));
 }
 assert(!/生存率|治癒率.*100|余命は\d+年|必ず治る|絶対に治る/.test(item.overview+item.dailyLife+item.currentState));
}
const html=fs.readFileSync(path.join(root,'disease/index.html'),'utf8');
assert(!html.includes('医療専門家による個別監修は未実施です。'));
assert(html.includes('病状や治療は一人ひとり異なる'));
const loader=fs.readFileSync(path.join(root,'content/disease-guides.js'),'utf8');
for(let i=1;i<=4;i++)assert(loader.includes(`disease_guides_extra_0${i}.json`));
assert(loader.includes('map.size!==553'));
const total=added.reduce((n,x)=>n+x.overview.length+x.dailyLife.length+x.currentState.length,0);
console.log('PASS: 50 original + 100 additional = 150 exact catalog disease guides.');
console.log('100 new original guide paragraphs: '+total+' Japanese Unicode characters in overview/living/treatment.');
console.log('Verified: No duplicate IDs, exact DB names, no invented source hosts, public caution retained.');
