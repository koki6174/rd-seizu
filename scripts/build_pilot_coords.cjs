'use strict';
// Versioned implementation of the taxonomy-only clinical embedding pilot.
// Disease class evidence comes from NANDO/DBCLS (CC BY 4.0).
// This is NOT a validated phenotypic, genetic, prevalence, or therapeutic embedding.
const SHOMAN_TO_NANDO={
 '悪性新生物':16,'慢性腎疾患':7,'慢性呼吸器疾患':10,'慢性心疾患':5,
 '内分泌疾患':9,'膠原病':3,'糖尿病':9,'先天性代謝異常':2,'血液疾患':6,
 '免疫疾患':4,'神経・筋疾患':1,'慢性消化器疾患':13,
 '染色体又は遺伝子に変化を伴う症候群':14,'皮膚疾患群':3,
 '骨系統疾患':8,'脈管系疾患':5
};
const LABELS=['神経・筋','代謝','皮膚・結合組織','免疫','循環器','血液',
 '腎・泌尿器','骨・関節','内分泌','呼吸器','視覚','聴覚・平衡',
 '消化器','染色体・遺伝子関連','耳鼻科','腫瘍','分類未整備'];
const dot=(a,b)=>a.reduce((z,v,i)=>z+v*b[i],0);
const dist=(a,b)=>a.reduce((z,v,i)=>z+(v-b[i])**2,0);
function calculate(rows){
 const keys=Object.keys(SHOMAN_TO_NANDO);
 const g=rows.map(r=>r.nando_class_id||SHOMAN_TO_NANDO[r.pediatric_group]||17);
 const X=rows.map((r,i)=>{
  const x=Array(34).fill(0);
  x[g[i]-1]=2;
  if(r.pediatric_group)x[17+keys.indexOf(r.pediatric_group)]=.45;
  x[33]=r.concept_kind==='disease_subtype'?.4:0;
  return x;
 });
 const D=34,N=rows.length,means=Array(D).fill(0);
 for(const x of X)for(let j=0;j<D;j++)means[j]+=x[j]/N;
 const centered=X.map(x=>x.map((v,i)=>v-means[i]));
 const cov=Array.from({length:D},()=>Array(D).fill(0));
 for(const x of centered)for(let i=0;i<D;i++)for(let j=0;j<D;j++)cov[i][j]+=x[i]*x[j]/(N-1);
 const eig=[],ev=[];
 for(let a=0;a<3;a++){
  let v=Array.from({length:D},(_,i)=>Math.sin((i+1)*(a+1)*1.2345));
  for(let t=0;t<120;t++){
   let next=cov.map(c=>dot(c,v));
   for(const old of eig){let k=dot(next,old);next=next.map((z,i)=>z-k*old[i]);}
   const mag=Math.hypot(...next)||1;next=next.map(z=>z/mag);
   if(dist(next,v)<1e-16){v=next;break;}v=next;
  }
  eig.push(v);ev.push(dot(v,cov.map(c=>dot(c,v))));
 }
 const pca=centered.map(x=>eig.map(v=>dot(x,v)));
 const variance=ev.map(v=>v/cov.reduce((a,r,i)=>a+r[i],0));
 const counts=Array(17).fill(0);
 for(const a of g)counts[a-1]++;
 const seeds=counts.map((n,i)=>[n,i]).sort((a,b)=>b[0]-a[0]).slice(0,13);
 const prototypes=seeds.map(x=>X[g.indexOf(x[1]+1)].slice());
 const K=prototypes.length;
 const U=Array.from({length:N},()=>Array(K).fill(0));
 let iter=0;
 for(;iter<35;iter++){
  for(let i=0;i<N;i++){
   const ds=prototypes.map(v=>Math.max(1e-10,dist(X[i],v)));
   const closest=ds.findIndex(d=>d<1e-9);
   if(closest>=0){U[i].fill(0);U[i][closest]=1;continue;}
   for(let j=0;j<K;j++)U[i][j]=1/ds.reduce((z,d)=>z+ds[j]/d,0);
  }
  let move=0;
  for(let j=0;j<K;j++){
   let sum=0;const next=Array(D).fill(0);
   for(let i=0;i<N;i++){
    const w=U[i][j]**2;sum+=w;
    for(let c=0;c<D;c++)next[c]+=w*X[i][c];
   }
   if(sum>1e-6){
    for(let c=0;c<D;c++)next[c]/=sum;
    move=Math.max(move,dist(next,prototypes[j]));prototypes[j]=next;
   }
  }
  if(move<1e-9)break;
 }
 const centers=Array.from({length:17},()=>[0,0,0]);
 for(let i=0;i<N;i++)for(let j=0;j<3;j++)centers[g[i]-1][j]+=pca[i][j];
 for(let j=0;j<17;j++)centers[j]=centers[j].map(z=>(z/Math.max(1,counts[j]))*10);
 const original=centers.map(c=>c.slice());
 const hash=s=>{
  let h=2166136261;
  for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);
  return h>>>0;
 };
 const rand=s=>{
  const h=hash(s),a=(h%1000)/1000*2*Math.PI,z=((h>>>10)%1000)/500-1;
  const r=Math.sqrt(Math.max(.02,1-z*z));
  return [r*Math.cos(a),r*Math.sin(a),z];
 };
 // Layout-only repulsion, NOT a clinical similarity score.
 for(let t=0;t<220;t++)for(let i=0;i<17;i++)for(let j=i+1;j<17;j++){
  const v=centers[i].map((z,c)=>z-centers[j][c]),len=Math.hypot(...v);
  if(len>=3.5)continue;
  const unit=len<.00001?rand('force'+i+'-'+j):v.map(z=>z/len);
  const step=(3.5-len)*.035;
  for(let a=0;a<3;a++){centers[i][a]+=unit[a]*step;centers[j][a]-=unit[a]*step;}
 }
 const coordinates=rows.map((row,i)=>{
  let cluster=0;
  for(let j=1;j<K;j++)if(U[i][j]>U[i][cluster])cluster=j;
  const base=rand(row.parent_disease_id||row.id).map(z=>z*(row.parent_disease_id?.8:1.45));
  const fine=rand(row.id+'child').map(z=>z*(row.parent_disease_id?.28:.15));
  const idx=g[i]-1;
  const xyz=centers[idx].map((v,j)=>v+base[j]+fine[j]+(pca[i][j]-original[idx][j])*.75);
  return {id:row.id,x:+xyz[0].toFixed(4),y:+xyz[1].toFixed(4),z:+xyz[2].toFixed(4),
   group_label:LABELS[idx],fuzzy_cluster:cluster+1,
   membership_strength:+U[i][cluster].toFixed(4),
   coverage_kind:g[i]===17?'unclassified':row.nando_class_id?'nando_class':'pediatric_class',
   model_version:'clinical-category-pca-fcm-pilot-v0'};
 });
 return {coordinates,variance,iterations:iter,clusters:K};
}
module.exports={calculate};
if(require.main===module){
 const fs=require('node:fs');
 const input=JSON.parse(fs.readFileSync('data/pilot_3d_feature_input.json','utf8'));
 const output=calculate(input.rows);
 fs.writeFileSync('data/pilot_3d_positions_generated.json',JSON.stringify(output.coordinates));
 console.log('PCA:',output.variance,'FCM k=',output.clusters,'iter=',output.iterations);
}
