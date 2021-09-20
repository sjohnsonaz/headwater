import { Mediator } from '../../dist';

import { GetPostHandler } from '../query-handlers';
import { GetPostValidator } from '../query-handlers/GetPostQuerySchema';

export const createMediator = () => {
    const mediator = new Mediator({ requireValidation: true });

    GetPostHandler(mediator);
    GetPostValidator(mediator);

    return mediator;
};
