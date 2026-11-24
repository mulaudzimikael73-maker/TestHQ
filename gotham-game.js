import {sceneSVG} from './gotham-scenes.js';
const role=document.documentElement.dataset.role||'catwoman';
const isBatman=role==='batman', name=isBatman?'Batman':'Catwoman';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const DEFAULT_API='https://mickyhq-test.mulaudzimikael73.workers.dev';
let api=localStorage.getItem('gotham4:api')||DEFAULT_API;
let hqKey=sessionStorage.getItem('gotham4:hq')||'';
let session=sessionStorage.getItem('gotham4:session')||'';
let token=sessionStorage.getItem('gotham4:token')||'';
let invited=sessionStorage.getItem('gotham4:invite')?{session:sessionStorage.getItem('gotham4:session'),invite:sessionStorage.getItem('gotham4:invite')}:null, game=null, puzzleId=null, draft=null, selectedObject=null, tab='scene', timer=null, busy=false, lastEvidenceHash='', lastChatHash='', lastProgress=-1;
let audio=localStorage.getItem('gotham4:audio')!=='off';
let reduced=localStorage.getItem('gotham4:motion')==='reduce'||window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const query=new URLSearchParams(location.search);if(query.has('session')){invited={session:query.get('session'),invite:query.get('invite')||''};if(!isBatman){session=invited.session;token='';}}

function feedback(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(feedback.t);feedback.t=setTimeout(()=>t.classList.remove('show'),3600)}
function sound(type='tap'){
 if(!audio)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const ctx=sound.ctx||(sound.ctx=new C());if(ctx.state==='suspended')ctx.resume();const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.type=type==='success'?'sine':'triangle';o.frequency.setValueAtTime(type==='success'?470:260,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(type==='success'?800:210,ctx.currentTime+.13);g.gain.setValueAtTime(.0001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.042,ctx.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.2);o.start();o.stop(ctx.currentTime+.22)}catch(_){}}
function baseApi(){return api.replace(/\/+$/,'')+'/gotham/v1'}
async function request(path,data=null,admin=false){
 const headers={'content-type':'application/json'};if(token)headers['x-gotham-token']=token;if(admin)headers['x-mikael-hq-key']=hqKey;
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),14000);
 try{const r=await fetch(baseApi()+path,{method:data?'POST':'GET',headers,body:data?JSON.stringify(data):undefined,cache:'no-store',signal:controller.signal});const obj=await r.json();if(!r.ok||obj.ok===false)throw new Error(obj.error||'Unable to connect');return obj;}finally{clearTimeout(timeout)}
}
function saveCredentials(result){session=result.session||session;token=result.token||token;sessionStorage.setItem('gotham4:session',session);sessionStorage.setItem('gotham4:token',token);sessionStorage.setItem('gotham4:api',api);localStorage.setItem('gotham4:api',api);if(isBatman&&result.invite)sessionStorage.setItem('gotham4:invite',result.invite);if(isBatman&&hqKey)sessionStorage.setItem('gotham4:hq',hqKey);}
function toggleScreen(which){for(const id of ['welcome','briefing','play'])$('#'+id).classList.toggle('hidden',id!==which);}
function setSignal(on){$('#connection-label').textContent=on?'TEST Worker connected':'Connection unavailable';$('#connection-dot').classList.toggle('off',!on)}
function setupWelcome(){
 toggleScreen('welcome');const isJoin=!!invited?.invite&&!isBatman;
 $('#welcome').innerHTML=`<div class="welcome card"><div class="content"><div class="eyebrow">Wayne Enterprises · Confidential mission</div><h1>${isBatman?'Enter the Batcomputer':'An Invitation to Wayne Manor'}</h1><p>${isBatman?'A two-operative investigation awaits. Create a shared mission or reconnect to a previous session. Your existing LizzyOS remains untouched.':'You have been invited to investigate a disturbance at Wayne Manor. Batman cannot solve this alone. Are you ready, Miss Kyle?'}</p><div class="form-grid"><label class="field">Gotham TEST Worker URL<input class="input" id="api-input" spellcheck="false" value="${escapeHTML(api)}" placeholder="https://...workers.dev"/></label>${isBatman?'<label class="field">Private Test HQ key<input class="input" id="key-input" type="password" autocomplete="off" placeholder="Existing MIKAEL_HQ_KEY"/></label>':'<label class="field">Mission invitation code<input class="input" id="invite-input" spellcheck="false" maxlength="24" placeholder="Invitation code" value="'+escapeHTML(invited?.invite||'')+'"/></label>'}</div><div class="form-row">${isBatman?'<button class="btn primary" id="create">Start a new mission</button><button class="btn secondary" id="restore">Resume last mission</button>':'<button class="btn primary" id="join">Accept invitation</button>'}</div><p class="fine" style="margin-top:16px">Mission progress is stored on the TEST Worker. Puzzle solutions are never included in this page.</p></div></div>`;
 $('#api-input').addEventListener('change',e=>{api=e.target.value.trim().replace(/\/+$/,'');localStorage.setItem('gotham4:api',api)});
 const connect=async action=>{try{api=$('#api-input').value.trim().replace(/\/+$/,'');localStorage.setItem('gotham4:api',api);if(!/^https?:\/\//.test(api))throw Error('Enter the full HTTPS Worker URL.');if(isBatman){hqKey=$('#key-input').value.trim()||hqKey;if(!hqKey)throw Error('Enter your Test HQ key.');const res=await request(action==='create'?'/create':'/restore',action==='create'?{}:{session:query.get('session')||session||undefined},true);saveCredentials(res);invited={session:res.session,invite:res.invite};}else{const code=$('#invite-input').value.trim().toUpperCase();const s=query.get('session')||session;if(!s)throw Error('Open the invitation link from Batman to identify your mission.');const res=await request('/join',{session:s,invite:code});saveCredentials(res);}feedback('Secure mission connection established.');await refresh(true);startPolling();}catch(e){feedback(e.message)}};
 if(isBatman){$('#create').onclick=()=>connect('create');$('#restore').onclick=()=>connect('restore');}else{$('#join').onclick=()=>connect('join')}
 if(isBatman&&hqKey)$('#key-input').value=hqKey;
}
async function refresh(force=false){
 if(!session||!token||busy)return;busy=true;try{const next=await request('/state?session='+encodeURIComponent(session));setSignal(true);const old=game;game=next;
 const m=game.mission;
 if(!m.started){renderBriefing();toggleScreen('briefing');}
 else{toggleScreen('play');renderGame(force||!old||old.puzzle.id!==next.puzzle.id||old.mission.completed!==next.mission.completed||old.mission.awaitingSync!==next.mission.awaitingSync);}
 }catch(e){setSignal(false);if(force)feedback(e.message)}finally{busy=false}
}
function startPolling(){if(timer)clearInterval(timer);timer=setInterval(()=>{refresh().catch(()=>{})},3400)}
async function act(action,more={}){
 if(!session||!token)return;try{const r=await request('/act',{session,action,nonce:crypto.randomUUID().replaceAll('-',''),...more});sound(r.correct===true?'success':'tap');if(r.message)feedback(r.message);else if(r.correct===false)feedback('The configuration is not supported by the evidence.');await refresh(true);return r;}catch(e){feedback(e.message);return null}
}
function renderBriefing(){
 const m=game.mission;const both=m.ready.batman&&m.ready.catwoman;
 const html=`<div class="welcome card reveal"><div class="content"><div class="eyebrow">Gotham mission briefing · Secure channel</div><h1>Operation: Midnight Lockdown</h1><p>Wayne Manor has reported an unexplained security disturbance. Your role is important, but neither operative will receive the full picture. Study, communicate and trust each other.</p><div class="intro-grid"><div class="brief"><h3>${isBatman?'🦇 Batman — Detective Console':'🐈‍⬛ Catwoman — Field Operative'}</h3><p>${isBatman?'Review security logs, use detective systems, operate remote panels and exchange evidence with Catwoman.':'Explore the rooms, inspect physical evidence, manipulate mechanisms and exchange discoveries with Batman.'}</p></div><div class="brief"><h3>🎩 A message from Alfred</h3><p>“An unusual evening, even by Gotham standards. Please keep in touch with one another. I would prefer not to rescue the furniture.”</p></div></div><div class="form-row" style="align-items:center"><button class="btn ${m.ready[role]?'secondary':'primary'}" id="ready" ${m.ready[role]?'disabled':''}>${m.ready[role]?'✓ You are ready':"I'm ready"}</button>${isBatman?`<button class="btn primary" id="begin" ${both?'':'disabled'}>Launch investigation</button>`:''}</div><div class="soft" style="margin-top:15px">🦇 Batman: <b>${m.ready.batman?'Ready':'Waiting'}</b> &nbsp; · &nbsp; 🐈‍⬛ Catwoman: <b>${m.ready.catwoman?'Ready':'Waiting'}</b></div>${isBatman?`<div class="invite"><div class="eyebrow">PRIVATE INVITATION FOR CATWOMAN</div><p style="margin:5px 0 10px">Send Lizzy the link below. Keep your HQ key private.</p><label class="field">TESTR Gotham page URL<input id="testR-url" class="input" placeholder="https://your-testr.pages.dev/gotham-escape.html" value="${escapeHTML(localStorage.getItem('gotham4:testrUrl')||'')}"/></label><div class="form-row" style="margin-top:10px"><button class="btn secondary" id="copy-invite">Copy Lizzy's invitation link</button><button class="btn secondary" id="copy-code">Copy access code</button></div><p class="fine" style="margin-top:8px">Code: <b style="color:var(--gold)">${escapeHTML(invited?.invite||'Use Resume to retrieve')}</b></p></div>`:''}</div></div>`;
 if($('#briefing').dataset.last===String(m.ready.batman)+String(m.ready.catwoman)+String(m.started)+String(!!invited?.invite))return;
 $('#briefing').dataset.last=String(m.ready.batman)+String(m.ready.catwoman)+String(m.started)+String(!!invited?.invite);
 $('#briefing').innerHTML=html;
 $('#ready').onclick=()=>act('ready');if(isBatman){$('#begin').onclick=()=>act('begin');$('#copy-code').onclick=()=>copy(invited?.invite||'');$('#copy-invite').onclick=()=>{
 const input=$('#testR-url').value.trim();localStorage.setItem('gotham4:testrUrl',input);let target=input||location.origin+'/TESTR/gotham-escape.html';try{const u=new URL(target,location.href);u.searchParams.set('session',session);u.searchParams.set('invite',invited?.invite||'');copy(u.href)}catch{feedback('Enter a valid TESTR page URL.')}
 };}
}
function copy(t){if(!t){feedback('Nothing to copy yet.');return}navigator.clipboard?.writeText(t).then(()=>feedback('Copied to clipboard.')).catch(()=>{prompt('Copy this mission invitation',t)})||prompt('Copy this text',t)}
function stats(){const m=game.mission,p=game.puzzle,room=game.room;$('#chap-title').textContent=room.title;$('#chap-sub').textContent=room.subtitle+' · '+p.title;$('#room-counter').textContent=`ROOM ${room.index} OF 4`;
 $('#progress').innerHTML=Array.from({length:12},(_,i)=>`<i class="${i<m.completedCount?'done':''}" title="Puzzle ${i+1} ${i<m.completedCount?'complete':''}"></i>`).join('');$('#num-done').textContent=`${m.completedCount}/12`;
 const status=m.completed?'MISSION COMPLETED':m.paused?'PAUSED':m.awaitingSync?'FINAL SYNC':game.ownSolved?'WAITING FOR PARTNER':`PUZZLE ${p.id} / 12`;
 $('#mission-status').textContent=status;
 $('#role-id').textContent=name;$('#scene-title').textContent=room.title+' · '+p.title;
 $('#scene-caption').textContent=`Interact with highlighted evidence points or use the investigation console.`;
}
function renderGame(full){stats();const m=game.mission;if(m.completed){renderComplete();return}
 $('#game-interface').classList.remove('hidden');$('#complete-panel').classList.add('hidden');
 if(full||puzzleId!==game.puzzle.id){const oldPuzzle=puzzleId;puzzleId=game.puzzle.id;draft=game.ownDraft||null;selectedObject=null;lastEvidenceHash='';lastChatHash='';renderScene();renderConsole();renderEvidence();renderChat();activateTab(tab);if(oldPuzzle&&Math.ceil(oldPuzzle/3)!==Math.ceil(puzzleId/3))showChapterTransition();}
 else{
  const hash=JSON.stringify([game.discovered,game.shared,game.pastClues]);if(hash!==lastEvidenceHash){lastEvidenceHash=hash;renderScene();renderEvidence();}
  const c=JSON.stringify(game.chat);if(c!==lastChatHash){lastChatHash=c;renderChat()}
  const needs=game.ownSolved!==($('[data-solved]')?.dataset.solved==='true');if(needs)renderConsole();else updatePartnerStatus();renderDiagnostics();
 }
 if(m.completedCount>lastProgress&&lastProgress>=0){sound('success');if(game.moment&&!reduced)feedback(game.moment)}lastProgress=m.completedCount;
}
function renderScene(){const room=game.room.index-1;$('#scene').innerHTML=sceneSVG(room,game.puzzle.objects,game.discovered.map(x=>x.id));$('#scene').querySelectorAll('[data-object]').forEach(el=>{
 const cb=()=>inspect(el.dataset.object);el.addEventListener('click',cb);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();cb()}})
 });}
function inspect(id){selectedObject=id;const d=game.discovered.find(x=>x.id===id);if(d){showDetail(d);return}act('inspect',{object:id}).then(r=>{if(r){selectedObject=id;const item=game.discovered.find(x=>x.id===id);if(item)showDetail(item)}})}
function showDetail(d){const el=$('#detail');el.innerHTML=`<div class="title">${escapeHTML(d.label)}</div><p>${escapeHTML(d.detail)}</p><div class="actions"><button class="btn secondary small" id="share-clue">Share with ${isBatman?'Catwoman':'Batman'} ↗</button><button class="btn secondary small" id="close-detail">Close</button></div>`;el.classList.remove('hidden');$('#share-clue').onclick=()=>act('share',{object:d.id});$('#close-detail').onclick=()=>el.classList.add('hidden')}
function renderConsole(){const p=game.puzzle,r=game;const body=$('#console-body');body.dataset.solved=String(game.ownSolved);
 let output=`<div class="console-step">OPERATOR ${name.toUpperCase()} · CASE ${String(p.id).padStart(2,'0')}</div><h2>${escapeHTML(p.title)}</h2><p>${escapeHTML(p.intro)}</p><div class="sep"></div><h3>Investigate objects</h3><div class="objgrid">${p.objects.map((o,i)=>`<button type="button" class="obj ${game.discovered.some(d=>d.id===o.id)?'found':''}" data-inspect="${escapeHTML(o.id)}"><b>${i+1}</b><span>${escapeHTML(o.label)}</span></button>`).join('')}</div><div class="sep"></div>`;
 if(r.mission.awaitingSync){
  output+=`<div class="wait"><strong>Final synchronisation</strong><p>Both configurations have been accepted. Activate your control when your teammate is ready. The second activation must arrive within 30 seconds of the first.</p><button class="btn primary wide" id="sync" style="margin-top:12px">Activate ${name}'s override</button></div>`;
 }else if(r.ownSolved){output+=`<div class="wait"><strong>✓ Your portion is verified</strong><p>${r.partnerSolved?'The next security stage is opening.':'Waiting for your partner to complete their part.'}</p></div>`;}
 else{
  output+=`<div class="mechanism"><h3>${escapeHTML(p.control.label||'Set your mechanism')}</h3><div id="control-editor"></div><div class="submitbar"><button class="btn primary" id="submit">Validate my part</button><button class="btn secondary small" id="hint">Alfred hint (${r.hintLevel}/3)</button></div><p class="fine" style="margin-top:8px">Examine at least two objects before validating. You can change settings and inspect more clues at any time.</p></div>`;
 }
 output+='<div id="diagnostic" style="margin-top:12px"></div>';body.innerHTML=output;renderDiagnostics();
 body.querySelectorAll('[data-inspect]').forEach(el=>el.onclick=()=>inspect(el.dataset.inspect));
 if(r.mission.awaitingSync){$('#sync').onclick=()=>act('sync');return}
 if(r.ownSolved)return;
 draft= draft??(p.control.kind==='fields'?{}:p.control.kind==='sequence'?(p.control.rotatable?{order:[],flipped:null}:[]):'');
 renderEditor();$('#submit').onclick=()=>act('answer',{value:draft});$('#hint').onclick=()=>getHint();
}
function updatePartnerStatus(){const m=game.mission;if(m.awaitingSync||game.ownSolved){if(!$('#console-body .wait')||m.awaitingSync){renderConsole();return}$('#console-body .wait p').textContent=game.partnerSolved?'The next security stage is opening.':'Waiting for your partner to complete their part.'}}
function renderEditor(){
 const p=game.puzzle.control,area=$('#control-editor');if(!area)return;let html='';
 if(p.kind==='pick'){
  html=`<div class="choicegrid">${p.options.map(v=>`<button type="button" class="choice ${draft===v?'selected':''}" data-pick="${escapeHTML(v)}">${escapeHTML(v)}</button>`).join('')}</div>`;
 }else if(p.kind==='fields'){
  html=`<div class="settings">${p.items.map(f=>`<label class="field">${escapeHTML(f.label)}<select class="select" data-field="${escapeHTML(f.id)}"><option value="">— Choose —</option>${f.options.map(o=>`<option value="${escapeHTML(o)}" ${draft?.[f.id]===o?'selected':''}>${escapeHTML(o)}</option>`).join('')}</select></label>`).join('')}</div>`;
 }else if(p.kind==='sequence'){
  const size=p.items.length>4?4:p.items.length,arr=p.rotatable?(draft?.order||[]):(Array.isArray(draft)?draft:[]);
  html=`<div class="soft">Arrange ${size} objects in the correct sequence. Add items, reorder them with the arrows, and remove them if needed.${p.rotatable?' Rotate one physical frame upside down if the mounting evidence requires it.':''}</div><div class="sequence">${arr.length?arr.map((it,i)=>`<div class="seq-item"><span class="seq-idx">${i+1}</span><span style="${p.rotatable&&draft?.flipped===it?'transform:rotate(180deg);':''}">${escapeHTML(it)}</span><div class="seq-actions"><button type="button" aria-label="Move left" data-move="${i}:-1" ${i===0?'disabled':''}>◀</button><button type="button" aria-label="Move right" data-move="${i}:1" ${i===arr.length-1?'disabled':''}>▶</button>${p.rotatable?`<button type="button" aria-label="Rotate ${escapeHTML(it)}" data-flip="${escapeHTML(it)}">⟳</button>`:''}<button type="button" aria-label="Remove" data-remove="${i}">×</button></div></div>`).join(''):'<p class="fine">No items selected yet.</p>'}</div><div class="candidates">${p.items.filter(v=>!arr.includes(v)).map(v=>`<button type="button" class="btn secondary small" data-add="${escapeHTML(v)}" ${arr.length>=size?'disabled':''}>+ ${escapeHTML(v)}</button>`).join('')}</div>`;
 }
 area.innerHTML=html;
 const arr=()=>p.rotatable?(draft?.order||[]):(Array.isArray(draft)?draft:[]);
 const setarr=a=>{draft=p.rotatable?{order:a,flipped:draft?.flipped&&a.includes(draft.flipped)?draft.flipped:null}:a;renderEditor();saveDraft()};
 area.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{draft=b.dataset.pick;renderEditor();saveDraft()});
 area.querySelectorAll('[data-field]').forEach(e=>e.onchange=()=>{draft={...(draft||{}),[e.dataset.field]:e.value};saveDraft()});
 area.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>setarr([...arr(),b.dataset.add]));
 area.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>setarr(arr().filter((_,i)=>i!==Number(b.dataset.remove))));
 area.querySelectorAll('[data-move]').forEach(b=>b.onclick=()=>{const [index,delta]=b.dataset.move.split(':').map(Number);const a=[...arr()],next=index+delta;[a[index],a[next]]=[a[next],a[index]];setarr(a)});
 area.querySelectorAll('[data-flip]').forEach(b=>b.onclick=()=>{draft={order:arr(),flipped:draft?.flipped===b.dataset.flip?null:b.dataset.flip};renderEditor();saveDraft()});
}
function renderDiagnostics(){
 const el=$('#diagnostic');if(!el)return;const d=game?.diagnostics;if(!d){el.innerHTML='';return}
 if(d.label==='Power monitor'){
  const fmt=(title,lines)=>`<div class="soft" style="margin-top:8px"><strong>${title}</strong>${lines.map(l=>`<div class="smallstat"><span>Line ${escapeHTML(l.line)}</span><b style="color:${l.load>l.capacity?'#e19a8f':'#b5d6c2'}">${l.load} / ${l.capacity} units</b></div>`).join('')}</div>`;
  el.innerHTML='<div class="eyebrow">LIVE SYSTEM TELEMETRY</div>'+fmt('Batman assigned load',d.batman)+fmt('Catwoman connected load',d.catwoman);
 }else if(d.label==='Pressure interlock')el.innerHTML=`<div class="soft"><strong>Pressure monitor</strong><br>Power channels configured: ${d.batman} / 2<br>Mechanical components configured: ${d.catwoman} / 3</div>`;
 else if(d.label==='Release console')el.innerHTML='<div class="soft">'+escapeHTML(d.message)+'</div>';
}
function showChapterTransition(){
 const overlay=$('#chapter-overlay');if(!overlay)return;const n=game.room.index,sub=['','The manor opens its next secret.','The investigation moves beneath the city.','The final security chamber awaits.'][n-1]||'Another chapter has opened.';
 overlay.innerHTML=`<div class="modal card reveal" style="text-align:center"><div class="eyebrow">CHAPTER ${n} / 4 UNLOCKED</div><h2 style="font-size:25px;margin:14px 0">${escapeHTML(game.room.title)}</h2><p class="muted" style="margin-bottom:20px">${escapeHTML(sub)}</p><button class="btn primary" id="chapter-continue">Continue investigation</button></div>`;
 overlay.classList.remove('hidden');overlay.querySelector('#chapter-continue').onclick=()=>overlay.classList.add('hidden');sound('success');
}
let adjustmentDelay=null;function saveDraft(){clearTimeout(adjustmentDelay);adjustmentDelay=setTimeout(()=>{if(session&&token)request('/act',{session,action:'adjust',value:draft,nonce:crypto.randomUUID().replaceAll('-','')}).catch(()=>{})},400)}
async function getHint(){const r=await act('hint');if(r){$('#hint-modal').classList.remove('hidden');$('#hint-text').textContent=r.hint||'Alfred is considering the matter.';$('#hint-level').textContent=`Alfred · Hint ${r.level}/3`;}}
function renderEvidence(){const p=game.puzzle,html=[...game.discovered.map(x=>({...x,from:role,section:'Personal discoveries'})),...game.shared.map(x=>({...x,section:'Shared by partner'})),...game.pastClues.map(x=>({...x,section:`Earlier case · ${x.room}`}))];
 const out=$('#evidence-list');out.innerHTML=html.length?html.map(x=>`<div class="evi"><span class="tag">${escapeHTML(x.section)}</span><strong>${escapeHTML(x.label)}</strong><p>${escapeHTML(x.detail)}</p></div>`).join(''):'<div class="soft">Your case board is empty. Inspect objects in the scene to collect evidence.</div>';lastEvidenceHash=JSON.stringify([game.discovered,game.shared,game.pastClues]);
}
function renderChat(){const history=game.chat||[];const box=$('#chat-log');box.innerHTML=history.length?history.map(m=>`<div class="chat-bubble user"><strong>${name}</strong>${escapeHTML(m.question)}</div><div class="chat-bubble"><strong>Alfred Pennyworth</strong>${escapeHTML(m.answer)}</div>`).join(''):'<div class="chat-bubble"><strong>Alfred Pennyworth</strong>A pleasure to assist. I can discuss what you have actually discovered, but I shan’t be revealing confidential conclusions.</div>';box.scrollTop=box.scrollHeight;lastChatHash=JSON.stringify(history)}
async function askAlfred(){const input=$('#chat-input');const message=input.value.trim();if(!message)return;input.value='';const button=$('#chat-send');button.disabled=true;try{const r=await request('/alfred',{session,message,nonce:crypto.randomUUID().replaceAll('-','')});game.chat=[...(game.chat||[]),{question:message,answer:r.answer}].slice(-6);renderChat();sound('tap')}catch(e){feedback(e.message);input.value=message}finally{button.disabled=false}}
function activateTab(which){tab=which;$$('[data-tab]').forEach(e=>e.classList.toggle('active',e.dataset.tab===which));for(const x of ['scene','evidence','alfred','settings'])$('#tab-'+x).classList.toggle('hidden',x!==which)}
function renderComplete(){
 $('#game-interface').classList.add('hidden');const m=game.mission;$('#complete-panel').classList.remove('hidden');const elapsed=m.completedAt&&m.startedAt?Math.round((m.completedAt-m.startedAt)/60000):null;
 $('#complete-panel').innerHTML=`<div class="welcome card reveal"><div class="content"><div class="eyebrow">Wayne Enterprises · Mission resolved</div><h1>Gotham, Restored.</h1><p>Two operatives, one remarkable partnership. Against the odds, the Batcave security systems have fallen silent.</p><div class="brief" style="margin-top:20px"><h3>Alfred Pennyworth</h3><p>“A most extraordinary evening, Master Wayne. Miss Kyle, your assistance was invaluable. I trust neither of you will be insufferable about it.”</p></div><div class="intro-grid"><div class="brief"><h3>Mission Record</h3><p>12 / 12 puzzles completed<br>${elapsed??'—'} minutes of investigation<br>${m.hintTotal} Alfred hints used<br>${m.attempts} unsuccessful submissions</p></div><div class="brief"><h3>Partnership Cabinet</h3>${m.achievements.map(a=>`<p style="margin-bottom:10px"><b class="gold">✦ ${escapeHTML(a.title)}</b><br>${escapeHTML(a.description)}</p>`).join('')}</div></div><p class="fine">This mission record belongs to Batman and Catwoman together. Keep your invitation if you want to revisit the case.</p></div></div>`;
}
function bindCommon(){
 $$('[data-tab]').forEach(el=>el.onclick=()=>activateTab(el.dataset.tab));
 $('#audio-toggle').checked=audio;$('#audio-toggle').onchange=e=>{audio=e.target.checked;localStorage.setItem('gotham4:audio',audio?'on':'off')};
 $('#motion-toggle').checked=reduced;$('#motion-toggle').onchange=e=>{reduced=e.target.checked;localStorage.setItem('gotham4:motion',reduced?'reduce':'normal');document.body.classList.toggle('no-motion',reduced)};
 $('#chat-send').onclick=askAlfred;$('#chat-input').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();askAlfred()}});
 $('#close-hint').onclick=()=>$('#hint-modal').classList.add('hidden');
 $('#disconnect').onclick=()=>{clearInterval(timer);sessionStorage.removeItem('gotham4:token');sessionStorage.removeItem('gotham4:session');token='';session='';game=null;puzzleId=null;location.href=location.pathname};
 if(isBatman){$('#admin-controls').classList.remove('hidden');$('#pause-mission').onclick=()=>adminToggle(game?.mission.paused?'resume':'pause')}
}
async function adminToggle(action){try{if(!hqKey){hqKey=prompt('Enter Test HQ authorisation key')||'';if(!hqKey)return}await request('/admin',{session,action,nonce:crypto.randomUUID().replaceAll('-','')},true);feedback('Mission '+action+'d.');await refresh(true)}catch(e){feedback(e.message)}}
window.addEventListener('online',()=>refresh().catch(()=>{}));
window.addEventListener('beforeunload',()=>clearInterval(timer));
const boot=async()=>{bindCommon();if(token&&session&&!invited){try{await refresh(true);startPolling();return}catch(e){}}
 setupWelcome();if(isBatman&&token&&session){try{await refresh(true);startPolling()}catch(_){}}
};
boot();
