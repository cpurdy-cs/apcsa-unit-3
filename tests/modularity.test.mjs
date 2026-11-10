import test from 'node:test';
import assert from 'node:assert/strict';
import {UNIT} from '../js/content.js';
import {createTopicRegistry,TOPICS,IMPLEMENTED_TOPICS,getImplementedTopic,topicProgress,topicCompleted,topicUnlocked,pageUnlocked} from '../js/registry.js';
import {blankState,normalizeState,assessment} from '../js/storage.js';
import {readFileSync} from 'node:fs';

// A new topic registers its own renderer and report writer. The older topic source
// files are not required to change when a new plugin is installed in the registry.
test('future topic can be plugged into generic progression without changing old lesson controllers',()=>{
 const fake=(id,count)=>({lessons:Array.from({length:count},(_,i)=>({title:`${id} lesson ${i+1}`})),pageId:n=>id==='3.1'?n:`${id}.${n}`,create:()=>({}),writeReport:()=>{}});
 const mockRegistry=createTopicRegistry(UNIT,{'3.1':fake('3.1',4),'3.2':fake('3.2',3),'3.3':fake('3.3',4)});
 assert.equal(mockRegistry.find(t=>t.id==='3.3').implemented,true);
 assert.equal(mockRegistry.find(t=>t.id==='3.4').implemented,false);
 const st=blankState();
 assert.equal(topicUnlocked(st,'3.3',false,mockRegistry),false);
 assert.equal(pageUnlocked(st,'3.3',1,false,mockRegistry),false);
 assert.equal(pageUnlocked(st,'3.3',1,true,mockRegistry),true,'teacher preview can see future registered content');
 st.assessments['3.2'].attempts.push({score:87.5});
 assert.equal(topicUnlocked(st,'3.3',false,mockRegistry),true);
 assert.equal(pageUnlocked(st,'3.3',1,false,mockRegistry),true);
 assert.equal(pageUnlocked(st,'3.3',2,false,mockRegistry),false);
 st.pages['3.3.1']={completed:true,data:{}};
 assert.equal(pageUnlocked(st,'3.3',2,false,mockRegistry),true);
 assert.equal(topicProgress(st,'3.3',mockRegistry),1);
 for(let n=2;n<=4;n++)st.pages[`3.3.${n}`]={completed:true,data:{}};
 assert.equal(topicCompleted(st,'3.3',mockRegistry),true);
 assert.equal(topicCompleted(st,'3.1',mockRegistry),false);
});

test('current registry includes 3.1 through 3.5, and leaves later topics unpublished',()=>{
 assert.deepEqual(IMPLEMENTED_TOPICS.map(t=>t.id),['3.1','3.2','3.3','3.4','3.5']);
 assert.ok(getImplementedTopic('3.3'));
 assert.ok(getImplementedTopic('3.4'));
 assert.ok(getImplementedTopic('3.5'));
 assert.deepEqual(TOPICS.slice(5).map(t=>t.implemented),Array(4).fill(false));
 const st=blankState();
 assert.equal(topicUnlocked(st,'3.1'),true);
 assert.equal(topicUnlocked(st,'3.2'),false);
 st.assessments['3.1'].attempts.push({score:80});
 assert.equal(topicUnlocked(st,'3.2'),true);
 assert.equal(pageUnlocked(st,'3.2',2),false);
 st.pages['3.2.1']={completed:true,data:{}};
 assert.equal(pageUnlocked(st,'3.2',2),true);
 assert.equal(pageUnlocked(st,'3.2',4),false);
 assert.equal(topicUnlocked(st,'3.3'),false);
 st.assessments['3.2'].attempts.push({score:87.5});
 assert.equal(topicUnlocked(st,'3.3'),true);
});

test('v1.3 numeric and dotted page keys retain all practice evidence and submitted attempts after normalization',()=>{
 const st=blankState();st.schema=1;
 st.pages[1]={completed:true,completedAt:'2026-11-05',data:{explored:['player','board'],challengeResponses:{0:2}}};
 st.pages['3.2.2']={completed:true,completedAt:'2026-11-05',data:{activeTest:'exact',fixChoice:'b',before:{exact:{correct:true}}}};
 st.assessments['3.1'].attempts=[{score:90,at:'2026-11-05',answers:{u31q1:0}}];
 st.assessments['3.2'].attempts=[{score:87.5,at:'2026-11-05',answers:{u32q2:1}}];
 st.assessments['3.2'].locked=true;
 const result=normalizeState(JSON.parse(JSON.stringify(st)));
 assert.deepEqual(result.pages[1].data,st.pages[1].data);
 assert.deepEqual(result.pages['3.2.2'].data,st.pages['3.2.2'].data);
 assert.deepEqual(assessment(result,'3.1').attempts,st.assessments['3.1'].attempts);
 assert.deepEqual(assessment(result,'3.2').attempts,st.assessments['3.2'].attempts);
 assert.equal(assessment(result,'3.2').locked,true);
});

test('application shell and PDF generator discover topics rather than importing topic content',()=>{
 const app=readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
 const storage=readFileSync(new URL('../js/storage.js',import.meta.url),'utf8');
 const pdf=readFileSync(new URL('../js/pdf.js',import.meta.url),'utf8');
 assert.doesNotMatch(app,/from '\.\/content32\.js'|from '\.\/content\.js'/);
 assert.doesNotMatch(app,/from '\.\/topic32\.js'/);
 assert.match(app,/for\(const topic of IMPLEMENTED_TOPICS\)/);
 assert.match(storage,/for\(const topic of IMPLEMENTED_TOPICS\)/);
 assert.match(pdf,/IMPLEMENTED_TOPICS\.forEach/);
 assert.doesNotMatch(pdf,/function details31\(|function details32\(/);
});
