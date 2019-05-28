import { DrawableLine } from "./Line.js";
import { Point } from "./Point.js";
import { Triangle } from "./Triangle.js";
import { Quad } from "./Quad.js";
import { LineSegments } from "./LineSegments.js";
import { DrawableTyped, Drawable } from "./Drawable.js";
import { Points } from "./Points.js";
import { Poligon } from "./Poligon.js";
import { Triangles } from "./Triangles.js";
import { BezierCurve } from "./BezierCurve.js";

export type DrawableString<T extends Drawable> =  T extends DrawableLine ? "Line" :
    T extends Point ? "Point" :
    T extends Triangle ? "Triangle" :
    T extends Quad ? "Quad" :
    T extends LineSegments ? "LineSegment" :
    T extends Points ? "Points" :
    T extends Poligon ? "Poligon" :
    T extends Triangles ? "Triangles" :
    T extends BezierCurve ? "BezierCurve" : never;