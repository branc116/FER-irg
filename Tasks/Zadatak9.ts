import { SceneAbstract } from "../SceneAbstract.js";
import { Triangle } from "../Drawables/Triangle.js";
import { Vector } from "../Helpers/Helpers.js";
import { StationaryCamera } from "../Cameras/StationaryCamera.js";

export class Zadatak9 extends SceneAbstract {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, "/shaders/zad9.vert", "/shaders/zad9.frag");
        const tri1 = new Triangle([
            new Vector([-100, 100, 0]),
            new Vector([100, 100, 0]),
            new Vector([100, -100, 0])]);
        const tri2 = new Triangle([
            new Vector([100, -100, 0]),
            new Vector([-100, -100, 0]),
            new Vector([-100, 100, 0])]);
        this.replace(undefined, tri1);
        this.replace(undefined, tri2);
        this.camera = new StationaryCamera(new Vector([0, 0, 1]), new Vector([0, 0, 0]));
        this.preRenderScripts.push((scene) => {
            let curz = scene.camera.cam.get(2);
            if (this.pressedButtons.find(i => i == "e")) {
                scene.camera.cam.set(2, curz*1.01);
            }
            if (this.pressedButtons.find(i => i == "q")) {
                scene.camera.cam.set(2, curz*0.99);
            }
            if (this.pressedButtons.find(i => i == "w")) {
                scene.camera.cam.set(1, scene.camera.cam.get(1) + curz/10);
            }
            if (this.pressedButtons.find(i => i == "s")) {
                scene.camera.cam.set(1, scene.camera.cam.get(1) - curz/10);
            }
            if (this.pressedButtons.find(i => i == "d")) {
                scene.camera.cam.set(0, scene.camera.cam.get(0) + curz/10);
            }
            if (this.pressedButtons.find(i => i == "a")) {
                scene.camera.cam.set(0, scene.camera.cam.get(0) - curz/10);
            }
        });
    }
}