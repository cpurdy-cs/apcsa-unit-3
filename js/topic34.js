import {PAGE34,FACTORY_CALLS,FACTORY_PRACTICE,DEFAULT_FIELDS,DEFAULT_SCENARIOS,DEFAULT_PRACTICE,WORKSHOP_TESTS,CONSTRUCTOR_CHALLENGES,WORKSHOP_PRACTICE,MULTI_CARDS,MULTI_SLOTS,MULTI_PRACTICE,COPY_IMPLEMENTATIONS,COPY_PRACTICE,QUESTIONS34} from './content34.js';
import {stableShuffle,shuffledOptions,gradedChoiceTargets,placeCorrectOption} from './order.js';

const e=x=>String(x??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
// Safely display question backticks as inline code without enabling arbitrary HTML.
export const inlineCode=x=>e(x).replace(/`([^`]+)`/g,(_,v)=>`<code>${v}</code>`);
export const page34Id=n=>`3.4.${n}`;
const qsByPage={1:FACTORY_PRACTICE,2:DEFAULT_PRACTICE,3:MULTI_PRACTICE,4:WORKSHOP_PRACTICE,5:COPY_PRACTICE};
const practiced=(n,d)=>qsByPage[n].every(q=>d.answers?.[q.id]===q.answer);
export function complete34(n,d){
 if(n===1)return (new Set((d.objects||[]).map(x=>x.id))).size>=2&&practiced(n,d);
 if(n===2)return DEFAULT_FIELDS.every(f=>d.defaults?.[f.id]===f.answer)&&DEFAULT_SCENARIOS.every(s=>d.verified?.[s.id]===true)&&practiced(n,d);
 if(n===3)return d.multiPassed===true&&practiced(n,d);
 if(n===4)return CONSTRUCTOR_CHALLENGES.every(x=>d.workshopPasses?.[x.id]===true)&&practiced(n,d);
 if(n===5)return COPY_IMPLEMENTATIONS.every(mode=>['original','card'].every(src=>(d.explored||[]).includes(mode.id+'-'+src)))&&d.copyRuns?.copy?.steps?.length>=2&&practiced(n,d)&&String(d.reflection||'').trim().length>=50;
 return false;
}
export function factoryStep(d){const c=FACTORY_CALLS.find(x=>x.id===d.selected);if(!c)return false;
 d.phase=(Number(d.phase)||0)+1;
 if(d.phase>3)d.phase=1;
 if(d.phase===3){d.objects??=[];d.objects.push({...c,oid:d.objects.length+1});d.objects=d.objects.slice(-8);}
 return true;
}
export function testDefaultScenario(d){const s=DEFAULT_SCENARIOS.find(x=>x.id===d.scenario);if(!s)return false;
 if(!['yes','no'].includes(d.predict))return false;
 d.verified??={};d.verified[s.id]=(d.predict==='yes')===s.compiles;
 d.outcome={scenario:s.id,prediction:d.predict,correct:d.verified[s.id]};return true;
}
// Deterministic, deliberately restricted Java constructor evaluator. No eval/Function.
// Parses full constructor signatures and direct assignments; this is NOT a Java compiler.
const identifier=/^[A-Za-z_$][\w$]*$/;
const TYPES=new Set(['String','int','double','boolean']);
const getChallenge=id=>CONSTRUCTOR_CHALLENGES.find(c=>c.id===id);
const stripComments=src=>String(src||'').replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/[^\n\r]*/g,'').trim();
export function parseFullConstructor(source,id='prize'){
 const spec=getChallenge(id);if(!spec)return {ok:false,error:'Unknown constructor exercise.'};
 const input=stripComments(source);
 if(!input)return {ok:false,error:'Write the entire public constructor, beginning with its header and ending with its closing brace.'};
 const match=/^public\s+([A-Za-z_$][\w$]*)\s*\(([^()]*)\)\s*\{([\s\S]*)\}$/.exec(input);
 if(!match)return {ok:false,error:`Use the form public ${spec.className}(parameters) { ... }. The constructor has no return type and needs matching braces.`};
 if(match[1]!==spec.className)return {ok:false,error:`The constructor must be named ${spec.className}, exactly matching the class name.`};
 const rawParams=match[2].trim()?match[2].split(',').map(x=>x.trim()):[];
 if(rawParams.length!==spec.paramTypes.length)return {ok:false,error:`This constructor needs ${spec.paramTypes.length} parameters, in the stated type order.`};
 const params=[];
 for(let i=0;i<rawParams.length;i++){
  const pm=/^(String|int|double|boolean)\s+([A-Za-z_$][\w$]*)$/.exec(rawParams[i]);
  if(!pm||pm[1]!==spec.paramTypes[i])return {ok:false,error:`Parameter ${i+1} needs type ${spec.paramTypes[i]} and a valid variable name.`};
  if(params.some(x=>x.name===pm[2]))return {ok:false,error:'Each parameter must have a different name.'};
  params.push({type:pm[1],name:pm[2]});
 }
 const assignments={};const statements=match[3].trim();
 if(!statements)return {ok:false,error:'Add assignments inside the constructor body to initialize each field.'};
 const pieces=statements.split(';');if(pieces.at(-1)?.trim()!=='')return {ok:false,error:'Each assignment must end with a semicolon.'};
 pieces.pop();
 if(pieces.length!==spec.fields.length)return {ok:false,error:`Initialize all ${spec.fields.length} fields with one assignment each.`};
 for(const part of pieces){
  const m=/^\s*(this\.)?([A-Za-z_$][\w$]*)\s*=\s*([A-Za-z_$][\w$]*|"[^"\n]*"|-?\d+(?:\.\d+)?|true|false)\s*$/.exec(part);
  if(!m)return {ok:false,error:`Unsupported statement: ${part.trim()}. Use simple field assignments such as owner = newOwner;`};
  const [,qualified,field,rawValue]=m;
  if(!spec.fields.some(x=>x[1]===field))return {ok:false,error:`${field} is not an instance field in ${spec.className}.`};
  if(!qualified&&params.some(p=>p.name===field))return {ok:false,error:`${field} is also a parameter name. Unqualified ${field} = ... would assign the parameter, not the instance field. Use a different parameter name or this.${field}.`};
  if(Object.hasOwn(assignments,field))return {ok:false,error:`You assigned ${field} more than once.`};
  const expectedType=spec.fields.find(x=>x[1]===field)[0],par=params.find(x=>x.name===rawValue);
  const isLiteral=(expectedType==='String'&&/^"[^"\n]*"$/.test(rawValue)) || (expectedType==='int'&&/^-?\d+$/.test(rawValue)) || (expectedType==='double'&&/^-?\d+(?:\.\d+)?$/.test(rawValue)) || (expectedType==='boolean'&&['true','false'].includes(rawValue));
  if(!isLiteral&&(!par||par.type!==expectedType))return {ok:false,error:`${field} is ${expectedType}; assign a matching parameter or literal.`};
  assignments[field]=rawValue;
 }
 return {ok:true,params,assignments,spec};
}
export const parsePrizeCardConstructor=source=>parseFullConstructor(source,'prize');

// Full-file validation for the single-editor workshop. The original constructor
// parser remains available for legacy saved attempts and older exercise tests.
export function parseClassConstructor(source,id='prize'){
 const spec=getChallenge(id);if(!spec)return {ok:false,error:'Unknown class exercise.'};
 const full=stripComments(source);
 const match=/^public\s+class\s+([A-Za-z_$][\w$]*)\s*\{([\s\S]*)\}$/.exec(full);
 if(!match)return {ok:false,error:`Keep the complete public class declaration: public class ${spec.className} { ... }.`};
 if(match[1]!==spec.className)return {ok:false,error:`This exercise requires a public class named ${spec.className}.`};
 const found=[];
 const remaining=match[2].replace(/\bprivate\s+(String|int|double|boolean)\s+([A-Za-z_$][\w$]*)\s*;/g,(_,type,name)=>{
  found.push([type,name]);return ' ';
 });
 const required=spec.fields;
 if(found.length!==required.length||required.some(([type,name])=>found.filter(([t,n])=>t===type&&n===name).length!==1)){
  return {ok:false,error:`Keep the given private instance variables in ${spec.className}. The constructor is the only part you need to write.`};
 }
 return parseFullConstructor(remaining.trim(),id);
}

export function starterClass(id='prize'){
 const spec=getChallenge(id)||getChallenge('prize');
 const fields=spec.fields.map(([type,name])=>`    private ${type} ${name};`).join('\n');
 return `public class ${spec.className} {\n${fields}\n\n    // Write your constructor here.\n\n}`;
}

// v1.9 stored only a constructor declaration. Displaying a complete class in
// v2.0 wraps those old answers without discarding a student's code or results.
export function assembledConstructor(source,id='prize'){
 const raw=String(source||'');
 if(!raw.trim())return starterClass(id);
 if(/^\s*public\s+class\b/.test(raw))return raw;
 const spec=getChallenge(id)||getChallenge('prize');
 const fields=spec.fields.map(([type,name])=>`    private ${type} ${name};`).join('\n');
 return `public class ${spec.className} {\n${fields}\n\n${raw.trim().split('\n').map(line=>'    '+line).join('\n')}\n}`;
}
export const assembledPrizeCard=source=>assembledConstructor(source,'prize');

export function runConstructorTests(source,id='prize',opts={}){
 const raw=String(source||'');
 const full=/^\s*public\s+class\b/.test(raw);
 if(opts.requireClass&&!full)return {ok:false,error:'Write your constructor inside the provided complete class, including its class header and private fields.',tests:[]};
 const parsed=full?parseClassConstructor(raw,id):parseFullConstructor(raw,id);
 if(!parsed.ok)return {...parsed,tests:[]};
 const {spec,params,assignments}=parsed;
 const tests=spec.tests.map(t=>{
  const context=Object.fromEntries(params.map((par,i)=>[par.name,t.args[i]]));
  const actual={};for(const [type,field] of spec.fields){const val=assignments[field];actual[field]=Object.hasOwn(context,val)?context[val]:type==='String'?val.slice(1,-1):type==='boolean'?(val==='true'):Number(val);}
  const expected=Object.fromEntries(spec.fields.map(([type,field],i)=>[field,t.args[i]]));
  const pass=spec.fields.every(([,field])=>actual[field]===expected[field]);
  return {name:t.name,args:JSON.stringify(t.args),actual,expected,pass};
 });
 const ok=tests.every(x=>x.pass);
 return {ok,parsed:true,tests,error:ok?null:'The class and constructor are valid for this exercise, but one or more objects have incorrect starting values. Use the constructor parameters rather than fixed values.'};
}
export function multiObjectState(choice,card){const score=choice?.score==='correct'?card.score:choice?.score==='other'?card.lives:0;
 const lives=choice?.lives==='correct'?card.lives:choice?.lives==='other'?card.score:choice?.lives==='fixed'?3:0;
 return {...card,resultScore:score,resultLives:lives};
}
export function multiSource(choice={}){const line=slot=>MULTI_SLOTS.find(s=>s.id===slot)?.choices.find(c=>c.id===choice[slot])?.text||'// Choose an assignment';
 return `public class Player {\n    private String name;\n    private int score;\n    private int lives;\n\n    public Player(String newName, int startingScore, int startingLives) {\n        name = newName;\n        ${line('score')}\n        ${line('lives')}\n    }\n}`;
}
export function runMultiNext(d){if(!d.multi?.score||!d.multi?.lives)return false;
 d.multiObjects??=[];if(d.multiObjects.length>=MULTI_CARDS.length)d.multiObjects=[];
 d.multiObjects.push(multiObjectState(d.multi,MULTI_CARDS[d.multiObjects.length]));
 d.multiPassed=d.multiObjects.length===MULTI_CARDS.length&&d.multi.score==='correct'&&d.multi.lives==='correct';return true;
}
export function startCopy(d){const mode=COPY_IMPLEMENTATIONS.find(x=>x.id===d.copyMode);if(!mode)return false;
 d.copyRun={mode:mode.id,original:100,stored:100,steps:[]};d.copyRuns??={};d.copyRuns[mode.id]={mode:mode.id,original:100,stored:100,steps:[]};return true;
}
export function mutateCopy(d,source){const r=d.copyRun;if(!r||!['original','card'].includes(source))return false;
 const shared=r.mode!=='copy',delta=source==='original'?30:-10;
 if(shared){r.original+=delta;r.stored+=delta;}
 else if(source==='original')r.original+=delta;else r.stored+=delta;
 r.steps.push({source,delta,original:r.original,stored:r.stored});
 const tag=r.mode+'-'+source;
 d.explored??=[];if(!d.explored.includes(tag))d.explored.push(tag);
 d.lastVerifiedMode=r.mode==='copy'?'copy':null;d.copyRuns??={};d.copyRuns[r.mode]=structuredClone(r);
 return true;
}
export function answerCount34(a){return QUESTIONS34.filter(q=>q.kind==='choice'?a.draft?.[q.id]!==undefined:q.items.every((_,i)=>!!a.draft?.[q.id]?.[i])).length;}
export const answersComplete34=a=>answerCount34(a)===QUESTIONS34.length;
export function grade34(a){let score=0;const answers={},points={};for(const q of QUESTIONS34){let v=a.draft?.[q.id],ok=false;
 if(q.kind==='choice'){v=Number(v);ok=v===q.answer;}
 else {v=Object.fromEntries(q.items.map((_,i)=>[i,a.draft?.[q.id]?.[i]]));ok=q.items.every(([,correct],i)=>v[i]===correct);}
 answers[q.id]=v;points[q.id]=ok?10:0;if(ok)score+=10;
 }
 return {at:new Date().toISOString(),score,answers,points,questionBank:'2025-U3.4-v2',questions:QUESTIONS34.map(q=>({...q}))};
}
export function practicePosition34(page,index,seed){
 const order=stableShuffle([0,1,2,3],seed,'34-practice-balanced-positions');
 const offset=Object.entries(qsByPage).filter(([n])=>Number(n)<page).reduce((sum,[,items])=>sum+items.length,0);
 return order[(offset+index)%4];
}
function practice(n,d,seed){const qs=stableShuffle(qsByPage[n],seed,`34-practice-order-${n}`);
 return `<section class="panel"><p class="exercise-tag">Transfer practice · Unlimited attempts</p><h2>Apply what you learned</h2><p class="helper">Answer each situation correctly to finish the lesson. You can try again and use the feedback as often as needed.</p>
 ${qs.map((q,i)=>{const val=d.answers?.[q.id],correct=val===q.answer;return `<div class="challenge-card"><div class="q-meta">SITUATION ${i+1} OF ${qs.length}</div><h3>${inlineCode(q.prompt)}</h3><div class="q-options">${placeCorrectOption(q.options,q.answer,practicePosition34(n,i,seed),seed,`34-pr-${q.id}`).map(opt=>`<label class="q-option"><input type="radio" name="34-pr-${q.id}" data-action="34-practice" data-page="${n}" data-id="${q.id}" value="${opt.index}" ${val===opt.index?'checked':''}><span>${inlineCode(opt.text)}</span></label>`).join('')}</div>${val!==undefined?`<div class="feedback ${correct?'good':'bad'}" role="status">${correct?'✓ Correct.':'Not quite. Try another answer.'} ${inlineCode(q.hint)}</div>`:''}</div>`;}).join('')}</section>`;
}
function code(title,source,extra=''){return `<div class="code-stage ${extra}"><div class="code-bar">${e(title)}<span>Java example</span></div><pre class="code-main reliability-code">${e(source)}</pre></div>`;}
const FACTORY_CLASS=`public class Player {\n    private String name;\n    private int score;\n\n    public Player(String playerName, int startingScore) {\n        name = playerName;\n        score = startingScore;\n    }\n}`;
function pageOne(d,seed){const c=FACTORY_CALLS.find(x=>x.id===d.selected),phase=Number(d.phase)||0,objects=d.objects||[],stages=['Choose a construction statement','Allocate space and supply field defaults','Run the constructor and assign fields','Store the new object reference in the variable'];
 const current=c&&phase>0?{variable:c.variable,name:phase===1?'null':c.name,score:phase===1?0:c.score,oid:objects.length+1}:null;
 return `<section class="panel"><p class="kicker">Explore · Object creation</p><h2>What happens when a constructor runs?</h2><p>Each <code>new Player(...)</code> creates another object. Use the step control to inspect how Java allocates the object, runs its constructor, and then stores the object reference in the variable.</p>
 <div class="two-cols"><div>${code('Player.java',FACTORY_CLASS)}</div><div><label class="field"><span>Choose a statement</span><select data-action="34-factory-select" id="34-factory-select"><option value="">Choose a construction statement…</option>${stableShuffle(FACTORY_CALLS,seed,'34-factory-calls').map(x=>`<option value="${x.id}" ${d.selected===x.id?'selected':''}>Player ${x.variable} = new Player("${e(x.name)}", ${x.score});</option>`).join('')}</select></label>
 ${code('Runner.java',c?`Player ${c.variable} = new Player("${c.name}", ${c.score});`:'// Choose a statement above to begin')}
 <div class="btn-row" style="margin-top:13px"><button class="btn" data-action="34-factory-step" ${c&&phase<3?'':'disabled'}>▶ Next step ${phase?`(${phase}/3)`:''}</button><button class="btn secondary" data-action="34-factory-reset" ${c?'':'disabled'}>Reset steps</button></div>
 <div class="feedback ${phase===3?'good':''}" role="status"><strong>Step ${phase} of 3:</strong> ${e(stages[phase])}</div></div></div>
 <div class="object-bench"><div class="object-bench-title"><strong>Object memory</strong><span class="pill">${objects.length} creation${objects.length===1?'':'s'} recorded</span></div>
 <div class="34-memory-grid memory-card-grid">${objects.slice(-4).map(o=>`<div class="memory-object"><span class="object-ref">${e(o.variable)} → Player #${o.oid}</span><strong>name = "${e(o.name)}"</strong><span>score = ${o.score}</span></div>`).join('')}${current&&phase<3?`<div class="memory-object pending"><span class="object-ref">New Player #${current.oid} (reference not yet stored)</span><strong>name = ${current.name==='null'?'null':`"${e(current.name)}"`}</strong><span>score = ${current.score}</span></div>`:''}${!objects.length&&!current?'<div class="empty-note">No objects created yet. Choose a statement and step through it.</div>':''}</div></div>
 <p class="helper">For each new object, Java initially supplies field defaults, then your constructor assigns its starting state. The variable receives a reference to that object when the construction expression finishes. Create at least two different Players.</p></section>${practice(1,d,seed)}`;
}
function pageTwo(d,seed){const selected=DEFAULT_SCENARIOS.find(s=>s.id===d.scenario),correct=DEFAULT_FIELDS.filter(f=>d.defaults?.[f.id]===f.answer).length;return `<section class="panel"><p class="kicker">Investigate · Default instance values</p><h2>The default constructor mystery</h2><p>What happens if the class defines instance variables but <strong>no constructor</strong>? Predict the starting state of a newly created ArcadeMachine.</p>
 ${code('ArcadeMachine.java',DEFAULT_SCENARIOS[0].code)}
 <div class="build-grid">${stableShuffle(DEFAULT_FIELDS,seed,'34-fields').map(f=>`<div class="build-slot"><label for="34-default-${f.id}"><strong>${e(f.type)} ${e(f.name)}</strong></label><select id="34-default-${f.id}" data-action="34-default" data-id="${f.id}"><option value="">Predict its default…</option>${stableShuffle(['0','0.0','false','null','""','true'],seed,`34-default-opt-${f.id}`).map(v=>`<option value="${e(v)}" ${d.defaults?.[f.id]===v?'selected':''}>${e(v)}</option>`).join('')}</select>${d.defaults?.[f.id]!==undefined?`<div class="fineprint ${d.defaults[f.id]===f.answer?'build-ok':'build-err'}">${d.defaults[f.id]===f.answer?'✓ Correct Java field default':'Try again. Think about the field’s type.'}</div>`:''}</div>`).join('')}</div>
 <div class="feedback ${correct===4?'good':''}" role="status">${correct}/4 default field values correct. Remember these are <strong>instance fields</strong>, not uninitialized local variables.</div></section>
 <section class="panel"><p class="kicker">Experiment · Constructor availability</p><h2>Will <code>new ArcadeMachine()</code> compile?</h2><p>Select each class version, make a prediction, then run a constructor-availability check. The check changes the Java example and explains the result.</p>
 <div class="build-workbench"><div class="build-controls"><label class="field"><span>Class version</span><select id="34-scenario" data-action="34-scenario"><option value="">Choose a class version…</option>${stableShuffle(DEFAULT_SCENARIOS,seed,'34-default-scenarios').map(s=>`<option value="${s.id}" ${d.scenario===s.id?'selected':''}>${e(s.label)}</option>`).join('')}</select></label>
 <label class="field"><span>Predict the result of the construction call</span><select data-action="34-predict" ${selected?'':'disabled'}><option value="">Make your prediction…</option><option value="yes" ${d.predict==='yes'?'selected':''}>Compiles</option><option value="no" ${d.predict==='no'?'selected':''}>Compiler error</option></select></label>
 <button class="btn" data-action="34-default-run" ${selected&&d.predict?'':'disabled'}>▶ Check construction</button><p class="helper">Investigate all three class versions. A correct prediction is required for each.</p>
 <div class="mini-progress">Correct runs: ${DEFAULT_SCENARIOS.filter(s=>d.verified?.[s.id]).length} of 3</div></div>
 <div class="build-preview">${code('ArcadeMachine.java',selected?.code||'// Choose a class version to display its code')}${code('Runner.java',selected?.call||'// Constructor call will appear here')}
 ${d.outcome?.scenario===selected?.id&&selected?`<div class="feedback ${d.outcome.correct?'good':'bad'}" role="status"><strong>${selected.compiles?'✓ Compiles':'✕ Compiler error'}.</strong> ${e(selected.note)} ${d.outcome.correct?'Your prediction was correct.':'Your prediction needs revision; try the scenario again.'}</div>`:''}</div></div></section>${practice(2,d,seed)}`;}
function pageThree(d,seed){const picks=d.multi||{},objects=d.multiObjects||[];return `<section class="panel"><p class="kicker">Code laboratory · Independent state</p><h2>Why do different Players start differently?</h2><p>The Player constructor takes a name, starting score, and starting lives. Two of its assignments are unfinished. Choose each statement, see the live class change, and run the three construction calls <strong>one at a time</strong>. You can test wrong code to discover the problem.</p>
 <div class="build-workbench"><div class="build-controls"><h3>Repair the two constructor assignments</h3><div class="build-grid">${MULTI_SLOTS.map(s=>`<div class="build-slot"><label for="34-multi-${s.id}"><strong>${e(s.label)}</strong></label><select data-action="34-multi-pick" data-id="${s.id}" id="34-multi-${s.id}"><option value="">Choose Java statement…</option>${stableShuffle(s.choices,seed,`34-multi-${s.id}`).map(c=>`<option value="${c.id}" ${picks[s.id]===c.id?'selected':''}>${e(c.text)}</option>`).join('')}</select></div>`).join('')}</div>
 <button class="btn" data-action="34-multi-next" ${picks.score&&picks.lives&&objects.length<3?'':'disabled'}>▶ ${objects.length<3?`Run construction ${objects.length+1} of 3`:'All three executed'}</button>
 ${objects.length===3?`<div class="feedback ${d.multiPassed?'good':'bad'}" role="status">${d.multiPassed?'✓ The constructor initializes both fields from their arguments for all three objects.':'The objects were created, but some fields do not match the arguments. Select different assignments and rerun from the beginning.'}</div>`:''}
 <p class="helper">Changing an assignment starts a fresh simulation run. The original Java object states are not retroactively rewritten when code is edited.</p></div>
 <div class="build-preview">${code('Player.java',multiSource(picks))}${code('Runner.java',MULTI_CARDS.map(c=>`Player ${c.variable} = new Player("${c.name}", ${c.score}, ${c.lives});`).join('\n'))}</div></div>
 <div class="object-bench"><div class="object-bench-title"><strong>Results after running from the start</strong><span class="pill">${objects.length}/3 objects created</span></div><div class="memory-card-grid">${objects.map(o=>`<div class="memory-object"><span class="object-ref">${o.variable} → Player object</span><strong>name = "${e(o.name)}"</strong><span>score = <strong>${o.resultScore}</strong> ${o.resultScore===o.score?'✓':'(expected '+o.score+')'}</span><span>lives = <strong>${o.resultLives}</strong> ${o.resultLives===o.lives?'✓':'(expected '+o.lives+')'}</span></div>`).join('')}${!objects.length?'<div class="empty-note">Choose two assignments and run the code to create the first object.</div>':''}</div></div></section>${practice(3,d,seed)}`;}
function pageFour(d,seed){
 const current=CONSTRUCTOR_CHALLENGES.find(x=>x.id===d.workshopSelected)||CONSTRUCTOR_CHALLENGES[0];
 const attempts=d.workshop||{},source=attempts[current.id]?.code||'',res=attempts[current.id]?.result;
 const passed=CONSTRUCTOR_CHALLENGES.filter(x=>d.workshopPasses?.[x.id]).length;
 return `<section class="panel"><p class="kicker">Independent coding · Complete constructors</p><h2>Complete the constructor in each class</h2><p>You have already built constructor assignments with dropdowns. Now work inside a <strong>complete Java class</strong>: the public class declaration and private instance variables are provided. Add the <strong>entire public constructor</strong>, including its header, parameters, braces, and field assignments. Complete all three classes and pass their tests.</p>
 <div class="callout maroon">Write your constructor where the comment appears <strong>inside the class</strong>. Keep the provided class name and instance variables. Use the parameter types shown below, in order; choose your own parameter names. This workshop checks constructor headers and simple field assignments, not unrestricted Java.</div>
 <div class="ctor-challenge-tabs" role="group" aria-label="Choose constructor challenge">${CONSTRUCTOR_CHALLENGES.map((x,i)=>`<button class="ctor-challenge-tab ${current.id===x.id?'selected':''} ${d.workshopPasses?.[x.id]?'passed':''}" data-action="34-workshop-select" data-id="${x.id}">${d.workshopPasses?.[x.id]?'✓':i+1}. ${x.className}</button>`).join('')}</div>
 <div class="ctor-workbench"><div class="build-controls"><div class="spaced"><h3>${e(current.className)}.java</h3><span class="pill">${passed} of 3 passed</span></div><p class="helper">${e(current.description)}</p>
 <p class="fineprint"><strong>Parameter types:</strong> ${e(current.paramTypes.join(', '))}. <strong>Instance variables:</strong> ${current.fields.map(([type,name])=>`<code>${e(type)} ${e(name)}</code>`).join(', ')}.</p>
 <label class="field" for="34-constructor-editor"><span><strong>Java class editor</strong></span><textarea id="34-constructor-editor" class="code-input ctor-editor" rows="16" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-describedby="34-editor-help">${e(assembledConstructor(source,current.id))}</textarea></label><p class="fineprint" id="34-editor-help">Tab indents · Shift+Tab outdents · Enter auto-indents after { · Escape, then Tab moves to the next control.</p>
 <div class="btn-row"><button class="btn" data-action="34-workshop-run">▶ Test ${e(current.className)}</button><span class="fineprint" id="34-workshop-save">Your entire class is autosaved. Run the tests when your constructor is ready.</span></div>
 </div></div>
 ${res?`<div class="feedback ${res.ok?'good':'bad'}" role="status"><strong>${res.ok?'✓ All '+res.tests.length+' tests passed.':e(res.error)}</strong></div>`:''}
 ${res?.tests?.length?`<div class="ctor-test-grid">${res.tests.map(t=>`<div class="test-item ${t.pass?'pass':'fail'}"><span>${t.pass?'✓':'✕'}</span><div><strong>${e(t.name)}</strong><div class="fineprint">new ${e(current.className)}(${e(JSON.stringify(JSON.parse(t.args)).slice(1,-1))})</div><div class="fineprint">Actual: ${inlineCode(JSON.stringify(t.actual))}</div><div class="fineprint">Expected: ${inlineCode(JSON.stringify(t.expected))}</div></div><strong>${t.pass?'PASS':'FAIL'}</strong></div>`).join('')}</div>`:''}
 <div class="mini-progress">Constructor progress: ${CONSTRUCTOR_CHALLENGES.map(x=>`<span class="pill ${d.workshopPasses?.[x.id]?'green':''}">${d.workshopPasses?.[x.id]?'✓':'○'} ${x.className}</span>`).join(' ')}</div></section>${practice(4,d,seed)}`;
}
function pageFive(d,seed){
 const chosen=COPY_IMPLEMENTATIONS.find(x=>x.id===d.copyMode),r=d.copyRun;
 const original=r?.original??100,stored=r?.stored??100,shared=r?.mode!=='copy';
 const safe=!!r&&!shared,steps=r?.steps||[],last=steps.at(-1);
 const finished=COPY_IMPLEMENTATIONS.filter(m=>['original','card'].every(src=>(d.explored||[]).includes(m.id+'-'+src))).length;
 const unexpected=last&&(shared); const label=!r?'Not tested':shared?'Same TicketBalance object':'Two independent objects';
 const riskMsg=!r?'Choose an implementation and construct the card to see the reference diagram.':!last?'Now change the original or the card balance; watch both values.':shared?(last.source==='original'?`BUG: The original changed outside PrizeCard, but the card’s private balance also changed to ${stored}. The card did not authorize this change.`:`BUG: The card redeemed tickets, but the original balance also changed to ${original}. The constructor leaked a shared mutable object.`):(last.source==='original'?`PROTECTED: The original changed to ${original}, but PrizeCard still has ${stored}. Its private balance remains independent.`:`PROTECTED: PrizeCard changed to ${stored}, while the outside original remains ${original}.`);
 const preview=`public PrizeCard(TicketBalance incomingBalance) {\n    ${chosen?chosen.line.replaceAll('\n','\n    '):'// Choose an implementation'}\n}`;
 const mutationButtons=`<button class="btn secondary" data-action="34-copy-mutate" data-source="original" ${r?'':'disabled'}>▶ original.addTickets(30)</button><button class="btn secondary" data-action="34-copy-mutate" data-source="card" ${r?'':'disabled'}>▶ card.redeemTickets(10)</button>`;
 return `<section class="panel"><p class="kicker">Experiment · Defensive copying</p><h2>Who controls the card’s tickets?</h2><p>Suppose a PrizeCard is created from an existing mutable TicketBalance. An outside program can change that original balance later. Does the card's private balance change too?</p>
 <div class="callout maroon"><strong>Investigate all three constructor implementations.</strong> For each one, construct the card, change the original and use the card’s method. The card should not change when someone changes only the outside original.</div>
 <div class="copy-workbench"><div class="copy-controls"><label class="field"><span><strong>1. Choose constructor implementation</strong></span><select data-action="34-copy-pick"><option value="">Choose code…</option>${stableShuffle(COPY_IMPLEMENTATIONS,seed,'34-copies').map(x=>`<option value="${x.id}" ${d.copyMode===x.id?'selected':''}>${e(x.label)}</option>`).join('')}</select></label>
 ${code('PrizeCard constructor · live code',preview)}
 <button class="btn" data-action="34-copy-start" ${chosen?'':'disabled'}>▶ Construct card with 100 tickets</button>
 <div class="copy-actions"><strong>2. Run both experiments</strong>${mutationButtons}</div>
 </div><div class="copy-visual" aria-live="polite"><div class="object-bench-title"><strong>3. Watch the references</strong><span class="pill ${safe?'green':unexpected?'maroon':''}">${e(label)}</span></div>
 <div class="copy-memory-layout"><div class="copy-pointer"><strong>Outside variable</strong><span><code>original</code> → <b>Object #1</b></span></div><div class="copy-memory-object" ${r&&last?.source==='original'?'data-changed="true"':''}><span>TicketBalance #1</span><strong>${original} tickets</strong></div>
 <div class="copy-pointer ${r&&shared?'shares':''}"><strong>Inside PrizeCard</strong><span><code>card.balance</code> → <b>${!r?'(not constructed)':`Object #${!shared?2:1}`}</b></span></div>
 ${!r?`<div class="copy-shared-object">Construct the card to see its reference.</div>`:r&&!shared?`<div class="copy-memory-object independent" ${last?.source==='card'?'data-changed="true"':''}><span>TicketBalance #2</span><strong>${stored} tickets</strong></div>`:`<div class="copy-shared-object"><span aria-hidden="true">↖</span> Same object as above: ${stored} tickets</div>`}</div>
 <div class="copy-impact ${unexpected?'danger':safe&&last?'safe':'neutral'}" role="status"><strong>${unexpected?'Unexpected state change!':safe&&last?'Encapsulation preserved':!r?'Ready to investigate':'Watch what changes'}</strong><p>${e(riskMsg)}</p></div>
 </div></div>
 <div class="copy-comparison-progress"><strong>Testing record: ${finished}/3 implementations fully explored</strong><div class="copy-comparison-cards">${COPY_IMPLEMENTATIONS.map(m=>{const outside=d.explored?.includes(m.id+'-original'),inside=d.explored?.includes(m.id+'-card');return `<div class="copy-comparison-card ${outside&&inside?'finished':''}"><strong>${e(m.label)}</strong><div><span class="pill ${outside?'green':''}">${outside?'✓':'○'} Outside change</span><span class="pill ${inside?'green':''}">${inside?'✓':'○'} Card change</span></div><small>${outside&&inside?(m.safe?'Separate copy: safe':'Shared state: unsafe'):'Run both changes to complete'}</small></div>`;}).join('')}</div></div>
 </section>${practice(5,d,seed)}
 <section class="panel"><p class="exercise-tag">Written evidence · Included in PDF</p><h2>Explain the fix</h2><p>Explain why <code>balance = incomingBalance;</code> may be unsafe for a mutable object and why using <code>new TicketBalance(...)</code> changes the outcome.</p><label class="field" for="34-copy-reflection"><span class="small">Your explanation (at least 50 characters)</span><textarea id="34-copy-reflection" rows="4" maxlength="1700" placeholder="The original and stored balance...">${e(d.reflection||'')}</textarea></label><p class="helper" id="34-copy-count">${String(d.reflection||'').trim().length}/50 characters minimum · Autosaved</p></section>`;
}
export function render34Page(n,d,seed){return [pageOne,pageTwo,pageThree,pageFour,pageFive][n-1](d,seed);}
function questionInput(q,a,seed){const ans=a.draft?.[q.id];if(q.kind==='choice'){
 const choiceQs=QUESTIONS34.filter(q=>q.kind==='choice'),idx=choiceQs.findIndex(x=>x.id===q.id),targets=gradedChoiceTargets(seed,choiceQs.length);
 return `<div class="q-options">${placeCorrectOption(q.options,q.answer,targets[idx],seed,`34-grade-${q.id}`).map(o=>`<label class="q-option"><input type="radio" name="34-${q.id}" data-action="34-grade" data-id="${q.id}" value="${o.index}" ${ans===o.index?'checked':''}><span>${inlineCode(o.text)}</span></label>`).join('')}</div>`;
 }
 return `<div class="q-categories">${stableShuffle(q.items.map(([label],index)=>({label,index})),seed,`34-graded-rows-${q.id}`).map(({label,index})=>`<div class="q-subrow"><span><code>${e(label)}</code></span><select data-action="34-grade-cat" data-id="${q.id}" data-index="${index}" aria-label="Select default or resulting value for ${e(label)}"><option value="">Choose…</option>${stableShuffle(q.categories,seed,`34-graded-cats-${q.id}`).map(cat=>`<option value="${e(cat)}" ${ans?.[index]===cat?'selected':''}>${e(cat)}</option>`).join('')}</select></div>`).join('')}</div>`;
}
export function render34Check(a,seed,teacher){const count=answerCount34(a);return `<div class="page-title"><p class="eyebrow">TOPIC 3.4 · GRADED SECTION CHECK</p><h1>Constructors</h1><p class="lead">10 questions · 10 points each · 8 correct to pass. One submitted attempt unless your teacher resets it.</p></div><div class="callout" style="margin-bottom:16px">Your answers autosave. You can review your work before the final submission; afterward the check is locked.</div>
 <section aria-label="Topic 3.4 graded questions">${QUESTIONS34.map((q,i)=>`<div class="assessment-row"><div class="q-meta"><span>QUESTION ${i+1} OF 10</span><span>${e(q.area)}</span><span>${e(q.objective)}</span></div><h3>${inlineCode(q.prompt)}</h3>${questionInput(q,a,seed)}${teacher?`<div class="teacher-answer"><strong>Teacher key:</strong> ${inlineCode(q.kind==='choice'?q.options[q.answer]:q.items.map(([label,val])=>`${label}: ${val}`).join(' | '))}<p>${inlineCode(q.explanation)}</p></div>`:''}</div>`).join('')}</section>
 <div class="assessment-sticky"><div><strong data-role="34-count">${count} of 10 answered</strong><div class="helper" data-role="34-remaining">Autosaved · ${10-count} remaining</div></div><div class="btn-row"><button class="btn secondary" data-nav="#/topic/3.4/page/5">Review lessons</button><button class="btn" data-action="34-review" ${count===10?'':'disabled'}>Review &amp; submit →</button></div></div>`;}
export function render34Results(a,teacher){const last=a.attempts.at(-1);if(!last)return `<div class="panel"><h2>No Topic 3.4 submission yet</h2><button class="btn" data-nav="#/topic/3.4/check">Open check</button></div>`;
 const ok=last.score>=80,qs=last.questions?.length?last.questions:QUESTIONS34;
 return `<div class="page-title"><p class="eyebrow">TOPIC 3.4 · GRADED RESULTS</p><h1>${ok?'Topic 3.4 mastered.':'Review Topic 3.4 with your teacher.'}</h1><p class="lead">${ok?'You passed. Topic 3.5 is planned but is not released yet.':'Your submission is saved. Practice freely and ask your teacher to reset the check if you need another attempt.'}</p></div>
 <div class="panel" style="text-align:center"><div class="score-ring"><div class="scorebig ${ok?'good':''}">${last.score}</div><div class="muted">/100</div></div><div class="spaced" style="justify-content:center;margin:10px 0"><span class="step-badge ${ok?'complete':''}">${ok?'PASS':'BELOW 80%'}</span><span class="pill">${a.attempts.length} attempt(s) recorded</span></div><div class="btn-row" style="justify-content:center"><button class="btn" data-action="pdf-topic" data-topic="3.4">↓ Download 3.4 PDF</button><button class="btn secondary" data-nav="#/topic/3.4/page/1">Review lessons</button></div></div>
 <section class="panel" style="margin-top:16px"><h2>Question-by-question results</h2><p class="helper">Your submitted answers are shown. Teacher preview reveals the key.</p>${qs.map((q,i)=>{const aVal=last.answers?.[q.id],response=q.kind==='choice'?(aVal===undefined?'(No answer)':q.options[aVal]):q.items.map(([label],j)=>`${label}: ${aVal?.[j]||'(blank)'}`).join(' | ');return `<div class="answer-review"><div class="spaced"><strong>Question ${i+1} · ${e(q.area)}</strong><span class="status ${last.points?.[q.id]===10?'good':'bad'}">${last.points?.[q.id]||0}/10</span></div><p>${inlineCode(q.prompt)}</p><p class="helper"><strong>Your response:</strong> ${inlineCode(response)}</p>${teacher?`<div class="teacher-answer"><strong>Key:</strong> ${inlineCode(q.kind==='choice'?q.options[q.answer]:q.items.map(([label,val])=>`${label}: ${val}`).join(' | '))}<p>${inlineCode(q.explanation)}</p></div>`:''}</div>`;}).join('')}</section>${a.attempts.length>1?`<section class="panel" style="margin-top:16px"><h3>Previous submissions</h3>${a.attempts.slice(0,-1).map((x,i)=>`<p class="helper">Attempt ${i+1}: ${x.score}/100</p>`).join('')}</section>`:''}`;}
