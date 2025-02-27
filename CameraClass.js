import { vec3, mat4, glMatrix } from "./gl-matrix/index.js";


export class Camera {
    static YAW = -90.0;
    static PITCH = 0;
    static SPEED = 2.5;
    static SENSITIVITY = 0.1;
    static ZOOM = 55.0;
    Position = vec3.create();
    FrontVector = vec3.create();
    UpVector = vec3.create();
    RightVector = vec3.create();
    WorldUpVector = vec3.create();
    gl;
    viewMatrix = mat4.create();
    projectionMatrix = mat4.create();

    Yaw = 0.0;
    Pitch = 0.0;
    MovementSpeed = 0.0;
    MouseSensitivity = 0.0;
    Zoom = 0.0;
    IsMouseLockedToCanvas = false;


    constructor(GL, position = vec3.fromValues(0, 0, 0), up = vec3.fromValues(0, 1, 0), yaw = Camera.YAW, pitch = Camera.PITCH) {
        this.gl = GL;
        this.FrontVector = vec3.fromValues(0, 0, -1);
        this.MovementSpeed = Camera.SPEED;
        this.MouseSensitivity = Camera.SENSITIVITY;
        this.Zoom = Camera.ZOOM;
        this.Position = position;
        this.WorldUpVector = up;
        this.Yaw = yaw;
        this.Pitch = pitch;
        this.updateCameraVectors();
        console.log("Kamera Constructor çalıştı");


    }
    SetViewMatrix() {
        const positionplusfront = vec3.create();
        vec3.add(positionplusfront, this.Position, this.FrontVector);
        mat4.lookAt(this.viewMatrix, this.Position, positionplusfront, this.UpVector);
    }

    updateCameraVectors() {
        //calculate new front vector.
        var front = vec3.fromValues(Math.cos(glMatrix.toRadian(this.Yaw)) * Math.cos(glMatrix.toRadian(this.Pitch)), Math.sin(glMatrix.toRadian(this.Pitch)), Math.sin(glMatrix.toRadian(this.Yaw)) * Math.cos(glMatrix.toRadian(this.Pitch)));

        vec3.normalize(this.FrontVector, front);

        vec3.cross(this.RightVector, this.FrontVector, this.WorldUpVector);
        vec3.normalize(this.RightVector, this.RightVector);

        vec3.cross(this.UpVector, this.RightVector, this.FrontVector);

        vec3.normalize(this.UpVector, this.UpVector);

        mat4.perspective(this.projectionMatrix, glMatrix.toRadian(this.Zoom), this.gl.canvas.clientWidth / this.gl.canvas.clientHeight, 0.1, 100);
        this.SetViewMatrix();
    }

    processMovement(direction, deltaTime) {
        dirMod = vec3.create();
        vec3.scale(dirMod, direction, deltaTime);
        vec3.add(position, position, dirMod);
    }

    /**
     * 
     * @param {MouseEvent} event 
     */
    processRotation(event) {
        if (!document.pointerLockElement)
            return;
        this.Yaw += (event.movementX) * this.MouseSensitivity;
        this.Pitch += (event.movementY) * this.MouseSensitivity * -1;
    }
}
