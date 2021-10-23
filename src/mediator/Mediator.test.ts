import { Mediator, Request, RequestHandler } from './Mediator';

describe('Mediator', function () {
    describe('addHandler', function () {
        class TestRequest extends Request<string> {}

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

    describe('addValidator', function () {
        class TestRequest extends Request<string> {}

        it('should add a validator', function () {
            const mediator = new Mediator();
            expect(Object.keys(mediator.validators).length).toBe(0);
            const validator = async function () {
                return true;
            };
            mediator.addValidator(TestRequest, validator);
            expect(Object.keys(mediator.validators).length).toBe(1);
            expect(mediator.validators[TestRequest.name]).toBe(validator);
        });

        it('should replace a validator', function () {
            const mediator = new Mediator();
            const validatorA = async function () {
                return true;
            };
            const validatorB = async function () {
                return true;
            };
            mediator.addValidator(TestRequest, validatorA);
            expect(mediator.validators[TestRequest.name]).toBe(validatorA);
            mediator.addValidator(TestRequest, validatorB);
            expect(mediator.validators[TestRequest.name]).toBe(validatorB);
        });
    });

    describe('add', function () {
        class TestRequest extends Request<string> {}

        it('should add a handler', function () {
            const mediator = new Mediator();
            expect(Object.keys(mediator.handlers).length).toBe(0);
            const handler = async function () {
                return '';
            };
            mediator.add({
                type: TestRequest,
                handler,
            });

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
            mediator.add({
                type: TestRequest,
                handler: handlerA,
            });
            expect(mediator.handlers[TestRequest.name]).toBe(handlerA);
            mediator.add({
                type: TestRequest,
                handler: handlerB,
            });
            expect(mediator.handlers[TestRequest.name]).toBe(handlerB);
        });

        it('should add a validator', function () {
            const mediator = new Mediator();
            expect(Object.keys(mediator.handlers).length).toBe(0);
            const handler = async function () {
                return '';
            };
            const validator = async function () {
                return true;
            };
            mediator.add({
                type: TestRequest,
                handler,
                validator,
            });

            expect(Object.keys(mediator.validators).length).toBe(1);
            expect(mediator.validators[TestRequest.name]).toBe(validator);
        });

        it('should replace a validator', function () {
            const mediator = new Mediator();
            const handler = async function () {
                return '';
            };
            const validatorA = async function () {
                return true;
            };
            const validatorB = async function () {
                return true;
            };
            mediator.add({
                type: TestRequest,
                handler,
                validator: validatorA,
            });
            expect(mediator.validators[TestRequest.name]).toBe(validatorA);
            mediator.add({
                type: TestRequest,
                handler,
                validator: validatorB,
            });
            expect(mediator.validators[TestRequest.name]).toBe(validatorB);
        });

        it('should remove a validator', function () {
            const mediator = new Mediator();
            const handler = async function () {
                return '';
            };
            const validator = async function () {
                return true;
            };
            mediator.add({
                type: TestRequest,
                handler,
                validator,
            });
            expect(mediator.validators[TestRequest.name]).toBe(validator);
            mediator.add({
                type: TestRequest,
                handler,
            });
            expect(mediator.validators[TestRequest.name]).toBeUndefined();
        });
    });

    describe('addListener', function () {
        class TestRequest extends Request<string> {}

        it('shoud add a listener', function () {
            const mediator = new Mediator();
            const listener = async function () {};
            mediator.addListener(TestRequest, listener);

            expect(mediator.listeners[TestRequest.name]).toStrictEqual([
                listener,
            ]);
        });
    });

    describe('removeListener', function () {
        class TestRequest extends Request<string> {}

        it('should remove a listener', function () {
            const mediator = new Mediator();
            const listener = async function () {};
            mediator.addListener(TestRequest, listener);
            mediator.removeListener(TestRequest, listener);

            expect(mediator.listeners[TestRequest.name]).toBeUndefined();
        });
    });

    describe('addLogger', function () {
        class TestRequest extends Request<string> {}

        it('shoud add a logger', function () {
            const mediator = new Mediator();
            const logger = async function () {};

            expect(mediator.loggers.length).toBe(0);

            mediator.addLogger(logger);

            expect(mediator.loggers.length).toBe(1);
        });
    });

    describe('removeLogger', function () {
        it('should remove a logger', function () {
            const mediator = new Mediator();
            const logger = async function () {};

            mediator.addLogger(logger);
            mediator.removeLogger(logger);

            expect(mediator.loggers.length).toBe(0);
        });
    });

    describe('send', function () {
        class TestRequest extends Request<string> {}

        it('should send a request', async function () {
            const mediator = new Mediator();
            const handler = async function () {
                return 'a';
            };
            mediator.addHandler(TestRequest, handler);

            const result = await mediator.send(new TestRequest());
            expect(result).toBe('a');
        });

        it('should validate a request', async function () {
            const mediator = new Mediator();
            const handler = async function () {
                return 'a';
            };
            const validator = async function () {
                return true;
            };
            mediator.addHandler(TestRequest, handler);
            mediator.addValidator(TestRequest, validator);

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
            } catch (e) {
                error = e;
            }
            expect(error).toBeDefined();
        });

        // TODO: Fix jest expects toThrow
        it('should throw when not valid', async function () {
            const mediator = new Mediator();
            const handler = async function () {
                return 'a';
            };
            const validator = async function () {
                return false;
            };
            mediator.addHandler(TestRequest, handler);
            mediator.addValidator(TestRequest, validator);

            let error: any;
            try {
                const result = await mediator.send(new TestRequest());
                expect(result).toBe('a');
            } catch (e) {
                error = e;
            }
            expect(error).toBeDefined();
        });

        // TODO: Fix jest expects toThrow
        it('should throw when no validator is found but is required', async function () {
            const mediator = new Mediator({ requireValidation: true });
            const handler = async function () {
                return 'a';
            };
            mediator.addHandler(TestRequest, handler);

            let error: any;
            try {
                const result = await mediator.send(new TestRequest());
                expect(result).toBe('a');
            } catch (e) {
                error = e;
            }
            expect(error).toBeDefined();
        });

        it('should send result to listeners', function (done) {
            const mediator = new Mediator();
            mediator.addHandler(TestRequest, async () => {
                return 'a';
            });
            mediator.addListener(TestRequest, async (request, result) => {
                expect(result).toBe('a');
                done();
            });
            mediator.send(new TestRequest());
        });

        it('should wait for listeners to complete', async function () {
            const mediator = new Mediator();
            mediator.addHandler(TestRequest, async () => {
                return 'a';
            });
            mediator.addListener(TestRequest, async (request, result) => {
                expect(result).toBe('a');
            });
            await mediator.send(new TestRequest(), true);
        });
    });
});
