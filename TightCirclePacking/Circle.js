var circles = [];
class Circle {

  constructor(x, y, radius) {
    this.pos = vec(x, y, true);
    this.radius = radius;
  }

  draw(r, g, b){ 
    if(DEBUG)
      this.drawBasic();
    else
      this.drawVivid();
  }

  drawVivid(){
    push();
    var color = colors[random(0, colors.length) | 0];

    fill(color[0], color[1], color[2]);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
    fill(color[0] * 0.7, color[1] * 0.7, color[2] * 0.7);
    ellipse(this.pos.x, this.pos.y, this.radius * 1.5);
    pop();
  }

  drawBasic(r, g, b){
    if(r === undefined)
    r = 0;

    if(g === undefined)
    g = 0;

    if(b === undefined)
    b = 0;

    push();
    noFill();
    stroke(r, g, b);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
    pop();
  }

  intersects(other){
	var minDist = this.radius + other.radius;

    var diff = sub(this.pos, other.pos);

    if(diff.magSq() < minDist * minDist)
      return true;
  }
  
  contains(pt){
    return pt.dist(this.pos) < this.radius;
  }
}

// var colors = [
//    [255, 179, 179],
//    [121, 166, 210],
//    [13, 26, 38],
//    [26, 51, 0]
// ]

// var colors = [
//    [50, 50, 50],
//    [230, 107, 25],
//    [230, 25, 25],
//    [200, 200, 200],
//    [200, 200, 200],
//    [200, 200, 200],
//    [200, 200, 200]
// ];

var colors = [
   [50, 50, 50],
   [0, 204, 0],
   [230, 230, 230]
];