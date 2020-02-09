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
      return this.grid[floor((y / windowHeight) * rows)][
        floor((x / windowWidth) * cols)
      ];
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
    this.xpos = (windowWidth / cols) * i;
    this.ypos = (windowHeight / rows) * j;
    this.source = false;
    this.path = false;
    this.distance = Infinity;
    this.prevNode = null;
    this.walls = [];
    this.neighbors = [];
    this.initWalls();
  }
  initWalls() {
    this.walls = [];
    this.walls.push([
      createVector(this.xpos, this.ypos),
      createVector(this.xpos + gridSize, this.ypos)
    ]);
    this.walls.push([
      createVector(this.xpos, this.ypos),
      createVector(this.xpos, this.ypos + gridSize)
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
    ]);
  }
  showWalls() {
    stroke(255);
    for (let i = 0; i < this.walls.length; i++) {
      line(
        this.walls[i][0].x,
        this.walls[i][0].y,
        this.walls[i][1].x,
        this.walls[i][1].y
      );
    }
    stroke(0);
  }
  draw() {
    if (this.source) fill(255, 0, 0);
    //color for source
    else if (this.destination) fill(0, 255, 0);
    //color for destination
    else if (this.visited) fill(200, 200, 200);
    else if (this.path) fill(255, 255, 255);
    //color for path
    else fill(50, 50, 50); //color for wall
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
}
