-- Four named catalog diseases have explicit source-linked historical NANDO identities.
-- Existing NANDO taxonomy source/legacy crosswalk confirms each mapping.
insert into public.disease_feature_profiles
(disease_id,nando_class_id,nando_source_id,class_source_url,source_version,updated_at)
values
('duchenne-muscular-dystrophy',1,'113-1-1','https://github.com/NanbyoData/nando/blob/master/data/nanbyo.json','NANDO historical English/JA disease match',now()),
('fabry-disease',2,'19-32','https://github.com/NanbyoData/nando/blob/master/data/nanbyo.json','NANDO historical exact English disease match',now()),
('gaucher-disease',2,'19-1','https://github.com/NanbyoData/nando/blob/master/data/nanbyo.json','NANDO historical exact English disease match',now()),
('pompe-disease',2,'19-27','https://github.com/NanbyoData/nando/blob/master/data/nanbyo.json','NANDO historical exact English disease match',now())
on conflict(disease_id) do update set
 nando_class_id=excluded.nando_class_id,
 nando_source_id=excluded.nando_source_id,
 class_source_url=excluded.class_source_url,
 source_version=excluded.source_version,
 updated_at=now();
