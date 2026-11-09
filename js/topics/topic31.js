import {PAGE_META,CLASSIFY_SCENE,CLASSIFY_DATA,DESIGN,QUESTIONS,CHALLENGES} from '../content.js';
import {testMethodBody} from '../java-mini.js';
import {stableShuffle,shuffledOptions,shuffledDesign,gradedChoiceTargets,placeCorrectOption} from '../order.js';

// Approved Topic 3.1 lessons, assessments, and activity behavior are isolated here.
// Existing numeric page keys (1–4) and question identifiers remain unchanged.
export function createTopic31(ctx){
 const {view,pData,commit,store,render,toast,link,esc,orderSeed,teacherOn,isPageCompleted,canOpenPage,hasLessonMastery,assessment,recordEvent,go,renderFlash,modal,closeModal,$,shuffled,onChangePage}=ctx;
 let hot='player';
 const mastery=st=>PAGE_META.filter((_,i)=>isPageCompleted(st,i+1)).length;
 const complete=(n,d)=>({
  1:()=> (d.explored||[]).length>=3&&!!d.classifyDone&&!!d.conceptDone&&!!d.challengeDone,
  2:()=> !!d.bonusChanged&&!!d.bonusUsed&&!!d.classifyDone&&!!d.conceptDone&&!!d.challengeDone,
  3:()=> !!d.codePassed&&!!d.invarianceDone&&!!d.decompDone&&!!d.challengeDone,
  4:()=> !!d.designDone&&(d.reflection||'').trim().length>=30&&!!d.rationaleDone&&!!d.challengeDone
 }[n]?.()||false);
function lessonAside(n){const st=view(),t=teacherOn();return `<aside class="lesson-aside"><div class="panel slim"><div class="spaced"><strong style="font-size:13px">Topic 3.1 lessons</strong><span class="small muted">${mastery(st)}/4</span></div><div class="meter">${PAGE_META.map((_,i)=>`<span class="${isPageCompleted(st,i+1)?'on':''}"></span>`).join('')}</div><div class="step-list">${PAGE_META.map((p,i)=>{const a=i+1,accessible=canOpenPage(st,a,t),done=isPageCompleted(st,a);return `<button class="page-card ${n===a?'current':''} ${done?'done':''}" data-nav="#/topic/3.1/page/${a}" ${accessible?'':'disabled'}><span class="page-num">${done?'✓':a}</span><span style="flex:1" class="page-label">${esc(p.title)}</span><span>${!accessible?'🔒':n===a?'→':''}</span></button>`;}).join('')}
  <button class="page-card" data-nav="#/topic/3.1/check" ${hasLessonMastery(st)||t?'':'disabled'}><span class="page-num">★</span><span class="page-label" style="flex:1">Graded section check</span><span>${assessment(st).locked?'✓':'→'}</span></button></div></div>
 <div class="panel slim"><strong style="font-size:13px">Learning objectives</strong><p class="small muted">Represent program design by identifying classes, attributes, behaviors, and useful abstractions.</p><ul class="study-goals"><li>Data abstraction</li><li>Instance vs. class attributes</li><li>Procedural abstraction</li><li>Parameterization and method reuse</li><li>Class diagrams</li></ul></div>
 <div class="panel slim"><strong style="font-size:12px">Source alignment</strong><p class="fineprint">2025 College Board AP CSA CED, Unit 3, Topic 3.1; LO 3.1.A and EK 3.1.A.1–7. Original examples and exercises.</p></div></aside>`;}
function practiceChoice(page,key,question,choices,correct,hint){const d=pData(page),v=d[key+'Pick'],done=d[key+'Done'];const options=shuffled(choices,`concept-${page}-${key}`);return `<div class="panel"><p class="exercise-tag">Concept checkpoint · Unlimited practice</p><h3>${question}</h3><div class="q-options">${options.map(x=>`<label class="q-option"><input type="radio" name="p${page}-${key}" data-action="concept" data-page="${page}" data-key="${key}" data-answer="${correct}" value="${x.index}" ${String(v)===String(x.index)?'checked':''}><span>${esc(x.text)}</span></label>`).join('')}</div>
 ${v!==undefined?`<div role="status" class="feedback ${done?'good':'bad'}">${done?'✓ Correct. '+esc(hint):'Not quite. Try again: '+esc(hint)}</div>`:''}</div>`;}
function classify(page,items,key,labels){const d=pData(page),values=d[key+'Map']||{},done=d[key+'Done'];let flags=d[key+'Checked'];const displayItems=stableShuffle(items,orderSeed(),`classify-${page}-${key}`);return `<div class="panel"><p class="exercise-tag">Sorting lab · Check your design</p><div class="panel-top"><h3>${page===1?'Class, attribute, or behavior?':'Instance, class, or behavior?'}</h3><span class="pill ${done?'green':''}">${done?'Complete':`${Object.keys(values).length}/${items.length} sorted`}</span></div>
 <p class="helper">Choose the best description for each element. Every response must be correct to complete the activity. You can retry as often as needed.</p>
 ${displayItems.map(x=>`<div class="mini-card ${flags&&values[x.id]!==x.answer?'error':done?'correct':''}"><label for="sort-${esc(x.id)}">${esc(x.text)}</label><select id="sort-${esc(x.id)}" data-action="classify-select" data-page="${page}" data-key="${key}" data-id="${x.id}"><option value="">Select…</option>${labels.map(c=>`<option value="${esc(c[0])}" ${values[x.id]===c[0]?'selected':''}>${esc(c[1])}</option>`).join('')}</select></div>`).join('')}
 <div class="btn-row"><button class="btn" data-action="classify-check" data-page="${page}" data-key="${key}">Check categories</button><span class="helper">${done?'✓ All classifications correct':''}</span></div>
 ${flags&&!done?`<div class="feedback bad">Review the highlighted row${items.filter(x=>values[x.id]!==x.answer).length===1?'':'s'}. Hint: ${esc(items.find(x=>values[x.id]!==x.answer)?.reason||'Review the definitions.')}</div>`:''}</div>`;}
function challengeSet(page){const d=pData(page),cards=CHALLENGES[page],ans=d.challengeResponses||{};
 const done=cards.reduce((total,q,i)=>total+(ans[i]===q.answer?1:0),0);
 const ordered=stableShuffle(cards.map((q,i)=>({q,i})),orderSeed(),`challenge-questions-${page}`);
 return `<section class="panel"><div class="panel-top"><div><p class="kicker">Transfer challenge · New situations</p><h2>Apply the idea elsewhere</h2></div><span class="step-badge ${done===cards.length?'complete':''}">${done}/${cards.length} correct</span></div>
 <p class="helper">Abstraction is a general-purpose tool. Apply what you've learned to other programming situations. Each challenge provides immediate feedback and can be retried.</p>
 ${ordered.map(({q,i},position)=>`<div class="challenge-card"><div class="q-meta"><span>CHALLENGE ${position+1} OF ${cards.length}</span></div><h3>${esc(q.prompt)}</h3>
 <div class="q-options">${shuffled(q.options,`challenge-${page}-${i}`).map(opt=>`<label class="q-option"><input type="radio" name="challenge-${page}-${i}" data-action="challenge" data-page="${page}" data-index="${i}" value="${opt.index}" ${ans[i]===opt.index?'checked':''}><span>${esc(opt.text)}</span></label>`).join('')}</div>
 ${ans[i]!==undefined?`<div class="feedback ${ans[i]===q.answer?'good':'bad'}">${ans[i]===q.answer?'✓ Correct. '+esc(q.hint):'Not yet. '+esc(q.hint)}</div>`:''}</div>`).join('')}
 <p class="helper">${done===cards.length?'✓ Transfer challenge completed.':'Solve all three to satisfy this page requirement.'}</p></section>`;
}
function lessonHead(n){const p=PAGE_META[n-1],st=view(),done=isPageCompleted(st,n);return `<div class="page-title"><p class="eyebrow">TOPIC 3.1 · LESSON ${n} OF 4</p><div class="spaced"><h1>${esc(p.title)}</h1><span class="step-badge ${done?'complete':''}">${done?'✓ Completed':'In progress'}</span></div><p class="lead">${esc(p.subtitle)}</p><p class="fineprint">Essential knowledge: ${esc(p.ek)}</p></div>`;}
function lessonFoot(n){const st=view(),done=isPageCompleted(st,n),t=teacherOn(),canNext=done||t;return `<div class="lesson-footer">${n>1?link(`#/topic/3.1/page/${n-1}`,'← Previous lesson','secondary'):link('#/home','← Dashboard','secondary')}
  <div style="display:grid;justify-items:end;gap:4px">${n<4?(canNext?link(`#/topic/3.1/page/${n+1}`,'Next lesson →'):'<button class="btn secondary" disabled>🔒 Next lesson</button>'):(hasLessonMastery(st)||t?link('#/topic/3.1/check','Go to graded check →'):'<button class="btn secondary" disabled>🔒 Graded check</button>')}
  ${!canNext&&n<4?'<span class="fineprint">Complete the required activities to unlock.</span>':''}${n===4&&!hasLessonMastery(st)&&!t?'<span class="fineprint">Complete all four pages first.</span>':''}</div></div>`;}
function lesson(n){const st=view(),t=teacherOn();if(!canOpenPage(st,n,t))return `<div class="panel"><h2>Page locked</h2><p>Complete the previous lesson to continue.</p>${link('#/home','Back to dashboard')}</div>`;
 onChangePage(n);
 let center=[pageOne,pageTwo,pageThree,pageFour][n-1]();return lessonHead(n)+`<div class="lesson-layout"><div class="lesson-content">${renderFlash()}${center}${isPageCompleted(st,n)?'<div class="completion"><strong>✓ Lesson complete.</strong> You have completed every required activity on this page.</div>':''}${lessonFoot(n)}</div>${lessonAside(n)}</div>`;
}
const arcScene=`<svg viewBox="0 0 860 375" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustrated arcade room showing a player, three arcade cabinets, a ticket counter and leaderboard">
 <defs><linearGradient id="wall" x2="0" y2="1"><stop stop-color="#252e46"/><stop offset="1" stop-color="#202331"/></linearGradient><linearGradient id="floor" x2="0" y2="1"><stop stop-color="#2c2d40"/><stop offset="1" stop-color="#44445c"/></linearGradient></defs>
 <rect width="860" height="375" fill="url(#wall)"/><rect y="268" width="860" height="107" fill="url(#floor)"/><path d="M0 268L860 268 M0 320L860 320 M170 268L70 375 M430 268L430 375 M690 268L790 375" stroke="#646379" opacity=".5" stroke-width="2"/>
 <rect x="35" y="22" width="282" height="46" rx="8" fill="#40111a" stroke="#b95d6f" stroke-width="3"/><text x="175" y="52" fill="#fff1f3" font-family="Arial" font-size="25" font-weight="bold" text-anchor="middle" letter-spacing="3">ARCADE</text>
 <g transform="translate(58 111)"><path d="M0 147L18 0H111L128 147Z" fill="#35374c" stroke="#8e6774" stroke-width="4"/><rect x="27" y="15" width="72" height="63" rx="6" fill="#121c37" stroke="#9ac7e4" stroke-width="3"/><circle cx="63" cy="42" r="18" fill="#e2ab78"/><path d="M38 63L85 32" stroke="#b56c78" stroke-width="7"/><rect x="24" y="95" width="80" height="17" rx="4" fill="#6b2631"/><circle cx="49" cy="103" r="4" fill="#e5c06f"/><circle cx="77" cy="103" r="4" fill="#c99bc0"/></g>
 <g transform="translate(210 126)"><path d="M0 135L17 0H112L128 135Z" fill="#353c54" stroke="#807f9e" stroke-width="4"/><rect x="26" y="13" width="75" height="58" rx="6" fill="#142b3e" stroke="#86c8b9" stroke-width="3"/><path d="M33 58l22 -31 20 10 18 -17" fill="none" stroke="#c4edaf" stroke-width="5"/><rect x="23" y="94" width="84" height="16" rx="3" fill="#284a4d"/><circle cx="49" cy="102" r="5" fill="#eef0ba"/></g>
 <g transform="translate(372 113)"><path d="M0 147L18 0H111L128 147Z" fill="#403544" stroke="#9d7292" stroke-width="4"/><rect x="28" y="18" width="72" height="61" rx="7" fill="#1c1733" stroke="#d9bbdf" stroke-width="3"/><circle cx="64" cy="46" r="21" fill="#5a2f7f" stroke="#deafe5" stroke-width="3"/><path d="M49 46H79M64 31V61" stroke="#e8d0ff" stroke-width="5"/><rect x="24" y="97" width="80" height="16" rx="4" fill="#77486f"/></g>
 <g transform="translate(535 142)"><circle cx="46" cy="38" r="26" fill="#ddb99b"/><path d="M20 35 Q38 -3 73 33L65 13L48 3L25 13Z" fill="#33313e"/><rect x="17" y="65" width="61" height="70" rx="18" fill="#7a2734"/><path d="M19 86L-7 120M77 85L102 120" stroke="#ddba9b" stroke-width="15" stroke-linecap="round"/><path d="M32 135L27 171M61 135L67 171" stroke="#242538" stroke-width="19" stroke-linecap="round"/><text x="47" y="105" fill="#fff" font-family="Arial" font-size="15" font-weight="bold" text-anchor="middle">P1</text></g>
 <g transform="translate(664 112)"><rect x="0" y="45" width="175" height="105" rx="7" fill="#6a3542" stroke="#aa737a" stroke-width="3"/><rect x="13" y="58" width="149" height="58" rx="4" fill="#8d6872"/><path d="M17 60H158M17 87H158" stroke="#cbb1b3" opacity=".65"/><path d="M44 12h43v34h-43z" fill="#e5b95b"/><path d="M48 11L42 3H89L82 11" fill="#fff0a5"/><text x="85" y="140" fill="#fff4f4" font-family="Arial" font-size="13" font-weight="bold" text-anchor="middle">TICKETS</text></g>
 <rect x="530" y="29" width="306" height="82" rx="9" fill="#111d2d" stroke="#cb97a3" stroke-width="3"/><text x="682" y="50" fill="#fff" text-anchor="middle" font-family="Arial" font-size="17" font-weight="bold">LEADERBOARD</text><text x="682" y="76" fill="#d3f2dc" text-anchor="middle" font-family="monospace" font-size="16">1  ALEX    1,240</text><text x="682" y="96" fill="#dfd9e3" text-anchor="middle" font-family="monospace" font-size="15">2  BEN       880</text>
 </svg>`;
const hotspots={
 player:{title:'Player',kind:'Candidate class: Player',body:'A player has attributes such as name, score, and lives. It can earn points or lose a life.'},
 cabinet:{title:'Arcade cabinet',kind:'Candidate class: ArcadeMachine',body:'An arcade machine has a title and a cost to play. It can start a game or accept a credit.'},
 counter:{title:'Ticket counter',kind:'Candidate class: PrizeMachine',body:'A prize machine tracks the prizes it offers. It can redeem tickets for a prize.'},
 board:{title:'Leaderboard',kind:'Candidate class: ScoreBoard',body:'A scoreboard stores scores and displays rankings. Its data and behaviors can be organized as a class.'}
};
function pageOne(){const d=pData(1),explored=d.explored||[],item=hotspots[hot]||hotspots.player;
 return `<section class="panel"><div class="panel-top"><div><p class="kicker">Explore the example</p><h2>An arcade full of objects</h2></div><span class="step-badge">${explored.length}/4 explored</span></div>
 <p>Programs model the world by representing <strong>types of things</strong> as classes. Each class brings together related information (attributes) and actions (behaviors). Explore at least three parts of the arcade.</p>
 <div class="scene">${arcScene}
 <button class="scene-target ${explored.includes('cabinet')?'visited':''}" data-action="explore" data-id="cabinet" style="left:24%;top:64%">Arcade machine</button>
 <button class="scene-target ${explored.includes('player')?'visited':''}" data-action="explore" data-id="player" style="left:65%;top:78%">Player</button>
 <button class="scene-target ${explored.includes('counter')?'visited':''}" data-action="explore" data-id="counter" style="left:88%;top:70%">Prize counter</button>
 <button class="scene-target ${explored.includes('board')?'visited':''}" data-action="explore" data-id="board" style="left:79%;top:24%">Leaderboard</button>
 </div>
 <p class="scene-caption">Click a labeled part of the arcade. Green labels indicate objects you've explored.</p>
 <div class="callout maroon" aria-live="polite"><strong>${esc(item.title)}:</strong> ${esc(item.body)}<br><span class="small">${esc(item.kind)}</span></div>
 <p class="helper" style="margin-top:12px">The objects in the scene are <em>instances</em>; classes describe what kind of objects the program can create.</p></section>
 <section class="panel"><p class="kicker">A key idea</p><h2>Model what matters</h2><p><strong>Abstraction</strong> reduces complexity by keeping relevant details and ignoring details that do not help answer the problem. An arcade program may need a player's score, but not the brand of paint used on the walls.</p>
 <div class="scene-grid"><div class="info-cell"><strong>Data abstraction</strong><p>Use meaningful names to represent related information without exposing every detail of how it is stored.</p></div><div class="info-cell"><strong>Procedural abstraction</strong><p>Name actions as methods so a caller can use their behavior without knowing every internal statement.</p></div></div></section>
 ${classify(1,CLASSIFY_SCENE,'classify',[['class','Class'],['attribute','Attribute'],['behavior','Behavior']])}
 ${challengeSet(1)}
 ${practiceChoice(1,'concept','Which detail could you safely ignore when first designing a Player class for the purpose of tracking game scores?',['The score of the player','The number of screws inside the arcade cabinet','Whether the player has lives remaining','The player\'s name'],1,'That physical detail is unrelated to the player score model.')}
 `;}
function pageTwo(){const d=pData(2);d.a??=10;d.b??=25;d.bonus??=1;d.simActions??=0;
 const nextAward=10*d.bonus;
 return `<section class="panel"><p class="kicker">Data model · Interactive simulation</p><h2>Two players, one shared value</h2><p>A class defines attributes; an <strong>instance variable</strong> belongs to one object, while a <strong>class variable</strong> is shared among all objects of the class. Each player keeps a separate score, but they use the <em>same</em> <code>arcadeBonus</code> when earning points.</p>
 <div class="sim-world"><div class="object-card"><h4>Player a <span class="pill">instance</span></h4><div class="score">${d.a}</div><div class="state">Alex's own score</div><div class="state">Next award: 10 × ${d.bonus} = <strong>+${nextAward}</strong></div><button class="btn small" data-action="sim" data-target="a">Award +${nextAward} to Alex</button></div>
 <div class="object-card"><h4>Player b <span class="pill">instance</span></h4><div class="score">${d.b}</div><div class="state">Ben's own score</div><div class="state">Next award: 10 × ${d.bonus} = <strong>+${nextAward}</strong></div><button class="btn small" data-action="sim" data-target="b">Award +${nextAward} to Ben</button></div>
 <div class="object-card shared"><h4>Player class <span class="pill maroon">shared</span></h4><div class="score">×${d.bonus}</div><div class="state"><code>arcadeBonus</code> shared by both players</div><button class="btn small secondary" data-action="sim" data-target="bonus">Change bonus (×1 → ×2 → ×3)</button></div></div>
 <div class="spaced" style="margin-top:12px"><span class="helper">Experiment: change the shared bonus, then award points with the new multiplier. ${d.bonusUsed?'✓ Bonus used in a score award.':d.bonusChanged?'Bonus changed. Now award points to a player.':'Start by changing the bonus.'}</span><button class="btn ghost small" data-action="sim-reset">Reset experiment</button></div>
 <div class="callout" style="margin-top:12px" role="status">${esc(d.lastAction||'Try changing the bonus to ×2. A 10-point award will then add 20 to either player, but will not change points already earned.')}</div>
 <p class="helper" style="margin-top:12px">A score award is <strong>10 base points × arcadeBonus</strong>. Changing the shared bonus affects <em>future awards for both players</em>, not their existing scores. Awarding points to one player does not change the other player's score.</p></section>
 <section class="panel"><p class="kicker">Inside the design</p><h2>Abstraction hides representation</h2><div class="code-stage"><div class="code-bar">Player.java · Design sketch</div><div class="code-main"><span class="tok-kw">public class</span> <span class="tok-type">Player</span> {<br>&nbsp; <span class="tok-kw">private</span> <span class="tok-type">String</span> name;<br>&nbsp; <span class="tok-kw">private int</span> score;<br>&nbsp; <span class="tok-kw">private static int</span> arcadeBonus;<br><br>&nbsp; <span class="tok-comment">// behavior added later</span><br>}</div></div>
 <p class="helper">Data abstraction gives related information meaningful names such as <code>score</code> and <code>arcadeBonus</code> without requiring code that uses a Player to know how those values are stored. <code>static</code> means <code>arcadeBonus</code> belongs to the class, not an individual player. We'll implement complete Java classes in later topics.</p></section>
 ${classify(2,CLASSIFY_DATA,'classify',[['instance','Instance variable'],['class','Class variable'],['behavior','Behavior / method']])}
 ${challengeSet(2)}
 ${practiceChoice(2,'concept','Two players each have their own number of lives. Which model best fits?',['One shared class variable for lives','One constant number for the whole arcade','One instance variable named lives in each Player','A method named lives with no stored value'],2,'Each player can have an independent value, so it belongs to the individual object.')}
 `;}
function pageThree(){const d=pData(3);d.code??='';
 const cases=d.codeResults||[];const snippets=cases.length?`<div class="test-results" aria-live="polite">${cases.map((c,i)=>`<div class="test-item ${c.ok?'pass':'fail'}"><strong>${c.ok?'✓':'×'} Test ${i+1}</strong><span>start ${c.initialScore}, points ${c.points}; expected <strong>${c.expected}</strong>${c.error?`; ${esc(c.error)}`:`; actual <strong>${c.actual}</strong>`}</span><span>${c.ok?'PASS':'RETRY'}</span></div>`).join('')}</div>`:'';
 return `<section class="panel"><p class="kicker">The purpose of methods</p><h2>Name a behavior, hide the steps</h2>
 <p>Instead of repeating the same instructions every time a player earns points, define a method with a meaningful name. The calling code only needs to know <strong>what</strong> the method does and which values to supply.</p>
 <div class="two-cols"><div class="info-cell"><strong>Without abstraction</strong><pre>alexScore += 5;
benScore += 5;
alexScore += 12;</pre><p>Repeated update logic is scattered around the program.</p></div><div class="info-cell"><strong>With abstraction</strong><pre>alex.addScore(5);
ben.addScore(5);
alex.addScore(12);</pre><p>Calls rely on one reusable method that accepts a parameter.</p></div></div>
 <div class="callout maroon" style="margin-top:15px"><strong>Method decomposition:</strong> Break complex behavior into smaller, well-named actions. <strong>Parameters:</strong> Generalize methods so they work with different values.</div></section>
 <section class="panel"><p class="kicker">Java experimentation · Editable method body</p><div class="spaced"><h2>Make addScore reusable</h2><span class="step-badge">Restricted Java subset</span></div>
 <p>The method header is provided, but <strong>you must write its body</strong>. Write a Java statement that adds the parameter <code>points</code> to the current <code>score</code>, without replacing the old score. The editor starts blank on purpose. Experiment freely; syntax errors are explained and do not count against you.</p>
 <div class="code-stage"><div class="code-bar"><span>Player.java · Interactive Java method</span><span>int arithmetic</span></div>
 <div class="code-main"><span class="tok-kw">public void</span> addScore(<span class="tok-type">int</span> points) {<textarea id="java-body" class="code-input" aria-label="Java method body" spellcheck="false" placeholder="// Write the method body here">${esc(d.code)}</textarea>}</div></div>
 <p class="fineprint">Supported here: assignments to <code>score</code> using <code>=</code>, <code>+=</code>, or <code>-=</code>; integer expressions using <code>score</code>, <code>points</code>, +, -, *, /, %, and parentheses; and multiple statements. This is not a full Java compiler.</p>
 <div class="btn-row"><button class="btn" data-action="test-code">▶ Run three tests</button>${d.codePassed?'<button class="btn secondary small" data-action="code-template" data-code="score += points;">Try compact version</button><button class="btn secondary small" data-action="code-template" data-code="score = score + points;">Try expanded version</button>':''}</div>
 ${snippets}<p class="helper">${d.codePassed?'✓ Your implementation passes all three tests. Both versions can satisfy the same method contract.':'To complete this activity, pass all three tests.'}</p></section>
 <section class="panel"><p class="kicker">Interface vs. implementation</p><h2>Change the inside, keep the promise</h2>
 <p>The calling code uses <code>player.addScore(8)</code>, regardless of how the body is implemented. After you pass the tests, compare two different method bodies that keep the same promise.</p>
 ${d.codePassed?`<div class="two-cols"><div class="info-cell"><strong>Implementation A</strong><pre>score += points;</pre><span class="pill">Concise</span></div><div class="info-cell"><strong>Implementation B</strong><pre>score = score + points;</pre><span class="pill">Expanded</span></div></div>
 <div class="feedback good" style="margin-top:14px">Both methods do the same job. You may now try each implementation in the editor and rerun the tests.</div>`:`<div class="callout">🔒 First write your own method body and pass all three tests. Then you'll see two equivalent implementations to compare.</div>`}</section>
 ${challengeSet(3)}
 ${practiceChoice(3,'decomp','A game must award points, update a leaderboard, and display a victory screen. Which choice best applies method decomposition?',['Place every statement in a single huge main method','Duplicate all three tasks wherever they are needed','Create awardPoints(), updateLeaderboard(), and showVictoryScreen() methods','Replace every method name with a single letter'],2,'Separating distinct responsibilities into focused methods helps code be understood and reused.')}
 ${practiceChoice(3,'invariance','A faster version of addScore(int points) has the same visible behavior and method signature. What should the caller do?',['Pass a different parameter type','Nothing; existing calls continue to use the same method contract','Rewrite every call to match the internal algorithm','Access the private score field directly'],1,'Clients rely on the method signature and its behavior rather than the private steps inside it.')}
 `;}
function umlField(text){
 const m=/^private\s+(static\s+)?(\w+)\s+(\w+);$/.exec(text);
 return m?`- ${m[3]}: ${m[2]}${m[1]?' {static}':''}`:text;
}
function umlMethod(text){
 const m=/^public\s+(\w+)\s+(\w+)\((.*?)\)$/.exec(text);
 if(!m)return text;
 const args=m[3]?m[3].split(',').map(x=>{const p=x.trim().split(/\s+/);return `${p[1]}: ${p[0]}`;}).join(', '):'';
 return `+ ${m[2]}(${args}): ${m[1]}`;
}
function pageFour(){const d=pData(4);d.fields??=[];d.methods??=[];
 let fields=DESIGN.fields.filter(x=>d.fields.includes(x.id)),methods=DESIGN.methods.filter(x=>d.methods.includes(x.id));
 return `<section class="panel"><p class="kicker">Your final design task</p><h2>Design the Player class</h2><p>You are building an arcade simulator. The <code>Player</code> class must remember each player's <strong>name</strong>, <strong>score</strong>, and <strong>remaining lives</strong>. A player must be able to <strong>earn points</strong>, <strong>report their score</strong>, and <strong>lose a life</strong>.</p>
 <div class="callout maroon">Select the <strong>required</strong> attributes and behaviors. Leave unrelated features out. A class diagram should communicate the design before any implementation is written.</div>
 <div class="design-grid" style="margin-top:18px"><div><h3>Choose attributes</h3>${shuffledDesign(DESIGN.fields,orderSeed(),'design-fields').map(x=>`<label class="design-option"><input type="checkbox" data-action="design-select" data-kind="fields" value="${x.id}" ${d.fields.includes(x.id)?'checked':''}><span>${esc(x.text)}</span></label>`).join('')}</div>
 <div><h3>Choose behaviors</h3>${shuffledDesign(DESIGN.methods,orderSeed(),'design-methods').map(x=>`<label class="design-option"><input type="checkbox" data-action="design-select" data-kind="methods" value="${x.id}" ${d.methods.includes(x.id)?'checked':''}><span>${esc(x.text)}</span></label>`).join('')}</div></div>
 <div class="uml" aria-label="Class diagram preview"><div class="uml-title">Player</div><div class="uml-lines">${fields.length?fields.map(x=>`<div>${esc(umlField(x.text))}</div>`).join(''):'<span class="empty-design">Select attributes above</span>'}</div><div class="uml-lines">${methods.length?methods.map(x=>`<div>${esc(umlMethod(x.text))}</div>`).join(''):'<span class="empty-design">Select behaviors above</span>'}</div></div>
 <div class="btn-row"><button class="btn" data-action="check-design">Validate class design</button><span class="helper">${d.designDone?'✓ All required members selected; no unrelated members.':''}</span></div>${d.designChecked&&!d.designDone?`<div class="feedback bad">Your design needs revision. Include the three data values and all three specified actions; remove unrelated arcade responsibilities.</div>`:''}
 </section>
 <section class="panel"><p class="kicker">Explain your design · Saved as practice evidence</p><h2>Why group these together?</h2><p class="helper">Write at least 30 characters explaining why <code>score</code> and <code>addScore</code> belong in the <code>Player</code> class rather than being scattered throughout unrelated classes. Your response will appear in the PDF report for teacher review.</p>
 <label class="field" for="design-reflection"><span class="small" style="font-weight:800">Your explanation</span><textarea id="design-reflection" rows="4" maxlength="1000" placeholder="Both belong in Player because…">${esc(d.reflection||'')}</textarea></label><div class="spaced"><span class="helper" id="reflection-count">${(d.reflection||'').trim().length}/30 minimum characters</span><span class="helper">Saved automatically as you type</span></div></section>
 ${challengeSet(4)}
 ${practiceChoice(4,'rationale','Which principle best explains why a Player class contains both the score value and addScore(points) behavior?',['Every class should contain every variable in the program','Keeping related data and behavior together makes the model clearer and reduces complexity','Classes should never contain methods','Method parameters cannot be reused'],1,'A class models a coherent entity by grouping relevant attributes and behaviors.')}
 `;}
function answerInput(q,i,draft){
 const v=draft[q.id],seed=orderSeed();
 if(q.kind==='choice'){
  const choiceIndex=QUESTIONS.filter(q=>q.kind==='choice').findIndex(x=>x.id===q.id);
  const targets=gradedChoiceTargets(seed,QUESTIONS.filter(q=>q.kind==='choice').length);
  const options=placeCorrectOption(q.options,q.answer,targets[choiceIndex],seed,`graded-options-${q.id}`);
  return `<div class="q-options">${options.map(x=>`<label class="q-option"><input type="radio" name="${q.id}" data-action="check-answer" data-q="${q.id}" value="${x.index}" ${String(v)===String(x.index)?'checked':''}><span>${esc(x.text)}</span></label>`).join('')}</div>`;
 }
 const items=stableShuffle(q.items.map(([label],idx)=>({label,idx})),seed,`graded-rows-${q.id}`);
 const categories=stableShuffle(q.categories,seed,`graded-categories-${q.id}`);
 return `<div class="q-categories">${items.map(({label,idx},position)=>`<div class="q-subrow"><span><strong>${position+1}.</strong> ${esc(label)}</span><select aria-label="Classify ${esc(label)}" data-action="check-category" data-q="${q.id}" data-index="${idx}"><option value="">Choose…</option>${categories.map(c=>`<option value="${esc(c)}" ${v?.[idx]===c?'selected':''}>${esc(c)}</option>`).join('')}</select></div>`).join('')}</div>`;
}
function renderCheck(){const st=view(),t=teacherOn(),a=assessment(st);
 if(!hasLessonMastery(st)&&!t)return `<div class="page-title"><p class="eyebrow">TOPIC 3.1 · SECTION CHECK</p><h1>Complete the lessons first</h1><p class="lead">All four lessons and their required practice activities must be completed before you can submit the graded check.</p>${link('#/home','Return to dashboard')}</div>`;
 if(a.locked&&!t)return renderResults();
 if(a.locked&&t)return `<div class="page-title"><h1>Graded check already submitted</h1><p class="lead">Teacher preview can review the recorded results or reset the check. Previewing the answers will not change a student submission.</p><div class="btn-row">${link('#/topic/3.1/results','View results')}${link('#/teacher','Teacher tools','secondary')}</div></div>`;
 const filled=QUESTIONS.filter(q=>q.kind==='choice'?a.draft[q.id]!==undefined:q.items.every((_,idx)=>!!a.draft[q.id]?.[idx])).length;
 return `<div class="page-title"><p class="eyebrow">TOPIC 3.1 · SECTION CHECK</p><div class="spaced"><h1>Demonstrate your understanding</h1><span class="step-badge graded">One graded submission</span></div><p class="lead">Ten questions, ten points each. You need <strong>80/100</strong> to pass. Review your responses before submitting. No hints or answer checking are provided during the graded check.</p></div>
 <div class="callout warning" style="margin-bottom:17px"><strong>Submission rules:</strong> Your answers save as a draft while you work. Once submitted, the check locks on this device. If you score below 80%, your teacher must reset the attempt. This is a classroom practice restriction, not secure testing.</div>
 ${renderFlash()}
 <section class="assessment-list" aria-label="Topic 3.1 graded questions">
 ${QUESTIONS.map((q,i)=>`<div class="assessment-row"><div class="q-meta"><span>QUESTION ${i+1} OF 10</span><span>${esc(q.area)}</span><span>${esc(q.objective)}</span></div><h3>${esc(q.prompt)}</h3>${answerInput(q,i,a.draft)}${t?`<div class="teacher-answer"><strong>Teacher key:</strong> ${esc(q.kind==='choice'?q.options[q.answer]:q.items.map(([label,correct])=>label+' → '+correct).join(' | '))}<br>${esc(q.explanation)}</div>`:''}</div>`).join('')}</section>
 <div class="assessment-sticky"><div><strong data-role="check-counter">${filled} of 10 answered</strong><div class="helper" data-role="check-unanswered">Autosaved to this device · ${100-filled*10} points unanswered</div></div><div class="btn-row">${link('#/topic/3.1/page/4','Review lessons','secondary')}<button class="btn" data-action="review-submit" ${filled===10?'':'disabled'}>Review &amp; submit →</button></div></div>`;
}
function resultSummary(a){const last=a.attempts.at(-1);return last?`<span class="step-badge ${last.score>=80?'complete':''}">${last.score>=80?'PASS':'BELOW 80%'} · ${last.score}/100</span>`:'<span class="step-badge">Not attempted</span>';}
function renderResults(){const st=view(),a=assessment(st),latest=a.attempts.at(-1);if(!latest)return `<div class="page-title"><h1>No section-check submission yet</h1>${link('#/topic/3.1/check','Open check')}</div>`;
 const yes=latest.score>=80;return `<div class="page-title"><p class="eyebrow">TOPIC 3.1 · SECTION CHECK RESULTS</p><h1>${yes?'Topic mastery achieved.':'Review and try again with your teacher.'}</h1><p class="lead">${yes?'You met the 80% mastery threshold. Topic 3.2 is now unlocked on your dashboard.':'This attempt has been recorded. Review the lessons, then ask your teacher to enter the reset code on this device.'}</p></div>
 <div class="panel" style="text-align:center;margin-bottom:20px"><div class="score-ring"><div class="scorebig ${yes?'good':''}">${latest.score}</div><div class="muted">/100</div></div><div class="spaced" style="justify-content:center;margin:12px 0">${resultSummary(a)}<span class="pill">${a.attempts.length} recorded attempt${a.attempts.length===1?'':'s'}</span></div><p class="helper">Submitted ${new Date(latest.at).toLocaleString()} · ${(latest.score/10)} correct of 10</p><div class="btn-row" style="justify-content:center"><button class="btn" data-action="pdf-topic">↓ Download topic PDF</button>${link('#/topic/3.1/page/1','Review the lessons','secondary')}</div></div>
 <div class="panel"><h2>Graded question-by-question results</h2><p class="helper">Your response and awarded points are shown below. Complete answer explanations are available to your teacher.</p>
 ${(latest.questions?.length?latest.questions:QUESTIONS).map((q,i)=>{let ans=latest.answers?.[q.id];let resp=q.kind==='choice'?(ans!==undefined?q.options[Number(ans)]:'No response'):q.items.map(([label],idx)=>`${label}: ${ans?.[idx]||'(blank)'}`).join(' · ');
 return `<div class="answer-review"><div class="spaced"><strong>Question ${i+1}: ${esc(q.area)}</strong><span class="status ${latest.points?.[q.id]===10?'good':'bad'}">${latest.points?.[q.id]||0}/10</span></div><p>${esc(q.prompt)}</p><p class="helper"><strong>Your answer:</strong> ${esc(resp)}</p>${teacherOn()?`<div class="teacher-answer"><strong>Correct response:</strong> ${esc(q.kind==='choice'?q.options[q.answer]:q.items.map(([x,y])=>`${x}: ${y}`).join(' · '))}<br>${esc(q.explanation)}</div>`:''}</div>`;}).join('')}
 </div>${a.attempts.length>1?`<div class="panel" style="margin-top:18px"><h3>Previous attempts retained</h3>${a.attempts.slice(0,-1).map((x,i)=>`<p class="helper">Attempt ${i+1}: ${x.score}/100, ${new Date(x.at).toLocaleString()}</p>`).join('')}</div>`:''}
 `;}

function checkSort(page,key){const d=pData(page),items=page===1?CLASSIFY_SCENE:CLASSIFY_DATA;d[key+'Checked']=true;d[key+'Done']=items.every(x=>(d[key+'Map']||{})[x.id]===x.answer);commit();render();}
function validateDesign(){const d=pData(4);const a=DESIGN.fields.filter(x=>x.ok).map(x=>x.id).sort().join(','),b=DESIGN.methods.filter(x=>x.ok).map(x=>x.id).sort().join(',');
 d.designChecked=true;d.designDone=[...(d.fields||[])].sort().join(',')===a&&[...(d.methods||[])].sort().join(',')===b;
 commit();render();}
function gradeDraft(a){
 let score=0;const answers={},points={};
 for(const q of QUESTIONS){let value=a.draft[q.id],ok;
  if(q.kind==='choice'){value=Number(value);ok=value===q.answer;}
  else{value=Object.fromEntries(q.items.map((_,i)=>[i,a.draft[q.id]?.[i]]));ok=q.items.every(([,correct],i)=>value[i]===correct);}
  answers[q.id]=value;points[q.id]=ok?10:0;score+=points[q.id];
 }
 return {score,answers,points,at:new Date().toISOString(),questionBank:'2025-U3.1-v2',questions:QUESTIONS.map(q=>({id:q.id,kind:q.kind,area:q.area,objective:q.objective,prompt:q.prompt,options:q.options||null,items:q.items||null,answer:q.answer,explanation:q.explanation}))};
}
function filledCheck(a){return QUESTIONS.every(q=>q.kind==='choice'?a.draft[q.id]!==undefined:q.items.every((_,i)=>!!a.draft[q.id]?.[i]));}
function updateCheckUI(){
 const a=assessment(view());
 const filled=QUESTIONS.filter(q=>q.kind==='choice'?a.draft[q.id]!==undefined:q.items.every((_,i)=>!!a.draft[q.id]?.[i])).length;
 const counter=$('[data-role="check-counter"]'),unanswered=$('[data-role="check-unanswered"]'),button=$('[data-action="review-submit"]');
 if(counter)counter.textContent=`${filled} of 10 answered`;
 if(unanswered)unanswered.textContent=`Autosaved to this device · ${100-filled*10} points unanswered`;
 if(button)button.disabled=filled<10;
}
function submitCheck(){const st=view(),a=assessment(st);
 if(a.locked)return toast('This attempt is already submitted.');
 if(!teacherOn()&&!hasLessonMastery(st))return toast('Complete the lessons before submitting.');
 if(!filledCheck(a))return toast('Answer all ten questions before submitting.');
 const result=gradeDraft(a);a.attempts.push(result);a.locked=true;a.draft={};
 recordEvent(st,'graded-check-submit',`3.1: ${result.score}/100`);store();closeModal();go('#/topic/3.1/results');toast(`Graded check recorded: ${result.score}/100.`,result.score>=80);
}

function confirmSubmit(){modal(`<button class="dialog-close" data-action="modal-close" aria-label="Close">×</button><p class="eyebrow">FINAL SUBMISSION</p><h2>Submit your section check?</h2><p>You answered all ten questions. Once you submit, the attempt is locked and your score is recorded. If your score is below 80%, your teacher must reset it before another attempt.</p>
 <div class="dialog-actions"><button class="btn secondary" data-action="modal-close">Review answers</button><button class="btn" data-action="submit-check">Submit final answers</button></div>`);}

 function handleClick(el){const act=el.dataset.action;
 if(act==='review-submit'){if(!filledCheck(assessment(view())))toast('Answer all questions before submitting.');else confirmSubmit();return;}
 if(act==='submit-check'){submitCheck();return;}
 if(act==='explore'){
  const d=pData(1);d.explored??=[];hot=el.dataset.id;if(!d.explored.includes(hot))d.explored.push(hot);commit();render();return;
 }
 if(act==='classify-check'){checkSort(Number(el.dataset.page),el.dataset.key);return;}
 if(act==='sim'){
  const d=pData(2),target=el.dataset.target;d.a??=10;d.b??=25;d.bonus??=1;
  if(target==='bonus'){
   const old=d.bonus;d.bonus=old===3?1:old+1;d.bonusChanged=true;
   d.lastAction=`The shared bonus changed from ×${old} to ×${d.bonus}. Future 10-point awards to Alex or Ben will now add ${10*d.bonus} points. Previous scores are unchanged.`;
  }else if(target==='a'||target==='b'){
   const amount=10*d.bonus;d[target]+=amount;
   if(d.bonusChanged&&d.bonus>1)d.bonusUsed=true;
   d.lastAction=`${target==='a'?'Alex':'Ben'} earned ${amount} points (10 × ${d.bonus}). ${target==='a'?"Ben's":"Alex's"} score did not change.`;
  }else return;
  d.simActions=(d.simActions||0)+1;commit();render();return;
 }
 if(act==='sim-reset'){
  const d=pData(2);Object.assign(d,{a:10,b:25,bonus:1,lastAction:'Simulation values reset to the starting state. Change the bonus and award points to see the shared effect.'});commit();render();return;
 }
 if(act==='test-code'){
  const d=pData(3);d.code=$('#java-body')?.value||'';d.codeResults=testMethodBody(d.code);d.codePassed=d.codeResults.every(x=>x.ok);commit();render();return;
 }
 if(act==='code-template'){
  const d=pData(3);d.code=el.dataset.code;d.codeResults=[];d.codePassed=false;commit();render();return;
 }
 if(act==='check-design'){validateDesign();return;}
 return false;
 }
 function handleChange(el){const act=el.dataset.action;
 if(act==='classify-select'){
  const d=pData(Number(el.dataset.page));const key=el.dataset.key;d[key+'Map']??={};d[key+'Map'][el.dataset.id]=el.value;d[key+'Checked']=false;
  d[key+'Done']=false;store();return;
 }
 if(act==='concept'){
  const page=Number(el.dataset.page),key=el.dataset.key,d=pData(page);d[key+'Pick']=Number(el.value);d[key+'Done']=Number(el.value)===Number(el.dataset.answer);commit();render();return;
 }
 if(act==='challenge'){
  const page=Number(el.dataset.page),index=Number(el.dataset.index),d=pData(page);d.challengeResponses??={};d.challengeResponses[index]=Number(el.value);
  d.challengeDone=CHALLENGES[page].every((q,i)=>d.challengeResponses[i]===q.answer);commit();render();return;
 }
 if(act==='design-select'){
  const d=pData(4),kind=el.dataset.kind;d[kind]??=[];
  if(el.checked&&!d[kind].includes(el.value))d[kind].push(el.value);
  if(!el.checked)d[kind]=d[kind].filter(x=>x!==el.value);
  d.designChecked=false;d.designDone=false;store();render();return;
 }
 if(act==='check-answer'){
  const a=assessment(view());if(a.locked)return;a.draft[el.dataset.q]=Number(el.value);store();updateCheckUI();return;
 }
 if(act==='check-category'){
  const a=assessment(view());if(a.locked)return;a.draft[el.dataset.q]??={};a.draft[el.dataset.q][Number(el.dataset.index)]=el.value;store();updateCheckUI();return;
 }

 return false;
 }
 function handleInput(el){
 if(el.id==='design-reflection'){
  const d=pData(4);d.reflection=el.value;const x=$('#reflection-count');if(x)x.textContent=`${el.value.trim().length}/30 minimum characters`;
  commit();return;
 }
 if(el.id==='java-body'){
  const d=pData(3);d.code=el.value;d.codePassed=false;d.codeResults=[];store();
 }
 return false;
 }

 function sample(x,sampleResult){
 for(let i=1;i<=4;i++)x.pages[i]={completed:true,completedAt:new Date().toISOString(),data:{}};
 x.pages[1].data={explored:['player','cabinet','board'],classifyDone:true};x.pages[2].data={simActions:4,classifyDone:true,bonusUsed:true};x.pages[3].data={code:'score += points;',codePassed:true};x.pages[4].data={fields:['name','score','lives'],methods:['add','get','lose'],reflection:'These fields and methods belong together because they model a player and the ways its score and lives change.',designDone:true};
 x.assessments['3.1'].attempts=[sampleResult(QUESTIONS,80)];x.assessments['3.1'].locked=true;
 }
 return {page:lesson,check:renderCheck,results:renderResults,complete,mastery,click:handleClick,change:handleChange,input:handleInput, sample,questionBank:QUESTIONS,
  handlesClick:act=>['review-submit','submit-check','explore','classify-check','sim','sim-reset','test-code','code-template','check-design'].includes(act),
  handlesChange:act=>['classify-select','concept','challenge','design-select','check-answer','check-category'].includes(act),
  handlesInput:el=>['design-reflection','java-body'].includes(el.id)};
}
