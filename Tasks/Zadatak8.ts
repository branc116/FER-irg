import { SceneAbstract } from "../SceneAbstract.js";
import { Sphere } from "../Drawables/Sphere.js";
import { WsadScript } from "../Scripts/WsadMoveScript.js";
import { RightClickRotateMouseScript } from "../Scripts/RightClickRotateMouseScript.js";
import { ToggleWireAndTrinagles } from "../Scripts/ToggleWireAndTringles.js";
import { OrbitCamera } from "../Cameras/OrbitCamera.js";
import { Vector } from "../Helpers/Helpers.js";
import { Mesh } from "../Helpers/Model.js";
import { PointLight } from "../Light/PointLight.js";

export class Zadatak8 extends SceneAbstract {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, "/shaders/zad8.vert", "/shaders/zad8.frag");
        // var sphere = new Sphere(1, 5);
        // const trangles = sphere.getTriangles();
        // trangles.bindNormals = true;

        // this.replace(undefined, trangles);
        // this.camera = new OrbitCamera(4, 0.5);
        this.preRenderScripts.push(WsadScript);
        this.mouseMoveScripts.push(RightClickRotateMouseScript);
        this.preRenderScripts.push(ToggleWireAndTrinagles);
        this.light = new PointLight();
        this.light.location = new Vector([20, -70, -20]);
        this.light.ambientColor =    new Vector([1, 1, 1]);
        this.light.difusionColor =   new Vector([0.1, 0.1, 0.1]);
        this.light.reflectionColor = new Vector([0.1, 0.1, 0.1]);
        var c = 0;
        ["/obj/skull.obj", "/obj/frog.obj"]
        .forEach(async i => {
            let mesh = await Mesh.fromUri(i);
            mesh = mesh.normalize();
            const trinagles = mesh.getTriangles();
            trinagles.bindNormals = true;
            trinagles.objectColor = new Vector([0.9, 0.2, 0]);
            trinagles.objectDifusionColor = new Vector([0, 0, 0.9]);
            trinagles.objectReflectionColor = new Vector([0, 0.9, 0]);
            // trinagles.rotateVector.set(0, 1);
            trinagles.translateVector.set(0, c*5);
            this.replace(undefined, trinagles);
            this.preRenderScripts.push(i => {
                trinagles.rotateVector.set(0, trinagles.rotateVector.get(0) + 0.01);
                trinagles.rotateVector.set(1, trinagles.rotateVector.get(0) + 0.01);
            });
            c++;
        });
    }
}