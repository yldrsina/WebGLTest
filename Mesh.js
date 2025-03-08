
import { vec3, mat4, mat3, glMatrix } from "./gl-matrix/index.js";
export class StaticMesh {
    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {Float32Array} vertices 
     * @param {Uint16Array} indices 
     * @param {Float32Array} textureCoordinates 
     * @param {Number} program 
     */
    constructor(gl, geometries, program, texture, outlineprogram = null, drawoutline = false,transparent=false) {
        this.transform = mat4.create();
        this.normalTransform = mat4.create();
        this.program = program;
        this.geometries = geometries;
        this.gl = gl;
        this.texture = texture;
        this.materialshininess = 32;
        this.outlineprogram = outlineprogram;
        this.drawoutline = drawoutline;
        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
        this.transparent = transparent


        this.positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        this.texCoordAttributeLocation = gl.getAttribLocation(program, "a_textureCoord");
        this.normalsAttributeLocation = gl.getAttribLocation(program, "a_Normal");
        this.setProgramUniforms(gl, program);




        this.geometries.forEach(geometry => {
            geometry.vertexPosition
            geometry.buffers = {};
            geometry.buffers.vertex = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, geometry.buffers.vertex);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.attributes), gl.STATIC_DRAW);

            //TEMPORARY:


            geometry.buffers.index = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.buffers.index);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(geometry.vertexIndices), gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        });

    }
    calculateNormalTransform() {
        mat4.invert(this.normalTransform, this.transform);
        mat4.transpose(this.normalTransform, this.normalTransform);
    }
    setProgramUniforms(gl, program) {
        if (!program) {
            console.error("Program invalid")
        }
        this.uniforms = { transform: null, view: null, projection: null, lightColor: null };
        this.uniforms.transform = gl.getUniformLocation(program, "transform");
        if (this.uniforms.transform === null)
            console.error("modelloc uniform invalid.")
        this.uniforms.view = gl.getUniformLocation(program, "view");
        if (this.uniforms.view === null)
            console.error("viewloc uniform invalid.");
        this.uniforms.projection = gl.getUniformLocation(program, "projection");
        if (this.uniforms.projection === null)
            console.error("projectloc uniform invalid.");
        this.uniforms.normalTransform = gl.getUniformLocation(program, "normaltransform");
        if (this.uniforms.normalTransform === null)
            console.error("normaltransform uniform invalid.")


        this.uniforms.diffuseTexture = gl.getUniformLocation(program, "material.diffuse");
        if (this.uniforms.diffuseTexture === null)
            console.error("diffusetexture uniform invalid.")
        this.uniforms.shininess = gl.getUniformLocation(program, "material.shininess");
        if (this.uniforms.shininess === null)
            console.error("shininess uniform invalid.");

    }


    setTransform(newTransform) {
        this.transform = newTransform;
    }
    drawOutlineEffect(drawoutline, phase) {
        if (drawoutline === true && phase === 0) { // StartPhase
            this.gl.stencilFunc(this.gl.ALWAYS, 1, 0XFF);
            this.gl.stencilMask(0xFF);
        }
        if (drawoutline === false) { // if outline disabled
            this.gl.stencilMask(0x00);
        }
        if (drawoutline && phase === 1) { //End Phase
            this.setProgramUniforms(this.gl, this.outlineprogram);
            
            this.gl.stencilFunc(this.gl.NOTEQUAL, 1, 0xFF);
            this.gl.stencilMask(0x00);
            
            const toUseTransform = mat4.create();
            const scaleFactor = 1.03;
            mat4.scale(toUseTransform, this.transform, vec3.fromValues(scaleFactor, scaleFactor, scaleFactor));
            
            this.gl.useProgram(this.outlineprogram);
            this.gl.uniformMatrix4fv(this.uniforms.transform, false, toUseTransform);
            this.gl.uniformMatrix4fv(this.uniforms.view, false, this.viewMatrix);
            this.gl.uniformMatrix4fv(this.uniforms.projection, false, this.projectionMatrix);
            this.gl.uniformMatrix4fv(this.uniforms.normalTransform, false, this.normalTransform);
            this.gl.disable(this.gl.DEPTH_TEST);
            this.gl.drawElements(this.gl.TRIANGLES, this.gl.getBufferParameter(this.gl.ELEMENT_ARRAY_BUFFER, this.gl.BUFFER_SIZE) / 2, this.gl.UNSIGNED_SHORT, 0);
            this.gl.stencilMask(0xFF);
            this.gl.stencilFunc(this.gl.ALWAYS, 0, 0xFF);
            this.gl.enable(this.gl.DEPTH_TEST);
        }
    }
    SetOpacityParameter() {
        if(this.transparent == true){
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA);
        }
        else {
            this.gl.disable(this.gl.BLEND);
        }
    }


    draw(viewMatrix, projectionMatrix) {
        this.geometries.forEach((geometry) => {
            this.viewMatrix = viewMatrix;
            this.projectionMatrix = projectionMatrix;
            this.calculateNormalTransform();
            this.gl.useProgram(this.program);
            this.setProgramUniforms(this.gl, this.program);
            this.SetOpacityParameter();
            this.drawOutlineEffect(this.drawoutline, 0);
            this.gl.uniformMatrix4fv(this.uniforms.transform, false, this.transform);
            this.gl.uniformMatrix4fv(this.uniforms.view, false, viewMatrix);
            this.gl.uniformMatrix4fv(this.uniforms.projection, false, projectionMatrix);
            this.gl.uniformMatrix4fv(this.uniforms.normalTransform, false, this.normalTransform);
            //Activate TEXTURE0
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            //Set Sampler in shader so TEXTURE0 setted to material.diffuse
            this.gl.uniform1i(this.uniforms.diffuseTexture, 0);
            this.gl.uniform1f(this.uniforms.shininess, this.materialshininess);


            //BIND BUFFERS.
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, geometry.buffers.vertex);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, geometry.buffers.index);

            //SET POSITION ATTRIB
            this.gl.enableVertexAttribArray(this.positionAttributeLocation);
            this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 8 * 4 /**3 floats for location, 2 floats for texcord*/, 0 /**buffer start*/);

            //SET TEXCOORD ATTRIB
            this.gl.enableVertexAttribArray(this.texCoordAttributeLocation);
            this.gl.vertexAttribPointer(this.texCoordAttributeLocation, 2, this.gl.FLOAT, false, 8 * 4 /**3 floats for location, 2 floats for texcord*/, 3 * 4 /**next to location.*/);

            // SET NORMAL ATTRIB
            this.gl.enableVertexAttribArray(this.normalsAttributeLocation);
            this.gl.vertexAttribPointer(this.normalsAttributeLocation, 3, this.gl.FLOAT, false, 8 * 4 /**3 floats for location, 2 floats for texcord*/, 5 * 4 /**next to location.*/);

            this.gl.drawElements(this.gl.TRIANGLES, this.gl.getBufferParameter(this.gl.ELEMENT_ARRAY_BUFFER, this.gl.BUFFER_SIZE) / 2, this.gl.UNSIGNED_SHORT, 0);
            this.drawOutlineEffect(this.drawoutline, 1);
        });
    }
}