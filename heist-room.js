(()=>{
  const $ = sel => document.querySelector(sel);
  const $$ = sel => [...document.querySelectorAll(sel)];
  const role = (new URLSearchParams(location.search).get('role') || 'lizzy').toLowerCase();
  const roleLabel = role === 'mikael' ? 'Mikael • Control Room' : 'Lizzy • Vault Runner';
  const roleBadge = role === 'mikael' ? 'HQ SIDE' : 'FIELD SIDE';
  const STAGES = {
    1: {
      title: 'Stage 1 — Lockdown Protocol',
      summary: 'The bank is in lockdown. Only by combining the symbol key from Mikael with the wall order from Lizzy can you unlock the first gate.',
      mikael: {
        room: 'Security Control Room',
        visual: 'Four brass plaques glow under a red alarm strip. A laminated symbol chart hangs beside twelve CCTV screens.',
        clues: [
          '🜂 = 4',
          '◈ = 8',
          '☾ = 1',
          '✦ = 5',
          'Sticky note: “Read Lizzy’s symbols left to right. Do NOT let her press the croissant button.”'
        ],
        action: {type:'display', text:'Guide Lizzy. She sees the symbol sequence but not the values.'}
      },
      lizzy: {
        room: 'Outer Vault Chamber',
        visual: 'A dramatic steel door blocks the path. Four glowing symbols pulse above the keypad.',
        clues: [
          'Vault symbols shown above the keypad: 🜂  ◈  ☾  ✦',
          'Small warning: “Absolutely not the Wi‑Fi password.”'
        ],
        action: {type:'text', placeholder:'Enter the 4-digit lockdown code', button:'Unlock Gate', field:'answer'}
      }
    },
    2: {
      title: 'Stage 2 — Laser Corridor',
      summary: 'Lizzy must cross the laser hall, but only Mikael can see the safe route from the CCTV grid.',
      mikael: {
        room: 'Overhead Camera Grid',
        visual: 'A floor map highlights the only safe pressure pads in green while laser emitters flash everywhere else.',
        clues: [
          'Safe route: A2 → B1 → C3 → D2',
          'Maintenance note: “Step only on ONE tile per column. Looking confident is optional.”'
        ],
        action: {type:'display', text:'Tell Lizzy the exact tile order.'}
      },
      lizzy: {
        room: 'Laser Hallway',
        visual: 'Thin red beams cut across a glossy black floor. Four columns of pressure tiles sit beneath them.',
        clues: [
          'Tap one tile in each column to cross.',
          'Columns run A to D from left to right; rows run 1 to 3 from top to bottom.'
        ],
        action: {type:'grid', button:'Cross Corridor'}
      }
    },
    3: {
      title: 'Stage 3 — Deposit Box Mystery',
      summary: 'The correct deposit box is hidden among decoys. Mikael has the ledger; Lizzy has the wall of boxes.',
      mikael: {
        room: 'Records Office',
        visual: 'Old ledgers and a coffee-stained roster sit under a desk lamp. One page is marked “special reserve”.',
        clues: [
          'Ledger page: “One‑of‑One Garden Seed Prototype → Box 317”',
          'Crossed out note: “Do NOT confuse with 137. That one contains unpaid parking fines.”'
        ],
        action: {type:'display', text:'Tell Lizzy the correct deposit box.'}
      },
      lizzy: {
        room: 'Safe Deposit Gallery',
        visual: 'Rows of metallic boxes stretch along the wall. Three are glowing faintly: 137, 271, 317.',
        clues: [
          'Only one box contains the prototype key item.',
          'Wrong box = dramatic buzzer and public embarrassment.'
        ],
        action: {type:'choices', choices:['137','271','317'], button:'Open Deposit Box'}
      }
    },
    4: {
      title: 'Stage 4 — Pressure Vault',
      summary: 'A pressure plate needs the exact target weight. Mikael sees the target and item weights; Lizzy places the objects.',
      mikael: {
        room: 'Blueprint Balcony',
        visual: 'A blueprint table shows the target load and the weight of each movable item in the room below.',
        clues: [
          'Target floor pressure: 27 kg',
          'Gold bar = 10 kg',
          'Diamond case = 7 kg',
          'Cash brick = 5 kg',
          'Mask case = 3 kg',
          'Master key = 2 kg',
          'Memo: “No almosts. The vault respects maths, not vibes.”'
        ],
        action: {type:'display', text:'Work out which items Lizzy should place.'}
      },
      lizzy: {
        room: 'Pressure Chamber',
        visual: 'A circular vault plate glows blue, waiting for the exact load. Crates of valuables surround it.',
        clues: [
          'Select the items to place on the pressure pad.',
          'You may choose more than one item.'
        ],
        action: {type:'checks', items:[
          {id:'gold', label:'Gold bar'},
          {id:'diamond', label:'Diamond case'},
          {id:'cash', label:'Cash brick'},
          {id:'mask', label:'Mask case'},
          {id:'key', label:'Master key'}
        ], button:'Balance Pressure Plate'}
      }
    },
    5: {
      title: 'Stage 5 — Final Escape',
      summary: 'Mikael must arm the override while Lizzy enters the merged code using fragments seen on both screens.',
      mikael: {
        room: 'Override Console',
        visual: 'A brass lever hums beside an emergency screen flashing the final override fragment.',
        clues: [
          'Your fragment: AB-47',
          'Order note: “Start with Lizzy’s 2-character fragment, then append Mikael’s fragment.”',
          'Emergency instruction: “Arm the override before Lizzy enters the code.”'
        ],
        action: {type:'arm', button:'Arm Final Override'}
      },
      lizzy: {
        room: 'Escape Vault Door',
        visual: 'A cinematic exit door looms ahead. The keypad flickers with room for one final code.',
        clues: [
          'Your fragment: Q9',
          'You need Mikael’s fragment and the correct order.',
          'Once the override is armed, enter the full code.'
        ],
        action: {type:'text', placeholder:'Enter the final merged code', button:'Open Escape Door', field:'answer'}
      }
    }
  };

  const TEST_WORKER_FALLBACK='https://mickyhq-test.mulaudzimikael73.workers.dev';
  const state = {data:null, busy:false, draft:{stage:null,path:[],choice:'',selection:[],answer:''}};

  function resolveWorkerUrl(){
    // TESTR stores its isolated Worker URL here via test-site-config.js.
    try{
      const testUrl=(localStorage.getItem('lizzyos_test_worker_url_v1')||'').trim();
      if(/^https?:/i.test(testUrl)) return testUrl;
    }catch{}
    try{
      const parentDoc = window.parent && window.parent !== window ? window.parent.document : null;
      const parentInput = parentDoc?.getElementById('testWorkerUrl');
      if(parentInput?.value && /^https?:/i.test(parentInput.value.trim())) return parentInput.value.trim();
    }catch{}
    if(window.TEST_WORKER_URL && /^https?:/i.test(window.TEST_WORKER_URL)) return window.TEST_WORKER_URL;
    if(window.LIZZY_TEST_MODE && window.LIZZY_TELEGRAM_WORKER_URL && /^https?:/i.test(window.LIZZY_TELEGRAM_WORKER_URL)) return window.LIZZY_TELEGRAM_WORKER_URL;
    // Final TEST-only fallback. Never use the production lizzyos-notifications Worker here.
    return TEST_WORKER_FALLBACK;
  }
  function resolveHQKey(){
    const keys=['hqKey','testHqKey','mikaelHQKey','mikaelTestHQKey'];
    for(const k of keys){ const v=localStorage.getItem(k); if(v) return v; }
    try{
      const parentDoc = window.parent && window.parent !== window ? window.parent.document : null;
      const input = parentDoc?.getElementById('hqKey');
      if(input?.value) return input.value.trim();
    }catch{}
    const own = document.getElementById('heistHqKey');
    return own?.value?.trim() || '';
  }
  async function api(action,payload={}){
    const base = resolveWorkerUrl();
    if(!base) throw new Error('No test worker URL found. Set the worker URL first.');
    const headers = {'content-type':'application/json'};
    if(role==='mikael' && resolveHQKey()) headers['X-Mikael-HQ-Key']=resolveHQKey();
    const res = await fetch(base,{method:'POST',headers,body:JSON.stringify({action,...payload,hqKey:resolveHQKey()||undefined})});
    const data = await res.json().catch(()=>({success:false,error:'Invalid server response'}));
    if(!res.ok || data.success===false) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  }
  async function apiGet(){
    const base = resolveWorkerUrl();
    if(!base) throw new Error('No test worker URL found.');
    const headers = role==='mikael'&&resolveHQKey()?{'X-Mikael-HQ-Key':resolveHQKey()}:{};
    try{
      const res = await fetch(`${base}${base.includes('?')?'&':'?'}action=heist_state`,{headers,cache:'no-store'});
      const data = await res.json().catch(()=>({success:false,error:'Invalid server response'}));
      if(res.ok && data.success!==false) return data;
    }catch{}
    const postHeaders={'content-type':'application/json',...headers};
    const res2=await fetch(base,{method:'POST',headers:postHeaders,body:JSON.stringify({action:'heist_state',hqKey:resolveHQKey()||undefined})});
    const data2=await res2.json().catch(()=>({success:false,error:'Invalid server response'}));
    if(!res2.ok || data2.success===false) throw new Error(data2.error || `Heist worker unavailable (${res2.status})`);
    return data2;
  }

  function escapeHtml(s){return String(s??'').replace(/[&<>'"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':'&quot;'}[m]))}
  function currentStageData(){
    const current = state.data?.currentStage || 1;
    return STAGES[current] || STAGES[5];
  }
  function renderLogs(){
    const logs = (state.data?.logs || []).slice().reverse().slice(0,8);
    return logs.length ? logs.map(log=>`<li><b>${escapeHtml(log.title)}</b><span>${escapeHtml(log.text)}</span></li>`).join('') : '<li><b>Waiting...</b><span>No moves yet.</span></li>';
  }
  function progressDots(){
    const stages = state.data?.stages || {};
    return Object.keys(STAGES).map(n=>{
      const solved = !!stages[n]?.solved;
      const current = Number(n) === Number(state.data?.currentStage||1);
      return `<div class="stageDot ${solved?'solved':''} ${current?'current':''}"><span>${n}</span><small>${solved?'Cleared':current?'Live':'Locked'}</small></div>`;
    }).join('');
  }
  function renderAction(action){
    const stage = state.data?.currentStage || 1;
    const stageState = state.data?.stages?.[stage] || {};
    if(!action) return '<p class="muted">No action on this side.</p>';
    if(action.type==='display') return `<div class="displayCard"><p>${escapeHtml(action.text)}</p></div>`;
    if(action.type==='text') return `<div class="actionBox"><input id="answerInput" class="heistInput" placeholder="${escapeHtml(action.placeholder)}" value="${escapeHtml(state.draft.stage===stage ? state.draft.answer : (stageState[role+'Draft']||''))}"><button id="submitAction" class="primaryBtn">${escapeHtml(action.button)}</button></div>`;
    if(action.type==='choices') return `<div class="actionBox choices">${action.choices.map(ch=>`<label class="choicePill"><input type="radio" name="boxChoice" value="${escapeHtml(ch)}" ${((state.draft.stage===stage?state.draft.choice:stageState.choice)===ch)?'checked':''}><span>${escapeHtml(ch)}</span></label>`).join('')}<button id="submitAction" class="primaryBtn">${escapeHtml(action.button)}</button></div>`;
    if(action.type==='checks') return `<div class="actionBox checks">${action.items.map(item=>`<label class="choicePill"><input type="checkbox" value="${escapeHtml(item.id)}" ${((state.draft.stage===stage?state.draft.selection:(stageState.selection||[]))).includes(item.id)?'checked':''}><span>${escapeHtml(item.label)}</span></label>`).join('')}<button id="submitAction" class="primaryBtn">${escapeHtml(action.button)}</button></div>`;
    if(action.type==='grid'){
      const picked = state.draft.stage===stage && state.draft.path.length ? state.draft.path : (stageState.path || []);
      const cols=['A','B','C','D'];
      const rows=[1,2,3];
      return `<div class="actionBox"><div class="laserGrid">${rows.map(row=>cols.map(col=>{const tile=col+row;return `<button class="tileBtn ${picked.includes(tile)?'selected':''}" data-tile="${tile}">${tile}</button>`}).join('')).join('')}</div><div class="tileMeta">Selected route: <b id="routePreview">${picked.join(' → ')||'None'}</b></div><button id="submitAction" class="primaryBtn">${escapeHtml(action.button)}</button></div>`;
    }
    if(action.type==='arm') return `<div class="actionBox"><button id="submitAction" class="primaryBtn">${escapeHtml(action.button)}</button><p class="muted">This enables Lizzy’s final keypad.</p></div>`;
    return '<p class="muted">No action.</p>';
  }
  function render(){
    const s = state.data || {};
    const stage = currentStageData();
    const side = stage[role] || stage.lizzy;
    $('#roleName').textContent = roleLabel;
    $('#roleBadge').textContent = roleBadge;
    $('#connectionStatus').textContent = resolveWorkerUrl() ? 'Connected to test worker' : 'Worker URL missing';
    $('#stageTitle').textContent = stage.title;
    $('#stageSummary').textContent = stage.summary;
    $('#roomTitle').textContent = side.room;
    $('#roomVisual').textContent = side.visual;
    $('#clueList').innerHTML = side.clues.map(c=>`<li>${escapeHtml(c)}</li>`).join('');
    $('#actionPanel').innerHTML = renderAction(side.action);
    $('#logList').innerHTML = renderLogs();
    $('#progressDots').innerHTML = progressDots();
    $('#sharedStatus').innerHTML = s.completed
      ? '<strong>✅ Escape complete.</strong> The Bank of Micky has been robbed with excessive professionalism.'
      : s.overrideArmed && Number(s.currentStage)===5
        ? '<strong>⚠ Final override armed.</strong> Lizzy can enter the escape code now.'
        : `<strong>Current stage:</strong> ${escapeHtml(stage.title)}`;
    $('#resultBox').textContent = s.completed ? (s.completionText || 'Both players escaped successfully.') : (s.lastMessage || 'Work together using your separate clues.');
    if(state.draft.stage!==Number(s.currentStage||1)){ state.draft={stage:Number(s.currentStage||1),path:[],choice:'',selection:[],answer:''}; }
    const resetWrap = $('#hqResetWrap');
    if(resetWrap) resetWrap.style.display = role==='mikael' ? 'flex' : 'none';

    $$('.tileBtn').forEach(btn=>btn.addEventListener('click',(e)=>{
      e.preventDefault();
      btn.classList.toggle('selected');
      state.draft.stage=Number(s.currentStage||1);
      state.draft.path=$$('.tileBtn.selected').map(x=>x.dataset.tile);
      $('#routePreview').textContent = state.draft.path.join(' → ') || 'None';
    }));
    $$('input[name="boxChoice"]').forEach(el=>el.addEventListener('change',()=>{state.draft.stage=Number(s.currentStage||1);state.draft.choice=el.value;}));
    $$('.checks input[type="checkbox"]').forEach(el=>el.addEventListener('change',()=>{state.draft.stage=Number(s.currentStage||1);state.draft.selection=$$('.checks input[type="checkbox"]:checked').map(x=>x.value);}));
    $('#answerInput')?.addEventListener('input',e=>{state.draft.stage=Number(s.currentStage||1);state.draft.answer=e.target.value;});
    $('#submitAction')?.addEventListener('click', submitCurrentAction);
    $('#refreshBtn')?.addEventListener('click', ()=>load(true));
    $('#resetHeistBtn')?.addEventListener('click', resetHeist);
  }
  async function submitCurrentAction(){
    if(state.busy) return;
    const stageNum = state.data?.currentStage || 1;
    const stage = currentStageData();
    const action = stage[role]?.action;
    let payload = {stage:stageNum, role};
    if(action?.type==='text') payload.answer = (state.draft.answer || $('#answerInput')?.value || '').trim();
    if(action?.type==='grid') payload.path = state.draft.path.length ? state.draft.path : $$('.tileBtn.selected').map(x=>x.dataset.tile);
    if(action?.type==='choices') payload.choice = state.draft.choice || $('input[name="boxChoice"]:checked')?.value || '';
    if(action?.type==='checks') payload.selection = state.draft.selection.length ? state.draft.selection : $$('.checks input[type="checkbox"]:checked').map(x=>x.value);
    if(action?.type==='arm') payload.arm = true;
    state.busy=true; $('#resultBox').textContent='Sending…';
    try{
      const res = await api('heist_submit', payload);
      const previousStage=stageNum;
      state.data = res.state;
      if(Number(state.data?.currentStage||1)!==Number(previousStage)) state.draft={stage:Number(state.data?.currentStage||1),path:[],choice:'',selection:[],answer:''};
      render();
      $('#resultBox').textContent = res.message || 'Move submitted.';
    }catch(err){ $('#resultBox').textContent='❌ '+err.message; }
    finally{ state.busy=false; }
  }
  async function resetHeist(){
    if(role!=='mikael') return;
    if(!confirm('Reset the full Bank of Micky Heist for both players?')) return;
    try{
      const res = await api('heist_reset', {role});
      const previousStage=stageNum;
      state.data = res.state;
      if(Number(state.data?.currentStage||1)!==Number(previousStage)) state.draft={stage:Number(state.data?.currentStage||1),path:[],choice:'',selection:[],answer:''};
      render();
      $('#resultBox').textContent='🔄 Heist reset. Both screens are back to Stage 1.';
    }catch(err){ $('#resultBox').textContent='❌ '+err.message; }
  }
  async function load(force=false){
    try{
      const res = await apiGet();
      const incoming = res.state;
      if(force || JSON.stringify(incoming)!==JSON.stringify(state.data)){
        const oldStage=Number(state.data?.currentStage||1), newStage=Number(incoming?.currentStage||1);
        const preserveDraft = state.draft.stage===oldStage && oldStage===newStage && (state.draft.path.length||state.draft.choice||state.draft.selection.length||state.draft.answer);
        state.data = incoming;
        if(!preserveDraft || force || incoming?.completed) render();
        else {
          $('#connectionStatus').textContent='Connected to test worker';
          $('#sharedStatus').innerHTML=`<strong>Current stage:</strong> ${escapeHtml(currentStageData().title)}`;
        }
      }
    }catch(err){ $('#connectionStatus').textContent = 'Connection issue'; $('#resultBox').textContent='❌ '+err.message; }
  }
  document.addEventListener('DOMContentLoaded',()=>{
    $('#roleName').textContent = roleLabel;
    $('#roleBadge').textContent = roleBadge;
    render();
    load(true);
    setInterval(()=>load(false),10000);
  });
})();
