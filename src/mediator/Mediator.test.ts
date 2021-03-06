import { Mediator, Request, IRequestHandler } from "./Mediator";

describe('Mediator', function () {
    describe('addHandler', function () {
        class TestRequest extends Request<string> { }

        it('should add a handler', function () {
            const mediator = new Mediator();
            expect(Object.keys(mediator.handlers).length).toBe(0);
            const handler = async function () {
                return '';
            };
            mediator.addHandler(TestRequest, handler);
            expect(Object.keys(mediator.handlers).length).toBe(1);
            expect(mediator.handlers[TestRequest.name]).toBe(handler);
        });

        it('should replace a handler', function () {
            const mediator = new Mediator();
            const handlerA = async function () {
                return '';
            };
            const handlerB = async function () {
                return '';
            };
            mediator.addHandler(TestRequest, handlerA);
            expect(mediator.handlers[TestRequest.name]).toBe(handlerA);
            mediator.addHandler(TestRequest, handlerB);
            expect(mediator.handlers[TestRequest.name]).toBe(handlerB);
        });
    });

    describe('send', function () {
        class TestRequest extends Request<string> { }

        it('should send a request', async function () {
            const mediator = new Mediator();
            const handler = async function () {
                return 'a';
            };
            mediator.addHandler(TestRequest, handler);
            const result = await mediator.send(new TestRequest());
            expect(result).toBe('a');
        });

        // TODO: Fix jest expects toThrow
        it('should throw when no handler is found', async function () {
            const mediator = new Mediator();
            let error: any;
            try {
                const result = await mediator.send(new TestRequest());
                expect(result).toBe('a');
            }
            catch (e) {
                error = e;
            }
            expect(error).toBeDefined();
        });
    });
});
