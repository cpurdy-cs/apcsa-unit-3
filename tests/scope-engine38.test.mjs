import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {compile38,evaluateClass38,TEST_COUNT38} from '../js/topics/scope-engine38.js';
const solution=readFileSync(new URL('./fixtures/solution38.txt',import.meta.url),'utf8');
test('DroneBattery full class passes all bounded scope and state tests',()=>{
 const x=evaluateClass38(solution);assert.equal(x.ok,true);assert.equal(x.total,20);assert.equal(x.tests.length,TEST_COUNT38);assert.ok(x.tests.every(t=>t.pass));assert.ok(x.tests.every(t=>t.input.includes('DroneBattery battery')));
});
test('parameter names and this.field are not forced to match one solution',()=>{
 const variant=solution.replace('int initialCharge','int chargeInput').replace('charge = initialCharge;','this.charge = chargeInput;').replace('charge = remaining;','this.charge = remaining;');
 assert.equal(evaluateClass38(variant).ok,true);
});
test('scope evaluator rejects illegal access to a local after its if block',()=>{
 const invalid=solution.replace('charge = remaining;','charge = remaining;').replace('flights++;','flights++;\n        charge = updated;');
 const out=evaluateClass38(invalid);assert.equal(out.ok,false);assert.ok(out.tests.some(t=>/not in scope|execution error/i.test(t.actual)));
});
test('a shadowing bug compiles but is caught behaviorally',()=>{
 const shadow=solution.replace('charge = initialCharge;','int charge = initialCharge;');
 const out=evaluateClass38(shadow);assert.equal(out.ok,false);assert.ok(out.tests.some(t=>!t.pass));
});
test('bad inputs and invalid paths do not silently receive credit',()=>{
 const wrong=solution.replace('return false;','return true;');
 const res=evaluateClass38(wrong);assert.equal(res.ok,false);assert.ok(res.tests.some(t=>!t.pass));
});
test('multiple methods may reuse a local name, with separate scopes',()=>{
 const variant=solution.replace('return charge;','int result = charge;\n        return result;').replace('return flights;','int result = flights;\n        return result;');
 assert.equal(evaluateClass38(variant).ok,true);
});
test('invalid class declarations are reported without executing arbitrary source',()=>{
 assert.match(evaluateClass38('public class DroneBattery { private int charge; }').error,/flights/);
 assert.throws(()=>compile38('public class WrongName { }'),/DroneBattery/);
});
