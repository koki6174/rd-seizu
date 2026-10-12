'use strict';
// Validate the next 100 source-index-linked Japanese disease articles.
// Static/source-schema check; it does NOT assert independent clinical review.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const prior=[
 ...[1,2].flatMap(i=>read(`content/disease_guides_top50_part${i}.json`).records),
 ...[1,2,3,4,5,6,7,8].flatMap(i=>read(`content/disease_guides_extra_0${i}.json`).records),
 ...read('content/disease_guides_currently_lit_20261011.json').records
];
const fresh=[9,10,11,12].flatMap(i=>read(`content/disease_guides_extra_${i===9?'09':i}.json`).records);
const crosswalk=read('content/disease_guides_extra_20261012_batch2_catalog_snapshot.json').records;
assert.equal(prior.length,253);
assert.equal(fresh.length,100);
assert.equal(crosswalk.length,100);
const lookup=new Map(crosswalk.map(x=>[x.id,x]));
assert.equal(lookup.size,100);
assert.equal(new Set([...prior,...fresh].map(x=>x.id)).size,353);
const exactNumbered=[...Array(101)].map((_,i)=>i+248).filter(i=>![271,300,306].includes(i));
assert.equal(exactNumbered.length,98);
let directlySourced=0;
for(const [i,x] of fresh.entries()){
 const c=lookup.get(x.id);
 assert(c,'missing DB crosswalk '+x.id);
 assert.equal(x.name,c.name_ja);
 assert.equal(x.designation,c.designation);
 if(i<98){
  assert.equal(x.designation,exactNumbered[i], 'MHLW numbering/duplicate error');
  assert.equal(x.id,`mhlw-${String(x.designation).padStart(4,'0')}`);
 }else{
  assert.equal(x.id,i===98?'gaucher-disease':'pompe-disease');
  assert.equal(x.designation,null);
 }
 assert.equal(x.batch,9+Math.floor(i/25));
 assert.equal(x.reviewStatus,
  i<98?'official_index_crosschecked_editorial_draft':'official_disease_specific_sources_checked_editorial_draft');
 assert.equal(x.reviewedAt,'2026-10-12');
 for(const field of ['overview','dailyLife','currentState']){
  assert(typeof x[field]==='string'&&x[field].length>=35&&x[field].length<=450,field+' invalid '+x.id);
 }
 assert(x.references.length>=2);
 for(const ref of x.references){
  const u=new URL(ref.url);
  assert(u.protocol==='https:'&&!u.username&&!u.password&&!u.port);
  assert(['www.nanbyou.or.jp','www.mhlw.go.jp','www.ncbi.nlm.nih.gov'].includes(u.hostname),
    'source outside editorial domain set: '+ref.url);
 }
 if(i<98){
  assert(x.references.some(r=>r.url==='https://www.mhlw.go.jp/stf/newpage_53881.html'));
  const expectedIndex=x.designation<=250?'https://www.nanbyou.or.jp/entry/5476':
    x.designation<=300?'https://www.nanbyou.or.jp/entry/5477':'https://www.nanbyou.or.jp/entry/5478';
  assert(x.references.some(r=>r.url===expectedIndex||r.verifiedSpecific),'missing disease-index source '+x.id);
 }else assert(x.references.some(r=>r.url.includes('ncbi.nlm.nih.gov/books/NBK')));
 if(x.references.some(r=>r.verifiedSpecific))directlySourced++;
 assert(!/(必ず治る|完治が保証|余命は\d+年|生存率は\d+%)/.test(
  x.overview+x.dailyLife+x.currentState));
}
const loader=fs.readFileSync(path.join(root,'content/disease-guides.js'),'utf8');
for(const i of [9,10,11,12])assert(loader.includes(`disease_guides_extra_${i===9?'09':i}.json`));
assert(loader.includes('map.size!==expectedCount'));
for(const p of ['index.html','disease/index.html']){
 const html=fs.readFileSync(path.join(root,p),'utf8');
 assert(html.match(/disease-guides\.js\?v=\d+/));
 assert(!html.includes('医療専門家による個別監修は未実施です。'));
}
const scene=fs.readFileSync(path.join(root,'lab/scene.js'),'utf8');
assert(scene.includes('if(guides && total>0)'));
assert(scene.includes('objects.filter(o=>o.userData.pickable)'));
console.log(`PASS: 253 old and 100 new, 353 unique; all 100 exact DB labels/IDs.`);
console.log(`PASS: 98 official numbering crosswalk + Gaucher/Pompe disease-specific sources. Individually linked: ${directlySourced}.`);
