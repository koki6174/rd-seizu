'use strict';
/**
 * Review an exact English-label ORPHA candidate against independent
 * Orphanet DisorderType and Parents hierarchy. NEVER approves a match.
 *
 * node scripts/audit_orpha_parent_hierarchy.cjs /tmp/rd-orphapacket/json
 */
const fs=require('node:fs'),path=require('node:path');
const dir=process.argv[2],nandoPath=process.argv[3];
if(!dir||!fs.existsSync(dir))throw Error('Orphapacket json directory required');
if(!nandoPath||!fs.existsSync(nandoPath))throw Error('Official NANDO nanbyo.json path required');
const nandoRows=JSON.parse(fs.readFileSync(nandoPath,'utf8'));
const nandoEnglish=new Map(nandoRows.map(x=>[String(x.id),String(x.name_en||'')]));
const nandoId=localId=>localId?.startsWith('nando-')?localId.slice(6)
 :localId?.startsWith('mhlw-')?String(Number(localId.slice(5))):null;
const labels=JSON.parse(fs.readFileSync('data/orpha_matching_names_public.json','utf8')).rows;
const byId=new Map(labels.map(d=>[d.id,d]));
const verified=new Map([1,2,3].flatMap(i=>
 JSON.parse(fs.readFileSync(`data/orphadata_verified_batch_0${i}.json`,'utf8')).rows
  .map(r=>[r.id,Number(r.code)])));
const staged=[1,2,3,4,5,6,7].flatMap(i=>
 JSON.parse(fs.readFileSync(`data/orpha_hpo_exact_source_0${i}.json`,'utf8')).records);
const normalize=s=>String(s||'').normalize('NFKC').toLowerCase().trim().replace(/\s+/g,' ');
const cleanParentList=roots=>{
 const collection=[];
 for(const group of roots||[]){
  const entries=group.Parent||group.parent||[];
  for(const item of (Array.isArray(entries)?entries:[entries])){
   if(item?.Label)collection.push({orpha_code:Number(item.ORPHAcode),label:item.Label});
  }
 }
 return collection;
};
const result=[];
for(const c of staged){
 const local=byId.get(c.disease_id);
 if(!local)throw Error('Unknown local disease '+c.disease_id);
 const code=Number(c.orpha_code);
 const source=JSON.parse(fs.readFileSync(path.join(dir,`ORPHApacket_${code}.json`),'utf8')).Orphapacket;
 if(Number(source.ORPHAcode)!==code || normalize(source.Label)!==normalize(c.original_label)){
  throw Error('Source mismatch at ORPHA:'+code);
 }
 const parents=cleanParentList(source.Parents);
 const parent=local.parent_disease_id?byId.get(local.parent_disease_id):null;
 const originalNandoEnglish=nandoEnglish.get(nandoId(local.parent_disease_id))||'';
 const comparableParent=normalize(parent?.name_en||originalNandoEnglish);
 const parentExact=Boolean(comparableParent) &&
  parents.some(p=>normalize(p.label)===comparableParent);
 const orphaType=String(source.DisorderType?.value||'unknown');
 const isLocalSubtype=local.concept_kind==='disease_subtype';
 const externalIdentity=verified.get(c.disease_id);
 if(externalIdentity && externalIdentity!==code)throw Error('Curated crosswalk contradiction '+c.disease_id);
 const warnings=[];
 if(isLocalSubtype&&orphaType==='Disease')warnings.push('local_subtype_maps_to_orpha_disease');
 if(isLocalSubtype&&!comparableParent)warnings.push('local_parent_without_english_label');
 if(isLocalSubtype&&comparableParent&&!parentExact)warnings.push('local_parent_not_exact_in_orpha_parents');
 if(!isLocalSubtype&&orphaType.includes('subtype'))warnings.push('local_named_disease_maps_to_orpha_subtype');
 const record={
  disease_id:c.disease_id, name_ja:local.name_ja,
  parent_disease_id:local.parent_disease_id||null,
  parent_english:parent?.name_en||originalNandoEnglish||null, orpha_code:code,
  orpha_url:`https://www.orpha.net/en/disease/detail/${code}`,
  orpha_label:source.Label, orpha_type:orphaType,
  local_concept_kind:local.concept_kind,
  source_parents:parents,
  parent_exact_match:parentExact,
  existing_curated_link:Boolean(externalIdentity),
  warning_flags:warnings,
  priority: warnings.length ? 'review_first' : 'standard_review',
  review_status:externalIdentity?'already_curated':'pending_review'
 };
 result.push(record);
}
result.sort((a,b)=>Number(b.warning_flags.length)-Number(a.warning_flags.length)||
 a.disease_id.localeCompare(b.disease_id));
const stats={
 total:result.length,
 curated_overlap:result.filter(r=>r.existing_curated_link).length,
 pending:result.filter(r=>!r.existing_curated_link).length,
 subtype_to_orpha_disease:result.filter(r=>r.warning_flags.includes('local_subtype_maps_to_orpha_disease')).length,
 parent_name_exact:result.filter(r=>r.parent_exact_match).length,
 no_exact_parent:result.filter(r=>r.warning_flags.includes('local_parent_not_exact_in_orpha_parents')).length,
 source_disorder_types:Object.fromEntries([...new Set(result.map(r=>r.orpha_type))].sort().map(x=>[x,result.filter(r=>r.orpha_type===x).length])),
 auto_approved:0,
 note:'Flags indicate need for concept-level review, NOT proof of mismatch. Unreviewed candidates must not enter public clinical embeddings.'
};
fs.writeFileSync('data/orpha_hierarchy_review_queue_v1.json',JSON.stringify({stats,records:result},null,2)+'\n');
console.log(JSON.stringify(stats,null,2));
