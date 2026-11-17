import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {blankState} from '../js/storage.js';import {SCOPE_SCENES38,SHADOW_CASES38,PRACTICE38,QUESTIONS38} from '../js/content38.js';
import {mockTeacherCrypto} from './helpers/teacher-mock.mjs';
const KEY='flourbluff-apcsa-u3-v1',solution=readFileSync(new URL('./fixtures/solution38.txt',import.meta.url),'utf8');
function harness(st){mockTeacherCrypto();const listeners={},memory=new Map([[KEY,JSON.stringify(st)]]),session=new Map(),parts={},app={innerHTML:''},modal={open:false,showModal(){this.open=true;},close(){this.open=false;}};
 parts['#modal']=modal;parts['#modal-body']={innerHTML:''};parts['#teacher-code']={value:'FAKE_TEST_ONLY',focus(){}};parts['#38-editor-save']={textContent:''};parts['#38-grade-counter']={textContent:''};parts['[data-action="38-review"]']={disabled:false};
 global.localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};global.sessionStorage={getItem:k=>session.get(k)||null,setItem:(k,v)=>session.set(k,v),removeItem:k=>session.delete(k)};
 global.document={title:'',querySelector:s=>s==='#app'?app:s==='#toast-region'?{append(){}}:parts[s]||null,createElement:()=>({className:'',textContent:'',remove(){},click(){}}),addEventListener:(k,v)=>listeners[k]=v};
 global.window={scrollTo(){},addEventListener:(k,v)=>listeners[k]=v,confirm:()=>true};global.location={hash:'#/topic/3.8/page/1'};
 const click=(action,data={})=>listeners.click({target:{closest:q=>q==='[data-action]'?{disabled:false,dataset:{action,...data}}:null}});
 const change=(action,data={},value)=>listeners.change({target:{id:'',dataset:{action,...data},value}});
 const input=(id,value)=>listeners.input({target:{id,dataset:{},value}});
 const at=hash=>{location.hash=hash;listeners.hashchange();return app.innerHTML;};
 return {listeners,memory,session,parts,app,modal,click,change,input,at,snapshot:()=>JSON.parse(memory.get(KEY))};
}
const practice=(h,n)=>PRACTICE38[n].forEach(q=>h.change('38-practice',{page:String(n),id:q.id},String(q.answer)));
test('Topic 3.8 full student path, gating, autosave, scope simulation, grader and teacher override',async()=>{
 const st=blankState();st.identity={first:'Morgan',last:'R'};
 for(const topic of ['3.1','3.2','3.3','3.4','3.5','3.6','3.7']){st.assessments[topic].attempts.push({at:'2026-11-16',score:90});st.assessments[topic].locked=true;}
 const h=harness(st);await import('../js/app.js?topic38flow='+Date.now());
 assert.match(h.app.innerHTML,/Scope Explorer/);assert.match(h.at('#/topic/3.8/page/2'),/Topic 3.8 is locked/);
 h.at('#/topic/3.8/page/1');for(const sc of SCOPE_SCENES38){h.change('38-location',{},sc.id);h.change('38-scope-answer',{},sc.answer);h.click('38-scope-check');}practice(h,1);
 assert.equal(h.snapshot().pages['3.8.1'].completed,true);assert.match(h.at('#/topic/3.8/page/2'),/Parameters and Local Variables/);
 h.click('38-trace-next');assert.equal(h.snapshot().pages['3.8.2']?.data?.step||0,0);h.change('38-trace-pred',{},'10');h.click('38-trace-next');assert.equal(h.snapshot().pages['3.8.2'].data.step||0,0);h.change('38-trace-result-pred',{},'15');for(let n=0;n<6;n++)h.click('38-trace-next');practice(h,2);
 assert.equal(h.snapshot().pages['3.8.2'].completed,true);assert.match(h.at('#/topic/3.8/page/3'),/Shadowing and Scope Repair/);
 for(const sc of SHADOW_CASES38){h.click('38-repair-case',{id:sc.id});h.change('38-repair-answer',{},String(sc.answer));h.click('38-repair-check');}practice(h,3);
 assert.equal(h.snapshot().pages['3.8.3'].completed,true);h.at('#/topic/3.8/page/4');h.input('38-code-editor',solution);
 assert.equal(h.snapshot().pages['3.8.4'].data.fullClass.code,solution);assert.match(h.parts['#38-editor-save'].textContent,/Saved locally/);
 h.click('38-workshop-run');const out=h.snapshot().pages['3.8.4'].data.fullClass.result;assert.equal(out.ok,true);assert.equal(out.tests.length,20);practice(h,4);assert.equal(h.snapshot().pages['3.8.4'].completed,true);
 assert.match(h.at('#/topic/3.8/check'),/10 questions/);for(const [i,q] of QUESTIONS38.entries())h.change('38-grade-choice',{id:q.id},String(i<2?(q.answer+1)%4:q.answer));h.click('38-review');assert.equal(h.modal.open,true);h.click('38-submit');const saved=h.snapshot();assert.equal(saved.assessments['3.8'].attempts[0].score,80);assert.equal(saved.assessments['3.8'].locked,true);assert.equal(saved.assessments['3.7'].attempts[0].score,90);
 assert.match(h.at('#/topic/3.8/results'),/Missed questions \(2\)/);assert.match(h.app.innerHTML,/Your response/);assert.doesNotMatch(h.app.innerHTML,/Teacher key:/);
 assert.match(h.at('#/home'),/Scope and Access/);
 h.listeners.keydown({ctrlKey:true,altKey:true,shiftKey:true,key:'t',preventDefault(){}});h.listeners.submit({target:{id:'teacher-form'},preventDefault(){}});await new Promise(r=>setTimeout(r,20));
 assert.match(h.at('#/teacher'),/Student Progress Override/);h.parts['#teacher-override-topic']={value:'3.8'};h.parts['#teacher-override-reason']={value:'Class absence'};h.click('override-topic');h.click('confirm-override');assert.equal(h.snapshot().overrides.topics['3.8'].reason,'Class absence');assert.equal(h.snapshot().assessments['3.8'].attempts[0].score,80);
});
