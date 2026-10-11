'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const html=read('glow-preview/index.html'),js=read('glow-preview/glow.js');
const home=read('index.html'),production=read('lab/scene.js');
assert(html.includes('name="robots" content="noindex,nofollow,noarchive"'));
assert(html.includes('../config.js'));
assert(html.includes('three@0.180.0'));
for(const id of ['compare-grid','dataset-status','distance','return-grid','copy-selection']){
 assert(html.includes('id="'+id+'"'),'missing '+id);
}
for(const letter of ['A','B','C','D','E','F']){
 assert(html.includes('data-profile="'+letter+'"'),'missing compare view '+letter);
 assert(html.includes('data-focus="'+letter+'"'),'missing focus '+letter);
 assert(js.includes(letter+':{'),'missing rendering profile '+letter);
}
assert(js.includes("client.rpc('get_constellation_positions')"));
assert(js.includes("client.rpc('get_public_stars')"));
assert(js.includes("coords.length!==1241"));
assert(js.includes('renderer.setScissorTest(true)'), 'all panels must use the same WebGL context');
assert(js.includes('const geos=Object.fromEntries'), 'reuse point geometry');
assert(js.includes("addCloud(scene,geos.unlit,'#4d5c73',.29,.54,'core')"));
assert(js.includes("addCloud(scene,geos[type],palette[type],.63,.75,'core')"));
assert(js.includes("addCloud(scene,geos[type],palette[type],.28,1,'core')"));
assert(js.includes('setDistance('));
assert(js.includes('focusProfile('));
for(const unsafe of [/\bclient\.rpc\(['"]submit_star/,/\bclient\.rpc\(['"]suggest_missing_disease/,/\bclient\.rpc\(['"]get_private_clinical_positions/]){
 assert(!unsafe.test(js),'Preview must not mutate site or expose private research dataset');
}
assert(!/\.(?:innerHTML|outerHTML)\s*=/.test(js));
assert(!/href=["'](?:\.\/)?glow-preview\//.test(home),'Do not expose preview link on public homepage');
assert(production.includes("createCloud(items,colors[type],.63,texture,.75);"));
assert(production.includes("createCloud(items,colors[type],.28,texture,1);"));
assert(production.includes('objects.filter(o=>o.userData.pickable)'));
console.log('PASS: six public-data-only synchronized glow profiles, fixed star core and untouched homepage.');
