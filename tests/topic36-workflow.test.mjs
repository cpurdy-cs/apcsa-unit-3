import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {blankState} from '../js/storage.js';
import {SCENARIOS36,ACCESS36,PRACTICE36,QUESTIONS36} from '../js/content36.js';
import {mockTeacherCrypto} from './helpers/teacher-mock.mjs';
const KEY='flourbluff-apcsa-u3-v1';
const classSource=readFileSync(new URL('./fixtures/solution36.txt',import.meta.url),'utf8');
function harness(st){mockTeacherCrypto();const listeners={},mem=new Map([[KEY,JSON.stringify(st)]]),sess=new Map(),pieces={},app={innerHTML:''},modal={open:false,showModal(){this.open=true;},close(){this.open=false;}};
 pieces['#modal']=modal;pieces['#modal-body']={innerHTML:''};pieces['#teacher-code']={value:'FAKE_TEST_ONLY',focus(){}};pieces['#36-editor-save']={textContent:''};pieces['#36-grade-counter']={textContent:''};pieces['[data-action="36-review"]']={disabled:false};
 global.localStorage={getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,v)};
 global.sessionStorage={getItem:k=>sess.get(k)||null,setItem:(k,v)=>sess.set(k,v),removeItem:k=>sess.delete(k)};
 global.document={title:'',querySelector:s=>s==='#app'?app:s==='#toast-region'?{append(){}}:pieces[s]||null,createElement:()=>({className:'',textContent:'',remove(){},click(){}}),addEventListener:(k,v)=>listeners[k]=v};
 global.window={scrollTo(){},addEventListener:(k,v)=>listeners[k]=v,confirm:()=>true};global.location={hash:'#/topic/3.6/page/1'};
 const click=(act,data={})=>{const el={disabled:false,dataset:{action:act,...data}};listeners.click({target:{closest:q=>q==='[data-action]'?el:null}});};
 const change=(act,data={},value)=>listeners.change({target:{id:'',dataset:{action:act,...data},value}});
 const input=(id,value)=>listeners.input({target:{id,dataset:{},value}});
 const at=hash=>{location.hash=hash;listeners.hashchange();return app.innerHTML;};
 return {listeners,mem,sess,app,pieces,click,change,input,at,snapshot:()=>JSON.parse(mem.get(KEY)),modal};
}
const completePractice=(h,n)=>PRACTICE36[n].forEach(q=>h.change('36-practice',{page:String(n),id:q.id},String(q.answer)));
test('3.6 complete guided path, identity-tested class, one graded attempt, and live saved work',async()=>{
 const st=blankState();st.identity={first:'Morgan',last:'R'};
 for(const topic of ['3.1','3.2','3.3','3.4','3.5']){st.assessments[topic].attempts.push({score:90});st.assessments[topic].locked=true;}
 const h=harness(st);await import('../js/app.js?refworkflow='+Date.now());
 assert.match(h.app.innerHTML,/One Object, Multiple References/);assert.match(h.at('#/topic/3.6/page/2'),/Topic 3.6 is locked/);
 for(let n=1;n<=3;n++){
  h.at(`#/topic/3.6/page/${n}`);
  for(const scene of SCENARIOS36[n]){
   h.click('36-scene',{page:String(n),id:scene.id});
   h.change('36-predict',{page:String(n),id:scene.id},String(scene.answer));
   for(let k=0;k<scene.trace.length;k++)h.click('36-trace',{page:String(n),id:scene.id});
  }
  completePractice(h,n);
  assert.equal(h.snapshot().pages[`3.6.${n}`].completed,true,`3.6.${n} complete`);
 }
 h.at('#/topic/3.6/page/4');for(const row of ACCESS36){h.click('36-access-scene',{id:row.id});h.change('36-access-answer',{id:row.id},row.answer);h.click('36-access-check',{id:row.id});}
 completePractice(h,4);assert.equal(h.snapshot().pages['3.6.4'].completed,true);
 h.at('#/topic/3.6/page/5');h.input('36-code-editor',classSource);
 assert.equal(h.snapshot().pages['3.6.5'].data.fullClass.code,classSource,'saved immediately on edit');
 h.click('36-workshop-run');assert.equal(h.snapshot().pages['3.6.5'].data.fullClass.result.tests.length,18);
 completePractice(h,5);assert.equal(h.snapshot().pages['3.6.5'].completed,true);
 assert.match(h.at('#/topic/3.6/check'),/10 questions/);
 for(const [i,q] of QUESTIONS36.entries())h.change('36-grade-choice',{id:q.id},String(i<2?(q.answer+1)%4:q.answer));
 h.click('36-review');assert.equal(h.modal.open,true);h.click('36-submit');
 const saved=h.snapshot();assert.equal(saved.assessments['3.6'].attempts[0].score,80);assert.equal(saved.assessments['3.6'].locked,true);
 assert.match(h.at('#/topic/3.6/results'),/Missed questions \(2\)/);assert.match(h.app.innerHTML,/Your response/);assert.doesNotMatch(h.app.innerHTML,/Teacher key:/);
 assert.equal(saved.assessments['3.5'].attempts[0].score,90,'earlier graded work untouched');
 // Teacher unlock operates on the actual student record rather than on the preview clone.
 h.listeners.keydown({ctrlKey:true,altKey:true,shiftKey:true,key:'t',preventDefault(){}});
 h.listeners.submit({target:{id:'teacher-form'},preventDefault(){}});
 await new Promise(resolve=>setTimeout(resolve,15));
 assert.equal(h.sess.get('flourbluff-apcsa-teacher-v114'),'yes');
 assert.match(h.at('#/teacher'),/Student Progress Override/);
 h.pieces['#teacher-override-topic']={value:'3.6'};
 h.pieces['#teacher-override-reason']={value:'Technical issue'};
 h.click('override-topic');assert.equal(h.modal.open,true);
 h.click('confirm-override');
 assert.equal(h.snapshot().overrides.topics['3.6'].reason,'Technical issue');
 assert.equal(h.snapshot().assessments['3.5'].attempts[0].score,90);
});
