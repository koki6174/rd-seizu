(() => {
 'use strict';
 const $=id=>document.getElementById(id);
 const c=window.NENONE_CONFIG||{};
 const api=window.supabase&&c.supabaseUrl&&c.supabasePublishableKey
   ?window.supabase.createClient(c.supabaseUrl,c.supabasePublishableKey):null;
 const firstDay='2026-10-01';
 let today='',selected='',sequence=0,busy=false;
 const fmt=v=>(Number(v)||0).toLocaleString('ja-JP');
 function dateToUTC(s){
   if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return null;
   const d=new Date(s+'T00:00:00Z');
   return Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==s?null:d;
 }
 function shift(s,n){const d=dateToUTC(s);if(!d)return s;d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
 function todayTokyo(){
   const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
   const v=Object.fromEntries(parts.map(p=>[p.type,p.value]));
   return v.year+'-'+v.month+'-'+v.day;
 }
 function monday(s){const d=dateToUTC(s);return shift(s,-((d.getUTCDay()+6)%7));}
 function labelDate(s){const [y,m,d]=s.split('-');return y+'年'+Number(m)+'月'+Number(d)+'日';}
 function shortDate(s){const [y,m,d]=s.split('-');return Number(m)+'月'+Number(d)+'日';}
 function set(id,value){$(id).textContent=String(value);}
 function controls(){
   set('chosen-day',shortDate(selected)+(selected===today?'・最新':''));
   $('prev-day').disabled=selected<=firstDay;
   $('next-day').disabled=selected>=today;
   $('new-period-label').textContent=selected===today?'今日の成長':'選択日の成長';
 }
 function editRow(row){
   const question=typeof row?.featured_question==='string'?row.featured_question.trim():'';
   set('featured-question',question||'公開する問いを準備しています。');
 }
 async function load(){
   const day=selected,request=++sequence;
   controls();
   history.replaceState(null,'',day===today?location.pathname:location.pathname+'?day='+encodeURIComponent(day));
   set('updated-date',labelDate(day));
   set('last-day-label',shortDate(day)+'の記録');
   set('error-message','');
   if(!api){set('error-message','集計サービスに接続できません。');return;}
   try{
     const [report,editorial]=await Promise.all([
       api.rpc('get_daily_constellation',{p_day:day}),
       api.from('weekly_editorial').select('featured_question')
         .eq('week_start',monday(day)).eq('approved',true).maybeSingle()
     ]);
     if(request!==sequence||day!==selected)return;
     if(report.error)throw report.error;
     const data=report.data||{};
     if(!Array.isArray(data.stars))throw new Error('Invalid daily star snapshot');
     window.NENONE_WEEKLY_SNAPSHOT={day,stars:data.stars};
     window.dispatchEvent(new CustomEvent('nenone:weekly-snapshot',{
       detail:window.NENONE_WEEKLY_SNAPSHOT
     }));
     set('cumulative-total',fmt(data.total));
     set('cumulative-diseases',fmt(data.active_diseases));
     set('new-count',fmt(data.day_added));
     set('share-count',fmt(data.shared));
     set('discover-count',fmt(data.discovered));
     const added=Number(data.day_added)||0,total=Number(data.total)||0;
     const subject=day===today?'今日':'この日';
     set('growth-summary',added?subject+'、新しく'+fmt(added)+'件の光が加わりました。':
       total?'積み重ねた光が、ここにあります。':'最初の星が生まれる日を待っています。');
     set('growth-detail',total?'累積'+fmt(total)+'件。星図は一日ごとの想いを重ねて育っていきます。':
       '最初の参加から星図が育ち始めます。');
     // The editorial question is planned weekly, but the statistics are daily.
     editRow(editorial.error?null:editorial.data);
     if(day===today && data.as_of){
       const d=new Date(data.as_of);
       if(Number.isFinite(d.getTime())){
         const time=new Intl.DateTimeFormat('ja-JP',{timeZone:'Asia/Tokyo',hour:'2-digit',minute:'2-digit',hour12:false}).format(d);
         set('updated-date',labelDate(day)+' '+time);
       }
     }
   }catch(error){
     if(request!==sequence||day!==selected)return;
     console.error('Daily constellation archive:',error);
     set('error-message','集計を読み込めませんでした。ネットワークを確認して再読み込みしてください。');
   }
 }
 function change(offset){
   const next=shift(selected,offset);
   if(next<firstDay||next>today)return;
   selected=next;
   load();
 }
 function refresh(){
   const latest=todayTokyo();
   if(latest!==today){
     const wasLatest=selected===today;
     today=latest;
     if(wasLatest)selected=latest;
     controls();
   }
   if(selected===today && !document.hidden && !busy){
     busy=true;
     load().finally(()=>{busy=false;});
   }
 }
 function init(){
   today=todayTokyo();
   const params=new URLSearchParams(location.search);
   const requested=params.get('day')||params.get('week')||'';
   selected=dateToUTC(requested)&&requested>=firstDay&&requested<=today?requested:today;
   $('prev-day').addEventListener('click',()=>change(-1));
   $('next-day').addEventListener('click',()=>change(1));
   $('print-report').addEventListener('click',()=>window.print());
   document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
   window.setInterval(refresh,60_000);
   load();
 }
 init();
})();
