export function run() {
    return 'Application started...';
}

window.onload = function () {
    console.log(run());
}

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