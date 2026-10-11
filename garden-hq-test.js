/* MICKY TEST HQ — Garden Studio v2. Requires existing authenticated MikaelHQApi. */
(()=>{'use strict';
 const $=id=>document.getElementById(id);
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const A='assets/garden-magic/';
 const originals=[['tulip','Tulip'],['redRose','Red Rose'],['pinkRose','Pink Rose'],['whiteRose','White Rose'],['lilyValley','Lily of the Valley'],['cryingLily','Crying Lily'],['snapdragon','Snapdragon'],['sunflower','Sunflower'],['daisy','Daisy'],['lavender','Lavender'],['orchid','Orchid'],['peony','Peony'],['hydrangea','Hydrangea'],['carnation','Carnation'],['daffodil','Daffodil'],['iris','Iris'],['chrysanthemum','Chrysanthemum'],['poppy','Poppy'],['forgetMeNot','Forget-Me-Not'],['hibiscus','Hibiscus'],['mysteryBloom','Mystery Blossom'],['moonflower','Moonflower'],['starBloom','Star Bloom'],['gardenCrown','Garden Crown'],['protea','Protea'],['zinnia','Zinnia'],['camellia','Camellia'],['marigold','Marigold'],['babysBreath',"Baby's Breath"],['ranunculus','Ranunculus'],['blueRose','Blue Rose']].map(([id,name])=>({id,name,img:'assets/flowers/'+id+'.png',rarity:'Original'}));
 const special=[
 ['butterflyBloom','Butterfly Bloom','Sanctuary','Common'],['roseNectarFlower','Rose Nectar Flower','Sanctuary','Rare'],['emeraldPetalVine','Emerald Petal Vine','Sanctuary','Epic'],
 ['lunarLavender','Lunar Lavender','Moonlight','Common'],['midnightTulip','Midnight Tulip','Moonlight','Uncommon'],['moonlightOrchid','Moonlight Orchid','Moonlight','Rare'],
 ['starLily','Star Lily','Moonlight','Rare'],['silverRose','Silver Rose','Moonlight','Epic'],['celestialBlossom','Celestial Blossom','Moonlight','Legendary'],
 ['secretRose','Secret Rose','Hidden','Rare'],['memoryVine','Memory Vine','Hidden','Epic'],['wishingLily','Wishing Lily','Hidden','Epic'],['eternalBlossom','Eternal Blossom','Hidden','Legendary']
 ].map(([id,name,zone,rarity])=>({id,name,zone,rarity,img:A+'plants/'+id+'.webp'}));
 const flowers=[...originals,...special],catalog=Object.fromEntries(flowers.map(x=>[x.id,x]));
 const glowIds=new Set(['moonflower','lunarLavender','midnightTulip','moonlightOrchid','starLily','silverRose','celestialBlossom','eternalBlossom']);
 const deco={butterflyFountain:'⛲ Butterfly Fountain',moonLantern:'🏮 Moon Lantern',gardenBench:'🪑 Garden Bench',starPlanter:'✨ Star Planter',butterflyStatue:'🦋 Butterfly Statue',topiary:'🌳 Flower Topiary',miniFountain:'⛲ Mini Fountain'};
 const wrapOptions=['Blush Pink','Classic Cream','Midnight Blue','Starlight Silver'];
 const ribbonOptions=['White Satin','Gold','Pink','Moonbeam'];
 const locations={memoryTree:'🌳 Beneath Memory Tree',fountain:'⛲ Beside Wishing Fountain',hedge:'🌿 Secret Hedge'};
 let chosen=['redRose'],wrap=wrapOptions[0],ribbon=ribbonOptions[0],message='',glow=false,kind='plant',itemId='moonlightOrchid',location='memoryTree',giftMessage='';
 let data={bouquets:[],surprises:[],progress:{},deliveries:{total:0,fromLizzy:0,fromMikael:0}};
 const pendingKey='gmhq_test_pending_v2';
 function readPending(){try{return JSON.parse(sessionStorage.getItem(pendingKey)||'null')||{}}catch{return {}}}
 let pending=readPending();
 function savePending(){try{sessionStorage.setItem(pendingKey,JSON.stringify(pending))}catch{}}
 function reconcilePending(){if(pending.bouquet&&data.bouquets.some(x=>x.clientTx===pending.bouquet.clientTx))delete pending.bouquet;
 if(pending.gift&&data.surprises.some(x=>x.clientTx===pending.gift.clientTx))delete pending.gift;
 savePending();}
 const api=(action,extra={})=>{if(typeof window.MikaelHQApi!=='function')throw Error('Log into Test HQ first');return window.MikaelHQApi(action,{role:'Mikael',...extra})};
 const status=t=>{const e=$('gmhqStatus');if(e)e.textContent=t};
 const img=s=>`<img src="${esc(s)}" alt="" loading="lazy">`;
 const formatDate=t=>{try{return new Date(t).toLocaleDateString()}catch{return''}};
 const flowerImages=ids=>(ids||[]).map(id=>catalog[id]?img(catalog[id].img):'').join('');
 const name=id=>catalog[id]?.name||deco[id]||id;
 const tx=()=>('hq_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,11));
 async function load(){if(!$('gardenHQMount'))return;try{const r=await api('garden_test_state');data={...data,...r};reconcilePending();render();status('🟢 Connected to TEST Worker · Garden Studio v2')}catch(e){render();status('⚠️ '+e.message)}}
 function syncInputs(){if($('gmhqWrap'))wrap=$('gmhqWrap').value;if($('gmhqRibbon'))ribbon=$('gmhqRibbon').value;if($('gmhqMessage'))message=$('gmhqMessage').value;if($('gmhqGlow'))glow=$('gmhqGlow').checked;
 if($('gmhqGiftKind'))kind=$('gmhqGiftKind').value;if($('gmhqGiftItem'))itemId=$('gmhqGiftItem').value;if($('gmhqGiftLocation'))location=$('gmhqGiftLocation').value;if($('gmhqGiftMsg'))giftMessage=$('gmhqGiftMsg').value;}
 const giftChoices=()=>kind==='decor'?Object.entries(deco).map(([id,display])=>({id,name:display})):special;
 const glowAllowed=()=>chosen.some(x=>glowIds.has(x));
 function deliveryCard(b){return `<div class="gmhq-item ${b.glow?'gmhq-glow':''}"><strong>${b.to==='Mikael'?'💐 From Lizzy':'💌 Sent to Lizzy'} ${b.glow?'· ✨ Glowing':''}</strong><div class="gmhq-pictures">${flowerImages(b.flowers)}</div><p>${esc((b.flowers||[]).map(name).join(', '))}</p><p>${esc(b.note||'A lovely bouquet')}</p><small>${esc(b.wrapping||'')} · ${esc(b.ribbon||'')} · ${b.openedAt?'Opened '+formatDate(b.openedAt):'Delivered, awaiting opening'}</small>${b.to==='Mikael'&&!b.openedAt?`<button data-gmhq-open="${esc(b.id)}">🎁 Open bouquet</button>`:''}</div>`}
 function surpriseCard(g){return `<div class="gmhq-item"><strong>${g.openedAt?'💝 Opened by Lizzy':g.revealed?'🎁 Waiting to be opened':'🔒 Queued until Hidden Garden unlock'}</strong><p>${esc(name(g.itemId)||(g.kind||'Gift'))}${g.kind==='letter'?'A note':''} · ${esc(g.kind)}</p><p>${esc(g.message||'A secret gift from Mikael')}</p><small>${esc(g.location||'memoryTree')} · ${formatDate(g.createdAt)}</small></div>`}
 function render(){const mount=$('gardenHQMount');if(!mount)return;const p=data.progress||{},d=data.deliveries||{},stage=Math.max(1,Math.min(4,Number(p.memoryTreeStage)||1));
 const ch=giftChoices(),giftValue=ch.some(x=>x.id===itemId)?itemId:ch[0]?.id||'';itemId=giftValue;
 mount.innerHTML=`<div class="gmhq-card"><div class="gmhq-heading"><div><h3>🌷 Garden progress</h3><p class="gmhq-caption">Live test progress last synced from Lizzy's TESTR garden, not the production site.</p></div><button id="gmhqRefresh">↻ Refresh</button></div><div class="gmhq-progress"><span>🌷 <b>${p.flowersGrown||0}</b> flowers grown</span><span>🦋 Sanctuary: ${p.butterfly?'Unlocked':'Locked'}</span><span>🌙 Moonlight: ${p.moonlight?'Unlocked':'Locked'}</span><span>🌳 Hidden: ${p.hiddenUnlocked?'Found by Lizzy':'Locked'}</span><span>🦋 ${p.butterfliesFound||0}/20 butterflies</span><span>✨ <b>${Number.isFinite(Number(p.walletStardust))?Number(p.walletStardust):Number(p.stardust||0)}</b> Stardust available</span><span>🍯 <b>${Number(p.walletNectar||0)}</b> Nectar available</span></div><div class="gmhq-progress"><span>💐 <b>${d.total||0}</b> deliveries</span><span>From Lizzy: ${d.fromLizzy||0}</span><span>From Mikael: ${d.fromMikael||0}</span></div><div id="gmhqStatus" class="gmhq-status"></div></div>
 <div class="gmhq-card"><h3>⛲ Latest Wishing Fountain result</h3>${p.lastWish?`<p><b>${p.lastWish.granted?'✅ Wish granted':'🌙 Not granted — consolation'}</b> · ${esc(p.lastWish.day||'')}</p><p>Lizzy wished for: <b>${esc(p.lastWish.wishName||'A surprise')}</b></p><p>What she received: <b>${esc(p.lastWish.rewardLabel||'Unknown reward')}</b></p>`:'<p class="gmhq-caption">Lizzy has not made a recorded fountain wish in this test version yet.</p>'}<p class="gmhq-caption">HQ displays Lizzy's latest synced result. Full wish history remains in her Hidden Garden.</p></div>
 <div class="gmhq-grid"><div class="gmhq-card"><h3>💐 Send Lizzy a bouquet</h3><p class="gmhq-caption">Choose up to six different flower types. HQ has its own authorized gifting catalogue, so sending does not deduct flowers from Lizzy's inventory.</p><div class="gmhq-flowers">${flowers.map(f=>`<button data-gmhq-flower="${f.id}" class="gmhq-flower ${chosen.includes(f.id)?'gmhq-selected':''}">${img(f.img)}<b>${esc(f.name)}</b><small>${f.zone||f.rarity}</small></button>`).join('')}</div><div class="gmhq-fieldrow"><label>Wrapping<select id="gmhqWrap">${wrapOptions.map(x=>`<option ${wrap===x?'selected':''}>${x}</option>`).join('')}</select></label><label>Ribbon<select id="gmhqRibbon">${ribbonOptions.map(x=>`<option ${ribbon===x?'selected':''}>${x}</option>`).join('')}</select></label></div><label>Message<textarea id="gmhqMessage" maxlength="300" placeholder="Write Lizzy a note…">${esc(message)}</textarea></label><label class="gmhq-check"><input id="gmhqGlow" type="checkbox" ${glow&&glowAllowed()?'checked':''} ${glowAllowed()?'':'disabled'}> ✨ Glowing bouquet</label><p class="gmhq-caption">${chosen.length}/6 selected. ${glowAllowed()?'Contains a moonlit flower; glow available.':'Select a Moonlight flower or existing Moonflower to enable glow.'}</p><button id="gmhqSend" ${chosen.length&&!pending.bouquet?'':'disabled'}>💌 Send ${glow&&glowAllowed()?'glowing ':''}bouquet</button>${pending.bouquet?'<p class="gmhq-caption">A previous bouquet may have reached Lizzy. Confirm it before sending another.</p><button id="gmhqRetryBouquet">↻ Confirm previous bouquet</button>':''}</div>
 <div class="gmhq-card"><h3>🎁 Prepare a Hidden Garden gift</h3><p class="gmhq-caption">Queue gifts before Lizzy unlocks the Hidden Garden. When she unwraps them, potted plants will appear in her garden and seeds will be added to her special-garden inventory.</p><label>Gift type<select id="gmhqGiftKind">${[['plant','🪴 Potted plant'],['seed','🌱 Seed packet'],['decor','🏡 Garden decoration'],['letter','💌 Personal note']].map(([v,l])=>`<option value="${v}" ${kind===v?'selected':''}>${l}</option>`).join('')}</select></label>${kind==='letter'?'':`<label>Plant / item<select id="gmhqGiftItem">${ch.map(x=>`<option value="${x.id}" ${itemId===x.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select></label>`}<div class="gmhq-gift-preview">${catalog[itemId]?img(catalog[itemId].img):`<span>${kind==='letter'?'💌':(deco[itemId]||'🎁').split(' ')[0]}</span>`}<b>${kind==='letter'?'Secret Letter':esc(name(itemId))}</b></div><label>Hiding location<select id="gmhqGiftLocation">${Object.entries(locations).map(([v,l])=>`<option value="${v}" ${location===v?'selected':''}>${esc(l)}</option>`).join('')}</select></label><label>Personal note<textarea id="gmhqGiftMsg" maxlength="300" placeholder="A little surprise for Lizzy…">${esc(giftMessage)}</textarea></label><button id="gmhqGift" ${pending.gift?'disabled':''}>🌳 Leave secret gift</button>${pending.gift?'<button id="gmhqRetryGift">↻ Confirm previous gift</button>':''}</div></div>
 <div class="gmhq-card gmhq-memory"><div class="gmhq-memory-img">${img(A+'tree/memoryTree'+stage+'.webp')}</div><div><h3>🌳 The Memory Tree</h3><p><b>Stage ${stage} of 4</b> · Its growth reflects shared bouquet and gift milestones.</p><p class="gmhq-caption">Only Lizzy can discover the Hidden Garden. Mikael can prepare gifts without unlocking it for her.</p></div></div>
 <div class="gmhq-grid"><div class="gmhq-card"><h3>📖 Bouquet scrapbook</h3><div class="gmhq-list">${data.bouquets?.length?data.bouquets.slice().reverse().map(deliveryCard).join(''):'<p>No bouquets delivered yet.</p>'}</div></div><div class="gmhq-card"><h3>🎁 Secret gift history</h3><div class="gmhq-list">${data.surprises?.length?data.surprises.slice().reverse().map(surpriseCard).join(''):'<p>No secret gifts yet.</p>'}</div></div></div>`;
 mount.onclick=async e=>{const b=e.target.closest('button');if(!b||!mount.contains(b))return;
 if(b.id==='gmhqRefresh'){await load();return}
 if(b.dataset.gmhqFlower){syncInputs();const id=b.dataset.gmhqFlower;chosen=chosen.includes(id)?chosen.filter(x=>x!==id):chosen.length<6?[...chosen,id]:chosen;if(!glowAllowed())glow=false;render();return}
 if(b.id==='gmhqRetryBouquet'){
  b.disabled=true;try{await api('garden_test_send',pending.bouquet);await load();status('💌 Bouquet delivery confirmed.')}catch(e){status('⚠️ '+e.message);b.disabled=false}return;
 }
 if(b.id==='gmhqRetryGift'){
  b.disabled=true;try{await api('garden_test_surprise',pending.gift);await load();status('🎁 Gift delivery confirmed.')}catch(e){status('⚠️ '+e.message);b.disabled=false}return;
 }
 if(b.id==='gmhqSend'){
  syncInputs();if(!chosen.length)return;const light=glow&&glowAllowed();b.disabled=true;
  const nonce=tx();pending.bouquet={from:'Mikael',clientTx:nonce,flowers:[...chosen],wrapping:wrap,ribbon,note:message,glow:light};savePending();try{await api('garden_test_send',pending.bouquet);message='';await load();status('💌 '+(light?'Glowing bouquet':'Bouquet')+' delivered to Lizzy!')}
  catch(err){status('⚠️ '+err.message);b.disabled=false}return;
 }
 if(b.id==='gmhqGift'){
  syncInputs();if(kind==='letter'&&!giftMessage.trim())return status('Write a note first.');b.disabled=true;
  pending.gift={clientTx:tx(),kind,itemId:kind==='letter'?'':itemId,location,message:giftMessage};savePending();try{await api('garden_test_surprise',pending.gift);giftMessage='';await load();status('🎁 Surprise queued for Lizzy’s Hidden Garden!')}
  catch(err){status('⚠️ '+err.message);b.disabled=false}return;
 }
 if(b.dataset.gmhqOpen){b.disabled=true;try{await api('garden_test_open',{id:b.dataset.gmhqOpen});await load();status('💐 Opened Lizzy’s bouquet. Saved to the scrapbook!')}catch(err){status('⚠️ '+err.message);b.disabled=false}return;}
 };
 mount.onchange=e=>{if(e.target.id==='gmhqGiftKind'){giftMessage=$('gmhqGiftMsg')?.value||giftMessage;location=$('gmhqGiftLocation')?.value||location;kind=e.target.value;itemId=kind==='decor'?'butterflyFountain':'moonlightOrchid';render()}else syncInputs()};
 mount.oninput=e=>{if(e.target.id==='gmhqMessage')message=e.target.value;if(e.target.id==='gmhqGiftMsg')giftMessage=e.target.value};
 }
 window.MikaelGardenHQ={load};
})();
