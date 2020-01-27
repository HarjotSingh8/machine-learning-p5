
function setup() {
  createCanvas(600, 600);
  frameRate(30);

  createPath(); //comment this if using mouse input for path
  carStart = createVector(100,200) // and this too
  repelstart()
  prepareMl();
}

function draw() {
  background(50);
  if(preparing) {
    drawVertices();
    showCars();
  }
  else {
    repel();
    drawVertices();
    learning();
    showCars();
  }
}
