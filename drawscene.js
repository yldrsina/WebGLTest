import { vec3, mat4, glMatrix } from "./gl-matrix/index.js";
import { Camera } from "./CameraClass.js";
import { World } from "./World.js";
import { Framebuffer } from "./Framebuffer.js";
import { InputSystem } from "./Input.js";
/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {World} world
 * @param {Camera} camera1
 */
export const TickEventBus = new EventTarget();

export function drawScene(gl, world, screenprogram) {
    var lastTime = 0;
    let fps = 0;
    function Tick(currentTime) {
        requestAnimationFrame(Tick);

        currentTime *= 0.001; //milisaniyeyi saniyeye çevirme
        window.deltaTime = currentTime - lastTime;
        InputSystem.get().tick(window.deltaTime);
        fps = 1 / window.deltaTime;
        document.getElementById("fps").textContent = "FPS: " + fps.toFixed(1);
        lastTime = currentTime;
        // FRAMEBUFFER 
        gl.bindFramebuffer(gl.FRAMEBUFFER, world.framebuffer.framebuffer);

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);
        gl.enable(gl.STENCIL_TEST);
        gl.stencilFunc(gl.NOTEQUAL, 1, 0xFF);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
        gl.clearColor(0.2, 0.3, 0.3, 1.0);


        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        gl.enable(gl.CULL_FACE);



        gl.stencilMask(0x00);



        world.camera.updateCameraVectors();

        // Event Tick
        
        TickEventBus.dispatchEvent(new Event("tick"));

        //Draw StaticMeshes in world
        world.drawables.forEach((val) => {



            val.draw(world.camera.viewMatrix, world.camera.projectionMatrix);
        });

        // BINDING DEFAULT FRAMEBUFFER BACK
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.clearColor(0.2, 0.3, 0.3, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        world.drawScreenbufferMesh();

        world.drawables.forEach((val) => {
            if (val.tick) {
                val.tick(window.deltaTime);
            }
        });
        if(world.camera && world.camera.tick){
            world.camera.tick(window.deltaTime);
        }
    }
    requestAnimationFrame(Tick);

}