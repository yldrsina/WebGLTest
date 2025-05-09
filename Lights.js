
import { toRadian } from "./gl-matrix/common.js";
import { vec3, mat4, glMatrix,quat } from "./gl-matrix/index.js";
import { fromEuler } from "./gl-matrix/quat.js";
import { fromRotationTranslation } from "./gl-matrix/quat2.js";

class Light {
    /**
     * @param {WebGL2RenderingContext} gl 
     */
    ambient = vec3.fromValues(0.05, 0.05, 0.05);
    diffuse = vec3.fromValues(0.8, 0.8, 0.8);
    specular = vec3.fromValues(0.4, 0.4, 0.4);

    constructor(gl, mesh) {
        this.gl = gl;
        this.mesh = mesh;
    }


}

export class DirectioanalLight extends Light {
    constructor(gl, mesh, direction = vec3.fromValues(-0.2, -1, -0.3)) {
        super(gl, mesh);
        this.direction = this.calculateForwardVector();

    }

    calculateForwardVector() {
        const forward = vec3.fromValues(0, 0, 1); // Default forward direction
        const rotationMatrix = mat4.create();
        const rotationQuat = quat.create();
        mat4.getRotation(rotationQuat, this.mesh.transform); // Extract rotation quaternion from mesh's transform matrix
        mat4.fromQuat(rotationMatrix, rotationQuat); // Create rotation matrix from extracted quaternion
        vec3.transformMat4(forward, forward, rotationMatrix); // Transform forward vector by rotation matrix
        return forward;
    }


    setLightUniformsandDraw(program){
        this.gl.useProgram(program);
        this.uniforms = { direction: null, ambient: null, diffuse: null, specular: null };
        this.uniforms.direction = this.gl.getUniformLocation(program, "dirLight.direction");
        if (!this.uniforms.direction) {
            console.error("Uniform Direction yok");
        }
        this.uniforms.ambient = this.gl.getUniformLocation(program, "dirLight.ambient");
        this.uniforms.diffuse = this.gl.getUniformLocation(program, "dirLight.diffuse");
        this.uniforms.specular = this.gl.getUniformLocation(program, "dirLight.specular");
        
        this.direction = this.calculateForwardVector();
        this.draw(program);
    }


    draw(program) {
        
        this.gl.useProgram(program);
        this.gl.uniform3fv(this.uniforms.direction, this.direction);
        this.gl.uniform3fv(this.uniforms.ambient, this.ambient);
        this.gl.uniform3fv(this.uniforms.diffuse, this.diffuse);
        this.gl.uniform3fv(this.uniforms.specular, this.specular);
    }


}
export class SpotLight extends Light {

    constructor(gl, mesh, direction = vec3.fromValues(-0.2, -1, -0.3), ) {
        super(gl, mesh);
        this.diffuse = vec3.fromValues(1,1,1);
        this.ambient = vec3.fromValues(0,0,0);
        this.specular = vec3.fromValues(1,1,1);
        this.direction = direction;
        this.position = vec3.create();
        this.constant = 1.0;
        this.linear = 0.09;
        this.quadratic = 0.032;
        this.cutOff = Math.cos(toRadian(12.5));
        this.outerCutOff = Math.cos(toRadian(15.0));
        this.uniforms = { direction: null, ambient: null, diffuse: null, specular: null };



    }
    calculateForwardVector() {
        const forward = vec3.fromValues(0, 0, 1); // Default forward direction
        const rotationMatrix = mat4.create();
        const rotationQuat = quat.create();
        mat4.getRotation(rotationQuat, this.mesh.transform); // Extract rotation quaternion from mesh's transform matrix
        mat4.fromQuat(rotationMatrix, rotationQuat); // Create rotation matrix from extracted quaternion
        vec3.transformMat4(forward, forward, rotationMatrix); // Transform forward vector by rotation matrix
        return forward;
    }

    setLightUniformsandDraw(program){
        this.gl.useProgram(program);
        this.uniforms.direction = this.gl.getUniformLocation(program, "spotLight.direction");
        if (!this.uniforms.direction) {
            console.error("Uniform Direction yok");
        }
        this.uniforms.ambient = this.gl.getUniformLocation(program, "spotLight.ambient");
        this.uniforms.diffuse = this.gl.getUniformLocation(program, "spotLight.diffuse");
        this.uniforms.specular = this.gl.getUniformLocation(program, "spotLight.specular");
        this.uniforms.position = this.gl.getUniformLocation(program, "spotLight.position");
        this.uniforms.cutOff = this.gl.getUniformLocation(program, "spotLight.cutOff");
        this.uniforms.outerCutOff = this.gl.getUniformLocation(program, "outerCutOff");
        this.uniforms.constant = this.gl.getUniformLocation(program, "spotLight.constant");
        this.uniforms.linear = this.gl.getUniformLocation(program, "spotLight.linear");
        this.uniforms.quadratic = this.gl.getUniformLocation(program, "spotLight.quadratic");
        //mat4.getTranslation(this.position, this.mesh.transform);
       // mat4.lookAt(this.mesh.transform, this.position, this.direction, vec3.fromValues(0, 1, 0));
       // mat4.invert(this.mesh.transform, this.mesh.transform);
        this.direction = this.calculateForwardVector();
        this.draw(program);

    }




    draw(program) {
        this.gl.useProgram(program);
        mat4.getTranslation(this.position, this.mesh.transform);

        this.gl.uniform3fv(this.uniforms.direction, this.direction);
        this.gl.uniform3fv(this.uniforms.ambient, this.ambient);
        this.gl.uniform3fv(this.uniforms.diffuse, this.diffuse);
        this.gl.uniform3fv(this.uniforms.specular, this.specular);
        this.gl.uniform3fv(this.uniforms.position, this.position);
        this.gl.uniform1f(this.uniforms.cutOff, this.cutOff);
        this.gl.uniform1f(this.uniforms.outerCutOff, this.outerCutOff);
        this.gl.uniform1f(this.uniforms.constant, this.constant);
        this.gl.uniform1f(this.uniforms.linear, this.linear);
        this.gl.uniform1f(this.uniforms.quadratic, this.quadratic);

    }


}
export class PointLight extends Light {

    constructor(gl, mesh, direction = vec3.fromValues(-0.2, -1, -0.3), ) {
        super(gl, mesh);
        this.diffuse = vec3.fromValues(1,1,1);
        this.ambient = vec3.fromValues(0,0,0);
        this.specular = vec3.fromValues(1,1,1);
        this.direction = direction;
        this.position = vec3.create();
        this.constant = 1.0;
        this.linear = 0.09;
        this.quadratic = 0.032;
        this.cutOff = Math.cos(toRadian(12.5));
        this.outerCutOff = Math.cos(toRadian(15.0));
        this.uniforms = { direction: null, ambient: null, diffuse: null, specular: null };



    }
    calculateForwardVector() {
        const forward = vec3.fromValues(0, 0, 1); // Default forward direction
        const rotationMatrix = mat4.create();
        const rotationQuat = quat.create();
        mat4.getRotation(rotationQuat, this.mesh.transform); // Extract rotation quaternion from mesh's transform matrix
        mat4.fromQuat(rotationMatrix, rotationQuat); // Create rotation matrix from extracted quaternion
        vec3.transformMat4(forward, forward, rotationMatrix); // Transform forward vector by rotation matrix
        return forward;
    }

    setLightUniformsandDraw(program){
        this.gl.useProgram(program);
        //this.uniforms.direction = this.gl.getUniformLocation(program, "spotLight.direction");
        //if (!this.uniforms.direction) {
           // console.error("Uniform Direction yok");
        //}
        this.uniforms.ambient = this.gl.getUniformLocation(program, "pointLight.ambient");
        this.uniforms.diffuse = this.gl.getUniformLocation(program, "pointLight.diffuse");
        this.uniforms.specular = this.gl.getUniformLocation(program, "pointLight.specular");
        this.uniforms.position = this.gl.getUniformLocation(program, "pointLight.position");
        //this.uniforms.cutOff = this.gl.getUniformLocation(program, "spotLight.cutOff");
        //this.uniforms.outerCutOff = this.gl.getUniformLocation(program, "outerCutOff");
        this.uniforms.constant = this.gl.getUniformLocation(program, "pointLight.constant");
        this.uniforms.linear = this.gl.getUniformLocation(program, "pointLight.linear");
        this.uniforms.quadratic = this.gl.getUniformLocation(program, "pointLight.quadratic");
        //mat4.getTranslation(this.position, this.mesh.transform);
       // mat4.lookAt(this.mesh.transform, this.position, this.direction, vec3.fromValues(0, 1, 0));
       // mat4.invert(this.mesh.transform, this.mesh.transform);
        this.direction = this.calculateForwardVector();
        this.draw(program);

    }




    draw(program) {
        this.gl.useProgram(program);
        mat4.getTranslation(this.position, this.mesh.transform);

        //this.gl.uniform3fv(this.uniforms.direction, this.direction);
        this.gl.uniform3fv(this.uniforms.ambient, this.ambient);
        this.gl.uniform3fv(this.uniforms.diffuse, this.diffuse);
        this.gl.uniform3fv(this.uniforms.specular, this.specular);
        this.gl.uniform3fv(this.uniforms.position, this.position);
        //this.gl.uniform1f(this.uniforms.cutOff, this.cutOff);
        //this.gl.uniform1f(this.uniforms.outerCutOff, this.outerCutOff);
        this.gl.uniform1f(this.uniforms.constant, this.constant);
        this.gl.uniform1f(this.uniforms.linear, this.linear);
        this.gl.uniform1f(this.uniforms.quadratic, this.quadratic);

    }


}