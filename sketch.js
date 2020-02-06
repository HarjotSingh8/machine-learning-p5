let rows;
let cols;
let walls;
let grid;
let source = null;
let destination = null;
let gridSize = 20;
function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(10);
  rows = floor(windowHeight / gridSize);
  cols = floor(windowWidth / gridSize);
  grid = new Grid(rows, cols);
  pathcolor = color(150, 150, 150);
  wallcolor = color(0, 0, 0);
  routecolor = color(0, 200, 0);
  sourcecolor = color(200, 0, 0);
  destinationcolor = color(0, 0, 200);
  visitedcolor = color(255, 255, 255);
  strokeWeight(1);
  grid.draw();
}

function draw() {
  //background(50);
  //if (solved) noLoop();
  //console.log("running");
  if (aliveCars == 0) {
    nextGenerationCars();
  }
  showCars();
}
