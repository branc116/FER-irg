import { Vector, Matrix } from "./Helpers/Helpers.js";
import {Zadatak2} from "./Tasks/Zad2.js";
import { Zadatak3 } from "./Tasks/Zadatak3.js";
import { Zadatak4 } from "./Tasks/Zadatak4.js";
import { Line } from "./Helpers/Line.js";
import { Zadatak5 } from "./Tasks/Zadatak5.js";
import { Zadatak6 } from "./Tasks/Zadatak6.js";
import { Zadatak7 } from "./Tasks/Zadatak7.js";
// import { initHighlighting, listLanguages } from "highlight.js";
//jhjhdtrdtgf
function Zad1() {
    // const a = Vector.parseSimple("3 1 3");
    // const b = new Vector([-2, 4, 1]);
    // return a.add(new Vector([1, 1, 1]))
    //     .add(b)
    //     .scalarProduct(new Vector([2, 3, 2]));
    //yooooooooooo
    const rez = Matrix.parseSimple("0 1 | 2 3")
        .nMultipy(Matrix.parseSimple("0 -2 |-4 -6"));
    return rez;
}
function Zad2() {
    const a = new Vector([-2,4,1]);
    const b = a.copyPart(2);
    const c = a.copyPart(5);
    return `a: [${a.toArray()}], b: [${b.toArray()}], c: [${c.toArray()}]`;
}
function Zad3() {
    const a = new Matrix(2, 2, [[1, 2], [1, 4]]);
    const det = a.determinant();
    const inverse = a.nInvert();
    return objToString({det, inverse: inverse.toArray(), mat: a.toArray()});
}
function Zad4() {
    const a = new Matrix(3, 3, [[1, 2, 5], [1, 4, 3], [8, 1, 2]]);
    const det = a.determinant();
    const inverse = a.nInvert();
    const i = a.nMultipy(inverse);
    return objToString({det, inverse: inverse.toString(), mat: a.toString(), identity: i.toString()});
}
function Zad5() {
    const a = new Matrix(3, 2, [[1, 2], [3, 4], [5, 6]]);
    const b = a.nTranspone(true);
    b.set(0, 0, 10);
    const h = {a: a};
    return objToString({og: a.toString(), trans: b.toString()});
}
function Zad6() {
    const a = new Matrix(4, 4, [[1, 2, 5, 2], [1, 4, 3, -3], [8, 1, 2, 0], [12, 13, 1, -10]]);
    const b = a.nInvert();
    const c = a.determinant();
    const i = a.nMultipy(b);
    return objToString({og: a.toString(), determinant: c, inverse: b.toString(), identity: i.toString()});
}
function Zad7() {
    const a = new Matrix(6, 6, [...Array(6).keys()].map(i => [...Array(6).keys()].map(j => Math.random())));
    const b = a.nInvert();
    const c = a.determinant();
    const i = a.nMultipy(b);
    return objToString({og: a.toString(), determinant: c, inverse: b.toString(), identity: i.toString()});
}
function Zad1_2_1() {
    const a = Vector.parseSimple("1 0 0");
    const b = Vector.parseSimple("5 0 0");
    const c = Vector.parseSimple("3 8 0");
    const t = Vector.parseSimple("3 4 0");
    const pov  = b.nSub(a).nVectorProduct(c.nSub(a)).norm()/2.0;
    const povA = b.nSub(t).nVectorProduct(c.nSub(t)).norm()/2.0;
    const povB = a.nSub(t).nVectorProduct(c.nSub(t)).norm()/2.0;
    const povC = a.nSub(t).nVectorProduct(b.nSub(t)).norm()/2.0;
    const t1 = povA/pov;
    const t2 = povB/pov;
    const t3 = povC/pov;
    return(`Baricentricne koordinate su : (${t1}, ${t2}, ${t3})`);
}
function Zad1_2_2() {
    const a = Matrix.parseSimple("3 5 | 2 10");
    const r = Matrix.parseSimple("2 | 8");
    const v = a.nInvert().nMultipy(r);
    return objToString({a: a.toString(), r: r.toString(), rjesenje: v.toString()});
}
function Zad1_2_3() {
    const a = Matrix.parseSimple("1 5 3 | 0 0 8 | 1 1 1");
    const b = Matrix.parseSimple("3 | 4 | 1");
    const v = a.nInvert().nMultipy(b);
    return objToString({a: a.toString(), b: b.toString(), v: v.toString()});
}
function Zad1_2_4(v11: number,v12: number, v13: number, v21: number, v22: number, v23: number) {
    try{
        const v1 = new Vector([v11, v12, v13].filter(i => i != undefined));
        const v2 = new Vector([v21, v22, v23].filter(i => i != undefined));
        const c = v1.cosine(v2);
        //r = d - 2*(d*n)*n
        const r = v1.nSub(v2.nNormalize().nScalarMultiply(2*v1.scalarProduct(v2.nNormalize())));
        return objToString({v1: v1.toString(), v2: v2.toString(), cosine: c, reflected: r.toString()});
    } catch (e){
        return objToString({error: "Nema dosta podataka" + e, v11 ,v12, v13, v21, v22, v23});
    }
    // const a = Matrix.parseSimple("1 5 3 | 0 0 8 | 1 1 1");
    // const b = Matrix.parseSimple("3 | 4 | 1");
    // const v = a.nInvert().nMultipy(b);
    // return objToString({a: a.toString(), b: b.toString(), v: v.toString()});
}
function Zad1_3_1() {
    const v1 = new Vector([2, 3, -4]).add(new Vector([-1, 4, -3]));
    const s = v1.scalarProduct(new Vector([-1, 4, 3]));
    const v2 = v1.nVectorProduct(new Vector([2, 2, 4]));
    const v3 = v2.nNormalize();
    const v4 = v2.nScalarMultiply(-1);
    const m1 = Matrix.parseSimple("1 2 3 | 2 1 3 | 4 5 1")
        .add(Matrix.parseSimple("-1 2 -3 | 5 -2 7 | -4 -1 3"));
    const m2 = Matrix.parseSimple("1 2 3 | 2 1 3 | 4 5 1")
        .nMultipy(Matrix.parseSimple("-1 2 -3 | 5 -2 7 | -4 -1 3")
            .nTranspone(false));
    const m3 = Matrix.parseSimple("-24 18 5 | 20 -15 -4 | -5 4 1")
        .nInvert()
        .nMultipy(Matrix.parseSimple("1 2 3 | 0 1 4 | 5 6 0")
            .nInvert());
    return objToString({v1: v1.toString(), s: s.toString(), v2: v2.toString(), v3: v3.toString(), v4: v4.toString(), m1: m1.toString(), m2: m2.toString(), m3: m3.toString()});
}
function Zad1_3_2(
    x1: number, y1: number, z1: number, rj1:number, 
    x2: number, y2: number, z2: number, rj2:number, 
    x3: number, y3: number, z3: number, rj3:number) 
{
    try{
        //1,0,0,1,0,1,0,1,0,0,1,1
        //1,1,1,6,-1,-2,1,-2,2,1,3,13
        const m = new Matrix(3, 3, [[x1, y1, z1], [x2, y2, z2], [x3, y3, z3]]);
        const rj = new Matrix(3, 1, [[rj1], [rj2], [rj3]]);
        const sol = m.nInvert().nMultipy(rj);
        return objToString({m, rj, sol: `[x, y, z]=${sol.toVector(true).toString()}`});
    }catch (e) {
        return objToString({error: "Nema dosta podataka" + e, x1, y1, z1, rj1, x2, y2, z2, rj2,x3, y3, z3, rj3});
    }
}
function Zad1_3_3(ain: string, bin: string, cin: string, tin: string) {
    //"1 0 0", "5 0 0", "3 8 0", "3 4 0"
    try{
        const a = Vector.parseSimple(ain);
        const b = Vector.parseSimple(bin);
        const c = Vector.parseSimple(cin);
        const t = Vector.parseSimple(tin);
        const pov  = b.nSub(a).nVectorProduct(c.nSub(a)).norm()/2.0;
        const povA = b.nSub(t).nVectorProduct(c.nSub(t)).norm()/2.0;
        const povB = a.nSub(t).nVectorProduct(c.nSub(t)).norm()/2.0;
        const povC = a.nSub(t).nVectorProduct(b.nSub(t)).norm()/2.0;
        const t1 = povA/pov;
        const t2 = povB/pov;
        const t3 = povC/pov;
        return(`Baricentricne koordinate su : (${t1}, ${t2}, ${t3})`);
    } catch (e) {
        return objToString({error: e, ...arguments});
    }
}
async function Zad2_1_1() {
    try{
        const canvas = document.getElementById("CZad2_1_1") as HTMLCanvasElement;
        if (!canvas)
            throw new Error("No kanvas");
        const sa = new Zadatak2(canvas);
        await sa.setup();
    }catch (ex) {
        return objToString({error: ex})
    }
}

async function Zad3_1_1(kontrola: boolean, odsecanje: number) {
    try{
        if ((window as any).sa) {
            (window as any).sa.kontrola = kontrola;
            (window as any).sa.odsjecanje = odsecanje;
        }else {
            const canvas = document.getElementById("CZad3_1_1") as HTMLCanvasElement;
            if (!canvas)
                throw new Error("No kanvas");
            const sa = (window as any).sa = new Zadatak3(canvas, false, 0.5);
            await sa.setup();
        }
    }catch (ex) {
        return objToString({error: ex})
    }
}
async function Zad4_1_Tests(kontrola: boolean, odsecanje: number) {
    try{
        const l = new Line([new Vector([0, 0]), new Vector([0, 1])])
            .union(new Line([new Vector([-1, 0.5]), new Vector([1, 0.5])]));
        const canvas = document.getElementById("CZad4_1_1") as HTMLCanvasElement;
        if (!canvas)
            throw new Error("No kanvas");
        const sa = (window as any).sa = new Zadatak4(canvas);
        await sa.setup();
    }catch (ex) {
        return objToString({error: ex})
    }
}

async function Zad5_1() {
    const canvas = document.getElementById("CZad5") as HTMLCanvasElement;
    if (!canvas)
        throw new Error("No kanvas");
    const sa = (window as any).sa = new Zadatak5(canvas);
    await sa.setup();
}
async function Zad6_1() {
    const canvas = document.getElementById("CZad6") as HTMLCanvasElement;
    if (!canvas)
        throw new Error("No kanvas");
    const sa = (window as any).sa = new Zadatak6(canvas);
    await sa.setup();
}
async function Zad7_1() {
    const canvas = document.getElementById("CZad7") as HTMLCanvasElement;
    if (!canvas)
        throw new Error("No kanvas");
    const sa = (window as any).sa = new Zadatak7(canvas);
    await sa.setup();
}
function objToString (obj: any) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += `${p}↙\n${typeof obj[p] == "object" ? obj[p].toString() : obj[p]}\n`;
        }
    }
    return str;
}

document.querySelectorAll("[data-zadatak]").forEach((val) => {
    const taskName = val.getAttribute("data-zadatak");
    var params = document.querySelectorAll(`[data-param=${taskName}]`);

    const rez = eval(taskName + "()");
    var func = eval(val.getAttribute("data-zadatak") + ".toString()");
    val.innerHTML = func;
    const target = val.getAttribute("data-target");
    if (!target)
        return;
    const t = document.querySelector(target);
    if (t != null){
        t.innerHTML = rez;
    }
    if (params.length != 0) {
        params.forEach(param => {
            param.addEventListener("keyup", (e) => {
                let inStrs: string[] = [];
                params.forEach((val)=> {
                    const v = (val as HTMLInputElement).value;

                    inStrs.push(v.length == 0 ? "undefined" : v);
                });
                const finalPars = inStrs.reduce((prev, cur) => prev + ", " + cur);
                const rez = eval(taskName + '(' + finalPars + ')');
                if (t != null){
                    const cl = t.classList.value.split(" ");
                    cl.forEach(i => t.classList.remove(i));
                    t.innerHTML = rez;
                    ///@ts-ignore
                    hljs.highlightBlock(t);
                }
            }, {passive: true });
        });
    }
});

///@ts-ignore
hljs.initHighlighting();