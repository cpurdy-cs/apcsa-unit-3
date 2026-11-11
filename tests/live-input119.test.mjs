// Regression: several control IDs begin with a digit. Calling
// querySelector('#33-reflection-count') throws in real browsers, interrupting
// autosave and leaving the live character counter frozen until a re-render.
import test from 'node:test';
import assert from 'node:assert/strict';
import {blankState} from '../js/storage.js';
import {QUESTIONS35} from '../js/content35.js';
import {QUESTIONS36} from '../js/content36.js';

function createHarness(saved) {
  const listeners = {}, mem = new Map([['flourbluff-apcsa-u3-v1', JSON.stringify(saved)]]), nodes = new Map();
  const node = (id) => {if (!nodes.has(id)) nodes.set(id, {textContent:'',disabled:false});return nodes.get(id);};
  const app = node('app'), toast=node('toast-region');
  toast.append=()=>{};
  global.localStorage={getItem:k=>mem.get(k)??null,setItem:(k,v)=>mem.set(k,String(v))};
  global.sessionStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
  global.document={title:'',
    getElementById:node,
    querySelector(sel){
      if (/^#[0-9]/.test(sel)) throw new SyntaxError(`Invalid CSS selector: ${sel}`);
      if(sel==='#app')return app;
      if(sel==='#toast-region')return toast;
      return null;
    },
    createElement:()=>({className:'',textContent:'',remove(){},click(){}}),
    addEventListener:(name,listener)=>{listeners[name]=listener;}
  };
  global.window={scrollTo(){},scrollY:0,addEventListener:(name,listener)=>{listeners[name]=listener;}};
  global.location={hash:'#/topic/3.3/page/4'};
  return {nodes,mem,listeners,node,
    input(id,value){listeners.input({target:{id,value,dataset:{}}});},
    change(action,id,value){listeners.change({target:{id:'',value,dataset:{action,id}}});},
    saved(){return JSON.parse(mem.get('flourbluff-apcsa-u3-v1'));}
  };
}

test('text counters and code-editor save indicators update during input with digit-leading IDs',async()=>{
  const st=blankState();st.identity={first:'Taylor',last:'M'};
  const h=createHarness(st);
  await import('../js/app.js?live119='+Date.now());
  h.input('33-reflection','private');
  assert.equal(h.node('33-reflection-count').textContent,'7/40 characters minimum · Autosaved');
  assert.equal(h.saved().pages['3.3.4'].data.reflection,'private');
  h.input('33-reflection','private variables and public getters');
  assert.equal(h.node('33-reflection-count').textContent,'36/40 characters minimum · Autosaved');
  assert.equal(h.saved().pages['3.3.4'].data.reflection,'private variables and public getters');

  h.input('34-copy-reflection','Separate objects prevent unintended shared changes.');
  assert.equal(h.node('34-copy-count').textContent,'51/50 characters minimum · Autosaved');
  assert.equal(h.saved().pages['3.4.5'].data.reflection,'Separate objects prevent unintended shared changes.');

  h.input('34-constructor-editor','public PrizeCard(String name, int tickets) {\n}');
  assert.match(h.node('34-workshop-save').textContent,/Autosaved/);
  assert.match(h.saved().pages['3.4.4'].data.workshop.prize.code,/public PrizeCard/);

  h.input('35-code-editor','public class PrizeCard {}');
  assert.equal(h.node('35-editor-save').textContent,'Autosaved · Run tests to verify');
  assert.equal(h.saved().pages['3.5.8'].data.fullClass.code,'public class PrizeCard {}');

  h.input('36-code-editor','public class WaterTank {}');
  assert.equal(h.node('36-editor-save').textContent,'Saved locally · Run tests to verify');
  assert.equal(h.saved().pages['3.6.5'].data.fullClass.code,'public class WaterTank {}');


  // Graded-check labels also begin with numeric prefixes and must update at once.
  h.change('35-grade-choice', QUESTIONS35.find(q=>q.kind==='choice').id, '0');
  assert.equal(h.node('35-grade-counter').textContent,'1 of 12 answered');
  h.change('36-grade-choice', QUESTIONS36[0].id, '0');
  assert.equal(h.node('36-grade-counter').textContent,'1 of 10 answered');
});
