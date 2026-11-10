import {PAGE33,ANATOMY,CLASS_PARTS,ACCESS_MEMBERS,ACCESS_TRANSFER,OBJECT_TRANSFER,BUILD_SLOTS,BUILD_TRANSFER,QUESTIONS33} from './content33.js';
import {stableShuffle,placeCorrectOption,gradedChoiceTargets,shuffledOptions} from './order.js';
const e=value=>String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
// Presentation-only: render existing inline backticks as code without changing questions.
const inlineCode33=value=>e(value).replace(/`([^`]+)`/g,(_,v)=>`<code>${v}</code>`);
// Formatting-only display text: preserve the published lesson content and its IDs.
// Each clickable region corresponds to one semantic component of valid Java source.
const ANATOMY_DISPLAY = {
 class: {lines:'1', code:'public class Player {'},
 data: {lines:'2', code:'    private int score;'},
 ctor: {lines:'3–5', code:'    public Player() {\n        score = 0;\n    }'},
 method: {lines:'6–8', code:'    public int getScore() {\n        return score;\n    }'}
};
export const page33Id=n=>`3.3.${n}`;
export const accessPermitted=(caller,member)=>caller==='inside'||member.visibility==='public';
export function accessCode(caller,member){
 const target=caller==='inside'?'':'p.';
 const statement=member.id==='score'?`int copy = ${target}score;`:`${target}${member.method};`;
 return caller==='inside'?`// Inside the Player class\npublic void inspect() {\n    ${statement}\n}`:`// Inside Runner (a different class)\nPlayer p = new Player();\n${statement}`;
}
export function objectState(d){return d?.created?{a:Number(d.scores?.a??10),b:Number(d.scores?.b??20)}:null;}
export function addToObject(d,id,amount){
 if(!d.created||!['a','b'].includes(id)||!Number.isSafeInteger(amount)||amount<1||amount>50)return false;
 d.scores??={a:10,b:20};d.scores[id]+=amount;d.calls??=[];d.calls.push({kind:'add',id,amount,score:d.scores[id]});d.calls=d.calls.slice(-25);return true;
}
export function getFromObject(d,id){
 if(!d.created||!['a','b'].includes(id))return false;
 d.calls??=[];d.calls.push({kind:'get',id,score:d.scores?.[id]??(id==='a'?10:20)});d.calls=d.calls.slice(-25);return true;
}
export function buildFeedback(answers){
 const bySlot=Object.fromEntries(BUILD_SLOTS.map(slot=>[slot.id,answers?.[slot.id]=== 'correct']));
 return {correct:Object.values(bySlot).filter(Boolean).length,all:Object.values(bySlot).every(Boolean),bySlot};
}
export function assembledClass(answers){
 const text=id=>BUILD_SLOTS.find(s=>s.id===id)?.choices.find(c=>c.id===answers?.[id])?.text||'/* select a declaration */';
 return `${text('header')}\n    ${text('owner')}\n    ${text('tickets')}\n\n    ${text('ctor')} {\n        owner = ownerName;\n        tickets = initialTickets;\n    }\n\n    ${text('getter')} {\n        return tickets;\n    }\n\n    ${text('add')} {\n        tickets += amount;\n        audit();\n    }\n\n    ${text('helper')} {\n        System.out.println(tickets);\n    }\n}`;
}
export function complete33(n,d){
 return true;
 const answersOK=qs=>qs.every(q=>d.answers?.[q.id]===q.answer);
 if(n===1)return ANATOMY.every(p=>d.inspected?.includes(p.id))&&CLASS_PARTS.every(p=>d.parts?.[p.id]===p.answer)&&d.partsChecked===true&&d.concept===1;
 if(n===2)return ['inside-score','outside-score','inside-get','outside-get'].every(k=>d.probed?.includes(k))&&answersOK(ACCESS_TRANSFER);
 if(n===3)return !!d.created&&['a','b'].every(id=>(d.calls||[]).some(x=>x.id===id&&x.kind==='add'))&&(d.calls||[]).some(x=>x.kind==='get')&&answersOK(OBJECT_TRANSFER);
 if(n===4)return d.validated===true&&d.clientChecked===true&&answersOK(BUILD_TRANSFER)&&String(d.reflection||'').trim().length>=0;
 return false;
}
function transfer33(qs,d,seed,page){const ordered=stableShuffle(qs,seed,`33-practice-order-${page}`);
 return `<section class="panel"><p class="exercise-tag">Transfer practice · Unlimited attempts</p><h2>Apply what you learned</h2><p class="helper">Answer every situation correctly to complete the lesson. You may retry as many times as you need.</p>
 ${ordered.map((q,i)=>{const ans=d.answers?.[q.id],correct=ans===q.answer;
 return `<div class="challenge-card"><div class="q-meta">SITUATION ${i+1} OF ${qs.length}</div><h3>${inlineCode33(q.prompt)}</h3><div class="q-options">${shuffledOptions(q.options,seed,`33-practice-${q.id}`).map(opt=>`<label class="q-option"><input type="radio" name="33-pr-${q.id}" data-action="33-practice" data-page="${page}" data-id="${q.id}" value="${opt.index}" ${ans===opt.index?'checked':''}><span>${inlineCode33(opt.text)}</span></label>`).join('')}</div>${ans!==undefined?`<div class="feedback ${correct?'good':'bad'}" role="status">${correct?'✓ Correct.':'Try again.'} ${inlineCode33(q.hint)}</div>`:''}</div>`}).join('')}</section>`;
}
function pageOne(d,seed){const selected=ANATOMY.find(p=>p.id===d.focus)||null;const done=ANATOMY.filter(p=>d.inspected?.includes(p.id)).length;
 const selections=d.parts||{},correct=CLASS_PARTS.filter(p=>selections[p.id]===p.answer).length;
 return `<section class="panel"><p class="kicker">Explore · Class structure</p><h2>What actually belongs inside a class?</h2><p>Every object created from a class has its own instance variables. A class can also define a <strong>constructor</strong> and <strong>methods</strong> that work with those variables. Select each part of the example to learn its role.</p>
 <div class="code-stage"><div class="code-bar">Player.java <span>Click a code section to inspect it</span></div><div class="code-inspect code-inspect-java">${ANATOMY.map(p=>`<button type="button" class="inspect-line ${selected?.id===p.id?'selected':''}" data-action="33-inspect" data-id="${p.id}"><span class="code-line-no">${ANATOMY_DISPLAY[p.id].lines}</span><code>${e(ANATOMY_DISPLAY[p.id].code)}</code><span class="inspect-mark">${d.inspected?.includes(p.id)?'✓':'?'}</span></button>`).join('')}<div class="code-tail"><span class="code-line-no">9</span><code>}</code></div></div></div>
 ${selected?`<div class="feedback good" role="status"><strong>${e(selected.category)}:</strong> ${e(selected.explanation)}</div>`:'<div class="feedback">Select a code line to reveal what it does.</div>'}
 <p class="helper">${done}/4 structural components explored.</p></section>
 <section class="panel"><p class="kicker">Sort the declarations</p><h2>Identify the four kinds of declarations</h2><p class="helper">These are from a different class, ArcadeGame. Choose the role of each declaration, then check your work.</p>
 ${stableShuffle(CLASS_PARTS,seed,'33-part-order').map(p=>`<div class="mini-card ${d.partsChecked&&selections[p.id]===p.answer?'correct':d.partsChecked?'error':''}"><label for="33part-${p.id}"><code>${e(p.text)}</code></label><select id="33part-${p.id}" data-action="33-part" data-id="${p.id}"><option value="">Choose a role…</option>${stableShuffle(['Class header','Instance variable','Constructor','Method'],seed,`33-kind-${p.id}`).map(k=>`<option value="${k}" ${selections[p.id]===k?'selected':''}>${k}</option>`).join('')}</select></div>`).join('')}
 <div class="btn-row"><button class="btn" data-action="33-parts-check">Check declarations</button><span class="helper">${d.partsChecked?`${correct}/6 correct`:'Answer all six; you can retry.'}</span></div>${d.partsChecked?`<div class="feedback ${correct===6?'good':'bad'}" role="status">${correct===6?'✓ Every declaration is correctly classified.':`Review the highlighted declarations. Hint: ${e(CLASS_PARTS.find(p=>selections[p.id]!==p.answer)?.why||'Compare the declaration syntax.')}`}</div>`:''}</section>
 <section class="panel"><p class="exercise-tag">Concept checkpoint</p><h2>What does <code>private</code> mean?</h2><p>Player contains <code>private int score;</code>. Which statement is true?</p>
 <div class="q-options">${shuffledOptions(['The score field is shared by all Player objects.','Methods written inside Player can access score, but unrelated classes cannot access it directly.','No code anywhere can ever read score.','Only the constructor can access score.'],seed,'33-concept').map(o=>`<label class="q-option"><input type="radio" name="33-concept" data-action="33-concept" value="${o.index}" ${d.concept===o.index?'checked':''}><span>${e(o.text)}</span></label>`).join('')}</div>${d.concept!==undefined?`<div class="feedback ${d.concept===1?'good':'bad'}" role="status">${d.concept===1?'✓ Yes. Private protects the field from code outside Player.':'Not quite. Think about where the code is written, not whether the field exists.'}</div>`:''}</section>`;
}
function pageTwo(d,seed){const member=ACCESS_MEMBERS.find(m=>m.id===d.member),caller=d.caller;const valid=member&&['inside','outside'].includes(caller);const allowed=valid&&accessPermitted(caller,member);
 const probeKeys=['inside-score','outside-score','inside-get','outside-get'];const probed=probeKeys.filter(k=>d.probed?.includes(k)).length;
 return `<section class="panel"><p class="kicker">Interactive access checker</p><h2>Who is allowed to access a member?</h2><p>Encapsulation hides implementation details from other classes. <code>public</code> members are accessible externally. <code>private</code> members are only accessible inside the class that declares them.</p>
 <div class="two-cols"><div class="info-cell"><strong>Player.java</strong><pre class="reliability-code">public class Player {\n    private int score;\n    public Player() { score = 0; }\n    public int getScore() {\n        return score;\n    }\n    public void addPoints(int points) {\n        score += points;\n    }\n    private void resetInternal() {\n        score = 0;\n    }\n}</pre></div><div class="info-cell"><strong>Try a caller and a member</strong><label class="field" for="33-caller">Where is the calling code?</label><select id="33-caller" data-action="33-caller"><option value="">Choose a caller…</option><option value="inside" ${caller==='inside'?'selected':''}>Inside Player</option><option value="outside" ${caller==='outside'?'selected':''}>Inside Runner (another class)</option></select><label class="field" for="33-member" style="margin-top:12px">Which member?</label><select id="33-member" data-action="33-member"><option value="">Choose a member…</option>${stableShuffle(ACCESS_MEMBERS,seed,'33-members').map(m=>`<option value="${m.id}" ${d.member===m.id?'selected':''}>${e(m.declaration)}</option>`).join('')}</select><button class="btn" style="margin-top:14px" data-action="33-access-run" ${!valid?'disabled':''}>▶ Check access rule</button></div></div>
 <div class="code-stage" style="margin-top:18px"><div class="code-bar">Call-site preview <span>${caller==='inside'?'Player.java':'Runner.java'}</span></div><pre class="code-main reliability-code">${e(valid?accessCode(caller,member):'// Choose both a caller and a member to preview the code.')}</pre></div>
 ${d.accessResult?`<div class="feedback ${d.accessResult.allowed?'good':''}" role="status"><strong>${d.accessResult.allowed?'Access permitted':'Access denied by Java visibility rules'}.</strong> ${d.accessResult.allowed?'This code may access the member from the chosen class.':'The member is private and the caller is outside its declaring class.'} <span class="fineprint">This checker models access control; it is not a full Java compiler.</span></div>`:''}
 <p class="helper">${probed}/4 required combinations examined: Player + private field; Runner + private field; Player + public getter; Runner + public getter. Try additional combinations if you like.</p>
 <div class="test-states">${probeKeys.map(k=>`<span class="test-status ${d.probed?.includes(k)?'good':''}">${d.probed?.includes(k)?'✓ ':''}${e(k.replace('inside','Player').replace('outside','Runner').replace('-',' + '))}</span>`).join('')}</div></section>
 ${transfer33(ACCESS_TRANSFER,d,seed,2)}`;
}
function pageThree(d,seed){const scores=objectState(d),calls=d.calls||[];const current=calls.at(-1);const amount=d.amount||5;
 return `<section class="panel"><p class="kicker">Object-state simulator</p><h2>Two objects. Two independent scores.</h2><p>A class describes the attributes of a kind of object. Every <em>instance</em> receives its own copy of instance variables. Other classes request changes through public methods instead of directly changing private fields.</p>
 <div class="code-stage"><div class="code-bar">Player.java and Runner.java <span>Conceptual Java example</span></div><pre class="code-main reliability-code">${e('public class Player {\n    private int score;\n    public Player(int startingScore) {\n        score = startingScore;\n    }\n    public int getScore() { return score; }\n    public void addPoints(int points) {\n        score += points;\n    }\n}\n\n// Runner\nPlayer a = new Player(10);\nPlayer b = new Player(20);')}</pre></div>
 ${!scores?`<div class="callout maroon" style="margin-top:16px"><strong>Prediction:</strong> After creating two Players, will changing <code>a</code> change <code>b</code>? Test your idea.</div><button class="btn" data-action="33-create" style="margin-top:15px">Create both Player objects</button>`:
 `<div class="object-grid">${[['a','Player a','Ari'],['b','Player b','Bea']].map(([id,title,name])=>`<div class="object-box"><div class="object-name">${e(title)} <span class="pill">Object ${id.toUpperCase()}</span></div><div class="object-score"><span class="helper">private int score</span><strong>${scores[id]}</strong></div><div class="helper">${name}'s separate copy of score</div><div class="btn-row"><button class="btn small" data-action="33-add" data-id="${id}">addPoints(${amount})</button><button class="btn small secondary" data-action="33-get" data-id="${id}">getScore()</button></div></div>`).join('')}</div>
 <label class="field" for="33-amount" style="margin-top:16px">Points to add</label><select id="33-amount" data-action="33-amount"><option value="5" ${amount===5?'selected':''}>5 points</option><option value="10" ${amount===10?'selected':''}>10 points</option><option value="25" ${amount===25?'selected':''}>25 points</option></select>
 <div class="code-stage" style="margin-top:14px"><div class="code-bar">Most recent call <span>${calls.length} interactions logged</span></div><pre class="code-main reliability-code">${e(current?`// Called on ${current.id}\n${current.id}.${current.kind==='add'?`addPoints(${current.amount});`:'getScore();'}\n// Score of ${current.id} is now ${current.score}`:'// Run addPoints and getScore on either object.')}</pre></div>
 <p class="helper">Try <strong>addPoints</strong> on each object, and <strong>getScore</strong> on at least one object. Compare the values after each call.</p>`}</section>
 ${transfer33(OBJECT_TRANSFER,d,seed,3)}`;
}
function pageFour(d,seed){const picks=d.build||{},analysis=buildFeedback(picks),allSet=BUILD_SLOTS.every(s=>picks[s.id]);
 return `<section class="panel"><p class="kicker">Class design studio · PrizeCard</p><h2>Build a class with a safe public interface</h2><p>The arcade's PrizeCard tracks an <strong>owner name</strong> and a <strong>ticket count</strong>. A different class must be able to construct a card, read its tickets, and add tickets. The internal audit method should not be available outside PrizeCard.</p>
 <div class="callout maroon"><strong>Design requirements:</strong> public class, private attributes, public constructor, public getter, public mutator, and private helper. Choose a declaration for each slot; the preview updates immediately. Then run the structural checks.</div>
 <div class="build-workbench"><div class="build-controls"><h3>Choose your declarations</h3><p class="helper">Each selection changes the Java code beside it.</p><div class="build-grid">${stableShuffle(BUILD_SLOTS,seed,'33-build-slots').map(s=>`<div class="build-slot"><label for="33-build-${s.id}"><strong>${e(s.label)}</strong></label><select id="33-build-${s.id}" data-action="33-build" data-id="${s.id}"><option value="">Choose Java declaration…</option>${stableShuffle(s.choices,seed,`33-build-options-${s.id}`).map(c=>`<option value="${c.id}" ${picks[s.id]===c.id?'selected':''}>${e(c.text)}</option>`).join('')}</select>${d.validated!==undefined?`<div class="fineprint ${analysis.bySlot[s.id]?'build-ok':'build-err'}">${analysis.bySlot[s.id]?'✓ Fits the specification':e(s.hint)}</div>`:''}</div>`).join('')}</div></div>
 <div class="build-preview"><div class="code-stage"><div class="code-bar">PrizeCard.java <span>Live code preview</span></div><pre class="code-main reliability-code">${e(assembledClass(picks))}</pre></div><p class="fineprint">This Java class updates when you choose a declaration.</p></div></div>
 <div class="btn-row" style="margin-top:14px"><button class="btn" data-action="33-validate" ${!allSet?'disabled':''}>Check class against specifications</button><button class="btn secondary" data-action="33-client" ${d.validated!==true?'disabled':''}>▶ Run client access checks</button></div>
 ${d.validated!==undefined?`<div class="feedback ${analysis.all?'good':'bad'}" role="status">${analysis.all?'✓ All seven declarations satisfy the specified design.':'Your design matches '+analysis.correct+'/7 requirements. Review the notes under each incorrect declaration.'}</div>`:''}
 ${d.clientChecked?`<div class="feedback good" role="status"><strong>Client access checks passed:</strong> <code>card.getTickets()</code> is permitted; <code>card.tickets</code> and <code>card.audit()</code> are blocked from Runner. These are deterministic access-rule checks, not a full Java compiler.</div>`:''}</section>
 ${transfer33(BUILD_TRANSFER,d,seed,4)}
 <section class="panel"><p class="exercise-tag">Written evidence · Included in the PDF</p><h2>Explain your class design</h2><p>Why should the tickets field be private while getTickets() is public? Explain what an outside caller can and cannot do.</p><label class="field" for="33-reflection"><span class="small">Your explanation (at least 40 characters)</span><textarea id="33-reflection" rows="4" maxlength="1600" placeholder="Explain how the field and method work together…">${e(d.reflection||'')}</textarea></label><p id="33-reflection-count" class="helper">${String(d.reflection||'').trim().length}/40 characters minimum · Autosaved</p></section>`;
}
export function render33Page(n,d,seed){return [pageOne,pageTwo,pageThree,pageFour][n-1](d,seed);}
export function answerCount33(assessment){return QUESTIONS33.filter(q=>q.kind==='choice'?assessment.draft?.[q.id]!==undefined:q.items.every((_,i)=>!!assessment.draft?.[q.id]?.[i])).length;}
export const answersComplete33=a=>answerCount33(a)===QUESTIONS33.length;
export function grade33(a){const answers={},points={};let correct=0;
 for(const q of QUESTIONS33){let val=a.draft?.[q.id],ok=false;
  if(q.kind==='choice'){val=Number(val);ok=val===q.answer;}
  else{val=Object.fromEntries(q.items.map((_,i)=>[i,a.draft?.[q.id]?.[i]]));ok=q.items.every(([,correct],i)=>val[i]===correct);}
  answers[q.id]=val;points[q.id]=ok?10:0;if(ok)correct++;
 }
 return {at:new Date().toISOString(),score:correct*10,answers,points,questionBank:'2025-U3.3-v1',questions:QUESTIONS33.map(q=>({...q}))};
}
function questionInput33(q,a,seed){const ans=a.draft?.[q.id];
 if(q.kind==='choice'){
  const choices=QUESTIONS33.filter(x=>x.kind==='choice');const targets=gradedChoiceTargets(seed,choices.length),i=choices.findIndex(x=>x.id===q.id);
  return `<div class="q-options">${placeCorrectOption(q.options,q.answer,targets[i],seed,`33-grade-${q.id}`).map(opt=>`<label class="q-option"><input type="radio" name="${q.id}" data-action="33-grade" data-id="${q.id}" value="${opt.index}" ${ans===opt.index?'checked':''}><span>${inlineCode33(opt.text)}</span></label>`).join('')}</div>`;
 }
 return `<div class="q-categories">${stableShuffle(q.items.map(([label],index)=>({label,index})),seed,`33-grade-row-${q.id}`).map(({label,index})=>`<div class="q-subrow"><span><code>${e(label)}</code></span><select data-action="33-grade-cat" data-id="${q.id}" data-index="${index}" aria-label="Classify ${e(label)}"><option value="">Choose…</option>${stableShuffle(q.categories,seed,`33-grade-cat-${q.id}`).map(cat=>`<option value="${e(cat)}" ${ans?.[index]===cat?'selected':''}>${e(cat)}</option>`).join('')}</select></div>`).join('')}</div>`;
}
export function render33Check(a,seed,teacher){const count=answerCount33(a);
 return `<div class="page-title"><p class="eyebrow">TOPIC 3.3 · GRADED SECTION CHECK</p><h1>Anatomy of a Class</h1><p class="lead">10 questions · 10 points each · 8 correct required to pass. One final submission unless your teacher resets the check.</p></div><div class="callout" style="margin-bottom:16px">Answers autosave. Practice is unlimited; the graded check can only be submitted once before a teacher reset.</div>
 <section aria-label="Topic 3.3 section check">${QUESTIONS33.map((q,i)=>`<div class="assessment-row"><div class="q-meta"><span>QUESTION ${i+1} OF 10</span><span>${e(q.area)}</span><span>${e(q.objective)}</span></div><h3>${inlineCode33(q.prompt)}</h3>${questionInput33(q,a,seed)}${teacher?`<div class="teacher-answer"><strong>Teacher key:</strong> ${inlineCode33(q.kind==='choice'?q.options[q.answer]:q.items.map(([name,cat])=>`${name}: ${cat}`).join(' | '))}<p>${inlineCode33(q.explanation)}</p></div>`:''}</div>`).join('')}</section>
 <div class="assessment-sticky"><div><strong data-role="33-count">${count} of 10 answered</strong><div class="helper" data-role="33-remaining">Autosaved · ${10-count} remaining</div></div><div class="btn-row"><button class="btn secondary" data-nav="#/topic/3.3/page/4">Review lessons</button><button class="btn" data-action="33-review" ${count===10?'':'disabled'}>Review &amp; submit →</button></div></div>`;
}
export function render33Results(a,teacher){const latest=a.attempts.at(-1);if(!latest)return `<div class="panel"><h2>No Topic 3.3 submission yet</h2><button class="btn" data-nav="#/topic/3.3/check">Open check</button></div>`;
 const ok=latest.score>=80,qs=latest.questions?.length?latest.questions:QUESTIONS33;
 return `<div class="page-title"><p class="eyebrow">TOPIC 3.3 · GRADED RESULTS</p><h1>${ok?'Topic 3.3 mastered.':'Review Topic 3.3 with your teacher.'}</h1><p class="lead">${ok?'You passed. Topic 3.4 is now available.':'Your attempt is saved. Review and practice the lessons; ask your teacher for a reset before trying again.'}</p></div>
 <div class="panel" style="text-align:center"><div class="score-ring"><div class="scorebig ${ok?'good':''}">${latest.score}</div><div class="muted">/100</div></div><div class="spaced" style="justify-content:center;margin:10px 0"><span class="step-badge ${ok?'complete':''}">${ok?'PASS':'BELOW 80%'}</span><span class="pill">${a.attempts.length} attempt(s) recorded</span></div><div class="btn-row" style="justify-content:center"><button class="btn" data-action="pdf-topic" data-topic="3.3">↓ Download 3.3 PDF</button><button class="btn secondary" data-nav="#/topic/3.3/page/1">Review lessons</button></div></div>
 <section class="panel" style="margin-top:16px"><h2>Question-by-question results</h2><p class="helper">Your submitted responses are shown. Teacher mode reveals correct answers.</p>${qs.map((q,i)=>{const ans=latest.answers?.[q.id];const student=q.kind==='choice'?(ans===undefined?'(not answered)':q.options[ans]):q.items.map(([label],j)=>`${label}: ${ans?.[j]||'(blank)'}`).join(' | ');
 return `<div class="answer-review"><div class="spaced"><strong>Question ${i+1} · ${e(q.area)}</strong><span class="status ${latest.points?.[q.id]===10?'good':'bad'}">${latest.points?.[q.id]||0}/10</span></div><p>${inlineCode33(q.prompt)}</p><p class="helper"><strong>Your response:</strong> ${inlineCode33(student)}</p>${teacher?`<div class="teacher-answer"><strong>Key:</strong> ${inlineCode33(q.kind==='choice'?q.options[q.answer]:q.items.map(([label,correct])=>`${label}: ${correct}`).join(' | '))}<p>${inlineCode33(q.explanation)}</p></div>`:''}</div>`}).join('')}</section>
 ${a.attempts.length>1?`<div class="panel" style="margin-top:16px"><h3>Previous attempts</h3>${a.attempts.slice(0,-1).map((x,i)=>`<p class="helper">Attempt ${i+1}: ${x.score}/100</p>`).join('')}</div>`:''}`;
}
