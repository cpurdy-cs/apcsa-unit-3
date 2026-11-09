import {handleConstructorEditorKeydown} from './editor34.js';
import {PAGE34,FACTORY_CALLS,FACTORY_PRACTICE,DEFAULT_FIELDS,DEFAULT_SCENARIOS,DEFAULT_PRACTICE,WORKSHOP_PRACTICE,CONSTRUCTOR_CHALLENGES,MULTI_CARDS,MULTI_SLOTS,MULTI_PRACTICE,COPY_IMPLEMENTATIONS,COPY_PRACTICE,QUESTIONS34} from '../content34.js';
import {page34Id,complete34,factoryStep,testDefaultScenario,runConstructorTests,assembledConstructor,runMultiNext,startCopy,mutateCopy,render34Page,render34Check,render34Results,answerCount34,answersComplete34,grade34} from '../topic34.js';

// Topic 3.4 plugin. Existing topics remain self-contained and unchanged.
export function createTopic34(ctx){
 const {view,pData,commit,store,render,toast,link,esc,orderSeed,teacherOn,assessment,recordEvent,go,modal,closeModal,$,pageUnlocked,topicUnlocked,topicCompleted}=ctx;
 const data=n=>pData(page34Id(n));
 function page(n){const st=view(),t=teacherOn();
  if(!pageUnlocked(st,'3.4',n,t))return `<div class="panel"><h2>Topic 3.4 is locked</h2><p>${!topicUnlocked(st,'3.4',t)?'Pass the Topic 3.3 section check first.':'Complete the previous Topic 3.4 lesson first.'}</p>${link('#/home','Back to dashboard')}</div>`;
  const meta=PAGE34[n-1],done=PAGE34.filter((_,i)=>!!st.pages[page34Id(i+1)]?.completed).length,completed=!!st.pages[page34Id(n)]?.completed;
  const aside=`<aside class="lesson-aside"><div class="panel slim"><div class="spaced"><strong style="font-size:13px">Topic 3.4 lessons</strong><span class="small muted">${done}/5</span></div><div class="meter">${PAGE34.map((_,i)=>`<span class="${st.pages[page34Id(i+1)]?.completed?'on':''}"></span>`).join('')}</div><div class="step-list">${PAGE34.map((p,i)=>{const id=i+1,can=pageUnlocked(st,'3.4',id,t),finished=st.pages[page34Id(id)]?.completed;return `<button class="page-card ${n===id?'current':''} ${finished?'done':''}" data-nav="#/topic/3.4/page/${id}" ${can?'':'disabled'}><span class="page-num">${finished?'✓':id}</span><span class="page-label" style="flex:1">${esc(p.title)}</span><span>${!can?'🔒':n===id?'→':''}</span></button>`;}).join('')}<button class="page-card" data-nav="#/topic/3.4/check" ${topicCompleted(st,'3.4')||t?'':'disabled'}><span class="page-num">★</span><span class="page-label" style="flex:1">Graded section check</span><span>${assessment(st,'3.4').locked?'✓':'→'}</span></button></div></div>
  <div class="panel slim"><strong style="font-size:13px">Learning objective 3.4.A</strong><p class="small muted">Develop code declaring instance variables and initializing the attributes in a constructor.</p><ul class="study-goals"><li>Object state and the has-a relationship</li><li>Allocation, initialization, and references</li><li>Implicit default constructors and field defaults</li><li>Parameterized constructors</li><li>Copying mutable constructor arguments</li></ul></div><div class="panel slim"><strong style="font-size:12px">Source alignment</strong><p class="fineprint">2025 AP CSA CED, Topic 3.4, LO 3.4.A, EK 3.4.A.1–5. Original lesson activities and graded questions.</p></div></aside>`;
  const foot=`<div class="lesson-footer">${n>1?link(`#/topic/3.4/page/${n-1}`,'← Previous lesson','secondary'):link('#/home','← Dashboard','secondary')}<div style="display:grid;justify-items:end;gap:5px">${n<5?(completed||t?link(`#/topic/3.4/page/${n+1}`,'Next lesson →'):'<button class="btn secondary" disabled>🔒 Next lesson</button>'):(topicCompleted(st,'3.4')||t?link('#/topic/3.4/check','Go to graded check →'):'<button class="btn secondary" disabled>🔒 Graded check</button>')}${!completed&&!t?'<span class="fineprint">Complete the required practices to advance.</span>':''}</div></div>`;
  const requirements=[
   'Step through the complete creation of at least two different Players and correctly answer three transfer situations.',
   'Predict all four field defaults, test all three constructor versions correctly, and answer three transfer situations.',
   'Choose correct initialization statements, construct three Players, and solve three independent-state situations.',
   'Write and test three entire constructor declarations (PrizeCard, ArcadeMachine, and Player), and answer the two coding questions.',
   'Test all three constructor implementations. For each one, change the original and the card balance; answer three questions and explain the problem in 50+ characters.'
  ];
  return `<div class="page-title"><p class="eyebrow">TOPIC 3.4 · LESSON ${n} OF 5</p><div class="spaced"><h1>${esc(meta.title)}</h1><span class="step-badge ${completed?'complete':''}">${completed?'✓ Completed':'In progress'}</span></div><p class="lead">${esc(meta.subtitle)}</p><p class="fineprint">Essential knowledge: ${esc(meta.ek)}</p></div><div class="lesson-layout ${n===4?'ctor-lesson-layout':''}"><div class="lesson-content">${render34Page(n,data(n),st.orderSeed)}<div class="panel soft"><div class="spaced"><strong>Lesson requirements</strong><span class="pill ${completed?'green':''}">${completed?'✓ Complete':'In progress'}</span></div><p class="helper">${requirements[n-1]}</p></div>${foot}</div>${aside}</div>`;
 }
 function check(){const st=view(),t=teacherOn();if(!topicUnlocked(st,'3.4',t))return `<div class="panel"><h2>Topic 3.4 is locked</h2><p>Pass Topic 3.3 first.</p>${link('#/home','Dashboard')}</div>`;
  if(!topicCompleted(st,'3.4')&&!t)return `<div class="panel"><h2>Complete all five Topic 3.4 lessons first</h2><p>Each required practice must be finished before the graded check opens.</p>${link('#/topic/3.4/page/1','Review Topic 3.4')}</div>`;
  const a=assessment(st,'3.4');return a.locked?results():render34Check(a,st.orderSeed,t);
 }
 function results(){const st=view();if(!topicUnlocked(st,'3.4',teacherOn()))return `<div class="panel"><h2>Topic 3.4 locked</h2>${link('#/home','Dashboard')}</div>`;return render34Results(assessment(st,'3.4'),teacherOn());}
 function click(el){const act=el.dataset.action,st=view();
  if(act==='34-factory-step'){const d=data(1);if(factoryStep(d)){commit();render();}return;}
  if(act==='34-factory-reset'){const d=data(1);d.phase=0;commit();render();return;}
  if(act==='34-default-run'){const d=data(2);if(!testDefaultScenario(d))return toast('Choose a class and predict the result first.');commit();render();return;}
  // Challenge tabs are <button>s: selection must respond to click, not change.
  if(act==='34-workshop-select'){const d=data(4);if(!CONSTRUCTOR_CHALLENGES.some(x=>x.id===el.dataset.id))return;d.workshopSelected=el.dataset.id;commit();render();return;}
  if(act==='34-workshop-run'){const d=data(4),id=d.workshopSelected||'prize';d.workshop??={};d.workshopPasses??={};const a=d.workshop[id]??={code:''};a.code=assembledConstructor(a.code,id);a.result=runConstructorTests(a.code,id,{requireClass:true});d.workshopPasses[id]=a.result.ok;commit();render();return;}
  if(act==='34-multi-next'){const d=data(3);if(runMultiNext(d)){commit();render();}return;}
  if(act==='34-copy-start'){const d=data(5);if(startCopy(d)){commit();render();}return;}
  if(act==='34-copy-mutate'){const d=data(5);if(mutateCopy(d,el.dataset.source)){commit();render();}return;}
  if(act==='34-review'){
   const a=assessment(st,'3.4');if(a.locked||!answersComplete34(a))return toast('Answer all ten questions before submitting.');
   modal(`<button class="dialog-close" data-action="modal-close" aria-label="Close">×</button><p class="eyebrow">TOPIC 3.4 · FINAL SUBMISSION</p><h2>Submit your ten answers?</h2><p>This is your only graded submission unless your teacher resets the check. You need 80 points to pass.</p><div class="dialog-actions"><button class="btn secondary" data-action="modal-close">Review answers</button><button class="btn" data-action="34-submit">Submit final answers</button></div>`);return;
  }
  if(act==='34-submit'){
   const a=assessment(st,'3.4');if(a.locked||(!topicCompleted(st,'3.4')&&!teacherOn())||!topicUnlocked(st,'3.4',teacherOn())||!answersComplete34(a))return toast('This check cannot be submitted yet.');
   const result=grade34(a);a.attempts.push(result);a.locked=true;a.draft={};recordEvent(st,'graded-check-submit',`3.4: ${result.score}/100`);store();closeModal();go('#/topic/3.4/results');toast(`Topic 3.4 recorded: ${result.score}/100.`,result.score>=80);return;
  }
 }
 function change(el){const act=el.dataset.action,st=view();
  if(act==='34-factory-select'){const d=data(1);if(el.value&&!FACTORY_CALLS.some(x=>x.id===el.value))return;d.selected=el.value;d.phase=0;commit();render();return;}
  if(act==='34-default'){const d=data(2),f=DEFAULT_FIELDS.find(x=>x.id===el.dataset.id);if(!f)return;d.defaults??={};d.defaults[f.id]=el.value;commit();render();return;}
  if(act==='34-scenario'){const d=data(2);if(el.value&&!DEFAULT_SCENARIOS.some(s=>s.id===el.value))return;d.scenario=el.value;d.predict='';d.outcome=null;commit();render();return;}
  if(act==='34-predict'){const d=data(2);if(!['yes','no',''].includes(el.value))return;d.predict=el.value;d.outcome=null;commit();render();return;}
  if(act==='34-multi-pick'){const d=data(3),slot=MULTI_SLOTS.find(s=>s.id===el.dataset.id);if(!slot||!slot.choices.some(c=>c.id===el.value))return;d.multi??={};d.multi[slot.id]=el.value;d.multiObjects=[];d.multiPassed=false;commit();render();return;}
  if(act==='34-copy-pick'){const d=data(5);if(el.value&&!COPY_IMPLEMENTATIONS.some(x=>x.id===el.value))return;d.copyMode=el.value;d.copyRun=null;d.lastVerifiedMode=null;commit();render();return;}
  if(act==='34-practice'){const n=Number(el.dataset.page),qs={1:FACTORY_PRACTICE,2:DEFAULT_PRACTICE,3:MULTI_PRACTICE,4:WORKSHOP_PRACTICE,5:COPY_PRACTICE}[n]||[];
   if(!qs.some(q=>q.id===el.dataset.id))return;const d=data(n);d.answers??={};d.answers[el.dataset.id]=Number(el.value);commit();render();return;}
  if(act==='34-grade'||act==='34-grade-cat'){
   const a=assessment(st,'3.4');if(a.locked)return;const q=QUESTIONS34.find(x=>x.id===el.dataset.id);if(!q)return;
   if(act==='34-grade'&&q.kind==='choice')a.draft[q.id]=Number(el.value);
   else if(act==='34-grade-cat'&&q.kind==='category'){a.draft[q.id]??={};a.draft[q.id][Number(el.dataset.index)]=el.value;}else return;
   store();const count=answerCount34(a);const label=$('[data-role="34-count"]'),remain=$('[data-role="34-remaining"]'),btn=$('[data-action="34-review"]');
   if(label)label.textContent=`${count} of 10 answered`;if(remain)remain.textContent=`Autosaved · ${10-count} remaining`;if(btn)btn.disabled=count!==10;return;
  }
 }
 function input(el){if(el.id==='34-constructor-editor'){const d=data(4),id=d.workshopSelected||'prize';d.workshop??={};d.workshopPasses??={};const attempt=d.workshop[id]??={code:''};attempt.code=el.value;attempt.result=null;d.workshopPasses[id]=false;commit();
   const label=$('#34-workshop-save');if(label)label.textContent='Autosaved · Run the tests to check your complete class.';return;}
  if(el.id==='34-copy-reflection'){const d=data(5);d.reflection=el.value;const count=$('#34-copy-count');if(count)count.textContent=`${el.value.trim().length}/50 characters minimum · Autosaved`;
   commit();return;}
 }
 function sample(st,sampleResult){const now=new Date().toISOString();for(let n=1;n<=5;n++)st.pages[page34Id(n)]={completed:true,completedAt:now,data:{}};
  st.pages['3.4.1'].data={selected:'b',phase:3,objects:FACTORY_CALLS.slice(0,2).map((x,i)=>({...x,oid:i+1})),answers:Object.fromEntries(FACTORY_PRACTICE.map(q=>[q.id,q.answer]))};
  st.pages['3.4.2'].data={defaults:Object.fromEntries(DEFAULT_FIELDS.map(f=>[f.id,f.answer])),verified:Object.fromEntries(DEFAULT_SCENARIOS.map(s=>[s.id,true])),answers:Object.fromEntries(DEFAULT_PRACTICE.map(q=>[q.id,q.answer]))};
  st.pages['3.4.3'].data={multi:{score:'correct',lives:'correct'},multiPassed:true,multiObjects:MULTI_CARDS.map(x=>({...x,resultScore:x.score,resultLives:x.lives})),answers:Object.fromEntries(MULTI_PRACTICE.map(q=>[q.id,q.answer]))};
  const samples={prize:'public PrizeCard(String newOwner, int initialTickets) {\n    owner = newOwner;\n    tickets = initialTickets;\n}',machine:'public ArcadeMachine(String gameTitle, double factor, boolean running) {\n    title = gameTitle;\n    multiplier = factor;\n    active = running;\n}',player:'public Player(String playerName, int startingScore, int startingLives) {\n    name = playerName;\n    score = startingScore;\n    lives = startingLives;\n}'};
  st.pages['3.4.4'].data={workshopSelected:'prize',workshop:Object.fromEntries(CONSTRUCTOR_CHALLENGES.map(c=>[c.id,{code:assembledConstructor(samples[c.id],c.id),result:runConstructorTests(assembledConstructor(samples[c.id],c.id),c.id,{requireClass:true})}])),workshopPasses:{prize:true,machine:true,player:true},answers:Object.fromEntries(WORKSHOP_PRACTICE.map(q=>[q.id,q.answer]))};
  const runs=Object.fromEntries(COPY_IMPLEMENTATIONS.map(c=>[c.id,{mode:c.id,original:c.safe?130:120,stored:c.safe?90:120,steps:[{source:'original',delta:30},{source:'card',delta:-10}]}]));
  st.pages['3.4.5'].data={copyMode:'copy',copyRun:runs.copy,copyRuns:runs,explored:COPY_IMPLEMENTATIONS.flatMap(c=>['original','card'].map(x=>c.id+'-'+x)),lastVerifiedMode:'copy',answers:Object.fromEntries(COPY_PRACTICE.map(q=>[q.id,q.answer])),reflection:'Copying a mutable TicketBalance in the constructor creates a separate object so changes through the original reference cannot modify the card balance.'};
  st.assessments['3.4'].attempts=[sampleResult(QUESTIONS34,90)];st.assessments['3.4'].locked=true;
 }
 return {page,check,results,complete:complete34,click,change,input,questionBank:QUESTIONS34,sample,
  handlesClick:a=>a?.startsWith('34-'),handlesChange:a=>a?.startsWith('34-'),handlesInput:el=>['34-constructor-editor','34-copy-reflection'].includes(el?.id),
  handlesKeydown:el=>el?.id==='34-constructor-editor',keydown:handleConstructorEditorKeydown};
}
