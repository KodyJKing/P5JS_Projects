var cellSize = 4;
var problem;
function setup() {
	problem = {
		loss : (v) => quadratic(v) + 100000 * noise(v[0], v[1]), 
		rate : 100,
		state : [random(0, width), random(0, height)],
		gradientSteps : 100,
		friction : 0.5,
		cooling : 0.99
	};

	createCanvas(800, 800);
	plot2D(problem.loss);
	fill(0, 0, 255);
	noStroke();
}

function draw() {

	adaptiveSPSAStep(problem);
	//coolingSPSAStep(problem);
	//velocitySPSAStep(problem);

	ellipse(problem.state[0], problem.state[1], 5);
	console.log(problem);
}

function drawEdges(){
  line(0, 0, width - 1, 0);
  line(0, height - 1, width - 1, height - 1);
  line(0, 0, 0, height - 1);
  line(width - 1, 0, width - 1, height - 1);
}