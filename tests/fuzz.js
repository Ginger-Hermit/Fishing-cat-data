// Fuzzer: throws thousands of scrambled AI replies at the reading code and checks rules that must always hold.
// Run from the repo folder: node tests/fuzz.js [seed] [cases]   e.g. node tests/fuzz.js 7 20000   (no output lines starting with ! means no failures)
const fs=require("fs");const h=fs.readFileSync("index.html","utf8");
const grab=(a,b)=>h.slice(h.indexOf(a),h.indexOf(b));
eval(grab("const tidy =","async function readPrevious")+grab("function parseNum","function buildBillBook"));
let seed=+process.argv[2]||12345;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
const ri=n=>Math.floor(rnd()*n),pick=a=>a[ri(a.length)];
const NASTY=["","?","null","<script>alert(1)</script>","=HYPERLINK(\"x\")","+1","-1","@x","\u0000\u0007\u001b","🐱","‮","'\"`","x".repeat(5000),"1e999","-0","NaN","Infinity","0x10","1,2,3","1.2.3","  ","\n\n","\\","{","}","[","]","__proto__","constructor","toString"," 52.51K ","52,51K","9".repeat(400),"١٢٣","１２","1 234,56","12cr","cr","--5","(5","5)"];
const junkVal=(d=0)=>{const k=ri(12);return k===0?null:k===1?ri(1e6):k===2?-rnd()*1e9:k===3?true:k===4&&d<3?[junkVal(d+1),junkVal(d+1)]:k===5&&d<3?{a:junkVal(d+1),name:junkVal(d+1)}:k===6?pick(NASTY):k===7?1e308*10:k===8?String(ri(1e5)):k===9?rnd().toString(36).slice(2):k===10?undefined:pick(NASTY)+pick(NASTY);};
const good={row:()=>({rank:ri(200)+1,name:"user_"+ri(1e6),role:pick(["Member","Owner","Gym Bro"]),points:pick(["52.51K","1K","507","1.307M","2B","0","16.6k"])}),
 line:()=>({energy:pick(["electricity","gas","other"]),charge:pick(["Usage","Daily charge","Levy","Discount"]),used:String(ri(5000)),unit:pick(["kWh","MJ","m3","therms","CCF","days","","GJ","units","Tage"]),kwh_printed:pick(["","1122.06"]),calorific_value:pick(["","39.5"]),correction_factor:pick(["","1.02264"]),therm_factor:pick(["","1.051"]),amount:pick(["113.48","$70.88","27.65 cr","-3.10","98,60 €","1.234,56"])}),
 bill:()=>({supplier:"Co "+ri(99),country:"NZ",currency:"NZD",decimal_mark:pick([".",",","",5]),bill_date:"1 Jan",due_date:"2 Feb",period_days:String(ri(90)),estimated:pick([true,false,"yes"]),total_due:"$"+ri(900),lines:Array.from({length:ri(8)+1},good.line),notes:["A bill.","Fine."]})};
const corrupt=(o)=>{o=JSON.parse(JSON.stringify(o));const walk=(x,d)=>{if(x&&typeof x==="object"){for(const k of Object.keys(x)){if(rnd()<0.18)x[k]=junkVal();else if(rnd()<0.03)delete x[k];else walk(x[k],d+1);}if(rnd()<0.05)x[pick(NASTY)]=junkVal();}};walk(o,0);return o;};
const mangle=(t)=>{const k=ri(10);if(k===0)return t.slice(0,ri(t.length));if(k===1)return t.slice(ri(t.length));if(k===2){const i=ri(t.length);return t.slice(0,i)+pick(NASTY)+t.slice(i);}if(k===3)return "Here you go:\n```json\n"+t+"\n```\nHope that helps [1].";if(k===4){const i=ri(t.length);return t.slice(0,i)+t.slice(i+1+ri(5));}if(k===5)return t+t;if(k===6)return "["+t+"]";if(k===7)return t.replace(/"/g,rnd()<0.5?"'":"“");if(k===8)return pick(NASTY);return t;};
const stats={};const bump=(g,k)=>{stats[g]=stats[g]||{};stats[g][k]=(stats[g][k]||0)+1;};const fails=[];
const fail=(g,why,input)=>{bump(g,"FAIL");if((stats[g]["shown"]=(stats[g]["shown"]||0)+1)<=4)fails.push(g+": "+why+" | input: "+String(input).slice(0,160));};
const okText=(s,max)=>typeof s==="string"&&s.length<=max&&!/[\u0000-\u001f\u007f]/.test(s);
const KNOWN=/^The AI did not (return a list of rows|find any bill charges)/;
const N=+process.argv[3]||20000;
for(let i=0;i<N;i++){ // clan rows
  const text=mangle(JSON.stringify(Array.from({length:ri(12)},()=>rnd()<0.6?good.row():corrupt(good.row())).concat(rnd()<0.2?[junkVal()]:[])));
  bump("rows","cases");
  try{const r=parseRows(text);bump("rows",r.length?"gave rows":"gave none");
    for(const x of r){if(!okText(x.name,60)||!x.name)fail("rows","bad name",text);if(!okText(x.role,40))fail("rows","bad role",text);if(!okText(x.points,20)||!x.points)fail("rows","bad points",text);if(!(x.rank===""||(Number.isInteger(x.rank)&&x.rank>0&&x.rank<100000)))fail("rows","bad rank "+x.rank,text);const p=parsePoints(x.points);if(!(p===null||(Number.isFinite(p)&&p>=0)))fail("rows","bad points number",text);}
    const names=r.map(x=>x.name.toLowerCase()).filter(n=>n!=="?");if(new Set(names).size!==names.length)fail("rows","duplicate kept",text);
  }catch(e){if(e instanceof Error&&e.constructor===Error&&KNOWN.test(e.message))bump("rows","plain error");else fail("rows","raw error: "+e,text);}
}
for(let i=0;i<N;i++){ // bills
  const text=mangle(JSON.stringify({bills:Array.from({length:ri(4)+1},()=>rnd()<0.5?good.bill():corrupt(good.bill()))}));
  bump("bills","cases");
  try{const bs=parseBills(text);bump("bills","gave bills");if(bs.length>12)fail("bills","too many",text);
    for(const b of bs){if(!okText(b.supplier,50)||!okText(b.country,30)||!okText(b.currency,6)||!okText(b.billDate,30)||!okText(b.totalShown,30))fail("bills","bad text field",text);
      if(!(b.days===null||Number.isFinite(b.days))||!(b.total===null||Number.isFinite(b.total)))fail("bills","bad number",text);if(b.notes.length>4||b.notes.some(n=>!okText(n,220)))fail("bills","bad notes",text);if(!b.lines.length||b.lines.length>60)fail("bills","line count",text);
      for(const l of b.lines){if(!okText(l.charge,60)||!okText(l.unit,14)||!okText(l.how,200)||!okText(l.amountShown,30)||!okText(l.usedShown,30))fail("bills","bad line text",text);if(!(l.amount===null||Number.isFinite(l.amount))||!(l.used===null||Number.isFinite(l.used)))fail("bills","bad line number",text);
        if(l.k.add!==undefined&&!/^([*\/][\d.]+)*$/.test(l.k.add))fail("bills","unsafe formula part: "+l.k.add,text);if(l.k.value!==undefined&&!(Number.isFinite(l.k.value)&&l.k.value>=0))fail("bills","bad kWh value",text);if(!["Electricity","Gas","Other"].includes(l.type))fail("bills","bad type",text);if(l.amount===null&&!l.check)fail("bills","unread amount not flagged",text);}}
  }catch(e){if(e instanceof Error&&e.constructor===Error&&KNOWN.test(e.message))bump("bills","plain error");else fail("bills","raw error: "+e,text);}
}
for(let i=0;i<N;i++){ // numbers: print a known number in a random style, read it back
  const v=Math.round(rnd()*10**ri(8))/100,neg=rnd()<0.25,style=ri(4);bump("numbers","cases");
  const [int,dec]=v.toFixed(2).split(".");const grp=(sep)=>int.replace(/\B(?=(\d{3})+$)/g,sep);
  let s=style===0?int+"."+dec:style===1?grp(",")+"."+dec:style===2?grp(".")+","+dec:int+","+dec;const mark=style>=2?",":".";
  s=pick(["$","£","","NZ$ ",""])+s+pick([""," €"," NZD",""]);if(neg)s=pick(["-"+s,s+" cr","("+s+")",s+"-",s+" CR"]);
  const got=parseNum(s,mark),want=neg?-v:v;if(got===null||Math.abs(got-want)>1e-9)fail("numbers","'"+s+"' mark "+mark+" gave "+got+" want "+want,s);
  if(style!==2){const g2=parseNum(s,"");bump("numbers","no-mark cases");if(g2===null||Math.abs(g2-want)>1e-9){bump("numbers","no-mark wrong");if((stats.numbers.shown=(stats.numbers.shown||0)+1)<=3)fails.push("numbers(no mark given): '"+s+"' gave "+g2+" want "+want);}}
}
for(let i=0;i<N;i++){ // points: 52.51K style round trip
  const v=Math.round(rnd()*99999)/100,suf=pick(["","K","k","M","m","B","T"]);bump("points","cases");const mult={"":1,k:1e3,m:1e6,b:1e9,t:1e12}[suf.toLowerCase()];
  const s=pick([""," "])+String(v)+pick([""," "])+suf;const got=parsePoints(s);if(got!==Math.round(v*mult))fail("points","'"+s+"' gave "+got,s);
  const j=junkVal();bump("points","junk cases");try{const g=parsePoints(j);if(!(g===null||(Number.isFinite(g)&&g>=0)))fail("points","junk gave "+g,JSON.stringify(j));}catch(e){fail("points","threw "+e,JSON.stringify(j));}
  try{const g=parseNum(j,pick([".",",",""]));if(!(g===null||Number.isFinite(g)))fail("numbers","junk gave "+g,JSON.stringify(j));}catch(e){fail("numbers","threw "+e,JSON.stringify(j));}
}
console.log(JSON.stringify(stats));fails.forEach(f=>console.log("  ! "+f));
