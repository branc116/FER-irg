import { DrawableString } from "./DrawableString";

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
}
