import test from 'node:test';
import assert from 'node:assert/strict';
import {PAGE39, QUESTIONS39} from '../js/content39.js';
import {QUESTIONS37} from '../js/content37.js';
import {render39Page,render39Check} from '../js/topic39.js';
import {compileClass39} from '../js/topics/this-engine39.js';
import {readFileSync} from 'node:fs';

test('Topic 3.9 titles never show Markdown backticks, and Java keywords are formatted as code in lesson prose',()=>{
  for (const item of PAGE39) assert.doesNotMatch(item.title, /`/, item.title);
  for(let i=1;i<=4;i++){
    const html=render39Page(i,{},42);
    assert.doesNotMatch(html, /`this(?:\.|)`/);
    assert.match(html, /<code>this(?:\.\w+)?<\/code>/);
    assert.match(html, /Learn first/);
  }
});

test('First 3.9 lesson teaches from prior instance-method knowledge before making predictions',()=>{
  const html=render39Page(1,{},42);
  const messages=['You already know how to create objects','receiving object','the current object','instance method','constructor','Java makes it available automatically','not a new object','do the same thing','private int count;','public class Runner','first.add(3);','second.getCount()'];
  for(const phrase of messages)assert.ok(html.includes(phrase), `Missing instructional concept or context: ${phrase}`);
  assert.ok(html.indexOf('Why does Java need')<html.indexOf('Follow three method calls'));
  assert.ok(html.indexOf('Worked example')<html.indexOf('Follow three method calls'));
  assert.match(html,/first: 2 → 5/);
  assert.match(html,/second.*still has a count of 8/);
});

test('All correct instance-variable examples in Topic 3.9 are private; 3.7 static exercise is AP encapsulation-consistent',()=>{
  for(let i=1;i<=4;i++){
    const html=render39Page(i,{},42);
    assert.doesNotMatch(html, /public int (?:count|width|size|rank)\s*;/);
  }
  const staticExample=QUESTIONS37.find(q=>q.id==='q3');
  assert.ok(staticExample,'Existing 3.7 question missing');
  assert.match(staticExample.code,/private int rank = 0;/);
  assert.doesNotMatch(staticExample.code,/public int rank/);
  assert.equal(staticExample.answer,0,'Existing answer index remains unchanged');
});

test('Grading and previous practice IDs are not modified by instructional clarification',()=>{
  assert.equal(QUESTIONS39.length,10);
  for(let i=1;i<=4;i++)assert.match(render39Page(i,{},42),/Check your understanding/);
  const html=render39Check({draft:{}},42,false);
  assert.doesNotMatch(html,/Teacher key/);
});

test('Contact invalid-source diagnostic names the correct private instance variables',()=>{
  const src=readFileSync(new URL('./fixtures/solution39.txt',import.meta.url),'utf8');
  assert.throws(()=>compileClass39(src.replace('private Contact lastSender;', '')),/private String name; and private Contact lastSender/);
});
