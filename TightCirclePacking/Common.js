var vecPool =  []
var vecPoolStide = 2000
var lentVecs = [0]
function vec(x, y, permenant = false){
	if (permenant) return createVector(x, y)
	let v = vecPool[lentVecs[lentVecs.length - 1]]
	if (v === undefined) {
		let start = vecPool.length
		for (let i = 0; i < vecPoolStide; i++) vecPool[start + i] = createVector(0, 0)
		v = vecPool[lentVecs[lentVecs.length - 1]]
	}
	if (x !== undefined) {
		v.x = x;
		v.y = y;
	}
	lentVecs[lentVecs.length - 1]++
	return v
}
function borrowVecs() {
	lentVecs[lentVecs.length] = lentVecs[lentVecs.length - 1]
}
function freeVecs() {
	lentVecs.length--
}

function add(a, b){
	let v = vec()
	v.x = a.x + b.x
	v.y = a.y + b.y
  return v;
}

function sub(a,b){
	let v = vec()
	v.x = a.x - b.x
	v.y = a.y - b.y
	return v;
}

function mul(a, b){
	let v = vec()
	v.x = a.x * b
	v.y = a.y * b
  return v;
}

function rectContains(x, y, w, h, pt){
	return x < pt.x && x + w > pt.x 
			&& y < pt.y && y + h > pt.y;
}

function circleContains(x, y, radius, pt){
	var diff = sub(vec(x, y), pt);
	return diff.magSq() < radius * radius;
}