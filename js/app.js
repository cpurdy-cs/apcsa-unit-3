import {TOPICS,IMPLEMENTED_TOPICS,getImplementedTopic,topicProgress,topicCompleted,topicUnlocked,pageUnlocked,pageKey} from './registry.js';
import {renderSidebarTopics} from './sidebar-status.js';
import {createUnitSummary,renderUnitSummaryNav,unitTopicsComplete,allReviewComplete,reviewProgress,reviewPartOpen} from './unit-summary.js';
import {blankState,load,save,exportJson,importJson,teacherOn,setTeacher,assessment,passed,recordEvent} from './storage.js';
import {createReport} from './pdf.js';
import {shuffledOptions as importOptionShuffle} from './order.js';
import {renderSubmissionReview} from './review.js';
import {applyProgressOverride} from './teacher-overrides.js';
import {verifyStudentSwitchBackup,saveBlankStudentBeforeSwitch} from './switch-student.js';

// SHA-256 of the teacher preview phrase. Not secure authentication; client-side code can be bypassed.
const TEACHER_CODE_SHA256='1748cf4a9216d2bbfd99694bb9c93c51629c9fea0e0c381141adec82947d4759';
async function validTeacherCode(input){
 const bytes=new TextEncoder().encode(input);
 const hash=await crypto.subtle.digest('SHA-256',bytes);
 return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('')===TEACHER_CODE_SHA256;
}

let state=load(),preview=null,flash=null,teacherClicks=0,lastRenderedHash=null,resetTopic='3.1',reviewFilter='missed',pendingOverride=null;
const controllers=new Map();
let unitSummary=null;
let verifiedSwitchSnapshot=null, switchDialogToken=0;
// Query simple IDs with getElementById rather than a CSS selector. Some lesson
// IDs begin with digits (e.g. 33-reflection-count); #33-reflection-count is
// not a valid unescaped CSS selector and used to throw on every keystroke.
const $=s=>/^#[A-Za-z0-9_-]+$/.test(s)&&typeof document.getElementById==='function'
 ?document.getElementById(s.slice(1))
 :document.querySelector(s);
const esc=x=>String(x??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const view=()=>teacherOn()?(preview??=structuredClone(state)):state;
const studentName=st=>st.identity?`${st.identity.first} ${st.identity.last}.`:'Teacher preview';
const orderSeed=()=>view().orderSeed;
const store=()=>{if(!teacherOn()&&!save(state))toast('Browser storage is unavailable. Download a backup regularly.');};
const pData=key=>{const st=view();st.pages[key]??={completed:false,completedAt:null,data:{}};st.pages[key].data??={};return st.pages[key].data;};
let uiSyncPending=false;
// Save immediately. Refresh derived navigation/status in place rather than rebuilding a focused editor.
function syncLiveProgress(){
 uiSyncPending=false;
 if(!state.identity&&!teacherOn())return;
 const routeNow=route();if(routeNow.type!=='topic'||routeNow.view!=='page')return;
 const controller=controllers.get(routeNow.id);if(!controller)return;
 const template=document.createElement('template');template.innerHTML=controller.page(routeNow.number);
 if(!template.content?.querySelector)return;
 for(const selector of ['.lesson-aside','.lesson-footer','.page-title .step-badge','.lesson-content > .panel.soft']){
  const existing=document.querySelector(selector),fresh=template.content.querySelector(selector);
  if(existing&&fresh)existing.replaceWith(fresh);
 }
 // If a code editor is changed, old test results no longer describe the saved source.
 const editor=document.activeElement;
 if(editor?.id==='35-code-editor'){
   document.querySelectorAll('.method35-final > .feedback, .method35-final > .test-results').forEach(node=>node.remove());
   const badge=document.querySelector('.method35-final .method35-actions .pill');if(badge){badge.textContent='Not tested yet';badge.classList.remove('green');}
 }
 if(editor?.id==='36-code-editor'){
   document.querySelectorAll('.topic36-page .test-results,.topic36-page section.panel > .feedback').forEach(node=>node.remove());
   const badge=document.querySelector('.topic36-page .method35-actions .pill');if(badge){badge.textContent='Not tested yet';badge.classList.remove('green');}
 }
 if(editor?.id==='37-code-editor'){
   document.querySelectorAll('.topic37-page .test-results,.topic37-page .topic37-workshop > .feedback').forEach(node=>node.remove());
   const badge=document.querySelector('.topic37-page .topic37-workshop .method35-actions .pill');
   if(badge){badge.textContent='Not tested yet';badge.classList.remove('green');}
 }
 if(editor?.id==='39-code-editor'){
   document.querySelectorAll('.topic39-page .test-results,.topic39-page .topic39-workshop > .feedback').forEach(node=>node.remove());
   const badge=document.querySelector('.topic39-page .topic39-workshop .method35-actions .pill');
   if(badge){badge.textContent='Not tested yet';badge.classList.remove('green');}
 }
 if(editor?.id==='38-code-editor'){
  document.querySelectorAll('.topic38-page .test-results,.topic38-page .topic38-workshop > .feedback').forEach(node=>node.remove());
  const badge=document.querySelector('.topic38-page .topic38-workshop .method35-actions .pill');
  if(badge){badge.textContent='Not tested yet';badge.classList.remove('green');}
 }
 if(editor?.id==='34-constructor-editor'){
   document.querySelectorAll('.lesson-content .ctor-test-grid, .lesson-content > section.panel > .feedback').forEach(node=>node.remove());
 }
 const nav=document.querySelector('.topic-nav');
 if(nav)nav.innerHTML=renderSidebarTopics(view(),teacherOn(),routeNow.id);
 // This code intentionally does not replace the active input or editor.
}
function scheduleLiveProgress(){if(uiSyncPending)return;uiSyncPending=true;if(typeof requestAnimationFrame==='function')requestAnimationFrame(syncLiveProgress);else Promise.resolve().then(syncLiveProgress);}
const commit=()=>{updateCompletion();store();scheduleLiveProgress();};
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
 if(path[0]==='summary')return {type:'summary',number:Math.min(4,Math.max(1,Number(path[1])||1))};
 if(path[0]==='unit-complete')return {type:'finish'};
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
 ${renderSidebarTopics(st,t,route().type==='topic'?route().id:'')}${renderUnitSummaryNav(st,t,route().type==='summary'?'summary':route().type==='finish'?'finish':'',route().type==='summary'?route().number:null)}</nav>
 <div class="sidebar-bottom"><div class="student-pill"><span class="student-dot"></span>${esc(studentName(st))}</div><div class="mini-muted">${t?'Preview changes are not saved to the student record':'Saved locally on this device'}</div>
 <button class="side-link" data-nav="#/reports">Reports &amp; backups</button><br><button class="side-link" data-action="switch-student">Switch student</button>
 ${t?'<br><button class="side-link" data-nav="#/teacher">Teacher tools</button>':''}
 <br><button class="teacher-footer" id="teacher-trigger" title="Build information" aria-label="Build information">Version 2.0.0 · 2025 CED</button></div>
 </aside><main class="app-main" id="main-content"><div class="topbar"><div class="crumbs">AP COMPUTER SCIENCE A <span aria-hidden="true">/</span> UNIT 3 ${t?'/ TEACHER PREVIEW':''}</div>
 <div class="top-actions">${t?'<span class="teacher-banner">TEACHER PREVIEW</span>':''}<button class="btn secondary small" data-action="backup-json">↓ Backup</button><button class="btn secondary small" data-nav="#/reports">Reports</button>${t?'<button class="btn small" data-action="teacher-exit">Exit preview</button>':''}</div></div><div class="content">`;
}
function footer(){return `</div></main></div><input type="file" id="backup-file" accept=".json,application/json" hidden><dialog id="modal"><div class="dialog-body" id="modal-body"></div></dialog>`;}
function modal(html){const d=$('#modal');$('#modal-body').innerHTML=html;d.showModal();}
function closeModal(){switchDialogToken++;verifiedSwitchSnapshot=null;const d=$('#modal');if(d.open)d.close();}
function renderEntry(){const topics=IMPLEMENTED_TOPICS.map(x=>x.id).join(', ').replace(/, ([^,]+)$/, ' and $1');const lessons=IMPLEMENTED_TOPICS.reduce((n,t)=>n+t.lessons.length,0);
 $('#app').innerHTML=`<div class="entry panel"><div class="brand-mark" aria-label="FB">FB</div><p class="eyebrow">2026 AP COMPUTER SCIENCE A · UNIT 3</p><h1>Class Creation Lab</h1>
 <p class="lead">Learn how programmers model real-world objects, organize information, and build reusable behaviors. Work through interactive lessons at your own pace.</p>
 <div class="callout maroon"><strong>All nine topics are available.</strong> ${lessons} interactive lesson pages, ${IMPLEMENTED_TOPICS.length} graded checks, a cumulative four-part review, and local progress reports.</div>
 <form id="identity-form" autocomplete="off" style="margin-top:24px"><div class="entry-fields"><div class="field"><label for="first-name">First name</label><input id="first-name" class="input" maxlength="30" required placeholder="Alex" autocomplete="given-name"></div>
 <div class="field"><label for="last-initial">Last initial</label><input id="last-initial" class="input" maxlength="1" required pattern="[A-Za-z]" placeholder="R"></div></div>
 <p class="fineprint">Only your first name and last initial are saved. Progress stays in this browser unless you export it.</p><button class="btn block" type="submit">Start learning →</button></form>
 <div class="separator"></div><button class="btn secondary block" data-action="import-backup">Restore progress from JSON backup</button>
 <div style="text-align:center;margin-top:16px"><button class="teacher-footer" id="teacher-trigger" aria-label="Build information">Version 2.0.0 · 2025 CED</button></div></div>
 <input type="file" id="backup-file" accept=".json,application/json" hidden><dialog id="modal"><div class="dialog-body" id="modal-body"></div></dialog>`;
}
function home(){const st=view(),t=teacherOn(),remaining=IMPLEMENTED_TOPICS.find(topic=>!topicCompleted(st,topic.id)||!passed(st,topic.id));
 const nextTopic=remaining||IMPLEMENTED_TOPICS.at(-1),count=topicProgress(st,nextTopic.id),ready=topicCompleted(st,nextTopic.id);
 const target=!remaining?(allReviewComplete(st)?'#/unit-complete':'#/summary/1'):(ready?`#/topic/${nextTopic.id}/check`:`#/topic/${nextTopic.id}/page/${Math.min(nextTopic.lessons.length,count+1)}`);
 const label=!remaining?(allReviewComplete(st)?'View Unit Complete →':'Continue to Unit 3 Summary →'):(ready?`Open Topic ${nextTopic.id} graded check →`:`Continue Topic ${nextTopic.id}.${Math.min(nextTopic.lessons.length,count+1)} →`);
 const totalPages=IMPLEMENTED_TOPICS.reduce((sum,x)=>sum+x.lessons.length,0),completed=IMPLEMENTED_TOPICS.reduce((sum,x)=>sum+topicProgress(st,x.id),0),mastered=IMPLEMENTED_TOPICS.filter(x=>passed(st,x.id)).length,rev=reviewProgress(st);
 return `<div class="page-title"><p class="eyebrow">YOUR LEARNING DASHBOARD</p><h1>Welcome back, ${esc(st.identity?.first||'teacher')}.</h1><p class="lead">Complete each lesson in order, then pass its topic check. After all nine topics, finish the cumulative review to complete Unit 3.</p></div>
 <section class="hero"><div class="eyebrow">UNIT 3 · CLASS CREATION</div><h1>Build worlds with classes.</h1><p>Independent Java instruction, interactive activities, meaningful coding, and cumulative review.</p><div class="hero-cta">${link(target,label,'light')}</div></section>
 <div class="panel" style="margin-top:18px"><div class="spaced"><div><span class="kicker">YOUR UNIT PROGRESS</span><h3 style="margin:2px 0">${completed} of ${totalPages} lessons completed</h3></div><span class="step-badge ${mastered===9?'complete':''}">${mastered}/9 topics passed</span></div><div class="page-progress" role="progressbar" aria-valuemin="0" aria-valuemax="${totalPages}" aria-valuenow="${completed}" aria-label="Unit lesson progress"><span style="width:${Math.round(completed/totalPages*100)}%"></span></div><p class="helper">Cumulative review: ${rev.questions}/${rev.total} questions correct in ${rev.parts}/4 parts. ${unitTopicsComplete(st)?'Summary unlocked.':'Unlocks after all nine topics are complete and passed.'}</p></div>
 <div class="page-title" style="padding-bottom:10px"><h2>Course roadmap</h2><p class="helper">Passed checks open the next topic. Completed lessons can always be revisited.</p></div><section class="topic-list-dashboard" aria-label="Unit roadmap">${TOPICS.map(u=>{const ok=topicUnlocked(st,u.id,t),result=passed(st,u.id),status=result?'Mastered':ok?'Available':'Locked';return `<div class="topic-dashboard-card active"><div style="display:flex;gap:13px;align-items:center"><div class="num">${u.id}</div><div><h3>${esc(u.title)}</h3><p>${u.lessons?.length||u.pages} instructional lessons</p></div></div><span class="pill ${result?'green':ok?'maroon':''}">${status}</span>${ok?link(`#/topic/${u.id}/page/1`,'Open →','secondary small'):''}</div>`;}).join('')}</section>
 <div class="panel soft" style="margin-top:18px"><h3>Unit 3 Summary</h3><p>Four short study guides with 28 interactive, unlimited-retry review questions. Review is required to finish the unit but does not create another grade.</p>${unitTopicsComplete(st)||t?link(allReviewComplete(st)?'#/unit-complete':'#/summary/1',allReviewComplete(st)?'Open completion page →':'Open cumulative summary →'):'<span class="pill">🔒 Pass all nine topics to unlock</span>'}</div>`;
}
function renderReports(){const st=view();return `<div class="page-title"><p class="eyebrow">PROGRESS, BACKUPS & REPORTS</p><h1>Your learning record</h1><p class="lead">Save your work between sessions. Export JSON backups and detailed PDFs for available topics or the full unit.</p></div>${renderFlash()}
 <div class="two-cols"><div class="panel"><p class="kicker">Progress backup</p><h2>JSON · Save and restore</h2><p>Backups preserve lesson evidence, assessment drafts, scores, and attempts for all available topics.</p><div class="btn-row"><button class="btn" data-action="backup-json">↓ Export JSON</button><button class="btn secondary" data-action="import-backup">↑ Import JSON</button></div><p class="fineprint">Import replaces local progress after student identification is confirmed. Keep your backup private.</p></div>
 <div class="panel"><p class="kicker">Available topic reports</p><h2>Individual section PDFs</h2><p>Each report contains graded questions, submitted responses, scores, attempts, and practice evidence.</p><div class="btn-row">${IMPLEMENTED_TOPICS.map((u,i)=>`<button class="btn ${i?'secondary':''}" data-action="pdf-topic" data-topic="${u.id}">↓ Topic ${u.id} PDF</button>`).join('')}</div></div></div>
 <div class="panel" style="margin-top:18px"><p class="kicker">Unit record</p><h2>Cumulative Unit 3 PDF</h2><p>Includes all nine topics, their full recorded evidence, and cumulative review completion.</p><button class="btn" data-action="pdf-cumulative">↓ Download cumulative PDF</button></div>
 <div class="panel" style="margin-top:18px"><h2>Current progress</h2><p class="helper">Cumulative review: ${reviewProgress(st).questions}/28 correct, ${reviewProgress(st).parts}/4 parts complete.</p><div class="two-cols">${IMPLEMENTED_TOPICS.map(u=>{const a=assessment(st,u.id);return `<div class="info-cell"><strong>${topicProgress(st,u.id)} / ${u.lessons.length}</strong><p>Topic ${u.id} pages completed · ${a.attempts.at(-1)?.score??'–'}/100 latest check · ${a.attempts.length} attempt(s)</p></div>`;}).join('')}</div><p class="fineprint" style="margin-top:15px">Progress is stored in this browser's localStorage, not synchronized between devices. GitHub Pages cannot provide secure identities or tamper-proof scores.</p></div>`;
}
function renderTeacher(){if(!teacherOn())return `<div class="panel"><h2>Teacher preview is disabled</h2><p>Activate teacher mode using the configured shortcut and access code.</p></div>`;
 return `<div class="page-title"><p class="eyebrow">TEACHER CONSOLE · PREVIEW MODE</p><h1>Inspect lessons and support students.</h1><p class="lead">All ${IMPLEMENTED_TOPICS.reduce((n,t)=>n+t.lessons.length,0)} lessons and ${IMPLEMENTED_TOPICS.length} section checks can be previewed. Preview work does not alter student progress; check resets apply to the current saved record.</p></div>
 <div class="callout warning" style="margin-bottom:18px">The teacher access code is a convenience, not secure authentication: GitHub Pages runs all code in the browser.</div>
 <div class="panel"><h2>Jump directly to content</h2>${IMPLEMENTED_TOPICS.map(u=>`<div class="btn-row" style="margin-top:11px">${u.lessons.map((p,i)=>link(`#/topic/${u.id}/page/${i+1}`,`${u.id}.${i+1} ${esc(p.title)}`,'secondary small')).join('')}${link(`#/topic/${u.id}/check`,`${u.id} check`,'secondary small')}${link(`#/topic/${u.id}/results`,`${u.id} results`,'secondary small')}</div>`).join('')}</div>
 <div class="two-cols" style="margin-top:18px">${IMPLEMENTED_TOPICS.map(u=>{const a=assessment(state,u.id);return `<div class="panel"><h3>Topic ${u.id} attempt</h3><p class="helper">Current student: <strong>${esc(studentName(state))}</strong>. Attempts: <strong>${a.attempts.length}</strong>. Latest: <strong>${a.attempts.at(-1)?.score??'Not attempted'}</strong>.</p><button class="btn" data-action="reset-check" data-topic="${u.id}" ${!state.identity||!a.attempts.length?'disabled':''}>Reset ${u.id} check</button><p class="fineprint">Prior submissions remain in the record.</p></div>`;}).join('')}</div>
 <div class="panel" style="margin-top:18px"><h2>Student Progress Override</h2><p class="helper">These controls change the saved student's record on this device, not the temporary preview. Every exception is logged; assessment scores remain untouched. Confirm each change.</p>
 <div class="two-cols"><div class="field"><label for="teacher-override-lesson">Lesson to mark completed</label><select id="teacher-override-lesson"><option value="">Choose a lesson…</option>${IMPLEMENTED_TOPICS.flatMap(u=>u.lessons.map((p,i)=>({id:u.pageId(i+1),label:`${u.id}.${i+1} ${p.title}`}))).map(o=>`<option value="${esc(o.id)}">${esc(o.label)}</option>`).join('')}</select><button class="btn secondary" data-action="override-lesson" ${!state.identity?'disabled':''}>Mark lesson complete</button></div>
 <div class="field"><label for="teacher-override-topic">Topic prerequisite to bypass</label><select id="teacher-override-topic"><option value="">Choose a topic…</option>${IMPLEMENTED_TOPICS.filter(u=>u.prerequisite).map(u=>`<option value="${u.id}">Unlock Topic ${u.id} (normally requires ${u.prerequisite} pass)</option>`).join('')}</select><button class="btn secondary" data-action="override-topic" ${!state.identity?'disabled':''}>Grant prerequisite exception</button></div></div>
 <div class="field" style="margin-top:12px"><label for="teacher-override-reason">Reason (optional, recorded with the action)</label><input class="input" id="teacher-override-reason" maxlength="350" placeholder="e.g., device lost progress; completed on paper"></div>
 <h3>Active teacher exceptions</h3><div class="btn-row">${Object.entries(state.overrides?.lessons||{}).map(([k,o])=>`<button class="btn secondary small" data-action="revoke-lesson" data-key="${esc(k)}">Revoke lesson ${esc(k)}</button>`).join('')}${Object.entries(state.overrides?.topics||{}).map(([k,o])=>`<button class="btn secondary small" data-action="revoke-topic" data-key="${esc(k)}">Revoke topic ${esc(k)} exception</button>`).join('')}${!(Object.keys(state.overrides?.lessons||{}).length+Object.keys(state.overrides?.topics||{}).length)?'<span class="helper">No current exceptions.</span>':''}</div></div>
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
  if(r.view==='page'){const pkey=String(registered.pageId(r.number)),override=view().overrides?.lessons?.[pkey];
   if(override)body=`<div class="feedback good" role="status">Teacher-completed lesson ${esc(r.id)}.${r.number}. The exception is recorded in this student's progress; it does not represent a graded assessment score.</div>`+body;
  }
 }
 else body=r.type==='summary'?unitSummary.page(r.number):r.type==='finish'?unitSummary.finish():r.type==='reports'?renderReports():r.type==='teacher'?renderTeacher():home();
 $('#app').innerHTML=header()+body+footer();document.title=(r.type==='topic'&&r.view==='page'?`${r.id}.${r.number} · `:'')+'Class Creation Lab | AP CSA';
 lastRenderedHash=location.hash;if(samePage&&typeof requestAnimationFrame==='function')requestAnimationFrame(()=>window.scrollTo({top:savedY,behavior:'instant'}));
}
function activateTeacher(){modal(`<button class="dialog-close" data-action="modal-close" aria-label="Close">×</button><h2>Teacher access</h2><p class="helper">Enter your local preview access code. This is a classroom convenience, not secure authentication.</p>
 <form id="teacher-form"><div class="field"><label for="teacher-code">Access code</label><input class="input" id="teacher-code" type="password" autocomplete="off" required></div><div class="dialog-actions"><button class="btn secondary" type="button" data-action="modal-close">Cancel</button><button class="btn" type="submit">Activate preview</button></div></form>`);$('#teacher-code').focus();}
function confirmReset(topic='3.1'){resetTopic=topic;const a=assessment(state,topic);modal(`<button class="dialog-close" data-action="modal-close" aria-label="Close">×</button><h2>Reset ${esc(studentName(state))}'s Topic ${resetTopic} check?</h2><p>This starts a fresh attempt but preserves ${a.attempts.length} previous submission${a.attempts.length===1?'':'s'} and scores in the PDF report.</p><div class="dialog-actions"><button class="btn secondary" data-action="modal-close">Cancel</button><button class="btn" data-action="confirm-reset">Reset check</button></div>`);}
function requestOverride(kind,key,revoke=false){
 if(!teacherOn()||!state.identity)return;
 const topic=kind==='topic'?getImplementedTopic(key):IMPLEMENTED_TOPICS.find(t=>Array.from({length:t.lessons.length},(_,i)=>String(t.pageId(i+1))).includes(String(key)));
 if(!topic)return toast('Choose a valid lesson or topic.');
 if(kind==='topic'&&!topic.prerequisite)return toast('The first topic has no prerequisite.');
 pendingOverride={kind,key:String(key),revoke,reason:($('#teacher-override-reason')?.value||'').trim().slice(0,350)};
 const label=kind==='lesson'?`lesson ${key}`:`Topic ${key} prerequisite`;
 modal(`<button class="dialog-close" data-action="modal-close" aria-label="Close">×</button><h2>${revoke?'Revoke':'Authorize'} ${esc(label)}?</h2><p>This will ${revoke?'remove the exception':'change the current student’s saved progress'} on this device. Previous submitted assessment scores will not be changed or fabricated.</p><p class="helper">${esc(pendingOverride.reason||'No reason provided.')}</p><div class="dialog-actions"><button class="btn secondary" data-action="modal-close">Cancel</button><button class="btn" data-action="confirm-override">Confirm ${revoke?'reversal':'override'}</button></div>`);
}
function applyOverride(){if(!teacherOn()||!state.identity||!pendingOverride)return;
 try{applyProgressOverride(state,pendingOverride);save(state);preview=structuredClone(state);pendingOverride=null;closeModal();render();toast('Student progress exception updated. Existing scores are unchanged.',true);}
 catch(error){toast(error.message||'Override could not be applied.');}
}

function confirmSwitch(){
 switchDialogToken++;verifiedSwitchSnapshot=null;
 if(!state.identity){go('#/home');return;}
 modal(`<button class="dialog-close" data-action="modal-close" aria-label="Close">×</button>
 <h2>Switch student: protect your work</h2>
 <p>Before starting a new student on this device, save and verify <strong>${esc(studentName(state))}'s</strong> progress. This will replace the locally saved student record, including completed lessons and check results.</p>
 <div class="switch-steps">
  <div class="switch-step"><strong>1. Download your progress backup</strong><p class="helper">Save the JSON file somewhere you can find it again (usually Downloads).</p><button class="btn secondary" data-action="switch-download">↓ Download progress backup</button></div>
  <div class="switch-step"><strong>2. Verify the downloaded file</strong><p class="helper">Select the file you just saved. The website checks that it contains all of your <em>current</em> progress before enabling the switch.</p><button class="btn secondary" data-action="switch-verify" id="switch-verify-button" disabled>Choose backup file to verify</button><input type="file" id="switch-backup-file" accept=".json,application/json" hidden><div id="switch-file-status" class="helper" role="status" aria-live="polite">Download a backup to begin.</div></div>
 </div>
 <div class="dialog-actions"><button class="btn secondary" data-action="modal-close">Cancel (keep progress)</button><button class="btn" id="switch-final-button" data-action="confirm-switch" disabled>Clear local progress and switch student</button></div>`);
}

function handleClick(event){const trigger=event.target.closest('#teacher-trigger');if(trigger){teacherClicks++;if(teacherClicks>=5){teacherClicks=0;activateTeacher();}return;}
 const nav=event.target.closest('[data-nav]');if(nav){if(!nav.disabled)go(nav.dataset.nav);return;}
 const el=event.target.closest('[data-action]');if(!el||el.disabled)return;const act=el.dataset.action;
 if(act==='modal-close'){closeModal();return;}
 if(act==='review-filter'){if(['missed','all'].includes(el.dataset.value)){reviewFilter=el.dataset.value;render();}return;}
 if(act==='backup-json'){exportJson(state.identity?state:view());toast('Backup download requested. Confirm the JSON file is saved in Downloads.',true);return;}
 if(act==='import-backup'){$('#backup-file')?.click();return;}
 if(act==='pdf-topic'||act==='pdf-cumulative'){const x=createReport(state.identity?state:view(),{cumulative:act==='pdf-cumulative',topic:el.dataset.topic||'3.1'});toast(`${x.filename} downloaded (${x.pages} pages).`,true);return;}
 if(act==='switch-student'){confirmSwitch();return;}
 if(act==='switch-download'){
  switchDialogToken++;verifiedSwitchSnapshot=null;
  $('#switch-final-button').disabled=true;
  try{
   exportJson(state);
   $('#switch-verify-button').disabled=false;
   $('#switch-file-status').textContent='Download requested. Find the saved JSON file, then verify it in step 2.';
  }catch(error){toast('Could not start backup download: '+error.message);$('#switch-file-status').textContent='Download did not start. Your progress has not been cleared.';}
  return;
 }
 if(act==='switch-verify'){$('#switch-backup-file')?.click();return;}
 if(act==='confirm-switch'){
  if(verifiedSwitchSnapshot===null || verifiedSwitchSnapshot!==JSON.stringify(state)){
   verifiedSwitchSnapshot=null;
   $('#switch-final-button').disabled=true;
   toast('Verify a current backup file before switching students.');
   return;
  }
  try{
   const next=saveBlankStudentBeforeSwitch(blankState,save);
   state=next;preview=null;setTeacher(false);closeModal();go('#/home');render();
   toast('Local student record cleared. The verified backup can be restored later.',true);
  }catch(error){toast(error.message);}
  return;
 }
 if(act==='teacher-exit'){setTeacher(false);preview=null;go('#/home');render();toast('Teacher preview closed.',true);return;}
 if(act==='override-lesson'||act==='override-topic'){const kind=act==='override-lesson'?'lesson':'topic',key=$('#teacher-override-'+kind)?.value;if(!key)return toast('Select a '+kind+' first.');requestOverride(kind,key);return;}
 if(act==='revoke-lesson'||act==='revoke-topic'){requestOverride(act==='revoke-lesson'?'lesson':'topic',el.dataset.key,true);return;}
 if(act==='confirm-override'){applyOverride();return;}
 if(act==='reset-check'){if(teacherOn()&&state.identity&&getImplementedTopic(el.dataset.topic||'3.1'))confirmReset(el.dataset.topic||'3.1');return;}
 if(act==='confirm-reset'){if(!teacherOn())return;const a=assessment(state,resetTopic);a.locked=false;a.draft={};recordEvent(state,'teacher-reset',`${resetTopic} graded check`);save(state);preview=structuredClone(state);closeModal();render();toast('The graded check has been reset. Previous attempts were retained.',true);return;}
 if(act==='sample-pdf'){createReport(makeSample(),{sample:true,topic:el.dataset.topic||'3.1'});toast('Sample PDF downloaded.',true);return;}
 if(unitSummary?.click(el))return;
 for(const topic of IMPLEMENTED_TOPICS){const c=controllers.get(topic.id);if(c.handlesClick(act)){c.click(el);return;}}
}
function handleChange(event){const el=event.target,act=el.dataset.action;
 if(el.id==='switch-backup-file'){
  const file=el.files?.[0];el.value='';
  if(!file)return;
  const snapshot=JSON.stringify(state),token=++switchDialogToken;
  verifiedSwitchSnapshot=null;
  $('#switch-final-button').disabled=true;
  const status=$('#switch-file-status');
  if(status)status.textContent='Checking backup file…';
  verifyStudentSwitchBackup(file,state).then(name=>{
   if(!$('#modal')?.open || token!==switchDialogToken || snapshot!==JSON.stringify(state))return;
   verifiedSwitchSnapshot=snapshot;
   $('#switch-final-button').disabled=false;
   status.textContent=`Verified: ${name} contains the current student record. You may now switch students.`;
  }).catch(error=>{
   if(!$('#modal')?.open)return;
   status.textContent='Not verified: '+error.message+' The current progress is still saved.';
  });
  return;
 }
 if(el.id==='backup-file'){const file=el.files?.[0];if(!file)return;importJson(file,state.identity).then(next=>{if(!window.confirm(`Restore the progress backup for ${next.identity.first} ${next.identity.last}.? This replaces the saved record on this device.`))return;state=next;preview=null;setTeacher(false);save(state);go('#/home');render();toast('Progress restored from JSON.',true);}).catch(e=>toast('Import failed: '+e.message));el.value='';return;}
 if(unitSummary?.change(el))return;
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
unitSummary=createUnitSummary(context);
document.addEventListener('click',handleClick);
document.addEventListener('change',handleChange);
document.addEventListener('input',handleInput);
document.addEventListener('submit',handleSubmit);
document.addEventListener('keydown',ev=>{if(ev.ctrlKey&&ev.altKey&&ev.shiftKey&&ev.key.toLowerCase()==='t'){ev.preventDefault();activateTeacher();}if(ev.key==='Escape'&&$('#modal')?.open)closeModal();
 for(const topic of IMPLEMENTED_TOPICS){const c=controllers.get(topic.id);if(c?.handlesKeydown?.(ev.target)){c.keydown(ev);return;}}
});
window.addEventListener('hashchange',render);
render();
