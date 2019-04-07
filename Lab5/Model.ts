import { Triangle } from "../Drawables/Triangle.js";
import { IVector } from "../Helpers/IVector.js";
import { Vector } from "../Helpers/Helpers.js";
import { Triangles } from "./Triangles.js";

export class Model {
    /**
     *
     */
    constructor(public modelUri: string) {

    }
    public async getTriangles() {
        const res = await fetch(this.modelUri);
        const txt = await res.text();
        const linez = txt.split('\n')
        const trinagles: [IVector, IVector, IVector][] = [];
        const vertecies: IVector[] = [];
        for (let i = 0; i < linez.length; i++) {
            const line = linez[i];
            var l = line.split(' ');
            
            if (l[0] == 'v')
                vertecies.push(new Vector(l.map(i => Number.parseFloat(i)).filter(i => !!i || i == 0)));
            if (l[0] == 'f') {
                const fs = l.map(i => Number.parseInt(i.split('/')[0])).filter(i => !!i || i == 0);
                const v1 = vertecies[fs[0] - 1];
                const v2 = vertecies[fs[1] - 1];
                const v3 = vertecies[fs[2] - 1];
                trinagles.push([v1, v2, v3]);   
            }
        }
        return new Triangles(trinagles);
    }
}