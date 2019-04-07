import { SceneAbstract } from "../Lab2/SceneAbstract.js";
import { Triangle } from "../Drawables/Triangle.js";
import { Vector } from "../Helpers/Helpers.js";
import { Model } from "./Model.js";

export class Zadatak5 extends SceneAbstract {
    /**
     *
     */
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, "zad5.vert", "zad5.frag");
        // var a = new Triangle([
        //     new Vector([-1, 0, 0]),
        //     new Vector([0, 1, 0]),
        //     new Vector([1, 0, 0])
        // ]);
        // this.replace(undefined, new Triangle([
        //     new Vector([-1, 0, 0]),
        //     new Vector([0, 1, 0]),
        //     new Vector([1, 0, 0])
        // ]));
        let i = 0;
        window.setInterval(() => {
            this.globalRotation.set(0, this.globalRotation.get(0) + 0.01);
            this.globalRotation.set(1, this.globalRotation.get(1) + 0.005);
        }, 10);
        window.setInterval(() => {
            i = (i + 1) % 3;
        }, 3000);
        this.cam = new Vector([30, 30, 30]);
        window.setTimeout(async () => {
            const human = new Model("/obj/something.obj");
            const box = new Model("/obj/box.obj");
            const house = new Model("/obj/house.obj");

            const humant = await human.getTriangles()
            const boxt = await box.getTriangles()
            const houset = await house.getTriangles()
            humant.enable = () => {
                return i == 0
            }
            boxt.enable = () => {
                return i == 1
            }
            houset.enable = () => {
                return i == 2
            }
            this.replace(undefined,humant );
            this.replace(undefined,boxt );
            this.replace(undefined,houset );
        }, 100);
        }
}