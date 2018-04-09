import { expect } from 'chai';

import { inject, injectable, InjectionContext } from '../scripts/main';

describe('inject decorator', () => {
    @injectable
    class Test {
        a: string;

        constructor(@inject('TextValue') a?: string) {
            this.a = a;
        }
    }

    @injectable
    class Parent {
        b: string;
        child: Test;

        constructor(@inject('Test') test?: Test) {
            this.child = test;
        }
    }

    it('should run per constructor parameter', () => {
        let context = InjectionContext.getContext();
        context.bindValue('TextValue', 'abcd');

        let test = new Test();

        expect(test.a).to.equal('abcd');
    });

    it('should inject classes', () => {
        let context = InjectionContext.getContext();
        context.bindValue('TextValue', 'abcd');
        context.bind('Test', Test);

        let parent = new Parent();

        expect(parent.child.a).to.equal('abcd');
    });
});