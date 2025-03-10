import { drawScene } from "./drawscene.js";
import { parseOBJ } from "./MeshUtils.js";
import { createProgram } from "./shaderworks.js";
import { vec3, mat4, glMatrix } from "./gl-matrix/index.js";
import { World } from "./World.js";
import { DirectioanalLight, SpotLight } from "./Lights.js";
import { StaticMesh } from "./Mesh.js";
import { importImage } from "./MeshUtils.js";
import { InputSystem } from "./Input.js";
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
   
    

    var program = await createProgram(gl, "shaders/VertexShader.glsl?v=1", "shaders/FragmentShader.glsl?v=10");
    var programoutline = await createProgram(gl, "shaders/VertexShader.glsl?v=1", "shaders/FragmentShaderoutline.glsl?v=13");
    var programedvarlogo = await createProgram(gl, "shaders/VertexShader.glsl?v=1", "shaders/FragmentShader_Masked.glsl?v=12");
    var screenprogram = await createProgram(gl, "shaders/VertexShader_Screen.glsl?v=1", "shaders/FragmentShader_Screen.glsl?v=22");
    gl.useProgram(program);
    if (!program) {
        console.error("Shader program could not be created.");
        return;
    }
    //TEXTURES
    const T_BC_RobotKafa = await importImage(gl, "resources/M_Robot_Kafa_Base_Color.png");
    const T_UvSample = await importImage(gl, "resources/texturesampleuv.jpg");
    const T_Floor = await importImage(gl, "resources/floor.jpg");
    const T_EdvarLogo = await importImage(gl, "resources/edvar_logo.png");
    const T_Window = await importImage(gl, "resources/transparent_window.png");
    //MESHES
    const tbotMesh = new StaticMesh(gl, parseOBJ(await (await fetch('./resources/Tbot.obj')).text()), program,T_BC_RobotKafa,programoutline, false);
    const directionallightmesh = new StaticMesh(gl, parseOBJ(await (await fetch('./resources/directionalLight.obj?v=2')).text()), program,T_UvSample);
    const spotlightmesh =new StaticMesh(gl, parseOBJ(await (await fetch('./resources/spotLight.obj?v=1')).text()), program,T_UvSample);
    const planemesh = new StaticMesh(gl, parseOBJ(await (await fetch('./resources/plane.obj?v=1')).text()), program,T_Floor);
    const edvarlogomesh = new StaticMesh(gl, parseOBJ(await (await fetch('./resources/plane.obj?v=1')).text()), programedvarlogo,T_EdvarLogo);
    const windowmesh = new StaticMesh(gl, parseOBJ(await (await fetch('./resources/plane.obj?v=1')).text()), program,T_Window,null,false,true);
    //LIGHTS
    const DirectionalLight1=  new DirectioanalLight(gl,directionallightmesh);
    const SpotLight1= new SpotLight(gl,spotlightmesh,vec3.fromValues(1,-2,0),1,0.09,0.032,Math.cos(glMatrix.toRadian(12.5)),Math.cos(glMatrix.toRadian(15.0)));
    
    SpotLight1.ambient = vec3.fromValues(0,0,0);
    SpotLight1.diffuse = vec3.fromValues(1.6,0.2,0.2);
    SpotLight1.specular = vec3.fromValues(1,1,1);




    // WORLD
    let world = window.world1 = new World(gl,screenprogram);
    vec3.add(world.camera.Position, world.camera.Position, vec3.fromValues(0, 2, 6));
    window.world1.translateObject(DirectionalLight1.mesh,vec3.fromValues(2,3,0));
    window.world1.translateObject(SpotLight1.mesh,vec3.fromValues(-2,3,0));
    window.world1.translateObject(tbotMesh,vec3.fromValues(0,1,0));
    window.world1.translateObject(planemesh,vec3.fromValues(0,-1,0));
    window.world1.translateObject(edvarlogomesh,vec3.fromValues(2,0,-1));
    window.world1.translateObject(windowmesh,vec3.fromValues(-3,0.5,-3));
    mat4.scale(edvarlogomesh.transform,edvarlogomesh.transform,vec3.fromValues(0.5,0.3,0.5));
    mat4.scale(windowmesh.transform,windowmesh.transform,vec3.fromValues(0.3,0.3,0.3));
    mat4.rotate(edvarlogomesh.transform,edvarlogomesh.transform,glMatrix.toRadian(60),vec3.fromValues(1,0,0));
    mat4.rotate(windowmesh.transform,windowmesh.transform,glMatrix.toRadian(90),vec3.fromValues(1,0,0));
    mat4.scale(planemesh.transform,planemesh.transform,vec3.fromValues(4,4,4));
    
    
   
    
    
    window.world1.AddLight(DirectionalLight1);
    window.world1.AddLight(SpotLight1);
    window.world1.AddStaticMesh(planemesh);
    window.world1.AddStaticMesh(tbotMesh);
    window.world1.AddStaticMesh(windowmesh);
    window.world1.AddStaticMesh(edvarlogomesh);


    // canvas.addEventListener("mousemove",
    //     /**
    //      * 
    //      * @param {MouseEvent} event 
    //      */
    //     (event) => {
    //         world.camera.processRotation(event);
    //     });

    drawScene(gl, window.world1,screenprogram);
}





main();