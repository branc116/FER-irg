import { SceneAbstract } from "../Lab2/SceneAbstract.js";
import { Poligon, StilCrtanja } from "./Poligon.js";
import { DrawableTyped, Drawable } from "../Drawables/Drawable.js";
import { Point } from "../Drawables/Point.js";
import { Vector } from "../Helpers/Helpers.js";
import { DrawableLine } from "../Drawables/Line.js";
import { IVector } from "../Helpers/IVector.js";
import { MouseButton } from "../IScene.js";

export class Zadatak4 extends SceneAbstract {
    /**
     *
     */
    public currentDraw?: Drawable;
    public points: IVector[] = [];
    public allOfThePoligonz: Poligon[] = [];
    
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, "/Shaders/zad4.vert", "/Shaders/zad4.frag");
        this.mouseMove = (context: this) => {
            if (!this.currentDraw) {
                this.currentDraw = context.replace(this.currentDraw, new Point(new Vector(context.mouseLocation)));
                return;
            }
            switch (this.currentDraw.type) {
                case "Point": 
                    this.currentDraw = context.replace(this.currentDraw, new Point(new Vector(context.mouseLocation)));
                    break;
                case "Line":
                    this.currentDraw = context.replace(this.currentDraw, new DrawableLine([(this.currentDraw as DrawableLine).points[0], new Vector(context.mouseLocation)]));
                    break;
                case "Poligon":
                    const cur = this.currentDraw as Poligon;
                    this.currentDraw = context.replace(this.currentDraw, new Poligon([...this.points, new Vector(context.mouseLocation)], cur.colorUniform));
            }
        }
        this.mouseClick = (context: this, button) => {
            if (!context.shaderProgram)
                throw new Error("No shader program");
            if (!this.currentDraw)
                return;
            if (button == MouseButton.Right) {
                const finalPoligon = new Poligon(this.points, context.gl.getUniformLocation(context.shaderProgram, "u_color"));
                context.replace(this.currentDraw, finalPoligon);
                this.allOfThePoligonz.push(finalPoligon);
                this.points = [];
                this.currentDraw = undefined;
                return false;
            }
            if (button == MouseButton.Middle) {
                this.allOfThePoligonz.filter(i => i.isConverx() && i.isIn(new Vector(context.mouseLocation)))
                    .forEach(i => {
                        if (!i.fill)
                            context.replace(undefined, i.toLineSegments());
                        else 
                            i.doIt = !i.doIt;
                        // i.stilCrtanja = i.stilCrtanja == StilCrtanja.Izspuna ? StilCrtanja.Obrub : StilCrtanja.Izspuna ;
                    });
                return false;
            }
            this.points.push(new Vector(context.mouseLocation));
            switch (this.currentDraw.type) {
                case "Point": 
                    this.currentDraw = context.replace(this.currentDraw, new DrawableLine([new Vector(context.mouseLocation), new Vector(context.mouseLocation)]));
                    break;
                case "Line":
                    const l = this.currentDraw as DrawableLine;
                    const seg = new Poligon(this.points, context.gl.getUniformLocation(context.shaderProgram, "u_color"));
                    context.replace(l, seg);
                    this.currentDraw = seg;
                    break;
                case "Poligon":
                    const p = this.currentDraw as Poligon;
                    const po = new Poligon(this.points, p.colorUniform);
                    context.replace(p, po);
                    this.currentDraw = po;
                    break;
            }
        }
    }
}