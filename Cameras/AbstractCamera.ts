import { IVector } from "../Helpers/IVector.js";

export abstract class AbstractCamera{
    public abstract updateCamLocation(time: number): IVector;
    public abstract updateLookAt(time: number): IVector;
}