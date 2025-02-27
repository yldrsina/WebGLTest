
import { vec3, mat4, glMatrix } from "./gl-matrix/index.js";

export class Light {
    lightcolor = vec3.fromValues(1,1,1);
    mesh;

    constructor(gl,program,mesh){
        this.gl =gl;
        this.program=program;
        this.mesh =mesh;
    }


    
}