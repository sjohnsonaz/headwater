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
     * @param validator - a handler for a Request
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
     * @param handler - a handler for a Request
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

    addListener<T extends Request<any>>(
        requestCtr: Constructor<T>,
        listener: RequestListener<T>,
    ) {
        if (!this.listeners[requestCtr.name]) {
            this.listeners[requestCtr.name] = [];
        }
        this.listeners[requestCtr.name].push(listener);
    }

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
     * Sends a Request to a registered Handler
     * @param request - a Request object
     */
    async send<T extends Request<any>>(
        request: T,
        wait?: boolean,
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
        const listeners = this.listeners[name];
        if (listeners && listeners.length) {
            if (wait) {
                await Promise.all(
                    listeners.map((listener) => listener(request, result)),
                );
            } else {
                listeners.forEach((listener) => listener(request, result));
            }
        }
        return result;
    }
}
