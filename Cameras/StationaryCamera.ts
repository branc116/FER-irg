import { AbstractCamera } from "./AbstractCamera.js";
import { IVector } from "../Helpers/IVector.js";

export class StationaryCamera extends AbstractCamera {
    constructor(public camLocation: IVector, public lookAt: IVector) {
        super();
    }
    public updateCamLocation(time: number) {
        return this.camLocation;
    }
    public updateLookAt(time: number) {
        return this.lookAt;
    }
}