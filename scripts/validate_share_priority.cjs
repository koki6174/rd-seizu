'use strict';
// Public display priority: a share vote always colors a lit star orange,
// including when both share and discover votes exist.
// Counts are never rewritten by the display rule.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const main=read('lab/scene.js');
const archive=read('weekly/weekly-scene.js');
const preview=read('glow-preview/glow.js');
const home=read('index.html');
const app=read('admin/app.js');

const mainChoice="const kind=total===0?'unlit':Number(d.shared)>0?'share':'discover'";
const archiveChoice="const kind=shared>0?'share':'discover'";
assert(main.includes(mainChoice),'Main scene does not give share priority');
assert(archive.includes(archiveChoice),'Historical scene does not give share priority');
assert(preview.includes("else if(p.shared>0)groups.share.push(p)"),'Preview does not give share priority');
for(const [name,src] of [['main',main],['archive',archive],['preview',preview]]) {
 assert(!src.includes("'mixed'"),name+' still assigns a mixed color');
 assert(!src.includes("mixed:'#dcb6ff'"),name+' still uses a mixed palette');
}
assert(app.includes("return safeNumber(star.shared) ? 'share' : 'discover'"),
 'Fallback CSS star colors do not give orange share priority');
assert(main.includes("const colors={share:'#ffc6ad',discover:'#99e4ff'}"));
assert(archive.includes("const colors={share:'#ffc6ad',discover:'#99e4ff'}"));

const contextualID='id="preset-contextual"';
assert(home.includes(contextualID),'Contextual preset missing from form');
assert(app.includes("const isShare=state.kind==='share';"),'No pathway distinction');
assert(app.includes("contextualPreset.dataset.preset=isShare"));
assert(app.includes("'この病気への理解や配慮が広がってほしい'"),
 'Share preset is missing its distinct text');
assert(app.includes("'知るきっかけになりました'"),
 'Discover preset must retain its original text');
assert(app.includes("contextualPreset.textContent=isShare?'理解・配慮を願う':'知るきっかけに'"),
 'Share/discover option labels must differ');
assert(home.includes('./admin/app.js?v=8'));
assert(home.includes('./lab/scene.js?v=10'));
assert(read('weekly/index.html').includes('./weekly-scene.js?v=3'));
assert(read('glow-preview/index.html').includes('./glow.js?v=2'));

const visual=(shared,discovered)=>{
 const total=shared+discovered;
 return total===0?'unlit':shared>0?'share':'discover';
};
for(const [share,discover,expected] of [
 [0,0,'unlit'],[1,0,'share'],[0,1,'discover'],[1,1,'share'],
 [0,5,'discover'],[1,5,'share'],[5,1,'share']
])assert.equal(visual(share,discover),expected);
console.log('PASS: share over discover in main, archive, preview and fallback.');
console.log('PASS: path-specific fourth preset and cached asset revisions.');
