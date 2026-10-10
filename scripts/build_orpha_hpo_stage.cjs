'use strict';
/* Exploratory PCA/FCM on strictly preferred-label exact ORPHA candidate HPO/Gene data.
 * IMPORTANT: candidates NOT medically validated, and unreported symptoms != absent.
 * Do NOT copy into verified disease_orpha_mappings.
 */
const fs=require('node:fs'),{embedding}=require('./build_hpo_pilot.cjs');
const input=JSON.parse(fs.readFileSync('data/orphadata_exact_hpo_stage.json','utf8'));
const eligible=input.rows.filter(r=>r.phenotypes.length>0);
if(eligible.length<100||eligible.length!==input.meta.coverage)
 throw new Error('Insufficient staged HPO evidence');
const result=embedding(eligible);
result.meta.source='Unreviewed unique English preferred-label Orphapacket candidates';
result.meta.source_commit=input.meta.upstream_commit;
result.meta.review_status='PROVISIONAL_DO_NOT_INTERPRET_AS_VALIDATED_CLINICAL_DISTANCE';
for(const p of result.coordinates)
 p.model_version='orpha-exact-label-provisional-hpo-pca-fcm-v1';
if(result.coordinates.length!==eligible.length ||
 result.coordinates.some(x=>![x.x,x.y,x.z,x.membership].every(Number.isFinite)))
 throw new Error('Invalid coordinates');
fs.writeFileSync('data/clinical_hpo_pca_fcm_stage.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({count:result.meta.n,dimensions:result.meta.dims,
 hpo_terms:result.meta.hpoTermCount,causal_genes:result.meta.causalGeneCount,
 variance:result.meta.explainedKernelVariance,clusters:result.meta.k},null,2));
