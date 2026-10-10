-- Results from scripts/build_hpo_pilot.cjs; every input mapped by verified ORPHA ID.
insert into public.disease_clinical_embedding_pilot
(disease_id,x,y,z,fcm_cluster,membership,annotated_hpo,annotated_causal_genes,model_version)
values
('als',1.27248,0.62516,2.89595,1,0.8866,47,23,'verified-orphadata-hpo-pca-fcm-v0'),
('duchenne-muscular-dystrophy',1.15188,3.18724,0.21747,4,0.86,15,1,'verified-orphadata-hpo-pca-fcm-v0'),
('fabry-disease',-0.53185,2.854,-0.22767,4,0.9022,76,1,'verified-orphadata-hpo-pca-fcm-v0'),
('gaucher-disease',-3.87573,-0.55472,-0.17869,2,0.9808,93,0,'verified-orphadata-hpo-pca-fcm-v0'),
('huntington-disease',1.63828,-1.69165,0.78229,3,0.4489,53,1,'verified-orphadata-hpo-pca-fcm-v0'),
('nando-120-12-1',1.54843,-0.63803,3.43545,1,0.9303,20,1,'verified-orphadata-hpo-pca-fcm-v0'),
('nando-18-2-1',2.26029,-1.63102,-1.47065,3,0.9767,16,0,'verified-orphadata-hpo-pca-fcm-v0'),
('nando-18-2-2',2.101,-2.56153,0.96666,3,0.4536,19,1,'verified-orphadata-hpo-pca-fcm-v0'),
('nando-18-2-5',2.16476,-1.77075,-0.89625,3,0.9427,40,1,'verified-orphadata-hpo-pca-fcm-v0'),
('nando-18-3-1',1.86433,-0.64979,-3.10283,3,0.7403,37,1,'verified-orphadata-hpo-pca-fcm-v0'),
('nando-19-1-1',-4.12993,-0.89176,0.18325,2,0.9785,49,1,'verified-orphadata-hpo-pca-fcm-v0'),
('nando-19-1-2',-2.18199,-1.21797,0.69122,2,0.7041,33,1,'verified-orphadata-hpo-pca-fcm-v0'),
('nando-19-1-3',-4.00548,-1.21812,-0.28965,2,0.9754,40,1,'verified-orphadata-hpo-pca-fcm-v0'),
('nando-34-1',0.26801,1.79545,-2.11659,4,0.5743,77,0,'verified-orphadata-hpo-pca-fcm-v0'),
('nando-65-11',0.29381,0.44711,-2.79255,3,0.4497,37,1,'verified-orphadata-hpo-pca-fcm-v0'),
('pompe-disease',0.48506,2.73075,0.95923,4,0.8708,72,0,'verified-orphadata-hpo-pca-fcm-v0'),
('primary-biliary-cholangitis',-0.32333,1.18563,0.94335,4,0.5936,41,0,'verified-orphadata-hpo-pca-fcm-v0')
on conflict (disease_id) do update set
 x=excluded.x,y=excluded.y,z=excluded.z,
 fcm_cluster=excluded.fcm_cluster,membership=excluded.membership,
 annotated_hpo=excluded.annotated_hpo,annotated_causal_genes=excluded.annotated_causal_genes,
 model_version=excluded.model_version;
