// data=document.body.innerText.slice(0,-1);
var d_1=(data,part)=>{
    var top3=data.split("\n\n").map(v=>v.split("\n").reduce((r,v)=>r+parseInt(v),0)).sort((a,b)=>a-b).slice(-3);
    return [,top3[2],top3[0]+top3[1]+top3[2]][part];
};
let d_2=(data,part)=>data.split("\n").reduce((r,v)=>r+(part==1?{
	"A X":1+3,"A Y":2+6,"A Z":3+0,
	"B X":1+0,"B Y":2+3,"B Z":3+6,
	"C X":1+6,"C Y":2+0,"C Z":3+3
}:{
   	"A X":3+0,"A Y":1+3,"A Z":2+6,
    "B X":1+0,"B Y":2+3,"B Z":3+6,
    "C X":2+0,"C Y":3+3,"C Z":1+6,
})[v],0);
