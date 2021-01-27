var doc=document,win=window,clr,ctree,cd,SZ,nums;
var rnd=Math.random,round=Math.round,max=Math.max,min=Math.min,PI=Math.PI;
var CVS=doc.querySelector("#comp1"),CVS2=doc.querySelector("#comp2");
var C=CVS.getContext("2d"),C2=CVS2.getContext("2d");
function getNums(){
	var hashPairs=[],seed,rvs,j=0;
	seed = parseInt( tokenData.hash.slice(0,16), 16 );
	for(j=0;j<32;j++){
		hashPairs.push(
			tokenData.hash.slice( 2+(j*2),4+(j*2) )
		);
	}
	rvs = hashPairs.map(n=>parseInt(n,16));
	return rvs;
}
function clearC2(){ C2.clearRect( 0, 0, SZ, SZ ) }
function canvasAction( callback ){
	C.save();
	C2.save();
	C.beginPath();
	callback( [].slice.call(arguments,1) );
	C.restore();
	C2.restore();
}
function transWithAnchor( x, y, C, callback ){
	C.translate( x, y );
	callback( [].slice.call(arguments,3) );
	C.translate( x*-1, y*-1 );
}
function addShad( callback ){
	var soff1=1+cd.soff, soff2=1-cd.soff;
	var poff1=SZ*cd.poff, poff2=SZ*(cd.poff*-1);
	clearC2();
	transWithAnchor( SZ/2, SZ/2, C2, ()=>{
		C2.scale(1,soff1)
		C2.translate( poff1, 0 );
	});
	C2.beginPath();
	callback( [].slice.call(arguments,1) );
	C2.fillRect( 0, 0, SZ, SZ );
	C2.globalCompositeOperation = "destination-out";
	C2.fill();
	C2.beginPath();
	transWithAnchor( SZ/2, SZ/2, C2, ()=>{
		C2.scale(1,soff2)
		C2.translate( poff2, 0 );
	});
	callback( [].slice.call(arguments,1) );
	C2.globalCompositeOperation = "destination-in";
	C2.fill();
	C.drawImage( CVS2, 0, 0 );
}
function strokeFill( C ){
	C.stroke();
	C.fill();
}
function addOrb( x, y, sx, sy, C ){
	C.ellipse( x, y, sx, sy, 0, 0, 2*PI );
	setStdStyle();
	C.fill();
	addShad(()=>{
		C2.ellipse( x, y, sx, sy, 0, 0, 2*PI );
		C2.fillStyle = ctree.char.shad;
	});
	C.stroke();
}
function setStdStyle(){
	C.lineWidth = cd.lwidth;
	C.strokeStyle = "#000";
	C.fillStyle = ctree.char.base;
}
function drawStdStyle(){
	C.lineWidth = cd.lwidth;
	C.strokeStyle = "#000";
	C.fillStyle = ctree.char.base;
	strokeFill( C );
}
function addBG(){
	var grad = C.createRadialGradient( SZ/2, SZ/2, 1, SZ/2, SZ/2, SZ/2 ),i;
	for(i=0;i<2;i++) grad.addColorStop( i, ctree.bg[i] );
	C.fillStyle = grad;
	C.fillRect( 0, 0, SZ, SZ );
}
function addEye( x, y, sx, sy, C ){
	C.beginPath();
	C.strokeStyle = "#000";
	C.lineWidth = cd.lwidth/2;
	C.fillStyle = "#fff";
	C.arc( x, y, sx, sy, 2*PI );
	strokeFill( C );
}
function addEyes(){
	addEye( SZ/2.15, SZ/3, SZ/64, 0, C );
	addEye( SZ/1.85, SZ/3, SZ/64, 0, C );
}
function addHead(){
	addOrb( SZ*0.5, SZ*0.33, SZ/12, SZ/12, C );
}
function addHeart(){ }
function addTorso(){
	addOrb( SZ*0.5, SZ*0.5, SZ*0.1, SZ/8, C );
}
function addArms(){
	var s=0.045, s2=0.03, y=0.43;
	var x1=SZ*0.4, x2=SZ*0.6, x3=SZ*0.35, x4=SZ*0.65;
	canvasAction(()=>{
		addOrb( x3, SZ*y, SZ*s2, SZ*s2, C );
	});
	canvasAction(()=>{
		addOrb( x4, SZ*y, SZ*s2, SZ*s2, C );
	});
	canvasAction(()=>{
		addOrb( x1, SZ*y, SZ*s, SZ*s, C );
	});
	canvasAction(()=>{
		addOrb( x2, SZ*y, SZ*s, SZ*s, C );
	});
}
function addTail(){
	addOrb( SZ*0.5, SZ*0.6, SZ*0.07, SZ*0.1, C );
}
function init(){
	// SZ = min(win.innerWidth,win.innerHeight);
	nums = getNums();
	SZ = 800;
	CVS.setAttribute( "width", SZ );
	CVS.setAttribute( "height", SZ );
	CVS2.setAttribute( "width", SZ );
	CVS2.setAttribute( "height", SZ );
	ctree = {
		bg: ["#333","#111"],
		clrs: [
			[ "#dfd319", "#6f5412" ],
			[ "#20e272", "#0f7054" ]
		]
	}
	ctree.char = {
		base: ctree.clrs[nums[0]%2][0],
		shad: ctree.clrs[nums[0]%2][1]
	}
	cd = { lwidth:SZ/128, soff:0.1, poff:0.03 }
}
function main(){
	init();
	canvasAction( addBG );
	canvasAction( addArms );
	canvasAction( addTail );
	canvasAction( addTorso );
	canvasAction( addHead );
	canvasAction( addEyes );
}
main();
