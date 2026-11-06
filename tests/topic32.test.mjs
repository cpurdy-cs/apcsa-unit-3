import test from 'node:test';
import assert from 'node:assert/strict';
import {blankState,normalizeState} from '../js/storage.js';
import {access32,mastered32,complete32,prizeResult,render32Page,grade32} from '../js/topic32.js';
import {PAGE32,POLICIES,IMPACT_CHALLENGES,RELIABILITY_TESTS,CODE_ASSETS,ETHICS_CHALLENGES,QUESTIONS32} from '../js/content32.js';
import {stableShuffle,gradedChoiceTargets,placeCorrectOption} from '../js/order.js';

test('Topic 3.2 respects 3.1 mastery and sequential page locks',()=>{
 const state=blankState();assert.equal(access32(state,1),false);
 state.assessments['3.1'].attempts.push({score:70});assert.equal(access32(state,1),false);
 state.assessments['3.1'].attempts.push({score:80});assert.equal(access32(state,1),true);
 assert.equal(access32(state,2),false);assert.equal(access32(state,3),false);
 state.pages['3.2.1']={completed:true,data:{}};assert.equal(access32(state,2),true);
 state.pages['3.2.2']={completed:true,data:{}};assert.equal(access32(state,3),true);
 state.pages['3.2.3']={completed:true,data:{}};assert.equal(mastered32(state),true);
 assert.equal(access32(blankState(),3,true),true);
});

test('Topic 3.2 has correct fail/pass cases and a genuine repair',()=>{
 const broken=RELIABILITY_TESTS.map(t=>prizeResult(t,false));
 assert.equal(broken.filter(x=>!x.correct).length,3,'zero stock, negative cost and zero cost must fail original implementation');
 for(const t of RELIABILITY_TESTS){const x=prizeResult(t,true);assert.equal(x.correct,true);assert.equal(x.status,t.expect);}
 const html=render32Page(2,{fixChoice:'b'},23);
 assert.match(html,/cost &gt; 0/); // repaired condition appears only once chosen
 assert.doesNotMatch(html,/\[object Object\]/);
 assert.match(html,/No test loaded/);
 assert.match(html,/Run code/);
 assert.match(html,/32-load-test/);
 // No correct-answer confirmation until a repair has been fully tested.
 assert.doesNotMatch(html,/That repair checks all required conditions/);
 assert.equal(prizeResult(RELIABILITY_TESTS.find(t=>t.id==='exact'),'d').correct,false);
 assert.equal(prizeResult(RELIABILITY_TESTS.find(t=>t.id==='empty'),'c').correct,false);
});

test('Topic 3.2 lesson requirements validate actual work',()=>{
 const a={visited:POLICIES.map(x=>x.id),answers:Object.fromEntries(IMPACT_CHALLENGES.map(x=>[x.id,x.answer])),reflection:'A nickname leaderboard gives friendly competition while limiting privacy risks, especially if people can opt out.'};
 assert.equal(complete32(1,a),true);assert.equal(complete32(1,{...a,visited:['public']}),false);
 const b={before:Object.fromEntries(RELIABILITY_TESTS.map(t=>[t.id,prizeResult(t,false)])),after:Object.fromEntries(RELIABILITY_TESTS.map(t=>[t.id,prizeResult(t,true)])),fixChoice:'b',types:{exact:'Boundary',empty:'Boundary',negative:'Invalid'}};
 assert.equal(complete32(2,b),true);assert.equal(complete32(2,{...b,fixChoice:'a'}),false);
 const c={assetAnswers:Object.fromEntries(CODE_ASSETS.map(x=>[x.id,x.answer])),answers:Object.fromEntries(ETHICS_CHALLENGES.map(x=>[x.id,x.answer])),reflection:'I would check the original author and permission terms before copying the code because public access is not a license.'};
 assert.equal(complete32(3,c),true);assert.equal(complete32(3,{...c,assetAnswers:{}}),false);
});

test('The eight-question graded check has accurate keys and makes seven of eight a pass',()=>{
 assert.equal(QUESTIONS32.length,8);
 const draft=Object.fromEntries(QUESTIONS32.map(q=>[q.id,q.kind==='choice'?q.answer:Object.fromEntries(q.items.map(([,answer],i)=>[i,answer]))]));
 const perfect=grade32({draft});assert.equal(perfect.score,100);assert.equal(Object.values(perfect.points).reduce((a,b)=>a+b,0),100);
 draft.u32q1=1;const almost=grade32({draft});assert.equal(almost.score,87.5);assert.equal(almost.score>=80,true);
 draft.u32q2=0;const notYet=grade32({draft});assert.equal(notYet.score,75);assert.equal(notYet.score>=80,false);
 // Each question's original correct index remains the grading key even after display shuffle.
 for(let seed=0;seed<20;seed++){
  const choices=QUESTIONS32.filter(x=>x.kind==='choice');const targets=gradedChoiceTargets(seed,choices.length);
  choices.forEach((q,i)=>{const order=placeCorrectOption(q.options,q.answer,targets[i],seed,`32-graded-${q.id}`);assert.equal(order[targets[i]].index,q.answer);});
 }
});

test('Legacy backups import without losing 3.1, 3.2 or previously recorded attempts',()=>{
 const old=blankState();old.pages[1]={completed:true,completedAt:'2026-11-05',data:{explored:['board']}};
 old.assessments['3.1'].attempts=[{at:'2026-11-05',score:80}];delete old.assessments['3.2'];
 const migrated=normalizeState(old);
 assert.equal(migrated.pages[1].completed,true);assert.equal(migrated.assessments['3.1'].attempts[0].score,80);
 assert.deepEqual(migrated.assessments['3.2'].attempts,[]);
 migrated.pages['3.2.1']={completed:true,completedAt:'2026-11-05',data:{visited:['alias']}};
 migrated.assessments['3.2'].attempts=[{at:'2026-11-05',score:87.5}];
 const restored=normalizeState(JSON.parse(JSON.stringify(migrated)));
 assert.deepEqual(restored.pages['3.2.1'].data.visited,['alias']);assert.equal(restored.assessments['3.2'].attempts[0].score,87.5);
});

test('Leaderboard begins unselected and saved policy selections remain stable',()=>{
 const initial=render32Page(1,{},451);
 assert.match(initial,/No policy selected/);
 assert.match(initial,/Select a policy above to preview/);
 assert.doesNotMatch(initial,/class="policy-choice selected"/);
 const restored=render32Page(1,{policy:'alias',visited:['public','alias']},451);
 assert.match(restored,/Nicknames, opt-in rankings/);
 assert.doesNotMatch(restored,/No policy selected/);
});

test('Boundary check #2 includes below, exactly at and above the threshold',()=>{
 const q=QUESTIONS32.find(x=>x.id==='u32q2');
 assert.match(q.options[q.answer],/9, 10, and 11/);
 assert.match(q.explanation,/just above/);
 const initial=render32Page(2,{types:{exact:'Normal'}},451);
 assert.match(initial,/Not quite\. A boundary checks a threshold/);
 const corrected=render32Page(2,{types:{exact:'Boundary',empty:'Boundary',negative:'Invalid'}},451);
 assert.match(corrected,/3\/3 classifications correct/);
});
