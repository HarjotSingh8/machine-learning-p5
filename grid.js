let pathcolor;
let wallcolor;
let routecolor;
let sourcecolor;
let destinationcolor;
let visitedcolor;
class Grid {
  /*
   * This class contains grid data
   */
  constructor(rows, cols) {
    this.grid = [];
    for (let j = 0; j < rows; j++) {
      this.grid[j] = [];
      for (let i = 0; i < cols; i++) {
        this.grid[j][i] = new Node(i, j);
      }
    }
  }
  overbox(x, y) {
    /*
     * this function checks if the co-ordinates passed are present inside a box
     * entered co-ordinates are computed to get the box in which the mouse currently exists in
     */
    //console.log(floor((x / windowWidth) * cols) + "," + floor((y / windowHeight) * rows));
    if (x > 0 && x < windowWidth && y > 0 && y < windowHeight)
      return this.grid[floor(y / gridSize)][floor(x / gridSize)];
    return false;
  }
  draw() {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        this.grid[i][j].draw();
        //console.log("drawing");
      }
    }
  }
}

class Node {
  /*
   * This class is used for boxes in the grid
   */
  constructor(i, j) {
    this.x = i;
    this.y = j;
    this.xpos = gridSize * i;
    this.ypos = gridSize * j;
    this.source = false;
    this.path = false;
    this.distance = 0;
    this.prevNode = null;
    this.neighbors = [];
    this.walls;
    this.initWalls();
    this.createWalls();
  }
  initWalls() {
    /*this.walls = [];
    this.walls.push([
      createVector(this.xpos, this.ypos),
      createVector(this.xpos + gridSize, this.ypos)
    ]);
    this.walls.push([
      createVector(this.xpos, this.ypos),
      createVector(this.xpos, this.ypos + gridSize)
    ]);
    this.walls.push([
      createVector(this.xpos + gridSize, this.ypos),
      createVector(this.xpos + gridSize, this.ypos + gridSize)
    ]);
    this.walls.push([
      createVector(this.xpos, this.ypos + gridSize),
      createVector(this.xpos + gridSize, this.ypos + gridSize)
    ]);*/
    this.left = [
      createVector(this.xpos, this.ypos),
      createVector(this.xpos, this.ypos + gridSize)
    ];
    this.right = [
      createVector(this.xpos + gridSize, this.ypos),
      createVector(this.xpos + gridSize, this.ypos + gridSize)
    ];
    this.up = [
      createVector(this.xpos, this.ypos),
      createVector(this.xpos + gridSize, this.ypos)
    ];
    this.down = [
      createVector(this.xpos, this.ypos + gridSize),
      createVector(this.xpos + gridSize, this.ypos + gridSize)
    ];
  }
  createWalls() {
    this.walls = [];
    if (this.left) this.walls.push(this.left);
    if (this.right) this.walls.push(this.right);
    if (this.up) this.walls.push(this.up);
    if (this.down) this.walls.push(this.down);
  }
  updateWalls(box) {
    //this.initWalls();
    if (this.x == box.x) {
      if (this.y > box.y) {
        //down
        this.up = null;
      }
      if (this.y < box.y) {
        //up
        this.down = null;
      }
    }
    if (this.y == box.y) {
      if (this.x > box.x) {
        //right
        this.left = null;
      }
      if (this.x < box.x) {
        //left
        this.right = null;
      }
    }
    this.createWalls();
    console.log(this.walls);
  }
  showWalls() {
    stroke(0);
    /*for (let i = 0; i < this.walls.length; i++) {
      line(
        this.walls[i][0].x,
        this.walls[i][0].y,
        this.walls[i][1].x,
        this.walls[i][1].y
      );
    }*/
    stroke(0, 0, 255);
    strokeWeight(1);
    for (let i = 0; i < this.walls.length; i++) {
      line(
        this.walls[i][0].x,
        this.walls[i][0].y,
        this.walls[i][1].x,
        this.walls[i][1].y
      );
    }
  }
  draw() {
    stroke(50);
    if (this.source) {
      fill(255, 0, 0);
      rect(this.xpos, this.ypos, gridSize, gridSize);
      this.showWalls();
      return;
    }
    //color for source
    else if (this.destination) fill(0, 255, 0);
    //color for destination
    else if (this.visited) fill(200, 200, 200);
    else if (this.path) {
      fill(255, 255, 255);
      rect(this.xpos, this.ypos, gridSize, gridSize);
      this.showWalls();
      return;
    }
    //color for path
    else fill(50, 50, 50); //color for wall
    noStroke();
    rect(this.xpos, this.ypos, gridSize, gridSize);
  }
  drawroute() {
    fill(0, 200, 0);
    rect(this.xpos, this.ypos, gridSize, gridSize);
  }
  drawpath() {
    fill(200, 200, 200);
    rect(this.xpos, this.ypos, gridSize, gridSize);
  }
  returnNeighbors() {
    //console.log(this.x + "," + this.y);
    let arr = [];
    if (this.x > 0 && grid.grid[this.y][this.x - 1].path == true) {
      arr.push(grid.grid[this.y][this.x - 1]);
    }
    if (this.x < cols - 1 && grid.grid[this.y][this.x + 1].path == true) {
      arr.push(grid.grid[this.y][this.x + 1]);
    }
    if (this.y > 0 && grid.grid[this.y - 1][this.x].path == true) {
      arr.push(grid.grid[this.y - 1][this.x]);
    }
    if (this.y < rows - 1 && grid.grid[this.y + 1][this.x].path == true) {
      arr.push(grid.grid[this.y + 1][this.x]);
    }
    return arr;
  }
}

class Walls {
  constructor(box) {
    this.box = box;
  }
  removeWall() {}
  drawWalls() {
    stroke(0, 0, 255);
    strokeWeight(1);
    for (let i = 0; i < this.walls.length; i++) {
      line(
        this.walls[i][0].x,
        this.walls[i][0].y,
        this.walls[i][1].x,
        this.walls[i][1].y
      );
    }
  }
}
