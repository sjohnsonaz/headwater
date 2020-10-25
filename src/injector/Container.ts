import { IConstructor, IFactory, Index } from './Types';

export enum InjectionBindingType {
    value = 'value',
    constructor = 'constructor',
    factory = 'factory'
}

export interface InjectionBinding {
    bindingType: InjectionBindingType;
    value: any;
}

export class Container {
    bindings: Record<Index, InjectionBinding> = {};

    bindValue<T>(type: Index, value: T) {
        this.bindings[type as any] = {
            bindingType: InjectionBindingType.value,
            value
        };
    }

    bindConstructor<T>(type: Index, constructor: IConstructor<T>) {
        this.bindings[type as any] = {
            bindingType: InjectionBindingType.constructor,
            value: constructor
        };
    }

    bindFactory<T>(type: Index, factory: IFactory<T>) {
        this.bindings[type as any] = {
            bindingType: InjectionBindingType.factory,
            value: factory
        };
    }

    get<T = any>(type: Index, ...args: any): T {
        let binding = this.bindings[type as any];
        if (!binding) {
            throw `No binding associated with: ${type.toString()}`;
        }
        switch (binding.bindingType) {
            case InjectionBindingType.value:
                return binding.value;
            case InjectionBindingType.constructor:
                return new binding.value(...args);
            case InjectionBindingType.factory:
                return binding.value(...args);
        }
    }
}
