var maxDensity = 10;
var maxDepth = 8;

function QTree(x, y, w, h){
	this.pos = vec(x, y, true);
	this.w = w;
	this.h = h;

	this.circles = [];
	this.children = null;

	this.center = vec(x + w / 2, y + h / 2);

	this.depth = 0;

	this.contains = function(pt){
		return this.pos.x < pt.x && this.pos.x + this.w > pt.x 
			&& this.pos.y < pt.y && this.pos.y + this.h > pt.y;
	}

	this.intersects = function(circle){
		if(!rectContains(
			this.pos.x - circle.radius, this.pos.y - circle.radius, 
			this.w + 2 * circle.radius, this.h + 2 * circle.radius,
			circle.pos
			))
			return false;

		if(rectContains(
			this.pos.x, this.pos.y - circle.radius, 
			this.w, this.h + 2 * circle.radius,
			circle.pos
			))
			return true;

		if(rectContains(
			this.pos.x - circle.radius, this.pos.y, 
			this.w + circle.radius * 2, this.h,
			circle.pos
			))
			return true;

		if(circleContains(this.pos.x,          this.pos.y,          circle.radius, circle.pos))
			return true;

		if(circleContains(this.pos.x + this.w, this.pos.y,          circle.radius, circle.pos))
			return true;

		if(circleContains(this.pos.x,          this.pos.y + this.h, circle.radius, circle.pos))
			return true;

		if(circleContains(this.pos.x + this.w, this.pos.y + this.h, circle.radius, circle.pos))
			return true;

		return false;
	}

	this.tryAdd = function(circle){
		if(!this.intersects(circle))
			return;

		if(this.circles != null){
			this.circles.push(circle);
			if(this.circles.length > maxDensity && this.depth < maxDepth)
				this.split();
			return;
		}

		for(var child of this.children)
			child.tryAdd(circle);
	}

	this.split = function(){
		var halfW = this.w / 2;
		var halfH = this.h / 2;
		this.children = [
			new QTree(this.pos.x,         this.pos.y,         halfW, halfH),
			new QTree(this.pos.x + halfW, this.pos.y,         halfW, halfH),
			new QTree(this.pos.x,         this.pos.y + halfH, halfW, halfH),
			new QTree(this.pos.x + halfW, this.pos.y + halfH, halfW, halfH)
		];

		for(var child of this.children){
			child.depth = this.depth + 1;
			for(var circle of this.circles)
				child.tryAdd(circle);
		}

		this.circles = null;
	}

	this.draw = function(){
		push();
		noFill();
		stroke(100, 100, 255);
		rect(this.pos.x, this.pos.y, this.w, this.h);

		if(this.children != null){
			for(var child of this.children)
				child.draw();
		} else {
			// for(var circle of this.circles)
			// 	circle.draw();
		}
		pop();
	}

	this.doesCollide = function(circle){
		if(!this.intersects(circle))
			return false;

		if(this.children != null){
			for(var child of this.children){
				if(child.doesCollide(circle))
					return true;
			}
			return false;
		}

		for(var other of this.circles){
			if(other.intersects(circle))
				return true;
		}
		return false;
	}

	this.contacts = function(circle, out){
		if(!this.intersects(circle))
			return;

		if(this.children != null){
			for(var child of this.children)
				child.contacts(circle, out);
			return;
		}

		for(var other of this.circles){
			if(other.intersects(circle))
				out.push(other);
		}
	}
}