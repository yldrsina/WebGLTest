import { Camera } from "./CameraClass.js";
import { vec3, mat4 } from "./gl-matrix/index.js";

export class World{
    
    constructor(gl){
        this.drawables = [];
        this.camera = new Camera(gl);
    }

translateObject(mesh,vec3translate=vec3.fromValues(0,0,0)){
    var transform = mat4.create();
    mat4.translate(transform,transform,vec3translate);
    mat4.multiply(mesh.transform,transform,mesh.transform);
   
}


}