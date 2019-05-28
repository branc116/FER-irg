import { IVector } from "../Helpers/IVector.js";
import { DrawableAbstract } from "./DrawableAbstract.js";
import { Tetrahedron } from "../Helpers/Tetrahedron.js";
import { Vector } from "../Helpers/Helpers.js";
import * as m from "../mat4/mat4.js";
import { SceneAbstract } from "../SceneAbstract.js";

export class Triangles extends DrawableAbstract<Triangles> {
    public transformMatrixUniform?: WebGLUniformLocation;
    public transformMatrix: Float32Array = m.identity(m.create());
    glDrawArray(gl: WebGLRenderingContext): void {
        gl.uniformMatrix4fv(this.transformMatrixUniform || SceneAbstract.trans, false, this.transformMatrix);
        gl.uniform1f(this.colorUniform || null, this.color);
        gl.drawArrays(this.drawMode == "Fill" ? gl.TRIANGLES : gl.LINE_STRIP, 0, 3 * this.triangles.length);
    }
    getPoints(): Float32Array {
        const pnts: number[] = [];
        for (let i=0;i<this.triangles.length;i++) {
            const ele = this.triangles[i];
            for (let j = 0; j < ele.length; j++) {
                const element = ele[j];
                pnts.push(...element.toArray());
            }
        }
        return new Float32Array(pnts);
    }
    getDimensions(): number {
        return this.triangles[0][0].getDimensions();
    }
    public isInside(point: IVector) {
        const farrAwayPoint = new Vector([10000*(Math.random() + 1), 10000*(Math.random() + 1), 10000*(Math.random() + 1)]);
        let intersecrionCount = 0;
        for(let i = 0; i<this.triangles.length; i++) {
            const [a, b, c] = this.triangles[i];
            const ar1 = new Tetrahedron([point, a, b, c]).signedArea();
            const ar2 = new Tetrahedron([farrAwayPoint, a, b, c]).signedArea();
            const ar3 = new Tetrahedron([point, farrAwayPoint, a, b]).signedArea();
            const ar4 = new Tetrahedron([point, farrAwayPoint, b, c]).signedArea();
            const ar5 = new Tetrahedron([point, farrAwayPoint, c, a]).signedArea();
            if (Math.sign(ar1) != Math.sign(ar2) && Math.sign(ar3) == Math.sign(ar4) && Math.sign(ar4) == Math.sign(ar5))
                intersecrionCount++;
        }
        return intersecrionCount % 2 == 1;
    }
    public buffer: WebGLBuffer | null = null;
    public readonly type = "Triangles";

    public constructor(public triangles: [IVector, IVector, IVector][], public colorUniform?: WebGLUniformLocation, public color = 0){
        super();
    }
}

