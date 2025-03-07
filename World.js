import { Camera } from "./CameraClass.js";
import { vec3, mat4 } from "./gl-matrix/index.js";

export class World{
    
    constructor(gl){
        this.drawables = [];
        this.lights = [];
        this.camera = new Camera(gl);
        
    }

translateObject(mesh,vec3translate=vec3.fromValues(0,0,0)){
    var transform = mat4.create();
    mat4.translate(transform,transform,vec3translate);
    mat4.multiply(mesh.transform,transform,mesh.transform);
   
}

GetPrograms() {
    var programs =[];
this.drawables.forEach(element => {
    programs.push(element.program);   
});
return programs;
}
AddStaticMesh(mesh){
    // Push Mesh
    this.drawables.push(mesh);
    this.lights.forEach(light => {
        light.setLightUniformsandDraw(mesh.program);
    });
    // Set Lighting info of mesh.
}
AddLight (light) {
    this.lights.push(light);
    this.drawables.push(light.mesh);
    var programs = this.GetPrograms();
    programs.forEach(program => {
        light.setLightUniformsandDraw(program);
        
    });

}
}

