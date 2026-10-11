import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

// All 1,241 points keep their existing coordinates. A chosen Tokyo-Monday
// historical snapshot supplies *only* the illumination counts at that cutoff.
const mount=document.getElementById('weekly-space');
const status=document.getElementById('weekly-space-status');
const counter=document.getElementById('weekly-space-count');
const printImage=document.getElementById('weekly-space-print');
const cfg=window.NENONE_CONFIG||{};
const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
const format=n=>Number(n||0).toLocaleString('ja-JP');
let renderer,scene,camera,controls,observer,texture,disposed=false;
let coords=[],names=new Map(),snap=window.NENONE_WEEKLY_SNAPSHOT||null;
let clouds=[],activePoints=new Map(),lastWeek='',lastFrame=0,frame=0;

function makeGlow(){
 const canvas=document.createElement('canvas');
 canvas.width=64;canvas.height=64;
 const c=canvas.getContext('2d'),g=c.createRadialGradient(32,32,0,32,32,32);
 g.addColorStop(0,'rgba(255,255,255,1)');
 g.addColorStop(.2,'rgba(255,255,255,.89)');
 g.addColorStop(.5,'rgba(255,255,255,.22)');
 g.addColorStop(1,'rgba(255,255,255,0)');
 c.fillStyle=g;c.fillRect(0,0,64,64);
 const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;return tex;
}
function cloud(items,color,size,opacity,selectable=false){
 if(!items.length)return;
 const geometry=new THREE.BufferGeometry();
 const vertices=new Float32Array(items.length*3);
 items.forEach((p,i)=>vertices.set([p.x,p.y,p.z],3*i));
 geometry.setAttribute('position',new THREE.BufferAttribute(vertices,3));
 const material=new THREE.PointsMaterial({
  color,size,sizeAttenuation:true,map:texture,transparent:true,opacity,
  depthWrite:false,alphaTest:.01,blending:THREE.AdditiveBlending
 });
 const points=new THREE.Points(geometry,material);
 points.userData.ids=items.map(p=>p.id);
 points.userData.selectable=selectable;
 scene.add(points);clouds.push(points);
}
function draw(snapshot){
 if(!renderer||disposed||!snapshot||!Array.isArray(snapshot.stars))return;
 const counts=new Map(snapshot.stars.filter(x=>Number(x.total)>0).map(x=>[x.id,x]));
 const groups={dark:[],share:[],discover:[],mixed:[],historic:[]};
 activePoints=new Map();
 for(const p of coords){
  const record=counts.get(p.id);
  if(!record){groups.dark.push(p);continue;}
  activePoints.set(p.id,record);
  const shared=Number(record.shared)||0,discovered=Number(record.discovered)||0;
  const group=shared&&discovered?'mixed':shared?'share':discovered?'discover':'historic';
  groups[group].push(p);
 }
 for(const c of clouds){scene.remove(c);c.geometry.dispose();c.material.dispose();}
 clouds=[];
 cloud(groups.dark,'#596578',.26,.40,false);
 for(const [kind,color] of [['share','#ffd3bc'],['discover','#a1eaf9'],
  ['mixed','#dfc4fe'],['historic','#f9e4b0']]){
  cloud(groups[kind],color,.76,.82,true);
  cloud(groups[kind],color,.32,.96,true);
 }
 lastWeek=snapshot.weekStart;
 counter.textContent=format(activePoints.size)+' / '+format(coords.length);
 status.textContent='';
 const info=document.getElementById('weekly-selected-info');
 if(info)info.hidden=true;
 renderNow();
 // Print uses a frozen image because most browsers do not reliably print WebGL.
 if(printImage){
  try{printImage.src=renderer.domElement.toDataURL('image/png');printImage.hidden=false;}catch{}
 }
}
function renderNow(){
 if(!renderer||disposed)return;
 controls?.update();renderer.render(scene,camera);
}
function initScene(){
 scene=new THREE.Scene();
 camera=new THREE.PerspectiveCamera(48,1,.1,90);
 camera.position.set(0,1.1,25);
 renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,
  preserveDrawingBuffer:true,powerPreference:'low-power'});
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
 mount.prepend(renderer.domElement);
 renderer.domElement.setAttribute('aria-label','選択週までに灯った星だけが明るい立体星図');
 controls=new OrbitControls(camera,renderer.domElement);
 controls.enableDamping=true;controls.dampingFactor=.07;
 controls.enablePan=false;controls.minDistance=13;controls.maxDistance=40;
 controls.autoRotate=!reduced;controls.autoRotateSpeed=1.6;
 controls.rotateSpeed=1.1;
 texture=makeGlow();
 const resize=()=>{
  const w=mount.clientWidth,h=mount.clientHeight;
  if(w<10||h<10||disposed)return;
  camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);
  renderNow();
 };
 observer=new ResizeObserver(resize);observer.observe(mount);
 resize();
 const pointer=new THREE.Vector2(),raycaster=new THREE.Raycaster();
 raycaster.params.Points.threshold=.4;
 let start=null;
 renderer.domElement.addEventListener('pointerdown',e=>{start={x:e.clientX,y:e.clientY};});
 renderer.domElement.addEventListener('pointerup',e=>{
  if(!start||Math.hypot(e.clientX-start.x,e.clientY-start.y)>9){start=null;return;}
  start=null;
  const rect=renderer.domElement.getBoundingClientRect();
  pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
  raycaster.setFromCamera(pointer,camera);
  // Dormant (unlit) points are *never* raycast targets or linked to names.
  const eligible=clouds.filter(c=>c.userData.selectable);
  const hits=raycaster.intersectObjects(eligible,false);
  const info=document.getElementById('weekly-selected-info');
  for(const hit of hits){
   const id=hit.object.userData.ids?.[hit.index],d=activePoints.get(id);
   if(!d||!Number(d.total))continue;
   if(info){
    const label=names.get(id)||'光が灯った星';
    info.textContent=label+' · '+format(d.total)+'件';
    info.hidden=false;
   }
   return;
  }
  if(info)info.hidden=true;
 });
 const animate=time=>{
  if(disposed)return;
  frame=requestAnimationFrame(animate);
  if(document.hidden||time-lastFrame<34)return;lastFrame=time;
  renderNow();
 };
 frame=requestAnimationFrame(animate);
 const freeze=()=>{
  if(!renderer)return;
  renderNow();
  try{printImage.src=renderer.domElement.toDataURL('image/png');printImage.hidden=false;}catch{}
 };
 window.addEventListener('beforeprint',freeze);
 window.addEventListener('pagehide',()=>{
  disposed=true;cancelAnimationFrame(frame);observer?.disconnect();
  controls?.dispose();for(const c of clouds){c.geometry.dispose();c.material.dispose();}
  texture?.dispose();renderer?.dispose();
  window.removeEventListener('beforeprint',freeze);
 },{once:true});
}
window.addEventListener('nenone:weekly-snapshot',event=>{
 snap=event.detail;
 if(renderer)draw(snap);
});
async function boot(){
 if(!mount)return;
 const client=window.supabase&&cfg.supabaseUrl&&cfg.supabasePublishableKey
  ?window.supabase.createClient(cfg.supabaseUrl,cfg.supabasePublishableKey):null;
 if(!client||typeof WebGLRenderingContext==='undefined')
  throw new Error('3D display unavailable');
 const [positionsRes,namesRes]=await Promise.all([
  client.rpc('get_constellation_positions'),client.rpc('get_public_stars')
 ]);
 if(positionsRes.error)throw positionsRes.error;
 if(namesRes.error)throw namesRes.error;
 const positions=Array.isArray(positionsRes.data)?positionsRes.data:[];
 if(positions.length!==1241)throw new Error('Incomplete taxonomy coordinates');
 coords=positions.filter(p=>[p.x,p.y,p.z].every(v=>Number.isFinite(Number(v))))
  .map(p=>({id:p.id,x:Number(p.x),y:Number(p.y),z:Number(p.z)}));
 if(coords.length!==1241)throw new Error('Invalid full-coordinate set');
 names=new Map((Array.isArray(namesRes.data)?namesRes.data:[]).map(n=>[n.id,n.name]));
 initScene();
 if(snap)draw(snap);
}
boot().catch(error=>{
 console.error('Historical 3D star view:',error);
 if(status)status.textContent='立体星図は表示できません。数値の記録は上に表示しています。';
});
window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
