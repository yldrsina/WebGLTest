import { drawScene } from "./drawscene.js";
import { setGeometry } from "./SetMesh.js";
import { createProgram } from "./shaderworks.js";
import {vec3, mat4, glMatrix} from "./gl-matrix/index.js";

async function main() {
    var canvas = document.querySelector("#gl-canvas");
    /**
     * @type {WebGL2RenderingContext}
     */
    var gl = canvas.getContext("webgl");
    if (!gl) {
        alert('No WebGL');
    }

    var program = await createProgram(gl, "./VertexShader.glsl", "./FragmentShader.glsl");
    gl.useProgram(program);

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    if (true) {
        var modelLoc = gl.getUniformLocation(program, "model");
        if (modelLoc === null)
            console.error("modelloc uniform invalid.")
        var viewLoc = gl.getUniformLocation(program, "view");
        if (viewLoc === null)
            console.error("viewloc uniform invalid.");
        var projectionLoc = gl.getUniformLocation(program, "projection");
        if (projectionLoc === null)
            console.error("projectloc uniform invalid.");




        var model = mat4.create();
        mat4.rotate(model, model, glMatrix.toRadian(-55), vec3.fromValues(1, 0, 0));

        var view = mat4.create();
        var projection = mat4.create();
        mat4.translate(view, view, vec3.fromValues(0, 0, -3));
        mat4.perspective(projection, glMatrix.toRadian(45), gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100);
        gl.uniformMatrix4fv(modelLoc, false, model);
        console.log("model uniform passed", model);
        gl.uniformMatrix4fv(viewLoc, false, view);
        console.log("view uniform passed", view)
        gl.uniformMatrix4fv(projectionLoc, false, projection);
        console.log("projection uniform passed", projection);
    }


    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    setGeometry(gl);

    drawScene(gl, program, positionAttributeLocation, positionBuffer, indexBuffer);
}





main();