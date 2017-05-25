function setup(){
	createCanvas(800,800,WEBGL);
	ortho(-width / 2, width / 2, height / 2, - height / 2, 0, 1000);
}

var t = 0;
function draw(){
	background(0, 0, 0);
	directionalLight(255, 255, 255, 1, -1, 1);

	
	//rotate(TAU/8, [1, 0, 0]);
	rotate(-PI / 2, [1, 0, 0]);
	rotate(-Math.atan(Math.sqrt(2)/2), [1, 0, 0]);
	rotate(-TAU/8, [0, 0, 1]);

	for(var x = 0; x < 4; x++){
		ambientMaterial(255 - x * 51, x * 51, 0)
		box(100, 100, 100);
		translate(0, 0, 100);
	}
}