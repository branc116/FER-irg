import { SceneAbstract } from "../Lab2/SceneAbstract.js";
import { Vector } from "../Helpers/Helpers.js";
import { Point } from "../Drawables/Point.js";
import * as m from "../mat4/mat4.js";
import { StationaryCamera } from "../Cameras/StationaryCamera.js";
import { WsadScript } from "../Scripts/WsadMoveScript.js";
import { RightClickRotateMouseScript } from "../Scripts/RightClickRotateMouseScript.js";
import { ToggleWireAndTrinagles } from "../Scripts/ToggleWireAndTringles.js";
import { Triangle } from "../Drawables/Triangle.js";
import { Triangles } from "../Lab5/Triangles.js";
import { Mesh } from "../Lab5/Model.js";
function f(scene: Zadatak7) {
    if (scene.pressedButtons.find(i => i == "c"))
        scene.enableCull = !scene.enableCull;
}
export class Zadatak7 extends SceneAbstract {
    public curMesh?: Triangles;
    public curTestPoinr?: Point;
    public enableCull?: boolean;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, "/shaders/zad5.vert", "/shaders/zad5.frag");

        const c = this.camera = new StationaryCamera(new Vector([0, 20, 20]), new Vector([0, 0, 0]));
        this.preRenderScripts.push(WsadScript);
        this.mouseMoveScripts.push(RightClickRotateMouseScript);
        this.preRenderScripts.push(ToggleWireAndTrinagles);
        this.preRenderScripts.push(f);
        Mesh.fromUri("/obj/Postolje_obj.obj")
            .then(i => {
                const tri = i.getTriangles();
                tri.triangles.forEach(i => {
                    const t = new Triangle(i);
                    t.enable = () => {
                        return t.isBackFace(this.camera.cam);
                    };
                    this.replace(undefined, t);
                });
            });
        Mesh.fromUri("/obj/Ruka_obj.obj")
            .then(i => {
                const triangles =  i.getTriangles();
                triangles.triangles.forEach(j => {
                    const t = new Triangle(j);
                    t.enable = () => {
                        return this.enableCull || t.isBackFace(this.camera.cam);
                    };
                    this.replace(undefined, t);
                });
                // this.replace(undefined, triangles);
        });
        Mesh.fromUri("/obj/StipaljkaL_obj.obj")
        .then(i => {
            const tri = i.getTriangles();
            tri.triangles.forEach(i => {
                const t = new Triangle(i);
                t.enable = () => {
                    return t.isBackFace(this.camera.cam);
                };
                this.replace(undefined, t);
            });
            // this.replace(undefined, tri);
            
        });
        Mesh.fromUri("/obj/StipaljkaR_obj.obj")
            .then(i => {
                const trinagles = i.getTriangles();
                trinagles.triangles.forEach(j => {
                    const t = new Triangle(j);
                    t.enable = () => {
                        return this.enableCull || t.isBackFace(this.camera.cam);
                    };
                    this.replace(undefined, t);
            });
        });

        const input = document.getElementById("Zad5input");
        
    }
}