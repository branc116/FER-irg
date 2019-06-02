import { SceneAbstract } from "../SceneAbstract.js";
import { Triangles } from "../Drawables/Triangles.js";
import { Vector } from "../Helpers/Helpers.js";
import { Mesh } from "../Helpers/Model.js";
import { Point } from "../Drawables/Point.js";
import * as m from "../mat4/mat4.js";
import { StationaryCamera } from "../Cameras/StationaryCamera.js";
import { WsadScript } from "../Scripts/WsadMoveScript.js";
import { RightClickRotateMouseScript } from "../Scripts/RightClickRotateMouseScript.js";
import { ToggleWireAndTrinagles } from "../Scripts/ToggleWireAndTringles.js";
import { Triangle } from "../Drawables/Triangle.js";
import { OrbitCamera } from "../Cameras/OrbitCamera.js";
function f(scene: Zadatak5) {
    if (scene.pressedButtons.find(i => i == "c"))
        scene.enableCull = !scene.enableCull;
}
export class Zadatak5 extends SceneAbstract {
    public curMesh?: Triangles;
    public curTestPoinr?: Point;
    public enableCull?: boolean;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, "/shaders/zad8.vert", "/shaders/zad8.frag");

        const c = this.camera =  new StationaryCamera(new Vector([0, 20, 20]), new Vector([0, 0, 0]));
        this.preRenderScripts.push(WsadScript);
        this.mouseMoveScripts.push(RightClickRotateMouseScript);
        this.preRenderScripts.push(ToggleWireAndTrinagles);
        this.preRenderScripts.push(f);
        Mesh.fromUri("/obj/house.obj")
            .then(i => {
                const tri = i.getTriangles();
                tri.bindNormals = true;
                // tri.triangles.forEach(i => {
                //     const t = new Triangle(i);
                //     t.enable = () => {
                //         return t.isBackFace(this.camera.cam);
                //     };
                //     this.replace(undefined, t);
                // });
                this.replace(undefined, tri);
            })

        const input = document.getElementById("Zad5input");
        const testPoint = document.getElementById("Zad5testPoint");
        const out = document.getElementById("Zad5output");
        const norm = document.getElementById("Zad5norm");
        if (input && out && norm && testPoint) {
            const p = testPoint as HTMLInputElement;
            const o = out as HTMLParagraphElement;
            const i = input as HTMLTextAreaElement;
            let last = "0, 0, 0";
            testPoint.addEventListener("keyup", () => {
                try{
                    if (p.value == last)
                        return;
                    const point = Vector.parseSimple(p.value);
                    if (point.getDimensions() != 3)
                        return;
                    last = p.value;
                    this.curTestPoinr = this.replace(this.curTestPoinr, new Point(point));
                    if (this.curMesh) {
                        const isInside = this.curMesh.isInside(point);
                        out.innerHTML = isInside ? "Nutra je" : "Nije nutra";
                    }
                }catch(e) {
                    console.error(e);
                }
            });
        }
    }
}