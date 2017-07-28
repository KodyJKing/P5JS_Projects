var tasks, startHeight

var taskCount = 50

var orderForce = 0.8
var friction = 0.7
var orderDiscount = 0.05
var edgeForce = 0.1
var asapForce = 0.05

var stepsPerFrame = 10

var taskHeight = 10
var flagHeight = 15
var flagWidth = 5
var linkWidth = 2

var minTaskWidth = 50
var maxTaskWidth = 100

var maxConnections = 3

function randColor() { 
  return [random(100,255), random(100,255), random(100,255)] 
}

function randomParents(j) {
  let count = random(maxConnections) | 0
  let parents = []
  if (j + 1 == tasks.length) return parents
  for (var i = 0; i< count; i++) {
    let p = floor(random(j + 1, taskCount))
    if (p >= taskCount) p = taskCount - 1
    if (p == j || parents.indexOf(p) > -1) continue
    parents.push(p)
  }
  return parents
}

function randomTask(i) {
  return {
      x: random(0), y: (random(-5, 10) | 0) * taskHeight * 2,
      v: 0, w: random(minTaskWidth, maxTaskWidth),
      c: randColor(), parents: randomParents(i)
    }
}

function setup() {
  createCanvas(1900, 480);
  tasks = []
  for(let i = 0; i < taskCount; i++) tasks.push(randomTask(i))
  startHeight = (height - taskHeight) / 2
}

function drawEdges() {
  line(0, 0, width - 1, 0);
  line(0, height - 1, width - 1, height - 1);
  line(0, 0, 0, height - 1);
  line(width - 1, 0, width - 1, height - 1);
}

function draw() {
  background(30,30,30)
  for(let i = 0; i < stepsPerFrame; i++) update()
  for(var task of tasks) drawTask(task)
  drawEdges();
}

function drawTask(task) {
    push()
      noStroke()
      fill(task.c)
      rect(task.x, task.y + startHeight, task.w, taskHeight)
      rect(task.x, task.y + startHeight - flagHeight, flagWidth, flagHeight)
      for (let p of task.parents) drawLink(tasks[p], task)
    pop()
}

function linkBase(task) {
  return {
    x: task.x,
    y: task.y + startHeight - flagHeight
  }
}

function drawLink(pre, post) {
    let a = linkBase(pre)
    let b = linkBase(post)
    let mid = {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2 - 100
    }
    push()
      strokeCap(SQUARE)
      strokeWeight(linkWidth)
      if (isOrdered(pre,post)) stroke(100, 255, 100)
      else stroke(255, 0, 0)
      noFill()
      bezier(
        a.x + 2, a.y,
        a.x, mid.y,
        b.x, mid.y,
        b.x + 2, b.y
      )
    pop()
}

function isOrdered(pre, post) {
  return pre.x + pre.w <= post.x
}

function update() {
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i]
    applyEdgeForce(task)
    applyAsapForce(task)
    for (var p of task.parents) applyOrderForce(tasks[p], task)
    task.x += task.v
    task.v *= friction
  }
}

function applyOrderForce(pre, post) {
  let attractionPoint = pre.x + pre.w + 10
  let force = (attractionPoint - post.x) * orderForce
  if (attractionPoint <= post.x)
    force *= orderDiscount
  post.v += force
  pre.v -= force
}

function applyEdgeForce(task) {
  if (task.x < 50) {
    task.v += edgeForce
    task.x = 50
  } else if (task.x + task.w > width) {
    task.v -= edgeForce
    task.x = width - task.w
  } 
}

function applyAsapForce(task) {
  task.v -= asapForce
}