/* Restricted, deterministic evaluator for the procedural abstraction sandbox.
 * It is NOT a full Java compiler. Accepted syntax: score=expression; score+=expression;
 * score-=expression; with integer literals, score, points, +, -, *, /, %, parentheses.
 * All arithmetic is Java int arithmetic, including 32-bit overflow and truncating division.
 */
function lex(s){
 const out=[]; let i=0;
 while(i<s.length){
  if(/\s/.test(s[i])){i++;continue;}
  if(s.slice(i,i+2)==='//'){while(i<s.length && s[i]!=='\n')i++;continue;}
  const m=/^(\d+|[A-Za-z_$][\w$]*|\+=|-=|[+\-*/%()=;])/.exec(s.slice(i));
  if(!m)throw Error(`Unsupported Java syntax near "${s.slice(i,i+12)}".`);
  out.push(m[0]);i+=m[0].length;
  if(out.length>200)throw Error('The code is too long for this introductory sandbox.');
 }
 return out;
}
export function runMethodBody(source,initialScore,points){
 const t=lex(source);let pos=0,score=initialScore|0;const trace=[];
 const take=(v)=>{if(t[pos]!==v)throw Error(`Expected "${v}" near token ${pos+1}.`);pos++;};
 const peek=()=>t[pos];
 const factor=()=>{
  if(peek()==='-'){pos++;return -factor()|0;}
  if(peek()==='+'){pos++;return factor();}
  if(peek()==='('){pos++;const v=expr();take(')');return v;}
  const atom=t[pos++];
  if(atom==='score')return score;
  if(atom==='points')return points|0;
  if(/^\d+$/.test(atom||''))return Number(atom)|0;
  throw Error(`Unknown variable or expression: "${atom||'end of code'}".`);
 };
 const term=()=>{let a=factor();while(['*','/','%'].includes(peek())){const op=t[pos++],b=factor();if((op==='/'||op==='%')&&b===0)throw Error('ArithmeticException: / by zero');a=op==='*'?Math.imul(a,b):(op==='/'?Math.trunc(a/b)|0:a%b|0);}return a;};
 const expr=()=>{let a=term();while(peek()==='+'||peek()==='-'){const op=t[pos++],b=term();a=op==='+'?(a+b)|0:(a-b)|0;}return a;};
 if(!t.length)throw Error('Write at least one statement.');
 while(pos<t.length){
  if(peek()!=='score')throw Error('Only assignments to the score instance variable are supported here.');
  pos++;let op=t[pos++];if(!['=','+=','-='].includes(op))throw Error('Use =, +=, or -= to update score.');
  let v=expr();take(';');score=op==='='?v:op==='+='?(score+v)|0:(score-v)|0;
  trace.push({operator:op,expressionValue:v,score});
  if(trace.length>15)throw Error('Limit this sandbox to 15 statements.');
 }
 return {score,trace};
}
export function testMethodBody(source){
 const cases=[{initialScore:10,points:5,expected:15},{initialScore:25,points:12,expected:37},{initialScore:0,points:3,expected:3}];
 return cases.map(c=>{try{const r=runMethodBody(source,c.initialScore,c.points);return {...c,actual:r.score,ok:r.score===c.expected,trace:r.trace};}catch(e){return {...c,actual:null,ok:false,error:e.message};}});
}
