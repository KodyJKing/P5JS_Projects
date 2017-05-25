class Node {
    
    constructor() {
        this.pos = createVector(random(0, width), random(0, height))
        this.vel = createVector(randomGaussian(0, 0), randomGaussian(0, 0))
    }

    draw() {
        push()
        strokeWeight(2)
        fill(0,0,0)
        ellipse(this.pos.x, this.pos.y, 10, 10)
        pop()
    }

    update() {

        this.vel.mult(0.95)
        this.vel.y += 0.05

        if (this.pos.x > width || this.pos.x < 0) {
            this.vel.x *= -0.6
            this.pos.x = this.pos.x < 0 ? 0 : width
            this.vel.y *= 0.99
        }

        if (this.pos.y > height || this.pos.y < 0) {
            this.vel.y *= -0.6
            this.pos.y = this.pos.y < 0 ? 0 : height
            this.vel.x *= 0.99
        }

        this.pos.add(this.vel)

        this.draw()
    }

    attract( other, strength ) {
        this.attractVec(other.pos, strength)
    }

    repel( other, strength ) {
        this.repelVec(other.pos, strength)
    }

    attractVec( other, strength ) {
        let diff = p5.Vector.sub( other, this.pos )
        let accl = p5.Vector.mult( diff, strength )
        this.vel.add( accl )
        return accl
    }

    repelVec( other, strength ) {
        let diff = p5.Vector.sub( other, this.pos )
        let accl = p5.Vector.mult( diff, - strength / diff.magSq() )
        this.vel.add( accl )
        return accl
    }

}