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
  
var bacteriaCount = 0;


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

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.enableVertexAttribArray(a_Position);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  //create play surface
  var origin = {x: 0.0, y: 0.0, r: 0.5}
  CreateCircle(gl, 0, 0, 0.5, 64);
  gl.uniform4f(u_FragColor, 1, 0, 1, 1);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 64);
  // Draw the rectangle
  
  //create random other circle
  var bacteriaLimit = 3;
  
  //if bacteria count is less than limit, create a new one
  if(bacteriaCount < bacteriaLimit && timer > 500){
    console.log('Drawing circle');
    var angle = Math.floor(Math.random() * 6);
    CreateCircle(gl, (origin.r*Math.cos(91)) + origin.x, (origin.r*Math.sin(91)) + origin.y, 0.05, 64);
    console.log('x: ' + (0.5*Math.cos(90)) + 0.0);
    console.log('y: ' + (0.5*Math.sin(90)) + 0.0);
    gl.uniform4f(u_FragColor, 0, 0, 1, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 64);
    bacteriaCount++;
  }

    console.log('Drawing circle');
    CreateCircle(gl, (0.5*Math.cos(179)) + 0.0, (0.5*Math.sin(179)) + 0.0, 0.05, 64);
    // console.log('x: ' + (0.5*Math.cos(90)) + 0.0);
    // console.log('y: ' + (0.5*Math.sin(90)) + 0.0);
    gl.uniform4f(u_FragColor, 0, 0, 1, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 64);
    bacteriaCount++;


  var tick = function() {
    Time();
    requestAnimationFrame(tick, canvas); // Request that the browser calls tick
  };
  tick();

}

var timer = Date.now();
function Time() {
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - timer;
  if (elapsed > 5){
    console.log(timer + ' true');
    return true;
  }
  else{
    timer = now;
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