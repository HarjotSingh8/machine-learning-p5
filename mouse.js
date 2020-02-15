let mouseIsPressed = false;
let movingDestination = false;
let mouseSetsWall = false; /*This decides if dragging set or removes the walls*/
let prevDestination = false;
let last = null;
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
    //do not perform actions on grid if mouse is pressed on menu items
    menuIsClicked = false;
    initCars();
    return;
  }

  let box = grid.overbox(mouseX, mouseY);
  if (box) {
    if (source == null) {
      //set source
      console.log("initialising start");
      box.path = true;
      box.source = true;
      source = box;
      previous = box;
      carStart = createVector(
        source.xpos + gridSize / 2,
        source.ypos + gridSize / 2
      );
      mouseSetsWall = true;
      //initCars();
      box.draw();
    } else if (
      box != source &&
      box.path == true &&
      box.NumberOfNeighbors == 1
    ) {
      //clear box if it was last on link
      box.path = false;
      mouseSetsWall = false;
    } else if (box.path == false && checkNeighbor(box, previous)) {
      mouseIsPressed = true;
      addBoxToPath(box, previous);
      mouseSetsWall = true;
      box.draw();
    }
  }
}
function mouseDragged() {
  /*
   * Event listener for mouse dragged
   */
  if (mouseIsPressed) {
    let box = grid.overbox(mouseX, mouseY);
    if (box) {
      if (checkNeighbor(box, previous)) {
        box.path = mouseSetsWall;
        addBoxToPath(box, previous);
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
function addBoxToPath(box, prev) {
  console.log(box.x + "," + box.y);
  box.path = true;
  box.NumberOfNeighbors == 1;
  prev.NumberOfNeighbors += 1;
  box.prev = prev;
  previous = box;
  box.updateWalls(prev);
  prev.updateWalls(box);
  dist++;
  box.distance = dist;
}

function checkNeighbor(a, b) {
  if (a.x == b.x && (a.y - b.y == -1 || a.y - b.y == 1)) {
    return true;
  }
  if (a.y == b.y && (a.x - b.x == -1 || a.x - b.x == 1)) {
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
