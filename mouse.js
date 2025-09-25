let mouseIsPressed = false;
let movingDestination = false;
let mouseSetsWall = false; /*This decides if dragging set or removes the walls*/
let prevDestination = false;
let last = null;
let menuIsClicked = false;
let menuVisibility = true;

function mousePressed() {
  // Check if click is on menu area first
  if (isClickOnMenu(mouseX, mouseY)) {
    return; // Don't process canvas clicks if clicking on menu
  }
  setTimeout(mouseisPressed, 10);
}

function isClickOnMenu(x, y) {
  // Get menu element bounds
  let menuDiv = document.getElementById("menuDiv");
  let menuBtn = document.getElementById("menuBtn");
  
  if (!menuDiv || !menuBtn) return false;
  
  let menuDivRect = menuDiv.getBoundingClientRect();
  let menuBtnRect = menuBtn.getBoundingClientRect();
  
  // Check if click is within menu button bounds
  if (x >= menuBtnRect.left && x <= menuBtnRect.right && 
      y >= menuBtnRect.top && y <= menuBtnRect.bottom) {
    return true;
  }
  
  // Check if menu is visible and click is within menu div bounds
  if (menuDiv.style.visibility !== "hidden" &&
      x >= menuDivRect.left && x <= menuDivRect.right && 
      y >= menuDivRect.top && y <= menuDivRect.bottom) {
    return true;
  }
  
  return false;
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

function generateRandomPath() {
  disableClick();
  
  // Clear existing path
  clearPath();
  
  // Generate random starting position
  let startCol = Math.floor(Math.random() * (cols - 20)) + 10; // Keep some margin
  let startRow = Math.floor(Math.random() * (rows - 20)) + 10;
  
  let startBox = grid.grid[startRow][startCol];
  startBox.path = true;
  startBox.source = true;
  source = startBox;
  previous = startBox;
  carStart = createVector(
    source.xpos + gridSize / 2,
    source.ypos + gridSize / 2
  );
  
  // Generate random path length (20-50 segments)
  let pathLength = Math.floor(Math.random() * 30) + 20;
  let currentBox = startBox;
  let pathBoxes = [startBox];
  let attempts = 0;
  let maxAttempts = pathLength * 10; // Prevent infinite loops
  
  for (let i = 0; i < pathLength && attempts < maxAttempts; i++) {
    attempts++;
    
    // Get valid neighbors (adjacent cells that aren't already path and don't violate rules)
    let validNeighbors = getValidNeighborsForGeneration(currentBox);
    
    if (validNeighbors.length === 0) {
      // If stuck, try backtracking to a previous box with valid neighbors
      let backtrackSuccess = false;
      for (let j = pathBoxes.length - 2; j >= 0; j--) {
        let backtrackBox = pathBoxes[j];
        let backtrackNeighbors = getValidNeighborsForGeneration(backtrackBox);
        if (backtrackNeighbors.length > 0) {
          currentBox = backtrackBox;
          validNeighbors = backtrackNeighbors;
          backtrackSuccess = true;
          break;
        }
      }
      
      if (!backtrackSuccess) {
        break; // Can't continue, end path generation
      }
    }
    
    // Pick random valid neighbor
    let randomNeighbor = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
    
    // Add to path
    addBoxToPath(randomNeighbor, currentBox);
    pathBoxes.push(randomNeighbor);
    currentBox = randomNeighbor;
  }
  
  // Redraw the grid
  grid.draw();
  
  console.log(`Generated random path with ${pathBoxes.length} segments`);
}

function getValidNeighborsForGeneration(box) {
  let neighbors = [];
  let directions = [
    {dx: 0, dy: -1}, // up
    {dx: 0, dy: 1},  // down
    {dx: -1, dy: 0}, // left
    {dx: 1, dy: 0}   // right
  ];
  
  for (let dir of directions) {
    let newX = box.x + dir.dx;
    let newY = box.y + dir.dy;
    
    // Check bounds
    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
      let neighborBox = grid.grid[newY][newX];
      
      // Check if neighbor is not already a path
      if (!neighborBox.path) {
        // Check that adding this neighbor won't create non-sequential touching blocks
        if (isValidPathExtension(neighborBox)) {
          neighbors.push(neighborBox);
        }
      }
    }
  }
  
  return neighbors;
}

function isValidPathExtension(box) {
  // Check all 8 surrounding positions (including diagonals)
  let surroundingDirections = [
    {dx: -1, dy: -1}, {dx: 0, dy: -1}, {dx: 1, dy: -1}, // top row
    {dx: -1, dy: 0},                   {dx: 1, dy: 0},  // middle row (excluding center)
    {dx: -1, dy: 1},  {dx: 0, dy: 1},  {dx: 1, dy: 1}   // bottom row
  ];
  
  let pathNeighbors = [];
  
  for (let dir of surroundingDirections) {
    let checkX = box.x + dir.dx;
    let checkY = box.y + dir.dy;
    
    if (checkX >= 0 && checkX < cols && checkY >= 0 && checkY < rows) {
      let checkBox = grid.grid[checkY][checkX];
      if (checkBox.path) {
        pathNeighbors.push({box: checkBox, dx: dir.dx, dy: dir.dy});
      }
    }
  }
  
  // If there are path neighbors, make sure they are sequential (connected)
  if (pathNeighbors.length > 1) {
    // Check if any two path neighbors are non-adjacent (diagonal to each other)
    for (let i = 0; i < pathNeighbors.length; i++) {
      for (let j = i + 1; j < pathNeighbors.length; j++) {
        let neighbor1 = pathNeighbors[i];
        let neighbor2 = pathNeighbors[j];
        
        // Check if they are diagonal to each other (not adjacent)
        let dx = Math.abs(neighbor1.dx - neighbor2.dx);
        let dy = Math.abs(neighbor1.dy - neighbor2.dy);
        
        // If both dx and dy are > 1, they are diagonal and not connected
        if (dx > 1 || dy > 1) {
          return false;
        }
        
        // Additional check: if they are diagonal positions and not connected through the path
        if (dx === 2 || dy === 2) {
          return false;
        }
      }
    }
  }
  
  return true;
}

function clearPath() {
  if (source) {
    source.path = false;
    source.source = false;
  }
  
  // Clear all path boxes
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let box = grid.grid[i][j];
      if (box.path && !box.source) {
        box.path = false;
        box.NumberOfNeighbors = 0;
        box.prev = null;
        box.distance = 0;
        // Reset walls
        box.initWalls();
        box.createWalls();
      }
    }
  }
  
  source = null;
  previous = null;
  carStart = undefined;
  dist = 0;
}
