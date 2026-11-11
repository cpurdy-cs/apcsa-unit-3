// Bounded, deterministic Java subset for Topic 3.6; no eval(), Function(), or dynamic code execution.
// Implements object allocation, identity, reference arguments, reference returns, method calls,
// primitive fields, same-class private access, and method-local reference reassignment.
const id = x => /^[A-Za-z_$][\w$]*$/.test(x||'');
const types = new Set(['int','boolean','double','String','WaterTank']);
const tokRE=/\s+|\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|(?:\d+\.\d+|\d+)|(?:==|!=|<=|>=|&&|\|\||\+=|-=|\+\+|--)|[A-Za-z_$][\w$]*|[{}();.,+\-*\/%!<>=]/gy;
function tokenize(src){if(src.length>20000)throw Error('Keep the class under 20,000 characters.');const out=[];let i=0;while(i<src.length){tokRE.lastIndex=i;const m=tokRE.exec(src);if(!m||m.index!==i)throw Error('Unsupported Java syntax near '+src.slice(i,i+24));i=tokRE.lastIndex;if(!/^\s+$/.test(m[0])&&!m[0].startsWith('//')&&!m[0].startsWith('/*'))out.push(m[0]);if(out.length>5000)throw Error('Program too long.');}return out;}
function parser(tokens){let i=0;const peek=()=>tokens[i],take=()=>tokens[i++],eat=x=>peek()===x?(i++,true):false,need=x=>{if(!eat(x))throw Error(`Expected ${x}; found ${peek()||'end of input'}.`);};
 function primary(){let x=take(),v;
  if(x===undefined)throw Error('Incomplete expression.');
  if(x==='('){v=expression();need(')');}
  else if(x==='true'||x==='false')v={k:'lit',v:x==='true'};
  else if(x==='null')v={k:'lit',v:null};
  else if(/^\d+(?:\.\d+)?$/.test(x))v={k:'lit',v:Number(x)};
  else if(x[0]==='"')v={k:'lit',v:JSON.parse(x)};
  else if(x==='new'){const klass=take();if(klass!=='WaterTank')throw Error('This exercise only constructs WaterTank objects.');need('(');const args=argsParse(true);v={k:'new',args};}
  else if(id(x))v={k:'var',name:x};
  else throw Error('Unexpected '+x+' in expression.');
  while(peek()==='.'||peek()==='('){if(eat('.')){let name=take();if(!id(name))throw Error('Expected member name after dot.');v={k:'member',obj:v,name};}
   else if(eat('(')){const args=argsParse(true);v={k:'call',callee:v,args};}}
  return v;
 }
 function argsParse(opened=false){if(!opened)need('(');const a=[];if(!eat(')')){do{a.push(expression());}while(eat(','));need(')');}return a;}
 function unary(){if(['!','-','+'].includes(peek()))return {k:'unary',op:take(),v:unary()};return primary();}
 const prec=[['||'],['&&'],['==','!='],['<','>','<=','>='],['+','-'],['*','/','%']];
 function layer(n){if(n===prec.length)return unary();let a=layer(n+1);while(prec[n].includes(peek())){const op=take();a={k:'binary',op,a,b:layer(n+1)};}return a;}
 function expression(){return layer(0);}
 function stmt(){if(eat('{')){const body=[];while(!eat('}')){if(peek()===undefined)throw Error('Missing closing brace.');body.push(stmt());}return {k:'block',body};}
  if(eat('if')){need('(');const cond=expression();need(')');const yes=stmt(),no=eat('else')?stmt():null;return {k:'if',cond,yes,no};}
  if(eat('while')){need('(');const cond=expression();need(')');return {k:'while',cond,body:stmt()};}
  if(eat('return')){if(eat(';'))return {k:'return',value:null};const value=expression();need(';');return {k:'return',value};}
  if(types.has(peek())){const type=take(),name=take();if(!id(name))throw Error('Expected a local variable name.');const value=eat('=')?expression():null;need(';');return {k:'declare',type,name,value};}
  const left=expression();const op=peek();if(['=','+=','-=','++','--'].includes(op)){take();const value=op==='++'||op==='--'?null:expression();need(';');return {k:'assign',left,op,value};}
  need(';');if(left.k!=='call')throw Error('Only method calls may be standalone expression statements.');return {k:'expr',value:left};
 }
 function parseBody(){const body=[];while(i<tokens.length)body.push(stmt());return body;}
 return parseBody();}
export function parseBody36(source){return parser(tokenize(source));}
const required={
 getCapacity:{ret:'int',params:[]},
 getLiters:{ret:'int',params:[]},
 addWater:{ret:'boolean',params:['int']},
 transferTo:{ret:'boolean',params:['WaterTank','int']},
 chooseLowerLevel:{ret:'WaterTank',params:['WaterTank','WaterTank']},
 hasMoreRoomThan:{ret:'boolean',params:['WaterTank']}
};
function stripComments(s){return s.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g,'');}
function parseClass(source){
 const clean=stripComments(String(source)).trim();
 const header=clean.match(/^public\s+class\s+WaterTank\s*\{/);
 if(!header||!clean.endsWith('}'))throw Error('Declare public class WaterTank { ... }.');
 const inner=clean.slice(header[0].length,-1);let pos=0,ctor=null;
 const fields=new Set(),methods=new Map();
 const fieldRE=/\s*private\s+int\s+(capacity|liters)\s*;/y;
 const defRE=/\s*public\s+(?:(void|int|double|boolean|String|WaterTank)\s+)?([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{/y;
 while(pos<inner.length){
  if(!inner.slice(pos).trim())break;
  fieldRE.lastIndex=pos;const fm=fieldRE.exec(inner);
  if(fm){if(fields.has(fm[1]))throw Error('Declare private int '+fm[1]+'; exactly once.');fields.add(fm[1]);pos=fieldRE.lastIndex;continue;}
  defRE.lastIndex=pos;const m=defRE.exec(inner);
  if(!m)throw Error('Check the class structure near '+inner.slice(pos,pos+55).trim());
  let depth=1,k=defRE.lastIndex,quoted=false,escape=false;
  for(;k<inner.length;k++){
   const ch=inner[k];
   if(quoted){if(escape)escape=false;else if(ch==='\\')escape=true;else if(ch==='"')quoted=false;continue;}
   if(ch==='"'){quoted=true;continue;}
   if(ch==='{')depth++;if(ch==='}'&&--depth===0)break;
  }
  if(depth)throw Error('Missing closing brace for '+m[2]+'.');
  const body=inner.slice(defRE.lastIndex,k);
  const params=m[3].trim()?m[3].split(',').map(p=>p.trim().split(/\s+/)):[];
  if(params.some(p=>p.length!==2||!types.has(p[0])||!id(p[1]))||new Set(params.map(p=>p[1])).size!==params.length)throw Error('Invalid parameters for '+m[2]+'.');
  const def={ret:m[1]||null,name:m[2],params,ast:parseBody36(body)};
  if(m[2]==='WaterTank'){
   if(def.ret||ctor)throw Error('Write one public WaterTank(int, int) constructor with no return type.');ctor=def;
  }else{
   if(!def.ret||methods.has(def.name))throw Error('Methods need unique names and return types.');methods.set(def.name,def);
  }
  pos=k+1;
 }
 for(const field of ['capacity','liters'])if(!fields.has(field))throw Error('Declare private int '+field+'; in WaterTank.');
 if(!ctor||ctor.params.length!==2||ctor.params.some(p=>p[0]!=='int'))throw Error('Write public WaterTank(int maxCapacity, int initialLiters) with any valid parameter names.');
 for(const [name,spec] of Object.entries(required)){
  const method=methods.get(name);if(!method)throw Error(`Missing public ${spec.ret} ${name}(...).`);
  if(method.ret!==spec.ret||method.params.length!==spec.params.length||method.params.some((p,i)=>p[0]!==spec.params[i]))throw Error(`Check ${name} return type and parameter types: ${spec.ret} ${name}(${spec.params.join(', ')}).`);
 }
 return {ctor,methods};
}
function runtime(compiled){
 let nextId=1,count=0;
 const budget=()=>{if(++count>14000)throw Error('Execution stopped; check for an infinite loop or recursive call.');};
 function call(self,def,args,depth=0){
  if(depth>30)throw Error('Too many nested calls.');
  if(args.length!==def.params.length)throw Error('Incorrect argument count for '+def.name+'.');
  const env=Object.create(null);def.params.forEach((pair,i)=>env[pair[1]]=args[i]);env.this=self;
  const fieldNames=['capacity','liters'];
  function value(node){budget();switch(node.k){
   case'lit':return node.v;
   case'var':if(node.name in env)return env[node.name];if(fieldNames.includes(node.name))return self[node.name];throw Error('Unknown variable '+node.name+'.');
   case'member':{
    const target=value(node.obj);
    if(!target||target.__class!=='WaterTank')throw Error('Member access requires a WaterTank reference.');
    if(!fieldNames.includes(node.name))throw Error('Private member '+node.name+' is not defined for WaterTank.');
    return target[node.name];
   }
   case'new':return allocate(...node.args.map(value));
   case'call':{
    let obj=self,name;
    if(node.callee.k==='member'){obj=value(node.callee.obj);name=node.callee.name;}
    else if(node.callee.k==='var')name=node.callee.name;
    else throw Error('Unsupported call target.');
    if(!obj||obj.__class!=='WaterTank')throw Error('Method call needs a WaterTank object.');
    const target=compiled.methods.get(name);if(!target)throw Error('Unknown method '+name+'.');
    return call(obj,target,node.args.map(value),depth+1);
   }
   case'unary':{const x=value(node.v);return node.op==='!'?!x:node.op==='-'?-x:+x;}
   case'binary':{
    const a=value(node.a);if(node.op==='&&'&&!a)return false;if(node.op==='||'&&a)return true;
    const b=value(node.b);
    switch(node.op){case'==':return a===b;case'!=':return a!==b;case'>':return a>b;case'<':return a<b;case'>=':return a>=b;case'<=':return a<=b;case'+':return a+b;case'-':return a-b;case'*':return a*b;case'/':return a/b;case'%':return a%b;case'&&':return !!(a&&b);case'||':return !!(a||b);}
    break;
   }
  }throw Error('Unsupported expression.');}
  const valueTarget=node=>{
   if(node.k==='var'){
    if(node.name in env)return {get:()=>env[node.name],set:v=>env[node.name]=v};
    if(fieldNames.includes(node.name))return {get:()=>self[node.name],set:v=>self[node.name]=v};
   }
   if(node.k==='member'){
    const obj=value(node.obj);
    if(!obj||obj.__class!=='WaterTank'||!fieldNames.includes(node.name))throw Error('Invalid field assignment.');
    return {get:()=>obj[node.name],set:v=>obj[node.name]=v};
   }
   throw Error('Left side of assignment must be an accessible variable or field.');
  };
  function execute(node){
   budget();
   if(node.k==='block'){
    for(const item of node.body){const ret=execute(item);if(ret?.returned)return ret;}return null;
   }
   if(node.k==='if')return execute(value(node.cond)?node.yes:node.no||{k:'block',body:[]});
   if(node.k==='while'){
    while(value(node.cond)){const ret=execute(node.body);if(ret?.returned)return ret;}return null;
   }
   if(node.k==='return')return {returned:true,result:node.value===null?undefined:value(node.value)};
   if(node.k==='expr'){value(node.value);return null;}
   if(node.k==='declare'){
    if(node.name in env)throw Error('Duplicate local variable '+node.name+'.');
    env[node.name]=node.value?value(node.value):node.type==='WaterTank'||node.type==='String'?null:node.type==='boolean'?false:0;
    return null;
   }
   if(node.k==='assign'){
    const t=valueTarget(node.left),old=t.get();
    const newValue=node.op==='++'?old+1:node.op==='--'?old-1:value(node.value);
    let next=node.op==='-='?old-newValue:node.op==='+='?old+newValue:newValue;
    if(typeof old==='number'&&typeof next==='number')next=Math.trunc(next);
    t.set(next);return null;
   }
   throw Error('Unsupported statement.');
  }
  let result;
  for(const node of def.ast){const r=execute(node);if(r?.returned){result=r;break;}}
  if(def.ret==='void'&&result?.result!==undefined)throw Error(def.name+' is void and must not return a value.');
  if(def.ret==='int'&&(!result||!Number.isInteger(result.result)))throw Error(def.name+' must return int.');
  if(def.ret==='boolean'&&(!result||typeof result.result!=='boolean'))throw Error(def.name+' must return boolean.');
  if(def.ret==='WaterTank'&&(!result||!result.result||result.result.__class!=='WaterTank'))throw Error(def.name+' must return a WaterTank reference.');
  return result?.result;
 }
 const allocate=(maxCapacity,initialLiters)=>{
  const obj={__class:'WaterTank',__id:nextId++,capacity:0,liters:0};
  call(obj,compiled.ctor,[maxCapacity,initialLiters]);return obj;
 };
 return {allocate,call:(obj,name,...args)=>{
  const def=compiled.methods.get(name);if(!def)throw Error('Unknown method '+name);return call(obj,def,args);
 }};
}
export const STARTER36='// Write the complete WaterTank class from the specifications above.\n';
const check=(name,input,expected,run)=>({name,input,expected,run});
const describeRef=(obj,first,second)=>obj===first?'first tank':obj===second?'second tank':obj?.__class==='WaterTank'?`new/different tank #${obj.__id}`:String(obj);
const cases=[
 check('Constructor initializes both fields','WaterTank a = new WaterTank(20, 7);\na.getCapacity();\na.getLiters();','capacity = 20; liters = 7',r=>{const a=r.allocate(20,7),c=r.call(a,'getCapacity'),l=r.call(a,'getLiters');return {actual:`capacity = ${c}; liters = ${l}`,pass:c===20&&l===7};}),
 check('Empty tank retains capacity','WaterTank a = new WaterTank(15, 0);\na.getCapacity();\na.getLiters();','capacity = 15; liters = 0',r=>{const a=r.allocate(15,0),c=r.call(a,'getCapacity'),l=r.call(a,'getLiters');return {actual:`capacity = ${c}; liters = ${l}`,pass:c===15&&l===0};}),
 check('Accept valid addition','WaterTank a = new WaterTank(20, 4);\nboolean ok = a.addWater(6);','returned true; liters = 10; capacity = 20',r=>{const a=r.allocate(20,4),v=r.call(a,'addWater',6);return {actual:`returned ${v}; liters = ${a.liters}; capacity = ${a.capacity}`,pass:v===true&&a.liters===10&&a.capacity===20};}),
 check('Allow addition exactly to capacity','WaterTank a = new WaterTank(10, 8);\nboolean ok = a.addWater(2);','returned true; liters = 10',r=>{const a=r.allocate(10,8),v=r.call(a,'addWater',2);return {actual:`returned ${v}; liters = ${a.liters}`,pass:v===true&&a.liters===10};}),
 check('Reject zero and negative additions','WaterTank a = new WaterTank(10, 4);\nboolean x = a.addWater(0);\nboolean y = a.addWater(-2);','returned false, false; liters = 4',r=>{const a=r.allocate(10,4),x=r.call(a,'addWater',0),y=r.call(a,'addWater',-2);return {actual:`returned ${x}, ${y}; liters = ${a.liters}`,pass:x===false&&y===false&&a.liters===4};}),
 check('Reject additions exceeding capacity','WaterTank a = new WaterTank(10, 8);\nboolean ok = a.addWater(3);','returned false; liters = 8',r=>{const a=r.allocate(10,8),v=r.call(a,'addWater',3);return {actual:`returned ${v}; liters = ${a.liters}`,pass:v===false&&a.liters===8};}),
 check('Transfer to another existing tank','WaterTank source = new WaterTank(20, 12);\nWaterTank destination = new WaterTank(18, 3);\nboolean ok = source.transferTo(destination, 5);','returned true; source = 7; destination = 8',r=>{const a=r.allocate(20,12),b=r.allocate(18,3),v=r.call(a,'transferTo',b,5);return {actual:`returned ${v}; source = ${a.liters}; destination = ${b.liters}`,pass:v===true&&a.liters===7&&b.liters===8};}),
 check('Transfer exact available amount','WaterTank source = new WaterTank(15, 6);\nWaterTank destination = new WaterTank(20, 0);\nboolean ok = source.transferTo(destination, 6);','returned true; source = 0; destination = 6',r=>{const a=r.allocate(15,6),b=r.allocate(20,0),v=r.call(a,'transferTo',b,6);return {actual:`returned ${v}; source = ${a.liters}; destination = ${b.liters}`,pass:v===true&&a.liters===0&&b.liters===6};}),
 check('Transfer to exactly fill the recipient','WaterTank source = new WaterTank(15, 9);\nWaterTank destination = new WaterTank(10, 7);\nboolean ok = source.transferTo(destination, 3);','returned true; source = 6; destination = 10',r=>{const a=r.allocate(15,9),b=r.allocate(10,7),v=r.call(a,'transferTo',b,3);return {actual:`returned ${v}; source = ${a.liters}; destination = ${b.liters}`,pass:v===true&&a.liters===6&&b.liters===10};}),
 check('Reject transfer without enough water','WaterTank source = new WaterTank(20, 4);\nWaterTank destination = new WaterTank(20, 1);\nboolean ok = source.transferTo(destination, 5);','returned false; source = 4; destination = 1',r=>{const a=r.allocate(20,4),b=r.allocate(20,1),v=r.call(a,'transferTo',b,5);return {actual:`returned ${v}; source = ${a.liters}; destination = ${b.liters}`,pass:v===false&&a.liters===4&&b.liters===1};}),
 check('Reject transfer with insufficient room','WaterTank source = new WaterTank(20, 9);\nWaterTank destination = new WaterTank(10, 9);\nboolean ok = source.transferTo(destination, 2);','returned false; source = 9; destination = 9',r=>{const a=r.allocate(20,9),b=r.allocate(10,9),v=r.call(a,'transferTo',b,2);return {actual:`returned ${v}; source = ${a.liters}; destination = ${b.liters}`,pass:v===false&&a.liters===9&&b.liters===9};}),
 check('Reject nonpositive transfer amounts','WaterTank a = new WaterTank(12, 8);\nWaterTank b = new WaterTank(12, 2);\na.transferTo(b, 0);\na.transferTo(b, -3);','returned false, false; a = 8; b = 2',r=>{const a=r.allocate(12,8),b=r.allocate(12,2),x=r.call(a,'transferTo',b,0),y=r.call(a,'transferTo',b,-3);return {actual:`returned ${x}, ${y}; a = ${a.liters}; b = ${b.liters}`,pass:x===false&&y===false&&a.liters===8&&b.liters===2};}),
 check('Aliased destination is modified, not replaced','WaterTank a = new WaterTank(15, 7);\nWaterTank b = new WaterTank(15, 2);\nWaterTank alias = b;\na.transferTo(alias, 3);','a = 4; b = 5; alias == b',r=>{const a=r.allocate(15,7),b=r.allocate(15,2),alias=b;r.call(a,'transferTo',alias,3);return {actual:`a = ${a.liters}; b = ${b.liters}; alias == b: ${alias===b}`,pass:a.liters===4&&b.liters===5&&alias===b};}),
 check('Choose the existing second tank','WaterTank first = new WaterTank(10, 6);\nWaterTank second = new WaterTank(20, 2);\nWaterTank chosen = first.chooseLowerLevel(first, second);','chosen refers to second tank',r=>{const a=r.allocate(10,6),b=r.allocate(20,2),v=r.call(a,'chooseLowerLevel',a,b);return {actual:`chosen refers to ${describeRef(v,a,b)}`,pass:v===b};}),
 check('Choose the existing first tank','WaterTank first = new WaterTank(20, 1);\nWaterTank second = new WaterTank(10, 9);\nWaterTank chosen = second.chooseLowerLevel(first, second);','chosen refers to first tank',r=>{const a=r.allocate(20,1),b=r.allocate(10,9),v=r.call(b,'chooseLowerLevel',a,b);return {actual:`chosen refers to ${describeRef(v,a,b)}`,pass:v===a};}),
 check('Tie returns exact first reference','WaterTank first = new WaterTank(10, 4);\nWaterTank second = new WaterTank(20, 4);\nWaterTank chosen = first.chooseLowerLevel(first, second);','chosen refers to first tank',r=>{const a=r.allocate(10,4),b=r.allocate(20,4),v=r.call(a,'chooseLowerLevel',a,b);return {actual:`chosen refers to ${describeRef(v,a,b)}`,pass:v===a};}),
 check('Mutating the returned reference affects the original','WaterTank a = new WaterTank(18, 8);\nWaterTank b = new WaterTank(18, 2);\nWaterTank chosen = a.chooseLowerLevel(a, b);\nchosen.addWater(3);','chosen is b; a = 8; b = 5',r=>{const a=r.allocate(18,8),b=r.allocate(18,2),v=r.call(a,'chooseLowerLevel',a,b);if(v?.__class==='WaterTank')r.call(v,'addWater',3);return {actual:`chosen is ${describeRef(v,a,b).replace('second tank','b').replace('first tank','a')}; a = ${a.liters}; b = ${b.liters}`,pass:v===b&&a.liters===8&&b.liters===5};}),
 check('Compare remaining capacity of different tanks','WaterTank a = new WaterTank(20, 5);\nWaterTank b = new WaterTank(12, 3);\nWaterTank c = new WaterTank(18, 3);\na.hasMoreRoomThan(b);\nb.hasMoreRoomThan(a);\na.hasMoreRoomThan(c);','true; false; false',r=>{const a=r.allocate(20,5),b=r.allocate(12,3),c=r.allocate(18,3);const vals=[r.call(a,'hasMoreRoomThan',b),r.call(b,'hasMoreRoomThan',a),r.call(a,'hasMoreRoomThan',c)];return {actual:vals.map(String).join('; '),pass:vals[0]===true&&vals[1]===false&&vals[2]===false};})
];
export function evaluateClass36(source){
 let compiled;try{compiled=parseClass(source);}catch(e){return {ok:false,error:e.message,tests:[],total:cases.length};}
 const tests=cases.map((test,i)=>{
  try{
   const result=test.run(runtime(compiled));
   return {number:i+1,name:test.name,input:test.input,expected:test.expected,actual:result.actual,pass:result.pass,detail:result.pass?'Matched expected result.':'Compare the observed result with the expected result, then inspect your code.'};
  }catch(error){return {number:i+1,name:test.name,input:test.input,expected:test.expected,actual:`Execution error: ${error.message}`,pass:false,detail:'The method could not finish this test; inspect the exception and the input values.'};}
 });
 return {ok:tests.every(t=>t.pass),tests,total:tests.length,error:tests.every(t=>t.pass)?null:'Inspect the expanded failing tests for exact inputs, expected values and actual values.'};
}
export const REFERENCE_SPEC36={
 name:'WaterTank',
 fields:['private int capacity;','private int liters;'],
 constructor:'public WaterTank(int maxCapacity, int initialLiters)',
 methods:[
  ['public int getCapacity()','Return the maximum number of liters this tank can hold.'],
  ['public int getLiters()','Return the current number of liters stored in this tank.'],
  ['public boolean addWater(int amount)','Add amount to this tank only if amount > 0 and the result does not exceed capacity. Return true if added. Otherwise return false and leave the tank unchanged.'],
  ['public boolean transferTo(WaterTank other, int amount)','Transfer amount from this tank to the existing other tank, returning true only on success. Reject amount <= 0, amount > this tank’s liters, or insufficient capacity in other. On failure, return false and change neither tank. Assume other is non-null and is a different object. Never create a new tank.'],
  ['public WaterTank chooseLowerLevel(WaterTank first, WaterTank second)','Return the existing reference to the tank containing fewer liters. On a tie, return first. The receiver is not automatically a candidate. Do not allocate a new WaterTank.'],
  ['public boolean hasMoreRoomThan(WaterTank other)','Return true only if this tank has strictly more unused capacity (capacity - liters) than other; return false for a tie. Assume other is non-null.']
 ]
};
