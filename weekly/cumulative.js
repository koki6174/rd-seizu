(() => {
 'use strict';
 const $=id=>document.getElementById(id);
 const c=window.NENONE_CONFIG||{};
 const api=window.supabase&&c.supabaseUrl&&c.supabasePublishableKey
   ?window.supabase.createClient(c.supabaseUrl,c.supabasePublishableKey):null;
 let currentMonday='',selectedMonday='';
 const fmt=v=>(Number(v)||0).toLocaleString('ja-JP');
 function dateToUTC(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return null;const d=new Date(s+'T00:00:00Z');return Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==s?null:d;}
 function shift(s,n){const d=dateToUTC(s);d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
 function todayTokyo(){const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const v=Object.fromEntries(parts.map(p=>[p.type,p.value]));return v.year+'-'+v.month+'-'+v.day;}
 function monday(s){const d=dateToUTC(s);return shift(s,-((d.getUTCDay()+6)%7));}
 function labelDate(s){const [y,m,d]=s.split('-');return y+'年'+Number(m)+'月'+Number(d)+'日';}
 function shortDate(s){const [y,m,d]=s.split('-');return Number(m)+'月'+Number(d)+'日';}
 function set(id,text){$(id).textContent=String(text);}
 function controls(){set('chosen-week',shortDate(selectedMonday)+'時点');$('next-week').disabled=selectedMonday>=currentMonday;}
 function editRow(row) {
   const question=row && row.featured_question && row.featured_question.trim();
   set('featured-question',question || '公開する問いを準備しています。');
   if(row&&row.growth_note) set('growth-detail',row.growth_note);
 }
 async function load() {
   const mon=selectedMonday;
   controls();
   history.replaceState(null,'',mon===currentMonday?location.pathname:location.pathname+'?week='+encodeURIComponent(mon));
   set('updated-date',labelDate(mon));
   set('last-week-label',shortDate(shift(mon,-7))+'〜'+shortDate(shift(mon,-1))+'の記録');
   set('error-message','');
   if(!api){set('error-message','集計サービスに接続できません。');return;}
   try {
     const [report,editorial] = await Promise.all([
       api.rpc('get_cumulative_constellation',{p_week_start:mon}),
       api.from('weekly_editorial').select('featured_question,growth_note')
         .eq('week_start',mon).eq('approved',true).maybeSingle()
     ]);
     if(mon!==selectedMonday) return;
     if(report.error) throw report.error;
     if(editorial.error) throw editorial.error;
     const data=report.data||{};
     set('cumulative-total',fmt(data.total));
     set('cumulative-diseases',fmt(data.active_diseases));
     set('new-count',fmt(data.week_added));
     set('share-count',fmt(data.shared));
     set('discover-count',fmt(data.discovered));
     const added=Number(data.week_added)||0;
     const total=Number(data.total)||0;
     set('growth-summary',added?('先週、新しく'+fmt(added)+'件の光が加わりました。'):
       (total?'積み重ねた光が、ここにあります。':'最初の星が生まれる日を待っています。'));
     set('growth-detail',total?'累積'+fmt(total)+'件。星図の記録は毎週積み重なっていきます。':
       '最初の参加から星図が育ち始めます。');
     editRow(editorial.data);
   } catch(error) {
     console.error(error);
     set('error-message','集計を読み込めませんでした。ネットワークを確認して再読み込みしてください。');
   }
 }
 function change(n){selectedMonday=shift(selectedMonday,n);if(selectedMonday>currentMonday)selectedMonday=currentMonday;load();}
 function init(){
   currentMonday=monday(todayTokyo());
   const requested=new URLSearchParams(location.search).get('week')||'';
   selectedMonday=dateToUTC(requested)&&monday(requested)===requested&&requested<=currentMonday?requested:currentMonday;
   $('prev-week').addEventListener('click',()=>change(-7));
   $('next-week').addEventListener('click',()=>change(7));
   $('print-report').addEventListener('click',()=>window.print());
   load();
 }
 init();
})();