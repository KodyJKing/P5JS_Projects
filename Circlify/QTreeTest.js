var centerX, centerY

var q

function setup() {
    createCanvas( 1001, 1001 )
    background( 255 )

    q = new QTree( 0, 0, 1000, 1000 )
    let circles = []
    for ( var i = 0; i < 10000; i++ ) {
        var circle = new Circle( random( 0, width ), random( 0, height ), random( 1, 100 ) )
        if ( !q.doesCollide( circle ) ) {
            q.tryAdd( circle )
            circles.push( circle )
        }
    }

    q.draw()

    for ( let circle of circles )
        circle.draw()

    noLoop()
}

function draw() {
}