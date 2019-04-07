import { IVector } from "./IVector";
export interface IMatrix {
    getRowCount: () => number;
    getColCount: () => number;
    get: (row: number, col: number) => number;
    set: (row: number, col: number, value: number) => this;
    copy: () => IMatrix;
    newInstance: (row: number, col: number) => IMatrix;
    nTranspone: (liveView: boolean) => IMatrix;
    add: (matrix: IMatrix) => this;
    nAdd: (matrix: IMatrix) => IMatrix;
    sub: (matrix: IMatrix) => this;
    nSub: (matrix: IMatrix) => IMatrix;
    nMultipy: (matrix: IMatrix) => IMatrix;
    determinant: () => number;
    subMarix: (row: number, col: number, flag: boolean) => IMatrix;
    nInvert: () => IMatrix;
    toArray: () => number[][];
    toVector: (flag: boolean) => IVector;
    hfe: (action: (row: number, col: number) => void) => void;
    toString: () => string;
}
