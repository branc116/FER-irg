import { AbstractCamera } from "./AbstractCamera.js";
import { IVector } from "../Helpers/IVector.js";

export class OrbitCamera extends AbstractCamera {
    private neg = false;
    private negx = false;
    private negt = false;
    private t = 0;
    constructor (public radius: number, public speed: number) {
        super();
        this.cam.set(1, radius);  
    }
    public updateCamLocation(time: number): IVector
    {
        const x =  (this.negx ? -1 : 1 ) * Math.sqrt(this.t);
        const y = (this.neg ? -1 : 1) * Math.sqrt(this.radius * this.radius - this.t);
        this.cam.set(0, x);
        this.cam.set(1, this.radius);
        this.cam.set(2, y);
        this.t += this.speed * (this.negt ? -1 : 1) * (this.radius * this.radius)/60;
        if (this.t > this.radius * this.radius) {
            // t = -r;
            this.neg = !this.neg;
            this.negt = !this.negt;
            this.t = this.radius * this.radius;
        }
        if (this.t < 0) {
            this.negt = !this.negt;
            this.negx = !this.negx;
            this.t = 0;
        }
        return this.cam;
    }
    public updateLookAt(time: number): IVector
    {
        return this.lookAt;
    }
}