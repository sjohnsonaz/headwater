import ParameterInfo from './ParameterInfo';

const key = '_injection_params';

export function inject<T>(type: any) {
    return function (target: any, propertyKey: string, parameterIndex: number): any {
        let obj = target[propertyKey] || target;
        if (!obj[key]) {
            obj[key] = new ParameterInfo(parameterIndex, type);
        } else {
            obj[key].add(parameterIndex, type);
        }
    }
}

export function injectable<T extends new (...args: any[]) => any>(Constructor: T): any {
    return class extends Constructor {
        constructor(...args: any[]) {
            super(...(Constructor[key] ? Constructor[key].getArgs(args) : args));
        }
    }
}

export function factory<T extends (...args: any[]) => any>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
    let method = target[propertyKey];
    descriptor.value = function (...args: any[]) {
        return method.call(this, ...(method[key] ? method[key].getArgs(args) : args));
    } as T;
}