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

/** @param {string} data @param {number} part */
var d_14=(data,part)=>{
    /** @param {number} n @param {number} d */
    const mod=(n,d)=>{const r=n%d;return r<0?r+d:(r==0?0:r);}
    const WIDTH=101,HEIGHT=103;
    const robots=data.split("\n")
        .map(v=>v.match(/^p=([0-9]+),([0-9]+) v=(-?[0-9]+),(-?[0-9]+)$/).slice(1).map(v=>parseInt(v)))
        .map(([px,py,vx,vy])=>[mod(px,WIDTH),mod(vx,WIDTH),mod(py,HEIGHT),mod(vy,HEIGHT)]);
    if(part==1){
        return robots.reduce((r,[px,vx,py,vy])=>{
            const x=(px+vx*100)%WIDTH,y=(py+vy*100)%HEIGHT;
            if(x<50&&y<51){r[0]++;}if(x>50&&y<51){r[1]++;}
            if(x<50&&y>51){r[2]++;}if(x>50&&y>51){r[3]++;}
            return r;
        },[0,0,0,0]).reduce((r,v)=>r*v,1);    
    }else{
        for(let i=0;i<WIDTH*HEIGHT;i+=HEIGHT){
            console.log(i+robots.reduce((r,[px,vx,py,vy])=>{
                r[(py+vy*i)%HEIGHT][(px+vx*i)%WIDTH]="#";
                return r;
            },Array(HEIGHT).fill(Array(WIDTH).fill()).map(v=>v.map(()=>" "))).map(v=>"\n"+v.join("")).join(""));
        }
        for(let i=parseInt(prompt("Which one looks better?"));i<WIDTH*HEIGHT;i+=WIDTH){
            console.log(i+robots.reduce((r,[px,vx,py,vy])=>{
                r[(py+vy*i)%HEIGHT][(px+vx*i)%WIDTH]="#";
                return r;
            },Array(HEIGHT).fill(Array(WIDTH).fill()).map(v=>v.map(()=>" "))).map(v=>"\n"+v.join("")).join(""));
        }
    }
}

/** @param {string} data @param {number} part */
var d_15=(data,part)=>{
    const [mapStr,moveStr]=data.split("\n\n");
    /** @type {{[index: string]:string[]}}*/
    const wider={"#":["#","#"],"O":["[","]"],".":[".","."],"@":["@","."]};
    const grid=mapStr.split("\n").map(v=>v.split("").flatMap(v=>part==2?wider[v]:[v]));
    /** @param {[number,number]} pos @param {[number,number]} dir @returns {boolean} */
    const check=([px,py],[dx,dy])=>{
        let cell=grid[py][px];
        if(cell==".")return true;
        if(cell=="#")return false;
        if(dx==0&&cell=="["){return check([px,py+dy],[dx,dy])&&check([px+1,py+dy],[dx,dy]);}
        if(dx==0&&cell=="]"){return check([px-1,py+dy],[dx,dy])&&check([px,py+dy],[dx,dy]);}
        return check([px+dx,py+dy],[dx,dy]);
    };
    /** @param {[number,number]} pos @param {[number,number]} dir*/
    const move=([px,py],[dx,dy])=>{
        let cell=grid[py][px];
        if(cell==".")return;
        if(dx==0&&cell=="["){
            move([px,py+dy],[dx,dy]);move([px+1,py+dy],[dx,dy]);
            grid[py+dy][px]="[";grid[py+dy][px+1]="]";
            grid[py][px]=".";   grid[py][px+1]=".";
            return;
        }
        if(dx==0&&cell=="]"){
            move([px-1,py+dy],[dx,dy]);move([px,py+dy],[dx,dy]);
            grid[py+dy][px-1]="[";grid[py+dy][px]="]";
            grid[py][px-1]=".";   grid[py][px]=".";
            return;
        }
        move([px+dx,py+dy],[dx,dy]);
        grid[py+dy][px+dx]=cell;grid[py][px]=".";
    };
    let pos=[-1,-1];
    pos[1]=grid.findIndex(v=>(pos[0]=v.indexOf("@"))>=0);
    /** @type {{[index: string]:[number,number]}}*/
    const dirs={"^":[0,-1],">":[1,0],"v":[0,1],"<":[-1,0]};
    moveStr.replace(/\n/g,"").split("").forEach(v=>{
        const dir=dirs[v];
        if(check(pos,dir)){move(pos,dir);pos[0]+=dir[0];pos[1]+=dir[1];}
        //console.log(`Move ${v}:\n${grid.map(v=>v.join("")).join("\n")}`);
    });
    return grid.reduce((r,v,y)=>v.reduce((r,v,x)=>(v=="O"||v=="[")?r+y*100+x:r,r),0);
}

/** @param {string} data @param {number} part */
var d_16=(data,part)=>{
    const grid=data.split("\n"),width=grid[0].length,height=grid.length;
    if(!grid.every(v=>v.length==width)){throw "not rectangle";}
    /** @type {[number,number,"^"|">"|"v"|"<"]}*/
    const startPos=[-1,-1,">"];startPos[1]=grid.findIndex(v=>(startPos[0]=v.indexOf("S"))>=0);
    const best=Object.fromEntries(["^",">","v","<"].map(k=>[k,grid.map(v=>v.split("").map(()=>Infinity))]));
    best[startPos[2]][startPos[1]][startPos[0]]=0;
    const dirs={"^":[0,-1],">":[1,0],"v":[0,1],"<":[-1,0]};
    const rotations={"^":["<",">"],">":["^","v"],"v":[">","<"],"<":["v","^"]};
    const stack=[startPos];
    while(stack.length){
        /** @type {[number,number,"^"|">"|"v"|"<"]}*/
        const [x,y,dir]=stack.pop();
        const [dx,dy]=dirs[dir];
        const myBest=best[dir][y][x];
        if(myBest+1<best[dir][y+dy][x+dx]&&grid[y+dy][x+dx]!="#"){
            best[dir][y+dy][x+dx]=myBest+1;
            stack.push([x+dx,y+dy,dir]);
        }
        rotations[dir].forEach(dir=>{
            if(myBest+1000<best[dir][y][x]){best[dir][y][x]=myBest+1000;stack.push([x,y,dir]);}
        });
    }
    const endPos=[-1,-1];endPos[1]=grid.findIndex(v=>(endPos[0]=v.indexOf("E"))>=0);
    if(part==1){
        return Math.min(...["^",">","v","<"].map(v=>best[v][endPos[1]][endPos[0]]));    
    }else{
        const isBest=grid.map(v=>v.split("").map(()=>false));
        stack.push(...["^",">","v","<"].map(dir=>[endPos[0],endPos[1],dir]));
        while(stack.length){
            /** @type {[number,number,"^"|">"|"v"|"<"]}*/
            const [x,y,dir]=stack.pop();
            const [dx,dy]=dirs[dir];
            const myBest=best[dir][y][x];
            if(myBest-1==best[dir][y-dy][x-dx]&&grid[y-dy][x-dx]!="#"){
                isBest[y][x]=true;stack.push([x-dx,y-dy,dir]);
            }
            rotations[dir].forEach(dir=>{
                if(myBest-1000==best[dir][y][x]){isBest[y][x]=true;stack.push([x,y,dir]);}
            });
        }
        return isBest.reduce((r,v)=>v.reduce((r,v)=>r+(v?1:0),r),0);
    }
}

/** @param {string} data @param {number} part */
var d_17=(data,part)=>{
    /** @type {string[]}*/
    const [_,A_str,B_str,C_str,prog_str]=data.match(/Register A: ([0-9]+)\nRegister B: ([0-9]+)\nRegister C: ([0-9]+)\n\nProgram: ([0-9,]+)/);
    const prog_num=prog_str.split(",").map(v=>parseInt(v));
    console.log(prog_num.map((v,i,a)=>{
        if(i&1){return "";}
        if(i&1==0&&v==3&&a[i+1]&1!=0){throw "misaligned jump";}
        let op=a[i+1];
        return "\n"+[
            `A>>=${"0123ABC"[op]}`, // adv
            `B^=${op}`, // bxl
            ["B=0","B=1","B=2","B=3","B=A&7","B&=7","B=C&7"][op], // bst
            `if(A!=0) GOTO ${op/2}`,// jnz
            "B^=C", // bxc
            "OUT "+["0","1","2","3","A&7","B&7","C&7"][op],// out
            `B=A>>${"0123ABC"[op]}`, // bdv
            `C=A>>${"0123ABC"[op]}` // cdv
        ][v]+";";
    }).join(""));
    if(part==1){
        let A=parseInt(A_str),B=parseInt(B_str),C=parseInt(C_str),PC=0;
        /** @type {number[]}*/
        const output=[];
        const combo=[()=>0,()=>1,()=>2,()=>3,()=>A,()=>B,()=>C,()=>{throw "invalid operand";}];
        const prog=prog_num.map((v,i,a)=>{
            let op=a[i+1];
            return [
                ()=>{A=A>>combo[op]();},// adv
                ()=>{B^=op;},// bxl
                ()=>{B=combo[op]()&7;},// bst
                ()=>{if(A!=0){PC=op-2;}},// jnz
                ()=>{B^=C;},// bxc
                ()=>{output.push(combo[op]()&7);},// out
                ()=>{B=A>>combo[op]();},// bdv
                ()=>{C=A>>combo[op]();}// cdv
            ][v];
        });
        while(PC<prog.length-1){prog[PC]();PC+=2;}
        return output.join(",");
    }
    return prog_num.reduceRight((r,v)=>r.flatMap(r=>Array(8).fill().map((_,i)=>(r<<3n)+BigInt(i))).filter(A=>{
        let B=Number(A&7n)^prog_num[3];
        return v==(B^prog_num[9]^Number((A>>BigInt(B))&7n));
    }),[0n])[0];
}

/** @param {string} data @param {number} part */
var d_18=(data,part)=>{
    const SIZE=70;
    const grid=Array(SIZE+1).fill().map((_1,_2,a)=>a.map(()=>"."));
    const dirs=[[0,-1],[1,0],[0,1],[-1,0]];
    if(part==1){
        data.split("\n").slice(0,1024).forEach(v=>{
            const [x,y]=v.split(",");
            grid[parseInt(y)][parseInt(x)]="#";
        });
        const best=grid.map(()=>grid.map(()=>Infinity));
        best[0][0]=0;
        const stack=[[0,0]];
        while(stack.length){
            /** @type {[number,number]}*/
            const [x,y]=stack.pop();
            const myBest=best[y][x];
            dirs.map(([dx,dy])=>[x+dx,y+dy]).forEach(([x,y])=>{
                if(0<=x&&x<=SIZE&&0<=y&&y<=SIZE&&myBest+1<best[y][x]&&grid[y][x]!="#"){
                    best[y][x]=myBest+1;
                    stack.push([x,y]);
                }
            });
        }
        return best[SIZE][SIZE];
    }else{
        return data.split("\n").find(v=>{
            const [x,y]=v.split(",");
            grid[parseInt(y)][parseInt(x)]="#";
            const unreachable=grid.map(()=>grid.map(()=>true));
            unreachable[0][0]=false;
            const stack=[[0,0]];
            while(stack.length){
                /** @type {[number,number]}*/
                const [x,y]=stack.pop();
                dirs.map(([dx,dy])=>[x+dx,y+dy]).forEach(([x,y])=>{
                    if(0<=x&&x<=SIZE&&0<=y&&y<=SIZE&&unreachable[y][x]&&grid[y][x]!="#"){
                        unreachable[y][x]=false;stack.push([x,y]);
                    }
                });
            }
            return unreachable[SIZE][SIZE];
        });
    }
}

/** @param {string} data @param {number} part */
var d_19=(data,part)=>{
    const [towelsStr,patterns]=data.split("\n\n");
    const towels=towelsStr.split(", ");
    const stateSlots=towels.reduce((r,v)=>r+v.length-1,1);
    return patterns.split("\n").reduce((r,pattern)=>{
        let sucesses=pattern.split("").reduce((prevState,char)=>{
            const nextState=Array(stateSlots).fill().map(()=>0);
            towels.reduce((shift,v)=>{
                if(v.length==1){if(v==char){nextState[0]+=prevState[0];}return shift;}
                if(v[0]==char){nextState[shift]+=prevState[0];}
                for(let i=1;i<v.length-1;i++){
                    if(v[i]==char){nextState[shift+i]+=prevState[shift+i-1];}
                }
                if(v[v.length-1]==char){nextState[0]+=prevState[shift+v.length-2];}
                return shift+v.length-1;
            },1);
            return nextState;
        },Array(stateSlots).fill().map(()=>0).fill(1,0,1))[0];
        return r+(part==1?(sucesses>0?1:0):sucesses);
    },0);
}
/** @param {string} data @param {number} part */
var d_20=(data,part)=>{
    const grid=data.split("\n"),width=grid[0].length,height=grid.length;
    if(!grid.every(v=>v.length==width)){throw "not rectangle";}
    /** @type {[number,number]}*/
    const startPos=[-1,-1];startPos[1]=grid.findIndex(v=>(startPos[0]=v.indexOf("S"))>=0);
    const startDists=grid.map(v=>v.split("").map(()=>Infinity));
    startDists[startPos[1]][startPos[0]]=0;
    const dirs=[[0,-1],[1,0],[0,1],[-1,0]];
    const stack=[startPos];
    while(stack.length){
        /** @type {[number,number]}*/
        const [x,y]=stack.pop();
        const myDist=startDists[y][x];
        dirs.map(([dx,dy])=>[x+dx,y+dy]).forEach(([x,y])=>{
            if(0<=x&&x<width&&0<=y&&y<height&&myDist+1<startDists[y][x]&&grid[y][x]!="#"){
                startDists[y][x]=myDist+1;
                stack.push([x,y]);
            }
        });
    }
    const endPos=[-1,-1];endPos[1]=grid.findIndex(v=>(endPos[0]=v.indexOf("E"))>=0);
    const endDists=grid.map(v=>v.split("").map(()=>Infinity));
    endDists[endPos[1]][endPos[0]]=0;
    stack.push(endPos);
    while(stack.length){
        /** @type {[number,number]}*/
        const [x,y]=stack.pop();
        const myDist=endDists[y][x];
        dirs.map(([dx,dy])=>[x+dx,y+dy]).forEach(([x,y])=>{
            if(0<=x&&x<width&&0<=y&&y<height&&myDist+1<endDists[y][x]&&grid[y][x]!="#"){
                endDists[y][x]=myDist+1;
                stack.push([x,y]);
            }
        });
    }
    const boringDist=endDists[startPos[1]][startPos[0]],MAX_CHEAT=(part==1?2:20);
    let count=0;
    grid.forEach((v,y1)=>v.split("").forEach((v,x1)=>{
        if(v=="#"){return;}
        const startDist=startDists[y1][x1];
        for(let dx=-MAX_CHEAT;dx<=MAX_CHEAT;dx++)for(let dy=-MAX_CHEAT;dy<=MAX_CHEAT;dy++){
            const x2=x1+dx,y2=y1+dy,cheatDist=Math.abs(dx)+Math.abs(dy);
            if(0<=x2&&x2<width&&0<=y2&&y2<height&&grid[y2][x2]!="#"&&cheatDist<=MAX_CHEAT){
                const cheaterDist=startDist+cheatDist+endDists[y2][x2];
                if(boringDist-cheaterDist>=100){count++;}
            }
        }
    }));
    return count;
};