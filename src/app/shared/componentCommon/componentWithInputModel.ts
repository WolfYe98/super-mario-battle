import { InputModel } from "../models/InputModel";

export class ComponentWithInputModel {
    errorMsg: string = "";
    constructor() {

    }
    clearError(input: InputModel): void {
        input.clearError();
        this.errorMsg = "";
    }
}