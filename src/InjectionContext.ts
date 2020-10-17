import { ParameterInfo } from './ParameterInfo';
import { InjectionBindingType, IConstructor, IFactory, Index } from './Types';

export interface InjectionBinding {
    bindingType: InjectionBindingType;
    value: any;
}

export class InjectionContext {
    bindings: {
        [index: string]: InjectionBinding;
    } = {};

    bind<T>(type: Index, constructor: IConstructor<T>) {
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

    getValue<T = any>(type: Index): T {
        let binding = this.bindings[type as any];
        if (!binding) {
            throw 'No binding associated with: ' + type;
        }
        switch (binding.bindingType) {
            case InjectionBindingType.value:
                return binding.value;
            case InjectionBindingType.constructor:
                return InjectionContext.inject(binding.value);
            case InjectionBindingType.factory:
                return InjectionContext.injectFunction(binding.value);
        }
    }

    static inject<T>(constructor: IConstructor<T>): T {
        return new constructor(...ParameterInfo.getArgs(constructor));
    }

    static injectFunction<T>(func: Function): T {
        return func(...ParameterInfo.getArgs(func));
    }
}