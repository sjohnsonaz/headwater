import { Request } from '../../dist';

import { Post } from '../data-access';

export class GetPostQuery extends Request<Post> {
    constructor(public id: string) {
        super();
    }
}
