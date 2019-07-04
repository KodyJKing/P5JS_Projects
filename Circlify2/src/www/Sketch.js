var centerX, centerY

var A, B

var circles = []
var qtree

var DEBUG = false

var imageData
var detailInfo

var r = 1
var R = 200

var imageScale = 1
var entropyTolerance = 2
var magnetism = 1.01

var bg = 100

function setup() {
    createCanvas( img.width * imageScale, img.height * imageScale )
    background( bg )
    noFill()

    initImage()

    centerX = width / 2;
    centerY = height / 2;

    qtree = new QTree( 0, 0, width, height )

    A = new Circle( centerX - r, centerY, r )
    B = new Circle( centerX + r, centerY, r )

    addCircle( A )
    addCircle( B )
}

function initImage() {
    let canvas = document.createElement( "canvas" )
    canvas.width = width
    canvas.height = height
    let ctx = canvas.getContext( "2d" )
    ctx.scale( imageScale, imageScale )
    ctx.drawImage( img, 0, 0 )
    imageData = ctx.getImageData( 0, 0, width, height )
    detailInfo = new DetailInfo( imageData )
}

function draw() {
    for ( var i = 0; i < 10000; i++ ) {
        if ( pairs.length == 0 ) {
            noLoop()
            break
        }
        generateCircle()
    }
    if ( DEBUG )
        qtree.draw()
}

function neighborCircles( xRadius, y, z ) {
    //The tangent circles x, y and z form a triangle.
    //The legs of the triangle are a, b and c.
    //C is the angle opposite of c.
    //It is also the angle from y to x.

    var a = y.pos.dist( z.pos )
    var b = xRadius + y.radius
    var c = xRadius + z.radius

    var cosAngle = ( a * a + b * b - c * c ) / ( 2 * a * b )  //The value of cos(C) by the Law of Cosines.
    var sinAngle = Math.sqrt( 1 - cosAngle * cosAngle )

    var heading = sub( z.pos, y.pos )
    heading.normalize()
    var right = vec( -heading.y, heading.x )

    var relRight = add(
        mul( heading, cosAngle * b ),
        mul( right, sinAngle * b )
    )

    var relLeft = add(
        mul( heading, cosAngle * b ),
        mul( right, sinAngle * -b )
    )

    return [
        new Circle( relRight.x + y.pos.x, relRight.y + y.pos.y, xRadius ),
        new Circle( relLeft.x + y.pos.x, relLeft.y + y.pos.y, xRadius )
    ];
}

function detail( pos, radius ) {
    let x = Math.round( pos.x )
    let y = Math.round( pos.y )
    let r = Math.round( radius )

    return detailInfo.detailInBox( x, y, r )
}

function generateCircle() {
    const maxEntropy = 100000 * 0.5

    let pairNum = random( 0, pairs.length ) | 0
    let pair = pairs[ pairNum ]
    let side = pair.pickSide()

    let low = r
    let high = R
    let radius
    let circle

    for ( let i = 0; i < 20; i++ ) {
        radius = ( low + high ) / 2
        let n = neighborCircles( radius, pair.a, pair.b )
        circle = n[ side ]
        let d = detail( circle.pos, radius )
        if ( d > maxEntropy || qtree.doesCollide( circle, 1 ) || oob( circle.pos ) )
            high = radius
        else
            low = radius
    }

    radius = low
    circle = neighborCircles( radius, pair.a, pair.b )[ side ]
    if ( !qtree.doesCollide( circle, 1 ) )
        addCircle( circle )
    else
        failPair( pairNum, side )

}

function addCircle( circle ) {
    qtree.tryAdd( circle )

    var scanCircle = new Circle( circle.pos.x, circle.pos.y, circle.radius * magnetism )
    var nearContacts = []
    qtree.contacts( scanCircle, nearContacts )

    for ( var contact of nearContacts )
        addPair( new Pair( circle, contact ) )

    circle.draw()
}

function oob( a ) {
    return a.x < 0 || a.x >= width || a.y < 0 || a.y >= height
}