(() => {
  'use strict';
  // No disease names, search strings, device token, contact details or IP fields.
  // Data is intended only for aggregate exhibit UX analysis, not profiling.
  const c = window.NENONE_CONFIG || {};
  const enabled = () => {
    try { return localStorage.getItem('nenone-analytics-optout') !== '1'; }
    catch { return false; }
  };
  const sessionId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : null;
  const client = window.supabase && c.supabaseUrl && c.supabasePublishableKey
    ? window.supabase.createClient(c.supabaseUrl, c.supabasePublishableKey) : null;
  let section = 'home';
  let activeFrom = document.visibilityState === 'visible' ? performance.now() : null;
  let modalActive = false;
  let currentRoute = null;

  function payload(event, area, seconds, route) {
    return {
      p_session_id: sessionId, p_event_type:event,
      p_section: area || null,
      p_duration_seconds: Number.isFinite(seconds) ? Math.max(0,Math.min(3600,Math.round(seconds))) : null,
      p_route: route || null
    };
  }
  function transmit(event, area, duration, route, terminating = false) {
    if (!enabled() || !sessionId || !client) return;
    const data = payload(event,area,duration,route);
    if (terminating) {
      try {
        fetch(c.supabaseUrl + '/rest/v1/rpc/record_exhibition_event', {
          method:'POST',keepalive:true,
          headers:{
            'content-type':'application/json',
            'apikey':c.supabasePublishableKey,
            'authorization':'Bearer ' + c.supabasePublishableKey
          }, body:JSON.stringify(data)
        }).catch(()=>{});
      } catch {}
      return;
    }
    client.rpc('record_exhibition_event',data).then(({error})=>{
      if (error) console.debug('Analytics unavailable');
    }).catch(()=>{});
  }
  function closeActive(terminating=false) {
    if (activeFrom === null) return;
    const seconds=(performance.now()-activeFrom)/1000;
    if (seconds >= 1) transmit('screen_exit',section,seconds,currentRoute,terminating);
    activeFrom=null;
  }
  function showSection(name) {
    if(!['home','sky','choose','disease','comment','done','weekly'].includes(name))return;
    if(section===name)return;
    closeActive();
    section=name;
    activeFrom=document.visibilityState==='visible'?performance.now():null;
  }
  function track(event,name=null,route=null) {
    transmit(event,name||section,null,route||currentRoute);
  }
  window.NENONE_ANALYTICS={
    track,
    section(name) {showSection(name);},
    flow(name,route) {
      modalActive=true;
      if(route=== 'share' || route==='discover') currentRoute=route;
      showSection(name);
    },
    exitFlow() {modalActive=false;currentRoute=null;showSection('sky');}
  };
  if(sessionId && enabled()) track('visit','home');
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden) closeActive(true);
    else if(activeFrom===null) activeFrom=performance.now();
  });
  window.addEventListener('pagehide',()=>{
    closeActive(true);
    transmit('page_exit',section,null,currentRoute,true);
  });
  // Discrete high-level sections, not click positions or scroll coordinates.
  if(typeof IntersectionObserver !== 'undefined') {
    const observer=new IntersectionObserver(entries=>{
      if(modalActive || document.hidden)return;
      const best=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!best)return;
      showSection(best.target.id==='sky-view'?'sky':'home');
    },{threshold:[0.55]});
    for(const id of ['sky-view','participation']){
      const el=document.getElementById(id);
      if(el) observer.observe(el);
    }
  }
  // Long stays are periodically logged so page closes do not discard all time.
  setInterval(()=>{
    if(activeFrom!==null && !document.hidden){
      closeActive();
      activeFrom=performance.now();
    }
  },30000);
})();