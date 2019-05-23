import { SceneAbstract } from "../Lab2/SceneAbstract.js";
import { MouseButton } from "../IScene.js";
import { Vector } from "../Helpers/Helpers.js";

export function RightClickRotateMouseScript(scene: SceneAbstract) {
    if (scene.pressedMouseButtons == MouseButton.Right) {
        const up = new Vector([0, 1, 0]);
        const [dx, dy, dz] = up.nVectorProduct(scene.camera.lookAt.nSub(scene.camera.cam)).toArray();
        scene.camera.lookAt.set(1, scene.camera.lookAt.get(1) + 0.05 * scene.mouseDelta.get(1));

        scene.camera.lookAt.set(0, scene.camera.lookAt.get(0) + 0.001 * dx * scene.mouseDelta.get(0));
        scene.camera.lookAt.set(1, scene.camera.lookAt.get(1) + 0.001 * dy * scene.mouseDelta.get(0));
        scene.camera.lookAt.set(2, scene.camera.lookAt.get(2) + 0.001 * dz * scene.mouseDelta.get(0));
    } else if (scene.pressedMouseButtons != 0) {
        console.log(scene.pressedMouseButtons);
    }
}