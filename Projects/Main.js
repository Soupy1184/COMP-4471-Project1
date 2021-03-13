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

  //create a limit for new bacteria
  var bacteriaLimit = 3; 

  var bacteria = []; //stores current bacteria on the board;

  var el = 0;

  //LOOP
  function render(time) {
    time *= 0.001;  // convert to seconds
    Time();

    canvas.onmousedown = function(ev){ click(ev, canvas, bacteria); };

    //play surface
    CreateCircle(gl, 0, 0, 0.5, 32); 
    gl.uniform4f(u_FragColor, 0, 0, 0, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 32);

    // tell the shader the time
    gl.uniform1f(timeLoc, time);
    
    // grow the bacteria using the time passed as a parameter for how much to grow on that frame
    for(i = 0; i < bacteria.length; i++){
      bacteria[i].growthFunction(time - el);
    }

    
    //document.getElementById('disp').innerHTML = time + "<br>" + (time - el) ;
    



    //check for bacteria conllision
    for (i = 0; i < bacteria.length - 1; i++){
      for(j = i + 1; j < bacteria.length; j++) {
        if(bacteria[j].isWithin(bacteria[i].minAngle)) {  //bac[i] is inside bac[j]
          //console.log("bac j: " + bacteria[j].getSize() + "\tbac i" + bacteria[i].getSize());
          //console.log(bacteria); 
          if(bacteria[j].getSize() > bacteria[i].getSize()) { // if bac[j] > bac[i]
            bacteria.splice(i, 1); //remove bac[i]
          } else {
            bacteria.splice(j, 1); //remove bac[j]
          }
        } else if(bacteria[j].isWithin(bacteria[i].maxAngle)) {
          //console.log("bac j: " + bacteria[j].getSize() + "\tbac i" + bacteria[i].getSize());
          //console.log(bacteria); 
          if(bacteria[j].getSize() > bacteria[i].getSize()) { // if bac[j] > bac[i]
            bacteria.splice(i, 1); //remove bac[i]
          } else {
            bacteria.splice(j, 1); //remove bac[j]
          }
        }
      }
    }

    //create new starting bacteria
    if(bacteria.length < bacteriaLimit && (elapsed + 1) % 4 == 0){
      console.log('Drawing new bacteria on the board');

      //try 16 times to create a bacteria not within other bacteria
      //if one is not found, give up
      var insideBac = true;
      for(i = 0; i < 10 && insideBac; i++) {
        insideBac = false;
        var angle = Math.floor(Math.random() * 2 * Math.PI);
        for(j = 0; j < bacteria.length; j++) {
          if(bacteria[j].isWithin(angle)) {
            insideBac = true;
          }
        }
      }
      if(!insideBac) {
        bacteria.push(new Bacteria(angle, [Math.random(), Math.random(), Math.random(), (Math.random()*0.5)+0.5], 0.05));
      }

      console.log(bacteria); 
    }

    //draw all bacteria
      for (i = 0; i < bacteria.length; i++){
        //draw edge circles
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bacteria[i].edges[0]), gl.STATIC_DRAW);
        gl.uniform4f(u_FragColor, bacteria[i].r, bacteria[i].g, bacteria[i].b, bacteria[i].a);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 12);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bacteria[i].edges[1]), gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 12);

        //draw middle growth verts
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bacteria[i].growthVerts), gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, Math.floor(bacteria[i].growthVerts.length / 2.0));
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

    el = time;
    
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

function click(ev, canvas, bacteria){
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  var target = 0;
  for (i = 0; i < bacteria.length; i++){
    /*
    for (j = 0; j < bacteria.originCoords.length; j++){
      var distance = EuclideanDistance([x, y], bacteria.originCoords[j]);
      if (distance < 0.05){
        bacteria[i].kill(j);
        console.log('Bacteria killed at -> x: ' + x + ', y: ' + y);
        break;
      }
    }*/

  }
  
}

//NOTES:
  //create a new point
  //var testPoint = StorePoint(0.9, 0.9);
  //console.log(testPoint[1]);
  //gl.vertexAttrib3f(a_Position, testPoint[0], testPoint[1], 0.0);
  //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(testPoint), gl.STATIC_DRAW);
  //gl.drawArrays(gl.POINTS, 0, 1);