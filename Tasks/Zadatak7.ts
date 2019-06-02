import { SceneAbstract } from "../SceneAbstract.js";
import { Vector } from "../Helpers/Helpers.js";
import { Point } from "../Drawables/Point.js";
import { StationaryCamera } from "../Cameras/StationaryCamera.js";
import { WsadScript } from "../Scripts/WsadMoveScript.js";
import { RightClickRotateMouseScript, LightOrbit } from "../Scripts/RightClickRotateMouseScript.js";
import { ToggleWireAndTrinagles } from "../Scripts/ToggleWireAndTringles.js";
import { Triangle } from "../Drawables/Triangle.js";
import { Triangles } from "../Drawables/Triangles.js";
import { Mesh } from "../Helpers/Model.js";
function f(scene: Zadatak7) {
    if (scene.pressedButtons.find(i => i == "c"))
        scene.enableCull = !scene.enableCull;
}

export class Zadatak7 extends SceneAbstract {
    public curMesh?: Triangles;
    public curTestPoinr?: Point;
    public enableCull?: boolean;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, "/shaders/zad8.vert", "/shaders/zad8.frag");

        const c = this.camera = new StationaryCamera(new Vector([0, 20, 20]), new Vector([0, 0, 0]));
        this.preRenderScripts.push(WsadScript);
        this.mouseMoveScripts.push(RightClickRotateMouseScript);
        this.preRenderScripts.push(ToggleWireAndTrinagles);
        this.preRenderScripts.push(f);
        this.preRenderScripts.push(LightOrbit);
        this.light.location = new Vector([7, 7, 7]);
        this.light.ambientColor = new Vector([1, 1, 1]);
        this.light.difusionColor = new Vector([0.2, 0.2, 0.2]);
        this.light.reflectionColor = new Vector([1, 1, 1]);
        
        ["/obj/Postolje_obj.obj", "/obj/Ruka_obj.obj", "/obj/StipaljkaL_obj.obj", "/obj/StipaljkaR_obj.obj"]
            .forEach(async i => {
                const mesh = await Mesh.fromUri(i);
                const trinagles = mesh.getTriangles();
                trinagles.bindNormals = true;
                trinagles.objectColor = new Vector([1, 0, 0]);
                trinagles.objectDifusionColor = new Vector([0, 0, 1]);
                trinagles.objectReflectionColor = new Vector([0, 1, 0]);
                this.replace(undefined, trinagles);
            });
    }
    // private async LoadModelsAsync(modelsToLoad: string[]) : Promise<void> {
    //     modelsToLoad.forEach(async i => {
    //         const mesh = await Mesh.fromUri(i);
    //         const trinagles = mesh.getTriangles();
    //         this.replace(undefined, trinagles);
    //     })
    // }
}