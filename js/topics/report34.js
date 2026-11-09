import {PAGE34,FACTORY_PRACTICE,DEFAULT_FIELDS,DEFAULT_SCENARIOS,DEFAULT_PRACTICE,COPY_IMPLEMENTATIONS,CONSTRUCTOR_CHALLENGES,WORKSHOP_PRACTICE,MULTI_PRACTICE,COPY_PRACTICE,QUESTIONS34} from '../content34.js';
import {assembledConstructor,multiSource} from '../topic34.js';
import {stamp,niceAnswer} from '../report-helpers.js';

const correct=(qs,d)=>qs.filter(q=>d.answers?.[q.id]===q.answer).length;
export function write34(report,st){
 report.heading('Topic 3.4 | Lesson completion',15);
 PAGE34.forEach((p,i)=>{const row=st.pages[`3.4.${i+1}`];report.line(`${i+1}. ${p.title}: ${row?.completed?'Completed':'Not completed'}${row?.completedAt?' ('+stamp(row.completedAt)+')':''}`,{size:10});});
 const p1=st.pages['3.4.1']?.data||{},p2=st.pages['3.4.2']?.data||{},p3=st.pages['3.4.3']?.data||{},p4=st.pages['3.4.4']?.data||{},p5=st.pages['3.4.5']?.data||{};
 report.blank(10);report.heading('Selected practice evidence | Topic 3.4',14);
 report.item('Object factory',`Constructed: ${(p1.objects||[]).map(x=>`${x.variable} -> Player #${x.oid}, name=${x.name}, score=${x.score}`).join('; ')||'None'}. Transfer: ${correct(FACTORY_PRACTICE,p1)}/${FACTORY_PRACTICE.length}.`);
 report.item('Default field values',DEFAULT_FIELDS.map(f=>`${f.type} ${f.name}: ${p2.defaults?.[f.id]||'(no prediction)'}`).join(' | '));
 report.item('Constructor availability',DEFAULT_SCENARIOS.map(x=>`${x.label}: ${p2.verified?.[x.id]?'correct':'not verified'}`).join(' | '));
 report.item('Default-constructor transfer',`${correct(DEFAULT_PRACTICE,p2)}/${DEFAULT_PRACTICE.length} correct.`);
 report.item('Guided object-state constructor',`Selections: score=${p3.multi?.score||'none'}, lives=${p3.multi?.lives||'none'}. Valid run: ${!!p3.multiPassed}. Results: ${(p3.multiObjects||[]).map(x=>`${x.variable}: score ${x.resultScore}, lives ${x.resultLives}`).join('; ')||'None'}. Transfer: ${correct(MULTI_PRACTICE,p3)}/${MULTI_PRACTICE.length}.`);
 report.line('Student-selected Player initialization',{bold:true});multiSource(p3.multi).split('\n').forEach(line=>{const indent=(line.match(/^ */)?.[0].length||0);report.line(line||' ',{size:8,indent:10+Math.min(indent*3,35)});});report.blank(4);
 report.item('Full-constructor workshop',`${CONSTRUCTOR_CHALLENGES.filter(c=>p4.workshopPasses?.[c.id]).length}/3 constructors passed. Transfer: ${correct(WORKSHOP_PRACTICE,p4)}/${WORKSHOP_PRACTICE.length}.`);
 for(const challenge of CONSTRUCTOR_CHALLENGES){
  const entry=p4.workshop?.[challenge.id]||{};
  const source=assembledConstructor(entry.code,challenge.id).split('\n');
  // Keep an entire student-written constructor together instead of splitting it
  // between pages in the middle of its parameter list or body.
  report.ensure(28+source.length*13);
  report.line(`${challenge.className}: ${p4.workshopPasses?.[challenge.id]?'PASS':'Not yet passed'} | ${(entry.result?.tests||[]).filter(x=>x.pass).length}/${challenge.tests.length} tests`,{bold:true});
  source.forEach(line=>{const indent=(line.match(/^ */)?.[0].length||0);report.line(line||' ',{size:8,indent:10+Math.min(indent*3,35)});});report.blank(4);
 }
 report.item('Mutable-reference experiments',`All variants: ${(p5.explored||[]).join(' | ')||'None'}. Last version: ${p5.copyMode||'Not selected'}. Transfer: ${correct(COPY_PRACTICE,p5)}/${COPY_PRACTICE.length}.`);
 for(const mode of COPY_IMPLEMENTATIONS){
  const run=p5.copyRuns?.[mode.id];
  report.item(`Constructor: ${mode.label}`,`Outside mutation: ${(p5.explored||[]).includes(mode.id+'-original')?'tested':'not tested'}; card mutation: ${(p5.explored||[]).includes(mode.id+'-card')?'tested':'not tested'}. Original: ${run?.original??'N/A'}, card: ${run?.stored??'N/A'}. ${mode.safe?'Defensive copy':'Shared mutable reference'}.`);
  report.line('    '+mode.line,{size:8});report.blank(3);
 }
 report.item('Student explanation of defensive copying',p5.reflection||'(No written explanation)');
 const attempts=st.assessments?.['3.4']?.attempts||[];report.heading('Section check 3.4 | Full graded responses',15);
 if(!attempts.length){report.line('No graded submission recorded.');return;}
 attempts.forEach((attempt,i)=>{
  report.line(`Attempt ${i+1} | ${stamp(attempt.at)} | Score: ${attempt.score}/100 | ${attempt.score>=80?'PASS':'BELOW MASTERY'}`,{bold:true});
  (attempt.questions?.length?attempt.questions:QUESTIONS34).forEach((q,j)=>{report.ensure(43);report.line(`Q${j+1} (${q.objective}) - ${Number(attempt.points?.[q.id]||0)}/10`,{bold:true,size:9});report.line(q.prompt,{size:9});report.line('Student response: '+niceAnswer(q,attempt.answers?.[q.id]),{size:9,indent:10});report.blank(2);});report.blank(6);
 });
}
