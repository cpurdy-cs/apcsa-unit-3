// Shared printable-text helpers for per-topic report plugins.
export const plain = value => String(value??'').normalize('NFKD').replace(/[\u2018\u2019]/g,"'").replace(/[\u201C\u201D]/g,'"').replace(/[\u2013\u2014]/g,'-').replace(/[^\x20-\x7E]/g,' ').replace(/\s+/g,' ').trim();
export const stamp = iso => iso ? new Date(iso).toLocaleString('en-US',{year:'numeric',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}) : 'Not recorded';
const display = st => st.identity ? `${st.identity.first} ${st.identity.last}.` : 'Teacher sample';
export const niceAnswer = (q,val)=>{
 if(val===undefined||val===null||val==='')return '(No response)';
 if(q.kind==='choice') return q.options[Number(val)]||'(No response)';
 if(q.kind==='category')return q.items.map(([label],i)=>`${label}: ${val[i]||'(blank)'}`).join(' | ');
 return String(val);
};
