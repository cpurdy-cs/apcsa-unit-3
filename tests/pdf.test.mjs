import test from 'node:test';
import assert from 'node:assert/strict';
import {QUESTIONS,CHALLENGES} from '../js/content.js';
import {blankState} from '../js/storage.js';
import {createReport} from '../js/pdf.js';

test('offline topic and cumulative PDFs contain full graded answers and valid cross references',async()=>{
 const x=blankState();x.identity={first:'Jamie',last:'K'};
 for(let i=1;i<=4;i++)x.pages[i]={completed:true,completedAt:'2026-11-05T12:00:00.000Z',data:{challengeResponses:Object.fromEntries(CHALLENGES[i].map((q,j)=>[j,q.answer]))}};
 x.pages[4].data.reflection='Score and addScore belong together because they represent and modify the state of a particular player.';
 const answers=Object.fromEntries(QUESTIONS.map(q=>[q.id,q.kind==='choice'?q.answer:Object.fromEntries(q.items.map(([,c],i)=>[i,c]))]));
 const points=Object.fromEntries(QUESTIONS.map(q=>[q.id,10]));
 x.assessments['3.1']={draft:{},locked:true,attempts:[{score:100,at:'2026-11-05T12:00:00.000Z',answers,points,questionBank:'2025-U3.1-v1',questions:QUESTIONS.map(q=>({id:q.id,kind:q.kind,area:q.area,objective:q.objective,prompt:q.prompt,options:q.options,items:q.items}))}]};
 let lastBlob;
 global.document={body:{appendChild(){}},createElement:()=>({click(){},remove(){}})};
 URL.createObjectURL=blob=>{lastBlob=blob;return 'blob:test';};URL.revokeObjectURL=()=>{};
 for(const cumulative of [false,true]){
  const result=createReport(x,{cumulative});
  assert.match(result.filename,cumulative?/Cumulative/:/Topic3-1/);
  assert.ok(result.pages>=2);
  const data=await lastBlob.text();
  assert.ok(data.startsWith('%PDF-1.4'));
  assert.match(data,/Jamie K/);
  assert.match(data,/Q10/);
  assert.match(data,/Student response/);
  assert.match(data,/Transfer challenges/);
  const m=/startxref\n(\d+)\n%%EOF$/.exec(data);
  assert.ok(m);assert.equal(data.slice(Number(m[1]),Number(m[1])+4),'xref');
  if(cumulative)assert.match(data,/Topics 3.7-3.9 remain in development/i);
 }
});
