import { drawScene } from "./drawscene.js";
import { parseOBJ } from "./MeshUtils.js";
import { createProgram } from "./shaderworks.js";
import { vec3, mat4, glMatrix } from "./gl-matrix/index.js";
import { World } from "./World.js";
import { DirectioanalLight, SpotLight } from "./Lights.js";
import { StaticMesh } from "./Mesh.js";
import { importImage } from "./MeshUtils.js";
import { InputSystem } from "./Input.js";
import { Gizmo } from "./gizmo.js";
import { ModelImporter } from "./modelImporter.js";
async function main() {
    /**
     * @type {HTMLCanvasElement}
     */
    var canvas = document.querySelector("#gl-canvas");
    

    InputSystem.create(canvas);

    canvas.addEventListener("click", async () => {
        await canvas.requestPointerLock({
            unadjustedMovement: true
        });
    })
    /**
     * @type {WebGL2RenderingContext}
     */
    var gl = canvas.getContext("webgl2",{stencil:true});
    if (!gl) {
        alert('No WebGL');
    }
   
    

    var program = await createProgram(gl, "shaders/VertexShader.glsl?v=1", "shaders/FragmentShader.glsl?v=16");
    var screenprogram = await createProgram(gl, "shaders/VertexShader_Screen.glsl?v=1", "shaders/FragmentShader_Screen.glsl?v=30");
    
    gl.useProgram(program);
    if (!program) {
        console.error("Shader program could not be created.");
        return;
    }
    const T_Floor = await importImage(gl, "resources/floor.jpg");
    const T_UVSample = await importImage(gl, "resources/texturesampleuv.jpg");
    //MESHES
    const planemesh = new StaticMesh(gl, parseOBJ(await (await fetch('./resources/plane.obj?v=1')).text()), program,T_Floor);
    planemesh.name = "floor";
   

    //LIGHTS
    




    // WORLD
    let world = window.world1 = new World(gl,screenprogram);
    //GIZMO
    const gizmo = new Gizmo(gl,world);
    await gizmo.CreateGizmo(gl);

    vec3.add(world.camera.Position, world.camera.Position, vec3.fromValues(0, 2, 6));
   
    window.world1.translateObject(planemesh,vec3.fromValues(0,-1,0));
    mat4.scale(planemesh.transform,planemesh.transform,vec3.fromValues(4,4,4));
    
    //MODEL IMPORTER
    const modelimporter = new ModelImporter(gl,world,program,T_UVSample,gizmo);

   
    window.world1.AddStaticMesh(planemesh);
    



    drawScene(gl, window.world1,screenprogram);
}





main();