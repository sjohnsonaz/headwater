import { InjectionContext } from './InjectionContext';
import { ParameterInfo } from './ParameterInfo';
import { IConstructor } from './Types';

let context: InjectionContext;

export class Injector {
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

    static inject<T>(Constructor: IConstructor<T>) {
        return new Constructor(...ParameterInfo.getArgs(Constructor));
    }
}