'use strict';
// 2026-10-12: Verify extra 100 source-linked editorial guides beyond 453.
// This validates identity, structure and reference provenance, NOT an independent medical peer review.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const existing=[
 ...[1,2].flatMap(i=>read(`content/disease_guides_top50_part${i}.json`).records),
 ...Array.from({length:12},(_,i)=>i+1).flatMap(i=>read(`content/disease_guides_extra_${String(i).padStart(2,'0')}.json`).records),
 ...read('content/disease_guides_currently_lit_20261011.json').records,
 ...[1,2,3,4].flatMap(i=>read(`content/disease_guides_orpha_0${i}.json`).records)
];
const added=[5,6,7,8].flatMap(i=>read(`content/disease_guides_orpha_0${i}.json`).records);
const crosswalk=read('content/disease_guides_orpha_next100_candidates_20261012.json').selected;
const all=[...existing,...added];
assert.equal(existing.length,453);
assert.equal(added.length,100);
assert.equal(crosswalk.length,100);
assert.equal(all.length,553);
assert.equal(new Set(all.map(x=>x.id)).size,553,'There is a duplicate article ID');
assert.equal(new Set(added.map(x=>x.orphaCode)).size,100,'Check duplicated ORPHA code');
assert.equal(new Set(crosswalk.map(x=>x.id)).size,100);
assert.equal(crosswalk.filter(x=>x.requires_concept_review).length,16);
let unapproved=0,chars=0;
for(const [i,r] of added.entries()){
 const c=crosswalk[i];
 assert.equal(r.id,c.id,'Wrong disease ID/index');
 assert.equal(r.name,c.name_ja,'Exact Japanese catalog name must match');
 assert.equal(r.orphaCode,c.orpha_code,'ORPHA code mapping mismatch');
 assert.equal(r.evidenceHpoCount,c.hpo_n,'HPO evidence count mismatch');
 assert.equal(r.conceptReviewRequired,c.requires_concept_review,'Preserve manual identity review flag');
 assert.equal(r.sourceMappingStatus,c.source_link_status,'Do not upgrade clinical identity to approved');
 assert.equal(r.reviewStatus,'orphanet_source_linked_editorial_draft');
 assert.equal(r.reviewedAt,'2026-10-12');
 assert(r.evidenceHpoCount>0);
 if(r.conceptReviewRequired){unapproved++;assert.equal(r.sourceMappingStatus,'pending');}
 for(const field of ['overview','dailyLife','currentState']){
  assert(typeof r[field]==='string'&&r[field].trim().length>=35&&r[field].length<500,'Missing or short '+field+' for '+r.id);
  chars+=r[field].length;
 }
 assert.equal(r.references.length,2);
 const urls=r.references.map(x=>new URL(x.url));
 for(const url of urls){
  assert.equal(url.hostname,'www.orpha.net');
  assert.equal(url.protocol,'https:');
  assert(!url.port&&!url.username&&!url.password&&!url.hash);
 }
 assert.equal(urls[0].pathname,'/en/disease/detail/'+r.orphaCode);
 assert.equal(urls[1].pathname,'/en/disease/sign/'+r.orphaCode);
 assert(!/(必ず治る|余命は\d+|生存率は\d+|治癒率100%)/.test(r.overview+r.dailyLife+r.currentState));
}
assert.equal(unapproved,16);
const loader=fs.readFileSync(path.join(root,'content/disease-guides.js'),'utf8');
for(let i=5;i<=8;i++)assert(loader.includes(`disease_guides_orpha_0${i}.json`));
assert(loader.includes('map.size!==653'));
for(const p of ['index.html','disease/index.html']){
 const markup=fs.readFileSync(path.join(root,p),'utf8');
 assert(markup.includes('disease-guides.js?v=7'));
}
const scene=fs.readFileSync(path.join(root,'lab/scene.js'),'utf8');
assert(scene.includes('if(guides && total>0)'));
assert(scene.includes('objects.filter(o=>o.userData.pickable)'));
assert(scene.includes("Number(starData.get(id)?.total)>0"));
console.log(`PASS 453 existing + 100 new = 553 unique articles, ${chars} Unicode text characters`);
console.log('PASS ORPHA source URLs, 84 exact-name candidates + 16 pending-concept-review pairs (NO automatic approval)');
console.log('PASS previous click restrictions, home/deep-link integration, disclaimer and script version');
