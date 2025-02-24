
/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {*} program 
 * @param {Number} positionLocation 
 * @param {WebGLBuffer} positionBuffer 
 * @param {WebGLBuffer} indexBuffer 
 */
export function drawScene(gl, program, positionLocation, positionBuffer, indexBuffer) {
    gl.clearColor(0.2, 0.3, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //gl.enable(gl.CULL_FACE);
    //gl.enable(gl.DEPTH_TEST);

    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    console.log({ positionLocation, positionBuffer, indexBuffer });

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    var indexType = gl.UNSIGNED_SHORT;
    gl.drawElements(primitiveType, count, indexType, offset);
    console.log("Draw Scene Complete")

}