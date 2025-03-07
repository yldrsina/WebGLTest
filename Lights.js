
import { vec3, mat4, glMatrix } from "./gl-matrix/index.js";
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
        this.direction = direction;

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

    constructor(gl, mesh, direction = vec3.fromValues(-0.2, -1, -0.3), constant, linear, quadratic, cutOff, outerCutOff) {
        super(gl, mesh);
        this.direction = direction;
        this.position = vec3.create();
        this.constant = constant;
        this.linear = linear;
        this.quadratic = quadratic;
        this.cutOff = cutOff;
        this.outerCutOff = outerCutOff;
        this.uniforms = { direction: null, ambient: null, diffuse: null, specular: null };


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
        mat4.getTranslation(this.position, this.mesh.transform);
        mat4.lookAt(this.mesh.transform, this.position, this.direction, vec3.fromValues(0, 1, 0));
        mat4.invert(this.mesh.transform, this.mesh.transform);
        this.draw(program);

    }




    draw(program) {
        this.gl.useProgram(program);
        mat4.getTranslation(this.position, this.mesh.transform);

        console.log(this.position);
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