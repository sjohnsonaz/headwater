import { Container, inject, InjectionBindingType } from './Container';

describe('Container', function () {
    describe('constructor', function () {
        it('should initialize properties', function () {
            const container = new Container();
            expect(container.bindings).toBeDefined();
            expect(container.bindings).toBeInstanceOf(Object);
            expect(Object.keys(container.bindings).length).toBe(0);
        });

        it('should bind values', function () {
            class Test {}

            function factory() {
                return new Test();
            }

            const container = new Container({
                value: {
                    type: InjectionBindingType.value,
                    value: 'value',
                },
                constr: {
                    type: InjectionBindingType.constructor,
                    value: Test,
                },
                factory: {
                    type: InjectionBindingType.factory,
                    value: factory,
                },
            });

            const valueBinding = container.bindings['value'];
            expect(valueBinding).toBeDefined();
            expect(valueBinding.type).toBe(InjectionBindingType.value);
            expect(valueBinding.value).toBe('value');

            const constrBinding = container.bindings['constr'];
            expect(constrBinding).toBeDefined();
            expect(constrBinding.type).toBe(InjectionBindingType.constructor);
            expect(constrBinding.value).toBe(Test);

            const factoryBinding = container.bindings['factory'];
            expect(factoryBinding).toBeDefined();
            expect(factoryBinding.type).toBe(InjectionBindingType.factory);
            expect(factoryBinding.value).toBe(factory);
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
            expect(result.type).toBe(InjectionBindingType.value);
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
            expect(result.type).toBe(InjectionBindingType.constructor);
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
            expect(result.type).toBe(InjectionBindingType.factory);
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
            const type = 'type';
            const value = 'value';
            const container = new Container({
                [type]: {
                    type: InjectionBindingType.value,
                    value,
                },
            });

            const result = container.get(type);

            expect(result).toBe(value);
        });

        it('should get a constructor', function () {
            const type = 'type';
            class Test {}
            const container = new Container({
                [type]: {
                    type: InjectionBindingType.constructor,
                    value: Test,
                },
            });

            const result = container.get(type);

            expect(result).toBeInstanceOf(Test);
        });

        it('should get a factory', function () {
            const type = 'type';
            class Test {}
            function factory() {
                return new Test();
            }
            const container = new Container({
                [type]: {
                    type: InjectionBindingType.factory,
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
                const container = new Container({
                    type: {
                        type: InjectionBindingType.value,
                        value: 'test',
                    },
                });
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

                function test(value = inject(type)) {
                    return value;
                }
                const result = test();

                expect(result).toBe(value);
            });

            it('should use a specified Container', function () {
                const type = 'type';

                const container = new Container({
                    [type]: {
                        type: InjectionBindingType.value,
                        value: 'value',
                    },
                });

                function test(value = inject(container, type)) {
                    return value;
                }
                const result = test();

                expect(result).toBe('value');
            });
        });
    });
});

// Type declaration to extend DefaultBindings
// These can be used to test typings, but should remain commented out
// declare module './Container' {
//     interface DefaultBindings {
//         type: {
//             type: InjectionBindingType.value;
//             value: string;
//         };
//     }
// }
