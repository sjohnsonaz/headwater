import { Mediator } from '../../dist';

import { GetPostQuery } from '../queries';

export const GetPostValidator = (mediator: Mediator) =>
    mediator.addValidator(GetPostQuery, async (request) => {
        if (
            typeof request === 'object' &&
            typeof request.id === 'string' &&
            Boolean(request.id)
        ) {
            return true;
        } else {
            return false;
        }
    });
