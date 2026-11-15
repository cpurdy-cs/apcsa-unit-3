import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {evaluateClass37,STARTER37,TEST_COUNT37} from '../js/topics/static-engine37.js';
const source=readFileSync(new URL('./fixtures/solution37.txt',import.meta.url),'utf8');
test('TrailGate complete Java solution passes 21 static and instance behavior tests',()=>{const out=evaluateClass37(source);assert.equal(out.ok,true,JSON.stringify(out.tests.filter(t=>!t.pass)));assert.equal(out.tests.length,21);assert.equal(TEST_COUNT37,21);assert.equal(evaluateClass37(STARTER37).ok,false);});
test('static evaluator supports alternative parameter names, this.field, class-qualified static calls',()=>{
 const altered=source.replace('TrailGate(int maxVisitors)','TrailGate(int maxAllowed)').replace('capacity = maxVisitors;', 'this.capacity = maxAllowed;').replace('totalAdmitted += groupSize;', 'TrailGate.totalAdmitted += groupSize;');
 const out=evaluateClass37(altered);assert.equal(out.ok,true,JSON.stringify(out.tests.filter(t=>!t.pass)));
});
test('static evaluator distinguishes class state from instance state and requires validation',()=>{
 for(const variant of [source.replace('totalAdmitted += groupSize;', ''),source.replace('groupSize <= 0','groupSize < 0'),source.replace('groupSize > MAX_GROUP_SIZE','groupSize > 900'),source.replace('admitted += groupSize;','admitted = groupSize;')]){
  const out=evaluateClass37(variant);assert.equal(out.ok,false,'Incorrect behavior must fail');assert.equal(out.tests.length,21);assert.ok(out.tests.some(x=>!x.pass&&x.input&&x.expected&&x.actual));
 }
});
test('static evaluator rejects static methods reading instance state directly and final reassignment',()=>{
 const badStatic=source.replace('gate.admitted + groupSize <= gate.capacity','admitted + groupSize <= capacity');const x=evaluateClass37(badStatic);assert.equal(x.ok,false);assert.match(x.tests.find(t=>!t.pass)?.actual||'',/Instance field .* needs a TrailGate object reference/);
 const badFinal=source.replace('admitted += groupSize;', 'MAX_GROUP_SIZE = 13;\n        admitted += groupSize;');const y=evaluateClass37(badFinal);assert.equal(y.ok,false);assert.match(y.tests.find(t=>!t.pass)?.actual||'',/final variable/);
});
test('static evaluator produces diagnostic test input/expected/actual output for errors',()=>{const broken=evaluateClass37(source.replace('return admitted;','return admitted + 1;'));assert.equal(broken.ok,false);assert.ok(broken.tests.some(t=>!t.pass));for(const t of broken.tests){assert.ok(t.input);assert.ok(t.expected);assert.equal(typeof t.actual,'string');}});
