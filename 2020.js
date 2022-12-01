var d_1a=data=>{
	data=data.split("\n").map(v=>parseInt(v)).sort();
	for(let i=0;i<data.length;i++){
		let a=data[i],b=2020-a;
		if(data.includes(b)){return a*b;}
	}
};
var d_1b=data=>{
	data=data.split("\n").map(v=>parseInt(v)).sort();
	for(let i=0;i<data.length;i++){
		let a=data[i];
		for(let j=0;j<data.length;j++){
			let b=data[j],c=2020-a-b;
			if(data.includes(c)){return a*b*c;}
		}
	}
};
var d_2=(data,part=1)=>{
	data=data.split("\n").map(v=>v.match(/^([0-9]+)-([0-9]+) (.): (.*)$/));
	if(part==1){data=data.filter(m=>{
		var count=m[4].split("").reduce((r,v)=>r+(v==m[3]),0);
		return parseInt(m[1])<=count&&count<=parseInt(m[2]);
	});}else{data=data.filter(m=>{
		var a=m[4][parseInt(m[1])-1]==m[3],b=m[4][parseInt(m[2])-1]==m[3];
		return (a||b)&&!(a&&b);
	});}
	return data.length
};
var d_3=(data,part=1)=>{
	data=data.split("\n");
	var lowslope=dx=>data.filter((v,i)=>v[(dx*i)%v.length]=="#").length;
	var highslope=dy=>data.filter((v,i)=>i%dy==0&&v[(i/dy)%v.length]=="#").length;
	return part==1?lowslope(3):lowslope(1)*lowslope(3)*lowslope(5)*lowslope(7)*highslope(2);
};
var d_4a=data=>{
	return data.split("\n\n").map(v=>v.split(/\s/).map(v=>v.split(":")[0]))
		.filter(v=>["byr","iyr","eyr","hgt","hcl","ecl","pid"].every(k=>v.includes(k))).length;
};
var d_4b=data=>{
	return data.split("\n\n").map(v=>Object.fromEntries(
		v.split(/\s/).map(v=>v.split(":"))
	)).filter(p=>(
		p.byr&&1920<=parseInt(p.byr)&&parseInt(p.byr)<=2002&&
		p.iyr&&2010<=parseInt(p.iyr)&&parseInt(p.iyr)<=2020&&
		p.eyr&&2020<=parseInt(p.eyr)&&parseInt(p.eyr)<=2030&&
		p.hgt&&(
			(h,u)=>u("cm")?150<=h&&h<=193:u("in")?59<=h&&h<=76:false
		)(parseFloat(p.hgt.slice(0,-2)),u=>p.hgt.endsWith(u))&&
		p.hcl&&p.hcl.match(/#[0-9a-f]{6}/)&&
		p.ecl&&["amb","blu","brn","gry","grn","hzl","oth"].includes(p.ecl)&&
		p.pid&&p.pid.match(/[0-9]{9}/)
	)).length;
};
var d_5=(data,part=1)=>{
	data=data.split("\n").map(v=>[
		parseInt(v.slice(0,7).replace(/F/g,"0").replace(/B/g,"1"),2),
		parseInt(v.slice(7  ).replace(/R/g,"1").replace(/L/g,"0"),2)
	]).map(v=>v[0]*8+v[1]);
	if(part==1){return data.reduce((r,v)=>Math.max(r,v),0);}
	return data.sort((a,b)=>a-b).find((v,i,a)=>v+1!=a[i+1])+1;
};
var d_6=(data,part=1)=>{
	data=data.split("\n\n").map(v=>{
		var players=v.split("\n").length;return Object.values(v.replace(/\n/g,"").split("").reduce((r,v)=>{
			r[v]=(r[v]||0)+1;return r;
		},{})).map(v=>v/players);
	});
	if(part==1){return data.reduce((r,v)=>r+v.filter(v=>v>0).length,0);}
	else{return data.reduce((r,v)=>r+v.filter(v=>v==1).length,0);}
};
var d_7=(data,part=1)=>{
	data=Object.fromEntries(data.slice(0,-2).split(".\n").map(v=>{
		var s=v.split(" bags contain ");return [s[0],Object.fromEntries(
			s[1].split(", ").map(v=>v.match(/^([0-9]+) (.+) bags?$/)).filter(v=>v).map(v=>[v[2],parseInt(v[1])])
		)];
	}));
	if(part==1){
		let queue=["shiny gold"],set=new Set
		while(queue.length){
			let search=queue.shift();
			Object.keys(data).filter(v=>(queue[0] in data[v])&&!set.has(v))
				.forEach(v=>{if(!queue.includes(v)){queue.push(v);set.add(v);}});
		}
		return set.size;
	}else{
		let rec=bag=>Object.entries(data[bag]).reduce((r,v)=>r+rec(v[0])*v[1],1);
		return rec("shiny gold")-1;
	}
};
var d_8=(data,part=1)=>{
	function run(code){var pc=0,acc=0;while(pc<code.length&&code[pc][2]==0){code[pc][2]=1;switch(code[pc][0]){
		case"nop":{pc++;break;}
		case"acc":{acc+=code[pc][1];pc++;break;}
		case"jmp":{pc+=code[pc][1];break;}
	}}if(pc<code.length){return["loop",acc];}else{return["end",acc];}}
	data=data.split("\n").map(v=>v.split(" ")).map(v=>[v[0],parseInt(v[1]),0]);
	if(part==1){return run(data);}
	for(let i=0;i<data.length;i++){
		let v=data[i];
		if(v[0]=="acc"){continue;}
		var copy=data.map(v=>v.slice());
		copy[i][0]={nop:"jmp",jmp:"nop"}[v[0]];
		var result=run(copy);
		if(result[0]=="end"){return result[1];}
	}	
};
var d_9=(data,part=1)=>{
	data=data.split("\n").map(v=>parseInt(v));
	var invalid=data.slice(26).map((v,i)=>data.slice(i,i+26))
	.find(v=>!v.some(a=>v.some(b=>a!=b&&a+b==v[25])))[25];
	if(part==1){return invalid;}else{
		let check=(i,j)=>{
			var slice=data.slice(i,j+1);return slice.length>=1&&slice.reduce((r,v)=>r+v,0)==invalid;
		}
		let i=data.findIndex((v,i)=>data.some((v,j)=>check(i,j))),j=data.findIndex((v,j)=>check(i,j));
		let min=Infinity,max=-Infinity;
		data.slice(i,j+1).forEach(v=>{min=Math.min(min,v);max=Math.max(max,v);});
		return min+max;
	}
};
var d_10=(data,part=1)=>{
	data=data.split("\n").map(v=>parseInt(v)).sort((a,b)=>a-b);data.push(data[data.length-1]+3);
	if(part==1){
		let gaps=[0,0,0,0];
		data.forEach((v,i)=>{gaps[v-(data[i-1]||0)]++;});
		return gaps[1]*gaps[3];
	}else{
		let combinations=/* 1 */[1,2,4];
		data.forEach(v=>{
			if(v<4){return;}
			var connectable=[v-1,v-2,v-3].map(v=>data.indexOf(v)).filter(v=>v>=0);
			combinations.push(connectable.reduce((r,v)=>r+combinations[v],0));
		});
		return combinations[combinations.length-1];
	}
};
// 11-a
var d_11=(data,part=1)=>{
	data=data.split("\n").map(v=>v.split(""));
	var get=(x,y)=>{data[y]?(data[y][x]):"L";},changed=1;
	var dir=part==1?(x,y,dx,dy)=>get(x+dx,y+dy):(x,y,dx,dy)=>{
		while(get(x+=dx,y+=dy)=="."){}return get(x,y)=="#";
	},maxNeighbors=part==1?4:5;
	while(changed){
		changed=0;
		data=data.map((v,y)=>v.map((v,x)=>{
			if(v=="."){return v;}
			var neighbors=
				 dir(x,y,-1,-1)+dir(x,y,-1,0)+dir(x,y,-1,1)+
				 dir(x,y, 0,-1)       +       dir(x,y, 0,1)+
				 dir(x,y, 1,-1)+dir(x,y, 1,0)+dir(x,y, 1,1);
			if(v=="#"){return neighbors<maxNeighbors?"#":(changed++,"L");}
			else{return neighbors==0?(changed++,"#"):"L";}
		}));
	}
	return data.reduce((r,v)=>v.reduce((r,v)=>r+(v=="#"),r),0);
}
var d_11=(data,part=1)=>{
	data=data.split("\n").map(v=>[v[0],parseFloat(v.slice(1))]);
	var x=0,y=0,r=0,wx=10,wy=1;
	if(part==1){data.forEach(v=>{switch(v[0]){
		case"N":{y+=v[1];break;}case"S":{y-=v[1];break;}
		case"E":{x+=v[1];break;}case"W":{x-=v[1];break;}
		case"L":{r+=v[1];break;}case"R":{r+=360-v[1];break;}
		case"F":{
			x+={0:v[1],90:0,180:-v[1],270:0}[r];
			y+={0:0,90:v[1],180:0,270:-v[1]}[r];
			break;
		}
	}r%=360;});}else{data.forEach(v=>{switch(v[0]){
		case"N":{wy+=v[1];break;}case"S":{wy-=v[1];break;}
		case"E":{wx+=v[1];break;}case"W":{wx-=v[1];break;}
		case"L":{switch(v[1]){
			case  90:{let t=wx;wx=-wy;wy=t;break;}
			case 180:{wx=-wx;wy-wy;break;}
			case 270:{let t=wy;wy=-wx;wx=t;break;}
		}break;}
		case"R":{switch(v[1]){
			case  90:{let t=wy;wy=-wx;wx=t;break;}
			case 180:{wx=-wx;wy-wy;break;}
			case 270:{let t=wx;wx=-wy;wy=t;break;}
		}break;}
		case"F":{x+=v[1]*wx;y+=v[1]*wy;break;}
	}});}
	return Math.abs(x)+Math.abs(y);
};
var d_13=(data,part=1)=>{
	{
		let i=data.indexOf("\n"),buses=data.slice(i+1).split(",");
		var start=parseInt(data.slice(0,i)),busIDXs=buses.map((v,i)=>i).filter(i=>buses[i]!="x");
		var busIDs=busIDXs.map(i=>parseInt(buses[i]));
	}
	if(part==1){
		let minDelay=Infinity,minBusid;
		busIDs.forEach(v=>{
			var delay=v-(start%v);
			if(delay<minDelay){minDelay=delay;minBusid=v;}
		});
		return minDelay*minBusid;
	}else{
		let mul=1,add=0,gcf=(a,b)=>{while(a){a=Math.max(a,b)%(b=Math.min(a,b));}return b;};
		busIDs.forEach((v,i)=>{
			if((i=(busIDXs[i]-add)%v)<0){i+=v;}
			add+=i;mul=mul*v/gcf(mul,v);
		});
		return mul-add;
	}
};
var d_14=(data,part=1)=>{
	var mem={},mask;
	data.split("\n").forEach(v=>{if(v.startsWith("mask = ")){mask=v.slice(7);}else{
		let m=v.match(/^mem\[([0-9]*)\] \= ([0-9]*)$/),addr=BigInt(m[1]),val=BigInt(m[2]);
		if(part==1){
			r.mem[addr]=BigInt(mask.replaceAll("X","0"))|m[2]&BigInt(mask.replaceAll("X","1"));
		}else{
			let addrs=[0n];addr=addr.toString(2).padStart(36,"0");
			mask.split("").reverse().forEach((v,i)=>{
				if((v=="0"&&(addr&(1n<<i)))||v=="1"){addrs=addrs.map(v=>v|(1n<<i));}
				if(v=="X"){addrs=[].concat(addrs,addrs.map(v=>v|(1n<<i)));}
			});
			m[0].forEach(addr=>mem[addr]=m[2]);
		}
	}});
	return Object.values(mem).reduce((r,v)=>r+v,0n);
};
var d_15=(data,part=1)=>{
	data=data.split(",").map(v=>parseInt(v));
	var i=data.length,last=data.pop(),end=part==1?2020:30000000;
	data=Object.fromEntries(data.map((v,i)=>[v,i+1]));
	while(i<end){let datalast=data[last];data[last]=i;last=datalast!==undefined?i-datalast:0;i++;}
	return last;
	/*
#include <iostream>
#include <unordered_map>
#include <stdexcept>
int main() {
	std::unordered_map<uint32_t,uint32_t>map{
		{8,1},{13,2},{1,3},{0,4},{18,5}
	};
	uint32_t last=9,i=6,end=30000000;
	while(i<end){
		if(i%3000==0){std::cout << (100.0*float(i)/30000000.0) << std::endl;}
		try{
			uint32_t* node=&map.at(last);
			last=i-*node;*node=i++;
		}catch (std::out_of_range){
			map[last]=i++;last=0;
		}
	}
	std::cout << last << std::endl;
}
	*/
};
var d_16=(data,part=1)=>{
	{let i=data.indexOf("\n\nyour ticket:\n");var fields=data.slice(0,i),tickets=data.slice(i+15);}
	fields=fields.split("\n").map(v=>{
		var m=v.match(/^([^:]+): ([0-9]+)-([0-9]+) or ([0-9]+)-([0-9]+)$/);
		var k=m[1];m=m.slice(2).map(v=>parseInt(v));
		return {name:k,test:v=>(m[0]<=v&&v<=m[1])||(m[2]<=v&&v<=m[3])};
	});
	tickets=tickets.split("\n").map(v=>v.split(",").map(v=>parseInt(v)));
	var yourTicket=tickets[0];
	tickets=tickets.slice(3);
	var invalid=tickets.map(v=>v.reduce((r,v)=>r+(fields.some(field=>field.test(v))?0:v),0));
	if(part==1){return invalid.reduce((r,v)=>r+v,0);}
	else{
		tickets=tickets.filter((v,i)=>!invalid[i]);tickets.push(yourTicket);
		let length=fields.length,changed=true;
		let table=fields.map(field=>Array(length).fill().map((v,i)=>tickets.every(v=>field.test(v[i]))?1:0));
		let doneRow=Array(length).fill(0),doneCol=Array(length).fill(0);
		let clear=(x,y)=>{let row=table[y];if(row[x]){changed=true;row[x]=0;}};
		while(changed){
			changed=false;
			for(let y=0;y<length;y++){
				if(doneRow[y]){continue;}let row=table[y],x=row.indexOf(1);
				if(x==row.lastIndexOf(1)){
					table[y][x]=0;{for(let y=0;y<length;y++){clear(x,y);}}
					table[y][x]=doneRow[y]=1;
				}
			}
			for(let x=0;x<length;x++){
				if(doneCol[x]){continue;}let col=table.map(v=>v[x]),y=col.indexOf(1);
				if(y==col.lastIndexOf(1)){
					table[y][x]=0;{for(let x=0;x<length;x++){clear(x,y);}}
					table[y][x]=doneCol[x]=1;
				}
			}
		}
		table.forEach((v,i)=>{fields[i].index=v.indexOf(1);fields[i].value=yourTicket[fields[i].index]});
		console.log(fields);
		return fields.filter(v=>v.name.startsWith("departure")).reduce((r,v)=>r*v.value,1);
	}
};
var d_17=(data,part=1)=>{
	data=data.split("\n").map(v=>v.split("").map(v=>[v=="#"]));
	if(part==2){data=[data];}
	var empty=arr=>Array.isArray(arr)?arr.map(empty):false;
	var pad=arr=>[].concat([empty(arr[0])],arr,[empty(arr[0])]);
	if(part==1){
		let get=(x,y,z)=>data[z]?.[y]?.[x];
		let step=()=>{
			var d=[-1,0,1];
			data=pad(data.map(v=>pad(v.map(v=>pad(v)))));
			data=data.map((plane,z)=>plane.map((row,y)=>row.map((cell,x)=>{
				var neighbors=0;
				d.forEach(dz=>d.forEach(dy=>d.forEach(dx=>{if(get(x+dx,y+dy,z+dz)){neighbors++;}})));
				return neighbors==3||(neighbors==4&&get(x,y,z));
			})));
			while(!data[data.length-1].some(v=>v.some(v=>v))){data.pop();}
			while(!data[0].some(v=>v.some(v=>v))){data.shift();}
			while(!data.some(v=>v[v.length-1].some(v=>v))){data.forEach(v=>v.pop());}
			while(!data.some(v=>v[0].some(v=>v))){data.forEach(v=>v.shift());}
			while(!data.some(v=>v.some(v=>v[v.length-1]))){data.forEach(v=>v.forEach(v=>v.pop()));}
			while(!data.some(v=>v.some(v=>v[0]))){data.forEach(v=>v.forEach(v=>v.shift()));}
		};
		step();step();step();step();step();step();
		return data.reduce((r,v)=>v.reduce((r,v)=>v.reduce((r,v)=>r+v,r),r),0);
	}else{
		let get=(x,y,z,w)=>data[w]?.[z]?.[y]?.[x];
		let step=()=>{
			var d=[-1,0,1];
			data=pad(data.map(v=>pad(v.map(v=>pad(v.map(v=>pad(v)))))));
			data=data.map((space,w)=>space.map((plane,z)=>plane.map((row,y)=>row.map((cell,x)=>{
				var neighbors=0;
				d.forEach(dw=>d.forEach(dz=>d.forEach(dy=>d.forEach(dx=>{
					if(get(x+dx,y+dy,z+dz,w+dw)){neighbors++;}
				}))));
				return neighbors==3||(neighbors==4&&get(x,y,z,w));
			}))));
			while(!data[data.length-1].some(v=>v.some(v=>v.some(v=>v)))){data.pop();}
			while(!data.some(v=>v[v.length-1].some(v=>v.some(v=>v)))){data.forEach(v=>v.pop());}
			while(!data.some(v=>v.some(v=>v[v.length-1].some(v=>v)))){data.forEach(v=>v.forEach(v=>v.pop()));}
			while(!data.some(v=>v.some(v=>v.some(v=>v[v.length-1])))){
				data.forEach(v=>v.forEach(v=>v.forEach(v=>v.pop())));
			}
			while(!data[0].some(v=>v.some(v=>v.some(v=>v)))){data.shift();}
			while(!data.some(v=>v[0].some(v=>v.some(v=>v)))){data.forEach(v=>v.shift());}
			while(!data.some(v=>v.some(v=>v[0].some(v=>v)))){data.forEach(v=>v.forEach(v=>v.shift()));}
			while(!data.some(v=>v.some(v=>v.some(v=>v[0])))){
				data.forEach(v=>v.forEach(v=>v.forEach(v=>v.shift())));
			}
		};
		step();step();step();step();step();step();
		return data.reduce((r,v)=>v.reduce((r,v)=>v.reduce((r,v)=>v.reduce((r,v)=>r+v,r),r),r),0);
	}
};
var d_18=(data,part=1)=>{
	if(part==1){
		var evaluate=line=>{let i=0,expr=()=>{if(line[i]=="("){
			i++;
			let ret=expr();
			while(line[i++]!=")"){
				let op=line[i];i+=2;
				if(op=="+"){ret+=expr();}
				if(op=="*"){ret*=expr();}
			}
			return ret;
		}else{return parseInt(line[i++]);}};return expr();};
	}else{
		var evaluate=line=>{let i=0,expr=()=>{if(line[i]=="("){
			i++;
			let sum=expr(),prod=1;
			while(line[i++]!=")"){
				let op=line[i];i+=2;
				if(op=="+"){sum+=expr();}
				if(op=="*"){prod*=sum;sum=expr();}
			}
			return prod*sum;
		}else{return parseInt(line[i++]);}};return expr();};
	}
	return data.split("\n").reduce((r,v)=>r+evaluate(`(${v})`),0);
};
var d_19=(data,part=1)=>{
	{let i=data.indexOf("\n\n");var rules=data.slice(0,i).split("\n"),messages=data.slice(i+1).split("\n");}
	rules=Object.fromEntries(rules.map(v=>{
		if(part==2){
			if(v=="8: 42"){return [8,["(?:",42,"+)"]];}
			if(v=="11: 42 31"){return [11,[
				"(?:",
				42,31,"|",
				42,42,31,31,"|",
				42,42,42,31,31,31,"|",
				42,42,42,42,31,31,31,31,"|",
				42,42,42,42,42,31,31,31,31,31,"|",
				42,42,42,42,42,42,31,31,31,31,31,31,"|",
				42,42,42,42,42,42,42,31,31,31,31,31,31,31,"|",
				42,42,42,42,42,42,42,42,31,31,31,31,31,31,31,31,"|",
				42,42,42,42,42,42,42,42,42,31,31,31,31,31,31,31,31,31,"|",
				42,42,42,42,42,42,42,42,42,42,31,31,31,31,31,31,31,31,31,31,")"
			]];}
		}
		var i=v.indexOf(": "),k=v.slice(0,i);v=v.slice(i+2);
		if(v.match(/^"."$/)){return [k,[v[1]]];}
		i=v.indexOf(" | ");let f=v=>v.split(" ").map(v=>parseInt(v));
		if(i>=0){
			v=[].concat(["(?:"],f(v.slice(0,i)),["|"],f(v.slice(i+3)),[")"]);
		}else{v=f(v);}
		return[k,v];
	}));
	{let changed=true;while(changed){
		changed=false;
		Object.values(rules).forEach(v1=>v1.forEach((v2,i)=>{
			if(typeof v2=="number"&&rules[v2].every(v=>typeof v=="string")){
				changed=true;v1[i]=rules[v2].join("");
			}
		}));
	}}
	var re=RegExp(`^${rules[0].join("")}$`);
	return messages.reduce((r,v)=>r+(re.test(v)?1:0),0);
}
var d_20=(data,part=1)=>{
	data=data.split("\n\n").map(v=>{
		var i=v.indexOf(":\n"),id=parseInt(v.slice(5,i)),grid=v.slice(i+2).split("\n");
		grid=grid.map(v=>v.split("").map(v=>(v=="#"?1:0)));
		var sides=[
			grid[0].join(""),
			grid.map(v=>v[v.length-1]).join(""),
			grid[grid.length-1].slice().reverse().join(""),
			grid.map(v=>v[0]).reverse().join("")
		];
		return{id:id,grid:grid,sides:sides};
	});
	var rotoflipSides=(rfid,sides)=>{
		// \0n1   \1w0  
		// 1\  0  0\  1 
		// w \ e  n \ s 
		// 0  \1  1  \0 
		//  1s0\   0e1\ 
		if(rfid&0b001){sides=[
			sides[3].split("").reverse().join(""),
			sides[2].split("").reverse().join(""),
			sides[1].split("").reverse().join(""),
			sides[0].split("").reverse().join("")
		];}// flip
		if(rfid&0b010){sides=[sides[3],sides[0],sides[1],sides[2]];}// 90deg
		if(rfid&0b100){sides=[sides[2],sides[3],sides[0],sides[1]];}// 180deg
		return sides;
	};
	var rotoflipGrid=(rfid,grid)=>{
		if(rfid&0b001){grid=grid.map((v,y)=>v.map((v,x)=>{
			var row=grid[x];return row[y];
		}));}// flip
		if(rfid&0b010){grid=grid.map((v,y)=>v.map((v,x)=>{
			var row=grid[x];return row[row.length-y-1];
		}));}// 90deg
		if(rfid&0b100){grid=grid.map((v,y)=>v.map((v,x)=>{
			var row=grid[grid.ength-1-y];return [row.length-1-x];
		}));}// 180deg
		return grid;
	};
	var grid={},d=0,c=0;
	var tryqueue=function*(queue,tiles){
		var x,y;
		while(1){
			if(queue.length==0){if(tiles.length==0){yield;}return;}
			let pos=queue.pop();x=pos[0];y=pos[1];
			if(grid[`${x},${y}`]===undefined){break;}
		}
		d++;c++;
		queue.push([x,y-1],[x+1,y],[x,y+1],[x-1,y]);
		var n=grid[`${x  },${y-1}`];n=n&&n.sides[2];
		var e=grid[`${x+1},${y  }`];e=e&&e.sides[3];
		var s=grid[`${x  },${y+1}`];s=s&&s.sides[0];
		var w=grid[`${x-1},${y  }`];w=w&&w.sides[1];
		for(let i=0;i<tiles.length;i++){for(let j=0;j<=0b111;j++){
			let rfs=rotoflipSides(j,tiles[i].sides);
			if((rfs[0]==n||!n)&&(rfs[1]==e||!e)&&(rfs[2]==s||!s)&&(rfs[3]==w||!w)){
				let newtiles=tiles.slice(),tile=Object.assign({},newtiles.splice(i,1)[0]);
				grid[`${x},${y}`]=tile;tile.sides=rfs;tile.rfid=j;
				yield*tryqueue(queue.slice(),newtiles);
			}
		}}
		grid[`${x},${y}`]=undefined;
		d--;
		//tile.grid=rotoflipGrid(tile.rfid,tile.grid);
	}
	var iterator=tryqueue([[0,0]],data),ret=iterator.next();
	debugger;debugger;debugger;debugger;debugger;
	{
		var xmin=Infinity,xmax=-Infinity,ymin=Infinity,ymax=-Infinity;
		Object.keys(grid).forEach(v=>{
			v=v.split(",");
			xmin=Math.min(xmin,v[0]);xmax=Math.max(xmax,v[0]);
			ymin=Math.min(ymin,v[1]);ymax=Math.max(ymax,v[1]);
		});
		var xrange=xmax-xmin,yrange=ymax-ymin;
		grid=Array(yrange).fill().map((v,y)=>Array(xrange).fill().map((v,x)=>grid[`${x+xmin},${y+ymin}`]));
	}
	return [data,grid];
};