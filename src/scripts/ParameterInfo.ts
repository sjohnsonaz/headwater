import Injector from './Injector';

export default class ParameterInfo {
    highestIndex: number;
    parameters: any[];

    constructor(index, value) {
        this.highestIndex = index || 0;
        this.parameters = [];
        this.parameters[index] = value;
    }

    add(index, value) {
        if (this.highestIndex < index) {
            this.highestIndex = index;
        }
        this.parameters[index] = value;
    }

    getValue(parameter: any) {
        return Injector.getContext().getValue(parameter);
    }

    getArgs(args: any[]) {
        let output = [];
        let length = Math.max(args.length, this.highestIndex + 1);
        for (let index = 0; index < length; index++) {
            output[index] = args[index] !== undefined ? args[index] : this.getValue(this.parameters[index]);
        }
        return output;
    }
}