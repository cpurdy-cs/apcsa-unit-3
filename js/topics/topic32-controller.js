import {PAGE32,POLICIES,IMPACT_CHALLENGES,RELIABILITY_TESTS,RELIABILITY_FIXES,CODE_ASSETS,ETHICS_CHALLENGES,QUESTIONS32} from '../content32.js';
import {page32Id,access32,mastered32,complete32,prizeResult,render32Page,render32Check,render32Results,check32AnswersComplete,check32AnswerCount,grade32} from '../topic32.js';

// Approved Topic 3.2 content and interactions are independent of the application shell.
export function createTopic32(ctx){
 const {view,pData,commit,store,render,toast,link,esc,teacherOn,assessment,passed,recordEvent,go,modal,closeModal,$,pageUnlocked,topicUnlocked,topicCompleted}=ctx;
function data32(n){return pData(page32Id(n));}
function lesson32(n){const st=view(),t=teacherOn();
 if(!pageUnlocked(st,'3.2',n,t))return `<div class="panel"><h2>Topic 3.2 is locked</h2><p>${!passed(st)?'Earn at least 80% on the Topic 3.1 check first.':'Complete the previous Topic 3.2 lesson first.'}</p>${link('#/home','Return to dashboard')}</div>`;
 const meta=PAGE32[n-1],d=data32(n),complete=!!st.pages[page32Id(n)]?.completed,done=PAGE32.filter((_,i)=>!!st.pages[page32Id(i+1)]?.completed).length;
 const aside=`<aside class="lesson-aside"><div class="panel slim"><div class="spaced"><strong style="font-size:13px">Topic 3.2 lessons</strong><span class="small muted">${done}/3</span></div><div class="meter">${PAGE32.map((_,i)=>`<span class="${st.pages[page32Id(i+1)]?.completed?'on':''}"></span>`).join('')}</div><div class="step-list">${PAGE32.map((p,i)=>{const id=i+1,ok=pageUnlocked(st,'3.2',id,t),finished=st.pages[page32Id(id)]?.completed;return `<button class="page-card ${n===id?'current':''} ${finished?'done':''}" data-nav="#/topic/3.2/page/${id}" ${ok?'':'disabled'}><span class="page-num">${finished?'✓':id}</span><span class="page-label" style="flex:1">${esc(p.title)}</span><span>${!ok?'🔒':n===id?'→':''}</span></button>`;}).join('')}<button class="page-card" data-nav="#/topic/3.2/check" ${topicCompleted(st,'3.2')||t?'':'disabled'}><span class="page-num">★</span><span class="page-label" style="flex:1">Graded section check</span><span>${assessment(st,'3.2').locked?'✓':'→'}</span></button></div></div>
 <div class="panel slim"><strong style="font-size:13px">Learning objective 3.2.A</strong><p class="small muted">Explain the social and ethical implications of computing systems.</p><ul class="study-goals"><li>System reliability</li><li>Beneficial and harmful impacts</li><li>Unintended consequences</li><li>Legal and intellectual property concerns</li></ul></div><div class="panel slim"><strong style="font-size:12px">Source alignment</strong><p class="fineprint">2025 College Board AP CSA CED, Topic 3.2, LO 3.2.A, EK 3.2.A.1–3. Original lessons and assessments.</p></div></aside>`;
 const foot=`<div class="lesson-footer">${n>1?link(`#/topic/3.2/page/${n-1}`,'← Previous lesson','secondary'):link('#/home','← Dashboard','secondary')}<div style="display:grid;justify-items:end;gap:5px">${n<3?(complete||t?link(`#/topic/3.2/page/${n+1}`,'Next lesson →'):'<button class="btn secondary" disabled>🔒 Next lesson</button>'):(topicCompleted(st,'3.2')||t?link('#/topic/3.2/check','Go to graded check →'):'<button class="btn secondary" disabled>🔒 Graded check</button>')} ${!(complete||t)&&n<3?'<span class="fineprint">Complete this page’s required activities to advance.</span>':''}</div></div>`;
 return `<div class="page-title"><p class="eyebrow">TOPIC 3.2 · LESSON ${n} OF 3</p><div class="spaced"><h1>${esc(meta.title)}</h1><span class="step-badge ${complete?'complete':''}">${complete?'✓ Completed':'~'+meta.minutes+' minutes'}</span></div><p class="lead">${esc(meta.subtitle)}</p><p class="fineprint">Essential knowledge: ${esc(meta.ek)}</p></div><div class="lesson-layout"><div>${render32Page(n,d,st.orderSeed)}<div class="panel soft"><div class="spaced"><strong>Lesson requirements</strong><span class="pill ${complete?'green':''}">${complete?'✓ Complete':'In progress'}</span></div><p class="helper">${n===1?'Explore all three policies, answer both transfer scenarios correctly, and save a reflection (at least 40 characters).':n===2?'Test all six cases, select the working repair, retest all six, and classify the three highlighted test types.':'Classify all four code assets, solve both transfer scenarios, and write at least 40 characters explaining the permission issue.'}</p></div>${foot}</div>${aside}</div>`;
}
function section32Check(){const st=view(),t=teacherOn();if(!topicUnlocked(st,'3.2',t))return `<div class="panel"><h2>Topic 3.2 locked</h2><p>Pass Topic 3.1 first.</p>${link('#/topic/3.1/check','Open Topic 3.1')}</div>`;
 if(!topicCompleted(st,'3.2')&&!t)return `<div class="panel"><h2>Complete all three Topic 3.2 lessons first</h2><p>Finish each lesson's required activities before taking the graded check.</p>${link('#/topic/3.2/page/1','Review Topic 3.2')}</div>`;
 const a=assessment(st,'3.2');if(a.locked)return section32Results();return render32Check(a,st.orderSeed,t);
}
function section32Results(){const st=view();if(!topicUnlocked(st,'3.2',teacherOn()))return `<div class="panel"><h2>Topic 3.2 locked</h2>${link('#/home','Dashboard')}</div>`;return render32Results(assessment(st,'3.2'),teacherOn());}
function click32(el){const act=el.dataset.action,st=view();
 if(act==='32-review'){
  if(!check32AnswersComplete(assessment(st,'3.2')))return toast('Answer all eight questions before submitting.');
  modal(`<button class="dialog-close" data-action="modal-close" aria-label="Close">×</button><p class="eyebrow">TOPIC 3.2 · FINAL SUBMISSION</p><h2>Submit your graded answers?</h2><p>This is your one graded attempt unless a teacher resets the check. Eight questions are worth 12.5 points each; seven correct are required for 80% mastery.</p><div class="dialog-actions"><button class="btn secondary" data-action="modal-close">Review answers</button><button class="btn" data-action="32-submit">Submit final answers</button></div>`);return;
 }
 if(act==='32-submit'){
  const a=assessment(st,'3.2');if(a.locked||(!topicCompleted(st,'3.2')&&!teacherOn())||(!topicUnlocked(st,'3.2',teacherOn()))||!check32AnswersComplete(a))return toast('The check cannot be submitted yet.');
  const result=grade32(a);a.attempts.push(result);a.locked=true;a.draft={};recordEvent(st,'graded-check-submit',`3.2: ${result.score}/100`);store();closeModal();go('#/topic/3.2/results');toast(`Topic 3.2 recorded: ${result.score}/100.`,result.score>=80);return;
 }
 if(act==='32-policy'){
  const d=data32(1),id=el.dataset.id;if(!POLICIES.some(x=>x.id===id))return;d.policy=id;d.visited??=[];if(!d.visited.includes(id))d.visited.push(id);commit();render();return;
 }
 if(act==='32-load-test'){
  const d=data32(2),id=el.dataset.id;if(!RELIABILITY_TESTS.some(x=>x.id===id))return;
  d.activeTest=id;commit();render();return;
 }
 if(act==='32-run-code'){
  const d=data32(2),test=RELIABILITY_TESTS.find(x=>x.id===d.activeTest);if(!test)return;
  const beforeDone=RELIABILITY_TESTS.every(t=>d.before?.[t.id]);
  const phase=d.fixChoice&&beforeDone?'after':'before';
  d[phase]??={};d[phase][test.id]=prizeResult(test,phase==='after'?d.fixChoice:false);
  commit();render();return;
 }
}
function change32(el){const act=el.dataset.action,st=view();
 if(act==='32-practice'){
  const page=Number(el.dataset.page),q=[...IMPACT_CHALLENGES,...ETHICS_CHALLENGES].find(x=>x.id===el.dataset.id);if(!q||![1,3].includes(page))return;
  const d=data32(page);d.answers??={};d.answers[q.id]=Number(el.value);commit();render();return;
 }
 if(act==='32-fix'){
  const d=data32(2),f=RELIABILITY_FIXES.find(x=>x.id===el.value);if(!f)return;
  if(!RELIABILITY_TESTS.every(t=>d.before?.[t.id]))return;
  if(d.fixChoice!==f.id)d.after={};d.fixChoice=f.id;commit();render();return;
 }
 if(act==='32-type'){
  const d=data32(2);d.types??={};d.types[el.dataset.id]=el.value;commit();render();return;
 }
 if(act==='32-asset'){
  const d=data32(3);d.assetAnswers??={};d.assetAnswers[el.dataset.id]=el.value;commit();render();return;
 }
 if(act==='32-graded'||act==='32-graded-category'){
  const a=assessment(st,'3.2');if(a.locked)return;
  if(act==='32-graded')a.draft[el.dataset.id]=Number(el.value);
  else{a.draft[el.dataset.id]??={};a.draft[el.dataset.id][Number(el.dataset.index)]=el.value;}
  store();const count=check32AnswerCount(a);const counter=$('[data-role="32-counter"]'),remain=$('[data-role="32-remaining"]'),submit=$('[data-action="32-review"]');
  if(counter)counter.textContent=`${count} of 8 answered`;if(remain)remain.textContent=`Autosaved · ${8-count} question${8-count===1?'':'s'} remaining`;if(submit)submit.disabled=count<8;return;
 }
}


 function handleInput(el){
 if(el.id==='reflection32'){
  const n=Number(el.dataset.page),d=data32(n);d.reflection=el.value;
  const count=$('#reflection32-count');if(count)count.textContent=`${el.value.trim().length}/40 minimum characters · Saved as you type`;
  commit();
  // Unlock the next lesson immediately when the final reflection completes a page,
  // without replacing the textarea mid-typing (which would lose the student's caret).
  if(view().pages[page32Id(n)]?.completed){
   const dest=n<3?`#/topic/3.2/page/${n+1}`:'#/topic/3.2/check';
   const btn=$('.lesson-footer button:disabled');if(btn){btn.disabled=false;btn.dataset.nav=dest;btn.textContent=n<3?'Next lesson →':'Go to graded check →';}
   const nav=$(`[data-nav="${dest}"]`);if(nav)nav.disabled=false;
  }
  return;
 }

 return false;
 }

 function sample(x,sampleResult){
 for(let i=1;i<=3;i++)x.pages[page32Id(i)]={completed:true,completedAt:new Date().toISOString(),data:{}};
 x.pages['3.2.1'].data={visited:POLICIES.map(x=>x.id),policy:'alias',reflection:'I would choose an opt-in alias board that protects privacy while keeping friendly competition.'};
 x.pages['3.2.2'].data={before:Object.fromEntries(RELIABILITY_TESTS.map(x=>[x.id,prizeResult(x,false)])),fixChoice:'b',after:Object.fromEntries(RELIABILITY_TESTS.map(x=>[x.id,prizeResult(x,true)]))};
 x.pages['3.2.3'].data={assetAnswers:Object.fromEntries(CODE_ASSETS.map(x=>[x.id,x.answer])),reflection:'I need to contact the author to get permission or license terms because public code is not necessarily open source.'};
 x.assessments['3.2'].attempts=[sampleResult(QUESTIONS32,87.5)];x.assessments['3.2'].locked=true;
 }
 return {page:lesson32,check:section32Check,results:section32Results,
  complete:complete32,mastery:mastered32,
  click:click32,change:change32,input:handleInput,questionBank:QUESTIONS32,sample,
  handlesClick:act=>act?.startsWith('32-'),
  handlesChange:act=>act?.startsWith('32-'),
  handlesInput:el=>el.id==='reflection32'};
}
