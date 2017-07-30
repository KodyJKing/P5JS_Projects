var world

function draw() {
    background(30, 70, 80)
    world.draw()
}

function setup() {
    shorthand()
    createCanvas(window.innerWidth, window.innerHeight);

    world = new World()
    world.maxVelocity = 0.1
    let points = world.points

    for (let i = 0; i < 20; i++) {
        let jelly = bell(vec(random(width * 0.25, width * 0.75), random(height)), world)
        for (let pt of jelly.base) {
            let c = chain( add(pt.p, vec(0, 3)), world )
            let d = dist(pt.p, c[0].p)
            world.updates.push( () => springForce(pt, c[0], d, 0.0004) )
        }
        let shift = random(100)
        let shift2 = random(100)
        world.updates.push( () => {
            for (let pt of jelly.pts) pt.bouyancy = Math.sin(performance.now() * 0.0001 + shift) + (Math.sin(performance.now() * 0.002 + shift2) + 0.8) * 0.5
        } )
    }

    world.updates.push( () => {

        for (let i = 0; i < points.length; i++)
            for (let j = i + 1; j < points.length; j++)
                electricRepulsion(points[i], points[j], -0.02)

        for (let pt of points) {
            gravity(pt, 0.001)
            drag(pt, 0.95)
            waves(pt, 0.002)
            boundry(pt)
        }


    } )

}