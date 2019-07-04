var qtree;

function setup() {
  createCanvas(1000, 1000);
  background(255);

  qtree = new QTree(200, 300, 600, 400);
}

function draw() {
  background(255);
  var circle = new Circle(mouseX, mouseY, 100);
  var touch = qtree.intersects(circle);
  circle.draw(touch ? 255 : 0, 0, touch ? 0 : 255);
  qtree.draw();
}