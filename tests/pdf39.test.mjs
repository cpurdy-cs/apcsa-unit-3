import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {blankState} from '../js/storage.js';
import {createReport} from '../js/pdf.js';
import {PRACTICE39,RECEIVER_CASES39,SHADOW_CASES39,PASS_CASES39,QUESTIONS39} from '../js/content39.js';
import {evaluateClass39} from '../js/topics/this-engine39.js';
function capture(){let blob;global.document={body:{appendChild(){}},createElement:()=>({click(){},remove(){}})};URL.createObjectURL=x=>(blob=x,'blob:offline');URL.revokeObjectURL=()=>{};return ()=>blob;}
test('Topic 3.9 and cumulative PDFs contain Contact source, reviewed answers and existing grades',async()=>{
 const blob=capture(),st=blankState();st.identity={first:'Casey',last:'L'};
 for(let n=1;n<=4;n++)st.pages[`3.9.${n}`]={completed:true,completedAt:'2026-11-18T18:00:00Z',data:{correct:PRACTICE39[n].map(q=>q.id),solved:(n===1?RECEIVER_CASES39:n===2?SHADOW_CASES39:n===3?PASS_CASES39:[]).map(x=>x.id)}};
 const source=readFileSync(new URL('./fixtures/solution39.txt',import.meta.url),'utf8');st.pages['3.9.4'].data.fullClass={code:source,passed:true,result:evaluateClass39(source)};
 st.assessments['3.9'].attempts=[{at:'2026-11-18T19:00:00Z',score:90,answers:Object.fromEntries(QUESTIONS39.map(q=>[q.id,q.answer])),points:Object.fromEntries(QUESTIONS39.map(q=>[q.id,10])),questions:QUESTIONS39.map(q=>({...q,kind:'choice'}))}];
 st.assessments['3.5'].attempts.push({score:90,at:'2026-10-22T00:00:00Z'});
 let out=createReport(st,{topic:'3.9'}),pdf=await blob().text();
 assert.match(out.filename,/Topic3-9/);assert.match(pdf,/Independent Contact class/);assert.match(pdf,/sendTo/);assert.match(pdf,/getLastSender/);assert.match(pdf,/Q10/);assert.match(pdf,/Attempt 1/);
 createReport(st,{cumulative:true});pdf=await blob().text();assert.match(pdf,/Topic 3.9/);assert.match(pdf,/Unit 3 Summary/);assert.match(pdf,/3.5/);
});
