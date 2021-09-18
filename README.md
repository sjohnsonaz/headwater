# Headwater

[![Node.js CI](https://github.com/sjohnsonaz/headwater/workflows/Node.js%20CI/badge.svg)](https://github.com/sjohnsonaz/headwater/actions?query=workflow%3A%22Node.js+CI%22) [![npm version](https://badge.fury.io/js/headwater.svg)](https://badge.fury.io/js/headwater)

**Dependency Injection and Mediator for TypeScript and JavaScript**

**Headwater** is a simple and fast Inversion of Control and Mediator implementation.  These implementations work together or separately.

# Example

We can combine our Dependency Injection and Mediator patterns together!

Declare a Types `enum`.

``` TypeScript
enum Types {
    Mediator = 'Mediator',
    PostDataAccess = 'PostDataAccess',
}
```

Create a `Mediator`.

``` TypeScript
const mediator = new Mediator();
```

Create a `Request`.

``` TypeScript
interface Post {
    id: string;
    subject: string;
    body: string;
}

class GetPostRequest<Post> {
    constructor(public id: string) {
        super();
    }
}
```

Add a `RequestHandler` to the `Mediator`.

> **Note** the use of `inject()` anywhere we want to use **Dependency Injection**.
>
> Assuming we have a `PostDataAccess` class defined somewhere, we can inject it here!

``` TypeScript
mediator.add({
    type: GetPostRequest,
    handler: async (
        { id },
        postDataAccess = inject(Types.PostDataAccess)
    ) => {
        const post = await postDataAccess.get(id);
        return post;
    }
});
```

Bind the values to a `Container`.

``` TypeScript
const container = new Container({
    [Types.Mediator]: {
        value: mediator
    },
    [Types.PostDataAccess]: {
        value: PostDataAccess
    }
});

Container.setDefault(container);

type Bindings = typeof container['bindings'];

declare module 'headwater' {
    interface DefaultBindings extends Bindings {}
}
```

Inject the `Mediator`, send a `Request`, and **Headwater** will do the rest!

``` TypeScript
async function main(mediator = inject(Types.Mediator)) {
    const post = await mediator.send(new GetPostRequest(1234));
    return post;
}

main();

// returns a Post
```

# Dependency Injection

For Inversion of Control, we need to bind values to a `Container`, so we can retrieve them later.  We can bind three types of values:
* Value
* Constructor
* Factory

## Create or use Default Container

We need a `Container` for binding values.  We can either create and manage this container directly, or use the **default** `Container`.

We first must import `Container`.

``` TypeScript
import { Container } from 'headwater';
```

### Create Container

``` TypeScript
const container = new Container();
```

### Use Default Container

``` TypeScript
const container = Container.getDefault();
```

We can also set the Default Container

``` TypeScript
const container = new Container();

Container.setDefault(container);
```

## TypeScript Integration

The types for the Default Container can be injected as ambient typings.

> **Note**: It is highly recommended declare ambient typings.  This will allow simpler calls to `inject()` later.

``` TypeScript
type Bindings = typeof container['bindings'];

declare module 'headwater' {
    interface DefaultBindings extends Bindings {}
}
```

## Binding Values

We can bind any value to a `Container`.  We associate each binding with a unique `Type`.  The `Type` can be any `string`, `number`, or `symbol`.

> **Note**: It is highly recommended to use TypeScript `string enum` values:

``` TypeScript
enum Types {
    UserDataAccess = 'UserDataAccess',
    PostDataAccess = 'PostDataAccess'
}
```

It is also possible to use `const string` values:

``` TypeScript
const USER_DATA_ACCESS = 'UserDataAccess';
const POST_DATA_ACCESS = 'PostDataAccess';
```

### Binding to the Container

> **Note**: It is highly recommended to bind in the constructor.  This provides typings automatically.

``` TypeScript
const container = new Container({
    [Types.UserDataAccess]: {
        value: new UserDataAccess()
    },
    [Types.PostDataAccess]: {
        value: new PostDataAccess()
    }
});
```

It is also possible to bind later via:

* `Container.prototype.bindValue()`
* `Container.prototype.bindConstructor()`
* `Container.prototype.bindFactory()`.

### Bind a Value

We can bind a singleton value to a `Type`.

This can be done in the constructor via:

``` TypeScript
enum Types {
    Value = 'Value'
}

const container = new Container({
    [Types.Value]: {
        value: 'Some singleton value'
    }
});
```

It can also be done later via:

``` TypeScript
container.bindValue(Types.Value, 'Some singleton value');
```

### Bind a Constructor

We can bind a constructor to a `Type`.  This constructor will be called later to create instances.

> **Note**: Constructor parameters should have default values.  However, these can be specified upon injection.

``` TypeScript
class ExampleClass {
    constructor(public value = 0) {
    }
}

enum Types {
    ExampleClass: 'ExampleClass'
}

const container = new Container({
    [Types.ExampleClass]: {
        type: 'constructor',
        value: ExampleClass
    }
});
```

It can also be done later via:

``` TypeScript
container.bindConstructor(Types.ExampleClass, ExampleClass);
```

### Bind a Factory

We can also bind a factory to a `Type`.  This factory will be called later.

> **Note**: Factory parameters should have default values.  However, these can be specified upon injection.

``` TypeScript
function ExampleFactory(value = 0) {
    return {
        value
    };
}

enum Types {
    ExampleFactory = 'ExampleFactory';
}

const container = new Container({
    [Types.ExampleFactory]: {
        type: 'factory',
        value: ExampleFactory
    }
});
```

It can also be done later via:

``` TypeScript
container.bindFactory(Types.ExampleFactory, factory);
```

### Type Property

The **optional** `type` property in the constructor can be specified via `string` or `BindingType`.  Possible string values are:

* `"value"`
* `"constructor"`
* `"factory"`

If unspecified, it is assumed to be a **Value Binding**.

``` TypeScript
const container = new Container({
    [Types.Value]: {
        type: BindingType.Value,
        value: 'Some singleton value'
    },
    [Types.ExampleClass]: {
        type: BindingType.Constructor,
        value: ExampleClass
    },
    [Types.ExampleFactory]: {
        type: BindingType.Factory,
        value: ExampleFactory
    }
});
```

## Retrieving Values

We can get any bound `Type` with the function `inject()`.

``` TypeScript
const value = inject(Types.Value);
const example = inject(Types.ExampleClass);
const factory = inject(Types.FactoryExample);
```

We can also get them directly from a `Container`.

``` TypeScript
const value = container.get(Types.Value);
const example = container.get(Types.ExampleClass);
const factory = container.get(Types.FactoryExample);
```

If a Constructor or Factory use parameters, we may specify them.

``` TypeScript
function ExampleFactory(value) {
    return value;
}

...

const factory = inject(Types.ExampleFactory, 1);

// result will be 1
```

## Injecting Values

We inject into a function by **default parameter** values.  For any function, we can specify default parameters.  If undefined is passed into that parameter, the default value is used instead.

> **Note**: It is highly recommended to inject via **default parameter** values.

For example:

``` TypeScript
function ExampleFactory(value = 0) {
    return value;
}

const result = ExampleFactory();

// result will equal 0
```

In this example, when we call factory with no parameters, `value` will be `0`.

So, we can use a bound Container value for the default value.

``` TypeScript
function ExampleFactory(value = inject(Types.Value)) {
    return value;
}

const result = ExampleFactory();

// result will be the value bound to Types.Value.
```

In this example, when factory is called with no parameters, we will use whatever is bound to `Types.Value`.

## Specifying Parameters

If the bound value is a constructor or factory, we can also pass parameters into the `Container.get()` method.

For exmaple:

``` TypeScript
function factory(value = container.get('constructor', 1, 2, 3)) {
    return value;
}
```

## Specifying Containers

We can also use `inject()`, which uses the default `Container`.

``` TypeScript
import { inject } from 'headwater';

function factory(value = inject('value')) {
    return value;
}
```

We can also specify a `Container` for `inject()`.

``` TypeScript
function factory(value = inject('value', container)) {
    return value;
}
```


# Mediator

For the Mediator pattern, we bind Handlers to Request types.

## Create a Mediator

``` TypeScript
import { Mediator } from 'headwater';

const mediator = new Mediator();
```

> NOTE:  For simplicity, the Mediator can be injected via IOC.

## Add Handler

### Defining Requests

We must create a new `class` that extends `Request<T>`.  We specify into the generic `<T>` the **return type** of the `Request`.

``` TypeScript
import { Request } from 'headwater';

class CreateRequest extends Request<string> {
    data: Data;

    constructor(data: Data) {
        super();
        this.data = Data;
    }
}
```

> NOTE:  The `super()` must be called.

### Binding Handlers

The Handler must return a `Promise` with the type specified in the `Request`.

``` TypeScript
mediator.addHandler(async (request: CreateRequest) => {
    // This function is async
    // The return type must match the CreateRequest
    return '';
});
```

## Send

We must now create a new `Request` object, and pass it into the `Mediator`.  It will match the `Request` with a `Handler` and return a `Promise` with the value.

``` TypeScript
const request = new CreateRequest({ ... });

const result = await mediator.send(request);
```
