var tasks, taskHeight, flagHeight, flagWidth, startHeight
var orderForce = 0.05
var friction = 0.97

function randColor() {
  return [random(255), random(255), random(255)]
}

function setup() {
  createCanvas(1900, 480);
  tasks = []
  for(let i = 0; i < 15; i++) tasks.push({x: random(width), v: 0, w: random(50, 100), c:randColor()})

  taskHeight = 20
  flagHeight = 15
  flagWidth = 5
  startHeight = (height - taskHeight) / 2
}

function drawEdges(){
  line(0, 0, width - 1, 0);
  line(0, height - 1, width - 1, height - 1);
  line(0, 0, 0, height - 1);
  line(width - 1, 0, width - 1, height - 1);
}

function draw() {
  clear()
  for(let i = 0; i < 5; i++) update()
  for(var task of tasks) {
    push()
      noStroke()
      fill(task.c)
      rect(task.x, startHeight, task.w, taskHeight)
      rect(task.x, startHeight - flagHeight, flagWidth, flagHeight)
    pop()
  }
  drawEdges();
}

function update() {
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i]
    let pre = tasks[i - 1]
    if (pre != null)
      orderSpring(pre, task)
    if (i == 0) {
      task.x = 50
    } else {
      task.x += task.v
      task.v *= friction
    }
  }
}

function orderSpring(pre, post) {
  let attractionPoint = pre.x + pre.w
  let force = (attractionPoint - post.x) * orderForce
  post.v += force
  pre.v -= force
}