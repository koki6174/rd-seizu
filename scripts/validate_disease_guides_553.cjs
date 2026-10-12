'use strict';
/* Regression and source-identity audit for 453 existing plus 100 new editorial guides.
 * This is not independent medical peer review and does not verify treatment claims.
 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const old=[
 ...[1,2].flatMap(i=>read(`content/disease_guides_top50_part${i}.json`).records),
 ...Array.from({length:12},(_,i)=>i+1).flatMap(i=>
  read(`content/disease_guides_extra_${String(i).padStart(2,'0')}.json`).records),
 ...read('content/disease_guides_currently_lit_20261011.json').records,
 ...[1,2,3,4].flatMap(i=>read(`content/disease_guides_orpha_0${i}.json`).records)
];
const added=[1,2,3,4].flatMap(i=>
 read(`content/disease_guides_researched_0${i}.json`).records);
const cross=read('content/disease_guides_researched_catalog_20261012.json').records;
assert.equal(old.length,453);
assert.equal(added.length,100);
assert.deepEqual([1,2,3,4].map(i=>read(`content/disease_guides_researched_0${i}.json`).records.length),
 [24,24,24,28]);
assert.equal(cross.length,100);
assert.equal(new Set(old.map(x=>x.id)).size,453);
assert.equal(new Set(added.map(x=>x.id)).size,100);
assert.equal(new Set([...old,...added].map(x=>x.id)).size,553);
assert.equal(new Set(cross.map(x=>x.id)).size,100);
const byId=new Map(cross.map(x=>[x.id,x]));
let orphaCrosschecked=0, categoryCited=0;
for(const row of added){
 const matching=byId.get(row.id);
 assert(matching,`missing official disease crosswalk: ${row.id}`);
 assert.equal(row.name,matching.name_ja,'Mismatch official Japanese disease label: '+row.id);
 assert.equal(row.reviewedAt,'2026-10-12');
 assert(!row.selectionIndex,'Selection order must not be exposed in public guide data');
 assert(!('rank' in row),'Internal ordering must not be exposed');
 assert(/^source_category_crosschecked_editorial_draft$|^orpha_identity_crosschecked_editorial_draft$|^official_orpha_disease_name_editorial_draft$/.test(row.reviewStatus));
 for(const field of ['overview','dailyLife','currentState']){
  const body=row[field];
  assert(typeof body==='string'&&body.length>=35&&body.length<=500,`bad ${field}: ${row.id}`);
  assert(!/完治が保証|必ず治る|生存率は\\d+%|余命は\\d+年/.test(body),`unsupported categorical prognosis: ${row.id}`);
  assert(!/<script|javascript:/i.test(body),`injected article: ${row.id}`);
 }
 assert(row.references.length>=2,'Too few official references: '+row.id);
 let clinicalPage=false,sourceTree=false;
 for(const cite of row.references){
  const u=new URL(cite.url);
  assert.equal(u.protocol,'https:');
  assert(!u.username&&!u.password&&!u.port&&!u.hash,'invalid official source');
  const allowed=u.hostname==='www.orpha.net'&&/^\\/en\\/disease\\/(detail|sign)\\/\\d+$/.test(u.pathname)
   ||u.hostname==='www.nanbyou.or.jp'&&u.pathname.startsWith('/entry/')
   ||u.hostname==='github.com'&&u.pathname==='/NanbyoData/nando/blob/master/data/nanbyo.json';
  assert(allowed,'unapproved reference '+cite.url);
  clinicalPage ||= u.hostname==='www.orpha.net'&&u.pathname.startsWith('/en/disease/detail/');
  sourceTree ||= u.hostname==='github.com';
 }
 if(row.reviewStatus==='source_category_crosschecked_editorial_draft'){
  categoryCited++;
  assert(sourceTree,'NANDO category evidence absent: '+row.id);
 }else{
  orphaCrosschecked++;
  assert(clinicalPage,'individual ORPHA disease source absent: '+row.id);
  if(matching.orpha_code){
   assert(row.references.some(r=>r.url===`https://www.orpha.net/en/disease/detail/${matching.orpha_code}`),
    'Unmatched ORPHAcode in disease-specific source '+row.id);
  }
 }
}
assert.equal(categoryCited,72);
assert.equal(orphaCrosschecked,28);
const loader=fs.readFileSync(path.join(root,'content/disease-guides.js'),'utf8');
assert(loader.includes('map.size!==553'),'Loader expected count must be updated');
for(let i=1;i<=4;i++){
 assert(loader.includes(`disease_guides_researched_0${i}.json`));
}
for(const page of ['index.html','disease/index.html']){
 assert(fs.readFileSync(path.join(root,page),'utf8').includes('disease-guides.js?v=6'));
}
const articles=fs.readFileSync(path.join(root,'disease/disease.js'),'utf8');
assert(articles.includes("url.pathname==='/NanbyoData/nando/blob/master/data/nanbyo.json'"));
assert(!fs.readFileSync(path.join(root,'disease/index.html'),'utf8').includes('医療専門家による個別監修は未実施です。'));
console.log('PASS: 453 original and 100 new unique articles = 553 total');
console.log('PASS: all 100 official catalog IDs and Japanese names; 72 category-scoped and 28 ORPHA-linked');
console.log('PASS: source URL/domain validation; editorial status and medical disclaimer preserved');
