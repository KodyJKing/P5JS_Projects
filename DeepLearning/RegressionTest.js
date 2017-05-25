var problem, modelPlot, examples, shape;

function setup() {
	createCanvas(800, 800);

	examples = [];
	for(var i = -20; i <= 20; i += 1)
		examples.push([[i], [i < -2 ? -9 : i > 2 ? -9 : 9]]);

	shape = [1, 5, 1];

	problem = {
		// The time dependant loss leads the algorithm to spend more time exploring.
		loss : (x) => meanSquareError(shape, x, examples) * (1 + L1Error(x) * 10 * (1 + Math.sin(Date.now() / 200))),
		rate : 1,
		state : buildFFN(shape, 1),
		gradientSteps : 10,
		friction : 0.5,
		cooling : 0.99,
		rateGain : 1.5,
		rateLoss : 0.5
	};

	modelPlot = {
		func : (x) => evalFFN(shape, problem.state, [x])[0],
		points : examples,
		samples : width,
		screenBox : {x : 0, y : 200, w : width - 1, h : height - 1 - 200},
		box : {x : -10, y : -10, w : 20, h : 20}
	};

	lossPlot = {
		data : zeroVector(100),
		screenBox : {x : 0, y : 0, w : width - 1, h : 200},
		box : {y : 0, h : 100}
	};
}

function draw() {
	adaptiveSPSAStep(problem);
	// coolingSPSAStep(problem);
	// velocitySPSAStep(problem);

	lossPlot.data.shift();
	lossPlot.data.push(problem.loss(problem.state));

	background(255);

	drawBox(modelPlot);
	plotPoints(modelPlot);
	plotFunc(modelPlot);

	drawBox(lossPlot);
	plotArray(lossPlot);
}