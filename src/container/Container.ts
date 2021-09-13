export type Type = string | number | symbol;

export type IConstructor<T> = new (...args: any) => T;

export type IFactory<T> = (...args: any) => T;

export enum InjectionBindingType {
    value = 'value',
    constructor = 'constructor',
    factory = 'factory',
}

export type ConstructorBinding<T> = {
    type: InjectionBindingType.constructor;
    value: IConstructor<T>;
};

export type FactoryBinding<T> = {
    type: InjectionBindingType.factory;
    value: IFactory<T>;
};

export type ValueBinding<T> = {
    type: InjectionBindingType.value;
    value: T;
};

export type InjectionBinding<T> = ConstructorBinding<T> | FactoryBinding<T> | ValueBinding<T>;

export type InjectionType<T> = T extends ConstructorBinding<infer U>
    ? U
    : T extends FactoryBinding<infer U>
    ? U
    : T extends ValueBinding<infer U>
    ? U
    : never;

export type InjectionParams<T extends InjectionBinding<any>> = T extends ConstructorBinding<any>
    ? ConstructorParameters<T['value']>
    : T extends FactoryBinding<any>
    ? Parameters<T['value']>
    : T extends ValueBinding<any>
    ? never
    : never;

export type InjectionValue<T extends InjectionBinding<any>> = T['value'];

export interface DefaultBindings {
    [index: string]: InjectionBinding<any>;
}

/**
 * An Inversion of Control Container.
 *
 * Values, constructors, and factories can be bound to a Type.
 *
 * Then, given a Type, they can be retrieved later.
 */
export class Container<
    T extends {
        [index: string]: InjectionBinding<any>;
    } = {
        [index: string]: InjectionBinding<any>;
    },
> {
    bindings: T = {} as any;

    constructor(bindings: T = {} as any) {
        this.bindings = bindings;
    }

    /**
     * Binds a value to a Type
     * @param type - a Type to bind
     * @param value - a value to bind
     */
    bindValue<TKey extends keyof T, TValue extends InjectionType<T[TKey]>>(type: TKey, value: TValue) {
        this.bindings[type] = {
            type: InjectionBindingType.value,
            value,
        } as any;
    }

    /**
     * Binds a constructor to a Type
     * @param type - a Type to bind
     * @param constructor - a constructor to bind
     */
    bindConstructor<TKey extends keyof T, TConstructor extends IConstructor<InjectionType<T[TKey]>>>(
        type: TKey,
        constructor: TConstructor,
    ) {
        this.bindings[type] = {
            type: InjectionBindingType.constructor,
            value: constructor,
        } as any;
    }

    /**
     * Binds a factory to a Type
     * @param type - a Type to bind
     * @param factory - a factory to bind
     */
    bindFactory<TKey extends keyof T, TFactory extends IFactory<InjectionType<T[TKey]>>>(
        type: TKey,
        factory: TFactory,
    ) {
        this.bindings[type] = {
            type: InjectionBindingType.factory,
            value: factory,
        } as any;
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
    // get<TKey extends keyof T>(type: TKey, ...args: any): InjectionValue<T[TKey]>;
    // get<TKey extends keyof T>(type: TKey, ...args: any): InjectionValue<T[TKey]>;
    // get<TKey extends keyof T>(type: TKey, ...args: any): InjectionValue<T[TKey]>;
    get<TKey extends keyof T>(type: TKey, ...args: InjectionParams<T[TKey]>): InjectionType<T[TKey]> {
        let binding = this.bindings[type];
        if (!binding) {
            throw `No binding associated with: ${type.toString()}`;
        }
        const value: InjectionValue<T[TKey]> = binding.value;
        switch (binding.type) {
            case InjectionBindingType.value:
                return binding.value;
            case InjectionBindingType.constructor:
                // @ts-ignore TODO: Fix this
                return new value(...args);
            case InjectionBindingType.factory:
                // @ts-ignore TODO: Fix this
                return value(...args);
        }
    }

    private static default: Container<DefaultBindings> | undefined;

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
    static setDefault<TContainer extends Container<DefaultBindings>>(container: TContainer) {
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
export function inject<TContainer extends Container, TKey extends keyof TContainer['bindings']>(
    container: TContainer,
    type: TKey,
    ...args: InjectionParams<TContainer['bindings'][TKey]>
): InjectionType<TContainer['bindings'][TKey]>;

/**
 * Gets a value fron the default Container by Type
 *
 * This can be used as a default parameter value for other functions.
 *
 * @param type - a bound Type
 * @param [args] - zero or more args to pass if the bound value is a function or constructor
 */
export function inject<TKey extends keyof DefaultBindings>(
    type: TKey,
    ...args: InjectionParams<DefaultBindings[TKey]>
): InjectionType<DefaultBindings[TKey]>;

export function inject<T>(a: any, b: any, ...args: any): T {
    if (a instanceof Container) {
        // @ts-ignore TODO: Fix this
        return a.get(b, ...args);
    } else {
        const container = Container.getDefault();
        return container.get(a, ...[b, ...args]);
    }
}
