import { Drawable, DrawableTyped } from "./Drawable.js";
import { DrawableString } from "./DrawableString.js";
import { IVector } from "../Helpers/IVector.js";
import { Vector } from "../Helpers/Helpers.js";
import { mat4, create, identity, rotate, fromRotationTranslationScale } from "../mat4/mat4.js";

export abstract class DrawableAbstract<T extends Drawable> implements DrawableTyped<T> {
    abstract getPoints(): Float32Array;
    abstract getDimensions(): number;
    abstract glDrawArray(gl: WebGLRenderingContext): void;
    buffer: WebGLBuffer | null = null;
    private inited = false;
    public scaleVector: IVector;
    public translateVector: IVector;
    public rotateVector: IVector;
    public drawMode: "Fill" | "Wireframe" = "Fill";
    public Draw(gl: WebGLRenderingContext, program: WebGLProgram, atributeLocationName: string) {
        if (this.enable()) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            const coords = gl.getAttribLocation(program, atributeLocationName);
            gl.enableVertexAttribArray(coords);
            gl.vertexAttribPointer(coords, this.getDimensions(), gl.FLOAT, false, 0, 0);
            this.glDrawArray(gl);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
    }
    public readonly abstract type: DrawableString<T>;
    public readonly id: number;
    public enable: () => boolean = () => true;

    constructor() {
        this.id = DrawableAbstract.counter++;
        this.scaleVector = new Vector([1, 1, 1]);
        this.translateVector = new Vector([0, 0, 0]);
        this.rotateVector = new Vector([0, 0, 0]);
    }
    Destroy(gl: WebGLRenderingContext): void {
        gl.deleteBuffer(this.buffer);
    }
    public Initialize(gl: WebGLRenderingContext) {
        if (!this.inited) {
            this.buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.getPoints(), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            this.inited = true;
        }
    }
    private tempM: mat4 = create();
    public getDrawablesTransformMatrix() : mat4 {
        identity(this.tempM);
        fromRotationTranslationScale(this.tempM, [this.rotateVector.get(0), this.rotateVector.get(1), this.rotateVector.get(2), 1], this.translateVector.toVec3(), this.scaleVector.toVec3());
        return this.tempM;
    }
    static counter: number = 0;
}
