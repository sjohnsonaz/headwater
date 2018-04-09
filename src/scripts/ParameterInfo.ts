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

    getArgs(args: any[]) {
        let output = [];
        let length = Math.max(args.length, this.highestIndex + 1);
        for (let index = 0; index < length; index++) {
            output[index] = args[index] !== undefined ? args[index] : this.parameters[index];
        }
        console.log('output:', output);
        return output;
    }
}