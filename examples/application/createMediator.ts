import { Mediator } from '../../dist';

import { GetPostHandler } from '../query-handlers';
import { GetPostValidator } from '../validators';

export const createMediator = () => {
    const mediator = new Mediator({ requireValidation: true });

    GetPostHandler(mediator);
    GetPostValidator(mediator);

    return mediator;
};
