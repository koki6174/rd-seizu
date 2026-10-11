(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 const guides=window.NENONE_DISEASE_GUIDES;
 const id=new URLSearchParams(location.search).get('id');
 function fail(){
  $('loading').textContent='この病気の解説は現在準備中です。星図に戻って、ほかの星もご覧ください。';
  document.title='解説の準備中 | 見えない病気の星図';
 }
 async function boot(){
  if(!guides||!id||!/^[a-z0-9-]{2,100}$/.test(id)){fail();return;}
  let record;
  try{record=await guides.get(id)}catch(error){
   console.error('Disease reference unavailable',error);fail();return;
  }
  if(!record){fail();return;}
  $('loading').hidden=true;$('disease-content').hidden=false;
  $('disease-title').textContent=record.name;
  document.title=record.name+' | 見えない病気の星図';
  $('disease-intro').textContent=record.overview;
  $('disease-overview').textContent=record.overview;
  $('disease-living').textContent=record.dailyLife;
  $('disease-treatment').textContent=record.currentState;
  const ul=$('disease-sources');ul.replaceChildren();
  for(const source of record.references){
   let url;
   try{url=new URL(source.url);if(url.protocol!=='https:')continue;}catch{continue;}
   const li=document.createElement('li'),a=document.createElement('a');
   a.href=url.toString();a.target='_blank';a.rel='noopener noreferrer';
   a.textContent=source.title+' ↗';
   li.append(a);ul.append(li);
  }
 }
 boot();
})();
