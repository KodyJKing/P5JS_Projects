function randomGrad(func, value, delta){
	var diff = new Array(value.length);
	var sum = new Array(value.length);
	var perturbation = new Array(value.length);
	for(var i = 0; i < value.length; i++){
		var r = (Math.random() - 0.5) * delta;
		while(Math.abs(r) < 0.1 * delta)
			r = (Math.random() - 0.5) * delta;

		perturbation[i] = r;
		diff[i] = value[i] - r;
		sum[i] = value[i] + r;
	}

	var outDiff = func(sum) - func(diff);
	for(var i = 0; i < value.length; i++)
		perturbation[i] = outDiff / perturbation[i];

	return perturbation;
}

function averageGrad(func, value, delta, count){
	var grad = zeroVector(value.length);
	for(var i = 0; i < count; i++)
		addV(grad, randomGrad(func, value, delta));
	divV(grad, count);

	return grad;
}

function SPSAStep(func, value, delta, rate){
	var grad = randomGrad(func, value, delta);
	for(var i = 0; i < value.length; i++)
		value[i] -= rate * grad[i];

	return grad;
}

function SPSAAveragedStep(func, value, delta, rate, count){
	var grad = averageGrad(func, value, delta, count);
	var mag = Math.sqrt(magnitudeSq(grad));
	if(mag > 0.00001) divV(grad, mag);
	for(var i = 0; i < value.length; i++)
		value[i] -= rate * grad[i];

	return grad;
}

function velocitySPSAStep(problem){
	var grad = averageGrad(
		problem.loss,
		problem.state,
		problem.rate,
		problem.gradientSteps);

	var mag = Math.sqrt(magnitudeSq(grad));
	if(mag > 0.00001) divV(grad, mag);

	 problem.velocity = problem.velocity || zeroVector(grad.length);

	for(var i = 0; i < grad.length; i++){
		problem.velocity[i] *= problem.friction;
		problem.velocity[i] += problem.rate * grad[i];
		problem.state[i] -= problem.velocity[i];
	}
	problem.rate *= problem.cooling;

	return grad;
}

function coolingSPSAStep(problem){
	var grad = SPSAAveragedStep(
		problem.loss, 
		problem.state,
		problem.rate,
		problem.rate, 
		problem.gradientSteps);

	problem.rate *= problem.cooling;

	return grad;
}

function adaptiveSPSAStep(problem){
	// var grad = SPSAAveragedStep(
	// 	problem.loss, 
	// 	problem.state,
	// 	problem.rate,
	// 	problem.rate, 
	// 	problem.gradientSteps);

	var grad = velocitySPSAStep(problem);

	if(problem.lastGradient != null){
		if(dot(grad, problem.lastGradient) < 0.0)
			problem.rate *= problem.rateLoss;
		else
			problem.rate *= problem.rateGain;
	}
	problem.lastGradient = grad;

	if(problem.rate < 0.1)
		rate = 0.1;

	if(problem.rate > 100)
		rate = 100;

	return grad;
}