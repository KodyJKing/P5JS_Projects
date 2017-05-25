function zeroVector(length){
	var result = new Array(length);
	for(var i = 0; i < length; i++)
		result[i] = 0;
	return result;
}

function magnitudeSq(vec){
	var sum = 0;
	for(var i = 0; i < vec.length; i++){
		sum += vec[i] * vec[i];
	}
	return sum;
}

function L1Mag(vec){
	var sum = 0;
	for(var i = 0; i < vec.length; i++){
		sum += Math.abs(vec[i]);
	}
	return sum;
}

function add(a, b){
	result = new Array(a.length);
	for(var i = 0; i < a.length; i++)
		result[i] = a[i] + b[i];
	return result;
}

function sub(a, b){
	result = new Array(a.length);
	for(var i = 0; i < a.length; i++)
		result[i] = a[i] - b[i];
	return result;
}

function mul(a, b){
	result = new Array(a.length);
	for(var i = 0; i < a.length; i++)
		result[i] = a[i] * b;
	return result;
}

function div(a, b){
	result = new Array(a.length);
	for(var i = 0; i < a.length; i++)
		result[i] = a[i] / b;
	return result;
}

function addV(a, b){
	for(var i = 0; i < a.length; i++)
		a[i] += b[i];
}

function subV(a, b){
	for(var i = 0; i < a.length; i++)
		a[i] -= b[i];
}

function mulV(a, b){
	for(var i = 0; i < a.length; i++)
		a[i] *= b;
}

function divV(a, b){
	for(var i = 0; i < a.length; i++)
		a[i] /= b;
}

function dot(a, b){
	var sum = 0;
	for(var i = 0; i < a.length; i++){
		sum += a[i] * b[i];
	}
	return sum;
}

//Test functions

function linear(v){return Math.abs(v[0] - width / 2) + Math.abs(v[1] - height / 2)};
function quadratic(v){return magnitudeSq([v[0] - width / 2, v[1] - height / 2])};