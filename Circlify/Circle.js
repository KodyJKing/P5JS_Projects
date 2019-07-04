class Circle {
    constructor( x, y, radius ) {
        this.pos = vec( x, y )
        this.vel = vec( 0, 0 )
        this.radius = radius
    }

    draw( pixels ) {
        push()

        if ( pixels ) {
            let index = ( ( this.pos.y | 0 ) * width + ( this.pos.x | 0 ) ) * 4
            let color = [
                pixels[index],
                pixels[index + 1],
                pixels[index + 2]
            ]

            noStroke()

            // fill( color[0] * 0.7, color[1] * 0.7, color[2] * 0.7 )
            fill( color[0], color[1], color[2] )
            ellipse( this.pos.x, this.pos.y, this.radius * 2.0 )

            // // fill( color[0] * 0.7, color[1] * 0.7, color[2] * 0.7 )
            // fill( color[0], color[1], color[2] )
            // ellipse( this.pos.x, this.pos.y, this.radius * 1.5 )
        } else {
            // console.log("!!!!")
            stroke( 0 )
            noFill()
            ellipse( this.pos.x, this.pos.y, this.radius * 2 )
        }

        pop()
    }

    intersects( other ) {
        var minDist = this.radius + other.radius
        var diff = sub( this.pos, other.pos )
        if ( diff.magSq() < minDist * minDist )
            return true
    }

    contains( pt ) {
        return pt.dist( this.pos ) < this.radius
    }
}