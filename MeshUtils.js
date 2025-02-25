import { StaticMesh } from "./Mesh.js";
import { mat4,glMatrix,vec3 } from "./gl-matrix/index.js";

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {Number} program 
 * @returns {StaticMesh}
 */
export async function createBasicTestMesh(gl, program) {
    var positions = new Float32Array([
        // positions          // texture coords
        0.5, 0.5, 0.0, 1.0, 1.0, // top right
        0.5, -0.5, 0.0, 1.0, 0.0, // bottom right
        -0.5, -0.5, 0.0, 0.0, 0.0, // bottom left
        -0.5, 0.5, 0.0, 0.0, 1.0  // top left 
    ]);
    var indicies = new Uint16Array([
        0, 3, 1,//first triangle
        1, 3, 2  //second triangle
    ]);
    const texture = await importImage(gl, "resources/texturesampleuv.jpg");
    const sm = new StaticMesh(gl, positions, indicies, program, (view, projection) => {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
    });
    mat4.rotate(sm.transform, sm.transform, glMatrix.toRadian(-55.0), vec3.fromValues(1, 0, 0));
    mat4.translate(sm.transform, sm.transform, vec3.fromValues(0, 0, 0));
    return sm;
}
/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {string} imagesource 
 * @returns 
 */
export async function importImage(gl, imagesource) {
    var image = new Image();
    image.src = imagesource;
    return new Promise((resolve, reject) => {
        image.onload = () => {
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.bindTexture(gl.TEXTURE_2D, null);
            resolve(texture);
        }
        image.onerror = (err) => reject(err);
    })
}
