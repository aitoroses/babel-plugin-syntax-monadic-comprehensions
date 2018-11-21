

# Babel Syntax Monadic For Support

This is a plugin for Babel 7 that is meant to replicate Scala's for comprehension or haskell's do syntax.

## Babel >= 7.x

```json
{
  "plugins": [
    "babel-plugin-syntax-monadic-comprehensions",
  ]
}
```


## Installation & Usage

    $ npm install --save-dev babel-plugin-syntax-monadic-comprehensions

Add the following line to your .babelrc file:

    {
        "plugins": ["babel-plugin-syntax-monadic-comprehensions"]
    }

This will transform this kind of code:

```
import Identity, { For, Yield } from './Identity'

const comp = For(() => {
    const a = Yield(Identity.pure(1))
    const b = Yield(Identity.pure(1))
    return a + b
})

// => Identity(2)
```

in this code:

```
import { flatMap, map } from "./Identity";
import Identity, { For, Yield } from './Identity';

const comp = flatMap(Identity.pure(1), a => {
    return map(Identity.pure(1), b => {
    return a + b;
    });
});

// => Identity(2)
```

Where Identity is the identity monad instance.

> *note* Assumes that the module from which `For` and `Yield` are imported also export `flatMap` and `map` operators.

## License

MIT (c) 2015
