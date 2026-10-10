'use strict';
/**
 * STRICT, NON-CLINICALLY-REVIEWED Orphanet HPO staging.
 * Copyright source Orphanet / INSERM, CC BY 4.0.
 * Usage: node scripts/stage_orpha_hpo_exact.cjs /path/to/orphapacket/json
 * Read-only to Supabase: this outputs snapshot and exploratory coords only.
 * Only unique exact English PREFERRED labels, subtype excluded, with HPO evidence.
 */
const fs=require('node:fs'),path=require('node:path');
const dir=process.argv[2];
if(!dir||!fs.existsSync(dir))throw new Error('Orphapacket json dir required');
const upstream=process.env.ORPHAPACKET_COMMIT||'unversioned';
const all=JSON.parse(fs.readFileSync('data/orpha_matching_candidates.json','utf8'));
const names=JSON.parse(fs.readFileSync('data/orpha_matching_names_public.json','utf8'));
const srcById=new Map(names.rows.map(d=>[d.id,d]));
const norm=s=>String(s||'').normalize('NFKC').trim().toLowerCase().replace(/\s+/g,' ');
const chosen=all.records.filter(r=>r.status==='unique_exact_candidate' &&
 r.candidate?.match==='exact_label' && r.candidate?.type==='Disease' && r.candidate?.hpo>0);
if(chosen.length<100)throw new Error('Unexpectedly sparse exact candidates: '+chosen.length);
const ids=new Set(),codes=new Set();
const rows=[],audit={missing:[],identity_conflict:[],ambiguous_phenotype_ids:0};
for(const row of chosen) {
 const code=Number(row.candidate.code);
 const fullname=path.join(dir,'ORPHApacket_'+code+'.json');
 if(!fs.existsSync(fullname)){audit.missing.push(code);continue;}
 const p=JSON.parse(fs.readFileSync(fullname,'utf8')).Orphapacket;
 const catalog=srcById.get(row.id);
 if(!p||!catalog || Number(p.ORPHAcode)!==code || 
 norm(p.Label)!==norm(catalog.name_en) || p.DisorderType?.value!=='Disease'){
   audit.identity_conflict.push({id:row.id,code,catalog:catalog?.name_en,source:p?.Label});
   continue;
 }
 if(ids.has(row.id)||codes.has(code))throw Error('Unresolved duplicate ORPHA: '+row.id);
 ids.add(row.id);codes.add(code);
 const terms=new Map();
 const conflicts=[];
 for(const h of Array.isArray(p.Phenotypes)?p.Phenotypes:[]){
   const q=h?.Phenotype||h;
   const id=q?.HPOId;
   if(typeof id!=='string'||!/^HP:\d{7}$/.test(id))continue;
   const entry={id,label:q.HPOTerm||'',frequency:q.HPOFrequency||''};
   if(terms.has(id)){conflicts.push({id,first:terms.get(id).frequency,next:entry.frequency});continue;}
   terms.set(id,entry);
 }
 audit.ambiguous_phenotype_ids+=conflicts.length;
 const genes=[];
 for(const g of Array.isArray(p.Genes)?p.Genes:[]){
   const x=g?.Gene||g;
   if(typeof x?.Symbol!=='string'||!x.Symbol.trim())continue;
   const association=String(x.DisorderGeneAssociationType||'unknown');
   // Source distinguishes disease-causing from modifying/susceptibility.
   genes.push({symbol:x.Symbol.trim(),association});
 }
 const strings=(src,key,part)=>Array.isArray(src?.[key])?src[key].flatMap(v=>{
   const n=v?.[part]??v;
   return Array.isArray(n)?n.map(z=>String(z.value||'').trim()):[String(n?.value||'').trim()];
 }).filter(Boolean):[];
 const inheritance=strings(p,'TypeOfInheritances','TypeOfInheritance');
 const onset=strings(p,'AverageAgeOfOnsets','AverageAgeOfOnset');
 rows.push({
   id:row.id,code,label:p.Label,source_name_en:catalog.name_en,
   decision:'PROVISIONAL_EXACT_LABEL_NOT_MEDICALLY_REVIEWED',
   phenotypes:[...terms.values()],genes,inheritance,onset,
   phenotype_conflicts:conflicts,source_created:p.creationDate||null
 });
}
if(rows.length!==chosen.length || audit.identity_conflict.length||audit.missing.length)
 throw new Error('Source changed: '+JSON.stringify(audit).slice(0,400));
const seen=new Map();
let phenotypeAnnotations=0,genes=0;
for(const r of rows){
 phenotypeAnnotations+=r.phenotypes.length;genes+=r.genes.length;
 if(seen.has(r.code))throw Error('Duplicate code');seen.set(r.code,r.id);
}
const meta={source:'Orphanet/ORPHApacket',
 source_url:'https://github.com/Orphanet/orphapacket',
 upstream_commit:upstream,
 license:'CC BY 4.0',
 coverage:rows.length,
 phenotypes:phenotypeAnnotations,genes,
 duplicate_phenotype_ids:audit.ambiguous_phenotype_ids,
 status:'UNREVIEWED_PROVISIONAL_MATCHES',
 note:'Matching by unique exact preferred English disease label does not guarantee medical equivalence. Not available in patient-facing search or clinical advice.'};
const out={meta,rows:rows.sort((a,b)=>a.id.localeCompare(b.id))};
fs.writeFileSync('data/orphadata_exact_hpo_stage.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(meta,null,2));
