import test from 'node:test';
import assert from 'node:assert/strict';
import {blankState,normalizeState} from '../js/storage.js';
import {FACTORY_PRACTICE,DEFAULT_FIELDS,DEFAULT_SCENARIOS,DEFAULT_PRACTICE,WORKSHOP_PRACTICE,CONSTRUCTOR_CHALLENGES,MULTI_PRACTICE,COPY_IMPLEMENTATIONS,COPY_PRACTICE,QUESTIONS34} from '../js/content34.js';
const KEY='flourbluff-apcsa-u3-v1';
function harness(saved){
 const listeners={},mem=new Map([[KEY,JSON.stringify(saved)]]),sess=new Map(),pieces={};
 const app={innerHTML:''},zone={append(){}},modal={open:false,showModal(){this.open=true;},close(){this.open=false;}},body={innerHTML:''};
 pieces['#modal']=modal;pieces['#modal-body']=body;pieces['#34-copy-count']={textContent:''};pieces['#34-code-preview']={textContent:''};pieces['#34-workshop-results']={innerHTML:''};pieces['#34-workshop-save']={textContent:''};pieces['#teacher-code']={value:'HornetLab31',focus(){}};
 global.localStorage={getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,v)};
 global.sessionStorage={getItem:k=>sess.get(k)||null,setItem:(k,v)=>sess.set(k,v),removeItem:k=>sess.delete(k)};
 global.document={title:'',querySelector:s=>s==='#app'?app:s==='#toast-region'?zone:pieces[s]||null,createElement:()=>({className:'',textContent:'',remove(){},click(){}}),addEventListener:(k,v)=>listeners[k]=v};
 global.window={scrollTo(){},addEventListener:(k,v)=>listeners[k]=v,confirm:()=>true};
 global.location={hash:'#/topic/3.4/page/1'};
 const click=(action,dataset={})=>{const el={disabled:false,dataset:{action,...dataset}};listeners.click({target:{closest:q=>q==='[data-action]'?el:null}});};
 const change=(action,dataset={},value)=>listeners.change({target:{dataset:{action,...dataset},value,id:''}});
 const input=(id,value)=>listeners.input({target:{dataset:{},id,value}});
 const at=hash=>{location.hash=hash;listeners.hashchange();return app.innerHTML;};
 const snapshot=()=>JSON.parse(mem.get(KEY));
 return {listeners,app,mem,sess,modal,click,change,input,at,snapshot,pieces};
}
test('full Topic 3.4 student path: gates, corrections, 80%-pass, report-preserving reset, legacy data',async()=>{
 const st=blankState();st.identity={first:'Taylor',last:'C'};
 for(const k of ['3.1','3.2','3.3']){st.assessments[k].attempts.push({score:90});st.assessments[k].locked=true;}
 st.pages['3.3.4']={completed:true,completedAt:'2026-11-06',data:{reflection:'PREVIOUS CONTENT MUST REMAIN UNCHANGED'}};
 const h=harness(st);await import('../js/app.js?topic34workflow='+Date.now());
 assert.match(h.app.innerHTML,/The Object Factory/);
 assert.match(h.at('#/topic/3.4/page/3'),/Topic 3.4 is locked/);
 h.at('#/topic/3.4/page/1');
 for(const id of ['a','b']){h.change('34-factory-select',{},id);for(let i=0;i<3;i++)h.click('34-factory-step');}
 for(const q of FACTORY_PRACTICE)h.change('34-practice',{page:'1',id:q.id},String(q.answer));
 assert.equal(h.snapshot().pages['3.4.1'].completed,true);
 h.at('#/topic/3.4/page/2');
 for(const f of DEFAULT_FIELDS)h.change('34-default',{id:f.id},f.answer);
 for(const s of DEFAULT_SCENARIOS){h.change('34-scenario',{},s.id);h.change('34-predict',{},s.compiles?'yes':'no');h.click('34-default-run');}
 for(const q of DEFAULT_PRACTICE)h.change('34-practice',{page:'2',id:q.id},String(q.answer));
 assert.equal(h.snapshot().pages['3.4.2'].completed,true);
 h.at('#/topic/3.4/page/3');
 for(const [slot,choice] of [['score','wrong'],['lives','fixed']])h.change('34-multi-pick',{id:slot},choice);
 for(let i=0;i<3;i++)h.click('34-multi-next');assert.equal(h.snapshot().pages['3.4.3'].data.multiPassed,false);
 for(const slot of ['score','lives'])h.change('34-multi-pick',{id:slot},'correct');
 for(let i=0;i<3;i++)h.click('34-multi-next');for(const q of MULTI_PRACTICE)h.change('34-practice',{page:'3',id:q.id},String(q.answer));
 assert.equal(h.snapshot().pages['3.4.3'].completed,true);
 h.at('#/topic/3.4/page/4');
 h.input('34-constructor-editor','public PrizeCard(String newOwner, int initialTickets) { owner = "Taylor"; tickets = 12; }');h.click('34-workshop-run');
 assert.equal(h.snapshot().pages['3.4.4'].data.workshopPasses.prize,false);
 const codeById={prize:'public PrizeCard(String newOwner, int initialTickets) {\n    owner = newOwner;\n    tickets = initialTickets;\n}',machine:'public ArcadeMachine(String machineTitle, double factor, boolean running) {\n    title = machineTitle;\n    multiplier = factor;\n    active = running;\n}',player:'public Player(String playerName, int startScore, int startLives) {\n    name = playerName;\n    score = startScore;\n    lives = startLives;\n}'};
 for(const id of CONSTRUCTOR_CHALLENGES.map(c=>c.id)){
  h.click('34-workshop-select',{id});
  assert.equal(h.snapshot().pages['3.4.4'].data.workshopSelected,id,'clicking a constructor tab selects the correct class');
  assert.match(h.app.innerHTML,new RegExp('Test '+CONSTRUCTOR_CHALLENGES.find(x=>x.id===id).className),'selected challenge test button updates');
  h.input('34-constructor-editor',codeById[id]);
  assert.equal(h.snapshot().pages['3.4.4'].data.workshop[id].code,codeById[id],'legacy constructor entry still autosaves');
  h.click('34-workshop-run');assert.equal(h.snapshot().pages['3.4.4'].data.workshopPasses[id],true);
  assert.match(h.snapshot().pages['3.4.4'].data.workshop[id].code,/^public class/,'old short-form editor content is migrated into full class after testing');
 }
 h.click('34-workshop-select',{id:'prize'});
 assert.equal(h.snapshot().pages['3.4.4'].data.workshopSelected,'prize');
 assert.match(h.app.innerHTML,/Test PrizeCard/);
 h.click('34-workshop-select',{id:'machine'});
 assert.equal(h.snapshot().pages['3.4.4'].data.workshopSelected,'machine');
 assert.match(h.app.innerHTML,/Test ArcadeMachine/);
 assert.match(h.app.innerHTML,/title = machineTitle;/,'saved ArcadeMachine code is restored in editor');
 h.click('34-workshop-select',{id:'player'});
 assert.match(h.app.innerHTML,/Test Player/);
 assert.match(h.app.innerHTML,/score = startScore;/,'saved Player code is restored in editor');
 h.at('#/topic/3.4/page/4');
 assert.match(h.app.innerHTML,/Test Player/,'selected challenge survives re-render/navigation');
 for(const q of WORKSHOP_PRACTICE)h.change('34-practice',{page:'4',id:q.id},String(q.answer));
 assert.equal(h.snapshot().pages['3.4.4'].completed,true);
 h.at('#/topic/3.4/page/5');
 for(const impl of COPY_IMPLEMENTATIONS){h.change('34-copy-pick',{},impl.id);h.click('34-copy-start');for(const source of ['original','card'])h.click('34-copy-mutate',{source});}
 for(const q of COPY_PRACTICE)h.change('34-practice',{page:'5',id:q.id},String(q.answer));
 h.input('34-copy-reflection','Creating a new TicketBalance gives the card an independent mutable object, so changes to the incoming balance do not change its internal data.');
 assert.equal(h.snapshot().pages['3.4.5'].completed,true);
 const before=h.snapshot();assert.match(h.at('#/topic/3.4/check'),/10 questions/);
 for(const [i,q] of QUESTIONS34.entries()){
  if(q.kind==='choice')h.change('34-grade',{id:q.id},String(i<2?(q.answer+1)%4:q.answer));
  else q.items.forEach(([,answer],index)=>h.change('34-grade-cat',{id:q.id,index:String(index)},answer));
 }
 h.click('34-review');assert.equal(h.modal.open,true);h.click('34-submit');
 const now=h.snapshot();assert.equal(now.assessments['3.4'].attempts[0].score,80);assert.equal(now.assessments['3.4'].locked,true);
 assert.match(h.at('#/topic/3.4/results'),/Topic 3.4 mastered/);
 assert.equal(now.pages['3.3.4'].data.reflection,'PREVIOUS CONTENT MUST REMAIN UNCHANGED');
 h.click('34-review');assert.equal(h.snapshot().assessments['3.4'].attempts.length,1,'cannot resubmit locked check');
 h.listeners.keydown({ctrlKey:true,altKey:true,shiftKey:true,key:'t',preventDefault(){}});
 h.listeners.submit({target:{id:'teacher-form'},preventDefault(){}});await new Promise(r=>setTimeout(r,30));
 assert.equal(h.sess.get('flourbluff-apcsa-teacher'),'yes');h.click('reset-check',{topic:'3.4'});h.click('confirm-reset');
 const after=h.snapshot();assert.equal(after.assessments['3.4'].locked,false);assert.equal(after.assessments['3.4'].attempts.length,1);
 for(const k of ['3.1','3.2','3.3'])assert.equal(after.assessments[k].locked,true);
 assert.equal(normalizeState(after).pages['3.4.4'].data.workshop.prize.code.startsWith('public class PrizeCard'),true);
 assert.equal(before.orderSeed,after.orderSeed);
});
