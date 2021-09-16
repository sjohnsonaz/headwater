import { Container } from '../../dist';

import { PostDataAccess } from '../data-access';

import { Types } from './Types';
import { createMediator } from './createMediator';

export const createContainer = () => {
    const container = new Container({
        [Types.Mediator]: {
            value: createMediator(),
        },
        [Types.PostDataAccess]: {
            value: new PostDataAccess(),
        },
    });
    Container.setDefault(container);
    return container;
};

type Bindings = ReturnType<typeof createContainer>['bindings'];

declare module '../../dist/container/Container' {
    interface DefaultBindings extends Bindings {}
}
