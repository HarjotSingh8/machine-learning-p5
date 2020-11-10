let carStart = undefined;
let cars = [];
let sensorDirections = [];
let colr = 100;
let reachedEnd = false;
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
let sensorLength = 15;
function initSensors() {
  sensorDirections.push(0);
  sensorDirections.push(Math.PI / 2);
  sensorDirections.push(-Math.PI / 2);
  sensorDirections.push(Math.PI / 4);
  sensorDirections.push(-Math.PI / 4);
  sensorDirections.push(Math.PI);
}
function initCars() {
  frameRate(30);
  if (source != null) {
    for (let i = 0; i < numChildren; i++) {
      cars.push(new car());
    }
    carsInitialised = true;
  }
  frameCounter = 0;
}
function resetCars() {
  for (let i = 0; i < cars.length; i++) {
    //cars[i].pos = carStart;
    //cars[i].active = true;
    cars[i].reset();
    //cars[i].distance = 0;
  }
}
function nextGenerationCars() {
  if (colr == 100) {
    colr = 0;
  } else colr = 100;
  aliveCars = numChildren;
  console.log("new generation");
  nextGeneration();
}

function drawCars() {}

class car {
  constructor() {
    this.pos = carStart;
    this.rotation = 0;
    this.distance = 0;
    this.dist = 0;
    this.fitnessvar1 = 0;
    //this.force = createVector(0, 0);
    this.force = 0;
    this.time = 0;
    this.active = true;
    this.ml = new MachineLearning(5, 2, [8, 8, 8]);
    this.box = source;
    this.boxesToCheckWalls = [];
    this.activeBoxes = [source];
    children.push(this.ml);
    this.updateBoxesForWalls();
    this.boxChanged(this.box);
  }
  updateCar() {
    this.checkBoxChange();
    this.updateSensors();
    //console.log(this.sensors);
    let output = this.ml.process([
      distance(this.pos, this.sensors[0]) / sensorLength,
      distance(this.pos, this.sensors[1]) / sensorLength,
      distance(this.pos, this.sensors[2]) / sensorLength,
      distance(this.pos, this.sensors[3]) / sensorLength,
      distance(this.pos, this.sensors[4]) / sensorLength
    ]);
    if (output[1] > 2) output[1] = 2;
    else if (output[1] < -2) output[1] = -2;

    //this.rotate(output[1] / 10);
    /* Rotate */
    this.rotation += output[1];
    if (this.rotation > 2 * Math.PI) {
      this.rotation = this.rotation % (2 * Math.PI);
    } else if (this.rotation < 0) {
      this.rotation = 2 * Math.PI - this.rotation;
    }
    /* ---- */

    //this.updateForce(output[0]);
    /* Update Force */
    this.force = output[0];
    if (this.force > 4) this.force = 4;
    else if (this.force < -4) this.force = -4;
    /* ---- */
    this.updatePosition();
  }
  updatePosition() {
    //var d = distance(this.pos, this.force);
    this.dist += this.force;
    //var sp = speed / d;
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
    } else if (this.rotation < 0) {
      this.rotation = 2 * Math.PI - this.rotation;
    }
  }
  updateForce(input) {
    this.force = input;
    if (this.force > 4) this.force = 4;
    else if (this.force < -4) this.force = -4;
    //this.force.x = input;
    //this.force.y = input;
  }
  checkBoxChange() {
    this.fitnessvar1 = this.distance / this.dist;
    let box = grid.overbox(this.pos.x, this.pos.y);
    //if (box) box.path = true;
    if (box && this.box != box) {
      if (box.path == true) {
        this.boxChanged(box);
        if (this.distance > box.distance) {
          if (this.active) aliveCars--;
          this.active = false;
        }
        if (box.distance - this.distance > 2) {
          if (this.active) aliveCars--;
          this.active = false;
          this.distance = 0;
          return;
        }
        this.distance = box.distance;
        this.fitness = box.distance/this.time;
      } else {
        if (this.active) aliveCars--;
        this.active = false;
      }
      if (this.distance == dist) {
        reachedEnd = true;
        if (this.active) aliveCars--;
        this.active = false;
      }
    }
  }
  boxChanged(box) {
    //what to perform once box changes
    this.time = frameCounter;
    this.box = box;
    this.updateBoxesForWalls();
  }
  updateBoxesForWalls() {
    this.boxesToCheckWalls = this.box.returnNeighbors();
    this.boxesToCheckWalls.push(this.box);
  }
  updateSensors() {
    this.sensors = [];
    //console.log(this.boxesToCheckWalls);
    for (var i = 0; i < sensorDirections.length; i++) {
      let foundIntersection = false;
      let temp;
      let intersection;
      for (var j = 0; j < this.boxesToCheckWalls.length; j++) {
        for (var k = 0; k < this.boxesToCheckWalls[j].walls.length; k++) {
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
              this.boxesToCheckWalls[j].walls[k][0],
              this.boxesToCheckWalls[j].walls[k][1]
            );
          //console.log(intersection);
          if (intersection) {
            this.sensors.push(intersection);
            foundIntersection = true;
            if (distance(this.pos, intersection) < 2) {
              if (this.active) aliveCars--;
              this.active = false;
            }
            break;
          }
        }
        if (intersection) break;
      }
      if (foundIntersection == false) {
        this.sensors.push(temp);
      }
      //this.sensors = checkNearestIntersection(this.pos);
      //console.log(this.sensors);
    }
  }
  reset() {
    this.rotation = 0;
    this.force = 0;
    this.active = true;
    this.pos = carStart;
    this.distance = 0;
    this.dist = 0.1;
    this.time = 0;
    //this.box = source;
    this.boxChanged(source);
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
  resetFitness() {
    this.distance = 0;
  }
}

function showCars() {
  noStroke();

  completedgeneration = true;
  for (var i = 0; i < cars.length; i++) {
    fill(colr, colr, (i * 255) / cars.length);
    if (cars[i].active) {
      cars[i].updateCar();
      ellipse(cars[i].pos.x, cars[i].pos.y, 5, 5);
    }
    //if (cars[i].active) {
    //  completedgeneration = false;
    //}
  }
}

function showSensors() {
  stroke(150);
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
        //console.log(cars[i].sensors);
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
