// Bounded, independent Java subset for the 3.8 DroneBattery class workshop.
// This parses Java-like statements and models nested lexical scopes. No eval/Function.
import {tokenize35,parseBody} from './method-engine35.js';
const IDENT=/^[A-Za-z_$][\w$]*$/;
export const SPEC38={name:'DroneBattery',fields:['private int charge;','private int flights;'],constructor:'public DroneBattery(int initialCharge)',methods:[
 ['public int getCharge()','Return this battery’s current charge.'],
 ['public int getFlights()','Return the number of successful flights.'],
 ['public boolean canFly(int requiredCharge)','Return true only when requiredCharge is positive and the battery has enough charge. Never change state.'],
 ['public boolean completeFlight(int requiredCharge)','Reject zero, negative, or unaffordable requirements. On success, use a local variable to calculate the remaining charge, update the battery, count one flight, and return true. Invalid attempts must change nothing and return false.'],
 ['public void recharge(int amount)','Ignore nonpositive amounts. Otherwise add charge, never exceeding 100.']
 ]};
export const STARTER38='// Write your complete DroneBattery class here.\n';
const strip=s=>String(s).replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g,'');
const validType=t=>['int','boolean'].includes(t);
function params(raw){if(!raw.trim())return [];return raw.split(',').map(x=>{const a=x.trim().split(/\s+/);if(a.length!==2||!validType(a[0])||!IDENT.test(a[1]))throw Error('Use typed int or boolean method parameters.');return a;});}
export function compile38(source){const text=strip(source).trim();if(text.length>20000)throw Error('Class source is too long.');
 const prefix=/^public\s+class\s+DroneBattery\s*\{/;const start=prefix.exec(text);if(!start||!text.endsWith('}'))throw Error('Declare public class DroneBattery { ... } and include its closing brace.');
 const body=text.slice(start[0].length,-1);let pos=0;const fields=new Map(),methods=new Map();let ctor=null;
 const field=/\s*private\s+(int|boolean)\s+([A-Za-z_$][\w$]*)\s*;/y;
 const method=/\s*public\s+(?:(void|int|boolean)\s+)?([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{/y;
 while(pos<body.length){if(!body.slice(pos).trim())break;field.lastIndex=pos;const f=field.exec(body);if(f){if(fields.has(f[2]))throw Error(`Duplicate instance variable ${f[2]}.`);fields.set(f[2],f[1]);pos=field.lastIndex;continue;}
  method.lastIndex=pos;const m=method.exec(body);if(!m)throw Error(`Check the public constructor, methods, and private fields near: ${body.slice(pos,pos+65).trim()}.`);
  let depth=1,k=method.lastIndex;let quoted=false,escaped=false;
  for(;k<body.length;k++){const ch=body[k];if(quoted){if(escaped)escaped=false;else if(ch==='\\')escaped=true;else if(ch==='"')quoted=false;continue;}if(ch==='"'){quoted=true;continue;}if(ch==='{')depth++;if(ch==='}'&&--depth===0)break;}
  if(depth)throw Error(`Missing closing brace in ${m[2]}.`);
  let ast;try{ast=parseBody(tokenize35(body.slice(method.lastIndex,k)));}catch(err){throw Error(`${m[2]}: ${err.message}`);}
  const def={name:m[2],returnType:m[1]||null,parameters:params(m[3]),ast};
  if(def.name==='DroneBattery'){if(def.returnType!==null||ctor)throw Error('Write one public DroneBattery(int initialCharge) constructor without a return type.');ctor=def;}
  else {if(!def.returnType||methods.has(def.name))throw Error('Methods need a return type and unique names.');methods.set(def.name,def);}
  pos=k+1;
 }
 if(fields.size!==2||fields.get('charge')!=='int'||fields.get('flights')!=='int')throw Error('Include exactly private int charge; and private int flights;.');
 if(!ctor)throw Error('Missing public DroneBattery(int initialCharge) constructor.');
 const check=(def,required,name)=>{if(!def||def.parameters.length!==required.length||def.parameters.some((p,i)=>p[0]!==required[i]))throw Error(`${name} requires (${required.join(', ')}) parameters; names may vary.`);};
 check(ctor,['int'],'DroneBattery constructor');
 for(const [signature] of SPEC38.methods){const match=/^public (int|boolean|void) (\w+)\(([^)]*)\)$/.exec(signature);const def=methods.get(match[2]);if(!def||def.returnType!==match[1])throw Error(`Missing method ${signature}.`);check(def,match[3]?match[3].split(',').map(x=>x.trim().split(' ')[0]):[],match[2]);}
 if(methods.size!==SPEC38.methods.length)throw Error('Remove methods not included in the specification.');
 return {fields,ctor,methods};
}
function instantiate(compiled,initial){const obj={charge:0,flights:0};execute(compiled,compiled.ctor,obj,[initial]);return obj;}
function execute(compiled,def,obj,args){let steps=0,returned=false,result;const scopes=[Object.fromEntries(def.parameters.map(([,name],i)=>[name,args[i]]))];
 const locate=name=>{for(let i=scopes.length-1;i>=0;i--)if(Object.hasOwn(scopes[i],name))return scopes[i];return Object.hasOwn(obj,name)?obj:null;};
 const value=a=>{if(!a)throw Error('Missing expression.');switch(a.type){case'lit':return a.value;
 case'var':{const slot=locate(a.name);if(!slot)throw Error(`Variable ${a.name} is not in scope.`);return slot[a.name];}
 case'field':if(!Object.hasOwn(obj,a.name))throw Error(`No field ${a.name}.`);return obj[a.name];
 case'unary':{const x=value(a.a);return a.op==='!'?!x:a.op==='-'?-x:+x;}
 case'call':{const method=compiled.methods.get(a.name);if(!method)throw Error(`Unknown method ${a.name}().`);return execute(compiled,method,obj,a.args.map(value));}
 case'binary':{const x=value(a.a);if(a.op==='&&'&&!x)return false;if(a.op==='||'&&x)return true;const y=value(a.b);switch(a.op){case'+':return x+y;case'-':return x-y;case'*':return x*y;case'/':if(y===0)throw Error('Division by zero.');return Math.trunc(x/y);case'%':return x%y;case'<':return x<y;case'<=':return x<=y;case'>':return x>y;case'>=':return x>=y;case'==':return x===y;case'!=':return x!==y;case'&&':return !!(x&&y);case'||':return !!(x||y);}}}
 throw Error('Unsupported expression.');};
 const block=(nodes,push=false)=>{if(push)scopes.push({});try{for(const x of nodes){stmt(x);if(returned)break;}}finally{if(push)scopes.pop();}};
 const stmt=x=>{if(!x||returned)return;if(++steps>15000)throw Error('Execution stopped: possible infinite loop.');
 if(x.type==='block')return block(x.body,true);
 if(x.type==='if'){const branch=value(x.condition)?x.then:x.otherwise;if(branch)stmt(branch);return;}
 if(x.type==='while'){while(value(x.condition)&&!returned)stmt(x.body);return;}
 if(x.type==='for'){scopes.push({});try{stmt(x.init);while(value(x.condition)&&!returned){stmt(x.body);if(!returned)stmt(x.step);}}finally{scopes.pop();}return;}
 if(x.type==='return'){result=x.expression?value(x.expression):undefined;returned=true;return;}
 if(x.type==='declare'){
  // Java does not allow one active local declaration to shadow another local/parameter.
  if(scopes.some(s=>Object.hasOwn(s,x.name)))throw Error(`Local variable ${x.name} is already declared in this scope.`);
  if(!x.varType||!validType(x.varType)||x.op!=='=')throw Error('Initialize local variables when they are declared.');
  const v=value(x.expression);scopes.at(-1)[x.name]=v;return;
 }
 if(x.type==='assign'){
  const target=x.fieldQualified?obj:locate(x.name);if(!target||!Object.hasOwn(target,x.name))throw Error(`Variable ${x.name} is not in scope.`);
  const old=target[x.name];let v=x.op==='++'?old+1:x.op==='--'?old-1:value(x.expression);
  if(x.op==='+=')v=old+v;else if(x.op==='-=')v=old-v;else if(x.op==='*=')v=old*v;else if(x.op==='/=')v=Math.trunc(old/v);
  if(typeof v==='number'&&!Number.isFinite(v))throw Error('Invalid numeric result.');target[x.name]=v;return;
 }
 throw Error('This statement is outside the supported lesson subset.');};
 block(def.ast);if(def.returnType==='boolean'&&typeof result!=='boolean')throw Error(`${def.name} must return a boolean on every path.`);
 if(def.returnType==='int'&&!Number.isInteger(result))throw Error(`${def.name} must return an int on every path.`);
 if(def.returnType==='void'&&returned&&result!==undefined)throw Error(`${def.name} must not return a value.`);
 if(!Number.isInteger(obj.charge)||!Number.isInteger(obj.flights))throw Error('Instance fields must stay integer values.');
 return result;
}
const tests=[
 ['Constructor starts at 0',0,[['getCharge',[],0],['getFlights',[],0]]],
 ['Constructor starts at 100',100,[['getCharge',[],100]]],
 ['Constructor starts at 37',37,[['getCharge',[],37]]],
 ['Afford exact charge',20,[['canFly',[20],true]]],
 ['Reject unaffordable flight',20,[['canFly',[21],false]]],
 ['Reject zero required charge',20,[['canFly',[0],false]]],
 ['Reject negative required charge',20,[['canFly',[-3],false]]],
 ['Complete one successful flight',30,[['completeFlight',[12],true],['getCharge',[],18],['getFlights',[],1]]],
 ['Complete two flights',40,[['completeFlight',[10],true],['completeFlight',[20],true],['getCharge',[],10],['getFlights',[],2]]],
 ['Reject invalid flight without changing state',19,[['completeFlight',[0],false],['getCharge',[],19],['getFlights',[],0]]],
 ['Reject negative flight without changing state',19,[['completeFlight',[-5],false],['getCharge',[],19],['getFlights',[],0]]],
 ['Reject unaffordable flight without changing state',10,[['completeFlight',[11],false],['getCharge',[],10],['getFlights',[],0]]],
 ['Accept flight using all charge',14,[['completeFlight',[14],true],['getCharge',[],0],['getFlights',[],1]]],
 ['Recharge partially',20,[['recharge',[25],undefined],['getCharge',[],45]]],
 ['Recharge up to exactly 100',60,[['recharge',[40],undefined],['getCharge',[],100]]],
 ['Cap recharge at 100',90,[['recharge',[20],undefined],['getCharge',[],100]]],
 ['Ignore zero recharge',70,[['recharge',[0],undefined],['getCharge',[],70]]],
 ['Ignore negative recharge',70,[['recharge',[-20],undefined],['getCharge',[],70]]],
 ['Combined flights and recharge',50,[['completeFlight',[20],true],['recharge',[10],undefined],['completeFlight',[40],true],['getCharge',[],0],['getFlights',[],2]]],
 ['State stays separate for two objects',12,[['completeFlight',[4],true],['getCharge',[],8],['getFlights',[],1]]]
];
// Expected final state is asserted even for getter/boolean tests; a method may not
// earn credit for returning the right value while corrupting an instance field.
const finalStates=[
 [0,0],[100,0],[37,0],[20,0],[20,0],[20,0],[20,0],[18,1],[10,2],
 [19,0],[19,0],[10,0],[0,1],[45,0],[100,0],[100,0],[70,0],[70,0],[0,2],[8,1]
];
export const TEST_COUNT38=tests.length;
function fmt(v){return v===undefined?'void':String(v);}
export function evaluateClass38(source){let compiled;try{compiled=compile38(source);}catch(err){return {ok:false,error:err.message,total:TEST_COUNT38,tests:[]};}
 const outcomes=[];for(const [i,[name,initial,steps]] of tests.entries()){
  const lines=[`DroneBattery battery = new DroneBattery(${initial});`];let expected='',actual='',pass=true,detail='';
  try{const obj=instantiate(compiled,initial);for(const [method,args,wanted] of steps){const call=`battery.${method}(${args.join(', ')});`;lines.push(call);const out=execute(compiled,compiled.methods.get(method),obj,args);expected+=`${method} → ${fmt(wanted)}; `;actual+=`${method} → ${fmt(out)}; `;if(out!==wanted)pass=false;}
   // The final scenario also checks independence from a second object.
   if(i===tests.length-1){const other=instantiate(compiled,50);lines.push('DroneBattery second = new DroneBattery(50);');
     lines.push('second.getCharge(); second.getFlights();');
     const secondCharge=execute(compiled,compiled.methods.get('getCharge'),other,[]),secondFlights=execute(compiled,compiled.methods.get('getFlights'),other,[]);
     actual+=`second.getCharge → ${fmt(secondCharge)}; second.getFlights → ${fmt(secondFlights)}; `;
     expected+='second.getCharge → 50; second.getFlights → 0; ';
     if(secondCharge!==50||secondFlights!==0||other.charge!==50||other.flights!==0)pass=false;
   }
   const [wantCharge,wantFlights]=finalStates[i];
   expected+=`final charge=${wantCharge}, flights=${wantFlights}`;
   actual+=`final charge=${obj.charge}, flights=${obj.flights}`;
   if(obj.charge!==wantCharge||obj.flights!==wantFlights)pass=false;
   detail=pass?'Returned values and object state are correct.':'Compare each actual return and the resulting state to the expected behavior.';
  }catch(err){pass=false;actual+='Execution error: '+err.message;detail='Inspect the failing input and the error before revising code.';}
  outcomes.push({number:i+1,name,input:lines.join('\n'),expected:expected.trim(),actual,pass,detail});
 }
 return {ok:outcomes.every(x=>x.pass),error:outcomes.every(x=>x.pass)?null:'Inspect the expanded failing tests for actual values and errors.',total:TEST_COUNT38,tests:outcomes};
}
