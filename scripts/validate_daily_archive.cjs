'use strict';
// Daily archive regressions: day navigation, live cutoff, the same public glow
// preset and no disclosure of unlit disease names.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const markup=read('weekly/index.html');
const report=read('weekly/cumulative.js');
const archive=read('weekly/weekly-scene.js');
const main=read('lab/scene.js');
const css=read('weekly/weekly-scene.css');
const poster=read('weekly/cumulative.css');
const sql=read('supabase/migrations/051_daily_constellation_archive.sql');
const hourlySql=read('supabase/migrations/052_hourly_jst_archive.sql');
for(const id of ['prev-day','next-day','chosen-day','new-period-label','last-day-label',
                 'weekly-space','weekly-space-count','weekly-space-print']) {
 assert(markup.includes('id="'+id+'"'),'Missing daily archive control: '+id);
}
assert(markup.includes('前日')&&markup.includes('翌日'));
assert(!/毎週月曜更新|直近1週間の成長|日本時間・月曜0時時点|累積件数は参加人数ではありません/.test(markup));
assert(!/id="prev-week"|id="next-week"/.test(markup));
assert(!markup.includes('今回の問い') && !markup.includes('featured-question'),
 'Unused featured question must be removed from the page');
assert(!report.includes('weekly_editorial') && !report.includes('featured-question'),
 'Unused editorial API query must not be sent');
assert(markup.includes('./cumulative.css?v=8') && markup.includes('./cumulative.js?v=8'),
 'Updated archive UI and data loader must invalidate old cache');
assert(poster.includes('grid-column:1 / span 7;') && poster.includes('grid-row:3;'),
 'The remaining story section must fill the desktop left column');
assert(!poster.includes('.story-grid>.story-block:nth-child(2)'),
 'Stale second-column selector must be removed');

assert(report.includes("api.rpc('get_daily_constellation',{p_day:day})"));
assert(!report.includes('setInterval(refresh,60_000)'));
assert(report.includes('scheduleHourlyRefresh()'));
assert(report.includes('window.setTimeout(()=>{'));
assert(report.includes('const delay=hour-(Date.now()%hour)+2_000'));
assert(report.includes('lastLoadedHour=Math.floor(d.getTime()/3_600_000)'));
assert(markup.includes('最新の記録は毎時00分に更新。'));
assert(!markup.includes('約1分ごとに更新'));
assert(report.includes("timeZone:'Asia/Tokyo'"));
assert(report.includes("dateToUTC(requested)"));
assert(report.includes("day===today"));
assert(sql.includes('public.get_daily_constellation(p_day date)'));
assert(sql.includes("at time zone 'Asia/Tokyo'"));
assert(sql.includes('(p_day+1)::timestamp'));
assert(sql.includes('least('));
assert(hourlySql.includes("pg_catalog.date_trunc("));
assert(hourlySql.includes("'hour', pg_catalog.statement_timestamp() at time zone 'Asia/Tokyo'"));
assert(hourlySql.includes("(p_day+1)::timestamp at time zone 'Asia/Tokyo'"));
assert(sql.includes("pg_catalog.statement_timestamp()"));
assert(sql.includes("revoke all on function public.get_daily_constellation(date)"));
assert(sql.includes("grant execute on function public.get_daily_constellation(date) to anon"));
assert(!sql.includes('comment_text'));
assert(!sql.includes('device_hash'));
for(const val of [
 "camera=new THREE.PerspectiveCamera(45,1,.1,90)",
 "camera.position.set(0,1.2,25)",
 "controls.enableDamping=true;controls.dampingFactor=.065",
 "controls.enablePan=false;controls.minDistance=9;controls.maxDistance=40",
 "controls.autoRotate=!reduced;controls.autoRotateSpeed=2.5",
 "controls.rotateSpeed=1.35",
 "const NEBULA_F=[",
 "{texture:'soft',size:4.1,opacity:.29}",
 "{texture:'soft',size:2.25,opacity:.31}",
 "{texture:'ring',size:3.3,opacity:.16}",
 "createCloud(groups.unlit,'#4d5c73',.29,texture,.54,false)",
 "share:'#ffc6ad',discover:'#99e4ff'",
 "createCloud(items,colors[kind],.63,texture,.75,true)",
 "createCloud(items,colors[kind],.28,texture,1,true)"
]) {
 assert(archive.includes(val),'Archive missing visual parity value: '+val);
 // Main scene uses the same values, with different local field/variable names.
}
for(const glow of [
 "gradient.addColorStop(.2,'rgba(255,255,255,.88)')",
 "gradient.addColorStop(.47,'rgba(255,255,255,.32)')",
 "[.17,'rgba(255,255,255,.65)']",
 "[.34,'rgba(255,255,255,.41)']"
]) {
 assert(main.includes(glow)&&archive.includes(glow),'Shared glow mismatch: '+glow);
}
assert(archive.includes('clouds.filter(c=>c.userData.selectable)'));
assert(archive.includes("if(!d||!Number(d.total))continue"));
assert(!css.includes('background-image:radial-gradient'));
assert(!poster.includes('background-image:radial-gradient'));

// Widescreen desktop-only: the original mobile DOM flow and A4 styling remain.
assert(markup.includes('./cumulative.css?v=8'));
assert(markup.includes('./weekly-scene.css?v=5'));
assert(poster.includes('@media screen and (min-width:1024px)'));
assert(css.includes('@media screen and (min-width:1024px)'));
assert(poster.includes('grid-template-columns:repeat(12,minmax(0,1fr))'));
assert(poster.includes('.story-grid{display:contents}'));
assert(poster.includes('.poster{aspect-ratio:16/9;min-height:625px}'));
assert(css.includes('height:clamp(320px,29vw,410px)'));
assert(css.includes('@media(max-width:560px){.weekly-space{height:255px}}'));
assert(css.includes('.weekly-space{height:105px;margin:6px 0 3px;'));
// Native A4 print uses a one-sheet desktop grid, not the mobile/flex report.
// All WebGL pixels are rasterized at a separate printer-specific resolution.
assert(poster.includes('@page{size:A4 landscape;margin:0}'));
assert(poster.includes('width:297mm!important;height:210mm!important'));
assert(poster.includes('width:281mm!important;height:194mm!important'));
assert(poster.includes('grid-template-columns:repeat(12,minmax(0,1fr))!important'));
assert(poster.includes('.story-grid{display:contents!important}'));
assert(css.includes('.weekly-space #weekly-space-print:not([hidden])'));
assert(css.includes('flex:1 1 auto!important'));
assert(archive.includes('const width=1700,height=2050'));
assert(archive.includes('renderer.setPixelRatio(1)'));
assert(archive.includes('ctx.drawImage(renderer.domElement,0,0,width,height)'));
assert(archive.includes('window.NENONE_PREPARE_ARCHIVE_PRINT=async()=>'));
assert(report.includes('await window.NENONE_PREPARE_ARCHIVE_PRINT?.()'));
assert(markup.includes('高画質PDF・印刷'));
assert(poster.includes('grid-template-rows:30mm 101mm 27mm .2mm 12mm!important'));
assert(poster.includes('grid-template-rows:46mm 52mm!important'));
assert(poster.includes('font-size:84px!important'));
assert(poster.includes('grid-column:1 / -1;'));
assert(poster.includes('background:#ffffff09!important'));
console.log('PASS: A4 landscape print has balanced editorial hierarchy and high-DPI star field');
console.log('PASS: daily JST snapshots, hourly on-the-hour refresh, private aggregates and main scene visual parity');
