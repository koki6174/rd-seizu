#!/usr/bin/env python3
"""Compare clinical 3D PCA/UMAP and fuzzy c-means on curated vs pending ORPHA cohorts.

Input is source-backed Orphanet/Orphadata records already versioned in this repo.
- Curated cohort: 17 independently reviewed links; eligible for /lab/ clinical preview.
- Staging cohort: 133 exact English label matches; not automatically medically verified.
- HPO "not annotated" is UNKNOWN, never interpreted as a negative clinical observation.
- No source labels, public catalog IDs or patient participation records are modified.

Requires: numpy, scipy, scikit-learn, umap-learn.
"""
from __future__ import annotations

import argparse
import json
import math
from collections import Counter
from pathlib import Path

import numpy as np
from scipy.spatial import procrustes
from sklearn.decomposition import PCA
from sklearn.metrics import adjusted_rand_score, pairwise_distances, silhouette_score
from sklearn.manifold import trustworthiness
from sklearn.preprocessing import normalize
import umap

SEED = 20261010
BLOCK_WEIGHTS = {"phenotype": 1.0, "causal_gene": 0.40,
                 "inheritance": 0.22, "onset": 0.18}
MODEL_VERSION = "clinical-hpo-gene-inheritance-onset-3d-v1"
FREQUENCIES = (
    ("obligate", 1.0),
    ("very frequent", .90),
    ("frequent", .60),
    ("occasional", .25),
    ("very rare", .07),
    ("excluded", 0.0),
)

def term_frequency(value):
    s = str(value or "").casefold()
    for name, weight in FREQUENCIES:
        if name in s:
            return weight
    return .35  # annotated positive, but no frequency estimate available

def clean_unique(records):
    output = {}
    orpha_to_id = {}
    for row in records:
        id_ = row["id"]
        code = str(row["orpha"])
        if id_ in output or (code in orpha_to_id and orpha_to_id[code] != id_):
            raise ValueError(f"Crosswalk identity collision {id_} and ORPHA:{code}")
        output[id_] = row
        orpha_to_id[code] = id_
    return [output[k] for k in sorted(output)]

def read_verified(base):
    rows = []
    for n in (1, 2, 3):
        path = base / f"data/orphadata_verified_batch_0{n}.json"
        for row in json.loads(path.read_text())["rows"]:
            rows.append({
                "id": row["id"],"orpha": row["code"],
                "hpo": row["phenotypes"],"genes": row["genes"],
                "inheritance": row.get("inheritance", []),
                "onset": row.get("onset", []),
                "status": "reviewed",
            })
    cohort = clean_unique(rows)
    if len(cohort) != 17:
        raise ValueError(f"Expected 17 curated records, got {len(cohort)}")
    return cohort

def read_staged(base):
    rows = []
    for file in sorted((base / "data").glob("orpha_hpo_exact_source_[0-9][0-9].json")):
        for r in json.loads(file.read_text())["records"]:
            if r.get("review_status") != "unreviewed" or r.get("match_method") != "exact_preferred_label_unique":
                raise ValueError("Unverified stage has an unexpected identity status")
            rows.append({
                "id": r["disease_id"],"orpha": r["orpha_code"],
                "hpo": r["hpo_annotations"],"genes": r["gene_associations"],
                "inheritance": r.get("inheritance_terms", []),
                "onset": r.get("onset_terms", []),
                "status": "unreviewed",
            })
    cohort = clean_unique(rows)
    if len(cohort) != 133:
        raise ValueError(f"Expected 133 staged records, got {len(cohort)}")
    return cohort

def feature_blocks(cohort):
    n = len(cohort)
    phen = sorted({p["id"] for r in cohort for p in r["hpo"]
                   if str(p.get("id", "")).startswith("HP:")
                   and term_frequency(p.get("frequency")) > 0})
    gene = sorted({g["symbol"] for r in cohort for g in r["genes"]
                   if "disease-causing" in str(g.get("association", "")).casefold()})
    inh = sorted({v for r in cohort for v in r["inheritance"] if v})
    onset = sorted({v for r in cohort for v in r["onset"] if v})
    vocab = [phen, gene, inh, onset]
    names = ["phenotype", "causal_gene", "inheritance", "onset"]
    vectors = []
    cover = {}
    for name, terms in zip(names, vocab):
        col = {term: j for j, term in enumerate(terms)}
        mat = np.zeros((n, len(terms)), dtype=float)
        for i,r in enumerate(cohort):
            if name == "phenotype":
                for row in r["hpo"]:
                    tid = row.get("id")
                    if tid in col:
                        mat[i,col[tid]] = max(mat[i,col[tid]],term_frequency(row.get("frequency")))
            elif name == "causal_gene":
                for row in r["genes"]:
                    if "disease-causing" in str(row.get("association", "")).casefold() and row.get("symbol") in col:
                        mat[i,col[row["symbol"]]]=1
            else:
                for term in r[name]:
                    if term in col: mat[i,col[term]]=1
        # Rare phenotypes carry additional information, based on annotated occurrences.
        if name in ("phenotype","causal_gene") and mat.shape[1]:
            occ = np.count_nonzero(mat,axis=0)
            idf = np.log((1+n)/(1+occ))+1
            mat *= idf
        cover[name] = {"terms":len(terms),"diseases_with_evidence":int(np.count_nonzero(np.any(mat>0,axis=1)))}
        if mat.shape[1]:
            mat=normalize(mat,norm="l2",axis=1)
            mat *= BLOCK_WEIGHTS[name]
        vectors.append(mat)
    X=np.concatenate(vectors,axis=1)
    if not X.shape[1] or np.any(~np.isfinite(X)):
        raise ValueError("Bad clinical input vector")
    # Not annotated != negative. Coefficients encode observed positives only;
    # report per-block missingness and avoid estimating undocumented symptoms.
    return X,cover

def fcm(points,k,seed=SEED,m=2.,max_iter=250):
    """Fuzzy c-means in the 3D embedding; no category-label initialization."""
    n,d=points.shape
    rng=np.random.default_rng(seed)
    membership=rng.dirichlet(np.ones(k),size=n)
    centers=np.zeros((k,d))
    for it in range(max_iter):
        powers=membership**m
        weights=np.maximum(powers.sum(axis=0),1e-12)
        centers=(powers.T@points)/weights[:,None]
        distances=np.maximum(pairwise_distances(points,centers,metric="euclidean"),1e-10)
        # Handle exact center coincidence deterministically.
        exact=distances<=1.01e-10
        new=np.zeros_like(membership)
        for i in range(n):
            if np.any(exact[i]):new[i,np.argmax(exact[i])]=1
            else:
                inv=np.power(distances[i],-2/(m-1))
                new[i]=inv/inv.sum()
        diff=np.max(np.abs(new-membership))
        membership=new
        if diff<1e-7:break
    return membership,centers,it+1

def scale_coords(values, span=8.0):
    centered=values-values.mean(axis=0,keepdims=True)
    radius=np.percentile(np.linalg.norm(centered,axis=1),95)
    return centered*(span/max(radius,1e-8))

def neighborhood_overlap(X,Y,k):
    # Cosine is appropriate for the sparse, normalised evidence blocks.
    A=pairwise_distances(X,metric="cosine")
    B=pairwise_distances(Y,metric="euclidean")
    np.fill_diagonal(A,np.inf)
    np.fill_diagonal(B,np.inf)
    an=np.argsort(A,axis=1)[:,:k]
    bn=np.argsort(B,axis=1)[:,:k]
    return float(np.mean([len(set(a)&set(b))/k for a,b in zip(an,bn)]))

def stability(embeddings):
    if len(embeddings)<2:return 1.
    distances=[]
    for i in range(len(embeddings)):
        for j in range(i+1,len(embeddings)):
            # Procrustes normalises global translation/rotation/scale.
            _,_,disparity=procrustes(embeddings[i],embeddings[j])
            distances.append(float(disparity))
    return float(1-np.mean(distances))

def comparison(cohort):
    n=len(cohort); X,coverage=feature_blocks(cohort)
    k=min(5, max(3, n//6))
    pca=PCA(n_components=3,svd_solver="full",random_state=SEED)
    pca_coords=pca.fit_transform(X)
    pca_coords=scale_coords(pca_coords)
    nn=min(12,max(3,n//5))
    umap_coords=[]
    for seed in (SEED,SEED+1,SEED+2):
        reducer=umap.UMAP(n_neighbors=nn,min_dist=.12,n_components=3,
                          metric="cosine",random_state=seed,
                          init="spectral",n_jobs=1,low_memory=True)
        v=reducer.fit_transform(X)
        umap_coords.append(scale_coords(v))
    metrics={}
    t_neighbors=min(7,max(2,(n-1)//3))
    for label,values in (("PCA",pca_coords),("UMAP",umap_coords[0])):
        ms,_centers,its=fcm(values,k,seed=SEED)
        labs=ms.argmax(axis=1)
        metrics[label]={
            "trustworthiness":float(trustworthiness(X,values,n_neighbors=t_neighbors,metric="cosine")),
            "knn_overlap":neighborhood_overlap(X,values,k=t_neighbors),
            "cluster_n":len(set(labs)),
            "fcm_iterations":its,
            "fcm_mean_membership":float(np.max(ms,axis=1).mean()),
            "fcm_silhouette":float(silhouette_score(values,labs))
                if len(set(labs))>1 and len(set(labs))<n else None,
            "coordinates":values,"memberships":ms,
            "labels":labs,
        }
    metrics["PCA"]["seed_stability"]=1.
    metrics["UMAP"]["seed_stability"]=stability(umap_coords)
    # Strictly favour UMAP only for a clear preservation improvement.
    # A low-sample UMAP is otherwise not automatically more faithful than PCA.
    a,b=metrics["PCA"],metrics["UMAP"]
    better=(b["trustworthiness"]>a["trustworthiness"]+.01 and
            b["knn_overlap"]>=a["knn_overlap"]-.03 and
            b["seed_stability"]>.60)
    selected="UMAP" if better else "PCA"
    selected_metric=metrics[selected]
    positions=[]
    for i,row in enumerate(cohort):
        xyz=selected_metric["coordinates"][i]
        membership=selected_metric["memberships"][i]
        positions.append({
            "id":row["id"],"orpha_code":int(row["orpha"]),
            "x":round(float(xyz[0]),5),"y":round(float(xyz[1]),5),"z":round(float(xyz[2]),5),
            "fcm_cluster":int(np.argmax(membership))+1,
            "membership":round(float(max(membership)),5),
            "annotated_hpo":len(row["hpo"]),
            "annotated_causal_genes":sum("disease-causing" in str(g.get("association","")).casefold()
                for g in row["genes"]),
            "model_version":MODEL_VERSION+"-"+selected.lower(),
            "identity_status":row["status"],
        })
    for val in positions:
        if any(abs(val[d])>30 or not math.isfinite(val[d]) for d in ("x","y","z")):
            raise ValueError("Embedding outside safe DB coordinate range")
    def public_metric(m):
        return {k:round(v,6) if isinstance(v,float) else v for k,v in m.items()
                if k not in ("coordinates","memberships","labels")}
    return {
        "meta":{
          "cohort_status":cohort[0]["status"],"n":n,"dims":X.shape[1],
          "block_coverage":coverage,
          "weights":BLOCK_WEIGHTS,
          "pca_variance_ratio":[round(float(z),5) for z in pca.explained_variance_ratio_],
          "umap_neighbors":nn,
          "evaluation_neighbors":t_neighbors,
          "method_metrics":{name:public_metric(m) for name,m in metrics.items()},
          "selected_method":selected,
          "selection_rule":"UMAP only if trustworthiness +0.01, KNN overlap not worse by >0.03, stability >0.60",
          "limitations":["Clinical name or ORPHA code validity must be reviewed independently",
            "Unannotated terms are unknown, not clinically negative",
            "2D/3D distances are representations, not a medical diagnostic metric",
            "Metrics measured on same cohort used for fitting; not clinical external validation"]
        },
        "positions":positions,
    }

def main():
    args=argparse.ArgumentParser()
    args.add_argument("--output",default="data")
    args=args.parse_args()
    base=Path(__file__).resolve().parent.parent
    reviewed=read_verified(base)
    staged=read_staged(base)
    matches={r["id"]:r["orpha"] for r in staged}
    overlap=0
    for row in reviewed:
        if row["id"] in matches:
            overlap+=1
            if str(row["orpha"])!=str(matches[row["id"]]):
                raise ValueError(f"Verified identity diverges from upstream staging: {row['id']}")
    out=Path(args.output);out.mkdir(parents=True,exist_ok=True)
    results={}
    for name,records in (("verified",reviewed),("staged_unreviewed",staged)):
        experiment=comparison(records)
        (out/f"clinical_{name}_comparison_v1.json").write_text(
           json.dumps(experiment,ensure_ascii=False,indent=2)+"\n")
        results[name]=experiment["meta"]
    summary={"model_version":MODEL_VERSION,
             "identity_crosswalk":{"verified":len(reviewed),"staged_unreviewed":len(staged),
                 "staged_verified_overlap":overlap},
             "evaluation":results,
             "no_unreviewed_promoted":True,
             "never_overwrite_taxonomy_map":True}
    (out/"clinical_model_comparison_summary_v1.json").write_text(
      json.dumps(summary,ensure_ascii=False,indent=2)+"\n")
    print(json.dumps(summary,ensure_ascii=False,indent=2))

if __name__=="__main__":
    main()
