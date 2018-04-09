import { expect } from 'chai';

import { inject, injectable, InjectionContext } from '../scripts/main';

describe('inject decorator', () => {
    @injectable
    class Child {
        a: string;

        constructor(@inject('TextValue') a?: string) {
            this.a = a;
        }
    }

    @injectable
    class Parent {
        b: string;
        child: Child;

        constructor(@inject('Child') child?: Child) {
            this.child = child;
        }
    }

    it('should run per constructor parameter', () => {
        let context = InjectionContext.getContext();
        context.bindValue('TextValue', 'abcd');

        let child = new Child();

        expect(child.a).to.equal('abcd');
    });

    it('should inject classes', () => {
        let context = InjectionContext.getContext();
        context.bindValue('TextValue', 'abcd');
        context.bind('Child', Child);

        let parent = new Parent();

        expect(parent.child.a).to.equal('abcd');
    });
});