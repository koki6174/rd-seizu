-- Research-stage 3D clinical UMAP+FCM positions on 39 source-corroborated
-- ORPHA mappings. Unreviewed 100 candidates never leave their staging table.
-- No updates to full-catalog taxonomy coordinates or participant records.
do $$
declare verified_count integer;
begin
 with mapped(disease_id,orpha_code) as (values
 ('als',803),
 ('duchenne-muscular-dystrophy',98896),
 ('fabry-disease',324),
 ('gaucher-disease',355),
 ('huntington-disease',399),
 ('nando-111-2',597),
 ('nando-111-6',2020),
 ('nando-113-1-2',98895),
 ('nando-113-4',261),
 ('nando-113-5',270),
 ('nando-120-12-1',71517),
 ('nando-18-2-1',98757),
 ('nando-18-2-2',98758),
 ('nando-18-2-5',98755),
 ('nando-18-3-1',96),
 ('nando-19-1-1',77259),
 ('nando-19-1-2',77260),
 ('nando-19-1-3',77261),
 ('nando-254-1',79276),
 ('nando-254-2',79273),
 ('nando-254-3',79473),
 ('nando-254-5',101330),
 ('nando-254-6',79277),
 ('nando-254-8',95159),
 ('nando-282-3',98870),
 ('nando-30-1',45448),
 ('nando-30-3',98897),
 ('nando-34-1',636),
 ('nando-61-2',56425),
 ('nando-61-4',90036),
 ('nando-61-5',1959),
 ('nando-65-11',100),
 ('nando-85-1',2032),
 ('nando-85-2-2',79126),
 ('nando-85-2-3',1302),
 ('nando-85-2-6',79128),
 ('nando-9-1',2388),
 ('pompe-disease',365),
 ('primary-biliary-cholangitis',186)
 )
 select count(*) into verified_count from mapped m
 join public.disease_orpha_mappings v
  on v.disease_id=m.disease_id and v.orpha_code=m.orpha_code;
 if verified_count<>39 then
  raise exception 'Refusing to install clinical map: expected 39 source corroborated mappings, got %',verified_count;
 end if;
end $$;

with coordinates(disease_id,orpha_code,x,y,z,fcm_cluster,membership,annotated_hpo,annotated_causal_genes,model_version) as
(values
 ('als',803,-1.8894,4.04791,2.62786,5,0.848,47,23,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('duchenne-muscular-dystrophy',98896,-3.74022,-0.07624,0.78109,1,0.86914,15,1,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('fabry-disease',324,-0.0351,-1.19583,-0.61904,2,0.50654,76,1,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('gaucher-disease',355,0.01429,-0.30284,-3.06054,2,0.95437,93,0,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('huntington-disease',399,0.27345,4.04677,1.97852,5,0.90298,53,1,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-111-2',597,-5.21101,1.02101,1.14578,1,0.82521,25,1,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-111-6',2020,-4.85118,0.55794,2.35921,1,0.90305,59,8,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-113-1-2',98895,-1.76549,-1.5048,1.19698,1,0.50575,16,1,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-113-4',261,-4.33641,1.61097,1.57098,1,0.8725,44,0,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-113-5',270,-4.01712,2.36448,2.69779,1,0.69696,26,1,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-120-12-1',71517,-1.4723,5.30266,2.70384,5,0.85747,20,1,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-18-2-1',98757,-1.34852,3.38835,0.36827,5,0.71386,16,0,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-18-2-2',98758,-1.0339,5.15033,1.34621,5,0.91567,19,1,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-18-2-5',98755,-0.05187,3.92588,0.8032,5,0.85247,40,1,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-18-3-1',96,-0.55788,2.68698,-0.83261,5,0.38179,37,1,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-19-1-1',77259,0.2118,0.06847,-4.7105,2,0.78091,49,1,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-19-1-2',77260,-1.54193,1.07536,-3.48409,2,0.83342,33,1,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-19-1-3',77261,-0.97114,0.10365,-3.86486,2,0.91731,40,1,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-254-1',79276,4.69073,1.58509,-3.13216,3,0.82735,51,1,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-254-2',79273,4.72614,1.57986,-3.96202,3,0.95061,33,1,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-254-3',79473,5.07727,2.31026,-4.42589,3,0.95634,48,1,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-254-5',101330,5.26011,1.72198,-5.56069,3,0.95131,39,0,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-254-6',79277,4.17261,1.00446,-5.69055,3,0.92069,50,2,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-254-8',95159,3.58275,2.06603,-6.43403,3,0.82217,37,1,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-282-3',98870,0.38436,-1.83228,-3.35343,2,0.70014,20,2,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-30-1',45448,-2.37177,-0.65865,2.58613,1,0.72246,25,1,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-30-3',98897,-3.47576,0.15784,3.34386,1,0.8291,36,6,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-34-1',636,0.74901,1.79113,-2.22575,2,0.65601,77,0,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-61-2',56425,0.70756,-4.81067,3.09147,4,0.89251,14,0,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-61-4',90036,0.68831,-4.72543,1.77016,4,0.79351,14,0,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-61-5',1959,1.63984,-5.47415,2.4571,4,0.9697,13,0,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-65-11',100,-0.68513,1.49773,-2.36816,2,0.80708,37,1,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-85-1',2032,2.07315,-6.63186,3.94111,4,0.95306,20,0,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-85-2-2',79126,2.06433,-7.69865,3.55875,4,0.9051,33,0,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-85-2-3',1302,3.00594,-6.74104,3.35095,4,0.91744,27,0,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-85-2-6',79128,2.2272,-6.10331,3.39085,4,0.98013,34,0,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('nando-9-1',2388,-0.3596,4.21582,3.32006,5,0.84471,86,1,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('pompe-disease',365,-1.78917,0.12011,0.56775,1,0.53941,72,0,'clinical-hpo-gene-inheritance-onset-3d-v2-umap'),
 ('primary-biliary-cholangitis',186,-0.04388,-5.64543,2.76632,4,0.87132,41,0,'clinical-hpo-gene-inheritance-onset-3d-v2-umap')
)
insert into public.disease_clinical_embedding_pilot
(disease_id,x,y,z,fcm_cluster,membership,annotated_hpo,annotated_causal_genes,model_version)
select p.disease_id,p.x,p.y,p.z,p.fcm_cluster,p.membership,p.annotated_hpo,
 p.annotated_causal_genes,p.model_version
from coordinates p
join public.disease_orpha_mappings m
on m.disease_id=p.disease_id and m.orpha_code=p.orpha_code
on conflict(disease_id) do update set
 x=excluded.x,y=excluded.y,z=excluded.z,
 fcm_cluster=excluded.fcm_cluster,
 membership=excluded.membership,
 annotated_hpo=excluded.annotated_hpo,
 annotated_causal_genes=excluded.annotated_causal_genes,
 model_version=excluded.model_version;
