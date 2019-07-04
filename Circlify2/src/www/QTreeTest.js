var centerX, centerY;

var q;

function setup() {
  createCanvas(1001, 1001);
  background(255);

  centerX = width / 2;
  centerY = height / 2;

  q = new QTree(0, 0, 1000, 1000);
  for(var i = 0; i < 10000; i++){
    var circle = new Circle(random(0, width), random(0, height), random(10, 30));
    if(!q.doesCollide(circle))
      q.tryAdd(circle);
  }
  q.draw();

  // var cir = new Circle(500, -100, 200);
  // cir.draw()
  // console.log(q.intersects(cir));
}

function draw() {
}