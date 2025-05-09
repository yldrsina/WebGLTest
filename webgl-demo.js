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
import { toRadian } from "./gl-matrix/common.js";
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
    var gl = canvas.getContext("webgl2", { stencil: true });
    if (!gl) {
        alert('No WebGL');
    }



    var program = await createProgram(gl, "shaders/VertexShader.glsl?v=1", "shaders/FragmentShader.glsl?v=20");
    var screenprogram = await createProgram(gl, "shaders/VertexShader_Screen.glsl?v=1", "shaders/FragmentShader_Screen.glsl?v=31");
    var unlitprogram = await createProgram(gl, "shaders/VertexShader.glsl?v=1", "shaders/FragmentShader_Unlit.glsl?v=1");
    var lightableprograms = [program];

    gl.useProgram(program);
    if (!program) {
        console.error("Shader program could not be created.");
        return;
    }
    //TEXTURES
    const T_Floor = await importImage(gl, "resources/floor.jpg");
    const T_UVSample = await importImage(gl, "resources/texturesampleuv.jpg");
    const T_astronot = await importImage(gl, "resources/astronotBC.png");
    const T_backpack = await importImage(gl, "resources/backpack.png");
    const T_house = await importImage(gl, "resources/T_Building_BC.png");
    //MESHES
    const planemesh = new StaticMesh(gl, parseOBJ(await (await fetch('./resources/plane.obj?v=1')).text()), program, T_Floor);
    planemesh.name = "floor";
    const astronotmesh = new StaticMesh(gl, parseOBJ(await (await fetch('./resources/astronot.obj?v=0')).text()), program, T_astronot);
    astronotmesh.name = "astronot";
    mat4.translate(astronotmesh.transform, astronotmesh.transform, vec3.fromValues(0, 0, 2));
    const backpackmesh = new StaticMesh(gl, parseOBJ(await (await fetch('./resources/backpack.obj?v=1')).text()), program, T_backpack);
    
    backpackmesh.name = "backpack";
    mat4.translate(backpackmesh.transform, backpackmesh.transform, vec3.fromValues(5, 0, -4));
    mat4.scale(backpackmesh.transform, backpackmesh.transform, vec3.fromValues(15, 15, 15));
    mat4.rotateY(backpackmesh.transform, backpackmesh.transform, toRadian(170));
    const housemesh = new StaticMesh(gl, parseOBJ(await (await fetch('./resources/ev.obj?v=1')).text()), program, T_house);
    mat4.translate(housemesh.transform,housemesh.transform,vec3.fromValues(-10,0,8));
    mat4.rotateY(housemesh.transform, housemesh.transform, toRadian(135));
    mat4.scale ( housemesh.transform,housemesh.transform,vec3.fromValues(2.2,2.2,2.2));
    housemesh.name = "house";

    //LIGHTS





    // WORLD
    let world = window.world1 = new World(gl, screenprogram);
    //GIZMO
    const gizmo = new Gizmo(gl, world);
    await gizmo.CreateGizmo(gl);

    vec3.add(world.camera.Position, world.camera.Position, vec3.fromValues(0, 2, 55));

    window.world1.translateObject(planemesh, vec3.fromValues(0, -1, 0));
    mat4.scale(planemesh.transform, planemesh.transform, vec3.fromValues(12, 12, 12));

    //MODEL IMPORTER
    const modelimporter = new ModelImporter(gl, world, program, T_UVSample, gizmo, unlitprogram);


    window.world1.AddStaticMesh(planemesh);
    window.world1.AddStaticMesh(astronotmesh);
    window.world1.AddStaticMesh(backpackmesh);
    window.world1.AddStaticMesh(housemesh);

    modelimporter.UpdateOutliner(gl, window.world1, program, T_UVSample, gizmo);


    drawScene(gl, window.world1, screenprogram, lightableprograms);
}





main();