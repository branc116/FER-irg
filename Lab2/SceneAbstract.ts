import { Triangle } from "../Drawables/Triangle.js";
import { Drawable, DrawableTyped } from "../Drawables/Drawable.js";
import { Vector } from "../Helpers/Helpers.js";
import { IVector } from "../Helpers/IVector.js";
import { AbstractCamera } from "../Cameras/AbstractCamera.js";
import { StationaryCamera } from "../Cameras/StationaryCamera.js";
import { IScene, MouseButton } from "../IScene.js";
import { MouseMoveScript } from "../Scripts/IMouseMoveScript.js";


export abstract class SceneAbstract implements IScene {
    public camera: AbstractCamera  = new StationaryCamera(new Vector([0, 0, -5]), new Vector([0, 0, 0]));
    public mouseMoveScripts: MouseMoveScript[];
    public preRenderScripts: ((scene: this) => void)[] = [];
    public globalRotation: IVector = new Vector([0, 0, 0]);
    public pressedButtons: string[] = [];

    public mouseDelta: IVector = new Vector([0, 0]);
    public mouseLocation: [number, number];
    public pressedMouseButtons: MouseButton = 0;

    protected gl: WebGL2RenderingContext;
    protected used: boolean = false;
    protected shaderProgram: WebGLProgram | null;
    protected aspectRatio: number = 1;
    
    protected buffer: WebGLBuffer | null = null;

    public drawables: Drawable[] = [];

    private u_mouse: null | WebGLUniformLocation = null;
    private u_resolution: null | WebGLUniformLocation = null;
    private u_time: null | WebGLUniformLocation = null;

    private u_globalRotation: null | WebGLUniformLocation = null;

    public u_worldTransform: null | WebGLUniformLocation = null;
    public u_objectTransform: null | WebGLUniformLocation = null;

    public static trans: null | WebGLUniformLocation = null;

    customUnforms: (context: this) => void = () => {};
    public mouseMove: (context: this, button: MouseButton) => void = () => {};
    public mouseClick: (context: this, button: MouseButton) => void | boolean = () => {};

    constructor(protected canvas: HTMLCanvasElement, private vertexShaderName: string = "zad2_vector_shader.vert", private fragmentShaderName: string = "zad2_frag_shader.frag") {
        const g = canvas.getContext("webgl2");
        canvas.addEventListener("mousemove",i => { this.mMove(i) });
        canvas.addEventListener("mouseup", i => {this.mClick(i)} );
        canvas.addEventListener("contextmenu", i => {i.preventDefault();});
        canvas.addEventListener("mousedown", i => {return false;});
        window.addEventListener("keydown", (e) => {
            this.pressedButtons.findIndex((i) => i == e.key) == -1 ? this.pressedButtons.push(e.key) : undefined;
        }, false);
        window.addEventListener("keyup", (e) => {
            this.pressedButtons = this.pressedButtons.filter(i => i != e.key);
        }, false);
        this.mouseMoveScripts = [];
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
    private oldOffsetX?:number = undefined;
    private oldOffsetY?:number = undefined;
    private mMove(e: MouseEvent) {
        this.mouseLocation[0] = e.offsetX;
        this.mouseLocation[1] = e.offsetY;
        if (this.oldOffsetX && this.oldOffsetY) {
            this.mouseDelta.set(0, e.offsetX - this.oldOffsetX);
            this.mouseDelta.set(1, e.offsetY - this.oldOffsetY);
        }
        this.oldOffsetX = e.offsetX;
        this.oldOffsetY = e.offsetY;
        this.pressedMouseButtons = e.buttons;

        this.mouseMoveScripts.forEach(i => {
            i(this);
        })
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


        
        this.u_globalRotation = this.getUniformLocation("u_globalRotation");

        this.u_worldTransform = this.getUniformLocation("u_worldTransfrom");
        this.u_objectTransform = this.getUniformLocation("u_objectTransform");

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
        this.preRenderScripts.forEach(i => {
            i(this);
        });
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clearColor(0.8, 0.9, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.uniform2fv(this.u_mouse, this.mouseLocation);
        gl.uniform2fv(this.u_resolution, [this.canvas.width, this.canvas.height]);
        gl.uniform1f(this.u_time, currentTime);

        this.camera.updateCamLocation(currentTime);
        this.camera.updateLookAt(currentTime);

        gl.uniform3fv(this.u_globalRotation, this.globalRotation.toArray());
        gl.uniformMatrix4fv(this.u_worldTransform, false, this.camera.getTransformMatrix());

        this.customUnforms(this);
        
        for (let i = 0;i<this.drawables.length;i++) {
            if (this.drawables[i].enable())
                gl.uniformMatrix4fv(this.u_objectTransform, false, this.drawables[i].getDrawablesTransformMatrix());
                this.drawables[i].Draw(gl, this.shaderProgram, "coordinates");
        }

        window.requestAnimationFrame((currentTime) => {
            this.animateScene(currentTime);
        });
    }
    private async loadShader(shaderPath: string, type: GLenum) {
        const ret = await fetch(`${shaderPath}`)
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

