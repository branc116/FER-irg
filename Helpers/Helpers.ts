import { IMatrix } from "./IMatrix.js";
import { IVector } from "./IVector.js";


export abstract class AbstractMatrix implements IMatrix {
    abstract getRowCount: () => number;
    abstract getColCount: () => number;
    abstract get: (row: number, col: number) => number;
    abstract set: (row: number, col: number, value: number) => this;
    abstract copy: () => IMatrix;
    abstract newInstance: (row: number, col: number) => IMatrix;
    hfe = (action: (row: number, col: number) => void) => {
        for (let i = 0; i < this.getRowCount(); i++) {
            for (let j = 0; j < this.getColCount(); j++) {
                action(i, j);
            }
        }
    };
    nTranspone = (liveView: boolean): IMatrix => {
        if (liveView)
            return new MatrixTransposeView(this);
        var nM = this.newInstance(this.getColCount(), this.getRowCount());
        this.hfe((row, col) => {
            nM.set(col, row, this.get(row, col));
        });
        return nM;
    };
    add = (matrix: IMatrix) => {
        if (this.getColCount() != matrix.getColCount() || this.getRowCount() != matrix.getRowCount())
            throw new Error("Can't add or sub matrixies that are not of the same dimensions");
        this.hfe((row, col) => {
            this.set(row, col, this.get(row, col) + matrix.get(row, col));
        });
        return this;
    };
    nAdd = (matrix: IMatrix) => {
        if (this.getColCount() != matrix.getColCount() || this.getRowCount() != matrix.getRowCount())
            throw new Error("Can't add or sub matrixies that are not of the same dimensions");
        const nM = this.copy();
        this.hfe((row, col) => {
            nM.set(row, col, this.get(row, col) + matrix.get(row, col));
        });
        return nM;
    };
    sub = (matrix: IMatrix) => {
        if (this.getColCount() != matrix.getColCount() || this.getRowCount() != matrix.getRowCount())
            throw new Error("Can't add or sub matrixies that are not of the same dimensions");
        this.hfe((row, col) => {
            this.set(row, col, this.get(row, col) - matrix.get(row, col));
        });
        return this;
    };
    nSub = (matrix: IMatrix) => {
        if (this.getColCount() != matrix.getColCount() || this.getRowCount() != matrix.getRowCount())
            throw new Error("Can't add or sub matrixies that are not of the same dimensions");
        const nM = this.copy();
        this.hfe((row, col) => {
            nM.set(row, col, this.get(row, col) - matrix.get(row, col));
        });
        return nM;
    };
    nMultipy = (matrix: IMatrix) => {
        if (this.getColCount() != matrix.getRowCount())
            throw new Error(`Can't mutiplay matrix of dimensions (${this.getRowCount()}, ${this.getColCount()}) with matrix of dimensions (${matrix.getRowCount(), matrix.getColCount()})`);
        const nM = this.newInstance(this.getRowCount(), matrix.getColCount());
        nM.hfe((row, col) => {
            let sum = 0;
            for (let i =0;i<this.getColCount();i++){
                sum += this.get(row, i) * matrix.get(i, col);
            }
            nM.set(row, col, sum);
        });
        return nM;
    };
    determinant = () => {
        if (this.getRowCount() != this.getColCount())
            throw new Error("Determinant is only defined on squeare matrix");
        if (this.getRowCount() == 1)
            return this.get(0, 0);
        if (this.getRowCount() == 2)
            return this.get(0, 0) * this.get(1, 1) - this.get(0, 1) * this.get(1, 0);
        let sum = 0;
        for (let i = 0; i < this.getRowCount(); i++) {
            const subM = this.subMarix(0, i, true);
            const cur = (i % 2 == 0 ? 1 : -1) * this.get(0, i) * subM.determinant();
            sum += cur;
        }
        return sum;
    };
    subMarix = (row: number, col: number, flag: boolean): IMatrix => {
        if (flag)
            return new MatrixSubMatrixView(this, row, col);
        const subMatrix = this.newInstance(this.getRowCount() - 1, this.getColCount() - 1);
        let curRow = 0;
        for (let j = 0; j < (this.getRowCount()); j++) {
            if (j == row)
                continue;
            let curCol = 0;
            for (let k = 0; k < (this.getColCount()); k++) {
                if (k == col)
                    continue;
                subMatrix.set(curRow, curCol, this.get(j, k));
                curCol++;
            }
            curRow++;
        }
        return subMatrix;
    };
    subMarix2 = (row: number, col: number, flag: boolean) => {
        const newInstance = this.newInstance(row, col);
        for (let rowC = 0; rowC < row; rowC++) {
            for (let colC = 0; colC < col; colC++) {
                const element = this.getRowCount() > rowC && this.getColCount() > colC ? this.get(rowC, colC) : 0;
                newInstance.set(rowC, colC, element);
            }
        }
        return newInstance;
    };
    nInvert = () => {
        if (this.getColCount() != this.getRowCount())
            throw new Error("Can't get invers of non squere matrix");
        var newInstance = this.newInstance(this.getRowCount(), this.getColCount());
        const det = this.determinant();
        this.hfe((row, col) => {
            newInstance.set(col, row, ((row + col) % 2 == 1 ? -1 : 1) * this.subMarix(row, col, true).determinant() / det);
        });
        return newInstance;
    };
    toArray = () => {
        const endArray = [];
        for (let row = 0; row < this.getRowCount(); row++) {
            const curRow = [];
            for (let col = 0; col < this.getColCount(); col++) {
                curRow.push(this.get(row, col));
            }
            endArray.push(curRow);
        }
        return endArray;
    };
    toVector = (flag: boolean) => {
        let arr = this.toArray().reduce((prev, cur, curI, arr) => {
            return [...prev, ...cur];
        });
        return new Vector(arr);
    };
    toString = () => {
        const ar = this.toArray()
        const maxL = Math.max(...ar.reduce((p, c) => [...p, ...c]).map(i => i.toFixed(3).length)) + 2;
        return ar
            .map(i => {
                return '[' + i.map(i => {
                    const cur = (i < 0 ? '' : ' ') + i.toFixed(3);

                    const curL = maxL - cur.length;
                    const spaces = [...Array(curL).keys()].map(i => ' ').reduce((p, c) => p + c);
                    return cur + spaces;
                }).reduce((prev, cur) => `${prev}, ${cur}`) + ']'
            })
            .reduce((prev, cur) => `${prev}, \n${cur}`);
    }
}
export class MatrixTransposeView extends AbstractMatrix {
    constructor(public matrix: IMatrix) {
        super();
    }
    getRowCount = () => {
        return this.matrix.getColCount();
    };
    getColCount = () => {
        return this.matrix.getRowCount();
    };
    get = (row: number, col: number) => {
        return this.matrix.get(col, row);
    };
    set = (row: number, col: number, value: number) => {
        this.matrix.set(col, row, value);
        return this;
    };
    copy = () => {
        return new Matrix(this.getRowCount(), this.getColCount(), [...[...Array(this.getRowCount()).keys()].map(i => [...Array(this.getColCount()).keys()].map(j => this.get(i, j)))]);
    };
    newInstance = (row: number, col: number) => {
        const rm = this.getRowCount();
        const cm = this.getColCount();
        return new Matrix(row, col, [...[...Array(row).keys()].map(i => [...Array(col).keys()].map(j => rm >= i || cm >= j ? 0 : this.get(i, j)))]);
    };
}


export abstract class AbstractVector implements IVector {
    
    abstract get: (index: number) => number;
    abstract set: (index: number, value: number) => IVector;
    abstract getDimensions: () => number;
    abstract copy: () => IVector;
    abstract newInstance: (index: number) => IVector;
    getK = (vector: IVector) => {
        if (this.getDimensions() != 2 && vector.getDimensions() != 2)
            throw new Error("Can't get k from vectors with dimensions other than 2");
        return (vector.get(1) - this.get(1)) / (vector.get(0) - this.get(0));
    };
    copyPart = (index: number) => {
        const ni = this.newInstance(index);
        for (var i = 0; i < index; i++) {
            ni.set(i, this.get(i) || 0);
        }
        return ni;
    };
    add = (vector: IVector) => {
        if (vector.getDimensions() != this.getDimensions())
            throw new Error("Can't add vectors of different dimensions");
        for (var i = 0; i < this.getDimensions(); i++) {
            this.set(i, this.get(i) + vector.get(i));
        }
        return this;
    };
    nAdd = (vector: IVector) => {
        const newVector = this.newInstance(this.getDimensions());
        if (vector.getDimensions() != this.getDimensions())
            throw new Error("Can't add vectors of different dimensions");
        for (var i = 0; i < this.getDimensions(); i++) {
            newVector.set(i, this.get(i) + vector.get(i));
        }
        return newVector;
    };
    sub = (vector: IVector) => {
        if (vector.getDimensions() != this.getDimensions())
            throw new Error("Can't add vectors of different dimensions");
        for (var i = 0; i < this.getDimensions(); i++) {
            this.set(i, this.get(i) - vector.get(i));
        }
        return this;
    };
    nSub = (vector: IVector) => {
        const newVector = this.newInstance(this.getDimensions());
        if (vector.getDimensions() != this.getDimensions())
            throw new Error("Can't add vectors of different dimensions");
        for (var i = 0; i < this.getDimensions(); i++) {
            newVector.set(i, this.get(i) - vector.get(i));
        }
        return newVector;
    };
    scalarMultiply = (scalar: number) => {
        for (var i = 0; i < this.getDimensions(); i++) {
            this.set(i, this.get(i) * scalar);
        }
        return this;
    };
    nScalarMultiply = (scalar: number) => {
        const newVector = this.newInstance(this.getDimensions());
        for (var i = 0; i < this.getDimensions(); i++) {
            newVector.set(i, this.get(i) * scalar);
        }
        return newVector;
    };
    norm = () => {
        var sum = 0;
        for (let i = 0; i < this.getDimensions(); i++) {
            sum += this.get(i) * this.get(i);
        }
        return Math.sqrt(sum);
    };
    normalize = () => this.scalarMultiply(1 / this.norm());
    nNormalize = () => this.nScalarMultiply(1 / this.norm());
    cosine = (vector: IVector) => this.scalarProduct(vector) / (this.norm() * vector.norm());
    scalarProduct = (vector: IVector) => {
        if (this.getDimensions() != vector.getDimensions())
            throw new Error("can't get scalar product of vectors of different dimensions");
        let sum = 0;
        for (let i = 0; i < this.getDimensions(); i++) {
            sum += this.get(i) * vector.get(i);
        }
        return sum;
    };
    nVectorProduct = (vector: IVector) => {
        if (this.getDimensions() != vector.getDimensions() || this.getDimensions() != 3)
            throw new Error("Can't get vector product of vector of dimensions other than 3");
        var nV = this.newInstance(this.getDimensions());
        nV.set(0, this.get(1) * vector.get(2) - this.get(2) * vector.get(1));
        nV.set(1, -this.get(0) * vector.get(2) + this.get(2) * vector.get(0));
        nV.set(2, this.get(0) * vector.get(1) - this.get(1) * vector.get(0));
        return nV;
    };
    nFromHomogeneus = () => {
        var newVector = this.copyPart(this.getDimensions() - 1);
        for (var i = 0; i < newVector.getDimensions(); i++) {
            newVector.set(i, newVector.get(i) / this.get(this.getDimensions() - 1));
        }
        return newVector;
    };
    toRowMatrix = (liveView: boolean): IMatrix => liveView ? new MatrixVectorView(this, true) : new MatrixVectorView(this, true).copy();
    toColumnMatrix = (liveView: boolean): IMatrix => liveView ? new MatrixVectorView(this, false) : new MatrixVectorView(this, false).copy();
    toArray = () => {
        const arr = [];
        for (var i = 0; i < this.getDimensions(); i++) {
            arr.push(this.get(i));
        }
        return arr;
    };
    toString = (): string => {
        return '[' + this.toArray().map(i => i.toFixed(3)).reduce((pr, cur) => pr + ', ' + cur) + ']';
    }
}
export class MatrixSubMatrixView extends AbstractMatrix {
    rowIndicies: number[];
    colIndicies: number[];
    /**
     *
     */
    constructor(private matrix: IMatrix, row: number, col: number) {
        super();
        this.rowIndicies = [...Array(matrix.getRowCount()).keys()].filter((val) => val != row);
        this.colIndicies = [...Array(matrix.getColCount()).keys()].filter((val) => val != col);
    }
    getRowCount = () => this.rowIndicies.length;
    getColCount = () => this.colIndicies.length;
    get = (row: number, col: number) => this.matrix.get(this.rowIndicies[row], this.colIndicies[col]);
    set = (row: number, col: number, value: number) => {
        this.matrix.set(this.rowIndicies[row], this.colIndicies[col], value);
        return this;
    };
    copy = () => {
        return new Matrix(this.getRowCount(), this.getColCount(), [...[...Array(this.getRowCount()).keys()].map(i => [...Array(this.getColCount()).keys()].map(j => this.get(i, j)))]);
    };
    newInstance = (row: number, col: number) => {
        const rm = this.getRowCount();
        const cm = this.getColCount();
        return new Matrix(row, col, [...[...Array(row).keys()].map(i => [...Array(col).keys()].map(j => rm >= i || cm >= j ? 0 : this.get(i, j)))]);
    };
}
export class MatrixVectorView extends AbstractMatrix {
    constructor(public vector: IVector, public isRowMatrix?: boolean) {
        super();
    }
    getRowCount = () => this.isRowMatrix ? 1 : this.vector.getDimensions();
    getColCount = () => !this.isRowMatrix ? 1 : this.vector.getDimensions();
    get = (row: number, col: number) => {
        if (this.isRowMatrix) {
            if (row == 0) {
                return this.vector.get(col);
            }
        }
        else {
            if (col == 0) {
                return this.vector.get(row);
            }
        }
        throw new Error("out of range");
    };
    set = (row: number, col: number, value: number) => {
        if (this.isRowMatrix) {
            if (row == 0) {
                this.vector.set(col, value);
                return this;
            }
        }
        else {
            if (col == 0) {
                this.vector.set(row, value);
                return this;
            }
        }
        throw new Error("out of range");
    };
    copy = () => {
        return new Matrix(this.getRowCount(), this.getColCount(), [...[...Array(this.getRowCount()).keys()].map(i => [...Array(this.getColCount()).keys()].map(j => this.get(i, j)))]);
    };
    newInstance = (row: number, col: number) => {
        const rm = this.getRowCount();
        const cm = this.getColCount();
        return new Matrix(row, col, [...[...Array(row).keys()].map(i => [...Array(col).keys()].map(j => rm >= i || cm >= j ? 0 : this.get(i, j)))]);
    };
}
export class Vector extends AbstractVector {
    private elements: number[];
    private dimensions: number;
    private readonly: boolean;
    public constructor(values: number[], isLiveView?: boolean, isReadOnly?: boolean) {
        super();
        this.elements = isLiveView ? values : [...values];
        this.dimensions = values.length;
        this.readonly = isReadOnly || false;
    }
    get = (index: number) => {
        return this.elements[index];
    };
    set = (index: number, value: number) => {
        this.elements[index] = value;
        return this;
    };
    getDimensions = () => {
        return this.dimensions;
    };
    copy = () => {
        return new Vector([...[...Array(this.getDimensions()).keys()].map(i => this.get(i))]);
    };
    newInstance = (index: number) => {
        return new Vector([...[...Array(index).keys()].map(i => this.getDimensions() > i ? 0 : this.get(i))]);
    };
    public static parseSimple = (vector: string) => {
        return new Vector(vector.split(' ').map(i => Number.parseFloat(i)));
    };
}
export class VectorMatrixView extends AbstractVector {
    /**
     *
     */
    constructor(private matrix: IMatrix) {
        super();
    }
    get = (index: number) => this.matrix.get(Math.floor(index / this.matrix.getColCount()), Math.floor(index % this.matrix.getColCount()));
    set = (index: number, value: number) => {
        this.matrix.set(Math.floor(index / this.matrix.getColCount()), Math.floor(index % this.matrix.getColCount()), value);
        return this;
    };
    getDimensions = () => {
        return this.matrix.getRowCount() * this.matrix.getColCount();
    };
    copy = () => {
        return new Vector([...[...Array(this.getDimensions()).keys()].map(i => this.get(i))]);
    };
    newInstance = (index: number) => {
        return new Vector([...[...Array(index).keys()].map(i => this.get(i) || 0)]);
    };
}
export class Matrix extends AbstractMatrix {
    elements: number[][];
    /**
     *
     */
    constructor(public rows: number, public cols: number, elemements?: number[][], liveView?: boolean) {
        super();
        if (elemements)
            this.elements = liveView ? elemements : [...elemements];
        else {
            this.elements = [];
            for (let row = 0; row < rows; row++) {
                const curElement = [];
                for (let col = 0; col < rows; col++) {
                    curElement.push(0);
                }
                this.elements.push(curElement);
            }
        }
    }
    getRowCount = () => {
        return this.rows;
    };
    getColCount = () => {
        return this.cols;
    };
    get = (row: number, col: number) => {
        return this.elements[row][col];
    };
    set = (row: number, col: number, value: number) => {
        this.elements[row][col] = value;
        return this;
    };
    copy = () => {
        return new Matrix(this.getRowCount(), this.getColCount(), [...[...Array(this.getRowCount()).keys()].map(i => [...Array(this.getColCount()).keys()].map(j => this.get(i, j)))]);
    };
    newInstance = (row: number, col: number) => {
        const rm = this.getRowCount();
        const cm = this.getColCount();
        return new Matrix(row, col, [...[...Array(row).keys()].map(i => [...Array(col).keys()].map(j => rm >= i || cm >= j ? 0 : this.get(i, j)))]);
    };
    public static parseSimple(str: string): IMatrix  {
        var arr = str.split('|').map(i => i.trim().split(' ').map(i => Number.parseFloat(i)));
        return new Matrix(arr.length, arr[0].length, arr);
    }
}
