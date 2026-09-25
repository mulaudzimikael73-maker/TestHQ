(()=>{"use strict";const TEST_WORKER_STORAGE_KEY="mickyhq_test_worker_url_v1",$=id=>document.getElementById(id),esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));let W=(localStorage.getItem(TEST_WORKER_STORAGE_KEY)||"").trim(),key="",game=null,selected=null;
const api=async(action,body={})=>{if(!W)throw new Error("Enter a separate TEST Worker URL first.");const r=await fetch(W+"?action="+encodeURIComponent(action),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,...body,hqKey:key}),cache:"no-store"});const d=await r.json().catch(()=>({}));if(!r.ok||d.success===false)throw new Error(d.error||`Request failed (${r.status})`);return d};
window.MikaelHQApi=(action,body={})=>api(action,body);
function show(v){document.querySelectorAll(".view").forEach(x=>x.classList.add("hidden"));$(v).classList.remove("hidden");$("viewTitle").textContent=v==="letters"?"Letters from Lizzy":v==="annoy"?"😈 Annoy Lizzy":v==="mood"?"💗 My Mood":v==="lessons"?"🧠 Lizzy Lessons":v==="mizzygram"?"📸 MizzyGram HQ":v==="world"?"📈 Market & Entertainment":"Mikael × Lizzy Chess";if(v==="letters")loadLetters();else if(v==="annoy")loadAnnoy();else if(v==="mood")loadMood();else if(v==="lessons")loadLessons();else if(v==="world")window.MikaelWorldHQ?.load();else if(v!=="mizzygram")loadChess()}
document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>{document.querySelectorAll("nav button").forEach(x=>x.classList.remove("active"));b.classList.add("active");show(b.dataset.view)});document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>show(b.dataset.go));
$("testWorkerUrl").value=W;$("loginBtn").onclick=async()=>{const raw=$("testWorkerUrl").value.trim();if(!raw){$("loginStatus").textContent="Enter your separate TEST Worker URL.";return}W=raw.endsWith("/")?raw:raw+"/";localStorage.setItem(TEST_WORKER_STORAGE_KEY,W);key=$("hqKey").value.trim();if(!key)return;$("loginStatus").textContent="Checking TEST Worker…";try{await api("hq_letters");$("login").classList.add("hidden");$("app").classList.remove("hidden");loadLetters();loadChess()}catch(e){$("loginStatus").textContent=e.message;key=""}};$("hqKey").onkeydown=e=>{if(e.key==="Enter")$("loginBtn").click()};$("logoutBtn").onclick=()=>{key="";$("app").classList.add("hidden");$("login").classList.remove("hidden");$("hqKey").value=""};
async function loadLetters(){try{const d=await api("hq_letters");$("lettersList").innerHTML=d.letters?.length?d.letters.slice().reverse().map(l=>`<article class="letter ${l.status==="unread"?"unread":""}"><h3>💌 ${esc(l.subject||"A letter from Lizzy")}</h3><div class="meta">${esc(l.from||"Lizzy")} · ${new Date(l.createdAt).toLocaleString()}</div><div class="letter-body">${esc(l.text)}</div>${l.reply?`<div class="reply"><b>🖤 Your reply</b><br>${esc(l.reply)}</div>`:`<div class="replyBox"><textarea data-reply="${esc(l.id)}" placeholder="Reply to Lizzy…"></textarea><button class="primary" data-reply-btn="${esc(l.id)}">Send Reply ❤️</button></div>`}</article>`).join(""):`<div class="card empty">No letters yet. When Lizzy writes, her letter will appear here.</div>`;document.querySelectorAll("[data-reply-btn]").forEach(b=>b.onclick=()=>reply(b.dataset.reply));}catch(e){$("lettersList").innerHTML=`<div class="card err">${esc(e.message)}</div>`}}
async function reply(id){const t=document.querySelector(`[data-reply="${CSS.escape(id)}"]`);if(!t?.value.trim())return;try{await api("reply_letter",{id,reply:t.value.trim()});loadLetters()}catch(e){alert(e.message)}}$("refreshLetters").onclick=loadLetters;$("clearLetters").onclick=async()=>{if(!confirm("Clear ALL letters AND Lizzy's replies inbox? This can't be undone."))return;try{await api("clear_letters");await api("clear_messages");loadLetters()}catch(e){alert(e.message)}};
const glyph={p:"♟",r:"♜",n:"♞",b:"♝",q:"♛",k:"♚",P:"♙",R:"♖",N:"♘",B:"♗",Q:"♕",K:"♔"};function render(){const b=$("chessBoard");b.innerHTML="";if(!game)return;const bd=game.board();for(let r=0;r<8;r++)for(let c=0;c<8;c++){const sq=String.fromCharCode(97+c)+(8-r),p=bd[r][c],x=document.createElement("button");x.className="sq "+((r+c)%2?"dark":"light");if(selected===sq)x.classList.add("selected");if(selected)try{if(game.moves({square:selected,verbose:true}).some(m=>m.to===sq))x.classList.add("legal")}catch{}x.textContent=p?(p.color==="w"?glyph[p.type.toUpperCase()]:glyph[p.type]):"";x.onclick=()=>move(sq);b.appendChild(x)}$("chessTurn").textContent=game.turn()==="b"?"🖤 Your turn — choose a black piece":"🌸 Lizzy's turn — waiting for her move";$("moveHistory").textContent=game.pgn()||"No moves yet."}
async function move(sq){if(!game)return;if(!selected){const p=game.get(sq);if(!p||p.color!=="b")return;selected=sq;render();return}try{const m=game.move({from:selected,to:sq,promotion:"q"});if(!m){selected=sq;render();return}selected=null;render();await api("chess_move",{fen:game.fen(),pgn:game.pgn(),turn:game.turn(),lastMove:m.san})}catch(e){alert(e.message);loadChess()}}
async function loadChess(){try{const d=await api("chess_state");game=game||new Chess();if(d.state?.fen&&d.state.fen!=="start")game.load(d.state.fen);else game.reset();selected=null;render();$("helpRequests").innerHTML=d.requests?.length?d.requests.slice().reverse().map(r=>`<div class="request"><b>Lizzy:</b> ${esc(r.text)}<button data-resolve="${esc(r.id)}">Mark handled</button></div>`).join(""):"No requests.";document.querySelectorAll("[data-resolve]").forEach(b=>b.onclick=async()=>{await api("resolve_chess_help",{id:b.dataset.resolve});loadChess()})}catch(e){$("chessBoard").innerHTML=`<div class="empty">${esc(e.message)}</div>`}}
$("resetChess").onclick=async()=>{if(confirm("Start a new chess game?")){await api("chess_reset");game=new Chess();loadChess()}};$("refreshChess").onclick=loadChess;$("sendHint").onclick=async()=>{const text=$("hintText").value.trim();if(!text)return;try{await api("send_chess_hint",{text});$("hintText").value="";alert("Hint sent to Lizzy ❤️")}catch(e){alert(e.message)}};

// Lizzy Lessons — she writes, you grade
async function loadLessons(){
  try{
    const d=await api("hq_lizzy_lessons");
    $("lessonsList").innerHTML=d.lessons?.length?d.lessons.map(l=>`<article class="letter"><h3>🧠 ${esc(l.text)}</h3><div class="meta">${new Date(l.createdAt).toLocaleString()}</div>${l.status==="rated"?`<div class="reply"><b>${l.rating==="helpful"?"👍 Helpful":"👎 Absolutely Useless"}</b>${l.note?`<br>${esc(l.note)}`:""}</div>`:`<div class="replyBox"><textarea data-lesson-note="${esc(l.id)}" placeholder="Optional note to Lizzy…"></textarea><button class="primary" data-rate-helpful="${esc(l.id)}">👍 Helpful</button> <button class="danger" data-rate-useless="${esc(l.id)}">👎 Useless</button></div>`}</article>`).join(""):`<div class="card empty">No lessons yet. When Lizzy writes one, it'll appear here.</div>`;
    document.querySelectorAll("[data-rate-helpful]").forEach(b=>b.onclick=()=>rateLesson(b.dataset.rateHelpful,"helpful"));
    document.querySelectorAll("[data-rate-useless]").forEach(b=>b.onclick=()=>rateLesson(b.dataset.rateUseless,"useless"));
  }catch(e){$("lessonsList").innerHTML=`<div class="card err">${esc(e.message)}</div>`}
}
async function rateLesson(id,rating){
  const t=document.querySelector(`[data-lesson-note="${CSS.escape(id)}"]`);
  try{await api("rate_lizzy_lesson",{id,rating,note:t?.value.trim()||""});loadLessons()}catch(e){alert(e.message)}
}
$("refreshLessons").onclick=loadLessons;
$("clearLessons").onclick=async()=>{if(!confirm("Clear ALL of Lizzy's lessons? This can't be undone."))return;try{await api("clear_lizzy_lessons");loadLessons()}catch(e){alert(e.message)}};

// Annoy Lizzy
function fmtCooldown(until){const ms=new Date(until).getTime()-Date.now();if(ms<=0)return null;const m=Math.ceil(ms/60000);return `${m} minute${m===1?"":"s"}`}
async function loadAnnoy(){
  try{
    const d=await api("annoy_state");
    const left=d.cooldownUntil?fmtCooldown(d.cooldownUntil):null;
    document.querySelectorAll(".annoy-btn").forEach(b=>b.disabled=!!left);
    if(left)$("annoyStatus").textContent=`😤 Lizzy hit STOP ANNOYING ME — locked out for ${left}.`;
    else $("annoyStatus").textContent="✅ Ready. Pick an effect below.";
  }catch(e){$("annoyStatus").textContent=e.message}
}
document.querySelectorAll(".annoy-btn").forEach(b=>b.onclick=async()=>{
  const effect=b.dataset.effect;
  $("annoyResult").textContent="Sending…";
  try{
    const d=await api("annoy_trigger",{effect});
    if(d.cooldown){$("annoyResult").textContent=`😤 On cooldown until ${new Date(d.until).toLocaleTimeString()}.`;loadAnnoy();return}
    $("annoyResult").textContent=`😈 Sent: ${d.effect.replace(/_/g," ")} — it'll fire next time her device polls (a few seconds).`;
  }catch(e){$("annoyResult").textContent=e.message}
});
$("annoyRefreshBtn").onclick=loadAnnoy;
const annoyResetBtn=$("annoyResetBtn");
if(annoyResetBtn)annoyResetBtn.onclick=async()=>{
  if(!confirm("Clear the cooldown Lizzy set with STOP ANNOYING ME?"))return;
  try{await api("annoy_reset");$("annoyResult").textContent="⏱️ Cooldown cleared.";loadAnnoy()}
  catch(e){$("annoyResult").textContent=e.message}
};

// My Mood
/* Keep in sync with MIKAEL_MOOD_OPTIONS in cloudflare-worker.js so the
   quick-pick buttons here match the /mood Telegram buttons. */
const MOOD_OPTIONS=[
  ["happy","😊 Happy","Feeling happy today 😊"],
  ["tired","🥱 Tired","Feeling tired 🥱"],
  ["dramatic","🎭 Dramatic","Feeling dramatic 🎭"],
  ["soft","🥹 Soft","Feeling soft today 🥹"],
  ["annoyed","🙄 Annoyed","Feeling a bit annoyed 🙄"],
  ["missing","🥺 Missing Lizzy","Missing Lizzy 🥺"],
  ["sad","😢 Sad","Feeling sad 😢"],
  ["indifferent","😐 Indifferent","Feeling indifferent 😐"],
  ["emotional","🥹 Emotional","Feeling emotional 🥹"],
  ["bored","🥱 Bored","Feeling bored 🥱"],
  ["batman","🦇 Feeling Like Batman","Feeling like Batman 🦇"],
  ["excited","🤩 Excited","Feeling excited 🤩"],
  ["funky","💃 Funky","Feeling funky 💃"]
];
if($("moodGrid"))$("moodGrid").innerHTML=MOOD_OPTIONS.map(([id,label])=>`<button class="annoy-btn" data-mood="${id}">${label}</button>`).join("");
async function postMood(text){
  const r=await fetch(W,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"mikael_mood_set",text,source:"hq"}),cache:"no-store"});
  const d=await r.json().catch(()=>({}));
  if(!r.ok||d.success===false)throw new Error(d.error||`Request failed (${r.status})`);
  return d;
}
async function loadMood(){
  try{
    const r=await fetch(W+"?mikaelMood=1",{cache:"no-store"});
    const d=await r.json();
    const mood=d?.success?d.mood:null;
    $("moodCurrent").textContent=mood?`Current mood: ${mood.text}`:"No mood set yet.";
  }catch(e){$("moodCurrent").textContent=e.message}
}
document.querySelectorAll("[data-mood]").forEach(b=>b.onclick=async()=>{
  const opt=MOOD_OPTIONS.find(([id])=>id===b.dataset.mood);
  if(!opt)return;
  $("moodResult").textContent="Setting…";
  try{await postMood(opt[2]);$("moodResult").textContent=`💗 Mood set: ${opt[1]}`;loadMood()}
  catch(e){$("moodResult").textContent=e.message}
});
$("moodSendBtn")?.addEventListener("click",async()=>{
  const text=$("moodText").value.trim();
  if(!text)return;
  $("moodResult").textContent="Setting…";
  try{await postMood(text);$("moodText").value="";$("moodResult").textContent="💗 Mood set.";loadMood()}
  catch(e){$("moodResult").textContent=e.message}
});

// ---- MizzyGram HQ ----
const MG_ACCTS=[
  ["mikael","🖤 Mikael"],["bankofmicky","💰 @BankOfMicky"],["bowlingfederation","🎳 @BowlingFederation"],
  ["chocolateemergency","🍫 @ChocolateEmergency"],["thedailygobshite","📰 @TheDailyGobshite"]
];
const MG_REACTS=[["love","❤️"],["funny","😂"],["attitude","😈"],["cute","😍"],["fire","🔥"],["bowling","🎳"],["chocolate","🍫"],["suspicious","👀"]];
const MG_MAX_VIDEO_SECONDS=30,MG_MAX_VIDEO_BYTES=16*1024*1024;
let mgAcct="mikael",mgSnap=null,mgAudience="everyone",mgPreviewUrl=null,mgTimer=null;
const mgName=id=>({lizzy:"Lizzy",mikael:"Mikael",bankofmicky:"Bank of Micky",bowlingfederation:"Bowling Federation",chocolateemergency:"Chocolate Emergency",thedailygobshite:"The Daily Gobshite"}[id]||("@"+id));
const mgAgo=t=>{const s=Math.max(0,Math.floor((Date.now()-Number(t||0))/1000));if(s<60)return"now";if(s<3600)return Math.floor(s/60)+"m";if(s<86400)return Math.floor(s/3600)+"h";return Math.floor(s/86400)+"d"};
function mgAcctBtns(){
  $("mgAccounts").innerHTML=MG_ACCTS.map(([id,l])=>`<button class="mgAcct ${id===mgAcct?"on":""}" data-mg-acct="${id}"><span class="mgAva">${l.split(" ")[0]}</span><small>${esc(l.replace(/^\S+\s*/,""))}</small></button>`).join("");
  document.querySelectorAll("[data-mg-acct]").forEach(b=>b.onclick=()=>{mgAcct=b.dataset.mgAcct;mgAcctBtns()});
}
mgAcctBtns();
$("mgMood").innerHTML='<option value="">🙂 Mood: none</option>'+MOOD_OPTIONS.map(([id,l])=>`<option value="${esc(l)}">${esc(l)}</option>`).join("");
document.querySelectorAll("[data-aud]").forEach(b=>b.onclick=()=>{mgAudience=b.dataset.aud;document.querySelectorAll("[data-aud]").forEach(x=>x.classList.toggle("on",x===b))});
function mgImage(file){return new Promise((res,rej)=>{const u=URL.createObjectURL(file),i=new Image();i.onload=()=>{const k=Math.min(1,900/Math.max(i.naturalWidth,i.naturalHeight)),c=document.createElement("canvas");c.width=Math.round(i.naturalWidth*k);c.height=Math.round(i.naturalHeight*k);const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);res(c.toDataURL("image/jpeg",.78))};i.onerror=()=>{URL.revokeObjectURL(u);rej(new Error("Couldn't read that photo."))};i.src=u})}
function mgDataURL(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result||""));r.onerror=()=>rej(new Error("Couldn't read that video."));r.readAsDataURL(file)})}
function mgVideo(file){return new Promise((resolve,reject)=>{
  if(!file||!/^video\//.test(file.type))return reject(new Error("Please choose a video file."));
  if(file.size>MG_MAX_VIDEO_BYTES)return reject(new Error("That video is too large for remote upload. Keep it under 16 MB."));
  const u=URL.createObjectURL(file),v=document.createElement("video");v.preload="metadata";
  v.onloadedmetadata=async()=>{const duration=Number(v.duration);URL.revokeObjectURL(u);if(!Number.isFinite(duration)||duration<=0)return reject(new Error("Couldn't read that video's duration."));if(duration>MG_MAX_VIDEO_SECONDS+.05)return reject(new Error(`Videos can be a maximum of ${MG_MAX_VIDEO_SECONDS} seconds.`));try{resolve({video:await mgDataURL(file),duration,videoType:file.type||"video/mp4"})}catch(e){reject(e)}};
  v.onerror=()=>{URL.revokeObjectURL(u);reject(new Error("Couldn't read that video. Try MP4, MOV or WebM."))};v.src=u;
})}
function clearMgPreview(){if(mgPreviewUrl){URL.revokeObjectURL(mgPreviewUrl);mgPreviewUrl=null}$("mgPreview").innerHTML="";$("mgPhotoLbl").innerHTML='📷🎬 Add photo or video <small>videos max 30 sec</small>'}
$("mgPhoto").onchange=()=>{
  clearMgPreview();const f=$("mgPhoto").files[0];if(!f)return;mgPreviewUrl=URL.createObjectURL(f);
  if(/^video\//.test(f.type)){
    const v=document.createElement("video");v.src=mgPreviewUrl;v.controls=true;v.muted=true;v.playsInline=true;v.preload="metadata";
    v.onloadedmetadata=()=>{$("mgPreview").innerHTML="";$("mgPreview").appendChild(v);const m=document.createElement("div");m.className="mgPreviewMeta";m.textContent=`🎬 ${Math.ceil(v.duration||0)}s / ${MG_MAX_VIDEO_SECONDS}s · ${(f.size/1048576).toFixed(1)} MB`;$("mgPreview").appendChild(m);$("mgPhotoLbl").innerHTML='🎬 Video selected <small>max 30 sec</small>'};
    v.onerror=()=>{$("mgPostResult").textContent="Couldn't preview that video."};
  }else if(/^image\//.test(f.type)){$("mgPreview").innerHTML=`<img src="${mgPreviewUrl}" alt="Selected image preview"><div class="mgPreviewMeta">📷 Photo selected</div>`;$("mgPhotoLbl").innerHTML='📷 Photo selected'}
  else{$("mgPostResult").textContent="Choose an image or video file.";$("mgPhoto").value="";clearMgPreview()}
};
const mgPush=command=>api("mg_hq_push",{command});
function mgRenderFeed(){
  const feed=$("mgFeed"),posts=mgSnap?.posts||[];
  if(!posts.length){feed.innerHTML='<div class="mgEmpty">No synced posts yet.<br>Open MizzyGram on Lizzy’s site once, then press ↻.</div>';return}
  feed.innerHTML=posts.slice(0,40).map(p=>{
    const rx=Object.entries(p.rx||{}).map(([k,n])=>`${(MG_REACTS.find(x=>x[0]===k)||[0,"❤️"])[1]} ${n}`).join(" · ")||"No reactions yet";
    const comments=(p.comments||[]).slice(-4).map(c=>`<div class="mgC ${c.parentId?"reply":""}"><span><b>${esc(mgName(c.userId))}</b> ${esc(c.text)}</span></div>`).join("");
    const media=p.mediaType==="video"?'<div class="mgCardArt" style="background:linear-gradient(135deg,#2a1030,#7a35dc)"><i>🎬</i><p>Video post</p></div>':p.thumb?`<div class="mgImg"><img src="${esc(p.thumb)}" alt=""></div>`:'<div class="mgCardArt" style="background:linear-gradient(135deg,#ff4d9a,#7a35dc)"><i>📷</i><p>Photo post</p></div>';
    return `<article class="mgPost" data-mg-post="${esc(p.id)}"><div class="mgPH"><span class="mgAva">${p.userId==="lizzy"?"🌸":p.userId==="mikael"?"🖤":"✨"}</span><b>${esc(mgName(p.userId))}</b>${p.mood?`<span class="mgMood">${esc(p.mood)}</span>`:""}<time>${mgAgo(p.createdAt)}</time></div>${media}<div class="mgIcons"><span>♡</span><span>◯</span><span class="r">${p.audience==="lizzy"?"💗":"🌍"}</span></div><div class="mgRx">${esc(rx)}</div>${p.caption?`<div class="mgCap"><b>${esc(mgName(p.userId))}</b> ${esc(p.caption)}</div>`:""}${comments}<div class="mgBar">${MG_REACTS.slice(0,5).map(([id,e])=>`<button class="mgLike ${p.mine===id?"on":""}" data-mg-react="${id}" data-post="${esc(p.id)}">${e}</button>`).join("")}</div><div class="mgCmt"><input data-mg-comment-input="${esc(p.id)}" placeholder="Comment as Mikael…"><button class="primary" data-mg-comment-send="${esc(p.id)}">Send</button></div></article>`;
  }).join("");
  feed.querySelectorAll("[data-mg-react]").forEach(b=>b.onclick=async()=>{b.disabled=true;try{await mgPush({kind:"react",postId:b.dataset.post,reaction:b.dataset.mgReact});$("mgPostResult").textContent="✅ Reaction queued.";setTimeout(loadMg,1200)}catch(e){$("mgPostResult").textContent=e.message}finally{b.disabled=false}});
  feed.querySelectorAll("[data-mg-comment-send]").forEach(b=>b.onclick=async()=>{const input=feed.querySelector(`[data-mg-comment-input="${CSS.escape(b.dataset.mgCommentSend)}"]`),txt=input?.value.trim();if(!txt)return;b.disabled=true;try{await mgPush({kind:"comment",postId:b.dataset.mgCommentSend,text:txt});input.value="";$("mgPostResult").textContent="✅ Comment queued.";setTimeout(loadMg,1200)}catch(e){$("mgPostResult").textContent=e.message}finally{b.disabled=false}});
}
async function loadMg(){
  const live=$("mgLive");
  try{
    const d=await api("mg_snapshot_get");mgSnap=d.snapshot||{posts:[]};
    if(live){live.classList.add("on");live.textContent=mgSnap.at?`● synced ${mgAgo(mgSnap.at)} ago`:"● connected"}
    mgRenderFeed();
  }catch(e){if(live){live.classList.remove("on");live.textContent="○ not synced"}$("mgFeed").innerHTML=`<div class="mgEmpty">No posts synced yet.<br>${esc(e.message)}<br><br>Open MizzyGram on Lizzy’s site, then press ↻.</div>`}
}
$("mgRefresh").onclick=loadMg;
document.querySelector('[data-view="mizzygram"]')?.addEventListener("click",()=>{$("viewTitle").textContent="📸 MizzyGram HQ";loadMg();clearInterval(mgTimer);mgTimer=setInterval(loadMg,8000)});
$("mgPost").onclick=async()=>{
  const caption=$("mgCaption").value.trim(),f=$("mgPhoto").files[0],tags=$("mgTags").value.trim();
  if(!caption&&!f&&!tags){$("mgPostResult").textContent="Add a photo, video, caption or hashtags first.";return}
  $("mgPost").disabled=true;$("mgPostResult").textContent="Sending to MizzyGram queue…";
  try{
    const cmd={kind:"post",account:mgAcct,caption,tags,mood:$("mgMood").value,audience:mgAudience};
    if(f&&/^video\//.test(f.type)){const v=await mgVideo(f);Object.assign(cmd,{mediaType:"video",video:v.video,videoType:v.videoType,duration:v.duration})}
    else if(f&&/^image\//.test(f.type)){cmd.mediaType="photo";cmd.image=await mgImage(f)}
    else if(f)throw new Error("Choose an image or video file.");
    const out=await mgPush(cmd);if(!out?.success)throw new Error(out?.error||"Worker did not accept the post.");
    $("mgPostResult").textContent="✅ Worker received it. It will appear when Lizzy’s MizzyGram syncs (normally within 10 seconds while open).";
    $("mgCaption").value="";$("mgTags").value="";$("mgPhoto").value="";clearMgPreview();
    setTimeout(loadMg,3500);setTimeout(loadMg,11000);
  }catch(e){$("mgPostResult").textContent="❌ "+e.message}finally{$("mgPost").disabled=false}
};
document.querySelectorAll("[data-mg-event]").forEach(b=>b.onclick=async()=>{try{await mgPush({kind:"event",event:b.dataset.mgEvent});$("mgEvResult").textContent="✅ Triggered: "+b.textContent;setTimeout(loadMg,2500)}catch(e){$("mgEvResult").textContent=e.message}});
})();
