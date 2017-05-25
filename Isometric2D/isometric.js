var cos30, sin30, invCos30, invSin30;

cos30 = Math.cos(2 * Math.PI / 12);
sin30 = Math.sin(2 * Math.PI / 12);
invCos30 = 1 /  cos30;
invSin30 = 1 / sin30;

function projX(x, z){
	return cos30 * (x - z);
}

function projY(x, y, z){
	return y + sin30 * (x + z);
}

function proj(v3){
	return createVector(projX(v3.x, v3.z), projY(v3.x, v3.y, v3.z));
}

function invProjX(x, y){
	return (x * invCos30 + y * invSin30) * 0.5;
}

function invProjZ(x, y){
	return - (x * invCos30 - y * invSin30) * 0.5;
}

function invProj(v3){
	return createVector(invProjX(v3.x, v3.y), 0, invProjZ(v3.x, v3.y));
}

function isoPoint(x, y, z){
	point(projX(x, z), projY(x, y, z));
}

function isoCube(x, y, z, size, c){
	c = c || color(255, 255, 255);

	var p = proj(createVector(x, y, z));

	fill(c);
	//stroke(c);

	quad(
		p.x               , p.y,
		p.x + size * cos30, p.y - size * sin30,
		p.x               , p.y - 2 * size * sin30,
		p.x - size * cos30, p.y - size * sin30
	); //Upper quad.

	fill(red(c) * 0.7, green(c) * 0.7, blue(c) * 0.7);
	//stroke(red(c) * 0.7, green(c) * 0.7, blue(c) * 0.7);

	quad(
		p.x               , p.y,
		p.x + size * cos30, p.y - size * sin30,
		p.x + size * cos30, p.y + size * sin30,
		p.x               , p.y + 2 * size * sin30
	); //Right quad.

	fill(red(c) * 0.5, green(c) * 0.5, blue(c) * 0.5);
	//stroke(red(c) * 0.5, green(c) * 0.5, blue(c) * 0.5);

	quad(
		p.x               , p.y,
		p.x - size * cos30, p.y - size * sin30,
		p.x - size * cos30, p.y + size * sin30,
		p.x               , p.y + 2 * size * sin30
	); //Left quad.
}