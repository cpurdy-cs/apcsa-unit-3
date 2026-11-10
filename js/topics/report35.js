import {PAGE35,PRACTICE35,ACCESS_SLOTS35,BUG_TESTS35,QUESTIONS35} from '../content35.js';
import {CLASS_SPEC35} from './class-engine35.js';
import {stamp,niceAnswer} from '../report-helpers.js';
const count=(d,n)=>PRACTICE35[n].filter(q=>d.answers?.[q.id]===q.answer).length;
export function write35(report,st){
 report.heading('Topic 3.5 | Lesson completion',15);
 PAGE35.forEach((p,i)=>{const x=st.pages[`3.5.${i+1}`];report.line(`${i+1}. ${p.title}: ${x?.completed?'Completed':'Not completed'}${x?.completedAt?' ('+stamp(x.completedAt)+')':''}`,{size:10});});
 report.blank(10);report.heading('Selected practice evidence | Topic 3.5',14);
 for(let n=1;n<=8;n++){const d=st.pages[`3.5.${n}`]?.data||{};report.item(`3.5.${n} — ${PAGE35[n-1].title}`,`${count(d,n)}/${PRACTICE35[n].length} practice answers correct.`);}
 const p1=st.pages['3.5.1']?.data||{};report.item('Method anatomy inspected',(p1.inspected||[]).join(', ')||'None');
 for(const [n,description] of [[2,'State-changing method runs'],[3,'Return/print comparisons'],[4,'Primitive-parameter experiments']])report.item(description,(st.pages[`3.5.${n}`]?.data?.ran||[]).join(', ')||'None');
 const p5=st.pages['3.5.5']?.data||{};report.item('Class interface choices',ACCESS_SLOTS35.map(s=>`${s.label}: ${p5.access?.[s.id]||'unselected'}`).join(' | '));
 report.item('Flow-control traces',(st.pages['3.5.6']?.data?.finished||[]).join(', ')||'None');
 const p7=st.pages['3.5.7']?.data||{};report.item('Precondition lab',`Original runs ${(Object.keys(p7.before||{})).length}/5, repaired retests ${(Object.keys(p7.after||{})).length}/5. Repair: ${p7.repair||'none'}. ${BUG_TESTS35.map(t=>`${t.id}: ${p7.after?.[t.id]===t.expect?'pass':'not passed'}`).join(' | ')}`);
 const d8=st.pages['3.5.8']?.data||{};report.heading('Independent full-class implementation',14);
 const entry=d8.fullClass||{},lines=String(entry.code||'No full class submitted').split('\n');
 report.line(`PrizeCard: ${entry.passed?'PASS':'Not yet passed'} | ${(entry.result?.tests||[]).filter(t=>t.pass).length}/${entry.result?.total||12} tests`,{bold:true});
 for(const line of lines){const indent=line.match(/^ */)?.[0].length||0;report.line(line||' ',{size:8,indent:Math.min(25,4+indent*2)});}report.blank(5);
 if(d8.workshop)report.item('Earlier v1.13 method exercises','Previous separate method submissions remain in the JSON progress backup.');
 const attempts=st.assessments?.['3.5']?.attempts||[];report.heading('Section check 3.5 | Full graded responses',15);if(!attempts.length){report.line('No graded submission recorded.');return;}
 attempts.forEach((attempt,i)=>{report.line(`Attempt ${i+1} | ${stamp(attempt.at)} | ${attempt.score}/100 | ${attempt.score>=80?'PASS':'BELOW MASTERY'}`,{bold:true});(attempt.questions?.length?attempt.questions:QUESTIONS35).forEach((q,j)=>{report.ensure(42);report.line(`Q${j+1} (${q.objective}) — ${Number(attempt.points?.[q.id]||0).toFixed(2)} points`,{bold:true,size:9});report.line(q.prompt,{size:9});report.line('Student response: '+niceAnswer(q,attempt.answers?.[q.id]),{size:9,indent:10});report.blank(3);});report.blank(8);});
}
