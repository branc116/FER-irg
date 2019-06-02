import { Vector } from "../Helpers/Helpers.js";
import { IVector } from "../Helpers/IVector.js";
import { Triangles } from "./Triangles.js";

export class Sphere {
    triangles: number[][];
    vertices: IVector[];
    normals: number[][];

    constructor(radius: number, subdivisionsDepth: number) {
        let center = new Vector([0, 0, 0]),
            p1 = new Vector([radius, 0, 0]),
            p2 = new Vector([radius * Math.cos(2 * Math.PI / 3), radius * Math.sin(2 * Math.PI / 3), 0]),
            p3 = new Vector([radius * Math.cos(4 * Math.PI / 3), radius * Math.sin(4 * Math.PI / 3), 0]),
            pU = new Vector([0, 0, radius]),
            pD = new Vector([0, 0, -radius]);
        if (subdivisionsDepth < 1) subdivisionsDepth = 1;
        let vertices = [p1, p2, p3, pU, pD];
        let triangles = [[0, 1, 3], [0, 4, 1], [2, 0, 3], [2, 4, 0], [1, 2, 3], [4, 2, 1]];
        let normals = [
            vertices[0].sub(center).normalize().toArray(),
            vertices[1].sub(center).normalize().toArray(),
            vertices[2].sub(center).normalize().toArray(),
            vertices[3].sub(center).normalize().toArray(),
            vertices[4].sub(center).normalize().toArray()
        ];
        for (var depth = 2; depth <= subdivisionsDepth; depth++) {
            let ntr = [];
            for (var i = 0; i < triangles.length; i++) {
                let tri = triangles[i];
                let c1 = new Vector(vertices[tri[0]].toArray()).add(vertices[tri[1]]).scalarMultiply(0.5).normalize().scalarMultiply(radius);
                let c2 = new Vector(vertices[tri[1]].toArray()).add(vertices[tri[2]]).scalarMultiply(0.5).normalize().scalarMultiply(radius);
                let c3 = new Vector(vertices[tri[2]].toArray()).add(vertices[tri[0]]).scalarMultiply(0.5).normalize().scalarMultiply(radius);
                let ci = vertices.length - 1;
                vertices.push(c1);
                vertices.push(c2);
                vertices.push(c3);
                normals.push(c1.nSub(center).normalize().toArray());
                normals.push(c2.nSub(center).normalize().toArray());
                normals.push(c3.nSub(center).normalize().toArray());
                ntr.push([tri[0], ci + 1, ci + 3]);
                ntr.push([ci + 1, tri[1], ci + 2]);
                ntr.push([ci + 2, tri[2], ci + 3]);
                ntr.push([ci + 1, ci + 2, ci + 3]);
            }
            triangles = ntr;
        }
        this.triangles = triangles;
        this.vertices = vertices;
        this.normals = normals;
    }
    public getTriangles(): Triangles {
        const realTriangles: [IVector, IVector, IVector][] = [];
        for (let index = 0; index < this.triangles.length; index++) {
            const element = this.triangles[index];
            realTriangles.push([this.vertices[element[0]], this.vertices[element[1]], this.vertices[element[2]]]);
        }
        return new Triangles(realTriangles);
    }

}