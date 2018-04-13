import Injector from './Injector';
import { Index } from './Types';

const key = '_injection_params';
const emptyArray = [];

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
        args = args || emptyArray;
        let length = Math.max(args.length, this.highestIndex + 1);
        for (let index = 0; index < length; index++) {
            output[index] = args[index] !== undefined ? args[index] : this.getValue(this.parameters[index]);
        }
        return output;
    }

    static add(target: any, parameterIndex: number, type: Index) {
        if (!target[key]) {
            target[key] = new ParameterInfo(parameterIndex, type);
        } else {
            target[key].add(parameterIndex, type);
        }
        return target[key] as ParameterInfo;
    }

    static getArgs(target: any, args?: any[], propertyKey?: string) {
        let method = propertyKey ? target[propertyKey] : target;
        let parameterInfo: ParameterInfo = method[key];
        return parameterInfo ? parameterInfo.getArgs(args) : args;
    }
}