import {mockTeacherCrypto} from './helpers/teacher-mock.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {blankState} from '../js/storage.js';
import {ANATOMY,CLASS_PARTS,ACCESS_TRANSFER,OBJECT_TRANSFER,BUILD_SLOTS,BUILD_TRANSFER,QUESTIONS33} from '../js/content33.js';
const KEY='flourbluff-apcsa-u3-v1';
function harness(saved){
 mockTeacherCrypto();
 const listeners={},mem=new Map([[KEY,JSON.stringify(saved)]]),sess=new Map(),pieces={};
 const app={innerHTML:''},zone={append(){}},modal={open:false,showModal(){this.open=true},close(){this.open=false}},body={innerHTML:''};
 pieces['#modal']=modal;pieces['#modal-body']=body;pieces['#33-reflection-count']={textContent:''};pieces['#teacher-code']={value:'TEST_ONLY_FAKE_CODE',focus(){}};
 global.localStorage={getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,v)};
 global.sessionStorage={getItem:k=>sess.get(k)||null,setItem:(k,v)=>sess.set(k,v),removeItem:k=>sess.delete(k)};
 global.document={title:'',querySelector:s=>s==='#app'?app:s==='#toast-region'?zone:pieces[s]||null,
  createElement:()=>({className:'',textContent:'',remove(){},click(){}}),addEventListener:(k,v)=>listeners[k]=v};
 global.window={scrollTo(){},addEventListener:(k,v)=>listeners[k]=v,confirm:()=>true};
 global.location={hash:'#/topic/3.3/page/1'};
 const click=(action,dataset={})=>{const el={disabled:false,dataset:{action,...dataset}};listeners.click({target:{closest:q=>q==='[data-action]'?el:null}});};
 const change=(action,dataset={},value)=>listeners.change({target:{dataset:{action,...dataset},value,id:''}});
 const input=(id,value)=>listeners.input({target:{id,value,dataset:{}}});
 const at=hash=>{location.hash=hash;listeners.hashchange();return app.innerHTML;};
 const snapshot=()=>JSON.parse(mem.get(KEY));
 return {listeners,mem,sess,app,pieces,click,change,input,at,snapshot,modal};
}
test('3.3 student progresses through 4 lessons, passes 80%, teacher resets without changing 3.1/3.2',async()=>{
 const st=blankState();st.identity={first:'Taylor',last:'C'};
 st.assessments['3.1'].attempts.push({score:80});st.assessments['3.1'].locked=true;
 st.assessments['3.2'].attempts.push({score:87.5});st.assessments['3.2'].locked=true;
 const h=harness(st);await import('../js/app.js?topic33workflow='+Date.now());
 assert.match(h.app.innerHTML,/Inside a Java Class/);
 assert.match(h.at('#/topic/3.3/page/4'),/Topic 3.3 is locked/);
 h.at('#/topic/3.3/page/1');
 for(const p of ANATOMY)h.click('33-inspect',{id:p.id});
 for(const p of CLASS_PARTS)h.change('33-part',{id:p.id},p.answer);
 h.click('33-parts-check');h.change('33-concept',{},'1');
 assert.equal(h.snapshot().pages['3.3.1'].completed,true);
 h.at('#/topic/3.3/page/2');
 for(const caller of ['inside','outside'])for(const member of ['score','get']){
  h.change('33-caller',{},caller);h.change('33-member',{},member);h.click('33-access-run');
 }
 for(const q of ACCESS_TRANSFER)h.change('33-practice',{page:'2',id:q.id},String(q.answer));
 assert.equal(h.snapshot().pages['3.3.2'].completed,true);
 h.at('#/topic/3.3/page/3');
 assert.match(h.app.innerHTML,/Create both Player objects/);
 h.click('33-create');h.click('33-add',{id:'a'});h.change('33-amount',{},'10');h.click('33-add',{id:'b'});h.click('33-get',{id:'a'});
 assert.deepEqual(h.snapshot().pages['3.3.3'].data.scores,{a:15,b:30});
 for(const q of OBJECT_TRANSFER)h.change('33-practice',{page:'3',id:q.id},String(q.answer));
 assert.equal(h.snapshot().pages['3.3.3'].completed,true);
 h.at('#/topic/3.3/page/4');
 assert.match(h.app.innerHTML,/Choose Java declaration/);
 for(const slot of BUILD_SLOTS)h.change('33-build',{id:slot.id},slot.id==='getter'?'private':'correct');
 h.click('33-validate');assert.equal(h.snapshot().pages['3.3.4'].data.validated,false);
 assert.equal(h.snapshot().pages['3.3.4'].completed,false);
 h.change('33-build',{id:'getter'},'correct');h.click('33-validate');h.click('33-client');
 for(const q of BUILD_TRANSFER)h.change('33-practice',{page:'4',id:q.id},String(q.answer));
 h.input('33-reflection','The tickets variable should be private so other classes cannot directly change it, but public getTickets returns its value.');
 assert.equal(h.snapshot().pages['3.3.4'].completed,true);
 assert.match(h.at('#/topic/3.3/check'),/10 questions/);
 for(const [i,q] of QUESTIONS33.entries()){
  if(q.kind==='choice')h.change('33-grade',{id:q.id},String(i<2?(q.answer+1)%4:q.answer));
  else q.items.forEach(([,answer],index)=>h.change('33-grade-cat',{id:q.id,index:String(index)},answer));
 }
 h.click('33-review');assert.equal(h.modal.open,true);h.click('33-submit');
 const result=h.snapshot();assert.equal(result.assessments['3.3'].attempts[0].score,80);assert.equal(result.assessments['3.3'].locked,true);
 assert.match(h.at('#/topic/3.3/results'),/Topic 3.3 mastered/);
 assert.equal(h.snapshot().assessments['3.2'].locked,true);
 h.listeners.keydown({ctrlKey:true,altKey:true,shiftKey:true,key:'t',preventDefault(){}});
 h.listeners.submit({target:{id:'teacher-form'},preventDefault(){}});
 await new Promise(r=>setTimeout(r,25));assert.equal(h.sess.get('flourbluff-apcsa-teacher-v114'),'yes');
 h.click('reset-check',{topic:'3.3'});h.click('confirm-reset');
 const after=h.snapshot();assert.equal(after.assessments['3.3'].locked,false);assert.equal(after.assessments['3.3'].attempts.length,1);
 assert.equal(after.assessments['3.2'].locked,true);assert.equal(after.assessments['3.1'].locked,true);
});
