/* Both HQs: show the real scheduled Daily Gobshite article, plus optional original edition iframe. No new Worker required. */
(()=>{'use strict';
const catalog=window.LizzyUomCatalog;
const target=document.getElementById('mickyNewsMount');
if(!target)return;
const env=target.dataset.edition==='test'?'test':'v3';
const PREFIX=env==='test'?'mickyTestHQDailyGobshiteUrlV1':'mickyMainHQDailyGobshiteUrlV1';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arr=catalog?.holidays||[];
let selected='today',settings=null,loaded=false;
const today=()=>{
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Johannesburg',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const p=Object.fromEntries(parts.filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
  return `${p.year}-${p.month}-${p.day}`;
};
function formatDate(date){return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-ZA',{day:'numeric',month:'long',year:'numeric',timeZone:'Africa/Johannesburg'});}
const currentHoliday=()=>arr.find(x=>x.date===today());
function getHoliday(){return selected==='today'?currentHoliday():arr.find(x=>x.id===selected);}
function articleHtml(h){
 const conf=settings?.holidays?.[h.id]||{};
 const active=conf.enabled!==false;
 const onDate=h.date===today();
 const title=conf.headline||h.headline;
 const raw=h.article+(conf.holidayText?'\n\nPRESIDENTIAL DUTY UPDATE: '+conf.holidayText:'');
 const paragraphs=raw.split(/\n\s*\n/).map(p=>'<p>'+esc(p)+'</p>').join('');
 return `<article class="mnPaper" data-article-id="${esc(h.id)}">
 <header class="mnMast"><small>THE REPUBLIC OF LIZZYOS · THE OFFICIAL PRESS</small><div>THE DAILY GOBSHITE</div><small>MICKY NEWS · NATIONAL HOLIDAY EDITION</small></header>
 <div class="mnKicker">${h.emoji} ${onDate?'TODAY’S EXCLUSIVE EDITION':'HQ ARCHIVE / PREVIEW'} · ${esc(formatDate(h.date))}</div>
 <h2>${esc(title)}</h2><div class="mnByline">By the Office of Excessive Presidential Journalism · ${esc(h.title)}</div>
 ${paragraphs}
 ${active?'':`<div class="mnNote">⚠ This holiday is currently disabled in the University settings. This article is shown as an HQ-only preview.</div>`}
 <div class="mnExclusive"><b>✉️ Exclusive Micky News Letter</b><p>This holiday also has a separate sealed letter, shown to Lizzy only on its scheduled day. HQ can preview the letter.</p><button type="button" id="mnReadLetter">Preview the exclusive letter</button><div id="mnLetterSlot"></div></div>
 <footer class="mnStamp">PRINTED BY THE DEPARTMENT OF UNNECESSARILY DRAMATIC JOURNALISM · LIZZYOS</footer>
 </article>`;
}
function articleArea(){
 const h=getHoliday();
 if(h)return articleHtml(h);
 const next=arr.find(x=>x.date>today());
 return `<div class="mnPaper"><header class="mnMast"><small>THE REPUBLIC OF LIZZYOS</small><div>THE DAILY GOBSHITE</div><small>MICKY NEWS</small></header><h2>No national-holiday exclusive scheduled for today</h2><p>The normal newspaper continues. Choose a holiday below to preview its article in HQ.</p>${next?`<div class="mnNote">Next special edition: ${esc(next.title)} · ${esc(formatDate(next.date))}</div>`:''}</div>`;
}
function baseToViewer(value){
 const u=new URL(String(value||'').trim());
 if(u.protocol!=='https:' && !(u.protocol==='http:'&&['localhost','127.0.0.1'].includes(u.hostname)))throw Error('Use the HTTPS address of your '+(env==='test'?'TESTR':'V3')+' website.');
 u.hash='';u.search='';
 if(u.pathname.endsWith('.html'))u.pathname=u.pathname.replace(/[^/]+$/,'');
 else if(!u.pathname.endsWith('/'))u.pathname+='/';
 u.pathname+='daily-news-view.html';return u.toString();
}
function readUrl(){try{return localStorage.getItem(PREFIX)||(env==='v3'?localStorage.getItem('mickyHQV3NewspaperSourceV1'):'')||'';}catch{return '';}}
function saveUrl(s){try{localStorage.setItem(PREFIX,s);}catch{}}
function render(){
 // The Editorial Desk must render EVEN when the optional University holiday catalog is missing.
 // Former early return here hid every newspaper control when uom-data failed to load.
 target.innerHTML=`<div class="mickyNews"><div class="mnIntro"><strong>📰 Micky News · ${env==='test'?'TEST HQ':'Main HQ'}</strong><p>Today's national-holiday feature appears here in full, independently of Lizzy's browser. This is also an HQ archive for checking scheduled articles.</p><p class="mnMuted">Current Johannesburg date: <b>${esc(formatDate(today()))}</b>. The dated exclusive remains visible to Lizzy only on its scheduled day.</p></div>
 <div id="gobPart1Desk"></div>
 ${!catalog?'<p class="mnMuted">Holiday previews are unavailable because the University catalog did not load. Editorial controls remain available above.</p>':''}
 <div class="mnBar"><label>Read a holiday article<select id="mnArticlePick"><option value="today" ${selected==='today'?'selected':''}>🗞️ Today's special edition</option>${arr.map(h=>`<option value="${esc(h.id)}" ${selected===h.id?'selected':''}>${esc(formatDate(h.date))} · ${esc(h.title)}</option>`).join('')}</select></label><button type="button" id="mnRefresh">↻ Refresh articles</button></div>
 <div id="mnArticleArea">${articleArea()}</div>
 <div class="mnEditionPanel"><h3>🗞️ Read the complete ${env==='test'?'TESTR':'V3'} newspaper</h3><p class="mnMuted">Optional: enter the ${env==='test'?'TESTR':'V3'} website URL once to see the original rotating newspaper in this HQ. The date-specific holiday article above works without it.</p><div class="mnBar"><label>${env==='test'?'TESTR':'V3'} site URL<input id="mnBase" type="url" autocomplete="url" placeholder="https://your-lizzyos-site.example/" value="${esc(readUrl())}"></label><button type="button" id="mnLoadEdition">Load full newspaper</button></div><div class="mnStatus" id="mnEditionStatus" role="status"></div><div id="mnFrameHolder"></div></div>
 </div>`;
 target.querySelector('#mnArticlePick').addEventListener('change',e=>{selected=e.target.value;render()});
 target.querySelector('#mnRefresh').addEventListener('click',()=>load());
 const letter=target.querySelector('#mnReadLetter');if(letter)letter.addEventListener('click',()=>readLetter(getHoliday()));
 target.querySelector('#mnLoadEdition').addEventListener('click',()=>loadEdition());
 window.GobshiteEditorialHQ?.mount?.();
}
async function readLetter(h){
 if(!h)return;
 const slot=target.querySelector('#mnLetterSlot');const btn=target.querySelector('#mnReadLetter');
 if(!slot)return;slot.textContent='Loading HQ preview…';if(btn)btn.disabled=true;
 try{
  if(typeof window.MikaelHQApi!=='function')throw Error('Unlock HQ to preview the sealed letter.');
  const data=await window.MikaelHQApi('uom_hq_holiday_letter',{holidayId:h.id});
  slot.innerHTML=`<div class="mnLetter"><h3>${esc(data.title||h.title)}</h3><p>${esc(data.body||'No letter text found.')}</p></div>`;
 }catch(e){slot.innerHTML=`<div class="mnNote">Letter preview unavailable: ${esc(e.message)}. The full holiday article above is still available.</div>`;}
 finally{if(btn)btn.disabled=false;}
}
function loadEdition(){
 const input=target.querySelector('#mnBase'),status=target.querySelector('#mnEditionStatus'),holder=target.querySelector('#mnFrameHolder');
 try{
  const url=baseToViewer(input.value);saveUrl(input.value.trim());holder.innerHTML='';
  const frame=document.createElement('iframe');frame.setAttribute('title',env==='test'?'TESTR daily newspaper':'V3 daily newspaper');frame.setAttribute('loading','lazy');frame.setAttribute('referrerpolicy','no-referrer');frame.setAttribute('sandbox','allow-scripts allow-same-origin');frame.src=url;holder.appendChild(frame);status.textContent='Loading the original Daily Gobshite edition. The newspaper page must exist on your '+(env==='test'?'TESTR':'V3')+' site.';
 }catch(e){status.textContent=e.message;holder.innerHTML='';}
}
async function load(){
 render(); // render the local article first even if network is unavailable
 try{if(typeof window.MikaelHQApi==='function'){
   const data=await window.MikaelHQApi('uom_hq_state');
   if(data?.state?.config){settings=data.state.config;render();}
 }}catch(e){const n=target.querySelector('.mnIntro');if(n){const p=document.createElement('p');p.className='mnMuted';p.textContent='Live holiday settings unavailable: '+e.message+'. Showing the scheduled article from this HQ’s catalog.';n.appendChild(p);}}
}
window.MickyNewsHQ={load,today,getHoliday,formatDate,baseToViewer};
document.querySelectorAll('[data-view="mickynews"]').forEach(b=>b.addEventListener('click',()=>{const t=document.getElementById('viewTitle');if(t)t.textContent='📰 Micky News · The Daily Gobshite';load();}));
})();