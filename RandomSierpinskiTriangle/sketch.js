var h = Math.sqrt(3)/2;

function setup() {
  var w = 1000;
  createCanvas(w, w * h);
  
  drawEdges();
}

function draw() {
	for(var i = 0; i < 100; i++)
		recur(0, 0, width / 2);
}

function drawEdges(){
  line(0, 0, width - 1, 0);
  line(0, height - 1, width - 1, height - 1);
  line(0, 0, 0, height - 1);
  line(width - 1, 0, width - 1, height - 1);
}

function recur(x, y, width){
	if(width < 0.5){
		point(x, y);
		return;
	}
	var r = random(0, 3) | 0;
	if(r == 0)
		recur(x, y, width / 2);
	else if(r == 1)
		recur(x + width, y, width / 2);
	else
		recur(x + width / 2, y + width * h, width / 2);
}