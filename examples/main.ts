import { createContainer } from './application';
import { getPost } from './services';

async function main() {
    createContainer();
    try {
        const post = await getPost('1234');
        console.log(post);
    } catch (error) {
        console.error(error);
    }
}

main();
