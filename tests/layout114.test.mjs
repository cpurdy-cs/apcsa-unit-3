import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {render35Page} from '../js/topic35.js';
test('3.5 editor and control layouts have consistent spacing and responsive rules',()=>{
 const css=readFileSync(new URL('../css/styles.css',import.meta.url),'utf8');
 assert.match(css,/\.topic35-page \.method35-controls \{gap:14px;/);
 assert.match(css,/\.method35-final \.method35-spec \{display:grid;/);
 assert.match(css,/@media\(max-width:880px\)\{\.method35-final \.method35-spec \{grid-template-columns:1fr;/);
 for(const n of [2,3,4,5,6,7,8]){
  const html=render35Page(n,{},42);assert.match(html,/section class="panel/);
 }
 const workshop=render35Page(8,{},42);
 assert.match(workshop,/method35-full-editor/);
 assert.match(workshop,/Test complete class/);
 assert.match(workshop,/Write an entire PrizeCard class/);
});
