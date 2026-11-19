import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {render38Page} from '../js/topic38.js';
import {SHADOW_CASES38} from '../js/content38.js';

test('all four Topic 3.8 pages teach required concepts before interactive tasks',()=>{
  const expectations=[
    ['Variable scope','Interactive scope explorer', 'Instance variable','Block-local variable'],
    ['Calling a method','Read the caller code first','Read the complete method before predicting','Predict after reading both classes'],
    ['Shadowing','Shadowing</strong> occurs','Read, choose, inspect, check','choose a proposed repair'],
    ['Plan your class','method-local','DroneBattery: write a complete class','Before running your code']
  ];
  expectations.forEach((texts,i)=>{
    const html=render38Page(i+1,{},91);
    assert.match(html,/topic38-instruction/);
    assert.ok(html.indexOf('topic38-instruction')<html.indexOf('Practice · unlimited retries'));
    for(const t of texts)assert.ok(html.includes(t),`Topic 3.8.${i+1} missing ${t}`);
    assert.doesNotMatch(html,/estimated (?:minutes|time)|minutes to complete/i);
  });
});
test('3.8.2 gives BOTH complete Java classes before asking students to predict',()=>{
  const html=render38Page(2,{step:0},91);
  const caller=html.indexOf('public class Runner'),method=html.indexOf('public class RewardCalc'),pred=html.indexOf('3 · Predict after reading both classes'),trace=html.indexOf('4 · Step through execution');
  assert.ok(caller>=0&&method>caller&&pred>method&&trace>pred,`Incorrect ordering: ${[caller,method,pred,trace]}`);
  assert.match(html,/int bonus = amount \/ 2/);
  assert.match(html,/return amount;/);
});
test('3.8.3 gives five aligned repair selectors and preview code for every choice',()=>{
  const base=render38Page(3,{},91);
  assert.match(base,/topic38-case-picker/);
  assert.match(base,/Shadowing/);
  assert.doesNotMatch(base,/Test your repair/);
  for(const item of SHADOW_CASES38){
    assert.equal(item.options.length,3);
    assert.equal(item.revisions.length,3);
    for(let j=0;j<3;j++){
      const html=render38Page(3,{selected:item.id,choices:{[item.id]:j}},91);
      assert.match(html,/Proposed Java code/);
      assert.match(html,/Original Java code/);
      assert.ok(html.includes(item.revisions[j].split('\n')[0]));
      assert.match(html,/Check selected repair/);
      assert.ok(item.revisions[j]!==item.code,`Candidate code unchanged for ${item.id} option ${j}`);
    }
  }
});
test('3.8.3 all five correct repair examples compile in real Java',()=>{
  const dir=mkdtempSync(join(tmpdir(),'apcsa38javac-'));
  try{
    for(const s of SHADOW_CASES38){
      const cls=/public class (\w+)/.exec(s.code)[1];
      const f=join(dir,`${cls}.java`);
      writeFileSync(f,s.revisions[s.answer]);
      execFileSync('javac',['-d',dir,f],{timeout:10000,stdio:'pipe'});
    }
  }finally{rmSync(dir,{recursive:true,force:true});}
});
