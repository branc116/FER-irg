import { DrawableAbstract } from "./DrawableAbstract.js";
import { IVector } from "../Helpers/IVector.js";
import { Vector } from "../Helpers/Helpers.js";
export class BezierCurve extends DrawableAbstract<BezierCurve> {
    public type: "BezierCurve" = "BezierCurve";
    public points: IVector[] = [];
    getPoints(): Float32Array {
        const arr = this.points
            .map(i => i.toArray())
            .reduce((pr, cu) => [...pr, ...cu]);
        return new Float32Array(arr);
    }
    getDimensions(): number {
        return this.points[0].getDimensions();
    }
    glDrawArray(gl: WebGLRenderingContext): void {
        gl.drawArrays(gl.LINE_STRIP, 0, this.points.length);
    }
    normyNfact(n: number) {
        let pro = 1;
        for(let i = 1;i<=n;i++) {
            pro *= i;
        }
        return pro
    }
    normyNpovrhK(n: number, k: number) {
        return this.normyNfact(n) / (this.normyNfact(n - k)*this.normyNfact(k));
    }
    toBezier() {
        const a = this.controlPoints;
        const outArr: IVector[] = [];
        for(let t = 0;t<1;t+=0.001) {
            let x = 0;
            let y = 0;
            for (let i = 0;i<a.length;i++) {
                x += this.normyNpovrhK(a.length, i) * Math.pow((1 - t), a.length - i)*Math.pow(t, i) * a[i].get(0);
                y += this.normyNpovrhK(a.length, i) * Math.pow((1 - t), a.length - i)*Math.pow(t, i) * a[i].get(1);
            }
            this.points.push(new Vector([x, y]));
        }
    }
    constructor(public controlPoints: IVector[]) {
        super();
        this.toBezier();
    }
}