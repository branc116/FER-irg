import { IVector } from "./IVector";
import { Matrix } from "./Helpers.js";
function eq(a: number, b: number) {
    return Math.abs(a - b) < 0.00001;
}
export class Line {
    
    constructor(public points: [IVector, IVector]) {
        
    }
    public k() {
        return (this.points[1].get(1) - this.points[0].get(1)) / (this.points[1].get(0) - this.points[0].get(0));
    }
    public x0() {
        const k = this.k();
        const x0 = -k*this.points[0].get(0) + this.points[0].get(1);
        return x0;
    }
    public union(line: Line): IVector | null {
        if (this.k() == line.k() && this.x0() && line.x0())
            return null;
        const c1 = this.points[0].copyPart(3).set(2, 1)
            .nVectorProduct(this.points[1].copyPart(3).set(2, 1));
        const c2 = line.points[0].copyPart(3).set(2, 1)
            .nVectorProduct(line.points[1].copyPart(3).set(2, 1));
        const mat = new Matrix(2, 2, [[c1.get(0), c1.get(1)], [c2.get(0), c2.get(1)]]);
        const row = new Matrix(2, 1, [[-1 * c1.get(2)], [-1 * c2.get(2)]]);
        const union = mat.nInvert().nMultipy(row).toVector(false);
        if (this.isOn(union) && line.isOn(union))
            return union;
        return null;
    }
    public isOn(point: IVector) {
        const [fx, sx] = this.points[0].get(0) < this.points[1].get(0) ? [this.points[0], this.points[1]] : [this.points[1], this.points[0]];
        const [fy, sy] = this.points[0].get(1) < this.points[1].get(1) ? [this.points[0], this.points[1]] : [this.points[1], this.points[0]];
        if (!(fx.get(0) <= point.get(0)
        && sx.get(0) >= point.get(0)
        && fy.get(1) <= point.get(1)
        && sy.get(1) >= point.get(1)))
            return false;
        if (this.k() === NaN)
            return point.get(0) == this.points[0].get(0) && this.points[0].get(1) == point.get(1);
        if ((this.k() * this.k()) == Infinity) {
            if (!eq(point.get(0), this.points[0].get(0)))
                return false;
            // if (first.get(1) <= point.get(1) && second.get(1) >= point.get(1))
            return true;
            // return false;
        }
        return eq(point.get(0)*this.k() + this.x0(), point.get(1));
    }
    public isBelow(point: IVector) {
        if (this.isOn(point))
            return false;
        if (!this.k())
            return false;
        if (this.k() == Infinity) {
            return point.get(0) > this.points[0].get(0);
        }
        if (this.k() == -Infinity) {
            return point.get(0) < this.points[0].get(0);
        }
        const k = this.k();
        const x0 = this.x0();
        const y = k*point.get(0) + x0;
        if (this.points[0].get(0)<this.points[1].get(0)) {
            return y > point.get(1);
        }
        return y < point.get(1);
    }
    public isAbove(point: IVector) {
        return !this.isOn(point) && !this.isBelow(point);
    }
}