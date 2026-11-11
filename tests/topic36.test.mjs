import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PAGE36,SCENARIOS36,ACCESS36,PRACTICE36,QUESTIONS36} from '../js/content36.js';
import {complete36,render36Page,render36Check,grade36,count36,memoryDiagram36} from '../js/topic36.js';
import {evaluateClass36,STARTER36} from '../js/topics/reference-engine36.js';
import {getImplementedTopic,topicUnlocked,pageUnlocked,topicCompleted} from '../js/registry.js';
import {blankState,normalizeState} from '../js/storage.js';
const source=readFileSync(new URL('./fixtures/solution36.txt',import.meta.url),'utf8');
test('Topic 3.6 has five guided lessons with complete 2025 CED coverage',()=>{
 assert.equal(PAGE36.length,5);assert.equal(QUESTIONS36.length,10);assert.ok(getImplementedTopic('3.6'));
 assert.ok(QUESTIONS36.some(q=>q.objective==='3.6.A.1'));
 assert.ok(QUESTIONS36.some(q=>q.objective==='3.6.A.2'));
 assert.ok(QUESTIONS36.some(q=>q.objective==='3.6.A.3'));
 for(let n=1;n<=3;n++)assert.equal(SCENARIOS36[n].length,3);
 assert.equal(ACCESS36.length,4);
 for(let n=1;n<=5;n++)assert.equal(PRACTICE36[n].length,3);
});
test('independent standalone WaterTank passes 18 validation, state and reference tests',()=>{
 const x=evaluateClass36(source);assert.equal(x.ok,true,JSON.stringify(x));assert.equal(x.tests.length,18);
 assert.equal(evaluateClass36(STARTER36).ok,false);
});
test('reference evaluator rejects cloned returns, reassigned object parameters and omitted validations',()=>{
 const clone=source.replace('return first;', 'return new WaterTank(first.capacity, first.liters);');
 const cloneResult=evaluateClass36(clone);assert.equal(cloneResult.ok,false);assert.equal(cloneResult.tests.length,18);
 const reassignment=source.replace('other.liters += amount;', 'other = new WaterTank(other.capacity, other.liters + amount);');
 assert.equal(evaluateClass36(reassignment).ok,false);
 const noValidation=source.replace('amount <= 0 || amount > capacity - liters','amount > capacity - liters');
 const results=evaluateClass36(noValidation);assert.equal(results.ok,false);assert.equal(results.tests[4].pass,false);
 const noTransferCheck=source.replace('amount <= 0 || amount > liters || amount > other.capacity - other.liters','amount > liters');
 assert.equal(evaluateClass36(noTransferCheck).ok,false);
 const comparison=source.replace('return capacity - liters > other.capacity - other.liters;', 'return capacity - liters >= other.capacity - other.liters;');
 assert.equal(evaluateClass36(comparison).ok,false,'ties must return false');
});
test('reference engine accepts parameter renaming, this.field, and methods delegating to another object',()=>{
 const revised=source.replace('WaterTank(int maxCapacity, int startingLiters)', 'WaterTank(int max, int start)')
 .replace('capacity = maxCapacity;', 'this.capacity = max;')
 .replace('liters = startingLiters;', 'this.liters = start;');
 assert.equal(evaluateClass36(revised).ok,true,JSON.stringify(evaluateClass36(revised)));
});
test('reference scenarios require predictions before trace and show object identity correctly',()=>{
 let d={},html=render36Page(2,d,9);
 assert.match(html,/disabled>Start step-through/);
 assert.match(html,/Predict before tracing/);
 assert.match(memoryDiagram36(SCENARIOS36[1][0]),/Player #1/);
 assert.match(memoryDiagram36(SCENARIOS36[1][1]),/Player #2/);
 assert.doesNotMatch(html,/After the call, the answer is/);
});
test('lesson gates require complete reference experiments, access decisions and practice',()=>{
 for(let n=1;n<=5;n++){
  const base={answers:Object.fromEntries(PRACTICE36[n].map(x=>[x.id,x.answer]))};assert.equal(complete36(n,base),false);
  if(n<=3)base.finished=SCENARIOS36[n].map(s=>s.id);
  else if(n===4)base.accessPassed=ACCESS36.map(s=>s.id);
  else base.fullClass={passed:true};
  assert.equal(complete36(n,base),true);
 }
});
test('graded check distributes keys and enforces 80 percent without changing question snapshots',()=>{
 const draft=Object.fromEntries(QUESTIONS36.map((q,i)=>[q.id,i<2?(q.answer+1)%4:q.answer]));
 const a={draft};assert.equal(count36(a),10);const grade=grade36(a);assert.equal(grade.score,80);assert.equal(grade.questions.length,10);
 assert.equal(grade.answers.q1,draft.q1);const html=render36Check(a,458,false);assert.match(html,/10 questions/);assert.match(html,/80%/);assert.doesNotMatch(html,/Teacher key/);
 const t=render36Check(a,458,true);assert.match(t,/Teacher key/);
});
test('3.6 unlocks from valid 3.5 pass, and restores existing v1.14 progress',()=>{
 const old=blankState();old.assessments['3.5'].attempts=[{score:83.33,at:'2026-11-09'}];
 old.pages['3.5.8']={completed:true,data:{fullClass:{code:'original',passed:true}}};
 const st=normalizeState(JSON.parse(JSON.stringify(old)));
 assert.equal(topicUnlocked(st,'3.6'),true);assert.equal(pageUnlocked(st,'3.6',2),false);
 assert.equal(st.pages['3.5.8'].data.fullClass.code,'original');assert.equal(st.assessments['3.5'].attempts[0].score,83.33);
 st.pages['3.6.1']={completed:true,data:{}};assert.equal(pageUnlocked(st,'3.6',2),true);
 for(let i=2;i<=5;i++)st.pages[`3.6.${i}`]={completed:true,data:{}};
 assert.equal(topicCompleted(st,'3.6'),true);
});
