import {PAGE37,EXAMPLES37,PRACTICE37,QUESTIONS37} from '../content37.js';
import {stamp,niceAnswer} from '../report-helpers.js';
export function write37(report,st){
 report.heading('Topic 3.7 | Lesson completion',15);
 PAGE37.forEach((p,i)=>{const x=st.pages[`3.7.${i+1}`];report.line(`${i+1}. ${p.title}: ${x?.completed?'Completed':'Not completed'}${x?.completedAt?' ('+stamp(x.completedAt)+')':''}`);});
 report.blank(10);report.heading('Selected practice evidence | Topic 3.7',14);
 for(let n=1;n<=5;n++){const d=st.pages[`3.7.${n}`]?.data||{},num=PRACTICE37[n].filter(q=>d.answers?.[q.id]===q.answer).length;
  report.item(`3.7.${n}: ${PAGE37[n-1].title}`,`${num}/${PRACTICE37[n].length} knowledge checks correct.`);
  if(n===1)report.item('Object factory experiments',`${d.players?.length||0} created, ${d.scoreChanges||0} score changes; shared-state predictions: ${d.predictedCreate&&d.predictedScore?'both correct':'not both completed'}. Final player scores: ${(d.players||[]).join(', ')||'none'}`);
  else if(n<5)report.item('Interactive code experiments',(d.passed||[]).join(', ')||'None');
 }
 const entry=st.pages['3.7.5']?.data?.fullClass||{};
 report.heading('Independent TrailGate class | Source code',14);
 report.line(`${entry.passed?'PASS':'Not yet passed'} | ${(entry.result?.tests||[]).filter(x=>x.pass).length}/${entry.result?.total||21} behavior tests`,{bold:true});
 for(const line of String(entry.code||'No source submitted.').split('\n')){const indent=line.match(/^ */)?.[0].length||0;report.line(line||' ',{size:8,indent:Math.min(25,4+indent*2)});}report.blank(8);
 report.heading('Section check 3.7 | Full graded responses',15);
 const attempts=st.assessments?.['3.7']?.attempts||[];if(!attempts.length){report.line('No graded submission recorded.');return;}
 attempts.forEach((a,i)=>{report.line(`Attempt ${i+1} | ${stamp(a.at)} | ${a.score}/100 | ${a.score>=80?'PASS':'BELOW MASTERY'}`,{bold:true});
 (a.questions?.length?a.questions:QUESTIONS37).forEach((q,j)=>{report.ensure(60+(q.code?q.code.split('\n').length*13:0));report.line(`Q${j+1} (${q.objective}) - ${Number(a.points?.[q.id]||0).toFixed(2)} points`,{bold:true,size:9});if(q.code){report.line('Java code:',{bold:true,size:9});for(const line of q.code.split('\n'))report.line(line||' ',{size:8,indent:12+Math.min(18,(line.match(/^ */)?.[0].length||0)*1.5)});}report.line(q.prompt,{size:9});for(const [idx,opt] of (q.options||[]).entries())report.line(`${String.fromCharCode(65+idx)}. ${opt}`,{size:8,indent:12});report.line('Student response: '+niceAnswer(q,a.answers?.[q.id]),{size:9,indent:10});report.blank(4);});report.blank(8);});
}
