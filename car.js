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
let carsInitialised = false;
let sensorLength = 20;
function initSensors() {
  sensorDirections.push(0);
  sensorDirections.push(Math.PI / 2);
  sensorDirections.push(-Math.PI / 2);
  sensorDirections.push(Math.PI / 4);
  sensorDirections.push(-Math.PI / 4);
  sensorDirections.push(Math.PI);
}
function initCars() {
  if (source != null) {
    for (let i = 0; i < numChildren; i++) {
      cars.push(new car());
    }
    carsInitialised = true;
  }
}
function resetCarsLocation() {
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
    //this.force = createVector(0, 0);
    this.force = 0;
    this.sensors = [];
    this.bias = [];
    this.active = true;
    this.ml = new MachineLearning(5, 2, [4, 4]);
    this.box = source;
    this.activeBoxes = [source];
    children.push(this.ml);
  }
  calculateML() {
    //this.ml.process(this.sensors);
  }
  updateCar() {
    this.updateSensors();
    let output = this.ml.process([
      distance(this.pos, this.sensors[0]) / sensorLength,
      distance(this.pos, this.sensors[1]) / sensorLength,
      distance(this.pos, this.sensors[2]) / sensorLength,
      distance(this.pos, this.sensors[3]) / sensorLength,
      distance(this.pos, this.sensors[4]) / sensorLength
    ]);
    this.rotate(output[1] / 10);
    this.updateForce(output[0]);
    this.updatePosition();
    this.checkBoxChange();
  }
  updatePosition() {
    var d = distance(this.pos, this.force);
    this.dist += d;
    var sp = speed / d;
    //console.log(this.force / 1000);
    this.pos = createVector(
      this.pos.x + this.force * Math.sin(this.rotation),
      this.pos.y + this.force * Math.cos(this.rotation)
    );
  }
  rotate(degree) {
    this.rotation += degree;
    if (this.rotation > 2 * Math.PI) {
      this.rotation = this.rotation % (2 * Math.PI);
    }
    if (this.rotation < 0) {
      this.rotation = 2 * Math.PI - this.rotation;
    }
  }
  updateForce(input) {
    this.force = input;
    if (this.force > 10) this.force = 10;
    if (this.force < -10) this.force = -10;
    //this.force.x = input;
    //this.force.y = input;
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        /*this.force.x +=
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
        */
      }
    }
  }
  checkBoxChange() {
    let box = grid.overbox(this.pos.x, this.pos.y);
    //if (box) box.path = true;
    if (box) {
      if (box.path == true) this.boxChanged();
      else this.active = false;
    }
  }
  boxChanged() {
    //what to perform once box changes
  }
  updateSensors() {
    this.sensors = [];

    for (var i = 0; i < sensorDirections.length; i++) {
      let foundIntersection = false;
      let temp;
      let intersection;
      for (var j = 0; j < this.box.walls.length; j++) {
        temp = createVector(
          this.pos.x +
            Math.sin(sensorDirections[i] + this.rotation) * sensorLength,
          this.pos.y +
            Math.cos(sensorDirections[i] + this.rotation) * sensorLength
        );
        if (temp)
          intersection = checkIntersection(
            this.pos,
            temp,
            this.box.walls[j][0],
            this.box.walls[j][1]
          );
        console.log(intersection);
        if (intersection) {
          this.sensors.push(intersection);
          foundIntersection = true;
          break;
        }
      }
      if (foundIntersection == false) {
        this.sensors.push(temp);
      }
      //this.sensors = checkNearestIntersection(this.pos);
      //console.log(this.sensors);
    }
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
    cars[i].updateCar();
    if (cars[i].active) ellipse(cars[i].pos.x, cars[i].pos.y, 5, 5);
    if (cars[i].active) {
      completedgeneration = false;
    }
  }
}

function showSensors() {
  stroke(200);
  /*for (var i = 0; i < cars.length; i++) {
    //console.log('ran');
    for (var j = 0; j < sensorDirections.length; j++) {
      if (cars[i].active) {
        let temp = createVector(
          Math.sin(sensorDirections[j] + cars[i].rotation),
          Math.cos(sensorDirections[j] + cars[i].rotation)
        );
        line(
          cars[i].pos.x,
          cars[i].pos.y,
          cars[i].pos.x + temp.x * sensorLength,
          cars[i].pos.y + temp.y * sensorLength
        );
      }
    }
  }*/
  for (var i = 0; i < cars.length; i++) {
    for (var j = 0; j < sensorDirections.length; j++) {
      if (cars[i].active) {
        console.log(cars[i].sensors);
        line(
          cars[i].pos.x,
          cars[i].pos.y,
          cars[i].sensors[j].x,
          cars[i].sensors[j].y
        );
      }
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
