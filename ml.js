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
   * weightsAndBalances
   * weights (factor that is multiplied)
   * biases (factor that is added)
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

  constructor(inputNodes, outputNodes, intermediateLayers, weights, biases) {
    this.inputNodes = inputNodes; //number of input nodes
    this.outputNodes = outputNodes; //number of output nodes
    this.intermediateLayers = intermediateLayers; //number of intermediate layers
    if (weights == null || biases == null) {
      //if arguments for weights and biases are not given, initialise them with random values
      this.generateRandomWeightsAndBiases();
      //console.log("no weights and balances given");
    } else {
      //if arguments for weights and balances are given, copy those values
      this.setWeightsAndBiases(weights, biases);
      //console.log("weights and balances given");
    }
  }
  generateRandomWeightsAndBiases() {
    /* generate random weights and biases for the first generation */
    this.weights = [];
    this.balances = [];
    for (let i = 0; i < intermediateLayers.length; i++) {
      let layerWeights = [];
      let layerBalances = [];
      for (let j = 0; j < intermediateLayers[i]; j++) {
        layerWeights.push(random(-10, 10));
        layerBalances.push(random(-10, 10));
      }
      this.weights.push(layerWeights);
      this.balances.push(layerBalances);
    }
  }
  setWeightsAndBiases(weights, biases) {
    /* set predefined weights and balances */
    this.weights = weights;
    this.biases = biases;
  }
  mutateWeightsAndBalances() {
    /* add variations to weights and balances in subsequent generations */
  }
  process(inputs) {
    /*this is just a driver function for the process layer recursive function*/
    return this.processLayer(0, inputs);
  }
  processLayer(layer, inputs) {
    /*recursive function that performs all the calculation with current weights and biases*/
    let values = [];
    for (let i = 0; i < intermediateLayers[layer].length; i++) {
      /*initialise values array with zeroes*/
      values.push(0);
    }
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < intermediateLayers[layer].length; j++) {
        /*multiplying weights with inputs and adding biases for every node in inupt and node in layer*/
        values[j] = inputs[i] * this.weights[layer][j] + this.biases[layer][j];
      }
    }
    if (layer == intermediateLayers.length) {
      return output;
    } else {
      return this.processLayer(layer + 1, values);
    }
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
