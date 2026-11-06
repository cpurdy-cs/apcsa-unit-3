import {PAGE33,ANATOMY,CLASS_PARTS,ACCESS_TRANSFER,OBJECT_TRANSFER,BUILD_SLOTS,BUILD_TRANSFER,QUESTIONS33} from '../content33.js';
import {assembledClass} from '../topic33.js';
import {stamp,niceAnswer} from '../report-helpers.js';

export function write33(report,st){
 report.heading('Topic 3.3 | Lesson completion',15);
 PAGE33.forEach((p,i)=>{const record=st.pages[`3.3.${i+1}`];report.line(`${i+1}. ${p.title}: ${record?.completed?'Completed':'Not completed'}${record?.completedAt?' ('+stamp(record.completedAt)+')':''}`,{size:10});});
 const a=st.pages['3.3.1']?.data||{},b=st.pages['3.3.2']?.data||{},c=st.pages['3.3.3']?.data||{},d=st.pages['3.3.4']?.data||{};
 report.blank(9);report.heading('Selected practice evidence | Topic 3.3',14);
 report.item('Class anatomy',`Inspected: ${(a.inspected||[]).join(', ')||'None'}. Correct classifications: ${CLASS_PARTS.filter(x=>a.parts?.[x.id]===x.answer).length}/${CLASS_PARTS.length}.`);
 report.item('Access checker',`Access situations examined: ${(b.probed||[]).join(' | ')||'None'}. Transfer: ${ACCESS_TRANSFER.filter(q=>b.answers?.[q.id]===q.answer).length}/${ACCESS_TRANSFER.length} correct.`);
 report.item('Independent object state',`Created objects: ${!!c.created}. Final scores: a=${c.scores?.a??'N/A'}, b=${c.scores?.b??'N/A'}. Calls: ${(c.calls||[]).map(x=>`${x.id}.${x.kind}${x.kind==='add'?'('+x.amount+')':'()'} -> ${x.score}`).join('; ')||'None'}.`);
 report.item('Object-reference transfer',`${OBJECT_TRANSFER.filter(q=>c.answers?.[q.id]===q.answer).length}/${OBJECT_TRANSFER.length} correct.`);
 report.item('Class design summary',`Correct declaration slots: ${BUILD_SLOTS.filter(x=>d.build?.[x.id]==='correct').length}/${BUILD_SLOTS.length}. Validated: ${!!d.validated}. Access checks performed: ${!!d.clientChecked}. Transfer: ${BUILD_TRANSFER.filter(q=>d.answers?.[q.id]===q.answer).length}/${BUILD_TRANSFER.length}.`);
 report.line('Student-assembled class',{bold:true});
 assembledClass(d.build).split('\n').forEach(line=>{const indent=(line.match(/^ */)?.[0].length||0);report.line(line||' ',{size:8,indent:10+indent*5});});report.blank(4);
 report.item('Design explanation',d.reflection||'(No explanation saved)');
 const attempts=st.assessments?.['3.3']?.attempts||[];
 report.heading('Section check 3.3 | Full graded responses',15);
 if(!attempts.length){report.line('No graded submission recorded.');return;}
 attempts.forEach((attempt,i)=>{
  report.line(`Attempt ${i+1} | ${stamp(attempt.at)} | Score: ${attempt.score}/100 | ${attempt.score>=80?'PASS':'BELOW MASTERY'}`,{bold:true});
  (attempt.questions?.length?attempt.questions:QUESTIONS33).forEach((q,j)=>{
   report.ensure(43);report.line(`Q${j+1} (${q.objective}) - ${Number(attempt.points?.[q.id]||0)}/10`,{bold:true,size:9});
   report.line(q.prompt,{size:9});report.line('Student response: '+niceAnswer(q,attempt.answers?.[q.id]),{size:9,indent:10});report.blank(2);
  });report.blank(6);
 });
}
