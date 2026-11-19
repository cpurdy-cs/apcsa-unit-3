import {SUMMARY_PARTS,REVIEW_QUESTION_COUNT} from '../content-summary.js';
import {unitTopicsComplete,allReviewComplete,reviewProgress} from '../unit-summary.js';
export function writeUnitSummaryReport(report,st){
 const progress=reviewProgress(st);report.newPage();report.heading('Unit 3 Summary | Cumulative review',16);
 report.line(`Eligibility: ${unitTopicsComplete(st)?'All nine topics passed and lessons complete':'Not yet eligible (nine-topic mastery incomplete)'}`);
 report.line(`Review status: ${allReviewComplete(st)?'COMPLETED':'IN PROGRESS'}`);
 report.line(`Review parts: ${progress.parts}/4; review questions answered correctly: ${progress.questions}/${REVIEW_QUESTION_COUNT}.`);
 if(st.review3?.completedAt)report.line(`Review completion recorded: ${st.review3.completedAt}`);
 report.blank(12);
 SUMMARY_PARTS.forEach((part,index)=>{
  const saved=st.review3?.parts?.[index]||{},solved=part.questions.filter(q=>saved.solved?.[q.id]).length;
  report.heading(`Review ${index+1}: ${part.title}`,13);
  report.line(`Topics ${part.topics} | ${solved}/${part.questions.length} correct | ${solved===part.questions.length?'Complete':'In progress'}`,{size:9});
  part.questions.forEach((q,j)=>{report.ensure(44);report.line(`Q${j+1}. ${q.prompt}`,{size:9});const answer=saved.answers?.[q.id],response=Number.isInteger(answer)?q.options[answer]:'Not submitted';report.line(`Review response: ${response} | ${saved.solved?.[q.id]?'Correct':'Not yet correct'} | Attempts: ${saved.attempts?.[q.id]||0}`,{size:8,indent:12});});
  report.blank(8);
 });
}
