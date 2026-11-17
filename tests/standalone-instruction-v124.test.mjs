import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {render35Page,complete35} from '../js/topic35.js';
import {render36Page,complete36} from '../js/topic36.js';
import {render37Page,complete37} from '../js/topic37.js';
import {LESSON_INSTRUCTION_COUNTS,renderLessonInstruction} from '../js/topics/instruction35-37.js';
const groups=[['3.5',render35Page,8],['3.6',render36Page,5],['3.7',render37Page,5]];

test('every 3.5–3.7 lesson visibly teaches its concept before the activity',()=>{
  assert.deepEqual(LESSON_INSTRUCTION_COUNTS,{'3.5':8,'3.6':5,'3.7':5});
  for(const [topic,render,count] of groups){
    for(let n=1;n<=count;n++){
      const state={};const html=render(n,state,85);
      const panel=renderLessonInstruction(topic,n);
      assert.ok(html.startsWith(panel),`${topic}.${n}: instruction must be first`);
      assert.match(panel,/Learn the concept · before the experiment/);
      assert.match(panel,/What you need to know/);
      assert.match(panel,/Why the example works:/);
      assert.match(panel,/Your task in this lesson:/);
      assert.match(panel,/<pre><code>[\s\S]+?<\/code><\/pre>/);
      assert.doesNotMatch(panel,/estimated (?:time|minutes)|\d+ (?:minutes|periods) to (?:finish|complete)/i);
      assert.ok(html.includes('<section class="panel"')||html.includes('<details'),`${topic}.${n}: original lesson still present`);
    }
  }
});

test('instruction is read-only: no input, action, navigation, ID or answer leaks',()=>{
  for(const [topic,,count] of groups)for(let n=1;n<=count;n++){
    const html=renderLessonInstruction(topic,n);
    for(const disallowed of ['data-action=', 'data-nav=', '<input','<textarea','<select','teacher-answer','Teacher key:', 'data-page=']){
      assert.ok(!html.includes(disallowed),`${topic}.${n}: disallowed ${disallowed}`);
    }
  }
});

test('all existing lesson-completion predicates retain their original contracts',()=>{
  for(const [complete,count] of [[complete35,8],[complete36,5],[complete37,5]]){
    for(let n=1;n<=count;n++)assert.equal(complete(n,{}),false);
  }
  // No extra completion condition is added by displaying the new panels.
  assert.equal(renderLessonInstruction('3.4',1),'');
});

test('new instruction has legible responsive code and no source editor replacement',()=>{
  const css=readFileSync(new URL('../css/styles.css',import.meta.url),'utf8');
  assert.match(css,/\.topic-instruction-grid\{display:grid;/);
  assert.match(css,/@media\(max-width:900px\)\{\.topic-instruction-grid\{grid-template-columns:1fr\}/);
  assert.match(css,/\.topic-instruction-example pre\{[^}]*overflow-x:auto/);
  assert.match(render35Page(8,{},1),/id="35-code-editor"/);
  assert.match(render36Page(5,{},1),/id="36-code-editor"/);
  assert.match(render37Page(5,{},1),/id="37-code-editor"/);
});
