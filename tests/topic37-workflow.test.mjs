import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {blankState} from '../js/storage.js';import {EXAMPLES37,PRACTICE37,QUESTIONS37} from '../js/content37.js';
import {mockTeacherCrypto} from './helpers/teacher-mock.mjs';
const KEY='flourbluff-apcsa-u3-v1',source=readFileSync(new URL('./fixtures/solution37.txt',import.meta.url),'utf8');
function harness(st){mockTeacherCrypto();const listeners={},memory=new Map([[KEY,JSON.stringify(st)]]),session=new Map(),parts={},app={innerHTML:''},modal={open:false,showModal(){this.open=true;},close(){this.open=false;}};parts['#modal']=modal;parts['#modal-body']={innerHTML:''};parts['#teacher-code']={value:'FAKE_TEST_ONLY',focus(){}};parts['#37-editor-save']={textContent:''};parts['#37-grade-counter']={textContent:''};parts['[data-action="37-review"]']={disabled:false};
 global.localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};global.sessionStorage={getItem:k=>session.get(k)||null,setItem:(k,v)=>session.set(k,v),removeItem:k=>session.delete(k)};
 global.document={title:'',querySelector:s=>s==='#app'?app:s==='#toast-region'?{append(){}}:parts[s]||null,createElement:()=>({className:'',textContent:'',remove(){},click(){}}),addEventListener:(k,v)=>listeners[k]=v};
 global.window={scrollTo(){},addEventListener:(k,v)=>listeners[k]=v,confirm:()=>true};global.location={hash:'#/topic/3.7/page/1'};
 const click=(action,data={})=>listeners.click({target:{closest:q=>q==='[data-action]'?{disabled:false,dataset:{action,...data}}:null}});
 const change=(action,data={},value)=>listeners.change({target:{id:'',dataset:{action,...data},value}});
 const input=(id,value)=>listeners.input({target:{id,dataset:{},value}});
 const at=hash=>{location.hash=hash;listeners.hashchange();return app.innerHTML;};
 return {listeners,memory,session,parts,app,modal,click,change,input,at,snapshot:()=>JSON.parse(memory.get(KEY))};
}
const practice=(h,n)=>PRACTICE37[n].forEach(q=>h.change('37-practice',{page:String(n),id:q.id},String(q.answer)));
test('Topic 3.7 complete student path, autosave, 21 Java tests and graded submission',async()=>{
 const st=blankState();st.identity={first:'Morgan',last:'R'};for(const topic of ['3.1','3.2','3.3','3.4','3.5','3.6']){st.assessments[topic].attempts.push({at:'2026-11-15',score:90});st.assessments[topic].locked=true;}
 const h=harness(st);await import('../js/app.js?topic37flow='+Date.now());
 assert.match(h.app.innerHTML,/One Class, Many Objects/);assert.match(h.at('#/topic/3.7/page/2'),/Topic 3.7 is locked/);
 h.at('#/topic/3.7/page/1');h.change('37-predict-create',{},'up');for(let i=0;i<3;i++)h.click('37-create');h.change('37-predict-score',{},'one');h.click('37-add-score',{index:'0'});practice(h,1);
 assert.equal(h.snapshot().pages['3.7.1'].completed,true);
 for(const n of [2,3,4]){h.at(`#/topic/3.7/page/${n}`);for(const item of EXAMPLES37[n]){h.click('37-case',{page:String(n),id:item.id});h.change('37-case-choice',{page:String(n),id:item.id},String(item.answer));h.click('37-case-check',{page:String(n),id:item.id});}practice(h,n);assert.equal(h.snapshot().pages[`3.7.${n}`].completed,true);}
 h.at('#/topic/3.7/page/5');h.input('37-code-editor',source);assert.equal(h.snapshot().pages['3.7.5'].data.fullClass.code,source,'source saves immediately');h.click('37-workshop-run');assert.equal(h.snapshot().pages['3.7.5'].data.fullClass.result.tests.length,21);assert.equal(h.snapshot().pages['3.7.5'].data.fullClass.result.ok,true);practice(h,5);assert.equal(h.snapshot().pages['3.7.5'].completed,true);
 assert.match(h.at('#/topic/3.7/check'),/10 questions/);for(const [i,q] of QUESTIONS37.entries())h.change('37-grade-choice',{id:q.id},String(i<2?(q.answer+1)%q.options.length:q.answer));h.click('37-review');assert.equal(h.modal.open,true);h.click('37-submit');const saved=h.snapshot();assert.equal(saved.assessments['3.7'].attempts[0].score,80);assert.equal(saved.assessments['3.7'].locked,true);assert.equal(saved.assessments['3.6'].attempts[0].score,90);
 assert.match(h.at('#/topic/3.7/results'),/Missed questions \(2\)/);assert.match(h.app.innerHTML,/Your response/);assert.doesNotMatch(h.app.innerHTML,/Teacher key:/);
 // Topic 3.8 is not published and remains inaccessible.
 assert.doesNotMatch(h.at('#/home'),/Topics 3.8 and 3.9 are available/);
 // No changes to submitted results after a second click.
 h.click('37-submit');assert.equal(h.snapshot().assessments['3.7'].attempts.length,1);
 // Existing teacher controls still operate on this actual student record.
 h.listeners.keydown({ctrlKey:true,altKey:true,shiftKey:true,key:'t',preventDefault(){}});h.listeners.submit({target:{id:'teacher-form'},preventDefault(){}});await new Promise(r=>setTimeout(r,20));
 assert.match(h.at('#/teacher'),/Student Progress Override/);h.parts['#teacher-override-topic']={value:'3.7'};h.parts['#teacher-override-reason']={value:'Transferred late'};h.click('override-topic');h.click('confirm-override');assert.equal(h.snapshot().overrides.topics['3.7'].reason,'Transferred late');assert.equal(h.snapshot().assessments['3.7'].attempts[0].score,80);
});
