import {PAGE36,SCENARIOS36,ACCESS36,PRACTICE36,QUESTIONS36} from '../content36.js';
import {stamp,niceAnswer} from '../report-helpers.js';
export function write36(report,st){
 report.heading('Topic 3.6 | Lesson completion',15);
 PAGE36.forEach((p,i)=>{const x=st.pages[`3.6.${i+1}`];report.line(`${i+1}. ${p.title}: ${x?.completed?'Completed':'Not completed'}${x?.completedAt?' ('+stamp(x.completedAt)+')':''}`);});
 report.blank(10);report.heading('Selected practice evidence | Topic 3.6',14);
 for(let n=1;n<=5;n++){const d=st.pages[`3.6.${n}`]?.data||{};const correct=PRACTICE36[n].filter(q=>d.answers?.[q.id]===q.answer).length;report.item(`3.6.${n}: ${PAGE36[n-1].title}`,`${correct}/${PRACTICE36[n].length} knowledge checks correct.`);if(n<=3)report.item('Completed reference experiments',(d.finished||[]).join(', ')||'None');}
 const p4=st.pages['3.6.4']?.data||{};report.item('Private-access scenarios',(p4.accessPassed||[]).join(', ')||'None');
 const work=st.pages['3.6.5']?.data?.fullClass||{};report.heading('Independent WaterTank class',14);const previous=st.pages['3.6.5']?.data?.legacyV117||st.pages['3.6.5']?.data?.legacyV116;if(previous?.code)report.line('Previous workshop source was preserved in the progress backup; complete the new WaterTank workshop for mastery.',{size:9});
 report.line(`Behavior and identity tests: ${work.passed?'PASS':'Not passed'} | ${(work.result?.tests||[]).filter(x=>x.pass).length}/${work.result?.total||18} passing`,{bold:true});
 for(const line of String(work.code||'No source submitted.').split('\n')){const indent=line.match(/^ */)?.[0].length||0;report.line(line||' ',{size:8,indent:Math.min(24,4+indent*2)});}report.blank(8);
 report.heading('Section check 3.6 | Full graded responses',15);const attempts=st.assessments?.['3.6']?.attempts||[];if(!attempts.length){report.line('No graded submission recorded.');return;}
 attempts.forEach((a,i)=>{report.line(`Attempt ${i+1} | ${stamp(a.at)} | ${a.score}/100 | ${a.score>=80?'PASS':'BELOW MASTERY'}`,{bold:true});(a.questions?.length?a.questions:QUESTIONS36).forEach((q,j)=>{report.ensure(65+(q.code?q.code.split('\n').length*13:0));report.line(`Q${j+1} (${q.objective}) — ${Number(a.points?.[q.id]||0).toFixed(2)} points`,{bold:true,size:9});if(q.code){report.line('Java code:',{bold:true,size:9});for(const srcLine of q.code.split('\n'))report.line(srcLine||' ',{size:8,indent:12+Math.min(20,(srcLine.match(/^ */)?.[0].length||0)*1.7)});}report.line(q.prompt,{size:9});report.line('Student response: '+niceAnswer(q,a.answers?.[q.id]),{size:9,indent:10});report.blank(3);});report.blank(8);});
}
