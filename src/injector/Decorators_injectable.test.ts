import {
    inject,
    // injectable
} from "./Decorators";
import { Injector } from "./Injector";

describe.skip('injectable decorator', () => {
    class Base {
        static staticBaseString: string = 'staticBaseString';
        method() {
            console.log('method called');
        }

        constructor() {
        }
    }
    // @injectable
    class Child extends Base {
        a: string;
        static staticString: string = 'staticString';

        constructor(@inject('TextValue') a?: string) {
            super();
            this.a = a as any;
        }
    }

    it('should maintain constructor names', () => {
        expect(Child.name).toBe('Child');
    });

    it('should maintain constructor prototype', () => {
        expect(Child.prototype.method).toBeInstanceOf(Function);
    });

    it('should maintain class names', () => {
        let container = Injector.getContainer();
        container.bindValue('TextValue', 'abcd');

        let child = new Child();

        expect(child.constructor.name).toBe('Child');
    });

    it('should maintain static members', () => {
        expect(Child.staticString).toBe('staticString');
    });

    it('should maintain inherited static members', () => {
        expect(Child.staticBaseString).toBe('staticBaseString');
    });
});