// Deliberately bounded Java-method subset for Topic 3.5. No eval / Function.
// Supports primitive expressions, assignments, blocks, if/else, while, for,
// method-local declarations, and return. A test suite runs methods independently.
const types=new Set(['int','double','boolean','String']);
const ident=s=>/^[A-Za-z_$][\w$]*$/.test(s);
const tokenRE=/\s+|\/\/[^\n]*|\/\*[\s\S]*?\*\/|(?:\d+\.\d+|\d+)|(?:"(?:\\.|[^"\\])*")|(?:==|!=|<=|>=|&&|\|\||\+\+|--|\+=|-=|\*=|\/=)|[A-Za-z_$][\w$]*|[{}();.,+\-*\/%!<>=]/gy;
export function tokenize35(s){const arr=[];let p=0;while(p<s.length){tokenRE.lastIndex=p;const m=tokenRE.exec(s);if(!m||m.index!==p)throw Error(`Unsupported Java syntax near: ${s.slice(p,p+24)}`);p=tokenRE.lastIndex;if(!/^\s+$/.test(m[0])&&!m[0].startsWith('//')&&!m[0].startsWith('/*'))arr.push(m[0]);if(arr.length>700)throw Error('This method is too long for the lesson editor.');}return arr;}
export function parseBody(tokens){let i=0;const peek=()=>tokens[i], take=()=>tokens[i++],eat=x=>peek()===x?(i++,true):false,need=x=>{if(!eat(x))throw Error(`Expected ${x} but found ${peek()||'end of method'}.`);};
 function primary(){
  const x=take();if(x===undefined)throw Error('Incomplete expression.');
  if(x==='('){const v=expr();need(')');return v;}
  if(x==='true'||x==='false')return {type:'lit',value:x==='true'};
  if(/^\d+(?:\.\d+)?$/.test(x))return {type:'lit',value:Number(x)};
  if(x[0]==='"')return {type:'lit',value:JSON.parse(x)};
  if(ident(x)){
   let name=x,qualified=false;
   if(x==='this'&&eat('.')){name=take();qualified=true;if(!ident(name))throw Error('Expected a field or method name after this.');}
   if(eat('(')){const args=[];if(!eat(')')){do{args.push(expr());}while(eat(','));need(')');}return {type:'call',name,args,qualified};}
   if(name==='this')throw Error('Use this.field or this.method(...) in this exercise.');
   return {type:qualified?'field':'var',name};
  }
  throw Error(`Unexpected ${x} in expression.`);
 }
 function unary(){if(['!','-','+'].includes(peek())){const op=take();return {type:'unary',op,a:unary()};}return primary();}
 const precedence=[['||'],['&&'],['==','!='],['<','>','<=','>='],['+','-'],['*','/','%']];
 function layer(n){if(n===precedence.length)return unary();let left=layer(n+1);while(precedence[n].includes(peek())){const op=take();left={type:'binary',op,a:left,b:layer(n+1)};}return left;}
 function expr(){return layer(0);}
 function statement(){if(eat('{')){const body=[];while(!eat('}')){if(i>=tokens.length)throw Error('Missing closing brace.');body.push(statement());}return {type:'block',body};}
  if(eat('if')){need('(');const condition=expr();need(')');const then=statement(),otherwise=eat('else')?statement():null;return {type:'if',condition,then,otherwise};}
  if(eat('while')){need('(');const condition=expr();need(')');return {type:'while',condition,body:statement()};}
  if(eat('for')){need('(');const init=simple(';');const condition=expr();need(';');const step=simple(')');return {type:'for',init,condition,step,body:statement()};}
  if(eat('return')){if(eat(';'))return {type:'return',expression:null};const expression=expr();need(';');return {type:'return',expression};}
  return simple(';');}
 function simple(end){
  let varType=null;if(types.has(peek()))varType=take();
  let name=take(),fieldQualified=false;
  if(name==='this'&&eat('.')){name=take();fieldQualified=true;}
  if(!ident(name))throw Error('Expected a variable name.');
  if(['++','--'].includes(peek())){const op=take();need(end);return {type:'assign',name,op,fieldQualified};}
  const op=take();if(!['=','+=','-=','*=','/='].includes(op))throw Error(`Expected an assignment operator after ${name}.`);
  const expression=expr();need(end);return {type:varType?'declare':'assign',name,varType,op,expression,fieldQualified};
 }
 const body=[];while(i<tokens.length)body.push(statement());return body;}
function evaluate(ast,env,fieldNames){
 if(ast.type==='lit')return ast.value;
 if(ast.type==='field'){
  if(!(ast.name in (env.__fieldValues||{})))throw Error(`Unknown instance variable ${ast.name}.`);
  return env.__fieldValues[ast.name];
 }
 if(ast.type==='var'){
  if(ast.name in env)return env[ast.name];
  if(ast.name in (env.__fieldValues||{}))return env.__fieldValues[ast.name];
  throw Error(`Unknown variable ${ast.name}.`);
 }
 if(ast.type==='call'){
  if(typeof env.__invoke!=='function')throw Error(`Calling ${ast.name}(...) is not supported in this exercise.`);
  return env.__invoke(ast.name,ast.args.map(x=>evaluate(x,env,fieldNames)),env);
 }
 if(ast.type==='unary'){const a=evaluate(ast.a,env,fieldNames);return ast.op==='!'?!a:ast.op==='-'?-a:+a;}
 const a=evaluate(ast.a,env,fieldNames);if(ast.op==='&&'&&!a)return false;if(ast.op==='||'&&a)return true;
 const b=evaluate(ast.b,env,fieldNames);
 switch(ast.op){case'+':return a+b;case'-':return a-b;case'*':return a*b;case'/':if(b===0)throw Error('Division by zero.');return a/b;case'%':return a%b;case'==':return a===b;case'!=':return a!==b;case'>':return a>b;case'<':return a<b;case'>=':return a>=b;case'<=':return a<=b;case'&&':return !!(a&&b);case'||':return !!(a||b);default:throw Error('Unsupported operator.');}
}
export function execStatements(body,env,fields,limit){let returned=false,result;
 function execute(node){
  if(--limit.count<0)throw Error('Execution stopped: possible infinite loop.');if(returned)return;
  if(node.type==='block'){for(const child of node.body){execute(child);if(returned)break;}return;}
  if(node.type==='if'){execute(evaluate(node.condition,env,fields)?node.then:node.otherwise||{type:'block',body:[]});return;}
  if(node.type==='while'){while(evaluate(node.condition,env,fields)&&!returned)execute(node.body);return;}
  if(node.type==='for'){execute(node.init);while(evaluate(node.condition,env,fields)&&!returned){execute(node.body);if(!returned)execute(node.step);}return;}
  if(node.type==='return'){result=node.expression?evaluate(node.expression,env,fields):undefined;returned=true;return;}
  if(node.type==='declare'&&node.name in env)throw Error(`Local ${node.name} duplicates a parameter or local name.`);
  const fieldObject=env.__fieldValues||{},exists=node.name in env||node.name in fieldObject;
  if(node.type==='assign'&&!exists)throw Error(`Variable ${node.name} has not been declared.`);
  if(node.fieldQualified&&!(node.name in fieldObject))throw Error(`Unknown instance variable ${node.name}.`);
  const target=node.fieldQualified?fieldObject:(node.name in env?env:node.name in fieldObject?fieldObject:env);
  const prev=target[node.name]??0;
  let v=node.op==='++'?prev+1:node.op==='--'?prev-1:evaluate(node.expression,env,fields);
  if(node.op==='+=')v=prev+v;if(node.op==='-=')v=prev-v;if(node.op==='*=')v=prev*v;if(node.op==='/=')v=prev/v;
  if(!Number.isFinite(v)&&typeof v==='number')throw Error('Non-finite number.');
  if((node.type==='declare'&&node.varType==='int')||(target===fieldObject&&fields[node.name]==='int'))v=Math.trunc(v);
  target[node.name]=v;
 }
 for(const stmt of body){execute(stmt);if(returned)break;}return {returned,result,env};
}
export const METHOD_CHALLENGES35=[
 {id:'tickets',className:'TicketCard',fields:[['int','tickets']],method:'addTickets',returnType:'void',params:[['int','amount']],task:'Write a public void method addTickets(int amount) that adds amount to the tickets field.',example:'public void addTickets(int amount) {\n    tickets += amount;\n}',tests:[{fields:{tickets:10},args:[5],expected:{tickets:15}},{fields:{tickets:0},args:[12],expected:{tickets:12}},{fields:{tickets:30},args:[0],expected:{tickets:30}},{fields:{tickets:100},args:[-15],expected:{tickets:85}}]},
 {id:'points',className:'ScoreCard',fields:[['int','score']],method:'pointsNeeded',returnType:'int',params:[['int','goal']],task:'Write a public int method pointsNeeded(int goal). Return 0 when score has reached the goal; otherwise return goal - score.',example:'public int pointsNeeded(int goal) {\n    if (score >= goal) {\n        return 0;\n    }\n    return goal - score;\n}',tests:[{fields:{score:10},args:[25],expectedReturn:15},{fields:{score:30},args:[30],expectedReturn:0},{fields:{score:40},args:[20],expectedReturn:0},{fields:{score:0},args:[7],expectedReturn:7}]},
 {id:'redeem',className:'PrizeMachine',fields:[['int','tickets'],['boolean','active']],method:'canRedeem',returnType:'boolean',params:[['int','cost']],task:'Write a public boolean method canRedeem(int cost). Return true only if the machine is active, cost is positive, and tickets is at least cost.',example:'public boolean canRedeem(int cost) {\n    return active && cost > 0 && tickets >= cost;\n}',tests:[{fields:{tickets:20,active:true},args:[10],expectedReturn:true},{fields:{tickets:5,active:true},args:[10],expectedReturn:false},{fields:{tickets:20,active:false},args:[10],expectedReturn:false},{fields:{tickets:20,active:true},args:[0],expectedReturn:false}]},
 {id:'sum',className:'BonusCounter',fields:[['int','bonus']],method:'addRounds',returnType:'int',params:[['int','rounds']],task:'Write public int addRounds(int rounds). Use a loop to add 1, 2, ... rounds to the bonus field, then return the new bonus value.',example:'public int addRounds(int rounds) {\n    for (int i = 1; i <= rounds; i++) {\n        bonus += i;\n    }\n    return bonus;\n}',tests:[{fields:{bonus:0},args:[3],expectedReturn:6,expected:{bonus:6}},{fields:{bonus:4},args:[2],expectedReturn:7,expected:{bonus:7}},{fields:{bonus:12},args:[0],expectedReturn:12,expected:{bonus:12}},{fields:{bonus:1},args:[5],expectedReturn:16,expected:{bonus:16}}]}
];
export function starter35(id){const c=METHOD_CHALLENGES35.find(c=>c.id===id)||METHOD_CHALLENGES35[0];return `public class ${c.className} {\n${c.fields.map(([type,name])=>`    private ${type} ${name};`).join('\n')}\n\n    // Write your complete method here.\n\n}`;}
export function compile35(source,c){if(String(source).length>12000)throw Error('The class is too long.');const clean=String(source).replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g,'').trim();const classMatch=clean.match(/^public\s+class\s+([A-Za-z_$][\w$]*)\s*\{([\s\S]*)\}\s*$/);if(!classMatch||classMatch[1]!==c.className)throw Error(`Keep the public class ${c.className} header.`);let inner=classMatch[2];for(const [type,name] of c.fields){const re=new RegExp(`\\bprivate\\s+${type}\\s+${name}\\s*;`);if(!re.test(inner))throw Error(`Keep private ${type} ${name};`);inner=inner.replace(re,'');}
 const h=inner.match(/\bpublic\s+(void|int|double|boolean|String)\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{/);if(!h||h[1]!==c.returnType||h[2]!==c.method)throw Error(`Write public ${c.returnType} ${c.method}(...) with a complete body.`);if(inner.slice(0,h.index).trim())throw Error('Only the required fields and method should be in this class.');const paramText=h[3].trim();const params=paramText?paramText.split(',').map(s=>s.trim().split(/\s+/)):[];if(params.length!==c.params.length||params.some((p,i)=>p.length!==2||p[0]!==c.params[i][0]||!ident(p[1])))throw Error(`The method needs ${c.params.map(([t,n])=>`${t} ${n}`).join(', ')} (parameter names may differ).`);
 let depth=1,pos=h.index+h[0].length,end=-1;for(let k=pos;k<inner.length;k++){if(inner[k]==='{')depth++;if(inner[k]==='}'&&!--depth){end=k;break;}}if(end<0)throw Error('Missing the method closing brace.');if(inner.slice(end+1).trim())throw Error('Remove extra statements outside the method.');return {ast:parseBody(tokenize35(inner.slice(pos,end))),params};}
export function runMethodTests35(source,id){const c=METHOD_CHALLENGES35.find(x=>x.id===id);if(!c)throw Error('Unknown challenge.');let compiled;try{compiled=compile35(source,c);}catch(e){return {ok:false,error:e.message,tests:c.tests.map((_,i)=>({number:i+1,pass:false,detail:'Syntax or structure needs correction.'}))};}
 let results=[];for(const [i,t] of c.tests.entries()){try{const env={...t.fields};c.fields.forEach(([type,name])=>{if(!(name in env))env[name]=type==='boolean'?false:0;});compiled.params.forEach((p,j)=>env[p[1]]=t.args[j]);env.__fieldValues=env;const out=execStatements(compiled.ast,env,Object.fromEntries(c.fields),{count:600});if(c.returnType!=='void'&&!out.returned)throw Error('Non-void method must return a value.');const retOk=c.returnType==='void'?!out.returned||out.result===undefined:out.returned&&out.result===t.expectedReturn;const fieldOk=Object.entries(t.expected||{}).every(([k,v])=>out.env[k]===v);const pass=retOk&&fieldOk;results.push({number:i+1,pass,detail:pass?'Correct output and state':`Expected ${t.expectedReturn!==undefined?'return '+t.expectedReturn+'; ':''}${JSON.stringify(t.expected||{})}, got ${String(out.result)}; ${JSON.stringify(Object.fromEntries(c.fields.map(([,name])=>[name,out.env[name]])))}`});}catch(e){results.push({number:i+1,pass:false,detail:e.message});}}
 return {ok:results.every(r=>r.pass),tests:results,error:null};}
