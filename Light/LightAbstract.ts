import { SceneAbstract } from "../SceneAbstract.js";

export abstract class LightAbstract {
    
    public abstract updateUniforms(scene: SceneAbstract): void;
}