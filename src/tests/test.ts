import { expect } from 'chai';

import Injector, { inject, injectable, factory } from '../scripts/main';

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

    class Factory {
        @factory
        static create(@inject('Parent') parent?: Parent) {
            return parent;
        }
    }

    it('should inject constant values', () => {
        let context = Injector.getContext();
        context.bindValue('TextValue', 'abcd');

        let child = new Child();

        expect(child.a).to.equal('abcd');
    });

    it('should inject class constructors', () => {
        let context = Injector.getContext();
        context.bindValue('TextValue', 'abcd');
        context.bind('Child', Child);

        let parent = new Parent();

        expect(parent.child.a).to.equal('abcd');
    });

    it('should inject factory functions', () => {
        let context = Injector.getContext();
        context.bindValue('TextValue', 'abcd');
        context.bind('Child', Child);
        context.bind('Parent', Parent);
        context.bindValue('Factory', Factory.create);

        let factory: () => Parent = context.getValue('Factory');
        let parent = factory();

        expect(parent.child.a).to.equal('abcd');
    });
});