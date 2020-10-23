import { factory, inject } from "./Decorators";
import { Injector } from "./Injector";
import { IFactory } from "./Types";

describe('inject decorator', () => {
    interface IChild {
        a: string;
    }

    interface IParent {
        child: IChild;
    }

    class Child implements IChild {
        a: string;
        static staticString: string = 'staticString';

        constructor(@inject('TextValue') a?: string) {
            this.a = a as any;
        }
    }

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
        let context = Injector.getContainer();
        context.bindValue('TextValue', 'abcd');

        let child = Injector.create(Child);

        expect(child.a).toBe('abcd');
    });

    it('should inject class constructors', () => {
        let context = Injector.getContainer();
        context.bindValue('TextValue', 'abcd');
        context.bindConstructor<IChild>('Child', Child);

        let parent = Injector.create(Parent);

        expect(parent.child.a).toBe('abcd');
    });

    it('should inject factory functions', () => {
        let context = Injector.getContainer();
        context.bindValue('TextValue', 'abcd');
        context.bindConstructor<IChild>('Child', Child);
        context.bindConstructor<IParent>('Parent', Parent);
        context.bindValue('Factory', Factory.create);

        let factory: IFactory<Parent> = context.getValue('Factory');
        let parent = factory();

        expect(parent.child.a).toBe('abcd');
    });
});