var graph = null

function setup() {

  createCanvas(800, 800)
  let vertices = 7
  graph = new Graph()
  for ( let i = 0; i < vertices; i++ ) graph.addNode(new Node())


  // let edgeSet = {}
  // for ( let i = 0 ; i < vertices * 3; i++ ) {
  // 	let from, to
  // 	from = random(0, vertices) | 0
  // 	to = random(0, vertices) | 0
  // 	let edge = min(from, to) + ", " + max(from, to)
  // 	if (edgeSet[edge] || to == from) { i--; continue}
  // 	edgeSet[edge] = true
  //   graph.addEdge(from, to)
  // }


  for ( let i = 0; i < vertices; i++ ) {
    graph.addEdge(i, (i + 1) % vertices)
    graph.addEdge(i, (i + 2) % vertices)
  }

}

function draw() {
  clear()

  graph.update()

  drawEdges()
}


function drawEdges(){
  line(0, 0, width - 1, 0);
  line(0, height - 1, width - 1, height - 1);
  line(0, 0, 0, height - 1);
  line(width - 1, 0, width - 1, height - 1);
}