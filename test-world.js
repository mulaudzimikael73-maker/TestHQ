(()=>{
"use strict";
const api=(...a)=>window.MikaelHQApi(...a),$=id=>document.getElementById(id),esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const STOCKS=[
 ["CEH","Chocolate Emergency Holdings"],["BOM","Bank of Micky Financial Group"],["GOBS","The Daily Gobshite Media"],["EVLY","Eventually Airways"],["POTA","Potato Industries International"],["PAIR","Premium Air Ltd"],["PAPR","Micky’s Executive Paperclips"],["BTW","Bluetooth Water Co."],["TFF","Tax Fraud Flakes Foods"],["NAPS","Department of Naps PLC"],["RDFL","RedFlagr Technologies"],["QDBV","Questionable Decisions Beverages"],["ICE","Micky Premium Ice Cubes"],["CHIP","One Chip Delivery Group"],["BAG","Invisible Handbag Holdings"],["LOAD","Eau de Loadshedding Fragrance House"],["NITE","Indoor Night Sunglasses Inc."],["ROCK","Luxury Rock Corporation"],["TUES","Tuesday Global"],["SCIG","Suspiciously Cheap Insurance Group"],["FASH","Fashionista Designer Shoes Group"]
];
const MAX_MEDIA=16*1024*1024;
const FULFILLED_KEY="testhq-ent-fulfilled-v1";
let snapshot=null,timer=null,lastDeliveryMsg="";
const selectedFiles=new Map();
function loadFulfilled(){try{return new Set(JSON.parse(localStorage.getItem(FULFILLED_KEY)||"[]"))}catch{return new Set()}}
const fulfilledIds=loadFulfilled();
function saveFulfilled(){try{localStorage.setItem(FULFILLED_KEY,JSON.stringify([...fulfilledIds].slice(-150)))}catch{}}

if($("worldStock"))$("worldStock").innerHTML=STOCKS.map(([t,n])=>`<option value="${t}">${t} — ${esc(n)}</option>`).join("");

function dataURL(file,forcedMime=""){
 return new Promise((res,rej)=>{
  const r=new FileReader();
  r.onload=()=>{let out=String(r.result||"");if(forcedMime&&out.startsWith("data:"))out=out.replace(/^data:[^;,]*/,"data:"+forcedMime);res(out)};
  r.onerror=()=>rej(new Error("Couldn't read that file."));
  r.readAsDataURL(file);
 });
}
function formatBytes(n){n=Number(n)||0;if(n>=1024*1024)return(n/(1024*1024)).toFixed(n>=10*1024*1024?1:2)+" MB";if(n>=1024)return(n/1024).toFixed(1)+" KB";return n+" B"}
function typeLabel(p){return p.type==="theatre"?"🎭 Theatre Show":p.type==="opera"?"🎼 The Opera":p.type==="live"?"🎤 Live Show":"🎧 Exclusive Song"}
function classify(file){
 const ext=String(file?.name||"").toLowerCase();
 const isM4A=/\.m4a$/.test(ext);
 const isAudio=isM4A||/^audio\//.test(file?.type||"")||/\.(mp3|aac|wav|ogg|flac|opus)$/.test(ext);
 const isVideo=!isM4A&&(/^video\//.test(file?.type||"")||/\.(mp4|mov|m4v|webm|avi|mkv)$/.test(ext));
 return{ext,isM4A,isAudio,isVideo};
}
function validate(p,file){
 if(!p||!file)return"Choose the matching media file first.";
 const{isAudio,isVideo}=classify(file),flexible=p.mediaType==="audio_or_video"||p.type==="live";
 if(p.mediaType==="audio"&&!isAudio)return"Exclusive Songs need an audio file.";
 if(!flexible&&p.mediaType!=="audio"&&!isVideo)return"This ticket needs a video file.";
 if(flexible&&!isAudio&&!isVideo)return"Live Shows accept an audio or video file.";
 if(file.size>MAX_MEDIA)return`This file is ${formatBytes(file.size)}. Keep remote entertainment uploads under 16 MB.`;
 return"";
}
function acceptFor(p){
 const flexible=p.mediaType==="audio_or_video"||p.type==="live";
 if(flexible)return".m4a,.mp3,.aac,.wav,.ogg,.flac,.opus,.mp4,.mov,.m4v,.webm,audio/m4a,audio/x-m4a,audio/mp4,audio/*,video/*";
 if(p.mediaType==="audio")return".m4a,.mp3,.aac,.wav,.ogg,.flac,.opus,audio/m4a,audio/x-m4a,audio/mp4,audio/*";
 return".mp4,.mov,.m4v,.webm,video/*";
}
function chooserFor(p){const flexible=p.mediaType==="audio_or_video"||p.type==="live";return flexible?"🎧🎬 Choose audio or video":p.mediaType==="audio"?"🎧 Choose audio":"🎬 Choose video"}

function render(){
 const prices=$("worldPrices"),purchases=$("worldPurchases"),status=$("worldEntStatus");if(!prices||!purchases)return;
 const stocks=snapshot?.stocks||[];
 prices.innerHTML=stocks.length?stocks.map(s=>`<div><span><b>${esc(s.ticker)}</b> ${esc(s.name)}</span><strong>${Number(s.price||0).toFixed(2).replace(/\.00$/,'')} MB ${s.frozen?'❄️':''}</strong></div>`).join(""):'<div class="worldEmpty">Open The Internet on LizzyOS once so the market can sync here.</div>';
 const all=snapshot?.purchases||[];
 const ps=all.filter(p=>p.status!=="ready"&&!fulfilledIds.has(p.id));
 status.textContent=lastDeliveryMsg|| (snapshot?.at?`● Synced ${new Date(snapshot.at).toLocaleString()} · Spendable ${Number(snapshot.cash||0).toFixed(2).replace(/\.00$/,'')} MB`:'○ Waiting for LizzyOS to sync');
 purchases.innerHTML=ps.length?ps.slice().reverse().map(p=>{
  const selected=selectedFiles.get(p.id),accept=acceptFor(p),chooser=chooserFor(p);
  return `<article class="worldPurchase">
   <div class="worldPurchaseHead"><div><b>${typeLabel(p)}</b><span>${esc(p.title)} · ${esc(p.tier)} · ${Number(p.price||0)} MB</span></div><em class="${p.status==='ready'?'ready':'waiting'}">${p.status==='ready'?'READY':'WAITING FOR MEDIA'}</em></div>
   <p>Purchased ${new Date(p.boughtAt).toLocaleString()}</p>
   <label class="worldUpload"><input type="file" data-world-media="${esc(p.id)}" accept="${accept}"><span>${selected?'✅ '+esc(selected.name):chooser} <small>${selected?formatBytes(selected.size):'up to 16 MB'}</small></span></label>
   ${selected?`<div class="worldUploadResult"><b>✅ File selected:</b> ${esc(selected.name)} · ${formatBytes(selected.size)}<br><span>Ready to upload.</span></div>`:""}
   <button class="primary" data-world-deliver="${esc(p.id)}" ${selected?'':'disabled'}>${selected?(p.status==='ready'?'Replace with selected file':'Upload selected file'):'Choose a file first'}</button>
   <div class="worldUploadResult" data-world-result="${esc(p.id)}"></div>
  </article>`;
 }).join(""):'<div class="worldEmpty">No entertainment purchases yet. Once Lizzy buys a ticket or exclusive song, it will appear here.</div>';
 purchases.querySelectorAll('[data-world-media]').forEach(input=>input.onchange=()=>{
  const id=input.dataset.worldMedia,p=(snapshot?.purchases||[]).find(x=>x.id===id),file=input.files?.[0],result=document.querySelector(`[data-world-result="${CSS.escape(id)}"]`);
  if(!file){selectedFiles.delete(id);render();return}
  const err=validate(p,file);
  if(err){selectedFiles.delete(id);if(result)result.textContent='❌ '+err;input.value='';return}
  selectedFiles.set(id,file);render();
 });
 purchases.querySelectorAll('[data-world-deliver]').forEach(b=>b.onclick=()=>deliver(b.dataset.worldDeliver));
}

async function load(){
 if(!window.MikaelHQApi)return;
 try{const d=await api('world_snapshot_get');snapshot=d.snapshot||null;render()}catch(e){if($("worldEntStatus"))$("worldEntStatus").textContent=e.message}
 clearInterval(timer);
 timer=setInterval(async()=>{if(!document.getElementById('world')?.classList.contains('hidden'))try{const d=await api('world_snapshot_get');snapshot=d.snapshot||snapshot;render()}catch{}},8000);
}
async function marketCommand(scope,action){
 const result=$("worldMarketResult"),ticker=$("worldStock")?.value,percent=Math.max(1,Math.min(80,Number($("worldPercent")?.value)||12)),headline=$("worldHeadline")?.value.trim()||"",sentiment=$("worldSentiment")?.value||"neutral";
 if(result)result.textContent='Sending market command…';
 try{await api('world_hq_push',{command:{kind:'market',scope,ticker,action,percent,headline,sentiment}});if(result)result.textContent=`✅ Queued ${scope==='market'?'whole-market':ticker} ${action.replace(/_/g,' ')}. Lizzy will see the public price/news effect after her Internet syncs.`;setTimeout(load,2500)}catch(e){if(result)result.textContent='❌ '+e.message}
}
async function deliver(id){
 const p=(snapshot?.purchases||[]).find(x=>x.id===id),file=selectedFiles.get(id),result=document.querySelector(`[data-world-result="${CSS.escape(id)}"]`);
 if(!p||!file){if(result)result.textContent='Choose the matching media file first.';return}
 const err=validate(p,file);if(err){if(result)result.textContent='❌ '+err;return}
 const{isM4A,isAudio}=classify(file);
 if(result)result.textContent=`Reading ${file.name} (${formatBytes(file.size)})…`;
 try{
  const normalizedMime=isM4A?'audio/mp4':(file.type||(isAudio?'audio/mpeg':'video/mp4'));
  const media=await dataURL(file,normalizedMime);
  if(result)result.textContent=`Uploading ${file.name}…`;
  await api('world_media_put',{purchaseId:id,media:{data:media,mediaType:isAudio?'audio':'video',mime:normalizedMime,name:file.name,size:file.size}});
  selectedFiles.delete(id);
  fulfilledIds.add(id);saveFulfilled();
  lastDeliveryMsg=`✅ ${p.title} sent to Lizzy. Request removed from HQ.`;
  render();
  setTimeout(()=>{lastDeliveryMsg='';load()},2500);
 }catch(e){if(result)result.textContent='❌ '+e.message}
}

$("worldRefresh")?.addEventListener('click',load);
$("worldApplyStock")?.addEventListener('click',()=>marketCommand('stock',$("worldAction").value));
document.querySelectorAll('[data-world-global]').forEach(b=>b.onclick=()=>marketCommand('market',b.dataset.worldGlobal));
window.MikaelWorldHQ={load};
})();
