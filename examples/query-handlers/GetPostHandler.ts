import { inject, Mediator } from '../../dist';

import { Types } from '../application';
import { GetPost } from '../queries';

export const GetPostHandler = (mediator: Mediator) =>
    mediator.add({
        type: GetPost,
        handler: async ({ id }, postDataAccess = inject(Types.PostDataAccess)) => {
            return await postDataAccess.getPost(id);
        },
    });
