import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {blankState} from '../js/storage.js';import {createReport} from '../js/pdf.js';
import {PRACTICE38,QUESTIONS38} from '../js/content38.js';import {evaluateClass38} from '../js/topics/scope-engine38.js';
function capture(){let blob;global.document={body:{appendChild(){}},createElement:()=>({click(){},remove(){}})};URL.createObjectURL=x=>(blob=x,'blob:offline');URL.revokeObjectURL=()=>{};return ()=>blob;}
test('Topic 3.8 and cumulative PDF capture student class, all original questions, teacher exceptions and valid PDF structure',async()=>{
 const blob=capture(),st=blankState();st.identity={first:'Avery',last:'M'};
 for(let n=1;n<=4;n++)st.pages[`3.8.${n}`]={completed:true,data:{answers:Object.fromEntries(PRACTICE38[n].map(q=>[q.id,q.answer]))}};
 const code=readFileSync(new URL('./fixtures/solution38.txt',import.meta.url),'utf8');st.pages['3.8.4'].data.fullClass={code,passed:true,result:evaluateClass38(code)};
 st.assessments['3.8'].attempts=[{at:'2026-11-16',score:80,answers:Object.fromEntries(QUESTIONS38.map(q=>[q.id,q.answer])),points:Object.fromEntries(QUESTIONS38.map(q=>[q.id,10])),questions:QUESTIONS38}];
 st.overrides.topics['3.8']={at:'2026-11-16',reason:'Review'};
 const result=createReport(st,{topic:'3.8'}),pdf=await blob().text();assert.match(result.filename,/Topic3-8/);assert.match(pdf,/DroneBattery/);assert.match(pdf,/completeFlight/);assert.match(pdf,/Q10/);assert.match(pdf,/Teacher-authorized progress exceptions/);
 const match=/startxref\n(\d+)\n%%EOF$/.exec(pdf);assert.ok(match);assert.equal(pdf.slice(Number(match[1]),Number(match[1])+4),'xref');
 createReport(st,{cumulative:true});const cumulative=await blob().text();assert.match(cumulative,/Topic 3.8/);assert.match(cumulative,/Unit 3 Summary \| Cumulative review/);
});
