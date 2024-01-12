# ember-useful-decorators

A collection of useful decorators concerning functionality that is specific to Ember.

## Compatibility

* Ember.js v4.8 or above
* Ember CLI v4.8 or above
* Node.js v18 or above


## Installation

```
ember install ember-useful-decorators
```


## Usage

Each decorator is described below:

### Runloop functions

#### @once

Invoke the decorated function with [once](https://api.emberjs.com/ember/release/functions/@ember%2Frunloop/once)

#### @scheduleOnce(queue)

Invoke the decorated function with [scheduleOnce](https://api.emberjs.com/ember/5.5/functions/@ember%2Frunloop/scheduleOnce), against the given queue `queue`.

#### @next

Invoke the decorated function with [next](https://api.emberjs.com/ember/5.5/functions/@ember%2Frunloop/next)

#### @run

Invoke the decorated function with [run](https://api.emberjs.com/ember/5.5/functions/@ember%2Frunloop/run)

### Caching

#### @memoizeByOutput(equalityFunc?: (a: any, b: any) => boolean)

Cache output values to avoid excessive dirtying of complex return values (e.g. objects). `equalityFunc` defaults to a shallow object comparison function if not provided.

### @readOnly(path) decorator

Alias other (nested) properties using the usual syntax, but avoiding the computed logic in Ember's `@readOnly` decorator.

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
