-- Reviewed ORPHA disease identities only; model comparison source:
-- data/clinical_verified_comparison_v1.json
-- 17 reviewed / 133 separate unreviewed; no participant records modified.
do $$
declare matching integer;
begin
 with mapping(disease_id,orpha_code) as (values
 ('als',803),
 ('duchenne-muscular-dystrophy',98896),
 ('fabry-disease',324),
 ('gaucher-disease',355),
 ('huntington-disease',399),
 ('nando-120-12-1',71517),
 ('nando-18-2-1',98757),
 ('nando-18-2-2',98758),
 ('nando-18-2-5',98755),
 ('nando-18-3-1',96),
 ('nando-19-1-1',77259),
 ('nando-19-1-2',77260),
 ('nando-19-1-3',77261),
 ('nando-34-1',636),
 ('nando-65-11',100),
 ('pompe-disease',365),
 ('primary-biliary-cholangitis',186))
 select count(*) into matching from mapping x
 join public.disease_orpha_mappings m
 on m.disease_id=x.disease_id and m.orpha_code=x.orpha_code;
 if matching<>17 then raise exception 'Refusing to update 3D coordinates: % reviewed crosswalk IDs matched instead of 17',matching; end if;
end $$;

with prepared(disease_id,orpha_code,x,y,z,fcm_cluster,membership,annotated_hpo,annotated_causal_genes,model_version) as
(values
('als',803,2.63573,0.49775,-6.1897,1,0.9194,47,23,'clinical-hpo-gene-inheritance-onset-3d-v1-umap'),
('duchenne-muscular-dystrophy',98896,-2.13744,0.02893,-2.82365,2,0.86618,15,1,'clinical-hpo-gene-inheritance-onset-3d-v1-umap'),
('fabry-disease',324,-2.58772,-2.21953,6.84306,3,0.93077,76,1,'clinical-hpo-gene-inheritance-onset-3d-v1-umap'),
('gaucher-disease',355,-1.40997,-1.17548,7.55859,3,0.98807,93,0,'clinical-hpo-gene-inheritance-onset-3d-v1-umap'),
('huntington-disease',399,1.23961,1.34303,-5.82373,1,0.76492,53,1,'clinical-hpo-gene-inheritance-onset-3d-v1-umap'),
('nando-120-12-1',71517,3.39544,-1.18703,-5.56619,1,0.92112,20,1,'clinical-hpo-gene-inheritance-onset-3d-v1-umap'),
('nando-18-2-1',98757,0.52583,-1.07119,-3.86011,1,0.56961,16,0,'clinical-hpo-gene-inheritance-onset-3d-v1-umap'),
('nando-18-2-2',98758,2.40244,-1.84085,-4.74072,1,0.88921,19,1,'clinical-hpo-gene-inheritance-onset-3d-v1-umap'),
('nando-18-2-5',98755,0.08092,2.0392,-4.42601,2,0.63986,40,1,'clinical-hpo-gene-inheritance-onset-3d-v1-umap'),
('nando-18-3-1',96,-0.45469,1.54337,-2.49897,2,0.96894,37,1,'clinical-hpo-gene-inheritance-onset-3d-v1-umap'),
('nando-19-1-1',77259,-0.84924,0.1604,7.31165,3,0.98788,49,1,'clinical-hpo-gene-inheritance-onset-3d-v1-umap'),
('nando-19-1-2',77260,-0.18866,0.8697,4.95745,3,0.83931,33,1,'clinical-hpo-gene-inheritance-onset-3d-v1-umap'),
('nando-19-1-3',77261,-0.3561,0.05079,5.96271,3,0.95679,40,1,'clinical-hpo-gene-inheritance-onset-3d-v1-umap'),
('nando-34-1',636,1.05154,-0.7436,-2.40662,2,0.60545,77,0,'clinical-hpo-gene-inheritance-onset-3d-v1-umap'),
('nando-65-11',100,0.61035,1.19582,-1.01729,2,0.81787,37,1,'clinical-hpo-gene-inheritance-onset-3d-v1-umap'),
('pompe-disease',365,-2.14342,1.18936,-1.9533,2,0.8996,72,0,'clinical-hpo-gene-inheritance-onset-3d-v1-umap'),
('primary-biliary-cholangitis',186,-1.81462,-0.68067,8.67285,3,0.96019,41,0,'clinical-hpo-gene-inheritance-onset-3d-v1-umap')
)
insert into public.disease_clinical_embedding_pilot
(disease_id,x,y,z,fcm_cluster,membership,annotated_hpo,annotated_causal_genes,model_version)
select prepared.disease_id,prepared.x,prepared.y,prepared.z,
 prepared.fcm_cluster,prepared.membership,prepared.annotated_hpo,
 prepared.annotated_causal_genes,prepared.model_version
from prepared
join public.disease_orpha_mappings m on
 m.disease_id=prepared.disease_id and m.orpha_code=prepared.orpha_code
on conflict(disease_id) do update set
 x=excluded.x,y=excluded.y,z=excluded.z,
 fcm_cluster=excluded.fcm_cluster,
 membership=excluded.membership,
 annotated_hpo=excluded.annotated_hpo,
 annotated_causal_genes=excluded.annotated_causal_genes,
 model_version=excluded.model_version;
