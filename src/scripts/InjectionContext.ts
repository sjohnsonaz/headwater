export enum InjectionBindingType {
    value,
    constructor
}

export type Index = string | number | Symbol;

export type Constructor<T> = new (...args: any[]) => T;

export class InjectionBinding {
    bindingType: InjectionBindingType;
    value: any;
}

export default class InjectionContext {
    bindings: {
        [index: string]: InjectionBinding;
    } = {};

    bind<T>(type: Index, constructor: Constructor<T>) {
        this.bindings[type as any] = {
            bindingType: InjectionBindingType.constructor,
            value: constructor
        };
    }

    bindValue<T>(type: Index, value: T) {
        this.bindings[type as any] = {
            bindingType: InjectionBindingType.value,
            value: value
        };
    }

    getValue<T>(type: Index): T {
        let binding = this.bindings[type as any];
        if (!binding) {
            throw 'No binding associated with: ' + type;
        }
        switch (binding.bindingType) {
            case InjectionBindingType.value:
                return binding.value;
            case InjectionBindingType.constructor:
                return new binding.value();
        }
    }
}