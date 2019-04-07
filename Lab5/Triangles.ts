import { IVector } from "../Helpers/IVector.js";
import { DrawableAbstract } from "../Drawables/DrawableAbstract.js";

export class Triangles extends DrawableAbstract<Triangles> {
    glDrawArray(gl: WebGLRenderingContext): void {
        gl.uniform1f(this.colorUniform || null, this.color)
        gl.drawArrays(gl.TRIANGLES, 0, 3 * this.points.length);
    }
    getPoints(): Float32Array {
        return new Float32Array(this.points.map(i => i.map(j => j.toArray()).reduce((p, c) => [...p, ...c])).reduce((prev, cur) => [...prev, ...cur]));
    }
    getDimensions(): number {
        return this.points[0][0].getDimensions();
    }
    public buffer: WebGLBuffer | null = null;
    public readonly type = "Triangles";

    public constructor(public points: [IVector, IVector, IVector][], public colorUniform?: WebGLUniformLocation, public color = 0){
        super();
    }
}

