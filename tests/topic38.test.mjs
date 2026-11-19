import test from 'node:test';import assert from 'node:assert/strict';
import {TOPICS,IMPLEMENTED_TOPICS,topicUnlocked,pageUnlocked} from '../js/registry.js';
import {blankState,normalizeState} from '../js/storage.js';
import {PAGE38,SCOPE_SCENES38,SHADOW_CASES38,PRACTICE38,QUESTIONS38} from '../js/content38.js';
import {complete38,render38Page,render38Check,grade38} from '../js/topic38.js';
import {topicSidebarStates,renderSidebarTopics} from '../js/sidebar-status.js';
test('Topic 3.8 is a new modular four-lesson plugin without old topic changes',()=>{
 assert.deepEqual(IMPLEMENTED_TOPICS.map(t=>t.id).slice(-3),['3.7','3.8','3.9']);assert.equal(PAGE38.length,4);assert.equal(TOPICS.find(t=>t.id==='3.9').implemented,true);
 const st=blankState();assert.equal(topicUnlocked(st,'3.8'),false);st.assessments['3.7'].attempts.push({score:80});assert.equal(topicUnlocked(st,'3.8'),true);assert.equal(pageUnlocked(st,'3.8',2),false);
 st.pages['3.8.1']={completed:true,data:{}};assert.equal(pageUnlocked(st,'3.8',2),true);
});
test('lesson completion gates each activity and does not count page visits alone',()=>{
 assert.equal(complete38(1,{}),false);assert.equal(complete38(1,{solved:SCOPE_SCENES38.map(x=>x.id),answers:Object.fromEntries(PRACTICE38[1].map(x=>[x.id,x.answer]))}),true);
 assert.equal(complete38(2,{traced:true,predCorrect:false,answers:Object.fromEntries(PRACTICE38[2].map(x=>[x.id,x.answer]))}),false);
 assert.equal(complete38(3,{solved:SHADOW_CASES38.map(x=>x.id),answers:Object.fromEntries(PRACTICE38[3].map(x=>[x.id,x.answer]))}),true);
 assert.equal(complete38(4,{fullClass:{passed:true},answers:{}}),false);
});
test('guided lesson code and graded questions are readable as multiline code panels',()=>{
 const html=render38Page(1,{},42);assert.match(html,/topic38-workbench/);assert.match(html,/addPoints/);assert.match(html,/bonus/);
 const assessment=render38Check({draft:{}},42,false);assert.match(assessment,/<pre><code>/);assert.match(assessment,/10 questions/);assert.doesNotMatch(assessment,/Teacher key:/);assert.equal(QUESTIONS38.length,10);
});
test('grading captures snapshots, scores 80 percent, and leaves student answers unrevealed',()=>{
 const a={draft:Object.fromEntries(QUESTIONS38.map((q,i)=>[q.id,i<2?(q.answer+1)%4:q.answer]))};const x=grade38(a);
 assert.equal(x.score,80);assert.equal(x.questions.length,10);assert.equal(x.questionBank,'2025-U3.8-v1');assert.equal(x.points.q1,0);
});
test('legacy backup survives a new topic registration',()=>{
 const st=blankState();st.pages['3.3.4']={completed:true,data:{reflection:'saved'}};st.assessments['3.7'].attempts=[{score:90,answers:{q1:1}}];
 st.overrides.topics['3.8']={at:'2026-11-16',reason:'Teacher exception'};const restored=normalizeState(JSON.parse(JSON.stringify(st)));
 assert.equal(restored.pages['3.3.4'].data.reflection,'saved');assert.equal(restored.assessments['3.7'].attempts[0].score,90);assert.equal(restored.overrides.topics['3.8'].reason,'Teacher exception');
});
test('sidebar clearly distinguishes completed/current/locked and individual lessons',()=>{
 const st=blankState();st.assessments['3.7'].attempts.push({score:80});for(let i=1;i<=3;i++)st.pages[`3.8.${i}`]={completed:true,data:{}};
 const states=topicSidebarStates(st,false,'3.8');assert.equal(states.find(t=>t.id==='3.7').status,'completed');assert.equal(states.find(t=>t.id==='3.8').status,'current');assert.equal(states.find(t=>t.id==='3.9').status,'locked');
 const html=renderSidebarTopics(st,false,'3.8');assert.match(html,/status-completed/);assert.match(html,/status-current/);assert.match(html,/Completed/);assert.match(html,/Current/);assert.match(html,/Locked/);assert.match(html,/sidebar-lesson.*done/);assert.match(html,/3.8.4/);
});

test('3.8.2 displays the full caller before the method and asks for both caller outcomes',()=>{
 const html=render38Page(2,{step:0},42);
 assert.match(html,/Read the caller code first/);
 assert.match(html,/public class Runner/);
 assert.match(html,/int score = 10;/);
 assert.match(html,/int result = calc\.applyBonus\(score\);/);
 assert.match(html,/System\.out\.println/);
 assert.match(html,/38-trace-pred/);
 assert.match(html,/38-trace-result-pred/);
 assert.ok(html.indexOf('Read the caller code first') < html.indexOf('RewardCalc class · method being executed'));
 assert.match(html,/Caller result/);
 assert.match(html,/Next step/);
 const ending=render38Page(2,{step:6,prediction:'10',resultPrediction:'15',traced:true,predCorrect:true},42);
 assert.match(ending,/Both caller values are correct/);
 assert.match(ending,/Caller result/);
 assert.match(ending,/15/);
});
test('completed older 3.8.2 progress still counts without the new result prediction',()=>{
 const old={traced:true,predCorrect:true,prediction:'10',step:6,answers:Object.fromEntries(PRACTICE38[2].map(q=>[q.id,q.answer]))};
 assert.equal(complete38(2,old),true);
 const restored=normalizeState({...blankState(),pages:{'3.8.2':{completed:true,data:old}}});
 assert.equal(restored.pages['3.8.2'].data.predCorrect,true);
 assert.equal(complete38(2,restored.pages['3.8.2'].data),true);
});
