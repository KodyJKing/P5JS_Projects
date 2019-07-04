function setup() {
    createCanvas( 800, 480 );
    createCanvas( 800, 500 );

    drawEdges();
}

function draw() {
}

function drawEdges() {
    line( 0, 0, width - 1, 0 );
    line( 0, height - 1, width - 1, height - 1 );
    line( 0, 0, 0, height - 1 );
    line( width - 1, 0, width - 1, height - 1 );
}