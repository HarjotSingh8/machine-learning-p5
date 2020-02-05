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
  overbox() {
    /*
     * this function checks if the mouse was present over a box when it was pressed
     * mouseX returns x co-ordinate of mouse
     * mouseY returns y co-ordinate of mouse
     * mouse co-ordinates are computed to get the box in which the mouse currently exists in
     */
    console.log(
      floor((mouseX / windowWidth) * cols) +
        "," +
        floor((mouseY / windowHeight) * rows)
    );
    if (
      mouseX > 0 &&
      mouseX < windowWidth &&
      mouseY > 0 &&
      mouseY < windowWidth
    )
      return this.grid[floor((mouseY / windowHeight) * rows)][
        floor((mouseX / windowWidth) * cols)
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
    this.path = false;
    this.source = false;
    this.destination = false;
    this.distance = Infinity;
    this.prevNode = null;
    this.visited = null;
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
