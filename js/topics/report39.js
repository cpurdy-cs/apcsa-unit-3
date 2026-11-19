import {PAGE39,PRACTICE39,QUESTIONS39,RECEIVER_CASES39,SHADOW_CASES39,PASS_CASES39} from '../content39.js';
import {stamp,niceAnswer} from '../report-helpers.js';
import {TEST_COUNT39} from './this-engine39.js';
export function write39(report,st){
 report.heading('Topic 3.9 | Lesson completion',15);
 PAGE39.forEach((p,i)=>{const x=st.pages[`3.9.${i+1}`];report.line(`${i+1}. ${p.title}: ${x?.completed?'Completed':'Not completed'}${x?.completedAt?' ('+stamp(x.completedAt)+')':''}`);});
 report.blank(10);report.heading('Selected practice evidence | Topic 3.9',14);
 for(let n=1;n<=4;n++){const d=st.pages[`3.9.${n}`]?.data||{};const correct=PRACTICE39[n].filter(q=>d.correct?.includes(q.id)).length;report.item(`3.9.${n}: ${PAGE39[n-1].title}`,`${correct}/${PRACTICE39[n].length} knowledge checks correct.`);
  if(n<4){const cases=n===1?RECEIVER_CASES39:n===2?SHADOW_CASES39:PASS_CASES39;const count=cases.filter(x=>(d.solved||[]).includes(x.id)).length;report.item('Interactive activity',`${count}/${cases.length} ${n===3?'checkpoints':'scenarios'} completed.`);}
 }
 const work=st.pages['3.9.4']?.data?.fullClass||{};
 report.heading('Independent Contact class | Student source',14);report.line(`${work.passed?'PASS':'Not yet passed'} | ${(work.result?.tests||[]).filter(x=>x.pass).length}/${work.result?.total||TEST_COUNT39} behavior tests`,{bold:true});
 for(const line of String(work.code||'No source submitted.').split('\n')){const indent=line.match(/^ */)?.[0].length||0;report.line(line||' ',{size:8,indent:Math.min(26,4+indent*2)});}report.blank(8);
 report.heading('Section check 3.9 | Full graded responses',15);
 const attempts=st.assessments?.['3.9']?.attempts||[];if(!attempts.length){report.line('No graded submission recorded.');return;}
 attempts.forEach((a,i)=>{report.line(`Attempt ${i+1} | ${stamp(a.at)} | ${a.score}/100 | ${a.score>=80?'PASS':'BELOW MASTERY'}`,{bold:true});
  (a.questions?.length?a.questions:QUESTIONS39).forEach((q,j)=>{report.ensure(65+(q.code?q.code.split('\n').length*12:0));report.line(`Q${j+1} (${q.objective}) | ${Number(a.points?.[q.id]||0).toFixed(2)} points`,{bold:true,size:9});if(q.code){report.line('Java code:',{bold:true,size:9});for(const line of q.code.split('\n'))report.line(line||' ',{size:8,indent:12+Math.min(16,(line.match(/^ */)?.[0].length||0)*1.5)});}report.line(q.prompt,{size:9});for(const [index,opt] of (q.options||[]).entries())report.line(`${String.fromCharCode(65+index)}. ${opt}`,{size:8,indent:12});report.line('Student response: '+niceAnswer(q,a.answers?.[q.id]),{size:9,indent:10});report.blank(4);});report.blank(8);
 });
}
