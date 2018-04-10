import { expect } from 'chai';

import Injector, { inject, injectable, factory, IFactory } from '../scripts/main';

describe('injectable decorator', () => {
    @injectable
    class Child {
        a: string;
        static staticString: string = 'staticString';

        constructor(@inject('TextValue') a?: string) {
            this.a = a;
        }
    }

    it('should maintain class names', () => {
        let context = Injector.getContext();
        context.bindValue('TextValue', 'abcd');

        let child = new Child();

        expect(child.constructor.name).to.equal('Child');
    });

    it('should maintain static members', () => {
        expect(Child.staticString).to.equal('staticString');
    });
});

describe('inject decorator', () => {
    interface IChild {
        a: string;
    }

    interface IParent {
        b: string;
        child: IChild;
    }

    @injectable
    class Child implements IChild {
        a: string;
        static staticString: string = 'staticString';

        constructor(@inject('TextValue') a?: string) {
            this.a = a;
        }
    }

    @injectable
    class Parent implements IParent {
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
        context.bind<IChild>('Child', Child);

        let parent = new Parent();

        expect(parent.child.a).to.equal('abcd');
    });

    it('should inject factory functions', () => {
        let context = Injector.getContext();
        context.bindValue('TextValue', 'abcd');
        context.bind<IChild>('Child', Child);
        context.bind<IParent>('Parent', Parent);
        context.bindValue('Factory', Factory.create);

        let factory: IFactory<Parent> = context.getValue('Factory');
        let parent = factory();

        expect(parent.child.a).to.equal('abcd');
    });
});