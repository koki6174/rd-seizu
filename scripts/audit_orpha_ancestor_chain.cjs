'use strict';
/** 
 * Inspect ORPHA ancestors up to three edges for corroboration of NANDO parent.
 * Only a conservative REVIEW QUEUE. Do not approve on this basis alone.
 * Usage: node scripts/audit_orpha_ancestor_chain.cjs /tmp/orphapacket/json /tmp/nando/data/nanbyo.json
 */
const fs=require('node:fs'),path=require('node:path');
const root=process.argv[2],source=process.argv[3];
if(!root||!source)throw Error('Need official Orphapacket and NANDO source paths');
const local=JSON.parse(fs.readFileSync('data/orpha_matching_names_public.json','utf8')).rows;
const byId=new Map(local.map(x=>[x.id,x]));
const items=Array.from({length:7},(_,i)=>i+1).flatMap(n=>JSON.parse(fs.readFileSync(
  `data/orpha_hpo_exact_source_0${n}.json`,'utf8')).records);
const parents=new Map(JSON.parse(fs.readFileSync(source,'utf8')).map(r=>[String(r.id),r]));
const canon=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[-‐‑–—]/g,' ').replace(/\s+/g,' ').trim();
function parentId(id){if(!id)return null;if(id.startsWith('mhlw-'))return String(Number(id.slice(5)));if(id.startsWith('nando-'))return id.slice(6);return null;}
const cached=new Map();
function read(code){
 if(cached.has(code))return cached.get(code);
 const fname=path.join(root,`ORPHApacket_${code}.json`);
 if(!fs.existsSync(fname)){cached.set(code,null);return null;}
 const packet=JSON.parse(fs.readFileSync(fname,'utf8')).Orphapacket;
 const links=[];
 const sourceParentGroups=Array.isArray(packet.Parents)?packet.Parents:
   packet.Parents?[packet.Parents]:[];
 for(const r of sourceParentGroups)for(const p of (Array.isArray(r.Parent)?r.Parent:[r.Parent])){
  if(p&&p.ORPHAcode&&p.Label)links.push({code:Number(p.ORPHAcode),label:p.Label});
 }
 const data={code:Number(packet.ORPHAcode),label:packet.Label,type:packet.DisorderType?.value||'',links};
 cached.set(code,data);return data;
}
const results=[];
for(const rec of items){
 const d=byId.get(rec.disease_id);
 if(!d)throw Error('Missing local '+rec.disease_id);
 const directParent=parents.get(parentId(d.parent_disease_id));
 const expected=canon(directParent?.name_en||byId.get(d.parent_disease_id)?.name_en);
 let frontier=[{code:Number(rec.orpha_code),depth:0,via:[]}],seen=new Set(frontier.map(x=>x.code));
 const matches=[],visited=[];
 while(frontier.length){
  const current=frontier.shift();
  const node=read(current.code);
  if(!node)continue;
  if(current.depth>0){
   visited.push({depth:current.depth,code:node.code,label:node.label});
   if(expected && expected===canon(node.label))matches.push({depth:current.depth,code:node.code,label:node.label,via:current.via});
  }
  if(current.depth===3)continue;
  for(const link of node.links){
    if(!seen.has(link.code)){seen.add(link.code);frontier.push({code:link.code,depth:current.depth+1,via:[...current.via,link.label]});}
  }
 }
 const minDepth=matches.length?Math.min(...matches.map(x=>x.depth)):null;
 results.push({
   disease_id:rec.disease_id,orpha_code:Number(rec.orpha_code),name_en:d.name_en,
   nando_parent_en:directParent?.name_en||'',
   concept_kind:d.concept_kind,orpha_type:read(Number(rec.orpha_code))?.type,
   official_preferred_label_equal:canon(d.name_en)===canon(rec.original_label),
   min_parent_match_depth:minDepth,
   matched_ancestors:matches,
   ancestors_examined:visited.length,
   curator_review:'pending'
 });
}
results.sort((a,b)=>(a.min_parent_match_depth??99)-(b.min_parent_match_depth??99)||a.disease_id.localeCompare(b.disease_id));
const histogram={};
for(const r of results){const key=String(r.min_parent_match_depth??'not_found');histogram[key]=(histogram[key]||0)+1;}
const summary={total:results.length,at_depth:histogram,explicit_parent_matches:results.filter(x=>x.min_parent_match_depth!==null).length,auto_approved:0,
 note:'Matching parents are corroborating evidence, not complete proof that disease concepts are equivalent'};
fs.writeFileSync('data/orpha_ancestor_chain_audit_v1.json',JSON.stringify({summary,records:results},null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
