import { DrawableString } from "./DrawableString";
import { mat4 } from "../mat4/mat4";

export interface DrawableTyped<T extends Drawable> extends Drawable {
    readonly type: DrawableString<T>;
}
export interface Drawable {
    buffer: WebGLBuffer | null;
    readonly type: string;
    readonly id: number;
    Initialize(gl: WebGLRenderingContext): void;
    Draw(gl: WebGLRenderingContext, program: WebGLProgram, atributeLocationName: string): void;
    Destroy(gl: WebGLRenderingContext): void;
    getPoints(): Float32Array;
    enable(): boolean;
    getDrawablesTransformMatrix() : mat4;
}
