var d_1=(data,part=1)=>{
	data=data.split("\n").map(v=>parseInt(v));
	if(part==2){data=data.map((v,i,a)=>a[i]+a[i+1]+a[i+2]).slice(0,-3);}
	return data.map((v,i,a)=>(a[i-1]<a[i])?1:0).reduce((r,v)=>r+v,0);
}
var d_2a=data=>{
	var x=0,y=0;
	data.split("\n").forEach(v=>{v=v.split(" ");v[1]=parseInt(v[1]);switch(v[0]){
		case"up":{y+=v[1];break;}
		case"down":{y-=v[1];break;}
		case"forward":{x+=v[1];break;}
	}});
	return x*(-y);
};
var d_2b=data=>{
	var x=0,y=0,aim=0;
	data.split("\n").forEach(v=>{v=v.split(" ");v[1]=parseInt(v[1]);switch(v[0]){
		case"up":{aim+=v[1];break;}
		case"down":{aim-=v[1];break;}
		case"forward":{x+=v[1];y+=aim*v[1];break;}
	}});
	return x*(-y);
};
var d_3a=data=>{
	data=data.split("\n");
	var ones=data[0].split("").fill(0),zeros=data[0].split("").fill(0);
	data.forEach(v=>v.split("").forEach((v,i)=>{if(v=="1"){ones[i]++;}else{zeros[i]++;}}))
	if(ones.some((v,i)=>zeros[i]==ones[i])){debugger;}
	var gamma=ones.map((v,i)=>(ones[i]>zeros[i])?"1":"0").join("");
	var epsilon=ones.map((v,i)=>(ones[i]>zeros[i])?"0":"1").join("");
	return parseInt(gamma,2)*parseInt(epsilon,2);
};
var d_3b=data=>{
	data=data.split("\n");
	var filter=tots2bit=>{
		let res=data;
		for(let i=0;res.length>1;i++){
			let bit=tots2bit(res.reduce((r,v)=>{r[v[i]]++;return r;},[0,0]))?"1":"0";
			res=res.filter(v=>v[i]==bit);
		}
		return parseInt(res[0],2);
	}
	return filter(tots=>(tots[1]>=tots[0]))*filter(tots=>(tots[1]<tots[0]));
};
var d_4=(data,part=1)=>{
	data=data.split("\n\n");
	var numbers=data.shift().split(",").map(v=>parseInt(v));
	var cards=data.map(v=>v.split("\n").slice(0,5).map(
		v=>v.match(/(..) (..) (..) (..) (..)/).slice(1).map(v=>parseInt(v))
	));
	var winnerScores=[];
	for(var i=0;i<numbers.length;i++){
		cards=cards.filter(card=>{
			var marked=card.map(v=>v.map(v=>numbers.slice(0,i+1).includes(v)));
			var won=[0,1,2,3,4].some(i=>(
				marked[i][0]&&marked[i][1]&&marked[i][2]&&marked[i][3]&&marked[i][4]
			)||(
				marked[0][i]&&marked[1][i]&&marked[2][i]&&marked[3][i]&&marked[4][i]
			));
			if(won){
				winnerScores.push(
					card.map((v,i1)=>v.filter((v,i2)=>!marked[i1][i2])).flat().reduce((r,v)=>r+v,0)*numbers[i]
				);
				return false;
			}else{return true;}
		});
	}
	return winnerScores[part==2?winnerScores.length-1:0];
};
var d_5=(data,part=1)=>{
	data=data.split("\n").map(v=>v.split(" -> ").map(v=>v.split(",").map(v=>parseInt(v))));
	if(part==1){data=data.filter(v=>v[0][0]==v[1][0]||v[0][1]==v[1][1]);}
	var grid=[];
	data.forEach(line=>{
		let dx=Math.sign(line[1][0]-line[0][0]),dy=Math.sign(line[1][1]-line[0][1]);
		let ex=line[1][0],ey=line[1][1];
		for(let px=line[0][0],py=line[0][1];px!=ex||py!=ey;px+=dx,py+=dy){
			let c=(grid[px]=grid[px]||[])[py]||0;grid[px][py]=c+1;
		}
		let c=(grid[ex]=grid[ex]||[])[ey]||0;grid[ex][ey]=c+1;
	});
	return grid.map(v=>v.filter(v=>v>1)).flat().length;
};
var d_6=(data,part=1)=>{
	var lastgen=[],duration=part==1?80:256;
	data.split(",").forEach(v=>{v=parseInt(v);lastgen[v]=(lastgen[v]||0)+1;});
	for(let i=0;i<duration;i++){
		let nextgen=lastgen.slice(1);
		nextgen[6]=(nextgen[6]||0)+(lastgen[0]||0);
		nextgen[8]=(nextgen[8]||0)+(lastgen[0]||0);
		lastgen=nextgen;
	}
	return lastgen.reduce((r,v)=>r+v,0);
};
var d_7=(data,part=1)=>{
	data=data.split(",").map(v=>parseInt(v)).sort((a,b)=>a-b);
	var minfuel=Infinity,maxpos=data[data.length-1];
	for(let i=0;i<maxpos;i++){
		let fuel=data.reduce((r,v)=>{v=Math.abs(i-v);if(part==2){v*=v+1;}return r+v;},0)
		if(fuel<minfuel){minfuel=fuel;}
	}
	if(part==2){minfuel/=2;}
	return minfuel;
}
var d_8=(data,part=1)=>{
	data=data.split("\n").map(v=>v.split(" | ").map(v=>v.split(" ")));
	if(part==1){return data.reduce((r,v)=>v[1].reduce((r,v)=>r+([2,3,4,7].includes(v.length)?1:0),r),0);}
	` aaa     ###     ...     ###     ###     ...     ###     ###     ###     ###     ###  
	 b   c   #   #   .   #   .   #   .   #   #   #   #   .   #   .   .   #   #   #   #   # 
	 b   c   #   #   .   #   .   #   .   #   #   #   #   .   #   .   .   #   #   #   #   # 
	  ddd     ...     ...     ###     ###     ###     ###     ###     ...     ###     ###  
	 e   f   #   #   .   #   #   .   .   #   .   #   .   #   #   #   .   #   #   #   .   # 
	 e   f   #   #   .   #   #   .   .   #   .   #   .   #   #   #   .   #   #   #   .   # 
	  ggg     ###     ...     ###     ###     ...     ###     ###     ...     ###     ###  `;
	return data.reduce((r,v)=>{
		// complement
		var c=(   set )=>"abcdefg".split("").filter(v=>               !set.includes(v) ).join("");
		// union
		var u=(...sets)=>"abcdefg".split("").filter(v=>sets.some (set=>set.includes(v))).join("");
		// intersect
		var n=(...sets)=>"abcdefg".split("").filter(v=>sets.every(set=>set.includes(v))).join("");
		{
			let d1  =v[0].find  (v=>v.length   == 2),d235=v[0].filter(v=>v.length   == 5);
			let d069=v[0].filter(v=>v.length   == 6),d4  =v[0].find  (v=>v.length   == 4);
			let d7  =v[0].find  (v=>v.length   == 3),d8  =v[0].find  (v=>v.length   == 7);
			let cf  =u(d1);
			let d3  =d235.find  (v=>n(v,cf)==cf),d25 =d235.filter(v=>n(v,cf)!=cf);
			let d6  =d069.find  (v=>n(v,cf)!=cf),d09 =d069.filter(v=>n(v,cf)==cf);
			let e   =c(u(d3,n(d4,c(cf))));
			let d2  =d25 .find  (v=>n(v, e)== e),d5  =d25 .find  (v=>n(v, e)=="");
			let d0  =d09 .find  (v=>n(v, e)== e),d9  =d09 .find  (v=>n(v, e)=="");
			var digits=[u(d0),u(d1),u(d2),u(d3),u(d4),u(d5),u(d6),u(d7),u(d8),u(d9)];
		}
		var resA=parseInt(v[1].map(v=>digits.indexOf(u(v))).join(""));
		return r+resA;
	},0);
};
var d_9=(data,part=1)=>{
	data=data.split("\n").map(v=>v.split(""));
	var width=data[0].length,height=data.length;
	if(part==1){
		data=data.map(v=>v.map(v=>parseInt(v)));
		let get=(x,y)=>(0<=y&&y<height&&0<=x&&x<width)?data[y][x]:10;
		return data.reduce((r,row,y,a)=>row.reduce((r,v,x)=>r+(v<Math.min(
			get(x,y+1),get(x,y-1),get(x+1,y),get(x-1,y)
		)?v+1:0),r),0);
	}else{
		data=data.map(v=>v.map(v=>v=="9"?"#":"_"));
		let basins=[];
		for(let y=0,row=Array(width).fill("#");y<height;y++){for(let x=0,cell="#";x<width;x++){
			if(data[y][x]=="#"){row[x]=cell="#";}
			else if(row[x]=="#"){
				if(cell=="#"){cell=basins.indexOf(null);if(cell<0){cell=basins.length;}basins[cell]=0;}
				basins[row[x]=cell]++;
			}else if(cell=="#"||cell==row[x]){basins[cell=row[x]]++;}
			else{
				let m=Math.max(row[x],cell);cell=Math.min(row[x],cell);
				basins[cell]+=basins[m]+1;basins[m]=null;row=row.map(v=>v==m?cell:v);
			}
			data[y][x]=cell;
		}}
		/*
(()=>{
var width=data[0].length,height=data.length,img=new ImageData(width,height);


img.data.set(document.body.innerText.slice(0,-1).split("\n").map(v=>v.split("")).flat().map(v=>Math.round(255*parseInt(v)/9)).map(v=>[v,v,v,255]).flat());

img.data.set(data.flat().map(v=>{
	if(v=="#"){return [255,255,255,255];}
	let r=[0,0,0,255];
	for(let i=0;i<8;i++){r[0]=(r[0]<<1)|(v&1);v>>=1;r[1]=(r[1]<<1)|(v&1);v>>=1;r[2]=(r[2]<<1)|(v&1);v>>=1;}
	return r;
}).flat());

var can=document.body.appendChild(document.createElement("canvas")),ctx=can.getContext("2d");
can.width=width*10;can.height=height*10;ctx.imageSmoothingEnabled=false;
ctx.putImageData(img,0,0);ctx.drawImage(can,0,0,width,height,0,0,width*10,height*10);
})();

		*/
		let top=[0,0,0];
		basins.forEach(v=>{
			if(v===null||v<top[2]){return;}
			if(v<top[1]){top[2]=v;}
			else if(v<top[0]){top[2]=top[1];top[1]=v;}
			else{top[2]=top[1];top[1]=top[0];top[0]=v;}
		});
		return top[0]*top[1]*top[2];
	}
};
var d_10=(data,part=1)=>{
	data=data.split("\n");
	var openBrackets=["(","[","{","<"],closeBrackets=[")","]","}",">"];
	var corrupted=[],open=[];
	data.forEach(line=>{
		var stack=[],temp;
		for(let i=0;i<line.length;i++){
			temp=openBrackets.indexOf(line[i]);
			if(temp>=0){stack.push(temp);continue;}
			temp=closeBrackets.indexOf(line[i]);
			if(temp!=stack.pop()){corrupted.push([3,57,1197,25137][temp]);return;}
		}
		if(stack.length){open.push(stack.reduceRight((r,v)=>([1,2,3,4][v]+5*r),0));}
	});
	if(part==1){return corrupted.reduce((r,v)=>r+v,0);}
	else{return open.sort((a,b)=>a-b)[(open.length-1)/2];}
};
var d_11=(data,part=1)=>{
	data=data.split("\n").map(v=>v.split("").map(v=>parseInt(v)));
	var flashes=0,inc=(x,y)=>{let row=data[y];if(row&&0<=x&&x<row.length){row[x]++;}};
	var step=()=>{
		for(let y=0;y<data.length;y++){for(let x=0;x<data[y].length;x++){inc(x,y);}}
		let changed=true;
		while (changed){changed=false;for(let y=0;y<data.length;y++){for(let x=0;x<data[y].length;x++){
			if(data[y][x]>9){
				flashes++;changed=true;data[y][x]=-Infinity;
				inc(x-1,y-1);inc(x,y-1);inc(x+1,y-1);
				inc(x-1,y  );inc(x,y  );inc(x+1,y  );
				inc(x-1,y+1);inc(x,y+1);inc(x+1,y+1);
			}
		}}}
		let sync=true;
		for(let y=0;y<data.length;y++){for(let x=0;x<data[y].length;x++){
			if(data[y][x]<0){data[y][x]=0;}else{sync=false;}
		}}
		return sync;
	};
	if(part==1){for(let i=0;i<100;i++){step();}return flashes;}
	else{let i=0;while(!step()){i++}return i+1;}
};
var d_12=(data,part=1)=>{
	data=data.split("\n").reduce((r,v)=>{
		let i=v.indexOf("-"),k=v.slice(0,i);v=v.slice(i+1);
		(r[k]=r[k]||[]).push(v);(r[v]=r[v]||[]).push(k);
		return r;
	},{});
	var prefixes=[["start",part==1]],routes=0;
	while(prefixes.length){
		let prefix=prefixes.pop(),didTwice=prefix.pop();
		data[prefix[prefix.length-1]].forEach(v=>{
			var doTwice=(v!=v.toUpperCase()&&prefix.includes(v));
			if(didTwice&&doTwice){return;}
			if(v=="start"){return;}
			if(v=="end"){routes++;return;}
			prefixes.push([].concat(prefix,[v,didTwice||doTwice]));
		});
	}
	return routes;
};
var d_13=(data,part=1)=>{
	{let i=data.indexOf("\n\n");var points=data.slice(0,i).split("\n"),folds=data.slice(i+2).split("\n");}
	points=points.map(v=>v.split(",").map(v=>parseInt(v)));
	if(part==1){folds=[folds[0]];}
	for(let i=0;i<folds.length;i++){
		let fold=parseInt(folds[i].slice(13));
		if(folds[i][11]=="y"){
			points=points.map(v=>[v[0],v[1]>fold?2*fold-v[1]:v[1]])
		}else{
			points=points.map(v=>[v[0]>fold?2*fold-v[0]:v[0],v[1]])
		}
		points=points.filter((v1,i,a)=>i==a.findIndex(v2=>(v1[0]==v2[0])&&(v1[1]==v2[1])));
	}
	if(part==1){return points.length;}else{
		let minx=0,maxx=0,miny=0,maxy=0;
		points.forEach(v=>{
			minx=Math.min(v[0],minx);maxx=Math.max(v[0],maxx);
			miny=Math.min(v[1],miny);maxy=Math.max(v[1],maxy);
		});
		let grid=Array(maxy-miny+1).fill(maxx-minx+1).map(v=>Array(v).fill(" "));
		points.forEach(v=>{grid[v[1]-miny][v[0]-minx]="#";});
		console.log(grid.map(v=>v.join("")).join("\n"));
	}
};
var d_14=(data,part=1)=>{
	{let i=data.indexOf("\n\n");var pairs=data.slice(0,i),rules=data.slice(i+2).split("\n");}
	let ends=pairs[0]+pairs[pairs.length-1],steps=part==1?10:40;
	pairs=pairs.split("").slice(1).reduce((r,v,i)=>{let p=pairs[i]+pairs[i+1];r[p]=(r[p]||0)+1;return r;},{});
	rules=Object.fromEntries(rules.map(v=>v.split(" -> ")));
	for(let i=0;i<steps;i++){
		let newPairs={}
		Object.entries(pairs).forEach(v=>{
			let i=rules[v[0]],c=v[1];
			if(i===undefined){
				let p=v[0];
				newPairs[p]=(newPairs[p]||0)+c;
			}else{
				let a=v[0][0]+i,b=i+v[0][1];
				newPairs[a]=(newPairs[a]||0)+c;
				newPairs[b]=(newPairs[b]||0)+c;
			}
		});
		pairs=newPairs;
	};
	let freq={};
	Object.entries(pairs).forEach(v=>{
		let a=v[0][0],b=v[0][1],c=v[1];
		freq[a]=(freq[a]||0)+c;freq[b]=(freq[b]||0)+c;
	});
	freq[ends[0]]=(freq[ends[0]]||0)+1;
	freq[ends[1]]=(freq[ends[1]]||0)+1;
	let min=Infinity,max=-Infinity;
	Object.values(freq).forEach(v=>{min=Math.min(min,v);max=Math.max(max,v);});
	return(max-min)/2;
};
var d_15=(data,part=1)=>{
	data=data.split("\n").map(v=>v.split("").map(v=>parseInt(v)));
	if(part==2){data=Array(5).fill().map((_,i1)=>data.map(v=>Array(5).fill().map((_,i2)=>v.map(
		v=>((v+i1+i2-1)%9)+1
	)).flat())).flat();}
	// HEAP
	function heapPush(element,heap,cmp=(a,b)=>(a-b)){
		let i1=heap.length,i2=Math.floor((i1 - 1)/2);
		heap.push(element);
		let v1=heap[i1],v2=heap[i2];
		while(i1!=0&&cmp(v1,v2)<0){
			heap[i1]=v2;heap[i2]=v1;
			i1=i2;i2=Math.floor((i1 - 1)/2);v2=heap[i2];
		}
	}
	function heapPop(heap,cmp=(a,b)=>(a-b)){
		if(heap.length==1){return heap.pop();}
		var root=heap[0];heap[0]=heap.pop();
		var i1=0;
		while(true){
			let il=i1*2+1,ir=il+1;
			let i2=i1,v2=heap[i2];
			if(il<heap.length){
				let vl=heap[il];
				if(cmp(v2,vl)>0){i2=il;v2=vl;}
			}
			if(ir<heap.length){
				let vr=heap[ir];
				if(cmp(v2,vr)>0){i2=ir;v2=vr;}
			}
			if(i2==i1){break;}
			else{
				heap[i2]=heap[i1];
				heap[i1]=v2;
				i1=i2;
			}
		}
		return root;
	}
	// HEAP
	var tempDists=data.map(v=>v.map(v=>Infinity));tempDists[0][0]=0;
	var pqueue=[],pqueue_cmp=(a,b)=>tempDists[a[0]][a[1]]-tempDists[b[0]][b[1]];
	heapPush([0,0],pqueue,pqueue_cmp);
	while(pqueue.length){
		let pos=heapPop(pqueue,pqueue_cmp),tempDist=tempDists[pos[0]][pos[1]];
		let dir=(y,x)=>{
			if(!(0<=y&&y<data.length&&0<=x&&x<data[y].length)){return;}
			var nextDist=tempDist+data[y][x];
			if(nextDist<tempDists[y][x]){
				tempDists[y][x]=nextDist;heapPush([y,x],pqueue,pqueue_cmp);
			}
		};
		dir(pos[0],pos[1]+1);dir(pos[0],pos[1]-1);dir(pos[0]+1,pos[1]);dir(pos[0]-1,pos[1]);
	}
	return tempDists[tempDists.length-1][tempDists[tempDists.length-1].length-1]
};
var d_16=(data,part=1)=>{
	data=data.split("").map(v=>parseInt(v,16).toString(2).padStart(4,0)).join("");
	var i=0;
	var parse=()=>{
		var version=parseInt(data.slice(i,i+=3),2),type=parseInt(data.slice(i,i+=3),2);
		var packet={version:version,type:type};
		if(type==4){
			let payload="";
			while(data[i++]=="1"){payload+=data.slice(i,i+=4);}
			payload+=data.slice(i,i+=4);
			packet.value=parseInt(payload,2);
			return packet;
		}
		packet.subpackets=[];
		if(data[i++]=="0"){
			let end=parseInt(data.slice(i,i+=15),2)+i;
			while(i<end){packet.subpackets.push(parse());}
		}else{
			let count=parseInt(data.slice(i,i+=11),2);
			while(packet.subpackets.length<count){packet.subpackets.push(parse());}
		}
		return packet;
	},reduce=(packet,cb)=>cb(packet,packet.subpackets?packet.subpackets.map(v=>reduce(v,cb)):[]);
	if(part==1){return reduce(parse(),(v,r)=>r.reduce((r,v)=>r+v,v.version));}
	else{return reduce(parse(),(v,r)=>{switch(v.type){
		case 0:{return r.reduce((r,v)=>r+v,0);}
		case 1:{return r.reduce((r,v)=>r*v,1);}
		case 2:{return r.reduce((r,v)=>Math.min(r,v), Infinity);}
		case 3:{return r.reduce((r,v)=>Math.max(r,v),-Infinity);}
		case 4:{return v.value;}
		case 5:{return r[0]>r[1]?1:0;}
		case 6:{return r[0]<r[1]?1:0;}
		case 7:{return r[0]==r[1]?1:0;}
		r.reduce((r,v)=>r+v,v.version);
	}});}
};
var d_17=(data,part=1)=>{
	data=data.match(/^target area: x=(-?[0-9]+)\.\.(-?[0-9]+), y=(-?[0-9]+)\.\.(-?[0-9]+)/);
	var target=[parseInt(data[1]),parseInt(data[2]),parseInt(data[3]),parseInt(data[4])];
	var numTrajectories=0,highestApex=-Infinity;
	for(let v0y=target[2];v0y<=-target[2];v0y++){for(var v0x=0;v0x<=target[1];v0x++){
		let vy=v0y,vx=v0x,px=0,py=0,apex=-Infinity;
		while(1){
			py+=vy;vy--;px+=vx;if(vx){vx--;}if(py>apex){apex=py;}
			if(py<target[2]||px>target[1]){break;}
			if(py<=target[3]&&target[0]<=px){numTrajectories++;if(apex>highestApex){highestApex=apex;}break;}
		}
	}}
	return part==1?highestApex:numTrajectories;
};
var d_18=(data,part=1)=>{
	var reduce=v=>{
		var exp_pnp,exp_pni=-1,exp_add=0,exploded=false;
		var exp_rec=(p,i,d)=>{
			var v=p[i];
			if(v instanceof Array){
				if(d==4){
					v[0]+=exp_add;exploded=true;
					if(exp_pni!=-1){exp_pnp[exp_pni]+=v[0];}
					p[i]=0;exp_add=v[1];exp_pnp=p,exp_pni=i;
				}else{exp_rec(v,0,d+1);exp_rec(v,1,d+1);}
			}else{p[i]+=exp_add;exp_add=0;exp_pnp=p,exp_pni=i;}
			
		};
		var split_rec=(p,i)=>{
			let v=p[i];
			if(v instanceof Array){
				if(split_rec(v,0)){return true;}
				if(split_rec(v,1)){return true;}
				return false;
			}else{
				if(v>=10){p[i]=[Math.floor(v/2),Math.ceil(v/2)];return true;}
				else{return false;}
			}
		};
		exp_rec([v],0,0);
		while(split_rec([v],0)||exploded){exp_pni=-1;exp_add=0;exploded=false;exp_rec([v],0,0);}
		return v;
	};
	var mag=v=>{if(v instanceof Array){return 3*mag(v[0])+2*mag(v[1]);}else{return v;}}
	data=data.split("\n");
	if(part==1){
		data=data.map(v=>JSON.parse(v)).reduce((r,v)=>reduce([r,v]));
		//console.log(JSON.stringify(data));
		return mag(data);
	}else{
		let maxmag=-Infinity;
		data.forEach(a=>data.forEach(b=>{
			var v=reduce([JSON.parse(a),JSON.parse(b)]),m=mag(v);if(m>maxmag){maxmag=m;}
		}));
		return maxmag;
	}
};
var d_19=(data,part=1)=>{
	var scanners=data.split("\n\n").map(v=>({
        rotation:undefined,position:undefined,
        beacons:v.split("\n").slice(1).map(v=>v.split(",").map(v=>parseInt(v)))
    }));
    var rotations=[
		v=>[ v[0], v[1], v[2]],v=>[ v[0],-v[1],-v[2]],v=>[-v[0], v[1],-v[2]],
		v=>[-v[0],-v[1], v[2]],v=>[ v[0], v[2],-v[1]],v=>[ v[0],-v[2], v[1]],
		v=>[-v[0], v[2], v[1]],v=>[-v[0],-v[2],-v[1]],v=>[ v[1], v[0],-v[2]],
		v=>[ v[1],-v[0], v[2]],v=>[-v[1], v[0], v[2]],v=>[-v[1],-v[0],-v[2]],
		v=>[ v[2], v[0], v[1]],v=>[ v[2],-v[0],-v[1]],v=>[-v[2], v[0],-v[1]],
		v=>[-v[2],-v[0], v[1]],v=>[ v[1], v[2], v[0]],v=>[ v[1],-v[2],-v[0]],
		v=>[-v[1], v[2],-v[0]],v=>[-v[1],-v[2], v[0]],v=>[ v[2], v[1],-v[0]],
		v=>[ v[2],-v[1], v[0]],v=>[-v[2], v[1], v[0]],v=>[-v[2],-v[1],-v[0]]
    ];
    scanners.forEach(scanner=>{scanner.fingerprint=scanner.beacons.map((a,i,arr)=>
        arr.map((b,j)=>[a].map((c,k)=>[
            (a[0]-b[0])*(b[0]-c[0])+(a[1]-b[1])*(b[1]-c[1])+(a[2]-b[2])*(b[2]-c[2]),
            i,j,k
        ]))
    ).flat(2).reduce((r,v)=>{
        (r[v[0]]=r[v[0]]||[]).push(v.slice(1));return r;
    },{});});
    var intersects=scanners.map((a,i)=>scanners.map(b=>{
        let common=Object.keys(a.fingerprint).filter(k=>b.fingerprint[k]);
        let total=0;
        common.forEach(k=>total+=Math.min(a.fingerprint[k].length,b.fingerprint[k].length));
        if(total<3*12**2){return;}
        return [common.reduce((r,k)=>r+a.fingerprint[k].length*b.fingerprint[k].length,0)];
    }));
    return intersects.flat().filter(v=>v);
    /*
    scanners[0].position=[0,0,0];scaneers[0].rotation=rotations[0];
    while(1){
        let totry=data.filter(v=>!v.rotation);
        if(!totry.length){break;}
        let got1=totry.some(scanner=>scanner);
        if(!got1){break;}
    }
	return data;*/
};
var d_20=(data,part=1)=>{
	{let i=data.indexOf("\n\n");var rule=data.slice(0,i);data=data.slice(i+2).split("\n");}
	data=data.map(v=>v.split(""))
	var edge=".",get=(x,y)=>(data[y]&&data[y][x]?data[y][x]:edge)=="#"?"1":"0";
	var step=()=>{
		data=[].concat(
			[Array(data[0].length+2).fill(edge)],
			data.map(v=>[edge].concat(v,[edge])),
			[Array(data[0].length+2).fill(edge)]
		);
		data=data.map((v,y)=>v.map((v,x)=>rule[parseInt(
			get(x-1,y-1)+get(x,y-1)+get(x+1,y-1)+
			get(x-1,y  )+get(x,y  )+get(x+1,y  )+
			get(x-1,y+1)+get(x,y+1)+get(x+1,y+1),2
		)]));
		edge=rule[edge=="#"?0x1FF:0]
	},steps=(part==1?2:50);
	for(let i=0;i<steps;i++){step();}
	return data.reduce((r,v)=>v.reduce((r,v)=>r+(v=="#"),r),0);
};
var d_21=(data,part=1)=>{
	data=data.match(/^Player 1 starting position: ([0-9]+)\nPlayer 2 starting position: ([0-9]+)/);
	if(part==1){
		let pos=[parseInt(data[1]),parseInt(data[2])],score=[0,0];
		let rolls=0,roll=()=>(++rolls)%100;
		while(true){
			pos[0]+=roll()+roll()+roll();
			pos[0]%=10;
			score[0]+=(pos[0]||10);
			if(score[0]>=1000){break;}
			pos[1]+=roll()+roll()+roll();
			pos[1]%=10;
			score[1]+=(pos[1]||10);
			if(score[1]>=1000){break;}
		}
		return rolls*Math.min(score[0],score[1]);
	}else{
		let threerolls=[[3,1],[4,3],[5,6],[6,7],[7,6],[8,3],[9,1]],ret=[0,0];
		let rec=(pos,score,times)=>{
			threerolls.forEach(roll0=>{
				let p0=(pos[0]+roll0[0])%10,s0=score[0]+(p0||10);
				if(s0>=21){ret[0]+=times*roll0[1];return;}
				threerolls.forEach(roll1=>{
					let p1=(pos[1]+roll1[0])%10,s1=score[1]+(p1||10);
					if(s1>=21){ret[1]+=times*roll0[1]*roll1[1];return;}
					rec([p0,p1],[s0,s1],times*roll0[1]*roll1[1]);
				});
			});
		};
		rec([parseInt(data[1]),parseInt(data[2])],[0,0],1);
		return Math.max(ret[0],ret[1]);
	}
};
var d_22=(data,part=1)=>{
	var moves=data.split("\n").map(v=>{
		v=v.match(
			/^(on|off) x=(-?[0-9]+)\.\.(-?[0-9]+),y=(-?[0-9]+)\.\.(-?[0-9]+),z=(-?[0-9]+)\.\.(-?[0-9]+)$/
		);
		return[v[1]=="on"].concat(v.slice(2).map(v=>parseInt(v)));
	});
	var xpos=moves.map(v=>[v[1],v[2]+1]),ypos=moves.map(v=>[v[3],v[4]+1]),zpos=moves.map(v=>[v[5],v[6]+1]);
	if(part==1){xpos.push([51,-50]);ypos.push([51,-50]);zpos.push([51,-50]);}
	xpos=xpos.flat().sort((a,b)=>a-b).filter((v,i,a)=>i==a.indexOf(v));
	ypos=ypos.flat().sort((a,b)=>a-b).filter((v,i,a)=>i==a.indexOf(v));
	zpos=zpos.flat().sort((a,b)=>a-b).filter((v,i,a)=>i==a.indexOf(v));
	data=[];
	for(let x=1;x<xpos.length;x++){
		let a=[];data.push(a);
		for(let y=1;y<ypos.length;y++){a.push(Array(zpos.length-1).fill(false));}
	}
	moves.forEach(v=>{
		var xs=xpos.indexOf(v[1]  ),ys=ypos.indexOf(v[3]  ),zs=zpos.indexOf(v[5]  );
		var xe=xpos.indexOf(v[2]+1),ye=ypos.indexOf(v[4]+1),ze=zpos.indexOf(v[6]+1);
		for(let x=xs;x<xe;x++){for(let y=ys;y<ye;y++){for(let z=zs;z<ze;z++){data[x][y][z]=v[0];}}}
	});
	var volume=0,xs,xe,ys,ye,zs,ze;
	if(part==1){
		xs=xpos.indexOf(-50);ys=ypos.indexOf(-50);zs=zpos.indexOf(-50);
		xe=xpos.indexOf( 51);ye=ypos.indexOf( 51);ze=zpos.indexOf( 51);
	}else{
		xs=0;ys=0;zs=0;xe=xpos.length-1;ye=ypos.length-1;ze=zpos.length-1;
	}
	var dx=xpos.slice(0,-1).map((v,x)=>xpos[x+1]-v);
	var dy=ypos.slice(0,-1).map((v,y)=>ypos[y+1]-v);
	var dz=zpos.slice(0,-1).map((v,z)=>zpos[z+1]-v);
	for(let x=xs;x<xe;x++){for(let y=ys;y<ye;y++){for(let z=zs;z<ze;z++){if(data[x][y][z]){
		volume+=dx[x]*dy[y]*dz[z];
	}}}}
	return volume;
};
var d_23=(data,part=1)=>{
};
var d_24=(data,part=1)=>{
	var monad=inp=>{
		var z=[],pop=()=>z.pop()||0,peek=()=>z[z.length-1]||0;
		if(inp[ 0]!=peek()+11){z.push(inp[ 0]+ 3);}
		if(inp[ 1]!=peek()+14){z.push(inp[ 1]+ 7);}
		if(inp[ 2]!=peek()+13){z.push(inp[ 2]+ 1);}
		if(inp[ 3]!= pop()- 4){z.push(inp[ 3]+ 6);}
		if(inp[ 4]!=peek()+11){z.push(inp[ 4]+14);}
		if(inp[ 5]!=peek()+10){z.push(inp[ 5]+ 7);}
		if(inp[ 6]!= pop()- 4){z.push(inp[ 6]+ 9);}
		if(inp[ 7]!=peek()-12){z.push(inp[ 7]+ 9);}
		if(inp[ 8]!=peek()+10){z.push(inp[ 8]+ 6);}
		if(inp[ 9]!= pop()-11){z.push(inp[ 9]+ 4);}
		if(inp[10]!=peek()+12){z.push(inp[10]+ 0);}
		if(inp[11]!= pop()+ 1){z.push(inp[11]+ 7);}
		if(inp[12]!= pop()+ 0){z.push(inp[12]+12);}
		if(inp[13]!= pop()+11){z.push(inp[13]+ 1);}
		return z.length==0;
	};
	if(part==1){
		
	}
};
var d_25=(data)=>{
	data=data.split("\n").map(v=>v.split(""));
	var w=data[0].length,h=data.length,get=(x,y)=>data[y][x];
	var step=()=>{
		let changed=false;
		data=data.map((row,y)=>row.map((cell,x)=>{
			if(cell==">"&&data[y][(x  +1)%w]=="."){changed=true;return ".";}
			if(cell=="."&&data[y][(x+w-1)%w]==">"){changed=true;return ">";}
			return cell;
		}));
		data=data.map((row,y)=>row.map((cell,x)=>{
			if(cell=="v"&&data[(y  +1)%h][x]=="."){changed=true;return ".";}
			if(cell=="."&&data[(y+h-1)%h][x]=="v"){changed=true;return "v";}
			return cell;
		}));
		return changed;
	};
	var i=0;while(step()){i++;}return i+1;
};