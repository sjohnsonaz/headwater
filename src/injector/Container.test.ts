import { Container, InjectionBindingType } from "./Container";

describe('Container', function () {
    describe('constructor', function () {
        it('should initialize properties', function () {
            const container = new Container();
            expect(container.bindings).toBeDefined();
            expect(container.bindings).toBeInstanceOf(Object);
            expect(Object.keys(container.bindings).length).toBe(0);
        });
    });

    describe('bindValue', function () {
        it('should bind a value', function () {
            const container = new Container();
            const type = 'type';
            const value = 'value';
            container.bindValue(type, value);
            const result = container.bindings[type];
            expect(result).toBeDefined();
            expect(result.bindingType).toBe(InjectionBindingType.value);
            expect(result.value).toBe(value);
        });
    });

    describe('bindConstructor', function () {
        it('should bind a constructor', function () {
            const container = new Container();
            const type = 'type';
            class Test { }
            container.bindConstructor(type, Test);
            const result = container.bindings[type];
            expect(result).toBeDefined();
            expect(result.bindingType).toBe(InjectionBindingType.constructor);
            expect(result.value).toBe(Test);
        });
    });

    describe('bindFactory', function () {
        it('should bind a factory', function () {
            const container = new Container();
            const type = 'type';
            class Test { }
            function factory() {
                return new Test();
            }
            container.bindFactory(type, factory);
            const result = container.bindings[type];
            expect(result).toBeDefined();
            expect(result.bindingType).toBe(InjectionBindingType.factory);
            expect(result.value).toBe(factory);
        });
    });

    describe('getValue', function () {
        it('should throw when no binding is found', function () {
            const container = new Container();
            const type = 'type';
            expect(function () {
                container.get(type);
            }).toThrow();
        });

        it('should get a value', function () {
            const container = new Container();
            const type = 'type';
            const value = 'value';
            container.bindValue(type, value);
            const result: string = container.get(type);
            expect(result).toBe(value);
        });

        it('should get a constructor', function () {
            const container = new Container();
            const type = 'type';
            class Test { }
            container.bindConstructor(type, Test);
            const result: Test = container.get(type);
            expect(result).toBeInstanceOf(Test);
        });

        it('should get a facotry', function () {
            const container = new Container();
            const type = 'type';
            class Test { }
            function factory() {
                return new Test();
            }
            container.bindFactory(type, factory);
            const result: Test = container.get(type);
            expect(result).toBeInstanceOf(Test);
        });
    });
});
