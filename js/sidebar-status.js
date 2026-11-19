// Shared visual progress indicators; no changes to lesson data or scoring.
import {TOPICS,getImplementedTopic,topicUnlocked,topicPassed,topicProgress,pageUnlocked,topicCompleted} from './registry.js';
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export function topicSidebarStates(st,teacher=false,active=undefined){
 const next=TOPICS.find(t=>t.implemented&&topicUnlocked(st,t.id,teacher)&&!topicPassed(st,t.id))?.id;
 return TOPICS.map(t=>{
  const unlocked=topicUnlocked(st,t.id,teacher),passed=t.implemented&&topicPassed(st,t.id),count=t.implemented?topicProgress(st,t.id):0;
  // An omitted active topic chooses the next unfinished topic; an explicit empty
  // active topic means another route (such as Unit 3 Summary) is selected.
  const isActive=t.id===(active===undefined?next:active),total=t.lessons?.length||0;
  const status=!t.implemented?'coming-soon':passed?'completed':!unlocked?'locked':isActive?'current':topicCompleted(st,t.id)?'check-ready':count>0?'in-progress':'available';
  return {...t,status,unlocked,passed,count,total,isActive};
 });
}
export function renderSidebarTopics(st,teacher=false,active=undefined){
 return topicSidebarStates(st,teacher,active).map(t=>{
  const icon={completed:'✓',current:'▶',locked:'🔒','in-progress':'◐','check-ready':'★',available:'○','coming-soon':'🔒'}[t.status];
  const label={completed:'Completed',current:'Current',locked:'Locked','in-progress':'In progress','check-ready':'Check ready',available:'Available','coming-soon':'Coming soon'}[t.status];
  const nextIndex=t.implemented?t.lessons.findIndex((_,i)=>!st.pages?.[t.pageId(i+1)]?.completed):-1;
  const nextPage=nextIndex>=0?nextIndex+1:1;
  const href=t.unlocked?`#/topic/${t.id}/page/${t.isActive?nextPage:1}`:'';
  const children=t.isActive&&t.implemented&&t.unlocked?`<div class="sidebar-lesson-list" aria-label="Topic ${esc(t.id)} lesson progress">${t.lessons.map((lesson,i)=>{
   const n=i+1,done=!!st.pages?.[t.pageId(n)]?.completed,open=pageUnlocked(st,t.id,n,teacher),current=active===t.id&&((typeof location!=='undefined'?location.hash:'')===`#/topic/${t.id}/page/${n}`);
   return `<button type="button" class="sidebar-lesson ${done?'done':open?'open':'locked'} ${current?'current':''}" data-nav="#/topic/${t.id}/page/${n}" ${open?'':'disabled'} ${current?'aria-current="page"':''}><span aria-hidden="true">${done?'✓':open?'○':'🔒'}</span><span class="sidebar-lesson-name">${esc(t.id)}.${n} ${esc(lesson.title)}</span></button>`;
  }).join('')}<button type="button" class="sidebar-lesson ${t.passed?'done':topicCompleted(st,t.id)?'open':'locked'}" data-nav="#/topic/${t.id}/check" ${topicCompleted(st,t.id)||teacher?'':'disabled'}><span aria-hidden="true">${t.passed?'✓':topicCompleted(st,t.id)?'★':'🔒'}</span><span class="sidebar-lesson-name">Section check</span></button></div>`:'';
  const detail=t.implemented?`${t.count}/${t.total} lessons`:'';
  return `<div class="topic-nav-entry ${t.isActive?'active':''}"><button class="topic-item ${t.isActive?'current':''} status-${t.status}" data-nav="${href}" ${t.unlocked?'':'disabled'} aria-label="Topic ${esc(t.id)} ${esc(t.title)}: ${label}${detail?', '+detail:''}" ${t.isActive?'aria-current="page"':''}><span class="topic-status-icon" aria-hidden="true">${icon}</span><span class="topic-nav-detail"><span class="topic-nav-title"><span class="topic-number">${esc(t.id)}</span><span class="name">${esc(t.title)}</span></span><span class="topic-nav-meta">${label}${detail?` · ${detail}`:''}</span></span></button>${children}</div>`;
 }).join('');
}
