import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const $=id=>document.getElementById(id);
const cfg=window.NENONE_CONFIG||{};
const mount=$('universe'),message=$('space-message'),counter=$('lit-count');
let renderer,scene,camera,controls,starData=new Map(),objects=[],auto=false,disposed=false;
const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const format=n=>Number(n||0).toLocaleString('ja-JP');

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
function createCloud(items,color,size,texture,opacity=1,pickable=true){
 const geo=new THREE.BufferGeometry();
 const coords=new Float32Array(items.length*3);
 for(let i=0;i<items.length;i++){
  const p=items[i].position;
  coords.set([p.x,p.y,p.z],i*3);
 }
 geo.setAttribute('position',new THREE.BufferAttribute(coords,3));
 const material=new THREE.PointsMaterial({color,size,sizeAttenuation:true,
  map:texture,transparent:true,opacity,alphaTest:0.01,
  depthWrite:false,blending:THREE.AdditiveBlending});
 const cloud=new THREE.Points(geo,material);
 cloud.userData.itemIds=items.map(x=>x.id);
 cloud.userData.pickable=pickable;
 scene.add(cloud);objects.push(cloud);
 return cloud;
}
function showDetails(id,scrollToDetails=true){
 const star=starData.get(id);
 if(!star)return;
 $('star-info').hidden=false;
 const joinSelected=$('join-selected-star');
 if(joinSelected) {
  joinSelected.onclick=event=>{
   const start=window.NENONE_START_FOR_DISEASE;
   if(typeof start==='function' && start(id)) event.preventDefault();
  };
 }
 $('info-name').textContent=star.name;
 $('info-group').textContent=star.cluster==='分類未整備'?'分類情報を準備中':star.cluster;
 const total=Math.max(0,Number(star.total)||0);
 $('info-count').textContent=total
   ?format(total)+'件の想いが届いています。'
   :'この星には、まだ光が灯っていません。';
 const comments=$('info-comments');comments.replaceChildren();
 for(const row of (Array.isArray(star.comments)?star.comments:[]).slice(0,5)){
  const value=typeof row?.text==='string'?row.text.trim():'';
  if(!value)continue;
  const bubble=document.createElement('span');bubble.textContent=value;
  comments.append(bubble);
 }
 if(scrollToDetails) $('star-info').scrollIntoView({block:'nearest',behavior:reduceMotion?'instant':'smooth'});
}
function initScene(initialData,mode='taxonomy'){
 scene=new THREE.Scene();
 camera=new THREE.PerspectiveCamera(45,1,.1,90);
 camera.position.set(0,1.2,mode==='clinical'?13:25);
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 mount.prepend(renderer.domElement);
 renderer.domElement.setAttribute('role','img');
 renderer.domElement.setAttribute('aria-label',
   mode==='clinical'?'症状・遺伝子に基づく研究用3D星図':'全1,241疾患の回転できる3D星図');
 controls=new OrbitControls(camera,renderer.domElement);
 controls.enableDamping=true;controls.dampingFactor=.065;
 controls.enablePan=false;controls.minDistance=9;controls.maxDistance=40;
 controls.autoRotate=!reduceMotion;controls.autoRotateSpeed=2.5;
 controls.rotateSpeed=1.35;
 auto=controls.autoRotate;
 const motionButton=$('toggle-motion');
 motionButton.setAttribute('aria-pressed',String(auto));
 motionButton.textContent=auto?'回転を止める':'回転を開始';
 const texture=spriteTexture();
 let lastSelection=null;
 function drawDataset(records,resetCamera=false) {
  for(const o of objects) {
   scene.remove(o);
   o.geometry.dispose();
   o.material.dispose();
  }
  objects=[];starData.clear();
  const points={unlit:[],share:[],discover:[],mixed:[]};
  for(const d of records) {
   const total=Math.max(0,Number(d.total)||0);
   const kind=total===0?'unlit':
    (d.shared>0&&d.discovered>0)?'mixed':d.shared>0?'share':'discover';
   points[kind].push(d);
   starData.set(d.id,d);
  }
  createCloud(points.unlit,'#4d5c73',.29,texture,.54,false);
  const colors={share:'#ffc6ad',discover:'#99e4ff',mixed:'#dcb6ff'};
  for(const type of ['share','discover','mixed']) {
   const items=points[type];
   createCloud(items,colors[type],.63,texture,.75);
   if(items.length)createCloud(items,colors[type],.28,texture,1);
  }
  const lit=records.filter(d=>Number(d.total)>0).length;
  counter.textContent=format(lit)+' / '+format(records.length)+' 個の星';
  if($('mode-explanation')){
   $('mode-explanation').textContent=mode==='clinical'
    ?'症状・遺伝子情報から計算した'+format(records.length)+'疾患の研究用配置。'
    :'分類情報に基づいた'+format(records.length)+'個の星。';
  }
  if(resetCamera){
   camera.position.set(0,1.2,mode==='clinical'?13:25);
   controls.target.set(0,0,0);
   controls.update();
  }
  if(lastSelection && starData.has(lastSelection)) showDetails(lastSelection,false);
  else $('star-info').hidden=true;
 }
 drawDataset(initialData,true);
 // The public participation form dispatches refreshed star counts after submission.
 // Update color/glow without resetting the user's chosen 3D view.
 if(mode==='taxonomy'){
  window.addEventListener('nenone:stars-updated',event=>{
   const refreshed=event.detail?.stars;
   if(!Array.isArray(refreshed)||!refreshed.length||disposed)return;
   const updated=new Map(refreshed.map(x=>[x.id,x]));
   drawDataset(initialData.map(original=>{
    const latest=updated.get(original.id);
    return latest?{...original,...latest,position:original.position}:original;
   }));
  });
 }
 const raycaster=new THREE.Raycaster();
 raycaster.params.Points.threshold=.32;
 const pointer=new THREE.Vector2();
 let down=null;
 renderer.domElement.addEventListener('pointerdown',event=>{
  down={x:event.clientX,y:event.clientY};
 });
 renderer.domElement.addEventListener('pointerup',event=>{
  if(!down)return;
  const drift=Math.hypot(event.clientX-down.x,event.clientY-down.y);down=null;
  if(drift>9)return;
  const rect=renderer.domElement.getBoundingClientRect();
  pointer.x=(event.clientX-rect.left)/rect.width*2-1;
  pointer.y=-(event.clientY-rect.top)/rect.height*2+1;
  raycaster.setFromCamera(pointer,camera);
  const collisions=raycaster.intersectObjects(objects.filter(o=>o.userData.pickable),false);
  for(const item of collisions){
   const id=item.object.userData.itemIds?.[item.index];
   // Never reveal the identity of an unlit star through 3D interaction.
   if(id && Number(starData.get(id)?.total)>0){lastSelection=id;showDetails(id);break;}
  }
 });
 const resize=()=>{
  if(disposed)return;
  const w=mount.clientWidth,h=mount.clientHeight;
  if(w<10||h<10)return;
  camera.aspect=w/h;camera.updateProjectionMatrix();
  renderer.setSize(w,h,false);
  renderer.render(scene,camera);
 };
 const resizeObserver=new ResizeObserver(resize);
 resizeObserver.observe(mount);
 resize();
 $('reset-view').addEventListener('click',()=>{
  camera.position.set(0,1.2,mode==='clinical'?13:25);controls.target.set(0,0,0);controls.update();
 });
 motionButton.addEventListener('click',()=>{
  auto=!auto;controls.autoRotate=auto;
  motionButton.setAttribute('aria-pressed',String(auto));
  motionButton.textContent=auto?'回転を止める':'回転を開始';
 });
 let prev=0;
 const animate=time=>{
  if(disposed)return;
  requestAnimationFrame(animate);
  if(document.hidden||time-prev<32)return;prev=time;
  controls.update();
  renderer.render(scene,camera);
 };
 requestAnimationFrame(animate);
 window.addEventListener('pagehide',()=>{
  disposed=true;resizeObserver.disconnect();
  controls.dispose();
  texture.dispose();
  for(const object of objects){object.geometry.dispose();object.material.dispose();}
  renderer.dispose();
 },{once:true});
}
async function boot(){
 const client=window.supabase&&cfg.supabaseUrl&&cfg.supabasePublishableKey
  ?window.supabase.createClient(cfg.supabaseUrl,cfg.supabasePublishableKey):null;
 if(!client)throw new Error('Supabase is unavailable');
 if(typeof WebGLRenderingContext==='undefined')throw new Error('WebGL unavailable');
 const mode=document.body.dataset.starScene==='clinical'?'clinical':'taxonomy';
 // Pages are separate on purpose: the public home never fetches the
 // unpublished medical research coordinates, and clinical never fetches all
 // 1,241 taxonomy coordinates.
 const coordsRpc=mode==='clinical'?'get_clinical_pilot_positions':'get_constellation_positions';
 const [starsRes,coordsRes]=await Promise.all([
  client.rpc('get_public_stars'),client.rpc(coordsRpc)
 ]);
 if(starsRes.error)throw starsRes.error;
 if(coordsRes.error)throw coordsRes.error;
 const stars=Array.isArray(starsRes.data)?starsRes.data:[];
 const positions=Array.isArray(coordsRes.data)?coordsRes.data:[];
 if(!stars.length||!positions.length)throw new Error('Empty constellation data');
 const info=new Map(stars.map(d=>[d.id,d]));
 const data=positions.map(p=>{
  const star=info.get(p.id);
  if(!star)return null;
  const v=[Number(p.x),Number(p.y),Number(p.z)];
  if(!v.every(Number.isFinite))return null;
  return {...star,
   cluster:mode==='clinical'?'HPO症状・原因遺伝子（研究用）':p.cluster,
   position:{x:v[0],y:v[1],z:v[2]}};
 }).filter(Boolean);
 if(!data.length)throw new Error('No valid coordinate match');
 // Prevent an accidental partial 1241-disease view being mistaken for the
 // complete constellation; clinical is intentionally a smaller cohort.
 if(mode==='taxonomy'&&data.length!==1241)
  throw new Error('Full constellation is incomplete: '+data.length+'/1241');
 message.textContent='';
 initScene(data,mode);
}
boot().catch(error=>{
 console.error('3D星図の読み込みに失敗:',error);
 message.textContent='立体星図を読み込めませんでした。通信状況を確認して再読み込みしてください。';
 counter.textContent='読み込みに失敗しました';
});

// Safari may restore the disposed WebGL canvas from the back/forward cache.
window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
