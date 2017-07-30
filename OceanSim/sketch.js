var world

function draw() {
    background(30, 70, 80)
    world.draw()
}

function setup() {
    shorthand()
    createCanvas(window.innerWidth, window.innerHeight);

    world = new World()
    // world.debug = true
    let points = world.points

    let chains = []
    for (let i = 0; i < 10; i++) 
        chains.push( chain( vec(width / 2, height / 2), world ) )
    for(let c of chains) c[0].anchored = true

    // bell(vec(width / 2, height / 2), world)

    world.updates.push( () => {

        for (let i = 0; i < points.length; i++)
            for (let j = i + 1; j < points.length; j++)
                electricRepulsion(points[i], points[j], -0.02)

        for (let pt of points) {
            gravity(pt, 0.001)
            drag(pt, 0.98)
            clampVelocity(pt, 0.5)
            waves(pt, 0.001)
        }

    } )

}

function chain(p, world) {
    let pts = []
    for (let i = 0; i < 4; i++) {
        let pt = new Point()
        pt.p = add(p, random2D().mult(10))
        world.points.push(pt)
        pts.push(pt)
    }
    world.updates.push( () => {
        for (let i = 0; i < 3; i++) springForce(pts[i], pts[i + 1], 50, 0.0004)
    } )
    world.renderers.push( () => {
        push()
        noFill()
        strokeWeight(7)
        strokeCap(SQUARE)
        stroke(100, 255, 255, 100)
        bezier(
            pts[0].p.x, pts[0].p.y,
            pts[1].p.x, pts[1].p.y,
            pts[2].p.x, pts[2].p.y,
            pts[3].p.x, pts[3].p.y,
        )
        noStroke()
        fill(100, 100, 200, 100)
        ellipse(pts[3].p.x, pts[3].p.y, 10)
        pop()
    } )
    return pts
}

// function bell(p, world) {
//     let res = 10
//     for (let i = 0; i < res; i++) {

//     }
// }