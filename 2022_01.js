var top3=document.body.innerText.slice(0,-1).split("\n\n").map(v=>v.split("\n").reduce((r,v)=>r+parseInt(v),0)).sort((a,b)=>a-b).slice(-3);
var part1=top3[2],part2=top3[0]+top3[1]+top3[2];