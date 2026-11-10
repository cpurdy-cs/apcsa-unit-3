import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,readdirSync} from 'node:fs';import {join,resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');function files(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?files(join(dir,x.name)):[join(dir,x.name)]);}
test('teacher phrase is not published in README, teacher guide, JS files or tests',()=>{
 const app=readFileSync(join(root,'js/app.js'),'utf8');const hash=app.match(/TEACHER_CODE_SHA256='([a-f0-9]{64})'/)?.[1];assert.ok(hash);assert.notEqual(hash,'77a2fd4b9af9c4bdc84ebab31d230c646651d25b986d0a265cea1adf4d3cf612');
 for(const path of files(root).filter(f=>/\.(?:js|mjs|md|html)$/.test(f))){const txt=readFileSync(path,'utf8');assert.ok(!txt.includes(['Hornet','Lab31'].join('')),'Old teacher phrase found in '+path);assert.doesNotMatch(txt,/\bFB-[A-Z2-9]{22}\b/,'New teacher phrase found in '+path);}
 assert.match(readFileSync(join(root,'README.md'),'utf8'),/supplied separately/);
});
