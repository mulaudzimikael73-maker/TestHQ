/* Gotham Communications Stage 2 — TESTR only, used inside Batcomputer and original Lizzy Assistant.
   No screenshot uploads. Private text history remains on the TEST Worker; HQ cannot read it. */
(()=>{'use strict';
const API='https://mickyhq-test.mulaudzimikael73.workers.dev/';
const BUILD='gotham-test-s2-ai-r1-20261124',TOK='gotham-s1-test-session',CID='gotham-s2-private-client-v1',DRAFT='gotham-s2-pending-v1',AI_PREF='gotham-s2-ai-consent-v1';
const ESC=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pick=(s,k)=>{try{return s.getItem(k)}catch{return null}};
const put=(s,k,v)=>{try{s.setItem(k,v);return true}catch{return false}};
const del=(s,k)=>{try{s.removeItem(k)}catch{}};
function id(){return window.crypto?.randomUUID?.().replaceAll('-','_')||('s2_'+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2));}
function client(){let c=pick(localStorage,CID);if(!c||!/^[a-zA-Z0-9_-]{24,110}$/.test(c)){c=id();put(localStorage,CID,c)}return c}
const boxes=new WeakMap();
async function api(action,body={},session=pick(sessionStorage,TOK)){const resp=await fetch(API,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action,token:session,...body}),cache:'no-store'});let d;try{d=await resp.json()}catch{throw Error('The secure connection returned an unreadable response. Please try again.')}if(!resp.ok||!d||d.success!==true)throw Error(d?.error||`Connection failed (${resp.status})`);if(d.build&&d.build!==BUILD)throw Error('Gotham Communications needs a system update. Please try again shortly.');return d;}
function getStatus(box){return box.querySelector('[data-gc-status]')}
function status(box,msg,error=false){const e=getStatus(box);if(e){e.textContent=msg||'';e.classList.toggle('gc-error',error)}}
function current(box){return boxes.get(box)}
function stateHTML(s){const selected=s?.who||'batman',mode=s?.mode||'chat';return `<div class="gc-shell"><div class="gc-top"><strong>◈ GOTHAM COMMUNICATIONS</strong><small>WAYNE SECURE MESSENGER</small></div>
 <div class="gc-login" data-gc-login><p>Enter the Batcomputer access phrase to open your Gotham conversations.</p><form data-gc-unlock><input type="password" name="password" placeholder="Secure access phrase" maxlength="100" required><button type="submit">Connect</button></form></div>
 <div data-gc-content hidden>
 <div class="gc-toolbar"><label>Contact<select data-gc-who><option value="batman">🦇 Batman / Mikael</option><option value="catwoman">🐈‍⬛ Catwoman / Elizabeth</option><option value="alfred">🎩 Alfred Pennyworth</option></select></label><label>Mode<select data-gc-mode><option value="chat">Conversation</option><option value="detective">Detective Analysis — text only</option></select></label></div>
 <p class="gc-greeting" data-gc-greeting></p><div data-gc-special hidden><button type="button" data-gc-secret>🗝 Special conversation unlocked — ask about it</button></div><div class="gc-messages" data-gc-history aria-live="polite"></div>
 <form data-gc-send><label for="gc-input-${s?.uid||'new'}">Your message or pasted conversation</label><textarea id="gc-input-${s?.uid||'new'}" data-gc-input rows="3" maxlength="1400" placeholder="Ask Batman about a situation, or paste a message to examine…" required></textarea><div class="gc-actions"><button type="submit" data-gc-submit>Send message</button><button type="button" data-gc-refresh>↻ Refresh</button><button type="button" data-gc-clear>Delete this conversation</button></div><label class="gc-consent" data-gc-ai-wrap hidden><input data-gc-ai type="checkbox"> I agree to send my typed messages, recent conversation and relevant unlocked-file excerpts to the AI service to receive genuine character replies. I can withdraw consent anytime.</label></form>
 <details class="gc-hints"><summary>🔎 Hint for an unlocked Gotham case</summary><p>Two gentle hint levels. No direct answers.</p><select data-gc-case><option value="">Load available cases</option></select><div class="gc-actions"><button type="button" data-gc-hint="1">First hint</button><button type="button" data-gc-hint="2">Another gentle hint</button></div><p data-gc-hint-text></p></details>
 <p class="gc-privacy">This is a fictional character conversation. No screenshots. You can delete a conversation whenever you wish. Only information you type and excerpts from unlocked Gotham files are used for an AI reply when you consent.</p>
 </div><p class="gc-status" data-gc-status role="status"></p></div>`}
function renderHistory(box){const s=current(box),rows=(s?.history?.[s.who]||[]);const e=box.querySelector('[data-gc-history]');if(!e)return;e.innerHTML=rows.length?rows.map(m=>`<article class="gc-bubble ${m.role==='user'?'gc-user':'gc-assistant'}"><small>${m.role==='user'?'Elizabeth':s?.characters?.[s.who]?.name||s.who}${m.source?' · '+(m.source==='ai'?'AI response':'Earlier limited reply'):''}</small><div>${ESC(m.text)}</div></article>`).join(''):`<p class="gc-placeholder">No messages yet. Say hello or choose Detective Analysis to paste a conversation.</p>`;e.scrollTop=e.scrollHeight;}
function renderGreeting(box){const s=current(box),cfg=s.characters?.[s.who];box.querySelector('[data-gc-greeting]').textContent=cfg?.greeting||'';const bonus=box.querySelector('[data-gc-special]');if(bonus)bonus.hidden=!cfg?.bonusUnlocked;const enabled=cfg?.enabled!==false;box.querySelector('[data-gc-input]').disabled=!!s.preview||!enabled||!s.aiAvailable;box.querySelector('[data-gc-submit]').disabled=!!s.preview||!enabled||!s.aiAvailable;renderHistory(box);if(!enabled)status(box,'This contact is temporarily unavailable. Try a different Gotham personality.',true);}
async function refresh(box){const s=current(box);if(!s)return;const token=s.token||pick(sessionStorage,TOK);if(!token){box.querySelector('[data-gc-content]').hidden=true;box.querySelector('[data-gc-login]').hidden=false;return;}
 try{const d=await api('gotham_s2_state',{clientId:client()},token);s.history=d.history;s.characters=d.characters;s.aiAvailable=d.aiAvailable;s.preview=d.preview||s.preview;
  box.querySelector('[data-gc-login]').hidden=true;box.querySelector('[data-gc-content]').hidden=false;box.querySelector('[data-gc-who]').value=s.who;box.querySelector('[data-gc-mode]').value=s.mode;
  box.querySelector('[data-gc-ai-wrap]').hidden=!!s.preview;box.querySelector('[data-gc-ai]').disabled=!s.aiAvailable;box.querySelector('[data-gc-ai]').checked=s.aiAvailable&&pick(localStorage,AI_PREF)==='yes';box.querySelector('[data-gc-input]').disabled=!!s.preview||!s.aiAvailable;box.querySelector('[data-gc-submit]').disabled=!!s.preview||!s.aiAvailable;box.querySelector('[data-gc-clear]').disabled=!!s.preview;
  renderGreeting(box);status(box,s.preview?'Preview only — private conversations stay private.':(d.aiAvailable?(d.aiHealth?.verifiedAt?'🟢 Gotham AI connected — consent required to chat.':'🟡 Gotham AI configured — connection awaiting verification. Consent required.'):'🔴 Gotham AI is currently unavailable. Messaging is paused.'));
  if(!s.preview){const unresolved=pick(sessionStorage,DRAFT);if(unresolved){try{const p=JSON.parse(unresolved);if(p.character===s.who){box.querySelector('[data-gc-input]').value=p.message;status(box,'Your last message was not confirmed. You can retry without creating a duplicate.')}}catch{}}}
 }catch(e){status(box,e.message,true);if(/session|password|authentication|expired/i.test(e.message)){del(sessionStorage,TOK);box.querySelector('[data-gc-content]').hidden=true;box.querySelector('[data-gc-login]').hidden=false;}}
}
async function send(box){const s=current(box),text=box.querySelector('[data-gc-input]').value.trim();
 if(text.length<3)return status(box,'Write at least three characters.',true);
 if(!s.aiAvailable)return status(box,'Gotham AI is not connected. Messaging is paused until it is available.',true);
 if(!box.querySelector('[data-gc-ai]').checked)return status(box,'Please tick the AI consent box before sending your message.',true);
 const button=box.querySelector('[data-gc-submit]');button.disabled=true;
 let p=null;try{p=JSON.parse(pick(sessionStorage,DRAFT)||'null')}catch{};
 if(!p||p.character!==s.who||p.mode!==s.mode||p.message!==text)p={receipt:id(),character:s.who,mode:s.mode,message:text};
 put(sessionStorage,DRAFT,JSON.stringify(p));
 try{const r=await api('gotham_s2_send',{...p,clientId:client(),aiConsent:true},s.token||pick(sessionStorage,TOK));
  if(!r.verified&&!r.duplicate)throw Error('Message receipt was not confirmed.');
  del(sessionStorage,DRAFT);box.querySelector('[data-gc-input]').value='';
  try{await refresh(box);status(box,'Message answered by Gotham AI.');}
  catch{status(box,'AI answered your message. Refresh the conversation to display it.',true)}
 }catch(e){status(box,'Message not confirmed: '+e.message+' Your draft is saved for a safe retry.',true)}
 finally{button.disabled=false}
}
async function loadCases(box){try{const r=await api('gotham_state',{},current(box).token||pick(sessionStorage,TOK));const cases=(r.files||[]).filter(f=>f.kind==='case'&&!f.locked);const sel=box.querySelector('[data-gc-case]');sel.innerHTML=cases.length?cases.map(f=>`<option value="${ESC(f.id)}">${ESC(f.title)}</option>`).join(''):'<option value="">No unlocked cases</option>';}catch{box.querySelector('[data-gc-case]').innerHTML='<option value="">Open a case to begin</option>';}}
function mount(box,opt={}){if(!box)return;if(boxes.has(box)){if(opt.character)switchCharacter(box,opt.character);return}
 const s={uid:id(),token:opt.token||'',who:opt.character||'batman',mode:'chat',characters:null,history:{},preview:!!opt.preview,aiAvailable:false};boxes.set(box,s);box.innerHTML=stateHTML(s);
 box.querySelector('[data-gc-unlock]').addEventListener('submit',async e=>{e.preventDefault();const pw=e.target.elements.password.value,btn=e.target.querySelector('button');btn.disabled=true;try{const r=await api('gotham_login',{password:pw},'');if(!r.token)throw Error('No session received.');put(sessionStorage,TOK,r.token);e.target.reset();await refresh(box);await loadCases(box);}catch(err){status(box,err.message,true)}finally{btn.disabled=false}});
 box.querySelector('[data-gc-ai]').addEventListener('change',e=>{if(e.target.checked){if(!confirm('Allow your typed messages, recent conversation and excerpts from unlocked files to be processed by the AI provider for a reply? You may switch this off at any time.')){e.target.checked=false;return;}put(localStorage,AI_PREF,'yes');}else del(localStorage,AI_PREF)});
 box.querySelector('[data-gc-who]').onchange=e=>{s.who=e.target.value;renderGreeting(box)};
 box.querySelector('[data-gc-mode]').onchange=e=>{s.mode=e.target.value;box.querySelector('[data-gc-input]').placeholder=s.mode==='detective'?'Paste the message, then tell Batman what you want to understand…':'Ask Gotham a question…'};
 box.querySelector('[data-gc-send]').addEventListener('submit',e=>{e.preventDefault();send(box)});
 box.querySelector('[data-gc-refresh]').onclick=()=>{refresh(box);loadCases(box)};
 box.querySelector('[data-gc-secret]').onclick=()=>{box.querySelector('[data-gc-input]').value='Tell me the secret conversation';box.querySelector('[data-gc-input]').focus()};
 box.querySelector('[data-gc-clear]').onclick=async()=>{if(!confirm('Delete this Gotham conversation? This cannot be undone.'))return;try{await api('gotham_s2_clear',{clientId:client(),character:s.who},s.token||pick(sessionStorage,TOK));await refresh(box);status(box,'Conversation deleted.')}catch(e){status(box,e.message,true)}};
 box.querySelectorAll('[data-gc-hint]').forEach(btn=>btn.onclick=async()=>{const caseId=box.querySelector('[data-gc-case]').value;if(!caseId)return;try{const r=await api('gotham_s2_hint',{clientId:client(),caseId,level:Number(btn.dataset.gcHint)},s.token||pick(sessionStorage,TOK));box.querySelector('[data-gc-hint-text]').textContent=r.hint;}catch(e){status(box,e.message,true)}});
 refresh(box).then(()=>loadCases(box));}
function switchCharacter(box,who){const s=current(box);if(!s||!['batman','catwoman','alfred'].includes(who))return;s.who=who;box.querySelector('[data-gc-who]').value=who;renderGreeting(box)}
window.GothamComms={mount,switchCharacter,BUILD};
})();
