import { Post } from './Post';

export class PostDataAccess {
    async getPost(id: string): Promise<Post> {
        return {
            id,
            subject: 'Subject',
            body: 'Body',
        };
    }
}
