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
let d_12=(data,part)=>{
	data=data.split("\n").map(v=>v.split(""));
	var sx,sy=data.findIndex(v=>(sx=v.indexOf("S"))>=0);
	var ex,ey=data.findIndex(v=>(ex=v.indexOf("E"))>=0);
	data[sy][sx]="a";data[ey][ex]="z";
	data=data.map(v=>v.map(v=>parseInt(v,36)-10));
	var dists=data.map(v=>v.map(v=>Infinity)),queue=[{x:ex,y:ey,d:0}];
	dists[ey][ex]=0;
	while(queue.length){
		let v=queue.shift(),h=data[v.y][v.x],d=dists[v.y][v.x];
		let f=(dx,dy)=>{
			var x=v.x+dx,y=v.y+dy;if(y<0||y>=data.length||x<0||x>=data[0].length){return;}
			if((data[y][x]>=h-1)&&(d+1<dists[y][x])){dists[y][x]=d+1;queue.push({x:x,y:y});}
		};
		f(0,-1);f(-1,0);f(1,0);f(0,1);
	}
	if(part==1){return dists[sy][sx];}
	return data.reduce((r,v,y)=>v.reduce((r,v,x)=>{if(v==0&&dists[y][x]<r){return dists[y][x];}return r;},r),Infinity)
};
let d_13=(data,part)=>{
	data=data.split("\n\n").map(v=>v.split("\n").map(v=>JSON.parse(v)));
	var cmp=(a,b)=>{
		if(typeof a=="number"&&typeof b=="number"){return a-b;}
		if(typeof a=="number"){a=[a];}if(typeof b=="number"){b=[b];}
		for(let i=0;i<a.length&&i<b.length;i++){let c=cmp(a[i],b[i]);if(c){return c;}}
		return a.length-b.length;
	};
	if(part==1){
		let part1=0;
		data.forEach((v,i)=>{if(cmp(v[0],v[1])<0){part1+=i+1;}});
		return part1;
	}
	data=data.flat();data.push([[2]],[[6]]);data.sort(cmp);
	return (data.findIndex(v=>JSON.stringify(v)=="[[2]]")+1)*(data.findIndex(v=>JSON.stringify(v)=="[[6]]")+1)
};
var d_14=(data,part=1)=>{
    var data=data.split("\n").map(v=>v.split(" -> ").map(v=>v.split(",").map(v=>parseInt(v))));
    let floor=data.flat(1).reduce((r,v)=>Math.max(r,v[1]),0);
    data=data.map(v=>v.map(v=>[v[0]-(500-floor)+2,v[1]]));
    let grid=Array(floor+3).fill().map(v=>Array(2*floor+5).fill(" "));
    grid[floor+2].fill("#");grid[0][floor+2]="+";
    data.forEach(v=>{var p=v[0];for(var i=1;i<v.length;i++){
        while(p[0]<v[i][0]){grid[p[1]][p[0]]="#";p[0]++;}
        while(p[0]>v[i][0]){grid[p[1]][p[0]]="#";p[0]--;}
        while(p[1]<v[i][1]){grid[p[1]][p[0]]="#";p[1]++;}
        while(p[1]>v[i][1]){grid[p[1]][p[0]]="#";p[1]--;}
    }grid[p[1]][p[0]]="#";});
    var p=[floor+2,0],dropped=0;
    while(1){
        p[1]++;let row=grid[p[1]];
        if(row[p[0]]==" "){}else if(row[p[0]-1]==" "){p[0]--;}else if(row[p[0]+1]==" "){p[0]++;}
        else if(p[1]==1){dropped++;break;}else{grid[p[1]-1][p[0]]="o";dropped++;p=[floor+2,0];}
        if(p[1]>=floor&&part==1){break;}
    }
    return dropped;
};
var d_15=(data,part)=>{
	data=data.split("\n").map(v=>v.match(/^Sensor at x=([-0-9]+), y=([-0-9]+): closest beacon is at x=([-0-9]+), y=([-0-9]+)/).slice(1).map(v=>parseInt(v)));
	data=data.map(v=>({x:v[0],y:v[1],d:Math.abs(v[0]-v[2])+Math.abs(v[1]-v[3])}));
	if(part==1){
		let segments=data.map(v=>({x:v.x,d:v.d-Math.abs(v.y-2000000)})).filter(v=>v.d>0).map(v=>({min:v.x-v.d,max:v.x+v.d})).sort((a,b)=>a.min-b.min);
			for(let i=0;i<segments.length-1;){
				if(segments[i].max+1<segments[i+1].min-1){i++;continue;}
				segments[i].max=Math.max(segments[i].max,segments[i+1].max);segments.splice(i+1,1);
			}
			return segments.reduce((r,v)=>r+v.max-v.min,0);
	}
	let points=[],attemptPoint=(x,y)=>data.every(v=>v.d<Math.abs(v.x-x)+Math.abs(v.y-y));
	data.forEach(v1=>data.forEach(v2=>[1,-1].forEach(pm1=>[1,-1].forEach(pm2=>[1,-1].forEach(pm3=>[1,-1].forEach(pm4=>{
		// abs(x-v1.x)+abs(y-v1.y)=v1.d+1
		// abs(x-v2.x)+abs(y-v2.y)=v2.d+1
		// pm1*(x-v1.x)+pm2*(y-v1.y)=v1.d+1
		// pm3*(x-v2.x)+pm4*(y-v2.y)=v2.d+1
		// pm1*x+pm2*y=v1.d+1+pm1*v1.x+pm2*v1.y
		// pm3*x+pm4*y=v2.d+1+pm3*v2.x+pm4*v2.y
		// pm1*pm2*x+y=pm2*(v1.d+1+pm1*v1.x+pm2*v1.y)
		// pm3*pm4*x+y=pm4*(v2.d+1+pm3*v2.x+pm4*v2.y)
		// (pm1*pm2-pm3*pm4)*x=pm2*(v1.d+1+pm1*v1.x+pm2*v1.y)-pm4*(v2.d+1+pm3*v2.x+pm4*v2.y)
		if(pm1*pm2==pm3*pm4){return;}
		let x=(pm2*(v1.d+1+pm1*v1.x+pm2*v1.y)-pm4*(v2.d+1+pm3*v2.x+pm4*v2.y))/(pm1*pm2-pm3*pm4);
		if(0>x||x>4000000){return;}
		let dy=(v1.d+1-Math.abs(x-v1.x));
		if(0<=v1.y+dy&&v1.y+dy<=4000000&&attemptPoint(x,v1.y+dy)){points.push([x,v1.y+dy]);}
		if(0<=v1.y-dy&&v1.y-dy<=4000000&&attemptPoint(x,v1.y-dy)){points.push([x,v1.y-dy]);}
		}))))));
	return points[0][0]*4000000+points[0][1];
};
var d_16=async(data,part)=>{
    var start=performance.now();
    data=data.split("\n").map(v=>v.match(/^Valve (..) has flow rate=([^;]+); tunnels? leads? to valves? (.+)$/).slice(1)).map(v=>[v[0],parseInt(v[1]),v[2].split(", ")]);
    console.log(performance.now()-start,"computing adj. matrix...");
    {
        let keys=data.map(v=>v[0]);var valves=data.map(v=>v[1]);
        var matrix=data.map(v=>keys.map(k=>v[2].includes(k)?1:Infinity));data.forEach((v,i)=>v[i]=0);
        let queue=matrix.map((v,i)=>matrix.map((v,j)=>i+","+j)).flat(1);
        let checkUpdate=(i,j,k)=>{
            if(matrix[i][j]+matrix[j][k]<matrix[i][k]){matrix[k][i]=matrix[i][k]=matrix[i][j]+matrix[j][k];if(!queue.includes(i+","+k)){queue.push(i+","+k);}}
        };
        while(queue.length){
            let decreased=queue.pop().split(",").map(v=>parseInt(v));
            matrix.forEach((v,i)=>checkUpdate(decreased[0],decreased[1],i));
        }
        let keep=keys.map((v,i)=>v=="AA"||valves[i]);
        keys=keys.filter((v,i)=>keep[i]);valves=valves.filter((v,i)=>keep[i]);matrix=matrix.filter((v,i)=>keep[i]).map(v=>v.filter((v,i)=>keep[i]));
        var start=keys.indexOf("AA");
    }
    console.log(performance.now()-start,"got adj. matrix, computing flow rates...");await new Promise(requestAnimationFrame);
    var flowRates=Array(2**valves.length).fill().map((v,i)=>valves.reduce((r,valve,j)=>r+((i&(1<<j))?valve:0),0));
    console.log(performance.now()-start,"got flow rates, computing DP table...");await new Promise(requestAnimationFrame);
    {
		let eruption=part==1?30:26;
        var bestDP=Array(eruption+1).fill().map(v=>Array(2**valves.length).fill().map(v=>Array(valves.length).fill(-Infinity)));
        bestDP[0][0][start]=0;
        let queue={length:0};
        queue.push=function(item){var node={item:item};if(this.last){this.last=this.last.next=node;}else{this.last=this.first=node;}this.length++;};
        queue.shift=function(){var node=this.first;if(node){this.first=node.next;if (!(--this.length)){this.last=undefined;}return node.item;}};
        queue.push([0,0,start,0]);
        while(queue.length){
            let [time,opened,pos,prevPressure]=queue.shift(),currentPressure=bestDP[time][opened][pos];
            if(prevPressure<currentPressure){continue;}
            valves.forEach((v,i)=>{
                if(i==start){return;}
                if(i==pos){
                    let nextPressure=currentPressure+flowRates[opened],nextOpened=opened|(1<<pos);
                    if(bestDP[time+1][nextOpened][pos]<nextPressure){
                        bestDP[time+1][nextOpened][pos]=nextPressure;
                        if(time+1!=eruption){queue.push([(time+1),nextOpened,pos,nextPressure]);}
                    }
                    return;
                }
                let duration=matrix[pos][i],end=time+duration;if(end>eruption){return;}
                let nextPressure=currentPressure+flowRates[opened]*duration;
                if(bestDP[end][opened][i]<nextPressure){
                    bestDP[end][opened][i]=nextPressure;
                    if(end!=eruption){queue.push([end,opened,i,nextPressure]);}
                }
            });
        }
        bestDP=bestDP[eruption].map(v=>v.reduce((r,v)=>Math.max(r,v),0));
    }
    if(part==1){return bestDP.reduce((r,v)=>Math.max(r,v),0);}
    console.log(performance.now()-start,"got DP table, dividing up valves...");await new Promise(requestAnimationFrame);
    let best=0,lastPercent=0;
    for(let i=0;i<3**valves.length;i++){
        let s=i.toString(3),a=parseInt(s.replace(/1/g,"0").replace(/2/g,"1"),2),b=parseInt(s.replace(/2/g,"0"),2);
        let pressure=bestDP[a]+bestDP[b];if(best<pressure){best=pressure;}
        if(i&0x100){let percent=Math.round(100*i/(3**valves.length));if(percent!=lastPercent){console.log((lastPercent=percent)+"%");await new Promise(requestAnimationFrame);}}
    };
    return best;
};
let d_17=(data,part)=>{
	var jets=data.split("").map(v=>({">":1,"<":-1})[v]);
	var rocks=[
		// flipped so that the 0th item is the bottom of the
		// rock, and the LSB is the left side of the rock
		[0b1111],[0b010,0b111,0b010],[0b111,0b100,0b100],[0b1,0b1,0b1,0b1],[0b11,0b11]
	];
	var grid=[0],jet=0,states=[],heights=[];
	for(let i=0;i<(part==1?2022:Infinity);i++){
		let rock=rocks[i%rocks.length];
		let x=2,y=grid.findLastIndex(v=>v!=0)+4;
		while(grid.length<y+4){grid.push(0);}
		if(part==2){
			let accessible=grid.map(v=>0),stack=[],addToStack=(x,y)=>{
				if(x<0||y<0||x>=7||y>=grid.length||(grid[y]&(1<<x))){return;}
				if(!(accessible[y]&(1<<x))){accessible[y]|=(1<<x);stack.push([x,y]);}
			};
			addToStack(0,grid.length-8);addToStack(1,grid.length-8);addToStack(2,grid.length-8);addToStack(3,grid.length-8);
			addToStack(4,grid.length-8);addToStack(5,grid.length-8);addToStack(6,grid.length-8);addToStack(7,grid.length-8);
			while(stack.length){let [x,y]=stack.pop();addToStack(x+1,y);addToStack(x,y+1);addToStack(x-1,y);addToStack(x,y-1);}
			accessible=accessible.slice(accessible.findIndex(v=>v!=0),accessible.findLastIndex(v=>v!=127)+1)
			let state=(i%rocks.length)+","+jet+","+accessible.join(",");
			let last=states.indexOf(state);
			if(last!=-1){
				let trillion=1000000000000,modulus=(trillion-last)%(i-last);
				return heights[last+modulus]+(grid.length-7-heights[last])*(trillion-last-modulus)/(i-last);
			}
			states.push(state);heights.push(grid.findLastIndex(v=>v!=0)+1);
		}
		/*let log=()=>{
			let copy=grid.slice();
			rock.forEach((v,i)=>copy[y+i]|=(v<<x));
			console.log(copy.map(v=>"\n|"+v.toString(2).padStart(7,0).replace(/0/g,".").replace(/1/g,"#").split("").reverse().join("")+"|").reverse().join(""));
		};*/
		for(let j=0;;j++){
			if(jet==jets.length){jet=0;}
			x+=jets[jet];
			if(x<0||rock.some((v,i)=>(v<<x)&(grid[y+i]|0x80))){x-=jets[jet];}
			jet++;y--;
			if(y<0||rock.some((v,i)=>(v<<x)&grid[y+i])){y++;break;}
		}
		rock.forEach((v,i)=>grid[y+i]|=(v<<x));
	}
	//console.log(grid.map(v=>"\n|"+v.toString(2).padStart(7,0).replace(/0/g,".").replace(/1/g,"#").split("").reverse().join("")+"|").reverse().join(""));
	//console.log(grid.map((v,i)=>i).filter(i=>grid[i]==127).map((v,i,a)=>v-a[i+1]).join("\n"));
	console.log(states);
	return grid.findLastIndex(v=>v!=0)+1;
};
let d_18=(data,part)=>{
	data=data.split("\n").map(v=>v.split(",").map(v=>parseInt(v)));
	let min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
	data.forEach(v=>v.forEach((v,i)=>{min[i]=Math.min(min[i],v);max[i]=Math.max(max[i],v);}));
	max=[max[0]-min[0]+3,max[1]-min[1]+3,max[2]-min[2]+3]
	var grid=Array(max[0]).fill().map(v=>Array(max[1]).fill().map(v=>Array(max[2]).fill(0)));
	// 0: air 1: steam 2: lava
	data=data.map(v=>[v[0]-min[0]+1,v[1]-min[1]+1,v[2]-min[2]+1]);
	data.forEach(v=>{grid[v[0]][v[1]][v[2]]=2;});
	if(part==1){
		let surface=0;
		data.forEach(v=>{
			if(!grid[v[0]+1][v[1]][v[2]]){surface++;}if(!grid[v[0]][v[1]+1][v[2]]){surface++;}if(!grid[v[0]][v[1]][v[2]+1]){surface++;}
			if(!grid[v[0]-1][v[1]][v[2]]){surface++;}if(!grid[v[0]][v[1]-1][v[2]]){surface++;}if(!grid[v[0]][v[1]][v[2]-1]){surface++;}
		});
		return surface;
	}else{
		let stack=[[0,0,0]],addToStack=(x,y,z)=>{
			if(x<0||y<0||z<0||x>=max[0]||y>=max[1]||z>=max[2]){return;}let gxy=grid[x][y];if(gxy[z]==0){gxy[z]=1;stack.push([x,y,z]);}
		};
		grid[0][0][0]=1;
		while(stack.length){
			let [x,y,z]=stack.pop();
			addToStack(x+1,y,z);addToStack(x,y+1,z);addToStack(x,y,z+1);addToStack(x-1,y,z);addToStack(x,y-1,z);addToStack(x,y,z-1);
		}
		let surface=0;
		data.forEach(v=>{
			if(grid[v[0]+1][v[1]][v[2]]==1){surface++;}if(grid[v[0]][v[1]+1][v[2]]==1){surface++;}if(grid[v[0]][v[1]][v[2]+1]==1){surface++;}
			if(grid[v[0]-1][v[1]][v[2]]==1){surface++;}if(grid[v[0]][v[1]-1][v[2]]==1){surface++;}if(grid[v[0]][v[1]][v[2]-1]==1){surface++;}
		});
		return surface;
	}
};
var d_19=(data,part)=>{
	data=data.split("\n").map(bp=>bp.match(/^Blueprint ([0-9]+): Each ore robot costs ([0-9]+) ore. Each clay robot costs ([0-9]+) ore. Each obsidian robot costs ([0-9]+) ore and ([0-9]+) clay. Each geode robot costs ([0-9]+) ore and ([0-9]+) obsidian.$/).slice(1).map(v=>parseInt(v))).map(bp=>({
		id:bp[0],ore2ore:bp[1],ore2clay:bp[2],ore2obsidian:bp[3],
		clay2obsidian:bp[4],ore2geode:bp[5],obsidian2geode:bp[6]
	}));
	if(part==2){data=data.slice(0,3);}
	var workerUrl=URL.createObjectURL(new Blob([`var time=${part==1?24:32};self.onmessage = `+function(event) {
		var bp=event.data;
		var maxOreSpend=Math.max(bp.ore2ore,bp.ore2clay,bp.ore2obsidian,bp.ore2geode);
		var maxGeodes=0;
		var dfs=(timeLeft,{oreBots,clayBots,obsidianBots,	ore,clay,obsidian,geodes})=>{
			if(timeLeft==1){maxGeodes=Math.max(maxGeodes,geodes);return}// no point building in the last minute
			if(geodes+(timeLeft-1)*timeLeft/2<maxGeodes){return;}
			if(ore>=bp.ore2geode&&obsidian>=bp.obsidian2geode){dfs(timeLeft-1,{
				oreBots,clayBots,obsidianBots,
				ore:ore+oreBots-bp.ore2geode,clay:clay+clayBots,obsidian:obsidian+obsidianBots-bp.obsidian2geode,geodes:geodes+timeLeft-1
			});}
			if(ore>=bp.ore2obsidian&&clay>=bp.clay2obsidian&&timeLeft*obsidianBots+obsidian<=timeLeft*bp.obsidian2geode){dfs(timeLeft-1,{
				oreBots,clayBots,obsidianBots:obsidianBots+1,
				ore:ore+oreBots-bp.ore2obsidian,clay:clay+clayBots-bp.clay2obsidian,obsidian:obsidian+obsidianBots,geodes:geodes
			});}
			if(ore>=bp.ore2clay&&timeLeft*clayBots+clay<=timeLeft*bp.clay2obsidian){dfs(timeLeft-1,{
				oreBots,clayBots:clayBots+1,obsidianBots,
				ore:ore+oreBots-bp.ore2clay,clay:clay+clayBots,obsidian:obsidian+obsidianBots,geodes:geodes
			});}
			if(ore>=bp.ore2ore&&timeLeft*oreBots+ore<=timeLeft*maxOreSpend){dfs(timeLeft-1,{
				oreBots:oreBots+1,clayBots,obsidianBots,
				ore:ore+oreBots-bp.ore2ore,clay:clay+clayBots,obsidian:obsidian+obsidianBots,geodes:geodes
			});}
			dfs(timeLeft-1,{
				oreBots,clayBots,obsidianBots,
				ore:ore+oreBots,clay:clay+clayBots,obsidian:obsidian+obsidianBots,geodes:geodes
			});
		};
		var start=performance.now();
		console.log(`bp ${bp.id} start`);
		dfs(time,{oreBots:1,clayBots:0,obsidianBots:0,	ore:0,clay:0,obsidian:0,geodes:0});
		console.log(`bp ${bp.id} done: ${maxGeodes} geodes (computed in ${performance.now()-start}ms)`);
		self.postMessage([bp.id,maxGeodes]);
	}],{type:"text/javascript"}));
	Promise.all(data.map(bp=>new Promise(resolve=>{
		var worker=new Worker(workerUrl);
		worker.onmessage=e=>{resolve(e.data);worker.terminate();};
		worker.postMessage(bp);
	}))).then(v=>part==1?v.reduce((r,v)=>r+v[0]*v[1],0):v.reduce((r,v)=>r*v[1],1)).then(console.log);
};
var d_20=(data,part)=>{
	data=data.split("\n").map(v=>[parseInt(v)*(part==1?1:811589153)]);
	var mixOrder=data.slice(),mix=v=>{
		var start=data.indexOf(v);data.splice(start,1);
		let end=start+v[0];end=end%data.length+(end<0?data.length:0);
		data.splice(end,0,v);
	};
	if(part==1){mixOrder.forEach(mix);}else{for(let i=0;i<10;i++){mixOrder.forEach(mix);}}
	{let i=data.findIndex(v=>!v[0]);return data[(i+1000)%data.length][0]+data[(i+2000)%data.length][0]+data[(i+3000)%data.length][0];}
};
var d_21=(data,part)=>{
	data=Object.fromEntries(data.split("\n").map(v=>v.split(": ")).map(v=>{
		var m=v[1].match(/^([^ ]*) (.) ([^ ]*)$/);return [v[0],m?m.slice(1):parseInt(v[1])];
	}));
	if(part==2){data.root[1]="-";}
	var fsimplify=f=>{
		var sign=Math.sign(f.n*f.d),a=Math.abs(f.n),b=Math.abs(f.d);
		while(a){let max=Math.max(a,b),min=Math.min(a,b);a=max%min;b=min;}
		return {n:sign*Math.abs(f.n)/b,d:Math.abs(f.d)/b};
	};
	var fadd=(f,i)=>fsimplify({n:f.n+i*f.d,d:f.d}),fmul=(f,i)=>fsimplify({n:f.n*i,d:f.d}),fdiv=(f,i)=>fsimplify({n:f.n,d:f.d*i});
	data=Object.fromEntries(Object.entries(data).map(v=>[v[0],typeof v[1]=="object"?function(){
		var l=this[v[1][0]](),lc=typeof l=="number",r=this[v[1][2]](),rc=typeof r=="number";
		switch(v[1][1]){
			case "+":if(lc&&rc){return l+r;}else if(rc&&!lc){return {m:l.m,  b:fadd(l.b,+r)};}
			else if(lc&&!rc){return {m:  r.m,b:fadd(r.b,l)};}else{throw "nonlinear";}
			case "-":if(lc&&rc){return l-r;}else if(rc&&!lc){return {m:l.m,  b:fadd(l.b,-r)};}
			else if(lc&&!rc){return {m:fmul(r.m,-1),b:fadd(fmul(r.b,-1),l)};}else{throw "nonlinear";}
			case "*":if(lc&&rc){return l*r;}else if(rc&&!lc){return {m:fmul(l.m,r),b:fmul(l.b,r)};}
			else if(lc&&!rc){return {m:fmul(r.m,l),b:fmul(r.b,l)};}else{throw "nonlinear";}
			case "/":if(lc&&rc){return l/r;}else if(rc&&!lc){return {m:fdiv(l.m,r),b:fdiv(l.b,r)};}
			else{throw "nonlinear";}
		}
	}:()=>v[1]]));
	if(part==2){data.humn=()=>({m:{n:1,d:1},b:{n:0,d:1}});}
	data=data.root();
	if(part==1){return data;}else{return [data,-(data.b.n/data.b.d)/(data.m.n/data.m.d)];}
};
var d_22=((data,part)=>{
	data=data.split("\n\n");
	var grid=data[0].split("\n").map(v=>v),instrs=data[1].split(/([LR])/);
	var wraps=part==1?{
		">":y=>{let row=grid[y].split("");return{in:row.length-1,out:[row.findIndex(v=>v!=" "),y],dir:">"};},
		"v":x=>({in:grid.findLastIndex(v=>x<v.length&&v[x]!=" "),out:[x,grid.findIndex(v=>v[x]!=" ")],dir:"v"}),
		"<":y=>{let row=grid[y].split("");return{in:row.findIndex(v=>v!=" "),out:[row.length-1,y],dir:"<"};},
		"^":x=>({in:grid.findIndex(v=>v[x]!=" "),out:[x,grid.findLastIndex(v=>x<v.length&&v[x]!=" ")],dir:"^"}),
	}:{
/*      11
     45904
    090909
   +------
  0|\ abbc
 49| \deef
 50|  de
 99|  gf
100|dggf\
149|ahhc \
150|ah
199|bc  */
		">":y=>y<50?{in:149,out:[null,null],dir:"<"}:y<100?{in: 99,out:[null,null],dir:"^"}:y<150?{in: 99,out:[null,null],dir:"<"}:{in: 49,out:[null,null],dir:"^"},
		"v":x=>x<50?{in:199,out:[null,null],dir:"v"}:x<100?{in:149,out:[null,null],dir:"<"}:      {in: 49,out:[null,null],dir:"<"},
		"<":y=>y<50?{in: 50,out:[null,null],dir:">"}:y<100?{in: 50,out:[null,null],dir:"v"}:y<150?{in:  0,out:[null,null],dir:">"}:{in:  0,out:[null,null],dir:"v"},
		"^":x=>x<50?{in:100,out:[null,null],dir:">"}:x<100?{in:  0,out:[null,null],dir:">"}:      {in:  0,out:[null,null],dir:"^"}
	};
	var pos=[grid[0].split("").findIndex(v=>v!=" "),0],dir=">";
	var logGrid=[[" ",0,1],[" ",2,""],[3,4,""],[5,"",""]].map((v,i)=>Array(50).fill().map(_=>v.map(v=>Array(50).fill(v)).flat())).flat();
	logGrid[pos[1]][pos[0]]=dir;
	instrs.forEach((v,i)=>{
		if(i%2){dir=(v=="R"?{">":"v","v":"<","<":"^","^":">"}:{">":"^","v":">","<":"v","^":"<"})[dir];return;}
		for(i=0,v=parseInt(v);i<v;i++){
			let newPos=pos.slice(),newDir=dir,delta={">":1,"v":1,"<":-1,"^":-1}[dir],axis={">":0,"v":1,"<":0,"^":1}[dir],wrap=wraps[dir](pos[1-axis]);
			newPos[axis]+=delta;
let log=0;
			if(pos[axis]==wrap.in){logGrid[pos[1]][pos[0]]=dir;newPos=wrap.out;newDir=wrap.dir;if(newPos[0]==null||newPos[1]==null){throw [dir,pos[1-axis]]}logGrid[newPos[1]][newPos[0]]=newDir;}
			if(grid[newPos[1]][newPos[0]]=="#"){break;}
			pos=newPos;dir=newDir;
		}
	});
	console.log(logGrid.map((v,y)=>"\n"+/*y+"\t"+*/v.join("")).join(""));
	return 1000*(pos[1]+1)+4*(pos[0]+1)+">v<^".indexOf(dir);
})(1?document.body.innerText.slice(0,-1):`        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5
`,2);// 163144 too high