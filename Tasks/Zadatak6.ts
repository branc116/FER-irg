import { Triangle } from "../Drawables/Triangle.js";
import { Point } from "../Drawables/Point.js";
import { DrawableLine } from "../Drawables/Line.js";
import { Drawable } from "../Drawables/Drawable.js";
import { Vector } from "../Helpers/Helpers.js";
import { SceneAbstract } from "../SceneAbstract.js";
import { IVector } from "../Helpers/IVector.js";
import { BezierCurve } from "../Drawables/BezierCurve.js";

export class Zadatak6 extends SceneAbstract {
    public currentPoint?: Drawable;
    public points: IVector[] = [];
    public curBez?: BezierCurve;
    constructor(canvas: HTMLCanvasElement){
        super(canvas, "/shaders/zad2_vector_shader.vert", "/shaders/zad2_frag_shader.frag");
        this.currentPoint = new Point(new Vector([0, 0]));
        this.mouseClick = (context: this) => {
            this.points = [...this.points, new Vector([this.mouseLocation[0], this.mouseLocation[1]])];
                this.curBez = this.replace(this.curBez, new BezierCurve(this.points));
        }
    }
}