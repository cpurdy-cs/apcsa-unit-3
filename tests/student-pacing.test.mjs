import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {blankState} from '../js/storage.js';

const source = rel => readFileSync(new URL(`../${rel}`,import.meta.url),'utf8');

test('lesson renderers and course roadmap never display estimates or suggested class periods',()=>{
  for(const f of ['js/topics/topic31.js','js/topics/topic32-controller.js','js/topics/topic33-controller.js','js/topics/topic34-controller.js']){
    const src=source(f);
    assert.doesNotMatch(src,/\.minutes\b|\bminutes\b|estimated (?:time|duration)/i,`${f} should not render timing metadata`);
    assert.match(src,/In progress/,`${f} should show completion status instead`);
  }
  const app=source('js/app.js');
  assert.doesNotMatch(app,/suggested instructional period|\$\{u\.periods\}/i,'student roadmap must show page count, not suggested periods');
  assert.match(app,/\$\{u\.pages\} instructional pages/);
});

test('student dashboard and each available topic first page render without duration suggestions',async()=>{
  const state=blankState();state.identity={first:'Alex',last:'R'};
  for(const id of ['3.1','3.2','3.3'])state.assessments[id].attempts.push({score:100});
  const key='flourbluff-apcsa-u3-v1';
  const listeners={},mem=new Map([[key,JSON.stringify(state)]]),sess=new Map();
  const app={innerHTML:''};
  global.localStorage={getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,v)};
  global.sessionStorage={getItem:k=>sess.get(k)||null,setItem:(k,v)=>sess.set(k,v),removeItem:k=>sess.delete(k)};
  global.document={title:'',querySelector:sel=>sel==='#app'?app:sel==='#toast-region'?{append(){}}:null,
    createElement:()=>({className:'',textContent:'',remove(){}}),addEventListener:(name,fn)=>listeners[name]=fn};
  global.window={scrollTo(){},addEventListener:(name,fn)=>listeners[name]=fn};
  global.location={hash:'#/home'};
  await import('../js/app.js?pacing=112');
  assert.match(app.innerHTML,/Course roadmap/);
  assert.doesNotMatch(app.innerHTML,/suggested instructional period|\b(?:~\s*)?\d+\s*minutes\b/i);
  for(const topic of ['3.1','3.2','3.3','3.4']){
    location.hash=`#/topic/${topic}/page/1`;listeners.hashchange();
    assert.match(app.innerHTML,new RegExp(`TOPIC ${topic.replace('.','\\.')} · LESSON 1`));
    assert.match(app.innerHTML,/In progress/);
    assert.doesNotMatch(app.innerHTML,/\b(?:~\s*)?\d+\s*minutes\b|suggested instructional period/i);
  }
});
