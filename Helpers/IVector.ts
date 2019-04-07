import { IMatrix } from "./IMatrix.js";

export interface IVector {
    get: (index: number) => number;
    set: (index: number, value: number) => IVector;
    getDimensions: () => number;
    copy: () => IVector;
    copyPart: (index: number) => IVector;
    newInstance: (index: number) => IVector;
    add: (vector: IVector) => this;
    nAdd: (vector: IVector) => IVector;
    sub: (vector: IVector) => this;
    nSub: (vector: IVector) => IVector;
    scalarMultiply: (scalar: number) => this;
    nScalarMultiply: (scalar: number) => IVector;
    norm: () => number;
    normalize: () => this;
    nNormalize: () => IVector;
    cosine: (vector: IVector) => number;
    scalarProduct: (vector: IVector) => number;
    nVectorProduct: (vector: IVector) => IVector;
    nFromHomogeneus: () => IVector;
    toRowMatrix: (liveView: boolean) => IMatrix;
    toColumnMatrix: (liveView: boolean) => IMatrix;
    getK: (vector: IVector) => number;
    toArray: () => number[];
    toString: () => string;
}
