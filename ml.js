let numChildren = 100;
let inputNodes = [0,0,0,0]
let outputNodes = []
let completedgeneration=false
let variation = 0.01
/*
  order for sensors and forces
  Up, Down, Left, Right
*/

function prepareMl() {
  for(var i=0; i<numChildren; i++) {
    cars.push(new car());
    cars[i].setup();
  }
  console.log('ran');
}

function learning() {
  if(completedgeneration) {
    console.log('nextGeneration')
    resetCars();
    completedgeneration=false
  }
  else {
    for(var i=0; i<cars.length; i++) {
      if(cars[i].active) {
        cars[i].updateSensors();
        cars[i].updatePosition();
        cars[i].updateForce();
        cars[i].checkColl();
      }
    }
  }
}

function resetCars() {
  repelstart()
  let maxDist = cars[0].distance;
  inputNodes = cars[0].bias
  for(var i=0; i<cars.length; i++) {
    if(cars[i].distance>maxDist) {
      inputNodes=cars[i].bias
    }
  }
  for(var i=0; i<cars.length; i++) {
    console.log(cars[i].bias)
    cars[i].distance=0;
    cars[i].dist=0
    cars[i].active=true;
    cars[i].pos.x = carStart.x
    cars[i].pos.y = carStart.y
    //cars[i].bias = inputNodes
    cars[i].nextGeneration();
  }

}
