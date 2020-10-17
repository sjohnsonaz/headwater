import { factory, inject, injectable } from "./Decorators";
import { Injector } from "./Injector";
import { IFactory } from "./Types";

describe('inject decorator', () => {
    interface IChild {
        a: string;
    }

    interface IParent {
        child: IChild;
    }

    @injectable
    class Child implements IChild {
        a: string;
        static staticString: string = 'staticString';

        constructor(@inject('TextValue') a?: string) {
            this.a = a as any;
        }
    }

    @injectable
    class Parent implements IParent {
        child: Child;

        constructor(@inject('Child') child?: Child) {
            this.child = child as any;
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

        expect(child.a).toBe('abcd');
    });

    it('should inject class constructors', () => {
        let context = Injector.getContext();
        context.bindValue('TextValue', 'abcd');
        context.bind<IChild>('Child', Child);

        let parent = new Parent();

        expect(parent.child.a).toBe('abcd');
    });

    it('should inject factory functions', () => {
        let context = Injector.getContext();
        context.bindValue('TextValue', 'abcd');
        context.bind<IChild>('Child', Child);
        context.bind<IParent>('Parent', Parent);
        context.bindValue('Factory', Factory.create);

        let factory: IFactory<Parent> = context.getValue('Factory');
        let parent = factory();

        expect(parent.child.a).toBe('abcd');
    });
});