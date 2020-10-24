import { Container } from "./Container";
import { Injector } from "./Injector";

describe('Injector', function () {
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
        it.skip('should inject parameters into a factory', function () {

        });
    });

    describe('create', function () {
        it.skip('should inject parameters into a constructor', function () {

        });
    });
});
