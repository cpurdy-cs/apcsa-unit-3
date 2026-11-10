// Test harness only: simulate a successful SHA-256 comparison to exercise the
// teacher UI without distributing the real instructor access phrase.
// Production app.js uses the browser's genuine Web Crypto digest.
import {readFileSync} from 'node:fs';
export function mockTeacherCrypto(){
 const code=readFileSync(new URL('../../js/app.js',import.meta.url),'utf8');
 const hash=code.match(/TEACHER_CODE_SHA256='([a-f0-9]{64})'/)?.[1];
 if(!hash)throw Error('Teacher hash missing in application.');
 const bytes=Uint8Array.from(hash.match(/.{2}/g).map(x=>parseInt(x,16)));
 Object.defineProperty(globalThis,'crypto',{configurable:true,value:{subtle:{digest:async()=>bytes.buffer.slice(0)}}});
}
