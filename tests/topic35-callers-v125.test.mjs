import test from 'node:test';
import assert from 'node:assert/strict';
import {render35Page, changeExecution35, returnExecution35, complete35} from '../js/topic35.js';
import {CHANGE_DEMOS35,RETURN_DEMOS35,PRACTICE35} from '../js/content35.js';
import {normalizeState,blankState} from '../js/storage.js';

const stripInstruction=html=>html.slice(html.indexOf('<section class="panel"'));

test('3.5.2 shows the exact caller and complete class for each state-changing demo',()=>{
 for(const demo of CHANGE_DEMOS35){
  const ctx=changeExecution35(demo);
  const html=stripInstruction(render35Page(2,{demo:demo.id,ran:[]},123));
  assert.match(html,/(?:Caller|Calling code).*Runner\.java/);
  assert.match(html,/Class being used/);
  assert.ok(html.includes(ctx.call));
  assert.ok(html.includes(ctx.className));
  assert.ok(html.includes('Before the call'));
  assert.ok(html.includes('After the call'));
  assert.match(html,/Run selected method call/);
  assert.equal(ctx.callerCode.match(/public class Runner/g)?.length,1);
  assert.ok(ctx.classCode.includes(demo.code.split('\n')[0]));
 }
});

test('3.5.3 shows return/print caller and method, before revealing result',()=>{
 const expected={
  getter:'int result = player.getScore();',
  check:'boolean enough = wallet.hasEnough(12);',
  print:'player.showScore();'
 };
 for(const demo of RETURN_DEMOS35){
  const ctx=returnExecution35(demo);
  const html=stripInstruction(render35Page(3,{demo:demo.id,ran:[]},123));
  assert.match(html,/(?:Caller|Calling code).*Runner\.java/);
  assert.match(html,/Class containing the method/);
  assert.equal(ctx.call,expected[demo.id]);
  assert.ok(html.includes(ctx.call));
  assert.ok(ctx.classCode.includes(demo.code.split('\n')[0]));
  assert.match(html,/Call to reveal/);
  assert.equal(html.includes('Returned value'),true);
  assert.equal(html.includes('Printed output'),true);
  assert.ok(!html.includes(`<p>${demo.returned}</p>`));
  const shown=stripInstruction(render35Page(3,{demo:demo.id,ran:[demo.id]},123));
  assert.ok(shown.includes(demo.printed));
  assert.ok(shown.includes(demo.returned));
 }
});

test('preexisting lesson and graded evidence is accepted without being reset',()=>{
 const st=blankState();st.identity={first:'Ava',last:'P'};
 for(const n of [2,3]){
  st.pages[`3.5.${n}`]={completed:true,completedAt:'2026-11-15T12:00:00Z',data:{
   demo:n===2?'award':'getter',ran:(n===2?CHANGE_DEMOS35:RETURN_DEMOS35).map(x=>x.id),
   answers:Object.fromEntries(PRACTICE35[n].map(q=>[q.id,q.answer]))
  }};
 }
 st.assessments['3.5']={draft:{},attempts:[{score:91,at:'2026-11-15'}],locked:true};
 const saved=normalizeState(JSON.parse(JSON.stringify(st)));
 assert.equal(saved.pages['3.5.2'].completed,true);
 assert.equal(saved.pages['3.5.3'].completed,true);
 assert.equal(complete35(2,saved.pages['3.5.2'].data),true);
 assert.equal(complete35(3,saved.pages['3.5.3'].data),true);
 assert.deepEqual(saved.assessments['3.5'].attempts,st.assessments['3.5'].attempts);
 assert.equal(saved.assessments['3.5'].locked,true);
});
