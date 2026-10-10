-- HPO Gene Onset UMAP clinical positions, source-validated 50 ORPHA concepts.
-- Do not modify taxonomy map, entries, or any pending candidate.
with positions(disease_id,orpha_code,x,y,z,fcm_cluster,membership,annotated_hpo,annotated_causal_genes,model_version) as (values
('als',803,3.67042,-2.76367,2.93387,4,0.70557,47,23,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('duchenne-muscular-dystrophy',98896,0.00312,-1.65079,4.14127,5,0.87858,15,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('fabry-disease',324,-0.64073,1.7015,0.8509,5,0.29752,76,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('gaucher-disease',355,-1.20407,-0.09154,-2.55862,3,0.59721,93,0,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('huntington-disease',399,3.40311,-4.00595,1.76031,4,0.90166,53,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-106-2',575,-0.37592,1.66568,-0.38196,3,0.24463,37,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-111-2',597,1.33405,-3.0189,5.18884,5,0.53846,25,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-111-6',2020,0.70658,-1.5121,5.51261,5,0.81775,59,8,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-113-1-2',98895,-0.42472,0.92435,3.29027,5,0.69765,16,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-113-4',261,1.81133,-1.66929,5.00052,5,0.75268,44,0,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-113-5',270,2.99141,-1.78427,4.58958,5,0.53544,26,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-120-12-1',71517,3.0615,-4.43723,3.115,4,0.91261,20,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-18-2-1',98757,0.93547,-4.20379,2.0124,4,0.76556,16,0,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-18-2-2',98758,1.7083,-5.24057,2.56853,4,0.85706,19,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-18-2-5',98755,1.9038,-4.78173,1.21719,4,0.83815,40,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-18-3-1',96,-0.71595,-4.18999,0.40083,3,0.40329,37,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-19-1-1',77259,-0.73108,-1.05619,-4.08632,3,0.56891,49,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-19-1-2',77260,-2.16032,-3.01141,-3.66748,3,0.82924,33,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-19-1-3',77261,-1.03767,-2.77908,-3.50542,3,0.78482,40,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-234-1-1',912,-3.82126,-3.77006,-0.19899,3,0.64643,55,13,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-234-1-2',44,-3.42436,-2.8417,-1.00986,3,0.8187,29,13,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-234-1-3',772,-3.00239,-4.33969,-0.42587,3,0.65912,27,13,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-234-2-1',2971,-3.80854,-3.84934,-1.4336,3,0.75155,29,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-234-6',926,-0.62937,-0.95696,-3.49531,3,0.59835,17,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-254-1',79276,3.56116,0.94045,-1.85668,2,0.83308,51,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-254-2',79273,4.4339,0.26892,-2.48023,2,0.86415,33,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-254-3',79473,3.5072,0.81743,-3.1822,2,0.98946,48,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-254-5',101330,4.356,0.8087,-4.12609,2,0.9016,39,0,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-254-6',79277,2.75006,0.64347,-4.24489,2,0.92755,50,2,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-254-8',95159,3.23674,-0.05733,-4.55131,2,0.88963,37,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-282-3',98870,-0.58861,2.29494,-2.68296,2,0.32283,20,2,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-30-1',45448,0.64579,0.11779,3.83748,5,0.92419,25,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-30-3',98897,1.27512,0.06745,5.04337,5,0.86407,36,6,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-309-2',501,-0.15463,-3.27919,-2.01328,3,0.68457,35,2,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-34-1',636,-1.74427,-1.36234,-0.30686,3,0.68829,77,0,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-61-2',56425,-1.19674,4.9197,-0.30114,1,0.85706,14,0,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-61-4',90036,-1.72392,4.24424,0.06106,1,0.74322,14,0,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-61-5',1959,-1.05445,5.94164,0.86699,1,0.87606,13,0,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-65-10',906,0.10702,5.40707,0.2059,1,0.74757,57,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-65-11',100,-2.32136,-2.16219,-1.53595,3,0.97099,37,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-65-21',79124,-1.91351,-1.87076,-4.39788,3,0.70901,39,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-65-43',1334,-2.23353,1.19231,-0.29284,3,0.36299,31,5,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-85-1',2032,-2.05493,7.23307,-1.57846,1,0.92531,20,0,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-85-2-2',79126,-3.17084,7.96672,-0.99189,1,0.86849,33,0,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-85-2-3',1302,-1.89021,8.52963,-0.75847,1,0.86391,27,0,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-85-2-6',79128,-2.20728,7.36803,0.00946,1,0.94837,34,0,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-87-2',199241,-3.55375,7.4273,-0.5546,1,0.87634,25,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('nando-9-1',2388,4.06788,-4.32983,2.61922,4,0.83038,86,1,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('pompe-disease',365,-0.25665,-0.28848,2.78489,5,0.75806,72,0,'clinical-hpo-gene-inheritance-onset-3d-v3-umap'),
('primary-biliary-cholangitis',186,-1.42891,4.82398,-1.39132,1,0.81878,41,0,'clinical-hpo-gene-inheritance-onset-3d-v3-umap')
),
crosswalk_valid as (
 select p.* from positions p inner join public.disease_orpha_mappings c
 on p.disease_id=c.disease_id and p.orpha_code=c.orpha_code
),
verified_total as (select count(*) count_valid from crosswalk_valid)
insert into public.disease_clinical_embedding_pilot
(disease_id,x,y,z,fcm_cluster,membership,annotated_hpo,annotated_causal_genes,model_version)
select disease_id,x,y,z,fcm_cluster,membership,annotated_hpo,annotated_causal_genes,model_version
from crosswalk_valid where (select count_valid from verified_total)=50
on conflict(disease_id) do update set
 x=excluded.x,y=excluded.y,z=excluded.z,
 fcm_cluster=excluded.fcm_cluster,
 membership=excluded.membership,
 annotated_hpo=excluded.annotated_hpo,
 annotated_causal_genes=excluded.annotated_causal_genes,
 model_version=excluded.model_version;
