import {getImplementedTopic} from './registry.js';
// Shared post-submission review. Keeps answers secret from ordinary student UI,
// while presenting each original question, all options, submitted response and
// curriculum-based guidance. Does not mutate attempts or affect grading.
const esc=x=>String(x??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const inline=x=>esc(x).replace(/`([^`]+)`/g,(_s,v)=>`<code>${v}</code>`);
const niceTime=date=>{try{return new Date(date).toLocaleString();}catch{return String(date||'');}};
export function reviewGuidance35(topic,area,objective){
 const id=String(topic);if(id==='3.1')return 'Review data and procedural abstraction, attributes versus behaviors, and designing appropriate classes.';
 if(id==='3.2')return 'Review reliability testing, unintended consequences, licensing, and the responsible use of code.';
 if(id==='3.3')return 'Review public and private access, instance variables, constructors, and valid class declarations.';
 if(id==='3.4')return 'Review object initialization, default field values, constructor parameters, and defensive copying.';
 if(id==='3.6'){
  if(/private|access/.test(String(area).toLowerCase()))return 'Review same-class private access and public accessors for other classes.';
  if(/return|identity/.test(String(area).toLowerCase()))return 'Review how methods return existing references and how == compares object identity.';
  return 'Review copying reference values, mutation through aliases, and parameter reassignment.';
 }
 if(id==='3.5'){
  if(/parameter|primitive/i.test(area))return 'Review primitive parameter copying and the difference between local parameters and object fields.';
  if(/return|flow|loop/i.test(area))return 'Review return types, where control goes after return, and whether all paths return values.';
  if(/precondition|debug/i.test(area))return 'Review method preconditions, boundary tests, and paths that may not work as intended.';
  if(/access|mutator|state/i.test(area))return 'Review accessor and mutator methods, public behavior, and private instance variables.';
  return 'Review method headers, void versus non-void, and writing complete methods.';
 }
 return `Revisit the lesson associated with ${objective||area||'this question'}.`;
}
export function relatedLesson(topic,area='',objective=''){
 const a=String(area).toLowerCase(),o=String(objective),t=String(topic);
 if(t==='3.1')return /3.1.A.3|instance|class variable/.test(o+' '+a)?2:/procedure|method/.test(a)?3:4;
 if(t==='3.2')return /reliab|test|boundary/.test(a)?2:/licen|reuse|permission/.test(a)?3:1;
 if(t==='3.3')return /object|instance/.test(a)?3:/build|design|declaration/.test(a)?4:2;
 if(t==='3.4')return /default|implicit|availability/.test(a)?2:/defensive|mutable|copy/.test(a)?5:/writing|debugging|parameter/.test(a)?4:1;
 if(t==='3.6')return /private|access/.test(a)?4:/return|identity/.test(a)?3:/mutat|reassign|parameter/.test(a)?2:1;
 if(t==='3.5')return /precondition|debug/.test(a)?7:/primitive|parameter/.test(a)?4:/control|early|flow/.test(a)?6:/accessor|mutator|state/.test(a)?5:/return|print/.test(a)?3:1;
 return 1;
}
export function reviewQuestionCard(q,index,attempt,teacher=false){const score=Number(attempt.points?.[q.id]||0),max=100/(attempt.totalQuestions||attempt.questions?.length||1),correct=score>=(max-.02),answer=attempt.answers?.[q.id];
 const response=q.kind==='choice'?((Number.isInteger(answer)&&q.options?.[answer]!==undefined)?q.options[answer]:'(No answer)'):(q.items||[]).map(([label],i)=>`${label}: ${answer?.[i]??'(no answer)'}`).join(' | ');
 const source=q.code?`<div class="reference36-code review36-code"><p class="kicker">Original Java code</p><pre><code>${esc(q.code)}</code></pre></div>`:'';
 const options=q.kind==='choice'?`<div class="review35-options">${(q.options||[]).map((v,i)=>`<div class="review35-option ${answer===i?'selected':''}"><span aria-hidden="true">•</span><span>${inline(v)}</span>${answer===i?'<strong class="small">Your choice</strong>':''}</div>`).join('')}</div>`:q.kind==='category'?`<div class="review35-categories"><p class="fineprint">Available categories: ${esc((q.categories||[]).join(' · '))}</p>${(q.items||[]).map(([label],i)=>`<div class="review35-option"><span>${inline(label)}</span><strong>Selected: ${esc(answer?.[i]||'(blank)')}</strong></div>`).join('')}</div>`:'';
 const key=teacher?`<div class="teacher-answer"><strong>Teacher key:</strong> ${q.kind==='choice'?inline(q.options?.[q.answer]):(q.items||[]).map(([label,a])=>`${inline(label)} → ${esc(a)}`).join(' | ')}<p>${inline(q.explanation||'')}</p></div>`:'';
 return `<article class="answer-review review35-question" data-review-status="${correct?'correct':'missed'}"><div class="spaced"><strong>Question ${index+1} · ${esc(q.area||'Topic '+q.objective)}</strong><span class="status ${correct?'good':'bad'}">${Number(score.toFixed(2))} points</span></div><p class="review35-prompt">${inline(q.prompt)}</p>${source}${options}<p class="helper"><strong>Your response:</strong> ${inline(response)}</p>${correct?'<div class="feedback good">Correct.</div>':`<div class="feedback"><strong>Concept to review:</strong> ${esc(reviewGuidance35(attempt.topic,q.area,q.objective))} <button class="btn secondary small" data-nav="#/topic/${esc(attempt.topic)}/page/${relatedLesson(attempt.topic,q.area,q.objective)}">Review related lesson →</button></div>`}${key}</article>`;
}
export function renderSubmissionReview(topic,record,bank,teacher=false,mode='missed',topicTitle=''){const last=record?.attempts?.at(-1);if(!last)return '';
 const questions=(last.questions?.length?last.questions:bank).map(q=>{const original=bank?.find(x=>x.id===q.id);return {...q,categories:q.categories||original?.categories||[]};});const total=questions.length,correct=questions.filter(q=>Number(last.points?.[q.id]||0)>=(100/total)-.02).length,missed=total-correct,passing=last.score>=80;
 const next=(Number(topic.split('.')[1])+1);const nextLink=passing&&getImplementedTopic('3.'+next)?`<button class="btn secondary" data-nav="#/topic/3.${next}/page/1">Continue to Topic 3.${next} →</button>`:'';
 return `<div class="page-title"><p class="eyebrow">TOPIC ${esc(topic)} · GRADED RESULTS</p><h1>${passing?(topic==='3.1'?'Topic mastery achieved.':`Topic ${esc(topic)} mastered.`):(topic==='3.1'?'Review and try again with your teacher.':`Review Topic ${esc(topic)} with your teacher.`)}</h1><p class="lead">${passing?`You passed the 80% threshold. Continue to the next released topic when it becomes available.`:'Your attempt is saved. Review the lessons and ask your teacher to reset the check if you need another attempt.'}</p></div>
 <div class="panel" style="margin-bottom:18px"><div class="spaced"><div><p class="kicker">${esc(topicTitle||'Section check')}</p><h2>${Number(last.score.toFixed(2))}/100 · ${passing?'PASS':'BELOW MASTERY'}</h2></div><span class="pill">${correct} correct · ${missed} missed</span></div><p class="helper">Submitted ${esc(niceTime(last.at))} · ${record.attempts.length} recorded attempt(s). Your original submission has not been changed.</p><div class="btn-row"><button class="btn" data-action="pdf-topic" data-topic="${esc(topic)}">↓ Download topic PDF</button><button class="btn secondary" data-nav="#/topic/${esc(topic)}/page/1">Review lessons</button>${nextLink}</div></div>
 <section class="panel" aria-label="Submitted question review"><div class="spaced"><div><h2>Review your submission</h2><p class="helper">See the original question, its choices, and your submitted answer. Correct answers remain teacher-only.</p></div><span class="pill">${missed} to review</span></div><div class="btn-row" style="margin-bottom:14px"><button class="btn ${mode==='missed'?'':'secondary'}" data-action="review-filter" data-value="missed">Missed questions (${missed})</button><button class="btn ${mode==='all'?'':'secondary'}" data-action="review-filter" data-value="all">All questions (${total})</button></div>${questions.map((q,i)=>({q,i})).filter(({q})=>mode==='all'||Number(last.points?.[q.id]||0)<(100/total-.02)).map(({q,i})=>reviewQuestionCard(q,i,{...last,topic,totalQuestions:total},teacher)).join('')||'<div class="feedback good">You answered every question correctly. Select All questions to review your full submission.</div>'}</section>
 ${record.attempts.length>1?`<div class="panel" style="margin-top:16px"><h3>Earlier attempts</h3>${record.attempts.slice(0,-1).map((a,i)=>`<p class="helper">Attempt ${i+1}: ${a.score}/100 · ${esc(niceTime(a.at))}</p>`).join('')}</div>`:''}`;
}
