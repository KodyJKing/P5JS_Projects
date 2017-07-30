function springForce(a, b, length, force) {
    let diff = sub(b.p, a.p)
    let d = dist(b.p, a.p)
    let displacement = d - length
    diff.setMag(displacement * force)
    a.a.add(diff)
    b.a.sub(diff)
}

function electricRepulsion(a, b, force) {
    let diff = sub(b.p, a.p)
    let d = dist(b.p, a.p)
    diff.setMag(force / (d * d) )
    a.a.add(diff)
    b.a.sub(diff)
}

function gravity(a, force) {
    a.a.y += force
}

function drag(a, ratio) {
    a.v.mult(ratio)
}

function clampVelocity(a, limit) {
    a.v.limit(limit)
}

function waves(a, force) {
    a.a.x += 
        Math.sin(performance.now() * 0.001) * force
        + Math.sin(performance.now() * 0.002) * force * 0.5
        + Math.sin(performance.now() * 0.004) * force * 0.25
}