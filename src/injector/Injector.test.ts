import { Container } from "./Container";
import { Injector } from "./Injector";

describe('Injector', function () {
    beforeEach(function () {
        Injector.setContainer(undefined as any);
    });

    afterEach(function () {
        Injector.setContainer(undefined as any);
    });

    describe('createContainer', function () {
        it('should create a new Container', function () {
            const result = Injector.createContainer();
            expect(result).toBeInstanceOf(Container);
        });
    });

    describe('getContainer', function () {
        it('should create a Container if none exists', function () {
            const result = Injector.getContainer();
            expect(result).toBeInstanceOf(Container);
        });

        it('should get the default Container', function () {
            const result0 = Injector.getContainer();
            const result1 = Injector.getContainer();
            expect(result0).toBe(result1);
        });
    });

    describe('setContainer', function () {
        it('should set the default Contaienr', function () {
            const container = Injector.createContainer();
            Injector.setContainer(container);
            const result = Injector.getContainer();
            expect(result).toBe(container);
        });
    });

    describe('inject', function () {
        it('should inject values into a parameters', function () {
            const container = Injector.getContainer();
            const type = 'type';
            const value = 'value';
            container.bindValue(type, value);

            function test(value: string = Injector.inject(type)) {
                return value;
            }
            const result = test();

            expect(result).toBe(value);
        });

        it('should use a specified Container', function () {
            const container = Injector.createContainer();
            const type = 'type';
            const value = 'value';
            container.bindValue(type, value);

            function test(value: string = Injector.inject(type, container)) {
                return value;
            }
            const result = test();

            expect(result).toBe(value);
        });
    });
});
