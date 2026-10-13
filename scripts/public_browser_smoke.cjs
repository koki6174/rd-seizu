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

  // Reproduce the user journey without posting anything to the database:
  // random discovery -> educational article -> browser Back -> same star -> Next.
  await page.locator('#open-form:not([disabled])').waitFor({timeout:15000});
  await page.locator('#open-form').click();
  await page.locator('#path-discover').click();
  await page.locator('#read-auto-disease:not([hidden])').waitFor({timeout:20000});
  const chosen=await page.locator('#auto-disease-name').textContent();
  assert(chosen?.trim(),'Random disease not selected');
  assert.equal(await page.locator('#to-comment').isEnabled(),true,
   'Next should be available before reading about a disease');
  await Promise.all([
   page.waitForURL(url=>url.pathname.endsWith('/disease/') && url.searchParams.has('id'),{timeout:18000}),
   page.locator('#read-auto-disease').click()
  ]);
  await page.locator('#disease-content:not([hidden])').waitFor({timeout:12000});
  await page.goBack({waitUntil:'domcontentloaded',timeout:30000});
  await page.locator('#flow-modal[open]').waitFor({timeout:25000});
  assert.equal((await page.locator('#auto-disease-name').textContent()).trim(),
   chosen.trim(),'Returning from the article picked a different random disease');
  assert.equal(await page.locator('#to-comment').isEnabled(),true,
   'Next must be enabled after browser Back');
  await page.locator('#to-comment').click();
  assert.equal((await page.locator('#selected-disease-name').textContent()).trim(),
   chosen.trim(),'Next did not preserve the selected disease');
  assert.equal(await page.locator('#preset-contextual').getAttribute('data-preset'),
   '知るきっかけになりました','Discovery needs a discovery-appropriate fourth preset');
  await page.locator('#back-to-disease').click();
  await page.locator('#back-to-choice').click();
  await page.locator('#path-share').click();
  await page.locator('#disease-search').fill('CACT');
  await page.locator('#disease-results button').first().click();
  await page.locator('#to-comment').click();
  assert.equal(await page.locator('#preset-contextual').getAttribute('data-preset'),
   'この病気への理解や配慮が広がってほしい',
   'Share should use understanding/accommodation, not a discovery statement');
  await page.locator('#preset-contextual').click();
  assert.equal(await page.locator('#thought-text').inputValue(),
   'この病気への理解や配慮が広がってほしい');
  await page.locator('#exit-flow').click();
  console.log('PASS BACK/PRESETS: discovery return and both appropriate share/discovery paths');

  response=await page.goto(new URL('disease/?id=fabry-disease',base).toString(),
   {waitUntil:'domcontentloaded',timeout:30000});
  assert(response&&response.ok(),'Disease article HTTP failed');
  await page.locator('#disease-content:not([hidden])').waitFor({timeout:12000});
  assert((await page.locator('#disease-title').textContent()).includes('ファブリー病'));
  assert((await page.locator('#disease-sources a').count())>=2);
  console.log('PASS ARTICLE: sourced disease guide visible');

  // Verify new 2026-10-12 article records load in the actual deployed browser,
  // not just in local JSON validation. No database mutations are performed.
  for(const {id,name} of [
   {id:'mhlw-0146',name:'大田原症候群'},
   {id:'mhlw-0247',name:'イソ吉草酸血症'},
   {id:'nando-21-2',name:'リー脳症'},
   {id:'nando-282-3',name:'先天性赤血球形成異常性貧血 Type III'},
   // Latest hundred: verify the first and last exact new catalog IDs.
   {id:'shoman-11-21',name:'シュワルツ・ヤンペル（Schwartz-Jampel）症候群'},
   {id:'nando-277-2',name:'ゴーハム病'}
  ]){
   response=await page.goto(new URL('disease/?id='+encodeURIComponent(id),base).toString(),
    {waitUntil:'domcontentloaded',timeout:30000});
   assert(response&&response.ok(),'New disease article HTTP failed: '+id);
   await page.locator('#disease-content:not([hidden])').waitFor({timeout:18000});
   assert.equal((await page.locator('#disease-title').textContent()).trim(),name);
   assert((await page.locator('#disease-overview').textContent()).length>35);
   assert((await page.locator('#disease-living').textContent()).length>35);
   assert((await page.locator('#disease-treatment').textContent()).length>35);
   assert((await page.locator('#disease-sources a').count())>=2);
  }
  console.log('PASS 553 GUIDES: initial articles and first/last of both new ORPHA cohorts load fully in production');

  // Visual study uses the exact public 1241-star geometry and current
  // illumination; it never writes submissions or uses the clinical RPC.
  response=await page.goto(new URL('glow-preview/',base).toString(),
   {waitUntil:'domcontentloaded',timeout:30000});
  assert(response&&response.ok(),'Unlisted glow comparison page HTTP failed');
  await page.waitForFunction(()=>
   (document.querySelector('#dataset-status')?.textContent||'').includes('1,241')
   && !!document.querySelector('#compare-stage canvas'),
   null,{timeout:30000});
  assert.equal(await page.locator('.compare-panel').count(),6);
  assert.equal(await page.locator('#compare-stage canvas').count(),1,
   'Glow comparison should use one synchronized WebGL context');
  await page.locator('[data-focus="D"]').click();
  assert.equal(await page.locator('.compare-panel:visible').count(),1,
   'Focused glow variant must use the larger single-view layout');
  assert((await page.locator('#selected-profile').textContent()).includes('D案'));
  await page.locator('#return-grid').click();
  assert.equal(await page.locator('.compare-panel:visible').count(),6,
   'All six panels should be visible after returning from focus');
  console.log('PASS GLOW: six synchronized current-data preview variants and focus mode');

  response=await page.goto(new URL('weekly/',base).toString(),
   {waitUntil:'domcontentloaded',timeout:30000});
  assert(response&&response.ok(),'Daily archive HTTP failed');
  await page.waitForFunction(()=>{
   const canvas=document.querySelector('#weekly-space canvas');
   const error=(document.querySelector('#weekly-space-status')?.textContent||'').includes('表示できません');
   return !!canvas || error;
  },null,{timeout:45000});
  assert.equal(await page.locator('#weekly-space canvas').count(),1,
   'Daily archive 3D not rendered');
  assert.equal(await page.locator('.story-grid > .story-block').count(),2,
   'Archive should contain only participation counts and 3D growth');
  assert.equal(await page.locator('#featured-question').count(),0,
   'Unused featured question should not appear on screen');

  await page.locator('#cumulative-total:not(:text("—"))').waitFor({timeout:15000});
  await page.waitForFunction(()=>/\d{2}:00$/.test(
   document.getElementById('updated-date')?.textContent||''),null,{timeout:12000});
  console.log('PASS HOURLY: displayed snapshot timestamp is at the hour boundary');
  assert.equal(await page.locator('#next-day').isDisabled(),true,
   'Latest daily snapshot should not advance into the future');
  const todayLabel=await page.locator('#chosen-day').textContent();
  await page.locator('#prev-day').click();
  await page.waitForURL(url=>url.searchParams.has('day'),{timeout:15000});
  assert.equal(await page.locator('#next-day').isEnabled(),true);
  await page.locator('#next-day').click();
  await page.waitForURL(url=>!url.searchParams.has('day'),{timeout:15000});
  assert.equal(await page.locator('#chosen-day').textContent(),todayLabel);
  // Desktop-only redesign: enlarged constellation to the right of compact stats,
  // while the mobile layout and A4 print layout retain their existing flow.
  for(const width of [1024,1280]){
   await page.setViewportSize({width,height:850});
   const metrics=await page.evaluate(()=>{
    const box=selector=>{
     const r=document.querySelector(selector).getBoundingClientRect();
     return {x:r.x,y:r.y,left:r.left,right:r.right,top:r.top,
      bottom:r.bottom,width:r.width,height:r.height};
    };
    return {
     poster:box('.poster'),stats:box('.stats'),date:box('.update-date'),
     sky:box('.weekly-space'),growth:box('.weekly-growth-block'),
     footer:box('.poster-foot'),cards:[...document.querySelectorAll('.stat-box')].map(x=>x.getBoundingClientRect().height),
     layout:getComputedStyle(document.querySelector('.poster-body')).display
    };
   });
   assert.equal(metrics.layout,'grid','Desktop poster must use side-by-side grid');
   assert(metrics.stats.right<metrics.sky.left,
    'Desktop stat cards must be to the left of the large star map');
   assert(metrics.date.right<metrics.sky.left,
    'Desktop date card should be nearer to center, not the far right edge');
   assert(metrics.sky.height>=319,
    'Desktop constellation needs a significantly larger canvas');
   assert(metrics.sky.top<metrics.stats.bottom,
    'Desktop constellation should begin in the upper part of the poster');
   assert(metrics.cards.every(h=>h<180),
    'Desktop statistic cards should be compact');
   assert(metrics.footer.bottom<=metrics.poster.bottom+3,
    'Desktop poster footer must not overflow its clipped area');
   assert(metrics.poster.height/metrics.poster.width<0.72,
    'Desktop poster should have a horizontal dashboard format');
  }
  await page.setViewportSize({width:390,height:844});
  const mobile=await page.evaluate(()=>({
   body:getComputedStyle(document.querySelector('.poster-body')).display,
   story:getComputedStyle(document.querySelector('.story-grid')).display,
   height:document.querySelector('.weekly-space').getBoundingClientRect().height
  }));
  assert.equal(mobile.body,'flex','Mobile poster must remain in its original layout');
  assert.equal(mobile.story,'grid','Mobile story block layout must stay unchanged');
  assert(Math.abs(mobile.height-255)<2,'Mobile constellation size must stay unchanged');
  await page.emulateMedia({media:'print'});
  const print=await page.evaluate(()=>({
   body:getComputedStyle(document.querySelector('.poster-body')).display,
   height:document.querySelector('.weekly-space').getBoundingClientRect().height
  }));
  assert.equal(print.body,'flex','A4 print should retain the original poster flow');
  assert(Math.abs(print.height-105)<2,'A4 print chart height must remain unchanged');
  await page.emulateMedia({media:'screen'});
  console.log('PASS DAILY: historical and latest navigation, responsive desktop dashboard and unchanged mobile/print');

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
