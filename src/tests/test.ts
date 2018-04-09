import { expect } from 'chai';

import { inject, injectable } from '../scripts/main';

describe('inject decorator', () => {
    it('should run per constructor parameter', () => {
        @injectable
        class Test {
            constructor(@inject a?: string) {
                console.log('constructor:', a);

            }
        }

        let test = new Test();
    });
});