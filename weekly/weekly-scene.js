import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

// The archive reuses the main taxonomy star appearance and camera geometry.
// Only the historical/day-to-date illumination counts differ.
const mount=document.getElementById('weekly-space');
const status=document.getElementById('weekly-space-status');
const counter=document.getElementById('weekly-space-count');
const printImage=document.getElementById('weekly-space-print');
const cfg=window.NENONE_CONFIG||{};
const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
const format=n=>Number(n||0).toLocaleString('ja-JP');
let renderer,scene,camera,controls,observer,texture,haloTextures,disposed=false;
let coords=[],names=new Map(),snap=window.NENONE_WEEKLY_SNAPSHOT||null;
let clouds=[],activePoints=new Map(),lastFrame=0,frame=0,printSnapshotReady=false;

function spriteTexture(){
 const canvas=document.createElement('canvas');
 canvas.width=64;canvas.height=64;
 const c=canvas.getContext('2d');
 const gradient=c.createRadialGradient(32,32,1,32,32,32);
 gradient.addColorStop(0,'rgba(255,255,255,1)');
 gradient.addColorStop(.2,'rgba(255,255,255,.88)');
 gradient.addColorStop(.47,'rgba(255,255,255,.32)');
 gradient.addColorStop(1,'rgba(255,255,255,0)');
 c.fillStyle=gradient;c.fillRect(0,0,64,64);
 const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function haloTexture(stops){
 const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;
 const context=canvas.getContext('2d');
 const gradient=context.createRadialGradient(64,64,1,64,64,64);
 for(const [position,value] of stops)gradient.addColorStop(position,value);
 context.fillStyle=gradient;context.fillRect(0,0,128,128);
 const texture=new THREE.CanvasTexture(canvas);
 texture.colorSpace=THREE.SRGBColorSpace;
 return texture;
}
const NEBULA_F=[
 {texture:'soft',size:4.1,opacity:.29},
 {texture:'soft',size:2.25,opacity:.31},
 {texture:'ring',size:3.3,opacity:.16}
];
function createCloud(items,color,size,sourceTexture,opacity=1,selectable=true){
 if(!items.length)return;
 const geometry=new THREE.BufferGeometry();
 const vertices=new Float32Array(items.length*3);
 items.forEach((p,i)=>vertices.set([p.x,p.y,p.z],3*i));
 geometry.setAttribute('position',new THREE.BufferAttribute(vertices,3));
 const material=new THREE.PointsMaterial({
  color,size,sizeAttenuation:true,map:sourceTexture,transparent:true,opacity,
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
 const groups={unlit:[],share:[],discover:[]};
 activePoints=new Map();
 for(const p of coords){
  const record=counts.get(p.id);
  if(!record){groups.unlit.push(p);continue;}
  activePoints.set(p.id,record);
  // Historical counts remain unchanged; a share light always wins the display color.
  const shared=Number(record.shared)||0;
  const kind=shared>0?'share':'discover';
  groups[kind].push(p);
 }
 for(const cloud of clouds){scene.remove(cloud);cloud.geometry.dispose();cloud.material.dispose();}
 clouds=[];
 createCloud(groups.unlit,'#4d5c73',.29,texture,.54,false);
 const colors={share:'#ffc6ad',discover:'#99e4ff'};
 for(const kind of ['share','discover']){
  const items=groups[kind];
  if(items.length){
   for(const layer of NEBULA_F){
    createCloud(items,colors[kind],layer.size,haloTextures[layer.texture],layer.opacity,false);
   }
  }
  createCloud(items,colors[kind],.63,texture,.75,true);
  if(items.length)createCloud(items,colors[kind],.28,texture,1,true);
 }
 counter.textContent=format(activePoints.size)+' / '+format(coords.length);
 status.textContent='';
 const info=document.getElementById('weekly-selected-info');
 if(info)info.hidden=true;
 renderNow();
 printSnapshotReady=false;
 if(printImage){printImage.hidden=true;printImage.removeAttribute('src');}
}
function renderNow(){
 if(!renderer||disposed)return;
 controls?.update();renderer.render(scene,camera);
}
// A4 landscape prints the map in a ~108 x 130 mm panel. Use a separate
// ~400 dpi render instead of stretching the low-resolution on-screen canvas.
// The DOM text and stat blocks stay vector-based in the resulting PDF.
function freezeForPrint(){
 if(!renderer||disposed||!printImage||!coords.length)return false;
 if(printSnapshotReady && printImage.src)return true;
 const width=1700,height=2050;
 const previousSize=renderer.getSize(new THREE.Vector2());
 const previousRatio=renderer.getPixelRatio();
 const previousAspect=camera.aspect;
 try{
  renderer.setPixelRatio(1);
  renderer.setSize(width,height,false);
  camera.aspect=width/height;
  camera.updateProjectionMatrix();
  renderer.render(scene,camera);

  // Include the chart's dark gradient inside the PNG. The printed stars
  // remain visible even when the browser omits CSS background graphics.
  const imageCanvas=document.createElement('canvas');
  imageCanvas.width=width;imageCanvas.height=height;
  const ctx=imageCanvas.getContext('2d');
  if(ctx){
   ctx.fillStyle='#070d1e';ctx.fillRect(0,0,width,height);
   const glow=ctx.createRadialGradient(width*.5,height*.51,70,width*.5,height*.51,height*.66);
   glow.addColorStop(0,'#1a324f');
   glow.addColorStop(.56,'#101b34');
   glow.addColorStop(1,'#070d1e');
   ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
   ctx.drawImage(renderer.domElement,0,0,width,height);
  }
  printImage.src=ctx?imageCanvas.toDataURL('image/png'):
   renderer.domElement.toDataURL('image/png');
  printImage.hidden=false;
  printSnapshotReady=true;
  return true;
 }catch(error){
  console.warn('High-resolution archive print snapshot unavailable:',error);
  return false;
 }finally{
  renderer.setPixelRatio(previousRatio);
  renderer.setSize(previousSize.x,previousSize.y,false);
  camera.aspect=previousAspect;
  camera.updateProjectionMatrix();
  renderNow();
 }
}
// The print button can wait for the snapshot's image to decode before opening
// the native PDF/print dialog. Ctrl+P still works through beforeprint.
window.NENONE_PREPARE_ARCHIVE_PRINT=async()=>{
 if(freezeForPrint() && typeof printImage.decode==='function'){
  await printImage.decode();
 }
};
function initScene(){
 scene=new THREE.Scene();
 camera=new THREE.PerspectiveCamera(45,1,.1,90);
 camera.position.set(0,1.2,25);
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'low-power'});
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
 mount.prepend(renderer.domElement);
 renderer.domElement.setAttribute('role','img');
 renderer.domElement.setAttribute('aria-label','選択した日までに灯った星の3D星図');
 controls=new OrbitControls(camera,renderer.domElement);
 controls.enableDamping=true;controls.dampingFactor=.065;
 controls.enablePan=false;controls.minDistance=9;controls.maxDistance=40;
 controls.autoRotate=!reduced;controls.autoRotateSpeed=2.5;
 controls.rotateSpeed=1.35;
 texture=spriteTexture();
 haloTextures={
  soft:haloTexture([
   [0,'rgba(255,255,255,.88)'],
   [.17,'rgba(255,255,255,.65)'],
   [.4,'rgba(255,255,255,.29)'],
   [.72,'rgba(255,255,255,.07)'],
   [1,'rgba(255,255,255,0)']
  ]),
  ring:haloTexture([
   [0,'rgba(255,255,255,.03)'],
   [.19,'rgba(255,255,255,.07)'],
   [.34,'rgba(255,255,255,.41)'],
   [.50,'rgba(255,255,255,.23)'],
   [.77,'rgba(255,255,255,.03)'],
   [1,'rgba(255,255,255,0)']
  ])
 };
 const resize=()=>{
  const w=mount.clientWidth,h=mount.clientHeight;
  if(w<10||h<10||disposed)return;
  camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);
  renderNow();
 };
 observer=new ResizeObserver(resize);observer.observe(mount);
 resize();
 const pointer=new THREE.Vector2(),raycaster=new THREE.Raycaster();
 raycaster.params.Points.threshold=.32;
 let start=null;
 renderer.domElement.addEventListener('pointerdown',e=>{start={x:e.clientX,y:e.clientY};});
 renderer.domElement.addEventListener('pointerup',e=>{
  if(!start||Math.hypot(e.clientX-start.x,e.clientY-start.y)>9){start=null;return;}
  start=null;
  const rect=renderer.domElement.getBoundingClientRect();
  pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
  raycaster.setFromCamera(pointer,camera);
  // Just like the main scene, dormant stars never reveal their names.
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
  if(document.hidden||time-lastFrame<32)return;lastFrame=time;
  renderNow();
 };
 frame=requestAnimationFrame(animate);
 window.addEventListener('beforeprint',freezeForPrint);
 window.addEventListener('pagehide',function cleanup(event){
  if(event.persisted)return;
  disposed=true;cancelAnimationFrame(frame);observer?.disconnect();controls?.dispose();
  for(const cloud of clouds){cloud.geometry.dispose();cloud.material.dispose();}
  texture?.dispose();
  for(const t of Object.values(haloTextures||{}))t.dispose();
  renderer?.dispose();
  window.removeEventListener('beforeprint',freezeForPrint);
  delete window.NENONE_PREPARE_ARCHIVE_PRINT;
  window.removeEventListener('pagehide',cleanup);
 });
 window.addEventListener('pageshow',event=>{if(event.persisted&&!disposed)resize();});
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
 console.error('Daily 3D star view:',error);
 if(status)status.textContent='立体星図は表示できません。数値の記録は上に表示しています。';
});
