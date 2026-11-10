import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {evaluateFullClass35,starterClass35} from '../js/topics/class-engine35.js';
import {runMethodTests35,starter35} from '../js/topics/method-engine35.js';
import {render35Page,complete35} from '../js/topic35.js';
import {PRACTICE35} from '../js/content35.js';
import {blankState,normalizeState} from '../js/storage.js';
const solution=readFileSync(new URL('./fixtures/solution35.txt',import.meta.url),'utf8');

test('full-class challenge checks constructor, getters, setters, mutations and boundary behavior',()=>{
 const r=evaluateFullClass35(solution);
 assert.equal(r.ok,true,JSON.stringify(r));assert.equal(r.tests.length,12);
 const wrong=solution.replace('if (amount > 0)','if (amount >= 0)'); // This is equivalent for zero; intentionally change to admit negatives instead.
 assert.equal(evaluateFullClass35(wrong.replace('>= 0','>= -100')).ok,false);
 assert.equal(evaluateFullClass35(solution.replace('tickets -= cost','tickets += cost')).ok,false);
 assert.match(evaluateFullClass35('public class PrizeCard {}').error,/private String owner/);
});
test('full-class evaluator accepts valid this.field and shadowing in Java',()=>{
 const withThis=solution.replace('owner = ownerName;\n        tickets = startingTickets;\n        active = startingActive;',
 'this.owner = ownerName;\n        this.tickets = startingTickets;\n        this.active = startingActive;');
 assert.equal(evaluateFullClass35(withThis).ok,true);
 const shadowed=withThis.replace('String ownerName, int startingTickets, boolean startingActive','String owner, int tickets, boolean active').replace('this.owner = ownerName;\n        this.tickets = startingTickets;\n        this.active = startingActive;', 'this.owner = owner;\n        this.tickets = tickets;\n        this.active = active;');
 assert.equal(evaluateFullClass35(shadowed).ok,true,JSON.stringify(evaluateFullClass35(shadowed)));
});
test('single-method 3.5 evaluator accepts this.field as valid Java',()=>{
 const src=starter35('tickets').replace('    // Write your complete method here.', '    public void addTickets(int amount) { this.tickets += amount; }');
 assert.equal(runMethodTests35(src,'tickets').ok,true);
});
test('3.5.5 correct dropdown choices are at three different positions for each student',()=>{
 for(const seed of [2,42,50,12345,0xffffffff]){
  const html=render35Page(5,{},seed);
  const groups=[...html.matchAll(/<select id="35-access-(accessor|mutator|predicate)"[^>]*>([\s\S]*?)<\/select>/g)];
  assert.equal(groups.length,3);
  const positions=groups.map(m=>[...m[2].matchAll(/<option value="([^"]*)"/g)].findIndex(x=>x[1]==='correct')-1);
  assert.deepEqual([...positions].sort(),[0,1,2],`seed ${seed}: ${positions}`);
 }
});
test('old v1.13 student submissions and practice retained while new final task reopens',()=>{
 const st=blankState();st.topic35Revision=undefined;st.identity={first:'Ari',last:'S'};
 st.pages['3.5.8']={completed:true,completedAt:'2026-11-09',data:{answers:Object.fromEntries(PRACTICE35[8].map(q=>[q.id,q.answer])),workshop:{tickets:{code:'old answer'}},passed:{tickets:true}}};
 st.assessments['3.5'].attempts=[{score:90,at:'2026-11-09',answers:{q1:0}}];st.assessments['3.5'].locked=true;
 const restored=normalizeState(st);
 assert.equal(restored.pages['3.5.8'].completed,false);
 assert.deepEqual(restored.pages['3.5.8'].data.workshop,st.pages['3.5.8'].data.workshop);
 assert.equal(restored.pages['3.5.8'].data.answers[PRACTICE35[8][0].id],PRACTICE35[8][0].answer);
 assert.equal(restored.assessments['3.5'].attempts[0].score,90);
 assert.equal(restored.assessments['3.5'].locked,true);
 assert.match(restored.pages['3.5.8'].data.fullClass.code,/PrizeCard/);
});
test('no full-class credit from the previous four-method flags',()=>{
 const d={answers:Object.fromEntries(PRACTICE35[8].map(q=>[q.id,q.answer])),passed:{tickets:true,points:true,redeem:true,sum:true}};
 assert.equal(complete35(8,d),false);
 d.fullClass={code:solution,result:evaluateFullClass35(solution),passed:true};
 assert.equal(complete35(8,d),true);
});
