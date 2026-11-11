import test from 'node:test';
import assert from 'node:assert/strict';
import {blankState} from '../js/storage.js';
import {BUILD_SLOTS,QUESTIONS33} from '../js/content33.js';
import {createReport} from '../js/pdf.js';
test('Topic 3.3 PDF includes student-built class, practice explanation, and saved graded answers',async()=>{
 const st=blankState();st.identity={first:'Morgan',last:'L'};
 for(let i=1;i<=4;i++)st.pages[`3.3.${i}`]={completed:true,completedAt:'2026-11-05',data:{}};
 st.pages['3.3.4'].data={build:Object.fromEntries(BUILD_SLOTS.map(s=>[s.id,'correct'])),validated:true,clientChecked:true,reflection:'The tickets field is private, and other classes use the public getter for controlled access.'};
 st.assessments['3.3'].attempts.push({at:'2026-11-05',score:90,points:Object.fromEntries(QUESTIONS33.map(q=>[q.id,10])),answers:Object.fromEntries(QUESTIONS33.map(q=>[q.id,q.kind==='choice'?q.answer:Object.fromEntries(q.items.map(([,answer],i)=>[i,answer]))])),questions:QUESTIONS33.map(q=>({...q}))});
 let blob;global.document={body:{appendChild(){}},createElement:()=>({click(){},remove(){}})};
 URL.createObjectURL=v=>{blob=v;return 'blob:test'};URL.revokeObjectURL=()=>{};
 const topic=createReport(st,{topic:'3.3'});assert.ok(topic.pages>=2);assert.match(topic.filename,/Topic3-3_Morgan_L/);
 const pdf=await blob.text();assert.match(pdf,/public class PrizeCard/);assert.match(pdf,/private int tickets/);assert.match(pdf,/The tickets field is private/);assert.match(pdf,/Q10/);assert.match(pdf,/90\/100/);
 const index=/startxref\n(\d+)\n%%EOF$/.exec(pdf);assert.ok(index);assert.equal(pdf.slice(Number(index[1]),Number(index[1])+4),'xref');
 const cumulative=createReport(st,{cumulative:true});assert.ok(cumulative.pages>=3);
 const all=await blob.text();assert.match(all,/Topic 3.1/);assert.match(all,/Topic 3.2/);assert.match(all,/Topic 3.3/);assert.match(all,/Topics 3.7-3.9 remain in development/);
});
