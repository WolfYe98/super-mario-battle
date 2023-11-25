import { InputModel, InputTextModel, InputTextModelBuilder } from "../models/InputModel";

export abstract class ComponentWithInputModel {
    errorMsg: string = "";
    constructor() {
    }
    abstract checkInputs(): boolean;
    clearError(input: InputModel): void {
        input.clearError();
        this.errorMsg = "";
    }
    createInputTextModelWithDefaultClass(classes: string): InputTextModel {
        return <InputTextModel>(new InputTextModelBuilder()
            .setClass(classes)
            .build());
    }
}