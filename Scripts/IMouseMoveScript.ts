import { IVector } from "../Helpers/IVector.js";
import { IScene, MouseButton } from "../IScene.js";
import { SceneAbstract } from "../SceneAbstract.js";

export type MouseEventType<T extends IScene> = {
    Location: IVector;
    Delta: IVector;
    Time: number;
    Scene: T;
    Buttons: MouseButton;
}
export type MouseMoveScript = (scene: SceneAbstract) => void;