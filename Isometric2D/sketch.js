var tileSize = 20;
var centerX, centerZ;

function setup() {
	createCanvas(1000, 578);
	noStroke();

	centerX = invProjX(width / 2, height / 2);
	centerZ = invProjZ(width / 2, height / 2);
}

function draw() {
	background(0);

	for(var x = -10; x <= 10; x++){
		for(var z = -10; z <= 10; z++){
			isoCube(x * tileSize + centerX, 0, z * tileSize + centerZ, tileSize + 1, color(250, 250, 255));
		}
	}
}

function drawEdges(){
	push();
		stroke(0);
		line(0, 0, width - 1, 0);
		line(0, height - 1, width - 1, height - 1);
		line(0, 0, 0, height - 1);
		line(width - 1, 0, width - 1, height - 1);
	pop();
}