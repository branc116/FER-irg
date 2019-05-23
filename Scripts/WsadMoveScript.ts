import { SceneAbstract } from "../Lab2/SceneAbstract.js";
import { Vector } from "../Helpers/Helpers.js";

export function WsadScript(scene: SceneAbstract) {
    const dx = scene.camera.cam.get(0) - scene.camera.lookAt.get(0);    
    const dy = scene.camera.cam.get(1) - scene.camera.lookAt.get(1);    
    const dz = scene.camera.cam.get(2) - scene.camera.lookAt.get(2);
    const up = new Vector([0, 1, 0]);
    const v1 = new Vector([dx, dy, dz]);
    const [ddx, ddy, ddz] = up.nVectorProduct(v1).toArray();

    let dforward = 0;
    let dleft = 0;
    scene.pressedButtons.forEach(i => {
        if (i.toLowerCase() == "w") {
            dforward -= 0.03;
        }else if (i.toLowerCase() == "s") {
            dforward += 0.03;
        }else if (i.toLowerCase() == "a") {
            dleft -= 0.03;
        }else if (i.toLowerCase() == "d") {
            dleft += 0.03;
        }else if (i.toLowerCase() == "shift") {
            dleft *= 5;
            dforward *= 5;
        }
    });
    scene.camera.lookAt.set(0, scene.camera.lookAt.get(0) + dx * dforward + ddx * dleft);
    scene.camera.lookAt.set(1, scene.camera.lookAt.get(1) + dy * dforward + ddy * dleft);    
    scene.camera.lookAt.set(2, scene.camera.lookAt.get(2) + dz * dforward + ddz * dleft);
    scene.camera.cam.set(0, scene.camera.cam.get(0) + dx * dforward + ddx * dleft);     
    scene.camera.cam.set(1, scene.camera.cam.get(1) + dy * dforward + ddy * dleft);
    scene.camera.cam.set(2, scene.camera.cam.get(2) + dz * dforward + ddz * dleft);    
}