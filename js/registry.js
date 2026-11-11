import {UNIT,PAGE_META} from './content.js';
import {PAGE32} from './content32.js';
import {PAGE33} from './content33.js';
import {PAGE34} from './content34.js';
import {PAGE35} from './content35.js';
import {PAGE36} from './content36.js';
import {createTopic31} from './topics/topic31.js';
import {createTopic32} from './topics/topic32-controller.js';
import {createTopic33} from './topics/topic33-controller.js';
import {createTopic34} from './topics/topic34-controller.js';
import {createTopic35} from './topics/topic35-controller.js';
import {createTopic36} from './topics/topic36-controller.js';
import {write31} from './topics/report31.js';
import {write32} from './topics/report32.js';
import {write33} from './topics/report33.js';
import {write34} from './topics/report34.js';
import {write35} from './topics/report35.js';
import {write36} from './topics/report36.js';

// Single extension point for future topics. Older topic modules never need editing.
// Each plugin supplies its page metadata, page-key convention, controller and PDF writer.
const plugins={
 '3.1':{lessons:PAGE_META,pageId:n=>n,create:createTopic31,writeReport:write31},
 '3.2':{lessons:PAGE32,pageId:n=>`3.2.${n}`,create:createTopic32,writeReport:write32},
 '3.3':{lessons:PAGE33,pageId:n=>`3.3.${n}`,create:createTopic33,writeReport:write33},
 '3.4':{lessons:PAGE34,pageId:n=>`3.4.${n}`,create:createTopic34,writeReport:write34},
 '3.5':{lessons:PAGE35,pageId:n=>`3.5.${n}`,create:createTopic35,writeReport:write35},
 '3.6':{lessons:PAGE36,pageId:n=>`3.6.${n}`,create:createTopic36,writeReport:write36}
};
export function createTopicRegistry(unit,definitions){return Object.freeze(unit.map((row,index)=>Object.freeze({
 ...row,implemented:!!definitions[row.id],prerequisite:index?unit[index-1].id:null,
 ...definitions[row.id]
})));}
export const TOPICS=createTopicRegistry(UNIT,plugins);
export const IMPLEMENTED_TOPICS=Object.freeze(TOPICS.filter(topic=>topic.implemented));
export function getTopic(id,registry=TOPICS){return registry.find(topic=>topic.id===String(id));}
export function getImplementedTopic(id,registry=TOPICS){const topic=getTopic(id,registry);return topic?.implemented?topic:null;}
export function pageKey(topicId,n,registry=TOPICS){const topic=getImplementedTopic(topicId,registry);return topic?.pageId(n);}
export function topicCompleted(st,topicId,registry=TOPICS){const topic=getImplementedTopic(topicId,registry);return !!topic&&topic.lessons.every((_,i)=>!!st.pages?.[topic.pageId(i+1)]?.completed);}
export function topicProgress(st,topicId,registry=TOPICS){const topic=getImplementedTopic(topicId,registry);return topic?topic.lessons.filter((_,i)=>!!st.pages?.[topic.pageId(i+1)]?.completed).length:0;}
export function topicPassed(st,topicId){return (st.assessments?.[topicId]?.attempts||[]).some(a=>a.score>=80);}
export function topicUnlocked(st,topicId,teacher=false,registry=TOPICS){const topic=getImplementedTopic(topicId,registry);return !!topic&&(teacher||!topic.prerequisite||topicPassed(st,topic.prerequisite)||!!st.overrides?.topics?.[topic.id]);}
export function pageUnlocked(st,topicId,n,teacher=false,registry=TOPICS){const topic=getImplementedTopic(topicId,registry);return !!topic&&Number.isInteger(n)&&n>=1&&n<=topic.lessons.length&&topicUnlocked(st,topicId,teacher,registry)&&(teacher||n===1||!!st.pages?.[topic.pageId(n-1)]?.completed);}
