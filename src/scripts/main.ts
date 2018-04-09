export { default as ParameterInfo } from './ParameterInfo';
export { inject, injectable, factory } from './Decorators';
export { default as InjectionContext } from './InjectionContext';

let typeHash: {
    [index: string]: Symbol;
} = {};

class SymbolType<T> {
    symbol: Symbol;
    constructor(name: string) {
        this.symbol = Symbol(name);
        this.symbol.toString
    }
}
function createSymbol(name: string) {
    return Symbol(name);
}



class Injector {
    typeHash: {
        [index: string]: Symbol;
    } = {};
}


