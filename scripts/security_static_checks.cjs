'use strict';
// Guardrails for the static, visitor-facing application. This checks source
// patterns, not a substitute for browser penetration tests or Supabase RLS.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const active=[
 'admin/app.js','admin/analytics.js','lab/scene.js','weekly/cumulative.js',
 'weekly/weekly-scene.js','content/disease-guides.js','disease/disease.js'
];
for(const f of active){
 const src=read(f);
 assert(!/\.(?:innerHTML|outerHTML)\s*=/.test(src),f+': dangerous unescaped HTML sink');
 assert(!/\binsertAdjacentHTML\s*\(/.test(src),f+': unsafe HTML injection');
 assert(!/\bdocument\.write\s*\(/.test(src),f+': unsafe document write');
 assert(!/\b(?:eval|Function)\s*\(/.test(src),f+': dynamic code execution');
}
const app=read('admin/app.js'),scene=read('lab/scene.js'),article=read('disease/disease.js');
assert(app.includes("client.rpc('submit_star'")&&app.includes("client.rpc('suggest_missing_disease'"));
assert(!/\.from\(['"](?:star_entries|interactions|questions)['"]\)\s*\.insert\s*\(/.test(app));
assert(scene.includes('if(guides && total>0)'));
assert(scene.includes('objects.filter(o=>o.userData.pickable)'));
assert(article.includes('textContent=record.overview'));
assert(article.includes("url.protocol!=='https:'"));
assert(article.includes("a.rel='noopener noreferrer'"));
const secret=read('config.js');
assert(secret.includes('supabasePublishableKey'));
assert(!/service_role|sb_secret_|SUPABASE_SERVICE_ROLE_KEY/i.test(secret));
const pages=['index.html','weekly/index.html','clinical/index.html'];
for(const f of pages){
 const html=read(f);
 assert(html.includes('@supabase/supabase-js@2.117.3'),f+': SDK not pinned');
 assert(!html.includes('@supabase/supabase-js@2"'),f+': floating dependency');
}
const migration=read('supabase/migrations/046_security_harden_legacy_grants.sql');
for(const clause of [
 'revoke all on table public.interactions',
 'revoke all on table public.questions',
 'revoke all on function public.get_provisional_hpo_positions()',
 'revoke all on function public.get_clinical_pilot_positions()',
 'alter function public.get_weekly_constellation(date) security definer',
 'has_function_privilege'
])assert(migration.includes(clause),'missing DB hardening: '+clause);
console.log('PASS: 7 visitor JS modules use no direct HTML/eval sinks.');
console.log('PASS: comment and disease guides use DOM text APIs; writes only via RPC.');
console.log('PASS: no service-role key in publishable config; exact browser SDK pin.');
console.log('PASS: retire unrestricted legacy table and prototype research grants.');
