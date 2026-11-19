(()=>{
"use strict";
const $=id=>document.getElementById(id);
const WORKER=window.LIZZY_TELEGRAM_WORKER_URL||"https://mickyhq-test.mulaudzimikael73.workers.dev/v3/";
const LESSONS=["Believe in yourself. I believe in myself enough for both of us.", "If Plan A fails, remember there are 25 other letters.", "You miss 100% of the shots you don't take. You also miss quite a few that you do.", "Progress is progress, unless you're going backwards.", "Do it scared. Do it tired. Just maybe don't do it drunk.", "A bad day is not a bad life. Very important distinction.", "You don't need motivation every day. Sometimes you just need to start.", "Future You is watching. Try not to embarrass them.", "Small steps still count. Unless you're running from a hyena.", "Don't compare Chapter 2 of your life to somebody else's Chapter 15.", "You've survived every difficult day you've had so far. Strong record.", "Success takes time. Unfortunately.", "Be patient. Even Wi-Fi takes a few seconds to connect.", "You can't control everything. You can, however, complain about it.", "Your comfort zone is comfortable for a reason. Leave occasionally.", "Dream big. Your budget can panic later.", "You don't have to be perfect. That position is already occupied.", "One day or day one. Or Tuesday. Tuesday also works.", "Sometimes the biggest obstacle between you and success is opening the laptop.", "Hard work beats talent when talent is taking a nap.", "Do fish know they're wet?", "If tomatoes are fruit, is ketchup technically a smoothie?", "Your future self remembers things you haven't done yet.", "Somewhere, somebody has accidentally waved back at someone who wasn't waving at them.", "If you clean a vacuum cleaner, do you become the vacuum cleaner?", "Every mirror you've ever looked into has technically seen you before.", "Nobody knows what the first person to milk a cow was trying to accomplish.", "If Cinderella's shoe fit perfectly, why did it fall off?", "Maybe pigeons think we're the weird ones.", "If two mind readers read each other's minds, whose mind are they reading?", "You have never seen your own face. Only reflections and pictures.", "Somewhere right now, somebody is saying 'where's my phone?' while holding their phone.", "The word 'queue' is just Q followed by four silent letters waiting their turn.", "Your stomach thinks all potatoes are mashed potatoes.", "If you're waiting for the waiter, aren't you the waiter?", "A birthday is technically your personal New Year's Day.", "The brain named itself. Suspicious.", "Nothing is on fire. Fire is on things.", "If you expect the unexpected, doesn't that make it expected?", "Every time you remember something embarrassing, your brain chose violence.", "Never let them know your next move. Walk backwards.", "If life closes a door, check whether it says PUSH.", "If nobody saw it happen, reconsider whether it needs to become public information.", "Never trust someone who says 'trust me.' Including me.", "If you're running late, walk faster while looking stressed.", "If something feels wrong, turn it off and back on again.", "When in doubt, get ice cream.", "Don't send the paragraph while angry. Draft it. Sleep. Reconsider your career as an author.", "Never argue with someone whose profile picture is a car.", "If you're going to procrastinate, at least make snacks first.", "Always check your pockets before doing laundry.", "Don't grocery shop hungry. That's how you become the owner of seventeen snacks.", "If you lose something, ask your mom. Moms have administrator privileges.", "Always screenshot the evidence.", "Never volunteer information nobody asked for.", "If you're confused, nod slowly. People may assume you're thinking.", "Always carry a charger.", "If someone says 'long story short,' prepare for a long story.", "If the Wi-Fi stops working, staring angrily at the router is mandatory.", "Never trust a chair that makes a noise before you've fully sat down.", "Money can't buy happiness, but being broke hasn't exactly impressed me.", "Save money. Future You has expensive taste.", "Before buying something, ask yourself: do I need this? Then ignore yourself responsibly.", "Never check your bank balance immediately after a night out.", "Financial freedom begins with not ordering food you already have at home.", "A discount is only saving money if you were actually going to buy it.", "You cannot budget your way out of buying snacks. Accept reality.", "Never lend money you're going to need back tomorrow.", "Compound interest sounds boring until it's your money.", "Your card declining is your bank staging an intervention.", "If you can't afford it twice, consider staring at it online instead.", "A budget is just telling your money where to disappear.", "Payday confidence should never be trusted.", "There are two versions of you: before payday and after payday.", "Rich is having money. Wealthy is forgetting you have a subscription and not noticing.", "Communication is important. Unfortunately, this means talking about feelings.", "Never go to sleep angry. Stay awake and become increasingly unreasonable.", "Sometimes saying 'you're right' is cheaper than continuing.", "Choose someone who makes you laugh. Life is already serious enough.", "If she says 'I'm fine,' further investigation may be required.", "Love is patient. Arguments are apparently not.", "The secret to relationships is communication, patience and occasionally food.", "Never underestimate the diplomatic power of ice cream.", "If you care about someone, annoy them regularly so they know you're still alive.", "Remember the little things. Apparently they become evidence later.", "Relationships require compromise. Unless I'm clearly right.", "A thoughtful message costs nothing and can mean everything.", "Sometimes quality time is literally just doing nothing together.", "Learn their favourite snack. This is strategic information.", "Being able to laugh together fixes more than people realise.", "Don't keep score in relationships. Unless you're bowling.", "If someone remembers the tiny things you tell them, pay attention.", "Sometimes 'Did you get home safely?' says more than a paragraph.", "Find somebody you can be ridiculous around.", "A good relationship should contain approximately 40% affection and 60% bullying. Research pending.", "Read the question before answering. Revolutionary concept.", "Google first. Panic second.", "Save your work. SAVE. YOUR. WORK.", "If something is due tomorrow, today is technically early.", "Group projects teach you that trust is dangerous.", "Never volunteer to present first unless you enjoy suffering.", "The smartest person in the room is often the person willing to ask the stupid question.", "You don't need to know everything. You need to know how to find things.", "Writing it down dramatically increases the chance you'll remember it.", "If you've read the same sentence five times, go to sleep.", "Studying while scrolling is just scrolling with educational guilt.", "Deadlines are motivational speakers with consequences.", "If your assignment says 2,000 words, suddenly every sentence becomes incredibly important.", "Spellcheck is a friend, not a substitute for reading.", "Never submit without opening the file one last time.", "Always be yourself. Unless you can be Batman.", "Batman had a plan for everything. Take notes.", "Never underestimate somebody wearing all black.", "A cape is impractical. Still cool though.", "If Batman can prepare for Superman, you can prepare for Monday.", "Confidence is walking into a room like Batman already investigated it.", "There is almost certainly a Batman quote appropriate for your situation.", "If your plan requires explaining why Batman would approve, it's probably a great plan.", "Some problems require patience. Others require a Batmobile.", "I don't make the rules. Unless they're Batman-related.", "Never make important decisions while hungry.", "Ice cream doesn't solve problems, but neither does being sad without ice cream.", "Fries taste better when stolen from somebody else's plate.", "Pasta is proof that life isn't completely terrible.", "A burger is just a sandwich with ambition.", "Dessert isn't unnecessary. It's emotional infrastructure.", "If somebody says they don't want fries, order extra.", "Never trust 'I'll just have one sweet.'", "Calories consumed while standing in the kitchen are administratively complicated.", "There's no such thing as too much pasta. Only inadequate containers.", "A wise man once said nothing. Unfortunately, I am not that man.", "If at first you don't succeed, investigate who witnessed it.", "Sometimes you need to look in the mirror and say: Future Me can handle this.", "The early bird gets the worm. I don't want a worm. I'm sleeping.", "Don't chase people. Unless they have your phone.", "If you're going through hell, keep going. Petrol is expensive.", "Confidence is just confusion with good posture.", "Every problem has a solution. Some solutions are just terrible.", "Think before you speak. Or don't. Sometimes the story is funnier that way.", "The consequences of my own actions continue to surprise me.", "If you don't know what you're doing, do it confidently.", "Never underestimate the power of saying 'that's crazy' when you weren't listening.", "Sometimes maturity is simply deciding not to send the message.", "You can't lose an argument if you leave the room. Strategic withdrawal.", "There's a fine line between confidence and delusion. I refuse to locate it.", "You're doing better than you think. Probably.", "Remember: panic is not a strategy. It's more of a lifestyle.", "Today is another opportunity to make a questionable decision and learn from it.", "If your plan works, you're a genius. If it doesn't, it was an experiment.", "Life is short. Order dessert.", "Never trust a pigeon. They know too much. 🐦", "If you stare at the microwave, it cooks exactly the same speed.", "Always knock on wood. You never know who's living in there.", "If you lose one sock, the washing machine has won. 🧦", "Never fight a goose. You will lose.", "Bananas are just nature's boomerangs if you throw them badly. 🍌", "If you walk past a mirror, check yourself. For quality control.", "Never underestimate a suspiciously quiet toddler.", "If the elevator is full, pressing the button again won't help.", "Don't trust anyone who eats pizza with a knife and fork. 🍕", "If you drop your phone on your face, you're officially awake.", "A chair is just a table you can sit on.", "Never run with scissors. Unless you're late. ✂️", "If your toast lands butter-side down, blame physics.", "Every pen disappears the moment you actually need one.", "If you wave back at someone who wasn't waving at you, move countries. 😭", "Never make eye contact with a seagull holding food.", "If you forget why you entered a room, pretend you meant to do that.", "Your left shoe has never been jealous of your right shoe. Probably.", "If you can't find something, ask someone else. They'll find it immediately.", "Never trust a \"quick\" trip to the shops.", "If you sneeze three times, you're legally allowed to blame allergies.", "A cold pillow is basically five-star accommodation.", "If your Wi-Fi works perfectly, don't touch anything.", "Never challenge a child to a staring contest. They have no deadlines.", "If you hear a weird noise at night, simply don't investigate.", "The floor is lava only when you're barefoot.", "If you trip in public, keep walking. Nobody saw anything.", "Never open a packet quietly. The packet will take it personally.", "If you don't know what day it is, check your phone before panicking.", "Never trust a vending machine that gives you change too quickly.", "If your shadow is following you, don't confront it.", "The louder the alarm, the stronger the snooze button.", "If you can't reach it, use something else to reach it. Engineering.", "Never put something \"somewhere safe.\" You'll never find it again.", "If you hear your name in public, pretend you didn't.", "Always inspect the suspiciously perfect avocado. 🥑", "If the remote is missing, check the person sitting closest to it.", "Never underestimate the power of a dramatic sigh.", "If someone says \"watch this,\" prepare for consequences. 😂", "Life is short. Order the extra fries. 🍟", "If your hair looks good, don't touch it.", "Never trust a door that says \"pull\" when you're already pushing.", "If you don't like the song, wait 30 seconds. It might become worse.", "When in doubt, walk confidently in the direction you hope is correct. 😎", "Lose at bowling? It's called The Mikael Effect. 🎳", "Never celebrate before the pins fall. The bowling gods are watching. 🎳", "If you lose at bowling, blame the shoes. 👟", "One pillow is sleep. Five pillows is architecture. 🛏️", "Too many pillows? Congratulations, you're sleeping uphill. 😂", "The colder side of the pillow is worth fighting for. ❄️", "Never trust \"I'll remember where I put it.\"", "If you keep opening the fridge, new food won't spawn. 🧀", "Your phone hits 1% exactly when you need it most. 🔋", "Three alarms won't make you less tired. ⏰", "If you can't find your phone, check your hand first. 📱", "Never grocery shop while hungry. Your wallet will suffer. 🛒", "If it takes two minutes, do it now. Future-you is busy.", "Never argue on an empty stomach. Eat first, fight later. 😂", "If you say \"what could go wrong?\", something will.", "The queue you leave is always the queue that moves fastest. 😭", "Never say \"I'll just watch one episode.\"", "If your room has a clothes chair, it's already too late. 👕", "Check your pockets before leaving. Phone, wallet, keys, dignity.", "If you're late, walking faster doesn't change the time. 😂", "Never trust a charger that only works at one angle.", "If the Wi-Fi stops working, restart it before blaming Micky.", "Don't make important decisions after midnight.", "If you're angry, don't text. Draft it and go eat.", "If you can't fix it, at least make it a funny story.", "Always bring a jacket. Weather loves proving you wrong.", "If you borrow it, return it before they have to ask.", "A screenshot today saves a panic tomorrow. 📸", "If you don't know what you're doing, read the instructions.", "Procrastination is just future-you's problem… until it isn't.", "If you drop something, gravity has officially won.", "Never trust a \"quick nap.\"", "If you're hungry, you're probably not as angry as you think.", "Don't compare your behind-the-scenes to someone else's highlight reel.", "Sometimes the best response is simply: \"Okay.\"", "Your bed is not a storage facility.", "If you can't sleep, stop checking the time every five minutes.", "Never leave home with 1% battery. That's a suicide mission. 🔋", "If you mess up, own it, laugh about it, learn from it.", "A Life Without Sweets is Not a Life Worth Living.", "Dessert isn't the end of the meal. It's the whole point of the meal. 🍰", "If the recipe says one tablespoon of sugar, it clearly means the whole bag.", "Never trust a cake that describes itself as 'healthy.'", "A cupcake without frosting is legally just a sad muffin.", "Chocolate is a food group. I don't make the rules. Actually, I do.", "If dessert is optional, you're doing dinner wrong.", "'We'll share dessert' is the biggest lie two people can agree to. 🍮", "A candy jar left unattended is basically a public invitation.", "There is no emergency a snack cannot make slightly better.", "Never skip breakfast. Skip responsibilities instead.", "If it's on sale, it's basically free. Financial logic, undefeated.", "Sleep is just a free trial of being unconscious.", "A snooze button is a suggestion, not a rule. ⏰", "Never underestimate a nap's power to fix, or ruin, your entire day.", "The best apologies arrive with snacks attached.", "If someone offers you their fries, it's a loyalty test. Choose wisely. 🍟", "Monday is just Sunday's way of testing your patience.", "Never trust a scale immediately after a big meal.", "If you can't decide what to eat, the answer is probably 'both.'", "Ice cream has never once made a situation worse.", "The last slice of cake belongs to whoever is brave enough to take it. 🍰", "If a recipe has more than five steps, that's what takeout is for.", "A sweet tooth isn't a flaw. It's a personality trait.", "A balanced diet is a cookie in each hand.", "Finishing a whole packet of biscuits is technically portion control. For the next packet. 🍪", "Never trust anyone who orders a salad and calls it a treat.", "If it comes with a side of dessert, it was always going to be a good day.", "Traffic lights turn red exactly when you're already running late. 🚦", "If you say 'I'll only be five minutes,' assume the opposite.", "A to-do list is just a wish list with deadlines.", "Group chats are where good ideas go to be ignored. 📱", "The remote control always ends up exactly where you can't reach it.", "If autocorrect changes your message, that's now what you meant.", "Never trust a printer. It knows exactly when you're in a hurry.", "The last 5% of a phone battery lasts approximately three seconds. 🔋", "If it's raining and you forgot your umbrella, that's just tradition now.", "Never argue with a GPS. It already decided you're wrong.", "A parking spot appears the moment you stop looking for one. 🚗", "The gym is 80% intention and 20% attendance.", "If you set five alarms, you'll wake up exactly once, right before the fifth. ⏰", "Never trust a Wi-Fi signal with only two bars.", "A closed laptop lid does not mean the meeting is actually over.", "If your plant is still alive, consider a career in miracles. 🌱", "Every umbrella eventually turns itself inside out. It's inevitable.", "The last piece of anything belongs to whoever asks first.", "If your shoe comes untied, the universe wants you to stop and reconsider your choices.", "A queue moves fastest in the lane you didn't choose. 😤", "Winning an argument with silence is still winning.", "Weekends are 48 hours that disappear in what feels like 10.", "If your pet stares at you while you eat, that's basically a tax. 🐾", "A car with one headlight is just winking at traffic.", "If you laugh at your own joke first, commit fully. No apologies.", "Never trust a text that just says 'we need to talk.'", "The bravest people are the ones who answer unknown numbers. 📞", "If you're overthinking it, you've probably already made it worse.", "Every plan survives right up until the first text that says 'actually...'", "Batman doesn't use an umbrella. The cape already knows the weather. 🦇", "If you're nervous about something, ask what Batman would prep beforehand. Then actually do it.", "Batman's car has a name. Yours is just 'the car.'", "The Batcave has Wi-Fi. Nobody questions this.", "Batman always has a plan B. At minimum, have a snack B.", "Batman never uses the front door. Deeply impractical for a dinner guest.", "Somewhere, Alfred is folding a cape. This has nothing to do with your day, but it's happening.", "If Batman can function on four hours of sleep and pure willpower, so can you. Not recommended though.", "Batman has never once been asked to split a bill. Must be nice.", "The Bat-Signal is just a very dramatic group chat notification. 🦇", "Catwoman's whip has never once been used to open a jar. Missed opportunity. 🐱", "If Catwoman can land on her feet, you can recover from one bad day.", "Catwoman owns multiple cat-themed outfits. This solves nothing in your life.", "Somewhere, Catwoman is currently ignoring a rule. Solidarity.", "Catwoman never apologises for taking what's rightfully overdue. Within reason, neither should you.", "Catwoman's goggles have cat ears built in. This information will not help you today.", "Cats don't listen to Catwoman either. Some things are universal. 🐱", "If Catwoman can walk into a room like she owns it, so can you. Practice first.", "Catwoman has never once needed directions. Deeply suspicious.", "Somewhere, a cat burglar is stuck in traffic. Even villains have bad days."];
const VKEY="lizzyMickyWisdomVotesV2";
let current=Math.floor(Math.random()*LESSONS.length);
let currentPage="home",lastNewsDay=null;

async function notify(type,title,details){
 try{
  const r=await fetch(WORKER,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type,title,details,source:"LizzyOS"})});
  return r.ok;
 }catch(e){console.warn(e);return false}
}
function setAddress(v){if($("browserAddress"))$("browserAddress").textContent=v}
function home(){
 currentPage="home";
 setAddress("lizzy://home");
 $("browserPage").innerHTML=`<div class="browserHome">
 <div class="searchLogo">Lizzy<span>Search</span></div>
 <div class="fakeSearch">Search LizzyOS or enter address 🔍</div>
 <h3>Favourite Sites</h3>
 <div class="browserBookmarks">
  <button data-site="bank"><span>🏦</span><b>Bank of Micky</b><small>Online Banking</small></button>
  <button data-site="lessons"><span>🧠</span><b>Life Lessons with Micky</b><small>Qualifications: Trust Me.</small></button>
  <button data-site="lizzylessons"><span>💡</span><b>Life Lessons with Lizzy</b><small>Mikael grades every submission.</small></button>
  <button data-site="news"><span>📰</span><b>Micky's Daily News</b><small>Headlines, Bank & President's Words</small></button>
 </div></div>`;
}
const BANK_SESSION="lizzyBankLoggedInV2";
const BANK_PASSWORD="MRPERFECT";
const BANK_WALLET_KEY="lizzyMickyBucsV1";
const BANK_STATE_KEY="lizzyMickyBankV1";
const BANK_WEEK=7*24*60*60*1000;

function bankRead(key,fallback){
 try{const raw=localStorage.getItem(key);return raw===null?fallback:JSON.parse(raw)}
 catch(e){return fallback}
}
function bankWrite(key,value){localStorage.setItem(key,JSON.stringify(value))}
function bankWallet(){return Number(bankRead(BANK_WALLET_KEY,0))||0}
function bankSetWallet(n){
 bankWrite(BANK_WALLET_KEY,Math.max(0,Number(n)||0));
 window.dispatchEvent(new Event("lizzyStoreRefresh"));
}
function bankState(){
 const raw=bankRead(BANK_STATE_KEY,{savings:0,qualifyingSince:null,lastBonus:null});
 return {
   savings:Number(raw?.savings||0),
   qualifyingSince:raw?.qualifyingSince||null,
   lastBonus:raw?.lastBonus||null
 };
}
function bankSave(s){
 bankWrite(BANK_STATE_KEY,s);
 window.dispatchEvent(new Event("lizzyStoreRefresh"));
}
async function bankNotify(title,details){
 return notify("🏦 BANK OF MICKY",title,details);
}
function bank(){
 currentPage="bank";
 setAddress("https://bankofmicky.lizzy");
 if(sessionStorage.getItem(BANK_SESSION)==="yes")return bankDashboard();
 $("browserPage").innerHTML=`<div class="bankLoginPage">
 <div class="bankLoginBrand">🏦</div><h1>Bank of Micky</h1>
 <p class="bankTagline">Private Banking • Definitely Regulated™</p>
 <div class="bankLoginCard">
 <label>Client</label><div class="bankClient">Lebone Elizabeth Kganyago</div>
 <label for="bankPassword">Online Banking Password</label>
 <input id="bankPassword" type="password" autocomplete="off" placeholder="Enter password">
 <button id="bankLoginBtn" type="button">Sign In</button>
 <p id="bankLoginStatus" class="bankLoginStatus"></p></div>
 <small class="bankFinePrint">Bank of Micky will never ask you to send your Micky Bucs to a prince.</small>
 </div>`;
 setTimeout(()=>$("bankPassword")?.focus(),50);
}
function bankLogin(){
 const input=$("bankPassword"),status=$("bankLoginStatus");
 const attempt=(input?.value||"").trim().toUpperCase().replace(/\s+/g,"");
 if(attempt===BANK_PASSWORD){sessionStorage.setItem(BANK_SESSION,"yes");bankDashboard()}
 else{if(status)status.textContent="❌ Incorrect password. Access denied.";if(input){input.value="";input.focus()}}
}
function bankBonusText(s){
 if(s.savings<15)return `Save ${15-s.savings} more MB to start qualifying for the weekly bonus.`;
 if(!s.qualifyingSince)return "Savings timer will start now.";
 const elapsed=Date.now()-Number(s.qualifyingSince);
 if(elapsed<BANK_WEEK){const d=Math.ceil((BANK_WEEK-elapsed)/86400000);return `${d} day${d===1?"":"s"} remaining until the +5 MB bonus.`}
 if(s.lastBonus&&Date.now()-Number(s.lastBonus)<BANK_WEEK)return "This week's savings bonus has already been claimed.";
 return "🎉 Your +5 MB weekly savings bonus is ready.";
}
function bankDashboard(message=""){
 const s=bankState(),w=bankWallet();
 $("browserPage").innerHTML=`<div class="bankSite">
 <div class="bankSiteHeader"><div><small>BANK OF MICKY</small><h2>Good day, Lizzy 👋</h2></div><button id="bankLogout" type="button">Log Out</button></div>
 <div class="bankAccountCard"><small>AVAILABLE MICKY BUCS</small><div class="bankBigBalance">${w} <span>MB</span></div><div class="bankAccountNo">Everyday Wallet • **** 0002</div></div>
 <div class="bankGrid"><div class="bankMiniCard"><small>SAVINGS</small><strong>${s.savings} MB</strong><span>Bank of Micky Savings</span></div><div class="bankMiniCard"><small>WEEKLY BONUS</small><strong>+5 MB</strong><span>${bankBonusText(s)}</span></div></div>
 <div class="bankActions"><button type="button" data-web-bank="deposit">↓ Deposit 5 MB</button><button type="button" data-web-bank="withdraw">↑ Withdraw 5 MB</button><button type="button" data-web-bank="bonus">🎁 Claim Weekly Bonus</button></div>
 ${message?`<div class="bankWebStatus">${message}</div>`:""}
 <div class="bankRules"><b>How savings work</b><p>Move 5 MB at a time between your wallet and savings. Keep at least 15 MB saved for 7 days to qualify for the +5 MB weekly bonus.</p></div></div>`;
}
async function bankAction(action){
 let s=bankState(),w=bankWallet();
 if(action==="deposit"){
   if(w<5)return bankDashboard("😭 You need at least 5 MB in your wallet to deposit.");
   w-=5;s.savings+=5;
   if(s.savings>=15&&!s.qualifyingSince)s.qualifyingSince=Date.now();
   bankSetWallet(w);bankSave(s);
   bankDashboard("✅ 5 MB deposited into savings.");
   bankNotify("Deposit",`5 MB\nWallet: ${w} MB\nSavings: ${s.savings} MB`);
   return;
 }
 if(action==="withdraw"){
   if(s.savings<5)return bankDashboard("😭 You need at least 5 MB in savings to withdraw.");
   s.savings-=5;w+=5;
   if(s.savings<15)s.qualifyingSince=null;
   bankSetWallet(w);bankSave(s);
   bankDashboard("✅ 5 MB withdrawn back to your wallet.");
   bankNotify("Withdrawal",`5 MB\nWallet: ${w} MB\nSavings: ${s.savings} MB`);
   return;
 }
 if(action==="bonus"){
   if(s.savings<15||!s.qualifyingSince||Date.now()-Number(s.qualifyingSince)<BANK_WEEK)
     return bankDashboard("🔒 Keep at least 15 MB saved for 7 days before claiming the bonus.");
   if(s.lastBonus&&Date.now()-Number(s.lastBonus)<BANK_WEEK)
     return bankDashboard("⏳ This week's savings bonus has already been claimed.");
   s.lastBonus=Date.now();w+=2;bankSave(s);bankSetWallet(w);
   bankDashboard("🎉 Weekly savings bonus claimed: +5 MB!");
   bankNotify("Weekly bonus claimed",`+5 MB\nWallet: ${w} MB\nSavings: ${s.savings} MB`);
 }
}
function state(){try{return JSON.parse(localStorage.getItem(VKEY)||'{"helpful":0,"useless":0}')}catch{return {helpful:0,useless:0}}}
function lesson(){
 currentPage="lesson";
 setAddress("https://lifelessonswithmicky.lizzy");
 const s=state(), total=s.helpful+s.useless, rating=total?Math.round(s.helpful/total*100):100;
 $("browserPage").innerHTML=`<div class="lifeLessonsPage">
 <div class="wisdomBrand">🧠 LIFE LESSONS WITH MICKY™</div>
 <p class="wisdomSub">Founder & Chief Philosopher • Qualifications: Trust Me.</p>
 <div class="wisdomCard"><small>LIFE LESSON #${current+1}</small><blockquote>“${LESSONS[current]}”</blockquote><cite>— Mikael Mulaudzi</cite></div>
 <div class="wisdomButtons"><button data-vote="helpful">👍 Helpful</button><button data-vote="useless">👎 Absolutely Useless</button><button id="anotherLesson">Give Me Another Life Lesson</button></div>
 <p class="wisdomRating">Micky Wisdom Approval Rating: <b>${rating}%</b> • ${s.helpful} helpful / ${s.useless} useless</p>
 </div>`;
}
async function vote(kind){
 const s=state();s[kind]=(s[kind]||0)+1;localStorage.setItem(VKEY,JSON.stringify(s));
 const label=kind==="helpful"?"👍 Helpful":"👎 Absolutely Useless";
 await notify("🧠 LIFE LESSON VOTE",`Lesson #${current+1} — ${label}`,LESSONS[current]);
 lesson();
}

/* ===== 💡 LIFE LESSONS WITH LIZZY — she writes, Mikael grades ===== */
function lizzyLessonsPage(){
 currentPage="lizzylessons";
 setAddress("https://lifelessonswithlizzy.mikael");
 $("browserPage").innerHTML=`<div class="lifeLessonsPage">
 <div class="wisdomBrand">💡 LIFE LESSONS WITH LIZZY™</div>
 <p class="wisdomSub">Founder & Chief Philosopher • Qualifications: Also Trust Me.</p>
 <div class="wisdomCard">
  <textarea id="lizzyLessonInput" maxlength="600" placeholder="What's today's life lesson?" style="width:100%;min-height:80px;"></textarea>
  <div class="wisdomButtons"><button id="submitLizzyLesson">Submit for Grading</button></div>
  <div id="lizzyLessonStatus" class="wisdomSub"></div>
 </div>
 <h3 style="margin-top:16px;">Your Submissions</h3>
 <div id="lizzyLessonsList">Loading…</div>
 </div>`;
 loadLizzyLessons();
}
async function loadLizzyLessons(){
 const list=$("lizzyLessonsList");
 if(!list)return;
 try{
  const r=await fetch(WORKER+"?lizzyLessons=1");
  const d=await r.json();
  const lessons=d.lessons||[];
  if(!lessons.length){list.innerHTML='<div class="wisdomSub">No lessons submitted yet — write your first one above.</div>';return;}
  list.innerHTML=lessons.map(l=>{
   const badge=l.status==="rated"
     ?(l.rating==="helpful"?"👍 Helpful":"👎 Absolutely Useless")
     :"⏳ Awaiting Mikael's verdict";
   return `<div class="wisdomCard"><blockquote>“${l.text}”</blockquote><cite>${badge}${l.note?` — "${l.note}"`:""}</cite></div>`;
  }).join("");
 }catch(e){list.innerHTML='<div class="wisdomSub">Could not load your lessons.</div>';}
}
async function submitLizzyLesson(){
 const input=$("lizzyLessonInput"),status=$("lizzyLessonStatus"),btn=$("submitLizzyLesson");
 const text=input?.value.trim();
 if(!text){if(status)status.textContent="Write something first 👀";return;}
 if(btn)btn.disabled=true;
 if(status)status.textContent="Sending to Mikael…";
 try{
  const r=await fetch(WORKER,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"submit_lizzy_lesson",text})});
  const d=await r.json();
  if(!d.success)throw new Error(d.error||"Could not submit");
  if(input)input.value="";
  if(status)status.textContent="✓ Sent to Mikael for grading";
  loadLizzyLessons();
 }catch(e){if(status)status.textContent="❌ Could not send. Try again.";}
 finally{if(btn)btn.disabled=false;}
}

const NEWS_STORAGE_KEY="lizzyMickyDailyNewsV1";
const NEWS_ROTATION_VERSION="v7";

const NEWS_BREAKING=[
 {h:"Major Announcement Expected from the President",p:"The President has confirmed that savings across LizzyOS are at an all-time high, and that the weekly +5 MB bonus will continue for every citizen who keeps at least 15 MB banked for seven days."},
 {h:"Bank of Micky Vault Reaches Record Balance",p:"Analysts describe the current savings climate as 'suspiciously stable,' pointing to disciplined depositors and an unusually low number of impulse withdrawals this week."},
 {h:"City-Wide Celebration as Weekly Bonus Confirmed Again",p:"Officials confirm the +5 MB weekly bonus remains fully funded, with no changes expected to the 15 MB, seven-day qualifying threshold."},
 {h:"President Addresses Rumours of a New Currency",p:"Sources close to the Office of the President deny any plans to replace the Micky Buc, calling the current system 'financially iconic.'"},
 {h:"LizzyOS Citizens Report Record Levels of Contentment",p:"An informal survey suggests satisfaction is up across the board, with several respondents crediting 'consistent snack access' as a leading factor."},
 {h:"Emergency Session Called Over Snack Shortage Scare",p:"The scare has since been resolved. Officials confirm the pantry was simply relocated, not depleted."},
 {h:"Bank of Micky Announces Zero Fee Increases, Again",p:"For the count-th consecutive week, the Bank of Micky has raised absolutely nothing. Depositors are reportedly thrilled."},
 {h:"Local Investigation Into 'Mr Perfect' Title Reopened",p:"A newly formed review board says it will 'look into it,' though a source close to the investigation predicts the outcome is 'not exactly a mystery.'"},
 {h:"President Praises Citizens for Strong Weekly Turnout",p:"Attendance across LizzyOS activities remains high, with officials calling engagement levels 'genuinely impressive.'"},
 {h:"Micky's Daily News Wins Award for Most Trusted Source",p:"The award was self-issued. The newsroom stands by its accuracy regardless."},
 {h:"Bank of Micky Confirms Vault Remains Fully Guarded",p:"Security has not been tested recently, largely because nobody has attempted to test it."},
 {h:"President Unveils Plans for a Quieter, Calmer Week Ahead",p:"Details remain scarce, but officials describe the plan as 'mostly vibes, but promising vibes.'"},
 {h:"Sources Confirm Mysterious New Feature In Development at LizzyOS HQ",p:"Details remain locked — quite literally, according to one anonymous insider."},
 {h:"Insiders Whisper About Something 'Under Construction' Behind the Scenes",p:"When asked for comment, the development team simply smiled and said nothing."},
 {h:"Rumours Swirl of a New Way to Earn Micky Bucs Coming Soon",p:"Officials neither confirm nor deny, which historically means it's true."},
 {h:"Leaked Blueprint Suggests a Brand New Room Is Being Added to LizzyOS",p:"No further details were provided. The blueprint has since been shredded."},
 {h:"President Teases 'Something Big' for a Future Update",p:"When pressed for specifics, the President simply winked and changed the subject."},
 {h:"Development Team Spotted Working Late Again. Speculation Mounts.",p:"Nobody knows what they're building. Everybody has a theory."}
];
const NEWS_BANKING=[
 {h:"Bank of Micky Reports Record Savings",p:"More Micky Bucs are being saved than ever before. Full report inside."},
 {h:"Weekly Bonus Claim Rate Hits New High",p:"More citizens than ever are claiming their +5 MB on time this week."},
 {h:"Savings Habits Improving Across LizzyOS",p:"Financial analysts note a steady rise in citizens keeping their balance above the 15 MB threshold."},
 {h:"Bank of Micky Processes Its Smoothest Week Yet",p:"No reported issues, no reported drama. Just deposits, withdrawals, and one very reliable bonus."},
 {h:"Vault Rewards Remain a Top Talking Point",p:"Citizens continue to speculate about what the rarer prizes might be, with theories ranging from 'plausible' to 'wildly optimistic.'"},
 {h:"Micky Buc Holds Steady Against All Known Currencies",p:"Experts confirm the Micky Buc remains exactly as valuable as it was yesterday, which is apparently reassuring."},
 {h:"Depositors Urged to Claim Bonuses Promptly",p:"The Bank of Micky reminds all savers that the weekly bonus won't claim itself."},
 {h:"Bank of Micky Confirms: Still No Hidden Fees",p:"For the record, there have never been any hidden fees. This remains true today."}
];
const NEWS_LIFESTYLE=[
 {h:"Life Lessons With Micky Goes Viral",p:"Readers can't decide if the advice is helpful or absolutely useless."},
 {h:"Citizens Debate Whether Micky's Wisdom Counts as Wisdom",p:"The debate remains unresolved, though engagement is at an all-time high."},
 {h:"Poll: Most Popular Life Lesson of the Week Announced",p:"Results were close, but the pasta-related advice narrowly took the lead."},
 {h:"Local Reader Claims Life Lesson 'Actually Helped'",p:"Skeptics remain unconvinced. The reader stands by their statement."},
 {h:"Life Lessons With Micky Now Read Daily By Thousands",p:"Or at least by everyone currently browsing LizzyOS. Numbers pending verification."},
 {h:"Experts Still Can't Explain Why the Advice Works",p:"And yet, somehow, it keeps working."},
 {h:"Micky's Advice Column Now Considered 'Required Reading'",p:"Required by whom remains unclear, but the column persists."},
 {h:"New Poll Finds Readers Want More Life Lessons, Not Fewer",p:"The people have spoken. Micky is reportedly 'flattered but not surprised.'"},
 {h:"Lizzy Urged by Fans to Take More Photos",p:"Sources say the demand is highest from one particular 'mystery man.'"},
 {h:"Mystery Man Reportedly Still Awaiting More Photos From Lizzy",p:"His identity remains undisclosed, though he is described as 'extremely patient.'"},
 {h:"Mikael Spotted Smiling at Photos of an Unknown Woman",p:"Sources are investigating. Early theories range from 'suspicious' to 'extremely obvious.'"},
 {h:"Investigation Into Mikael's Mystery Woman Continues",p:"No comment has been obtained from Mikael, who was reportedly 'still smiling.'"},
 {h:"Lifestyle Desk Demands Answers: Who Is Making Mikael Smile Like That?",p:"The newsroom suspects the answer is closer to home than anyone realizes."},
 {h:"Mystery Woman Investigation Widens After Cody Reportedly 'Knows Something'",p:"Cody has declined to comment. Lizzy has declined to make him."},
 {h:"Lifestyle Desk Notes Mikael's Smiling-at-Photos Habit Coincides With Lizzy Finally Taking More Photos",p:"Coincidence, insists everyone involved, unconvincingly."},
 {h:"Sources Say Mystery Man Awaiting Photos and Mystery Woman in Mikael's Phone May Be Connected",p:"The investigation has been quietly closed. Everyone already knew."}
];
const NEWS_SPORTS=[
 {h:'Local Hero Declared "Mr Perfect" Again',p:"Unofficial poll confirms what everyone already knew."},
 {h:"Bowling Rematch Rumours Continue to Circulate",p:"Sources close to the matter say a rematch is 'not off the table,' though no date has been confirmed."},
 {h:'"Mr Perfect" Title Successfully Defended Once More',p:"No formal challenger has stepped forward. Analysts aren't surprised."},
 {h:"Tic-Tac-Toe Rivalry Reaches New Heights",p:"The scoreboard remains close, and both sides insist they are clearly winning."},
 {h:"Heart Catch High Score Broken, Again",p:"A new record has been set. The previous record holder has been notified."},
 {h:"Local Athlete Praised for 'Surprisingly Consistent' Form",p:"Consistency, experts note, is a rare quality — especially in bowling."},
 {h:"Underdog Victory Shocks LizzyOS Sports Desk",p:"Few saw it coming. Fewer still are willing to admit they didn't see it coming."},
 {h:"Sports Desk Confirms: The Rivalry Is Not Over",p:"It was never going to be over. Everyone already knew that."},
 {h:"Mikael Blames Arcade Loss on 'Not Wearing Glasses'",p:"Witnesses note he wasn't wearing glasses during his win last week either."},
 {h:"Arcade Rematch Demanded After Mikael Cites Vision Issues",p:"Lizzy has offered to lend him her glasses. Offer remains unanswered."},
 {h:"Mikael's Arcade Excuse List Now Includes Lighting, Glasses, and 'The Machine Was Rigged'",p:"None of these excuses have been independently verified."},
 {h:"Local Man Insists He'd Have Won With Glasses. Nobody Believes Him.",p:"The glasses in question have never actually been purchased."},
 {h:"Mikael's Arcade Glasses Excuse Now Directly Tied to Ongoing Vision Investigation",p:"Analysts say the timeline finally makes sense."},
 {h:"Local Man Blames Loss on Eyesight, Cannot Identify Which Machine He Was Playing",p:"He insists this detail is 'not relevant.'"},
 {h:"Mikael Demands Rematch, Insists Glasses Would Change Everything This Time",p:"Lizzy notes he said the exact same thing last time."}
];
const NEWS_QUOTES=[
 "Leadership is not about being perfect. It is about showing up, being kind, and occasionally bringing snacks.",
 "A good week is measured less in achievements and more in laughs shared along the way.",
 "The strength of LizzyOS has never been the system. It has always been the people who show up for it.",
 "Progress doesn't need to be loud. Sometimes it's just showing up again tomorrow.",
 "We don't need everything to go perfectly. We just need to keep choosing to try.",
 "Small, consistent things — a saved Micky Buc, a shared laugh — add up to something real.",
 "Every day someone opens LizzyOS is a day worth acknowledging. Thank you for showing up.",
 "The best policy this office has ever passed is simply: be kind, and keep going.",
 "My fellow citizens, remember: you do not need to have everything figured out. Sometimes you just need to survive Monday.",
 "Never compare your Chapter 1 to someone else's Chapter 20. Unless they're Lizzy. Then obviously compare yourself.",
 "Believe in yourself. And if that doesn't work, believe in the fact that you've already come this far.",
 "Life is too short to worry about people who don't like you. Unless Lizzy doesn't like you. Then we need to investigate.",
 "Some days you conquer the world. Other days, getting out of bed is the achievement. Both count.",
 "Remember, citizens: progress is progress, even if your progress today was simply replying to one email.",
 "Do not be afraid to fail. Be afraid of never trying because you were too busy overthinking.",
 "The government encourages everyone to chase their dreams. Except Micky's dream of owning a pair of jeans. That man has suffered enough.",
 "Surround yourself with people who make you laugh, support you, and tell you when you're being ridiculous.",
 "To anyone having a bad day: tomorrow is another opportunity. Unless you're Lizzy and you've already scheduled a nap.",
 "You are capable of more than you think. You have survived every difficult day you've faced so far.",
 "Do not let one bad moment convince you that you are having a bad life.",
 "Sometimes the bravest thing you can do is keep going.",
 "The President would like to remind everyone that asking for help is not weakness. It is called outsourcing.",
 "You don't have to be perfect to be proud of yourself.",
 "Make mistakes. Learn from them. Grow. And preferably don't make the exact same mistake seventeen times.",
 "Be kind. You never know what someone else is carrying.",
 "The nation is proud of you. Yes, you specifically.",
 "Rest when you need to. Even elite athletes need recovery. Lizzy has demonstrated this principle extensively.",
 "And finally: if today feels impossible, just take it one step at a time. Tomorrow can worry about itself.",
 "My fellow citizens, today I address the nation on an issue of great importance: Lizzy needs more pillows.",
 "I have reviewed Lizzy's pillow situation. Frankly, the bed is running out of space before she runs out of pillows.",
 "Every part of the body deserves comfort. If Lizzy says it needs a pillow, the government will investigate.",
 "The government has attempted to count Lizzy's shoes. We have given up.",
 "I would like to congratulate Lizzy on her arcade victory. We will not discuss what happened at bowling.",
 "The bowling defeat was unfortunate. The arcade victory was impressive. The President officially declares the sporting rivalry unresolved.",
 "Lizzy may have lost at bowling, but she has won something far more important: our admiration.",
 "My fellow citizens, never let one defeat define you. Unless it's a bowling defeat. Then demand a rematch.",
 "If you fall down seven times, get up eight. If Lizzy loses at bowling, challenge the scoreboard.",
 "Remember: failure is not the opposite of success. It is part of success. Unless you lose to Lizzy at the arcade.",
 "I have been advised that 50 million pairs of identical shoes is excessive. I have also been advised not to tell Lizzy.",
 "A wise citizen once said, \"You can never have too many pillows.\" That citizen was Lizzy.",
 "The President would like to remind everyone that buying another pair of shoes is not technically an emergency. Lizzy has requested that we reconsider.",
 "Some people bring sunshine wherever they go. Lizzy brings sunshine, attitude and approximately seventeen shopping bags.",
 "To Lizzy: never forget how special you are. Even the government has noticed.",
 "You don't need to be perfect. You just need to keep trying — and perhaps occasionally stop buying things you already own.",
 "Life is too short to worry about what everyone thinks. Unless everyone thinks you need another pillow. Then perhaps listen.",
 "I encourage everyone to chase their dreams. Lizzy is encouraged to chase her bowling rematch.",
 "Today's national message is simple: protect your peace, protect your happiness and protect your favourite pillows.",
 "The nation has faced many challenges. Rising prices. Global uncertainty. Lizzy's shopping habits. But together, we will survive.",
 "I have received reports that Lizzy is having a difficult day. My message to her is simple: you are stronger than you think.",
 "There is no shame in resting. Even the greatest warriors need a comfortable bed surrounded by an unreasonable number of pillows.",
 "To anyone struggling today: take a breath. You don't have to solve everything at once.",
 "And to Lizzy: please remember that you're doing better than you think you are.",
 "The President officially declares Lizzy a national treasure. Treasury has objected due to the cost of maintaining her shoe collection.",
 "I have one final message: be kind, be brave, laugh often and never underestimate the importance of a properly positioned pillow.",
 "The government confirms that Lizzy is allowed to have as many pillows as she wants. Parliament has been informed.",
 "We asked Lizzy how many pillows are enough. She replied, \"There is no such number.\"",
 "The President has reviewed the evidence and confirms that Lizzy is, in fact, pretty great.",
 "My fellow citizens, today's most important economic indicator is Lizzy's happiness. If she's happy, we're doing something right.",
 "Some victories are big. Some are small. Some happen at an arcade after a devastating bowling defeat.",
 "Never be embarrassed by losing. Losing teaches you how to win. And sometimes it teaches you that you need to practise your bowling.",
 "I would like to congratulate Lizzy on her arcade victory. Micky has requested that this statement be withdrawn.",
 "The President refuses to comment on the bowling match. However, the scoreboard speaks for itself.",
 "Lizzy, keep being you. The world already has enough ordinary people.",
 "Your value is not measured by your achievements, your bank balance or how many pillows fit on your bed.",
 "Although, in Lizzy's case, the number of pillows remains an important national statistic.",
 "We must remember to celebrate the little things: good food, good music, good company and winning at the arcade.",
 "The nation may disagree on many things. But surely we can all agree that Lizzy deserves a comfortable pillow.",
 "And if there is one thing I have learned during my presidency, it is this: never argue with Lizzy about pillows.",
 "My fellow citizens, I have reviewed the nation's problems. Unfortunately, I have no idea how to fix them. But Lizzy looks lovely today.",
 "The government has examined Lizzy's shoe collection. We have concluded that she has enough. She has disagreed with the government.",
 "I would like to officially announce that Lizzy is correct. We don't know what she was arguing about, but she's probably correct.",
 "Citizens, please remain calm. Lizzy has entered a shopping centre. We have deployed financial assistance.",
 "I have been informed that Lizzy is postponing Hyrox. Again. At this stage, we have stopped asking questions.",
 "Today I ask all citizens to believe in themselves. And if that doesn't work, have a snack and try again.",
 "Never give up on your dreams. Unless your dream is owning 50 million identical pairs of shoes. Then perhaps reconsider.",
 "Lizzy, you are allowed to have bad days. You are also allowed to have great days. You are not, however, allowed to say you aren't amazing.",
 "The nation has many important issues. Lizzy's happiness is now officially one of them.",
 "I would like to remind everyone that money cannot buy happiness. But apparently it can buy shoes, and Lizzy seems very happy about that.",
 "My administration supports healthy lifestyles. We also support postponing things when absolutely necessary. Lizzy has mastered the second part.",
 "To the people: drink water, get enough sleep and stop checking your bank balance every five minutes.",
 "We have introduced a new national holiday: Do Nothing Day. Lizzy has informed us she celebrates this already.",
 "I have been advised to stop making announcements about Lizzy. I have ignored this advice.",
 "Citizens, remember that comparison is the thief of joy. Unless you're comparing your shoe collection to Lizzy's. Then you're simply losing.",
 "If at first you don't succeed, try again. If that doesn't work, blame the economy.",
 "Today's presidential advice: don't take criticism from someone you'd never ask for advice.",
 "Be kind. Be patient. Be grateful. And for the love of everything, stop buying things you already own.",
 "Lizzy has been informed that she already owns enough shoes. She has requested that this statement be removed from the record.",
 "The government wishes Lizzy a wonderful day. The Treasury wishes her a less expensive day.",
 "My fellow citizens, sometimes life knocks you down. Get back up. Unless you're tired. Then sit down for five minutes.",
 "You don't have to be perfect. You just have to keep moving forward. Unless you're doing Hyrox. Lizzy has chosen another strategy.",
 "I have personally reviewed Lizzy's situation. My conclusion is simple: she's a little chaotic, but we like her.",
 "The President has one final announcement: Lizzy deserves to know that she is appreciated.",
 "And if anyone tells Lizzy otherwise, please report them directly to my office.",
];
const NEWS_TICKER=[
 "COST OF LIVING HAS INCREASED — LIZZY HAS DECIDED THIS IS A PERSONAL ATTACK.",
 "BANK OFFICIALS CONFIRM LIZZY HAS MONEY. They cannot confirm for how long.",
 "NEW TAX PROPOSED ON PEOPLE WHO SAY \"IT'S ONLY R___.\"",
 "MICKY'S BANK INTRODUCES THE LIZZY FUND — MONEY DEPOSITED IMMEDIATELY DISAPPEARS.",
 "LIZZY REQUESTS 50 MILLION PAIRS OF THE SAME SHOES. BANK ASKS WHY. LIZZY: \"BECAUSE I LIKE THEM.\"",
 "FINANCIAL EXPERTS HAVE CONFIRMED THAT OWNING 50 PAIRS OF THE SAME SHOES IS NOT TECHNICALLY AN INVESTMENT.",
 "MINIMUM WAGE HAS GONE UP. LIZZY'S SHOPPING WAGE HAS GONE UP EVEN FASTER.",
 "LIZZY'S BANK ACCOUNT HAS BEEN PLACED ON LIFE SUPPORT.",
 "MICKY ATTEMPTS TO INTRODUCE A MONTHLY BUDGET. LIZZY DECLINES TO PARTICIPATE.",
 "NEW SAVINGS PLAN ANNOUNCED: LIZZY WILL SAVE EVERYTHING SHE DOESN'T SPEND.",
 "BANK STATEMENT REVEALS MULTIPLE PURCHASES DESCRIBED ONLY AS \"NECESSARY.\"",
 "MICKY ASKS LIZZY TO SAVE MONEY. LIZZY ASKS MICKY WHY HE DOESN'T HAVE JEANS.",
 "TREASURY CONSIDERS A NEW \"LIZZY TAX\" TO OFFSET NATIONAL RETAIL SPENDING.",
 "BANK MANAGER: \"WE HAVE NEVER SEEN ANYONE TURN MONEY INTO RECEIPTS THIS QUICKLY.\"",
 "LIZZY DISCOVERS A SALE. ECONOMISTS IMMEDIATELY DECLARE A STATE OF EMERGENCY.",
 "MICKY'S FINANCIAL ADVICE: SAVE FIRST, SPEND LATER. LIZZY'S ADVICE: MIND YOUR BUSINESS.",
 "BREAKING: LIZZY HAS CHECKED HER BANK BALANCE. SHE WILL NOT BE TAKING QUESTIONS.",
 "THE BANK HAS LOST TRACK OF HOW MANY PAIRS OF SHOES LIZZY OWNS.",
 "MICKY'S EMERGENCY FUND: R500. LIZZY'S EMERGENCY: \"I NEED THESE.\"",
 "BANK OFFICIALS CONCLUDE: LIZZY MAY NOT BE FINANCIALLY RESPONSIBLE, BUT SHE IS VERY GOOD FOR THE ECONOMY.",
 "MICKY'S BANK HAS INTRODUCED A NEW ACCOUNT: CHEQUE, SAVINGS & LIZZY'S SHOPPING FUND.",
 "FINANCIAL MARKETS RALLY AFTER LIZZY PROMISES NOT TO SHOP TODAY.",
 "MARKETS CRASH AFTER LIZZY ENTERS THE MALL.",
 "LIZZY SAYS SHE'S \"JUST LOOKING.\" RETAILERS PREPARE FOR WAR.",
 "MICKY'S BANK ANNOUNCES NEW POLICY: NO FINANCIAL ADVICE WILL BE GIVEN TO PEOPLE WHO BUY 50 IDENTICAL SHOES.",
 "BREAKING: MICKY STILL DOES NOT OWN A SINGLE PAIR OF JEANS.",
 "FASHION EXPERTS BAFFLED: LOCAL MAN HAS SURVIVED 21 YEARS WITHOUT JEANS.",
 "MICKY ENTERS CLOTHING STORE. EMPLOYEES ASK IF HE NEEDS HELP FINDING JEANS. HE LEAVES.",
 "REPORT: MICKY'S WARDROBE CONSISTS OF SPORTS CLOTHES AND THE OCCASIONAL ATTEMPT AT FORMAL WEAR.",
 "MICKY CLAIMS JEANS ARE \"UNNECESSARY.\" FASHION INDUSTRY DISAGREES.",
 "LIZZY HAS BEEN TASKED WITH FIXING MICKY'S WARDROBE. NATIONAL SECURITY ALERT ISSUED.",
 "EXPERTS SAY MICKY MAY EVENTUALLY BUY JEANS. Experts refuse to say when.",
 "LIZZY WANTS 50 MILLION PAIRS OF THE SAME SHOES — CALLS IT \"BUILDING A COLLECTION.\"",
 "LIZZY SEES SHOES SHE ALREADY OWNS. BUYS THEM AGAIN.",
 "BANK OFFICIALS ASK: \"HOW MANY PAIRS DO YOU ACTUALLY NEED?\" LIZZY: \"NEXT QUESTION.\"",
 "SHOE INDUSTRY REPORTS RECORD PROFITS FOLLOWING LIZZY'S LATEST SHOPPING TRIP.",
 "LIZZY CLAIMS ALL 50 PAIRS ARE DIFFERENT. INVESTIGATION FINDS THEY ARE THE EXACT SAME SHOE.",
 "NEW STUDY FINDS LIZZY HAS MORE SHOES THAN REASONS TO EXPLAIN WHY SHE NEEDS THEM.",
 "HYROX TRAINING POSTPONED AGAIN — LIZZY CITES \"IMPORTANT REASONS.\"",
 "LIZZY ANNOUNCES SHE WILL DO HYROX SOON. \"SOON\" REMAINS A LEGALLY UNDEFINED TERM.",
 "HYROX ORGANISERS CONFIRM LIZZY HAS NOT YET ARRIVED.",
 "LIZZY'S HYROX PREPARATION ENTERS ITS PREPARATION PHASE.",
 "MICKY ASKS WHEN HYROX IS HAPPENING. LIZZY: \"DON'T WORRY ABOUT IT.\"",
 "BREAKING: LIZZY HAS POSTPONED HYROX. AGAIN. NATIONAL FITNESS COMMUNITY IN SHOCK.",
 "EXPERTS PREDICT LIZZY WILL COMPLETE HYROX EVENTUALLY. Experts have declined to provide a year.",
 "LIZZY'S TRAINING PLAN: 1. Think about HYROX. 2. Postpone HYROX. 3. Repeat.",
 "MICKY DESCRIBES HIMSELF AS A \"FUNCTIONING CRIPPLE.\" MEDICAL COMMUNITY REQUESTS CLARIFICATION.",
 "MICKY MANAGES TO COACH SPORTS, PLAY SPORTS AND WALK AROUND — THEN COMPLAINS ABOUT HIS BODY.",
 "LOCAL COACH CLAIMS HE IS \"FINE.\" HIS KNEES HAVE ISSUED A STATEMENT DISAGREEING.",
 "MICKY'S BODY ENTERS RECOVERY MODE AFTER WALKING UP TWO FLIGHTS OF STAIRS.",
 "MICKY REFUSES TO REST — BODY FILES FORMAL COMPLAINT.",
 "SPORTS MEDICINE EXPERTS ASK MICKY TO LISTEN TO HIS BODY. MICKY SAYS HE DOESN'T TAKE ORDERS FROM PEOPLE WITH NO WHISTLE.",
 "MICKY'S LEGS HAVE ANNOUNCED THEY WILL NO LONGER BE ACCEPTING OVERTIME.",
 "COACH MICKY PREACHES FITNESS WHILE HIS OWN BODY REQUESTS EARLY RETIREMENT.",
 "BREAKING: MICKY HAS COMPLETED A PHYSICAL ACTIVITY WITHOUT COMPLAINING. WITNESSES CALL IT A MIRACLE.",
 "LIZZY DECLARES NAPS AN ESSENTIAL PART OF ATHLETIC RECOVERY.",
 "MICKY CLAIMS HE CAN COOK. SOURCES SAY HE CAN MAKE INSTANT NOODLES.",
 "LIZZY'S OUTFIT RECEIVES MORE COMPLIMENTS THAN MICKY'S ENTIRE WARDROBE.",
 "MICKY SPENDS 30 MINUTES GETTING READY — STILL LOOKS LIKE HE'S GOING TO COACH.",
 "LIZZY TAKES 47 MINUTES TO PICK AN OUTFIT. MICKY TAKES 47 SECONDS.",
 "SPORTS EXPERTS CONFIRM MICKY WILL TURN ANY ACTIVITY INTO A COMPETITION.",
 "LIZZY CLAIMS SHE IS \"NOT COMPETITIVE.\" MICKY HAS REQUESTED THE RECORD BE CORRECTED.",
 "MICKY CHALLENGES LIZZY TO A COMPETITION. LIZZY ACCEPTS BEFORE HE FINISHES THE SENTENCE.",
 "FITNESS INDUSTRY INTRODUCES NEW CATEGORY: \"I'LL START TOMORROW.\"",
 "LIZZY ANNOUNCES NEW FITNESS PLAN: THINK POSITIVE, STRETCH SOMETIMES, POSTPONE HYROX.",
 "SHOCK UPSET: LIZZY DEFEATED BY MIKAEL IN BOWLING",
 "BOWLING WORLD STUNNED AS LIZZY SUFFERS UNEXPECTED DEFEAT",
 "LIZZY ENTERED AS FAVOURITE — LEFT WITH QUESTIONS",
 "MIKAEL PULLS OFF MASSIVE BOWLING UPSET",
 "EXPERTS HAD LIZZY WINNING — EXPERTS WERE WRONG",
 "LIZZY'S BOWLING CAMPAIGN ENDS IN HEARTBREAK",
 "MASSIVE UPSET: MIKAEL CLAIMS BOWLING VICTORY",
 "LIZZY DEMANDS IMMEDIATE REMATCH AFTER SHOCK DEFEAT",
 "BOWLING ANALYSTS: \"WE DID NOT SEE THAT COMING.\"",
 "MIKAEL CELEBRATES HISTORIC BOWLING WIN — LIZZY REFUSES TO COMMENT",
 "LIZZY'S BOWLING SCORE ENTERS THE HISTORY BOOKS — FOR THE WRONG REASONS",
 "NATION ASKS: WAS LIZZY OVERCONFIDENT?",
 "MIKAEL DECLARES BOWLING VICTORY \"ONE OF THE GREATEST ACHIEVEMENTS OF MY LIFE\"",
 "LIZZY VOWS TO RETURN STRONGER — BOWLING ALLEY ON HIGH ALERT",
 "SPORTS WORLD STILL PROCESSING THE LIZZY BOWLING UPSET",
 "LIZZY GETS REVENGE: DESTROYS MIKAEL AT THE ARCADE",
 "MIKAEL'S BOWLING GLORY LASTS ONLY UNTIL THE ARCADE",
 "LIZZY DOMINATES ARCADE — MIKAEL LEFT SEARCHING FOR ANSWERS",
 "ARCADE CHAMPIONSHIP: LIZZY 1 — MIKAEL 0",
 "LIZZY CLAIMS ARCADE VICTORY — CALLS IT \"JUST BUSINESS\"",
 "MASSIVE ARCADE WIN: LIZZY RESTORES HER SPORTING REPUTATION",
 "MIKAEL WINS BOWLING, LIZZY WINS ARCADE — SPORTING RIVALRY OFFICIALLY DECLARED",
 "LIZZY REFUSES TO DISCUSS BOWLING BUT IS HAPPY TO DISCUSS HER ARCADE WIN",
 "ARCADE EXPERTS CONFIRM LIZZY WAS ABSOLUTELY COOKING",
 "MICKY'S DAILY CRAIC SPORTING DESK DECLARES THE SERIES 1–1",
 "LIZZY CHALLENGES THE NATION TO FIND SOMETHING SHE CAN'T WIN AT",
 "LOCAL SPORTING LEGEND DISCOVERED — LIZZY'S CONFIDENCE REMAINS UNBEATEN",
 "SPORTS ANALYSTS SAY LIZZY IS EXTREMELY COMPETITIVE — LIZZY DISAGREES",
 "LIZZY CLAIMS SHE \"DOESN'T CARE ABOUT WINNING\" — SOURCES DISAGREE",
 "MYSTERY SPORTING EVENT ANNOUNCED — LIZZY ALREADY CLAIMS VICTORY",
 "LIZZY BELIEVES A BED CANNOT HAVE TOO MANY PILLOWS",
 "NEW LIZZY THEORY: EVERY PART OF THE HUMAN BODY DESERVES ITS OWN PILLOW",
 "PILLOW INDUSTRY REPORTS RECORD PROFITS AFTER LIZZY'S LATEST BEDROOM EXPANSION",
 "LIZZY'S BED NOW CONTAINS MORE PILLOWS THAN ACTUAL BED",
 "EXPERTS ASK HOW MANY PILLOWS ARE ENOUGH — LIZZY REFUSES TO RECOGNISE THE QUESTION",
 "LIZZY DECLARES: \"YOUR KNEES NEED PILLOWS TOO.\"",
 "NEW STUDY: LIZZY WOULD RATHER REMOVE THE BED THAN REMOVE A PILLOW",
 "LIZZY'S PILLOW COLLECTION HAS OFFICIALLY BECOME A FURNITURE ISSUE",
 "REPORT: LIZZY SLEEPS SURROUNDED BY ENOUGH PILLOWS TO START A SMALL HOTEL",
 "PILLOW SHORTAGE FEARED AFTER LIZZY VISITS HOMEWARE STORE",
 "LIZZY INTRODUCES NEW BEDTIME RULE: IF THERE'S SPACE, ADD ANOTHER PILLOW",
 "LOCAL WOMAN CLAIMS HER BODY HAS \"PILLOW REQUIREMENTS\"",
 "SCIENTISTS BAFFLED BY LIZZY'S BELIEF THAT EVEN HER TOES DESERVE PILLOW SUPPORT",
 "BEDDING INDUSTRY NAMES LIZZY THEIR MOST VALUABLE CUSTOMER",
 "LIZZY REFUSES TO SLEEP UNTIL EVERY BODY PART HAS BEEN PROPERLY ACCOMMODATED",
 "SHOE COLLECTION EXPANDS DESPITE LIZZY ALREADY OWNING THE EXACT SAME PAIR",
 "LIZZY CLAIMS SHE HAS NOTHING TO WEAR — WARDROBE DISAGREES",
 "FASHION EXPERTS CONFIRM LIZZY COULD KEEP THE SHOE INDUSTRY ALIVE SINGLE-HANDEDLY",
 "LIZZY ENTERS SHOPPING CENTRE — BANK ACCOUNT IMMEDIATELY GOES INTO DEFENSIVE MODE",
 "LOCAL WOMAN SPENDS THREE HOURS SHOPPING AND RETURNS HOME WITH \"JUST A FEW THINGS\"",
 "LIZZY'S WARDROBE REQUIRES ITS OWN CENSUS",
 "SHOE STORAGE CRISIS: LIZZY RUNS OUT OF SPACE BEFORE RUNNING OUT OF SHOES",
 "LIZZY SEES SOMETHING CUTE — PURCHASE BECOMES \"ESSENTIAL\"",
 "EXPERTS DISCOVER LIZZY'S FAVOURITE COLOUR IS APPARENTLY \"WHATEVER LOOKS GOOD.\"",
 "LIZZY DECLARES HERSELF READY FOR A SHOPPING BAN — BAN LASTS APPROXIMATELY 14 MINUTES",
 "NEW FASHION REPORT: LIZZY HAS ONCE AGAIN LOOKED BETTER THAN EVERYONE EXPECTED",
 "LIZZY'S OUTFIT RECEIVES FIVE-STAR REVIEW FROM COMPLETELY UNQUALIFIED SOURCES",
 "COST OF LIVING HAS INCREASED — LIZZY REQUESTS EMERGENCY SHOPPING RELIEF",
 "ARE TAXES COMING SOON? LIZZY ASKS WHETHER SHOES WILL BE TAX-DEDUCTIBLE",
 "MINIMUM WAGE GOES UP — LIZZY'S SHOPPING BUDGET SOMEHOW GOES UP TOO",
 "BANK ACCOUNT REPORTS \"UNUSUAL ACTIVITY\" AFTER LIZZY GOES SHOPPING",
 "LIZZY'S BANK BALANCE SEEN RUNNING FOR COVER",
 "BANK OFFICIALS CONFIRM MONEY ENTERED ACCOUNT — THEY HAVE NO IDEA WHERE IT WENT",
 "LIZZY'S SAVINGS ACCOUNT HAS BEEN DESCRIBED AS \"MORE OF A CONCEPT.\"",
 "TREASURY INVESTIGATES WHETHER 50 MILLION PAIRS OF SHOES QUALIFY AS A NATIONAL INVESTMENT",
 "BANK MANAGER ASKS LIZZY TO PLEASE STOP SAYING \"IT WAS ON SALE\"",
 "LIZZY OPENS SAVINGS ACCOUNT — SAVINGS IMMEDIATELY GO MISSING",
 "ECONOMISTS DISCOVER NEW FORM OF INFLATION: LIZZYFLATION",
 "LIZZY PROMISES TO BUDGET — FINANCIAL EXPERTS REQUEST A WRITTEN STATEMENT",
 "BANK INTRODUCES SPENDING LIMIT — LIZZY TAKES IT AS A PERSONAL INSULT",
 "LIZZY'S WALLET DECLARED A HIGH-RISK FINANCIAL INSTRUMENT",
 "NEW STUDY FINDS THE BEST SIDE OF THE BED IS WHICHEVER SIDE HAS MORE PILLOWS",
 "SCIENTISTS CONFIRM LIZZY'S BODY-PILLOW THEORY MAY HAVE NO LIMIT",
 "NATION ASKS: HOW MANY PILLOWS DOES ONE PERSON ACTUALLY NEED? LIZZY: \"YES.\"",
 "LOCAL BED REPORTEDLY SINKING UNDER WEIGHT OF PILLOWS",
 "PILLOW MANUFACTURERS CALL LIZZY \"THE DREAM CUSTOMER\"",
 "WEATHER FORECAST: 80% CHANCE OF SOMEONE SAYING \"I'M COLD\"",
 "SCIENTISTS CONFIRM THE FRIDGE DOES NOT RESTOCK ITSELF AFTER YOU CHECK IT",
 "LOCAL PERSON OPENS FRIDGE FOR SIXTH TIME — STILL NOTHING INTERESTING",
 "NATIONWIDE CRISIS: SOMEONE FINISHED THE SNACKS",
 "MYSTERY OF MISSING SOCK REMAINS UNSOLVED",
 "EXPERTS CONFIRM \"FIVE MORE MINUTES\" IS NOT A LEGALLY BINDING TIMEFRAME",
 "NEW STUDY FINDS PEOPLE ARE 400% MORE PRODUCTIVE WHEN THEY HAVE SOMETHING ELSE THEY SHOULD BE DOING",
 "SCIENTISTS CONFIRM ONE MORE EPISODE ALMOST NEVER MEANS ONE MORE EPISODE",
 "NATION CELEBRATES AS SOMEONE FINALLY CLEANS THEIR ROOM",
 "BREAKING: BED FOUND TO BE MORE COMFORTABLE WHEN YOU HAVE SOMEWHERE ELSE TO BE",
 "EXPERTS WARN AGAINST GOING TO THE SUPERMARKET WHILE HUNGRY",
 "LOCAL SHOPPER IGNORES WARNING — RETURNS WITH 14 UNNECESSARY ITEMS",
 "MYSTERY SOLVED: EVERYONE'S PHONE BATTERY DIES WHEN THEY NEED IT MOST",
 "SHOE SHORTAGE FEARED AFTER LIZZY ENTERS SHOPPING CENTRE",
 "LIZZY CLAIMS SHE NEEDS ANOTHER PAIR — INVESTIGATION FINDS 14 IDENTICAL PAIRS AT HOME",
 "FASHION EXPERTS CONFIRM LIZZY COULD SINGLE-HANDEDLY KEEP THE SHOE INDUSTRY ALIVE",
 "LIZZY SEES SOMETHING SHE LIKES — BANK ACCOUNT IMMEDIATELY STARTS SWEATING",
 "NEW TREND: OWNING THE SAME SHOES IN EVERY POSSIBLE COLOUR",
 "LIZZY DECLARES HERSELF \"NOT A SHOPAHOLIC\" — RETAILERS DISAGREE",
 "LOCAL WOMAN SPENDS 45 MINUTES CHOOSING AN OUTFIT — STILL SAYS \"I HAVE NOTHING TO WEAR\"",
 "LIZZY'S WARDROBE REQUIRES ITS OWN POSTAL CODE",
 "FASHION WEEK INVITES LIZZY — HER SHOE COLLECTION DEMANDS A SEPARATE INVITATION",
 "LIZZY'S PHONE STORAGE FULL — 97% OF PHOTOS ARE OUTFIT PICTURES",
 "REPORT: LIZZY HAS NEVER SEEN A MIRROR SHE DIDN'T LIKE",
 "NEW BEAUTY TREND EMERGES: LOOKING GOOD WITHOUT EVEN TRYING",
 "LIZZY'S \"QUICK SHOPPING TRIP\" LASTS THREE HOURS",
 "SHOPPING CENTRE NAMES LIZZY A FREQUENT FLYER",
 "LIZZY BUYS SOMETHING \"FOR LATER\" — LATER ARRIVES 11 MINUTES AFTER PURCHASE",
 "LOCAL WOMAN CLAIMS SHE IS SAVING MONEY WHILE ACTIVELY SHOPPING",
 "LIZZY OPENS CUPBOARD — DISCOVERS CLOTHES SHE FORGOT SHE OWNED",
 "FASHION CRISIS: LIZZY HAS RUN OUT OF PLACES TO STORE HER SHOES",
 "EXPERTS WARN LIZZY'S NEXT SHOE PURCHASE MAY REQUIRE PROPERTY DEVELOPMENT",
 "COST OF LIVING HAS INCREASED — LIZZY'S SHOPPING COST OF LIVING HAS INCREASED FASTER",
 "ARE TAXES COMING SOON? LIZZY REQUESTS EXEMPTION ON \"CUTE PURCHASES\"",
 "MINIMUM WAGE HAS GONE UP — LIZZY'S MINIMUM SHOPPING REQUIREMENT HAS ALSO GONE UP",
 "BANK ACCOUNT REPORTS \"SIGNIFICANT ACTIVITY\" FOLLOWING LIZZY'S WEEKEND",
 "LIZZY CHECKS HER BANK BALANCE — IMMEDIATELY DECIDES SHE DIDN'T NEED TO KNOW",
 "BANK OFFICIALS CONFIRM LIZZY'S MONEY IS VERY GOOD AT DISAPPEARING",
 "NEW FINANCIAL PRODUCT LAUNCHED: THE LIZZY SAVINGS ACCOUNT — NO ONE EXPECTS IT TO CONTAIN SAVINGS",
 "LIZZY'S BANK CARD REQUESTS ANNUAL LEAVE",
 "TREASURY INVESTIGATES LIZZY'S CLAIM THAT SHOES ARE \"AN INVESTMENT\"",
 "BANK MANAGER: \"WE'VE SEEN HER BALANCE. WE'RE GIVING HER SPACE.\"",
 "LIZZY PROMISES TO SAVE MONEY — ECONOMISTS WAIT FOR EVIDENCE",
 "NEW BUDGET APPROVED — LIZZY IMMEDIATELY SPENDS THE EMERGENCY FUND",
 "LIZZY DISCOVERS A SALE — FINANCIAL MARKETS ENTER FREEFALL",
 "BANK WARNS CUSTOMERS AGAINST \"JUST ONE MORE PURCHASE\"",
 "LIZZY RESPONDS: \"BUT THIS ONE IS DIFFERENT.\"",
 "LIZZY'S WALLET DECLARED A PROTECTED SPECIES",
 "BANK LAUNCHES NEW SECURITY SYSTEM AFTER LIZZY'S SHOPPING TRIP",
 "FINANCIAL EXPERTS ASK LIZZY TO EXPLAIN HER SPENDING — SHE ASKS THEM TO LEAVE",
 "BANK CONFIRMS: LIZZY IS RICH IN PERSONALITY, IF NOT IN HER BANK BALANCE",
 "NATION STILL WAITING FOR ANSWER TO THE MOST IMPORTANT QUESTION: WHAT ARE WE HAVING FOR DINNER?",
 "LOCAL WOMAN OPENS FRIDGE FOR FIFTH TIME — NOTHING NEW FOUND",
 "SCIENTISTS CONFIRM BED IS 73% MORE COMFORTABLE WHEN YOU SHOULD BE GETTING UP",
 "NATIONAL SHORTAGE OF MOTIVATION REPORTED ON MONDAY MORNING",
 "MYSTERY DEEPENS AS ONE SOCK DISAPPEARS FROM WASHING MACHINE",
 "EXPERTS CONFIRM \"I'M ON MY WAY\" DOES NOT NECESSARILY MEAN SOMEONE IS ON THEIR WAY",
 "NATION CELEBRATES AFTER SOMEONE ACTUALLY REPLIES TO THE GROUP CHAT",
 "SCIENTISTS DISCOVER THAT ONE MORE EPISODE IS NEVER ACTUALLY ONE MORE EPISODE",
 "BREAKING: PERSON WHO SAID \"I'LL SLEEP EARLY TONIGHT\" SEEN ONLINE AT 2:13AM",
 "NEW STUDY FINDS PEOPLE BECOME MORE PRODUCTIVE EXACTLY 10 MINUTES BEFORE A DEADLINE",
 "LOCAL CITIZEN SPENDS 20 MINUTES LOOKING FOR PHONE WHILE HOLDING PHONE",
 "NATION DEMANDS ANSWERS AFTER SOMEONE FINISHES THE MILK AND RETURNS EMPTY CARTON",
 "MYSTERIOUS FORCE CONTINUES TO TURN CLEAN ROOMS INTO MESSY ROOMS OVERNIGHT",
 "SCIENTISTS DISCOVER THAT \"I'M JUST GOING TO HAVE A LOOK\" IS ONE OF THE MOST EXPENSIVE SENTENCES IN ENGLISH",
 "LOCAL WOMAN CONTINUES TO MAKE PEOPLE SMILE WITHOUT EVEN TRYING",
 "LIZZY OFFICIALLY DECLARED TOO SPECIAL TO BE REPLACED",
 "NEW STUDY CONFIRMS: DAYS ARE BETTER WHEN LIZZY IS HAVING A GOOD DAY",
 "LIZZY'S SMILE CAUSES UNEXPECTED BOOST IN NATIONAL MOOD",
 "EXPERTS AGREE LIZZY IS SOMEONE WORTH KEEPING AROUND",
 "LIZZY REMINDED THAT SHE IS DOING BETTER THAN SHE THINKS",
 "NATION CELEBRATES LIZZY FOR SIMPLY BEING HERSELF",
 "LIZZY NAMED \"MOST LIKELY TO MAKE AN ORDINARY DAY FEEL SPECIAL\"",
 "OFFICIAL REPORT: LIZZY IS 10% ATTITUDE, 90% HEART",
 "LIZZY'S LAUGH DECLARED A NATIONAL TREASURE",
 "GOVERNMENT ANNOUNCES THAT LIZZY IS PERMITTED TO HAVE A GREAT DAY EVERY DAY",
 "SCIENTISTS UNABLE TO EXPLAIN HOW LIZZY CAN BE BOTH CHAOTIC AND ADORABLE",
 "LIZZY CONTINUES TO BE THE MAIN CHARACTER — SOURCES SAY SHE DIDN'T EVEN ASK FOR THE ROLE",
 "NATION AGREES: LIZZY DESERVES MORE FLOWERS",
 "SPECIAL REPORT: SOME PEOPLE ARE JUST WORTH THE EXTRA EFFORT — LIZZY IS ONE OF THEM",
 "LIZZY CLAIMS SHE'S \"NOT MAD\" — NATION PREPARES FOR CONSEQUENCES",
 "LIZZY SAYS \"DO WHATEVER YOU WANT\" — EXPERTS WARN AGAINST IT",
 "LOCAL WOMAN SAYS \"I DON'T CARE\" — CLEARLY CARES",
 "LIZZY RESPONDS \"K\" — MICKY'S DAILY NEWS DECLARES NATIONAL EMERGENCY",
 "LIZZY HAS ENTERED HER SILENT ERA — EVERYONE IS NOW SCARED",
 "REPORT: LIZZY'S ATTITUDE REMAINS STRONG DESPITE ZERO EVIDENCE",
 "LIZZY WINS ARGUMENT SHE WASN'T EVEN SUPPOSED TO BE HAVING",
 "WITNESSES REPORT LIZZY WAS RIGHT AGAIN",
 "LIZZY DENIES BEING DIFFICULT — SOURCES HAVE REQUESTED AN INVESTIGATION",
 "NATION ASKS: HOW DOES SHE ALWAYS GET THE LAST WORD?",
 "LIZZY SAYS \"I'M FINE\" — NOBODY BELIEVES HER",
 "MYSTERY SOLVED: LIZZY WASN'T IGNORING ANYONE, SHE WAS JUST BUSY BEING ICONIC",
 "BREAKING: LIZZY CONFIRMS MOST MEN ARE ANNOYING — EXCEPTION MADE FOR ONE PARTICULAR GUY",
 "LIZZY DECLARES: \"MEN ARE EXHAUSTING\" — THEN IMMEDIATELY MAKES AN EXCEPTION",
 "SCIENTISTS BAFFLED AS LIZZY SOMEHOW FINDS ONE MAN SHE ACTUALLY LIKES",
 "NATION ASKS: WHAT MAKES THIS PARTICULAR GUY DIFFERENT? LIZZY REFUSES TO COMMENT",
 "LIZZY'S PATIENCE FOR MEN REPORTEDLY HAS A VERY SHORT EXPIRY DATE",
 "MEN ADVISED TO APPROACH LIZZY WITH CAUTION — ONE PARTICULAR GUY HAS SPECIAL CLEARANCE",
 "LIZZY COMPLAINS ABOUT MEN FOR 20 MINUTES — THEN TALKS ABOUT HER FAVOURITE GUY",
 "EXPERTS CONFIRM LIZZY HAS A VERY SPECIFIC TYPE — DETAILS REMAIN CLASSIFIED",
 "LIZZY'S \"I DON'T LIKE MEN\" POLICY FACES MAJOR LOOPHOLE",
 "BREAKING: PRESIDENTIAL OFFICE CONFIRMS LIZZY MAY HAVE A CRUSH ON THE PRESIDENT",
 "LIZZY'S CRUSH ON THE PRESIDENT BECOMES IMPOSSIBLE TO HIDE",
 "PRESIDENTIAL APPROVAL RATINGS RISE AFTER LIZZY ADMITS SHE HAS A CRUSH",
 "WHITE HOUSE SOURCES SAY LIZZY'S PRESIDENTIAL CRUSH IS \"VERY SERIOUS\"",
 "LIZZY DENIES HAVING A CRUSH ON THE PRESIDENT — SOURCES SAY HER FACE TELLS A DIFFERENT STORY",
 "PRESIDENT RECEIVES UNEXPECTED SUPPORT FROM LIZZY — MOTIVES UNDER INVESTIGATION",
 "NATION ASKS WHETHER LIZZY'S PRESIDENTIAL CRUSH CONSTITUTES A CONFLICT OF INTEREST",
 "LIZZY CLAIMS SHE IS \"JUST ADMIRING THE PRESIDENT\" — INVESTIGATION CONTINUES",
 "PRESIDENTIAL SPEECH INTERRUPTED AFTER LIZZY WAS SPOTTED SMILING SUSPICIOUSLY",
 "EXPERTS SAY LIZZY'S CRUSH ON THE PRESIDENT MAY BE THE COUNTRY'S CUTEST POLITICAL DEVELOPMENT",
 "LIZZY REMINDS NATION THAT SHE CAN DISLIKE MEN AND STILL MAKE ONE VERY SPECIFIC EXCEPTION",
 "LOVE EXPERTS CONFIRM: IF LIZZY ACTUALLY LIKES YOU, YOU'RE PROBABLY DOING SOMETHING RIGHT",
 "LIZZY'S HEART CURRENTLY UNDER PRESIDENTIAL INVESTIGATION",
 "PALACE SOURCES REPORT LIZZY HAS \"FEELINGS\" — PRESIDENT DECLINES TO COMMENT",
 "LIZZY'S ATTITUDE REMAINS UNCHANGED — EXCEPT WHEN A CERTAIN SOMEONE WALKS INTO THE ROOM",
 "LOCAL WOMAN CLAIMS SHE DOESN'T HAVE A FAVOURITE MAN — SOURCES HAVE PHOTOGRAPHIC EVIDENCE",
 "LIZZY OFFICIALLY DECLARES MIKAEL 'THE PICKIEST EATER IN LIZZYOS HISTORY.'",
 "BREAKING: MIKAEL REJECTS PERFECTLY GOOD FOOD FOR THE THIRD TIME THIS WEEK.",
 "SOURCES CONFIRM MIKAEL HAS STRONG OPINIONS ABOUT SAUCE TOUCHING OTHER FOOD.",
 "LIZZY DEMANDS MIKAEL 'JUST TRY IT ONCE' FOR THE 47TH TIME.",
 "STUDY FINDS MIKAEL'S APPROVED FOOD LIST SHORTER THAN A GROCERY RECEIPT.",
 "MIKAEL SPOTTED PICKING SOMETHING OFF HIS PLATE AGAIN. LIZZY UNIMPRESSED.",
 "LIZZY DEFENDS CODY AGAIN. MIKAEL REQUESTS A SECOND OPINION.",
 "REPORT: CODY COULD DO LITERALLY ANYTHING AND LIZZY WOULD FIND A WAY TO JUSTIFY IT.",
 "LIZZY RULES IN CODY'S FAVOUR FOR THE 100TH CONSECUTIVE TIME.",
 "MIKAEL CALLS FOR AN INDEPENDENT INQUIRY INTO LIZZY'S CODY BIAS. REQUEST DENIED — BY LIZZY.",
 "BREAKING: CODY DOES SOMETHING QUESTIONABLE. LIZZY DECLARES IT 'ICONIC BEHAVIOUR.'",
 "ANALYSTS CONFIRM LIZZY'S LOYALTY TO CODY REMAINS UNDEFEATED.",
 "LIZZY CALLS MIKAEL A STALKER. MIKAEL CITES 'BATMAN DUTIES' AS DEFENSE.",
 "MIKAEL DEFENDS TRACKING LIZZY'S WHEREABOUTS AS 'STANDARD VIGILANTE PROCEDURE.'",
 "SOURCES CONFIRM MIKAEL HAS NOT DENIED BEING BATMAN. OR A STALKER.",
 "LIZZY FILES FORMAL COMPLAINT AGAINST MIKAEL'S 'SURVEILLANCE HABITS.' COMPLAINT DISMISSED — BY MIKAEL.",
 "MIKAEL INSISTS KNOWING LIZZY'S EVERY MOVE IS 'JUST GOOD DETECTIVE WORK.'",
 "BREAKING: MIKAEL SPOTTED 'PATROLLING' NEAR LIZZY AGAIN. CALLS IT COINCIDENCE.",
 "LIZZY'S EYESIGHT REMAINS OFFICIALLY QUESTIONABLE. GLASSES RECOMMENDED YEARS AGO.",
 "REPORT: MIKAEL NOW ALSO SQUINTING AT THINGS THAT AREN'T EVEN FAR AWAY.",
 "EXPERTS CONCERNED AS BOTH LIZZY AND MIKAEL STRUGGLE TO READ THE SAME SIGN.",
 "MIKAEL DENIES NEEDING GLASSES DESPITE WALKING INTO THE SAME DOOR TWICE.",
 "LIZZY ONCE AGAIN WALKS PAST SOMEONE SHE KNOWS WITHOUT NOTICING. GLASSES STILL UNTOUCHED.",
 "SCIENTISTS BAFFLED: HOW ARE THEY BOTH THIS BLIND AND STILL FINDING EACH OTHER.",
 "MIKAEL CLAIMS HE COULD FIND LIZZY BLINDFOLDED. CRITICS POINT OUT HE ALREADY CAN'T SEE WELL ANYWAY.",
 "LIZZY DEFENDS CODY'S LATEST STUNT WHILE SIMULTANEOUSLY CALLING MIKAEL A STALKER FOR WORRYING.",
 "MIKAEL INSISTS HIS 'BATMAN INSTINCTS' ARE COMPLETELY UNRELATED TO HIS RECENT VISION PROBLEMS.",
 "REPORT: MIKAEL REJECTED FOOD HE COULDN'T EVEN CLEARLY SEE. EXPERTS CALL THIS 'COMMITMENT.'",
 "LIZZY ACCUSES MIKAEL OF STALKING. MIKAEL POINTS OUT HE CAN BARELY SEE HER FROM ACROSS THE ROOM.",
 "CODY ALLEGEDLY WALKS PAST MIKAEL WITHOUT CONSEQUENCE — AGAIN. LIZZY CALLS IT 'JUSTICE.'",
 "MIKAEL'S PICKY EATING AND POOR EYESIGHT NOW OFFICIALLY UNRELATED, CONFIRMS DOCTOR HE HAS NOT SEEN.",
 "SOURCES CONFIRM: MIKAEL CAN SPOT LIZZY FROM A MILE AWAY BUT NOT A MENU ITEM HE ACTUALLY LIKES.",
 "MIKAEL CLAIMS HE'D NOTICE IF CODY DID SOMETHING WRONG. SOURCES DOUBT HE COULD EVEN SEE IT HAPPEN.",
 "LIZZY'S DEFENSE OF CODY REMAINS STRONGER THAN MIKAEL'S EYESIGHT. NOT A HIGH BAR, SAY CRITICS.",
 "MIKAEL'S 'BATMAN VISION' UNDER REVIEW AFTER HE WALKED INTO THE SAME DOOR AGAIN.",
 "BREAKING: MIKAEL REFUSES FOOD HE 'DIDN'T EVEN LOOK AT PROPERLY.' LIZZY UNSURPRISED.",
];
const NEWS_BANK_ARTICLES=[
 {h:"Inside the Bank of Micky: A Financial Update",p1:"The Bank of Micky continues to operate as the only financial institution in LizzyOS fully backed by charm, confidence, and the occasional weekly bonus. This blog will hold the full story of how funds are managed, where Micky Bucs come from, and what the future holds for savers.",p2:"Here is how it works. Every Micky Buc you deposit is stored in your savings balance and stays there until you withdraw it. Keep 15 MB or more saved for seven full days and the bank pays you a +5 MB weekly bonus, claimable once per week straight from the Bank of Micky page.",p3:"Withdrawals are instant, deposits are free, and nothing is ever deducted for holding your money. The vault holds the rewards you unlock along the way, from free items to the rarer prizes that only show up now and then.",tip:"deposit early in the week, never let your savings drop below 15 MB, and claim your bonus as soon as the timer clears."},
 {h:"Why Citizens Keep Choosing the Bank of Micky",p1:"When asked why they keep banking with the Bank of Micky, most citizens cite the same three reasons: it's reliable, it's fair, and nobody has ever been charged a mystery fee.",p2:"The weekly bonus system remains the bank's most talked-about feature. Keep at least 15 MB banked for seven consecutive days and you'll unlock a +5 MB bonus, ready to claim the moment the timer clears.",p3:"Unlike other institutions, the Bank of Micky has never once changed its terms overnight. What you see is genuinely what you get, which analysts describe as 'refreshingly rare.'",tip:"set a reminder for your bonus timer, and don't withdraw the day before it clears — patience pays, literally."},
 {h:"Bank of Micky Explains: Where Do Micky Bucs Actually Come From?",p1:"A common question from newer citizens: where do Micky Bucs come from in the first place? The answer, according to bank officials, is simple — daily activity, completed missions, and the occasional generous reward.",p2:"Every deposit strengthens your standing balance, and every seven days spent above the 15 MB threshold earns a further +5 MB, no paperwork required.",p3:"The bank stresses that there is no penalty for saving slowly. Whether you deposit a little or a lot, the rules apply exactly the same way to everyone.",tip:"small, regular deposits build up faster than people expect — check your balance weekly to see the difference."},
 {h:"The Bank of Micky's Quiet Reputation for Reliability",p1:"It rarely makes headlines, and that, insiders say, is exactly the point. The Bank of Micky has spent this week doing what it always does: processing deposits and withdrawals without a single hiccup.",p2:"The weekly bonus remains unchanged — 15 MB banked for seven days earns a +5 MB reward, claimable directly from the Bank of Micky page the moment it's ready.",p3:"Officials describe this week as 'business as usual,' which, for a bank, is considered high praise.",tip:"consistency beats big deposits — a steady balance above 15 MB is the fastest route to your next bonus."},
 {h:"Why Citizens Keep Trusting the Bank of Micky",p1:"The Bank of Micky continues to attract citizens with its simple approach to banking: keep your money safe, avoid unnecessary complications, and don't charge people mysterious fees just because you can.",p2:"The institution has also developed a reputation for rewarding responsible citizens. Those who demonstrate excellent financial behaviour may even receive unexpected bonuses.",p3:"Financial analysts describe this as 'surprisingly generous,' noting that few institutions bother rewarding good habits at all.",tip:"good financial behaviour tends to get noticed here — consistency is quietly the most rewarded habit in the system."},
 {h:"Economic Experts Issue Cost-of-Living Warning",p1:"The cost of almost everything continues to rise. Groceries are more expensive. Entertainment is more expensive. Everyday essentials are more expensive.",p2:"Citizens have therefore been encouraged to think carefully before spending their hard-earned money.",p3:"Unfortunately, this advice has reportedly been ignored by at least one individual who believes that owning the same pair of shoes in multiple colours is 'financial diversification.'",tip:"before any purchase, ask whether it's a need or a colour variant of something you already own."},
 {h:"The Mystery of the Missing Money",p1:"A growing number of citizens have reported a strange phenomenon. Money enters their bank account. They feel financially secure. They check again a few days later. The money has disappeared.",p2:"Experts have investigated the matter and discovered the most likely causes include food, shopping, subscriptions, entertainment and the dangerous phrase: 'It's only a little bit of money.'",p3:"The Bank of Micky recommends tracking exactly where that 'little bit' keeps going.",tip:"if your balance keeps vanishing, the phrase 'it's only a little bit' is usually the culprit."},
 {h:"Savings Remain Important, Experts Say",p1:"Financial experts continue to encourage citizens to save a portion of their income whenever possible. Even small amounts can add up over time.",p2:"The Bank of Micky recommends having enough savings to deal with unexpected expenses, emergencies and other unfortunate situations.",p3:"The bank also recommends keeping enough money available for life's occasional treats. Because financial responsibility is important. But so is having fun.",tip:"balance matters more than perfection — save consistently, but leave room for the occasional treat."},
 {h:"Bank of Micky Issues Important Financial Advice",p1:"The Bank of Micky has released three simple rules for responsible financial management: save when you can, don't spend money you don't have, and never enter a shopping centre while saying, 'I'm just going to look.'",p2:"The third rule was added after several previous incidents. Management considers it the most important.",p3:"Officials note that all three rules are easy to understand and, apparently, much harder to actually follow.",tip:"if you catch yourself saying 'I'm just going to look,' that's already the warning sign."}
];
const NEWS_PRESIDENT_ARTICLES=[
 {p1:"To everyone inside LizzyOS: thank you. This little world runs on the people who show up for it every day, save what they can, laugh at the life lessons, and keep coming back.",p2:"The plan stays simple. Keep the bank fair, keep the rewards worth chasing, and keep adding things worth exploring. If something feels broken or unfair, say so, and it gets fixed."},
 {p1:"This week's message is a short one: keep going. Whether that means banking a few more Micky Bucs, finishing one more mission, or simply logging back in tomorrow — it all counts.",p2:"This office continues to believe that the small, everyday choices matter more than the big dramatic ones. Show up, be kind, and the rest tends to follow."},
 {p1:"A brief note to every citizen reading this: the numbers matter less than the habit. A saved Micky Buc today is worth more than a big plan you never start.",p2:"The office remains committed to keeping things fair and worth showing up for. That hasn't changed, and it isn't going to."},
 {p1:"Some weeks are quiet, and that's not a bad thing. Quiet weeks mean nothing's broken, everyone's showing up, and the system is doing exactly what it's meant to do.",p2:"As always, if something feels off, say so. This office would rather hear about a small problem early than a big one late."},
 {p1:"Life doesn't always go according to plan, and frankly, that's probably for the best. Some of the best memories come from the moments nobody planned for.",p2:"So today, this office encourages all citizens to laugh a little louder, worry a little less, and stop treating every tiny inconvenience like a national emergency. There will be difficult days, confusing days, and days when you simply need to lie down and do nothing. All three are perfectly acceptable."},
 {p1:"This office has one simple request: be kind to people. You never really know what someone else is dealing with, and sometimes a small act of kindness can completely change someone's day.",p2:"Check in on the people you care about. Tell them you appreciate them. Make them laugh. And if someone is having a bad day, perhaps offer them a snack before attempting to solve their problems. This office considers it highly effective diplomacy."},
 {p1:"Not every good moment has to be a major event. Sometimes happiness is good food, your favourite song, a ridiculous conversation, laughing until your stomach hurts, or simply spending time with someone who makes you feel comfortable being yourself.",p2:"Don't wait for something extraordinary to happen before appreciating what's already around you. The little things have a habit of becoming the big memories."},
 {p1:"This office would like to remind citizens that thinking about something forty-seven times will not necessarily make the situation clearer. Sometimes you simply need to breathe, relax, and let tomorrow deal with tomorrow.",p2:"This office therefore recommends: think less, laugh more, sleep properly, eat something. Further instructions will be issued once this office has finished overthinking this statement."},
 {p1:"If today isn't your day, that's okay. One bad day doesn't define you. One mistake doesn't define you. One disappointment doesn't define you. You are still moving forward, even when it doesn't feel like it.",p2:"Give yourself some grace. Tomorrow is another opportunity to try again. And if all else fails, get comfortable, find a good snack, and remember that this office believes in you."}
];
const NEWS_LESSON_HEADLINE_LABEL="Life Lessons With Micky";

// The previous hashDayString (a naive ×31 rolling hash) had poor
// avalanche behaviour on these near-identical day strings — in testing,
// 5 of 7 consecutive days produced the exact same "In Other News" set.
// FNV-1a seeding a proper PRNG (mulberry32) + a real Fisher-Yates shuffle
// fixes that: every day now gets a genuinely distinct selection.
function fnv1aSeed(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function mulberry32(seed){return function(){seed|=0;seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^(seed>>>15),1|seed);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296}}
function pickForToday(arr,salt){
 const dayKey=new Date().toDateString();
 const rnd=mulberry32(fnv1aSeed(dayKey+"|"+NEWS_ROTATION_VERSION+"|"+salt));
 const idx=Math.floor(rnd()*arr.length);
 return arr[idx];
}
function pickManyForToday(arr,salt,count){
 const dayKey=new Date().toDateString();
 const rnd=mulberry32(fnv1aSeed(dayKey+"|"+NEWS_ROTATION_VERSION+"|"+salt));
 const copy=arr.slice();
 for(let i=copy.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}
 return copy.slice(0,count);
}


function news(){
 currentPage="news";lastNewsDay=new Date().toDateString();
 setAddress("https://mickydailynews.lizzy");
 const today=new Date().toLocaleDateString("en-ZA",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
 const breaking=pickForToday(NEWS_BREAKING,"breaking");
 const banking=pickForToday(NEWS_BANKING,"banking");
 const lifestyle=pickForToday(NEWS_LIFESTYLE,"lifestyle");
 const sports=pickForToday(NEWS_SPORTS,"sports");
 const quote=pickForToday(NEWS_QUOTES,"quote");
 const bankArticle=pickForToday(NEWS_BANK_ARTICLES,"bankArticle");
 const presidentArticle=pickForToday(NEWS_PRESIDENT_ARTICLES,"presidentArticle");
 const ticker=pickManyForToday(NEWS_TICKER,"ticker",6);
 $("browserPage").innerHTML=`<div class="newsPage">
  <header class="newsHeader">
    <div class="newsMasthead">
      <span class="newsLogo">📰</span>
      <div>
        <h1>Micky's Daily News</h1>
        <small>Your most trusted source inside LizzyOS • ${today}</small>
      </div>
    </div>
    <div class="newsTagline">"All the news that's fit to print, and some that probably isn't."</div>
  </header>

  <section class="newsBulletin">
    <div class="newsSectionTitle">🚨 Headlines Bulletin</div>
    <div class="newsHeadlineCard featured">
      <span class="newsLabel">BREAKING</span>
      <h2>${breaking.h}</h2>
      <p>${breaking.p}</p>
      <small>Updated today</small>
    </div>
    <div class="newsHeadlineGrid">
      <div class="newsHeadlineCard">
        <span class="newsLabel">BANKING</span>
        <h3>${banking.h}</h3>
        <p>${banking.p}</p>
      </div>
      <div class="newsHeadlineCard">
        <span class="newsLabel">LIFESTYLE</span>
        <h3>${lifestyle.h}</h3>
        <p>${lifestyle.p}</p>
      </div>
      <div class="newsHeadlineCard">
        <span class="newsLabel">SPORTS</span>
        <h3>${sports.h}</h3>
        <p>${sports.p}</p>
      </div>
    </div>
  </section>

  <section class="newsTickerSection">
    <div class="newsSectionTitle">📢 In Other News</div>
    <ul class="newsTicker">
      ${ticker.map(t=>`<li>${t}</li>`).join("")}
    </ul>
  </section>

  <section class="newsBlog">
    <div class="newsSectionTitle">🏦 The Bank and Funds</div>
    <article class="newsArticle">
      <h2>${bankArticle.h}</h2>
      <p class="newsByline">By Micky's Daily News Finance Desk</p>
      <p>${bankArticle.p1}</p>
      <p>${bankArticle.p2}</p>
      <p>${bankArticle.p3}</p>
      <div class="newsArticleBox">
        <strong>Quick tips:</strong> ${bankArticle.tip}
      </div>
    </article>
  </section>

  <section class="newsBlog">
    <div class="newsSectionTitle">🎙️ Words From the President</div>
    <article class="newsArticle">
      <h2>A Message to the People</h2>
      <p class="newsByline">Office of the President</p>
      <p>${presidentArticle.p1}</p>
      <p>${presidentArticle.p2}</p>
      <blockquote class="newsQuote">
        "${quote}"
        <cite>— The President</cite>
      </blockquote>
    </article>
  </section>

  <footer class="newsFooter">
    <p>© ${new Date().getFullYear()} Micky's Daily News • Printed digitally with love.</p>
    <button id="newsBackHome" class="newsHomeBtn">← Back to LizzySearch</button>
  </footer>
 </div>`;
}

function newsBackHome(){ home(); }
function open(){ $("internetWindow")?.classList.remove("hidden"); home(); }
function close(){ $("internetWindow")?.classList.add("hidden"); }

$("internetIcon")?.addEventListener("click",open);
$("internetClose")?.addEventListener("click",close);
$("internetCloseBtn")?.addEventListener("click",close);
$("browserHome")?.addEventListener("click",home);
$("browserBack")?.addEventListener("click",home);
$("browserPage")?.addEventListener("click",e=>{
 const site=e.target.closest("[data-site]")?.dataset.site;
 if(site==="bank")bank(); else if(site==="lessons")lesson(); else if(site==="lizzylessons")lizzyLessonsPage(); else if(site==="news")news(); else if(site==="home")home();
 if(e.target.closest("#bankLoginBtn")) bankLogin();
 if(e.target.closest("#bankLogout")){sessionStorage.removeItem(BANK_SESSION);bank();}
 const bankAct=e.target.closest("[data-web-bank]")?.dataset.webBank;
 if(bankAct)bankAction(bankAct);
 const v=e.target.closest("[data-vote]")?.dataset.vote;
 if(v)vote(v);
 if(e.target.closest("#anotherLesson")){let n=current;while(n===current&&LESSONS.length>1)n=Math.floor(Math.random()*LESSONS.length);current=n;lesson()}
 if(e.target.closest("#submitLizzyLesson"))submitLizzyLesson();
 if(e.target.closest("#newsBackHome")) home();
});
$("browserPage")?.addEventListener("keydown",e=>{
 if(e.key==="Enter" && e.target?.id==="bankPassword")bankLogin();
});
console.log("LizzyOS Internet: ONLINE", LESSONS.length, "lessons");

// If this tab/PWA gets backgrounded, suspended, or restored from the
// browser's back-forward cache across midnight, the already-rendered
// News page would otherwise sit frozen with yesterday's picks until
// someone manually re-clicks into it. Catch that here: whenever the
// page becomes visible/resumed again, re-render News if the calendar
// day has actually moved on since it was last drawn.
function recheckStaleDay(){
 if(currentPage==="news"&&lastNewsDay&&new Date().toDateString()!==lastNewsDay)news();
}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")recheckStaleDay()});
window.addEventListener("pageshow",()=>recheckStaleDay());
window.addEventListener("focus",()=>recheckStaleDay());
})();
