import { SceneAbstract } from "../Lab2/SceneAbstract.js";
import { Triangles } from "../Lab5/Triangles.js";
let state = false;
let tri = false;
export function ToggleWireAndTrinagles(scene: SceneAbstract) {
    if (-1 != scene.pressedButtons.findIndex(i => i.toLowerCase() == "t")) {
        if (!state) {
            scene.drawables
                .forEach(i => {
                    const j = i as Triangles;
                    j.drawMode = tri ? "Wireframe" : "Fill";
                });
            state = true;
            tri = !tri;
        }
    } else {
        state = false;
    }

}