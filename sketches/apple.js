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
		data.var2 = Math.random();
		data.var3 = Math.random();

		frameRate = 1000 / 60;

		highres = true;

 },

	draw: function (time) {

		R.steps = Math.round((data.var6+1)*10);

		if(drawLine || !compareObj(data,pData)){
			R.randomCurves();
			R.lerpCurves();
			R.tubesRotation[0] = data.var5 * Math.PI;
			R.tubesRotation[1] = data.var4 * Math.PI;
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
	this.tubeParent.position.y = 15;

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
 // 
// console.log(this.curves.length);

	for (var i = 0; i < this.curves.length; i++) {

		var rAmount = THREE.Math.mapLinear(i / this.steps, 0, 1, this.tubesRotation[0], this.tubesRotation[1]);
		var mat = new THREE.Matrix4();
		var mat2 = new THREE.Matrix4();

		// console.log(rAmount);
		mat.makeRotationY(rAmount);
		mat2.makeScale(1, 1, -1);

		for (var j in this.curves[i]) {
			this.curves[i][j].applyMatrix4(mat);
		}
		var col = new THREE.Color();
		col.setHSL(noise(data.var3+data.var2*10*(i/this.curves.length)),.7+((Math.sin((i/this.curves.length)*Math.PI*2)+1)/4),.6);

		var tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.SplineCurve3(this.curves[i]), args.curveDetail), new THREE.MeshLambertMaterial({
			color: col
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
			color: col
		}));

		// tube2 = tube.clone();
		// tube.rotation.y = THREE.Math.mapLinear(i/this.curves.length,0,1,this.tubesRotation[0],this.tubesRotation[1]);
		// tube2.rotation.y = THREE.Math.mapLinear(i/this.curves.length,0,1,this.tubesRotation[0],-this.tubesRotation[1]);
		this.tubeGeo.add(tube);
		this.tubeGeo.add(tube2);

		if(this.tubesRotation[0]<Math.PI/2){
			if(i==0){
				var t = tube.clone();
				t.rotation.y=Math.PI/2-this.tubesRotation[0];
				this.tubeGeo.add(t);
				var t = tube.clone();
				t.rotation.y=-Math.PI/2-this.tubesRotation[0];
				this.tubeGeo.add(t);
			}
		}
	}

	

	if(d.vectors.length>0){
		var tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.SplineCurve3(this.ctrlCurves[2]), args.curveDetail,1.2), new THREE.MeshLambertMaterial({
				color: Math.sin(i + data.var2) * 0xffffff
			}));
		tube.rotation.y=Math.PI/2;
		var tube2 = tube.clone();
		tube2.rotation.y=-Math.PI/2;
		this.tubeGeo.add(tube2);
		this.tubeGeo.add(tube);
	}

	var zCurve = [];

	// var mat = new THREE.Matrix4();
	// mat.makeRotationX(pi);

	// var latheCurve = new THREE.SplineCurve3(this.curves[this.curves.length - 1]);
	// var lcp = [];
	// for (var i = 0; i < args.curveDetail + 1; i++) {
	// 	lcp.push(latheCurve.getPointAt(i / args.curveDetail));
	// }

	// for (var i = 0; i < lcp.length; i++) {
	// 	var v = lcp[i];
	// 	v.applyMatrix4(mat);
	// 	zCurve.push(v);

	// }

	// var lathe = new THREE.Mesh(
	// new THREE.LatheGeometry(zCurve, 30, 0, this.tubesRotation[1] * 1.8),
	// new THREE.MeshLambertMaterial({
	// 	side: THREE.DoubleSide,
	// 	color: Math.sin(i + data.var3) * 0xffffff
	// }));
	// // lathe.rotation.z=-this.tubesRotation[1]*.9;
	// lathe.rotation.x = -pi;
	// 
	var col = new THREE.Color();
		col.setHSL(noise(data.var3+data.var2*10*(this.curves.length-1/this.curves.length)),1,.6);

	var that = this;
	var lathe = new THREE.Mesh(
	new THREE.ParametricGeometry(
		function(u,v){			
			var mat = new THREE.Matrix4();
			mat.makeRotationY(v*data.var4*Math.PI*2);
			var points = [];//that.curves[that.curves.length - 1];
			for(var i = 0 ; i < that.curves[that.curves.length - 1].length ; i++){
				points.push(that.curves[that.curves.length - 1][i].clone());
				points[i].applyMatrix4(mat);
			}
			var curve = new THREE.SplineCurve3(points);
			return curve.getPointAt(u);
		},
		args.curveDetail,
		args.curveDetail

		),
	new THREE.MeshLambertMaterial({
		side: THREE.DoubleSide,
		color: col
	}));

	latheO = lathe.clone();
	for(var i = 0 ; i < latheO.geometry.faces.length ; i++){
		if(data.var4>0){
			latheO.geometry.vertices[latheO.geometry.faces[i].a].add(latheO.geometry.faces[i].normal.multiplyScalar(.5));
			latheO.geometry.vertices[latheO.geometry.faces[i].b].add(latheO.geometry.faces[i].normal.multiplyScalar(.5));
			latheO.geometry.vertices[latheO.geometry.faces[i].c].add(latheO.geometry.faces[i].normal.multiplyScalar(.5));
		}
		else{
			latheO.geometry.vertices[latheO.geometry.faces[i].a].sub(latheO.geometry.faces[i].normal.multiplyScalar(.5));
			latheO.geometry.vertices[latheO.geometry.faces[i].b].sub(latheO.geometry.faces[i].normal.multiplyScalar(.5));
			latheO.geometry.vertices[latheO.geometry.faces[i].c].sub(latheO.geometry.faces[i].normal.multiplyScalar(.5));
		}

	}
	// 
	// console.log(lathe);


	this.tubeGeo.add(lathe);
	this.tubeGeo.add(latheO);


	// var lathe = new THREE.Mesh(
	// new THREE.ParametricGeometry(


	// 	function(u,v){

			
	// 		var mat = new THREE.Matrix4();
	// 		mat.makeRotationY(v*data.var4*Math.PI*1.8);
	// 		var points = [];//that.curves[that.curves.length - 1];
	// 		for(var i = 0 ; i < that.curves[that.curves.length - 1].length ; i++){
	// 			points.push(that.curves[that.curves.length - 1][i].clone());
	// 			points[i].applyMatrix4(mat);
	// 		}
	// 		var curve = new THREE.SplineCurve3(points);
	// 		var c1 = curve.getPointAt(u);
	// 		if(u>0)
	// 			var c2 = curve.getPointAt(u-.001);
	// 		else
	// 			var c2 = curve.getPointAt(u);

	// 		var c3 = c1.cross(c2);

	// 		return curve.getPointAt(u).add(c3);
	// 	},
	// 	20,
	// 	20

	// 	),
	// new THREE.MeshLambertMaterial({
	// 	side: THREE.DoubleSide,
	// 	color: Math.sin(i + data.var3) * 0xffffff
	// }));

	// tree = new TREE();
	// tree.solidify(lathe.geometry,-1);

	
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

	for (var j = 0; j <= this.steps; j++) {
		var c = [];
		for (var i = 0; i <= this.ctrlSteps; i++) {
			var l = c1.getPointAt(exp(i / this.ctrlSteps));
			var k = c2.getPointAt(exp(i / this.ctrlSteps));
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
			this.ctrlCurves[1][i] = new THREE.Vector3(a.vectors[i].x * .2, a.vectors[i].y * -.2, 0);
		} // console.log(this.ctrlCurves[1]);
	}
	if (b.vectors.length > 0) {

		var diff = (Math.abs(a.vectors[a.vectors.length-1].y-a.vectors[0].y))/2;
		 diff+=a.vectors[0].y;
		// console.log(diff);
		// diff-=a.vectors[0].y;
		this.ctrlCurves[0] = [];
		for (var i = 0; i < b.vectors.length; i++) {
			this.ctrlCurves[0][i] = new THREE.Vector3(b.vectors[i].x * .05, ((b.vectors[i].y * -.05) + diff*-.15), 0);
		} // console.log(this.ctrlCurves[1]);
	}
	// console.log(d.vectors);
	if (d.vectors.length > 0) {
		d.vectors[d.vectors.length-1].y=150;
		this.ctrlCurves[2] = [];
		var off =  Math.min(a.vectors[0].y,a.vectors[a.vectors.length-1].y);
		for (var i = 0; i < d.vectors.length; i++) {
			this.ctrlCurves[2][i] = new THREE.Vector3(d.vectors[i].x * .1, -off*.1+ 12 +((d.vectors[i].y * -.1) ), 0);

		} // console.log(this.ctrlCurves[1]);
	}


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

function exp(t){
	return t*t;
}