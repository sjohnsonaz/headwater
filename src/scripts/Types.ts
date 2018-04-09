export enum InjectionBindingType {
    value,
    constructor
}
export type Index = string | number | Symbol;

export type IConstructor<T> = new (...args: any[]) => T;

export type IFactory<T> = (...args: any[]) => T;