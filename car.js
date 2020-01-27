let carStart = undefined;
let cars = []
let sensorOffsets = [ [0,-1], [0,1], [-1,0], [1,0], [1,1], [1,-1], [-1,1], [-1,-1] ]
/*
  X --> Left & Right (-ve & +ve)
  Y --> Up & Down (-ve & +ve)
*/
let collDist = 5
let speedMultiplier = 0.1
let speed = 10;
let checkingDistance = 50

function car() {
  this.pos = carStart;
  this.distance=0
  this.dist = 0
  this.force = createVector(1, 1);
  this.sensors = [];
  this.bias = []
  this.active = true
  this.setup = function() {
    this.active=true
    this.pos = createVector(carStart.x,carStart.y)
    for(var i=0; i<8; i++) {
      this.bias.push([random(-0.1,0.1), random(-0.1,0.1), random(-0.1,0.1), random(-0.1,0.1), random(-0.1,0.1), random(-0.1,0.1), random(-0.1,0.1), random(-0.1,0.1)])
    }
  }
  this.nextGeneration = function() {
    for(var i=0; i<8; i++) {
      for(var j=0; j<8; j++) {
        //inputNodes[i][j] += random(-variation, variation)
        this.bias[i][j] = inputNodes[i][j] + random(-variation,variation)
        //this.bias[i][j] = 0.01
      }
      //this.bias.push([inputNodes[i][0]+random(-variation,variation), inputNodes[i][1]+random(-variation,variation), inputNodes[i][2]+random(-variation,variation), inputNodes[i][3]+random(-variation,variation)])
    }
  }
  this.updatePosition = function() {
    var d = distance(this.pos, this.force)
    this.dist+=d
    var sp = speed/d
    this.pos.x +=this.force.x*sp/10//d*sp;
    this.pos.y +=this.force.y*sp/10//d*sp;
    //this.pos+=this.force
  }
  this.updateForce = function() {
    this.force.x = 0
    this.force.y = 0
    for(var i=0; i<8; i++) {
      for(var j=0; j<8; j++) {
        this.force.x+=this.bias[i][j]*sensorOffsets[i][0]*(this.pos.x-this.sensors[i].x)*(this.pos.x-this.sensors[i].x)//this.sensors[i].x;
        this.force.y+=this.bias[i][j]*sensorOffsets[i][1]*(this.pos.y-this.sensors[i].y)*(this.pos.y-this.sensors[i].y)//this.sensors[i].y;
        //console.log(this.bias[i][j]);
      }
    }

  }
  this.updateSensors = function() {
    this.sensors.length=0;
    //for(var i=0; i<sensorOffsets.length; i++) {
      this.sensors = checkNearestIntersection(this.pos);
      //console.log(this.sensors);
    //}
  }
  this.checkColl = function() {
    for(var i=0; i<this.sensors.length; i++) {
        if(distance(this.pos, this.sensors[i])<collDist) {
          this.active=false;
          //console.log('deavticated');
        }
        //ellipse(this.sensors[i].x, this.sensors[i].y, 5, 5)
    }

  }
}

function showCars() {
  noStroke();
  fill(255);
  completedgeneration = true
  for(var i=0; i<cars.length; i++) {
    //console.log(cars[i].active);
    //console.log(cars[i].pos)
    //cars[i].updatePosition();
    if(cars[i].active)
    ellipse(cars[i].pos.x, cars[i].pos.y, 5, 5);
    if(cars[i].active) {
      completedgeneration=false
    }
  }
  //console.log(cars[0].pos);
  //showSensors()
}

function showSensors() {
  stroke(255)
  for(var i=0; i<cars.length; i++) {
    //console.log('ran');
    for(var j=0; j<sensorOffsets.length; j++) {
      if(cars[i].active)
      line(cars[i].pos.x, cars[i].pos.y, cars[i].pos.x+sensorOffsets[j][0]*20, cars[i].pos.y+sensorOffsets[j][1]*20);
    }
  }
}

function checkParticularSetOfPoints(pos, j, dist, ret, intersection, arr) {
  //var dist = 50
  //var ret = createVector(pos.x+sensorOffsets[j][0]*checkingDistance, pos.y+sensorOffsets[j][1]*checkingDistance);
  var temp = undefined
  var intersection = undefined
  for(var i=0; i<arr.length-1; i++) {
    intersection = checkIntersection(pos, createVector(pos.x+sensorOffsets[j][0]*checkingDistance, pos.y+sensorOffsets[j][1]*checkingDistance), arr[i], arr[i+1])
    if(intersection) {
      temp = distance(pos, intersection)
      if(temp < dist) {
        dist = temp
        ret = intersection;
      }
    }
  }
  intersection = checkIntersection(pos, createVector(pos.x+sensorOffsets[j][0]*checkingDistance, pos.y+sensorOffsets[j][1]*checkingDistance), arr[0], arr[arr.length-1])
  if(intersection) {
    temp = distance(pos, intersection)
    if(temp < dist) {
      dist = temp
      ret = intersection;
    }
  }
  return [dist, ret]
}

function checkNearestIntersection(pos) {
  var sensors = []
  for(var j=0; j<8; j++) {
    var dist = 50
    var ret = createVector(pos.x+sensorOffsets[j][0]*checkingDistance, pos.y+sensorOffsets[j][1]*checkingDistance);
    var temp = undefined
    var intersection = undefined
    var result = [dist,ret]
    result = checkParticularSetOfPoints(pos, j, result[0], result[1], intersection, vertices)
    result = checkParticularSetOfPoints(pos, j, result[0], result[1], intersection, vertices2)
    result = checkParticularSetOfPoints(pos, j, result[0], result[1], intersection, repelVertices)
    //outerLoop
    for(var i=0; i<vertices.length-1; i++) {
      intersection = checkIntersection(pos, createVector(pos.x+sensorOffsets[j][0]*checkingDistance, pos.y+sensorOffsets[j][1]*checkingDistance), vertices[i], vertices[i+1])
      if(intersection) {
        temp = distance(pos, intersection)
        if(temp < dist) {
          dist = temp
          ret = intersection;
        }
      }
    }
    intersection = checkIntersection(pos, createVector(pos.x+sensorOffsets[j][0]*checkingDistance, pos.y+sensorOffsets[j][1]*checkingDistance), vertices[0], vertices[vertices.length-1])
    if(intersection) {
      temp = distance(pos, intersection)
      if(temp < dist) {
        dist = temp
        ret = intersection;
      }
    }
    //InnerLoop
    for(var i=0; i<vertices2.length-1; i++) {
      intersection = checkIntersection(pos, createVector(pos.x+sensorOffsets[j][0]*checkingDistance, pos.y+sensorOffsets[j][1]*checkingDistance), vertices2[i], vertices2[i+1])
      if(intersection) {
        temp = distance(pos, intersection)
        if(temp < dist) {
          dist = temp
          ret = intersection;
        }
      }
    }
    intersection = checkIntersection(pos, createVector(pos.x+sensorOffsets[j][0]*checkingDistance, pos.y+sensorOffsets[j][1]*checkingDistance), vertices2[0], vertices2[vertices2.length-1])
    if(intersection) {
      temp = distance(pos, intersection)
      if(temp < dist) {
        dist = temp
        ret = intersection;
      }
    }
    sensors.push(result[1])
  }
  //console.log(sensors);
  return sensors;
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

  var denominator = ((x1-x2)*(y3-y4) - (y1-y2)*(x3-x4));
  if( denominator!=0 ) {  //Parallel Lines if denominator=0
    var t = ( (x1-x3)*(y3-y4) - (y1-y3)*(x3-x4))/denominator;
    var u = -((x1-x2)*(y1-y3) - (y1-y2)*(x1-x3))/denominator;
    if(t>=0 && t<=1 && u>=0 && u<=1) { //the ray hit a line
      //var destX = x1+t*(x2-x1)
      //var destY = y1+t*(y2-y1)
      return createVector(x1+t*(x2-x1), y1+t*(y2-y1));
    }
  }
  return false;
}


function distance(v1, v2) {
  let a = v1.x-v2.x;
  let b = v1.y - v2.y
  return Math.sqrt( a*a + b*b )
}
