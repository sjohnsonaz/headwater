import { expect } from 'chai';

import Injector, { inject, injectable, IFactory } from '../scripts/main';

describe('injectable decorator', () => {
    class Base {
        static staticBaseString: string = 'staticBaseString';
        method() {
            console.log('method called');
        }

        constructor() {
        }
    }
    @injectable
    class Child extends Base {
        a: string;
        static staticString: string = 'staticString';

        constructor(@inject('TextValue') a?: string) {
            super();
            this.a = a;
        }
    }

    it('should maintain constructor names', () => {
        expect(Child.name).to.equal('Child');
    });

    it('should maintain constructor prototype', () => {
        expect(Child.prototype.method).to.be.instanceof(Function);
    });

    it('should maintain class names', () => {
        let context = Injector.getContext();
        context.bindValue('TextValue', 'abcd');

        let child = new Child();

        expect(child.constructor.name).to.equal('Child');
    });

    it('should maintain static members', () => {
        expect(Child.staticString).to.equal('staticString');
    });

    it('should maintain inherited static members', () => {
        expect(Child.staticBaseString).to.equal('staticBaseString');
    });
});