import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {render39Page,complete39} from '../js/topic39.js';
import {PASS_CASES39,PRACTICE39,PARTICIPANT39,GROUP39,JOIN_CALLER39,STATIC_BAD39} from '../js/content39.js';
const allCorrect=PRACTICE39[3].map(x=>x.id);

test('3.9.3 directly demonstrates passing this with one short example and the static restriction',()=>{
 const html=render39Page(3,{},42);
 for(const marker of ['Runner.java — caller','Participant.java — instance method','Group.java — receiving method','group.add(this)']) assert.ok(html.includes(marker),marker);
 assert.ok(html.indexOf('Learn first')<html.indexOf('Two rules about this'));
 assert.match(html,/group\.add\(this\)/);
 assert.doesNotMatch(html,/SensorDisplay|ChargingStation|ScoreBoard|new Robot/);
 assert.equal(PASS_CASES39.length,2);
});
test('3.9.3 shows static Java compiler restriction with complete method and caller',()=>{
 const html=render39Page(3,{passStep:1},42);
 assert.match(html,/public static void join/);
 assert.match(html,/Participant\.join\(group\)/);
 assert.match(STATIC_BAD39,/group\.add\(this\)/);
 assert.match(PARTICIPANT39,/public void join\(Group group\)/);
 assert.match(GROUP39,/public void add\(Participant p\)/);
 assert.match(JOIN_CALLER39,/group\.getMember\(\) == p/);
 assert.doesNotMatch(html,/SensorDisplay|ChargingStation/);
});
test('3.9.3 has two required predictions and a two-question knowledge check',()=>{
 const solved=PASS_CASES39.map(x=>x.id);
 assert.equal(complete39(3,{solved,correct:allCorrect}),true);
 assert.equal(complete39(3,{solved:solved.slice(0,1),correct:allCorrect}),false);
 assert.equal(complete39(3,{solved,correct:[]}),false);
});
