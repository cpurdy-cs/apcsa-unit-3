// Topic 3.5 final class-design evaluator. This deliberately executes only the
// Java subset taught in the unit. It never calls eval() or Function().
import {tokenize35,parseBody,execStatements} from './method-engine35.js';
const NAME='PrizeCard';
export const CLASS_SPEC35={
 name:NAME,
 fields:[['String','owner'],['int','tickets'],['boolean','active']],
 constructor:[['String','ownerName'],['int','startingTickets'],['boolean','startingActive']],
 methods:[
  {name:'getOwner',returnType:'String',params:[],description:'Return the card owner.'},
  {name:'getTickets',returnType:'int',params:[],description:'Return the current ticket balance.'},
  {name:'isActive',returnType:'boolean',params:[],description:'Return whether the card is active.'},
  {name:'setOwner',returnType:'void',params:[['String','newOwner']],description:'Change the owner to the supplied name.'},
  {name:'setActive',returnType:'void',params:[['boolean','newStatus']],description:'Change the active flag to the supplied status.'},
  {name:'addTickets',returnType:'void',params:[['int','amount']],description:'Add amount to tickets only when amount is positive. Ignore zero and negative amounts.'},
  {name:'canRedeem',returnType:'boolean',params:[['int','cost']],description:'Return true only when the card is active, cost is positive, and there are enough tickets.'},
  {name:'redeemTickets',returnType:'boolean',params:[['int','cost']],description:'If redemption is permitted, deduct cost and return true. Otherwise leave tickets unchanged and return false.'}
 ]
};
export const starterClass35=`// Write the entire PrizeCard class below.\n// Use the specifications above.\n`;
const IDENT=/^[A-Za-z_$][\w$]*$/;
function stripComments(s){return s.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g,'');}
function parseParams(raw){if(!raw.trim())return [];return raw.split(',').map(text=>{const pair=text.trim().split(/\s+/);if(pair.length!==2||!IDENT.test(pair[1])||!['int','double','boolean','String'].includes(pair[0]))throw Error(`Invalid parameter declaration: ${text.trim()}.`);return pair;});}
function parseClass35(src){
 if(typeof src!=='string'||src.length>20000)throw Error('Your class must contain fewer than 20,000 characters.');
 const clean=stripComments(src).trim();
 const outer=clean.match(/^public\s+class\s+([A-Za-z_$][\w$]*)\s*\{/);
 if(!outer||outer[1]!==NAME)throw Error('Start with public class PrizeCard { and close the class at the end.');
 if(!clean.endsWith('}'))throw Error('Add the closing brace for PrizeCard.');
 const inner=clean.slice(outer[0].length,-1);let pos=0,fields=new Map(),methods=new Map(),constructor=null;
 const fieldRE=/\s*private\s+(int|double|boolean|String)\s+([A-Za-z_$][\w$]*)\s*;/y;
 const methodRE=/\s*public\s+(?:(void|int|double|boolean|String)\s+)?([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{/y;
 while(pos<inner.length){if(/^\s*$/.test(inner.slice(pos)))break;
  fieldRE.lastIndex=pos;const f=fieldRE.exec(inner);
  if(f){if(fields.has(f[2]))throw Error(`Instance variable ${f[2]} is declared more than once.`);fields.set(f[2],f[1]);pos=fieldRE.lastIndex;continue;}
  methodRE.lastIndex=pos;const m=methodRE.exec(inner);
  if(!m)throw Error(`Check the Java class structure near: ${inner.slice(pos,pos+55).trim()}. Use private fields and public constructors/methods.`);
  const returnType=m[1]||null,name=m[2],params=parseParams(m[3]);
  let depth=1,k=methodRE.lastIndex;
  // Quoted strings in method bodies do not affect curly-brace counting.
  let insideString=false,escaped=false;
  for(;k<inner.length;k++){const ch=inner[k];if(insideString){if(escaped)escaped=false;else if(ch==='\\')escaped=true;else if(ch==='"')insideString=false;continue;}if(ch==='"'){insideString=true;continue;}if(ch==='{')depth++;if(ch==='}'&&--depth===0)break;}
  if(depth!==0)throw Error(`Missing closing brace in ${name}.`);
  const source=inner.slice(methodRE.lastIndex,k);let ast;
  try{ast=parseBody(tokenize35(source));}catch(e){throw Error(`${name}: ${e.message}`);}
  const def={name,returnType,params,ast};
  if(name===NAME){if(returnType!==null)throw Error('A constructor has no return type.');if(constructor)throw Error('Write one parameterized PrizeCard constructor.');constructor=def;}
  else{if(!returnType)throw Error(`Method ${name} needs a return type.`);if(methods.has(name))throw Error(`Method ${name} is declared more than once.`);methods.set(name,def);}
  pos=k+1;
 }
 for(const [type,name] of CLASS_SPEC35.fields){if(fields.get(name)!==type)throw Error(`Declare private ${type} ${name}; exactly as specified.`);}
 if(fields.size!==CLASS_SPEC35.fields.length)throw Error('The class has unexpected instance variables. Check the three required fields.');
 if(!constructor)throw Error('Add public PrizeCard(String ..., int ..., boolean ...) to initialize the three fields.');
 function verifyParams(def,expected,display){if(def.params.length!==expected.length||def.params.some((x,i)=>x[0]!==expected[i][0]))throw Error(`${display} needs parameters (${expected.map(x=>x[0]).join(', ')}). Parameter names may differ.`);if(new Set(def.params.map(x=>x[1])).size!==def.params.length)throw Error(`${display} repeats a parameter name.`);}
 verifyParams(constructor,CLASS_SPEC35.constructor,'PrizeCard constructor');
 for(const required of CLASS_SPEC35.methods){const def=methods.get(required.name);if(!def)throw Error(`Missing required method: public ${required.returnType} ${required.name}(...).`);if(def.returnType!==required.returnType)throw Error(`Method ${required.name} must return ${required.returnType}.`);verifyParams(def,required.params,required.name);}
 if(methods.size!==CLASS_SPEC35.methods.length)throw Error('Remove extra methods not in the specification.');
 return {constructor,methods};
}
function typeMatch(type,value){return type==='int'?Number.isInteger(value):type==='double'?typeof value==='number'&&Number.isFinite(value):type==='boolean'?typeof value==='boolean':type==='String'?typeof value==='string':true;}
function newInstance(compiled,args,budget){const fields={owner:null,tickets:0,active:false};invoke(compiled,fields,compiled.constructor,args,budget);return fields;}
function invoke(compiled,fields,def,args,budget,depth=0){
 if(depth>12)throw Error('Too many nested method calls.');
 const env={__fieldValues:fields};def.params.forEach(([,p],i)=>env[p]=args[i]);
 env.__invoke=(name,values)=>{const target=compiled.methods.get(name);if(!target)throw Error(`Unknown method ${name}(...).`);return invoke(compiled,fields,target,values,budget,depth+1);};
 const result=execStatements(def.ast,env,Object.fromEntries(CLASS_SPEC35.fields),budget);
 if(def.name!==NAME){
  if(def.returnType==='void'&&result.returned&&result.result!==undefined)throw Error(`Void method ${def.name} cannot return a value.`);
  if(def.returnType!=='void'&&(!result.returned||!typeMatch(def.returnType,result.result)))throw Error(`${def.name} must return a ${def.returnType} value.`);
 }
 for(const [type,name] of CLASS_SPEC35.fields)if(!typeMatch(type,fields[name]))throw Error(`Field ${name} must contain a ${type} value.`);
 return result.result;
}
const CASES=[
 {name:'Constructor and accessors',initial:['Alex',12,true],actions:[['getOwner',[],'Alex'],['getTickets',[],12],['isActive',[],true]]},
 {name:'Another starting state',initial:['Jordan',0,false],actions:[['getOwner',[],'Jordan'],['getTickets',[],0],['isActive',[],false]]},
 {name:'Change owner and activation',initial:['Alex',5,true],actions:[['setOwner',['Casey']],['setActive',[false]],['getOwner',[],'Casey'],['isActive',[],false]]},
 {name:'Add positive tickets',initial:['Ari',10,true],actions:[['addTickets',[7]],['getTickets',[],17]]},
 {name:'Ignore zero or negative additions',initial:['Ari',10,true],actions:[['addTickets',[0]],['addTickets',[-8]],['getTickets',[],10]]},
 {name:'Redemption exact boundary',initial:['Ari',10,true],actions:[['canRedeem',[10],true],['redeemTickets',[10],true],['getTickets',[],0]]},
 {name:'Reject too-expensive redemption',initial:['Ari',10,true],actions:[['canRedeem',[11],false],['redeemTickets',[11],false],['getTickets',[],10]]},
 {name:'Reject zero cost',initial:['Ari',10,true],actions:[['canRedeem',[0],false],['redeemTickets',[0],false],['getTickets',[],10]]},
 {name:'Reject negative cost',initial:['Ari',10,true],actions:[['canRedeem',[-1],false],['redeemTickets',[-1],false],['getTickets',[],10]]},
 {name:'Inactive cards cannot redeem',initial:['Ari',10,false],actions:[['canRedeem',[5],false],['redeemTickets',[5],false],['getTickets',[],10]]},
 {name:'Combined state changes',initial:['Sky',3,true],actions:[['addTickets',[12]],['redeemTickets',[6],true],['getTickets',[],9],['setActive',[false]],['redeemTickets',[2],false],['getTickets',[],9]]},
 {name:'Reactivate and redeem',initial:['Sky',8,false],actions:[['setActive',[true]],['redeemTickets',[3],true],['getTickets',[],5]]}
];
export function evaluateFullClass35(source){let compiled;try{compiled=parseClass35(source);}catch(err){return {ok:false,error:err.message,tests:[],total:CASES.length};}
 const results=[];for(const [i,test] of CASES.entries()){
  try{
   const budget={count:2500},instance=newInstance(compiled,test.initial,budget);let pass=true,detail='All expected results and object state match.';
   for(const [name,args,expect] of test.actions){const method=compiled.methods.get(name),out=invoke(compiled,instance,method,args,budget);if(expect!==undefined&&out!==expect){pass=false;detail=`${name}(${args.map(x=>JSON.stringify(x)).join(', ')}) should return ${JSON.stringify(expect)}, but returned ${JSON.stringify(out)}.`;break;}}
   results.push({number:i+1,name:test.name,pass,detail});
  }catch(err){results.push({number:i+1,name:test.name,pass:false,detail:err.message});}
 }
 return {ok:results.every(t=>t.pass),tests:results,error:null,total:CASES.length};
}
