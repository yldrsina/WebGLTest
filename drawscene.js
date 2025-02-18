function drawScene(gl,program,positionLocation,positionBuffer,colorLocation) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer( positionLocation, size, type, normalize, stride, offset);
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    var size = 3;                 // 3 components per iteration
    var type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
    var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
    var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;               // start at the beginning of the buffer
    gl.vertexAttribPointer(
        colorLocation, size, type, normalize, stride, offset);




}