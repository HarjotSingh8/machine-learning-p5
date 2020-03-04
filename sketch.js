let rows;
let cols;
let walls;
let grid;
let source = null;
let destination = null;
let gridSize = 20;
let dist;
let frameCounter = 0;
let runDuration = 300;
let showTrails = true;

function setRunDuration(arg) {
  runDuration = arg;
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  dist = 0;
  tempml = new MachineLearning(5, 2, [8, 8, 8]);
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
  initSensors();
  grid.draw();
}

function draw() {
  frameCounter++;
  if (frameCounter == runDuration && carsInitialised == true) {
    nextGenerationCars();
    frameCounter = 0;
  }
  //background(50);
  //if (solved) noLoop();
  //console.log("running");
  stroke(0);
  //if (carsInitialised == false)
  if (!showTrails) grid.draw();
  if (aliveCars == 0) {
    ("all cars inactive");
    nextGenerationCars();
    frameCounter = 0;
  }
  if (carsInitialised) {
    //for (let i = 0; i < 2; i++)
    showCars();
    //showVector();
    //showSensors();
  }
}
