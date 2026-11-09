import test from 'node:test';
import assert from 'node:assert/strict';
import {PAGE34,DEFAULT_FIELDS,QUESTIONS34,WORKSHOP_TESTS,CONSTRUCTOR_CHALLENGES,MULTI_CARDS,COPY_IMPLEMENTATIONS,COPY_PRACTICE} from '../js/content34.js';
import {render34Page,render34Check,inlineCode,practicePosition34,parseFullConstructor,parsePrizeCardConstructor,parseClassConstructor,assembledConstructor,starterClass,runConstructorTests,multiObjectState,runMultiNext,startCopy,mutateCopy,complete34,factoryStep,testDefaultScenario,grade34,answersComplete34,answerCount34} from '../js/topic34.js';
import {stableShuffle,gradedChoiceTargets,placeCorrectOption} from '../js/order.js';

test('2025 CED 3.4 contains five pages covering EK 3.4.A.1-5 and ten original scored questions',()=>{
 assert.equal(PAGE34.length,5);assert.equal(QUESTIONS34.length,10);assert.equal(new Set(QUESTIONS34.map(q=>q.id)).size,10);
 for(let i=1;i<=5;i++)assert.ok(PAGE34.some(p=>p.ek.includes(`3.4.A.${i}`)),`essential knowledge ${i}`);
 for(const q of QUESTIONS34){assert.match(q.objective,/3\.4\.A\./);assert.ok(q.explanation.length>30);if(q.kind==='choice')assert.equal(q.options.length,4);}
 assert.equal(QUESTIONS34.filter(q=>q.kind==='category').length,2);
});

test('object factory animates initialization and reference assignment only after three steps',()=>{
 const d={selected:'a'};assert.equal(factoryStep(d),true);assert.equal(d.phase,1);assert.equal(d.objects,undefined);
 factoryStep(d);assert.equal(d.phase,2);factoryStep(d);assert.equal(d.phase,3);assert.deepEqual(d.objects[0].name,'Alex');
 assert.equal(complete34(1,d),false);d.selected='b';d.phase=0;for(let i=0;i<3;i++)factoryStep(d);
 d.answers={f1:1,f2:2,f3:0};assert.equal(complete34(1,d),true);
});

test('default field values and constructor availability are Java-accurate',()=>{
 assert.deepEqual(DEFAULT_FIELDS.map(f=>f.answer),['0','0.0','false','null']);
 const d={defaults:Object.fromEntries(DEFAULT_FIELDS.map(f=>[f.id,f.answer])),verified:{},answers:{d1:0,d2:2,d3:3}};
 for(const [id,predict] of [['implicit','yes'],['parameter','no'],['explicit','yes']]){d.scenario=id;d.predict=predict;assert.equal(testDefaultScenario(d),true);assert.equal(d.verified[id],true);}
 assert.equal(complete34(2,d),true);
 const html=render34Page(2,{},7);assert.match(html,/Java supplies/);assert.match(html,/private boolean active/);assert.match(html,/Compiler error/);
});

test('full constructor tester validates headers, braces, parameter types, field assignments, and several objects',()=>{
 const good={
  prize:'public PrizeCard(String ownerName, int ticketCount) { tickets = ticketCount; owner = ownerName; }',
  machine:'public ArcadeMachine(String machineName, double factor, boolean enabled) { title = machineName; multiplier = factor; active = enabled; }',
  player:'public Player(String who, int points, int remainingLives) { name = who; score = points; lives = remainingLives; }'
 };
 for(const c of CONSTRUCTOR_CHALLENGES){const result=runConstructorTests(good[c.id],c.id);assert.equal(result.ok,true,`${c.className}: ${result.error}`);assert.equal(result.tests.length,4);assert.ok(result.tests.every(t=>t.pass));}
 assert.equal(runConstructorTests('').ok,false);
 assert.equal(runConstructorTests('owner = ownerName; tickets = ticketCount;').ok,false,'body without header must fail');
 assert.equal(runConstructorTests(good.prize.replace('public PrizeCard','public void PrizeCard')).ok,false,'void is not a constructor');
 assert.equal(runConstructorTests(good.prize.replace('public PrizeCard','public Badge')).ok,false,'wrong constructor name');
 assert.equal(runConstructorTests(good.prize.replace('int ticketCount','double ticketCount')).ok,false,'wrong parameter type');
 assert.equal(runConstructorTests(good.prize.replace('tickets = ticketCount;','tickets = 12;')).ok,false,'hardcoded input fails later tests');
 assert.equal(runConstructorTests(good.prize+' System.exit(0);').ok,false,'no arbitrary code execution');
 assert.equal(runConstructorTests('public PrizeCard(String owner, int tickets) { owner = owner; tickets = tickets; }').ok,false,'shadowed unqualified left-hand sides do not initialize fields');
 assert.equal(runConstructorTests('public PrizeCard(String owner, int tickets) { this.owner = owner; this.tickets = tickets; }').ok,true,'this-qualified assignments correctly resolve shadowing');
 assert.equal(parsePrizeCardConstructor(good.prize).ok,true);
 const html=render34Page(4,{},4);assert.match(html,/Complete the constructor in each class/);assert.match(html,/id="34-constructor-editor"/);assert.match(html,/ArcadeMachine/);assert.match(html,/<textarea[^>]*>public class PrizeCard \{/);assert.doesNotMatch(html,/Live complete class preview/);
});

test('changing constructor assignments changes independent object states, not other objects',()=>{
 const choices={score:'correct',lives:'correct'},d={multi:choices};for(let i=0;i<MULTI_CARDS.length;i++)assert.equal(runMultiNext(d),true);
 assert.equal(d.multiPassed,true);assert.equal(d.multiObjects[0].resultScore,10);assert.equal(d.multiObjects[1].resultScore,25);
 assert.equal(multiObjectState({score:'wrong',lives:'fixed'},MULTI_CARDS[1]).resultScore,0);
 assert.equal(multiObjectState({score:'wrong',lives:'fixed'},MULTI_CARDS[1]).resultLives,3);
 d.answers={m1:2,m2:0,m3:3};assert.equal(complete34(3,d),true);
});

test('all three defensive copying implementations must be tested in both directions for credit',()=>{
 const d={copyMode:'alias',explored:[]};startCopy(d);mutateCopy(d,'original');assert.deepEqual([d.copyRun.original,d.copyRun.stored],[130,130]);mutateCopy(d,'card');assert.deepEqual([d.copyRun.original,d.copyRun.stored],[120,120]);
 d.copyMode='copy';startCopy(d);mutateCopy(d,'original');assert.deepEqual([d.copyRun.original,d.copyRun.stored],[130,100]);mutateCopy(d,'card');assert.deepEqual([d.copyRun.original,d.copyRun.stored],[130,90]);
 d.answers=Object.fromEntries(COPY_PRACTICE.map(x=>[x.id,x.answer]));d.reflection='Creating a new TicketBalance object protects the card from changes to the original mutable object.';
 assert.equal(complete34(5,d),false,'cannot skip third implementation');
 d.copyMode='local';startCopy(d);mutateCopy(d,'original');assert.equal(d.copyRun.stored,130,'renaming reference does not create a copy');mutateCopy(d,'card');
 assert.equal(complete34(5,d),true);
 for(const variant of COPY_IMPLEMENTATIONS){assert.ok(d.copyRuns[variant.id].steps.length===2);}
 const page=render34Page(5,d,22);assert.match(page,/Unexpected state change/);assert.match(page,/3\/3 implementations fully explored/);
});

test('source code formatting and inline backtick code display are consistent',()=>{
 for(const page of [1,3,4,5]){const html=render34Page(page,{},11);assert.doesNotMatch(html,/public (?:Player|PrizeCard)\(\n/);}
 assert.match(inlineCode('Call `new Player(3)` safely'),/<code>new Player\(3\)<\/code>/);
 assert.match(render34Page(1,{},11),/<code>new Player\(&quot;Alex&quot;, 10\)<\/code>/);
 assert.match(render34Check({draft:{}},11,false),/<code>Player<\/code>/);
 const q4=QUESTIONS34.find(q=>q.id==='u34q4');assert.deepEqual(q4.items.at(-1),['ArcadeMachine','null']);
});

test('practice correct answer positions are balanced and reproducible for every student seed',()=>{
 const counts=[3,3,3,2,3];
 for(let seed=0;seed<50;seed++){
  const positions=counts.flatMap((c,i)=>Array.from({length:c},(_,j)=>practicePosition34(i+1,j,seed)));
  assert.equal(new Set(positions).size,4);
  const hist=Array.from({length:4},(_,i)=>positions.filter(v=>v===i).length);
  assert.ok(Math.max(...hist)-Math.min(...hist)<=1,`seed ${seed} ${hist}`);
  assert.deepEqual(positions,counts.flatMap((c,i)=>Array.from({length:c},(_,j)=>practicePosition34(i+1,j,seed))));
 }
});

test('3.4 graded check uses stable balanced answer ordering and 80% threshold',()=>{
 const choices=QUESTIONS34.filter(q=>q.kind==='choice'),targets=gradedChoiceTargets(404,choices.length);
 assert.ok(new Set(targets).size===4);assert.ok(targets.every((v,i)=>i<2||v!==targets[i-1]||v!==targets[i-2]));
 for(let i=0;i<choices.length;i++){const o=placeCorrectOption(choices[i].options,choices[i].answer,targets[i],404,choices[i].id);assert.equal(o[targets[i]].index,choices[i].answer);}
 const a={draft:{}};for(const [i,q] of QUESTIONS34.entries()){
  if(q.kind==='choice')a.draft[q.id]=i<2?(q.answer+1)%4:q.answer;
  else a.draft[q.id]=Object.fromEntries(q.items.map(([,answer],j)=>[j,answer]));
 }
 assert.equal(answerCount34(a),10);assert.equal(answersComplete34(a),true);
 const result=grade34(a);assert.equal(result.score,80);assert.equal(Object.keys(result.points).length,10);assert.equal(result.questions.length,10);
 const html=render34Check(a,77,false);assert.match(html,/10 of 10 answered/);assert.match(html,/QUESTION 10 OF 10/);
 assert.deepEqual(stableShuffle(choices,15,'same'),stableShuffle(choices,15,'same'));
});


test('single-editor class scaffold contains only the given header and private fields, not a solution',()=>{
 for(const spec of CONSTRUCTOR_CHALLENGES){
  const starter=starterClass(spec.id);
  assert.match(starter,new RegExp(`^public class ${spec.className} \\{`));
  for(const [type,name] of spec.fields)assert.ok(starter.includes(`private ${type} ${name};`));
  assert.ok(!starter.includes(`public ${spec.className}(`));
  const page=render34Page(4,{workshopSelected:spec.id},77);
  assert.match(page,/Java class editor/);
  assert.match(page,new RegExp(`public class ${spec.className} \\{`));
  assert.equal((page.match(/<textarea id="34-constructor-editor"/g)||[]).length,1);
  assert.doesNotMatch(page,/34-code-preview/);
  assert.equal(runConstructorTests(starter,spec.id,{requireClass:true}).ok,false);
 }
});

test('single-editor tests validate the complete class, provided declarations, and constructor',()=>{
 const constructor='public PrizeCard(String newOwner, int initialTickets) { owner = newOwner; tickets = initialTickets; }';
 const whole=assembledConstructor(constructor,'prize');
 assert.equal(parseClassConstructor(whole,'prize').ok,true);
 assert.equal(runConstructorTests(whole,'prize',{requireClass:true}).ok,true);
 assert.equal(runConstructorTests(constructor,'prize',{requireClass:true}).ok,false);
 assert.equal(runConstructorTests(whole.replace('private int tickets;','public int tickets;'),'prize',{requireClass:true}).ok,false);
 assert.equal(runConstructorTests(whole.replace('private int tickets;','private double tickets;'),'prize',{requireClass:true}).ok,false);
 assert.equal(runConstructorTests(whole.replace('public class PrizeCard','public class Badge'),'prize',{requireClass:true}).ok,false);
 assert.equal(runConstructorTests(whole.replace('tickets = initialTickets;','tickets = 999;'),'prize',{requireClass:true}).ok,false);
 assert.equal(assembledConstructor(whole,'prize'),whole,'full class must not be wrapped twice');
 assert.match(assembledConstructor(constructor,'prize'),/public class PrizeCard/,'old saved constructor declarations are wrapped');
});
