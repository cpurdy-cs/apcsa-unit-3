import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {editConstructorText,handleConstructorEditorKeydown} from '../js/topics/editor34.js';
import {render34Page} from '../js/topic34.js';

const update=(text,at,key,shift=false)=>editConstructorText(text,at,at,key,shift);

test('Tab inserts four spaces and Shift+Tab outdents the current line',()=>{
 let text='public PrizeCard(String name, int count) {\n    owner = name;\n}';
 let at=text.indexOf('owner');
 const tab=update(text,at,'Tab');
 assert.equal(tab.text.split('\n')[1],'        owner = name;');
 assert.equal(tab.start,at+4);
 const out=update(tab.text,tab.start,'Tab',true);
 assert.equal(out.text,text);
 assert.equal(out.end-out.start,'    owner = name;'.length);
});

test('Tab/Shift+Tab indent and outdent selected lines together',()=>{
 const source='owner = newOwner;\ntickets = initialTickets;\n}';
 const to=source.lastIndexOf(';')+1;
 const indented=editConstructorText(source,0,to,'Tab');
 assert.equal(indented.text,'    owner = newOwner;\n    tickets = initialTickets;\n}');
 const restored=editConstructorText(indented.text,indented.start,indented.end,'Tab',true);
 assert.equal(restored.text,source);
 const excludeLast=editConstructorText(source,0,source.indexOf('}') ,'Tab');
 assert.equal(excludeLast.text.split('\n')[2],'}','selection ending at next line should not indent it');
});

test('Enter preserves indentation and adds one level after opening brace',()=>{
 const header='public PrizeCard(String ownerName, int ticketCount) {';
 const first=update(header,header.length,'Enter');
 assert.equal(first.text,header+'\n    ');
 const statement=first.text+'owner = ownerName;';
 const second=update(statement,statement.length,'Enter');
 assert.equal(second.text,header+'\n    owner = ownerName;\n    ');
 const close=update(second.text,second.text.length,'}');
 assert.equal(close.text,header+'\n    owner = ownerName;\n}');
});

test('inserting a newline replaces a selected span and positions caret correctly',()=>{
 const code='    owner = wrong;';
 const result=editConstructorText(code,12,17,'Enter');
 assert.equal(result.text,'    owner = \n    ;');
 assert.equal(result.start,code.indexOf('wrong')+1+4);
});

test('keyboard adapter dispatches input for autosave and supports Escape then Tab to exit',()=>{
 let saveEvents=0,prevented=0;
 const textarea={id:'34-constructor-editor',dataset:{},value:'public PrizeCard() {',selectionStart:20,selectionEnd:20,
  setSelectionRange(start,end){this.selectionStart=start;this.selectionEnd=end;},
  dispatchEvent(event){assert.equal(event.type,'input');assert.equal(event.bubbles,true);saveEvents++;}};
 const key=(k,extra={})=>({target:textarea,key:k,shiftKey:false,ctrlKey:false,altKey:false,metaKey:false,
  preventDefault(){prevented++;},...extra});
 assert.equal(handleConstructorEditorKeydown(key('Enter')),true);
 assert.match(textarea.value,/\n    $/);
 assert.equal(saveEvents,1);
 assert.equal(handleConstructorEditorKeydown(key('Tab')),true);
 assert.equal(saveEvents,2);
 handleConstructorEditorKeydown(key('Escape'));
 assert.equal(handleConstructorEditorKeydown(key('Tab')),false);
 assert.equal(saveEvents,2);
 assert.equal(prevented,2);
});

test('constructor workshop editor occupies entire available workbench width',()=>{
 const markup=render34Page(4,{},78);
 assert.match(markup,/class="ctor-workbench"/);
 assert.match(markup,/id="34-constructor-editor"/);
 assert.match(markup,/id="34-editor-help"/);
 assert.doesNotMatch(markup,/Live complete class preview/);
 assert.match(markup,/<textarea[^>]*>public class PrizeCard \{/);
 const css=readFileSync(new URL('../css/styles.css',import.meta.url),'utf8');
 assert.match(css,/\.ctor-workbench\{grid-template-columns:minmax\(0,1fr\)/);
 assert.match(css,/\.ctor-workbench \.ctor-editor\{[^}]*width:100%/);
});
