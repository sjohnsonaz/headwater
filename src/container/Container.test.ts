import { ConstructorBinding, Container, inject, InjectionBindingType, InjectionType } from './Container';

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
            class Test {}
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
            class Test {}
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

    describe('get', function () {
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
            class Test {}
            container.bindConstructor(type, Test);
            const result: Test = container.get(type);
            expect(result).toBeInstanceOf(Test);
        });

        it('should get a factory', function () {
            class Test {}
            function factory() {
                return new Test();
            }

            const type = 'type';
            const container = new Container({
                [type]: {
                    bindingType: InjectionBindingType.factory,
                    value: factory,
                },
            });

            const result = container.get(type);
            expect(result).toBeInstanceOf(Test);
        });
    });

    describe('static', function () {
        beforeEach(function () {
            Container.setDefault(undefined as any);
        });

        afterEach(function () {
            Container.setDefault(undefined as any);
        });

        describe('createContainer', function () {
            it('should create a new Container', function () {
                const result = new Container();
                expect(result).toBeInstanceOf(Container);
            });
        });

        describe('getDefault', function () {
            it('should create a Container if none exists', function () {
                const result = Container.getDefault();
                expect(result).toBeInstanceOf(Container);
            });

            it('should get the default Container', function () {
                const result0 = Container.getDefault();
                const result1 = Container.getDefault();
                expect(result0).toBe(result1);
            });
        });

        describe('setDefault', function () {
            it('should set the default Contaienr', function () {
                const container = new Container();
                Container.setDefault(container);
                const result = Container.getDefault();
                expect(result).toBe(container);
            });
        });

        describe('inject', function () {
            it('should inject values into a parameters', function () {
                const container = Container.getDefault();
                const type = 'type';
                const value = 'value';
                container.bindValue(type, value);

                function test(value: string = inject(type)) {
                    return value;
                }
                const result = test();

                expect(result).toBe(value);
            });

            it('should use a specified Container', function () {
                const container = new Container();
                const type = 'type';
                const value = 'value';
                container.bindValue(type, value);

                function test(value: string = inject(type, container)) {
                    return value;
                }
                const result = test();

                expect(result).toBe(value);
            });
        });
    });
});
