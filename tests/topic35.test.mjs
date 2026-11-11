import test from 'node:test';
import assert from 'node:assert/strict';
import {PAGE35,PRACTICE35,QUESTIONS35} from '../js/content35.js';
import {METHOD_CHALLENGES35,starter35,runMethodTests35} from '../js/topics/method-engine35.js';
import {starterClass35,evaluateFullClass35} from '../js/topics/class-engine35.js';
import {readFileSync} from 'node:fs';
import {complete35,render35Page,grade35,answerCount35,render35Check} from '../js/topic35.js';
import {normalizeState} from '../js/storage.js';
import {getImplementedTopic,topicUnlocked} from '../js/registry.js';
function solution(c){return starter35(c.id).replace('    // Write your complete method here.',c.example.split('\n').map(x=>'    '+x).join('\n'));}
test('3.5 has eight lessons and 12 assessment questions aligned with 2025 method scope',()=>{
 assert.equal(PAGE35.length,8);assert.equal(QUESTIONS35.length,12);assert.ok(getImplementedTopic('3.5'));assert.ok(getImplementedTopic('3.6'));
 assert.ok(QUESTIONS35.some(x=>x.objective.includes('3.5.A.8')));assert.ok(QUESTIONS35.some(x=>x.objective.includes('3.5.A.4')));
 for(let n=1;n<=8;n++)assert.equal(PRACTICE35[n].length,3);
});
test('four independent method programs pass all four tests with actual execution',()=>{
 for(const c of METHOD_CHALLENGES35){const r=runMethodTests35(solution(c),c.id);assert.equal(r.ok,true,`${c.id}: ${JSON.stringify(r)}`);assert.equal(r.tests.length,4);}
});
test('method evaluator rejects wrong state, wrong return, invalid syntax and runaway loops',()=>{
 const tickets=METHOD_CHALLENGES35[0];assert.equal(runMethodTests35(solution(tickets).replace('tickets += amount','amount += tickets'),tickets.id).ok,false);
 const points=METHOD_CHALLENGES35[1];assert.equal(runMethodTests35(solution(points).replace('return goal - score','return 5'),points.id).ok,false);
 assert.equal(runMethodTests35(solution(points).replace('return goal - score','return;'),points.id).ok,false);
 const sum=METHOD_CHALLENGES35.at(-1);assert.equal(runMethodTests35(solution(sum).replace('i++','i--'),sum.id).ok,false);
 assert.match(runMethodTests35(starter35('tickets').replace('    // Write your complete method here.','public void addTickets(int amount) { alert(amount); }'),'tickets').error,/Expected|Unsupported|variable|method/i);
});
test('3.5.8 has a blank full-class editor and detailed specifications',()=>{
 const html=render35Page(8,{},42);
 assert.match(html,/Write an entire PrizeCard class/);
 assert.match(html,/private String owner/);
 assert.match(html,/private int tickets/);
 assert.match(html,/method35-spec/);
 const editor=html.match(/<textarea[^>]*>([\s\S]*?)<\/textarea>/)?.[1]||'';
 assert.match(editor,/Write the entire PrizeCard class/);
 assert.doesNotMatch(editor,/public class PrizeCard/);
});
test('complete class passes twelve behavioral tests',()=>{
 const src=readFileSync(new URL('./fixtures/solution35.txt',import.meta.url),'utf8');
 const result=evaluateFullClass35(src);
 assert.equal(result.ok,true,JSON.stringify(result));
 assert.equal(result.tests.length,12);
 assert.equal(evaluateFullClass35(starterClass35).ok,false);
});
test('every page completion requires interactive evidence plus three correct practice answers',()=>{
 for(let n=1;n<=8;n++){const d={answers:Object.fromEntries(PRACTICE35[n].map(q=>[q.id,q.answer]))};assert.equal(complete35(n,d),false,`page ${n} must require exploration`);}
});
test('12-question graded check scores 10 of 12 at 83.33%, accepts all-or-nothing classification and keeps copy stable',()=>{
 const draft=Object.fromEntries(QUESTIONS35.map((q,i)=>[q.id,q.kind==='choice'?(i<2?(q.answer+1)%q.options.length:q.answer):Object.fromEntries(q.items.map(([,a],j)=>[j,a]))]));
 assert.equal(answerCount35({draft}),12);const score=grade35({draft});assert.equal(score.score,83.33);assert.equal(score.questions.length,12);
 const html=render35Check({draft:{}},54,false);assert.match(html,/12 questions/);assert.match(html,/80%/);
});
test('v1.12 progress remains compatible and Topic 3.5 unlocks from a 3.4 pass',()=>{
 const old={schema:1,topic34Revision:2,identity:{first:'Alex',last:'R'},pages:{'3.4.4':{completed:true,data:{workshopPasses:{prize:true}}}},assessments:{'3.4':{attempts:[{score:90}],draft:{},locked:true}}};
 const st=normalizeState(old);assert.equal(st.pages['3.4.4'].data.workshopPasses.prize,true);assert.equal(st.assessments['3.4'].attempts[0].score,90);assert.equal(topicUnlocked(st,'3.5'),true);assert.equal(st.assessments['3.5'].attempts.length,0);
});
