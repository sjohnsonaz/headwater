export abstract class Request<T> {
    protected __returns: T = undefined as any;
}

type RequestResponse<T> = T extends Request<infer U> ? U : any;

export interface RequestHandler<T extends Request<any>> {
    (request: T): Promise<RequestResponse<T>>;
}

export interface RequestValidator<T extends Request<any>> {
    (request: T): Promise<boolean>;
}

export interface RequestListener<T extends Request<any>> {
    (request: T, result: RequestResponse<T>): Promise<void>;
}

export interface RequestLogger<T extends Request<any>> {
    (request: T, result?: RequestResponse<T>, error?: any): Promise<void>;
}

type Constructor<T> = new (...args: any) => T;

/**
 * The Mediator class follows the Mediator pattern.
 *
 * Requests are dispatched to registered Request Handlers.
 */
export class Mediator {
    constructor({
        requireValidation = false,
    }: { requireValidation?: boolean } = {}) {
        this.requireValidation = requireValidation;
    }
    handlers: Record<string, RequestHandler<any>> = {};
    validators: Record<string, RequestValidator<any>> = {};
    listeners: Record<string, RequestListener<any>[]> = {};
    loggers: RequestLogger<any>[] = [];
    requireValidation: boolean;

    /**
     * Registers a Handler
     * @param requestCtr - a constructor for a Request
     * @param handler - a handler for a Request
     */
    addHandler<T extends Request<any>>(
        requestCtr: Constructor<T>,
        handler: RequestHandler<T>,
    ) {
        this.handlers[requestCtr.name] = handler;
    }

    /**
     * Registers a Validator
     * @param requestCtr - a constructor for a Request
     * @param validator - a validator for a Request
     */
    addValidator<T extends Request<any>>(
        requestCtr: Constructor<T>,
        validator: RequestValidator<T>,
    ) {
        this.validators[requestCtr.name] = validator;
    }

    /**
     * Registers a Handler and a Validator
     * @param requestCtr - a constructor for a Request
     */
    add<T extends Request<any>>({
        type,
        handler,
        validator,
    }: {
        type: Constructor<T>;
        handler: RequestHandler<T>;
        validator?: RequestValidator<T>;
    }) {
        const name = type.name;
        this.handlers[name] = handler;
        if (validator) {
            this.validators[name] = validator;
        } else {
            // Keep the keys packed
            if (this.validators[name]) {
                delete this.validators[name];
            }
        }
    }

    /**
     * Registers a Listener
     * @param requestCtr - a constructor for a Request
     * @param listener - a listener for a Request
     */
    addListener<T extends Request<any>>(
        requestCtr: Constructor<T>,
        listener: RequestListener<T>,
    ) {
        if (!this.listeners[requestCtr.name]) {
            this.listeners[requestCtr.name] = [];
        }
        this.listeners[requestCtr.name].push(listener);
    }

    /**
     * Removes a Listener
     * @param requestCtr - a constructor for a Request
     * @param listener - a listener for a Request
     */
    removeListener<T extends Request<any>>(
        requestCtr: Constructor<T>,
        listener: RequestListener<T>,
    ) {
        if (!this.listeners[requestCtr.name]) {
            this.listeners[requestCtr.name] = [];
        }
        const index = this.listeners[requestCtr.name].indexOf(listener);
        if (index >= 0) {
            this.listeners[requestCtr.name].splice(index, 1);
            if (!this.listeners[requestCtr.name].length) {
                delete this.listeners[requestCtr.name];
            }
        }
    }

    /**
     * Registers a Logger
     * @param logger - a listener for all Requests
     */
    addLogger<T extends RequestLogger<any>>(logger: T) {
        this.loggers.push(logger);
    }

    /**
     * Removes a Logger
     * @param logger - a listener for all Requests
     */
    removeLogger<T extends RequestLogger<any>>(logger: T) {
        const index = this.loggers.findIndex(logger);
        return index >= 0 ? this.loggers.splice(index, 1) : [];
    }

    /**
     * Sends a Request to a registered Handler
     * @param request - a Request object
     */
    async send<T extends Request<any>>(
        request: T,
        wait?: boolean,
    ): Promise<RequestResponse<T>> {
        try {
            const result = await this.callHandler(request);
            this.callLoggers(request, result);

            await this.callListeners(request, result, wait);

            return result;
        } catch (error) {
            this.callLoggers(request, undefined, error);
            throw error;
        }
    }

    protected async callHandler<T extends Request<any>>(
        request: T,
    ): Promise<RequestResponse<T>> {
        const { name } = request.constructor;
        const validator = this.validators[name];
        if (validator) {
            const valid = await validator(request);
            if (!valid) {
                throw `invalid request for ${name}`;
            }
        } else if (this.requireValidation) {
            throw `no validator found for ${name}`;
        }
        const handler = this.handlers[name];
        if (!handler) {
            throw `no handler found for ${name}`;
        }
        const result = await handler(request);
        return result;
    }

    protected async callListeners<T extends Request<any>>(
        request: T,
        result: RequestResponse<T>,
        wait?: boolean,
    ): Promise<void> {
        const { name } = request.constructor;
        const listeners = this.listeners[name];
        if (listeners && listeners.length) {
            if (wait) {
                await Promise.all(
                    listeners.map((listener) => listener(request, result)),
                );
            } else {
                // Loop through promises, handle errors, but don't wait
                listeners.forEach(async (listener) => {
                    try {
                        await listener(request, result);
                    } catch {}
                });
            }
        }
    }

    protected callLoggers<T extends Request<any>>(
        request: T,
        result?: RequestResponse<T>,
        error?: any,
    ) {
        // Loop through promises, handle errors, but don't wait
        this.loggers.forEach(async (logger) => {
            try {
                await logger(request, result, error);
            } catch {}
        });
    }
}
