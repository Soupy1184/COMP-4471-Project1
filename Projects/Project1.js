

// RotatingTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform float time;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '   gl_PointSize = 20.0;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

//Globals
var bacteriaCount = 0;
var timer = Date.now();
var e = 0; // current enum for bacteriaEnumerator
var bacteriaEnumerator = [];

function main() {
  // Retrieve <canvas> element
  var canvas = document.querySelector('#webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  //Get the storage location of a_Position 
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0){
      console.log('Fail to get the storage location of a_Position');
      return;
  }

  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor){
    console.log('Failed to get the storage location');
    return
  }

  

  var timeLoc = gl.getUniformLocation(gl.program, 'time');
  
  console.log(timeLoc);

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.enableVertexAttribArray(a_Position);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  canvas.onmousedown = function(ev){ click(ev, gl, canvas, a_Position); };

  //create play surface
  var origin = {x: 0.0, y: 0.0, r: 0.5}

  //create a limit for new bacteria
  var bacteriaLimit = 3; 

  //create colours
  var rgbaBlue = {rgba1: 0, rgba2: 0, rgba3: 1, rgba4: 1};
  var rgbaPurple = {rgba1: 1, rgba2: 0, rgba3: 1, rgba4: 1};
  var rgbaGreen = {rgba1: 0, rgba2: 1, rgba3: 0, rgba4: 1};
  var rgbaYellow = {rgba1: 1, rgba2: 1, rgba3: 0, rgba4: 1};

  //instantiate bacteria objects
  var blueBac = new Bacteria("blue", 0, 0, 0, rgbaBlue);
  var purpleBac = new Bacteria("purple", 0, 0, 0, rgbaPurple);
  var greenBac = new Bacteria("green", 0, 0, 0, rgbaGreen);
  var yellowBac = new Bacteria("yellow", 0, 0, 0, rgbaYellow);

  //Enumerator for bacteria objects
  bacteriaEnumerator = [blueBac, purpleBac, greenBac, yellowBac];

  //to be deleted
  var blue = {c: 'blue', rgba1: 0, rgba2: 0, rgba3: 1, rgba4: 1};
  var purple = {c: 'purple', rgba1: 1, rgba2: 0, rgba3: 1, rgba4: 1};
  var green = {c: 'green', rgba1: 0, rgba2: 1, rgba3: 0, rgba4: 1};
  var yellow = {c: 'yellow', rgba1: 1, rgba2: 1, rgba3: 0, rgba4: 1};
  var colours = [blue, purple, green, yellow]; //to enumerate the bacteria on the play surface

  var bacteria = [];
  var bacteriaColour = [];
  var currentBacteria = [];

  //LOOP
  function render(time) {
    time *= 0.001;  // convert to seconds
    Time();
    
    CreateCircle(gl, 0, 0, 0.5, 64);
    gl.uniform4f(u_FragColor, 0, 0, 0, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 64);

    // tell the shader the time
    gl.uniform1f(timeLoc, time);
    
    // grow the bacteria
    if (bacteria.length != 0){ 
      if((elapsed + 1) % 4 == 0){
        for(i = 0; i < bacteria.length; i++){
          bacteria[i].growthFunction();
        }
      }
    }

    //create new starting bacteria
    if(bacteriaCount < bacteriaLimit && (elapsed + 1) % 4 == 0){
      console.log('Drawing new bacteria on the board');

      var angle = Math.floor(Math.random() * 360);

      //store first circle fan vertices in object
      bacteria.push(bacteriaEnumerator[e]);
      bacteriaEnumerator[e].addFirstPosition(StoreCircle((origin.r*Math.cos(angle)) + origin.x, (origin.r*Math.sin(angle)) + origin.y, 0.05, 64));
      bacteriaEnumerator[e].growth++;
      bacteriaEnumerator[e].minAngle = angle;
      bacteriaEnumerator[e].maxAngle = angle;

      console.log(bacteria);
      //enumerates colours 
      e = EnumerateBacteria(e);

      bacteriaCount++;
    }

    

    //draw all circles in bacteria 
    if (bacteria.length != 0){ 
      
      for (i = 0; i < bacteria.length; i++){
        for (j = 0; j < bacteria[i].positions.length; j++){
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bacteria[i].positions[j]), gl.STATIC_DRAW);
          gl.uniform4f(u_FragColor, bacteria[i].rgba.rgba1, bacteria[i].rgba.rgba2, bacteria[i].rgba.rgba3, bacteria[i].rgba.rgba4);
          gl.drawArrays(gl.TRIANGLE_FAN, 0, 64);
        }
      }
    }
    
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

var elapsed;
function Time() {
  // Calculate the elapsed time
  var now = Date.now();
  elapsed = now - timer;
  elapsed = Math.floor(elapsed*0.001);
  if (elapsed > 2){
    timer = Date.now();
  }
}

function CreateCircle(gl, x, y, r, n){
  var circle = {x: x, y:y, r: r};
  //var ATTRIBUTES = 2;
  var numFans = n;
  var degreePerFan = (2* Math.PI) / numFans;
  var vertexData = [];

  //  console.log(gl_Position)
  for(var i = 0; i <= numFans; i++) {
    var index = i*2;
    var angle = degreePerFan * (i+1);
    //console.log(angle)
    vertexData[index] =  circle.x + Math.cos(angle) * circle.r;
    vertexData[index + 1] = circle.y + Math.sin(angle) * circle.r;
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
}

function StoreCircle(x, y, r, n){
  var circle = {x: x, y:y, r: r};
  //var ATTRIBUTES = 2;
  var numFans = n;
  var degreePerFan = (2* Math.PI) / numFans;
  var vertexData = [];

  //  console.log(gl_Position)
  for(var i = 0; i <= numFans; i++) {
    var index = i*2;
    var angle = degreePerFan * (i+1);
    //console.log(angle)
    vertexData[index] =  circle.x + Math.cos(angle) * circle.r;
    vertexData[index + 1] = circle.y + Math.sin(angle) * circle.r;
  }

  return vertexData;
}

function StorePoint(x, y){
  var point = {x: x, y:y};
  var vertexData = [];
  vertexData[0] =  point.x;
  vertexData[1] = point.y;

  return vertexData;
}

function click(ev, gl, canvas, a_Position){
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  console.log('x: ' + x + ', y: ' + y);
  
}

//NOTES:
  //create a new point
  //var testPoint = StorePoint(0.9, 0.9);
  //console.log(testPoint[1]);
  //gl.vertexAttrib3f(a_Position, testPoint[0], testPoint[1], 0.0);
  //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(testPoint), gl.STATIC_DRAW);
  //gl.drawArrays(gl.POINTS, 0, 1);