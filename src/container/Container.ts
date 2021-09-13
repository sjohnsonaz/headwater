export type Type = string | number | symbol;

export type IConstructor<T> = new (...args: any) => T;

export type IFactory<T> = (...args: any) => T;

export enum InjectionBindingType {
    value = 'value',
    constructor = 'constructor',
    factory = 'factory',
}

export type InjectionBinding<T> =
    | {
          bindingType: InjectionBindingType.constructor;
          value: IConstructor<T>;
      }
    | {
          bindingType: InjectionBindingType.factory;
          value: IFactory<T>;
      }
    | {
          bindingType: InjectionBindingType.value;
          value: T;
      };

/**
 * An Inversion of Control Container.
 *
 * Values, constructors, and factories can be bound to a Type.
 *
 * Then, given a Type, they can be retrieved later.
 */
export class Container {
    bindings: Record<Type, InjectionBinding<any>> = {};

    /**
     * Binds a value to a Type
     * @param type - a Type to bind
     * @param value - a value to bind
     */
    bindValue<T>(type: Type, value: T) {
        this.bindings[type as any] = {
            bindingType: InjectionBindingType.value,
            value,
        };
    }

    /**
     * Binds a constructor to a Type
     * @param type - a Type to bind
     * @param constructor - a constructor to bind
     */
    bindConstructor<T>(type: Type, constructor: IConstructor<T>) {
        this.bindings[type as any] = {
            bindingType: InjectionBindingType.constructor,
            value: constructor,
        };
    }

    /**
     * Binds a factory to a Type
     * @param type - a Type to bind
     * @param factory - a factory to bind
     */
    bindFactory<T>(type: Type, factory: IFactory<T>) {
        this.bindings[type as any] = {
            bindingType: InjectionBindingType.factory,
            value: factory,
        };
    }

    /**
     * Gets a value for a given Type.
     *
     * If the value is a value, it is returned.
     * If the value is a constructor, a new object is created.
     * If the value is a factory, the factory is run.
     *
     * Args are passed to constructors and factories.
     *
     * This can be used as a default parameter value for other functions.
     *
     * @param type - a bound Type
     * @param args - zero or more args to pass if the bound value is a function or constructor
     */
    get<T = any>(type: Type, ...args: any): T {
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

    private static default: Container | undefined;

    /**
     * Gets the default Container
     */
    static getDefault() {
        let container = this.default;
        if (!container) {
            container = new Container();
            this.default = container;
        }
        return container;
    }

    /**
     * Sets the default Container
     * @param container - a Container object
     */
    static setDefault(container: Container) {
        Container.default = container;
    }
}

/**
 * Gets a value fron a specified Container by Type
 *
 * This can be used as a default parameter value for other functions.
 *
 * @param type - a bound Type
 * @param container - a Container to use
 * @param args - zero or more args to pass if the bound value is a function or constructor
 */
export function inject<T>(type: Type, container: Container, ...args: any): T;

/**
 * Gets a value fron the default Container by Type
 *
 * This can be used as a default parameter value for other functions.
 *
 * @param type - a bound Type
 * @param [args] - zero or more args to pass if the bound value is a function or constructor
 */
export function inject<T>(type: Type, ...args: any): T;

export function inject<T>(type: Type, a: any, ...args: any): T {
    if (a instanceof Container) {
        return a.get(type, ...args);
    } else {
        const container = Container.getDefault();
        return container.get(type, a, ...args);
    }
}
