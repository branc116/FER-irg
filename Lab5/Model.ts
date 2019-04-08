import { Triangle } from "../Drawables/Triangle.js";
import { IVector } from "../Helpers/IVector.js";
import { Vector } from "../Helpers/Helpers.js";
import { Triangles } from "./Triangles.js";

export class Mesh {
    public verticies: IVector[] = [];
    public facesVertexIndexs: [number, number, number][] = [];
    constructor() {

    }
    public static async fromUri(modelUri: string) {
        const res = await fetch(modelUri);
        const txt = await res.text();
        return Mesh.fromString(txt);
        
    }
    public static fromString(modelDefinition: string) {
        const linez = modelDefinition.split('\n')
        const mesh = new Mesh();
        for (let i = 0; i < linez.length; i++) {
            const line = linez[i];
            var l = line.split(' ');
            
            if (l[0] == 'v')
                mesh.verticies.push(new Vector(l.map(i => Number.parseFloat(i)).filter(i => !!i || i == 0)));
            if (l[0] == 'f') {
                const fs = l.map(i => Number.parseInt(i.split('/')[0])).filter(i => !!i || i == 0);
                for (let i = 2;i<fs.length;i++) {
                    const v1 = fs[0] - 1;
                    const v2 = fs[i - 1] - 1;0
                    const v3 = fs[i] - 1;
                    if (v1 == NaN || v2 == NaN || NaN == v3)
                        continue;
                    mesh.facesVertexIndexs.push([v1, v2, v3]);
                }
            }
        }
        return mesh;
    }
    public getTriangles() {
        var vs = this.facesVertexIndexs.map(i => [this.verticies[i[0]], this.verticies[i[1]], this.verticies[i[2]]] as [IVector, IVector, IVector]);
        return new Triangles(vs);
    }
    public normalize() {
        let max = 0;
        for (let i = 0; i < this.verticies.length; i++) {
            const [x, y, z] = this.verticies[i].toArray();
            max = Math.max(Math.abs(x), Math.abs(y), Math.abs(z), max);
        }
        for (let i = 0; i < this.verticies.length; i++) {
            const v = this.verticies[i];
            v.scalarMultiply(1/max);
        }
        return this;
    }
    public toObj() {
        let retStr = "";
        retStr += this.verticies
            .map(i => `v ${i.get(0)} ${i.get(1)} ${i.get(2)}`)
            .reduce((p, c) => p + '\n' + c) + '\n';
        retStr += this.facesVertexIndexs.map(i => `f ${i[0] + 1} ${i[1] + 1} ${i[2] + 1}`)
            .reduce((p, c) => p + '\n' + c) + '\n';
        return retStr;
    }
}