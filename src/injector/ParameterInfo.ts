import { InjectionContext } from './InjectionContext';
import { Injector } from './Injector';
import { Index } from './Types';

const INJECTION_PARAMS = '_injection_params';

export class ParameterInfo {
    highestIndex: number = 0;
    parameters: Index[] = [];

    add(index: number, type: Index) {
        if (this.highestIndex < index) {
            this.highestIndex = index;
        }
        this.parameters[index] = type;
    }

    getValue(type: Index, context: InjectionContext = Injector.getContext()) {
        return context.getValue(type);
    }

    getArgs(args?: any[], context: InjectionContext = Injector.getContext()) {
        const output = [];
        if (args) {
            const length = Math.max(args.length, this.highestIndex + 1);
            for (let index = 0; index < length; index++) {
                const value = args[index];
                output[index] = value !== undefined ?
                    value :
                    this.getValue(this.parameters[index], context);
            }
        }
        return output;
    }

    static add<T>(target: T, parameterIndex: number, type: Index) {
        const parameterInfo = this.getOrCreateParameterInfo(target);
        parameterInfo.add(parameterIndex, type);
        return parameterInfo;
    }

    static getArgs<T>(target: T, args: any[] = [], propertyKey?: keyof T) {
        const method = propertyKey ? target[propertyKey] : target;
        const parameterInfo = this.getParameterInfo(method);
        return parameterInfo ? parameterInfo.getArgs(args) : args;
    }

    static getParameterInfo(target: any) {
        const parameterInfo: ParameterInfo | undefined = target[INJECTION_PARAMS];
        return parameterInfo;
    }

    static getOrCreateParameterInfo(target: any) {
        let parameterInfo: ParameterInfo = target[INJECTION_PARAMS];
        if (!parameterInfo) {
            parameterInfo = new ParameterInfo();
            target[INJECTION_PARAMS] = parameterInfo;
        }
        return parameterInfo;
    }
}