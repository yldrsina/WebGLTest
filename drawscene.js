import { vec3, mat4, glMatrix } from "./gl-matrix/index.js";
import { Camera } from "./CameraClass.js";
import { World } from "./World.js";
/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {World} world
 * @param {Camera} camera1
 */
export function drawScene(gl, world) {
    var lastTime = 0;
    let fps = 0;
    function Tick(currentTime) {
        requestAnimationFrame(Tick);

        currentTime *= 0.001; //milisaniyeyi saniyeye çevirme
        window.deltaTime = currentTime - lastTime;
        fps = 1 / window.deltaTime;
        document.getElementById("fps").textContent = "FPS: " + fps.toFixed(1);
        lastTime = currentTime;

        gl.clearColor(0.2, 0.3, 0.3, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        world.camera.updateCameraVectors();
        const projection = mat4.create();
        mat4.perspective(projection, glMatrix.toRadian(world.camera.Zoom), gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100);
        const view = world.camera.getViewMatrix();
        world.drawables.forEach((val) => {
            val.draw(view, projection);
        });

    }
    requestAnimationFrame(Tick);

}