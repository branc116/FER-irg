import { Triangle } from "../Drawables/Triangle.js";
import { Drawable, DrawableTyped } from "../Drawables/Drawable.js";
import { Vector } from "../Helpers/Helpers.js";
import { IVector } from "../Helpers/IVector.js";
import { AbstractCamera } from "../Cameras/AbstractCamera.js";
import { StationaryCamera } from "../Cameras/StationaryCamera.js";
export enum MouseButton {
    Left = 1,
    Middle = 2,
    Right = 3
}
export abstract class SceneAbstract {
    public cam: IVector = new Vector([0, 0, -5]);
    public center: IVector = new Vector([0, 0, 0]);
    public up: IVector = new Vector([0, 1, 0]);
    public camera: AbstractCamera  = new StationaryCamera(new Vector([0, 0, -5]), new Vector([0, 0, 0]));
    public fov: number = Math.PI/4;
    public aspect: number = 1.0;
    public near: number = 0.1;
    public far: number = 1000.0;

    public globalRotation: IVector = new Vector([0, 0, 0]);

    protected gl: WebGL2RenderingContext;
    protected used: boolean = false;
    protected shaderProgram: WebGLProgram | null;
    protected aspectRatio: number = 1;
    protected mouseLocation: [number, number];
    protected buffer: WebGLBuffer | null = null;

    private drawables: Drawable[] = [];

    private u_mouse: null | WebGLUniformLocation = null;
    private u_resolution: null | WebGLUniformLocation = null;
    private u_time: null | WebGLUniformLocation = null;

    private u_cam: null | WebGLUniformLocation = null;
    private u_center: null | WebGLUniformLocation = null;
    private u_up: null | WebGLUniformLocation = null;
    private u_fov: null | WebGLUniformLocation = null;

    private u_aspect: null | WebGLUniformLocation = null;
    private u_near: null | WebGLUniformLocation = null;
    private u_far: null | WebGLUniformLocation = null;
    private u_globalRotation: null | WebGLUniformLocation = null;

    customUnforms: (context: this) => void = () => {};
    public mouseMove: (context: this, button: MouseButton) => void = () => {};
    public mouseClick: (context: this, button: MouseButton) => void | boolean = () => {};

    constructor(protected canvas: HTMLCanvasElement, private vertexShaderName: string = "zad2_vector_shader.vert", private fragmentShaderName: string = "zad2_frag_shader.frag") {
        const g = canvas.getContext("webgl2");
        canvas.addEventListener("mousemove",i => { this.mMove(i) });
        canvas.addEventListener("mouseup", i => {this.mClick(i)} );
        canvas.addEventListener("contextmenu", i => {i.preventDefault();});
        canvas.addEventListener("mousedown", i => {return false;});
        this.mouseLocation = [0, 0];
        if (!g)
            throw new Error("no gl");
        this.gl = g;
        this.shaderProgram = null;
        this.drawables = [];
    }
    public replace<T extends Drawable>(replaced?: Drawable, newElement?: T | undefined): T | undefined {
        if (replaced){
            replaced.Destroy(this.gl);
            this.drawables = [...this.drawables.filter(i => i.id != replaced.id)];
        }
        if (newElement) {
            newElement.Initialize(this.gl);
            this.drawables.push(newElement);
        }
        return newElement;
    }
    private mMove(e: MouseEvent) {
        this.mouseLocation[0] = e.offsetX;
        this.mouseLocation[1] = e.offsetY;
        this.mouseMove(this, e.buttons);
    }
    private mClick(e: MouseEvent) {
        return this.mouseClick(this, e.which);
    }
    public async setup() {
        const gl = this.gl;
        const shaderSet = [
            {
                type: gl.VERTEX_SHADER,
                shaderPath: this.vertexShaderName
            },
            {
                type: gl.FRAGMENT_SHADER,
                shaderPath: this.fragmentShaderName
            }
        ];

        this.shaderProgram = await this.buildShaderProgram(shaderSet);
        this.aspectRatio = this.canvas.width / this.canvas.height;
        this.drawables.forEach(i => i.Initialize(gl));

        this.u_time = this.getUniformLocation("u_time");
        this.u_resolution = this.getUniformLocation("u_resolution");
        this.u_mouse = this.getUniformLocation("u_mouse");

        this.u_fov = this.getUniformLocation("u_fov");
        this.u_aspect = this.getUniformLocation("u_aspect");
        this.u_near = this.getUniformLocation("u_near");
        this.u_far = this.getUniformLocation("u_far");

        this.u_cam = this.getUniformLocation("u_cam");
        this.u_center = this.getUniformLocation("u_center");
        this.u_up = this.getUniformLocation("u_up");
        
        this.u_globalRotation = this.getUniformLocation("u_globalRotation");

        this.animateScene();
    }
    public getUniformLocation(uniformName: string) {
        if(!this.shaderProgram)
            throw new Error ("no shader program");
        return this.gl.getUniformLocation(this.shaderProgram, uniformName);
    }
    public animateScene(currentTime: number = 0) {
        if (!this.shaderProgram)
            throw new Error("No Shader program");
        const gl = this.gl;
        gl.enable(gl.DEPTH_TEST);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(this.shaderProgram);
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clearColor(0.8, 0.9, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniform2fv(this.u_mouse, this.mouseLocation);
        gl.uniform2fv(this.u_resolution, [this.canvas.width, this.canvas.height]);
        gl.uniform1f(this.u_time, currentTime);

        gl.uniform3fv(this.u_cam, this.camera.updateCamLocation(currentTime).toArray());
        gl.uniform3fv(this.u_center, this.camera.updateLookAt(currentTime).toArray());
        gl.uniform3fv(this.u_up, this.up.toArray());

        gl.uniform1f(this.u_fov, this.fov);
        gl.uniform1f(this.u_aspect, this.aspect);
        gl.uniform1f(this.u_near, this.near);
        gl.uniform1f(this.u_far, this.far);

        gl.uniform3fv(this.u_globalRotation, this.globalRotation.toArray());

        this.customUnforms(this);
        for (let i = 0;i<this.drawables.length;i++) {
            if (this.drawables[i].enable())
                this.drawables[i].Draw(gl, this.shaderProgram, "coordinates");
        }

        window.requestAnimationFrame((currentTime) => {
            this.animateScene(currentTime);
        });
    }
    private async loadShader(shaderPath: string, type: GLenum) {
        const ret = await fetch(`shaders/${shaderPath}`)
            .then(i => i.text())
            .then(i => {
                var shader = this.gl.createShader(type);
                if (!shader)
                    throw new Error(`No ${shaderPath} Shader`)
            this.gl.shaderSource(shader, i);
                this.gl.compileShader(shader);
                const errors = this.gl.getShaderInfoLog(shader);
                console.log(`${shaderPath}: ${errors}`);
                return shader;
            })
            .catch(i => { console.error(i); throw new Error(`No ${shaderPath} shader ${i}`) });
        return ret;
    }
    private async buildShaderProgram(shaderInfo: { shaderPath: string, type: GLenum }[]) {
        const program = this.gl.createProgram();
        if (!program)
            throw new Error("NoProgram");
        for(let i=0;i<shaderInfo.length;i++) {
            let shader = await this.loadShader(shaderInfo[i].shaderPath, shaderInfo[i].type);
            if (shader) {
                this.gl.attachShader(program, shader);
            }
        }

        this.gl.linkProgram(program)

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.log("Error linking shader program:");
            console.log(this.gl.getProgramInfoLog(program));
        }

        return program;
    }
}

