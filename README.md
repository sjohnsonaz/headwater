# Headwater

[![Node.js CI](https://github.com/sjohnsonaz/headwater/workflows/Node.js%20CI/badge.svg)](https://github.com/sjohnsonaz/headwater/actions?query=workflow%3A%22Node.js+CI%22) [![npm version](https://badge.fury.io/js/headwater.svg)](https://badge.fury.io/js/headwater)

Dependency Injection for TypeScript

## Define Classes and Factories

```` TypeScript
import { injectable, inject } from 'headwater';

@injectable
class Child {
    a: string;

    constructor(@inject('TextValue') a?: string) {
        this.a = a;
    }
}

@injectable
class Parent {
    b: string;
    child: Child;

    constructor(@inject('Child') child?: Child) {
        this.child = child;
    }
}

class Factory {
    @factory
    static create(@inject('Parent') parent?: Parent) {
        return parent;
    }
}
````

## Create Bindings

```` TypeScript
import Headwater from 'headwater';

// Get a context
let context = Headwater.getContext();

// Bind a static value
context.bindValue('TextValue', 'abcd');

// Bind constructors
context.bind('Child', Child);
context.bind('Parent', Parent);

// Bind a factory
context.bindValue('Factory', Factory.create);
````

## Create Instances

You can create a child directly, and the constructor will get its parameters automatically.

```` TypeScript
let child = new Child();
````

You can create a parent directly, and the child will be created automatically.

```` TypeScript
let parent = new Parent();
````

You can create a factory directly, or get it from the context.  Any instances will be created automatically.

```` TypeScript
let factory: IFactory<Parent> = context.getValue('Factory');
let parent = factory();
````