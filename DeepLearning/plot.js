function plot2D(func){
	push();
	noStroke();

	var vals = [];
	var min = Infinity;
	var max = -Infinity;

	for(var x = 0; x < width; x += cellSize)
	{
		for(var y = 0; y < height; y += cellSize)
		{
			var val = func([x, y]);
			if(val < min)
				min = val;
			if(val > max)
				max = val;
			vals.push(val);
		}
	}

	var i = 0;
	for(var x = 0; x < width; x += cellSize)
	{
		for(var y = 0; y < height; y += cellSize)
		{
			var val = map(vals[i++], min, max, 0, 255);
			var sval = 50;//(1 + Math.sin(val)) * 32;

			fill(Math.max(64 - val, 0) + sval, sval, sval);
			rect(x, y, cellSize, cellSize);
		}
	}

	pop();
}

function plotFunc(options){
	var screenBox = options.screenBox;
	var box = options.box;

	var prevScreenX, prevScreenY;
	for(var sampleX = 0; sampleX < options.samples; sampleX++){
		var x = map(sampleX, 0, options.samples, box.x, box.x + box.w);
		var y = options.func(x);

		var screenX = map(sampleX, 0, options.samples, screenBox.x, screenBox.x + screenBox.w);
		var screenY = map(y, box.y, box.y + box.h, screenBox.y + screenBox.h, screenBox.y);

		if(prevScreenX !== undefined)
			line(prevScreenX, prevScreenY, screenX, screenY);

		prevScreenX = screenX;
		prevScreenY = screenY;
	}
}

function plotPoints(options){
	var screenBox = options.screenBox;
	var box = options.box;

	push();
	noStroke();
	fill(255, 0, 0);

	for(var point of options.points){
		var screenX = map(point[0][0], box.x, box.x + box.w, screenBox.x, screenBox.x + screenBox.w);
		var screenY = map(point[1][0], box.y, box.y + box.h, screenBox.y + screenBox.h, screenBox.y);

		ellipse(screenX, screenY, 5, 5);
	}

	pop();
}

function plotArray(options){
	var screenBox = options.screenBox;
	var box = options.box;

	var data = options.data;

	push();
	fill(0);
	for(var x = 0; x < data.length; x++){
		var screenX = map(x, 0, data.length, screenBox.x, screenBox.x + screenBox.w);
		var screenY = map(data[x], box.y, box.y + box.h, screenBox.y + screenBox.h, screenBox.y);

		var baseScreenY = map(0, box.y, box.y + box.h, screenBox.y + screenBox.h, screenBox.y);

		rect(screenX, screenY, screenBox.w / data.length, baseScreenY - screenY);
	}
	pop();
}

function drawBox(options){
	var box = options.screenBox;

	push()
	noStroke();

	if(options.fillBox){
		fill(255);
		rect(box.x, box.y, box.w, box.h);
	}


	stroke(0);
	line(box.x, box.y, box.x + box.w, box.y);
	line(box.x, box.y + box.h, box.x + box.w, box.y + box.h);

	line(box.x, box.y, box.x, box.y + box.h);
	line(box.x + box.w, box.y, box.x + box.w, box.y + box.h);
	pop();
}