(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const weekday = ['月', '火', '水', '木', '金', '土', '日'];
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  let diseaseNames = new Map();
  let selectedWeek = '';
  let currentWeek = '';

  function utcDate(value) {
    if (!pattern.test(value)) return null;
    const date = new Date(value + 'T00:00:00Z');
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) return null;
    return date;
  }
  function shiftDays(value, offset) {
    const d = utcDate(value);
    d.setUTCDate(d.getUTCDate() + offset);
    return d.toISOString().slice(0, 10);
  }
  function jstToday() {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(p => [p.type, p.value]));
    return [values.year, values.month, values.day].join('-');
  }
  function weekMonday(value) {
    const d = utcDate(value);
    const weekdayIndex = (d.getUTCDay() + 6) % 7;
    return shiftDays(value, -weekdayIndex);
  }
  function shortDate(value) {
    const [year, month, day] = value.split('-');
    return Number(month) + '月' + Number(day) + '日';
  }
  function longDate(value) {
    const [year] = value.split('-');
    return year + '年' + shortDate(value);
  }
  function setText(id, text) { $(id).textContent = String(text); }
  function count(value) { return Number(value || 0); }
  function formatCount(value) { return count(value).toLocaleString('ja-JP'); }
  function setStatus(text) { setText('load-status', text); }

  function renderChart(values) {
    const chart = $('daily-chart');
    chart.replaceChildren();
    const dayCount = Array.from({length: 7}, (_, i) => {
      const matching = (values || []).find(x => Number(x.day) === i);
      return count(matching && matching.count);
    });
    const max = Math.max(1, ...dayCount);
    dayCount.forEach((n, index) => {
      const group = document.createElement('div');
      group.className = 'day-group';
      const top = document.createElement('span');
      top.className = 'day-count';
      top.textContent = formatCount(n);
      const column = document.createElement('div');
      column.className = 'day-column';
      const fill = document.createElement('div');
      fill.className = 'day-fill';
      fill.style.height = (n === 0 ? 0 : Math.max(8, Math.round(n / max * 100))) + '%';
      column.append(fill);
      const day = document.createElement('span');
      day.className = 'day-label';
      day.textContent = weekday[index];
      group.append(top, column, day);
      chart.append(group);
    });
    chart.setAttribute('aria-label', weekday.map((day,i) => day + '曜 ' + formatCount(dayCount[i]) + '件').join('、'));
  }

  function renderBreakdown(data) {
    const total = Math.max(1, count(data.interest_count));
    [['first','first_count'], ['learn','learn_count'], ['known','known_count']].forEach(([kind, key]) => {
      setText(kind + '-count', formatCount(data[key]));
      $(kind + '-bar').style.width = Math.round(count(data[key]) / total * 100) + '%';
    });
  }

  function renderStatistics(data) {
    const total = count(data.interest_count);
    const previous = count(data.previous_interest_count);
    const diseaseId = data.top_disease_id;
    setText('interest-count', formatCount(total));
    setText('disease-count', formatCount(data.disease_count));
    setText('featured-disease', diseaseId
      ? (diseaseNames.get(diseaseId) || '集計対象の星')
      : 'これから見つかる星');
    setText('top-disease-count', diseaseId
      ? 'この週に ' + formatCount(data.top_disease_count) + ' 件の関心'
      : 'まだ関心の記録がありません');
    renderBreakdown(data);
    renderChart(data.daily_counts);
    const diff = total - previous;
    let headline, detail;
    if (total === 0 && previous === 0) {
      headline = '最初の光を、待っています。';
      detail = '今週の関心はまだ記録されていません。あなたの参加から星図が育ちます。';
    } else if (diff > 0) {
      headline = '先週より ' + formatCount(diff) + ' 件、関心が増えました。';
      detail = '先週 ' + formatCount(previous) + ' 件 → 今週 ' + formatCount(total) + ' 件の記録が集まっています。';
    } else if (diff < 0) {
      headline = '今週も、関心の光が集まっています。';
      detail = '先週 ' + formatCount(previous) + ' 件 → 今週 ' + formatCount(total) + ' 件。週ごとの変化を記録しています。';
    } else {
      headline = '先週と同じ数の関心が寄せられました。';
      detail = '先週・今週ともに ' + formatCount(total) + ' 件です。';
    }
    setText('growth-message', headline);
    setText('growth-detail', detail);
  }

  function renderEditorial(row) {
    const question = row && row.featured_question && row.featured_question.trim();
    const note = row && row.growth_note && row.growth_note.trim();
    setText('weekly-question', question || '来場者の問いを、ここから紹介していきます。');
    setText('question-note', question
      ? '運営による確認後に掲載された問いです。'
      : 'まだ掲載できる問いがありません。個人情報などを確認した後で紹介します。');
    if (note) setText('growth-detail', note);
  }

  async function loadDiseases() {
    try {
      const result = await fetch('../content/diseases.sample.json', {cache: 'no-cache'});
      if (!result.ok) throw new Error('disease data unavailable');
      const json = await result.json();
      diseaseNames = new Map((json.diseases || []).map(d => [d.id, d.nameJa]));
    } catch (error) {
      console.warn('疾患名の一覧を読み込めませんでした。', error);
    }
  }

  async function loadWeek() {
    const thisWeek = selectedWeek;
    const end = shiftDays(thisWeek, 6);
    setText('week-label', longDate(thisWeek) + '（月）〜' + shortDate(end) + '（日）');
    setText('updated-label', '日本時間・週ごとの集計');
    $('next-week').disabled = thisWeek >= currentWeek;
    history.replaceState(null, '', thisWeek === currentWeek
      ? location.pathname
      : location.pathname + '?week=' + encodeURIComponent(thisWeek));
    setStatus('集計データを取得しています...');
    const config = window.NENONE_CONFIG;
    if (!window.supabase || !config || !config.supabaseUrl || !config.supabasePublishableKey) {
      setStatus('集計サービスに接続できません。時間をおいて再読み込みしてください。');
      return;
    }
    const client = window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey);
    try {
      const [statsResponse, editorialResponse] = await Promise.all([
        client.rpc('get_weekly_constellation', {p_week_start: thisWeek}).single(),
        client.from('weekly_editorial').select('featured_question,growth_note')
          .eq('week_start', thisWeek).eq('approved', true).maybeSingle()
      ]);
      if (thisWeek !== selectedWeek) return;
      if (statsResponse.error) throw statsResponse.error;
      if (editorialResponse.error) throw editorialResponse.error;
      if (!statsResponse.data) throw new Error('No weekly summary returned');
      renderStatistics(statsResponse.data);
      renderEditorial(editorialResponse.data);
      const now = new Intl.DateTimeFormat('ja-JP', {
        timeZone:'Asia/Tokyo', month:'numeric', day:'numeric',
        hour:'2-digit', minute:'2-digit'
      }).format(new Date());
      setText('updated-label', now + ' 時点');
      setStatus('');
    } catch (error) {
      console.error('週次集計の取得に失敗しました', error);
      setStatus('集計データを読み込めませんでした。通信を確認して、ページを再読み込みしてください。');
    }
  }

  function changeWeek(offset) {
    selectedWeek = shiftDays(selectedWeek, offset);
    if (selectedWeek > currentWeek) selectedWeek = currentWeek;
    loadWeek();
  }

  async function init() {
    currentWeek = weekMonday(jstToday());
    const asked = new URLSearchParams(location.search).get('week') || '';
    selectedWeek = utcDate(asked) && weekMonday(asked) === asked && asked <= currentWeek
      ? asked : currentWeek;
    $('previous-week').addEventListener('click', () => changeWeek(-7));
    $('next-week').addEventListener('click', () => changeWeek(7));
    $('current-week').addEventListener('click', () => {
      selectedWeek = currentWeek;
      loadWeek();
    });
    $('print-button').addEventListener('click', () => window.print());
    await loadDiseases();
    await loadWeek();
  }
  init().catch(error => {
    console.error(error);
    setStatus('ページを初期化できませんでした。再読み込みしてください。');
  });
})();