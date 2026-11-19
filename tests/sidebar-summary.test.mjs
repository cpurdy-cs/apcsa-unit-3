import test from 'node:test';
import assert from 'node:assert/strict';
import {blankState} from '../js/storage.js';
import {IMPLEMENTED_TOPICS} from '../js/registry.js';
import {topicSidebarStates,renderSidebarTopics} from '../js/sidebar-status.js';
import {renderUnitSummaryNav} from '../js/unit-summary.js';

function completedTopicsState(){
 const st=blankState();
 for(const topic of IMPLEMENTED_TOPICS){
  for(let n=1;n<=topic.lessons.length;n++)st.pages[topic.pageId(n)]={completed:true,data:{}};
  st.assessments[topic.id].attempts.push({score:90});
 }
 return st;
}

test('summary route leaves every topic unselected, including Topic 3.1',()=>{
 const st=completedTopicsState();
 const states=topicSidebarStates(st,false,'');
 assert.ok(states.every(t=>!t.isActive));
 assert.ok(states.every(t=>t.status==='completed'));
 const html=renderSidebarTopics(st,false,'');
 assert.doesNotMatch(html,/topic-nav-entry active/);
 assert.doesNotMatch(html,/sidebar-lesson-list/);
 const summary=renderUnitSummaryNav(st,false,'summary');
 assert.match(summary,/summary-nav/);
 assert.match(summary,/topic-item current/);
});

test('unit-complete route does not highlight Topic 3.1 or expand topics',()=>{
 const st=completedTopicsState();
 assert.ok(topicSidebarStates(st,false,'').every(t=>!t.isActive));
 assert.doesNotMatch(renderSidebarTopics(st,false,''),/topic-nav-entry active/);
});

test('automatic next-topic highlighting still works when argument omitted',()=>{
 const st=blankState();
 const states=topicSidebarStates(st);
 assert.equal(states.find(t=>t.id==='3.1').isActive,true);
 assert.equal(states.filter(t=>t.isActive).length,1);
 assert.equal(topicSidebarStates(st,false,'').filter(t=>t.isActive).length,0);
 assert.equal(topicSidebarStates(st,false,'3.1').find(t=>t.id==='3.1').isActive,true);
});


test('review sidebar marks exactly the selected review part as current',()=>{
 const st=completedTopicsState();
 for(let part=1;part<=4;part++){
  const html=renderUnitSummaryNav(st,true,'summary',part);
  const buttons=[...html.matchAll(/<button class="sidebar-lesson ([^"]+)" data-nav="#\/summary\/(\d)"([^>]*)>/g)];
  assert.equal(buttons.length,4);
  for(const [,classes,index,attributes] of buttons){
   assert.equal(classes.split(' ').includes('current'),Number(index)===part,`part ${part}, button ${index}`);
   assert.equal(attributes.includes('aria-current="page"'),Number(index)===part);
  }
  assert.match(html,/topic-nav-entry summary-nav active/);
 }
});

test('finish route does not highlight any review part',()=>{
 const html=renderUnitSummaryNav(completedTopicsState(),true,'finish',null);
 assert.doesNotMatch(html,/sidebar-lesson current/);
 assert.doesNotMatch(html,/summary-nav active/);
});
