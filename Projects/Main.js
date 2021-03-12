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

//GLOBALS
var timer = Date.now();
var e = 0; // current enum for bacteriaEnumerator
var bacteriaEnumerator = [];
var gameIsActive = true;
var bigBacteria = false;

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

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.enableVertexAttribArray(a_Position);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  canvas.onmousedown = function(ev){ click(ev, canvas); };

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
  //colour, minAngle, maxAngle, growth, rgba values
  console.log("create enum");
  var blueBac = new Bacteria(false, "blue", 0, 0, rgbaBlue, 0.05);
  var purpleBac = new Bacteria(false, "purple", 0, 0, rgbaPurple, 0.05);
  var greenBac = new Bacteria(false, "green", 0, 0, rgbaGreen, 0.05);
  var yellowBac = new Bacteria(false, "yellow", 0, 0, rgbaYellow, 0.05);
  console.log("created");
  //Enumerator for bacteria objects
  bacteriaEnumerator = [blueBac, purpleBac, greenBac, yellowBac];

  var bacteria = []; //stores current bacteria on the board;



  //LOOP
  function render(time) {
    time *= 0.001;  // convert to seconds
    Time();
    
    //play surface
    CreateCircle(gl, 0, 0, 0.5, 32); 
    gl.uniform4f(u_FragColor, 0, 0, 0, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 32);

    // tell the shader the time
    gl.uniform1f(timeLoc, time);
    
    // grow the bacteria using the time passed as a parameter for how much to grow on that frame
    for(i = 0; i < bacteria.length; i++){
      bacteria[i].growthFunction(time);
    }
      

    //check for bacteria conllision
    for (i = 0; i < bacteria.length; i++){
      //get xy coords on current bacteria maxAngle
      var currentBacXMax = 0.5 * Math.cos(bacteria[i].maxAngle);
      var currentBacYMax = 0.5 * Math.sin(bacteria[i].maxAngle);
      //get xy coords on current bacteria minAngle
      var currentBacXMin = 0.5 * Math.cos(bacteria[i].minAngle);
      var currentBacYMin = 0.5 * Math.sin(bacteria[i].minAngle);

      for (j = 0; j < bacteria.length; j++){
        //skip bacteria with the same colour
        if(bacteria[i].colour != bacteria[j].colour){
          var testBacXMax = 0.5 * Math.cos(bacteria[j].maxAngle);
          var testBacYMax = 0.5 * Math.sin(bacteria[j].maxAngle);
          //get xy coords on current bacteria minAngle
          var testBacXMin = 0.5 * Math.cos(bacteria[j].minAngle);
          var testBacYMin = 0.5 * Math.sin(bacteria[j].minAngle);

          //current bacteria distance for maxAngle
          var distance = EuclideanDistance([currentBacXMax, currentBacYMax], [testBacXMin, testBacYMin]);
          if (distance <= 0.1){
            // bacteria[i].consumeBacteria(bacteria[j].positions, bacteria[j].maxAngle, bacteria[i].minAngle);
            bacteria[j].getConsumed();
          }

          //curren bacteria distance for minAngle
          var distance = EuclideanDistance([currentBacXMin, currentBacYMin], [testBacXMax, testBacYMax]);
          if (distance <= 0.1){
            // bacteria[i].consumeBacteria(bacteria[j].positions, bacteria[j].originCoords, bacteria[i].maxAngle, bacteria[j].minAngle);
            bacteria[j].getConsumed();
          }
        }
      }

    }

    //create new starting bacteria
    if(bacteria.length < bacteriaLimit && (elapsed + 1) % 4 == 0){
      console.log('Drawing new bacteria on the board');

      var angle = Math.floor(Math.random() * 360);
      
      if (!bacteriaEnumerator[e].isActive){
        //store first circle fan vertices in object
        bacteria.push(bacteriaEnumerator[e]);
        bacteriaEnumerator[e].isActive = true;
        //bacteriaEnumerator[e].growth++;
        bacteriaEnumerator[e].minAngle = angle;
        bacteriaEnumerator[e].maxAngle = angle;
        bacteriaEnumerator[e].addFirstPosition();

        console.log(bacteria); 
      }
      //enumerates colours 
      e = EnumerateBacteria(e);
      console.log(e);

      
    }

    //draw all bacteria
    if (bacteria.length != 0){ 
      /*
      for (i = 0; i < bacteria.length; i++){
        for (j = 0; j < bacteria[i].positions.length; j++){
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bacteria[i].positions[j]), gl.STATIC_DRAW);
          gl.uniform4f(u_FragColor, bacteria[i].rgba.rgba1, bacteria[i].rgba.rgba2, bacteria[i].rgba.rgba3, bacteria[i].rgba.rgba4);
          gl.drawArrays(gl.TRIANGLE_FAN, 0, 12);
        }
        
      }
      */
      for (i = 0; i < bacteria.length; i++){
        //draw edge circles
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bacteria[i].edges[0]), gl.STATIC_DRAW);
        gl.uniform4f(u_FragColor, bacteria[i].rgba.rgba1, bacteria[i].rgba.rgba2, bacteria[i].rgba.rgba3, bacteria[i].rgba.rgba4);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 12);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bacteria[i].edges[1]), gl.STATIC_DRAW);
        gl.uniform4f(u_FragColor, bacteria[i].rgba.rgba1, bacteria[i].rgba.rgba2, bacteria[i].rgba.rgba3, bacteria[i].rgba.rgba4);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 12);




        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bacteria[i].growthVerts), gl.STATIC_DRAW);
        gl.uniform4f(u_FragColor, bacteria[i].rgba.rgba1, bacteria[i].rgba.rgba2, bacteria[i].rgba.rgba3, bacteria[i].rgba.rgba4);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, bacteria[i].growthVerts.length);
      }

    }
    
    //END GAME CRITERIA
    //check to see min/max angle threshold
    for (i = 0; i < bacteria.length; i++){
      count = 0;
      
      if (bacteria[i].maxAngle - bacteria[i].minAngle >= 1.8 ){
        count++;  
      }
      else if(bacteria[i].maxAngle - bacteria[i].minAngle >= 3.6){
        bigBacteria = true;
      }
      if (count >= 2 || bigBacteria){
        console.log('The bacteria have run rampant! They\'re beyond your control');
        gameIsActive = false;
      }
    }
    
    if (gameIsActive){
      requestAnimationFrame(render);
    }
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
  var degreePerFan = (2 * Math.PI) / (n - 2);
  var vertexData = [x, y]; //origin

  for(var i = 1; i < n; i++) {
    var angle = degreePerFan * (i+1);
    vertexData[i*2] =  circle.x + Math.cos(angle) * circle.r;
    vertexData[(i*2) + 1] = circle.y + Math.sin(angle) * circle.r;
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
}

function StoreCircle(x, y, r, n){
  var circle = {x: x, y:y, r: r};
  var degreePerFan = (2 * Math.PI) / (n - 2);
  var vertexData = [x, y]; //origin

  for(var i = 1; i < n; i++) {
    var angle = degreePerFan * (i+1);
    vertexData[i*2] =  circle.x + Math.cos(angle) * circle.r;
    vertexData[(i*2) + 1] = circle.y + Math.sin(angle) * circle.r;
  }

  return vertexData;
}

//not needed
function StorePoint(x, y){
  var point = {x: x, y:y};
  var vertexData = [];
  vertexData[0] =  point.x;
  vertexData[1] = point.y;

  return vertexData;
}

function click(ev, canvas){
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