import { IVector } from "./IVector.js";

export class Tetrahedron {
    constructor (public points: [IVector, IVector, IVector, IVector]) {

    }
    public signedArea() {
        const a = this.points[0];
        const b = this.points[1];
        const c = this.points[2];
        const d = this.points[3];
        return a
            .nSub(b)
            .scalarProduct(b
                .nSub(d)
                .nVectorProduct(c.nSub(d))
            )/6;
    }
}