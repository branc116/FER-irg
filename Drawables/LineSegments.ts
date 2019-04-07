import { DrawableAbstract } from "./DrawableAbstract.js";
import { IVector } from "../Helpers/IVector.js";
import { DrawableString } from "./DrawableString.js";

export class LineSegments extends DrawableAbstract<LineSegments> {
    getDimensions(): number {
        return this.lines[0][0].getDimensions();
    }
    glDrawArray(gl: WebGLRenderingContext): void {
        gl.drawArrays(gl.LINES, 0, 2*this.lines.length);
    }
    getPoints(): Float32Array {
        const arr = this.lines
            .map(i => i.map(j => j.toArray())
            .reduce((pr, cu) => [...pr, ...cu]))
            .reduce((pr, cr) => [...pr, ...cr]);
        return new Float32Array(arr);
    }
    buffer: WebGLBuffer | null  = null;
    constructor(public lines: [IVector, IVector][]) {
        super();
        
    }
    public readonly type: DrawableString<LineSegments> = "LineSegment";
}