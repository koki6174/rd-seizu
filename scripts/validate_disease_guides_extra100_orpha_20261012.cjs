'use strict';
// Editorial crosswalk and citation audit for 100 new standalone articles.
// This is a verifiable source/structural check, not an independent medical peer review.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const old=[
 ...[1,2].flatMap(i=>read(`content/disease_guides_top50_part${i}.json`).records),
 ...Array.from({length:12},(_,i)=>read(`content/disease_guides_extra_${String(i+1).padStart(2,'0')}.json`).records),
 ...read('content/disease_guides_currently_lit_20261011.json').records
];
const fresh=[13,14,15,16].flatMap(i=>read(`content/disease_guides_extra_${i}.json`).records);
const source=read('content/disease_guides_extra_13_16_catalog_snapshot.json').records;
assert.equal(old.length,353);
assert.equal(fresh.length,100);
assert.equal(source.length,100);
const index=new Map(source.map(x=>[x.id,x]));
assert.equal(index.size,100);
assert.equal(new Set([...old,...fresh].map(x=>x.id)).size,453,'Duplicate ID with existing guide');
const frequencies=new Set();
const allowed=/^(?!.*(?:必ず治る|治療で完治する|余命は\d+年|死亡率は\d+%)).+$/s;
let totalChars=0;
for(const [i,entry] of fresh.entries()){
 const original=source[i];
 assert(original,'Missing source at index '+i);
 assert.equal(entry.id,original.id);
 assert.equal(entry.name,original.name_ja,'Japanese catalog name mismatch '+entry.id);
 assert(Number.isInteger(original.orpha_code)&&original.orpha_code>0);
 assert(Array.isArray(original.hpo_examples)&&original.hpo_examples.length>0,'No disease-specific HPO evidence '+entry.id);
 assert.equal(entry.batch,13+Math.floor(i/25));
 assert.equal(entry.designation,null,'NANDO subtype may not claim independent MHLW designation');
 assert.equal(entry.reviewStatus,'official_orphanet_hpo_crosschecked_editorial_draft');
 assert.equal(entry.reviewedAt,'2026-10-12');
 const texts=['overview','dailyLife','currentState'].map(k=>entry[k]);
 for(const value of texts){
  assert(typeof value==='string'&&value.length>=35&&value.length<=450,'Guide too short/long '+entry.id);
  assert(allowed.test(value),'Unqualified misleading treatment claim '+entry.id);
  assert(!/[<>]/.test(value),'Raw HTML in medical text '+entry.id);
  totalChars+=value.length;
 }
 assert(new Set(texts).size===3,'Repeated section '+entry.id);
 assert(Array.isArray(entry.references)&&entry.references.length>=2);
 assert(entry.references.some(r=>r.url===`https://www.orpha.net/en/disease/detail/${original.orpha_code}`),'No disorder-specific Orphanet page '+entry.id);
 assert(entry.references.some(r=>r.url===`https://www.orpha.net/en/disease/sign/${original.orpha_code}`),'No disease-specific Orpha-HPO link '+entry.id);
 for(const ref of entry.references){
   const url=new URL(ref.url);
   assert(url.protocol==='https:'&&!url.username&&!url.password&&!url.port);
   assert(url.hostname==='www.orpha.net'||(
     url.hostname==='github.com'&&url.pathname==='/NanbyoData/nando/blob/master/data/nanbyo.json'
   ),'Unapproved reference '+ref.url);
   assert(!url.hash&&!url.search,'Suspicious URL extras');
 }
 const p=entry.overview+entry.dailyLife+entry.currentState;
 for(const prohibited of ['個別監修は未実施','無条件に治療','100%治癒'])
  assert(!p.includes(prohibited),'Unwanted boilerplate/unsupported absolute '+entry.id);
 frequencies.add(entry.batch);
}
assert.deepEqual([...frequencies].sort(),[13,14,15,16]);
const loader=fs.readFileSync(path.join(root,'content/disease-guides.js'),'utf8');
assert(loader.includes('map.size!==453'));
for(const i of [13,14,15,16])assert(loader.includes(`disease_guides_extra_${i}.json`));
for(const file of ['index.html','disease/index.html']){
 assert(fs.readFileSync(path.join(root,file),'utf8').includes('disease-guides.js?v=5'));
}
const scene=fs.readFileSync(path.join(root,'lab/scene.js'),'utf8');
assert(scene.includes('if(guides && total>0)'), 'Dark stars must not reveal their disease names');
console.log(`PASS: ${old.length} existing and ${fresh.length} new = 453 unique disease detail articles.`);
console.log(`PASS: ${source.length} disease names and ORPHA IDs grounded in catalog and HPO-source snapshot.`);
console.log(`PASS: individualized 3-section text (${totalChars} characters) and direct official ORPHA/phenotype references.`);
console.log('CAUTION: This is an editorial draft/source consistency audit, not independent medical fact-check by a clinician.');
