import test from 'node:test';
import assert from 'node:assert/strict';
import {blankState} from '../js/storage.js';

const KEY='flourbluff-apcsa-u3-v1';
const initialState=()=>{
 const st=blankState();st.identity={first:'Alex',last:'R'};
 st.pages[1]={completed:true,completedAt:'2026-11-18',data:{code:'score += 3;'}};
 st.assessments['3.1'].attempts.push({score:90,at:'2026-11-18'});
 return st;
};
async function harness(){
 const initial=initialState(),storage=new Map([[KEY,JSON.stringify(initial)]]),events={},pieces={},downloads=[];
 let pendingBlob=null,blockBlank=false;
 const app={innerHTML:''},zone={append(){}},body={innerHTML:''};
 const dialog={open:false,showModal(){this.open=true;},close(){this.open=false;}};
 Object.assign(pieces,{
  '#app':app,'#toast-region':zone,'#modal':dialog,'#modal-body':body,
  '#switch-file-status':{textContent:''},'#switch-verify-button':{disabled:true},
  '#switch-final-button':{disabled:true},'#switch-backup-file':{click(){},value:''},
 });
 global.localStorage={
  getItem:key=>storage.get(key)??null,
  setItem(key,value){if(blockBlank && JSON.parse(value).identity===null)throw Error('Storage blocked');storage.set(key,value);}
 };
 const session=new Map();
 global.sessionStorage={getItem:key=>session.get(key)||null,setItem:(key,val)=>session.set(key,val),removeItem:key=>session.delete(key)};
 global.document={
  title:'',body:{append(){}},querySelector:s=>pieces[s]||null,
  createElement:tag=>tag==='a'?({click(){downloads.push(this.download);},remove(){}}):({className:'',textContent:'',remove(){}}),
  addEventListener:(name,callback)=>{events[name]=callback;}
 };
 global.window={scrollTo(){},addEventListener:(name,callback)=>{events[name]=callback;}};
 global.location={hash:'#/home'};
 URL.createObjectURL=blob=>{pendingBlob=blob;return 'blob:verified-student-test';};
 URL.revokeObjectURL=()=>{};
 await import('../js/app.js?switchui='+Date.now());
 const click=action=>events.click({target:{closest(selector){if(selector==='[data-action]')return {dataset:{action},disabled:false};return null;}}});
 const chooseFile=file=>events.change({target:{id:'switch-backup-file',dataset:{},files:[file],value:'fake-path'}});
 const downloadedFile=async()=>{const text=await pendingBlob.text();return {name:downloads.at(-1),size:text.length,text:async()=>text};};
 const record=()=>JSON.parse(storage.get(KEY));
 return {app,pieces,body,dialog,storage,click,chooseFile,downloadedFile,record,downloads,blockStorage:yes=>{blockBlank=yes;}};
}

test('protected switch requires verifying the actual matching downloaded file and preserves the backup',async()=>{
 const h=await harness();
 assert.match(h.app.innerHTML,/Welcome back, Alex/);
 h.click('switch-student');
 assert.match(h.body.innerHTML,/Download your progress backup/);
 assert.equal(h.pieces['#switch-final-button'].disabled,true);
 h.click('confirm-switch'); // Simulate even a forced programmatic click on the disabled button.
 assert.equal(h.record().identity.first,'Alex');
 h.click('switch-download');
 assert.equal(h.downloads.length,1);
 assert.equal(h.pieces['#switch-verify-button'].disabled,false);
 assert.equal(h.pieces['#switch-final-button'].disabled,true);
 const file=await h.downloadedFile();
 h.chooseFile({name:'wrong.json',size:2,text:async()=>'{x'});
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(h.pieces['#switch-final-button'].disabled,true);
 assert.equal(h.record().identity.first,'Alex');
 h.chooseFile(file);
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(h.pieces['#switch-final-button'].disabled,false);
 assert.match(h.pieces['#switch-file-status'].textContent,/Verified/);
 h.click('confirm-switch');
 assert.equal(h.record().identity,null);
 assert.match(h.app.innerHTML,/Start learning/);
 assert.equal(JSON.parse(await file.text()).assessments['3.1'].attempts[0].score,90);
});

test('cancel and storage-write failure both leave student work intact',async()=>{
 const h=await harness();
 h.click('switch-student');h.click('modal-close');
 assert.equal(h.dialog.open,false);
 assert.equal(h.record().identity.first,'Alex');
 h.click('switch-student');h.click('switch-download');
 h.chooseFile(await h.downloadedFile());
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(h.pieces['#switch-final-button'].disabled,false);
 h.blockStorage(true);h.click('confirm-switch');
 assert.equal(h.record().identity.first,'Alex');
 assert.equal(h.record().assessments['3.1'].attempts.length,1);
 assert.equal(h.dialog.open,true);
});
