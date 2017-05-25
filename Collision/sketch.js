function setup() {
  createCanvas(800, 800);
}

function draw() {
	background(255);

	LCCTest();
	//LLCTest();
	//SSCTest();

	drawEdges();
}

function drawEdges(){
  line(0, 0, width - 1, 0);
  line(0, height - 1, width - 1, height - 1);
  line(0, 0, 0, height - 1);
  line(width - 1, 0, width - 1, height - 1);
}

function add(a, b){
  return p5.Vector.add(a, b);
}

function sub(a,b){
	return p5.Vector.sub(a, b);
}

function mul(a, b){
  return p5.Vector.mult(a, b);
}

function div(a, b){
  return p5.Vector.mult(a, 1 / b);
}

function vec(x, y){
	return createVector(x, y);
}

function cross(a, b){
	return a.x * b.y - a.y * b.x;
}

function dot(a, b){
	return a.x * b.x + a.y * b.y;
}

function normalized(a){
	return div(a, a.mag());
}

function right(a){
	return vec(-a.y, a.x);
}

function lineCircleCollision(p, v, s, r){
	var vn = normalized(v);
	var toCircle = sub(s, p);

	var ySq = cross(vn, toCircle);
	ySq = ySq * ySq;
	var xSq = r * r - ySq;
	if(xSq < 0)
		return null;
	var x = Math.sqrt(xSq);

	var length = dot(vn, toCircle) - x;

	return add(p, mul(vn, length));
}

function LCCTest(){
	var circlePos = vec(width / 2, height / 2);
	var radius = 100;

	ellipse(circlePos.x, circlePos.y, radius * 2);

	var start = vec(700, 700);
	var mousePos = vec(mouseX, mouseY);
	var toMouse = sub(mousePos, start);
	var end = add(start, toMouse);

	line(start.x, start.y, end.x, end.y);

	var hit = lineCircleCollision(start, toMouse, circlePos, radius);

	if(hit != null)
		ellipse(hit.x, hit.y, 10);
}

function lineLineCollisionCollision(a, b, A, B){
	var n = right(A);

	var dist = cross(sub(a, b), A);
	var rate = cross(B, A);
	var time = dist / rate;
	return add(b, mul(B, time));
}

function LLCTest(){
	var start = vec(10, 10);
	var mousePos = vec(mouseX, mouseY);
	var toMouse = sub(mousePos, start);

	line(start.x, start.y, mousePos.x, mousePos.y);

	var other = vec(50, 200);
	var heading = vec(200, -150);
	var otherEnd = add(other, heading);

	line(other.x, other.y, otherEnd.x, otherEnd.y);

	var hit = lineLineCollisionCollision(start, other, toMouse, heading);

	ellipse(hit.x, hit.y, 10);
}

function segmentSegmentCollision(a0, a1, b0, b1){
	var A = sub(a1, a0);
	var B = sub(b1, b0);

	var n = right(A);

	var dist = cross(sub(a0, b0), A);
	var rate = cross(B, A);

	var time = dist / rate;
	if(time > 1 || time < 0)
		return null;

	var result = add(b0, mul(B, time));
	
	var from0 = sub(result, a0);
	var from1 = sub(result, a1);

	if(dot(from0, from1) > 0)
		return null;

	return result;
}

function SSCTest(){
	var start = vec(10, 10);
	var mousePos = vec(mouseX, mouseY);

	line(start.x, start.y, mousePos.x, mousePos.y);

	var other = vec(100, 600);
	var otherEnd = vec(600, 100);

	line(other.x, other.y, otherEnd.x, otherEnd.y);

	var hit = segmentSegmentCollision(start, mousePos, other, otherEnd);

	if(hit != null)
		ellipse(hit.x, hit.y, 10);
}