import { DrawableAbstract } from "./DrawableAbstract.js";
import { IVector } from "../Helpers/IVector.js";

export class Triangle extends DrawableAbstract<Triangle> {
    glDrawArray(gl: WebGLRenderingContext): void {
        gl.uniform1f(this.colorUniform || null, this.color)
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    getPoints(): Float32Array {
        return new Float32Array(this.points.map(i => i.toArray()).reduce((prev, cur) => [...prev, ...cur]));
    }
    getDimensions(): number {
        return this.points[0].getDimensions();
    }
    public buffer: WebGLBuffer | null = null;
    public readonly type = "Triangle";

    public constructor(public points: [IVector, IVector, IVector], public colorUniform?: WebGLUniformLocation, public color = 0){
        super();
    }
}

