Arena_JS 
=========

ArenaJS is a front-end javascript framework for streamlining and modularising construction of simple to medium complexity websites as if they were single-page-apps.

It provides a very simple MV* structure, using a provider, compiler and router in conjunction with directives and services and basic  dependency injection, to manage a hierarchy of scopes bound to views (DOM elements).

There are *some* instructions and examples in the code comments.
You can find a few directives in `/src/extras`.

Arena depends on jQuery. Choose your jQuery version according to the browser environments you need to support.
To add IE8/IE7/Gecko1.8 support (only IE8 tested) use the `/src/polyfills.js`

Arena is already compiled in the `/dist` directory. 

The `/src/utilities/util.js` module and most of the core components can be imported individually, if the whole arena framework is not needed.



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

Copyright (c) 2019 pro-Nate

http://www.mjktech.co.uk

