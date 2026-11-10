import {TOPICS,IMPLEMENTED_TOPICS,getImplementedTopic,topicProgress,topicCompleted,topicUnlocked,pageUnlocked,pageKey} from './registry.js';
import {blankState,load,save,exportJson,importJson,teacherOn,setTeacher,assessment,passed,recordEvent} from './storage.js';
import {createReport} from './pdf.js';
import {shuffledOptions as importOptionShuffle} from './order.js';
import {renderSubmissionReview} from './review.js';

// SHA-256 of the teacher preview phrase. Not secure authentication; client-side code can be bypassed.
const TEACHER_CODE_SHA256='1748cf4a9216d2bbfd99694bb9c93c51629c9fea0e0c381141adec82947d4759';
async function validTeacherCode(input){
 const bytes=new TextEncoder().encode(input);
 const hash=await crypto.subtle.digest('SHA-256',bytes);
 return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('')===TEACHER_CODE_SHA256;
}

let state=load(),preview=null,flash=null,teacherClicks=0,lastRenderedHash=null,resetTopic='3.1',reviewFilter='missed';
const controllers=new Map();
const $=s=>document.querySelector(s);
const esc=x=>String(x??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const view=()=>teacherOn()?(preview??=structuredClone(state)):state;
const studentName=st=>st.identity?`${st.identity.first} ${st.identity.last}.`:'Teacher preview';
const orderSeed=()=>view().orderSeed;
const store=()=>{if(!teacherOn()&&!save(state))toast('Browser storage is unavailable. Download a backup regularly.');};
const pData=key=>{const st=view();st.pages[key]??={completed:false,completedAt:null,data:{}};st.pages[key].data??={};return st.pages[key].data;};
const commit=()=>{updateCompletion();store();};
const onChangePage=i=>{view().currentPage=i;store();};
function toast(message,good=false){const zone=$('#toast-region');const e=document.createElement('div');e.className='toast'+(good?' good':'');e.textContent=message;zone.append(e);setTimeout(()=>e.remove(),4200);}
function showError(message){flash={message,kind:'bad'};render();}
function renderFlash(){if(!flash)return '';const text=esc(flash.message),kind=flash.kind;flash=null;return `<div class="feedback ${kind}" role="status">${text}</div>`;}
function updateCompletion(){const st=view();for(const topic of IMPLEMENTED_TOPICS){const controller=controllers.get(topic.id);for(let n=1;n<=topic.lessons.length;n++){
 const key=topic.pageId(n),page=st.pages[key];if(!page||page.completed||!controller.complete(n,page.data||{}))continue;
 page.completed=true;page.completedAt=new Date().toISOString();recordEvent(st,'lesson-complete',`${topic.id}.${n}`);toast(`Page ${topic.id}.${n} completed. Nice work!`,true);
}}}
function route(){const path=location.hash.replace(/^#\/?/,'').split('/').filter(Boolean);
 if(path[0]==='topic'&&getImplementedTopic(path[1])&&['page','check','results'].includes(path[2])){
  const topic=getImplementedTopic(path[1]);const n=Math.max(1,Math.min(topic.lessons.length,Number(path[3])||1));
  return {type:'topic',id:topic.id,view:path[2],number:n};
 }
 if(path[0]==='reports')return {type:'reports'};
 if(path[0]==='teacher')return {type:'teacher'};
 return {type:'home'};
}
function go(url){if(location.hash===url)render();else location.hash=url;window.scrollTo({top:0,behavior:'instant'});}
function link(url,text,extra=''){return `<button type="button" class="btn ${extra}" data-nav="${esc(url)}">${text}</button>`;}
function header(){const st=view(),t=teacherOn();return `<div class="layout">
 <aside class="sidebar" aria-label="Unit navigation">
 <div class="brand"><div class="brand-mark" aria-label="FB">FB</div><div class="brand-text"><strong>Class Creation Lab</strong><small>AP CSA · Unit 3</small></div></div>
 <div class="nav-overline">THE COURSE</div><nav class="topic-nav" aria-label="Topics">
 ${TOPICS.map(u=>{const ok=topicUnlocked(st,u.id,t);const href=ok?`#/topic/${u.id}/page/1`:'';
 return `<button class="topic-item ${u.implemented?'current':''}" data-nav="${href}" ${ok?'':'disabled'} title="${ok?'Open topic':u.implemented?'Pass the previous topic to unlock':'Planned for future release'}"><span class="topic-number">${u.id}</span><span class="name">${esc(u.title)}</span><span class="lock">${ok?'●':'🔒'}</span></button>`;
 }).join('')}</nav>
 <div class="sidebar-bottom"><div class="student-pill"><span class="student-dot"></span>${esc(studentName(st))}</div><div class="mini-muted">${t?'Preview changes are not saved to the student record':'Saved locally on this device'}</div>
 <button class="side-link" data-nav="#/reports">Reports &amp; backups</button><br><button class="side-link" data-action="switch-student">Switch student</button>
 ${t?'<br><button class="side-link" data-nav="#/teacher">Teacher tools</button>':''}
 <br><button class="teacher-footer" id="teacher-trigger" title="Build information" aria-label="Build information">Build 1.14 · 2025 CED</button></div>
 </aside><main class="app-main" id="main-content"><div class="topbar"><div class="crumbs">AP COMPUTER SCIENCE A <span aria-hidden="true">/</span> UNIT 3 ${t?'/ TEACHER PREVIEW':''}</div>
 <div class="top-actions">${t?'<span class="teacher-banner">TEACHER PREVIEW</span>':''}<button class="btn secondary small" data-action="backup-json">↓ Backup</button><button class="btn secondary small" data-nav="#/reports">Reports</button>${t?'<button class="btn small" data-action="teacher-exit">Exit preview</button>':''}</div></div><div class="content">`;
}
function footer(){return `</div></main></div><input type="file" id="backup-file" accept=".json,application/json" hidden><dialog id="modal"><div class="dialog-body" id="modal-body"></div></dialog>`;}
function modal(html){const d=$('#modal');$('#modal-body').innerHTML=html;d.showModal();}
function closeModal(){const d=$('#modal');if(d.open)d.close();}
function renderEntry(){const topics=IMPLEMENTED_TOPICS.map(x=>x.id).join(', ').replace(/, ([^,]+)$/, ' and $1');const lessons=IMPLEMENTED_TOPICS.reduce((n,t)=>n+t.lessons.length,0);
 $('#app').innerHTML=`<div class="entry panel"><div class="brand-mark" aria-label="FB">FB</div><p class="eyebrow">2026 AP COMPUTER SCIENCE A · UNIT 3</p><h1>Class Creation Lab</h1>
 <p class="lead">Learn how programmers model real-world objects, organize information, and build reusable behaviors. Work through interactive lessons at your own pace.</p>
 <div class="callout maroon"><strong>Topics ${topics} are available.</strong> ${lessons} interactive lesson pages, ${IMPLEMENTED_TOPICS.length} separate graded checks, and local progress reports. Later topics remain locked until released.</div>
 <form id="identity-form" autocomplete="off" style="margin-top:24px"><div class="entry-fields"><div class="field"><label for="first-name">First name</label><input id="first-name" class="input" maxlength="30" required placeholder="Alex" autocomplete="given-name"></div>
 <div class="field"><label for="last-initial">Last initial</label><input id="last-initial" class="input" maxlength="1" required pattern="[A-Za-z]" placeholder="R"></div></div>
 <p class="fineprint">Only your first name and last initial are saved. Progress stays in this browser unless you export it.</p><button class="btn block" type="submit">Start learning →</button></form>
 <div class="separator"></div><button class="btn secondary block" data-action="import-backup">Restore progress from JSON backup</button>
 <div style="text-align:center;margin-top:16px"><button class="teacher-footer" id="teacher-trigger" aria-label="Build information">Build 1.14 · 2025 CED</button></div></div>
 <input type="file" id="backup-file" accept=".json,application/json" hidden><dialog id="modal"><div class="dialog-body" id="modal-body"></div></dialog>`;
}
function home(){const st=view(),t=teacherOn();const first=IMPLEMENTED_TOPICS[0],firstDone=topicProgress(st,first.id),next=firstDone===first.lessons.length?IMPLEMENTED_TOPICS[1]:null;
 const latest=assessment(st,first.id).attempts.at(-1);return `<div class="page-title"><p class="eyebrow">YOUR LEARNING DASHBOARD</p><h1>Welcome back, ${esc(st.identity?.first||'teacher')}.</h1><p class="lead">Work in order. Complete each activity to unlock the next page, then score at least 80% on the section check.</p></div>
 <section class="hero"><div class="eyebrow">UNIT 3 · CLASS CREATION</div><h1>Build worlds with classes.</h1><p>Explore abstraction and program design through interactive Java learning labs.</p>
 <div class="hero-cta">${link(`#/topic/${first.id}/page/${Math.min(first.lessons.length,firstDone+1)}`,'Continue learning →','light')}${next?link(topicUnlocked(st,next.id,t)?`#/topic/${next.id}/page/1`:`#/topic/${first.id}/check`,topicUnlocked(st,next.id,t)?`Continue to Topic ${next.id} →`:'Section check →','secondary'):''}</div></section>
 <div class="panel" style="margin-top:18px"><div class="spaced"><div><span class="kicker">YOUR PROGRESS</span><h3 style="margin:2px 0">${firstDone} of ${first.lessons.length} pages completed</h3></div><span class="step-badge ${latest?.score>=80?'complete':''}">${latest?(latest.score>=80?'Mastered · '+latest.score+'%':'Section check · '+latest.score+'%'):'Check not submitted'}</span></div><div class="page-progress" role="progressbar" aria-valuemin="0" aria-valuemax="${first.lessons.length}" aria-valuenow="${firstDone}" aria-label="Topic ${first.id} lesson progress"><span style="width:${firstDone/first.lessons.length*100}%"></span></div></div>
 <div class="page-title" style="padding-bottom:10px"><h2>Course roadmap</h2><p class="helper">${IMPLEMENTED_TOPICS.map(x=>x.id).join(' and ')} are available. Pass each section check to unlock the next topic.</p></div>
 <section class="topic-list-dashboard" aria-label="Unit roadmap">${TOPICS.map(u=>{const ok=topicUnlocked(st,u.id,t),result=passed(st,u.id),label=!u.implemented?'Planned':result?'Mastered':ok?'Available':'Locked';
 return `<div class="topic-dashboard-card ${u.implemented?'active':''}"><div style="display:flex;gap:13px;align-items:center"><div class="num">${u.id}</div><div><h3>${esc(u.title)}</h3><p>${u.pages} instructional pages${u.implemented?' · implemented':''}</p></div></div><span class="pill ${ok?'maroon':''}">${label}</span>${ok?link(`#/topic/${u.id}/page/1`,'Open →','secondary small'):''}</div>`;}).join('')}</section>
 <div class="panel soft" style="margin-top:18px"><h3>How this works</h3><div class="two-cols"><p class="helper"><strong>1. Learn and practice.</strong> Explore each concept, make predictions, and retry activities until correct.</p><p class="helper"><strong>2. Demonstrate mastery.</strong> The section check has one graded submission. A teacher reset is required after an unsuccessful attempt.</p></div><p class="fineprint">Progress is automatically saved on this device. Download JSON backups if you change computers. Browser-side progress and graded checks are not tamper-proof.</p></div>`;
}
function renderReports(){const st=view();return `<div class="page-title"><p class="eyebrow">PROGRESS, BACKUPS & REPORTS</p><h1>Your learning record</h1><p class="lead">Save your work between sessions. Export JSON backups and detailed PDFs for available topics or the full unit.</p></div>${renderFlash()}
 <div class="two-cols"><div class="panel"><p class="kicker">Progress backup</p><h2>JSON · Save and restore</h2><p>Backups preserve lesson evidence, assessment drafts, scores, and attempts for all available topics.</p><div class="btn-row"><button class="btn" data-action="backup-json">↓ Export JSON</button><button class="btn secondary" data-action="import-backup">↑ Import JSON</button></div><p class="fineprint">Import replaces local progress after student identification is confirmed. Keep your backup private.</p></div>
 <div class="panel"><p class="kicker">Available topic reports</p><h2>Individual section PDFs</h2><p>Each report contains graded questions, submitted responses, scores, attempts, and practice evidence.</p><div class="btn-row">${IMPLEMENTED_TOPICS.map((u,i)=>`<button class="btn ${i?'secondary':''}" data-action="pdf-topic" data-topic="${u.id}">↓ Topic ${u.id} PDF</button>`).join('')}</div></div></div>
 <div class="panel" style="margin-top:18px"><p class="kicker">Unit record</p><h2>Cumulative Unit 3 PDF</h2><p>Includes all available topics and a unit status dashboard.</p><button class="btn" data-action="pdf-cumulative">↓ Download cumulative PDF</button></div>
 <div class="panel" style="margin-top:18px"><h2>Current progress</h2><div class="two-cols">${IMPLEMENTED_TOPICS.map(u=>{const a=assessment(st,u.id);return `<div class="info-cell"><strong>${topicProgress(st,u.id)} / ${u.lessons.length}</strong><p>Topic ${u.id} pages completed · ${a.attempts.at(-1)?.score??'–'}/100 latest check · ${a.attempts.length} attempt(s)</p></div>`;}).join('')}</div><p class="fineprint" style="margin-top:15px">Progress is stored in this browser's localStorage, not synchronized between devices. GitHub Pages cannot provide secure identities or tamper-proof scores.</p></div>`;
}
function renderTeacher(){if(!teacherOn())return `<div class="panel"><h2>Teacher preview is disabled</h2><p>Activate teacher mode using the configured shortcut and access code.</p></div>`;
 return `<div class="page-title"><p class="eyebrow">TEACHER CONSOLE · PREVIEW MODE</p><h1>Inspect lessons and support students.</h1><p class="lead">All ${IMPLEMENTED_TOPICS.reduce((n,t)=>n+t.lessons.length,0)} lessons and ${IMPLEMENTED_TOPICS.length} section checks can be previewed. Preview work does not alter student progress; check resets apply to the current saved record.</p></div>
 <div class="callout warning" style="margin-bottom:18px">The teacher access code is a convenience, not secure authentication: GitHub Pages runs all code in the browser.</div>
 <div class="panel"><h2>Jump directly to content</h2>${IMPLEMENTED_TOPICS.map(u=>`<div class="btn-row" style="margin-top:11px">${u.lessons.map((p,i)=>link(`#/topic/${u.id}/page/${i+1}`,`${u.id}.${i+1} ${esc(p.title)}`,'secondary small')).join('')}${link(`#/topic/${u.id}/check`,`${u.id} check`,'secondary small')}${link(`#/topic/${u.id}/results`,`${u.id} results`,'secondary small')}</div>`).join('')}</div>
 <div class="two-cols" style="margin-top:18px">${IMPLEMENTED_TOPICS.map(u=>{const a=assessment(state,u.id);return `<div class="panel"><h3>Topic ${u.id} attempt</h3><p class="helper">Current student: <strong>${esc(studentName(state))}</strong>. Attempts: <strong>${a.attempts.length}</strong>. Latest: <strong>${a.attempts.at(-1)?.score??'Not attempted'}</strong>.</p><button class="btn" data-action="reset-check" data-topic="${u.id}" ${!state.identity||!a.attempts.length?'disabled':''}>Reset ${u.id} check</button><p class="fineprint">Prior submissions remain in the record.</p></div>`;}).join('')}</div>
 <div class="panel" style="margin-top:18px"><h3>Preview PDF samples</h3><div class="btn-row">${IMPLEMENTED_TOPICS.map(u=>`<button class="btn secondary" data-action="sample-pdf" data-topic="${u.id}">↓ Sample ${u.id} PDF</button>`).join('')}</div></div>
 <div class="panel" style="margin-top:18px"><h3>Release coverage</h3><p class="helper">${IMPLEMENTED_TOPICS.map(u=>'Topic '+u.id).join(' and ')} are functional. Later topics remain on the roadmap.</p></div>`;
}
function makeSample(){const x=blankState();x.identity={first:'Sample',last:'S'};x.pages={};
 const sampleResult=(bank,score)=>{const correctCount=Math.round(score/100*bank.length),value=100/bank.length;
  const answers=Object.fromEntries(bank.map((q,i)=>{if(q.kind==='choice')return [q.id,i<correctCount?q.answer:(q.answer+1)%q.options.length];return [q.id,Object.fromEntries(q.items.map(([,correct],j)=>[j,i<correctCount||j>0?correct:q.categories.find(c=>c!==correct)]))];}));
  const points=Object.fromEntries(bank.map((q,i)=>[q.id,i<correctCount?value:0]));
  return {at:new Date().toISOString(),score,answers,points,questions:bank.map(q=>({...q}))};
 };
 for(const u of IMPLEMENTED_TOPICS)controllers.get(u.id).sample(x,sampleResult);
 return x;
}
function render(){const samePage=lastRenderedHash===location.hash,savedY=samePage?(window.scrollY||0):0;
 if(!state.identity&&!teacherOn()){renderEntry();lastRenderedHash=location.hash;return;}
 const r=route();let body;
 if(r.type==='topic'){
  const controller=controllers.get(r.id),a=assessment(view(),r.id),registered=getImplementedTopic(r.id);
  const isRecorded=(r.view==='results'||(r.view==='check'&&a.locked))&&a.attempts.length>0;
  if(isRecorded&&topicUnlocked(view(),r.id,teacherOn()))body=renderSubmissionReview(r.id,a,controller.questionBank,teacherOn(),reviewFilter,registered.title);
  else body=controller[r.view](r.number);
 }
 else body=r.type==='reports'?renderReports():r.type==='teacher'?renderTeacher():home();
 $('#app').innerHTML=header()+body+footer();document.title=(r.type==='topic'&&r.view==='page'?`${r.id}.${r.number} · `:'')+'Class Creation Lab | AP CSA';
 lastRenderedHash=location.hash;if(samePage&&typeof requestAnimationFrame==='function')requestAnimationFrame(()=>window.scrollTo({top:savedY,behavior:'instant'}));
}
function activateTeacher(){modal(`<button class="dialog-close" data-action="modal-close" aria-label="Close">×</button><h2>Teacher access</h2><p class="helper">Enter your local preview access code. This is a classroom convenience, not secure authentication.</p>
 <form id="teacher-form"><div class="field"><label for="teacher-code">Access code</label><input class="input" id="teacher-code" type="password" autocomplete="off" required></div><div class="dialog-actions"><button class="btn secondary" type="button" data-action="modal-close">Cancel</button><button class="btn" type="submit">Activate preview</button></div></form>`);$('#teacher-code').focus();}
function confirmReset(topic='3.1'){resetTopic=topic;const a=assessment(state,topic);modal(`<button class="dialog-close" data-action="modal-close" aria-label="Close">×</button><h2>Reset ${esc(studentName(state))}'s Topic ${resetTopic} check?</h2><p>This starts a fresh attempt but preserves ${a.attempts.length} previous submission${a.attempts.length===1?'':'s'} and scores in the PDF report.</p><div class="dialog-actions"><button class="btn secondary" data-action="modal-close">Cancel</button><button class="btn" data-action="confirm-reset">Reset check</button></div>`);}
function confirmSwitch(){modal(`<button class="dialog-close" data-action="modal-close" aria-label="Close">×</button><h2>Switch to another student?</h2><p>The current student's progress will be downloaded as a JSON backup before this browser's saved record is cleared.</p><p class="helper">Make sure the backup download succeeds. Students using shared computers should not rely on browser storage alone.</p><div class="dialog-actions"><button class="btn secondary" data-action="modal-close">Cancel</button><button class="btn" data-action="confirm-switch">Back up and switch</button></div>`);}
function handleClick(event){const trigger=event.target.closest('#teacher-trigger');if(trigger){teacherClicks++;if(teacherClicks>=5){teacherClicks=0;activateTeacher();}return;}
 const nav=event.target.closest('[data-nav]');if(nav){if(!nav.disabled)go(nav.dataset.nav);return;}
 const el=event.target.closest('[data-action]');if(!el||el.disabled)return;const act=el.dataset.action;
 if(act==='modal-close'){closeModal();return;}
 if(act==='review-filter'){if(['missed','all'].includes(el.dataset.value)){reviewFilter=el.dataset.value;render();}return;}
 if(act==='backup-json'){exportJson(state.identity?state:view());toast('Progress backup downloaded.',true);return;}
 if(act==='import-backup'){$('#backup-file')?.click();return;}
 if(act==='pdf-topic'||act==='pdf-cumulative'){const x=createReport(state.identity?state:view(),{cumulative:act==='pdf-cumulative',topic:el.dataset.topic||'3.1'});toast(`${x.filename} downloaded (${x.pages} pages).`,true);return;}
 if(act==='switch-student'){confirmSwitch();return;}
 if(act==='confirm-switch'){if(state.identity)exportJson(state);state=blankState();preview=null;setTeacher(false);save(state);closeModal();go('#/home');render();return;}
 if(act==='teacher-exit'){setTeacher(false);preview=null;go('#/home');render();toast('Teacher preview closed.',true);return;}
 if(act==='reset-check'){if(teacherOn()&&state.identity&&getImplementedTopic(el.dataset.topic||'3.1'))confirmReset(el.dataset.topic||'3.1');return;}
 if(act==='confirm-reset'){if(!teacherOn())return;const a=assessment(state,resetTopic);a.locked=false;a.draft={};recordEvent(state,'teacher-reset',`${resetTopic} graded check`);save(state);preview=structuredClone(state);closeModal();render();toast('The graded check has been reset. Previous attempts were retained.',true);return;}
 if(act==='sample-pdf'){createReport(makeSample(),{sample:true,topic:el.dataset.topic||'3.1'});toast('Sample PDF downloaded.',true);return;}
 for(const topic of IMPLEMENTED_TOPICS){const c=controllers.get(topic.id);if(c.handlesClick(act)){c.click(el);return;}}
}
function handleChange(event){const el=event.target,act=el.dataset.action;
 if(el.id==='backup-file'){const file=el.files?.[0];if(!file)return;importJson(file,state.identity).then(next=>{if(!window.confirm(`Restore the progress backup for ${next.identity.first} ${next.identity.last}.? This replaces the saved record on this device.`))return;state=next;preview=null;setTeacher(false);save(state);go('#/home');render();toast('Progress restored from JSON.',true);}).catch(e=>toast('Import failed: '+e.message));el.value='';return;}
 for(const topic of IMPLEMENTED_TOPICS){const c=controllers.get(topic.id);if(c.handlesChange(act)){c.change(el);return;}}
}
function handleInput(event){const el=event.target;for(const topic of IMPLEMENTED_TOPICS){const c=controllers.get(topic.id);if(c.handlesInput(el)){c.input(el);return;}}}
function handleSubmit(event){
 if(event.target.id==='identity-form'){
  event.preventDefault();const first=$('#first-name').value.trim().replace(/\s+/g,' '),last=$('#last-initial').value.trim().toUpperCase();
  if(!/^\p{L}[\p{L} '\-]{0,29}$/u.test(first)||!/^\p{L}$/u.test(last)){toast('Enter a valid first name and a single-letter last initial.');return;}
  state.identity={first,last};state.joinedAt??=new Date().toISOString();save(state);go('#/home');render();toast(`Welcome, ${first}.`,true);return;
 }
 if(event.target.id==='teacher-form'){
  event.preventDefault();const entered=$('#teacher-code').value;
  validTeacherCode(entered).then(correct=>{
   if(!correct){toast('Incorrect teacher code.');return;}
   setTeacher(true);preview=structuredClone(state);closeModal();go('#/teacher');render();toast('Teacher preview activated.',true);
  }).catch(()=>toast('The browser could not verify the teacher code. Use HTTPS or localhost.'));
  return;
 }
}

const context={view,pData,commit,store,render,toast,link,esc,orderSeed,teacherOn,
 isPageCompleted:(st,key)=>!!st.pages[key]?.completed,
 pageUnlocked,topicUnlocked,topicCompleted,topicProgress,
 canOpenPage:(st,n,t)=>pageUnlocked(st,'3.1',n,t),hasLessonMastery:st=>topicCompleted(st,'3.1'),
 assessment,passed,recordEvent,go,showError,renderFlash,modal,closeModal,$,
 shuffled:(options,salt)=>importOptionShuffle(options,orderSeed(),salt),onChangePage};
// Construct all registered topic controllers once; the shell contains no topic-specific UI code.
for(const topic of IMPLEMENTED_TOPICS)controllers.set(topic.id,topic.create(context));
document.addEventListener('click',handleClick);
document.addEventListener('change',handleChange);
document.addEventListener('input',handleInput);
document.addEventListener('submit',handleSubmit);
document.addEventListener('keydown',ev=>{if(ev.ctrlKey&&ev.altKey&&ev.shiftKey&&ev.key.toLowerCase()==='t'){ev.preventDefault();activateTeacher();}if(ev.key==='Escape'&&$('#modal')?.open)closeModal();
 for(const topic of IMPLEMENTED_TOPICS){const c=controllers.get(topic.id);if(c?.handlesKeydown?.(ev.target)){c.keydown(ev);return;}}
});
window.addEventListener('hashchange',render);
render();
