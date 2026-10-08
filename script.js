const state=JSON.parse(localStorage.getItem("noorQuestState")||'{"xp":0,"streak":0,"tasbih":0,"lastDay":"","goals":{}}');
const questions=[
 {q:"How many obligatory prayers are there each day?",a:["3","4","5","6"],c:2},
 {q:"Which month do Muslims fast in during Ramadan?",a:["Muharram","Ramadan","Shawwal","Rajab"],c:1},
 {q:"How many chapters (surahs) are in the Qur'an?",a:["100","110","114","120"],c:2},
 {q:"What is the direction Muslims face during salah?",a:["Jerusalem","Makkah","Madinah","Cairo"],c:1},
 {q:"Which prayer is performed at dawn?",a:["Fajr","Dhuhr","Maghrib","Isha"],c:0},
 {q:"What is the name of the obligatory charity in Islam?",a:["Sawm","Zakat","Hajj","Dhikr"],c:1}
];
const duas=[
 ["Morning remembrance","اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا","O Allah, by You we enter the morning and by You we enter the evening."],
 ["Before eating","بِسْمِ اللَّهِ","In the name of Allah."],
 ["Seeking knowledge","رَبِّ زِدْنِي عِلْمًا","My Lord, increase me in knowledge."],
 ["For forgiveness","رَبِّ اغْفِرْ لِي","My Lord, forgive me."]
];
const goalNames=["Read some Qur'an","Make dhikr","Learn one Islamic fact","Make a sincere dua"];
let qi=0;
const $=id=>document.getElementById(id);
function save(){localStorage.setItem("noorQuestState",JSON.stringify(state));render();}
function dayKey(){return new Date().toISOString().slice(0,10)}
function addXP(n){state.xp+=n;updateStreak();save();}
function updateStreak(){const d=dayKey();if(state.lastDay!==d){const prev=new Date();prev.setDate(prev.getDate()-1);const p=prev.toISOString().slice(0,10);state.streak=state.lastDay===p?state.streak+1:1;state.lastDay=d;}}
function level(){return Math.floor(state.xp/100)+1}
function render(){ $("xp").textContent=state.xp; $("streak").textContent=state.streak; $("tasbihTotal").textContent=state.tasbih; $("counter").textContent=state.tasbih; $("level").textContent=level();const p=state.xp%100;$("progressBar").style.width=p+"%";$("progressText").textContent=p+" / 100 XP";renderGoals();}
function show(id){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$(id).classList.add("active");window.scrollTo(0,0);}
document.querySelectorAll("[data-screen]").forEach(b=>b.addEventListener("click",()=>show(b.dataset.screen)));
$("themeBtn").addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.setItem("noorDark",document.body.classList.contains("dark"))});
if(localStorage.getItem("noorDark")==="true")document.body.classList.add("dark");

function loadQuiz(){const x=questions[qi%questions.length];$("questionNo").textContent="Question "+(qi%questions.length+1);$("question").textContent=x.q;$("quizFeedback").textContent="";$("nextQuestion").hidden=true;const box=$("answers");box.innerHTML="";x.a.forEach((ans,i)=>{const b=document.createElement("button");b.className="answer";b.textContent=ans;b.addEventListener("click",()=>answer(i,x.c));box.appendChild(b)})}
function answer(i,c){document.querySelectorAll(".answer").forEach((b,n)=>{b.disabled=true;if(n===c)b.classList.add("correct");if(n===i&&i!==c)b.classList.add("wrong")});if(i===c){$("quizFeedback").textContent="✨ Correct! +10 XP";addXP(10)}else $("quizFeedback").textContent="Keep learning — the highlighted answer is correct."; $("nextQuestion").hidden=false}
$("nextQuestion").addEventListener("click",()=>{qi++;loadQuiz()});loadQuiz();

function renderDuas(){const box=$("duasList");box.innerHTML="";duas.forEach(d=>{const el=document.createElement("div");el.className="dua card";el.innerHTML=`<h3>${d[0]}</h3><div class="arabic" dir="rtl">${d[1]}</div><p class="translation">${d[2]}</p>`;box.appendChild(el)})}renderDuas();

$("tasbihBtn").addEventListener("click",()=>{state.tasbih++;if(state.tasbih%10===0)addXP(5);else save()});
$("resetTasbih").addEventListener("click",()=>{state.tasbih=0;save()});

function renderGoals(){const box=$("goalsList");if(!box)return;box.innerHTML="";goalNames.forEach((name,i)=>{const done=!!state.goals[i];const el=document.createElement("div");el.className="goal card"+(done?" done":"");el.innerHTML=`<span>${done?"✅":"🎯"}</span><strong>${name}</strong><button class="${done?"secondary":"primary"}" ${done?"disabled":""}>${done?"Done":"Complete"}</button>`;if(!done)el.querySelector("button").addEventListener("click",()=>{state.goals[i]=true;addXP(15)});box.appendChild(el)})}
render();
