// data=document.body.innerText.slice(0,-1);
var d_1=(data,part)=>{
    var top3=data.split("\n\n").map(v=>v.split("\n").reduce((r,v)=>r+parseInt(v),0)).sort((a,b)=>a-b).slice(-3);
    return [top3[2],top3[0]+top3[1]+top3[2]][part];
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
let d_3=(data,part)=>{
    var commonItem=(a,b,c)=>c.split("").find(v=>a.includes(v)&&b.includes(v));
    var priorities=".abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var part1Groups=data.split("\n").map(v=>[v.slice(0,v.length/2),v.slice(v.length/2),priorities]);
    var part2Groups=data.split("\n").map((v,i,a)=>a.slice(i,i+3)).filter((v,i)=>(i%3)==0);
    return[,part1Groups,part2Groups][part].map(v=>priorities.indexOf(commonItem(v[0],v[1],v[2]))).reduce((r,v)=>r+v,0);
}
let d_4=(data,part)=>{
    var part1=v=>(v[0][0]>=v[1][0]&&v[0][1]<=v[1][1])||(v[0][0]<=v[1][0]&&v[0][1]>=v[1][1]);
    var part2=v=>(v[0][0]<=v[1][0]&&v[1][0]<=v[0][1])||(v[0][0]<=v[1][1]&&v[1][1]<=v[0][1])||(v[1][0]<=v[0][0]&&v[0][0]<=v[1][1])||(v[1][0]<=v[0][1]&&v[0][1]<=v[1][1]);
    return data.split("\n").map(v=>v.split(",").map(v=>v.split("-").map(v=>parseInt(v)))).filter([,part1,part2][part]).length
};
let d_5=(data,part)=>{
    let stacks=data.slice(0,data.indexOf("\n\n")),instrs=data.slice(data.indexOf("\n\n")+2);
    stacks=stacks.split("\n").map(v=>v.split("").filter((v,i)=>i%4==1));
    stacks=Object.fromEntries(stacks.pop().map((v,i)=>[v,stacks.map(v=>v[i]).filter(v=>v!=" ").reverse()]));
    instrs=instrs.split("\n").map(v=>v.match(/^move ([0-9]+) from ([1-9]) to ([1-9])$/).map(v=>parseInt(v)));
    instrs.forEach(v=>{
        let crates=stacks[v[2]].splice(-v[1],v[1]);
        if(part==1){crates.reverse();}
        stacks[v[3]]=stacks[v[3]].concat(crates);
    });
    return Object.values(stacks).map(v=>v.pop()).join("");
};
let d_6=(data,part)=>{
    var len=part==1?4:14;
    return data.split("").findIndex((v,i,a)=>a.slice(i,i+len.every((v,i,a)=>i==a.indexOf(v))))+len;
};
let d_7=(data,part)=>{
	var root={files:{},dirs:{}},cwd;
	data.split("\n").forEach(v=>{
		if(v=="$ ls"){return;}
		if(v=="$ cd /"){cwd=root;return;}
		var m;
		if(v=="$ cd .."){cwd=cwd.parent;return;}
		if(m=v.match(/^\$ cd (.*)$/)){cwd=cwd.dirs[m[1]];return;}
		if(m=v.match(/^dir (.*)$/)){cwd.dirs[m[1]]={parent:cwd,files:Object.create(null),dirs:Object.create(null)};return;}
		if(m=v.match(/^([0-9]*) (.*)$/)){cwd.files[m[2]]=parseInt(m[1]);return;}
		// cant get here
	});
	var f=d=>d.size=Object.values(d.dirs).reduce((r,v)=>r+f(v),0)+Object.values(d.files).reduce((r,v)=>r+v,0);
	f(root);
	let part1=0,part2=root.size,toFree=30000000-(70000000-root.size);
	var f=d=>{
		Object.values(d.dirs).forEach(f);
		if(d.size<100000){part1+=d.size};
		if(toFree<=d.size&&d.size<part2){part2=d.size;}
	};
	f(root);
	return [,part1,part2][part];
};
let d_8=(data,part)=>{
	var grid=data.split("\n").map(v=>v.split("").map(v=>parseInt(v)));
	var rows=grid.map((v,y)=>y),cols=grid[0].map((v,x)=>x),answer=0;
	grid.forEach((row,y)=>row.forEach((v,x)=>{
		if(part==1){
			if(
				rows.slice(0,y).every(y=>grid[y][x]<v)||rows.slice(y+1).every(y=>grid[y][x]<v)||
				cols.slice(0,x).every(x=>grid[y][x]<v)||cols.slice(x+1).every(x=>grid[y][x]<v)
			){visible++;}
		}else{
			let f=(a,f)=>{var i=a.findIndex(f);return i>=0?i+1:a.length;},score=
				f(rows.slice(0,y).reverse(),y=>grid[y][x]>=v)*f(rows.slice(y+1),y=>grid[y][x]>=v)*
				f(cols.slice(0,x).reverse(),x=>grid[y][x]>=v)*f(cols.slice(x+1),x=>grid[y][x]>=v);
			if(score>answer){answer=score;}
		}
	}));
	return answer;
};
let d_9=(data,part)=>{
	var knots=Array(part==1?2:10).fill().map(v=>[0,0]),dirs={U:[0,1],D:[0,-1],L:[-1,0],R:[1,0]};
	var tailLocations=new Set();
	data.split("\n").forEach(v=>{for(let i=0,dir=dirs[v[0]],n=parseInt(v.slice(2));i<n;i++){
		knots[0][0]+=dir[0];knots[0][1]+=dir[1];
		for(let j=1;j<knots.length;j++){
			let delta=[knots[j-1][0]-knots[j][0],knots[j-1][1]-knots[j][1]];
			if(Math.abs(delta[1])>1||Math.abs(delta[0])>1){knots[j][1]+=Math.sign(delta[1]);knots[j][0]+=Math.sign(delta[0]);}11111
		}
		tailLocations.add(knots[knots.length-1][0]+","+knots[knots.length-1][1]);
	}});
	return tailLocations.size;
};
let d_10=(data,part)=>{
    var values=[undefined],value=1;
    data.split("\n").forEach(v=>{
        values.push(value);
        if(v.startsWith("addx ")){values.push(value);value+=parseInt(v.slice(4));}
    });
    values.push(value);
    if(part==1){let signal=0;for(let i=20;i<=220;i+=40){signal+=i*values[i];}return signal;}
    return "\n"+values.map((v,i)=>Math.abs((i-1)%40-v)<2?"#":" ").join("").match(/.{40}/g).join("\n")
};
let d_11=(data,part)=>{
	var monkeys=data.split("\n\n").map(v=>v.split("\n").slice(1).map(v=>v.split(": ")[1])).map(v=>({
		items:v[0].split(", ").map(v=>parseInt(v)),op:Function("old","return "+v[1].slice(5)+";"),
		test:parseInt(v[2].match(/^divisible by ([0-9]+)$/)[1]),activity:0,
		t:parseInt(v[3].match(/throw to monkey ([0-7])/)[1]),f:parseInt(v[4].match(/throw to monkey ([0-7])/)[1])
	}));
	var modulus=monkeys.reduce((r,v)=>r*v.test,1)
	for(let i=0;i<(part==1?20:10000);i++){monkeys.forEach(m=>{
		m.items.map(item=>Math.floor(m.op(item)/(part==1?3:1))).map(item=>item%modulus).forEach(item=>monkeys[(item%m.test==0)?m.t:m.f].items.push(item));
		m.activity+=m.items.length;m.items=[];
	});}
	let activities=monkeys.map(v=>v.activity).sort((a,b)=>b-a);
	return activities[0]*activities[1];
};