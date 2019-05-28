import { Zadatak5 } from "./Tasks/Zadatak5.js";

async function Zad5_1() {
    const canvas = document.getElementById("3d") as HTMLCanvasElement;
    if (!canvas)
        throw new Error("No kanvas");
    const sa = (window as any).sa = new Zadatak5(canvas);
    await sa.setup();
}
Zad5_1();