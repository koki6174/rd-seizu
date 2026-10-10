'use strict';
// Pilot restricted to rigorously verified ORPHA disease identities.
// Origin: Orphanet ORPHApackets (CC BY 4.0; June 2026), terms encoded with HPO IDs.
// No patient data, no unverified translation, no inferred absent phenotype.
const fs=require('node:fs');
function dist2(a,b){let z=0;for(let i=0;i<a.length;i++)z+=(a[i]-b[i])**2;return z;}
function dot(a,b){let z=0;for(let i=0;i<a.length;i++)z+=a[i]*b[i];return z;}
const freqWeight=x=>{
 const s=String(x||'');
 if(s.includes('Obligate'))return 1;
 if(s.includes('Very frequent'))return .90;
 if(s.includes('Frequent'))return .55;
 if(s.includes('Occasional'))return .17;
 if(s.includes('Very rare'))return .025;
 return .25; // unknown: neutral positive annotation, not a negative observation
};
function embedding(records){
 const rows=records.slice().sort((a,b)=>a.id.localeCompare(b.id,'en'));
 const n=rows.length;if(n<4)throw Error('Need >=4 known diseases');
 const terms=[...new Set(rows.flatMap(r=>r.phenotypes.map(p=>p.id)))].sort();
 const causal=r=>r.genes.filter(x=>/disease-causing/i.test(x.association));
 const genes=[...new Set(rows.flatMap(r=>causal(r).map(g=>g.symbol)))].sort();
 const occurrence=new Map(terms.map(h=>[h,rows.filter(r=>r.phenotypes.some(x=>x.id===h)).length]));
 const geneDF=new Map(genes.map(h=>[h,rows.filter(r=>causal(r).some(x=>x.symbol===h)).length]));
 const matrices=rows.map(row=>{
  const record=new Map(row.phenotypes.map(p=>[p.id,p]));
  const hs=terms.map(h=>{
    const p=record.get(h);
    if(!p)return 0; // not annotated, NOT clinically absent
    const idf=Math.log((n+1)/(1+occurrence.get(h)))+1;
    return Math.sqrt(freqWeight(p.frequency))*idf;
  });
  const hNorm=Math.hypot(...hs)||1;
  const gs=new Set(causal(row).map(x=>x.symbol));
  const gv=genes.map(g=>gs.has(g)?(.55*(Math.log((n+1)/(1+geneDF.get(g)))+1)):0);
  const gNorm=Math.hypot(...gv)||1;
  // Multiblock normalisation means phenotype dominates over gene evidence.
  return [...hs.map(v=>v/hNorm),...gv.map(v=>.18*v/gNorm)];
 });
 const vecs=matrices;
 const kernel=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>dot(vecs[i],vecs[j])));
 const rowMeans=kernel.map(r=>r.reduce((a,b)=>a+b,0)/n);
 const grandMean=rowMeans.reduce((a,b)=>a+b,0)/n;
 const K=kernel.map((r,i)=>r.map((v,j)=>v-rowMeans[i]-rowMeans[j]+grandMean));
 const eig=[];
 const values=[];
 for(let axis=0;axis<3;axis++){
  let v=Array.from({length:n},(_,j)=>Math.sin((j+1)*(axis+1)*1.37));
  for(let iteration=0;iteration<280;iteration++){
   let next=K.map(r=>dot(r,v));
   for(const previous of eig){
    const c=dot(next,previous);
    next=next.map((z,k)=>z-c*previous[k]);
   }
   const size=Math.hypot(...next)||1;
   next=next.map(x=>x/size);
   if(dist2(v,next)<1e-19){v=next;break;}
   v=next;
  }
  const value=dot(v,K.map(r=>dot(r,v)));
  if(!(value>0))throw Error('Bad eigendecomposition');
  eig.push(v);values.push(value);
 }
 const base=rows.map((r,i)=>eig.map((v,axis)=>v[i]*Math.sqrt(values[axis])*6.5));
 const k=4;
 const centers=[base[0].slice()];
 // deterministic farthest-point prototypes
 while(centers.length<k){
  const idx=base.map((v,i)=>({i,d:Math.min(...centers.map(c=>dist2(v,c)))})).sort((a,b)=>b.d-a.d||a.i-b.i)[0].i;
  centers.push(base[idx].slice());
 }
 const memberships=Array.from({length:n},()=>Array(k).fill(1/k));
 let its=0;
 for(;its<70;its++){
  for(let i=0;i<n;i++){
   const ds=centers.map(c=>Math.max(1e-10,dist2(base[i],c)));
   const exact=ds.findIndex(x=>x<=1.1e-10);
   if(exact>=0){memberships[i].fill(0);memberships[i][exact]=1;continue;}
   for(let j=0;j<k;j++)memberships[i][j]=1/ds.reduce((acc,d)=>acc+ds[j]/d,0);
  }
  let move=0;
  for(let j=0;j<k;j++){
   let sum=0;const next=[0,0,0];
   for(let i=0;i<n;i++){
    const u=memberships[i][j]**2;sum+=u;
    for(let c=0;c<3;c++)next[c]+=u*base[i][c];
   }
   if(sum>1e-10){
    for(let c=0;c<3;c++)next[c]/=sum;
    move=Math.max(move,dist2(next,centers[j]));centers[j]=next;
   }
  }
  if(move<1e-9)break;
 }
 const coordinates=rows.map((r,i)=>{
  let dominant=0;
  for(let j=1;j<k;j++)if(memberships[i][j]>memberships[i][dominant])dominant=j;
  return{id:r.id,orpha_code:r.code,
  x:+base[i][0].toFixed(5),y:+base[i][1].toFixed(5),z:+base[i][2].toFixed(5),
  fcm_cluster:dominant+1, membership:+memberships[i][dominant].toFixed(4),
  annotated_hpo:r.phenotypes.length, annotated_causal_genes:causal(r).length,
  model_version:'verified-orphadata-hpo-pca-fcm-v0'};
 });
 const neighbors=[];
 for(let i=0;i<n;i++){
  const others=[];
  for(let j=0;j<n;j++)if(j!==i)others.push({id:rows[j].id,cosine:dot(vecs[i],vecs[j])/(Math.hypot(...vecs[i])*Math.hypot(...vecs[j])||1)});
  others.sort((a,b)=>b.cosine-a.cosine);
  neighbors.push({id:rows[i].id,closest:others.slice(0,3)});
 }
 return {meta:{n,dims:terms.length+genes.length,hpoTermCount:terms.length,
 causalGeneCount:genes.length,k,fcmiters:its,
 explainedKernelVariance:values.map(v=>v/K.reduce((a,row,i)=>a+row[i],0)),
 maxMissingnessWarning:'Unannotated phenotypes and genes are not confirmed negatives',
 source:'2026-06-29 Orphapacket verified mapping subset'},coordinates,neighbors};
}
module.exports={embedding};
if(require.main===module){
 const rows=[1,2,3].flatMap(i=>JSON.parse(fs.readFileSync('data/orphadata_verified_batch_0'+i+'.json','utf8')).rows);
 fs.writeFileSync('data/clinical_hpo_pca_fcm_17.json',JSON.stringify(embedding(rows),null,2)+'\n');
}
