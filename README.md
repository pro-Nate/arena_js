ArenaJS 
=========

ArenaJS is a front-end javascript framework for streamlining and modularising construction of simple to medium complexity websites as if they were single-page-apps.

It provides a very simple MV* structure, using a provider, compiler and router in conjunction with directives and services and basic  dependency injection, to manage a hierarchy of scopes bound to views (DOM elements).

There are *some* instructions and examples in the code comments.
You can find a few directives in `src/extras`.

To add IE8/IE7/Gecko1.8 support (only IE8 tested) use the `/polyfills.js`

Code is already compiled in the `/build` directory. 



Building Arena
---------

```bash
    npm install
```

then:

```bash
    npm run build
```
or
```bash
    npm run build-dev
```




## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2016-present Nathan Johnson 
http://www.mjktech.co.uk

