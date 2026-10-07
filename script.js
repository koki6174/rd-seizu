(() => {
  'use strict';
  const STORAGE_KEY = 'nenone-hoshizu-v1';
  const config = window.NENONE_CONFIG || {};
  const supabaseClient = window.supabase && config.supabaseUrl && config.supabasePublishableKey
    ? window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey)
    : null;
  const demo = new URLSearchParams(location.search).get('demo') === 'screenshot';
  const positions = [[115,125],[250,85],[390,145],[560,82],[680,170],[150,280],[315,245],[470,275],[620,315],[100,405],[370,390],[580,425]];
  const state = { diseases: [], questions: [], selectedId: null, data: { interests:{}, questions:[] }, remoteCounts:{} };
  const $ = (selector) => document.querySelector(selector);
  const svg = $('#constellation');
  const mapIndex = (() => {
    const existing = $('#map-index');
    if (existing) return existing;
    const index = document.createElement('div');
    index.id = 'map-index'; index.className = 'map-index';
    index.setAttribute('aria-label', '星図の疾患一覧');
    svg.insertAdjacentElement('afterend', index);
    return index;
  })();
  const detail = $('#detail-content');
  const empty = $('#empty-state');
  const input = $('#question-input');
  const form = $('#question-form');

  function loadSaved() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { interests:{}, questions:[] }; } catch { return { interests:{}, questions:[] }; } }
  function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data)); } catch { announce('このブラウザでは保存できませんでした。'); } }
  function countKey(diseaseId, interestType) { return `${diseaseId}::${interestType}`; }
  function totalRemoteInterest(diseaseId) {
    return ['first','learn','known'].reduce((sum, type) => sum + (state.remoteCounts[countKey(diseaseId, type)] || 0), 0);
  }
  async function loadRemoteCounts() {
    if (!supabaseClient) return;
    const { data, error } = await supabaseClient.from('interactions').select('disease_id,interest_type');
    if (error) throw error;
    state.remoteCounts = {};
    (data || []).forEach(row => {
      const key = countKey(row.disease_id, row.interest_type);
      state.remoteCounts[key] = (state.remoteCounts[key] || 0) + 1;
    });
    renderMap();
  }
  async function recordRemoteInterest(diseaseId, interestType) {
    if (!supabaseClient) throw new Error('Supabase client is not configured');
    const { error } = await supabaseClient.from('interactions').insert({ disease_id: diseaseId, interest_type: interestType });
    if (error) throw error;
    await loadRemoteCounts();
  }
  async function recordRemoteQuestion(diseaseId, text) {
    if (!supabaseClient) throw new Error('Supabase client is not configured');
    const { error } = await supabaseClient.from('questions').insert({ disease_id: diseaseId, question_text: text });
    if (error) throw error;
  }
  function announce(message) { $('#question-message').textContent = message; }
  function safeText(value) { return typeof value === 'string' ? value : ''; }
  function isPersonalInfo(text) {
    return /(?:@|\d{2,4}[-ー]\d{2,4}[-ー]\d{3,4}|\b\d{10,11}\b|(?:私|わたし|僕|ぼく).{0,8}(?:は|が).{0,12}(?:病|症状|診断)|(?:住所|電話|メール|氏名|病歴|遺伝情報))/.test(text);
  }
  function categoryLabels(disease) {
    const cats = window.dataset.categories || [];
    return disease.categoryIds.map(id => (cats.find(c => c.id === id) || {}).label || id);
  }
  function selectedDisease() { return state.diseases.find(d => d.id === state.selectedId); }
  function createSvg(tag, attrs = {}) { const el = document.createElementNS('http://www.w3.org/2000/svg', tag); Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k, v)); return el; }
  function renderMap() {
    svg.replaceChildren();
    const shown = state.diseases.slice(0, 12);
    // 背景の星は固定配置。端末ごとに見え方が揺れず、展示として落ち着いた画面になる。
    [[54,74,1],[92,190,1.2],[147,52,1],[206,400,1],[278,172,.8],[340,38,1.2],[442,97,.8],[507,423,1],[591,56,1.1],[728,90,.8],[749,258,1],[687,451,1.2],[247,456,.8],[64,340,1.1],[660,205,.7],[410,450,1]].forEach(([x,y,r]) => svg.append(createSvg('circle', {cx:x,cy:y,r,class:'background-star','aria-hidden':'true'})));
    [[0,1],[1,2],[2,6],[3,4],[4,8],[5,6],[6,7],[7,8],[6,10],[9,10],[10,11]].forEach(([a,b]) => {
      const line = createSvg('line', { x1:positions[a][0], y1:positions[a][1], x2:positions[b][0], y2:positions[b][1], class:'connector' }); svg.append(line);
    });
    shown.forEach((d,i) => {
      const [x,y] = positions[i]; const isSelected = d.id === state.selectedId; const remoteTotal = totalRemoteInterest(d.id); const growth = Math.min(1.75, 1 + Math.log1p(remoteTotal) / 5); const g = createSvg('g', { class:`node ${d.visual.accent}${isSelected ? ' active':''}`, tabindex:'0', role:'button', 'aria-label':`${d.nameJa}を選択。関心${remoteTotal}件`, 'data-id':d.id });
      g.append(createSvg('circle', { cx:x, cy:y, r: 22 * d.visual.size * growth, class:'node-halo' }));
      g.append(createSvg('circle', { cx:x, cy:y, r: 10 * d.visual.size * Math.min(1.35, growth) }));
      if (isSelected) {
        const text = createSvg('text', { x:x, y:y + 48, 'text-anchor':'middle', class:'selected-label' });
        text.textContent = d.nameJa;
        g.append(text);
      }
      g.addEventListener('click', () => selectDisease(d.id)); g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectDisease(d.id); } }); svg.append(g);
    });
    mapIndex.replaceChildren();
    shown.forEach(d => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `map-index-item${d.id === state.selectedId ? ' selected':''}`;
      button.textContent = d.nameJa;
      button.addEventListener('click', () => selectDisease(d.id));
      mapIndex.append(button);
    });
    // 投稿の内容は表示せず、匿名の問い一件を小さな光一つとして描画する。
    state.data.questions.forEach((_, i) => {
      const x = 55 + ((i * 97) % 690); const y = 55 + ((i * 71) % 390);
      svg.append(createSvg('circle', { cx:x, cy:y, r:3.5, class:'mint question-light', 'aria-hidden':'true' }));
    });
    renderQuestionHistory();
  }
  function field(title, text) { const h = document.createElement('h4'); h.textContent = title; const p = document.createElement('p'); p.textContent = safeText(text); detail.append(h,p); }
  function selectDisease(id) {
    state.selectedId = id; const d = selectedDisease(); if (!d) return;
    empty.hidden = true; detail.hidden = false; detail.replaceChildren();
    const tags = document.createElement('div'); categoryLabels(d).forEach(label => { const tag=document.createElement('span'); tag.className='tag'; tag.textContent=label; tags.append(tag); }); detail.append(tags);
    const h = document.createElement('h3'); h.className='detail-name'; h.textContent=d.nameJa; const en=document.createElement('p'); en.className='detail-en'; en.textContent=d.nameEn; const participation=document.createElement('p'); participation.className='status-message'; participation.textContent=`これまでに ${totalRemoteInterest(d.id)} 件の関心が集まっています。`; detail.append(h,en,participation);
    field('どのような疾患？', d.shortDescription); field('暮らしとの関係', d.dailyLife); field('診断・治療・研究の現在地', d.currentState);
    const related = d.relatedIds.map(id => (state.diseases.find(x=>x.id===id)||{}).nameJa).filter(Boolean).join('・'); field('関連するテーマ', related || '関連情報を準備中です。');
    const h4=document.createElement('h4'); h4.textContent='情報源'; const a=document.createElement('a'); a.href=d.source.url; a.target='_blank'; a.rel='noopener noreferrer'; a.textContent=d.source.label; detail.append(h4,a);
    const warning=document.createElement('p'); warning.className='disclaimer'; warning.textContent='この説明は応募用プロトタイプの短い仮文です。正式公開前に、専門的な内容確認が必要です。'; detail.append(warning);
    input.disabled = false; form.querySelector('button[type="submit"]').disabled = false; document.querySelectorAll('[data-interest]').forEach(b=>b.classList.toggle('selected', state.data.interests[id] === b.dataset.interest));
    $('#interest-message').textContent = `「${d.nameJa}」への関心を記録できます。`; renderMap();
  }
  function questionsFor(id) { return [...state.questions, ...state.data.questions].filter(q => q.diseaseId === id); }
  function renderQuestionHistory() {
    const history = $('#question-history');
    if (!history) return;
    const questions = state.data.questions.filter(q => q.diseaseId === state.selectedId);
    history.replaceChildren();
    if (!state.selectedId || questions.length === 0) { history.hidden = true; return; }
    history.hidden = false;
    const title = document.createElement('h3'); title.textContent = 'この端末に残した問い';
    const note = document.createElement('p'); note.textContent = 'この端末にも保存されています。展示用DBへ送信済みの問いは、端末リセットでは削除されません。';
    const list = document.createElement('ol');
    questions.slice().reverse().forEach(question => { const item = document.createElement('li'); item.textContent = safeText(question.text); list.append(item); });
    history.append(title, note, list);
  }
  function addQuestionLight() { $('#node-count').textContent = `${state.diseases.length}の光 + ${state.data.questions.length}の問い`; renderMap(); }
  function reset() { state.data={interests:{},questions:[]}; save(); document.querySelectorAll('[data-interest]').forEach(b=>b.classList.remove('selected')); addQuestionLight(); announce('この端末の操作履歴をリセットしました。展示用DBの匿名記録は残ります。'); }
  async function init() {
    try {
      const [diseases, questions] = await Promise.all([fetch('./content/diseases.sample.json').then(r => {if(!r.ok) throw new Error('data load failed'); return r.json();}), fetch('./content/questions.sample.json').then(r => r.ok ? r.json() : {questions:[]})]);
      window.dataset = diseases; state.diseases=diseases.diseases; state.questions=questions.questions || []; state.data=loadSaved();
      if (demo) { document.body.classList.add('screenshot'); state.data={interests:{als:'learn'},questions:[{diseaseId:'als',text:'診断までの道のりは、どのように共有できるのですか？'},{diseaseId:'fabry-disease',text:'暮らしの中の工夫を知りたいです。'}]}; }
      $('#node-count').textContent=`${state.diseases.length}の光`; renderMap(); addQuestionLight();
      try { await loadRemoteCounts(); } catch (error) { console.warn('Supabaseの集計を読み込めませんでした。ローカル表示を継続します。', error); }
      if (demo) selectDisease('wilson-disease');
    } catch (error) { console.error(error); $('#node-count').textContent='データを読み込めませんでした'; announce('データの読み込みに失敗しました。Webサーバーから開いてください。'); }
  }
  $('#start-button').addEventListener('click', () => $('.constellation-section').scrollIntoView({behavior:'smooth'}));
  input.addEventListener('input', () => { $('#char-count').textContent = `${input.value.length} / 100文字`; });
  form.addEventListener('submit', async e => { e.preventDefault(); const text=input.value.trim(); const submitButton=form.querySelector('button[type="submit"]'); if (!state.selectedId || !text) { announce('疾患を選び、問いを入力してください。'); return; } if (isPersonalInfo(text)) { announce('個人情報が含まれている可能性があります。氏名、メールアドレス、電話番号などを削除してください。'); return; } const diseaseId=state.selectedId; submitButton.disabled=true; state.data.questions.push({diseaseId,text,createdAt:new Date().toISOString()}); save(); input.value=''; $('#char-count').textContent='0 / 100文字'; addQuestionLight(); try { await recordRemoteQuestion(diseaseId, text); announce('問いを星図に加えました。内容は確認後に扱います。'); } catch (error) { console.warn(error); announce('通信できなかったため、この端末内に問いを保存しました。'); } finally { submitButton.disabled=false; } });
  document.querySelectorAll('[data-interest]').forEach(button => button.addEventListener('click', async () => { if (!state.selectedId) { $('#interest-message').textContent='先に星図から疾患を選んでください。'; return; } const diseaseId=state.selectedId; const interestType=button.dataset.interest; const interestButtons=[...document.querySelectorAll('[data-interest]')]; interestButtons.forEach(b=>b.disabled=true); state.data.interests[diseaseId]=interestType; save(); interestButtons.forEach(b=>b.classList.toggle('selected',b===button)); $('#interest-message').textContent='星図へ記録しています…'; try { await recordRemoteInterest(diseaseId, interestType); $('#interest-message').textContent='あなたの関心が、みんなの星図に加わりました。'; if (state.selectedId === diseaseId) selectDisease(diseaseId); } catch (error) { console.warn(error); $('#interest-message').textContent='通信できなかったため、この端末内に記録しました。'; } finally { interestButtons.forEach(b=>b.disabled=false); } }));
  const dialog=$('#confirm-dialog'); $('#reset-button').addEventListener('click',()=>dialog.showModal()); $('#cancel-reset').addEventListener('click',()=>dialog.close()); $('#confirm-reset').addEventListener('click',()=>{reset();dialog.close();});
  init();
})();
