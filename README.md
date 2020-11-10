# Evolutionary Machine Learning Algorithm in p5.js

This project is a demonstration of Evolutionary machine learning algorithm in running purely in javascript.

### [Live Link](https://harjotsingh8.github.io/machine-learning-p5/)

## Instructions

Open this [live link](https://harjotsingh8.github.io/machine-learning-p5/) in your browser to get to a sandbox and refer to these steps if required:

1. In this sandbox you can click anywhere on the grey area to select a starting point for your entities.

2. Once you have selected the starting point, you can click or drag from the area around it to create a path (made of square blocks) for the entities to follow.

###### Setting a starting point and creating a path

![Starting](/Media/Demo.gif)

3. Once you have created a path, you can click on the start button on top left corner to spawn entities, these entities will learn from performing completely random moves to traversing the path improving slowly generation over generation.

###### Start Button

![Start Button](/Media/StartButton.png)

###### First Generation

![First Generation](/Media/Demo1_FirstGen.gif)

## Examples and Findings

- ### Examples

| Generation       | Progress                                        |
| ---------------- | ----------------------------------------------- |
| First Generation | ![First Gen](/Media/Demo1_FirstGen.gif)         |
| Generation 2-5   | ![First Gen](/Media/Demo1_IntermediateGens.gif) |
| Generation 6     | ![First Gen](/Media/Demo1_6thGen.gif)           |

- ### Findings

#### Randomisation over Time

###### As the model trains, a huge reduction in randomisation can be seen

| Stage              | Randomisation                                    |
| ------------------ | ------------------------------------------------ |
| First Gen          | ![First Gen](/Media/Randomisation_Beginning.png) |
| Early Generations  | ![First Gen](/Media/Randomisation_Early.png)     |
| Moderately Trained | ![First Gen](/Media/Randomisation_Mid.png)       |
| Well Trained       | ![First Gen](/Media/Randomisation_Final.png)     |

## Installation

No installation is required.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## p5.js

[p5.js](https://p5js.org) was used for the demostration.

> p5.js is a JavaScript library for creative coding, with a focus on making coding accessible and inclusive for artists, designers, educators, beginners, and anyone else! p5.js is free and open-source because we believe software, and the tools to learn it, should be accessible to everyone.

[Check out p5.js!](https://p5js.org)

## License

[MIT](https://choosealicense.com/licenses/mit/)
