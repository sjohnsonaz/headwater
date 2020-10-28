# Headwater

[![Node.js CI](https://github.com/sjohnsonaz/headwater/workflows/Node.js%20CI/badge.svg)](https://github.com/sjohnsonaz/headwater/actions?query=workflow%3A%22Node.js+CI%22) [![npm version](https://badge.fury.io/js/headwater.svg)](https://badge.fury.io/js/headwater)

**Dependency Injection and Mediator for TypeScript and JavaScript**

Headwater is an ultra simple and fast IOC and Mediator implementation.  

# Dependency Injection

For Inversion of Control, we need to bind values to a `Container`, so we can retrieve them later.  We can bind three types of values, pure **values**, **constructors**, and **factories**.

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

## Binding Values

We can bind any value to a `Container`.  We associate each binding with a unique `Type`.  The `Type` can be any `string`, `number`, or `symbol`.

It is highly recommended to use TypeScript `string enum` values:

``` TypeScript
enum Types {
    IndexController = 'IndexController',
    UserControler = 'UserController',
    GroupController = `GroupController`
}
```

It is also possible to use `const string` values:

``` TypeScript
const INDEX_CONTROLLER = 'IndexController';
const USER_CONTROLLER = 'UserController';
const GROUP_CONTROLLER = 'GroupController';
```

### Bind Value

We can now bind a value to a `Type`.

``` TypeScript
container.bindValue('Type', 'value');
```

### Bind Constructor

We can also bind a constructor to a `Type`.  This constructor will be called later.  Constructor parameters should either have default values, but can be specified upon injection.

``` TypeScript
class ExampleClass {
    value: number;

    constructor(value = 0) {
        this.value = value;
    }
}

container.bindConstructor('ExampleClass', ExampleClass);
```

### Bind Factory

We can also bind a factory to a `Type`.  This factory will be called later.  Factory parameters should either have default values, but can be specified upon injection.

``` TypeScript
function factory(value = 0) {
    return {
        value
    };
}

container.bindFactory('factory', factory);
```

## Injecting Values

We can inject any bound `Type` with the method `Container.get()` or the function `inject()`.

We inject into a function by **default parameter** values.  For any function, we can specify default parameters.  If undefined is passed into that parameter, the default value is used instead.

For example:

``` TypeScript
function factory(value = 0) {
    return value;
}

const result = factory();

// result will equal 0
```

In this example, when we call factory with no parameters, `value` will be `0`.

So, we can use a bound Container value for the default value.

``` TypeScript
function factory(value = container.get('value')) {
    return value;
}

const result = factory();

// result will whatever is bound to `value`.
```

In this example, when factory is called with no parameters, we will use whatever is bound to `"value"`.

If the bound value is a constructor or factory, we can also pass parameters into the `Container.get()` method.

For exmaple:

``` TypeScript
function factory(value = container.get('constructor', 1, 2, 3)) {
    return value;
}
```

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
