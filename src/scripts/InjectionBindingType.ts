export enum InjectionBindingType {
    value,
    constructor
}

export type IConstructor<T> = new (...args: any[]) => T;

export type IFactory<T> = (...args: any[]) => T;