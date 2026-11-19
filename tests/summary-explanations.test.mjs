import test from 'node:test';
import assert from 'node:assert/strict';
import {SUMMARY_PARTS, REVIEW_QUESTION_COUNT} from '../js/content-summary.js';
import {createUnitSummary} from '../js/unit-summary.js';
import {blankState} from '../js/storage.js';

test('all 28 summary answers have distinct, substantive explanations',()=>{
 assert.equal(REVIEW_QUESTION_COUNT,28);
 for(const part of SUMMARY_PARTS)for(const q of part.questions){
  assert.ok(q.explanation.length>=95,`${q.id}: explanation too short`);
  assert.notEqual(q.explanation,q.options[q.answer],q.id);
  assert.notEqual(q.explanation,q.hint,q.id);
 }
});

test('correct summary answers display reasoning, not answer-choice echo',()=>{
 const st=blankState();
 st.review3={parts:{0:{answers:{'r1-1':1},solved:{'r1-1':true},attempts:{'r1-1':1}}}};
 const unit=createUnitSummary({view:()=>st,store:()=>{},go:()=>{},render:()=>{},teacherOn:()=>true,toast:()=>{},link:()=>'',recordEvent:()=>{}});
 const html=unit.page(1);
 const q=SUMMARY_PARTS[0].questions[0];
 assert.ok(html.includes(q.explanation));
 assert.ok(!html.includes(`Correct. ${q.options[q.answer]}`));
});
