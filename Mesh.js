
import { vec3, mat4, glMatrix } from "./gl-matrix/index.js";
export class StaticMesh {
    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {Float32Array} vertices 
     * @param {Uint16Array} indices 
     * @param {Float32Array} textureCoordinates 
     * @param {Number} program 
     */
    constructor(gl, vertices, indices, program, prepareDraw) {
        this.transform = mat4.create();
        this.vertices = vertices;
        this.indices = indices;
        this.program = program;
        this.prepareDraw = prepareDraw;


        this.positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        this.texCoordAttributeLocation = gl.getAttribLocation(program, "a_textureCoord");
        this.uniforms = { transform: null, view: null, projection: null };
        this.uniforms.transform = gl.getUniformLocation(program, "transform");
        if (this.uniforms.transform === null)
            console.error("modelloc uniform invalid.")
        this.uniforms.view = gl.getUniformLocation(program, "view");
        if (this.uniforms.view === null)
            console.error("viewloc uniform invalid.");
        this.uniforms.projection = gl.getUniformLocation(program, "projection");
        if (this.uniforms.projection === null)
            console.error("projectloc uniform invalid.");

        this.gl = gl;
        this.buffers = {};
        this.buffers.vertex = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertex);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        this.buffers.index = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.index);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }



    setTransform(newTransform) {
        this.transform = newTransform;
    }


    draw(viewMatrix, projectionMatrix) {
        this.gl.useProgram(this.program);
        this.gl.uniformMatrix4fv(this.uniforms.transform, false, this.transform);
        this.gl.uniformMatrix4fv(this.uniforms.view, false, viewMatrix);
        this.gl.uniformMatrix4fv(this.uniforms.projection, false, projectionMatrix);

        if (this.prepareDraw) {
            this.prepareDraw(viewMatrix, projectionMatrix);
        }
        //BIND BUFFERS.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.vertex);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.index);

        //SET POSITION ATTRIB
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 5 * 4 /**3 floats for location, 2 floats for texcord*/, 0 /**buffer start*/);

        //SET TEXCOORD ATTRIB
        this.gl.enableVertexAttribArray(this.texCoordAttributeLocation);
        this.gl.vertexAttribPointer(this.texCoordAttributeLocation, 2, this.gl.FLOAT, false, 5 * 4 /**3 floats for location, 2 floats for texcord*/, 3 * 4 /**next to location.*/);

        this.gl.drawElements(this.gl.TRIANGLES, this.gl.getBufferParameter(this.gl.ELEMENT_ARRAY_BUFFER, this.gl.BUFFER_SIZE) / 2, this.gl.UNSIGNED_SHORT, 0);
    }
}