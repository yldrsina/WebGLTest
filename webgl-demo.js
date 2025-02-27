import { drawScene } from "./drawscene.js";
import { createBasicTestMesh, parseOBJ } from "./MeshUtils.js";
import { createProgram } from "./shaderworks.js";
import { vec3, mat4 } from "./gl-matrix/index.js";
import { World } from "./World.js";
import {Light} from "./Lights.js";
async function main() {
    /**
     * @type {HTMLCanvasElement}
     */
    var canvas = document.querySelector("#gl-canvas");

    canvas.addEventListener("click", async () => {
        await canvas.requestPointerLock({
            unadjustedMovement: true
        });
    })
    /**
     * @type {WebGL2RenderingContext}
     */
    var gl = canvas.getContext("webgl");
    if (!gl) {
        alert('No WebGL');
    }

    var program = await createProgram(gl, "./VertexShader.glsl", "./FragmentShader.glsl");
    gl.useProgram(program);
    if (!program) {
        console.error("Shader program could not be created.");
        return;
    }
    const Tbot = await (await fetch ('./resources/Tbot.obj')).text();
    parseOBJ(Tbot);
    
    let world = window.world1 = new World(gl);
    vec3.add(world.camera.Position, world.camera.Position, vec3.fromValues(0, 0, 5));
    let light1 = new Light(gl,program,await createBasicTestMesh(gl, program));

    mat4.translate(light1.mesh.transform,light1.mesh.transform, vec3.fromValues(1.2,1,2));
    mat4.scale(light1.mesh.transform,light1.mesh.transform,vec3.fromValues(1,1,1) );
    window.world1.drawables.push(await createBasicTestMesh(gl, program));
    const otherDrawable = await createBasicTestMesh(gl, program);
    window.world1.drawables.push(otherDrawable);
    window.world1.drawables.push(light1.mesh);
    mat4.translate(otherDrawable.transform, otherDrawable.transform, vec3.fromValues(1, 1, 0));
    
    canvas.addEventListener("mousemove",
        /**
         * 
         * @param {MouseEvent} event 
         */
        (event) => {
            world.camera.processRotation(event);
        });

    drawScene(gl, window.world1);
}





main();