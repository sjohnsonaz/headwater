export enum InjectionBindingType {
    value,
    constructor
}

export class InjectionBinding {
    bindingType: InjectionBindingType;
    value: any;
}

export default class InjectionContext {
    bindings: {
        [index: string]: InjectionBinding;
    } = {};

    bind(type: any, Constructor: new (...args: any[]) => any) {
        this.bindings[type] = {
            bindingType: InjectionBindingType.constructor,
            value: Constructor
        };
    }

    bindValue(type: any, value: any) {
        this.bindings[type] = {
            bindingType: InjectionBindingType.value,
            value: value
        };
    }

    getValue(type: any) {
        let binding = this.bindings[type];
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