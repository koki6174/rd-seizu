'use strict';
// Regression test: published guide totals can change without editing a fixed count.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const loader=fs.readFileSync(path.join(__dirname,'../content/disease-guides.js'),'utf8');
const files=[...loader.matchAll(/'([^']+\.json)'/g)].map(x=>x[1]);
assert(files.length>0,'The guide file registry must not be empty');
assert.equal(new Set(files).size,files.length,'The guide file registry has duplicate filenames');
assert(!/map\.size\s*!==\s*\d+/.test(loader),'The loader has a hardcoded article count');

const makeRecord=id=>({
 id, overview:'この疾患の概要と主な症状を、一般向けに簡潔で正確な文章として解説しています。',
 dailyLife:'日常生活で考慮することや、支援が役立つ場面について一般向けに説明しています。',
 currentState:'医療機関で実施される診療の概要と研究の状況について一般向けに説明しています。',
 references:[{title:'Official source',url:'https://www.nanbyou.or.jp/entry/62'}]
});

async function loadFrom(batches){
 const window={};
 const fetch=async url=>{
  const filename=new URL(url).pathname.split('/').pop();
  if(!batches.has(filename))return {ok:false};
  return {ok:true,json:async()=>({records:batches.get(filename)})};
 };
 vm.runInNewContext(loader,{window,fetch,URL,document:{currentScript:{src:'https://example.test/rd-seizu/content/disease-guides.js'}}});
 return window.NENONE_DISEASE_GUIDES.load();
}

async function main(){
 const baseline=new Map(files.map((file,i)=>[file,[makeRecord('guide-'+i)]]));
 assert.equal((await loadFrom(baseline)).size,files.length);

 const expanded=new Map([...baseline].map(([file,records])=>[file,[...records]]));
 expanded.get(files[0]).push(makeRecord('guide-added'));
 assert.equal((await loadFrom(expanded)).size,files.length+1,'New articles must not require a hardcoded count change');

 const duplicate=new Map([...expanded].map(([file,records])=>[file,[...records]]));
 duplicate.get(files[0]).push(makeRecord('guide-1'));
 await assert.rejects(loadFrom(duplicate),/Duplicate or invalid disease ID/);

 const empty=new Map([...baseline].map(([file,records])=>[file,[...records]]));
 empty.set(files[0],[]);
 await assert.rejects(loadFrom(empty),/Empty or malformed disease guide/);

 const missing=new Map(baseline);
 missing.delete(files[0]);
 await assert.rejects(loadFrom(missing),/Guide source unavailable/);

 const incomplete=new Map([...baseline].map(([file,records])=>[file,[...records]]));
 incomplete.set(files[0],[{...makeRecord('guide-0'),overview:'short'}]);
 await assert.rejects(loadFrom(incomplete),/Incomplete editorial guide/);
 console.log('PASS: dynamic count, new guide, duplicate ID, empty/missing file, incomplete content');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
