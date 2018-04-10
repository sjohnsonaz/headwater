import ParameterInfo from './ParameterInfo';
import { IConstructor, IFactory, Index } from './Types'
const key = '_injection_params';

export function inject(type: Index) {
    return function (target: any, propertyKey: string, parameterIndex: number): any {
        let obj = target[propertyKey] || target;
        if (!obj[key]) {
            obj[key] = new ParameterInfo(parameterIndex, type);
        } else {
            obj[key].add(parameterIndex, type);
        }
    }
}

export function injectable<T extends IConstructor<any>>(Constructor: T): T {
    // Create Wrapper function
    let Wrapper = function (...args: any[]) {
        return Reflect.construct(Constructor, Constructor[key] ? Constructor[key].getArgs(args) : args);
    };

    // Change Wrapper name to match Constructor
    Object.defineProperty(Wrapper, 'name', {
        value: Constructor.name
    });

    // Copy Constructor prototype to mask Wrapper
    // This is not used by the instances
    Wrapper.prototype = Object.create(Constructor.prototype, {
        constructor: {
            value: Constructor,
            writable: true,
            enumerable: true
        }
    });

    // Copy static members (including static prototype)
    for (var index in Constructor) {
        Wrapper[index as any] = Constructor[index];
    }

    return Wrapper as any;
}

export function factory<T extends IFactory<any>>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
    let method = target[propertyKey];
    descriptor.value = function (...args: any[]) {
        return method.call(this, ...(method[key] ? method[key].getArgs(args) : args));
    } as T;
}