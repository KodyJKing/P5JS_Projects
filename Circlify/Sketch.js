var centerX, centerY

var A, B

var circles = []
var qtree

var t = 0

var DEBUG = false

var imageData
var gradientInfo

var imageScale = 2
var bgColor = 100
var circleCount = 4500

function setup() {
    createCanvas( img.width * imageScale, img.height * imageScale )

    initImage()

    let centerX = width / 2
    let centerY = height / 2

    for ( let i = 0; i < circleCount; i++ )
        circles.push(
            new Circle(
                random( 0, width - 1 ),
                random( 0, height - 1 ),
                1 // random( 10, 30 )
            )
        )
}

function initImage() {
    let canvas = document.createElement( "canvas" )
    canvas.width = width
    canvas.height = height
    let ctx = canvas.getContext( "2d" )
    ctx.scale( imageScale, imageScale )
    ctx.drawImage( img, 0, 0 )
    imageData = ctx.getImageData( 0, 0, width, height )
    gradientInfo = cumulativeGradient( imageData.data, width, height )
}

function draw() {
    background( bgColor )
    // canvas.getContext( "2d" ).putImageData( imgData, 0, 0 )

    // for ( let i = 0; i < 10; i++ )
    update()

    for ( let circle of circles )
        circle.draw( imageData.data )

    if ( DEBUG )
        qtree.draw()
}

function update() {
    const borderRepel = 1
    const contactRepel = 10
    const gradRepel = -0.000001 * 1
    const velocityDecay = 0.9
    const velocityNoise = 5 * 0.99 ** t
    const fudge = 1 * 0.99 ** t

    qtree = new QTree( 0, 0, width, height )

    for ( let circle of circles )
        qtree.tryAdd( circle )

    for ( let circle of circles ) {
        let pos = circle.pos
        let vel = circle.vel
        let radius = circle.radius

        let step = random( 1, 1000 )
        let grad = entropyGradient( pos.x, pos.y, radius, 100 )
        vel.sub( grad.mult( gradRepel / Math.sqrt( step ) ) )

        findIdealRadius( circle, fudge )

        if ( pos.x < 0 ) vel.x += borderRepel
        if ( pos.x >= width ) vel.x += -borderRepel
        if ( pos.x < 0 ) vel.y += borderRepel
        if ( pos.y >= height ) vel.y += -borderRepel

        pos.add( vel )

        pos.x = clamp( pos.x, 0, width - 1 )
        pos.y = clamp( pos.y, 0, height - 1 )

        vel.mult( velocityDecay )

        vel.add(
            vec(
                random( -velocityNoise, velocityNoise ),
                random( -velocityNoise, velocityNoise )
            )
        )

        let contacts = qtree.contacts( circle )
        for ( let other of contacts ) {
            if ( other != circle ) {
                let diff = sub( pos, other.pos ).normalize().mult( contactRepel )
                vel.add( mul( diff, 1 / radius ** 2 ) )
                other.vel.sub( mul( diff, 1 / other.radius ** 2 ) )
            }
        }
    }

    t++
}

function findIdealRadius( circle, fudge ) {
    const maxEntropy = 100000 * 0.5

    let pos = circle.pos
    let low = 2
    let high = 100
    let mid
    for ( let i = 0; i < 10; i++ ) {
        mid = ( low + high ) / 2
        circle.radius = mid * ( 1 - fudge )
        let e = entropy( pos.x, pos.y, mid )
        if ( e > maxEntropy || qtree.doesCollide( circle ) )
            high = mid
        else
            low = mid
    }
    circle.radius = mid
}

function entropy( x, y, r ) {
    x = Math.round( x )
    y = Math.round( y )
    r = Math.round( r )
    return sumGrad( gradientInfo, x, y, r )
}

function entropyGradient( x, y, r, step ) {
    let rvec = vec( random( -1, 1 ), random( -1, 1 ) ).normalize()
    let frontEntropy = entropy( x + rvec.x * step, y + rvec.y * step, r )
    let backEntropy = entropy( x - rvec.x * step, y - rvec.y * step, r )
    let diff = frontEntropy - backEntropy
    rvec.mult( diff )
    return rvec
    // let gradX = entropy( x + step, y, r ) - entropy( x - step, y, r )
    // let gradY = entropy( x, y + step, r ) - entropy( x, y - step, r )
    // return vec( gradX, gradY )
}