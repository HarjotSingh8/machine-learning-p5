let carStart = undefined;
let cars = [];
let sensorDirections = [];
/*
  X --> Left & Right (-ve & +ve)
  Y --> Up & Down (-ve & +ve)
*/
let collDist = 5;
let speedMultiplier = 0.1;
let speed = 10;
let checkingDistance = 50;
let aliveCars = numChildren;
function initSensors() {
  sensorDirections.push(createVector(Math.sin(0), Math.cos(0)));
  sensorDirections.push(createVector(Math.sin(Math.PI), Math.cos(Math.PI)));
  sensorDirections.push(
    createVector(Math.sin(Math.PI / 2), Math.cos(Math.PI / 2))
  );
  sensorDirections.push(
    createVector(Math.sin(-Math.PI / 2), Math.cos(-Math.PI / 2))
  );
  sensorDirections.push(
    createVector(Math.sin(Math.PI / 4), Math.cos(Math.PI / 4))
  );
  sensorDirections.push(
    createVector(Math.sin(-Math.PI / 4), Math.cos(-Math.PI / 4))
  );
}
function initCars() {
  for (let i = 0; i < numChildren; i++) {
    cars.push(new car());
  }
}
function resetCarLocation() {
  for (let i = 0; i < numChildren; i++) {
    cars[i].pos = carStart;
    cars[i].active = true;
  }
}
function nextGenerationCars() {
  nextGeneration();
  resetCarLocation();
}
function drawCars() {}
class car {
  constructor() {
    this.pos = carStart;
    this.rotation = 0;
    this.distance = 0;
    this.force = createVector(0, 0);
    this.sensors = [];
    this.bias = [];
    this.active = true;
    this.ml = new MachineLearning(2, 2, [8, 8]);
    children.push(this.ml);
  }
  calculateML() {
    this.ml.process(this.sensors);
  }
  updatePosition() {
    var d = distance(this.pos, this.force);
    this.dist += d;
    var sp = speed / d;
    this.pos.x += (this.force.x * sp) / 10; //d*sp;
    this.pos.y += (this.force.y * sp) / 10; //d*sp;
    //this.pos+=this.force
  }
  rotate(degree) {
    this.rotation += degree;
    if (this.rotation > 2 * Math.PI) {
      this.rotation = this.rotation % (2 * Math.PI);
    }
    if (this.rotation < 0) {
      this.rotation = 2 * Math.Pi - this.rotation;
    }
  }
  updateForce() {
    this.force.x = 0;
    this.force.y = 0;
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        this.force.x +=
          this.bias[i][j] *
          sensorOffsets[i][0] *
          (this.pos.x - this.sensors[i].x) *
          (this.pos.x - this.sensors[i].x); //this.sensors[i].x;
        this.force.y +=
          this.bias[i][j] *
          sensorOffsets[i][1] *
          (this.pos.y - this.sensors[i].y) *
          (this.pos.y - this.sensors[i].y); //this.sensors[i].y;
        //console.log(this.bias[i][j]);
      }
    }
  }
  updateSensors() {
    this.sensors.length = 0;
    //for(var i=0; i<sensorOffsets.length; i++) {
    this.sensors = checkNearestIntersection(this.pos);
    //console.log(this.sensors);
    //}
  }
  checkColl() {
    for (var i = 0; i < this.sensors.length; i++) {
      if (distance(this.pos, this.sensors[i]) < collDist) {
        this.active = false;
        //console.log('deavticated');
      }
      //ellipse(this.sensors[i].x, this.sensors[i].y, 5, 5)
    }
  }
}

function showCars() {
  noStroke();
  fill(255);
  completedgeneration = true;
  for (var i = 0; i < cars.length; i++) {
    //console.log(cars[i].active);
    //console.log(cars[i].pos)
    //cars[i].updatePosition();
    if (cars[i].active) ellipse(cars[i].pos.x, cars[i].pos.y, 5, 5);
    if (cars[i].active) {
      completedgeneration = false;
    }
  }
  //console.log(cars[0].pos);
  //showSensors()
}

function showSensors() {
  stroke(255);
  for (var i = 0; i < cars.length; i++) {
    //console.log('ran');
    for (var j = 0; j < sensorOffsets.length; j++) {
      if (cars[i].active)
        line(
          cars[i].pos.x,
          cars[i].pos.y,
          cars[i].pos.x + sensorDirections[j].x * 20,
          cars[i].pos.y + sensorOffsets[j].y * 20
        );
    }
  }
}

function checkIntersection(v1, v2, v3, v4) {
  let x1 = v1.x;
  let y1 = v1.y;
  let x2 = v2.x;
  let y2 = v2.y;
  let x3 = v3.x;
  let y3 = v3.y;
  let x4 = v4.x;
  let y4 = v4.y;

  var denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (denominator != 0) {
    //Parallel Lines if denominator=0
    var t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
    var u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      //the ray hit a line
      //var destX = x1+t*(x2-x1)
      //var destY = y1+t*(y2-y1)
      return createVector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
    }
  }
  return false;
}

vector = null;
degree = 0;
function changeVector(degree) {
  vector = createVector(Math.sin(degree), Math.cos(degree));
}
function showVector() {
  if (carStart != null && vector != null) {
    //changeVector();
    //degree += Math.PI / 360;
    stroke(255);
    line(
      carStart.x,
      carStart.y,
      carStart.x + vector.x * 50,
      carStart.y + vector.y * 50
    );
    console.log(carStart, vector);
  }
}

function distance(v1, v2) {
  let a = v1.x - v2.x;
  let b = v1.y - v2.y;
  return Math.sqrt(a * a + b * b);
}
