import { Container } from './Container';
import { Index } from './Types';

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

    export function inject<T>(type: Index, ...args: any): T;
    export function inject<T>(type: Index, container: Container, ...args: any): T;
    export function inject<T>(type: Index, a: any, ...args: any): T {
        if (a instanceof Container) {
            return a.get(type, ...args);
        } else {
            const container = getContainer();
            return container.get(type, a, ...args);
        }
    }
}
