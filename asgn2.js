var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
      gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;  // uniform変数
  void main() {
    gl_FragColor = u_FragColor;
    }`

let canvas;
let gl;
let a_Position;
let u_FragColor;
let red = 1;
let blue = 0;
let green = 0;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let angle = 0;
let legAngle = 0;
let armAngle = 0;
let leftFeetAngle = 0;
let rightFeetAngle = 0;
let animationOn = false;
let alt = false

function main() {

  setupWebGL();
  if (!setupWebGL()) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  connectVariablesToGLSL();

  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  if (!u_ModelMatrix)
  {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }
  if (!u_GlobalRotateMatrix)
  {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  getSliderValue();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  requestAnimationFrame(tick);
}

function setupWebGL()
{
  canvas = document.getElementById('asgn2');
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl)
  {
    return false;
  }
  gl.enable(gl.DEPTH_TEST);
  return true;
}

function connectVariablesToGLSL ()
{
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  u_ModelMatrix= gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, "u_GlobalRotateMatrix")
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

function getSliderValue()
{
  document.getElementById('leg').addEventListener('mousemove', function() {legAngle= this.value; renderScene(); });
  document.getElementById('arm').addEventListener('mousemove', function() {armAngle= this.value; renderScene(); });
  document.getElementById('Lfeet').addEventListener('mousemove', function() {leftFeetAngle= this.value; renderScene(); });
  document.getElementById('Rfeet').addEventListener('mousemove', function() {rightFeetAngle= this.value; renderScene(); });
  document.getElementById('camera_angle').addEventListener('mousemove', function() {angle= -this.value; renderScene(); });
  canvas.onmousemove = function(ev) { if (ev.buttons == 1) {rotateByMouse(ev)}};
  canvas.onclick = function(ev) { if (window.event.shiftKey && !alt) 
    {
      alt = true; 
      tick();
    }
    else if (window.event.shiftKey && alt)
    {
      alt = false;
    }
  };

}

function getColorValue(colors)
{
  colors.push([document.getElementById('leg_red').value/100, document.getElementById('leg_green').value/100, document.getElementById('leg_blue').value/100,1]);
  colors.push([document.getElementById('body_red').value/100, document.getElementById('body_green').value/100, document.getElementById('body_blue').value/100,1]);
  colors.push([document.getElementById('arm_red').value/100, document.getElementById('arm_green').value/100, document.getElementById('arm_blue').value/100,1]);
  colors.push([document.getElementById('feet_red').value/100, document.getElementById('feet_green').value/100, document.getElementById('feet_blue').value/100,1]);
}

function rotateByMouse(ev)
{
  angle= -ev.clientX;
  renderScene();
}


function clearCanvas()
{
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function animation()
{
  if (animationOn)
  {
    animationOn = false
  }
  else
  {
    animationOn = true
  }
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

function tick()
{
  g_seconds = performance.now()/1000-g_startTime;
  renderScene();
  requestAnimationFrame(tick);
}
  

function renderScene()
{
  var colors = [];// leg = 0, body = 1, arm =2, feet =3
  getColorValue(colors);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  var globalRotMat = new Matrix4().rotate(angle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  var head = new Cube();
  head.color = [0.3,0.1,0.3];
  head.matrix.translate(-0.14, 0.5, 0.0);
  head.matrix.scale(0.3,0.2,0.35);
  head.render();

  var body = new Cube();
  body.color = colors[1];
  body.matrix.setTranslate(-0.25, -0.2, -0.1);
  body.matrix.scale(0.5,0.7,0.5);
  body.render();

  arm(colors[2], body.matrix);
  leg(colors[0], colors[3], body.matrix);

  renderCone();

}

function arm(armColor, body)
{
  var leftArm = new Cube();
  leftArm.color = armColor;
  leftArm.matrix.translate(0.25, 0.5, 0.27);
  if (animationOn && !alt)
  {
    leftArm.matrix.rotate(50*Math.sin(g_seconds),1,0,0);
  }
  else if (animationOn && alt)
  {
    leftArm.matrix.rotate(40*Math.sin(g_seconds),0,0,1);
    leftArm.matrix.rotate(40, 0,0,1);
  }
  else
  {
    leftArm.matrix.rotate(armAngle,1,0,0);
  }
  leftArm.matrix.rotate(180,1,0,0);
  var attachLeftArm = new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(0.1,0.4,0.1);
  leftArm.render();

  var rightArm = new Cube();
  rightArm.color = armColor;
  rightArm.matrix.translate(-0.25, 0.5, 0.10);
  if (animationOn&& !alt)
  {
    rightArm.matrix.rotate(-20*Math.sin(g_seconds),1,0,0);

  }
  else if (animationOn && alt)
  {
    rightArm.matrix.rotate(-40*Math.sin(g_seconds),0,0,1);
    rightArm.matrix.rotate(-40, 0,0,1);
  }
  else
  {
    rightArm.matrix.rotate(-armAngle,1,0,0);
  }
  rightArm.matrix.rotate(180,0,0,1);
  var attachRightArm = new Matrix4(rightArm.matrix);
  rightArm.matrix.scale(0.1,0.4,0.1);
  rightArm.render();

  var leftArm2nd = new Cube();
  leftArm2nd.color = [0.6,0.1,0.3];
  leftArm2nd.matrix = attachLeftArm;
  var attachLeftHand = leftArm2nd.matrix;
  leftArm2nd.matrix.translate(0, 0.4, 0);
  leftArm2nd.matrix.rotate(20,1,0,0);
  leftArm2nd.matrix.scale(0.1,0.4,0.1);
  leftArm2nd.render();

  var rightArm2nd = new Cube();
  rightArm2nd.color = [0.6,0.1,0.3];
  rightArm2nd.matrix = attachRightArm;
  var attachRightHand = rightArm2nd.matrix;
  rightArm2nd.matrix.translate(0.1, 0.4, 0.1);
  rightArm2nd.matrix.rotate(-20,1,0,0);
  rightArm2nd.matrix.rotate(180,0,1,0);
  rightArm2nd.matrix.scale(0.1,0.4,0.1);
  rightArm2nd.render();

  var leftHand = new Cube();
  leftHand.color = armColor;
  leftHand.matrix = attachLeftHand;
  leftHand.matrix.translate(0, 1, -0.5);
  leftHand.matrix.scale(1,0.5,2);
  leftHand.render();

  var rightHand = new Cube();
  rightHand.color = armColor;
  rightHand.matrix = attachRightHand;
  rightHand.matrix.translate(0, 1, -0.5);
  rightHand.matrix.scale(1,0.5,2);
  rightHand.render();
}

function leg(thighColor, feetColor, body)
{
  var leftThigh = new Cube();
  leftThigh.color = thighColor;
  leftThigh.matrix = new Matrix4(body);
  leftThigh.matrix.translate(0.4, 0, 0.3);
  if (animationOn && !alt)
  {
    leftThigh.matrix.rotate(30*Math.sin(g_seconds),1,0,0);
  }
  else if (animationOn && alt)// suprise animation
  {
    leftThigh.matrix.rotate(-30*Math.sin(g_seconds),1,0,0);
  }
  else
  {
    leftThigh.matrix.rotate(legAngle,1,0,0);
  }  
  leftThigh.matrix.rotate(180,0,0,1);
  var attachLeftFeet = new Matrix4(leftThigh.matrix);
  leftThigh.matrix.scale(0.30,0.6,0.25);
  leftThigh.render();

  var rightThigh = new Cube();
  rightThigh.color = thighColor;
  rightThigh.matrix = new Matrix4(body);
  rightThigh.matrix.translate(0.9, 0, 0.3);
  if (animationOn && !alt)
  {
    rightThigh.matrix.rotate(-30*Math.sin(g_seconds),1,0,0);
  }
  else if (animationOn && alt)// suprise animation
  {
    rightThigh.matrix.rotate(30*Math.sin(g_seconds),1,0,0);
  }
  else
  {
    rightThigh.matrix.rotate(-legAngle,1,0,0);
  }
  rightThigh.matrix.rotate(180,0,0,1);
  var attacRightFeet = new Matrix4(rightThigh.matrix);
  rightThigh.matrix.scale(0.30,0.6,0.25);
  rightThigh.render();

  var leftFeet = new Cube();
  leftFeet.color = feetColor;
  leftFeet.matrix = attachLeftFeet;
  leftFeet.matrix.translate(0.3, 0.6, 0.25);
  leftFeet.matrix.rotate(leftFeetAngle,1,0,0);
  leftFeet.matrix.rotate(180,0,1,0);
  leftFeet.matrix.scale(0.3,0.1,0.4);
  leftFeet.render();

  var rightFeet = new Cube();
  rightFeet.color = feetColor;
  rightFeet.matrix = attacRightFeet;
  rightFeet.matrix.translate(0.3, 0.6, 0.25);
  rightFeet.matrix.rotate(rightFeetAngle,1,0,0);
  rightFeet.matrix.rotate(180,0,1,0);
  rightFeet.matrix.scale(0.3,0.1,0.4);
  rightFeet.render();
}
function renderCone()
{
  var segment = 360;

  for (var i = 0; i<segment; i++)
  {
    var temp = new Cube();
    temp.matrix.scale(0.2,0.3,0.2);
    temp.matrix.translate(0,2.31,0.4);
    temp.matrix.rotate((360/segment)*i,0,1,0);
    temp.cone();
  
  }
}
