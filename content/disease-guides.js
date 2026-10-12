/* Shared read-only guide loader for the public star card, discovery dialog and detail page.
   Editorial texts are sourced summaries, never medical advice or patient submissions.
   Paths resolve relative to this JS file so every page uses one canonical dataset. */
(()=>{
 'use strict';
 const base=new URL('./',document.currentScript.src);
 const files=[
  'disease_guides_top50_part1.json','disease_guides_top50_part2.json',
  'disease_guides_extra_01.json','disease_guides_extra_02.json',
  'disease_guides_extra_03.json','disease_guides_extra_04.json',
  'disease_guides_currently_lit_20261011.json',
  'disease_guides_extra_05.json','disease_guides_extra_06.json',
  'disease_guides_extra_07.json','disease_guides_extra_08.json',
  'disease_guides_extra_09.json','disease_guides_extra_10.json',
  'disease_guides_extra_11.json','disease_guides_extra_12.json',
  'disease_guides_orpha_01.json','disease_guides_orpha_02.json',
  'disease_guides_orpha_03.json','disease_guides_orpha_04.json',
  'disease_guides_next_01.json','disease_guides_next_02.json',
  'disease_guides_next_03.json','disease_guides_next_04.json',
  'disease_guides_next_05.json'
 ];
 let cache=null,inflight=null;
 const idPattern=/^[a-z0-9-]{2,100}$/;
 async function load(){
  if(cache)return cache;
  if(inflight)return inflight;
  inflight=Promise.all(files.map(async file=>{
   const response=await fetch(new URL(file,base),{cache:'no-cache'});
   if(!response.ok)throw new Error('Guide source unavailable: '+file);
   const body=await response.json();
   if(!Array.isArray(body.records))throw new Error('Malformed disease guide');
   return body.records;
  })).then(chunks=>{
   const map=new Map();
   for(const record of chunks.flat()){
    if(!idPattern.test(record.id)||map.has(record.id))throw new Error('Duplicate or invalid disease ID');
    if(![record.overview,record.dailyLife,record.currentState].every(s=>typeof s==='string'&&s.trim().length>30))
     throw new Error('Incomplete editorial guide');
    if(!Array.isArray(record.references)||!record.references.length)throw new Error('Missing references');
    map.set(record.id,record);
   }
   if(map.size!==553)throw new Error('Expected 553 sourced editorial draft records');
   cache=map;return map;
  }).catch(error=>{inflight=null;throw error});
  return inflight;
 }
 function href(id){
  if(!idPattern.test(String(id||'')))return null;
  const root=new URL('../',base);
  const url=new URL('disease/',root);
  url.searchParams.set('id',id);
  return url.pathname+url.search;
 }
 window.NENONE_DISEASE_GUIDES={
  load,
  async get(id){const map=await load();return map.get(String(id))||null;},
  href
 };
})();
