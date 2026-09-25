/**
 * LizzyOS TEST Worker — isolated Mikael HQ laboratory
 * KV: LIZZY_TEST recommended (all keys automatically prefixed mickyhq-test:)
 * Secrets: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 * Telegram webhook: /telegram
 */
const H={"content-type":"application/json","access-control-allow-origin":"*","access-control-allow-headers":"Content-Type","access-control-allow-methods":"GET,POST,OPTIONS"};
const json=(x,s=200)=>new Response(JSON.stringify(x),{status:s,headers:H});

/* TEST LAB ISOLATION
   Every KV key used by this Worker is automatically namespaced under
   mickyhq-test:. This prevents the test HQ from colliding with live data
   even if the same KV namespace is accidentally bound while testing. */
const TEST_KV_PREFIX="mickyhq-test:";
function testKV(env){
  const kv=env.LIZZY_TEST||env.LIZZY_CLAIMS;
  if(!kv)throw new Error("Bind a KV namespace as LIZZY_TEST (recommended) or LIZZY_CLAIMS.");
  return {
    get:(k,...a)=>kv.get(TEST_KV_PREFIX+k,...a),
    put:(k,v,...a)=>kv.put(TEST_KV_PREFIX+k,v,...a),
    delete:(k,...a)=>kv.delete(TEST_KV_PREFIX+k,...a)
  };
}
async function tg(env,m,p){const r=await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${m}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(p)});return r.json();}
async function getClaim(env,id){return testKV(env).get(`claim:${id}`,{type:"json"})||testKV(env).get(id,{type:"json"});}
async function putClaim(env,c){await testKV(env).put(`claim:${c.claimId}`,JSON.stringify(c));}
const id=()=>`bid_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
const shelfStateKey=itemId=>`secret_shelf:item:${itemId}:latest`;
async function putShelfState(env,c){
 if(!c?.itemId)return;
 await testKV(env).put(shelfStateKey(c.itemId),JSON.stringify({
   claimId:c.claimId,itemId:c.itemId,item:c.item,offer:c.offer,status:c.status,
   counterOffer:c.counterOffer??null,createdAt:c.createdAt,decidedAt:c.decidedAt||null,
   updatedAt:new Date().toISOString()
 }));
}



/* ===== CROSS-DEVICE MIKAEL REVERSE TOKENS ===== */
const MIKAEL_TOKEN_STATE_KEY="mikael:reverse_tokens:v1";
const MIKAEL_REDEMPTION_INDEX_KEY="mikael:redemptions:index:v1";
async function getMikaelTokenState(env){
  const s=await testKV(env).get(MIKAEL_TOKEN_STATE_KEY,{type:"json"});
  return s&&typeof s==="object"?s:{inventory:{},history:[]};
}
async function putMikaelTokenState(env,s){
  await testKV(env).put(MIKAEL_TOKEN_STATE_KEY,JSON.stringify(s));
}
async function getRedemptionIndex(env){
  const x=await testKV(env).get(MIKAEL_REDEMPTION_INDEX_KEY,{type:"json"});
  return Array.isArray(x)?x:[];
}
async function putRedemptionIndex(env,x){
  await testKV(env).put(MIKAEL_REDEMPTION_INDEX_KEY,JSON.stringify(x.slice(-100)));
}
function rid(){return `reverse_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;}

/* Shared grant logic — used by the mikael_reverse_token_award POST handler
   AND by the /token Telegram command. Keeps inventory + history in sync
   no matter which path awarded the token. */
async function awardMikaelToken(env,name,emoji,desc,source){
  name=String(name||"").trim();
  if(!name)throw new Error("Missing token name");
  emoji=String(emoji||"🔄");
  desc=String(desc||"");
  const state=await getMikaelTokenState(env);
  state.inventory=state.inventory||{};
  state.history=Array.isArray(state.history)?state.history:[];
  state.inventory[name]=Number(state.inventory[name]||0)+1;
  state.history.push({type:"earned",token:name,source:String(source||"LizzyOS Daily Reward"),at:new Date().toISOString()});
  await putMikaelTokenState(env,state);
  return {state,name,emoji,desc,count:state.inventory[name]};
}

/* Full Reverse Token catalog (mirrors the REVERSE array in script.js) so the
   /token Telegram command can fuzzy-match a search term to a real token. */
const MIKAEL_TOKEN_CATALOG=[
["🥤","Reverse Token — Lizzy Owes Mikael a Monster","Lizzy owes Mikael one Monster."],
["🫂","Reverse Token — Mikael Gets a Hug","Lizzy owes Mikael one proper hug."],
["🍦","Reverse Token — Mikael Gets Ice Cream","Lizzy owes Mikael one ice cream."],
["🍰","Reverse Token — Mikael Gets Dessert","Lizzy owes Mikael one dessert."],
["🍫","Reverse Token — Mikael Gets a Chocolate","Lizzy owes Mikael one chocolate."],
["🍬","Reverse Token — Mikael Gets Sweets","Lizzy owes Mikael some sweets."],
["🥤","Reverse Token — Mikael Gets a Coke","Lizzy owes Mikael one Coke."],
["☕","Reverse Token — Mikael Gets a Drink","Lizzy owes Mikael one reasonable drink."],
["🍔","Reverse Token — Mikael Gets a Snack","Lizzy owes Mikael one snack."],
["🍟","Reverse Token — Mikael Gets Fries","Lizzy owes Mikael some fries."],
["🎬","Reverse Token — Mikael Picks the Movie","Mikael chooses the movie for one movie night."],
["📺","Reverse Token — Mikael Picks What We Watch","Mikael chooses what you watch once."],
["🎵","Reverse Token — Mikael Controls the Aux","Mikael controls the music for one reasonable trip or session."],
["🎶","Reverse Token — Mikael Picks One Song","Mikael chooses one song, no skipping."],
["🍽️","Reverse Token — Mikael Picks Where We Eat","Mikael chooses where to eat once."],
["🎯","Reverse Token — Mikael Picks the Activity","Mikael chooses one reasonable activity."],
["🎳","Reverse Token — Mikael Picks the Next Date Activity","Mikael chooses the next activity date."],
["📸","Reverse Token — Mikael Gets One Nice Photo","Lizzy owes Mikael one nice photo."],
["🤳","Reverse Token — Mikael Gets One Selfie Together","One selfie together, Mikael's choice of moment."],
["💌","Reverse Token — Mikael Gets a Nice Message","Lizzy owes Mikael one genuinely nice message."],
["📝","Reverse Token — Mikael Gets a Little Letter","Lizzy owes Mikael one little letter."],
["💬","Reverse Token — Lizzy Answers One Random Question","Lizzy answers one harmless random question properly."],
["🤔","Reverse Token — Mikael Gets One Honest Answer","Mikael gets one honest answer to a reasonable question."],
["📞","Reverse Token — Mikael Gets a Call","Mikael gets one reasonable call."],
["🎙️","Reverse Token — Mikael Gets a Voice Note","Lizzy owes Mikael one voice note."],
["😂","Reverse Token — Mikael Gets One Joke","Lizzy owes Mikael one joke."],
["😌","Reverse Token — Lizzy Says Something Nice About Mikael","Lizzy must say one genuinely nice thing about Mikael."],
["👑","Reverse Token — Mikael Wins One Harmless Argument","Mikael automatically wins one harmless argument."],
["🧑‍⚖️","Reverse Token — No Bullying Mikael for One Hour","Mikael gets one full hour of protection from bullying."],
["🦵","Reverse Token — Mikael's Knees Are Protected for One Day","No knee slander for one full day."],
["😭","Reverse Token — No You're So Annoying for One Hour","Lizzy cannot say 'You're so annoying' to Mikael for one hour."],
["🏆","Reverse Token — Lizzy Admits Mikael Was Right","Lizzy must admit Mikael was right once."],
["😇","Reverse Token — Be Nice to Mikael for 30 Minutes","Thirty uninterrupted minutes of kindness to Mikael."],
["👓","Reverse Token — Four Eyes Compliments Mr Perfect","Four Eyes owes Mr Perfect one compliment."],
["😭","Reverse Token — Mikael Gets One Free Roast","Mikael gets one consequence-free playful roast."],
["🃏","Reverse Token — Mikael Gets One UNO Reverse","Mikael can reverse one playful situation."],
["🎲","Reverse Token — Mikael Chooses","Mikael chooses between two reasonable options."],
["🤝","Reverse Token — One Small Favour","Lizzy owes Mikael one small reasonable favour."],
["🛋️","Reverse Token — Mikael Gets the Comfortable Seat","Mikael gets first choice of the comfortable seat once."],
["🎮","Reverse Token — Mikael Picks the Game","Mikael chooses the game once."],
["⚽","Reverse Token — Watch Football With Mikael","One football watch session with Mikael."],
["💤","Reverse Token — Mikael Gets a Peace & Quiet Pass","One reasonable period of uninterrupted peace and quiet."],
["🥺","Reverse Token — Mikael Gets One Please","Lizzy has to ask nicely once. Very serious legislation."],
["👑","Reverse Token — Mr Perfect Privilege","One small reasonable Mr Perfect privilege."]
];
function findMikaelToken(query){
  query=String(query||"").trim().toLowerCase();
  if(!query)return null;
  const strip=s=>s.replace(/^reverse token\s*—?\s*/i,"").toLowerCase();
  // exact match on the short label first, then substring, then loosest "every word appears" match.
  let hit=MIKAEL_TOKEN_CATALOG.find(([,name])=>strip(name)===query);
  if(hit)return hit;
  hit=MIKAEL_TOKEN_CATALOG.find(([,name])=>strip(name).includes(query)||query.includes(strip(name)));
  if(hit)return hit;
  const words=query.split(/\s+/).filter(Boolean);
  hit=MIKAEL_TOKEN_CATALOG.find(([,name])=>{const n=strip(name);return words.every(w=>n.includes(w));});
  return hit||null;
}


/* ===== 💰 MICKY BANK CLAIMABLE DEPOSITS =====
   A deposit created by Mikael sits in KV as "pending" forever (30 day TTL)
   until someone on Lizzy's side presses "Claim Deposit". */
const DEPOSIT_INDEX_KEY="micky_bank:deposits:index:v1";
const depositKey=id=>`micky_bank:deposit:${id}`;
const did=()=>`dep_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
async function getDepositIndex(env){
  const x=await testKV(env).get(DEPOSIT_INDEX_KEY,{type:"json"});
  return Array.isArray(x)?x:[];
}
async function putDepositIndex(env,x){
  await testKV(env).put(DEPOSIT_INDEX_KEY,JSON.stringify([...new Set(x)].slice(-200)));
}
async function getDeposit(env,id){
  return testKV(env).get(depositKey(id),{type:"json"});
}
async function putDeposit(env,d){
  await testKV(env).put(depositKey(d.id),JSON.stringify(d),{expirationTtl:2592000});
}
async function listDeposits(env,onlyPending=true){
  const ids=await getDepositIndex(env),out=[];
  for(const id of ids){
    const d=await getDeposit(env,id);
    if(!d)continue;
    if(onlyPending&&d.status!=="pending")continue;
    out.push(d);
  }
  return out.sort((a,b)=>String(a.createdAt).localeCompare(String(b.createdAt)));
}
async function createDeposit(env,amount,note,source){
  const amt=Math.max(1,Math.floor(Number(amount)||0));
  const d={
    id:did(),amount:amt,note:String(note||"").slice(0,300),
    source:String(source||"website").slice(0,60),
    status:"pending",createdAt:new Date().toISOString(),
    claimedAt:null,walletAfter:null
  };
  await putDeposit(env,d);
  const ids=await getDepositIndex(env);ids.push(d.id);await putDepositIndex(env,ids);
  const pending=await listDeposits(env,true);
  const total=pending.reduce((s,x)=>s+Number(x.amount||0),0);
  await tg(env,"sendMessage",{
    chat_id:env.TELEGRAM_CHAT_ID,
    text:`💰 MICKY BANK DEPOSIT CREATED\n\n+${amt} MB for Lizzy${d.note?`\nNote: ${d.note}`:""}\n\nPending vouchers: ${pending.length}\nPending total: ${total} MB\n\nIt stays unclaimed until Lizzy presses “Claim Deposit”.\n\nDeposit ID:\n${d.id}`
  });
  return {deposit:d,pendingCount:pending.length,pendingTotal:total};
}

/* ===== 💌 MESSAGES FROM MIKAEL =====
   A little note or "thinking of you" ping that sits in KV as "pending"
   until Lizzy's site shows it to her and she dismisses it. */
const MESSAGE_INDEX_KEY="lizzy_messages:index:v1";
const messageKey=id=>`lizzy_messages:message:${id}`;
const mid=()=>`msg_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
async function getMessageIndex(env){
  const x=await testKV(env).get(MESSAGE_INDEX_KEY,{type:"json"});
  return Array.isArray(x)?x:[];
}
async function putMessageIndex(env,x){
  await testKV(env).put(MESSAGE_INDEX_KEY,JSON.stringify([...new Set(x)].slice(-200)));
}
async function getMessage(env,id){
  return testKV(env).get(messageKey(id),{type:"json"});
}
async function putMessage(env,m){
  await testKV(env).put(messageKey(m.id),JSON.stringify(m),{expirationTtl:2592000});
}
async function listMessages(env,onlyPending=true){
  const ids=await getMessageIndex(env),out=[];
  for(const id of ids){
    const m=await getMessage(env,id);
    if(!m)continue;
    if(onlyPending&&m.status!=="pending")continue;
    out.push(m);
  }
  return out.sort((a,b)=>String(a.createdAt).localeCompare(String(b.createdAt)));
}
async function createMessage(env,text,source){
  const m={
    id:mid(),text:String(text||"").slice(0,500),
    source:String(source||"website").slice(0,60),
    status:"pending",createdAt:new Date().toISOString(),
    seenAt:null
  };
  await putMessage(env,m);
  const ids=await getMessageIndex(env);ids.push(m.id);await putMessageIndex(env,ids);
  const pending=await listMessages(env,true);
  await tg(env,"sendMessage",{
    chat_id:env.TELEGRAM_CHAT_ID,
    text:`💌 MESSAGE QUEUED FOR LIZZY\n\n"${m.text}"\n\nIt'll show up on her screen next time she has LizzyOS open.\n\nUnseen messages waiting: ${pending.length}`
  });
  return {message:m,pendingCount:pending.length};
}

/* ===== 💗 SYNCED FEELINGS — MIKAEL'S MOOD =====
   A single current value, not a queue — always just "what Mikael feels right now". */
const MIKAEL_MOOD_KEY="mikael_mood:current:v1";
/* Quick-pick moods for the /mood button menu + Mikael HQ buttons.
   Text is written so it lines up with MOOD_MATCH_KEYWORDS on the
   front end (e.g. "batman" text matches Lizzy's "catwoman" mood). */
const MIKAEL_MOOD_OPTIONS=[
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
async function getMikaelMood(env){
  return testKV(env).get(MIKAEL_MOOD_KEY,{type:"json"});
}
async function setMikaelMood(env,text,source){
  const m={text:String(text||"").slice(0,200),at:new Date().toISOString(),source:String(source||"website").slice(0,60)};
  await testKV(env).put(MIKAEL_MOOD_KEY,JSON.stringify(m));
  await tg(env,"sendMessage",{chat_id:env.TELEGRAM_CHAT_ID,text:`💗 YOUR MOOD SET\n\n"${m.text}"\n\nLizzy's Today's Connection screen will show this alongside her own mood.`});
  return m;
}

/* ===== 💭 "I WONDER IF…" — SHARED THOUGHT BOARD =====
   A running feed of open musings from either of you. Each thought can
   carry exactly one reply from the other person. */
const THOUGHT_INDEX_KEY="lizzy_thoughts:index:v1";
const LAST_UNANSWERED_KEY="lizzy_thoughts:last_unanswered_lizzy:v1";
const thoughtKey=id=>`lizzy_thoughts:thought:${id}`;
const thid=()=>`thought_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;

async function getThoughtIndex(env){
  const x=await testKV(env).get(THOUGHT_INDEX_KEY,{type:"json"});
  return Array.isArray(x)?x:[];
}
async function putThoughtIndex(env,x){
  await testKV(env).put(THOUGHT_INDEX_KEY,JSON.stringify([...new Set(x)].slice(-300)));
}
async function getThought(env,id){
  return testKV(env).get(thoughtKey(id),{type:"json"});
}
async function putThought(env,t){
  await testKV(env).put(thoughtKey(t.id),JSON.stringify(t),{expirationTtl:15552000});
}
async function listThoughts(env,limit=50){
  const ids=await getThoughtIndex(env);
  const out=[];
  for(const id of ids){
    const t=await getThought(env,id);
    if(t)out.push(t);
  }
  out.sort((a,b)=>String(a.createdAt).localeCompare(String(b.createdAt)));
  return out.slice(-limit);
}
async function createThought(env,author,text,source){
  const t={
    id:thid(),author:author==="Mikael"?"Mikael":"Lizzy",
    text:String(text||"").slice(0,500),
    createdAt:new Date().toISOString(),
    source:String(source||"website").slice(0,60),
    reply:null
  };
  await putThought(env,t);
  const ids=await getThoughtIndex(env);ids.push(t.id);await putThoughtIndex(env,ids);
  if(t.author==="Lizzy"){
    await testKV(env).put(LAST_UNANSWERED_KEY,t.id);
    await tg(env,"sendMessage",{
      chat_id:env.TELEGRAM_CHAT_ID,
      text:`💭 LIZZY WONDERS...\n\n"${t.text}"\n\nReply with:\n/answer your reply here`
    });
  }else{
    await tg(env,"sendMessage",{
      chat_id:env.TELEGRAM_CHAT_ID,
      text:`💭 YOUR WONDER IS ON THE BOARD\n\n"${t.text}"\n\nIt'll show up for Lizzy to answer next time she opens the Thought Board.`
    });
  }
  return t;
}
async function answerThought(env,id,replyText,replyAuthor,source){
  const t=await getThought(env,id);
  if(!t)return null;
  if(t.reply)return t;
  t.reply={
    author:replyAuthor==="Mikael"?"Mikael":"Lizzy",
    text:String(replyText||"").slice(0,500),
    repliedAt:new Date().toISOString(),
    source:String(source||"website").slice(0,60)
  };
  await putThought(env,t);
  if(t.reply.author==="Lizzy"){
    await tg(env,"sendMessage",{
      chat_id:env.TELEGRAM_CHAT_ID,
      text:`💭 LIZZY ANSWERED YOUR WONDER\n\nYou wondered: "${t.text}"\n\nShe said: "${t.reply.text}"`
    });
  }else{
    await tg(env,"sendMessage",{
      chat_id:env.TELEGRAM_CHAT_ID,
      text:`💭 YOU ANSWERED LIZZY'S WONDER\n\nShe wondered: "${t.text}"\n\nYou said: "${t.reply.text}"`
    });
  }
  return t;
}
async function answerLatestUnansweredFromLizzy(env,replyText,source){
  const id=await testKV(env).get(LAST_UNANSWERED_KEY);
  if(!id)return null;
  const t=await answerThought(env,id,replyText,"Mikael",source);
  if(t)await testKV(env).delete(LAST_UNANSWERED_KEY);
  return t;
}

/* =========================================================
   🖤 MIKAEL HQ — LETTERS & CHESS (isolated 2-player build)
   KV binding: LIZZY_CLAIMS (existing)
   New secret: MIKAEL_HQ_KEY
   ========================================================= */
const HQ_KEY_HEADER="X-Mikael-HQ-Key";
const HQ_LETTER_INDEX="hq:letters:index:v1";
const HQ_MESSAGE_INDEX="hq:messages:index:v1";
const HQ_ACTIVITY_INDEX="hq:activity:index:v1";
const HQ_CHESS_KEY="hq:chess:v1";
const HQ_CHESS_HELP_INDEX="hq:chess:help:index:v1";
const HQ_LESSON_INDEX="hq:lizzylessons:index:v1";
const arrKV=async(env,key)=>{const x=await testKV(env).get(key,{type:"json"});return Array.isArray(x)?x:[]};
const saveArr=async(env,key,x)=>testKV(env).put(key,JSON.stringify(x.slice(-300)));
const hqAuth=(req,env,body=null)=>{
  const header=String(req.headers.get(HQ_KEY_HEADER)||"");
  const supplied=header||String(body?.hqKey||"");
  const expected=String(env?.MIKAEL_HQ_KEY||"");
  return !!(supplied&&expected&&supplied===expected);
};
const hqOnly=(req,env,body=null)=>hqAuth(req,env,body);
const hqId=p=>`hq:${p}:${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
async function hqActivity(env,type,text,meta={}){
 const item={id:hqId("activity"),type:String(type||"Activity").slice(0,100),text:String(text||"").slice(0,1200),meta,createdAt:new Date().toISOString()};
 const xs=await arrKV(env,HQ_ACTIVITY_INDEX);xs.push(item);await saveArr(env,HQ_ACTIVITY_INDEX,xs);return item;
}
async function hqLetters(env){const xs=await arrKV(env,HQ_LETTER_INDEX);return xs.sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));}
async function hqMessages(env){const xs=await arrKV(env,HQ_MESSAGE_INDEX);return xs.sort((a,b)=>String(a.createdAt).localeCompare(String(b.createdAt)));}
async function hqLessons(env){const xs=await arrKV(env,HQ_LESSON_INDEX);return xs.sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));}
const defaultChess=()=>({id:"chess-main",fen:"start",pgn:"",turn:"w",status:"active",lastMove:null,updatedAt:new Date().toISOString()});

/* ===== 😈 MIKAEL HQ REMOTE ANNOYANCE =====
   One pending effect at a time (a queue would just mean Lizzy gets
   buried instantly — not the goal). Lizzy's "STOP ANNOYING ME" button
   clears whatever's pending AND starts a real cooldown that HQ can see
   and honours, so it isn't a fake button. */
const ANNOY_PENDING_KEY="annoy:pending:v1";
const ANNOY_COOLDOWN_KEY="annoy:cooldown:v1";
const ANNOY_COOLDOWN_MINUTES=5;
const ANNOY_EFFECTS=[
  "button_move","infinite_loading","keyboard_chaos","mikael_appears",
  "attitude_meter","upside_down","screen_wobble","unskippable_ad",
  "did_you_know","petty_tax","airhorn","captcha_joke","eyes_follow",
  "balloon_pop","fake_update"
];
async function getAnnoyPending(env){
  return testKV(env).get(ANNOY_PENDING_KEY,{type:"json"});
}
async function getAnnoyCooldown(env){
  const c=await testKV(env).get(ANNOY_COOLDOWN_KEY,{type:"json"});
  if(c&&c.until&&new Date(c.until).getTime()>Date.now())return c;
  return null;
}

export default{async fetch(req,env){
 if(req.method==="OPTIONS")return json({ok:true});
 const u=new URL(req.url);

 if(req.method==="GET"){
   if(u.searchParams.get("action")==="coop_chess"){const state=await testKV(env).get(HQ_CHESS_KEY,{type:"json"})||defaultChess();return json({success:true,state});}
   if(u.searchParams.get("action")==="lizzy_messages"){const messages=await hqMessages(env);return json({success:true,messages:messages.filter(x=>x.status!=="handled").slice(-50)});}
   if(u.searchParams.get("action")==="mg_queue"){const commands=await arrKV(env,"mg:queue:v1");return json({success:true,commands});}
   if(u.searchParams.get("action")==="world_queue"){const commands=await arrKV(env,"world:queue:v1");return json({success:true,commands});}
   if(u.searchParams.get("action")==="annoy_state"){
     const pending=await getAnnoyPending(env);
     const cooldown=await getAnnoyCooldown(env);
     return json({success:true,pending:pending&&!pending.consumed?pending:null,cooldownUntil:cooldown?cooldown.until:null});
   }
   if(u.searchParams.get("mikaelTokens")==="1"){
     const state=await getMikaelTokenState(env);
     return json({success:true,state});
   }
   if(u.searchParams.get("pendingMickyDeposits")==="1"){
     const deposits=await listDeposits(env,true);
     return json({success:true,deposits,pendingCount:deposits.length,pendingTotal:deposits.reduce((s,x)=>s+Number(x.amount||0),0)});
   }
   if(u.searchParams.get("mickyDepositHistory")==="1"){
     const deposits=await listDeposits(env,false);
     return json({success:true,deposits});
   }
   if(u.searchParams.get("pendingLizzyMessages")==="1"){
     const messages=await listMessages(env,true);
     return json({success:true,messages,pendingCount:messages.length});
   }
   if(u.searchParams.get("mikaelMood")==="1"){
     const mood=await getMikaelMood(env);
     return json({success:true,mood:mood||null});
   }
   if(u.searchParams.get("thoughtBoard")==="1"){
     const thoughts=await listThoughts(env,50);
     return json({success:true,thoughts});
   }
   if(u.searchParams.get("lizzyLessons")==="1"){
     const lessons=await hqLessons(env);
     return json({success:true,lessons});
   }
   if(u.searchParams.get("pendingReverseRedemptions")==="1"){
     const ids=await getRedemptionIndex(env),items=[];
     for(const id of ids){
       const r=await testKV(env).get(`mikael:redemption:${id}`,{type:"json"});
       if(r&&!r.acknowledged)items.push(r);
     }
     return json({success:true,redemptions:items});
   }
   const shelfItem=u.searchParams.get("shelfItem");
   if(shelfItem){
     const state=await testKV(env).get(shelfStateKey(shelfItem),{type:"json"});
     return state?json({success:true,state}):json({success:false,error:"No negotiation yet"},404);
   }
   const claimId=u.searchParams.get("claimId");
   if(claimId){const c=await getClaim(env,claimId);return c?json({success:true,claim:c}):json({success:false,error:"Claim not found"},404);}
   return new Response("💗 LizzyOS Notification System: ONLINE",{headers:{"access-control-allow-origin":"*"}});
 }

 if(u.pathname==="/telegram"&&req.method==="POST"){
   const update=await req.json();
   if(update.callback_query){
     const q=update.callback_query,data=q.data||"",sep=data.indexOf(":");
     if(sep<0)return json({ok:true});
     const action=data.slice(0,sep),payload=data.slice(sep+1);
     await tg(env,"answerCallbackQuery",{callback_query_id:q.id});
     if(action==="moodset"){
       const opt=MIKAEL_MOOD_OPTIONS.find(([id])=>id===payload);
       if(opt){
         await setMikaelMood(env,opt[2],"telegram");
         await tg(env,"editMessageText",{chat_id:q.message.chat.id,message_id:q.message.message_id,text:`💗 Mood set: ${opt[1]}\n\nLizzy's Today's Connection screen will show this.`});
       }
       return json({ok:true});
     }
     const claimId=payload,c=await getClaim(env,claimId);
     if(!c)return json({ok:true});
     if(action==="accept"){
       c.status="accepted";c.acceptedPrice=Number(c.offer||0);c.decidedAt=new Date().toISOString();await putClaim(env,c);await putShelfState(env,c);
       await tg(env,"editMessageText",{chat_id:q.message.chat.id,message_id:q.message.message_id,text:`${q.message.text}\n\n━━━━━━━━━━━━━━\n✅ ACCEPTED BY MIKAEL`});
     }else if(action==="reject"){
       c.status="rejected";c.decidedAt=new Date().toISOString();await putClaim(env,c);await putShelfState(env,c);
       await tg(env,"editMessageText",{chat_id:q.message.chat.id,message_id:q.message.message_id,text:`${q.message.text}\n\n━━━━━━━━━━━━━━\n❌ REJECTED BY MIKAEL`});
     }else if(action==="counter"){
       await testKV(env).put(`counter_wait:${q.message.chat.id}`,claimId,{expirationTtl:600});
       await tg(env,"sendMessage",{chat_id:q.message.chat.id,text:`💬 COUNTER OFFER\n\nItem: ${c.item}\nLizzy offered: ${c.offer} MB\n\nReply with your counter amount only. Example: 15`});
     }
     return json({ok:true});
   }
   if(update.message?.text){
     const chat=String(update.message.chat.id),txt=update.message.text.trim();

     // /deposit <amount> [note]  — create a claimable deposit straight from Telegram.
     const dep=txt.match(/^\/deposit(?:@\w+)?\s+(\d+)\s*(.*)$/i);
     if(dep){
       const r=await createDeposit(env,dep[1],dep[2],"telegram");
       await tg(env,"sendMessage",{chat_id:chat,text:`✅ Deposit queued: ${r.deposit.amount} MB\nWaiting for Lizzy to claim it.\nPending total: ${r.pendingTotal} MB`});
       return json({ok:true});
     }
     if(/^\/deposits?(?:@\w+)?$/i.test(txt)){
       const pending=await listDeposits(env,true);
       const total=pending.reduce((s,x)=>s+Number(x.amount||0),0);
       await tg(env,"sendMessage",{chat_id:chat,text:pending.length
         ?`⏳ UNCLAIMED DEPOSITS (${pending.length})\n\n${pending.map(d=>`• ${d.amount} MB${d.note?` — ${d.note}`:""}`).join("\n")}\n\nTotal: ${total} MB`
         :"✅ No unclaimed deposits. Lizzy has claimed everything."});
       return json({ok:true});
     }

     // /tolizzy <text> — send a message that shows up on her screen.
     const toL=txt.match(/^\/tolizzy(?:@\w+)?\s+([\s\S]+)$/i);
     if(toL){
       await createMessage(env,toL[1],"telegram");
       return json({ok:true});
     }
     // /miss — quick one-tap "missing you" message, no typing required.
     if(/^\/miss(?:@\w+)?$/i.test(txt)){
       await createMessage(env,"Mikael is missing you right now 💗","telegram");
       return json({ok:true});
     }
     // /mood — button menu of quick moods. /mymood <text> still works for freeform.
     if(/^\/mood(?:@\w+)?$/i.test(txt)){
       const rows=[];
       for(let i=0;i<MIKAEL_MOOD_OPTIONS.length;i+=2){
         rows.push(MIKAEL_MOOD_OPTIONS.slice(i,i+2).map(([id,label])=>({text:label,callback_data:`moodset:${id}`})));
       }
       await tg(env,"sendMessage",{chat_id:chat,text:"💗 Pick your mood, or use /mymood <text> to write your own:",reply_markup:{inline_keyboard:rows}});
       return json({ok:true});
     }
     // /mymood <text> — set Mikael's current mood for the Today's Connection screen.
     const mood=txt.match(/^\/mymood(?:@\w+)?\s+([\s\S]+)$/i);
     if(mood){
       await setMikaelMood(env,mood[1],"telegram");
       return json({ok:true});
     }
     // /wonder <text> — post a new thought to the shared "I Wonder If..." board.
     const wonder=txt.match(/^\/wonder(?:@\w+)?\s+([\s\S]+)$/i);
     if(wonder){
       await createThought(env,"Mikael",wonder[1],"telegram");
       return json({ok:true});
     }
     // /answer <text> — answer Lizzy's most recent unanswered wonder.
     const answer=txt.match(/^\/answer(?:@\w+)?\s+([\s\S]+)$/i);
     if(answer){
       const t=await answerLatestUnansweredFromLizzy(env,answer[1],"telegram");
       if(!t){
         await tg(env,"sendMessage",{chat_id:chat,text:"There's nothing waiting for an answer right now. 💭"});
       }
       return json({ok:true});
     }
     // /token <search> — fuzzy-find a Reverse Token by name and grant it straight
     // into Mikael's live inventory, no app needed. Example: /token nice photo
     const tokenCmd=txt.match(/^\/token(?:@\w+)?\s+([\s\S]+)$/i);
     if(tokenCmd){
       const hit=findMikaelToken(tokenCmd[1]);
       if(!hit){
         await tg(env,"sendMessage",{chat_id:chat,text:`❌ No Reverse Token matches "${tokenCmd[1].trim()}".\nTry a shorter search, e.g. /token photo`});
         return json({ok:true});
       }
       const [emoji,name,desc]=hit;
       const {count}=await awardMikaelToken(env,name,emoji,desc,"Telegram /token");
       await tg(env,"sendMessage",{chat_id:chat,text:`🔄 TOKEN GRANTED\n\n${emoji} ${name}\n${desc}\n\nYou now have ×${count} of this one. Redeem it anytime from your Token Control.`});
       return json({ok:true});
     }
     // /tokens — list the full Reverse Token catalog so you know what to search for.
     if(/^\/tokens(?:@\w+)?$/i.test(txt)){
       const lines=MIKAEL_TOKEN_CATALOG.map(([emoji,name])=>`${emoji} ${name.replace(/^Reverse Token\s*—\s*/i,"")}`);
       await tg(env,"sendMessage",{chat_id:chat,text:`🔄 REVERSE TOKEN CATALOG\n\n${lines.join("\n")}\n\nGrant one with /token <search>`});
       return json({ok:true});
     }

     const claimId=await testKV(env).get(`counter_wait:${chat}`);
     if(claimId){
       const amount=Math.floor(Number(update.message.text.trim()));
       if(!Number.isFinite(amount)||amount<1){await tg(env,"sendMessage",{chat_id:chat,text:"❌ Send only the MB amount. Example: 15"});return json({ok:true});}
       const c=await getClaim(env,claimId);
       if(c){c.status="countered";c.counterOffer=amount;c.decidedAt=new Date().toISOString();await putClaim(env,c);await putShelfState(env,c);}
       await testKV(env).delete(`counter_wait:${chat}`);
       await tg(env,"sendMessage",{chat_id:chat,text:`💬 COUNTER RECORDED\n\nItem: ${c?.item||"Secret Shelf Item"}\nMikael's counter: ${amount} MB`});
     }
     return json({ok:true});
   }
   return json({ok:true});
 }

 if(req.method!=="POST")return json({error:"Method not allowed"},405);
 const b=await req.json();
/* =========================================================
   COMPLETE LIZZYOS TELEGRAM NOTIFICATION ROUTER
   ========================================================= */

const S=(v,max=1800)=>String(v??"").trim().slice(0,max);
const N=(v,d=0)=>Number.isFinite(Number(v))?Math.floor(Number(v)):d;
const eventType=String(b?.type||"").trim();

/* --- MONEY + BALANCE ENRICHMENT ---------------------------------
   Older parts of the website only send a human-readable "details"
   string. Pull the amount and the wallet balance out of that text so
   every notification below can always show the money involved and the
   balance remaining. Explicit fields always win. */
{
  const blob=`${b?.details??""}\n${b?.message??""}`;
  const grab=re=>{const m=blob.match(re);return m?Math.floor(Number(m[1])):null};
  if(b.balance==null){
    const v=grab(/(?:new\s+|remaining\s+|current\s+)?balance[^0-9+-]{0,20}([+-]?\d+)/i);
    if(v!=null)b.balance=v;
  }
  if(b.amount==null&&b.reward==null&&b.earned==null&&b.price==null&&b.cost==null&&b.paid==null){
    const v=grab(/(?:earned|received|paid|cost|price|amount|claimed)[^0-9+-]{0,20}([+-]?\d+)/i);
    if(v!=null)b.amount=v;
  }
}


/* =========================================================
   🖤 MIKAEL HQ — LETTERS & CHESS ACTIONS (isolated build)
   Lizzy side (no key): submit_letter, lizzy_message_seen,
                        lizzy_chess_move, lizzy_chess_help
   Mikael HQ side (needs MIKAEL_HQ_KEY): hq_letters, reply_letter,
                        chess_state, chess_move, chess_reset,
                        resolve_chess_help, send_chess_hint
   ========================================================= */
if(b.action==="hq_letters"){
  if(!hqOnly(req,env,b))return json({success:false,error:"Unauthorized"},401);
  return json({success:true,letters:await hqLetters(env)});
}
if(b.action==="chess_state"){
  if(!hqOnly(req,env,b))return json({success:false,error:"Unauthorized"},401);
  const state=await testKV(env).get(HQ_CHESS_KEY,{type:"json"})||defaultChess();
  const ids=await arrKV(env,HQ_CHESS_HELP_INDEX),requests=[];
  for(const x of ids){const r=await testKV(env).get(`hq:chesshelp:${x}`,{type:"json"});if(r&&r.status==="open")requests.push(r);}
  return json({success:true,state,requests});
}
if(b.action==="submit_letter"){
  const text=S(b.text,4000),subject=S(b.subject||"A letter for Mikael",120),from=S(b.from||"Lizzy",60);
  if(!text)return json({success:false,error:"Letter is empty"},400);
  const letter={id:hqId("letter"),subject,text,from,status:"unread",reply:null,createdAt:new Date().toISOString()};
  const xs=await hqLetters(env);xs.push(letter);await saveArr(env,HQ_LETTER_INDEX,xs);
  await hqActivity(env,"💌 New Letter",`Lizzy sent a letter: ${subject}`,{letterId:letter.id});
  await tg(env,"sendMessage",{chat_id:env.TELEGRAM_CHAT_ID,text:`💌 NEW LETTER FROM LIZZY\n\n${subject}\n\n${text.slice(0,1800)}\n\nOpen Mikael HQ to reply.`}).catch(()=>{});
  return json({success:true,letter});
}
if(b.action==="reply_letter"){
  if(!hqOnly(req,env,b))return json({success:false,error:"Unauthorized"},401);
  const lid=S(b.id,120),reply=S(b.reply,4000),xs=await hqLetters(env),l=xs.find(x=>x.id===lid);
  if(!l)return json({success:false,error:"Letter not found"},404);
  l.reply=reply;l.status="replied";l.repliedAt=new Date().toISOString();
  await saveArr(env,HQ_LETTER_INDEX,xs);
  const msgs=await hqMessages(env);
  msgs.push({id:hqId("message"),kind:"letter_reply",text:`💌 Mikael replied to your letter "${l.subject}":\n\n${reply}`,status:"pending",createdAt:new Date().toISOString(),letterId:lid});
  await saveArr(env,HQ_MESSAGE_INDEX,msgs);
  await hqActivity(env,"🖤 Letter Reply",`Mikael replied to ${l.subject}`,{letterId:lid});
  return json({success:true,letter:l});
}
if(b.action==="submit_lizzy_lesson"){
  const text=S(b.text,600);
  if(!text)return json({success:false,error:"Lesson is empty"},400);
  const lesson={id:hqId("lesson"),text,rating:null,note:null,status:"unrated",createdAt:new Date().toISOString(),ratedAt:null};
  const xs=await hqLessons(env);xs.push(lesson);await saveArr(env,HQ_LESSON_INDEX,xs);
  await hqActivity(env,"🧠 New Lizzy Life Lesson",text,{lessonId:lesson.id});
  await tg(env,"sendMessage",{chat_id:env.TELEGRAM_CHAT_ID,text:`🧠 NEW LIFE LESSON FROM LIZZY\n\n"${text}"\n\nOpen Mikael HQ to rate it.`}).catch(()=>{});
  return json({success:true,lesson});
}
if(b.action==="hq_lizzy_lessons"){
  if(!hqOnly(req,env,b))return json({success:false,error:"Unauthorized"},401);
  return json({success:true,lessons:await hqLessons(env)});
}
if(b.action==="rate_lizzy_lesson"){
  if(!hqOnly(req,env,b))return json({success:false,error:"Unauthorized"},401);
  const lid=S(b.id,120),rating=S(b.rating,20),note=S(b.note||"",400);
  if(!["helpful","useless"].includes(rating))return json({success:false,error:"Invalid rating"},400);
  const xs=await hqLessons(env),l=xs.find(x=>x.id===lid);
  if(!l)return json({success:false,error:"Lesson not found"},404);
  l.rating=rating;l.note=note||null;l.status="rated";l.ratedAt=new Date().toISOString();
  await saveArr(env,HQ_LESSON_INDEX,xs);
  const label=rating==="helpful"?"👍 Helpful":"👎 Absolutely Useless";
  const msgs=await hqMessages(env);
  msgs.push({id:hqId("message"),kind:"lesson_rating",text:`🧠 Mikael rated your life lesson "${l.text}":\n\n${label}${note?`\n"${note}"`:""}`,status:"pending",createdAt:new Date().toISOString(),lessonId:lid});
  await saveArr(env,HQ_MESSAGE_INDEX,msgs);
  await hqActivity(env,"🧠 Lesson Rated",`Mikael rated "${l.text}" — ${label}`,{lessonId:lid});
  return json({success:true,lesson:l});
}
if(b.action==="clear_lizzy_lessons"){
  if(!hqOnly(req,env,b))return json({success:false,error:"Unauthorized"},401);
  await saveArr(env,HQ_LESSON_INDEX,[]);
  await hqActivity(env,"🧹 Lessons Cleared","All Lizzy Life Lessons were cleared from HQ.");
  return json({success:true});
}
if(b.action==="clear_letters"){
  if(!hqOnly(req,env,b))return json({success:false,error:"Unauthorized"},401);
  await saveArr(env,HQ_LETTER_INDEX,[]);
  await hqActivity(env,"🧹 Letters Cleared","All letters were cleared from HQ.");
  return json({success:true});
}
if(b.action==="lizzy_message_seen"){
  const xs=await hqMessages(env),m=xs.find(x=>x.id===S(b.id,120));
  if(m)m.status="seen";
  await saveArr(env,HQ_MESSAGE_INDEX,xs);
  return json({success:true});
}
if(b.action==="lizzy_chess_move"){
  const current=await testKV(env).get(HQ_CHESS_KEY,{type:"json"})||defaultChess();
  if(current.fen&&current.fen!=="start"&&current.turn&&current.turn!=="w")return json({success:false,error:"It's not your turn yet"},409);
  const state={id:"chess-main",fen:S(b.fen,200),pgn:S(b.pgn,8000),turn:S(b.turn,1)||"b",status:"active",lastMove:S(b.lastMove,30),updatedAt:new Date().toISOString()};
  await testKV(env).put(HQ_CHESS_KEY,JSON.stringify(state));
  await hqActivity(env,"♟️ Chess Move",`Lizzy played ${state.lastMove||"a move"}.`,{fen:state.fen});
  await tg(env,"sendMessage",{chat_id:env.TELEGRAM_CHAT_ID,text:`♟️ Lizzy played ${state.lastMove||"a move"} in Our World. Your turn.`}).catch(()=>{});
  return json({success:true,state});
}
if(b.action==="chess_move"){
  if(!hqOnly(req,env,b))return json({success:false,error:"Unauthorized"},401);
  const state={id:"chess-main",fen:S(b.fen,200),pgn:S(b.pgn,8000),turn:S(b.turn,1)||"w",status:"active",lastMove:S(b.lastMove,30),updatedAt:new Date().toISOString()};
  await testKV(env).put(HQ_CHESS_KEY,JSON.stringify(state));
  await hqActivity(env,"♟️ Chess Move",`Mikael played ${state.lastMove||"a move"}.`,{fen:state.fen});
  return json({success:true,state});
}
if(b.action==="chess_reset"){
  if(!hqOnly(req,env,b))return json({success:false,error:"Unauthorized"},401);
  const state=defaultChess();
  await testKV(env).put(HQ_CHESS_KEY,JSON.stringify(state));
  await saveArr(env,HQ_CHESS_HELP_INDEX,[]);
  await hqActivity(env,"♟️ Chess Reset","A new co-op chess game was started.");
  return json({success:true,state});
}
if(b.action==="lizzy_chess_help"){
  const text=S(b.text,500);
  if(!text)return json({success:false,error:"Request empty"},400);
  const r={id:hqId("help"),text,status:"open",createdAt:new Date().toISOString()};
  await testKV(env).put(`hq:chesshelp:${r.id}`,JSON.stringify(r),{expirationTtl:86400});
  const ids=await arrKV(env,HQ_CHESS_HELP_INDEX);ids.push(r.id);await saveArr(env,HQ_CHESS_HELP_INDEX,ids);
  await hqActivity(env,"♟️ Chess Help",`Lizzy asked: ${text}`,{requestId:r.id});
  await tg(env,"sendMessage",{chat_id:env.TELEGRAM_CHAT_ID,text:`♟️ LIZZY NEEDS CHESS HELP\n\n${text}`}).catch(()=>{});
  return json({success:true,request:r});
}
if(b.action==="resolve_chess_help"){
  if(!hqOnly(req,env,b))return json({success:false,error:"Unauthorized"},401);
  const lid=S(b.id,120),r=await testKV(env).get(`hq:chesshelp:${lid}`,{type:"json"});
  if(r){r.status="handled";await testKV(env).put(`hq:chesshelp:${lid}`,JSON.stringify(r),{expirationTtl:86400});}
  return json({success:true});
}
if(b.action==="send_chess_hint"){
  if(!hqOnly(req,env,b))return json({success:false,error:"Unauthorized"},401);
  const text=S(b.text,1000);
  if(!text)return json({success:false,error:"Hint empty"},400);
  const m={id:hqId("message"),kind:"message",text:`🎓 Mikael's chess tip: ${text}`,status:"pending",createdAt:new Date().toISOString()};
  const xs=await hqMessages(env);xs.push(m);await saveArr(env,HQ_MESSAGE_INDEX,xs);
  await hqActivity(env,"🎓 Chess Hint","Mikael sent Lizzy a chess tip.");
  return json({success:true});
}

/* =========================================================
   😈 MIKAEL HQ REMOTE ANNOYANCE
   ========================================================= */
/* ---- MizzyGram HQ bridge: HQ pushes commands, Lizzy's MizzyGram polls + acks ---- */
if((b.action||b.type)==="mg_hq_push"){
  if(!hqOnly(req,env,b))return json({success:false,error:"Unauthorized"},401);
  const c=b.command||{};
  if(!["post","like","react","comment","reply","pin","event"].includes(c.kind))return json({success:false,error:"Unknown command"},400);
  if(String(c.image||"").length>700000)return json({success:false,error:"Image too large"},400);
  const q=await arrKV(env,"mg:queue:v1");
  q.push({...c,id:crypto.randomUUID(),createdAt:new Date().toISOString()});
  await testKV(env).put("mg:queue:v1",JSON.stringify(q.slice(-30)));
  return json({success:true});
}
if((b.action||b.type)==="mg_ack"){
  const ids=Array.isArray(b.ids)?b.ids:[];
  const q=(await arrKV(env,"mg:queue:v1")).filter(c=>!ids.includes(c.id));
  await testKV(env).put("mg:queue:v1",JSON.stringify(q));
  return json({success:true});
}
if((b.action||b.type)==="mg_snapshot_put"){
  if(JSON.stringify(b.snapshot||{}).length>200000)return json({success:false,error:"Too large"},400);
  await testKV(env).put("mg:snapshot:v1",JSON.stringify(b.snapshot||{}));
  return json({success:true});
}
if((b.action||b.type)==="mg_snapshot_get"){
  if(!hqOnly(req,env,b))return json({success:false,error:"Unauthorized"},401);
  return json({success:true,snapshot:await testKV(env).get("mg:snapshot:v1",{type:"json"})});
}
/* ---- The Internet: fictional market + purchased entertainment bridge ---- */
if((b.action||b.type)==="world_hq_push"){
  if(!hqOnly(req,env,b))return json({success:false,error:"Unauthorized"},401);
  const c=b.command||{};
  if(c.kind!=="market")return json({success:false,error:"Unknown world command"},400);
  const allowed=["pump","drop","crash","rally","recover","gradual_rise","gradual_decline","freeze","unfreeze","set_mode"];
  if(!allowed.includes(String(c.action||"")))return json({success:false,error:"Unknown market action"},400);
  const q=await arrKV(env,"world:queue:v1");
  q.push({...c,id:crypto.randomUUID(),createdAt:new Date().toISOString()});
  await testKV(env).put("world:queue:v1",JSON.stringify(q.slice(-40)));
  return json({success:true});
}
if((b.action||b.type)==="world_ack"){
  const ids=Array.isArray(b.ids)?b.ids:[];
  const q=(await arrKV(env,"world:queue:v1")).filter(c=>!ids.includes(c.id));
  await testKV(env).put("world:queue:v1",JSON.stringify(q));
  return json({success:true});
}
if((b.action||b.type)==="world_snapshot_put"){
  const raw=JSON.stringify(b.snapshot||{});if(raw.length>350000)return json({success:false,error:"Snapshot too large"},400);
  await testKV(env).put("world:snapshot:v1",raw);return json({success:true});
}
if((b.action||b.type)==="world_snapshot_get"){
  if(!hqOnly(req,env,b))return json({success:false,error:"Unauthorized"},401);
  return json({success:true,snapshot:await testKV(env).get("world:snapshot:v1",{type:"json"})});
}
if((b.action||b.type)==="world_media_put"){
  if(!hqOnly(req,env,b))return json({success:false,error:"Unauthorized"},401);
  const purchaseId=S(b.purchaseId,180),media=b.media||{},data=String(media.data||"");
  if(!purchaseId||!data)return json({success:false,error:"Purchase and media are required"},400);
  if(data.length>23000000)return json({success:false,error:"Entertainment upload is too large. Keep the original file under 16 MB."},400);
  const snap=await testKV(env).get("world:snapshot:v1",{type:"json"});
  if(!snap||!Array.isArray(snap.purchases)||!snap.purchases.some(p=>p.id===purchaseId))return json({success:false,error:"That ticket purchase is not synced from LizzyOS yet."},409);
  const mediaId=crypto.randomUUID();
  const stored={data,mediaType:S(media.mediaType,20),mime:S(media.mime,120),name:S(media.name,180),size:Number(media.size)||0,createdAt:new Date().toISOString()};
  await testKV(env).put(`world:media:${mediaId}`,JSON.stringify(stored),{expirationTtl:30*86400});
  const q=await arrKV(env,"world:queue:v1");q.push({kind:"ent_delivery",id:crypto.randomUUID(),purchaseId,mediaId,createdAt:new Date().toISOString()});
  await testKV(env).put("world:queue:v1",JSON.stringify(q.slice(-40)));
  return json({success:true,mediaId});
}
if((b.action||b.type)==="world_media_get"){
  const mediaId=S(b.mediaId,180);if(!mediaId)return json({success:false,error:"Missing media id"},400);
  return json({success:true,media:await testKV(env).get(`world:media:${mediaId}`,{type:"json"})});
}
if((b.action||b.type)==="world_media_delete"){
  const mediaId=S(b.mediaId,180);if(mediaId)await testKV(env).delete(`world:media:${mediaId}`);return json({success:true});
}

if((b.action||b.type)==="annoy_trigger"){
  if(!hqOnly(req,env,b))return json({success:false,error:"Unauthorized"},401);
  const cooldown=await getAnnoyCooldown(env);
  if(cooldown)return json({success:false,cooldown:true,until:cooldown.until});
  let effect=String(b.effect||"").trim();
  if(!effect||effect==="random")effect=ANNOY_EFFECTS[Math.floor(Math.random()*ANNOY_EFFECTS.length)];
  if(!ANNOY_EFFECTS.includes(effect))return json({success:false,error:"Unknown effect"},400);
  const pending={effect,createdAt:new Date().toISOString(),consumed:false};
  await testKV(env).put(ANNOY_PENDING_KEY,JSON.stringify(pending));
  await tg(env,"sendMessage",{chat_id:env.TELEGRAM_CHAT_ID,text:`😈 SENT LIZZY: ${effect.replace(/_/g," ")}`}).catch(()=>{});
  return json({success:true,effect});
}
if((b.action||b.type)==="annoy_consume"){
  const pending=await getAnnoyPending(env);
  if(pending&&!pending.consumed){
    pending.consumed=true;
    await testKV(env).put(ANNOY_PENDING_KEY,JSON.stringify(pending));
  }
  return json({success:true});
}
if((b.action||b.type)==="annoy_reset"){
  if(!hqOnly(req,env,b))return json({success:false,error:"Unauthorized"},401);
  await testKV(env).delete(ANNOY_COOLDOWN_KEY);
  await testKV(env).delete(ANNOY_PENDING_KEY);
  return json({success:true,cooldownUntil:null});
}
if((b.action||b.type)==="annoy_stop"){
  await testKV(env).delete(ANNOY_PENDING_KEY);
  const until=new Date(Date.now()+ANNOY_COOLDOWN_MINUTES*60000).toISOString();
  await testKV(env).put(ANNOY_COOLDOWN_KEY,JSON.stringify({until}));
  await tg(env,"sendMessage",{chat_id:env.TELEGRAM_CHAT_ID,text:`😤 LIZZY HIT "STOP ANNOYING ME"\n\nNo more annoyances until ${until}.`}).catch(()=>{});
  return json({success:true,cooldownUntil:until});
}

async function notifyTelegram(text,type=eventType,reply_markup=null){
  const payload={
    chat_id:env.TELEGRAM_CHAT_ID,
    text:String(text).slice(0,3900)
  };
  if(reply_markup)payload.reply_markup=reply_markup;
  const sent=await tg(env,"sendMessage",payload);

  return json({
    success:true,
    type,
    telegram:!!sent?.ok
  });
}


/* =========================================================
   🎮 GAME RESULTS
   ========================================================= */

if(eventType==="game_result"){
  const game=S(b.game||b.title||"Game",500);
  const result=S(b.result||b.status||"",500);
  const details=S(b.details||"",1800);

  return notifyTelegram(
`🎮 LIZZYOS GAME RESULT

🎯 Game: ${game}
🏁 Result: ${result}${details?`\n\n${details}`:""}`,
    "game_result"
  );
}


/* =========================================================
   🧠 LIFE LESSONS
   ========================================================= */

if(
  eventType==="🧠 LIFE LESSON VOTE" ||
  eventType==="life_lesson_vote" ||
  eventType==="life_lesson_review"
){
  const lesson=S(
    b.title||
    b.lesson||
    "Life Lesson",
    700
  );

  const verdict=S(
    b.vote||
    b.rating||
    b.verdict||
    b.response||
    b.status||
    "",
    300
  );

  const details=S(
    b.details||
    b.reason||
    b.comment||
    "",
    1500
  );

  let decision="🗳️ VOTE RECORDED";

  if(/useful|helpful/i.test(verdict)){
    decision="💚 USEFUL / HELPFUL";
  }

  if(/useless|not useful/i.test(verdict)){
    decision="💀 USELESS / NOT HELPFUL";
  }

  return notifyTelegram(
`🧠 LIFE LESSON REVIEW

📚 Lesson:
"${lesson}"

${decision}${details?`\n\n💬 ${details}`:""}`,
    "life_lesson_vote"
  );
}


/* =========================================================
   ✨ LIZZY ASSISTANT
   ========================================================= */

if(
  eventType==="assistant_activity" ||
  eventType==="assistant_question" ||
  eventType==="assistant_response"
){
  const question=S(
    b.question||
    b.prompt||
    "",
    900
  );

  const answer=S(
    b.answer||
    b.response||
    b.reply||
    "",
    2200
  );

  return notifyTelegram(
`✨ LIZZY ASSISTANT ACTIVITY

👤 Lizzy asked:
"${question||"Question recorded"}"

🤖 LizzyOS responded:
"${answer||"Response recorded"}"`,
    "assistant_activity"
  );
}


/* =========================================================
   💌 LETTER PURCHASED
   ========================================================= */

if(
  eventType==="letter_purchased" ||
  eventType==="secret_shelf_letter_purchased" ||
  eventType==="💌 LETTER PURCHASED"
){
  const letter=S(
    b.letter||
    b.title||
    b.item||
    b.name||
    "Open When Letter",
    700
  );

  const paid=N(
    b.paid||
    b.price||
    b.cost||
    b.amount,
    0
  );

  const balance=
    b.balance!=null
      ? N(b.balance)
      : null;

  return notifyTelegram(
`💌 LETTER PURCHASED

🛒 ${letter}

💸 Paid:
${paid} MB
${balance!=null?`🏦 Balance after purchase:\n${balance} MB`:""}

Lizzy has purchased one of the letters. Not opened yet.`,
    "letter_purchased"
  );
}


/* =========================================================
   💌 LETTERS OPENED
   ========================================================= */

if(
  eventType==="letter_opened" ||
  eventType==="open_when_opened" ||
  eventType==="open_when_letter_opened" ||
  eventType==="secret_shelf_letter_opened" ||
  eventType==="💌 LETTER OPENED" ||
  eventType==="💌 OPEN WHEN LETTER OPENED"
){
  const letter=S(
    b.letter||
    b.title||
    b.name||
    "Open When Letter",
    700
  );

  const folder=S(
    b.category||
    b.folder||
    b.kind||
    "",
    300
  );

  return notifyTelegram(
`💌 LETTER OPENED

📖 ${letter}
${folder?`📂 ${folder}`:""}

Lizzy has opened one of the letters.`,
    "letter_opened"
  );
}


/* =========================================================
   🛍️ PURCHASES
   ========================================================= */

if(
  eventType==="purchase" ||
  eventType==="purchase_completed" ||
  eventType==="store_purchase" ||
  eventType==="🛍️ SEED STORE PURCHASE" ||
  eventType==="🛍️ STORE EXTRA PURCHASE"
){
  const item=S(
    b.item||
    b.title||
    b.name||
    "Purchase",
    700
  );

  const cost=N(
    b.cost||
    b.price||
    b.paid||
    b.amount,
    0
  );

  const balance=
    b.balance!=null
      ? N(b.balance)
      : null;

  const details=S(
    b.details||"",
    1400
  );

  return notifyTelegram(
`🛍️ LIZZYOS PURCHASE

🛒 Item:
${item}

💸 Paid:
${cost} MB
${balance!=null?`🏦 Balance after purchase:\n${balance} MB`:""}${details?`\n\n${details}`:""}`,
    "purchase"
  );
}


/* =========================================================
   🔐 SECRET SHELF PURCHASE
   ========================================================= */

if(
  eventType==="secret_shelf_purchase" ||
  eventType==="secret_shelf_purchase_completed"
){
  const item=S(
    b.item||
    b.title||
    "Secret Shelf Item",
    700
  );

  const kind=S(
    b.kind||
    b.typeName||
    "Unknown",
    200
  );

  const paid=N(
    b.paid||
    b.price||
    b.amount,
    0
  );

  const balance=
    b.balance!=null
      ? N(b.balance)
      : null;

  return notifyTelegram(
`🔐 SECRET SHELF PURCHASE COMPLETED

📦 Item:
${item}

🏷️ Type:
${kind}

💸 Paid:
${paid} MB
${balance!=null?`🏦 Balance:\n${balance} MB`:""}

🎁 Item has been granted to Lizzy.`,
    "secret_shelf_purchase"
  );
}


/* =========================================================
   💰 BIDS / OFFERS
   ========================================================= */

if(
  eventType==="secret_shelf_bid" ||
  eventType==="vault_bid" ||
  eventType==="bid" ||
  eventType==="offer" ||
  eventType==="offer_created" ||
  eventType==="new_offer" ||
  eventType==="secret_shelf_offer"
){
  const item=S(
    b.item||
    b.title||
    b.itemName||
    "Item",
    700
  );

  const amount=N(
    b.offer||
    b.bid||
    b.amount||
    b.price,
    0
  );

  const isVault=eventType==="vault_bid";

  const type=
    isVault
      ? "🎰 VAULT BID"
      : "💌 NEW OFFER / BID";

  // Persist the bid as a claim so the Telegram buttons can act on it
  const c={
    claimId:id(),
    type:isVault?"vault_bid":"secret_shelf_bid",
    item,
    itemId:S(b.itemId||b.item_id||b.id||(isVault?"vault":""),200)||null,
    offer:amount,
    status:"pending",
    counterOffer:null,
    lizzyOpened:false,
    createdAt:new Date().toISOString()
  };
  await putClaim(env,c);
  await putShelfState(env,c);

  return notifyTelegram(
`${type}

📦 Item:
${item}

💰 Lizzy offered:
${amount} MB

⏳ Status:
PENDING

Claim ID:
${c.claimId}`,
    "bid_or_offer",
    {inline_keyboard:[
      [
        {text:isVault?"🎰 ACCEPT VAULT":"✅ ACCEPT",callback_data:`accept:${c.claimId}`},
        {text:"❌ REJECT",callback_data:`reject:${c.claimId}`}
      ],
      [
        {text:"💬 COUNTER",callback_data:`counter:${c.claimId}`}
      ]
    ]}
  );
}


/* =========================================================
   💬 COUNTER OFFERS
   ========================================================= */

if(
  eventType==="counter_offer" ||
  eventType==="countered"
){
  const item=S(
    b.item||
    b.title||
    "Item",
    700
  );

  const original=N(
    b.originalOffer||
    b.offer||
    b.previousOffer,
    0
  );

  const counter=N(
    b.counterOffer||
    b.amount||
    b.price,
    0
  );

  return notifyTelegram(
`💬 COUNTER OFFER

📦 Item:
${item}

💌 Lizzy's offer:
${original} MB

🧠 Mikael's counter offer:
${counter} MB`,
    "counter_offer"
  );
}


/* =========================================================
   ✅ ACCEPTED OFFERS
   ========================================================= */

if(
  eventType==="offer_accepted" ||
  eventType==="bid_accepted" ||
  eventType==="secret_shelf_offer_accepted"
){
  const item=S(
    b.item||
    b.title||
    "Item",
    700
  );

  const price=N(
    b.acceptedPrice||
    b.price||
    b.offer||
    b.amount,
    0
  );

  return notifyTelegram(
`✅ OFFER ACCEPTED

📦 Item:
${item}

💰 Accepted price:
${price} MB

🎁 Status:
Accepted and ready for fulfilment.`,
    "offer_accepted"
  );
}


/* =========================================================
   ❌ REJECTED OFFERS
   ========================================================= */

if(
  eventType==="offer_rejected" ||
  eventType==="bid_rejected"
){
  const item=S(
    b.item||
    b.title||
    "Item",
    700
  );

  const offer=N(
    b.offer||
    b.bid||
    b.amount,
    0
  );

  return notifyTelegram(
`❌ OFFER REJECTED

📦 Item:
${item}

💰 Lizzy offered:
${offer} MB`,
    "offer_rejected"
  );
}


/* =========================================================
   💼 TASKS / JOBS
   ========================================================= */

if(
  eventType==="task_completed" ||
  eventType==="task_reward" ||
  eventType==="job_completed" ||
  eventType==="💼 MICKY BUCS JOB COMPLETED"
){
  const task=S(
    b.task||
    b.title||
    b.name||
    "Task",
    700
  );

  const earned=N(
    b.reward||
    b.earned||
    b.amount||
    b.payment,
    0
  );

  const balance=
    b.balance!=null
      ? N(b.balance)
      : null;

  return notifyTelegram(
`💼 MICKY BUCS TASK COMPLETED

✅ Task:
${task}

💰 Money received:
+${earned} MB
${balance!=null?`🏦 New balance:\n${balance} MB`:""}`,
    "task_completed"
  );
}


/* =========================================================
   💵 DAILY PAYMENT
   ========================================================= */

if(
  eventType==="💵 DAILY MICKY BUCS" ||
  eventType==="daily_allowance" ||
  eventType==="daily_reward"
){
  const amount=N(
    b.amount||
    b.reward||
    b.earned,
    0
  );

  const balance=
    b.balance!=null
      ? N(b.balance)
      : null;

  return notifyTelegram(
`💵 MICKY BUCS PAYMENT

💰 Received:
+${amount} MB
${balance!=null?`🏦 Balance:\n${balance} MB`:""}`,
    "daily_reward"
  );
}


/* =========================================================
   🏆 ACHIEVEMENTS
   ========================================================= */

if(
  eventType==="🏆 ACHIEVEMENT UNLOCKED" ||
  eventType==="achievement_unlocked" ||
  eventType==="achievement_reward"
){
  const achievement=S(
    b.title||
    b.achievement||
    "Achievement",
    700
  );

  const reward=N(
    b.reward||
    b.amount||
    b.payment,
    0
  );

  const balance=
    b.balance!=null
      ? N(b.balance)
      : null;

  return notifyTelegram(
`🏆 ACHIEVEMENT UNLOCKED

🎖️ ${achievement}

💰 Reward:
+${reward} MB
${balance!=null?`🏦 Balance:\n${balance} MB`:""}`,
    "achievement_unlocked"
  );
}


/* =========================================================
   🏦 BANK ACTIVITY
   ========================================================= */

if(
  eventType==="🏦 SAVINGS BONUS" ||
  eventType==="🏦 BANK OF MICKY" ||
  eventType==="bank_activity" ||
  eventType==="savings_bonus"
){
  const title=S(
    b.title||
    b.name||
    "Bank Activity",
    700
  );

  const amount=
    b.amount!=null
      ? N(b.amount)
      : null;

  const balance=
    b.balance!=null
      ? N(b.balance)
      : null;

  return notifyTelegram(
`🏦 MICKY BANK ACTIVITY

📌 ${title}
${amount!=null?`💰 Amount: ${amount} MB`:""}
${balance!=null?`🏦 Balance: ${balance} MB`:""}
${b.details?`\n${S(b.details,1400)}`:""}`,
    "bank_activity"
  );
}


/* =========================================================
   🎁 INTERACTIVE REWARDS
   ========================================================= */

if(
  eventType==="interactive_reward" ||
  eventType==="interactive_rewards"
){
  return notifyTelegram(
`🎁 INTERACTIVE REWARD

🎁 Reward:
${S(b.reward||"Unknown reward",800)}

📌 Status:
${S(b.status||"Updated",300)}`,
    "interactive_reward"
  );
}


/* =========================================================
   🎁 MYSTERY / RARE BOX
   ========================================================= */

if(eventType==="rare_box_redeemed"){
  return notifyTelegram(
`🎁 MYSTERY RARE BOX REDEEMED

📂 Category:
${S(b.category||"Unknown",300)}

🎁 Reward:
${S(b.reward||"Mystery reward",900)}
${b.balance!=null?`\n🏦 Balance: ${N(b.balance)} MB`:""}

📦 Box:
CONSUMED`,
    "rare_box_redeemed"
  );
}


/* =========================================================
   👑 VIP
   ========================================================= */

if(eventType==="vip_privilege"){
  const rows=Object.entries(b)
    .filter(([k])=>k!=="type")
    .map(([k,v])=>`${k}: ${S(v,400)}`)
    .join("\n");

  return notifyTelegram(
`👑 VIP PRIVILEGE

${rows}`,
    "vip_privilege"
  );
}

if(eventType==="vip_complaint"){
  return notifyTelegram(
`📣 VIP COMPLAINT AGAINST MIKAEL

${S(b.complaint||"No complaint text",2500)}

Estimated accountability:
${S(b.accountabilityChance||"2%",100)}`,
    "vip_complaint"
  );
}

if(eventType==="vip_priority_message"){
  return notifyTelegram(
`💌 VIP PRIORITY MESSAGE FROM LIZZY

${S(b.message||"No message",2500)}`,
    "vip_priority_message"
  );
}


/* =========================================================
   💰 TELEGRAM MICKY BANK
   ========================================================= */

/* create a persistent, claimable deposit */
if(
  eventType==="deposit_created" ||
  eventType==="micky_bank_deposit" ||
  eventType==="micky_bank_deposit_create"
){
  const amt=N(b.amount,0);
  if(amt<1)return json({success:false,error:"Deposit amount must be at least 1 MB"},400);
  const r=await createDeposit(env,amt,S(b.note||b.details||"",300),S(b.source||"website",60));
  return json({success:true,type:"deposit_created",deposit:r.deposit,pendingCount:r.pendingCount,pendingTotal:r.pendingTotal});
}

/* Lizzy presses Claim Deposit on one voucher */
if(eventType==="micky_bank_claim_one"){
  const depId=S(b.id,120);
  const d=depId?await getDeposit(env,depId):null;
  if(!d)return json({success:false,error:"Deposit not found"},404);
  if(d.status!=="pending")return json({success:false,alreadyClaimed:true,amount:d.amount,status:d.status},409);
  d.status="claimed";
  d.claimedAt=new Date().toISOString();
  d.walletBefore=N(b.walletBefore,0);
  await putDeposit(env,d);
  const pending=await listDeposits(env,true);
  await tg(env,"sendMessage",{
    chat_id:env.TELEGRAM_CHAT_ID,
    text:`💸 DEPOSIT CLAIMED\n\nLizzy claimed ${d.amount} MB${d.note?`\nNote: ${d.note}`:""}\n\nStill unclaimed: ${pending.length} voucher(s) / ${pending.reduce((s,x)=>s+Number(x.amount||0),0)} MB`
  });
  return json({success:true,id:d.id,amount:d.amount,pendingCount:pending.length});
}

/* device confirms the new local balance after applying the deposit */
if(eventType==="micky_bank_claim_confirm"||eventType==="deposit_claimed"){
  const depId=S(b.id,120);
  if(depId){
    const d=await getDeposit(env,depId);
    if(d){d.walletAfter=N(b.walletAfter,0);await putDeposit(env,d);}
  }
  return notifyTelegram(
`✅ DEPOSIT APPLIED

${b.amount!=null?`Amount: ${N(b.amount)} MB\n`:""}${b.walletAfter!=null?`This device's balance: ${N(b.walletAfter)} MB`:""}`,
    "deposit_claimed"
  );
}

/* cancel an unclaimed deposit */
if(eventType==="micky_bank_deposit_cancel"){
  const d=await getDeposit(env,S(b.id,120));
  if(!d)return json({success:false,error:"Deposit not found"},404);
  if(d.status!=="pending")return json({success:false,error:"Deposit already claimed"},409);
  d.status="cancelled";d.cancelledAt=new Date().toISOString();
  await putDeposit(env,d);
  return json({success:true,id:d.id});
}


/* =========================================================
   💌 MESSAGES FROM MIKAEL
   ========================================================= */

/* create a message from the website (in addition to the /tolizzy Telegram command) */
if(eventType==="lizzy_message_create"){
  const text=S(b.text||b.message||"",500);
  if(!text)return json({success:false,error:"Message text required"},400);
  const r=await createMessage(env,text,S(b.source||"website",60));
  return json({success:true,type:"message_created",message:r.message,pendingCount:r.pendingCount});
}

/* Lizzy's site has shown the message on screen — mark it seen */
if(eventType==="lizzy_message_seen"){
  const msgId=S(b.id,120);
  const m=msgId?await getMessage(env,msgId):null;
  if(!m)return json({success:false,error:"Message not found"},404);
  if(m.status==="pending"){
    m.status="seen";
    m.seenAt=new Date().toISOString();
    await putMessage(env,m);
    const pending=await listMessages(env,true);
    await tg(env,"sendMessage",{
      chat_id:env.TELEGRAM_CHAT_ID,
      text:`👀 MESSAGE SEEN BY LIZZY\n\n"${m.text}"\n\nStill unseen: ${pending.length} message(s)`
    });
  }
  return json({success:true,id:m.id});
}


/* =========================================================
   💗 SYNCED FEELINGS — MIKAEL'S MOOD
   ========================================================= */

/* set Mikael's mood from the website (in addition to the /mymood Telegram command) */
if(eventType==="mikael_mood_set"){
  const text=S(b.text||b.mood||"",200);
  if(!text)return json({success:false,error:"Mood text required"},400);
  const m=await setMikaelMood(env,text,S(b.source||"website",60));
  return json({success:true,mood:m});
}


/* =========================================================
   💭 "I WONDER IF…" — SHARED THOUGHT BOARD
   ========================================================= */

/* Lizzy posts a new wonder from the website */
if(eventType==="thought_create"){
  const text=S(b.text||"",500);
  if(!text)return json({success:false,error:"Thought text required"},400);
  const t=await createThought(env,"Lizzy",text,S(b.source||"website",60));
  return json({success:true,thought:t});
}

/* Lizzy answers one of Mikael's wonders from the website */
if(eventType==="thought_answer"){
  const id=S(b.id,120);
  const text=S(b.text||b.reply||"",500);
  if(!id||!text)return json({success:false,error:"Thought id and reply text required"},400);
  const t=await answerThought(env,id,text,"Lizzy",S(b.source||"website",60));
  if(!t)return json({success:false,error:"Thought not found"},404);
  return json({success:true,thought:t});
}


/* =========================================================
   💗 DATE / CALENDAR
   ========================================================= */

if(
  eventType==="date_response" ||
  eventType==="date_proposal_response" ||
  eventType==="date_confirmed" ||
  eventType==="calendar_booking"
){
  return notifyTelegram(
`💗 LIZZYOS DATE / CALENDAR UPDATE

Status:
${S(b.status||b.response||b.answer||"Updated",500)}

${b.date?`📅 Date: ${S(b.date,300)}`:""}
${b.time?`⏰ Time: ${S(b.time,200)}`:""}
${b.details?`\n${S(b.details,1500)}`:""}`,
    "date_update"
  );
}


/* =========================================================
   🔄 MIKAEL TOKEN EVENTS
   ========================================================= */

if(
  eventType==="mikael_reverse_token_award" ||
  eventType==="mikael_reverse_token_redeemed"
){
  return notifyTelegram(
`🔄 MIKAEL REVERSE TOKEN

${S(
  b.message||
  b.title||
  b.token||
  "Reverse Token activity",
 1800
)}`,
    eventType
  );
}

 if(b.type==="mikael_reverse_token_award"){
   const name=String(b.name||"").trim();
   if(!name)return json({success:false,error:"Missing token name"},400);
   const {state}=await awardMikaelToken(env,name,b.emoji,b.desc,b.source);
   return json({success:true,state});
 }
 if(b.type==="mikael_reverse_token_sync"){
   const local=b.inventory&&typeof b.inventory==="object"?b.inventory:{};
   const state=await getMikaelTokenState(env);
   state.inventory=state.inventory||{};state.history=Array.isArray(state.history)?state.history:[];
   for(const [name,count] of Object.entries(local)){
     const n=Math.max(0,Number(count)||0);
     if(n>Number(state.inventory[name]||0))state.inventory[name]=n;
   }
   state.history.push({type:"legacy_sync",at:new Date().toISOString()});
   await putMikaelTokenState(env,state);
   return json({success:true,state});
 }
 if(b.type==="mikael_reverse_token_test"){
   const redemption={id:rid(),name:String(b.name||"Reverse Token Test"),emoji:String(b.emoji||"🧪"),desc:String(b.desc||"Cross-device test."),remaining:0,redeemedAt:new Date().toISOString(),acknowledged:false,test:true};
   await testKV(env).put(`mikael:redemption:${redemption.id}`,JSON.stringify(redemption),{expirationTtl:86400});
   const ids=await getRedemptionIndex(env);ids.push(redemption.id);await putRedemptionIndex(env,ids);
   return json({success:true,redemption});
 }
 if(b.type==="mikael_reverse_token_redeem"){
   const name=String(b.name||"").trim();
   const state=await getMikaelTokenState(env);
   state.inventory=state.inventory||{};state.history=Array.isArray(state.history)?state.history:[];
   const count=Number(state.inventory[name]||0);
   if(count<1)return json({success:false,error:"No token available"},409);
   state.inventory[name]=count-1;
   const redemption={id:rid(),name,emoji:String(b.emoji||"🔄"),desc:String(b.desc||""),remaining:state.inventory[name],redeemedAt:new Date().toISOString(),acknowledged:false};
   state.history.push({type:"redeemed",token:name,at:redemption.redeemedAt,redemptionId:redemption.id});
   await putMikaelTokenState(env,state);
   await testKV(env).put(`mikael:redemption:${redemption.id}`,JSON.stringify(redemption),{expirationTtl:2592000});
   const ids=await getRedemptionIndex(env);ids.push(redemption.id);await putRedemptionIndex(env,ids);
   await tg(env,"sendMessage",{chat_id:env.TELEGRAM_CHAT_ID,text:`🔄 MIKAEL REVERSE TOKEN REDEEMED\\n\\n${redemption.emoji} ${name}\\n${redemption.desc}\\n\\nRemaining: ×${redemption.remaining}`});
   return json({success:true,state,redemption});
 }
 if(b.type==="mikael_reverse_token_ack"){
   const id=String(b.id||"").trim();
   const key=`mikael:redemption:${id}`;
   const r=await testKV(env).get(key,{type:"json"});
   if(!r)return json({success:false,error:"Redemption not found"},404);
   r.acknowledged=true;r.acknowledgedAt=new Date().toISOString();
   await testKV(env).put(key,JSON.stringify(r),{expirationTtl:2592000});
   return json({success:true});
 }


 if(b.type==="vault_bid"){
   const offer=Math.floor(Number(b.offer));
   if(!Number.isFinite(offer)||offer<1)return json({success:false,error:"Invalid Vault offer"},400);
   const c={claimId:id(),type:"vault_bid",item:"The Vault",itemId:"vault",offer,status:"pending",counterOffer:null,lizzyOpened:false,createdAt:new Date().toISOString()};
   await putClaim(env,c);await putShelfState(env,c);
   await tg(env,"sendMessage",{chat_id:env.TELEGRAM_CHAT_ID,text:`🎰 LIZZYOS VAULT BID\n\nLizzy offered: ${offer} MB\n\nStatus: ⏳ PENDING\n\nClaim ID:\n${c.claimId}`,reply_markup:{inline_keyboard:[[{text:"🎰 ACCEPT VAULT",callback_data:`accept:${c.claimId}`},{text:"❌ REJECT",callback_data:`reject:${c.claimId}`}],[{text:"💬 COUNTER",callback_data:`counter:${c.claimId}`}]]}});
   return json({success:true,claimId:c.claimId,status:"pending"});
 }
 if(b.type==="vault_claim_opened"){
   const key=`claim:${String(b.claimId||"")}`,c=await testKV(env).get(key,{type:"json"});
   if(!c)return json({success:false,error:"Vault claim not found"},404);
   c.lizzyOpened=true;c.openedAt=new Date().toISOString();await testKV(env).put(key,JSON.stringify(c),{expirationTtl:2592000});
   return json({success:true});
 }
 if(b.type==="secret_shelf_bid"){
   const names={
     letter_002:"Unreleased Letter #002",
     mystery_reward:"Mystery Reward",
     archive_x17:"Sealed Archive X-17 [Cody Legal Documents]",
     dossier_001:"Classified File #001 — Initial Subject Assessment",
     hater_file:"Classified File #002 — The Hater Investigation",
     mrperfect_file:"Classified File #003 — Operation: Mr Perfect"
   };
   if(!names[b.item])return json({success:false,error:"Unknown Secret Shelf item"},400);
   const offer=Math.floor(Number(b.offer));
   if(!Number.isFinite(offer)||offer<1)return json({success:false,error:"Invalid offer"},400);
   const c={claimId:id(),type:"secret_shelf_bid",item:names[b.item],itemId:b.item,offer,status:"pending",counterOffer:null,createdAt:new Date().toISOString()};
   await putClaim(env,c);
   await putShelfState(env,c);
   await tg(env,"sendMessage",{chat_id:env.TELEGRAM_CHAT_ID,text:`🛒 LIZZYOS SECRET SHELF\n\n💌 NEW OFFER\n\nItem: ${c.item}\nLizzy's Offer: ${offer} MB\n\nStatus: ⏳ PENDING\n\nClaim ID:\n${c.claimId}`,reply_markup:{inline_keyboard:[[{text:"✅ ACCEPT",callback_data:`accept:${c.claimId}`},{text:"❌ REJECT",callback_data:`reject:${c.claimId}`}],[{text:"💬 COUNTER",callback_data:`counter:${c.claimId}`}]]}});
   return json({success:true,claimId:c.claimId,status:"pending"});
 }

 // Safety net: forward unknown/new event types instead of silently dropping them.
 const type=b.type||"LIZZYOS";
 const title=b.title||"Notification";
 const details=b.details||b.message||b.description||"";
 const extra=Object.entries(b)
   .filter(([k])=>!["type","title","details","message","description"].includes(k))
   .slice(0,12)
   .map(([k,v])=>`${k}: ${S(v,500)}`)
   .join("\n");

 await tg(env,"sendMessage",{
   chat_id:env.TELEGRAM_CHAT_ID,
   text:`${type}

${title}${details?`\n\n${S(details,1800)}`:""}${extra?`\n\n${extra}`:""}`
 });

 return json({ok:true,type,telegram:true});
}};