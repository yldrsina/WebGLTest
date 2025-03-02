import { drawScene } from "./drawscene.js";
import { createBasicTestMesh, parseOBJ } from "./MeshUtils.js";
import { createProgram } from "./shaderworks.js";
import { vec3, mat4, glMatrix } from "./gl-matrix/index.js";
import { World } from "./World.js";
import { DirectioanalLight, SpotLight } from "./Lights.js";
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

    var program = await createProgram(gl, "./VertexShader.glsl", "./FragmentShader.glsl?v=4");
    gl.useProgram(program);
    if (!program) {
        console.error("Shader program could not be created.");
        return;
    }
    const T_BC_RobotKafa = await importImage(gl, "resources/M_Robot_Kafa_Base_Color.png");
    const T_UvSample = await importImage(gl, "resources/texturesampleuv.jpg");

    const tbotMesh = new StaticMesh(gl, parseOBJ(await (await fetch('./resources/Tbot.obj')).text()), program,T_BC_RobotKafa);
    const directionallightmesh = new StaticMesh(gl, parseOBJ(await (await fetch('./resources/directionalLight.obj?v=2')).text()), program,T_UvSample);
    const spotlightmesh =new StaticMesh(gl, parseOBJ(await (await fetch('./resources/spotLight.obj?v=1')).text()), program,T_UvSample);
    
    const DirectionalLight1=  new DirectioanalLight(gl,program,directionallightmesh);
    const SpotLight1= new SpotLight(gl,program,spotlightmesh,vec3.fromValues(0,0,0),1,0.09,0.032,Math.cos(glMatrix.toRadian(12.5)),Math.cos(glMatrix.toRadian(15.0)));
    
    




    let world = window.world1 = new World(gl);
    vec3.add(world.camera.Position, world.camera.Position, vec3.fromValues(0, 0, 6));
    window.world1.translateObject(DirectionalLight1.mesh,vec3.fromValues(2,2,0));
    window.world1.translateObject(SpotLight1.mesh,vec3.fromValues(-2,1,0));
    SpotLight1.draw();
    
   
    

    window.world1.drawables.push(tbotMesh);
    window.world1.drawables.push(DirectionalLight1.mesh);
    window.world1.drawables.push(SpotLight1.mesh);

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