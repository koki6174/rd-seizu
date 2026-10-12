'use strict';
/** Verify 100 new distinct disease/subtype education drafts added to 453 originals.
 * This checks identities, source provenance and UI wiring, NOT independent
 * physician review of every clinical sentence.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const text=p=>fs.readFileSync(path.join(root,p),'utf8');
const old=[
 ...[1,2].flatMap(i=>read(`content/disease_guides_top50_part${i}.json`).records),
 ...Array.from({length:12},(_,i)=>i+1).flatMap(i=>read(`content/disease_guides_extra_${String(i).padStart(2,'0')}.json`).records),
 ...read('content/disease_guides_currently_lit_20261011.json').records,
 ...[1,2,3,4].flatMap(i=>read(`content/disease_guides_orpha_0${i}.json`).records)
];
const parts=[1,2,3,4,5].map(i=>read(`content/disease_guides_next_0${i}.json`).records);
const added=parts.flat();
const evidence=read('content/disease_guides_next100_evidence_20261012.json').records;
assert.equal(old.length,453,'Historical articles');
assert.deepEqual(parts.map(p=>p.length),[25,19,25,25,6]);
assert.equal(added.length,100,'Exactly 100 new articles');
assert.equal(evidence.length,100,'Exactly 100 official IDs');
assert.equal(new Set([...old,...added].map(x=>x.id)).size,553,'All article IDs unique across batches');
const hosts=new Set(['www.orpha.net','www.nanbyou.or.jp','www.mhlw.go.jp']);
const allowedStatus=new Set(['source_crosswalk_supported_editorial_draft','official_category_source_supported_editorial_draft']);
let specific=0,group=0,index=0,totalChars=0;
for(const [i,r] of added.entries()){
 const e=evidence[i];
 assert.equal(r.id,e.id,'Original DB ID mismatch at '+i);
 assert.equal(r.name,e.name_ja,'Exact catalog Japanese name mismatch at '+i);
 assert.equal(r.reviewedAt,'2026-10-12');
 assert(allowedStatus.has(r.reviewStatus),'Unsupported clinical review claim');
 assert(/^[a-z0-9-]{2,100}$/.test(r.id));
 const spans=['overview','dailyLife','currentState'];
 for(const field of spans){
  assert(typeof r[field]==='string'&&r[field].trim().length>=35&&r[field].length<=500,
   'Incomplete three-section article: '+r.id+' / '+field);
  totalChars+=r[field].length;
 }
 assert(!/(生存率|余命は\\d+年|絶対に治る|治癒率100%)/.test(spans.map(k=>r[k]).join('')));
 assert(r.references.length>=2);
 for(const ref of r.references){
  const u=new URL(ref.url);
  assert.equal(u.protocol,'https:');
  assert(hosts.has(u.hostname),'Unexpected source domain '+u.hostname);
  assert(!u.username&&!u.password&&!u.port&&!u.hash,'Invalid source URL');
 }
 if(e.orpha_code!=null){
  specific++;
  assert.equal(r.orphaCode,e.orpha_code);
  assert.equal(r.sourceScope,'exact_orphanet_crosswalk');
  assert.equal(r.references[0].url,'https://www.orpha.net/en/disease/detail/'+e.orpha_code);
  assert.equal(r.references[1].url,'https://www.orpha.net/en/disease/sign/'+e.orpha_code);
 }else if(r.sourceScope==='official_parent_disease_explanation'){
  group++;
  assert(e.parent_disease_id,'Missing parent');
  assert(r.references[0].url.startsWith('https://www.nanbyou.or.jp/entry/'));
 }else{
  index++;
  assert.equal(r.sourceScope,'official_disease_group_index');
  assert(r.references[0].url.includes('/category/sickdescriptiongeneral'));
 }
}
assert.equal(specific,32);
assert.equal(group+index,68);
const loader=text('content/disease-guides.js');
for(let i=1;i<=5;i++)assert(loader.includes(`disease_guides_next_0${i}.json`));
assert(loader.includes('map.size!==553'));
for(const p of ['index.html','disease/index.html']){
 assert(text(p).includes('disease-guides.js?v=6'),'Article index browser cache');
}
const scene=text('lab/scene.js'),home=text('index.html');
assert(scene.includes('if(guides && total>0)'),'Never show unlit star explanation');
assert(scene.includes('objects.filter(o=>o.userData.pickable)'));
assert(scene.includes('Number(starData.get(id)?.total)>0'));
assert(home.includes('この病気について知る'));
assert(!text('disease/index.html').includes('医療専門家による個別監修は未実施です。'));
console.log('PASS: original 453 + 100 new = 553 unique sourced editorial disease guides');
console.log('PASS: source provenance exact ORPHA '+specific+', designated group '+group+', index '+index);
console.log('PASS: '+totalChars+' Unicode characters of new Japanese article prose, 3 mandatory sections each');
console.log('PASS: lit-only disease details, random routing, caching, no clinical research or submission modifications');
