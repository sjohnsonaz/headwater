import { Mediator } from '../../dist';

import { GetPostHandler } from '../query-handlers';

export const createMediator = () => {
    const mediator = new Mediator();

    GetPostHandler(mediator);

    return mediator;
};
