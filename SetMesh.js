export function setGeometry(gl) {
    var positions = new Float32Array([
        // positions          // texture coords
        0.5, 0.5, 0.0,  // top right
        0.5, -0.5, 0.0,    // bottom right
        -0.5, -0.5, 0.0,    // bottom left
        -0.5, 0.5, 0.0,     // top left 
    ]);
    var indicies = [
        0, 1, 3, //first triangle
        1, 2, 3  //second triangle
    ];
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicies), gl.STATIC_DRAW);
}
