'use strict';
/** Validate third 100-guide expansion: exact DB identity, no overlap with
 * existing 353 entries, source scope, editorial completeness, UI wiring.
 * This is a provenance/schema check, not independent medical peer review.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const old=[
 ...[1,2].flatMap(i=>read(`content/disease_guides_top50_part${i}.json`).records),
 ...[1,2,3,4,5,6,7,8,9,10,11,12].flatMap(i=>
  read(`content/disease_guides_extra_${String(i).padStart(2,'0')}.json`).records),
 ...read('content/disease_guides_currently_lit_20261011.json').records
];
const fresh=[13,14,15,16].flatMap(i=>
 read(`content/disease_guides_extra_${i}.json`).records);
const snapshot=read('content/disease_guides_extra_20261012_batch3_catalog_snapshot.json');
const byId=new Map(snapshot.records.map(x=>[x.id,x]));
assert.equal(old.length,353,'baseline changed');
assert.equal(new Set(old.map(x=>x.id)).size,353,'old duplicate');
assert.equal(fresh.length,100,'expected exactly 100 additional guides');
assert.equal(byId.size,100,'crosswalk must contain exactly 100 IDs');
const all=[...old,...fresh];
assert.equal(new Set(all.map(x=>x.id)).size,453,'previous disease guide overwritten/duplicated');
const groups=new Set();
let typed=0;
for(let i=0;i<fresh.length;i++){
 const x=fresh[i],canonical=byId.get(x.id);
 assert(canonical && canonical.published===true,'missing published DB record '+x.id);
 assert.equal(x.name,canonical.name_ja,'Japanese name mismatch '+x.id);
 assert.equal(canonical.selectionIndex,i+1);
 assert.equal(x.batch,13+Math.floor(i/25));
 assert.equal(x.selectionIndex,i+1);
 assert.equal(x.reviewStatus,'editorial_draft_source_reviewed_not_clinically_signed_off');
 assert.equal(x.reviewedAt,'2026-10-12');
 assert(typeof x.sourceScope==='string'&&x.sourceScope.length>30);
 for(const field of ['overview','dailyLife','currentState']){
  assert(typeof x[field]==='string'&&x[field].length>=35,'incomplete '+field+' '+x.id);
  assert(x[field].length<=550,'overlong unedited text '+field+' '+x.id);
 }
 assert(Array.isArray(x.references)&&x.references.length>=2,'missing references');
 assert(x.references.some(r=>new URL(r.url).hostname==='www.nanbyou.or.jp'),
   'disease-group source is required');
 assert(x.references.some(r=>new URL(r.url).hostname==='github.com'),
   'subtype taxonomy source is required');
 for(const ref of x.references){
  const u=new URL(ref.url);
  assert.equal(u.protocol,'https:');
  assert(['github.com','www.nanbyou.or.jp'].includes(u.hostname),'nonofficial source: '+u.hostname);
 }
 assert(!/余命は.?\d+年|生存率.?\d+|必ず治る|確実に治る|誰でも治る/.test(
  x.overview+x.dailyLife+x.currentState));
 if(canonical.parent_disease_id)groups.add(canonical.parent_disease_id);
 if(canonical.concept_kind==='disease_subtype')typed++;
}
assert(groups.size>=10,'Insufficient subtype category diversity');
assert(typed>=95,'Mostly concrete disease subtypes were expected');
const loader=fs.readFileSync(path.join(root,'content/disease-guides.js'),'utf8');
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
const detail=fs.readFileSync(path.join(root,'disease/index.html'),'utf8');
const scene=fs.readFileSync(path.join(root,'lab/scene.js'),'utf8');
for(const number of [13,14,15,16])
 assert(loader.includes(`disease_guides_extra_${number}.json`));
assert(loader.includes('map.size!==453'),'loader total guard');
for(const html of [home,detail])assert(html.includes('disease-guides.js?v=5'));
assert(scene.includes('if(guides && total>0)'),'lit-only disease guide availability');
assert(scene.includes('objects.filter(o=>o.userData.pickable)'),'unlit stars remain noninteractive');
assert(scene.includes('const NEBULA_F='),'previous selected F glow preserved');
console.log('PASS: 353 prior + 100 new => 453 unique guides, no missing DB identity.');
console.log('PASS: '+groups.size+' parent disease groups covered; '+typed+' labeled subtypes.');
