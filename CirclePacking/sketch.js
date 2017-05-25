var sWidth = 800;
var sHeight = 800;

// colors = [
//     [12, 37, 12]
//    ,[50, 155, 50]
//    ,[25, 75, 25]
// ];

var minRadius = sWidth / 192;
var maxRadius = 0.5 / (1/sWidth + 1/sHeight);

function setup() {
  createCanvas(sWidth, sHeight);
  background(255);
  noStroke();
  colorMode(HSB, width, height, 1);
}

function draw() {
  for(var i = 0; i < 10000; i++)
    tryAdd(new Circle());
}

var circles = [];
function Circle(){
  this.x = random(0, width);
  this.y = random(0, height);
  this.radius = random(minRadius, maxRadius);
}

function tryAdd(cir){
    for(var other of circles){
      var minDist = cir.radius + other.radius;

      var dx = cir.x - other.x;
      var dy = cir.y - other.y;

      var distSq = dx * dx + dy * dy;

      if(distSq < minDist * minDist){ //Check collision, try to shrink circle.
        var dist = Math.sqrt(distSq);
        var newRadius = dist - other.radius;
        if(newRadius < minRadius){
          return;
        }
        cir.radius = newRadius;
      }
    }

  circles.push(cir);
  drawCircle(cir);
}

function drawCircle(circle){
  //var i = random(0, colors.length) | 0;
  //var color = colors[i]
  fill(0 + circle.x / 5, circle.y / 2, 0.9); //fill(color[0], color[1], color[2]);
  ellipse(circle.x, circle.y, circle.radius * 1.9);
  fill(0 + circle.x / 5, circle.y / 2, 1); //fill(color[0] / 2, color[1] / 2, color[2] / 2);
  ellipse(circle.x, circle.y, circle.radius * 1.5);
}