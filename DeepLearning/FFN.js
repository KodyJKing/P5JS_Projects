var activateOnLastLayer = false;

function evalFFN(shape, params, value){
	var paramInd = 0;

	for(var layerInd = 1; layerInd < shape.length; layerInd++){
		var layerWidth = shape[layerInd];
		var prevLayerWidth = shape[layerInd - 1];

		var output = new Array(layerWidth);

		for(var neuronInd = 0; neuronInd < layerWidth; neuronInd++){
			var input = params[paramInd++]; //Read bias
			for(var weightInd = 0; weightInd < prevLayerWidth; weightInd++)
				input += params[paramInd++] * value[weightInd]; //Read weight
			if(activateOnLastLayer || layerInd < shape.length - 1)
				output[neuronInd] = activation(input)
			else
				output[neuronInd] = input;
		}

		value = output;
	}

	return value;
}

function activation(x){
	//return Math.abs(x);
	//return Math.sin(x);
	// return x < 0 ? 0.01 * x : x;
	return 1 / (1 + Math.exp(-x));
}

function testFFN2D(vec){
	var adjusted = mul(sub(vec, [width / 2, height / 2]), 0.1);
	return evalFFN([2, 1], [1, 1, 1], adjusted)[0];
}

function meanSquareError(shape, params, examples){
	var squareError = 0;
	var count = 0;
	for(var example of examples){
		squareError += magnitudeSq(sub(evalFFN(shape, params, example[0]), example[1]));
	}
	return squareError / examples.length;
}

function autoEncoderMSE(shape, params, examples){
	var squareError = 0;
	var count = 0;
	for(var example of examples){
		squareError += magnitudeSq(sub(evalFFN(shape, params, example), example));
	}
	return squareError / examples.length;
}

function L1Error(params){
	return L1Mag(params) / params.length;
}

function L2Error(params){
	return Math.sqrt(magnitudeSq(params)) / params.length;
}

function paramCount(shape){
	var sum = 0;
	for(var layerInd = 1; layerInd < shape.length; layerInd++)
		sum += (1 + shape[layerInd - 1]) * shape[layerInd];
	return sum;
}

function buildFFN(shape, paramScale){
	var params = new Array(paramCount(shape));
	for(var i = 0; i < params.length; i++)
		params[i] = random(-paramScale, paramScale);
	return params;
}