let numChildren = 100;
let inputNodes;
let outputNodes;
let intermediateLayers;
let variation = 0.001;
/*
  order for sensors and forces
  Up, Down, Left, Right
*/

class MachineLearning {
  /*
   * Class Properties
   *
   * inputNodes = number of inputs
   * outputNodes = number of outputs
   * intermediateLayers = array containing number of node in each intermediate layer
   *
   * weightsAndBalances[2][][]
   * weights => weightsAndBalances[0]
   * balances => weightsAndBalances[1]
   *
   * Constructor can have 3 or 4 inputs
   * First 3 inputs set inputNodes, outputNodes and intermediateLayers
   * Constructor with 3 inputs will generate random weights and biases
   * Constructor with 4 inputs will set weights and biases from the parameter obtained
   *
   * function generateRandomWeightsAndBiases()
   * This function will generate random weights and biases
   *
   * function setWeightsAndBiases(weightsAndBiases)
   * This function sets weights and biases from the passed parameter
   *
   * funciton mutateWeightsAndBalances()
   * This function creates variations in weights and balances
   *
   * function process(inputs)
   * returns output
   * This funciton takes input, processes it and gives output
   */
  constructor(inputNodes, outputNodes, intermediateLayers, weightsAndBiases) {
    this.inputNodes = inputNodes;
    this.outputNodes = outputNodes;
    this.intermediateLayers = intermediateLayers;
    if (weightsAndBiases == null) {
      this.generateRandomWeightsAndBiases();
      console.log("no weights and balances given");
    } else {
      this.setWeightsAndBiases(weightsAndBiases);
      console.log("weights and balances given");
    }
  }
  generateRandomWeightsAndBiases() {
    /* generate random weights and biases for the first generation */
  }
  setWeightsAndBiases(weightsAndBiases) {
    /* set predefined weights and balances */
  }
  mutateWeightsAndBalances() {
    /* add variations to weights and balances in subsequent generations */
  }
  process(inputs) {
    for (let i = 0; i < numChildren; i++) {}
  }
}

function prepareML() {
  /*
   * set basic ML variables
   * number of input nodes
   * number of output nodes
   * number of  intermediate layers, along with number of nodes in each intermediate layer
   */
  inputNodes = 5;
  outputNodes = 2;
  intermediateLayers = [8, 8];
  prepareCars();
}

function prepareCars() {
  for (var i = 0; i < numChildren; i++) {
    cars.push(new car());
    cars[i].setup();
  }
  console.log("ran");
}

function learning() {
  if (completedgeneration) {
    console.log("nextGeneration");
    resetCars();
    completedgeneration = false;
  } else {
    for (var i = 0; i < cars.length; i++) {
      if (cars[i].active) {
        cars[i].updateSensors();
        cars[i].updatePosition();
        cars[i].updateForce();
        cars[i].checkColl();
      }
    }
  }
}

function resetCars() {
  repelstart();
  let maxDist = cars[0].distance;
  inputNodes = cars[0].bias;
  for (var i = 0; i < cars.length; i++) {
    if (cars[i].distance > maxDist) {
      inputNodes = cars[i].bias;
    }
  }
  for (var i = 0; i < cars.length; i++) {
    console.log(cars[i].bias);
    cars[i].distance = 0;
    cars[i].dist = 0;
    cars[i].active = true;
    cars[i].pos.x = carStart.x;
    cars[i].pos.y = carStart.y;
    //cars[i].bias = inputNodes
    cars[i].nextGeneration();
  }
}
