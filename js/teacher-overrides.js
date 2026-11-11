// Pure, testable classroom progress exceptions. Never writes fabricated graded attempts.
import {IMPLEMENTED_TOPICS,getImplementedTopic} from './registry.js';
import {recordEvent} from './storage.js';
export function applyProgressOverride(st,{kind,key,revoke=false,reason='',at=new Date().toISOString()}){
 if(!st?.identity)throw Error('A student record must be open before recording an override.');
 const cleaned=String(reason||'').slice(0,350);key=String(key);
 st.overrides??={lessons:{},topics:{}};
 if(kind==='topic'){
  const topic=getImplementedTopic(key);
  if(!topic?.prerequisite)throw Error('Select a topic that has an implemented prerequisite.');
  if(revoke){if(!st.overrides.topics[key])throw Error('That topic has no current override.');delete st.overrides.topics[key];}
  else st.overrides.topics[key]={at,reason:cleaned};
 }else if(kind==='lesson'){
  const topic=IMPLEMENTED_TOPICS.find(t=>Array.from({length:t.lessons.length},(_,i)=>String(t.pageId(i+1))).includes(key));
  if(!topic)throw Error('Unknown lesson identifier.');
  const prior=st.overrides.lessons[key];
  if(revoke){if(!prior)throw Error('That lesson has no current override.');const page=st.pages?.[key];if(page){page.completed=!!prior.priorCompleted;page.completedAt=prior.priorAt||null;delete page.teacherOverride;}delete st.overrides.lessons[key];}
  else{const page=st.pages[key]??={completed:false,completedAt:null,data:{}};if(page.completed&&!prior)throw Error('That lesson is already completed.');st.overrides.lessons[key]={at,reason:cleaned,priorCompleted:prior?.priorCompleted??!!page.completed,priorAt:prior?.priorAt??page.completedAt??null};page.completed=true;page.completedAt=at;page.teacherOverride=true;}
 }else throw Error('Unknown override type.');
 recordEvent(st,revoke?'teacher-override-revoked':'teacher-progress-override',`${kind} ${key}${cleaned?' | '+cleaned:''}`);
 return st;
}
