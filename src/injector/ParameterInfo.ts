import { Container } from './Container';
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

    getValue<T>(type: Index, container: Container = Injector.getContainer()) {
        return container.getValue<T>(type);
    }

    getArgs(args: any[] = [], container: Container = Injector.getContainer()) {
        const output = [];
        const length = Math.max(args.length, this.highestIndex + 1);
        for (let index = 0; index < length; index++) {
            const value = args[index];
            output[index] = value !== undefined ?
                value :
                this.getValue(this.parameters[index], container);
        }
        return output;
    }

    static add<T>(target: T, parameterIndex: number, type: Index) {
        const parameterInfo = this.getOrCreateParameterInfo(target);
        parameterInfo.add(parameterIndex, type);
        return parameterInfo;
    }

    static getArgs<T>(target: T, args: any[] = [], container: Container = Injector.getContainer()) {
        const parameterInfo = this.getParameterInfo(target);
        return parameterInfo ? parameterInfo.getArgs(args, container) : args;
    }

    static getPropertyArgs<T>(target: T, args: any[] = [], propertyKey: keyof T, container: Container = Injector.getContainer()) {
        const method = propertyKey ? target[propertyKey] : target;
        const parameterInfo = this.getParameterInfo(method);
        return parameterInfo ? parameterInfo.getArgs(args, container) : args;
    }

    private static getParameterInfo(target: any) {
        const parameterInfo: ParameterInfo | undefined = target[INJECTION_PARAMS];
        return parameterInfo;
    }

    private static getOrCreateParameterInfo(target: any) {
        let parameterInfo: ParameterInfo = target[INJECTION_PARAMS];
        if (!parameterInfo) {
            parameterInfo = new ParameterInfo();
            target[INJECTION_PARAMS] = parameterInfo;
        }
        return parameterInfo;
    }
}
