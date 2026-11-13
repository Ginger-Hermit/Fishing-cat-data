// Checks reading numbers and units from energy bills. Run from the repo folder: node tests/bills.test.js
const fs=require("fs");const h=fs.readFileSync("index.html","utf8")+"<script>"+fs.readFileSync("app.js","utf8")+"</script>";
const grab=(a,b)=>h.slice(h.indexOf(a),h.indexOf(b));
eval(grab("const tidy =","function parseRows")+grab("function parseNum","function buildBillBook"));
const A=require("assert");
// numbers as printed
A.equal(parseNum("113.48"),113.48);A.equal(parseNum("$1,234.56"),1234.56);A.equal(parseNum("27.65 cr"),-27.65);A.equal(parseNum("-27.65"),-27.65);
A.equal(parseNum("(27.65)"),-27.65);A.equal(parseNum("27.65-"),-27.65);A.equal(parseNum("98,60 €",","),98.6);A.equal(parseNum("1.234,56",","),1234.56);
A.equal(parseNum("98,60"),98.6);A.equal(parseNum("1,180"),1180);A.equal(parseNum("1,180","."),1180);A.equal(parseNum("38 m3"),38);A.equal(parseNum("425 kWh"),425);
A.equal(parseNum(""),null);A.equal(parseNum("n/a"),null);A.equal(parseNum(null),null);A.equal(parseNum({}),null);A.equal(parseNum("1.2.3"),null);A.equal(parseNum(507),507);
// units
A.deepEqual(kwhFor({unit:"kWh"}),{add:"",how:"as shown"});A.equal(kwhFor({unit:"MJ"}).add,"/3.6");A.equal(kwhFor({unit:"Therms"}).add,"*29.3071");
A.equal(kwhFor({unit:"c/unit",energy:"electricity"}).how,"units = kWh");A.equal(kwhFor({unit:"c/day",energy:"electricity"}).how,"");A.equal(kwhFor({unit:"$/MJ"}).add,"/3.6");
A.equal(kwhFor({unit:"m³",calorific_value:"39.1",correction_factor:"1.02264"}).add,"*1.02264*39.1/3.6");
A.equal(kwhFor({unit:"m3",kwh_printed:"1122.06",calorific_value:"39.5"}).value,1122.06);
A.equal(kwhFor({unit:"m3"}).check,true);A.equal(kwhFor({unit:"CCF",therm_factor:"1.051"}).add,"*1.051*29.3071");A.equal(kwhFor({unit:"CCF"}).check,true);
A.equal(kwhFor({unit:"days"}).how,"");A.equal(kwhFor({unit:"Tage"}).how,"");A.equal(kwhFor({unit:"units",energy:"electricity"}).add,"");A.equal(kwhFor({unit:"units",energy:"gas"}).check,true);
A.equal(kwhFor({unit:"bananas"}).check,true);
// whole replies
let b=parseBills(JSON.stringify({bills:[{supplier:"Example Power",decimal_mark:".",period_days:"31",estimated:true,total_due:"$123.49",lines:[{energy:"electricity",charge:"Usage",used:"425",unit:"kWh",amount:"$94.99"},{energy:"electricity",charge:"Levy",used:"425",unit:"kWh",amount:"0.60"},{energy:"electricity",charge:"Daily charge",used:"31",unit:"days",amount:"27.90"},{energy:"other",charge:"Discount",amount:"10.00 cr"}],notes:["A power bill.",5,"x".repeat(900)]}]}));
A.equal(b.length,1);A.equal(b[0].lines.length,4);A.equal(b[0].lines[0].k.add,"");A.equal(b[0].lines[1].k.add,undefined);A.ok(/not counted twice/.test(b[0].lines[1].how));
A.equal(b[0].lines[3].amount,-10);A.equal(b[0].days,31);A.equal(b[0].total,123.49);A.equal(b[0].estimated,"Yes");A.equal(b[0].notes.length,3);A.equal(b[0].notes[2].length,220);
b=parseBills('```json\n{"supplier":"One","lines":[{"charge":"Gas","energy":"gas","used":"12","unit":"furlongs","amount":"?"}]}\n```');
A.equal(b[0].lines[0].check,true);A.equal(b[0].lines[0].amount,null);
for(const bad of ["","sorry","[]","{}",'{"bills":[]}','{"bills":[{"lines":[]}]}','{"bills":[null,5,{"lines":"x"}]}','{"bills":{"a":1}}']) A.throws(()=>parseBills(bad),/did not find any bill/);
// non-energy bills: no kWh, no false "check" flags
b=parseBills(JSON.stringify({bills:[{supplier:"Aqua Co",decimal_mark:".",lines:[{energy:"other",kind:"water",charge:"Water use",used:"38",unit:"m3",amount:"61.20"},{energy:"other",kind:"phone",charge:"Plan",used:"1",unit:"month",amount:"45"}]}]}));
A.equal(b[0].lines[0].type,"Water");A.ok(!b[0].lines[0].check);A.equal(b[0].lines[0].k.add,undefined);A.equal(b[0].lines[0].amount,61.2);A.equal(b[0].lines[1].type,"Phone");
// phone-bill line types (plan, pro-rata, discount, usage, instalment, fee) read without flags
b=parseBills(JSON.stringify({bills:[{supplier:"Example Mobile",currency:"NZD",decimal_mark:".",total_due:"$96.40",lines:[{energy:"other",kind:"phone",charge:"Plan",amount:"$79.00"},{energy:"other",kind:"phone",charge:"Pro-rata plan",amount:"$12.40"},{energy:"other",kind:"phone",charge:"Discount",amount:"-$10.00"},{energy:"other",kind:"phone",charge:"Extra data",used:"2",unit:"GB",amount:"$10.00"},{energy:"other",kind:"phone",charge:"Phone instalment",amount:"$15.00"},{energy:"other",kind:"phone",charge:"Late fee",amount:"$0.00"}]}]}));
A.equal(b[0].lines.length,6);A.equal(b[0].lines[2].amount,-10);A.ok(b[0].lines.every(l=>!l.check));
b=parseBills(JSON.stringify({bills:[{lines:[{energy:"other",kind:"wa\"ter)",charge:"x",amount:"1"}]}]}));A.equal(b[0].lines[0].type,"Water");
// Spark phone bill, 27 Oct 2026 (names, address, account and phone numbers left out): charges must add up to the printed total
b=parseBills(JSON.stringify({bills:[{supplier:"Spark New Zealand Trading Ltd",country:"New Zealand",currency:"NZD",decimal_mark:".",bill_date:"27 October 2026",period_days:"30",estimated:false,total_due:"$139.69",lines:[
{energy:"other",kind:"phone",charge:"150GB Endless Plan",amount:"$78.00"},{energy:"other",kind:"phone",charge:"$700 Device discount split over 36 months",amount:"-$19.45"},
{energy:"other",kind:"phone",charge:"Spotify Premium",amount:"$20.99"},{energy:"other",kind:"phone",charge:"Spotify Premium Discount",amount:"-$7.00"},
{energy:"other",kind:"phone",charge:"Instalment 33 of 36 - Galaxy S24 Ultra 5G",amount:"$65.28"},{energy:"other",kind:"phone",charge:"Multimedia Messaging",used:"3",unit:"messages",amount:"$1.47"},
{energy:"other",kind:"phone",charge:"Text Service",used:"2",unit:"texts",amount:"$0.40"}]}]}));
A.equal(b[0].lines.length,7);A.ok(b[0].lines.every(l=>!l.check&&l.type==="Phone"));A.equal(b[0].total,139.69);A.equal(b[0].days,30);
A.equal(Math.round(b[0].lines.reduce((t,l)=>t+l.amount,0)*100)/100,139.69);
// Cut-off reply: keep the complete charges, drop the half-written one.
{const full=JSON.stringify({bills:[{supplier:"A",decimal_mark:".",lines:[{energy:"other",kind:"water",charge:"W1",amount:"5"},{energy:"other",kind:"water",charge:"W2",amount:"6"}]},{supplier:"B",lines:[{energy:"other",kind:"water",charge:"W3",amount:"7"}]}]});
const c=parseBills(full.slice(0,full.indexOf("W2")+6));A.ok(c.cut);A.equal(c.length,1);A.equal(c[0].lines.length,1);
const c2=parseBills(full.slice(0,full.indexOf("W3")-5));A.ok(c2.cut);A.equal(c2[0].lines.length,2);A.ok(!parseBills(full).cut);}
A.equal(parseNum("1 234,56"),1234.56);A.equal(parseNum("€ 12 345.00"),12345);
A.equal(parseNum("1.234.567"),1234567);A.equal(parseNum("1.234.567,89"),1234567.89);A.equal(parseNum("1,234.56"),1234.56);
A.equal(parseNum("USD -12.50"),-12.5);A.equal(parseNum("-$5.00"),-5);A.equal(parseNum("Jan-Mar 12.50"),12.5);
console.log("bill tests ok");
