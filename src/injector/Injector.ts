import { Container } from './Container';
import { ParameterInfo } from './ParameterInfo';
import { IConstructor, IFactory } from './Types';

export namespace Injector {
    let context: Container;

    function createContainer() {
        context = new Container();
        return context;
    }

    export function getContainer() {
        if (!context) {
            createContainer();
        }
        return context;
    }

    export function setContext(_context: Container) {
        context = _context;
    }

    export function inject<T>(factory: IFactory<T>) {
        return factory(...ParameterInfo.getArgs(factory));
    }

    export function create<T>(Constructor: IConstructor<T>) {
        return new Constructor(...ParameterInfo.getArgs(Constructor));
    }
}
