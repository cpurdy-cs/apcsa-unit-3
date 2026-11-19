import test from 'node:test';
import assert from 'node:assert/strict';
import {blankState,exportJson,normalizeState} from '../js/storage.js';
import {verifyStudentSwitchBackup,saveBlankStudentBeforeSwitch} from '../js/switch-student.js';

const state=()=>{
 const st=blankState();
 st.identity={first:'Alex',last:'R'};
 st.joinedAt='2026-11-18T13:00:00.000Z';
 st.pages[1]={completed:true,completedAt:'2026-11-18T14:00:00.000Z',data:{answers:['1','2'],code:'score += 3;'}};
 st.assessments['3.1'].attempts=[{score:90,at:'2026-11-18T15:00:00.000Z',answers:{q1:2}}];
 st.updatedAt='2026-11-18T15:00:01.000Z';
 return st;
};
const makeFile=(value,name='APCSA_Unit3_Progress_Alex_R.json')=>({name,size:JSON.stringify(value).length,text:async()=>JSON.stringify(value)});
const backup=st=>({...structuredClone(st),exportedAt:'2026-11-18T15:00:02.000Z'});

test('switch verifier accepts an exact current-state backup with export metadata',async()=>{
 const st=state(),file=makeFile(backup(st));
 assert.equal(await verifyStudentSwitchBackup(file,st),file.name);
});
test('switch verifier rejects an older backup after a lesson or assessment change',async()=>{
 const st=state(),old=backup(st);
 st.pages[1].data.code='score += 5;';
 await assert.rejects(verifyStudentSwitchBackup(makeFile(old),st),/does not match/);
 st.pages[1].data.code='score += 3;';
 st.assessments['3.1'].attempts.push({score:100});
 await assert.rejects(verifyStudentSwitchBackup(makeFile(old),st),/does not match/);
});
test('switch verifier rejects other-student, malformed, non-export and oversized files',async()=>{
 const st=state(),other=backup(state());other.identity.first='Jordan';
 await assert.rejects(verifyStudentSwitchBackup(makeFile(other),st),/does not match/);
 await assert.rejects(verifyStudentSwitchBackup({name:'bad.json',size:6,text:async()=>'{bad'},st),/not valid JSON/);
 await assert.rejects(verifyStudentSwitchBackup(makeFile(st),st),/not a progress backup/);
 await assert.rejects(verifyStudentSwitchBackup({name:'huge.json',size:2_000_001,text:async()=>''},st),/too large/);
 await assert.rejects(verifyStudentSwitchBackup(null,st),/Choose/);
});
test('blank record is not activated when localStorage write fails',()=>{
 const current=state(),persisted=structuredClone(current);
 assert.throws(()=>saveBlankStudentBeforeSwitch(blankState,()=>false),/NOT cleared/);
 assert.deepEqual(persisted,current);
 const next=saveBlankStudentBeforeSwitch(blankState,x=>{assert.equal(x.identity,null);return true;});
 assert.equal(next.identity,null);
 assert.equal(Object.keys(next.pages).length,0);
});
test('v1.x records and backups still normalize with schema 1',()=>{
 const st=state();
 const restored=normalizeState(backup(st));
 assert.equal(restored.identity.first,'Alex');
 assert.equal(restored.pages[1].data.code,st.pages[1].data.code);
 assert.equal(restored.assessments['3.1'].attempts[0].score,90);
});
