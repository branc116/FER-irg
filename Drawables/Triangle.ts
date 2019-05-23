import { DrawableAbstract } from "./DrawableAbstract.js";
import { IVector } from "../Helpers/IVector.js";

export class Triangle extends DrawableAbstract<Triangle> {
    glDrawArray(gl: WebGLRenderingContext): void {
        gl.uniform1f(this.colorUniform || null, this.color)
        gl.drawArrays(this.drawMode == "Fill" ?  gl.TRIANGLES : gl.LINE_LOOP, 0, 3);
    }
    getPoints(): Float32Array {
        return new Float32Array(this.points.map(i => i.toArray()).reduce((prev, cur) => [...prev, ...cur]));
    }
    getDimensions(): number {
        return this.points[0].getDimensions();
    }
    getMiddle(): IVector {
        return this.points[0]
            .nAdd(this.points[1])
            .add(this.points[2])
            .scalarMultiply(0.33333);
            
    }
    getNormala(): IVector {
        const v1 = this.points[0].nSub(this.points[1]);
        const v2 = this.points[0].nSub(this.points[2]);
        return v1.nVectorProduct(v2);
    }
    isBackFace(eye: IVector, ccw: boolean = true): boolean {
        const norm = this.getNormala();
        const emm = eye.nSub(this.getMiddle());
        const product = norm.scalarProduct(emm);
        return ccw && product > 0 || !ccw && product < 0;
    }
    public buffer: WebGLBuffer | null = null;
    public readonly type = "Triangle";

    public constructor(public points: [IVector, IVector, IVector], public colorUniform?: WebGLUniformLocation, public color = 0){
        super();
    }
}

