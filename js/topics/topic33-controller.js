import {PAGE33,ANATOMY,CLASS_PARTS,ACCESS_MEMBERS,ACCESS_TRANSFER,OBJECT_TRANSFER,BUILD_SLOTS,BUILD_TRANSFER,QUESTIONS33} from '../content33.js';
import {page33Id,complete33,accessPermitted,addToObject,getFromObject,render33Page,render33Check,render33Results,answerCount33,answersComplete33,grade33,buildFeedback} from '../topic33.js';

// Topic 3.3: isolated content/controller. No changes to completed Topic 3.1 or 3.2 lessons.
export function createTopic33(ctx){
 const {view,pData,commit,store,render,toast,link,esc,orderSeed,teacherOn,assessment,passed,recordEvent,go,modal,closeModal,$,pageUnlocked,topicUnlocked,topicCompleted}=ctx;
 const data33=n=>pData(page33Id(n));
 function page(n){const st=view(),t=teacherOn();
  if(!pageUnlocked(st,'3.3',n,t))return `<div class="panel"><h2>Topic 3.3 is locked</h2><p>${!topicUnlocked(st,'3.3',t)?'Pass Topic 3.2 first.':'Complete the previous Topic 3.3 lesson first.'}</p>${link('#/home','Back to dashboard')}</div>`;
  const meta=PAGE33[n-1],d=data33(n),completed=!!st.pages[page33Id(n)]?.completed,done=PAGE33.filter((_,i)=>!!st.pages[page33Id(i+1)]?.completed).length;
  const aside=`<aside class="lesson-aside"><div class="panel slim"><div class="spaced"><strong style="font-size:13px">Topic 3.3 lessons</strong><span class="small muted">${done}/4</span></div><div class="meter">${PAGE33.map((_,i)=>`<span class="${st.pages[page33Id(i+1)]?.completed?'on':''}"></span>`).join('')}</div><div class="step-list">${PAGE33.map((p,i)=>{const id=i+1,ok=pageUnlocked(st,'3.3',id,t),finished=st.pages[page33Id(id)]?.completed;return `<button class="page-card ${n===id?'current':''} ${finished?'done':''}" data-nav="#/topic/3.3/page/${id}" ${ok?'':'disabled'}><span class="page-num">${finished?'✓':id}</span><span class="page-label" style="flex:1">${esc(p.title)}</span><span>${!ok?'🔒':n===id?'→':''}</span></button>`}).join('')}<button class="page-card" data-nav="#/topic/3.3/check" ${topicCompleted(st,'3.3')||t?'':'disabled'}><span class="page-num">★</span><span class="page-label" style="flex:1">Graded section check</span><span>${assessment(st,'3.3').locked?'✓':'→'}</span></button></div></div>
  <div class="panel slim"><strong style="font-size:13px">Learning objective 3.3.A</strong><p class="small muted">Develop code to designate access and visibility constraints to classes, data, constructors, and methods.</p><ul class="study-goals"><li>public classes and constructors</li><li>private attributes and encapsulation</li><li>public and private methods</li><li>Instance variables owned by each object</li></ul></div><div class="panel slim"><strong style="font-size:12px">Source alignment</strong><p class="fineprint">2025 AP CSA CED, Topic 3.3, LO 3.3.A, EK 3.3.A.1–6. Original lessons and questions.</p></div></aside>`;
  const foot=`<div class="lesson-footer">${n>1?link(`#/topic/3.3/page/${n-1}`,'← Previous lesson','secondary'):link('#/home','← Dashboard','secondary')}
  <div style="display:grid;justify-items:end;gap:5px">${n<4?(completed||t?link(`#/topic/3.3/page/${n+1}`,'Next lesson →'):'<button class="btn secondary" disabled>🔒 Next lesson</button>'):(topicCompleted(st,'3.3')||t?link('#/topic/3.3/check','Go to graded check →'):'<button class="btn secondary" disabled>🔒 Graded check</button>')}${!completed&&!t?'<span class="fineprint">Complete the required practices to advance.</span>':''}</div></div>`;
  const requirements=[
   'Inspect all four class parts, correctly classify six declarations, and solve the private-access checkpoint.',
   'Test four required caller/member combinations and solve four transfer situations.',
   'Create two Player objects, add points to each, call a getter, and correctly answer three situations.',
   'Select seven valid class declarations, run access checks, solve both scenarios, and explain your design in at least 40 characters.'
  ];
  return `<div class="page-title"><p class="eyebrow">TOPIC 3.3 · LESSON ${n} OF 4</p><div class="spaced"><h1>${esc(meta.title)}</h1><span class="step-badge ${completed?'complete':''}">${completed?'✓ Completed':'In progress'}</span></div><p class="lead">${esc(meta.subtitle)}</p><p class="fineprint">Essential knowledge: ${esc(meta.ek)}</p></div><div class="lesson-layout"><div class="lesson-content">${render33Page(n,d,st.orderSeed)}<div class="panel soft"><div class="spaced"><strong>Lesson requirements</strong><span class="pill ${completed?'green':''}">${completed?'✓ Complete':'In progress'}</span></div><p class="helper">${requirements[n-1]}</p></div>${foot}</div>${aside}</div>`;
 }
 function check(){const st=view(),t=teacherOn();if(!topicUnlocked(st,'3.3',t))return `<div class="panel"><h2>Topic 3.3 is locked</h2><p>Pass the Topic 3.2 graded check to start.</p>${link('#/home','Dashboard')}</div>`;
  if(!topicCompleted(st,'3.3')&&!t)return `<div class="panel"><h2>Complete all four Topic 3.3 lessons first</h2><p>Finish each required activity before the graded check unlocks.</p>${link('#/topic/3.3/page/1','Review Topic 3.3')}</div>`;
  const a=assessment(st,'3.3');return a.locked?results():render33Check(a,st.orderSeed,t);
 }
 function results(){const st=view();if(!topicUnlocked(st,'3.3',teacherOn()))return `<div class="panel"><h2>Topic 3.3 locked</h2>${link('#/home','Dashboard')}</div>`;return render33Results(assessment(st,'3.3'),teacherOn());}
 function click(el){const act=el.dataset.action,st=view();
  if(act==='33-inspect'){const d=data33(1),id=el.dataset.id;if(!ANATOMY.some(x=>x.id===id))return;d.focus=id;d.inspected??=[];if(!d.inspected.includes(id))d.inspected.push(id);commit();render();return;}
  if(act==='33-parts-check'){const d=data33(1);d.partsChecked=true;commit();render();return;}
  if(act==='33-access-run'){
   const d=data33(2),m=ACCESS_MEMBERS.find(x=>x.id===d.member),caller=d.caller;if(!m||!['inside','outside'].includes(caller))return;
   d.accessResult={caller,member:m.id,allowed:accessPermitted(caller,m)};
   d.probed??=[];const key=`${caller}-${m.id}`;if(!d.probed.includes(key))d.probed.push(key);
   commit();render();return;
  }
  if(act==='33-create'){const d=data33(3);if(!d.created){d.created=true;d.scores={a:10,b:20};d.calls=[];}commit();render();return;}
  if(act==='33-add'||act==='33-get'){const d=data33(3),id=el.dataset.id;const ok=act==='33-add'?addToObject(d,id,Number(d.amount||5)):getFromObject(d,id);if(ok){commit();render();}return;}
  if(act==='33-validate'){const d=data33(4);d.validated=buildFeedback(d.build).all;d.clientChecked=false;commit();render();return;}
  if(act==='33-client'){const d=data33(4);if(d.validated!==true)return;d.clientChecked=true;commit();render();return;}
  if(act==='33-review'){
   const a=assessment(st,'3.3');if(a.locked||!answersComplete33(a))return toast('Answer all ten questions first.');
   modal(`<button class="dialog-close" data-action="modal-close" aria-label="Close">×</button><p class="eyebrow">TOPIC 3.3 · FINAL SUBMISSION</p><h2>Submit your ten answers?</h2><p>This is your only graded submission unless your teacher resets the check. You need 80 points to pass.</p><div class="dialog-actions"><button class="btn secondary" data-action="modal-close">Review answers</button><button class="btn" data-action="33-submit">Submit final answers</button></div>`);return;
  }
  if(act==='33-submit'){
   const a=assessment(st,'3.3');if(a.locked||(!topicCompleted(st,'3.3')&&!teacherOn())||!topicUnlocked(st,'3.3',teacherOn())||!answersComplete33(a))return toast('This check cannot be submitted yet.');
   const result=grade33(a);a.attempts.push(result);a.locked=true;a.draft={};recordEvent(st,'graded-check-submit',`3.3: ${result.score}/100`);store();closeModal();go('#/topic/3.3/results');toast(`Topic 3.3 recorded: ${result.score}/100.`,result.score>=80);return;
  }
 }
 function change(el){const act=el.dataset.action,st=view();
  if(act==='33-part'){const d=data33(1);d.parts??={};d.parts[el.dataset.id]=el.value;d.partsChecked=false;commit();render();return;}
  if(act==='33-concept'){const d=data33(1);d.concept=Number(el.value);commit();render();return;}
  if(act==='33-caller'||act==='33-member'){
   const d=data33(2);d[act==='33-caller'?'caller':'member']=el.value;d.accessResult=null;commit();render();return;
  }
  if(act==='33-practice'){
   const n=Number(el.dataset.page),qs=n===2?ACCESS_TRANSFER:n===3?OBJECT_TRANSFER:n===4?BUILD_TRANSFER:[];
   if(!qs.some(q=>q.id===el.dataset.id))return;
   const d=data33(n);d.answers??={};d.answers[el.dataset.id]=Number(el.value);commit();render();return;
  }
  if(act==='33-amount'){const d=data33(3);const amount=Number(el.value);if([5,10,25].includes(amount))d.amount=amount;commit();render();return;}
  if(act==='33-build'){const d=data33(4),s=BUILD_SLOTS.find(s=>s.id===el.dataset.id);if(!s||!s.choices.some(c=>c.id===el.value))return;d.build??={};d.build[s.id]=el.value;d.validated=undefined;d.clientChecked=false;commit();render();return;}
  if(act==='33-grade'||act==='33-grade-cat'){
   const a=assessment(st,'3.3');if(a.locked)return;
   const q=QUESTIONS33.find(q=>q.id===el.dataset.id);if(!q)return;
   if(act==='33-grade'&&q.kind==='choice')a.draft[q.id]=Number(el.value);
   else if(act==='33-grade-cat'&&q.kind==='category'){a.draft[q.id]??={};a.draft[q.id][Number(el.dataset.index)]=el.value;}
   else return;
   store();const num=answerCount33(a),count=$('[data-role="33-count"]'),remain=$('[data-role="33-remaining"]'),btn=$('[data-action="33-review"]');
   if(count)count.textContent=`${num} of 10 answered`;if(remain)remain.textContent=`Autosaved · ${10-num} remaining`;if(btn)btn.disabled=num<10;return;
  }
 }
 function input(el){if(el.id!=='33-reflection')return;
  const d=data33(4);d.reflection=el.value;
  const counter=$('#33-reflection-count');if(counter)counter.textContent=`${el.value.trim().length}/40 characters minimum · Autosaved`;
  commit();if(view().pages[page33Id(4)]?.completed){const nav=$('[data-nav="#/topic/3.3/check"]');if(nav)nav.disabled=false;
   const btn=$('.lesson-footer button:disabled');if(btn){btn.disabled=false;btn.dataset.nav='#/topic/3.3/check';btn.textContent='Go to graded check →';}
  }
 }
 function sample(st,sampleResult){const now=new Date().toISOString();for(let n=1;n<=4;n++)st.pages[page33Id(n)]={completed:true,completedAt:now,data:{}};
  st.pages['3.3.1'].data={inspected:ANATOMY.map(x=>x.id),parts:Object.fromEntries(CLASS_PARTS.map(x=>[x.id,x.answer])),partsChecked:true,concept:1};
  st.pages['3.3.2'].data={probed:['inside-score','outside-score','inside-get','outside-get'],answers:Object.fromEntries(ACCESS_TRANSFER.map(q=>[q.id,q.answer]))};
  st.pages['3.3.3'].data={created:true,scores:{a:15,b:30},calls:[{kind:'add',id:'a',amount:5,score:15},{kind:'add',id:'b',amount:10,score:30},{kind:'get',id:'a',score:15}],answers:Object.fromEntries(OBJECT_TRANSFER.map(q=>[q.id,q.answer]))};
  st.pages['3.3.4'].data={build:Object.fromEntries(BUILD_SLOTS.map(x=>[x.id,'correct'])),validated:true,clientChecked:true,answers:Object.fromEntries(BUILD_TRANSFER.map(q=>[q.id,q.answer])),reflection:'The private ticket field prevents external direct modifications while the public getter exposes the value safely.'};
  st.assessments['3.3'].attempts=[sampleResult(QUESTIONS33,90)];st.assessments['3.3'].locked=true;
 }
 return {page,check,results,complete:complete33,click,change,input,questionBank:QUESTIONS33,sample,
  handlesClick:action=>action?.startsWith('33-'),handlesChange:action=>action?.startsWith('33-'),handlesInput:el=>el?.id==='33-reflection'};
}
