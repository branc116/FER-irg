import { LightAbstract } from "./LightAbstract.js";
import { SceneAbstract } from "../SceneAbstract.js";
import { IVector } from "../Helpers/IVector.js";
import { Vector } from "../Helpers/Helpers.js";

export class PointLight extends LightAbstract {
    private u_location: WebGLUniformLocation | null = null;
    private u_light_ambient: WebGLUniformLocation | null = null;
    private u_light_difusion: WebGLUniformLocation | null = null;
    private u_light_reflection: WebGLUniformLocation | null = null;
    
    public location: IVector;
    public ambientColor: IVector;
    public difusionColor: IVector;
    public reflectionColor: IVector;

    constructor() {
        super();
        this.location = new Vector([5, 5, 5]);
        this.ambientColor = new Vector(   [1.0, 1.0, 1.0]);
        this.difusionColor = new Vector(  [1.1, 1.1, 1.1]);
        this.reflectionColor = new Vector([0.3, 0.3, 0.3]);
    }

    public updateUniforms(scene: SceneAbstract) {
        this.u_location = this.u_location == null ? scene.getUniformLocation("u_light_location") : this.u_location;
        this.u_light_ambient = this.u_light_ambient == null ? scene.getUniformLocation("u_light_ambient") : this.u_light_ambient;
        this.u_light_difusion = this.u_light_difusion == null ? scene.getUniformLocation("u_light_difusion") : this.u_light_difusion;
        this.u_light_reflection = this.u_light_reflection == null ? scene.getUniformLocation("u_light_reflection") : this.u_light_reflection;

        scene.gl.uniform3fv(this.u_location, this.location.toArray()); 
        scene.gl.uniform3fv(this.u_light_ambient, this.ambientColor.toArray()); 
        scene.gl.uniform3fv(this.u_light_difusion, this.difusionColor.toArray()); 
        scene.gl.uniform3fv(this.u_light_reflection, this.reflectionColor.toArray()); 
    }
}