export type Index = string | number | symbol;

export type IConstructor<T> = new (...args: any) => T;

export type IFactory<T> = (...args: any) => T;