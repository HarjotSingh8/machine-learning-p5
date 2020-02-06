let mouseIsPressed = false;
let movingDestination = false;
let mouseSetsWall = false; /*This decides if dragging set or removes the walls*/
let prevDestination = false;
let menuIsClicked = false;
function menuClicked() {
  console.log("mousePressed on menu");
  menuIsClicked = true;
}
function mousePressed() {
  setTimeout(mouseisPressed, 10);
}
function mouseisPressed() {
  /*
   * This is an event listener for mouse pressed
   */

  if (menuIsClicked) {
    menuIsClicked = false;
    return;
  }
  console.log("mousePressed on grid");
  let box = grid.overbox();
  if (source == null && box) {
    //init start
    console.log("initialising start");
    box.path = true;
    box.source = true;
    source = box;
    carStart = createVector(
      source.xpos + gridSize / 2,
      source.ypos + gridSize / 2
    );
    initCars();
    box.draw();
  } else if (destination == null && box && box.source == false) {
    //init destination
    console.log("initialise destination");
    box.path = true;
    box.destination = true;
    destination = box;
    prevDestination = box;
    box.draw();
  } else if (box) {
    if (box.destination) {
      movingDestination = true;
      mouseIsPressed = true;
    } else if (box.source) {
      console.log("moving source");
      //code to move source here
    } else {
      mouseIsPressed = true;
      box.path = !box.path;
      mouseSetsWall = box.path;
      box.draw();
    }
  }
}
function mouseDragged() {
  /*
   * Event listener for mouse dragged
   */
  if (mouseIsPressed) {
    let box = grid.overbox();
    if (box) {
      if (
        movingDestination &&
        box != destination &&
        box.visited &&
        box != source
      ) {
        console.log("moving");
        prevDestination.destination = false;
        destination = box;
        box.destination = true;
        prevDestination.draw();
        prevDestination = box;
        startpath();
        box.draw();
      } else if (box != destination && box != source) {
        box.path = mouseSetsWall;
        box.draw();
      }
    }
  }
}
function mouseReleased() {
  /*
   * Event listener for mouse released
   */
  mouseIsPressed = false;
  movingDestination = false;
}
function onMenu() {
  return false;
  if (mouseX >= 5 && mouseX <= 45 && mouseY >= 5 && mouseY <= 27) return true;
  if (menuOpen) {
    if (mouseX >= 5 && mouseY >= 27)
      //checking for menu when menu is expanded
      return true;
  }
  return false;
}

function toggleMenuVisible() {
  console.log("menu toggle");
  var x = document.getElementById("menu");
  if (x.style.display == "none") x.style.display = "block";
  else x.style.display = "none";
}
