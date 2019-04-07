import { Vector } from "../Helpers/Helpers.js";
import { DrawableAbstract } from "./DrawableAbstract.js";
export class Point extends DrawableAbstract<Point> {
    getDimensions(): number {
        return this.point.getDimensions()
    }
    glDrawArray(gl: WebGLRenderingContext): void {
        gl.drawArrays(gl.POINTS, 0, 1);
    }
    getPoints(): Float32Array {
        return new Float32Array(this.point.toArray());
    }
    buffer: WebGLBuffer | null = null;
    public readonly type = "Point";
    public enable: () => boolean = () => true;
    constructor(public point: Vector) {
        super();
    }
}
