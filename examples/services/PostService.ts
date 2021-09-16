import { inject } from '../../dist';

import { Types } from '../application';
import { GetPost } from '../queries';

export const getPost = async (id: string, mediator = inject(Types.Mediator)) => {
    const post = await mediator.send(new GetPost(id));
    return post;
};
