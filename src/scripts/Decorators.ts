import ParameterInfo from './ParameterInfo';
import { IConstructor, IFactory, Index } from './Types'

export function inject(type: Index) {
    return function (target: any, propertyKey: string, parameterIndex: number): any {
        ParameterInfo.add(propertyKey ? target[propertyKey] : target, parameterIndex, type);
    }
}

export function injectable<T extends IConstructor<any>>(Constructor: T): T {
    class Wrapper extends Constructor {
        constructor(...args: any[]) {
            super(...ParameterInfo.getArgs(Constructor, args));
        }
    }

    // Change Wrapper name to match Constructor
    Object.defineProperty(Wrapper, 'name', {
        value: Constructor.name
    });

    return Wrapper;
}

export function factory<T extends IFactory<any>>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
    let method = target[propertyKey];
    descriptor.value = function (...args: any[]) {
        return method.call(this, ...ParameterInfo.getArgs(method, args));
    } as T;
}