import { Container } from './Container';
import { ParameterInfo } from './ParameterInfo';
import { IConstructor, IFactory } from './Types';

export namespace Injector {
    let container: Container;

    function createContainer() {
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

    export function inject<T>(factory: IFactory<T>) {
        return factory(...ParameterInfo.getArgs(factory));
    }

    export function create<T>(Constructor: IConstructor<T>) {
        return new Constructor(...ParameterInfo.getArgs(Constructor));
    }
}
