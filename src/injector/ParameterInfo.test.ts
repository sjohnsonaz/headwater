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

    });

    describe('getArgs', function () {

    });

    describe('static', function () {
        describe('static add', function () {

        });

        describe('getArgs', function () {

        });

        describe('getParameterInfo', function () {

        });

        describe('getOrCreateParameterInfo', function () {

        });
    });
});
