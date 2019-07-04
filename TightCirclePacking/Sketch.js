var centerX, centerY

var A, B

var circles = []
var qtree

// var DEBUG = true
var DEBUG = false

var imgData
var cgrad

var r = 2
var mr = 199
var R = 200

var imageScale = 4
var entropyTolerance = 2
var magnetism = 1.5

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

    // noLoop()
}

function initImage() {
    img.crossorigin = ""
    let canvas = document.createElement( "canvas" )
    canvas.width = width
    canvas.height = height
    let ctx = canvas.getContext( "2d" )
    ctx.scale( imageScale, imageScale )
    ctx.drawImage( img, 0, 0 )
    imgData = ctx.getImageData( 0, 0, width, height )

    initCgrad()
}

function initCgrad() {
    let pixels = imgData.data

    cgrad = new Uint32Array( width * height )
    for ( let y = 0; y < height; y++ ) {
        let sum = 0
        for ( let x = 0; x < width; x++ ) {
            let i = ( y * width + x ) * 4
            let j = ( ( y + 1 ) * width + x ) * 4
            let k = ( y * width + x + 1 ) * 4

            for ( let c = 0; c < 3; c++ ) {
                if ( y < height - 1 )
                    sum += ( pixels[ i + c ] - pixels[ j + c ] ) ** 2
                if ( x < width - 1 )
                    sum += ( pixels[ i + c ] - pixels[ k + c ] ) ** 2
            }

            cgrad[ i / 4 ] = sum
        }
    }

    for ( let x = 0; x < width; x++ ) {
        let sum = 0
        for ( let y = 0; y < height; y++ ) {
            let i = y * width + x
            sum += cgrad[ i ]
            cgrad[ i ] = sum
        }
    }
}

function getCgrad( x, y ) {
    x = Math.max( 0, Math.min( x, width - 1 ) )
    y = Math.max( 0, Math.min( y, height - 1 ) )
    return cgrad[ y * width + x ]
}

function sumGrad( x, y, r ) {
    let a = getCgrad( x + r, y + r )
    let b = getCgrad( x - r, y + r )
    let c = getCgrad( x + r, y - r )
    let d = getCgrad( x - r, y - r )
    return a - b - c + d
}

function draw() {
    borrowVecs()
    for ( var i = 0; i < 2000; i++ ) {
        if ( pairs.length == 0 ) {
            noLoop()
            break
        }
        generateCircle()
    }
    freeVecs()
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
        p5.Vector.mult( heading, cosAngle * b ),
        p5.Vector.mult( right, sinAngle * b )
    )

    var relLeft = add(
        p5.Vector.mult( heading, cosAngle * b ),
        p5.Vector.mult( right, sinAngle * -b )
    )

    return [
        new Circle( relRight.x + y.pos.x, relRight.y + y.pos.y, xRadius ),
        new Circle( relLeft.x + y.pos.x, relLeft.y + y.pos.y, xRadius )
    ];
}

function entropy( pos, radius ) {
    if ( false ) {
        let pixels = imgData.data

        let redAv = 0
        let redSqAv = 0
        let greenAv = 0
        let greenSqAv = 0
        let blueAv = 0
        let blueSqAv = 0
        let _r = Math.ceil( radius )

        for ( let dx = -_r; dx < _r; dx++ ) {
            for ( let dy = -_r; dy < _r; dy++ ) {
                let x = Math.round( pos.x ) + dx
                let y = Math.round( pos.y ) + dy
                let index = ( y * width + x ) * 4

                redAv += pixels[ index ]
                greenAv += pixels[ index + 1 ]
                blueAv += pixels[ index + 2 ]

                redSqAv += pixels[ index ] ** 2
                greenSqAv += pixels[ index + 1 ] ** 2
                blueSqAv += pixels[ index + 2 ] ** 2
            }
        }

        let pixCount = width * height

        redAv /= pixCount
        greenAv /= pixCount
        blueAv /= pixCount

        redSqAv /= pixCount
        greenSqAv /= pixCount
        blueSqAv /= pixCount

        let variance = redSqAv + greenSqAv + blueSqAv - redAv ** 2 - greenAv ** 2 - blueAv ** 2

        return variance * pixCount
    }

    let x = Math.round( pos.x )
    let y = Math.round( pos.y )
    let r = Math.round( radius )

    return sumGrad( x, y, r )
}

function generateCircle() {
    var pairNum = random( 0, pairs.length ) | 0
    var pair = pairs[ pairNum ]
    var side = pair.pickSide()
    var radius = random( mr, R ) + 1

    while ( true ) {
        borrowVecs()
        radius -= 2
        if ( radius < r )
            break

        pair = pairs[ pairNum ];
        var n = neighborCircles( radius, pair.a, pair.b )
        var circle = n[ side ]

        let e = entropy( circle.pos, circle.radius )
        // console.log(e)
        // if ( e > 10000000 ) { freeVecs(); continue; }
        if ( e > 100000 * entropyTolerance && radius > r ) { freeVecs(); continue; }

        if ( circle.pos.x > width || circle.pos.x < 0 || circle.pos.y > height || circle.pos.y < 0 ) { freeVecs(); continue; }

        if ( qtree.doesCollide( circle ) ) { freeVecs(); continue; }

        addCircle( circle )

        freeVecs()
        return true
    }

    failPair( pairNum, side )
    return false
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