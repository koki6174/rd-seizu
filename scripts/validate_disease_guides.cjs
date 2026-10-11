'use strict';
/** Offline validation of the 50 source-linked disease descriptions and UI wiring.
 * Reads editorial snapshots only; no healthcare advice is inferred from missing data.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const paths=[1,2].map(n=>path.join(root,'content',`disease_guides_top50_part${n}.json`));
const list=paths.flatMap(path=>JSON.parse(fs.readFileSync(path,'utf8')).records);
const expected=[
'mhlw-0097','mhlw-0006','mhlw-0049','mhlw-0096','mhlw-0306','mhlw-0069',
'mhlw-0011','mhlw-0050','systemic-sclerosis','mhlw-0018','mhlw-0013','mhlw-0085',
'mhlw-0053','mhlw-0090','mhlw-0078','mhlw-0071','mhlw-0057','mhlw-0063',
'mhlw-0084','primary-biliary-cholangitis','mhlw-0066','mhlw-0056','mhlw-0222',
'mhlw-0022','mhlw-0067','mhlw-0005','mhlw-0043','mhlw-0052','mhlw-0017',
'als','mhlw-0045','mhlw-0060','mhlw-0028','mhlw-0095','mhlw-0068',
'mhlw-0113','mhlw-0088','mhlw-0271','mhlw-0014','mhlw-0054',
'pulmonary-arterial-hypertension','mhlw-0040','mhlw-0070','mhlw-0046',
'mhlw-0300','mhlw-0058','mhlw-0007','mhlw-0077','mhlw-0162','mhlw-0034'];
assert.equal(list.length,50);
assert.equal(new Set(list.map(x=>x.id)).size,50);
assert.equal(new Set(list.map(x=>x.rank)).size,50);
for(const [i,x] of list.entries()){
 assert.equal(x.rank,i+1,`rank at ${i}`);
 assert.equal(x.id,expected[i],`database discovery ID for rank ${i+1}`);
 assert(typeof x.name==='string'&&x.name.length>2);
 assert(['overview','dailyLife','currentState'].every(field=>
    typeof x[field]==='string'&&x[field].trim().length>=35&&x[field].trim().length<=450),
    'complete original description: '+x.id);
 assert(x.reviewStatus==='official_sources_checked_editorial_draft');
 assert(x.reviewedAt==='2026-10-11');
 assert.equal(x.references.length,2);
 assert(x.references.some(r=>r.url==='https://www.mhlw.go.jp/stf/newpage_53881.html'));
 for(const ref of x.references){
  const url=new URL(ref.url);
  assert.equal(url.protocol,'https:');
  assert(['www.nanbyou.or.jp','www.mhlw.go.jp'].includes(url.hostname),
     'Only validated official source URLs: '+ref.url);
 }
 assert(!/生存率|余命は\d+年|絶対に治る|必ず発症/.test(x.overview+x.dailyLife+x.currentState));
}
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
const app=fs.readFileSync(path.join(root,'admin/app.js'),'utf8');
const scene=fs.readFileSync(path.join(root,'lab/scene.js'),'utf8');
const article=fs.readFileSync(path.join(root,'disease/index.html'),'utf8');
const articleJs=fs.readFileSync(path.join(root,'disease/disease.js'),'utf8');
const lib=fs.readFileSync(path.join(root,'content/disease-guides.js'),'utf8');
for(const id of ['read-disease-detail','info-overview','read-auto-disease','auto-disease-summary']){
 assert(home.includes(`id="${id}"`),'home missing '+id);
}
assert(home.includes('./content/disease-guides.js'));
assert(home.includes('./disease-guides-ui.css'));
assert(scene.includes('if(guides && total>0)'), 'unlit stars must never show disease text');
assert(scene.includes("Number(starData.get(id)?.total)>0"), 'original unlit click guard must remain');
assert(app.includes("client.rpc('pick_discovery_disease'"),'preserve original random RPC');
assert(app.includes("const record=guides?await guides.get(choice.id):null"));
assert(article.includes('id="disease-sources"')&&!article.includes('医療専門家による個別監修は未実施'));
assert(articleJs.includes("source.url")&&articleJs.includes("document.title"));
assert(lib.includes("map.size!==150"));
console.log('PASS: 50 rank-matched source-checked editorial drafts and both shared links');
console.log('Number of articles:',list.length,'number of disease-specific Nanbyou source pages:',
 list.filter(x=>x.references[0].verifiedSpecific).length);
