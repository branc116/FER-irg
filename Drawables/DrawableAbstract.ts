import { Drawable, DrawableTyped } from "./Drawable.js";
import { DrawableString } from "./DrawableString.js";

export abstract class DrawableAbstract<T extends Drawable> implements DrawableTyped<T> {
    abstract getPoints(): Float32Array;
    abstract getDimensions(): number;
    abstract glDrawArray(gl: WebGLRenderingContext): void;
    buffer: WebGLBuffer | null = null;
    private inited = false;
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
    static counter: number = 0;
}
