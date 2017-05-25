//const
var slipFriction = 0.1;
var rollFriction = 0.01;
//state
var pos, vel, hev, steerAngle;

function setup() {
  createCanvas(800, 800);
  strokeWeight(3);

  pos = createVector(400, 400);
  vel = createVector(0, 0);
  acl = createVector(0, 0);
  hev = createVector(0, 0.1);
  steerAngle = 0;
}

function draw() {

	background(128);

	//dynamics

	if(pos.x > 800)
		pos.x = 0;
	if(pos.y > 800)
		pos.y = 0;
	if(pos.x < 0)
		pos.x = 800;
	if(pos.y < 0)
		pos.y = 800;

	
	if(vel.magSq() > 0){
		hev = vel.copy();
		hev.setMag(0.1);
	}

	pos.add(vel);

	if(keyIsDown(UP_ARROW))
		vel.add(hev);

	if(keyIsDown(LEFT_ARROW))
		steerAngle -= 0.1;

	if(keyIsDown(RIGHT_ARROW))
		steerAngle += 0.1;

	if(steerAngle > Math.PI / 2)
		steerAngle = Math.PI / 2;
	if(steerAngle < -Math.PI / 2)
		steerAngle = -Math.PI / 2;

	steerAngle *= 0.9;

	var steerVec = hev.copy().rotate(steerAngle);

	hev.setMag(20);
	var front = p5.Vector.add(pos, hev)

	//FRICTION
	var frictionFactor = vel.magSq() > 2 ? 1 : vel.mag() * 0.2;
	steerVec.setMag(1);
	hev.setMag(1);

	if(keyIsDown(DOWN_ARROW)){
		vel.sub(p5.Vector.mult(hev, slipFriction * frictionFactor * 2));
	}

	var right = steerVec.copy().rotate(Math.PI / 2.0);

	// stroke(255, 0, 0);
	// vline(front, p5.Vector.add(front, right.copy().mult(10)));
	// stroke(0, 0, 0);

	vel.sub(p5.Vector.mult(right, right.dot(hev) * slipFriction * frictionFactor));
	vel.sub(p5.Vector.mult(hev, rollFriction * frictionFactor));
	//END FRICTION

	//drawing


	steerVec.setMag(10);

	vline(pos, front);
	vline(front, p5.Vector.add(front, steerVec));
}

function vline(a, b){
	line(a.x, a.y, b.x, b.y);
}