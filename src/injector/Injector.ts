import { Container } from './Container';
import { ParameterInfo } from './ParameterInfo';
import { IConstructor, IFactory } from './Types';

export namespace Injector {
    let container: Container;

    export function createContainer() {
        container = new Container();
        return container;
    }

    export function getContainer() {
        if (!container) {
            createContainer();
        }
        return container;
    }

    export function setContainer(_container: Container) {
        container = _container;
    }

    export function inject<T>(factory: IFactory<T>, container?: Container) {
        return factory(...ParameterInfo.getArgs(factory, undefined, container));
    }

    export function create<T>(Constructor: IConstructor<T>, container?: Container) {
        return new Constructor(...ParameterInfo.getArgs(Constructor, undefined, container));
    }
}
