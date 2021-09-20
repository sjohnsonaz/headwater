import { Post } from './Post';

export class PostDataAccess {
    async getPost(id?: string): Promise<Post | undefined> {
        if (id) {
            return {
                id,
                subject: 'Subject',
                body: 'Body',
            };
        }
    }
}
