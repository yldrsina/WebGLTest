import { Camera } from "./CameraClass.js";
import { Framebuffer } from "./Framebuffer.js";
import { vec3, mat4 } from "./gl-matrix/index.js";
import { createScreenMesh } from "./MeshUtils.js";

export class World {
    /**
     * @param gl {WebGL2RenderingContext}
     */
    constructor(gl, worldprogram) {
        this.gl = gl;
        this.worldprogram = worldprogram;
        this.drawables = [];
        this.lights = [];
        this.camera = new Camera(gl);
        this.framebuffer = new Framebuffer(gl);
        this.screenmeshbuffer = createScreenMesh(gl, worldprogram);
        gl.useProgram(worldprogram);
        this.positionAttributeLocation = gl.getAttribLocation(worldprogram, "a_position");
        this.texCoordAttributeLocation = gl.getAttribLocation(worldprogram, "a_textureCoord");
        this.screenTextureuniform = gl.getUniformLocation(worldprogram, "screenTexture");
        this.depthTextureuniform = gl.getUniformLocation(worldprogram, "depthTexture");
        this.framebufferselectoruniform = gl.getUniformLocation(worldprogram, "framebufferselector");
        this.framebufferselectorvalue = 0;
        this.dropdown = document.querySelector("#menu");
        this.dropdown.addEventListener('change', () => {
            const value = this.dropdown.value;
            if (value == "DefaultLit")
                this.framebufferselectorvalue = 0;
            if (value == "Depth")
                this.framebufferselectorvalue = 1;
        })

    }

    translateObject(mesh, vec3translate = vec3.fromValues(0, 0, 0)) {
        var transform = mat4.create();
        mat4.translate(transform, transform, vec3translate);
        mat4.multiply(mesh.transform, transform, mesh.transform);

    }

    GetPrograms() {
        var programs = [];
        this.drawables.forEach(element => {
            programs.push(element.program);
        });
        return programs;
    }
    AddStaticMesh(mesh) {
        // Push Mesh
        this.drawables.push(mesh);
        this.lights.forEach(light => {
            light.setLightUniformsandDraw(mesh.program);
        });
        // Set Lighting info of mesh.
    }
    AddLight(light) {
        this.lights.push(light);
        this.drawables.push(light.mesh);
        var programs = this.GetPrograms();
        programs.forEach(program => {
            light.setLightUniformsandDraw(program);

        });

    }

    drawScreenbufferMesh() {
        this.gl.useProgram(this.worldprogram);
        
        this.gl.uniform1i(this.screenTextureuniform, 0);
        this.gl.uniform1i(this.depthTextureuniform, 1);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.framebuffer.colorBufferTexture);


        this.gl.uniform1i(this.framebufferselectoruniform, this.framebufferselectorvalue);


        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.framebuffer.depthbufferTexture);




        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.screenmeshbuffer);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 4 * 4 /**3 floats for location, 2 floats for texcord*/, 0 /**buffer start*/);
        this.gl.enableVertexAttribArray(this.texCoordAttributeLocation);
        this.gl.vertexAttribPointer(this.texCoordAttributeLocation, 2, this.gl.FLOAT, false, 4 * 4 /**3 floats for location, 2 floats for texcord*/, 2 * 4 /**next to location.*/);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
        this.gl.enable(this.gl.DEPTH_TEST);
    }
}

