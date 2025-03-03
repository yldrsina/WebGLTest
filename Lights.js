
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

    constructor(gl, program, mesh) {
        this.gl = gl;
        this.program = program;
        this.mesh = mesh;
    }


}

export class DirectioanalLight extends Light {
    constructor(gl, program, mesh, direction = vec3.fromValues(-0.2, -1, -0.3)) {
        super(gl, program, mesh);
        this.direction = direction;
        this.uniforms = { direction: null, ambient: null, diffuse: null, specular: null };
        this.uniforms.direction = gl.getUniformLocation(program, "dirLight.direction");
        if (!this.uniforms.direction) {
            console.error("Uniform Direction yok");
        }
        this.uniforms.ambient = gl.getUniformLocation(program, "dirLight.ambient");
        this.uniforms.diffuse = gl.getUniformLocation(program, "dirLight.diffuse");
        this.uniforms.specular = gl.getUniformLocation(program, "dirLight.specular");
        mat4.lookAt(mesh.transform, vec3.fromValues(0, 0, 0), direction, vec3.fromValues(0, 1, 0));

        this.setUniformLocations();


    }




    setUniformLocations() {
        this.gl.uniform3fv(this.uniforms.direction, this.direction);
        this.gl.uniform3fv(this.uniforms.ambient, this.ambient);
        this.gl.uniform3fv(this.uniforms.diffuse, this.diffuse);
        this.gl.uniform3fv(this.uniforms.specular, this.specular);

    }


}
export class SpotLight extends Light {

    constructor(gl, program, mesh, direction = vec3.fromValues(-0.2, -1, -0.3), constant, linear, quadratic, cutOff, outerCutOff) {
        super(gl, program, mesh);
        this.direction = direction;
        this.position = vec3.create();
        this.constant = constant;
        this.linear = linear;
        this.quadratic = quadratic;
        this.cutOff = cutOff;
        this.outerCutOff = outerCutOff;
        this.uniforms = { direction: null, ambient: null, diffuse: null, specular: null };
        this.uniforms.direction = gl.getUniformLocation(program, "spotLight.direction");
        if (!this.uniforms.direction) {
            console.error("Uniform Direction yok");
        }
        this.uniforms.ambient = gl.getUniformLocation(program, "spotLight.ambient");
        this.uniforms.diffuse = gl.getUniformLocation(program, "spotLight.diffuse");
        this.uniforms.specular = gl.getUniformLocation(program, "spotLight.specular");
        this.uniforms.position = gl.getUniformLocation(program, "spotLight.position");
        this.uniforms.cutOff = gl.getUniformLocation(program, "spotLight.cutOff");
        this.uniforms.outerCutOff = gl.getUniformLocation(program, "outerCutOff");
        this.uniforms.constant = gl.getUniformLocation(program, "spotLight.constant");
        this.uniforms.linear = gl.getUniformLocation(program, "spotLight.linear");
        this.uniforms.quadratic = gl.getUniformLocation(program, "spotLight.quadratic");
        mat4.getTranslation(this.position, this.mesh.transform);
        mat4.lookAt(this.mesh.transform, this.position, this.direction, vec3.fromValues(0, 1, 0));
        mat4.invert(this.mesh.transform, this.mesh.transform);
        this.draw();


    }




    draw() {


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