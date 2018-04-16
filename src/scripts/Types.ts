export enum InjectionBindingType {
    value = 'value',
    constructor = 'constructor',
    factory = 'factory'
}

export type Index = string | number | Symbol;

export type IConstructor<T> = new (...args: any[]) => T;

export type IFactory<T> = (...args: any[]) => T;