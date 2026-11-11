import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {blankState,normalizeState} from '../js/storage.js';
import {PAGE36,PRACTICE36,QUESTIONS36} from '../js/content36.js';
import {evaluateClass36,STARTER36,REFERENCE_SPEC36} from '../js/topics/reference-engine36.js';
import {render36Page} from '../js/topic36.js';
const source=readFileSync(new URL('./fixtures/solution36.txt',import.meta.url),'utf8');

test('3.6.5 is a new two-field WaterTank design assignment with explicit argument validation',()=>{
 const page=render36Page(5,{},1987);
 assert.match(page,/Build a WaterTank from scratch/);
 assert.match(page,/maximum capacity/);
 assert.match(page,/amount &lt;= 0/);
 assert.match(page,/transferTo\(WaterTank other, int amount\)/);
 assert.match(page,/chooseLowerLevel\(WaterTank first, WaterTank second\)/);
 assert.match(page,/View sample caller code/);
 assert.doesNotMatch(page,/Write TicketWallet from specifications|public class TicketWallet|WeatherStation/);
 assert.deepEqual(REFERENCE_SPEC36.fields,['private int capacity;','private int liters;']);
 assert.match(STARTER36,/Write the complete WaterTank class/);
 for(const q of PRACTICE36[5]) assert.doesNotMatch(q.prompt,/TicketWallet|WeatherStation|temperature/i);
 assert.equal(PAGE36.length,5);
});

test('18 tests include valid and invalid arguments, boundaries, other-reference mutation and exact identity',()=>{
 const good=evaluateClass36(source);
 assert.equal(good.ok,true,JSON.stringify(good));assert.equal(good.tests.length,18);
 assert.ok(good.tests.every(t=>t.pass&&t.input&&t.expected&&t.actual));
 const invalidAdd=source.replace('amount <= 0 || amount > capacity - liters', 'amount > capacity - liters');
 assert.equal(evaluateClass36(invalidAdd).tests[4].pass,false);
 const overflow=source.replace('amount <= 0 || amount > capacity - liters', 'amount <= 0');
 assert.equal(evaluateClass36(overflow).tests[5].pass,false);
 const invalidTransfer=source.replace('amount <= 0 || amount > liters || amount > other.capacity - other.liters','amount <= 0 || amount > liters');
 assert.equal(evaluateClass36(invalidTransfer).tests[10].pass,false);
 const insufficient=source.replace('amount <= 0 || amount > liters || amount > other.capacity - other.liters','amount <= 0 || amount > other.capacity - other.liters');
 assert.equal(evaluateClass36(insufficient).tests[9].pass,false);
 const redirected=source.replace('other.liters += amount;', 'other = new WaterTank(other.capacity, other.liters + amount);');
 assert.equal(evaluateClass36(redirected).tests[6].pass,false);
 const clone=source.replace('return first;', 'return new WaterTank(first.capacity, first.liters);');
 assert.equal(evaluateClass36(clone).tests[15].pass,false);
 const wrongTie=source.replace('first.liters <= second.liters', 'first.liters < second.liters');
 assert.equal(evaluateClass36(wrongTie).tests[15].pass,false);
});

test('WaterTank evaluator supports alternate constructor parameter names, this.field, and public method delegation',()=>{
 const revised=source.replace('WaterTank(int maxCapacity, int startingLiters)','WaterTank(int max, int starting)')
 .replace('capacity = maxCapacity;', 'this.capacity = max;')
 .replace('liters = startingLiters;', 'this.liters = starting;')
 .replace('other.liters += amount;', 'other.addWater(amount);');
 assert.equal(evaluateClass36(revised).ok,true,JSON.stringify(evaluateClass36(revised)));
});

test('v1.17 WeatherStation workshop migrates without erasing graded checks or old work',()=>{
 const st=blankState();st.topic36Revision=2;
 st.identity={first:'Taylor',last:'A'};
 st.pages['3.6.1']={completed:true,data:{finished:['alias']}};
 const historical='public class WeatherStation { private int temperature; }';
 st.pages['3.6.5']={completed:true,completedAt:'2026-11-11T09:00:00Z',data:{answers:{a:1,b:1,c:1},legacyV116:{code:'old TicketWallet draft'},fullClass:{code:historical,passed:true}}};
 st.assessments['3.6'].attempts=[{score:80,at:'2026-11-11T10:00:00Z',questions:[{id:'q1',prompt:'Original question snapshot'}]}];
 st.assessments['3.6'].locked=true;
 st.overrides.topics['3.6']={at:'2026-11-11T10:30:00Z',reason:'Teacher authorized'};
 const upgraded=normalizeState(st);
 assert.equal(upgraded.topic36Revision,3);
 assert.equal(upgraded.pages['3.6.5'].completed,false);
 assert.equal(upgraded.pages['3.6.5'].data.legacyV117.code,historical);
 assert.equal(upgraded.pages['3.6.5'].data.legacyV116.code,'old TicketWallet draft');
 assert.equal(upgraded.pages['3.6.5'].data.fullClass,undefined);
 assert.deepEqual(upgraded.pages['3.6.5'].data.answers,{});
 assert.equal(upgraded.pages['3.6.1'].completed,true);
 assert.equal(upgraded.assessments['3.6'].locked,true);
 assert.equal(upgraded.assessments['3.6'].attempts[0].questions[0].prompt,'Original question snapshot');
 assert.equal(upgraded.overrides.topics['3.6'].reason,'Teacher authorized');
 assert.equal(normalizeState(upgraded).pages['3.6.5'].data.legacyV117.code,historical);
});

test('v1.16 TicketWallet backups also upgrade directly, preserving source and previous graded work',()=>{
 const st=blankState();delete st.topic36Revision;
 st.pages['3.6.5']={completed:true,data:{fullClass:{code:'public class TicketWallet {}',passed:true},answers:{a:0}}};
 st.assessments['3.6'].attempts=[{score:90}];
 const up=normalizeState(st);
 assert.equal(up.pages['3.6.5'].data.legacyV116.code,'public class TicketWallet {}');
 assert.equal(up.assessments['3.6'].attempts[0].score,90);
 assert.equal(up.pages['3.6.5'].completed,false);
});

test('original graded 3.6 assessment questions and identifiers remain unchanged',()=>{
 assert.equal(QUESTIONS36.length,10);
 assert.equal(QUESTIONS36[0].id,'q1');assert.equal(QUESTIONS36[9].id,'q10');
});
