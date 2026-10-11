'use strict';
/**
 * Read-only browser smoke test after the GitHub Pages deployment.
 * No posting, account creation, endpoint fuzzing, or mutation.
 */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base='https://koki6174.github.io/rd-seizu/';
async function main(){
 const browser=await chromium.launch({
  headless:true,args:['--enable-webgl','--use-gl=angle',
   '--use-angle=swiftshader','--enable-unsafe-swiftshader']
 });
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,
  reducedMotion:'reduce'});
 const fatal=[];
 page.on('pageerror',e=>fatal.push(e.message));
 try{
  const url=new URL(base);url.searchParams.set('audit','public-browser-smoke');
  let response=await page.goto(url.toString(),{waitUntil:'domcontentloaded',timeout:30000});
  assert(response&&response.ok(),'Home HTTP failed');
  await page.waitForFunction(()=>{
   const canvas=document.querySelector('#universe canvas');
   const text=document.querySelector('#lit-count')?.textContent||'';
   return !!canvas || text.includes('読み込みに失敗');
  },null,{timeout:45000});
  assert((await page.locator('#lit-count').textContent()).includes('1,241'),
   'Full public star scene did not initialize all 1241 coordinates');
  assert.equal(await page.locator('#universe canvas').count(),1,
   '3D home canvas missing');
  console.log('PASS HOME: full taxonomy 1241 points render');

  response=await page.goto(new URL('disease/?id=fabry-disease',base).toString(),
   {waitUntil:'domcontentloaded',timeout:30000});
  assert(response&&response.ok(),'Disease article HTTP failed');
  await page.locator('#disease-content:not([hidden])').waitFor({timeout:12000});
  assert((await page.locator('#disease-title').textContent()).includes('ファブリー病'));
  assert((await page.locator('#disease-sources a').count())>=2);
  console.log('PASS ARTICLE: sourced disease guide visible');

  response=await page.goto(new URL('weekly/',base).toString(),
   {waitUntil:'domcontentloaded',timeout:30000});
  assert(response&&response.ok(),'Weekly HTTP failed');
  await page.waitForFunction(()=>{
   const canvas=document.querySelector('#weekly-space canvas');
   const error=(document.querySelector('#weekly-space-status')?.textContent||'').includes('表示できません');
   return !!canvas || error;
  },null,{timeout:45000});
  assert.equal(await page.locator('#weekly-space canvas').count(),1,
   'Weekly historical 3D not rendered');
  console.log('PASS WEEKLY: historical 3D renders');

  response=await page.goto(new URL('clinical/',base).toString(),
   {waitUntil:'domcontentloaded',timeout:30000});
  assert(response&&response.ok(),'Research login HTTP failed');
  await page.locator('#clinical-access:not([hidden])').waitFor({timeout:12000});
  assert.equal(await page.locator('#universe canvas').count(),0,
   'Research preview exposed a 3D scene before authentication');
  console.log('PASS CLINICAL: unauthorized user receives login, no research 3D');
  // Verify *network* authorization, not merely that the UI hides the research map.
  // First prove the public key can reach the intended read-only coordinate RPC,
  // so a 401 from protected endpoints isn't a broken test credential.
  const config=await page.evaluate(()=>window.NENONE_CONFIG);
  assert(config?.supabaseUrl?.startsWith('https://')&&config?.supabasePublishableKey);
  const headers={
    apikey:config.supabasePublishableKey,
    authorization:'Bearer '+config.supabasePublishableKey
  };
  const open=await page.request.get(config.supabaseUrl+
    '/rest/v1/rpc/get_constellation_positions',{headers,timeout:15000});
  assert(open.ok(),'Public RPC positive control failed; cannot verify access policy');
  const exposed=await open.json();
  assert.equal(exposed.length,1241,'Public RPC control unexpectedly incomplete');
  for(const endpoint of [
    '/rest/v1/rpc/get_provisional_hpo_positions',
    '/rest/v1/rpc/get_clinical_pilot_positions',
    '/rest/v1/rpc/get_private_clinical_positions',
    '/rest/v1/disease_clinical_embedding_pilot?select=disease_id&limit=1',
    '/rest/v1/star_entries?select=id&limit=1',
    '/rest/v1/interactions?select=id&limit=1',
    '/rest/v1/disease_suggestions?select=id&limit=1'
  ]){
    const denial=await page.request.get(config.supabaseUrl+endpoint,
     {headers,timeout:15000});
    assert([401,403,404].includes(denial.status()),
     'Unexpected public access '+denial.status()+' to '+endpoint);
  }
  console.log('PASS DB: 1 public coordinate RPC works; 7 protected APIs denied to anonymous');

  assert.deepEqual(fatal,[],'Uncaught browser JS errors');
 }finally{await browser.close();}
}
main().catch(e=>{console.error('Read-only browser smoke failed:',e);process.exitCode=1;});
