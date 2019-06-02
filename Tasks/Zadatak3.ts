import { SceneAbstract } from "../SceneAbstract.js";
import { Drawable, DrawableTyped } from "../Drawables/Drawable.js";
import { Point } from "../Drawables/Point.js";
import { Vector } from "../Helpers/Helpers.js";
import { DrawableLine } from "../Drawables/Line.js";
import { IVector } from "../Helpers/IVector.js";
import { Triangle } from "../Drawables/Triangle.js";
import { LineSegments } from "../Drawables/LineSegments.js";
import { getLanguage } from "highlight.js";
import { Points } from "../Drawables/Points.js";

export class Zadatak3 extends SceneAbstract {
    public currentPoint?: DrawableTyped<DrawableLine | Point | Triangle>;
    public lines?: LineSegments;
    public bPoints?: Points;
    public getOdsjecanjeY() {
        if (typeof this.odsjecanje === "number")
            return this.canvas.height*this.odsjecanje;
        return undefined;
    }
    constructor(canvas: HTMLCanvasElement, public kontrola: boolean, public odsjecanje?: number | boolean) {
        super(canvas, "/Shaders/zad3.vert", "/Shaders/zad3.frag");
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
                    const l = this.currentPoint as DrawableLine;
                    const newL = new DrawableLine(l.points.map(i => i.nAdd(new Vector([20, 0]))));
                    const newLines = new LineSegments([...(this.lines ? this.lines.lines : []), [newL.points[0], newL.points[1]]]);
                    newLines.enable = () => {
                        return this.kontrola;
                    };
                    
                    const points = this.Bresenham([l.points[0], l.points[1]]);
                    const newPoints = new Points([...(this.bPoints ? this.bPoints.point : []), ...points]);

                    context.replace(l, undefined);
                    this.lines = this.replace(this.lines, newLines);
                    this.bPoints = context.replace(this.bPoints, newPoints);

                    this.currentPoint = undefined;
                    break;
            }
        }
        this.customUnforms = (context: SceneAbstract) => {
            let location = this.getUniformLocation("u_cutoff");
            if (this.odsjecanje == undefined) {
                context.gl.uniform1f(location, 1);
            }else if (typeof this.odsjecanje == "number") {
                context.gl.uniform1f(location, this.odsjecanje);
            }else if (this.odsjecanje) {
                context.gl.uniform1f(location, 0.5);
            }else {
                context.gl.uniform1f(location, 1);
            }

        }
    }
    public Bresenham(line: [IVector, IVector]): IVector[] {
        const dx=5;
        
        var k = (line[1].get(1) - line[0].get(1)) / (line[1].get(0) - line[0].get(0));
        const retArr: IVector[] = [];
        
        if (Math.abs(k) < 1) {
            const [first, last] = line[0].get(0 ) < line[1].get(0) ? [line[0], line[1]] : [line[1], line[0]];
            let zeroy = first.get(1);
            let error = 0;
            for(let i=first.get(0); i<last.get(0); i+=dx) {
                retArr.push(new Vector([i,zeroy]));
                error+=Math.abs(k)*dx;
                while (error > 0.5) {
                    zeroy += Math.sign(k);
                    error -= 1;
                }
            }
        }
        else {
            const [first, last] = line[0].get(1) < line[1].get(1) ? [line[0], line[1]] : [line[1], line[0]];
            let zerox = first.get(0);
            let error = 0;
            for(let i=first.get(1); i<last.get(1); i+=dx) {
                retArr.push(new Vector([zerox,i]));
                error+=Math.abs(1/k)*dx;
                while (error > 0.5) {
                    zerox += Math.sign(k);
                    error -= 1;
                }
            }
        }
        // retArr.push(new Point(new Vector(last.toArray())))
        return retArr;
    }

}