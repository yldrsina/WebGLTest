
import { vec3, mat4, mat3, glMatrix,} from "./gl-matrix/index.js";
import { createProgram } from "./shaderworks.js";
import { importImage,parseOBJ } from "./MeshUtils.js";
import { StaticMesh } from "./Mesh.js";
import { TickEventBus } from "./drawscene.js";
import { distance } from "./gl-matrix/vec3.js";
import { scale } from "./gl-matrix/mat2.js";
import { toRadian } from "./gl-matrix/common.js";


export class Gizmo{
/**
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {Float32Array} vertices 
     * @param {Uint16Array} indices 
     * @param {Float32Array} textureCoordinates 
     * @param {Number} program 
     */

constructor(gl,world){
    TickEventBus.addEventListener('tick',this.update.bind(this));
    this.world =world
}
update(){
    const location = vec3.create();
    mat4.getTranslation(location,this.GizmoLocXMesh.transform);
    const scalefloat = distance(this.world.camera.Position, location)/15;
    this.GizmoLocXMesh.setScalePreserveRotationAndPosition(this.GizmoLocXMesh.transform,this.GizmoLocXMesh.transform,scalefloat,scalefloat,scalefloat);
    this.GizmoLocYMesh.setScalePreserveRotationAndPosition(this.GizmoLocYMesh.transform,this.GizmoLocYMesh.transform,scalefloat,scalefloat,scalefloat);
    this.GizmoLocZMesh.setScalePreserveRotationAndPosition(this.GizmoLocZMesh.transform,this.GizmoLocZMesh.transform,scalefloat,scalefloat,scalefloat);
   
}

async CreateGizmo (gl){
    const T_Red = await importImage(gl, "resources/red.png");
    const T_Green = await importImage(gl, "resources/green.png");
    const T_Blue = await importImage(gl, "resources/blue.png");
    this.program = await createProgram(gl, "shaders/VertexShader.glsl?v=1", "shaders/FragmentShader_Unlit.glsl?v=1");
    this.GizmoLocXMesh = new StaticMesh(gl,parseOBJ(await (await fetch('./resources/gizmo.obj?v=0')).text()),this.program,T_Red,null,false,false,false); 
    this.GizmoLocYMesh = new StaticMesh(gl,parseOBJ(await (await fetch('./resources/gizmo.obj?v=0')).text()),this.program,T_Green,null,false,false,false);
    this.GizmoLocZMesh = new StaticMesh(gl,parseOBJ(await (await fetch('./resources/gizmo.obj?v=0')).text()),this.program,T_Blue,null,false,false,false);
    mat4.rotate(this.GizmoLocZMesh.transform,this.GizmoLocZMesh.transform,toRadian(90),vec3.fromValues(0,-1,0));
    mat4.rotate(this.GizmoLocYMesh.transform,this.GizmoLocYMesh.transform,toRadian(90),vec3.fromValues(0,0,1));
   
    

      
}
MakeVisible(){
    console.log("Gizmo Visible");
    if(!this.visibility){
    this.world.AddStaticMesh(this.GizmoLocXMesh);
    this.world.AddStaticMesh(this.GizmoLocYMesh);
    this.world.AddStaticMesh(this.GizmoLocZMesh);
    this.visibility = true;
}
}
MakeHidden(){
    console.log("Gizmo Hidden");
    if(this.visibility){
    this.world.RemoveStaticMesh(this.GizmoLocXMesh);
    this.world.RemoveStaticMesh(this.GizmoLocYMesh);
    this.world.RemoveStaticMesh(this.GizmoLocZMesh);
    this.visibility = false;
}
}

SetLocation(location = vec3.create()){
    
    this.GizmoLocXMesh.transform[12] = location[0];
    this.GizmoLocXMesh.transform[13] = location[1];
    this.GizmoLocXMesh.transform[14] = location[2];
    this.GizmoLocYMesh.transform[12] = location[0];
    this.GizmoLocYMesh.transform[13] = location[1];
    this.GizmoLocYMesh.transform[14] = location[2];
    this.GizmoLocZMesh.transform[12] = location[0];
    this.GizmoLocZMesh.transform[13] = location[1];
    this.GizmoLocZMesh.transform[14] = location[2];
}










}