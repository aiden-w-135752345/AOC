/// <reference lib="ESNext" />
// data=document.body.innerText.slice(0,-1);

/** @param {string} data @param {number} part */
var d_1=(data,part)=>{
    const unsorted=data.split("\n").map(v=>v.split("   ").map(v=>parseInt(v)));
    const left=unsorted.map(v=>v[0]).sort((a,b)=>a-b),right=unsorted.map(v=>v[1]).sort((a,b)=>a-b);
    if(part==1){return unsorted.reduce((r,_,i)=>r+Math.abs(left[i]-right[i]),0);}
    const map=new Map(Map.groupBy(right,v=>v).entries().map(([k,v])=>[k,v.length]));
    return left.reduce((r,v)=>r+v*(map.get(v)||0),0);
};

/** @param {string} data @param {number} part */
var d_2=(data,part)=>{
    const reports=data.split("\n").map(v=>v.split(" ").map(v=>parseInt(v)));
    /** @param {number[]} report*/
    const safe=report=>{
        const deltas=report.map((v,i)=>report[i+1]-v);
        deltas.pop();
        return deltas.every(v=>1<=v&&v<=3)||deltas.every(v=>-3<=v&&v<=-1);
    };
    return reports.filter(report=>{
        if(safe(report)){return true;}
        if(part==1){return false;}
        return report.some((_,i)=>safe([].concat(report.slice(0,i),report.slice(i+1))));
    }).length;
};

/** @param {string} data @param {number} part */
var d_3=(data,part)=>{
    var total=0,enabled=true;
    data.matchAll(/mul\(([0-9]+),([0-9]+)\)|do\(\)|don't\(\)/g).forEach(v=>{
        if(v[0]=="do()"){enabled=true;}
        else if(v[0]=="don't()"){enabled=false;}
        else if(enabled||part==1){total+=parseInt(v[1])*parseInt(v[2]);}
    });
    return total;
};

/** @param {string} data @param {number} part */
var d_4=(data,part)=>{
    const grid=data.split("\n"),width=grid[0].length,height=grid.length;
    if(!grid.every(v=>v.length==width)){throw "not rectangle";}
    var count=0;
    if(part==1){
        for(let y=0;y<height;y++){
            for(let x=0;x<width;x++){
                if(grid[y][x]!="X"){continue;}
                const testDir=(dx,dy)=>{
                    if(0<=x+dx*3&&x+dx*3<width&&0<=y+dy*3&&y+dy*3<height){
                        if(grid[y+dy][x+dx]=="M"&&grid[y+dy*2][x+dx*2]=="A"&&grid[y+dy*3][x+dx*3]=="S"){
                            ++count;
                        }
                    }
                }
                testDir(-1,-1);testDir(0,-1);testDir(1,-1);
                testDir(-1, 0);              testDir(1, 0);
                testDir(-1, 1);testDir(0, 1);testDir(1, 1);
            }
        }
    }
    if(part==2){
        for(let y=1;y<height-1;y++){
            for(let x=1;x<width-1;x++){
                if(grid[y][x]!="A"){continue;}
                const NW=grid[y-1][x-1],NE=grid[y-1][x+1];
                const SW=grid[y+1][x-1],SE=grid[y+1][x+1];
                if(NE==SW||SE==NW)continue;
                if((NW=="M"||NW=="S")&&(NE=="M"||NE=="S")&&(SW=="M"||SW=="S")&&(SE=="M"||SE=="S")){
                    ++count;
                }
            }
        }
    }
    return count;
};

/** @param {string} data @param {number} part */
var d_5=(data,part)=>{
    let [rulesStr,updatesStr]=data.split("\n\n");
    const rulesList=rulesStr.split("\n").map(v=>v.split("|").map(v=>parseInt(v)));
    const updates=updatesStr.split("\n").map(v=>v.split(",").map(v=>parseInt(v)));
    let maxPage=[0].concat(rulesList.flat(),updates.flat()).reduce((r,v)=>Math.max(r,v),0);
    const rulesTable=Array(maxPage+1).fill().map((_1,_2,a)=>a.map(()=>0));
    rulesList.forEach(([before,after])=>{
        rulesTable[before][after]=1;
        rulesTable[after][before]=-1;
    });
    return updates.reduce((r,update)=>{
        let outOfOrder=update.some((_,i)=>update.slice(0,i).some((_,j)=>rulesTable[update[j]][update[i]]==-1));
        
        if(part==1){
            return outOfOrder?r:(r+update[(update.length-1)/2]);
        }
        if(!outOfOrder){return r;}
        while(outOfOrder){
            outOfOrder=false;
            update.forEach((_,i)=>update.slice(0,i).forEach((_,j)=>{
                const a=update[i],b=update[j];
                if(rulesTable[b][a]==-1){outOfOrder=true;update[i]=b;update[j]=a;}
            }));
        }
        return r+update[(update.length-1)/2];
    },0);
}

/** @param {string} data @param {number} part */
var d_6=(data,part)=>{
    const grid=data.split("\n"),width=grid[0].length,height=grid.length;
    if(!grid.every(v=>v.length==width)){throw "not rectangle";}
    /** @param {number[]} pos */
    let inGrid=pos=>(0<=pos[0]&&pos[0]<width&&0<=pos[1]&&pos[1]<height);
    const startPos=[-1,-1];startPos[1]=grid.findIndex(v=>(startPos[0]=v.indexOf("^"))>=0);
    /** @type {Set<string>} */
    const path=new Set();
    {
        let pos=startPos.slice(),dir=[0,-1];
        while(inGrid(pos)){
            if(grid[pos[1]][pos[0]]=="#"){
                pos[0]-=dir[0];pos[1]-=dir[1];
                dir=[-dir[1],dir[0]];
            }
            path.add(pos.join(","));
            pos[0]+=dir[0];pos[1]+=dir[1];
        }
    }
    if(part==1){return path.size;}
    return Array.from(path,v=>v.split(",").map(v=>parseInt(v)))
        .filter(v=>inGrid(v)&&grid[v[1]][v[0]]==".").filter(obstacle=>{
        let pos=startPos.slice(),dir=[0,-1];
        /** @type {Set<string>} */
        const path=new Set();
        while(1){
            if(!inGrid(pos)){return false;}
            if(grid[pos[1]][pos[0]]=="#"||(obstacle[0]==pos[0]&&obstacle[1]==pos[1])){
                pos[0]-=dir[0];pos[1]-=dir[1];
                dir=[-dir[1],dir[0]];
            }
            const key=pos.join(",")+","+dir.join(",");
            if(path.has(key)){return true;}
            path.add(key);
            pos[0]+=dir[0];pos[1]+=dir[1];
        }
    }).length;
}

/** @param {string} data @param {number} part */
var d_7=(data,part)=>{
    return data.split("\n").map(v=>v.split(": ")).reduce((r,[valueStr,operandsStr])=>{
        const value=parseInt(valueStr),operands=operandsStr.split(" ").map(v=>parseInt(v));
        const results=operands.slice(1).reduce((r,right)=>r.flatMap(
            left=>[left+right,left*right].concat(part==1?[]:[left*10**(Math.floor(1+Math.log10(right)))+right])
        ),[operands[0]]);
        return r+(results.includes(value)?value:0);
    },0);
}

/** @param {string} data @param {number} part */
var d_8=(data,part)=>{
    const grid=data.split("\n"),width=grid[0].length,height=grid.length;
    if(!grid.every(v=>v.length==width)){throw "not rectangle";}
    /** @type {Map<string,{x:number,y:number}[]>}*/
    const antennas=new Map;
    const antinodes=grid.map((v,y)=>v.split("").map((v,x)=>{
        if(v==".")return false;
        const list=antennas.get(v)||[];
        list.push({x,y});
        antennas.set(v,list);
        return false;
    }));
    antennas.entries().forEach(([_,positions])=>positions.forEach(a=>positions.forEach(b=>{
        const dx=a.x-b.x,dy=a.y-b.y
        if(dx==0&&dy==0){return;}
        if(part==1){
            const x=a.x+dx,y=a.y+dy;
            if(0<=x&&x<width&&0<=y&&y<height){antinodes[y][x]=true;}
        }
        if(part==2){
            for(let i=-(width+height);i<(width+height);i++){
                const x=a.x+i*dx,y=a.y+i*dy;
                if(0<=x&&x<width&&0<=y&&y<height){antinodes[y][x]=true;}
            }    
        }
    })));
    return antinodes.reduce((r,v)=>v.reduce((r,v)=>r+(v?1:0),r),0);
}

/** @param {string} data @param {number} part */
var d_9=(data,part)=>{
    /** @param {number[]} heap @param {number} v */
    const heappush=(heap,v)=>{
        heap.push(v);
        for(let node=heap.length-1;node>0;){
            const parent=(node-1)>>1;
            if(heap[parent]<=heap[node]){return;}
            const tmp=heap[parent];heap[parent]=heap[node];heap[node]=tmp;
            node=parent;
        }
    };
    /** @param {number[]} heap */
    const heappop=heap=>{
        heap[0]=heap.pop();
        let root=0;
        while(1){
            let child = root*2+1;
            if(child>=heap.length){return;}
            if(child+1 < heap.length && heap[child] > heap[child+1]){child = child + 1;}
            if(heap[root] <= heap[child]){return;}
            const tmp=heap[root];heap[root]=heap[child];heap[child]=tmp;
            root = child;
        }
    };
    /** @type {number[][]} */const free=Array(10).fill().map(v=>[]);
    /** @type {{idx:number,len:number,id:number}[]} */const files=[];
    data.split("").reduce((r,v,i)=>{
        const len=parseInt(v);
        if(i&1){
            heappush(free[len],r);
        }else{
            const id=i>>1;
            if(part==1){
                files.push(...Array(len).fill().map((_,i)=>({idx:r+i,len:1,id:id})));
            }else{
                files.push({idx:r,len:len,id:id});
            }
        }
        return r+len;
    },0);
    files.reverse().forEach(file=>{
        let destLen=-1,destIdx=Infinity;
        for(let len=file.len;len<10;len++){
            const idx=free[len][0];
            if(free[len].length&&idx<destIdx){destLen=len;destIdx=idx;}
        }
        if(destIdx>file.idx){return;}
        file.idx=destIdx;
        heappop(free[destLen]);heappush(free[destLen-file.len],destIdx+file.len);
    });
    return files.reduce((r,v)=>r+v.id*(v.len*(v.len-1+v.idx*2))/2,0);
}

/** @param {string} data @param {number} part */
var d_10=(data,part)=>{
    const grid=data.split("\n"),width=grid[0].length,height=grid.length;
    if(!grid.every(v=>v.length==width)){throw "not rectangle";}
    const dirs=[[0,-1],[1,0],[0,1],[-1,0]];
    return grid.reduce((r,v,y)=>v.split("").reduce((r,v,x)=>{
        if(v!="0"){return r;}
        const ends="123456789".split("").reduce((r,step)=>r.flatMap(([x,y])=>dirs.map(([dx,dy])=>[x+dx,y+dy])).filter(
            ([x,y])=>0<=x&&x<width&&0<=y&&y<height&&grid[y][x]==step
        ),[[x,y]]).map(v=>v.join(","));
        return r+(part==1?new Set(ends).size:ends.length);
    },r),0);
}

/** @param {string} data @param {number} part */
var d_11=(data,part)=>{
    /** @type {Map<number,number>}*/
    var stones=new Map();
    data.split(" ").map(v=>parseInt(v)).forEach(v=>stones.set(v,(stones.get(v)||0)+1));
    let max=0;
    for(let i=0;i<(part==1?25:75);i++){
        const prev=stones,next=new Map();
        prev.forEach((count,stone)=>{
            max=Math.max(max,stone);
            if(stone==0){next.set(1,(next.get(1)||0)+count);return;}
            const digits=Math.floor(1+Math.log10(stone));
            if(digits%2==0){
                const split=10**(digits/2),low=stone%split,high=Math.floor(stone/split);
                next.set(low,(next.get(low)||0)+count);
                next.set(high,(next.get(high)||0)+count);
            }else{
                const insert=stone*2024;
                next.set(insert,(next.get(insert)||0)+count);    
            }
        });
        stones=next;
    };
    return stones.values().reduce((r,v)=>r+v,0);
}

/** @param {string} data @param {number} part */
var d_12=(data,part)=>{
    const grid=data.split("\n").map(v=>v.split(""));
    const width=grid[0].length,height=grid.length;
    if(!grid.every(v=>v.length==width)){throw "not rectangle";}
    let total=0;
    for(let oy=0;oy<height;oy++)for(let ox=0;ox<width;ox++){
        const species=grid[oy][ox];
        if(species==".")continue;
        let perimeter=0,sides=0,area=0,minX=ox,maxX=ox,minY=oy,maxY=oy;
        /** @type {[number,number][]}*/
        const stack=[[ox,oy]];
        while(stack.length){
            const [x,y]=stack.pop();
            if(grid[y][x]=="%"){continue;}
            grid[y][x]="%";++area;
            minX=Math.min(x,minX);minY=Math.min(y,minY);maxX=Math.max(x,maxX);maxY=Math.max(y,maxY);
            let [NW,N,NE]=(y-1>=0)?[(x-1>=0)?grid[y-1][x-1]:".",grid[y-1][x],(x+1<width)?grid[y-1][x+1]:"."]:[".",".","."];
            let W=(x-1>=0)?grid[y][x-1]:".",E=(x+1<width)?grid[y][x+1]:".";
            let [SW,S,SE]=(y+1<height)?[(x-1>=0)?grid[y+1][x-1]:".",grid[y+1][x],(x+1<width)?grid[y+1][x+1]:"."]:[".",".","."];
            if(N==species){stack.push([x,y-1]);}if(E==species){stack.push([x+1,y]);}
            if(S==species){stack.push([x,y+1]);}if(W==species){stack.push([x-1,y]);}
            NW=(NW==species||NW=="%");N=(N==species||N=="%");NE=(NE==species||NE=="%");
            W =(W ==species||W =="%");                       E =(E ==species||E =="%");
            SW=(SW==species||SW=="%");S=(S==species||S=="%");SE=(SE==species||SE=="%");
            if(!N){++perimeter;if(NW||!W){++sides;}}
            if(!E){++perimeter;if(NE||!N){++sides;}}
            if(!S){++perimeter;if(SE||!E){++sides;}}
            if(!W){++perimeter;if(SW||!S){++sides;}}
        }
        for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){if(grid[y][x]=="%"){grid[y][x]=".";}}
        total+=(part==1?perimeter:sides)*area;
    }
    return total;
}

/** @param {string} data @param {number} part */
var d_13=(data,part)=>data.split("\n\n").map(machine=>{
    let [_,AX,AY,BX,BY,X,Y]=machine.match(/^Button A: X\+([0-9]+), Y\+([0-9]+)\nButton B: X\+([0-9]+), Y\+([0-9]+)\nPrize: X=([0-9]+), Y=([0-9]+)$/);
    AX=parseInt(AX);AY=parseInt(AY);BX=parseInt(BX);BY=parseInt(BY);X=parseInt(X);Y=parseInt(Y);
    if(part==2){X+=10000000000000;Y+=10000000000000;}
    const A_num=(X*BY-Y*BX),B_num=(Y*AX-X*AY),denom=(AX*BY-AY*BX);
    if(denom==0){throw "none or infinite solutions.";}
    if(A_num%denom!=0||B_num%denom!=0){return 0;}
    const A=A_num/denom,B=B_num/denom;
    if(A<0||B<0){return 0;}
    if(part==1&&(A>100||B>100)){return 0;}
    return 3*A+1*B;
}).reduce((r,v)=>r+v);