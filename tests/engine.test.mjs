import test from 'node:test';
import assert from 'node:assert/strict';
import {runMethodBody,testMethodBody} from '../js/java-mini.js';
import {normalizeState,blankState,canOpenPage,hasLessonMastery} from '../js/storage.js';
import {QUESTIONS} from '../js/content.js';
test('restricted Java handles both equivalent score implementations',()=>{
 for(const code of ['score += points;','score = score + points;','score += points / 2; score += points - points / 2;'])
  assert.ok(testMethodBody(code).every(t=>t.ok),code);
});
test('Java int semantics and expression precedence',()=>{
 assert.equal(runMethodBody('score += 1;',2147483647,1).score,-2147483648);
 assert.equal(runMethodBody('score = 10 / 4 + 3 * 2;',0,0).score,8);
 assert.equal(runMethodBody('score = 10 % 3;',0,0).score,1);
 assert.equal(runMethodBody('score = 10 / -4;',0,0).score,-2);
});
test('rejects out-of-scope syntax without running JavaScript',()=>{
 for(const code of ['alert(1);','window.open();','score++;','score = points == 5;','score = score / 0;'])
  assert.ok(testMethodBody(code).every(t=>!t.ok),code);
});
test('backup validation and sequence locks work',()=>{
 const st=blankState();assert.equal(canOpenPage(st,1),true);assert.equal(canOpenPage(st,2),false);
 st.pages[1]={completed:true,data:{}};assert.equal(canOpenPage(st,2),true);assert.equal(hasLessonMastery(st),false);
 const x=normalizeState({...st,identity:{first:'Ana',last:'M'}});assert.deepEqual(x.identity,{first:'Ana',last:'M'});
 assert.throws(()=>normalizeState({schema:99}),/not supported/);
});
test('the graded check contains ten equally weighted questions with valid keys',()=>{
 assert.equal(QUESTIONS.length,10);
 for(const q of QUESTIONS){
  if(q.kind==='choice')assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length);
  else {assert.ok(q.items.length>=3);assert.ok(q.items.every(([,answer])=>q.categories.includes(answer)));}
 }
});
