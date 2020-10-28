export abstract class Request<T> {
    protected __returns: T = undefined as any;
}

type RequestResponse<T> = T extends Request<infer U> ? U : any;

export interface IRequestHandler<T extends Request<any>> {
    (request: T): Promise<RequestResponse<T>>;
}

type Constructor<T> = {
    new(...args: any): T;
};

/**
 * The Mediator class follows the Mediator pattern.
 * 
 * Requests are dispatched to registered Request Handlers.
 */
export class Mediator {
    handlers: Record<string, (request: Request<any>) => Promise<any>> = {};

    /**
     * Registers a Handler
     * @param requestCtr - a constructor for a Request
     * @param handler - a handler for a Request
     */
    addHandler<T extends Request<any>>(requestCtr: Constructor<T>, handler: IRequestHandler<T>) {
        // TODO: Fix this any
        this.handlers[requestCtr.name] = handler as any;
    }

    /**
     * Sends a Request to a registered Handler
     * @param request - a Request object
     */
    send<T extends Request<any>>(request: T): Promise<RequestResponse<T>> {
        const handler = this.handlers[request.constructor.name];
        if (!handler) {
            throw 'no handler found';
        }
        return handler(request);
    }
}
