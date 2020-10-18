import { InjectionContext } from './InjectionContext';
import { ParameterInfo } from './ParameterInfo';
import { IConstructor } from './Types';

export namespace Injector {
    let context: InjectionContext;

    function createContext() {
        context = new InjectionContext();
        return context;
    }

    export function getContext() {
        if (!context) {
            createContext();
        }
        return context;
    }

    export function setContext(_context: InjectionContext) {
        context = _context;
    }

    export function inject<T>(Constructor: IConstructor<T>) {
        return new Constructor(...ParameterInfo.getArgs(Constructor));
    }
}
