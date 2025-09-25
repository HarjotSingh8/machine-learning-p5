let mouseIsPressed = false;
let movingDestination = false;
let mouseSetsWall = false; /*This decides if dragging set or removes the walls*/
let prevDestination = false;
let last = null;
let menuIsClicked = false;
let menuVisibility = false;

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
    //initCars();
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

function menuClicked() {
  disableClick();
  console.log("mousePressed on menu");
  if (menuVisibility) {
    document.getElementById("menuDiv").style.visibility = "hidden";
    menuVisibility = false;
  } else {
    document.getElementById("menuDiv").style.visibility = "visible";
    menuVisibility = true;
  }
  //menuIsClicked = true;
}

function startButtonClicked() {
  disableClick();
  if (carsInitialised == false) initCars();
  else nextGenerationCars();
}

function toggleTrails() {
  disableClick();
  if (showTrails) {
    showTrails = false;
  } else {
    showTrails = true;
  }
}

function disableClick() {
  //disable clicks on canvas to interact with menu
  menuIsClicked = true;
}

function autoGenerateTrack() {
  disableClick();
  console.log("Auto generating track");
  
  // Clear existing track
  clearTrack();
  
  // Generate a simple L-shaped track
  let startX = Math.floor(cols * 0.2); // Start at 20% from left
  let startY = Math.floor(rows * 0.5); // Start at middle vertically
  let endX = Math.floor(cols * 0.8); // End at 80% from left
  let endY = Math.floor(rows * 0.2); // End at 20% from top
  
  // Set the starting point
  let startBox = grid.grid[startY][startX];
  startBox.path = true;
  startBox.source = true;
  source = startBox;
  previous = startBox;
  carStart = createVector(
    source.xpos + gridSize / 2,
    source.ypos + gridSize / 2
  );
  dist = 0;
  
  // Create horizontal path first
  for (let x = startX + 1; x <= endX; x++) {
    let box = grid.grid[startY][x];
    addBoxToPath(box, previous);
  }
  
  // Create vertical path
  for (let y = startY - 1; y >= endY; y--) {
    let box = grid.grid[y][endX];
    addBoxToPath(box, previous);
  }
  
  console.log("Track auto-generated");
}

function clearTrack() {
  // Reset all grid nodes
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let node = grid.grid[i][j];
      node.path = false;
      node.source = false;
      node.distance = 0;
      node.prev = null;
      node.NumberOfNeighbors = 0;
      // Reset walls
      node.initWalls();
      node.createWalls();
    }
  }
  
  // Reset global variables
  source = null;
  destination = null;
  previous = null;
  dist = 0;
  carStart = undefined;
}
