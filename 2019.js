// Intcode computer
// ram: array of int
// input: function(int addr)
// output: function(int addr)
function Intcode(ram,input,output){
	var cpu=(this instanceof Intcode)?this:Object.create(Intcode.prototype);
	cpu.ram=ram;cpu.PC=0;cpu.input=input;cpu.output=output;cpu.stopped=0;cpu.relBase=0;return cpu;
}
Intcode.prototype.step=function(){
	if(this.stopped){return;}
	var instruction=this.ram[this.PC]||0,opcode=instruction%100;
	var param=param=>{
		var mode=Math.floor(instruction/(10**(2+param)))%10;
		switch(mode){
			case 0:{return get(this.PC+param);}
			case 1:{return this.PC+param;}
			case 2:{return this.relBase+get(this.PC+param);}
			default:{throw mode;}
		}
	};
	var get=addr=>this.ram[param(addr)]||0;
	switch(opcode){
		case 1:{//ADD
			this.ram[param(3)]=get(1)+get(2)
			this.PC+=4;break;
		}
		case 2:{//MUL
			this.ram[param(3)]=get(1)*get(2)
			this.PC+=4;break;
		}
		case 3:{this.input(param(1),this);break;}//IN
		case 4:{this.output(param(1),this);break;}//OUT
		case 9:{this.relBase+=get(1);this.PC+=2;break;}//REL
		case 99:{this.stopped=1;break;}//HALT
		default:{throw opcode;}
	}
};0;

// 1-a
document.body.innerText.split("\n").slice(0,-1).reduce((r,v)=>r+Math.floor(parseInt(v)/3)-2,0);
// 1-b
document.body.innerText.split("\n").slice(0,-1).reduce((r,v)=>{
	r-=(v=parseInt(v));while(v>0){r+=v;v=Math.floor(v/3)-2;}return r;
},0);
// 2-a
var cpu=new Intcode(document.body.innerText.split(",").map(v=>parseInt(v)));
cpu.ram[1]=12;cpu.ram[2]=2;
while(!cpu.stopped){cpu.step();}
cpu.ram[0];
// 2-b
var results=Array(100).fill().map((v,noun)=>Array(100).fill().map((v,verb)=>{
	var cpu=new Intcode(document.body.innerText.split(",").map(v=>parseInt(v)));
	cpu.ram[1]=noun;cpu.ram[2]=verb;
	while(!cpu.stopped){cpu.step();}
	return cpu.ram[0];
}));
var noun=results.findIndex(v=>v.includes(19690720)),verb=results[noun].indexOf(19690720);
100*noun+verb;
// 3-a
/*
var first=document.body.innerText.slice(0,document.body.innerText.indexOf("\n")).split(",");
var second=document.body.innerText.slice(document.body.innerText.indexOf("\n")+1,-1).split(",");

var range={minX:Infinity,maxX:-Infinity,minY:Infinity,maxY:-Infinity};
[first,second].map(v=>v.reduce((r,v)=>{
	var dist=parseInt(v.slice(1));
	switch(v[0]){
		case"U":{range.minY=Math.min(range.minY,r[1]=r[1]-dist);break;}
		case"D":{range.maxY=Math.max(range.maxY,r[1]=r[1]+dist);break;}
		case"L":{range.minX=Math.min(range.minX,r[0]=r[0]-dist);break;}
		case"R":{range.maxX=Math.max(range.maxX,r[0]=r[0]+dist);break;}
	}
	return r;
},[0,0]));
var canvas=document.createElement("canvas");
canvas.width=range.maxX-range.minX+1;canvas.height=range.maxY-range.minX+1;
var context=canvas.getContext("2d");
var drawWire=wire=>{context.beginPath();context.moveTo(-range.minX,-range.minY);wire.reduce((r,v)=>{
	var dist=parseInt(v.slice(1));
	switch(v[0]){
		case"U":{r[1]=r[1]-dist;break;}
		case"D":{r[1]=r[1]+dist;break;}
		case"L":{r[0]=r[0]-dist;break;}
		case"R":{r[0]=r[0]+dist;break;}
	}
	context.lineTo(r[0]-range.minX,r[1]-range.minY);
	return r;
},[0,0]);context.stroke();};
context.beginPath();context.arc(-range.minX,-range.minY,10,0,2*Math.PI);context.stroke();
context.strokeStyle="red";drawWire(first);context.strokeStyle="green";drawWire(second);
document.body.appendChild(canvas);
second.reduce((r,v)=>{
	var dist=parseInt(v.slice(1));
	switch(v[0]){
		case"U":{ver.push({max:r[1],x:r[0],min:r[1]=r[1]-dist});break;}
		case"D":{ver.push({min:r[1],x:r[0],max:r[1]=r[1]+dist});break;}
		case"L":{hor.push({max:r[0],y:r[1],min:r[0]=r[0]-dist});break;}
		case"R":{hor.push({min:r[0],y:r[1],max:r[0]=r[0]+dist});break;}
	}
	return r;
},[0,0]);

hor.forEach(h=>ver.forEach(v=>{
	if(h.min<v.x&&v.x<h.max&&v.min<h.y&&h.y<v.max){ret.push(Math.abs(v.x)+Math.abs(h.y));}
}));
ret.reduce((r,v)=>Math.min(r,v));*/
//3-b
//4-a
var n=0;for(var i=273025;i<767253;i++){let s=i.toString();if(
	/(.)\1/.test(s)&&s.split("").every((v,i)=>i==0||s[i-1]<=v)
){n++;}}n;
//4-b
/*var n=0;for(var i=273025;i<767253;i++){let s=i.toString();if(
	/(?:^|(?<!\1))(.)\1(?:(?!\1)|$)/g.test(s)&&s.split("").every((v,i)=>i==0||s[i-1]<=v)
){n++;}}n;
246 low*/
// 5-a
var cpu=new Intcode(
	document.body.innerText.split(",").map(v=>parseInt(v)),
	addr=>{cpu.ram[addr]=1;cpu.PC+=2;},
	addr=>{console.log(cpu.ram[addr]||0);cpu.PC+=2;}
);while(!cpu.stopped){cpu.step();}