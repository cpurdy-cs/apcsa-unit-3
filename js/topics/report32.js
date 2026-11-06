import {PAGE32,POLICIES,RELIABILITY_TESTS,CODE_ASSETS,IMPACT_CHALLENGES,ETHICS_CHALLENGES,QUESTIONS32} from '../content32.js';
import {stamp,niceAnswer} from '../report-helpers.js';
export function write32(report,st){
 report.heading('Topic 3.2 | Lesson completion',15);
 PAGE32.forEach((p,i)=>{
  const record=st.pages[`3.2.${i+1}`];
  report.line(`${i+1}. ${p.title}: ${record?.completed?'Completed':'Not completed'}${record?.completedAt?' ('+stamp(record.completedAt)+')':''}`,{size:10});
 });
 const p1=st.pages['3.2.1']?.data||{},p2=st.pages['3.2.2']?.data||{},p3=st.pages['3.2.3']?.data||{};
 report.blank(9);report.heading('Selected practice evidence | Topic 3.2',14);
 report.item('Leaderboard design comparison', `Policies examined: ${(p1.visited||[]).map(id=>POLICIES.find(x=>x.id===id)?.label||id).join(' | ')||'None'}. Final selection: ${POLICIES.find(x=>x.id===p1.policy)?.label||'Not selected'}.`);
 report.item('Unintended consequences reflection',p1.reflection||'(No reflection saved)');
 report.item('Reliability testing: original code',RELIABILITY_TESTS.map(t=>`${t.label}: ${p2.before?.[t.id]?.status||'Not tested'} (expected ${t.expect})`).join(' | '));
 report.item('Reliability fix and retest',`Repair: ${p2.fixChoice||'None'}; corrected test results: ${RELIABILITY_TESTS.filter(t=>p2.after?.[t.id]?.correct).length}/${RELIABILITY_TESTS.length}.`);
 report.item('Software reuse decisions',CODE_ASSETS.map(x=>`${x.name}: ${p3.assetAnswers?.[x.id]||'Unanswered'}`).join(' | '));
 report.item('Code-reuse reflection',p3.reflection||'(No reflection saved)');
 report.item('Transfer scenarios',`Page 1: ${IMPACT_CHALLENGES.filter(q=>p1.answers?.[q.id]===q.answer).length}/${IMPACT_CHALLENGES.length} correct; Page 3: ${ETHICS_CHALLENGES.filter(q=>p3.answers?.[q.id]===q.answer).length}/${ETHICS_CHALLENGES.length} correct.`);
 const attempts=st.assessments?.['3.2']?.attempts||[];
 report.heading('Section check 3.2 | Full graded responses',15);
 if(!attempts.length){report.line('No graded submission recorded.');return;}
 attempts.forEach((a,idx)=>{
  report.line(`Attempt ${idx+1} | ${stamp(a.at)} | Score: ${a.score}/100 | ${a.score>=80?'PASS':'BELOW MASTERY'}`,{bold:true});
  (a.questions?.length?a.questions:QUESTIONS32).forEach((q,i)=>{
   const raw=a.answers?.[q.id],awarded=Number(a.points?.[q.id]||0);
   report.ensure(43);report.line(`Q${i+1} (${q.objective}) - ${awarded}/12.5`,{bold:true,size:9});
   report.line(q.prompt,{size:9});report.line('Student response: '+niceAnswer(q,raw),{size:9,indent:10});report.blank(2);
  });
  report.blank(6);
 });
}
