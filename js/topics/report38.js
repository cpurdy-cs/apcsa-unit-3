import {PAGE38,PRACTICE38,QUESTIONS38,SCOPE_SCENES38,SHADOW_CASES38} from '../content38.js';
import {stamp,niceAnswer} from '../report-helpers.js';
import {TEST_COUNT38} from './scope-engine38.js';
export function write38(report,st){
 report.heading('Topic 3.8 | Lesson completion',15);
 PAGE38.forEach((p,i)=>{const x=st.pages[`3.8.${i+1}`];report.line(`${i+1}. ${p.title}: ${x?.completed?'Completed':'Not completed'}${x?.completedAt?' ('+stamp(x.completedAt)+')':''}`);});
 report.blank(10);report.heading('Selected practice evidence | Topic 3.8',14);
 for(let n=1;n<=4;n++){const d=st.pages[`3.8.${n}`]?.data||{},num=PRACTICE38[n].filter(q=>d.answers?.[q.id]===q.answer).length;
 report.item(`3.8.${n}: ${PAGE38[n-1].title}`,`${num}/${PRACTICE38[n].length} knowledge checks correct.`);
 if(n===1)report.item('Scope explorer',`${(d.solved||[]).length}/${SCOPE_SCENES38.length} locations correctly predicted.`);
 if(n===2)report.item('Method trace',`Full trace: ${d.traced?'yes':'no'}; caller-value prediction: ${d.predCorrect?'correct':'not yet correct'}.`);
 if(n===3)report.item('Debugging cases',`${(d.solved||[]).length}/${SHADOW_CASES38.length} errors repaired.`);
 }
 const src=st.pages['3.8.4']?.data?.fullClass||{};
 report.heading('Independent DroneBattery class | Source code',14);
 report.line(`${src.passed?'PASS':'Not yet passed'} | ${(src.result?.tests||[]).filter(x=>x.pass).length}/${src.result?.total||TEST_COUNT38} behavior tests`,{bold:true});
 for(const line of String(src.code||'No source submitted.').split('\n')){const indent=line.match(/^ */)?.[0].length||0;report.line(line||' ',{size:8,indent:Math.min(25,4+indent*2)});}report.blank(8);
 report.heading('Section check 3.8 | Full graded responses',15);
 const attempts=st.assessments?.['3.8']?.attempts||[];if(!attempts.length){report.line('No graded submission recorded.');return;}
 attempts.forEach((a,i)=>{report.line(`Attempt ${i+1} | ${stamp(a.at)} | ${a.score}/100 | ${a.score>=80?'PASS':'BELOW MASTERY'}`,{bold:true});
 (a.questions?.length?a.questions:QUESTIONS38).forEach((q,j)=>{report.ensure(60+(q.code?q.code.split('\n').length*13:0));report.line(`Q${j+1} (${q.objective}) - ${Number(a.points?.[q.id]||0).toFixed(2)} points`,{bold:true,size:9});if(q.code){report.line('Java code:',{bold:true,size:9});for(const line of q.code.split('\n'))report.line(line||' ',{size:8,indent:12+Math.min(18,(line.match(/^ */)?.[0].length||0)*1.5)});}report.line(q.prompt,{size:9});for(const [idx,opt] of (q.options||[]).entries())report.line(`${String.fromCharCode(65+idx)}. ${opt}`,{size:8,indent:12});report.line('Student response: '+niceAnswer(q,a.answers?.[q.id]),{size:9,indent:10});report.blank(4);});report.blank(8);});
}
