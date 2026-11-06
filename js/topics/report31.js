import {QUESTIONS,PAGE_META,CHALLENGES} from '../content.js';
import {stamp,niceAnswer} from '../report-helpers.js';
function evidenceLines(st){
 const p1=st.pages[1]?.data||{},p2=st.pages[2]?.data||{},p3=st.pages[3]?.data||{},p4=st.pages[4]?.data||{};
 return [
  ['Objects Everywhere',`Explored: ${(p1.explored||[]).join(', ')||'None'}; classification complete: ${!!p1.classifyDone}`],
  ['Data Abstraction',`Simulation actions: ${p2.simActions||0}; variable classification complete: ${!!p2.classifyDone}`],
  ['Procedural Abstraction',`Method body: ${p3.code||'(not submitted)'}; test suite passed: ${!!p3.codePassed}`],
  ['Class Design Studio',`Chosen fields: ${(p4.fields||[]).join(', ')||'None'}; methods: ${(p4.methods||[]).join(', ')||'None'}; design validated: ${!!p4.designDone}`],
  ['Written reflection',p4.reflection||'(No reflection saved)'],
  ['Transfer challenges', [p1,p2,p3,p4].map((d,i)=>`Page ${i+1}: ${CHALLENGES[i+1].filter((q,j)=>d.challengeResponses?.[j]===q.answer).length}/3 solved`).join(' | ')]
 ];
}
export function write31(report,st){
 report.heading('Topic 3.1 | Lesson completion',15);
 PAGE_META.forEach((p,i)=>report.line(`${i+1}. ${p.title}: ${st.pages[i+1]?.completed?'Completed':'Not completed'}${st.pages[i+1]?.completedAt?' ('+stamp(st.pages[i+1].completedAt)+')':''}`,{size:10}));
 report.blank(9);report.heading('Selected practice evidence',14);
 evidenceLines(st).forEach(([a,b])=>report.item(a,b));
 const attempts=st.assessments?.['3.1']?.attempts||[];
 report.heading('Section check | Full graded responses',15);
 if(!attempts.length){report.line('No graded submission recorded.');return;}
 attempts.forEach((a,idx)=>{
  report.line(`Attempt ${idx+1} | ${stamp(a.at)} | Score: ${a.score}/100 | ${a.score>=80?'PASS':'BELOW MASTERY'}`,{bold:true});
  (a.questions?.length?a.questions:QUESTIONS).forEach((q,i)=>{
   const raw=a.answers?.[q.id];const awarded=Number(a.points?.[q.id]||0);
   report.ensure(43);
   report.line(`Q${i+1} (${q.objective}) - ${awarded}/10`,{bold:true,size:9});
   report.line(q.prompt,{size:9});
   report.line('Student response: '+niceAnswer(q,raw),{size:9,indent:10});
   report.blank(2);
  });
  report.blank(6);
 });
}
