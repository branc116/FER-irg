import { DrawableAbstract } from "./DrawableAbstract.js";
import { Vector } from "../Helpers/Helpers.js";

export class Quad extends DrawableAbstract<Quad> {
    getDimensions(): number {
        return this.points[0].getDimensions();
    }
    glDrawArray(gl: WebGLRenderingContext): void {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
    }

    buffer: WebGLBuffer | null = null;
    private points: Vector[];
    readonly type = "Quad";

    constructor(points: [Vector, Vector, Vector, Vector]) {
        super();
        this.points = points;
    }
    getPoints(): Float32Array {
        return new Float32Array(this.points.map(i => i.toArray()).reduce((prev, cur) => [...prev, ...cur]));
    }
}