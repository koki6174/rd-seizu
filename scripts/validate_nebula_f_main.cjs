'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const production=read('lab/scene.js');
const preview=read('glow-preview/glow.js');
const home=read('index.html');
const previewHtml=read('glow-preview/index.html');

// Exact parameter parity matters: do not just make stars generally brighter.
const f=preview.match(/F:\{name:[^\n]+?layers:\[(.*?)\]\}/);
const main=production.match(/const NEBULA_F=\[([\s\S]*?)\];/);
assert(f,'Missing F comparator');
assert(main,'Missing F production preset');
const collect=str=>[...str.matchAll(/\{texture:'(soft|ring)',size:([\d.]+),opacity:([\d.]+)\}/g)]
 .map(m=>({texture:m[1],size:Number(m[2]),opacity:Number(m[3])}));
assert.deepEqual(collect(main[1]),collect(f[1]),'Production halo must equal preview F exactly');
assert.equal(collect(main[1]).length,3);

// Existing core sizes, unlit points and hit testing are intentionally untouched.
assert(production.includes("createCloud(points.unlit,'#4d5c73',.29,texture,.54,false)"));
assert(production.includes("createCloud(items,colors[type],.63,texture,.75)"));
assert(production.includes("createCloud(items,colors[type],.28,texture,1)"));
assert(production.includes("objects.filter(o=>o.userData.pickable)"));
assert(production.includes("Number(starData.get(id)?.total)>0"));
assert(production.includes("const haloTextures=mode==='taxonomy'?"));
assert(production.includes("createCloud(items,colors[type],layer.size,haloTextures[layer.texture],layer.opacity,false)"),
 'Halos must be non-pickable visual overlays');
assert(production.includes("if(haloTextures)for(const halo of Object.values(haloTextures))halo.dispose()"));
assert(production.includes("object.geometry.dispose();object.material.dispose()"));
assert(home.includes('src="./lab/scene.js?v=10"'),'Browser cache should load new scene');
assert(previewHtml.includes('本番の星図にはF案を採用しました'));
assert(!previewHtml.includes('本番の星図は変更していません'));
console.log('PASS: 3 exact F nebula layers are live only in taxonomy mode; unlit, hitboxes, core sprites, clinical research view and cleanup preserved.');
