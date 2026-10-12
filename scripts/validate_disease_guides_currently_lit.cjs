'use strict';
/** Regression for the publicly illuminated disease identities on 2026-10-11.
 * The three currently illuminated stars were not in the original 150 guides.
 * This checks source specificity and site integration, not a medical peer review.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const included=[
 ...[1,2].flatMap(i=>read(`content/disease_guides_top50_part${i}.json`).records),
 ...[1,2,3,4].flatMap(i=>read(`content/disease_guides_extra_0${i}.json`).records)
];
const novel=read('content/disease_guides_currently_lit_20261011.json').records;
const expected=new Map([
 ['nando-23-1','孤発性クロイツフェルト・ヤコブ病'],
 ['fabry-disease','ファブリー病'],
 ['nando-316-3','CACT欠損症']
]);
assert.equal(included.length,150);
assert.equal(novel.length,3);
assert.equal(expected.size,3);
const all=[...included,...novel];
assert.equal(new Set(all.map(x=>x.id)).size,153);
assert.equal(novel.filter(x=>expected.get(x.id)===x.name).length,3);
assert(novel.every(x=>x.reviewStatus==='official_disease_specific_sources_checked_editorial_draft'));
assert(novel.every(x=>x.reviewedAt==='2026-10-11'));
assert(novel.every(x=>x.references.length>=2));
const allowed=new Set(['www.nanbyou.or.jp','www.ncchd.go.jp','www.shouman.jp','www.ncbi.nlm.nih.gov','www.orpha.net']);
for(const row of novel){
 for(const key of ['overview','dailyLife','currentState']){
  assert(typeof row[key]==='string'&&row[key].length>=65,key+' too short: '+row.id);
  assert(row[key].length<600,key+' length too long: '+row.id);
 }
 for(const ref of row.references){
  const url=new URL(ref.url);
  assert.equal(url.protocol,'https:');
  assert(allowed.has(url.hostname),'untrusted source: '+url.hostname);
  assert(ref.verifiedSpecific===true,'requires a disease-specific primary source: '+row.id);
 }
 assert(row.verification.length>30,'missing source-specific review context');
}
const loader=fs.readFileSync(path.join(root,'content/disease-guides.js'),'utf8');
const scene=fs.readFileSync(path.join(root,'lab/scene.js'),'utf8');
const detail=fs.readFileSync(path.join(root,'disease/index.html'),'utf8');
assert(loader.includes('disease_guides_currently_lit_20261011.json'));
assert(loader.includes('map.size!==353'));
assert(scene.includes('if(guides && total>0)'));
assert(scene.includes('guides.get(selectedId)'));
assert(scene.includes("Number(starData.get(id)?.total)>0"));
assert(!detail.includes('医療専門家による個別監修は未実施です。'));
console.log('PASS: every lit disease at 2026-10-11 has a complete individually sourced guide.');
console.log('3 new article IDs:',novel.map(x=>x.id).join(', '));
console.log('153 unique total disease guides; all 3 live star CTA routes are eligible.');
