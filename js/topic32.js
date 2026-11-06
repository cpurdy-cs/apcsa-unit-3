import {PAGE32,POLICIES,IMPACT_CHALLENGES,RELIABILITY_TESTS,RELIABILITY_FIXES,CODE_ASSETS,ASSET_DECISIONS,ETHICS_CHALLENGES,QUESTIONS32} from './content32.js';
import {stableShuffle,shuffledOptions,gradedChoiceTargets,placeCorrectOption} from './order.js';
const e=x=>String(x??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
export const page32Id=n=>`3.2.${n}`;
export function access32(st,n,teacher=false){
 return teacher || (!!st.assessments?.['3.1']?.attempts?.some(a=>a.score>=80) && (n===1||!!st.pages?.[page32Id(n-1)]?.completed));
}
export const mastered32=st=>PAGE32.every((_,i)=>!!st.pages?.[page32Id(i+1)]?.completed);
export const passed32=st=>(st.assessments?.['3.2']?.attempts||[]).some(a=>a.score>=80);
export function complete32(n,d){
 if(n===1)return POLICIES.every(x=>d.visited?.includes(x.id))&&IMPACT_CHALLENGES.every(q=>d.answers?.[q.id]===q.answer)&&String(d.reflection||'').trim().length>=40;
 if(n===2)return RELIABILITY_TESTS.every(x=>d.before?.[x.id])&&d.fixChoice==='b'&&RELIABILITY_TESTS.every(x=>d.after?.[x.id]?.correct)&&['exact','empty','negative'].every(id=>d.types?.[id]===RELIABILITY_TESTS.find(x=>x.id===id).kind);
 if(n===3)return CODE_ASSETS.every(x=>d.assetAnswers?.[x.id]===x.answer)&&ETHICS_CHALLENGES.every(q=>d.answers?.[q.id]===q.answer)&&String(d.reflection||'').trim().length>=40;
 return false;
}
export function prizeResult(test,repair='a'){
 // Preserve boolean arguments used by saved work and earlier tests.
 const choice=repair===true?'b':repair===false?'a':repair;
 let canBuy=false;
 switch(choice){
  case 'b':canBuy=test.cost>0&&test.stock>0&&test.tickets>=test.cost;break;
  case 'c':canBuy=true;break;
  case 'd':canBuy=test.tickets>test.cost;break;
  default:canBuy=test.tickets>=test.cost;
 }
 const status=canBuy?'Redeemed':'Rejected';
 const tickets=canBuy?test.tickets-test.cost:test.tickets,stock=canBuy?test.stock-1:test.stock;
 const expectedRedeem=test.expect==='Redeemed';
 return {status,tickets,stock,correct:status===test.expect&&tickets===(expectedRedeem?test.tickets-test.cost:test.tickets)&&stock===(expectedRedeem?test.stock-1:test.stock)};
}
function qPractice(items,d,seed,page){
 const ordered=stableShuffle(items,seed,`32-practice-${page}`);
 return `<div class="panel"><p class="exercise-tag">Try another situation · Unlimited practice</p><h2>Apply your reasoning</h2><p class="helper">These scenarios transfer the ideas to other programs. Retry as often as you need.</p>${ordered.map((q,position)=>{
 const selected=d.answers?.[q.id],ok=selected===q.answer;
 return `<div class="challenge-card"><div class="q-meta">SCENARIO ${position+1} OF ${items.length}</div><h3>${e(q.prompt)}</h3><div class="q-options">${shuffledOptions(q.options,seed,`32-choices-${q.id}`).map(opt=>`<label class="q-option"><input type="radio" data-action="32-practice" data-page="${page}" data-id="${q.id}" name="32practice-${q.id}" value="${opt.index}" ${selected===opt.index?'checked':''}><span>${e(opt.text)}</span></label>`).join('')}</div>${selected!==undefined?`<div class="feedback ${ok?'good':'bad'}" role="status">${ok?'✓ Correct.':'Not quite.'} ${e(q.hint)}</div>`:''}</div>`;
 }).join('')}</div>`;
}
function reflection(n,d,question){return `<section class="panel"><p class="exercise-tag">Written reflection · Saved in your report</p><h2>Explain your decision</h2><p>${e(question)}</p><label class="field" for="reflection32"><span class="small" style="font-weight:800">Your explanation</span><textarea id="reflection32" data-page="${n}" rows="4" maxlength="1500" placeholder="Explain the benefit, the risk, and what you would do…">${e(d.reflection||'')}</textarea></label><p class="helper" id="reflection32-count">${String(d.reflection||'').trim().length}/40 minimum characters · Saved as you type</p></section>`;}
function page32One(d,seed){const selected=POLICIES.find(p=>p.id===d.policy)||null;const visited=d.visited||[];
 return `<section class="panel"><p class="kicker">Design lab · The arcade leaderboard</p><h2>It works. But is it a good design?</h2>
 <p>Your arcade's leaderboard is supposed to <strong>encourage participation</strong>. It works technically, but a display that students did not expect may embarrass them or reveal identifying information. A program can benefit some people and harm others, including in ways its developer did not intend.</p>
 <p class="helper"><strong>Experiment:</strong> Compare all three policies. Select each to see the leaderboard and consider what each design gains and gives up.</p>
 <div class="policy-grid">${stableShuffle(POLICIES,seed,'32-policy-order').map(p=>`<button type="button" class="policy-choice ${selected?.id===p.id?'selected':''}" data-action="32-policy" data-id="${p.id}" aria-pressed="${selected?.id===p.id}"><strong>${e(p.label)}</strong><span>${visited.includes(p.id)?'✓ Explored':'Explore design →'}</span></button>`).join('')}</div>
 <div class="policy-preview"><div class="policy-board"><div class="policy-board-title">ARCADE TOP SCORES</div>${selected?selected.preview.map((line,i)=>`<div class="board-line"><span>${i+1}.</span><span>${e(line)}</span></div>`).join(''):'<div class="board-placeholder">Select a policy above to preview its leaderboard.</div>'}</div><div class="policy-explanation">${selected?`<h3>${e(selected.label)}</h3><p><strong>Potential benefit:</strong> ${e(selected.benefit)}</p><p><strong>Possible harm or tradeoff:</strong> ${e(selected.risk)}</p><p><strong>Possible improvement:</strong> ${e(selected.mitigation)}</p>`:'<h3>No policy selected</h3><p>Explore each design to compare its effects on players, participation, and privacy.</p>'}</div></div>
 <div class="feedback ${visited.length===3?'good':''}">${visited.length}/3 policy designs explored. ${visited.length===3?'You have seen how one goal can lead to different social effects.':'Visit each policy before finishing the lesson.'}</div></section>
 <section class="panel"><p class="kicker">Design review</p><h2>Intended vs. unintended</h2><div class="two-cols"><div class="info-cell"><strong>Intended result</strong><p>Students play more games and celebrate high scores.</p></div><div class="info-cell"><strong>Possible unintended result</strong><p>Students who did not agree to participate feel exposed, or someone shares identifiable score data.</p></div></div><p class="helper" style="margin-top:12px">Effects of programs can be positive and negative. Ask who benefits, who could be affected unintentionally, and which design changes reduce the harm.</p></section>
 ${qPractice(IMPACT_CHALLENGES,d,seed,1)}
 ${reflection(1,d,'Choose one leaderboard policy. Explain a benefit, a possible unintended harm, and a practical way to reduce that harm. There is no single required policy.')}`;
}
function row(test,d,phase){
 const selected=d.activeTest===test.id,original=d.before?.[test.id],retested=d.after?.[test.id];
 const record=phase==='after'?retested:original;
 const beforeStatus=original?`<span class="test-status ${original.correct?'good':'bad'}">Original: ${original.correct?'passed':'failed'}</span>`:'';
 const afterStatus=retested&&phase==='after'?`<span class="test-status ${retested.correct?'good':'bad'}">With repair: ${retested.correct?'passed':'failed'}</span>`:'';
 return `<div class="test-case ${selected?'test-case-active':''}"><div><strong>${e(test.label)}</strong><div class="case-values">tickets = ${test.tickets} · cost = ${test.cost} · stock = ${test.stock}</div><div class="fineprint">Expected: ${e(test.expect)}</div><div class="test-states">${beforeStatus}${afterStatus}</div></div><button type="button" class="btn small ${selected?'':'secondary'}" data-action="32-load-test" data-id="${test.id}">${selected?'Loaded ✓':'Load into code'}</button></div>`;
}
function testCode(test,condition){
 const inputs=test?`int tickets = ${test.tickets};\nint cost = ${test.cost};\nint stock = ${test.stock};`:'int tickets = /* select a test */;\nint cost = /* select a test */;\nint stock = /* select a test */;';
 return `${inputs}\n\nif (${condition}) {\n    tickets -= cost;\n    stock--;\n    return "Redeemed";\n}\nreturn "Rejected";`;
}
function page32Two(d,seed){
 const before=d.before||{},after=d.after||{},beforeDone=RELIABILITY_TESTS.every(t=>before[t.id]);
 const afterDone=RELIABILITY_TESTS.every(t=>after[t.id]);
 const afterCorrect=RELIABILITY_TESTS.filter(t=>after[t.id]?.correct).length;
 const chosen=RELIABILITY_FIXES.find(f=>f.id===d.fixChoice)||null;
 const phase=chosen?'after':'before';
 const test=RELIABILITY_TESTS.find(t=>t.id===d.activeTest)||null;
 const result=test?(phase==='before'?before[test.id]:after[test.id]):null;
 const descriptions={a:'tickets >= cost',b:'cost > 0 && stock > 0 && tickets >= cost',c:'true',d:'tickets > cost'};
 const condition=descriptions[chosen?.id||'a'];
 const correctKinds=['exact','empty','negative'].filter(id=>d.types?.[id]===RELIABILITY_TESTS.find(t=>t.id===id).kind).length;
 return `<section class="panel"><p class="kicker">Software testing · Reliability</p><h2>Would you trust the prize machine?</h2>
 <p><strong>System reliability</strong> means a program performs its intended tasks under stated conditions without failure. Test more than one successful example to find problems.</p>
 <div class="callout maroon"><strong>Prize system rules:</strong> Redeem a prize only when its cost is <strong>positive</strong>, at least one prize is <strong>in stock</strong>, and the player has <strong>enough tickets</strong>. A rejected request must not change ticket or stock counts.</div>
 <div class="reliability-step"><h3>1. Load and run the original tests</h3><p class="helper">Select a test case. Its starting values will be inserted at the top of the Java code. Click <strong>Run code</strong> to see the actual result. Compare it with the expected result, then try all six cases.</p>
 <div class="test-grid">${stableShuffle(RELIABILITY_TESTS,seed,'32-reliability-tests').map(t=>row(t,d,phase)).join('')}</div>
 <div class="feedback ${beforeDone?'good':''}" role="status">${Object.keys(before).length}/6 original-code tests run. ${beforeDone?'The original results are recorded. Select a repair below and run the same cases again.':'Run every case, including the unusual inputs.'}</div></div>
 ${beforeDone?`<div class="reliability-step"><h3>2. Choose a possible repair</h3><p class="helper">Your selection replaces the condition in the code below. <strong>The website will not tell you if the choice is correct.</strong> Run all six tests again to find out. You may change your repair and retry.</p>
 <div class="q-options">${shuffledOptions(RELIABILITY_FIXES.map(f=>f.text),seed,'32-fix-options').map(({text,index})=>{const f=RELIABILITY_FIXES[index];return `<label class="q-option"><input type="radio" name="reliability-fix" data-action="32-fix" value="${f.id}" ${chosen?.id===f.id?'checked':''}><span>${e(text)}</span></label>`;}).join('')}</div></div>`:''}
 <div class="code-stage" style="margin-top:16px"><div class="code-bar"><span>${chosen?'Code with your selected repair':'Original redemption code'} · simplified Java</span><span>${test?e(test.label):'No test loaded'}</span></div><pre class="code-main reliability-code" style="margin:0">${e(testCode(test,condition))}</pre></div>
 <div class="reliability-runbar"><button class="btn" data-action="32-run-code" ${!test?'disabled':''}>▶ Run code</button><span class="helper">${test?'Loaded: '+e(test.label)+'. '+(chosen?'Testing selected repair.':'Testing original code.'):'Choose a test case above to insert its values.'}</span></div>
 ${result?`<div class="feedback ${result.correct?'good':'bad'}" role="status"><strong>Returned: ${e(result.status)}</strong> · remaining tickets: ${result.tickets} · stock: ${result.stock}. Expected: ${e(test.expect)}. ${result.correct?'✓ This test matches the requirements.':'✕ This test exposes a failure.'} <span class="fineprint">${e(test.reason)}</span></div>`:''}
 ${chosen?`<div class="feedback ${afterDone&&afterCorrect===6?'good':afterDone?'bad':''}" role="status"><strong>Repair test results: ${Object.keys(after).length}/6 run, ${afterCorrect}/6 passing.</strong> ${afterDone?(afterCorrect===6?'✓ Your selected condition passes every test.':'The condition still fails at least one case. Try a different repair and rerun the tests.'):'Load and run all six cases using your selected repair. The results above show which tests still fail.'}</div>`:''}</section>
 <section class="panel"><p class="exercise-tag">Categorize the tests · Unlimited practice</p><h2>Why did these tests matter?</h2><p class="helper">Choose whether each case is a normal, boundary, or invalid test. You will receive feedback immediately and may retry.</p>
 ${stableShuffle(RELIABILITY_TESTS.filter(t=>['exact','empty','negative'].includes(t.id)),seed,'32-reliability-kinds').map(t=>{const value=d.types?.[t.id]||'',ok=value===t.kind;return `<div class="test-kind-card"><div class="mini-card"><label for="32-kind-${t.id}">${e(t.label)} <span class="helper">(${t.tickets} tickets, cost ${t.cost}, stock ${t.stock})</span></label><select data-action="32-type" data-id="${t.id}" id="32-kind-${t.id}"><option value="">Select…</option>${stableShuffle(['Normal','Boundary','Invalid'],seed,`32-kind-options-${t.id}`).map(v=>`<option value="${v}" ${value===v?'selected':''}>${v}</option>`).join('')}</select></div>${value?`<div class="feedback ${ok?'good':'bad'}" role="status">${ok?'✓ Correct. '+e(t.reason):'Not quite. A boundary checks a threshold; an invalid input violates a stated requirement. Try another classification.'}</div>`:''}</div>`;}).join('')}
 <div class="feedback ${correctKinds===3?'good':''}" role="status">${correctKinds}/3 classifications correct. ${correctKinds===3?'✓ You have completed this practice.':'Change a selection to get feedback and work toward 3/3.'}</div>
 <div class="callout" style="margin-top:12px">A <strong>boundary</strong> test checks a value at or near a limit. An <strong>invalid</strong> test checks input that violates the stated rules. Both can expose failures missed by ordinary tests.</div></section>`;
}
function page32Three(d,seed){const matches=CODE_ASSETS.filter(x=>d.assetAnswers?.[x.id]===x.answer).length;
 return `<section class="panel"><p class="kicker">Code reuse review</p><h2>Found online does not mean free to copy</h2><p>Programmers often build on existing software. But being able to <em>read</em> code does not automatically grant permission to <em>reuse</em> it. Some code has licenses allowing reuse under conditions; other code requires permission or payment.</p>
 <p class="helper">For each file proposed for your arcade game, choose the responsible reuse decision. Use the asset's description. You can retry until all four are correct.</p>
 ${stableShuffle(CODE_ASSETS,seed,'32-code-assets').map(x=>{const selected=d.assetAnswers?.[x.id],correct=selected===x.answer;return `<div class="asset-card"><h3>${e(x.name)}</h3><p>${e(x.description)}</p><label for="asset-${x.id}" class="helper">Reuse decision</label><select id="asset-${x.id}" data-action="32-asset" data-id="${x.id}"><option value="">Choose…</option>${stableShuffle(ASSET_DECISIONS,seed,`32-asset-choice-${x.id}`).map(opt=>`<option value="${opt.id}" ${selected===opt.id?'selected':''}>${e(opt.label)}</option>`).join('')}</select>${selected?`<div class="feedback ${correct?'good':'bad'}" role="status">${correct?'✓ Correct.':'Try another choice.'} ${correct?e(x.why):'Consider whether the description grants reuse rights, requires a license, or identifies your own original work.'}</div>`:''}</div>`;}).join('')}
 <div class="feedback ${matches===4?'good':''}">${matches}/4 reuse decisions correct. ${matches===4?'You are ready to review the broader ethical question.':'Review any remaining incorrect decisions.'}</div></section>
 <section class="panel"><p class="kicker">Release responsibility</p><h2>What would you check before shipping?</h2><div class="two-cols"><div class="info-cell"><strong>Legality and permission</strong><p>Check whether you have permission or a suitable license for code you incorporate, and follow its conditions.</p></div><div class="info-cell"><strong>Social responsibility</strong><p>Consider who could be harmed by the program, not only whether the program is technically correct.</p></div></div><p class="helper" style="margin-top:12px">These concerns are different from reliability testing, but responsible developers consider all of them.</p></section>
 ${qPractice(ETHICS_CHALLENGES,d,seed,3)}
 ${reflection(3,d,'Your team finds a clever code snippet online with no stated license. Explain what you should do before using it and why this matters.')}`;
}
export function render32Page(n,d,seed){return [page32One,page32Two,page32Three][n-1](d,seed);}
export function check32AnswersComplete(a){return QUESTIONS32.every(q=>q.kind==='choice'?a.draft[q.id]!==undefined:q.items.every((_,i)=>!!a.draft[q.id]?.[i]));}
export function check32AnswerCount(a){return QUESTIONS32.filter(q=>q.kind==='choice'?a.draft[q.id]!==undefined:q.items.every((_,i)=>!!a.draft[q.id]?.[i])).length;}
export function grade32(a){let correct=0,answers={},points={};
 for(const q of QUESTIONS32){let v=a.draft[q.id],ok=false;
  if(q.kind==='choice'){v=Number(v);ok=v===q.answer;}
  else{v=Object.fromEntries(q.items.map((_,i)=>[i,a.draft[q.id]?.[i]]));ok=q.items.every(([,expected],i)=>v[i]===expected);}
  answers[q.id]=v;points[q.id]=ok?12.5:0;if(ok)correct++;
 }
 return {score:correct*12.5,answers,points,at:new Date().toISOString(),questionBank:'2025-U3.2-v2',questions:QUESTIONS32.map(q=>({...q}))};
}
function input32(q,a,seed){const v=a.draft[q.id];
 if(q.kind==='choice'){
  const list=QUESTIONS32.filter(x=>x.kind==='choice');const idx=list.findIndex(x=>x.id===q.id);const targets=gradedChoiceTargets(seed,list.length);
  const choices=placeCorrectOption(q.options,q.answer,targets[idx],seed,`32-graded-${q.id}`);
  return `<div class="q-options">${choices.map(opt=>`<label class="q-option"><input type="radio" name="${q.id}" data-action="32-graded" data-id="${q.id}" value="${opt.index}" ${v===opt.index?'checked':''}><span>${e(opt.text)}</span></label>`).join('')}</div>`;
 }
 return `<div class="q-categories">${stableShuffle(q.items.map(([label],index)=>({label,index})),seed,`32-rows-${q.id}`).map(({label,index})=>`<div class="q-subrow"><span>${e(label)}</span><select data-action="32-graded-category" data-id="${q.id}" data-index="${index}" aria-label="Classify ${e(label)}"><option value="">Choose…</option>${stableShuffle(q.categories,seed,`32-cats-${q.id}`).map(c=>`<option value="${e(c)}" ${v?.[index]===c?'selected':''}>${e(c)}</option>`).join('')}</select></div>`).join('')}</div>`;
}
export function render32Check(a,seed,teacher){const count=check32AnswerCount(a);
 return `<div class="page-title"><p class="eyebrow">TOPIC 3.2 · GRADED SECTION CHECK</p><h1>Design, test, and reuse responsibly.</h1><p class="lead">Eight questions, 12.5 points each. You need at least <strong>7 correct answers (87.5%)</strong> to meet the 80% threshold. Your one graded submission is final until a teacher reset.</p></div>
 <div class="callout" style="margin-bottom:16px">You can review and change your answers before final submission. Your choices are saved automatically. Incorrect answers cannot be retried after submitting without a teacher reset.</div>
 <section aria-label="Topic 3.2 section check">${QUESTIONS32.map((q,i)=>`<div class="assessment-row"><div class="q-meta"><span>QUESTION ${i+1} OF 8</span><span>${e(q.area)}</span><span>${e(q.objective)}</span></div><h3>${e(q.prompt)}</h3>${input32(q,a,seed)}${teacher?`<div class="teacher-answer"><strong>Teacher key:</strong> ${e(q.kind==='choice'?q.options[q.answer]:q.items.map(([name,correct])=>`${name}: ${correct}`).join(' | '))}<br>${e(q.explanation)}</div>`:''}</div>`).join('')}</section>
 <div class="assessment-sticky"><div><strong data-role="32-counter">${count} of 8 answered</strong><div class="helper" data-role="32-remaining">Autosaved · ${8-count} question${8-count===1?'':'s'} remaining</div></div><div class="btn-row"><button class="btn secondary" data-nav="#/topic/3.2/page/3">Review lessons</button><button class="btn" data-action="32-review" ${count===8?'':'disabled'}>Review &amp; submit →</button></div></div>`;
}
export function render32Results(a,teacher){const latest=a.attempts.at(-1);if(!latest)return '<div class="panel"><h2>No Topic 3.2 submission yet</h2><button class="btn" data-nav="#/topic/3.2/check">Open section check</button></div>';
 const passed=latest.score>=80,qs=latest.questions?.length?latest.questions:QUESTIONS32;
 return `<div class="page-title"><p class="eyebrow">TOPIC 3.2 · GRADED RESULTS</p><h1>${passed?'Topic 3.2 mastered.':'Review Topic 3.2 with your teacher.'}</h1><p class="lead">${passed?'You passed the 80% threshold. You can continue with Topic 3.3 from the dashboard.':'Your attempt has been saved. Review and practice the lessons, then ask your teacher to reset this section check.'}</p></div>
 <div class="panel" style="text-align:center;margin-bottom:20px"><div class="score-ring"><div class="scorebig ${passed?'good':''}">${latest.score}</div><div class="muted">/100</div></div><div class="spaced" style="justify-content:center;margin:12px 0"><span class="step-badge ${passed?'complete':''}">${passed?'PASS':'BELOW 80%'} · ${latest.score}/100</span><span class="pill">${a.attempts.length} attempt${a.attempts.length===1?'':'s'} recorded</span></div><p class="helper">${new Date(latest.at).toLocaleString()} · ${latest.score/12.5} correct of 8</p><div class="btn-row" style="justify-content:center"><button class="btn" data-action="pdf-topic" data-topic="3.2">↓ Download 3.2 PDF</button><button class="btn secondary" data-nav="#/topic/3.2/page/1">Review lessons</button></div></div>
 <div class="panel"><h2>Question-by-question results</h2><p class="helper">Scores and your submitted answers appear below. The answer key is visible in teacher mode.</p>${qs.map((q,i)=>{const v=latest.answers?.[q.id];const answer=q.kind==='choice'?(v===undefined?'(no response)':q.options[v]):q.items.map(([label],j)=>`${label}: ${v?.[j]||'(blank)'}`).join(' · ');
 return `<div class="answer-review"><div class="spaced"><strong>Question ${i+1} · ${e(q.area)}</strong><span class="status ${latest.points?.[q.id]===12.5?'good':'bad'}">${latest.points?.[q.id]||0}/12.5</span></div><p>${e(q.prompt)}</p><p class="helper"><strong>Your answer:</strong> ${e(answer)}</p>${teacher?`<div class="teacher-answer"><strong>Correct:</strong> ${e(q.kind==='choice'?q.options[q.answer]:q.items.map(([label,correct])=>`${label}: ${correct}`).join(' · '))}<br>${e(q.explanation)}</div>`:''}</div>`;}).join('')}</div>
 ${a.attempts.length>1?`<div class="panel" style="margin-top:17px"><h3>Previous attempts retained</h3>${a.attempts.slice(0,-1).map((x,i)=>`<p class="helper">Attempt ${i+1}: ${x.score}/100 · ${new Date(x.at).toLocaleString()}</p>`).join('')}</div>`:''}`;
}
