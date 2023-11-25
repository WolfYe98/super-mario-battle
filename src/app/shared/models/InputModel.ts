export class InputModel {
    invalid: boolean = false;
    classes: string = "";
    errMsg: string = "";
    value: any = "";
    checkValueRequired(errMsg?: string): void {
        if (!this.invalid && !this.value) {
            this.addError(errMsg ?? "This field is required");
        }
    }
    checkValueIsEqualTo(otherValue: string, errMsg?: string): void {
        if (!this.invalid && this.value != otherValue) {
            this.addError(errMsg ?? 'This field value differs');
        }
    }
    clearError(): void {
        this.invalid = false;
        this.errMsg = "";
        this.classes = this.classes.replace('border-red', '');
    }
    addError(errMsg?: string): void {
        this.invalid = true;
        this.errMsg = errMsg ?? "";
        this.classes += " border-red";
    }
    resetInput(): void {
        this.clearError();
        this.value = null;
    }
}

export class InputTextModel extends InputModel {
    constructor() {
        super();
    }
    checkValueWithRegExp(regExp: RegExp, errMsg?: string) {
        let isOk = regExp.test(this.value);
        if (!this.invalid && !isOk) {
            this.addError(errMsg ?? 'This field has an invalid value');
        }
        return isOk;
    }
}
export class InputNumberModel extends InputModel {
    max: number = 0;
    min: number = 0;
    constructor() {
        super();
    }
    checkValueInRange(errMsg?: string): void {
        if (!this.invalid && (this.value < this.min || this.value > this.max)) {
            this.addError(errMsg ?? "The value is out of range [" + this.min + "," + this.max + "]");
        }
    }
}

interface InputModelMaxBuilder {
    setMax(max: number): InputModelMinBuilder;
}
interface InputModelMinBuilder {
    setMin(min: number): InputModelValueBuilder;
}
interface InputModelValueBuilder {
    setValue(value: any): InputModelClassBuilder;
}
interface InputModelClassBuilder {
    setClass(className: string): InputNumberModelBuild | InputTextModelBuild;
}
interface InputNumberModelBuild {
    build(): InputNumberModel;
}
interface InputTextModelBuild {
    build(): InputTextModel;
}

export class InputNumberModelBuilder implements InputModelMaxBuilder, InputModelMinBuilder, InputModelValueBuilder,
    InputModelClassBuilder, InputNumberModelBuild {
    private inputModel: InputNumberModel = new InputNumberModel();
    build(): InputNumberModel {
        return this.inputModel;
    }
    setClass(className: string): InputNumberModelBuild {
        this.inputModel.classes = className;
        return this;
    }
    setValue(value: number): InputModelClassBuilder {
        this.inputModel.value = value;
        return this;
    }
    setMin(min: number): InputModelValueBuilder {
        this.inputModel.min = min;
        return this;
    }
    setMax(max: number): InputModelMinBuilder {
        this.inputModel.max = max;
        return this;
    }
}
export class InputTextModelBuilder implements InputModelValueBuilder, InputModelClassBuilder, InputTextModelBuild {
    private input: InputTextModel = new InputTextModel();
    build(): InputTextModel {
        return this.input;
    }
    setClass(className: string): InputNumberModelBuild | InputTextModelBuild {
        this.input.classes = className;
        return this;
    }
    setValue(value: any): InputModelClassBuilder {
        this.input.value = value;
        return this;
    }
}