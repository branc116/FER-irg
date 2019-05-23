import { AbstractCamera } from "./AbstractCamera.js";
import { IVector } from "../Helpers/IVector.js";

export class StationaryCamera extends AbstractCamera {
    constructor(camLocation?: IVector, lookAt?: IVector) {
        super();
        if (camLocation) {
            this.cam = camLocation;
        }
        if (lookAt) {
            this.lookAt = lookAt;
        }
    }
    public updateCamLocation(time: number) {
        return this.cam;
    }
    public updateLookAt(time: number) {
        return this.lookAt;
    }
}