import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderLessonInstruction} from '../js/topics/instruction35-37.js';
import {render38Page} from '../js/topic38.js';
import {render39Page} from '../js/topic39.js';
import {SUMMARY_PARTS} from '../js/content-summary.js';

test('the generic Java term field is introduced once, followed by specific terms',()=>{
  const src=readFileSync(new URL('../js/topics/topic31.js',import.meta.url),'utf8');
  assert.match(src,/Java terminology:<\/strong> A <em>field<\/em> is a variable declared in a class/);
  assert.match(src,/instance variable<\/strong> for each object's own data/);
  assert.match(src,/class variable<\/strong> for shared/);
});

test('static state is called a class variable, never a static instance variable',()=>{
  const staticLessons=[1,2,3,4,5].map(n=>renderLessonInstruction('3.7',n));
  assert.ok(staticLessons.every(x=>x.includes('class variable')||x.includes('shared')));
  const finalLesson=staticLessons[3];
  assert.match(finalLesson,/a class variable belongs to the class/);
  assert.match(finalLesson,/own final instance variable/);
  for(const html of staticLessons){
    assert.doesNotMatch(html,/\bstatic\s+(?:instance variable|instance variables)\b/i);
    assert.doesNotMatch(html,/\binstance variable belongs to the class\b/i);
  }
});

test('scope, shadowing, current-object lessons, and review consistently name instance variables',()=>{
  assert.match(render38Page(1,{},42),/Instance variable<\/strong>/);
  assert.match(render39Page(2,{},42),/instance variable/);
  assert.match(renderLessonInstruction('3.5',2),/instance variable/);
  const review=JSON.stringify(SUMMARY_PARTS);
  assert.match(review,/class variables/);
  assert.match(review,/instance variables/);
  assert.doesNotMatch(review,/\b(?:fields|instance fields|static fields)\b/i);
  assert.equal(SUMMARY_PARTS.reduce((n,part)=>n+part.questions.length,0),28);
});
