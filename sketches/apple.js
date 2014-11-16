data = {};
pData = {};

sc1 = {

	setup: function () {

		console.log(b);

		R = new rainbow();
		R.randomCurves();
		R.lerpCurves();
		R.makeTube();
		scene.add(R.tubeParent);
		data.var4=.5;

		frameRate = 1000 / 60;

		highres = true;

 },

	draw: function (time) {

		R.steps = (data.var6+1)*10;

		if(drawLine || !compareObj(data,pData)){
			R.randomCurves();
			R.lerpCurves();
			R.tubesRotation[1] = data.var4 * pi * 2;
			R.makeTube();
			highres = true;
		}
		else if(highres){
			R.randomCurves();
			R.lerpCurves();
			R.tubesRotation[1] = data.var4 * pi * 2;
			R.makeTube({curveDetail:50});
			highres = false;
		}

		for(k in data){
			pData[k] = data[k];
		}

		// if (varR) {
		//   vectors = [];
		//   varR = false;
		// }
	}
};

var compareObj = function(a,b){

	var returner = true;

	for(var k in a){
		if(b[k]!=a[k])
			returner = false;
	}

	return returner;

}

var rainbow = function (params) {

	args = params || {};

	// this.curveDetail = args.curveDetail || 1000;

	this.steps = args.steps || 10;
	this.ctrlSteps = args.ctrlSteps || 10;
	this.curveDetail = args.curveDetail || 10;
	this.tubesRotation = [0, 0];

	this.ctrlCurves = [
	[],
	[],
	[]
	];

	this.curves = [];

	this.tree = new TREE();
	this.parent = new THREE.Object3D();
	this.tubeParent = new THREE.Object3D();
	this.tubeParent.rotation.y = pi;

};

rainbow.prototype.makeTube = function (params) {

	var args = params || {};

	args.curveDetail = args.curveDetail || this.curveDetail;


	if (this.tubeGeo) {
		this.tubeParent.remove(this.tubeGeo);
		this.tubeGeo.traverse(function (obj) {
			if (obj instanceof THREE.Mesh) {
				obj.geometry.dispose();
				obj.material.dispose();
			}
		});
	}

	this.tubeGeo = new THREE.Object3D();

 // for(var i = 0 ; i < 100 ; i ++){
 //     sp = sphere(1);
 //     sp.position.x = sin(i+count*.01)*100;
 //     sp.position.y = cos(i+count*.01)*100;
 //     this.tubeGeo.add(sp);
 // }

 // console.log(this.tubeGeo);

 // var a = [];
 // a.push(this.curves);
 // var tubes = [];

	for (var i = 0; i < this.curves.length; i++) {

		var rAmount = THREE.Math.mapLinear(i / this.curves.length, 0, 1, this.tubesRotation[0], this.tubesRotation[1]);
		var mat = new THREE.Matrix4();
		var mat2 = new THREE.Matrix4();

		mat.makeRotationY(rAmount);
		mat2.makeScale(1, 1, -1);

		for (var j in this.curves[i]) {
			this.curves[i][j].applyMatrix4(mat);
		}
		var tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.SplineCurve3(this.curves[i]), args.curveDetail), new THREE.MeshLambertMaterial({
			color: Math.sin(i + data.var2) * 0xffffff
		}));

		// for(var i = 0 ; i < 8 ; i++){
		//     var v = tube.geometry.vertices[i];
		//     tube.geometry.vertices.push(new THREE.Vector3(v.x,v.y,v.z));
		//     tube.geometry.faces.push(new THREE.Face3( a, b, c, normal, color, materialIndex ));
		// }
		for (var j in this.curves[i]) {
			this.curves[i][j].applyMatrix4(mat2);
		}
		var tube2 = new THREE.Mesh(new THREE.TubeGeometry(new THREE.SplineCurve3(this.curves[i]), args.curveDetail), new THREE.MeshLambertMaterial({
			color: Math.sin(i + data.var2) * 0xffffff
		}));

		// tube2 = tube.clone();
		// tube.rotation.y = THREE.Math.mapLinear(i/this.curves.length,0,1,this.tubesRotation[0],this.tubesRotation[1]);
		// tube2.rotation.y = THREE.Math.mapLinear(i/this.curves.length,0,1,this.tubesRotation[0],-this.tubesRotation[1]);
		this.tubeGeo.add(tube);
		this.tubeGeo.add(tube2);
	}

	var zCurve = [];

	var mat = new THREE.Matrix4();
	mat.makeRotationX(pi);

	var latheCurve = new THREE.SplineCurve3(this.curves[this.curves.length - 1]);
	var lcp = [];
	for (var i = 0; i < args.curveDetail + 1; i++) {
		lcp.push(latheCurve.getPointAt(i / args.curveDetail));
	}

	for (var i = 0; i < lcp.length; i++) {
		var v = lcp[i];
		v.applyMatrix4(mat);
		zCurve.push(v);

	}
	var lathe = new THREE.Mesh(
	new THREE.LatheGeometry(zCurve, 30, 0, this.tubesRotation[1] * 1.8),
	new THREE.MeshLambertMaterial({
		side: THREE.DoubleSide,
		color: Math.sin(i + data.var3) * 0xffffff
	}));
	// lathe.rotation.z=-this.tubesRotation[1]*.9;
	lathe.rotation.x = -pi;

	this.tubeGeo.add(lathe);
	// var mat = new THREE.MeshLambertMaterial(  );

	// for(var i = 0 ; i < tubes.children.length ; i++){
	//     var tTube = new THREE.Mesh(tubes.children[i].geometry,mat);
	//     tTube.rotation.y = THREE.Math.mapLinear(i/tubes.children.length,0,1,this.tubesRotation[0],this.tubesRotation[1]);
	//     this.tubeGeo.add(tTube);
	// }

	this.tubeGeo.traverse(function (obj) {
		if (obj instanceof THREE.Mesh) {
			obj.geometry.dispose();
			obj.material.dispose();
		}
	});

	tubes = null;
	// mat.dispose();

	this.tubeParent.add(this.tubeGeo);

};

rainbow.prototype.lerpCurves = function () {

 var c1 = new THREE.SplineCurve3(this.ctrlCurves[0]);
 var c2 = new THREE.SplineCurve3(this.ctrlCurves[1]);

 this.curves = [];

	for (var j = 0; j < this.steps; j++) {
		var c = [];
		for (var i = 0; i <= this.ctrlSteps; i++) {
			var l = c1.getPointAt(i / this.ctrlSteps);
			var k = c2.getPointAt(i / this.ctrlSteps);
			l.lerp(k, j / this.steps);
			c.push(l);
		}
		this.curves.push(c);
	}

};

rainbow.prototype.randomCurves = function () {

	for (var i = 0; i < this.ctrlCurves.length; i++) {
		this.ctrlCurves[i] = this.makeRandomCurve((.1 + i) * 20);
	}

	if (a.vectors.length > 0) {
		this.ctrlCurves[1] = [];
		for (var i = 0; i < a.vectors.length; i++) {
			this.ctrlCurves[1][i] = new THREE.Vector3(a.vectors[i].x * .2, 20 + a.vectors[i].y * -.2, 0);
		} // console.log(this.ctrlCurves[1]);
	}
	if (b.vectors.length > 0) {

		var diff = a.vectors[a.vectors.length-1].y-a.vectors[0].y;
		 diff-=a.vectors[0].y;
		console.log(diff);
		// diff-=a.vectors[0].y;
		this.ctrlCurves[0] = [];
		for (var i = 0; i < b.vectors.length; i++) {
			this.ctrlCurves[0][i] = new THREE.Vector3(b.vectors[i].x * .05, 5+(b.vectors[i].y * -.05), 0);
		} // console.log(this.ctrlCurves[1]);
	}

	console.log(this.ctrlCurves[0][1].x,this.ctrlCurves[1][1].x);

};

rainbow.prototype.makeRandomCurve = function (off, amount) {

	var o = off || 0;
	var amt = amount || 10;

	var c = [];

	for (var i = 0; i <= amt; i++) {
		var x = Math.sin((i / amt) * pi * 2); //*Math.random();
		var y = Math.cos((i / amt) * pi * 2); //+noise(i*3.1);
		c.push(new THREE.Vector3(x * o, y * o, 0));
	}

	return c;

};