import test from 'node:test';
import assert from 'node:assert/strict';
import {stableShuffle,shuffledDesign,shuffledOptions,gradedChoiceTargets,placeCorrectOption} from '../js/order.js';
import {DESIGN,QUESTIONS,CLASSIFY_SCENE} from '../js/content.js';
import {blankState,normalizeState} from '../js/storage.js';

test('display permutations are reproducible across refresh and JSON backups',()=>{
 const st=blankState(); st.identity={first:'Test',last:'R'}; st.joinedAt='2026-11-05T10:00:00.000Z';
 const a=normalizeState(JSON.parse(JSON.stringify(st)));
 assert.equal(a.orderSeed,st.orderSeed);
 const q=QUESTIONS[4];
 const before=shuffledOptions(q.options,st.orderSeed,'graded-options-q5');
 assert.deepEqual(before,shuffledOptions(q.options,a.orderSeed,'graded-options-q5'));
 assert.equal(new Set(before.map(x=>x.index)).size,q.options.length);
 // Legacy exports from v1 do not have a seed; they should still be stable across imports.
 delete a.orderSeed;
 const old1=normalizeState(a),old2=normalizeState(a);
 assert.equal(old1.orderSeed,old2.orderSeed);
});

test('design studio cannot be solved by simply checking the first three items on either side',()=>{
 for(let seed=0;seed<400;seed++){
  for(const [items,salt] of [[DESIGN.fields,'design-fields'],[DESIGN.methods,'design-methods']]){
   const ordered=shuffledDesign(items,seed,salt);
   assert.equal(ordered.length,6);
   assert.equal(new Set(ordered.map(x=>x.id)).size,6);
   assert.ok(ordered.slice(0,3).some(x=>!x.ok));
   assert.equal(ordered.filter(x=>x.ok).length,3);
  }
 }
});

test('graded choices have a balanced correct-answer distribution without disturbing answer keys',()=>{
 const choices=QUESTIONS.filter(q=>q.kind==='choice');
 assert.equal(choices.length,8);
 for(let seed=0;seed<100;seed++){
  const targets=gradedChoiceTargets(seed,choices.length);
  assert.deepEqual([0,1,2,3].map(x=>targets.filter(y=>y===x).length),[2,2,2,2]);
  targets.forEach((target,i)=>{
   const q=choices[i];const arranged=placeCorrectOption(q.options,q.answer,target,seed,`graded-options-${q.id}`);
   assert.equal(arranged[target].index,q.answer);
   assert.equal(new Set(arranged.map(x=>x.index)).size,q.options.length);
   if(i>=2)assert.ok(!(targets[i]===targets[i-1]&&targets[i]===targets[i-2]));
  });
 }
});

test('category and sorting rows actually vary by student without changing grading identity',()=>{
 const first=stableShuffle(CLASSIFY_SCENE,101,'classify-1-classify');
 const second=stableShuffle(CLASSIFY_SCENE,202,'classify-1-classify');
 assert.notDeepEqual(first.map(x=>x.id),second.map(x=>x.id));
 assert.deepEqual(new Set(first.map(x=>x.id)),new Set(CLASSIFY_SCENE.map(x=>x.id)));
 const q5=QUESTIONS.find(q=>q.id==='q5');
 assert.match(q5.prompt,/score and remaining lives/i);
 assert.match(q5.options[q5.answer],/named attributes.*without requiring callers/i);
 assert.match(q5.explanation,/Data abstraction/);
});
