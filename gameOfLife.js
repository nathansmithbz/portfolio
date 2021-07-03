
function setup() {
  let canvas = createCanvas(500, 500);
  canvas.parent('canvasDiv')
  cellSize = 5;
  frameRate(10);
  //create grid using 2d array to store state of cells
  col = floor(height / cellSize);
  row = floor(width / cellSize);
  cells = new Array(col);
  for (let x = 0; x < col; x++) {
    cells[x] = new Array(row);
    for (let y = 0; y < col; y++) {
      cells[x][y] = new Cell(x, y, cellSize, Math.floor(Math.random() * 2));
    }
  }
  //Add button to reset simulation (often reaches a static state)
  let button = createButton("Reset");
  button.parent("canvasDiv");
  button.position(65, height+20);
  button.addClass("btn btn-primary");
  button.mousePressed(reset);
}
function draw() {
  //Loop through the whole grid -> Draw cell, then check new cell status based on rules
  for (let x = 0; x < row; x++) {
    for (let y = 0; y < col; y++) {
      cells[x][y].display();
      cells[x][y].update(cells);
    }
  }
  //After every cell has been checked update all cells to their new status 
  for (let x = 0; x < row; x++) {
    for (let y = 0; y < col; y++) {
      cells[x][y].nextItteration();
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

  //draw cells based on state of cell  -> alive = 1 (black), dead = 0 (white)
  display() {
    if (this.state == 1) {
      fill(0);
    } else {
      fill(255);
    }
    rect(this.x * this.size, this.y * this.size, this.size, this.size);
  }

  //Sum number of alive neighbours 
  sumNeighbours(arr) {
    let neighbours = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        //Use Modulus -> left hand neighbours of cells on the far left of the grid are considered to be cells on the far right etc
        neighbours += arr[(this.x + i + row) % row][(this.y + j + col) % col].state;
      }
    }
    //remove current cell status before returning as it was included in the previous loop 
    return (neighbours -= this.state);
  }
  
  update(arr) {
    let temp = this.sumNeighbours(arr);
    if (this.state == 1) {
      //When a live cell has fewer than two neighbours, then this cell dies
      if (temp < 2) {
        this.nextState = 0;
      }
      //When a live cell has more than three neighbours, then this cell dies
      else if (temp > 3) {
        this.nextState = 0;
      } 
      //When a live cell has two or three neighbours, then this cell stays alive
      else {
        this.nextState = 1;
      }
    }
    //When an empty position has exactly three neighbouring cells, then a cell is created in this position
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

//On button press, create new 2d array and new cells 
function reset() {
  cells = new Array(col);
  for (let x = 0; x < col; x++) {
    cells[x] = new Array(row);
    for (let y = 0; y < row; y++) {
      cells[x][y] = new Cell(x, y, cellSize, Math.floor(Math.random() * 2));
    }
  }
}
