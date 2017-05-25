var sWidth = 500;
var sHeight = sWidth;

var dotCount = 100000;

function setup() {
  createCanvas(sWidth + 1, sHeight + 1);
  
  drawEdges();
  
  for(var i = 0; i < dotCount; i++){
    var a1 = random(0, 2 * Math.PI);
    var a2 = random(0, 2 * Math.PI);
    point(sWidth / 2 + sWidth / 4 * (Math.sin(a1) + Math.sin(a2)), sWidth / 2 + sWidth / 4 * (Math.cos(a1) + Math.cos(a2)));
  }
}

function draw() {
  
}

function drawEdges(){
  line(0, 0, sWidth, 0);
  line(0, sHeight, sWidth, sHeight);
  
  line(0, 0, 0, sHeight);
  line(sWidth, 0, sWidth, sHeight);
}