import {TOPICS,IMPLEMENTED_TOPICS,getImplementedTopic} from './registry.js';
// Dependency-free offline PDF writer shared by all topic-report plugins.
const plain = value => String(value??'').normalize('NFKD').replace(/[\u2018\u2019]/g,"'").replace(/[\u201C\u201D]/g,'"').replace(/[\u2013\u2014]/g,'-').replace(/[^\x20-\x7E]/g,' ').replace(/\s+/g,' ').trim();
const escapePdf = s => plain(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
const display = st => st.identity ? `${st.identity.first} ${st.identity.last}.` : 'Teacher sample';
function textWidth(str,size,bold=false){
 // Helvetica approximation adequate for report pagination; displayed line width capped to margin.
 let count=0;for(const c of plain(str))count+=('il.,!:;|()[]\' '.includes(c)?0.29:'MW@#%'.includes(c)?0.85:0.54);
 return count*size*(bold?1.065:1);
}
function wrap(str,size,maxWidth,bold=false){
 const src=plain(str);if(!src)return [''];
 const words=src.split(/\s+/);let lines=[],line='';
 for(let word of words){
  if(textWidth(word,size,bold)>maxWidth){
   if(line){lines.push(line);line='';}
   let piece='';for(const ch of word){if(textWidth(piece+ch,size,bold)>maxWidth&&piece){lines.push(piece);piece='';}piece+=ch;}word=piece;
  }
  if(!line)line=word;
  else if(textWidth(line+' '+word,size,bold)<=maxWidth)line+=' '+word;
  else {lines.push(line);line=word;}
 }
 if(line)lines.push(line);return lines;
}
class Report {
 constructor(title){this.pages=[];this.page=null;this.title=title;this.newPage();}
 newPage(){this.page={operations:[],y:740};this.pages.push(this.page);this.ruleAt(46,753,566,'0.314 0 0',3);this.raw(`0.314 0 0 rg`);this.textAt(46,762,'FLOUR BLUFF  /  AP COMPUTER SCIENCE A',8,true);}
 raw(s){this.page.operations.push(s);}
 textAt(x,y,text,size=10,bold=false,color='0.16 0.18 0.22'){this.raw(`${color} rg BT /${bold?'F2':'F1'} ${size} Tf 1 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)} Tm (${escapePdf(text)}) Tj ET`);}
 ruleAt(x,y,x2,color='0.83 0.84 0.87',w=0.6){this.raw(`${color} RG ${w} w ${x} ${y} m ${x2} ${y} l S`);}
 ensure(h){if(this.page.y-h<63)this.newPage();}
 blank(n=8){this.ensure(n);this.page.y-=n;}
 heading(text,size=16){this.ensure(38);this.page.y-=8;this.textAt(46,this.page.y,text,size,true,'0.314 0 0');this.page.y-=24;}
 line(text='',opt={}){
  const size=opt.size||10,indent=opt.indent||0,width=520-indent;
  for(const t of wrap(text,size,width,!!opt.bold)){
   this.ensure(size+6);this.textAt(46+indent,this.page.y,t,size,!!opt.bold,opt.color||'0.16 0.18 0.22');this.page.y-=size+5;
  }
 }
 item(label,value){this.line(label,{bold:true});this.line(value,{indent:10,size:9});this.blank(3);}
 build(){
  const objects=[];
  const add=s=>{objects.push(s);return objects.length;};
  add('<< /Type /Catalog /Pages 2 0 R >>');
  add(''); // pages object set later
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  const refs=[];
  for(let i=0;i<this.pages.length;i++){
   const p=this.pages[i];p.operations.push(`0.48 0.50 0.54 rg BT /F1 8 Tf 1 0 0 1 46 31 Tm (Class Creation Lab | ${i+1} of ${this.pages.length}) Tj ET`);
   const contents=p.operations.join('\n')+'\n';
   const pageRef=add('');const streamRef=add(`<< /Length ${contents.length} >>\nstream\n${contents}endstream`);
   objects[pageRef-1]=`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${streamRef} 0 R >>`;
   refs.push(`${pageRef} 0 R`);
  }
  objects[1]=`<< /Type /Pages /Kids [${refs.join(' ')}] /Count ${this.pages.length} >>`;
  let out='%PDF-1.4\n';const offsets=[0];
  objects.forEach((o,i)=>{offsets.push(out.length);out+=`${i+1} 0 obj\n${o}\nendobj\n`;});
  const xref=out.length;out+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;
  for(const off of offsets.slice(1))out+=`${String(off).padStart(10,'0')} 00000 n \n`;
  out+=`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([out],{type:'application/pdf'});
 }
}

export function createReport(st,{cumulative=false,sample=false,topic='3.1'}={}){
 if(!cumulative&&!getImplementedTopic(topic))throw Error('Only developed topics can be exported.');
 const report=new Report('AP CSA Unit 3');
 report.heading(cumulative?'UNIT 3 | Cumulative progress report':`TOPIC ${topic} | Student report`,17);
 report.line(`Student: ${display(st)}`);report.line(`Generated: ${new Date().toLocaleString('en-US')}`);
 report.line('Curriculum: 2025 AP Computer Science A, Unit 3 Class Creation');
 report.line('Report format: Class Creation Lab v1.18');report.blank(8);
 if(sample)report.line('TEACHER SAMPLE - NOT A STUDENT SUBMISSION',{bold:true,color:'0.6 0.1 0.1'});
 // Show recorded teacher exceptions on individual and cumulative reports without inventing scores.
 const lessonOverrides=Object.entries(st.overrides?.lessons||{}).filter(([k])=>cumulative||k.startsWith(topic+'.')||(topic==='3.1'&&/^\d+$/.test(k)));
 const topicOverrides=Object.entries(st.overrides?.topics||{}).filter(([k])=>cumulative||k===topic);
 if(lessonOverrides.length||topicOverrides.length){
  report.heading('Teacher-authorized progress exceptions',13);
  for(const [key,x] of lessonOverrides)report.line(`Lesson ${key}: teacher-completed ${x.at||''}${x.reason?' | '+x.reason:''}`,{size:9});
  for(const [key,x] of topicOverrides)report.line(`Topic ${key}: prerequisite overridden ${x.at||''}${x.reason?' | '+x.reason:''}; no score awarded`,{size:9});
  report.blank(10);
 }
 if(cumulative){
  report.heading('Nine-topic unit dashboard',14);
  TOPICS.forEach(t=>{
   const attempts=st.assessments?.[t.id]?.attempts||[],highest=attempts.length?Math.max(...attempts.map(a=>a.score)):'-';
   const status=t.implemented?(highest!=='-'&&highest>=80?'Passed':highest!=='-'?'Needs teacher reset':'In progress'):'Not yet implemented';
   report.line(`${t.id} ${t.title}: ${status}${t.implemented?' | Highest '+highest+'/100':''}`,{size:9});
  });
  report.blank(8);
  const planned=TOPICS.filter(x=>!x.implemented);
  if(planned.length)report.line(`Topics ${planned[0].id}-${planned.at(-1).id} remain in development.`,{size:9});
  IMPLEMENTED_TOPICS.forEach((entry,index)=>{if(index>0)report.newPage();entry.writeReport(report,st);});
 }else getImplementedTopic(topic).writeReport(report,st);
 const n=(st.identity?.first||'Teacher')+'_'+(st.identity?.last||'Sample');
 const filename=`APCSA_${cumulative?'Unit3_Cumulative':'Topic'+topic.replace('.','-')}_${n}.pdf`;
 const blob=report.build(),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);
 return {filename,size:blob.size,pages:report.pages.length};
}
