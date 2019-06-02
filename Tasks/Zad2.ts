import { SceneAbstract } from "../SceneAbstract.js";
import { Triangle } from "../Drawables/Triangle.js";
import { Point } from "../Drawables/Point.js";
import { DrawableLine } from "../Drawables/Line.js";
import { Drawable } from "../Drawables/Drawable.js";
import { Vector } from "../Helpers/Helpers.js";

export class Zadatak2 extends SceneAbstract {
    public currentPoint?: Drawable;

    constructor(canvas: HTMLCanvasElement){
        super(canvas, "/shaders/zad2_vector_shader.vert", "/shaders/zad2_frag_shader.frag");
        this.currentPoint = new Point(new Vector([0, 0]));
        this.mouseMove = (context: SceneAbstract) => {
            if (!this.currentPoint) {
                this.currentPoint = context.replace(this.currentPoint, new Point(new Vector(context.mouseLocation)));
                return;
            }
            switch (this.currentPoint.type) {
                case "Point": 
                    this.currentPoint = context.replace(this.currentPoint, new Point(new Vector(context.mouseLocation)));
                    break;
                case "Line":
                    this.currentPoint = context.replace(this.currentPoint, new DrawableLine([(this.currentPoint as DrawableLine).points[0], new Vector(context.mouseLocation)]));
                    break;
                case "Triangle":
                    this.currentPoint = context.replace(this.currentPoint, new Triangle([(this.currentPoint as Triangle).points[0],(this.currentPoint as Triangle).points[1], new Vector(context.mouseLocation)]));
                    break;
            }
        }
        this.mouseClick = (context: SceneAbstract) => {
            if (!this.currentPoint)
                return;
            switch (this.currentPoint.type) {
                case "Point": 
                    this.currentPoint = context.replace(this.currentPoint, new DrawableLine([new Vector(context.mouseLocation), new Vector(context.mouseLocation)]));
                    break;
                case "Line":
                    const l = this.currentPoint as Point;
                    this.currentPoint = context.replace(this.currentPoint, new Triangle([(this.currentPoint as DrawableLine).points[0], new Vector(context.mouseLocation), new Vector(context.mouseLocation)]));
                    break;
                case "Triangle":
                    this.currentPoint = undefined;
                    break;
            }
        }
    }
}