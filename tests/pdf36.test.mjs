import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {blankState} from '../js/storage.js';import {createReport} from '../js/pdf.js';import {QUESTIONS36,PRACTICE36} from '../js/content36.js';import {evaluateClass36} from '../js/topics/reference-engine36.js';
const getPdf=()=>{let blob;global.document={body:{appendChild(){}},createElement:()=>({click(){},remove(){}})};URL.createObjectURL=x=>(blob=x,'blob:test');URL.revokeObjectURL=()=>{};return ()=>blob;};
test('Topic 3.6 PDF includes identity exercise, 18 tests, graded responses and teacher exceptions',async()=>{
 const getBlob=getPdf(),st=blankState();st.identity={first:'Jordan',last:'L'};
 for(let n=1;n<=5;n++)st.pages[`3.6.${n}`]={completed:true,data:{answers:Object.fromEntries(PRACTICE36[n].map(q=>[q.id,q.answer]))}};
 const source=readFileSync(new URL('./fixtures/solution36.txt',import.meta.url),'utf8');st.pages['3.6.5'].data.fullClass={code:source,result:evaluateClass36(source),passed:true};
 st.assessments['3.6'].attempts=[{at:'2026-11-11',score:80,questions:QUESTIONS36,answers:Object.fromEntries(QUESTIONS36.map(q=>[q.id,q.answer])),points:Object.fromEntries(QUESTIONS36.map(q=>[q.id,10]))}];
 st.overrides.topics['3.6']={at:'2026-11-11',reason:'Transferred in'};
 const res=createReport(st,{topic:'3.6'}),blob=getBlob(),txt=await blob.text();assert.match(res.filename,/Topic3-6/);assert.ok(res.pages>=2);assert.match(txt,/Independent WaterTank class/);assert.match(txt,/transferTo/);assert.match(txt,/chooseLowerLevel/);assert.match(txt,/Q10/);assert.match(txt,/Teacher-authorized progress exceptions/);assert.match(txt,/no score awarded/);
 const m=/startxref\n(\d+)\n%%EOF$/.exec(txt);assert.ok(m);assert.equal(txt.slice(Number(m[1]),Number(m[1])+4),'xref');
 createReport(st,{cumulative:true});const cumulative=await getBlob().text();assert.match(cumulative,/Topic 3.6/);assert.match(cumulative,/Topics 3.7-3.9 remain in development/);
});
