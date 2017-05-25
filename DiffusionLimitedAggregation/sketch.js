var h = 100;
var w = 100;
var cellSize = 5;
var diameter = cellSize;

var sHeight = cellSize * h;
var sWidth = cellSize * w;
var centerY = sHeight / 2.0;
var centerX = sWidth / 2.0;

var atom;
var grid;
var finished;

function setup() {
  createCanvas(h * cellSize + 1, w * cellSize + 1);
  grid = [];
  for(var i = 0; i < h * w; i++)
     grid.push([]);
  atoms = [];
  
  atom = createAtom(centerX, centerY);
  freeze(atom);
  atom = createAtom();
  
  background(0);
  stroke(150, 200, 255);
  drawEdges();
  noStroke();
}

function draw() {
  if(finished)
     return;
  for(var i = 0; i < 10000; i++){
    var obst = checkCollision();
    if(obst != null){
      line(atom.x, atom.y, obst.x, obst.y);
      ellipse(atom.x, atom.y, diameter);
      freeze(atom);
      var tries = 0;
      while(checkCollision() != null){
        atom = createAtom();
        tries++;
        if(tries > 20)
        {
          finished = true;
          return;
        }
      }
    }
    var step = p5.Vector.random2D();
    step.mult(diameter);
    atom.add(step);
    atom.x = constrain(atom.x, 0, sWidth);
    atom.y = constrain(atom.y, 0 , sHeight);
  }
}

function drawGrid(){
  clear();
  for(var x = 0; x <= w; x++){
    line(x * cellSize, 0, x * cellSize, sHeight);
  }
  for(var y = 0; y <= h; y++){
    line(0, y * cellSize, sWidth, y * cellSize);
  }
}

function drawEdges(){
  line(0, 0, sWidth, 0);
  line(0, sHeight, sWidth, sHeight);
  
  line(0, 0, 0, sHeight);
  line(sWidth, 0, sWidth, sHeight);
}

function getBin(x, y){
  if(x <  0 || x > w || y < 0 || y > h)
     return null;
  return grid[x + y * w];
}

function freeze(a){
  var x = (a.x / cellSize) | 0;
  var y = (a.y / cellSize) | 0;
  
  var bin = getBin(x, y);
  if(bin != null)
     bin.push(a);
}

function checkCollision(){
  var x = (atom.x / cellSize) | 0;
  var y = (atom.y / cellSize) | 0;
  
  for(var dx = -1; dx <= 1; dx++){
      for(var dy = -1; dy <= 1; dy++){
        var bin = getBin(x + dx, y + dy);
        if(bin == null)
           continue;
        for(var a of bin){
          if(a.dist(atom) < diameter)
             return a;
        }
      }
  }
  return null;
}

function createAtom(x, y){
  // var side = random(0, 4);
  var rx, ry;
  // if(side < 2){
  //   rx = random(0, sWidth);
  //   ry = side <= 1 ? 0 : sHeight;
  // } else {
  //   ry = random(0, sHeight);
  //   rx = side <= 3 ? 0 : sWidth;
  // }
  rx = width - 10;
  ry = height - 10;
  var a = createVector(x || rx, y || ry);
  return a;
}