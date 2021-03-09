// RotatingTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';


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

  // canvas.onmousedown = function(ev){ click(ev, gl, canvas, a_Position); };

  //Set vertex position to attribute variable
  gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

  // Write the positions of vertices to a vertex shader
  var n = initCircleFanBuffers(gl);
  n = 190;
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }
  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}

function initCircleFanBuffers(gl) {
  
  var playSurface = CreateCircle(0, 0, 0.5, 64);
  var testSecondCircle = CreateCircle(0.7, 0.7, 0.01, 64);
  var testThirdCircle = CreateCircle(-0.7, 0.7, 0.01, 64);

  //var bacteriaSpots = [testSecondCircle, testThirdCircle];
  var bacteria = testSecondCircle.concat(testThirdCircle);

  // bacteriaSpots.forEach(i => {
  //   bacteria.push(i);
  // });

  

  //console.log(vertexData);
  var vertexDataTyped = new Float32Array(playSurface.concat(bacteria));
  
  console.log(vertexDataTyped.length);

  //vertexDataTyped.subarray(CreateCircle(0, 0, 0.5, 64));
  
  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object for triangle fan');
    return -1;
  }
  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertexDataTyped, gl.STATIC_DRAW);
  
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position in Triangle Fan Buffer');
    return -1;
  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);
  
  return vertexDataTyped.length;
}

function CreateCircle(x, y, r, n){
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


// var g_points = [];
// function click(ev, gl, canvas, a_Position){
//   var x = ev.clientX;
//   var y = ev.clientY;
//   var rect = ev.target.getBoundingClientRect();

//   x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
//   y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

//   g_points.push(x);
//   g_points.push(y);

//   gl.clear(gl.COLOR_BUFFER_BIT);

//   var len = g_points.length;
//   for(var i = 0; i < len; i += 2){
//     gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);

//     gl.drawArrays(gl.POINTS, 0, 1);
//   }
// }