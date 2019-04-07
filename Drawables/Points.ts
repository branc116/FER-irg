import { DrawableAbstract } from "./DrawableAbstract.js";
import { IVector } from "../Helpers/IVector.js";

export class Points extends DrawableAbstract<Points> {
    getDimensions(): number {
        return this.point[0].getDimensions();
    }
    glDrawArray(gl: WebGLRenderingContext): void {
        gl.drawArrays(gl.POINTS, 0, this.point.length);
    }
    getPoints(): Float32Array {
        return new Float32Array(this.point.map(i => i.toArray()).reduce((p, c) => [...p, ...c]));
    }
    buffer: WebGLBuffer | null = null;
    public readonly type = "Points";
    public enable: () => boolean = () => true;
    constructor(public point: IVector[]) {
        super();
    }
}
