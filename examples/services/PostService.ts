import { inject } from '../../dist';

import { Types } from '../application';
import { GetPostQuery } from '../queries';

export const getPost = async (
    id: string,
    mediator = inject(Types.Mediator),
) => {
    const post = await mediator.send(new GetPostQuery(id));
    return post;
};
