import { Camera } from "./CameraClass.js";

export class World{
    constructor(){
        this.drawables = [];
        this.camera = new Camera();
    }
}