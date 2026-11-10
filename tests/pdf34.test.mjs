import test from 'node:test';
import assert from 'node:assert/strict';
import {blankState} from '../js/storage.js';
import {QUESTIONS34,DEFAULT_FIELDS,CONSTRUCTOR_CHALLENGES} from '../js/content34.js';
import {createReport} from '../js/pdf.js';

test('Topic 3.4 individual and cumulative PDF include saved constructor code, object experiments, and all graded answers',async()=>{
 const st=blankState();st.identity={first:'Avery',last:'K'};
 for(let i=1;i<=5;i++)st.pages[`3.4.${i}`]={completed:true,completedAt:'2026-11-07T15:00:00Z',data:{}};
 st.pages['3.4.2'].data={defaults:Object.fromEntries(DEFAULT_FIELDS.map(x=>[x.id,x.answer]))};
 st.pages['3.4.3'].data={multi:{score:'correct',lives:'correct'},multiPassed:true};
 st.pages['3.4.4'].data={workshop:Object.fromEntries(CONSTRUCTOR_CHALLENGES.map(c=>[c.id,{code:'public '+c.className+'('+c.paramHints+') { owner = newOwner; tickets = initialTickets; }'}])),workshopPasses:{prize:true,machine:true,player:true}};
 st.pages['3.4.5'].data={copyMode:'copy',lastVerifiedMode:'copy',explored:['alias-original','alias-card','copy-original','copy-card'],reflection:'The card gets its own new TicketBalance, so mutating original no longer changes the card balance.'};
 st.assessments['3.4'].attempts=[{at:'2026-11-07T15:00:00Z',score:90,answers:Object.fromEntries(QUESTIONS34.map(q=>[q.id,q.kind==='choice'?q.answer:Object.fromEntries(q.items.map(([,v],i)=>[i,v]))])),points:Object.fromEntries(QUESTIONS34.map(q=>[q.id,10])),questions:QUESTIONS34.map(q=>({...q}))}];
 let blob;global.document={body:{appendChild(){}},createElement:()=>({click(){},remove(){}})};URL.createObjectURL=v=>{blob=v;return 'blob:test'};URL.revokeObjectURL=()=>{};
 const topic=createReport(st,{topic:'3.4'});assert.match(topic.filename,/Topic3-4_Avery_K/);assert.ok(topic.pages>=3);
 let pdf=await blob.text();assert.match(pdf,/Topic 3.4/);assert.match(pdf,/public PrizeCard/);assert.match(pdf,/owner = newOwner/);assert.match(pdf,/tickets = initialTickets/);assert.match(pdf,/public ArcadeMachine/);assert.match(pdf,/The card gets its own/);assert.match(pdf,/Q10/);assert.match(pdf,/90\/100/);
 let match=/startxref\n(\d+)\n%%EOF$/.exec(pdf);assert.ok(match);assert.equal(pdf.slice(Number(match[1]),Number(match[1])+4),'xref');
 const cumulative=createReport(st,{cumulative:true});assert.ok(cumulative.pages>=5);
 pdf=await blob.text();assert.match(pdf,/Topic 3.1/);assert.match(pdf,/Topic 3.2/);assert.match(pdf,/Topic 3.3/);assert.match(pdf,/Topic 3.4/);assert.match(pdf,/Topics 3.6-3.9 remain in development/);
});
