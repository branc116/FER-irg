import { DrawableAbstract } from "./DrawableAbstract.js";
import { IVector } from "../Helpers/IVector.js";
import { Line } from "../Helpers/Line.js";
import { LineSegments } from "./LineSegments.js";
import { Vector } from "../Helpers/Helpers.js";
export enum StilCrtanja {
    Obrub,
    Izspuna
}
export class Poligon extends DrawableAbstract<Poligon> {
    public type: "Poligon" = "Poligon";
    public stilCrtanja: StilCrtanja = StilCrtanja.Obrub;
    public fill?: LineSegments;
    public doIt = true;
    constructor(public points: IVector[], public colorUniform: WebGLUniformLocation | null) {
        super();
    }
    public isCW(): boolean {
        
        for(let i=2;i<=this.points.length + 1;i++) {
            const v1 = this.points[(i - 2) % this.points.length];
            const v2 = this.points[(i - 1) % this.points.length];
            const v3 = this.points[i % this.points.length];
            const line = new Line([v1, v2]);
            if (!line.isBelow(v3))
                return false;
        }
        return true;
    }
    public isCCW(): boolean {
        for(let i=2;i<=this.points.length + 1;i++) {
            const v1 = this.points[(i - 2) % this.points.length].copyPart(3);
            const v2 = this.points[(i - 1) % this.points.length].copyPart(3);
            const v3 = this.points[i % this.points.length].copyPart(3);
            const line = new Line([v1, v2]);
            if (!line.isAbove(v3))
                return false;
        }
        return true;
    }
    public isConverx(): boolean {
        return this.isCW() || this.isCCW();
    }
    public toLineSegments() {
        const ySorted = [...this.points].sort((a, b) => a.get(1) - b.get(1));
        const minY = ySorted[0].get(1);
        const maxY = ySorted[ySorted.length - 1].get(1);
        const curSegments: [IVector, IVector][] = [];
        const lines = this.getLines();
        for (let i = minY;i < maxY;i+=5) {
            const testline = new Line([new Vector([-1000, i]), new Vector([1000, i])]);
            let last: undefined | IVector = undefined;
            for (const l of lines) {
                const union = l.union(testline);
                if (union == null)
                    continue;
                if (last != undefined){
                    curSegments.push([last, union]);
                    last = undefined;
                }else {
                    last = union;
                }

            }
        }
        this.fill = new LineSegments(curSegments);
        this.fill.enable = () => {
            return this.doIt;
        }
        return this.fill;
    }
    public isIn(point: IVector): boolean {
        let state = 0;
        for (let i = 1; i < (this.points.length + 1); i++) {
            const cur = this.points[i % this.points.length];
            const past = this.points[(i - 1) % this.points.length];
            const line = new Line([cur, past]);
            if (state == 0) {
                if (line.isAbove(point)){
                    state = 1
                }else if (line.isBelow(point)) {
                    state = -1;
                }
            }
            else if (line.isAbove(point) && state == -1) 
                return false;
            else if (line.isBelow(point) && state == 1)
                return false;
        }
        return true;
    }
    public getLines() {
        var l = [];
        for (let i=1;i<=this.points.length;i++) {
            const nl = new Line([this.points[i - 1], this.points[i % this.points.length]]);
            l.push(nl);
        }
        return l;
    }

    getPoints(): Float32Array {
        return new Float32Array(this.points.map(i => i.toArray()).reduce((p, c) => [...p, ...c]));
    }
    getDimensions(): number {
        return this.points[0].getDimensions();
    }
    glDrawArray(gl: WebGLRenderingContext): void {
        const color = 4 * (this.isCW() ? 1 : 0) + 8 * (this.isCCW() ? 1 : 0) + 2;
        gl.uniform1f(this.colorUniform, color);
        if (this.drawMode == "Wireframe") {
            gl.drawArrays(gl.LINE_LOOP, 0, this.points.length);
        }else {
            gl.drawArrays(gl.TRIANGLE_FAN, 0, this.points.length);
        }

    }
}
