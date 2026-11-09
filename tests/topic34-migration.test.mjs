import test from 'node:test';
import assert from 'node:assert/strict';
import {blankState,normalizeState} from '../js/storage.js';
import {grade34} from '../js/topic34.js';
import {QUESTIONS34} from '../js/content34.js';

test('v1.7 backups retain older records while mapping 3.4 activity evidence to revised page order',()=>{
 const old=blankState();delete old.topic34Revision;
 old.identity={first:'Jordan',last:'M'};
 old.pages['3.3.4']={completed:true,completedAt:'2026-11-05',data:{reflection:'Approved existing lesson.'}};
 old.pages['3.4.3']={completed:true,completedAt:'2026-11-06',data:{body:'owner = newOwner;\ntickets = initialTickets;',workshopPassed:true,answers:{w1:1,w2:0}}};
 old.pages['3.4.4']={completed:true,completedAt:'2026-11-06',data:{multi:{score:'correct',lives:'correct'},multiPassed:true,answers:{m1:2,m2:0,m3:3}}};
 old.pages['3.4.5']={completed:true,completedAt:'2026-11-06',data:{explored:['alias-original','alias-card','copy-original','copy-card'],reflection:'Prior answer recorded.'}};
 const submitted={at:'2026-11-06',score:80,questions:QUESTIONS34.map(q=>({...q})),answers:{u34q1:1}};
 old.assessments['3.4'].attempts.push(submitted);old.assessments['3.4'].locked=true;
 const newSave=normalizeState(old);
 assert.equal(newSave.topic34Revision,2);
 assert.equal(newSave.pages['3.3.4'].data.reflection,'Approved existing lesson.');
 assert.equal(newSave.pages['3.4.3'].data.multiPassed,true);
 assert.equal(newSave.pages['3.4.3'].completed,true);
 assert.match(newSave.pages['3.4.4'].data.workshop.prize.code,/public PrizeCard\(String newOwner, int initialTickets\)/);
 assert.match(newSave.pages['3.4.4'].data.workshop.prize.code,/tickets = initialTickets/);
 assert.equal(newSave.pages['3.4.4'].completed,false,'full-constructor requirements must be completed');
 assert.equal(newSave.pages['3.4.5'].completed,false,'third copy implementation has not been tried');
 assert.equal(newSave.assessments['3.4'].attempts.length,1);
 assert.equal(newSave.assessments['3.4'].attempts[0].score,80);
 assert.equal(newSave.assessments['3.4'].locked,true);
 const again=normalizeState(newSave);
 assert.deepEqual(again.pages['3.4.3'],newSave.pages['3.4.3'],'migration runs only once');
 assert.deepEqual(again.pages['3.4.4'],newSave.pages['3.4.4']);
});

test('fresh progress is marked with the revised 3.4 schema without changing base save version',()=>{
 const st=blankState();assert.equal(st.schema,1);assert.equal(st.topic34Revision,2);
 assert.equal(normalizeState(st).topic34Revision,2);
});
