(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const config = window.NENONE_CONFIG || {};
  const client = window.supabase && config.supabaseUrl && config.supabasePublishableKey
    ? window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey)
    : null;
  const DEVICE_KEY = 'nenone-constellation-device-v2';
  const state = { stars:[], selected:null, kind:null, disease:null, token:null, submitted:false, busy:false };
  const sortMap = (a,b) => a.name.localeCompare(b.name, 'ja');

  function safeNumber(value) { return Math.max(0, Number(value) || 0); }
  function total(star) { return safeNumber(star.total); }
  function format(n) { return n.toLocaleString('ja-JP'); }
  function announce(message) { $('participation-status').textContent = message; }
  function jstDay() {
    return new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Tokyo',
      year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  }
  function token() {
    try {
      let value = localStorage.getItem(DEVICE_KEY);
      if (!value) {
        value = crypto.randomUUID();
        localStorage.setItem(DEVICE_KEY, value);
      }
      return value;
    } catch {
      return null;
    }
  }
  function setSubmitted(value) {
    state.submitted = !!value;
    $('open-form').disabled = !client || !state.token || value;
    $('open-form').textContent = value ? '今日は参加済みです ✓' : '星をひとつ灯す ✦';
    announce(value
      ? '今日の光は記録済みです。また明日、新しい星を灯せます。'
      : '今日はまだ参加できます。あなたの想いを星図に加えてください。');
  }
  async function refreshStatus() {
    if (!client || !state.token) {
      $('open-form').disabled = true;
      announce(!client ? '通信サービスを利用できません。再読み込みしてください。'
        : 'このブラウザでは保存が利用できません。ブラウザの設定を確認してください。');
      return;
    }
    try {
      const {data,error} = await client.rpc('daily_star_status',{p_device_token:state.token});
      if (error) throw error;
      setSubmitted(data);
    } catch (error) {
      console.error(error);
      $('open-form').disabled = true;
      announce('参加状況を確認できませんでした。通信を確認して再読み込みしてください。');
    }
  }
  function starPoint(index, n) {
    if (n === 1) return [50,47];
    const positions = [
      [25,25],[71,61],[72,22],[27,72],[48,52],
      [83,40],[17,50],[50,17],[53,82],[38,34],
      [68,82],[13,17],[86,72],[30,87],[44,66],
      [60,36],[9,76],[91,16],[22,38],[78,50],
      [48,9],[60,92],[9,34],[92,93]
    ];
    if (index < positions.length) return positions[index];
    const angle = (index * 137.50776) * Math.PI / 180;
    const radius = 12 + (index % 6) * 6;
    return [50 + Math.cos(angle) * radius,50 + Math.sin(angle) * radius];
  }
  function starClass(star) {
    if (safeNumber(star.shared) && safeNumber(star.discovered)) return 'mixed';
    return safeNumber(star.shared) ? 'share' : 'discover';
  }
  function renderStars() {
    const stars = state.stars.filter(s=>total(s)>0).sort((a,b)=>a.id.localeCompare(b.id));
    $('empty-stars').hidden = stars.length>0;
    $('total-stars').textContent = format(stars.length);
    $('total-entries').textContent = format(state.stars.reduce((n,s)=>n+total(s),0));
    $('map-status').textContent = stars.length + ' 個の星が見えています';
    const layer = $('star-layer'); layer.replaceChildren();
    stars.forEach((star,index) => {
      const [x,y] = starPoint(index,stars.length);
      const el = document.createElement('button');
      el.type='button'; el.className = 'star-node '+starClass(star);
      el.style.left = x+'%'; el.style.top = y+'%';
      el.style.setProperty('--scale', Math.min(1.6,1+Math.log1p(total(star))*.13));
      el.setAttribute('aria-label',star.name+'、'+total(star)+'件の想い');
      const symbol=document.createElement('span');symbol.className='spark';symbol.textContent='✦';
      const label=document.createElement('span');label.className='spark-label';label.textContent=total(star)+'件';
      el.append(symbol,label);
      el.addEventListener('click',()=>showStar(star,el));
      layer.append(el);
    });
    if(state.selected) {
      const latest=stars.find(s=>s.id===state.selected);
      if(latest) fillStarDetail(latest);
      else closeStar();
    }
  }
  function fillStarDetail(star) {
    $('detail-name').textContent=star.name;
    $('detail-counts').textContent='伝えたい '+format(safeNumber(star.shared))+'件 ・ 新しく知った '+format(safeNumber(star.discovered))+'件';
    const bubbles=$('comment-bubbles');bubbles.replaceChildren();
    const comments=Array.isArray(star.comments)?star.comments:[];
    if(!comments.length) {
      const message=document.createElement('span');
      message.textContent='公開されているコメントはまだありません。';
      bubbles.append(message);
      return;
    }
    comments.forEach(comment=>{
      const bubble=document.createElement('span');
      bubble.textContent=String(comment.text||'').slice(0,140);
      bubbles.append(bubble);
    });
  }
  function showStar(star,el) {
    state.selected=star.id;
    document.querySelectorAll('.star-node').forEach(n=>n.classList.toggle('selected',n===el));
    fillStarDetail(star);
    $('star-detail').hidden=false;
  }
  function closeStar() {
    state.selected=null;
    $('star-detail').hidden=true;
    document.querySelectorAll('.star-node').forEach(n=>n.classList.remove('selected'));
  }
  async function refreshSky() {
    if(!client) return;
    try {
      const {data,error}=await client.rpc('get_public_stars');
      if(error) throw error;
      state.stars=Array.isArray(data)?data:[];
      renderStars();
    } catch(error) {
      console.error(error);
      $('map-status').textContent='現在データを読み込めません';
    }
  }
  function showStep(step) {
    for(const id of ['choose','disease','comment','done']) {
      $('step-'+id).hidden=(step!==id);
    }
    $('step-counter').textContent=step==='done'?'THANK YOU':({'choose':'STEP 1 / 3','disease':'STEP 2 / 3','comment':'STEP 3 / 3'})[step];
    const modal=$('flow-modal');
    if(modal.open) modal.scrollTo({top:0,behavior:'instant'});
  }
  function choosePath(kind) {
    state.kind=kind;state.disease=null;
    showStep('disease');
    const isShare=kind==='share';
    $('disease-step-title').textContent=isShare?'想いを届けたい病気は？':'新しい星に出会おう。';
    $('disease-step-description').textContent=isShare
      ?'伝えたい病気を名前から選んでください。病気との関係は質問しません。'
      :'国内の受給者証所持者数が多い50疾患と、すでに光が灯った星から紹介します。診断数や患者総数のランキングではありません。';
    $('disease-search-wrap').hidden=!isShare;
    $('auto-disease').hidden=isShare;
    $('disease-search').value='';
    $('to-comment').disabled=true;
    if(isShare) {
      filterDisease('');
      $('disease-search').focus();
    } else {
      pickNewStar();
    }
  }
  function filterDisease(search) {
    const area=$('disease-results');area.replaceChildren();
    const q=search.normalize('NFKC').trim().toLowerCase();
    const matches=state.stars.filter(s=>
      !q || String(s.name).normalize('NFKC').toLowerCase().includes(q)
      || String(s.nameEn||'').normalize('NFKC').toLowerCase().includes(q)
      || (Array.isArray(s.aliases) && s.aliases.some(a =>
           String(a).normalize('NFKC').toLowerCase().includes(q)))
      || s.id.toLowerCase().includes(q)
    ).sort(sortMap).slice(0,25);
    if (!matches.length) {
      const p=document.createElement('p');p.textContent='一致する疾患はありません。';area.append(p);
    }
    for (const s of matches) {
      const b=document.createElement('button');
      b.type='button';
      b.setAttribute('role','option');
      b.textContent=s.name;
      if(s.parentName && s.conceptKind==='disease_subtype') {
        const hint=document.createElement('small');
        hint.className='result-parent';
        hint.textContent='関連する分類：'+s.parentName;
        b.append(hint);
      }
      b.classList.toggle('selected',state.disease===s.id);
      b.addEventListener('click',()=>{
        state.disease=s.id;
        $('disease-search').value=s.name;
        $('to-comment').disabled=false;
        filterDisease(s.name);
      });
      area.append(b);
    }
  }
  function pickNewStar() {
    // Weighted prevalence ranking is not guessed. The verified top-50
    // certificate-holder pool is combined with every existing lit star.
    // Each DISTINCT disease in this union gets one equal chance.
    const pool=state.stars.filter(star =>
      total(star)>0 || (Number.isInteger(star.discoveryRank) && star.discoveryRank>0));
    if (!pool.length) {
      $('auto-disease-name').textContent='紹介できる星がありません';
      $('to-comment').disabled=true;
      return;
    }
    const different=pool.filter(star=>star.id!==state.disease);
    const candidates=different.length?different:pool;
    const chosen=candidates[Math.floor(Math.random()*candidates.length)];
    state.disease=chosen.id;
    $('auto-disease-name').textContent=chosen.name;
    $('to-comment').disabled=false;
  }
  function moveToComment() {
    const star=state.stars.find(s=>s.id===state.disease);
    if(!star) return;
    $('selected-disease-name').textContent=star.name;
    $('thought-text').value='';
    $('text-count').textContent='0 / 140';
    document.querySelectorAll('[data-preset]').forEach(b=>b.classList.remove('selected'));
    $('submit-error').textContent='';
    showStep('comment');
  }
  async function submit() {
    if(state.busy||state.submitted||!client||!state.token||!state.disease||!state.kind) return;
    const comment=$('thought-text').value.trim();
    if (comment.length>140 || /https?:\/\/|www\.|@/.test(comment)) {
      $('submit-error').textContent='URL・メールアドレスなどは入力できません。';
      return;
    }
    state.busy=true;
    $('submit-entry').disabled=true;
    $('submit-entry').textContent='送信中…';
    try {
      const {data,error}=await client.rpc('submit_star',{
        p_device_token:state.token,p_disease_id:state.disease,
        p_kind:state.kind,p_comment:comment||null
      });
      if(error) throw error;
      if(!data||!data.ok) {
        if(data&&data.reason==='already_submitted') {
          setSubmitted(true);closeFlow();return;
        }
        throw new Error((data&&data.reason)||'submission rejected');
      }
      setSubmitted(true);
      $('comment-publish-status').textContent =
        data.comment_public ? '選んだ定型コメントも星に表示されました。' :
        data.comment_review_pending ? '自由記述のコメントは内容の確認後に表示します。' :
        'コメントなしで参加が完了しました。';
      showStep('done');
      await refreshSky();
    } catch (error) {
      console.error(error);
      $('submit-error').textContent='保存できませんでした。通信状況を確認してもう一度お試しください。';
    } finally {
      state.busy=false;
      $('submit-entry').disabled=false;
      $('submit-entry').textContent='この想いで星を灯す ✦';
    }
  }
  function closeFlow() { $('flow-modal').close(); }
  function openFlow() {
    if(state.submitted || state.busy || !client || !state.token) return;
    state.kind=null;state.disease=null;
    showStep('choose');$('flow-modal').showModal();
  }
  function bind() {
    $('open-form').addEventListener('click',openFlow);
    $('exit-flow').addEventListener('click',closeFlow);
    $('flow-modal').addEventListener('click',event=>{
      if(event.target===$('flow-modal')) closeFlow();
    });
    $('path-share').addEventListener('click',()=>choosePath('share'));
    $('path-discover').addEventListener('click',()=>choosePath('discover'));
    $('disease-search').addEventListener('input',event=>{
      state.disease=null;$('to-comment').disabled=true;filterDisease(event.target.value);
    });
    $('retry-disease').addEventListener('click',pickNewStar);
    $('back-to-choice').addEventListener('click',()=>showStep('choose'));
    $('back-to-disease').addEventListener('click',()=>showStep('disease'));
    $('to-comment').addEventListener('click',moveToComment);
    $('thought-text').addEventListener('input',e=>{
      $('text-count').textContent=e.target.value.length+' / 140';
      document.querySelectorAll('[data-preset]').forEach(b=>
        b.classList.toggle('selected',b.dataset.preset===e.target.value.trim()));
    });
    document.querySelectorAll('[data-preset]').forEach(button=>button.addEventListener('click',()=>{
      const area=$('thought-text');
      const text=button.dataset.preset;
      area.value=area.value.trim()===text?'':text;
      area.dispatchEvent(new Event('input',{bubbles:true}));
    }));
    $('submit-entry').addEventListener('click',submit);
    $('finish-flow').addEventListener('click',closeFlow);
    $('close-star').addEventListener('click',closeStar);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden){refreshStatus();refreshSky();}});
    setInterval(()=>{
      if(!document.hidden){refreshStatus();refreshSky();}
    },120000);
  }
  async function init() {
    state.token=token();
    bind();
    if(!client){
      $('map-status').textContent='データベースに接続できません';
      announce('通信サービスを利用できません。');
      return;
    }
    await Promise.all([refreshSky(),refreshStatus()]);
  }
  init().catch(error=>{console.error(error);announce('初期化に失敗しました。ページを再読み込みしてください。');});
})();