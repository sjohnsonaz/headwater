import { inject, Mediator } from '../../dist';

import { Types } from '../application';
import { GetPostQuery } from '../queries';

export const GetPostHandler = (mediator: Mediator) =>
    mediator.addHandler(
        GetPostQuery,
        async ({ id }, postDataAccess = inject(Types.PostDataAccess)) => {
            const post = await postDataAccess.getPost(id);
            if (!post) {
                throw new Error('no post');
            }
            return post;
        },
    );
