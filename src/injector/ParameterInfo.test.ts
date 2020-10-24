import { Container } from "./Container";
import { ParameterInfo } from "./ParameterInfo";

describe('ParameterInfo', function () {
    describe('constructor', function () {
        it('should set default values', function () {
            const parameterInfo = new ParameterInfo();
            expect(parameterInfo.highestIndex).toBe(0);
            expect(parameterInfo.parameters.length).toBe(0);
        });
    });

    describe('add', function () {
        it('should add a new parameter', function () {
            const parameterInfo = new ParameterInfo();
            parameterInfo.add(0, 'type0');
            parameterInfo.add(1, 'type1');
            expect(parameterInfo.highestIndex).toBe(1);
            expect(parameterInfo.parameters.length).toBe(2);
        });
    });

    describe('getValue', function () {
        it('should get a value from a container', function () {
            const type = 'type';
            const value = 'value';
            const container = new Container();
            container.bindValue(type, value);

            const parameterInfo = new ParameterInfo();
            parameterInfo.add(0, type);

            const result: string = parameterInfo.getValue(type, container);
            expect(result).toBe(value);
        });
    });

    describe('getArgs', function () {
        it('should get injected args', function () {
            const type0 = 'type0';
            const value0 = 'value0';
            const type1 = 'type1';
            const value1 = 'value1';
            const container = new Container();
            container.bindValue(type0, value0);
            container.bindValue(type1, value1);

            const parameterInfo = new ParameterInfo();
            parameterInfo.add(0, type0);
            parameterInfo.add(1, type1);

            const result = parameterInfo.getArgs([], container);
            expect(result.length).toBe(2);
            expect(result[0]).toBe(value0);
            expect(result[1]).toBe(value1);
        });
    });

    describe('static', function () {
        describe('static add', function () {
            it('should attach a ParameterInfo object and add parameters', function () {
                const target = {};
                const parameterInfo = ParameterInfo.add(target, 0, 'type0');
                ParameterInfo.add(target, 1, 'type1');
                expect(parameterInfo.highestIndex).toBe(1);
                expect(parameterInfo.parameters.length).toBe(2);
            });
        });

        describe('getArgs', function () {
            it('should get args for a target', function () {
                const type0 = 'type0';
                const value0 = 'value0';
                const type1 = 'type1';
                const value1 = 'value1';
                const container = new Container();
                container.bindValue(type0, value0);
                container.bindValue(type1, value1);

                const target = {};
                const parameterInfo =
                    ParameterInfo.add(target, 0, type0);
                ParameterInfo.add(target, 1, type1);

                const result = ParameterInfo.getArgs(target, [], container);
                expect(result.length).toBe(2);
                expect(result[0]).toBe(value0);
                expect(result[1]).toBe(value1);
            });
        });

        describe('getPropertyArgs', function () {
            it('should get args for a ParameterInfo by propertyKey', function () {
                const type0 = 'type0';
                const value0 = 'value0';
                const type1 = 'type1';
                const value1 = 'value1';
                const container = new Container();
                container.bindValue(type0, value0);
                container.bindValue(type1, value1);

                class Target {
                    method() {
                        return true;
                    }
                }
                const target = new Target();
                const parameterInfo =
                    ParameterInfo.add(target.method, 0, type0);
                ParameterInfo.add(target.method, 1, type1);

                const result = ParameterInfo.getPropertyArgs(target, [], 'method', container);
                expect(result.length).toBe(2);
                expect(result[0]).toBe(value0);
                expect(result[1]).toBe(value1);
            });
        });
    });
});
