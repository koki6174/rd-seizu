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
  const dateLabel=$('article-reviewed-date');
  if(dateLabel && typeof record.reviewedAt==='string'){
   const dateMatch=/^(\d{4})-(\d{2})-(\d{2})$/.exec(record.reviewedAt);
   if(dateMatch)dateLabel.textContent='資料確認日：'+Number(dateMatch[1])+'年'+Number(dateMatch[2])+'月'+Number(dateMatch[3])+'日';
  }
  const ul=$('disease-sources');ul.replaceChildren();
  // Editorial JSON is data, not authority to send readers to arbitrary sites.
  // Even a future AI/import pipeline must not turn references into phishing links.
  const approvedHosts=new Set([
   'www.nanbyou.or.jp','www.mhlw.go.jp','www.ncchd.go.jp',
   'www.shouman.jp','www.ncbi.nlm.nih.gov','www.orpha.net','github.com'
  ]);
  for(const source of record.references){
   let url;
   try{
    url=new URL(source.url);
    if(url.protocol!=='https:' || !approvedHosts.has(url.hostname)
       || url.username || url.password || url.port)continue;
    if(url.hostname==='github.com' && url.pathname!=='/NanbyoData/nando')continue;
   }catch{continue;}
   const li=document.createElement('li'),a=document.createElement('a');
   a.href=url.toString();a.target='_blank';a.rel='noopener noreferrer';
   a.textContent=source.title+' ↗';
   li.append(a);ul.append(li);
  }
 }
 boot();
})();
