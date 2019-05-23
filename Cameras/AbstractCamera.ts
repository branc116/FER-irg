import { IVector } from "../Helpers/IVector.js";
import { mat4, identity, create, perspective, lookAt, mul } from "../mat4/mat4.js";
import { Vector } from "../Helpers/Helpers.js";

export abstract class AbstractCamera{
    public lookAt: IVector;
    public cam: IVector;
    public fov: number;
    public zNear: number;
    public zFar: number;
    public aspect: number; 

    constructor() {
        this.lookAt = new Vector([0, 0, 0]);
        this.cam = new Vector([0, 0, 1]);
        this.fov = Math.PI/4;
        this.zNear = 0.1;
        this.zFar = 1000;
        this.aspect = 1;
    }

    public abstract updateCamLocation(time: number): IVector;
    public abstract updateLookAt(time: number): IVector;
    private temp_lookAt: mat4 = create();
    private temp_perspective: mat4 = create();
    public getTransformMatrix(): mat4 {
        identity(this.temp_lookAt);
        identity(this.temp_perspective);
        lookAt(this.temp_lookAt, this.cam.toVec3(), this.lookAt.toVec3(), [0, 1, 0]);
        perspective(this.temp_perspective, this.fov, this.aspect, this.zNear, this.zFar);
        return mul(this.temp_lookAt, this.temp_perspective, this.temp_lookAt);
    }
}