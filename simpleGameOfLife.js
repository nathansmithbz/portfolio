//let col, row;
let myp5 = new p5(( sketch, simpleCanvasDiv) => {
sketch.setup = () => {
  let canvas = sketch.createCanvas(100, 100);
  canvas.parent('simpleCanvasDiv')
  cellSize = 20;
  sketch.frameRate(5);
  let col = sketch.floor(sketch.height / cellSize);
  let row = sketch.floor(sketch.width / cellSize);
  cells = new Array(col);
  for (let x = 0; x < col; x++) {
    cells[x] = new Array(row);
    for (let y = 0; y < col; y++) {
      cells[x][y] = new Cell(x, y, cellSize, 0);
    }
  }
  cells[1][2].state = 1;
  cells[2][2].state = 1;
  cells[3][2].state = 1;
}

sketch.draw = () => {
  for (let x = 0; x < cells.length; x++) {
    for (let y = 0; y < cells[0].length; y++) {
      cells[x][y].display();
      cells[x][y].update(cells);
    }
  }
  for (let x = 0; x < cells.length; x++) {
    for (let y = 0; y < cells[0].length; y++) {
      cells[x][y].nextItteration();
    }
  }
}

function reset() {
  cells = new Array(col);
  for (let x = 0; x < col; x++) {
    cells[x] = new Array(row);
    for (let y = 0; y < col; y++) {
      cells[x][y] = new Cell(x, y, cellSize, Math.floor(Math.random() * 2));
    }
  }
}

class Cell {
  constructor(x, y, cellSize, state) {
    this.x = x;
    this.y = y;
    this.size = cellSize;
    this.state = state;
    this.nextState = state;
  }

  display() {
    if (this.state == 1) {
      sketch.fill(0);
    } else {
      sketch.fill(255);
    }
    sketch.rect(this.x * this.size, this.y * this.size, this.size, this.size);
  }

  sumNeighbours(arr) {
    let neighbours = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        neighbours +=
          arr[(this.x + i + cells.length) % cells.length][(this.y + j + cells[0].length) % cells[0].length].state;
      }
    }
    return (neighbours -= this.state);
  }
  update(arr) {
    let temp = this.sumNeighbours(arr);
    if (this.state == 1) {
      if (temp < 2) {
        this.nextState = 0;
      } else if (temp > 3) {
        this.nextState = 0;
      } else {
        this.nextState = 1;
      }
    }
    if (this.state == 0) {
      if (temp == 3) {
        this.nextState = 1;
      }
    }
  }
  nextItteration() {
    this.state = this.nextState;
  }
}
});