import { SceneAbstract, MouseButton } from "../Lab2/SceneAbstract.js";
import { Triangles } from "./Triangles.js";
import { Vector } from "../Helpers/Helpers.js";
import { Mesh } from "./Model.js";
import { OrbitCamera } from "../Cameras/OrbitCamera.js";
import { Point } from "../Drawables/Point.js";
import * as m from "../mat4/mat4.js";
export class Zadatak5 extends SceneAbstract {
    /**
     *
     */
    public curMesh?: Triangles;
    public curTestPoinr?: Point;
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, "zad5.vert", "zad5.frag");
        const c = this.camera = new OrbitCamera(30, 0.5);
        canvas.addEventListener("wheel", (ev: WheelEvent) => {
            ev.preventDefault();
            c.radius *= (Math.sign(ev.deltaY) > 0 ? 1.3 : 1/1.3);
            if (c.radius < 0.1)
                c.radius = 0.1;
            return false;
        });
        let lastY = 0;
        this.mouseMove = (cntx, button) => {
            if (button == MouseButton.Middle) {
                c.lookAt.set(1, c.lookAt.get(1) + (cntx.mouseLocation[1] - lastY) / 10);
            }else if (button != 0) {
                return false;
            }
            lastY = cntx.mouseLocation[1];
        }
        Mesh.fromUri("/obj/Postolje_obj.obj")
            .then(i => {
                this.replace(undefined, i.getTriangles());
            });
        let stip: Triangles;
        let mm = m.identity(m.create());
        Mesh.fromUri("/obj/Ruka_obj.obj")
            .then(i => {
                const triangles = stip = i.getTriangles();
                // m.rotateZ(mm, m.identity(m.create()), -1);
                triangles.transformMatrix = mm;
                this.replace(undefined, triangles);
        });
        Mesh.fromUri("/obj/StipaljkaL_obj.obj")
        .then(i => {
            const tri = i.getTriangles();
            tri.transformMatrix = mm;
            this.replace(undefined, tri);
        });
        Mesh.fromUri("/obj/StipaljkaR_obj.obj")
        .then(i => {
            const trinagles = i.getTriangles();
            trinagles.transformMatrix = mm;
            this.replace(undefined, trinagles);
        });
        const input = document.getElementById("Zad5input");
        let newMesh: Mesh = new Mesh();
        if (input) {
            const i = input as HTMLTextAreaElement;
            input.addEventListener("change", (t) => {
                try {
                    newMesh = Mesh.fromString(i.value);
                    const newTriangles = newMesh.getTriangles();
                    this.curMesh = this.replace(this.curMesh, newTriangles);
                } catch (e){
                    console.error(e);
                }
            })
        }
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
            norm.addEventListener("click", () => {
                try{
                    newMesh = newMesh.normalize();
                    this.curMesh = this.replace(this.curMesh, newMesh.getTriangles());
                    i.value = newMesh.toObj();
                } catch(e) {
                    console.error(e);
                }
            })
        }

        // window.setInterval(async () => {
        //     if (!stip)
        //         return;
        //     const newAng = await fetch("http://blynk-cloud.com/ad3d8b897617484b9d21b6fe380cf582/get/V5");
        //     const val = JSON.parse(await newAng.text())[0];
        //     // var mm = m.identity(m.create());
        //     m.rotateZ(mm, m.identity(m.create()), Number.parseFloat(val));
        //     stip.transformMatrix = mm;
        // }, 200);
        // Mesh.fromString()
    }
    
}