import {mockTeacherCrypto} from './helpers/teacher-mock.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {blankState} from '../js/storage.js';
import {QUESTIONS32,RELIABILITY_TESTS,IMPACT_CHALLENGES,ETHICS_CHALLENGES,CODE_ASSETS} from '../js/content32.js';
const KEY='flourbluff-apcsa-u3-v1';
function harness(saved){
 mockTeacherCrypto();
 const listeners={},mem=new Map([[KEY,JSON.stringify(saved)]]),sess=new Map(),pieces={};
 const app={innerHTML:''},zone={append(){}},modal={open:false,showModal(){this.open=true},close(){this.open=false}},body={innerHTML:''};
 pieces['#modal']=modal;pieces['#modal-body']=body;pieces['#reflection32-count']={textContent:''};pieces['#teacher-code']={value:'TEST_ONLY_FAKE_CODE',focus(){}};
 global.localStorage={getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,v)};
 global.sessionStorage={getItem:k=>sess.get(k)||null,setItem:(k,v)=>sess.set(k,v),removeItem:k=>sess.delete(k)};
 global.document={title:'',querySelector:s=>s==='#app'?app:s==='#toast-region'?zone:pieces[s]||null,
  createElement:()=>({className:'',remove(){},click(){}}),addEventListener:(k,v)=>listeners[k]=v};
 global.window={scrollTo(){},addEventListener:(k,v)=>listeners[k]=v,confirm:()=>true};
 global.location={hash:'#/topic/3.2/page/1'};
 function click(action,dataset={}){const el={disabled:false,dataset:{action,...dataset}};listeners.click({target:{closest:q=>q==='[data-action]'?el:null}});}
 function change(action,dataset={},value){listeners.change({target:{dataset:{action,...dataset},value,checked:!!value,id:''}});}
 function at(hash){location.hash=hash;listeners.hashchange();return app.innerHTML;}
 function snapshot(){return JSON.parse(mem.get(KEY));}
 return {listeners,mem,sess,app,pieces,click,change,at,snapshot,modal};
}
test('students complete 3.2 in order; pass 7/8; teacher reset preserves submission',async()=>{
 const saved=blankState();saved.identity={first:'Taylor',last:'C'};saved.assessments['3.1'].attempts=[{at:new Date().toISOString(),score:80}];saved.assessments['3.1'].locked=true;
 const h=harness(saved);await import('../js/app.js?topic32workflow='+Date.now());
 assert.match(h.app.innerHTML,/The Leaderboard Decision/);
 assert.match(h.app.innerHTML,/No policy selected/);
 assert.doesNotMatch(h.app.innerHTML,/class="policy-choice selected"/);
 assert.match(h.at('#/topic/3.2/page/3'),/Topic 3.2 is locked/);
 h.at('#/topic/3.2/page/1');
 for(const p of ['public','alias','private'])h.click('32-policy',{id:p});
 for(const q of IMPACT_CHALLENGES)h.change('32-practice',{page:'1',id:q.id},String(q.answer));
 h.listeners.input({target:{id:'reflection32',dataset:{page:'1'},value:'I choose opt-in nicknames to keep the benefit of competition while reducing the harm to privacy.'}});
 assert.equal(h.snapshot().pages['3.2.1'].completed,true);
 h.at('#/topic/3.2/page/2');
 assert.match(h.app.innerHTML,/No test loaded/);
 assert.match(h.app.innerHTML,/32-load-test/);
 assert.match(h.app.innerHTML,/32-run-code/);
 for(const t of RELIABILITY_TESTS){
  h.click('32-load-test',{id:t.id});
  assert.match(h.app.innerHTML,new RegExp('int tickets = '+t.tickets+';'));
  h.click('32-run-code');
 }
 assert.equal(Object.keys(h.snapshot().pages['3.2.2'].data.before).length,6);
 // A wrong repair is not marked correct on selection. Students must run the cases.
 h.change('32-fix',{},'d');
 assert.match(h.app.innerHTML,/Code with your selected repair/);
 assert.match(h.app.innerHTML,/tickets &gt; cost/);
 for(const t of RELIABILITY_TESTS){h.click('32-load-test',{id:t.id});h.click('32-run-code');}
 assert.equal(h.snapshot().pages['3.2.2'].completed,false);
 assert.ok(Object.values(h.snapshot().pages['3.2.2'].data.after).some(result=>!result.correct));
 // Choosing another repair clears previous results and requires six fresh runs.
 h.change('32-fix',{},'b');
 assert.equal(Object.keys(h.snapshot().pages['3.2.2'].data.after).length,0);
 assert.match(h.app.innerHTML,/cost &gt; 0 &amp;&amp; stock &gt; 0/);
 for(const t of RELIABILITY_TESTS){h.click('32-load-test',{id:t.id});h.click('32-run-code');}
 h.change('32-type',{id:'exact'},'Normal');
 assert.match(h.app.innerHTML,/Not quite. A boundary checks a threshold/);
 assert.equal(h.snapshot().pages['3.2.2'].completed,false);
 for(const [id,value] of Object.entries({exact:'Boundary',empty:'Boundary',negative:'Invalid'}))h.change('32-type',{id},value);
 assert.match(h.app.innerHTML,/3\/3 classifications correct/);
 assert.equal(h.snapshot().pages['3.2.2'].completed,true);
 h.at('#/topic/3.2/page/3');
 for(const asset of CODE_ASSETS)h.change('32-asset',{id:asset.id},asset.answer);
 for(const q of ETHICS_CHALLENGES)h.change('32-practice',{page:'3',id:q.id},String(q.answer));
 h.listeners.input({target:{id:'reflection32',dataset:{page:'3'},value:'The snippet has no reuse license; I must ask its author for permission before using it.'}});
 assert.equal(h.snapshot().pages['3.2.3'].completed,true);
 assert.match(h.at('#/topic/3.2/check'),/eight questions/i);
 for(const [i,q] of QUESTIONS32.entries()){
  if(q.kind==='choice')h.change('32-graded',{id:q.id},String(i===0?1:q.answer));
  else q.items.forEach(([,answer],index)=>h.change('32-graded-category',{id:q.id,index:String(index)},answer));
 }
 h.click('32-review');assert.equal(h.modal.open,true);
 h.click('32-submit');
 const st=h.snapshot();assert.equal(st.assessments['3.2'].attempts.length,1);assert.equal(st.assessments['3.2'].attempts[0].score,87.5);assert.equal(st.assessments['3.2'].locked,true);
 assert.match(h.at('#/topic/3.2/results'),/Topic 3.2 mastered/);
 assert.match(h.at('#/topic/3.2/check'),/Topic 3.2 mastered/);
 h.listeners.keydown({ctrlKey:true,altKey:true,shiftKey:true,key:'t',preventDefault(){}});
 h.listeners.submit({target:{id:'teacher-form'},preventDefault(){}});
 await new Promise(r=>setTimeout(r,20));assert.equal(h.sess.get('flourbluff-apcsa-teacher-v114'),'yes');
 h.click('reset-check',{topic:'3.2'});h.click('confirm-reset');
 const after=h.snapshot();assert.equal(after.assessments['3.2'].locked,false);assert.equal(after.assessments['3.2'].attempts.length,1);
 assert.equal(after.assessments['3.1'].locked,true,'3.1 must not be affected by a 3.2 reset');
});
