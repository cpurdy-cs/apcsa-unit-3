import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PAGE36,SCENARIOS36,PRACTICE36,QUESTIONS36} from '../js/content36.js';
import {evaluateClass36,REFERENCE_SPEC36} from '../js/topics/reference-engine36.js';
import {render36Page,render36Check} from '../js/topic36.js';
import {renderSubmissionReview} from '../js/review.js';
const source=readFileSync(new URL('./fixtures/solution36.txt',import.meta.url),'utf8');

test('supporting Java classes are available in each 3.6 lesson; access lab expands with private fields highlighted',()=>{
  for(let n=1;n<=5;n++){
    const html=render36Page(n,{},13);
    assert.match(html,/<details class="reference36-support"/);
    if(n===4){assert.match(html,/<details class="reference36-support" open>/);assert.match(html,/reference36-private[^>]*>private int tickets;/);assert.match(html,/reference36-private[^>]*>private int score;/);assert.match(html,/Enclosing class:/);}
    else{assert.doesNotMatch(html,/<details class="reference36-support" open>/);}
  }
});
test('returned-reference instructions and >= use plain characters and separate code blocks',()=>{
  const lesson=render36Page(3,{},7),sample=SCENARIOS36[3].find(x=>x.id==='identity');
  assert.match(sample.code,/>=/);assert.match(PAGE36[2].subtitle,/new creates a separate object/);
  const css=readFileSync(new URL('../css/styles.css',import.meta.url),'utf8');
  assert.match(css,/font-variant-ligatures:none/);assert.match(css,/\.topic36-page \.reference36-code pre/);
});
test('workshop retains same-class private comparisons and a reference-return requirement',()=>{
  assert.ok(REFERENCE_SPEC36.methods.some(([sig])=>sig.includes('hasMoreRoomThan(WaterTank other)')));
  assert.ok(!REFERENCE_SPEC36.methods.some(([sig])=>sig.includes('sameWallet')));
  const good=evaluateClass36(source);assert.equal(good.ok,true,JSON.stringify(good));assert.equal(good.total,18);
  const wrong=source.replace('return capacity - liters > other.capacity - other.liters;', 'return capacity - liters >= other.capacity - other.liters;');
  const failed=evaluateClass36(wrong);assert.equal(failed.ok,false);assert.equal(failed.tests[17].pass,false);
});
test('failing validation tests reveal the actual input amounts and expected and observed states',()=>{
  const buggy=source.replace('amount <= 0 || amount > capacity - liters', 'amount > capacity - liters');
  const out=evaluateClass36(buggy),t=out.tests[4];assert.equal(t.pass,false,JSON.stringify(t));
  assert.match(t.input,/addWater\(-2\)/);assert.match(t.expected,/liters = 4/);
  const page=render36Page(5,{fullClass:{code:buggy,result:out,passed:false}},11);
  assert.match(page,/Show failing inputs and results/);assert.match(page,/Expected result/);
  assert.match(page,/Actual result/);assert.match(page,/class="reference36-test-details" open/);
});
test('all runnable code cases report inputs, expected values, observed values, and outcomes',()=>{
  const out=evaluateClass36(source);assert.equal(out.tests.length,18);
  for(const t of out.tests){assert.ok(t.input.length>10,t.name);assert.ok(t.expected.length>0,t.name);assert.ok(t.actual.length>0,t.name);assert.equal(t.pass,true,t.name);}
  assert.match(PRACTICE36[5][1].prompt,/transferTo\(other, amount\)/);
});
test('3.6 graded check shows multiline Java blocks and clearer question 4 and 6',()=>{
  const html=render36Check({draft:{}},19,false);
  assert.match(html,/class="topic36-check"/);assert.ok((html.match(/Read the following Java code/g)||[]).length>=6);
  assert.match(html,/Player a = new Player\(10\);\nchange\(a\);/);
  assert.match(QUESTIONS36[3].prompt,/a\.getScore\(\)/);
  assert.match(QUESTIONS36[5].prompt,/Which statement is correct/);
  assert.doesNotMatch(html,/Teacher key:/);
});
test('old submitted question snapshot stays intact, while new submissions show code separately in review',()=>{
  const q=QUESTIONS36[0];const rec={attempts:[{score:0,answers:{q1:(q.answer+1)%4},points:{q1:0},questions:[q]}]};
  const html=renderSubmissionReview('3.6',rec,QUESTIONS36,false,'all','References');
  assert.match(html,/Original Java code/);assert.match(html,/Player a = new Player\(5\);\nPlayer b = a/);
  assert.match(html,/Your response:/);assert.doesNotMatch(html,/Teacher key:/);
  const old={...q,code:undefined,prompt:'Legacy stored question string'};
  const legacy=renderSubmissionReview('3.6',{attempts:[{score:0,answers:{q1:1},points:{q1:0},questions:[old]}]},QUESTIONS36,false,'all','References');
  assert.match(legacy,/Legacy stored question string/);assert.doesNotMatch(legacy,/Original Java code/);
});
