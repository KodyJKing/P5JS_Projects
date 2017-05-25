var centerX, centerY;

var A, B;

var r = 2;
var R = 20;

var circles = [];
var qtree;

// var DEBUG = true;
var DEBUG = false;

function setup() {
  createCanvas(1920, 1080);
  background(255);
  noFill();

  centerX = width / 2;
  centerY = height / 2;

  qtree = new QTree(0, 0, width, height);

  A = new Circle(centerX - r, centerY, r);
  B = new Circle(centerX + r, centerY, r);

  addCircle(A);
  addCircle(B);
}

function draw() {
  borrowVecs()
  for(var i = 0; i < 2000; i++) {
    generateCircle();
  }
  freeVecs()
  if(DEBUG)
    qtree.draw();
}

function neighborCircles(xRadius, y, z){
  //The tangent circles x, y and z form a triangle.
  //The legs of the triangle are a, b and c.
  //C is the angle opposite of c.
  //It is also the angle from y to x.

  var a = y.pos.dist(z.pos);
  var b = xRadius + y.radius;
  var c = xRadius + z.radius;

  var cosAngle = (a * a + b * b - c * c) / (2 * a * b);  //The value of cos(C) by the Law of Cosines.
  var sinAngle = Math.sqrt(1 - cosAngle * cosAngle);

  var heading = sub(z.pos, y.pos);
  heading.normalize();
  var right = vec(-heading.y, heading.x);

  var relRight = add(
    p5.Vector.mult(heading, cosAngle * b),
    p5.Vector.mult(right, sinAngle * b)
    );

  var relLeft = add(
    p5.Vector.mult(heading, cosAngle * b),
    p5.Vector.mult(right, sinAngle * -b)
    );

  return [
  new Circle(relRight.x + y.pos.x, relRight.y + y.pos.y, xRadius),
  new Circle(relLeft.x + y.pos.x, relLeft.y + y.pos.y, xRadius)
   ];
}

function generateCircle(){
  var pairNum = random(0, pairs.length) | 0;
  var pair = pairs[pairNum];
  var side = pair.pickSide();
  var radius = random(r, R) + 1;

  while(true){
    borrowVecs()
    radius -= 1;
    if(radius < r)
      break;

      pair = pairs[pairNum];
      var n = neighborCircles(radius, pair.a, pair.b);
      var circle = n[side];

    if(circle.pos.x > width || circle.pos.x < 0 || circle.pos.y > height || circle.pos.y < 0) {freeVecs(); continue;}

    if(qtree.doesCollide(circle)) {freeVecs(); continue;}

    addCircle(circle);

    freeVecs()
    return true;
  }

  failPair(pairNum, side);
  return false;
}

function addCircle(circle){
  qtree.tryAdd(circle);

  var scanCircle = new Circle(circle.pos.x, circle.pos.y, circle.radius * 1.5);
  var nearContacts = [];
  qtree.contacts(scanCircle, nearContacts);

  for(var contact of nearContacts)
    addPair(new Pair(circle, contact));

  circle.draw();
}