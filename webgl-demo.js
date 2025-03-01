import { drawScene } from "./drawscene.js";
import { createBasicTestMesh, parseOBJ } from "./MeshUtils.js";
import { createProgram } from "./shaderworks.js";
import { vec3, mat4 } from "./gl-matrix/index.js";
import { World } from "./World.js";
import { Light } from "./Lights.js";
import { StaticMesh } from "./Mesh.js";
import { importImage } from "./MeshUtils.js";
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
    const T_BC_RobotKafa = await importImage(gl, "resources/M_Robot_Kafa_Base_Color.png");

    const tbotMesh = new StaticMesh(gl, parseOBJ(await (await fetch('./resources/Tbot.obj')).text()), program,T_BC_RobotKafa);

    let world = window.world1 = new World(gl);
    vec3.add(world.camera.Position, world.camera.Position, vec3.fromValues(0, 0, 6));
    
   
    

    window.world1.drawables.push(tbotMesh);

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