// Checks reading numbers and units from energy bills. Run from the repo folder: node tests/bills.test.js
const fs=require("fs");const h=fs.readFileSync("index.html","utf8");
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
console.log("bill tests ok");
