import { vec3, mat4, glMatrix } from "./gl-matrix/index.js";
import { InputSystem } from "./Input.js";


export class Camera {
    static YAW = -90.0;
    static PITCH = 0;
    static SPEED = 25;
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
    SpeedUpMovementSpeed = 0.0;
    MouseSensitivity = 0.0;
    Zoom = 0.0;
    ChangedZoom = 0.0;


    constructor(GL, position = vec3.fromValues(0, 0, 0), up = vec3.fromValues(0, 1, 0), yaw = Camera.YAW, pitch = Camera.PITCH) {
        this.gl = GL;
        this.FrontVector = vec3.fromValues(0, 0, -1);
        this.MovementSpeed = Camera.SPEED;
        this.SpeedUpMovementSpeed = Camera.SPEED * 2;
        this.MouseSensitivity = Camera.SENSITIVITY;
        this.Zoom = Camera.ZOOM;
        this.ChangedZoom = Camera.ZOOM / 3;
        this.Position = position;
        this.WorldUpVector = up;
        this.Yaw = yaw;
        this.Pitch = pitch;
        this.MovementCache = vec3.create();
        this.updateCameraVectors();
        console.log("Kamera Constructor çalıştı");


        InputSystem.get().addMouseMoveBinding(() => {
            this.processRotation();
        });
        InputSystem.get().addKeyHoldEvent("KeyW", () => {
            this.addMovementForward(1);
        });
        InputSystem.get().addKeyHoldEvent("KeyS", () => {
            this.addMovementForward(-1);
        });
        InputSystem.get().addKeyDownBinding("KeyZ", () => {
            this.Zoom = this.ChangedZoom;
        });
        InputSystem.get().addKeyUpBinding("KeyZ", () => {
            this.Zoom = Camera.ZOOM;
        });
        InputSystem.get().addKeyHoldEvent("KeyA", () => {
            this.addMovementRight(-1);
        });
        InputSystem.get().addKeyHoldEvent("KeyD", () => {
            this.addMovementRight(1);
        });
        InputSystem.get().addKeyHoldEvent("KeyE", () => {
            this.addMovementUp(1);
        });
        InputSystem.get().addKeyHoldEvent("KeyQ", () => {
            this.addMovementUp(-1);
        });
        InputSystem.get().addKeyDownBinding("ShiftLeft", () => {
            this.MovementSpeed = this.SpeedUpMovementSpeed;
        });
        InputSystem.get().addKeyUpBinding("ShiftLeft", () => {
            this.MovementSpeed = Camera.SPEED;
        });
        InputSystem.get().addMouseWheelBinding((deltaY) => {
            if (InputSystem.get().isKeyDown("ShiftLeft")) {
                this.SpeedUpMovementSpeed -= deltaY * Camera.SPEED / 1000;
                this.SpeedUpMovementSpeed = Math.max(0.1, this.SpeedUpMovementSpeed);
                this.MovementSpeed = this.SpeedUpMovementSpeed; s
            } else if (InputSystem.get().isKeyDown("KeyZ")) {
                this.ChangedZoom += deltaY * Camera.ZOOM / 10000;
                this.Zoom = this.ChangedZoom;
            }

        }
        );
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
    addMovementRight(x) {
        vec3.scaleAndAdd(this.MovementCache, this.MovementCache, this.RightVector, x);
    }
    addMovementUp(y) {
        vec3.scaleAndAdd(this.MovementCache, this.MovementCache, this.UpVector, y);
    }
    addMovementForward(z) {
        vec3.scaleAndAdd(this.MovementCache, this.MovementCache, this.FrontVector, z);
    }

    tick(deltaTime) {
        this.processMovementCache(deltaTime);
        const cameraPositionP = document.getElementById("camera-position");
        if (cameraPositionP)
            cameraPositionP.innerText = `Camera Position: X: ${this.Position[0].toFixed(2)}, Y: ${this.Position[1].toFixed(2)}, Z: ${this.Position[2].toFixed(2)}`;
        const cameraRotationP = document.getElementById("camera-rotation");
        if (cameraRotationP)
            cameraRotationP.innerText = `Camera Rotation: Yaw: ${this.Yaw.toFixed(2)}, Pitch: ${this.Pitch.toFixed(2)}`;
    }
    /**
     * 
     * @param {{x: number, y: number, z: number}} direction 
     * @param {number} deltaTime 
     */
    processMovementCache(deltaTime) {
        if (!document.pointerLockElement)
            return;
        vec3.normalize(this.MovementCache, this.MovementCache);
        vec3.scale(this.MovementCache, this.MovementCache, this.MovementSpeed * deltaTime);
        vec3.add(this.Position, this.Position, this.MovementCache);
        this.MovementCache = vec3.create();


        this.SetViewMatrix();
    }

    processRotation() {
        if (!document.pointerLockElement) //if mouse is not locked to canvas don't do anything.
            return;
        const prevYaw = this.Yaw;
        const prevPitch = this.Pitch;
        this.Yaw += (InputSystem.get().mouse.deltaX) * this.MouseSensitivity;
        this.Pitch += (InputSystem.get().mouse.deltaY) * this.MouseSensitivity * -1;
        if (this.Pitch > 89.0)
            this.Pitch = 89.0;
        if (this.Pitch < -89.0)
            this.Pitch = -89.0;
    }
}
