(()=>{'use strict';
const $=id=>document.getElementById(id),role=(new URLSearchParams(location.search).get('role')||document.body.dataset.defaultRole)==='mikael'?'mikael':'lizzy';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const WORKER='https://mickyhq-test.mulaudzimikael73.workers.dev/v3/';
const storage={get:k=>{try{return localStorage.getItem(k)||''}catch{return''}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch{}}};
let worker=WORKER,hqKey='',state=null,busy=false,polling=false,connected=false,route=[],plates={},wheels=[0,0,0,0],serverOffset=0,audio=null,sound=false,failures=0;
try{if(parent!==window)hqKey=parent.MikaelHeistSession?.().key||''}catch{}
$('backLink').href=role==='mikael'?'index.html':'coop.html';$('backLink').textContent=role==='mikael'?'← Micky HQ':'← Our World';if(parent!==window)$('backLink').hidden=true;$('keyInput').value=hqKey;$('keyLabel').hidden=role!=='mikael';$('keyInput').required=role==='mikael';$('resetButton').hidden=role!=='mikael';
const symbols={moon:'<path d="M39 7A23 23 0 1 0 53 46 24 24 0 0 1 39 7Z"/>',crown:'<path d="M9 19 20 30 32 12 44 30 55 19 50 49H14Z"/>',wave:'<path d="M5 22Q14 8 23 22T41 22T59 22M5 38Q14 24 23 38T41 38T59 38M5 52Q14 38 23 52T41 52T59 52" fill="none"/>',star:'<path d="m32 6 8 17 19 3-14 14 3 19-16-9-16 9 3-19L5 26l19-3Z"/>',diamond:'<path d="m32 5 24 27-24 27L8 32Z"/>',sun:'<circle cx="32" cy="32" r="14"/><path d="M32 2v10m0 40v10M2 32h10m40 0h10M10 10l8 8m28 28 8 8M10 54l8-8m28-28 8-8" fill="none"/>'};
function symbol(n){return `<span class="symbol" role="img" aria-label="${esc(n)}"><svg viewBox="0 0 64 64" fill="currentColor" stroke="currentColor" stroke-width="3">${symbols[n]||''}</svg></span>`}
function tone(ok){if(!sound)return;try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.frequency.value=ok?660:160;g.gain.setValueAtTime(.045,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.3);o.start();o.stop(audio.currentTime+.3)}catch{}}
async function request(action,extra={}){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
 try{const headers={'content-type':'application/json'};if(role==='mikael'&&parent!==window){try{hqKey=parent.MikaelHeistSession?.().key||''}catch{hqKey=''}}
 const r=await fetch(worker+'?action='+encodeURIComponent(action),{method:'POST',headers,body:JSON.stringify({action,role,...extra,...(role==='mikael'?{hqKey}:{})}),signal:controller.signal,cache:'no-store'});
 const d=await r.json().catch(()=>({success:false,error:'The Worker returned an invalid response.'}));
 if(!r.ok||d.success===false){if(d.state)accept(d.state);throw new Error(d.error||`Request failed (${r.status})`)}
 if(d.state?.version!=='bank-heist-v3'||d.state?.role!==role)throw new Error('The Bank of Micky connection needs its production update. Please reconnect after the Cloudflare setup.');
 return d;
 }catch(e){if(e.name==='AbortError')throw new Error('Connection timed out. Progress remains saved; retry when connected.');throw e}finally{clearTimeout(timer)}
}
function accept(next,force=false){
 if(state&&next.revision<state.revision)return;
 const changed=!state||state.run!==next.run||state.step!==next.step;
 const syncChanged=JSON.stringify(state?.sync)!==JSON.stringify(next.sync)||state?.done!==next.done;
 serverOffset=(next.serverNow||Date.now())-Date.now();state=next;
 if(changed||syncChanged||force){route=[];plates={};wheels=[0,0,0,0];$('answer').value='';$('hint').hidden=true;if($('clueDialog').open)$('clueDialog').close();render();}else updateStatus();
}
function updateStatus(){$('connectionStatus').textContent='Shared progress connected';$('connectionStatus').style.color='var(--cyan)'}
function render(){
 $('setup').hidden=true;$('game').hidden=false;const s=state;
 $('avatar').src=`heist-assets/${role}.jpg`;$('roleLabel').textContent=role==='mikael'?'MIKAEL / SECURITY CONTROL':'LIZZY / VAULT OPERATIVE';
 $('stageTitle').textContent=s.done?'Escape successful':['','01 / The Lockdown','02 / Laser Corridor','03 / Deposit Box Mystery','04 / The Pressure Vault','05 / Final Escape'][s.stage];
 $('roomTitle').textContent=role==='mikael'?['','Security Control Room','CCTV & Electrical Station','Deposit Records Desk','Pressure Regulation Station','Emergency Override Console'][s.stage]:['','Outer Vault Chamber','Laser Corridor','Safety Deposit Chamber','The Pressure Vault','Vault Exit Chamber'][s.stage];
 const bg=role==='mikael'?['','control','cctv','records','pressure-control','override'][s.stage]:['','vault','laser','deposits','pressure','exit'][s.stage];$('scene').style.backgroundImage=`url("heist-assets/${bg}.png")`;
 $('progress').innerHTML=['Lockdown','Lasers','Deposit boxes','Pressure vault','Final escape'].map((t,i)=>`<div class="stage ${i+1<s.stage||s.done?'done':i+1===s.stage?'active':''}">${String(i+1).padStart(2,'0')} / ${t}</div>`).join('');
 const positions=role==='mikael'?[[39,28],[84,36],[70,54],[22,48]]:[[22,28],[46,40],[78,36],[23,49]];
 $('hotspots').innerHTML=s.clues.map((c,i)=>`<button class="hotspot" data-clue="${i}" style="left:${positions[i][0]}%;top:${positions[i][1]}%" aria-label="Inspect ${esc(c.title)}">${i+1}</button>`).join('');
 $('objects').innerHTML=s.clues.map((c,i)=>`<button data-clue="${i}"><b>0${i+1}</b>${esc(c.title)}</button>`).join('');
 $('notes').value=storage.get('bank-heist-v3-notes:'+s.run+':'+role);
 $('taskTitle').textContent=s.done?'You both made it out.':s.task.title;
 const myTurn=!s.done&&s.task.role===role;const final=!s.done&&s.step===15;
 $('turn').textContent=s.done?'All five stages complete. Management is drafting a strongly worded memo.':myTurn?'YOUR CONTROL — compare clues before submitting.':`PARTNER’S CONTROL — ${s.task.role==='mikael'?'Mikael':'Lizzy'} acts next. Inspect your clues and help on the call.`;
 $('answerForm').hidden=!myTurn;$('syncPanel').hidden=!final;if(final){$('turn').textContent='BOTH CONTROLS — count down together on your call.';drawSync();}$('hintButton').hidden=s.done;$('complete').hidden=!s.done;$('escapePhoto').hidden=!s.done;$('scene').hidden=s.done;$('objects').hidden=s.done;$('notesPanel').hidden=s.done;if(s.done)$('result').textContent='Both controls received. The vault is open.';
 if(!s.done){$('answerLabel').textContent=s.task.placeholder;$('answer').placeholder=s.task.placeholder;$('hint').textContent=s.task.hint;}
 const path=myTurn&&s.step===4;$('routeInput').hidden=!path;const pressure=myTurn&&s.step===11,locks=myTurn&&s.step===13;$('pressureInput').hidden=!pressure;$('wheelInput').hidden=!locks;$('answer').hidden=path||pressure||locks;$('answer').required=myTurn&&!path&&!pressure&&!locks;if(pressure)drawPlates();if(locks)drawWheels();
 if(path)drawRoute();
 $('feed').innerHTML=s.events.length?s.events.slice(-6).map(e=>`<li>${esc(e.role==='mikael'?'Mikael':'Lizzy')} · ${esc(e.title)} ✓</li>`).join(''):'<li>Lockdown engaged. No controls cleared yet.</li>';
 updateStatus();
}
function drawRoute(){$('floorGrid').innerHTML=Array.from({length:25},(_,i)=>{const p='ABCDE'[Math.floor(i/5)]+(i%5+1),n=route.indexOf(p);return `<button type="button" class="tile ${n>=0?'selected':''}" data-tile="${p}">${p}${n>=0?`<small>${n+1}</small>`:''}</button>`}).join('');$('routeText').textContent=route.length?route.join(' → '):'Plan eight tiles, then submit your crossing.'}
function clueHTML(c){
 let body='';
 if(c.kind==='cargo')body='<div class="boxes">'+c.items.map(([id,n])=>`<div class="box"><h3>CARGO ${id}</h3>${symbol(n)}<p>${n.toUpperCase()}</p></div>`).join('')+'</div>';
 if(c.kind==='plates')body=`<div class="plateDiagram"><div>LEFT<br><b>${esc(c.target)} kg</b><br>2 items · Crown required</div><div>RIGHT<br><b>${esc(c.target)} kg</b><br>2 items · Star required</div></div>`;
 if(c.kind==='strip'&&c.digits)body=`<div class="recovery"><small>TOP</small><br>${c.digits.map(esc).join('<br>')}<br><small>BOTTOM</small></div>`;
 if(c.kind==='wheel')body='<div class="vaultWheel" aria-label="Vault wheel illustration">✦</div>';
 if(c.kind==='table')body=`<div class="tableWrap"><table><thead><tr>${c.headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${c.rows.map(r=>`<tr>${r.map(v=>`<td>${symbols[v]?symbol(v):esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 if(c.kind==='symbols')body=`<div class="symbols">${c.pairs.map(([s,n])=>`<div class="symbolCard">${symbol(s)}<p>${esc(s)} = ${esc(n)}</p></div>`).join('')}</div>`;
 if(c.kind==='paintings')body=`<div class="paintings">${c.paintings.map(([s,y,n,a])=>`<div class="painting">${symbol(s)}<small>${esc(s.toUpperCase())}</small><small>Acquired ${y}</small><small>Catalogue ${n}</small><span class="audit ${a?'':'no'}">${a?'AUDITED':'UNVERIFIED'}</span></div>`).join('')}</div>`;
 if(c.kind==='wires'){const colors={AMBER:'#ffc24d',TEAL:'#70d9d0',RED:'#ff6960',WHITE:'#fff'};body=c.pairs.map(([a,b])=>`<div class="wire"><b>${esc(a)}</b><i style="--wire:${colors[a]||colors[b]||'#aaa'}"></i><b>${esc(b)}</b></div>`).join('');}
 if(c.kind==='badge')body=`<div class="badge"><p class="eyebrow">BANK OF MICKY • STAFF PASS</p>${symbol(c.symbol)}<h3>${esc(c.shift)} SHIFT</h3><div class="stripes"></div><p>DOUBLE STRIPE / NAME ERASED</p><small>Employment is a privilege. Escape is discretionary.</small></div>`;
 if(c.kind==='fuse')body=`<div class="recovery">${esc(c.voltage)}<br><small>${esc(c.frequency)}</small></div><p class="stamp">WAX SEAL • ${esc(c.seal)}</p>`;
 if(c.kind==='floor')body='<div class="document"><p>ENTRANCE → ROW A</p><p>YOUR LEFT: 1 · 2 · 3 · 4 · 5 :YOUR RIGHT</p><p>Rows: A → B → C → D → E → EXIT</p></div>';
 if(c.kind==='cctv')body=`<p class="eyebrow">MIRRORED CCTV / NUMBERED SAFE MARKERS</p><div class="grid">${Array.from({length:25},(_,i)=>{const p='ABCDE'[Math.floor(i/5)]+(i%5+1),n=c.route.indexOf(p);return `<div class="tile ${n>=0?'safe':''}">${n>=0?'<b>'+String(n+1).padStart(2,'0')+'</b>':'×'}<small>${p}</small></div>`}).join('')}</div>`;
 if(c.kind==='boxes')body=`<div class="boxes">${c.boxes.map(([n,s,l,seal])=>`<div class="box"><h3>${n}</h3>${symbol(s)}<small>${s.toUpperCase()}</small><span class="lamp" style="--lamp:${l==='green'?'#73ddad':'#fa6565'}"></span><small>${l.toUpperCase()} LAMP</small><small>Seal: ${seal}</small></div>`).join('')}</div>`;
 if(c.kind==='recovery'&&c.code)body='<div class="recovery">'+esc(c.code)+'</div>'+symbol('crown');
 if(c.kind==='lever'&&c.serial)body='<div class="recovery serial">'+esc(c.serial)+'</div>';
 const paper=c.kind==='paper';return `<p class="eyebrow">PRIVATE CLUE / ${role.toUpperCase()} ONLY</p><h2>${esc(c.title)}</h2>${paper?'<div class="document"><p class="eyebrow">BANK OF MICKY • INTERNAL DOCUMENT</p>':''}<p>${esc(c.text)}</p>${body}${paper?'<div class="stamp">DEFINITELY REGULATED™</div></div>':''}`;
}
document.addEventListener('click',e=>{const clue=e.target.closest('[data-clue]');if(clue&&state){$('clueContent').innerHTML=clueHTML(state.clues[Number(clue.dataset.clue)]);$('clueDialog').showModal();}const tile=e.target.closest('[data-tile]');if(tile&&route.length<8&&!route.includes(tile.dataset.tile)){route.push(tile.dataset.tile);drawRoute();}});

function drawPlates(){
 const glyphs=Object.fromEntries(state.clues.find(c=>c.kind==='cargo')?.items||[]);
 $('cargoControls').innerHTML=Object.entries(glyphs).map(([id,g])=>`<label class="cargoSelect">${symbol(g)}<b>${id} · ${g}</b><select data-cargo="${id}" aria-label="Place cargo ${id}"><option value="">Shelf</option><option value="L" ${plates[id]==='L'?'selected':''}>Left plate</option><option value="R" ${plates[id]==='R'?'selected':''}>Right plate</option></select></label>`).join('');
 $('plateSummary').textContent='LEFT: '+(Object.keys(plates).filter(k=>plates[k]==='L').join(' + ')||'empty')+' / RIGHT: '+(Object.keys(plates).filter(k=>plates[k]==='R').join(' + ')||'empty');
}
document.addEventListener('change',e=>{if(e.target.dataset.cargo){plates[e.target.dataset.cargo]=e.target.value;drawPlates();}});
function drawWheels(){$('lockWheels').innerHTML=wheels.map((n,i)=>`<div><button type="button" data-wheel="${i}" data-delta="1" aria-label="Increase wheel ${i+1}">▲</button><strong>${n}</strong><button type="button" data-wheel="${i}" data-delta="-1" aria-label="Decrease wheel ${i+1}">▼</button></div>`).join('');}
document.addEventListener('click',e=>{const b=e.target.closest('[data-wheel]');if(b){const i=Number(b.dataset.wheel);wheels[i]=(wheels[i]+Number(b.dataset.delta)+10)%10;drawWheels();}});
function drawSync(){
 const x=state?.sync;if(!x)return;const own=x[role],now=Date.now()+serverOffset,left=x.deadline?Math.max(0,Math.ceil((x.deadline-now)/1000)):15,expired=!!x.deadline&&now>x.deadline;
 $('syncClock').textContent=x.failed||expired?'WINDOW MISSED':x.deadline?left+'s':'15s';
 $('syncStatus').textContent=`Mikael: ${x.mikael?'recorded':'waiting'} · Lizzy: ${x.lizzy?'recorded':'waiting'}`;
 $('syncButton').textContent=role==='mikael'?'PRESS EMERGENCY RELEASE':'TURN VAULT WHEEL';
 $('syncButton').disabled=busy||!!own||x.failed||state.done;
 $('retrySync').hidden=role!=='mikael'||(!x.failed&&!expired)||state.done;
 $('syncAdvice').textContent=x.failed||expired?'This window has closed. Mikael can start a fresh attempt without repeating the puzzles.':own?'Your action is saved. Waiting for your partner’s control.':'Count down on your voice call and press together. Both screens must show the same attempt.';
 $('attemptLabel').textContent='Attempt '+x.number+' · '+x.attempt.slice(0,8);
}
async function release(action){if(busy||!state?.sync||state.done)return;busy=true;drawSync();try{const d=await request(action,{run:state.run,step:state.step,attempt:state.sync.attempt});accept(d.state);$('result').textContent=state.done?'Both controls received. The vault is open.':d.message||'';tone(d.state.done);}catch(e){$('result').textContent=e.message}finally{busy=false;drawSync();}}
$('syncButton').onclick=()=>release('heist_sync');
$('retrySync').onclick=()=>{if(confirm('Start a fresh release attempt? Both players must wait for the new attempt to appear before pressing.'))release('heist_retry')};

$('closeDialog').onclick=()=>$('clueDialog').close();$('clearRoute').onclick=()=>{route=[];drawRoute()};
$('notes').oninput=()=>{if(state)storage.set('bank-heist-v3-notes:'+state.run+':'+role,$('notes').value)};
$('hintButton').onclick=()=>{$('hint').hidden=!$('hint').hidden};
$('soundButton').onclick=()=>{sound=!sound;$('soundButton').textContent=sound?'Sound on':'Sound off';$('soundButton').setAttribute('aria-pressed',String(sound));tone(true)};
$('settingsButton').onclick=()=>{$('setup').hidden=false;$('game').hidden=true;connected=false;};
async function connect(){
 if(busy)return;hqKey=$('keyInput').value.trim();$('setupStatus').textContent='Opening your shared heist…';
 try{const d=await request('heist_state');connected=true;failures=0;accept(d.state,true);$('setupStatus').textContent='';}
 catch(e){$('setupStatus').textContent=e.message;}
}
$('connectForm').onsubmit=e=>{e.preventDefault();connect()};
async function refresh(){if(!connected||polling||busy||document.hidden)return;polling=true;try{const d=await request('heist_state');accept(d.state);if(failures&&!state.done)$('result').textContent='Connection restored. Your shared progress is up to date.';failures=0;updateStatus()}catch(e){failures++;$('connectionStatus').textContent='Connection interrupted — retrying';$('connectionStatus').style.color='var(--red)';$('result').textContent=e.message;}finally{polling=false}}
$('refreshButton').onclick=refresh;
$('answerForm').onsubmit=async e=>{e.preventDefault();if(busy||!state)return;const answer=state.step===4?route.join(' '):state.step===13?wheels.join(''):$('answer').value.trim();if(state.step===4&&route.length!==8){$('result').textContent='Plan exactly eight tiles before crossing.';return;}busy=true;$('submit').disabled=true;try{const d=await request('heist_submit',{answer,run:state.run,step:state.step,...(state.step===11?{plates:{left:Object.keys(plates).filter(k=>plates[k]==='L'),right:Object.keys(plates).filter(k=>plates[k]==='R')}}:{})});accept(d.state);$('result').textContent=d.message;tone(true)}catch(err){$('result').textContent=err.message;tone(false);if(state.step===4){route=[];drawRoute()}}finally{busy=false;$('submit').disabled=false}};
$('resetButton').onclick=async()=>{if(busy||!confirm('Start a new shared heist? This replaces your current progress and gives BOTH players fresh clues and codes.'))return;busy=true;try{const d=await request('heist_reset',{run:state.run,step:state.step});accept(d.state,true);$('result').textContent='New heist started. Ask Lizzy to refresh shared progress for the fresh clues.'}catch(e){$('result').textContent=e.message}finally{busy=false}};
setInterval(()=>{if(connected&&state?.started){const t=Math.max(0,Math.floor(((state.done?state.ended:Date.now()+serverOffset)-state.started)/1000));$('clock').textContent=String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0')}if(state?.sync&&!state.done)drawSync();},1000);
async function poll(){await refresh();setTimeout(poll,Math.min(60000,(state?.step===15&&!state.done?1500:4000)*(failures+1)))}setTimeout(poll,4000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
if(role==='lizzy'||hqKey)connect();
})();
