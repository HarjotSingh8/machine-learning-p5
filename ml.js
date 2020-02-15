let numChildren = 1000;
let children = [];
let inputNodes;
let outputNodes;
let intermediateLayers;
let variation = 0.001;
let generation = 1;
let factor = 10;
let percentToKeep = 1 / 10; //percent of best children to keep as it is for next generation
/*
  order for sensors and forces (for code in cars or players, irrelevant for ML algorithm)
  Up, Down, Left, Right
*/

function nextGeneration() {
  /*
   * This function creates a new generation by taking best candidates from previous generations
   */
  generation++;
  runDuration += 10 * generation;
  factor += generation;
  percentToKeep += 1 / 100;
  sortByFitness();
  for (let i = parseInt(cars.length * percentToKeep); i < cars.length; i++) {
    //console.log(
    //  "destination = " + i + ",source = " + (i % (cars.length * percentToKeep))
    //);
    //console.log(cars[i % (cars.length * percentToKeep)].distance);
    cars[i].ml.copyAndMutate(
      cars[parseInt(i % (cars.length * percentToKeep))].ml
    );
  }
  /*for (let i = 1; i < cars.length; i++) {
    cars[i].ml.copyAndMutate(cars[0].ml);
  }*/
  resetCars();
}

function sortByFitness() {
  /*
   * This funciton sorts the children by fitness
   */
  for (let i = 0; i < cars.length; i++) {
    for (let j = i; j < cars.length; j++) {
      if (cars[i].distance < cars[j].distance) {
        let temp = cars[i];
        cars[i] = cars[j];
        cars[j] = temp;
      }
      if (cars[i].distance == cars[j].distance) {
        if (cars[i].distance / cars[i].time < cars[j].distance / cars[i].time) {
          let temp = cars[i];
          cars[i] = cars[j];
          cars[j] = temp;
        }
      }
    }
    //console.log(cars[i].distance);
    //cars[i].resetFitness();
  }
  //console.log(cars[0].distance);
}

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
    this.layers = []; //number of intermediate layers
    this.layers.push(inputNodes);
    //this.layers.push(intermediateLayers);
    for (let i = 0; i < intermediateLayers.length; i++) {
      this.layers.push(intermediateLayers[i]);
    }
    this.layers.push(outputNodes);
    this.fitness = 0;
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
    this.biases = [];
    for (let i = 0; i < this.layers.length - 1; i++) {
      let layerWeights = [];
      let layerBiases = [];
      for (let j = 0; j < this.layers[i]; j++) {
        let nodeWeights = [];
        let nodeBiases = [];
        for (let k = 0; k < this.layers[i + 1]; k++) {
          nodeWeights.push(random(-1, 1));
          nodeBiases.push(random(-0.5, 0.5));
        }
        layerWeights.push(nodeWeights);
        layerBiases.push(nodeBiases);
      }
      this.weights.push(layerWeights);
      this.biases.push(layerBiases);
    }
  }
  copyAndMutate(source) {
    /*
     * This function copies from another organism and mutates it
     */
    //this.weights = Array.from(source.weights);
    //this.biases = Array.from(source.biases);
    //this.resetFitness();
    this.mutateWeightsAndBiases(source, factor);
  }
  setWeightsAndBiases(weights, biases) {
    /* set predefined weights and balances */
    this.weights = weights;
    this.biases = biases;
  }
  mutateWeightsAndBiases(source, factor) {
    /* add variations to weights and balances in subsequent generations */
    for (let i = 0; i < this.weights.length; i++) {
      for (let j = 0; j < this.weights[i].length; j++) {
        for (let k = 0; k < this.weights[i][j].length; k++) {
          /*
           * Mutate here
           */
          let ran = Math.random(1, 10) / factor;
          let sign = 1;
          if (Math.random(-1, 1) < 0) sign = -1;
          //this.weights[i][j][k] += random(-10, 10) / 500;
          //this.biases[i][j][k] += random(-10, 10) / 500;
          //if (Math.random(0, 100) < factor) {
          this.weights[i][j][k] = source.weights[i][j][k] + ran * sign;
          //+ Math.random(-10, 10) / factor;
          //}
          ran = Math.random(1, 10) / factor;
          sign = 1;
          if (Math.random(-1, 1) < 0) sign = -1;
          //if (Math.random(0, 100) < factor) {
          this.biases[i][j][k] = source.biases[i][j][k] + ran * sign;
          // + Math.random(-5, 5) / factor;
          //}
        }
      }
    }
  }
  process(inputs) {
    /*this is just a driver function for the process layer recursive function*/
    return this.processLayer(0, inputs);
  }
  processLayer(layer, inputs) {
    /*recursive function that performs all the calculation with current weights and biases*/
    let values = [];
    for (let i = 0; i < this.layers[layer + 1]; i++) {
      /*initialise values array with zeroes*/
      values.push(0);
    }
    //console.log(inputs);
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < this.layers[layer + 1]; j++) {
        /*multiplying weights with inputs and adding biases for every node in inupt and node in layer*/
        values[j] +=
          inputs[i] * this.weights[layer][i][j] + this.biases[layer][i][j];
        //console.log(values);
      }
    }
    if (layer == this.layers.length - 2) {
      //console.log(values);
      return values;
    } else {
      return this.processLayer(layer + 1, values);
    }
  }
  updateFitness(fitness) {
    this.fitness = fitness;
  }
  resetFitness() {
    this.fitness = 0;
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
