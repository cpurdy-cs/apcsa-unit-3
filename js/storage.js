import {IMPLEMENTED_TOPICS,topicCompleted,topicPassed,pageUnlocked} from './registry.js';
const KEY='flourbluff-apcsa-u3-v1';
const SESSION_KEY='flourbluff-apcsa-teacher-v114';
import {stableHash} from './order.js';
export function blankState(){return {schema:1,topic34Revision:2,topic35Revision:2,orderSeed:Math.floor(Math.random()*4294967296),identity:null,joinedAt:null,updatedAt:null,pages:{},currentPage:1,assessments:Object.fromEntries(IMPLEMENTED_TOPICS.map(t=>[t.id,{draft:{},attempts:[],locked:false}])),events:[]};}
function dataObject(x){return x && typeof x==='object' && !Array.isArray(x);}
export function normalizeState(raw){
 const st=blankState(); if(!dataObject(raw))return st;
 if(raw.schema!==1)throw Error('The backup version is not supported by this build.');
 if(dataObject(raw.identity) && typeof raw.identity.first==='string' && /^\p{L}[\p{L} '-]{0,29}$/u.test(raw.identity.first) && /^\p{L}$/u.test(raw.identity.last||'')) st.identity={first:raw.identity.first.slice(0,30),last:raw.identity.last.toUpperCase()};
 st.joinedAt=typeof raw.joinedAt==='string'?raw.joinedAt:null;
 st.orderSeed=Number.isInteger(raw.orderSeed)&&raw.orderSeed>=0&&raw.orderSeed<4294967296?raw.orderSeed:stableHash(`${st.identity?.first||'Student'}:${st.identity?.last||'?'}:${st.joinedAt||'old-save'}`);
 st.updatedAt=typeof raw.updatedAt==='string'?raw.updatedAt:null;
 st.currentPage=Math.max(1,Math.min(IMPLEMENTED_TOPICS[0]?.lessons?.length||1,Math.floor(Number(raw.currentPage)||1)));
 if(dataObject(raw.pages)) for(const topic of IMPLEMENTED_TOPICS) for(let i=1;i<=topic.lessons.length;i++){
  const key=topic.pageId(i),x=raw.pages[key];
  if(dataObject(x)){
   // Keep existing numeric 3.1 keys and 3.2.1–3.2.3 keys unchanged.
   // Capping each lesson's stored evidence protects against malformed backup files.
   const limit=35000;
   st.pages[key]={completed:!!x.completed,completedAt:typeof x.completedAt==='string'?x.completedAt:null,
    data:dataObject(x.data)&&JSON.stringify(x.data).length<limit?JSON.parse(JSON.stringify(x.data)):{}};
  }
 }
 // Upgrade only Topic 3.4 learning evidence from the v1.7 page order.
 // Move the former dropdown lab (3.4.4) to 3.4.3; retain the old typed
 // assignment work as the first, now full, constructor challenge on 3.4.4.
 if(raw.topic34Revision!==2){
  const previousWorkshop=st.pages['3.4.3'];
  const previousDropdown=st.pages['3.4.4'];
  if(previousWorkshop || previousDropdown){
   if(previousDropdown)st.pages['3.4.3']=previousDropdown;
   else delete st.pages['3.4.3'];
   if(previousWorkshop){
    const old=previousWorkshop.data||{},body=String(old.body||'').trim();
    const restored=body?`public PrizeCard(String newOwner, int initialTickets) {\n${body.split('\n').map(line=>'    '+line).join('\n')}\n}`:'';
    st.pages['3.4.4']={completed:false,completedAt:null,data:{workshopSelected:'prize',workshop:{prize:{code:restored,result:null}},workshopPasses:{prize:false,machine:false,player:false},answers:old.answers||{},legacyV17:old}};
   }else delete st.pages['3.4.4'];
  }
  // All three variants must now be tested. Preserve prior experimentation.
  const copy=st.pages['3.4.5'];if(copy)copy.completed=false;
 }
 st.topic34Revision=2;
 // Topic 3.5.8 was replaced with a full-class design lab in v1.14.
 // Keep older method drafts untouched in data.workshop, but require the new
 // assignment for lesson completion. Previous graded submissions are retained.
 if(raw.topic35Revision!==2){
  const page=st.pages['3.5.8'];if(page){page.completed=false;page.completedAt=null;page.data.fullClass??={code:'// Write the entire PrizeCard class below.\n',passed:false,result:null};}
 }
 st.topic35Revision=2;

 if(dataObject(raw.assessments)) for(const topic of IMPLEMENTED_TOPICS){
  const a=raw.assessments[topic.id];if(!dataObject(a))continue;
  st.assessments[topic.id].draft=dataObject(a.draft)?JSON.parse(JSON.stringify(a.draft)):{};
  st.assessments[topic.id].attempts=Array.isArray(a.attempts)?a.attempts.filter(dataObject).slice(0,30):[];
  st.assessments[topic.id].locked=!!a.locked;
 }
 st.events=Array.isArray(raw.events)?raw.events.slice(-100):[];
 return st;
}
export function load(){try {const raw=localStorage.getItem(KEY);return raw?normalizeState(JSON.parse(raw)):blankState();}catch(e){console.warn('Could not load saved progress:',e);return blankState();}}
export function save(state){state.updatedAt=new Date().toISOString();try{localStorage.setItem(KEY,JSON.stringify(state));return true;}catch(e){console.error(e);return false;}}
export function download(name,text,type='application/json'){const blob=new Blob([text],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);}
export function exportJson(state){const n=(state.identity?.first||'Student')+'_'+(state.identity?.last||'X');download(`APCSA_Unit3_Progress_${n}.json`,JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2));}
export async function importJson(file,currentIdentity){
 if(!file || file.size>2_000_000)throw Error('Select a progress backup under 2 MB.');
 const source=JSON.parse(await file.text());const st=normalizeState(source);
 if(!st.identity)throw Error('This backup has no valid student identity.');
 if(currentIdentity && (st.identity.first.toLowerCase()!==currentIdentity.first.toLowerCase()||st.identity.last!==currentIdentity.last)) throw Error(`This backup belongs to ${st.identity.first} ${st.identity.last}. Sign out before restoring a different student's file.`);
 return st;
}
export function teacherOn(){try{return sessionStorage.getItem(SESSION_KEY)==='yes';}catch{return false;}}
export function setTeacher(value){try{if(value)sessionStorage.setItem(SESSION_KEY,'yes');else sessionStorage.removeItem(SESSION_KEY);}catch{}}
// Backward-compatible 3.1 helpers are still exported for existing tests and backups.
export function isPageCompleted(state,key){return !!state.pages[key]?.completed;}
export function canOpenPage(state,i,teacher=false){return pageUnlocked(state,'3.1',i,teacher);}
export function hasLessonMastery(state){return topicCompleted(state,'3.1');}
export function assessment(state,topic='3.1'){
 state.assessments??={};
 return state.assessments[topic]??=( {draft:{},attempts:[],locked:false} );
}
export function passed(state,topic='3.1'){return topicPassed(state,topic);}
export function recordEvent(state,kind,detail){state.events.push({at:new Date().toISOString(),kind,detail});state.events=state.events.slice(-100);}
