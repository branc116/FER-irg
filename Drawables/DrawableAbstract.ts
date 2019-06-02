import { Drawable, DrawableTyped } from "./Drawable.js";
import { DrawableString } from "./DrawableString.js";
import { IVector } from "../Helpers/IVector.js";
import { Vector } from "../Helpers/Helpers.js";
import { mat4, create, identity, rotate, fromRotationTranslationScale, translate, rotateX, rotateY, rotateZ, scale, fromRotationTranslationScaleOrigin, multiply } from "../mat4/mat4.js";

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
    public bindNormals: boolean = false;
    
    public objectColor: IVector;
    public objectDifusionColor: IVector;
    public objectReflectionColor: IVector;
    
    private u_object_color: WebGLUniformLocation | null = null;
    private u_object_difusionColor: WebGLUniformLocation | null = null;
    private u_object_reflectionColor: WebGLUniformLocation | null = null;

    public Draw(gl: WebGLRenderingContext, program: WebGLProgram, atributeLocationName: string) {
        if (this.enable()) {
            this.u_object_color = this.u_object_color || gl.getUniformLocation(program, "u_object_color");
            this.u_object_difusionColor = this.u_object_difusionColor || gl.getUniformLocation(program, "u_object_difusionColor");
            this.u_object_reflectionColor = this.u_object_reflectionColor || gl.getUniformLocation(program, "u_object_reflectionColor");

            gl.uniform3fv(this.u_object_color, this.objectColor.toArray());
            gl.uniform3fv(this.u_object_difusionColor, this.objectDifusionColor.toArray());
            gl.uniform3fv(this.u_object_reflectionColor, this.objectReflectionColor.toArray());

            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            
            if (this.bindNormals) {
                const coords = gl.getAttribLocation(program, atributeLocationName);
                gl.enableVertexAttribArray(coords);
                const norms = gl.getAttribLocation(program, "normals");
                gl.enableVertexAttribArray(norms);
                gl.vertexAttribPointer(coords, this.getDimensions(), gl.FLOAT, false, 0, 0);
                gl.vertexAttribPointer(norms, this.getDimensions(), gl.FLOAT, false, 0, 0);
            }else {
                const coords = gl.getAttribLocation(program, atributeLocationName);
                gl.enableVertexAttribArray(coords);
                gl.vertexAttribPointer(coords, this.getDimensions(), gl.FLOAT, false, 0, 0);
            }
            
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

        this.objectColor = new Vector([0.9, 0.1, 0.1]);
        this.objectDifusionColor = new Vector([5.2, 3.1, 0.1]);
        this.objectReflectionColor = new Vector([0.1, 0.1, 0.1]);
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
    private transate: mat4 = create();
    public getDrawablesTransformMatrix() : mat4 {
        identity(this.tempM);
        rotateX(this.tempM, this.tempM, this.rotateVector.get(0));
        rotateY(this.tempM, this.tempM, this.rotateVector.get(1));
        rotateZ(this.tempM, this.tempM, this.rotateVector.get(2));
        identity(this.transate);
        translate(this.transate, this.transate, this.translateVector.toVec3());
        multiply(this.tempM, this.transate, this.tempM);
        // scale(this.tempM, this.tempM, this.scaleVector.toVec3());
        return this.tempM;
        // fromRotationTranslationScale(this.tempM, [this.rotateVector.get(0), this.rotateVector.get(1), this.rotateVector.get(2), 1], this.translateVector.toVec3(), this.scaleVector.toVec3());
        // return this.tempM;
    }
    static counter: number = 0;
}
