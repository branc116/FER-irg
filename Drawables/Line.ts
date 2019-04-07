import { DrawableAbstract } from "./DrawableAbstract.js";
import { IVector } from "../Helpers/IVector.js";
import { DrawableString } from "./DrawableString.js";

export class DrawableLine extends DrawableAbstract<DrawableLine> {
    glDrawArray(gl: WebGLRenderingContext): void {
        gl.drawArrays(gl.LINES, 0, 2);
    }
    getDimensions(): number {
        return this.points[0].getDimensions();
    }
    getPoints(): Float32Array {
        return new Float32Array(this.points.map(i => i.toArray()).reduce((prev, cur) => [...prev, ...cur]));
    }
    public readonly type: DrawableString<DrawableLine> = "Line";

    public constructor(public points: IVector[]) {
        super();
    }
}
