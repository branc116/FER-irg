import { SceneAbstract } from "../SceneAbstract.js";
import { MouseButton } from "../IScene.js";
import { Vector } from "../Helpers/Helpers.js";
export var mouseSpeed = 0.005;
export function RightClickRotateMouseScript(scene: SceneAbstract) {
    if (scene.pressedMouseButtons == MouseButton.Right) {
        const up = new Vector([0, 1, 0]);
        const [dx, dy, dz] = up.nVectorProduct(scene.camera.lookAt.nSub(scene.camera.cam)).toArray();

        scene.camera.lookAt.set(0, scene.camera.lookAt.get(0) + mouseSpeed * dx * scene.mouseDelta.get(0));
        scene.camera.lookAt.set(1, scene.camera.lookAt.get(1) + mouseSpeed * dy * scene.mouseDelta.get(0) + 10 * mouseSpeed * scene.mouseDelta.get(1));
        scene.camera.lookAt.set(2, scene.camera.lookAt.get(2) + mouseSpeed * dz * scene.mouseDelta.get(0));
    } else if (scene.pressedMouseButtons != 0) {
        console.log(scene.pressedMouseButtons);
    }
}
export function LightOrbit(scene: SceneAbstract) {
    const d = scene.light.location.nVectorProduct(new Vector([0, 1, 0]));
    scene.light.location.add(d.scalarMultiply(0.02));
}