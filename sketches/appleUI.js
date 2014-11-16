var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

updateLine();

function updateLine() {

	makeVectors();
	drawVectors();
	requestAnimationFrame(updateLine);
}

function makeVectors() {

	// if (typeof vectors === 'undefined') {
	// 	vectors = [];

	// 	for (var i = 0; i < 50; i++) {
	// 		var vec = {};
	// 		vec.x = 150 + ((1 + Math.cos((i / 49) * Math.PI * 2)) / 2) * -150; //Math.sin(i+cd);//*1+Math.sin(i*.032+(i/100)*pi*20)*.1;
	// 		vec.y = i * 15 / 5; //*1+Math.cos(i*.032+(i/100)*pi*20)*.1;
	// 		vec.z = 0;
	// 		vectors.push(vec);
	// 	}

	// }
	// 
	var nums = [0,55,0,32,22,0,78,9,0,119,28,0,130,65,0,119,100,0,98,128,0,64,144,0,30,136,0,0,121,0]

	if (typeof ctrls === 'undefined') {
		ctrls = [];
		vectors = [];

		var q = -1;

		for (var i = 0; i < 10; i++) {
			var vec = {};
			vec.x = nums[++q];//150 + ((1 + Math.cos((i / 9) * Math.PI * 2)) / 2) * -150; //Math.sin(i+cd);//*1+Math.sin(i*.032+(i/100)*pi*20)*.1;
			vec.y = nums[++q];//i * 75 / 5; //*1+Math.cos(i*.032+(i/100)*pi*20)*.1;
			vec.z = nums[++q];//0;
			ctrls.push(vec);
			vectors.push(vec);
		}
	}

}

function drawVectors() {

	// ctx.fillStyle="#ffffff";
	// ctx.fill();
	// ctx.moveTo(0,0);
	ctx.clearRect(0, 0, 150, 150);
	ctx.fillStyle = "#558899";
	ctx.fillRect(0, 0, 150, 150);

	// ctx.moveTo(25+vectors[0].x,vectors[0].y*16);
	// console.log(vectors.length);
	for (var i = 1; i < vectors.length; i++) {
		ctx.beginPath();
		var vec = vectors[i - 1];
		// console.log(vec.x);
		ctx.lineTo(vec.x, vec.y);
		var vec = vectors[i];
		// console.log(vec.x);
		ctx.lineTo(vec.x, vec.y);

		ctx.stroke();

	}
	for(var i = 0 ; i < ctrls.length ; i++){
		ctx.beginPath();
		ctx.arc(ctrls[i].x, ctrls[i].y, 10, 0, 2 * Math.PI, false);
		ctx.fillStyle = "#ffffff";
		ctx.fill();
		ctx.stroke();
	}
	// ctx.endPath();

}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};		
}
drawLine = false;
moveCtrl = -1;

c.addEventListener('mousedown', function (evt) {
	// varR=true;
	drawLine = true;
	console.log('down');

}, false);
c.addEventListener('mouseup', function (evt) {
	drawLine = false;
	moveCtrl = -1;
}, false);

c.addEventListener('mousemove', function (evt) {
	var mousePos = getMousePos(c, evt);
	// for(var i = 0 ; i < 10 ; i++){
	// 	var p = Math.floor((mousePos.y/150)*10);
	// }
	// console.log(vectors.length);

	console.log(moveCtrl);
	if (drawLine) {
		for(var i = 0 ; i < ctrls.length ; i++){
			// console.log(Math.abs(mousePos.x - ctrls[i].x));
			if( dist(mousePos,ctrls[i])<20 || moveCtrl == i){
				ctrls[i].x = mousePos.x;
				ctrls[i].y = mousePos.y;
				moveCtrl = i;
				i=ctrls.length;

			}
			if(i==0||i==ctrls.length-1){
				ctrls[i].x =0;
			}
		}

		ctrls[0].x =0;
		ctrls[ctrls.length-1].x=0;
		// for(var i = 0 ; i < vectors.length ; i++){
		// vectors.push({
		// 	x: mousePos.x,
		// 	y: mousePos.y,
		// 	z: 0
		// });
		// if (vectors.length > 100)
		// 	vectors.shift();

		// vectors.unshift({x:0,y:mousePos.y,z:0});
		// vectors.shift();

		// }
	}

	//    vectors[0].x = 0;
	// vectors[vectors.length-1].x = 0;
	// drawLine = false;
	// console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
}, false);

function dist(a,b){
	var X = Math.abs(a.x - b.x);
	var Y = Math.abs(a.y - b.y);
	return Math.sqrt((X*X)+(Y*Y));
}

// scriptSource = "sketches/workfile.js";