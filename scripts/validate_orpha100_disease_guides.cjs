'use strict';
const fs=require('node:fs'),path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const old=[
 'content/disease_guides_top50_part1.json',
 'content/disease_guides_top50_part2.json',
 'content/disease_guides_currently_lit_20261011.json',
 ...Array.from({length:12},(_,i)=>`content/disease_guides_extra_${String(i+1).padStart(2,'0')}.json`)
].flatMap(p=>read(p).records);
const newFiles=Array.from({length:5},(_,i)=>`content/disease_guides_orpha100_part${i+1}.json`);
const guides=newFiles.flatMap(p=>read(p).records);
const source=read('content/disease_guides_orpha100_evidence_snapshot.json').records;
const allowed=new Set(['www.orpha.net','sciences.orphadata.com','www.nanbyou.or.jp']);
assert.equal(old.length,353,'Unexpected previous guide count');
assert.equal(guides.length,100,'Exactly 100 guides must be added');
assert.equal(source.length,100,'Source snapshot must contain exactly 100 entries');
assert.equal(new Set([...old,...guides].map(r=>r.id)).size,453,'Duplicate disease ID');
assert.equal(new Set(guides.map(r=>r.orpha_code)).size,100);
for(const [index,record] of guides.entries()){
 const proof=source[index];
 assert.equal(record.id,proof.id,'Unmatched research disease ID');
 assert.equal(record.name,proof.name,'Source name mismatch: '+record.id);
 assert.equal(record.orpha_code,proof.orpha_code,'ORPHA identifier mismatch');
 assert.equal(record.hpo_term_count,proof.hpo_term_count,'Changed phenotype evidence');
 assert(record.hpo_term_count>=20,'At least 20 HPO source annotations required');
 assert(record.symptoms.length>0,'Missing published HPO evidence');
 assert.equal(record.reviewedAt,'2026-10-12');
 assert.equal(record.reviewStatus,'research_source_corroborated_editorial_draft');
 assert.equal(record.identityCrosswalkStatus,'source_corroborated_research_only_not_clinician_reviewed');
 for(const field of ['overview','dailyLife','currentState']){
  assert(typeof record[field]==='string'&&record[field].length>=45,
     'Incomplete patient-facing section: '+record.id+' '+field);
  assert(record[field].length<=550,'Unexpectedly long section');
 }
 assert(record.references.length>=2,'Sources absent');
 assert.equal(record.references[0].url,
   `https://www.orpha.net/en/disease/detail/${record.orpha_code}`);
 assert.equal(record.references[0].verifiedSpecific,false,'Webpage access not independently verified');
 for(const ref of record.references){
  const u=new URL(ref.url);
  assert(u.protocol==='https:'&&allowed.has(u.hostname)&&!u.username&&!u.password&&!u.port);
 }
 assert(!/絶対に治る|必ず治る|生存率.?100%|余命は\d+年/.test(
   record.overview+record.dailyLife+record.currentState));
}
const script=fs.readFileSync(path.join(root,'content/disease-guides.js'),'utf8');
for(let n=1;n<=5;n++)assert(script.includes(`disease_guides_orpha100_part${n}.json`));
assert(script.includes('map.size!==453'));
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
const detail=fs.readFileSync(path.join(root,'disease/index.html'),'utf8');
const view=fs.readFileSync(path.join(root,'disease/disease.js'),'utf8');
const star=fs.readFileSync(path.join(root,'lab/scene.js'),'utf8');
assert(home.includes('content/disease-guides.js?v=5'));
assert(detail.includes('content/disease-guides.js?v=5'));
assert(detail.includes('guide-review-date'));
assert(!detail.includes('医療専門家による個別監修は未実施'));
assert(detail.includes('病状や治療は一人ひとり異なる'));
assert(view.includes("record.reviewedAt.split('-')"));
assert(view.includes('approvedHosts'));
assert(view.includes('textContent=record.overview'));
assert(star.includes('if(guides && total>0)'));
assert(star.includes("Number(starData.get(id)?.total)>0"));
const chars=guides.reduce((n,r)=>n+r.overview.length+r.dailyLife.length+r.currentState.length,0);
console.log('PASS: 453 distinct sourced disease guides, 100 new with 1:1 NANDO/ORPHA identity, HPO evidence and no public unlit star disclosure');
console.log('New disease article paragraphs: '+chars+' Japanese Unicode characters');
