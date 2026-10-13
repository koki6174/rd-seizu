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
assert(markup.includes('./cumulative.css?v=6') && markup.includes('./cumulative.js?v=6'),
 'Updated archive UI and data loader must invalidate old cache');
assert(poster.includes('grid-column:1 / span 7;') && poster.includes('grid-row:3;'),
 'The remaining story section must fill the desktop left column');
assert(!poster.includes('.story-grid>.story-block:nth-child(2)'),
 'Stale second-column selector must be removed');

assert(report.includes("api.rpc('get_daily_constellation',{p_day:day})"));
assert(report.includes("window.setInterval(refresh,60_000)"));
assert(report.includes("timeZone:'Asia/Tokyo'"));
assert(report.includes("dateToUTC(requested)"));
assert(report.includes("day===today"));
assert(sql.includes('public.get_daily_constellation(p_day date)'));
assert(sql.includes("at time zone 'Asia/Tokyo'"));
assert(sql.includes('(p_day+1)::timestamp'));
assert(sql.includes('least('));
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
assert(markup.includes('./cumulative.css?v=5'));
assert(markup.includes('./weekly-scene.css?v=3'));
assert(poster.includes('@media screen and (min-width:1024px)'));
assert(css.includes('@media screen and (min-width:1024px)'));
assert(poster.includes('grid-template-columns:repeat(12,minmax(0,1fr))'));
assert(poster.includes('.story-grid{display:contents}'));
assert(poster.includes('.poster{aspect-ratio:16/9;min-height:625px}'));
assert(css.includes('height:clamp(320px,29vw,410px)'));
assert(css.includes('@media(max-width:560px){.weekly-space{height:255px}}'));
assert(css.includes('.weekly-space{height:105px;margin:6px 0 3px;'));
console.log('PASS: daily JST snapshots, one-minute live refresh, private aggregates and main scene visual parity');
