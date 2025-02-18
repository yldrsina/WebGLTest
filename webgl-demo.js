import { setGeometry } from "./F_LetterGeometry.js";
import { createProgram } from "./shaderworks.js";

async function main() {
  var canvas = document.querySelector("#gl-canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
     alert('No WebGL');
  }

var program = await createProgram(gl,"./VertexShader.glsl","./FragmentShader.glsl");

var positionAttributeLocation = gl.getAttribLocation(program,"a_position");

var colorLocation = gl.getAttribLocation(program, "a_position");

var matrixLocation =gl.getUniformLocation(program, "u_matrix");


var positionBuffer =gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);

setGeometry(gl);
var colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);



var positions = [
  0, 0,
  0, 0.5,
  0.7, 0,
];
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(positions),gl.STATIC_DRAW);





gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program);
gl.enableVertexAttribArray(positionAttributeLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);

// draw
var primitiveType = gl.TRIANGLES;
var offset = 0;
var count = 3;
gl.drawArrays(primitiveType, offset, count);


}





main();