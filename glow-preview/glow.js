import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

// A stand-alone, read-only preview: no submission RPCs, private research
// coordinates, participant tokens, or modifications to the live exhibition.
const $=id=>document.getElementById(id);
const config=window.NENONE_CONFIG||{};
const stage=$('compare-stage');
const grid=$('compare-grid');
const panels=[...document.querySelectorAll('.compare-panel')];
const status=$('dataset-status');
const message=$('canvas-message');
const profiles={
 A:{name:'変更前の光り方',layers:[]},
 B:{name:'やわらかな余光',layers:[{texture:'soft',size:1.5,opacity:.35}]},
 C:{name:'くっきりと輝く',layers:[{texture:'soft',size:1.1,opacity:.68},{texture:'soft',size:1.9,opacity:.18}]},
 D:{name:'遠くまで届く光',layers:[{texture:'soft',size:2.9,opacity:.40},{texture:'soft',size:1.6,opacity:.18}]},
 E:{name:'二重の光輪',layers:[{texture:'soft',size:1.45,opacity:.36},{texture:'ring',size:2.4,opacity:.45}]},
 F:{name:'星雲のような光（本番採用）',layers:[{texture:'soft',size:4.1,opacity:.29},{texture:'soft',size:2.25,opacity:.31},{texture:'ring',size:3.3,opacity:.16}]}
};
const palette={share:'#ffc6ad',discover:'#99e4ff'};
const preferReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer,sceneList={},camera,controls,observer,visibilityObserver;
let geometries=[],materials=[],textures={};
let focused=null,paused=false,disposed=false,frame=0,last=0;
let isRotating=false;
const format=n=>Number(n).toLocaleString('ja-JP');

function textureFromStops(stops){
 const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;
 const context=canvas.getContext('2d');
 if(!context)throw new Error('Canvas 2D texture unsupported');
 const gradient=context.createRadialGradient(64,64,1,64,64,64);
 for(const [pos,value] of stops)gradient.addColorStop(pos,value);
 context.fillStyle=gradient;context.fillRect(0,0,128,128);
 const texture=new THREE.CanvasTexture(canvas);
 texture.colorSpace=THREE.SRGBColorSpace;
 return texture;
}
function makeTextures(){
 // Exactly the same luminous point sprite ramp as the live home.
 textures.core=textureFromStops([
  [0,'rgba(255,255,255,1)'],
  [.2,'rgba(255,255,255,.88)'],
  [.47,'rgba(255,255,255,.32)'],
  [1,'rgba(255,255,255,0)']
 ]);
 textures.soft=textureFromStops([
  [0,'rgba(255,255,255,.88)'],
  [.17,'rgba(255,255,255,.65)'],
  [.4,'rgba(255,255,255,.29)'],
  [.72,'rgba(255,255,255,.07)'],
  [1,'rgba(255,255,255,0)']
 ]);
 textures.ring=textureFromStops([
  [0,'rgba(255,255,255,.03)'],
  [.19,'rgba(255,255,255,.07)'],
  [.34,'rgba(255,255,255,.41)'],
  [.50,'rgba(255,255,255,.23)'],
  [.77,'rgba(255,255,255,.03)'],
  [1,'rgba(255,255,255,0)']
 ]);
}
function geometry(points){
 const geo=new THREE.BufferGeometry();
 const positions=new Float32Array(points.length*3);
 for(let i=0;i<points.length;i++)
  positions.set([points[i].x,points[i].y,points[i].z],i*3);
 geo.setAttribute('position',new THREE.BufferAttribute(positions,3));
 geometries.push(geo);return geo;
}
function addCloud(scene,geo,color,size,opacity,texture){
 if(!geo.getAttribute('position').count)return;
 const material=new THREE.PointsMaterial({
  color,size,sizeAttenuation:true,map:textures[texture],
  transparent:true,opacity,alphaTest:.01,depthWrite:false,
  blending:THREE.AdditiveBlending
 });
 materials.push(material);
 scene.add(new THREE.Points(geo,material));
}
function populateScenes(points){
 const groups={unlit:[],share:[],discover:[]};
 for(const p of points){
  if(p.total<=0)groups.unlit.push(p);
  else if(p.shared>0)groups.share.push(p);
  else groups.discover.push(p);
 }
 const geos=Object.fromEntries(Object.entries(groups).map(([type,items])=>[type,geometry(items)]));
 for(const [id,preset] of Object.entries(profiles)){
  const scene=new THREE.Scene();
  // Dormant points identical across all six patterns.
  addCloud(scene,geos.unlit,'#4d5c73',.29,.54,'core');
  for(const type of ['share','discover']){
   // Halos are placed behind the unchanged point core (core drawn last).
   for(const layer of preset.layers)
    addCloud(scene,geos[type],palette[type],layer.size,layer.opacity,layer.texture);
   // These are the two original live-home core layers, unchanged in every view.
   addCloud(scene,geos[type],palette[type],.63,.75,'core');
   addCloud(scene,geos[type],palette[type],.28,1,'core');
  }
  sceneList[id]=scene;
 }
 return {lit:points.length-groups.unlit.length,all:points.length};
}
function resize(){
 if(!renderer||disposed)return;
 const width=stage.clientWidth,height=stage.clientHeight;
 if(width<10||height<10)return;
 renderer.setSize(width,height,false);
 render();
}
function visiblePanels(){
 return focused?panels.filter(el=>el.dataset.profile===focused):panels;
}
function render(){
 if(!renderer||disposed)return;
 const outer=stage.getBoundingClientRect();
 if(!outer.width||!outer.height)return;
 renderer.setScissorTest(true);
 for(const panel of visiblePanels()){
  const rect=panel.getBoundingClientRect();
  // One WebGL renderer, six independent scissor windows: synchronized camera,
  // lower mobile GPU memory than six separate WebGL contexts.
  const x=Math.max(0,Math.round(rect.left-outer.left));
  const y=Math.max(0,Math.round(outer.bottom-rect.bottom));
  const w=Math.round(rect.width),h=Math.round(rect.height);
  if(w<5||h<5)continue;
  camera.aspect=w/h;camera.updateProjectionMatrix();
  renderer.setViewport(x,y,w,h);
  renderer.setScissor(x,y,w,h);
  renderer.render(sceneList[panel.dataset.profile],camera);
 }
 renderer.setScissorTest(false);
}
function setDistance(n){
 const value=Math.max(14,Math.min(37,Number(n)||25));
 const direction=camera.position.clone().sub(controls.target).normalize();
 camera.position.copy(controls.target).addScaledVector(direction,value);
 controls.update();
 $('distance').value=String(Math.round(value));
 $('distance-value').textContent=String(Math.round(value));
 render();
}
function focusProfile(id){
 if(!profiles[id])return;
 focused=id;
 stage.classList.add('is-focus');
 for(const p of panels){
  p.classList.toggle('is-selected',p.dataset.profile===id);
  const button=p.querySelector('button[data-focus]');
  if(button)button.setAttribute('aria-pressed',String(p.dataset.profile===id));
 }
 $('return-grid').hidden=false;
 $('selected-profile').textContent='選択中：'+id+'案 · '+profiles[id].name+'（本番未適用）';
 $('copy-selection').disabled=false;
 stage.setAttribute('aria-label',id+'案 '+profiles[id].name+' を拡大表示');
 resize();
}
function returnGrid(){
 focused=null;stage.classList.remove('is-focus');
 for(const p of panels)p.classList.remove('is-selected');
 $('return-grid').hidden=true;
 stage.setAttribute('aria-label','6種類の星の光り方を同じ視点で比較');
 resize();
}
function createRenderer(){
 renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.25));
 renderer.setClearColor(0x000000,0);
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.domElement.setAttribute('role','img');
 renderer.domElement.setAttribute('aria-label','現在点灯した星の光度を6つの条件で比較する3D星図。操作すると全パネルが同じ視点で回転します');
 stage.prepend(renderer.domElement);
 camera=new THREE.PerspectiveCamera(45,1,.1,90);
 camera.position.set(0,1.2,25);
 controls=new OrbitControls(camera,renderer.domElement);
 controls.enablePan=false;controls.enableDamping=true;controls.dampingFactor=.065;
 controls.minDistance=14;controls.maxDistance=37;
 controls.rotateSpeed=1.25;
 controls.autoRotate=false;
 controls.autoRotateSpeed=2.0;
 controls.addEventListener('change',()=>{
  const n=Math.round(camera.position.distanceTo(controls.target));
  $('distance').value=String(n);
  $('distance-value').textContent=String(n);
 });
 observer=new ResizeObserver(resize);observer.observe(stage);
 visibilityObserver=new IntersectionObserver(entries=>{
  paused=!entries[0]?.isIntersecting;
  if(!paused)render();
 },{threshold:0});
 visibilityObserver.observe(stage);
 resize();
 last=0;
 function animate(time){
  if(disposed)return;
  frame=requestAnimationFrame(animate);
  if(paused||document.hidden||time-last<34)return;
  last=time;
  if(!preferReduced||isRotating)controls.update();
  render();
 }
 frame=requestAnimationFrame(animate);
}
function attachEvents(){
 document.querySelectorAll('button[data-focus]').forEach(button=>{
  button.addEventListener('click',()=>focusProfile(button.dataset.focus));
 });
 $('return-grid').addEventListener('click',returnGrid);
 $('reset-view').addEventListener('click',()=>{
  controls.target.set(0,0,0);
  camera.position.set(0,1.2,25);
  controls.update();
  $('distance').value='25';$('distance-value').textContent='25';
  render();
 });
 $('distance').addEventListener('input',e=>setDistance(e.target.value));
 $('toggle-motion').addEventListener('click',()=>{
  isRotating=!isRotating;controls.autoRotate=isRotating;
  $('toggle-motion').setAttribute('aria-pressed',String(isRotating));
  $('toggle-motion').textContent=isRotating?'回転を止める':'回転を開始';
 });
 $('copy-selection').addEventListener('click',async()=>{
  if(!focused)return;
  const text='見えない病気の星図：光度検証 '+focused+'案（'+profiles[focused].name+'）が好みです。';
  try{
   await navigator.clipboard.writeText(text);
   $('copy-selection').textContent='コピーしました';
  }catch{
   $('copy-selection').textContent='コピーできません。'+focused+'案とお伝えください';
  }
 });
 window.addEventListener('pagehide',event=>{
  if(event.persisted)return;
  disposed=true;cancelAnimationFrame(frame);
  observer?.disconnect();visibilityObserver?.disconnect();controls?.dispose();
  for(const geo of geometries)geo.dispose();
  for(const material of materials)material.dispose();
  for(const texture of Object.values(textures))texture.dispose();
  renderer?.dispose();
 });
 window.addEventListener('pageshow',event=>{
  if(event.persisted){disposed=false;resize();}
 });
}
async function boot(){
 if(!window.supabase||!config.supabaseUrl||!config.supabasePublishableKey)
  throw new Error('Public data configuration unavailable');
 if(typeof WebGLRenderingContext==='undefined')throw new Error('WebGL unsupported');
 const client=window.supabase.createClient(config.supabaseUrl,config.supabasePublishableKey);
 const [coordsResponse,starsResponse]=await Promise.all([
  client.rpc('get_constellation_positions'),
  client.rpc('get_public_stars')
 ]);
 if(coordsResponse.error)throw coordsResponse.error;
 if(starsResponse.error)throw starsResponse.error;
 const coords=Array.isArray(coordsResponse.data)?coordsResponse.data:[];
 const stars=Array.isArray(starsResponse.data)?starsResponse.data:[];
 if(coords.length!==1241)throw new Error('Expected 1241 public positions');
 const byId=new Map(stars.map(row=>[row.id,row]));
 const points=coords.map(row=>{
  const details=byId.get(row.id);
  const x=Number(row.x),y=Number(row.y),z=Number(row.z);
  if(!details||![x,y,z].every(Number.isFinite))return null;
  return {x,y,z,total:Math.max(0,Number(details.total)||0),
   shared:Math.max(0,Number(details.shared)||0),
   discovered:Math.max(0,Number(details.discovered)||0)};
 }).filter(Boolean);
 if(points.length!==1241)throw new Error('Incomplete public catalogue');
 makeTextures();
 const {lit,all}=populateScenes(points);
 createRenderer();
 attachEvents();
 status.textContent='現在 '+format(lit)+' / '+format(all)+' 種類が点灯';
 $('lit-stat').textContent=format(all)+' 個の星の位置は6案すべて共通 · '+format(lit)+' 個が点灯中';
 message.textContent='';
}
boot().catch(error=>{
 console.error('Glow preview unavailable',error);
 status.textContent='星図の取得に失敗しました';
 message.textContent='比較を表示できません。通信環境をご確認のうえ再読み込みしてください。';
});
