function setup() {
    createCanvas(screenWidth, screenHeight);
    noStroke()
    textStyle(BOLD)
    textSize(cellTextSize)

    for (let i = 0; i < startingMines; i++) {
        let x = random(0, gridWidth) | 0
        let y = random(0, gridHeight) | 0
        let m = mines.get(x, y)
        if (m) { i--; continue }
        mines.set(x, y, true)
    }
}

// Model

class Field {
    constructor(defaultValue, outOfBoundsValue) {
        this.data = {}
        this.outOfBoundsValue = outOfBoundsValue
        this.defaultValue = defaultValue
    }
    set(x, y, v) { this.data[x + ',' + y] = v }
    get(x, y) {
        if (x > gridWidth || y > gridHeight || x < 0 || y < 0)
            return this.outOfBoundsValue
        return this.data[x + ',' + y] || this.defaultValue
    }
}

let cellWidth = 30
let gridWidth = window.innerWidth / cellWidth | 0
let gridHeight = window.innerHeight / cellWidth | 0
let screenWidth = cellWidth * gridWidth
let screenHeight = cellWidth * gridHeight
let cellTextSize = (cellWidth * 0.8) | 0
let startingMines = (gridWidth * gridHeight / 10) | 0
let gameEnded = false

let mines = new Field(false, false)
let revealed = new Field(false, true)
let flagged = new Field(false, false)

function countMines(x, y) {
    let sum = 0
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            sum += mines.get(x + dx, y + dy) ? 1 : 0            
        }
    }
    return sum
}

function floodReveal(x, y) {
    let currentDepth = [{x,y}]
    let nextDepth = []
    while (currentDepth.length > 0) {
        let cell = currentDepth.pop()
        
        if (!revealed.get(cell.x, cell.y)) {
            revealed.set(cell.x, cell.y, true)
            if (countMines(cell.x, cell.y) == 0) {
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        nextDepth.push({ x: cell.x + dx, y: cell.y + dy })
                    }
                }
            }
        }

        if (currentDepth.length == 0 ) {
            let tmp = currentDepth
            currentDepth = nextDepth
            nextDepth = tmp
        }
    }
}

// Drawing

let colors = 'blue,green,red,purple,brown,teal,black'.split(',')
function draw() {
    for(let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
            let screenX = x * cellWidth
            let screenY = y * cellWidth

            drawRect(x, y, 200, 200, 200)   
        
            if (gameEnded || revealed.get(x, y)) {
                drawRect(x, y, 170, 170, 170)
                let count = countMines(x, y)
                if (count > 0) {
                    fill(colors[count - 1])
                    text(count, screenX + cellWidth / 2 - cellTextSize / 4, screenY + cellWidth / 2 + cellTextSize / 3)
                }
            } else if (flagged.get(x, y)) {
                fill('white')
                drawCircle(x, y)
            }

            if (gameEnded && mines.get(x, y)) {
                fill(244, 179, 66)
                push()
                stroke(201, 147, 54)
                strokeWeight(2)
                drawCircle(x, y)
                pop()
            }      
        }        
    }
    noLoop()
}

function drawRect(x, y, r, g, b) {
    fill(r, g, b)
    rect(x * cellWidth, y * cellWidth, cellWidth, cellWidth)
    fill(r + 20, g + 20, b + 20)
    rect(x * cellWidth + 1, y * cellWidth + 1, cellWidth - 2, cellWidth - 2)
}

function drawCircle(x, y) {
    ellipse(x * cellWidth + cellWidth / 2, y * cellWidth + cellWidth / 2, cellWidth * 0.7, cellWidth * 0.7)
}

// Input and Logic

function screenToGrid(x) { return x / cellWidth | 0 }
function mousePressed() {
    if (gameEnded) return

    let x = screenToGrid(mouseX)
    let y = screenToGrid(mouseY)
    let mine = mines.get(x, y)

    if (mouseButton == LEFT) {
        if (mine) {
            gameEnded = true
            draw()
            alert('You lost!')
        } else {
            floodReveal(x, y)
            if (won()) {
                gameEnded = true
                draw()
                alert('You won!')
            }
        }
    } else {
        flagged.set(x, y, true)
    }

    draw()
}

function won() {
    for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
            if (!mines.get(x, y) && !revealed.get(x, y))
                return false
        }
    }
    return true
}