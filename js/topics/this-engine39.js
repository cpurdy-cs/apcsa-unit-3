// Topic 3.9 isolated, bounded interpreter. No eval, dynamic Function, or network.
// Models Contact object identity, Java `this`, shadowing, and same-class private access.
const ident = s => /^[A-Za-z_$][\w$]*$/.test(s||'');
const kinds = new Set(['int','boolean','Contact','String']);
const tokenRE=/\s+|\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|\d+|(?:==|!=|<=|>=|&&|\|\||\+=|-=|\+\+|--)|[A-Za-z_$][\w$]*|[{}();.,+\-*\/%!<>=]/gy;
function tokenize(src){const out=[];let pos=0;while(pos<src.length){tokenRE.lastIndex=pos;const m=tokenRE.exec(src);if(!m||m.index!==pos)throw Error(`Unsupported Java syntax near ${src.slice(pos,pos+24)}.`);pos=tokenRE.lastIndex;if(!/^\s+$/.test(m[0])&&!m[0].startsWith('//')&&!m[0].startsWith('/*'))out.push(m[0]);if(out.length>5000)throw Error('Code exceeds interpreter token limit.');}return out;}
function parseBody(tokens){let i=0;const peek=()=>tokens[i],take=()=>tokens[i++],eat=x=>peek()===x?(i++,true):false,need=x=>{if(!eat(x))throw Error(`Expected ${x}, found ${peek()||'end'}.`);};
 function args(){const values=[];if(!eat(')')){do{values.push(expression());}while(eat(','));need(')');}return values;}
 function primary(){let x=take(),v;if(x===undefined)throw Error('Incomplete expression.');
  if(x==='('){v=expression();need(')');}
  else if(x==='true'||x==='false')v={kind:'literal',value:x==='true'};
  else if(x==='null')v={kind:'literal',value:null};
  else if(/^\d+$/.test(x))v={kind:'literal',value:Number(x)};
  else if(/^"/.test(x))v={kind:'literal',value:JSON.parse(x)};
  else if(x==='new'){need('Contact');need('(');v={kind:'new',args:args()};}
  else if(ident(x))v={kind:'variable',name:x};
  else throw Error(`Unexpected ${x}.`);
  while(peek()==='.'||peek()==='('){if(eat('.')){const name=take();if(!ident(name))throw Error('Expected member name after dot.');v={kind:'member',object:v,name};}
   else if(eat('('))v={kind:'call',callee:v,args:args()};}
  return v;
 }
 function unary(){if(['-','+','!'].includes(peek()))return {kind:'unary',op:take(),arg:unary()};return primary();}
 const levels=[['||'],['&&'],['==','!='],['<','>','<=','>='],['+','-'],['*','/','%']];
 function precedence(n){if(n===levels.length)return unary();let a=precedence(n+1);while(levels[n].includes(peek())){const op=take();a={kind:'binary',op,left:a,right:precedence(n+1)};}return a;}
 function expression(){return precedence(0);}
 function statement(){if(eat('{')){const body=[];while(!eat('}')){if(peek()===undefined)throw Error('Unclosed block.');body.push(statement());}return {kind:'block',body};}
  if(eat('if')){need('(');const condition=expression();need(')');const yes=statement(),no=eat('else')?statement():null;return {kind:'if',condition,yes,no};}
  if(eat('while')){need('(');const condition=expression();need(')');return {kind:'while',condition,body:statement()};}
  if(eat('return')){if(eat(';'))return {kind:'return',expr:null};const expr=expression();need(';');return {kind:'return',expr};}
  if(kinds.has(peek())){const type=take(),name=take();if(!ident(name))throw Error('Missing local variable name.');const expr=eat('=')?expression():null;need(';');return {kind:'declare',type,name,expr};}
  const left=expression(),op=peek();if(['=','+=','-=','++','--'].includes(op)){take();const right=['++','--'].includes(op)?null:expression();need(';');return {kind:'assign',left,op,right};}
  need(';');if(left.kind!=='call')throw Error('Only method calls can stand alone as statements.');return {kind:'expression',expr:left};
 }
 const ast=[];while(i<tokens.length)ast.push(statement());return ast;}
export const CONTACT_SPEC39={fields:['private String name;','private Contact lastSender;'],constructor:'public Contact(String name)',methods:[
 ['public String getName()','Return this contact’s name.'],
 ['public void rename(String name)','Update the name. The parameter has the same name as the instance variable.'],
 ['public Contact getLastSender()','Return the reference to the most recent sender, or null if none.'],
 ['public void sendTo(Contact recipient)','Ask recipient to receive from the current contact by calling recipient.receiveFrom(this).'],
 ['public void receiveFrom(Contact sender)','Store the sender reference in lastSender (do not construct a copy).']
]};
export const STARTER39='// Write the complete Contact class here.\n';
const specs=new Map([['getName',['String',[]]],['rename',['void',['String']]],['getLastSender',['Contact',[]]],['sendTo',['void',['Contact']]],['receiveFrom',['void',['Contact']]]]);
function strip(s){return s.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g,'');}
export function compileClass39(source){let src=strip(String(source)).trim();if(src.length>22000)throw Error('Keep the complete class below 22,000 characters.');const head=/^public\s+class\s+Contact\s*\{/.exec(src);if(!head||!src.endsWith('}'))throw Error('Write public class Contact { ... } including its closing brace.');src=src.slice(head[0].length,-1);
 let pos=0,ctor=null,fields=new Set(),methods=new Map();const field=/\s*private\s+(String|Contact)\s+(name|lastSender)\s*;/y,method=/\s*public\s+(static\s+)?(?:(void|int|boolean|String|Contact)\s+)?([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{/y;
 while(pos<src.length){if(!src.slice(pos).trim())break;field.lastIndex=pos;const f=field.exec(src);if(f){if(fields.has(f[2]))throw Error('Duplicate instance variable '+f[2]+'.');fields.add(f[2]);pos=field.lastIndex;continue;}
  method.lastIndex=pos;const m=method.exec(src);if(!m)throw Error('Check class declarations near '+src.slice(pos,pos+55).trim()+'.');
  let depth=1,k=method.lastIndex,quoted=false,escaped=false;for(;k<src.length;k++){const ch=src[k];if(quoted){if(escaped)escaped=false;else if(ch==='\\')escaped=true;else if(ch==='"')quoted=false;continue;}if(ch==='"'){quoted=true;continue;}if(ch==='{')depth++;else if(ch==='}'&&--depth===0)break;}if(depth)throw Error('Unclosed method '+m[3]+'.');
  const args=m[4].trim()?m[4].split(',').map(p=>p.trim().split(/\s+/)):[];
  if(args.some(p=>p.length!==2||!kinds.has(p[0])||!ident(p[1]))||new Set(args.map(p=>p[1])).size!==args.length)throw Error('Invalid parameter list in '+m[3]+'.');
  const def={name:m[3],static:!!m[1],ret:m[2]||null,params:args,ast:parseBody(tokenize(src.slice(method.lastIndex,k)))};
  if(def.name==='Contact'){if(def.static||def.ret||ctor)throw Error('Write exactly one public Contact(String name) constructor.');ctor=def;}
  else {if(!def.ret||methods.has(def.name))throw Error('Methods must have return types and unique names.');methods.set(def.name,def);}pos=k+1;
 }
 if(fields.size!==2||!fields.has('name')||!fields.has('lastSender'))throw Error('Declare both private String name; and private Contact lastSender;.');
 if(!ctor||ctor.params.length!==1||ctor.params[0][0]!=='String')throw Error('Constructor signature must be public Contact(String name); parameter name may vary.');
 for(const [name,[ret,types]] of specs){const d=methods.get(name);if(!d||d.ret!==ret||d.params.length!==types.length||d.params.some((p,i)=>p[0]!==types[i])||d.static)throw Error(`Check method signature for ${name}: ${ret} ${name}(${types.join(', ')}), instance.`);}
 // The learning objective explicitly requires passing `this`, not merely computing an equivalent result.
 const containsThis=node=>!!node&&typeof node==='object'&&(node.kind==='variable'&&node.name==='this'||Object.values(node).some(v=>Array.isArray(v)?v.some(containsThis):typeof v==='object'&&v!==null&&containsThis(v)));
 for(const method of methods.values())if(method.static&&method.ast.some(containsThis))throw Error('this cannot be used in a static method.');
 const passesThis=node=>{if(!node||typeof node!=='object')return false;if(node.kind==='call'){const callee=node.callee,method=callee.kind==='member'?callee.name:callee.name;if(method==='receiveFrom'&&node.args.some(a=>a.kind==='variable'&&a.name==='this'))return true;}return Object.values(node).some(v=>Array.isArray(v)?v.some(passesThis):typeof v==='object'&&v!==null&&passesThis(v));};
 if(!methods.get('sendTo').ast.some(passesThis))throw Error('sendTo must pass this to receiveFrom(...), for example recipient.receiveFrom(this).');
 return {ctor,methods};
}
function machine(program){let nextId=1,steps=0;const budget=()=>{if(++steps>17000)throw Error('Execution limit reached. Check for infinite recursion or loops.');};
 function invoke(self,def,args,depth=0){if(depth>40)throw Error('Too many nested method calls.');if(args.length!==def.params.length)throw Error('Wrong argument count in '+def.name+'.');if(!def.static&&(!self||self.__class!=='Contact'))throw Error('An instance method requires a Contact receiver.');
  const scopes=[Object.fromEntries(def.params.map(([type,name],i)=>[name,args[i]]))];const current=()=>scopes.at(-1);const fieldNames=['name','lastSender'];
  function slot(name){for(let i=scopes.length-1;i>=0;i--)if(Object.hasOwn(scopes[i],name))return scopes[i];if(!def.static&&fieldNames.includes(name))return self;return null;}
  function evalExpr(node){budget();if(!node)throw Error('Missing expression.');switch(node.kind){
   case'literal':return node.value;
   case'variable':{if(node.name==='this'){if(def.static)throw Error('this cannot be used inside a static method.');return self;}if(node.name==='Contact'||node.name==='Math')return {__className:node.name};const owner=slot(node.name);if(!owner)throw Error(`Variable ${node.name} is not in scope.`);return owner[node.name];}
   case'member':{const obj=evalExpr(node.object);if(obj?.__class==='Contact'&&fieldNames.includes(node.name))return obj[node.name];throw Error('Unknown member '+node.name+'.');}
   case'new':return alloc(...node.args.map(evalExpr));
   case'call':{let receiver=self,name,kind='instance';if(node.callee.kind==='member'){receiver=evalExpr(node.callee.object);name=node.callee.name;if(receiver?.__className==='Math'&&name==='abs'){const a=node.args.map(evalExpr);if(a.length!==1)throw Error('Math.abs takes one argument.');return Math.abs(a[0]);}if(receiver?.__className==='Contact')kind='static';}else if(node.callee.kind==='variable'){name=node.callee.name;kind=program.methods.get(name)?.static?'static':'instance';}else throw Error('Unsupported call target.');const target=program.methods.get(name);if(!target)throw Error('Unknown method '+name+'().');if(target.static!== (kind==='static'))throw Error('Use correct instance or class receiver for '+name+'().');return invoke(kind==='static'?null:receiver,target,node.args.map(evalExpr),depth+1);}
   case'unary':{const a=evalExpr(node.arg);return node.op==='!'?!a:node.op==='-'?-a:+a;}
   case'binary':{const a=evalExpr(node.left);if(node.op==='&&'&&!a)return false;if(node.op==='||'&&a)return true;const b=evalExpr(node.right);switch(node.op){case'+':return a+b;case'-':return a-b;case'*':return a*b;case'/':return Math.trunc(a/b);case'%':return a%b;case'<':return a<b;case'<=':return a<=b;case'>':return a>b;case'>=':return a>=b;case'==':return a===b;case'!=':return a!==b;case'&&':return !!(a&&b);case'||':return !!(a||b);}}}
   throw Error('Unsupported expression.');}
  function assignSlot(node){if(node.kind==='variable'){if(node.name==='this')throw Error('Cannot reassign this.');const owner=slot(node.name);if(owner)return {owner,name:node.name};}if(node.kind==='member'){const owner=evalExpr(node.object);if(owner?.__class==='Contact'&&fieldNames.includes(node.name))return {owner,name:node.name};}throw Error('Assignment must target an accessible instance variable or variable.');}
  function block(list,push=false){if(push)scopes.push({});try{for(const stmt of list){const answer=execute(stmt);if(answer?.returned)return answer;}}finally{if(push)scopes.pop();}return null;}
  function execute(x){budget();switch(x.kind){
   case'block':return block(x.body,true);
   case'if':return execute(evalExpr(x.condition)?x.yes:(x.no||{kind:'block',body:[]}));
   case'while':{while(evalExpr(x.condition)){const a=execute(x.body);if(a?.returned)return a;}return null;}
   case'return':return {returned:true,value:x.expr?evalExpr(x.expr):undefined};
   case'expression':evalExpr(x.expr);return null;
   case'declare':{if(scopes.some(s=>Object.hasOwn(s,x.name)))throw Error('Duplicate local variable '+x.name+'.');current()[x.name]=x.expr?evalExpr(x.expr):x.type==='Contact'?null:x.type==='boolean'?false:0;return null;}
   case'assign':{const {owner,name}=assignSlot(x.left),old=owner[name];const v=x.op==='++'?old+1:x.op==='--'?old-1:evalExpr(x.right);let result=x.op==='+='?old+v:x.op==='-='?old-v:v;if(typeof result==='number')result=Math.trunc(result);owner[name]=result;return null;}}
   throw Error('Unsupported statement.');}
  const result=block(def.ast);if(def.ret==='int'&&!Number.isInteger(result?.value))throw Error(def.name+' must return an int.');if(def.ret==='boolean'&&typeof result?.value!=='boolean')throw Error(def.name+' must return boolean.');if(def.ret==='String'&&typeof result?.value!=='string')throw Error(def.name+' must return a String.');if(def.ret==='Contact'&&result?.value!==null&&result?.value?.__class!=='Contact')throw Error(def.name+' must return a Contact reference.');if(def.ret==='void'&&result?.value!==undefined)throw Error(def.name+' cannot return a value.');return result?.value;
 }
 function alloc(name){const obj={__class:'Contact',__id:nextId++,name:null,lastSender:null};invoke(obj,program.ctor,[name]);return obj;}
 return {alloc,call:(obj,name,...args)=>{const method=program.methods.get(name);if(!method)throw Error('Unknown method '+name+'.');return invoke(method.static?null:obj,method,args);}};
}

const cases=[];
function test(name,input,expected,run){cases.push({name,input,expected,run});}
function id(x){return x?x.__id:null;}
test('Constructor saves name', 'Contact a = new Contact("Alex"); a.getName();', 'Alex',m=>m.call(m.alloc('Alex'),'getName'));
test('Constructor accepts another name', 'Contact a = new Contact("Blair"); a.getName();', 'Blair',m=>m.call(m.alloc('Blair'),'getName'));
test('Constructor accepts empty string', 'Contact a = new Contact(""); a.getName();', '(empty String)',m=>m.call(m.alloc(''),'getName'));
test('No sender before messages', 'Contact a = new Contact("Alex"); a.getLastSender();', 'null',m=>m.call(m.alloc('Alex'),'getLastSender'));
test('Rename updates current object', 'Contact a = new Contact("Alex"); a.rename("Avery");', 'Avery',m=>{const a=m.alloc('Alex');m.call(a,'rename','Avery');return m.call(a,'getName');});
test('Rename to empty name', 'a.rename("");', '(empty String)',m=>{const a=m.alloc('Alex');m.call(a,'rename','');return a.name;});
test('Renaming one object leaves other unchanged', 'a.rename("A"); b.getName();', 'Blair',m=>{const a=m.alloc('Alex'),b=m.alloc('Blair');m.call(a,'rename','A');return b.name;});
test('One contact sends to another', 'a.sendTo(b); b.getLastSender()==a;', 'true (same reference)',m=>{const a=m.alloc('Alex'),b=m.alloc('Blair');m.call(a,'sendTo',b);return m.call(b,'getLastSender')===a;});
test('Receiver initially unchanged until a send', 'a.getLastSender(); b.getLastSender();', 'null, null',m=>{const a=m.alloc('Alex'),b=m.alloc('Blair');return [id(a.lastSender),id(b.lastSender)];});
test('Send does not change sender own lastSender', 'a.sendTo(b); a.getLastSender();', 'null',m=>{const a=m.alloc('Alex'),b=m.alloc('Blair');m.call(a,'sendTo',b);return id(a.lastSender);});
test('Send in reverse direction', 'b.sendTo(a); a.getLastSender()==b;', 'true',m=>{const a=m.alloc('Alex'),b=m.alloc('Blair');m.call(b,'sendTo',a);return a.lastSender===b;});
test('Sender reference reflects later rename', 'a.sendTo(b); a.rename("Alex R"); b.getLastSender().getName();', 'Alex R',m=>{const a=m.alloc('Alex'),b=m.alloc('Blair');m.call(a,'sendTo',b);m.call(a,'rename','Alex R');return m.call(m.call(b,'getLastSender'),'getName');});
test('New sender replaces former sender', 'a.sendTo(c); b.sendTo(c); c.getLastSender()==b;', 'true',m=>{const a=m.alloc('Alex'),b=m.alloc('Blair'),c=m.alloc('Casey');m.call(a,'sendTo',c);m.call(b,'sendTo',c);return c.lastSender===b;});
test('Repeat send retains exact sender', 'a.sendTo(b); a.sendTo(b); b.getLastSender()==a;', 'true',m=>{const a=m.alloc('Alex'),b=m.alloc('Blair');m.call(a,'sendTo',b);m.call(a,'sendTo',b);return b.lastSender===a;});
test('Self-send is allowed', 'a.sendTo(a); a.getLastSender()==a;', 'true',m=>{const a=m.alloc('Alex');m.call(a,'sendTo',a);return a.lastSender===a;});
test('Explicit receiveFrom works', 'b.receiveFrom(a); b.getLastSender()==a;', 'true',m=>{const a=m.alloc('Alex'),b=m.alloc('Blair');m.call(b,'receiveFrom',a);return b.lastSender===a;});
test('Three contacts send in sequence', 'a.sendTo(b); b.sendTo(c); c.sendTo(a);', 'b.lastSender=a, c.lastSender=b, a.lastSender=c',m=>{const a=m.alloc('Alex'),b=m.alloc('Blair'),c=m.alloc('Casey');m.call(a,'sendTo',b);m.call(b,'sendTo',c);m.call(c,'sendTo',a);return [b.lastSender===a,c.lastSender===b,a.lastSender===c];});
test('Different recipients retain independent senders', 'a.sendTo(b); c.sendTo(d);', 'b->a and d->c',m=>{const a=m.alloc('A'),b=m.alloc('B'),c=m.alloc('C'),d=m.alloc('D');m.call(a,'sendTo',b);m.call(c,'sendTo',d);return [b.lastSender===a,d.lastSender===c];});
test('Renaming recipient does not change sender', 'a.sendTo(b); b.rename("Bee");', 'b.lastSender=a',m=>{const a=m.alloc('Alex'),b=m.alloc('Blair');m.call(a,'sendTo',b);m.call(b,'rename','Bee');return b.lastSender===a;});
test('Sender keeps identity across multiple sends', 'a.sendTo(b); a.sendTo(c);', 'both lastSender refer to a',m=>{const a=m.alloc('Alex'),b=m.alloc('Blair'),c=m.alloc('Casey');m.call(a,'sendTo',b);m.call(a,'sendTo',c);return [b.lastSender===a,c.lastSender===a];});
export const TEST_COUNT39=cases.length;
export function evaluateClass39(source){let compiled;try{compiled=compileClass39(source);}catch(error){return {ok:false,error:error.message,tests:[],total:cases.length};}
 const expectedOutputs=['Alex','Blair','',null,'Avery','','Blair',true,[null,null],null,true,'Alex R',true,true,true,true,[true,true,true],[true,true],true,[true,true]];
 const tests=cases.map((t,i)=>{try{const actual=t.run(machine(compiled)),expected=t.expected,pass=JSON.stringify(actual)===JSON.stringify(expectedOutputs[i]);return {number:i+1,name:t.name,input:t.input,expected,actual:JSON.stringify(actual),pass,detail:pass?'Matched the expected result.':'Compare the returned value or stored Contact reference with the expected behavior.'};}catch(error){return {number:i+1,name:t.name,input:t.input,expected:t.expected,actual:'Execution error: '+error.message,pass:false,detail:'Inspect the method and the exact call that failed.'};}});
 return {ok:tests.every(t=>t.pass),error:tests.every(t=>t.pass)?null:'Inspect the failing tests and correct your class.',tests,total:tests.length};}
