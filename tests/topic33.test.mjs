import test from 'node:test';
import assert from 'node:assert/strict';
import {PAGE33,ANATOMY,CLASS_PARTS,ACCESS_TRANSFER,OBJECT_TRANSFER,BUILD_SLOTS,BUILD_TRANSFER,QUESTIONS33} from '../js/content33.js';
import {accessPermitted,accessCode,addToObject,getFromObject,objectState,assembledClass,buildFeedback,complete33,grade33,render33Page,render33Check,render33Results,answerCount33} from '../js/topic33.js';
import {blankState,normalizeState} from '../js/storage.js';
import {topicUnlocked,pageUnlocked,getImplementedTopic} from '../js/registry.js';

const allAnswers=questions=>Object.fromEntries(questions.map(q=>[q.id,q.answer]));
const completePages=()=>[
 {inspected:ANATOMY.map(x=>x.id),parts:Object.fromEntries(CLASS_PARTS.map(x=>[x.id,x.answer])),partsChecked:true,concept:1},
 {probed:['inside-score','outside-score','inside-get','outside-get'],answers:allAnswers(ACCESS_TRANSFER)},
 {created:true,scores:{a:15,b:30},calls:[{kind:'add',id:'a',amount:5},{kind:'add',id:'b',amount:10},{kind:'get',id:'a'}],answers:allAnswers(OBJECT_TRANSFER)},
 {build:Object.fromEntries(BUILD_SLOTS.map(s=>[s.id,'correct'])),validated:true,clientChecked:true,answers:allAnswers(BUILD_TRANSFER),reflection:'Private tickets protects the field while the getter allows a limited safe read for clients.'}
];
test('3.3 strictly follows the 2025 Topic 3.3 scope and has all four curriculum pages',()=>{
 assert.equal(PAGE33.length,4);assert.equal(QUESTIONS33.length,10);
 assert.deepEqual(new Set(QUESTIONS33.map(q=>q.id)).size,10);
 for(const ek of ['3.3.A.1','3.3.A.2','3.3.A.3','3.3.A.4','3.3.A.5','3.3.A.6']){
  assert.ok(QUESTIONS33.some(q=>q.objective.includes(ek)||q.objective.includes('3.3.A.1–3.3.A.6')||q.objective.includes('3.3.A.2–3.3.A.6')),ek);
 }
 assert.equal(getImplementedTopic('3.3').lessons.length,4);
});
test('visibility checker denies external private access and permits same-class private access',()=>{
 for(const visibility of ['public','private'])for(const caller of ['inside','outside']){
  const permitted=accessPermitted(caller,{visibility});
  assert.equal(permitted,visibility==='public'||caller==='inside');
 }
 assert.match(accessCode('outside',{id:'score',method:'score'}),/int copy = p.score;/);
 assert.match(accessCode('inside',{id:'score',method:'score'}),/int copy = score;/);
});
test('two Player objects retain independent instance values across method calls',()=>{
 const d={};assert.equal(addToObject(d,'a',5),false);
 d.created=true;d.scores={a:10,b:20};assert.equal(addToObject(d,'a',10),true);
 assert.deepEqual(objectState(d),{a:20,b:20});
 assert.equal(addToObject(d,'b',5),true);assert.deepEqual(objectState(d),{a:20,b:25});
 assert.equal(getFromObject(d,'a'),true);assert.equal(d.calls.at(-1).score,20);
 assert.equal(addToObject(d,'a',-1),false);
});
test('class builder begins incomplete, uses private attributes and public API, and never pretends to compile Java',()=>{
 assert.equal(buildFeedback({}).all,false);
 const picks=Object.fromEntries(BUILD_SLOTS.map(s=>[s.id,'correct']));
 const value=assembledClass(picks);
 for(const string of ['public class PrizeCard','private String owner;','private int tickets;','public PrizeCard(String ownerName, int initialTickets)','public int getTickets()','public void addTickets(int amount)','private void audit()'])assert.ok(value.includes(string),string);
 assert.equal(buildFeedback(picks).all,true);
 const wrong={...picks,getter:'private'};assert.equal(buildFeedback(wrong).all,false);
 assert.match(render33Page(4,{build:wrong,validated:false},42),/Review/);
 assert.match(render33Page(4,{build:picks,validated:true,clientChecked:true},42),/not a full Java compiler/);
});
test('all 3.3 lesson gates require successful practice (not mere visits)',()=>{
 const pages=completePages();for(let n=1;n<=4;n++){
  assert.equal(complete33(n,{}),false);assert.equal(complete33(n,pages[n-1]),true);
 }
 pages[0].parts.p1='Method';assert.equal(complete33(1,pages[0]),false);
 pages[1].probed=['inside-score'];assert.equal(complete33(2,pages[1]),false);
 pages[2].calls=pages[2].calls.filter(x=>x.id!=='b');assert.equal(complete33(3,pages[2]),false);
 pages[3].validated=false;assert.equal(complete33(4,pages[3]),false);
});
test('ten-question assessment scores 10 points per correct answer, with one classification entirely correct required',()=>{
 const a={draft:{}};assert.equal(answerCount33(a),0);
 for(const q of QUESTIONS33)a.draft[q.id]=q.kind==='choice'?q.answer:Object.fromEntries(q.items.map(([,answer],i)=>[i,answer]));
 assert.equal(answerCount33(a),10);assert.equal(grade33(a).score,100);
 for(const q of QUESTIONS33.slice(0,2))a.draft[q.id]=(q.answer+1)%4;
 assert.equal(grade33(a).score,80);
 a.draft.u33q9[0]='Method';assert.equal(grade33(a).score,70);
 assert.match(render33Check(a,1234,false),/10 questions/);assert.match(render33Results({attempts:[grade33(a)]},false),/Review Topic 3.3/);
});
test('3.3 is gated by 3.2; legacy backups gain new topic state without changing older evidence',()=>{
 const st=blankState();st.identity={first:'Ari',last:'S'};
 st.pages[1]={completed:true,data:{score:5}};st.pages['3.2.3']={completed:true,data:{policy:'alias'}};
 st.assessments['3.2'].attempts=[{score:87.5,at:'2026-11-05'}];
 const restored=normalizeState(JSON.parse(JSON.stringify(st)));
 assert.equal(restored.pages[1].data.score,5);assert.equal(restored.pages['3.2.3'].data.policy,'alias');
 assert.ok(restored.assessments['3.3']);assert.equal(topicUnlocked(restored,'3.3'),true);
 assert.equal(pageUnlocked(restored,'3.3',2),false);
 restored.pages['3.3.1']={completed:true,data:{}};assert.equal(pageUnlocked(restored,'3.3',2),true);
});
test('3.3.1 explorer presents a correctly indented class while preserving four clickable regions',()=>{
 const html=render33Page(1,{},314);
 assert.equal((html.match(/data-action="33-inspect"/g)||[]).length,4);
 assert.match(html,/public class Player \{/);
 assert.match(html,/    private int score;/);
 assert.match(html,/    public Player\(\) \{\n        score = 0;\n    \}/);
 assert.match(html,/    public int getScore\(\) \{\n        return score;\n    \}/);
 assert.match(html,/class="code-tail"><span class="code-line-no">9<\/span><code>}/);
});
test('3.3 transfer instructions are directed to the student without randomization disclosures',()=>{
 const html=render33Page(2,{},314);
 assert.match(html,/Answer every situation correctly/);
 assert.doesNotMatch(html,/order for each student|random order|randomized/);
});
test('3.3 class builder renders adjacent controls and live source preview using current selections',()=>{
 const base=render33Page(4,{},314);
 assert.match(base,/class="build-workbench"/);
 assert.ok(base.indexOf('class="build-controls"')<base.indexOf('class="build-preview"'));
 assert.match(base,/Each selection changes the Java code beside it/);
 const updated=render33Page(4,{build:{header:'correct',tickets:'correct'}},314);
 assert.match(updated,/public class PrizeCard \{/);
 assert.match(updated,/private int tickets;/);
 assert.equal((updated.match(/data-action="33-build"/g)||[]).length,7);
});
