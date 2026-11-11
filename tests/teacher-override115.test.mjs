import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {blankState,normalizeState} from '../js/storage.js';
import {applyProgressOverride} from '../js/teacher-overrides.js';
import {topicUnlocked,pageUnlocked,topicCompleted} from '../js/registry.js';
test('teacher lesson exception saves a reason, unlocks next lesson, and never changes assessment scores',()=>{
 let s=blankState();s.identity={first:'Alex',last:'R'};
 s.assessments['3.5'].attempts=[{score:50}];
 applyProgressOverride(s,{kind:'lesson',key:'3.5.1',reason:'Worked offline',at:'2026-11-11'});
 assert.equal(s.pages['3.5.1'].completed,true);
 assert.equal(s.overrides.lessons['3.5.1'].reason,'Worked offline');
 assert.equal(s.assessments['3.5'].attempts[0].score,50);
 assert.equal(s.events.at(-1).kind,'teacher-progress-override');
 applyProgressOverride(s,{kind:'lesson',key:'3.5.1',revoke:true});
 assert.equal(s.pages['3.5.1'].completed,false);
 assert.equal(s.overrides.lessons['3.5.1'],undefined);
});
test('teacher prerequisite exception opens topic without fabricating a pass or unlocking other topics',()=>{
 let s=blankState();s.identity={first:'Alex',last:'R'};assert.equal(topicUnlocked(s,'3.6'),false);
 applyProgressOverride(s,{kind:'topic',key:'3.6',reason:'Transferred class',at:'2026-11-11'});
 assert.equal(topicUnlocked(s,'3.6'),true);
 assert.equal(topicUnlocked(s,'3.7'),false);
 assert.equal(s.assessments['3.5'].attempts.length,0);
 assert.equal(s.assessments['3.6'].attempts.length,0);
 const restored=normalizeState(JSON.parse(JSON.stringify(s)));
 assert.equal(topicUnlocked(restored,'3.6'),true);
 assert.equal(restored.overrides.topics['3.6'].reason,'Transferred class');
 applyProgressOverride(restored,{kind:'topic',key:'3.6',revoke:true});assert.equal(topicUnlocked(restored,'3.6'),false);
});
test('teacher exceptions cannot target unknown lessons or create first-topic prerequisites',()=>{
 let s=blankState();s.identity={first:'Alex',last:'R'};
 assert.throws(()=>applyProgressOverride(s,{kind:'lesson',key:'not-a-lesson'}),/Unknown lesson/);
 assert.throws(()=>applyProgressOverride(s,{kind:'topic',key:'3.1'}),/prerequisite/);
 assert.throws(()=>applyProgressOverride(s,{kind:'topic',key:'3.9'}),/prerequisite/);
 assert.equal(s.events.length,0);
});
test('student-facing updates are focus-preserving and use current completion data',()=>{
 const s=readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
 assert.match(s,/function syncLiveProgress\(/);
 assert.match(s,/scheduleLiveProgress\(\)/);
 assert.match(s,/active input or editor/);
 assert.match(s,/const commit=\(\)=>\{updateCompletion\(\);store\(\);scheduleLiveProgress\(\);\}/);
});
