import InjectionContext from './InjectionContext';

let context: InjectionContext;

export default class Injector {
    static createContext() {
        context = new InjectionContext();
        return context;
    }

    static getContext() {
        if (!context) {
            Injector.createContext();
        }
        return context;
    }

    static setContext(_context: InjectionContext) {
        context = _context;
    }

    static inject<T>(Constructor: IConstructor<T>, context: InjectionContext) {
        
    }
}