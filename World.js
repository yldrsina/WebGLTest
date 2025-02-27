import { Camera } from "./CameraClass.js";

export class World{
    constructor(gl){
        this.drawables = [];
        this.camera = new Camera(gl);
    }
}