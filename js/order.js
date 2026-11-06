/* Stable per-student display order. Answer keys and stored responses always use
 * original item indices/IDs; shuffling changes presentation, never grading.
 * Not a security boundary: the source code and answer keys are client-side.
 */
export function stableHash(value){
 let h=2166136261;
 for(const ch of String(value)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}
 return h>>>0;
}
export function stableShuffle(values, seed, salt){
 const out=[...values];let x=stableHash(`${seed}:${salt}`)||0x9e3779b9;
 const rand=()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296;};
 for(let i=out.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[out[i],out[j]]=[out[j],out[i]];}
 return out;
}
export function shuffledOptions(options,seed,salt){
 return stableShuffle(options.map((text,index)=>({text,index})),seed,salt);
}
export function shuffledDesign(items,seed,salt){
 const out=stableShuffle(items,seed,salt);
 // Three correct members must never appear as the first three checkboxes.
 if(out.length>=4 && out.slice(0,3).every(item=>item.ok)){
  const distractor=out.findIndex((item,i)=>i>=3&&!item.ok);
  if(distractor>=0)[out[1],out[distractor]]=[out[distractor],out[1]];
 }
 return out;
}
export function gradedChoiceTargets(seed,count){
 // Evenly distribute the correct A/B/C/D positions and avoid 3 in a row.
 const slots=Array.from({length:count},(_,i)=>i%4);
 for(let trial=0;trial<30;trial++){
  const candidate=stableShuffle(slots,seed,`graded-targets:${trial}`);
  if(candidate.every((v,i)=>i<2||v!==candidate[i-1]||v!==candidate[i-2]))return candidate;
 }
 return slots;
}
export function placeCorrectOption(options,correctIndex,targetIndex,seed,salt){
 const out=shuffledOptions(options,seed,salt);
 const current=out.findIndex(x=>x.index===correctIndex);
 if(current!==targetIndex && current>=0 && targetIndex>=0 && targetIndex<out.length){
  [out[current],out[targetIndex]]=[out[targetIndex],out[current]];
 }
 return out;
}
