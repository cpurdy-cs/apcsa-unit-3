import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {render39Page,complete39} from '../js/topic39.js';
import {RECEIVER_CASES39,PRACTICE39,SHADOW_CASES39} from '../js/content39.js';

test('3.9.1 uses three normal-case Java calls, highlights the current statement, and explains the current receiver',()=>{
 for(const [index,item] of RECEIVER_CASES39.entries()){
  const html=render39Page(1,{step:index},42);
  assert.match(html,/Runner\.main — current statement highlighted/);
  assert.match(html,/class="topic39-active-code-line"/);
  assert.ok(html.includes(`Call ${index+1}:`));
  assert.ok(html.includes(item.label));
  assert.ok(html.includes(`which Counter is <code>this</code>`));
  assert.match(html,/instance variable/);
  assert.doesNotMatch(html,/SensorDisplay|ChargingStation|GridMarker/);
 }
});
test('3.9.1 receiver prediction must be completed, followed by two practice questions',()=>{
 const d={solved:RECEIVER_CASES39.map(x=>x.id),correct:PRACTICE39[1].map(x=>x.id)};
 assert.equal(complete39(1,d),true);
 assert.equal(complete39(1,{solved:d.solved.slice(0,2),correct:d.correct}),false);
 assert.equal(complete39(1,{solved:d.solved,correct:[]}),false);
});
test('3.9.2 constructor examples display complete code, including corrected constructor',()=>{
 for(const example of SHADOW_CASES39){
  const html=render39Page(2,{selected:example.id,choices:{[example.id]:example.answer},solved:[example.id],tried:[example.id]},42);
  assert.match(html,/Runner\.java — complete caller/);
  assert.match(html,/Counter\.java — complete class/);
  assert.ok(html.includes(example.body));
  assert.ok(html.includes(example.explain));
 }
});
test('3.9 code examples wrap in the narrower layout without uppercase transformation',()=>{
 const css=readFileSync(new URL('../css/styles.css',import.meta.url),'utf8');
 assert.match(css,/\.topic39-plain \.topic39-code pre\{/);
 assert.match(css,/white-space:pre-wrap/);
});
