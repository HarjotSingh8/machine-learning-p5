let numberOfVertices = 5;
let vertices = []
let vertices2 = []
let preparing = false
/*
  set preparing to true if manually giving points using mouse
  false if using predeifned points
  if using predefined points set those points in
  and use createPath function in setup
*/
let repelVertices = []
let repelDir = [ [1,1], [1,-1], [-1,-1], [-1,1] ]
let repelSpeed = 0.5
let repelwait = 30
function repelstart() {
  repelwait = 30
  repelVertices.length=0
  for(var i=0; i<4; i++) {
    repelVertices.push(createVector(carStart.x, carStart.y))
  }
}

function repel() {
  if(repelwait>0) {
    repelwait-=1
  }
  else {
    for(var i=0; i<4; i++) {
      repelVertices[i].x+=repelDir[i][0]*repelSpeed
      repelVertices[i].y+=repelDir[i][1]*repelSpeed
    }
  }
  //console.log(repelVertices);
}

let path1Vertices = [ [50, 120], [450,50], [510,360], [290, 430], [80,360] ]
let path2Vertices = [ [130, 180], [400, 110], [450, 340], [300, 370], [150,300] ]
function createPath() {
  for(var i=0; i<path1Vertices.length; i++ ) {
    vertices.push(createVector(path1Vertices[i][0], path1Vertices[i][1]));
  }
  for(var i=0; i<path2Vertices.length; i++ ) {
    vertices2.push(createVector(path2Vertices[i][0], path2Vertices[i][1]));
  }
}
function mouseClicked() {
  if(vertices.length<numberOfVertices) {
    vertices.push(createVector(mouseX, mouseY));
  }
  else if (vertices2.length<numberOfVertices) {
    vertices2.push(createVector(mouseX, mouseY));
  }
  else {
    carStart = createVector(mouseX, mouseY);
    preparing = false
    prepareMl();
  }
  //console.log(mouseX +  " " + mouseY);
}

function createRoads() {

}

function drawVertices() {
  stroke(255);
  strokeWeight(1);
  fill(100);
  beginShape();
  for(var i=0; i<vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
  fill(50);
  beginShape();
  for(var i=0; i<vertices2.length; i++) {
    vertex(vertices2[i].x, vertices2[i].y);
  }
  endShape(CLOSE);
  drawShape(repelVertices)
}

function drawShape(shape) {
  fill(255)
  beginShape();
  for(var i=0; i<shape.length; i++) {
    vertex(shape[i].x, shape[i].y);
  }
  endShape(CLOSE);
}
