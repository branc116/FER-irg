import { IVector } from "../Helpers/IVector.js";
import { mat4, identity, create, perspective, lookAt, mul } from "../mat4/mat4.js";
import { Vector } from "../Helpers/Helpers.js";
import { SceneAbstract } from "../SceneAbstract.js";

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

    private u_lookAt: WebGLUniformLocation | null = null;
    private u_cam: WebGLUniformLocation | null = null;
    private u_fov: WebGLUniformLocation | null = null;
    private u_zNear: WebGLUniformLocation | null = null;
    private u_zFar: WebGLUniformLocation | null = null;
    private u_aspect: WebGLUniformLocation | null = null;


    public getTransformMatrix(): mat4 {
        identity(this.temp_lookAt);
        identity(this.temp_perspective);
        lookAt(this.temp_lookAt, this.cam.toVec3(), this.lookAt.toVec3(), [0, 1, 0]);
        perspective(this.temp_perspective, this.fov, this.aspect, this.zNear, this.zFar);
        return mul(this.temp_lookAt, this.temp_perspective, this.temp_lookAt);
    }
    public updateUniforms(scene: SceneAbstract) {
        this.u_lookAt = this.u_lookAt || scene.getUniformLocation("u_lookAt");
        this.u_cam = this.u_cam || scene.getUniformLocation("u_cam");
        this.u_fov = this.u_fov || scene.getUniformLocation("u_fov");
        this.u_zNear = this.u_zNear || scene.getUniformLocation("u_zNear");
        this.u_zFar = this.u_zFar || scene.getUniformLocation("u_zFar");
        this.u_aspect = this.u_aspect || scene.getUniformLocation("u_aspect");

        scene.gl.uniform3fv(this.u_lookAt, this.lookAt.toArray());
        scene.gl.uniform3fv(this.u_cam, this.cam.toArray());
        scene.gl.uniform1f(this.u_fov, this.fov);
        scene.gl.uniform1f(this.u_zNear, this.zNear);
        scene.gl.uniform1f(this.u_zFar, this.zFar);
        scene.gl.uniform1f(this.u_aspect, this.aspect);
        
    }
}