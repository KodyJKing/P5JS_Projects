class Graph {
    
    constructor() {
        this.nodes = []
        this.edges = []
    }

    addNode(node) {
        this.nodes.push(node)
    }

    addEdge(first, second) {
        this.edges.push([first, second])
    }

    update() {

        for ( let i = 0; i < this.nodes.length - 1; i++ ) {
            for ( let j = i + 1; j < this.nodes.length; j++ ) {

                let first = this.nodes[i]
                let second = this.nodes[j]

                first.repel( second, 24 )
                second.repel( first, 23 )

                first.update()
                second.update()
                
            }
        }

        for ( let edge of this.edges) {

            let first = this.nodes[edge[0]]
            let second = this.nodes[edge[1]]

            first.attract( second, 0.008 )
            second.attract( first, 0.008 )

            line( first.pos.x, first.pos.y, second.pos.x, second.pos.y )

            let mid = p5.Vector.add(first.pos, second.pos)
            mid.mult(0.5)

            // push()
            // fill(255, 0, 0)
            // noStroke()
            // ellipse(mid.x, mid.y, 5, 5)
            // pop()

            for ( let node of this.nodes ) {

                let accl = node.repelVec(mid, 6)

                first.vel.add( p5.Vector.mult(accl, -0.5) )
                second.vel.add( p5.Vector.mult(accl, -0.5) )

            }

        }

    }

}