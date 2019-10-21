/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/arena.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/arena.js":
/*!**********************!*\
  !*** ./src/arena.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/** 
 * @global ARENA
 * @description 
 * 		The ArenaJs front-end framework is a toolbox that evolved to help develop a website as 
 * 		a single-page-app.
 * 		Using the principle of progressive enhancement, unobtrusive JavaScript can be used 
 * 		to quickly augment a functional MVP and apply more advanced, non-essential features as the 
 * 		environment permits, in a non-pollutive way. 
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 * @license: Apache-2.0
 * @version: 0.5.5
 * @requires jQuery
 */

/** 
 * @fires $app#$bootstrapStart
 *		- When bootstrapping of app begins (after loading promises resolve but before DOM is $compiled).
 *		  The bootstrap events can be used to coordinate configuration of components.
 *		  During the bootstrapping process, $app.$bootstrap === false.
 * @fires $app#$bootstrapEnd
 * 		- When bootstrapping of app ends (just after DOM is $compiled).
 *		  After the bootstrap process has ended, $app.$bootstrap === true.
 *
 * @example 
		`<html>
		<head />
		<body main-view="main">
			<header />
			
			<main> 
				<!-- Your page content updated using xhr (ajax) requests: -->
				<button data-change-colour-to="blue">Change blue!</button>
				<button change-colour-to>Change black!</button>
			</main>
			
			<footer />
			
			<!--[if lt IE 9]> <script src="polyfills.js"></script> <![endif]-->
			<script src="jquery.js"></script>
			<script src="arena.js"></script>
			<script>
				var yourApp = new ARENA("yourAppName");
				yourApp.$directive("changeColourTo", function () {
					return {
						scope: true,
						data: {
							changeColourTo: 'black'	//<- default value
						},
						link: function ($element, scope, data) {
							$element.on('click', function () {
								this.style.backgroundColor = data.changeColourTo;
							});
							scope.$on("$destroy", function (e) {
								$element.off('click');
							});
						}
					};
				});
				yourApp.$on("$bootstrapEnd", function (event) {
					$('body').addClass('page-ready');
				});
			</script>
		</body>
		</html>`
 *
 */
(function ($, undefined) {
  'use strict';

  var $win = $(window),
      $doc = $(document),
      $html = $(document.documentElement),
      defaultConfig = {
    html5Mode: true,
    // Will be ignored if html5 history api missing
    autoBootstrap: true,
    // Bootstrap automatically (use $app.$bootstrap() elsewise)
    rootElementSelector: 'html',
    // Bind app to this DOM element
    defaultTransitionSpeed: 300 // Transitions will take this long by default

  };

  var Scope = __webpack_require__(/*! ./core/scope.js */ "./src/core/scope.js"),
      Provider = __webpack_require__(/*! ./core/provider.js */ "./src/core/provider.js"),
      Compiler = __webpack_require__(/*! ./core/compiler.js */ "./src/core/compiler.js"),
      Util = __webpack_require__(/*! ./utilities/Util.js */ "./src/utilities/Util.js"),
      components = {
    directive: {},
    controller: {},
    service: {}
  };

  Util.$ = $;
  Util.$browser = __webpack_require__(/*! ./utilities/browsxr.js */ "./src/utilities/browsxr.js");
  Util.$cookie = __webpack_require__(/*! ./utilities/Cookie.js */ "./src/utilities/Cookie.js");
  Util.Promise = __webpack_require__(/*! ./utilities/pLitr.js */ "./src/utilities/pLitr.js");
  Util.provisionaryPromise = __webpack_require__(/*! ./utilities/provisionaryPromise.js */ "./src/utilities/provisionaryPromise.js");
  Util.MakeEventDispatch = __webpack_require__(/*! ./utilities/makeEventDispatch.js */ "./src/utilities/makeEventDispatch.js");
  Util.ViewportMonitor = __webpack_require__(/*! ./utilities/ViewportMonitor.js */ "./src/utilities/ViewportMonitor.js");
  Util.ScrollMonitor = __webpack_require__(/*! ./utilities/ScrollMonitor.js */ "./src/utilities/ScrollMonitor.js");
  Util.BreakpointMonitor = __webpack_require__(/*! ./utilities/BreakpointMonitor.js */ "./src/utilities/BreakpointMonitor.js");
  Util.TransitionMonitor = __webpack_require__(/*! ./utilities/TransitionMonitor.js */ "./src/utilities/TransitionMonitor.js");
  Util.GestureMonitor = __webpack_require__(/*! ./utilities/GestureMonitor.js */ "./src/utilities/GestureMonitor.js");
  Util.viewUpdater = __webpack_require__(/*! ./utilities/viewUpdater.js */ "./src/utilities/viewUpdater.js");
  Util.loadImgSrc = __webpack_require__(/*! ./utilities/loadImgSrc.js */ "./src/utilities/loadImgSrc.js");
  Util.addNavigatorDataToHtml();
  Util.addJSClass();

  function Arena(_config_) {
    var a = new Util.MakeEventDispatch(this),
        rootScope = new Scope(),
        startupPromises = [];
    a.deleteObjProp(a, '$destroyDispatch');
    a.$config = a.objectAssign({}, defaultConfig, a.isString(_config_) ? {
      name: _config_
    } : _config_);
    a.$provider = new Provider(components);
    a.$compiler = new Compiler(a.$provider);

    a.$directive = function () {
      return a.$provider.directive.apply(a, arguments);
    };

    a.$controller = function () {
      return a.$provider.controller.apply(a, arguments);
    };

    a.$service = function () {
      return a.$provider.service.apply(a, arguments);
    };

    a.$provider.service('$app', function () {
      return a;
    }).alias('$app', a.$config.name);
    /* Exclusive local storage for this app */

    ["sessionStorage", "localStorage"].forEach(function (storage) {
      var storageId = a.$config.name + "_$$storage_",
          storageName = '$' + storage;
      a[storageName] = {
        setItem: function setItem(key, val) {
          window[storage].setItem(storageId + key, val);
        },
        getItem: function getItem(key) {
          return window[storage].getItem(storageId + key);
        }
      };
      a.$provider.service(storageName, function () {
        return a[storageName];
      });
    });
    /* Accept promises which must resolve for bootstrap to be completed. */

    a.$bootstrapDefer = function (p) {
      if (Array.isArray(p)) startupPromises = startupPromises.concat(p);else if (p.then) startupPromises.push(p);
    };

    a.$service('$rootScope', function () {
      return rootScope;
    }).$service('$config', function () {
      return a.$config;
    });
    /* Setup the app and compile the DOM. */

    a.$bootstrap = function () {
      var $rootElement = $(a.$config.rootElementSelector).eq(0);
      a.$bootstrap = false;
      a.$service('$rootElement', function () {
        return $rootElement;
      });
      a.$viewportMonitor = new a.ViewportMonitor();
      a.$scrollMonitor = new a.ScrollMonitor(window);
      a.$breakpointMonitor = new a.BreakpointMonitor({
        mobile: [0, 540],
        desktop: [541, 16384]
      }, $rootElement);
      a.$breakpointMonitor.$on("viewportBreakpointChanged", a.$trigger);
      a.$service('$viewportMonitor', function () {
        return a.$viewportMonitor;
      }).$service('$scrollMonitor', function () {
        return a.$scrollMonitor;
      }).$service('$breakpointMonitor', function () {
        return a.$breakpointMonitor;
      });

      function compileDOM(bootstrapResolutions) {
        a.$compiler.compile($rootElement[0], rootScope);
        return bootstrapResolutions;
      }

      a.$trigger("$bootstrapStart");
      return a.Promise.all(startupPromises).then(compileDOM).catch(compileDOM).then(function (bootstrapResolutions) {
        a.$bootstrap = true;
        a.$trigger("$bootstrapEnd");
        return bootstrapResolutions;
      });
    };

    if (a.$config.autoBootstrap) $doc.ready(a.$bootstrap);
  }

  Arena.prototype = Util;
  'directive controller service'.split(' ').forEach(function (providerName) {
    Arena['$' + providerName] = function (name, fn) {
      if (components[providerName][name]) throw new Error("Provider already exists: " + name);else components[providerName][name] = fn;
      return Arena;
    };
  });
  Util.objectKeys(Util).forEach(function (utilName) {
    Arena.$service(utilName, function () {
      return Util[utilName];
    });
  });
  Arena.$service('$html', function () {
    return $html;
  }).$service('$window', function () {
    return $win;
  }).$service('$document', function () {
    return $doc;
  }).$service("$router", __webpack_require__(/*! ./core/providers/routerService.js */ "./src/core/providers/routerService.js")).$directive("controller", __webpack_require__(/*! ./core/providers/controllerDirective.js */ "./src/core/providers/controllerDirective.js")).$directive("mainView", __webpack_require__(/*! ./core/providers/mainViewDirective.js */ "./src/core/providers/mainViewDirective.js"));
  window.ARENA = Arena;
  if ( true && module.exports) module.exports = Arena;
  if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
    return Arena;
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
})(jQuery);

/***/ }),

/***/ "./src/core/compiler.js":
/*!******************************!*\
  !*** ./src/core/compiler.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/** 
 * @class Compiler
 *
 * @description 
 *		Compile the DOM into views by finding directives and linking to scopes and controllers.
 * 
 * @example
 		`var directiveProvider = function (aDependency) {
		 	return {link: function ($scope, $element) {
				aDependency.doSomethingWith($element);
			}};
		 };
		 directiveProvider.$dependencies = ["aDependency"];
		 
		 var $provider = new Provider();
		 $provider.directive("directiveName", directiveProvider);
		 $provider.service("aDependency", function dependencyProvider() {return aDependency;});
		 
		 var $rootScope = new Scope();
		 var rootElement = document.querySelector('html');
		 
		 var $compiler = new Compiler($provider);
		 $compiler.compile(rootElement, $rootScope);`
 * 
 * @requires Provider
 * @requires Scope
 * @requires jQuery
 * @requires Promise
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */
var Compiler = function (compilerId, $, Promise, util) {
  'use strict';

  function Compiler(provider) {
    var compiler = this,
        testCache = [];
    this.provider = provider;

    this.findDirectives = function findDirectives(el, locals) {
      var result = [];
      var directiveList = provider.directive(); // Cache tests for supa speed

      if (directiveList.length !== testCache.length) {
        directiveList.slice(testCache.length).forEach(function (name) {
          testCache.push(new DirectiveTester(name));
        });
      }

      testCache.forEach(function (tester, index) {
        if (tester.test(el)) result.push(provider.directive(tester.name, null, locals));
      });
      return result;
    };

    this.compile = function compile(el, parent, linkToElement, terminal, autoCompile) {
      var parentScope = parent || getScope(el.parentNode),
          existingScope = getCompilerData(el, '$scope'),
          scope = existingScope,
          existingDirectives = getCompilerData(el, '$directives') || [],
          matchingDirectives = diff(compiler.findDirectives(el, {}), existingDirectives),
          compilingThisElement = !!matchingDirectives.length,
          directivesRequireScope = requiresScope(matchingDirectives),
          directivesRequireIsolatedScope = requiresIsolateScope(matchingDirectives),
          compileDefer = [];

      if (linkToElement) {
        if (existingScope) existingScope.$destroy();
        linkToElement = scope = parent ? parentScope : parentScope.$create(directivesRequireIsolatedScope);
      } else if (compilingThisElement && directivesRequireScope && !existingScope) {
        linkToElement = scope = parentScope.$create(directivesRequireIsolatedScope);
      }

      var wrappedEl = compilingThisElement || linkToElement ? $(el) : null,
          elementData = wrappedEl ? wrappedEl.data() : null;
      if (!scope) scope = parentScope;

      function endCompileNode() {
        if (linkToElement) {
          setCompilerData(el, '$scope', linkToElement);
          wrappedEl.on('$destroy', scope.$destroy);
          scope.$once('$destroy', function () {
            wrappedEl.off('$destroy', scope.$destroy);
            wrappedEl.removeClass('scope-linked').triggerHandler("$compile.removeScope");
            setCompilerData(el, '$scope', null);
          });
          wrappedEl.addClass('scope-linked');
        }

        if (compilingThisElement) {
          setCompilerData(el, '$directives', existingDirectives.concat(matchingDirectives));
          scope.$once('$destroy', function () {
            setCompilerData(el, '$directives', null);
          });
          wrappedEl.triggerHandler("$compile.end");
        }

        return scope;
      }

      function linkDirectiveToNode(directive) {
        var directiveData = elementData,
            directiveController;

        if (typeof directive.data === "function") {
          directiveData = util.objectAssign({}, directive.data(wrappedEl, scope), elementData);
        } else if (_typeof(directive.data) === "object") {
          directiveData = util.objectAssign({}, directive.data, elementData);
        }

        if (typeof directive.controller === "function") {
          directiveController = provider.instantiate(directive.controller, {
            $scope: scope
          });
        } else if (typeof directive.controller === "string") {
          directiveController = provider.controller(directive.controller, null, {
            $scope: scope
          });
        }

        try {
          directive.link(wrappedEl, scope, directiveData, directiveController);
        } catch (e) {
          console.error('Error compiling: ', e); // TODO: Something?	
        }
      }

      if (!scope.$deferCompile) {
        scope.$deferCompile = function (promise) {
          if (promise && promise.then === "function") compileDefer.push(promise);
        };
      }

      if (compilingThisElement) {
        wrappedEl.triggerHandler("$compile.start");
        matchingDirectives.forEach(linkDirectiveToNode);
      }

      if (!terminal) {
        Array.prototype.slice.call(el.childNodes).forEach(function compileNode(child) {
          scope.$deferCompile(compiler.compile(child, scope, null, false, true));
        }, compiler);
      }

      if (autoCompile && !compileDefer.length) endCompileNode();else return Promise.all(compileDefer).then(endCompileNode);
    };
  }

  function DirectiveTester(name) {
    this.name = name; // Should not have spaces here

    this.nameSanitized = this.name.replace(/[^0-9a-zA-Z-_]/g, '');
    this.nameDashed = this.nameSanitized.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    var tests = [];

    if (this.name.indexOf('.') === 0) {
      // Matches Class
      var classRegEx = new RegExp(' ' + this.name.slice(1) + ' ');
      tests.push(function checkClass(el) {
        return (' ' + el.className + ' ').indexOf(' ' + this.nameSanitized + ' ') > -1;
      });
    } else if (this.name.indexOf('#') === 0) {
      // Matches Id
      var idTest = this.name.slice(1);
      tests.push(function checkId(el) {
        return el.getAttribute('id') === idTest;
      });
    } else {
      tests.push(function checkAttribute(el) {
        return el.nodeName.toLowerCase() === this.nameDashed // Matches Tag
        || el.hasAttribute(this.nameSanitized) // Matches attribute
        || el.hasAttribute(this.nameDashed) || el.hasAttribute('data-' + this.nameDashed); // Matches data attribute
      });
    }

    this.test = function runAllTests(el) {
      if (el.tagName) {
        // node.nodeType === 1 || node.nodeType === 11
        for (var i = 0; i < tests.length; i++) {
          if (tests[i].call(this, el)) return true;
        }
      }

      return false;
    };
  }

  function diff(A, B) {
    return A.filter(function (x) {
      return B.indexOf(x) < 0;
    });
  }

  function requiresScope(directives) {
    return directives.filter(function (directive) {
      return directive.scope;
    }).length;
  }

  function requiresIsolateScope(directives) {
    return directives.filter(function (directive) {
      return _typeof(directive.scope) === "object";
    }).length;
  }

  function getCompilerData(el, prop) {
    return el[compilerId] ? el[compilerId][prop] : null;
  }

  function setCompilerData(el, prop, val) {
    if (!el[compilerId]) el[compilerId] = {};
    el[compilerId][prop] = val;
  }

  function getScope(element) {
    return getCompilerData(element, '$scope') || getScope(element.parentNode);
  }

  return Compiler;
}('$$compiler' + Math.random() * 10921, jQuery || Zepto, __webpack_require__(/*! ../utilities/pLitr.js */ "./src/utilities/pLitr.js"), __webpack_require__(/*! ../utilities/Util.js */ "./src/utilities/Util.js"));

if ( true && module.exports) module.exports = Compiler;
if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  return Compiler;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/core/provider.js":
/*!******************************!*\
  !*** ./src/core/provider.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/** 
 * @class Provider
 *
 * @description 
 *		Register and provide components.
 *		Components can be `directive`, `controller` or `service`.
 *		A component must be registered using the function of corresponding name.
 *		Once registered a component can be accessed using the function of corresponding name.
 *		All components must be registered as a provider function, which returns component.
 *		Registered components can be aliased. The alias method accepts an `extend` function which 
 *		modify the aliased component.
 *
 *		Array of dependencies should be added to provider function as static property named `$dependencies`, 
 *		to avoid problems when minified.
 *		
 *		When providing a service or controller, the provider will instantiate provider. 
 *		This instance will cached if a `$cache` property is present on the provider.
 *		
 *		Directive providers must return a function or object which contains a `link` property 
 *		which is a function.
 *		Directives are invoked normally, but the result is cached by default unless `$cache === false`.
 * 
 * @example 
 		`var directiveProvider = function (aDependency) {
		 	return {
				scope: true,
				controller: "aController",
				link: function ($scope, $element) {
					aDependency.doSomethingWith($element);
				}
			};
		 };
		 directiveProvider.$dependencies = ["aDependency"];
		 
		 var $provider = new Provider();
		 $provider.directive("directiveName", directiveProvider);
		 $provider.controller("aController", function conrollerProvider() {this.x = function y(){};});
		 $provider.service("aDependency", function dependencyProvider() {return dependency;});
		 
		 $provider.alias("directiveName", ".someSelector");
		 $provider.alias('mainView', 'otherView', function (directive) {
				var data = directive.data;
				directive.data = function ($element) {
					return Object.assign({}, data, {mainView: $element.data('other-view')});
				};
				return directive;
			});
		 
		 var directive = $provider.directive("differentDirectiveName");`
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */
var Provider = function (undefined) {
  'use strict';

  var DIRECTIVE_SUFFIX = ' _DIRECTIVE_',
      CONTROLLER_SUFFIX = ' _CONTROLLER_';

  function extractParamNames(fn) {
    var params = fn.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '').match(/\((.*?)\)/);
    if (params && params[1]) return params[1].split(',').map(function (p) {
      return p.trim();
    });else return [];
  }

  function construct(constructor, args) {
    function C() {
      return constructor.apply(this, args);
    }

    C.prototype = constructor.prototype;
    return new C();
  }

  function Provider(_components_) {
    var provider = this,
        providers = {},
        cache = {
      $$directiveSelectors: []
    };
    /* Dependency names must be attched to class using static $dependencies array: 
    	`function myService(){}; myService.$dependencies = ["aDependencyName"];` */

    function getDependencies(f, locals) {
      locals = locals || {};
      return (Array.isArray(f.$dependencies) ? f.$dependencies : extractParamNames(f)).map(function (s) {
        return locals[s] || provider.service(s, null, locals);
      });
    }
    /* Do not allow providers to be replaced */


    function checkSecurity(name) {
      if (providers[name]) throw new Error("Provider already exists: " + name);
      return name;
    }

    this.directive = function (name, fn, locals) {
      /* Return directive list if no args */
      if (!arguments.length) return cache.$$directiveSelectors;
      var directiveName = name + DIRECTIVE_SUFFIX;
      /* Provide directive when fn omitted */

      if (name && !fn) {
        var providr = providers[directiveName],
            cached = cache[directiveName];
        if (typeof cached !== 'undefined') return cached;
        if (!providr) return;
        cached = provider.invoke(providr, locals);
        if (typeof cached === "function") cached = {
          link: cached
        };
        return cache[directiveName] = cached;
      }

      checkSecurity(directiveName);
      /* Register directive */

      providers[directiveName] = fn;
      cache.$$directiveSelectors.push(name);
      return this;
    };

    this.controller = function (name, fn, locals) {
      var controllerName = name + CONTROLLER_SUFFIX;
      /* Provide controller when fn omitted */

      if (name && !fn) {
        var providr = providers[controllerName];
        if (providr) return provider.instantiate(providr, locals);else return;
      }

      checkSecurity(controllerName);
      /* Register controller */

      providers[controllerName] = fn;
      return this;
    };

    this.service = function (name, fn, locals) {
      if (name && !fn) {
        /* Provide service when fn omitted */
        var providr = providers[name],
            cached = cache[name];

        if (typeof cached !== 'undefined') {
          return cached;
        } else if (typeof providr === 'function') {
          var service = provider.instantiate(providr, locals);
          if (providr.$cache !== false) cache[name] = service;
          return service;
        } else {
          return;
        }
      } else if (checkSecurity(name)) {
        /* Register service */
        providers[name] = fn;
      }

      return this;
    };

    this.invoke = function (fn, locals) {
      return fn.apply(null, getDependencies(fn, locals));
    };

    this.instantiate = function (fn, locals) {
      return construct(fn, getDependencies(fn, locals));
    };

    this.alias = function (name, alias, extendFn) {
      var hasAlias;

      function aliasType(_type_) {
        var originalDirective = provider[_type_](name);

        if (originalDirective === undefined) return;
        hasAlias = provider[_type_](alias, function () {
          if (typeof extendFn === "function") return extendFn(Object.create(originalDirective));else return originalDirective;
        });
      }

      ["service", "directive", "controller"].forEach(aliasType);
      if (!hasAlias) throw new Error(name + " has not been provided.");
      return provider;
    };

    if (_components_) 'directive controller service'.split(' ').forEach(function (providerName) {
      for (var componentName in _components_[providerName]) {
        provider[providerName](componentName, _components_[providerName][componentName]);
      }
    });
  }

  return Provider;
}();

if ( true && module.exports) module.exports = Provider;
if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  return Provider;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/core/providers/controllerDirective.js":
/*!***************************************************!*\
  !*** ./src/core/providers/controllerDirective.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/** 
 * @class controller
 * @constructs directive
 * @description Create scope and instantiate a controller. Optionally attach to scope.
 *  
 * @param {String} controller name of controller (Controller must be provided to app);
 * @param {String} controllerAs name of variable to add to scope as controller;
 *
 * @example 
		`<body>
				<header data-controller="headerController" controller-as="cx">
					<button on-interaction="click" execute-on-scope="cx.clickFn" />
				</header>
				<div>
					// ...
				</div>
				<footer />
		 </body>`
 *
 * @requires $app<ARENA>
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */
function controllerDirective($app) {
  return {
    scope: true,
    data: {
      controller: undefined,
      controllerAs: undefined
    },
    link: function link($element, $scope, data) {
      var contoller;

      if ($app.isFunction(data.controller)) {
        contoller = $app.$provider.instantiate(data.controller, {
          $scope: $scope
        });
      } else if ($app.isString(data.controller)) {
        contoller = $app.$provider.controller(data.controller, null, {
          $scope: $scope
        });
      }

      if (contoller && $app.isString(data.controllerAs)) $scope[data.controllerAs] = contoller;
    }
  };
}

controllerDirective.$dependencies = ["$app"];
if ( true && module.exports) module.exports = controllerDirective;

/***/ }),

/***/ "./src/core/providers/mainViewDirective.js":
/*!*************************************************!*\
  !*** ./src/core/providers/mainViewDirective.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/** 
 * @class MainView
 * @constructs directive
 * @description Use ajax to update part of your page. 
 *    When Links are clicked within the linked element, a new route is requested with 
 * 		the target being main-view target.
 *    When route has been resolved, main-view target is replaced.
 *		The mainView target should have a scope so it can be safely $destroyed without 
 * 		leaving behind orphaned scopes; if it does not, one will be created.
 *    and compiled with that of the page at new route. 
 *		The page must contain an element matching the main-view target selector.
 *    The http GET response must contain an element matching the main-view target selector.
 *
 * @param {String} mainView Target element selector. Default: "body";
 * @param {Boolean} changeAppRoute Allow $app to change route when updating target content. Default: true;
 * @param {Boolean | Function} scrollTo Scroll to target on update. Default: true;
 * @param {String} linkSelector Only matching links will trigger update. Default: 'a,[ajax-href]';
 * @param {String} linkFilter Matching links will not trigger update. Default: '.ajax-ignore';
 * @param {String} loadingClass Class added to linked element during update. Default: 'view-loading';
 * @param {String} targetLoadingClass Class added to target (and replacement) during update. Default: 'ajax-loading';
 *
 * @fires $scope#$viewLoading - {request: {requesteObject}}
 *						- $broadcasted when new route requested with this target
 * @fires $scope#$viewLoaded - {request: {requesteObject}, response: {responseObject}}
 *						- $broadcasted when new route resolved with this target
 * @fires $scope#$viewExit - {$target: {Element}[, $replacement: {Element}]} 
 *						- $broadcasted when view about to be replaced
 * @fires $scope#$viewEnter - {$target: {Element}}
 *						- $broadcasted when view has been replaced
 * 
 * @example 
		`<body main-view="#target">	//Links in here will update #target
				<header>
					<nav />
				</header>

				<main id="target" controller="view-controller">
					// This content updated via xhr
					<section other-view="[other-view]">
						// This content also updated via xhr but controlled separately
					</section>
				</main>

				<footer />
		 
				<script>
					var APP = new ARENA('YOUR APP');
					APP.$provider.alias('mainView', 'otherView', function (directive) {
						var data = directive.data;
						directive.data = function ($element) {
							return Object.assign({}, data, {mainView: $element.data('other-view')});
						};
						return directive;
					});
				</script>
		 </body>`
 *
 * @requires $<jQuery>
 * @requires $app
 * @requires $router
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */
function mainViewDirective($, $app, $router, $window, $rootElement) {
  var ROOT_VIEW,
      ACTIVE_VIEWS = {};
  return {
    scope: true,
    data: {
      mainView: 'body',
      scrollTo: true,
      cssTransitions: false,
      changeAppRoute: true,
      linkSelector: 'a,[ajax-href]',
      linkFilter: '.ajax-ignore',
      requestMethod: 'GET',
      requestHeaders: undefined,
      loadingClass: 'view-loading',
      targetLoadingClass: 'ajax-loading',
      errorPage: '/404',
      onServerError: function onServerError(e, request) {
        if (window.confirm("There has been a server error, do you want to reload the page?")) window.location.replace(request.url);
      }
    },
    link: function link($element, $scope, data) {
      var updateTarget,
          $target = $rootElement.find(data.mainView);
      if (!$target.length) return;else if (!$target.data("controller")) $target.attr("controller", 'mainViewTarget');

      if ($app.$browser.historyAPI && $app.$config.html5Mode && data.changeAppRoute) {
        updateTarget = $app.viewUpdater($app, $scope, $element, $target);
        setInitialState();
        $element.on("$compile.end", function () {
          $window.on('popstate', handleStateChange);
          $element.on('click', data.linkSelector, handleClicks);
          $scope.$on("$destroy", function () {
            if (ACTIVE_VIEWS[data.mainView]) ACTIVE_VIEWS[data.mainView] = undefined;
            if (ROOT_VIEW === data.mainView) ROOT_VIEW = undefined;
            $window.off('popstate', handleStateChange);
            $element.off('click', data.linkSelector, handleClicks);
          });
        });
      }

      function setInitialState() {
        ACTIVE_VIEWS[data.mainView] = {
          triggerElement: $element
        };
        if (ROOT_VIEW && window.history.state && window.history.state.$$ARENA) return;
        window.history.replaceState(buildStateObject({}, document.title), document.title, window.location.href);
        ROOT_VIEW = data.mainView;
      }

      function buildStateObject(options, title) {
        var state = {
          $$ARENA: $app.$config.name,
          title: title
        };
        state.targetElement = options.targetElement || data.mainView;
        state.method = options.requestMethod || data.requestMethod;
        state.data = options.requestData || data.requestData;
        state.headers = options.requestHeaders || data.requestHeaders;
        return state;
      }

      function handleClicks(event) {
        var $this,
            clickData,
            request = {
          changeAppRoute: data.changeAppRoute
        };
        if (event.which == 2 || event.metaKey || ($this = $(this)).is(data.linkFilter)) return true;
        clickData = $this.data();
        request.url = $this.attr('href') || clickData.ajaxHref;
        if (request.url.indexOf("#") === 0) return true;
        if (request.url == window.location.pathname) return false;
        if (!$router.isValidRoute(request.url)) return true;
        if ($app.isDefined(clickData.changeAppRoute)) request.changeAppRoute = clickData.changeAppRoute;
        if ($app.isFunction(clickData.ajaxRequestCallback)) request.callback = clickData.ajaxRequestCallback;
        request.state = buildStateObject(clickData, request.title);
        if (request.changeAppRoute && !($app.$browser.historyAPI && $app.$config.html5Mode)) return true;
        event.preventDefault();
        if (ROOT_VIEW !== data.mainView) event.stopPropagation(); //Only handle clicks once

        updateTarget(request, data);
      }

      function handleStateChange(event) {
        if (!event.originalEvent.state) return;
        var targetView = event.originalEvent.state.targetElement; //Root view must handle odd cases

        if (ROOT_VIEW === data.mainView && (!targetView || !ACTIVE_VIEWS[targetView] || !$(targetView).length)) targetView = event.originalEvent.state.targetElement = ROOT_VIEW;

        if (targetView === data.mainView) {
          updateTarget({
            state: event.originalEvent.state,
            title: event.originalEvent.state.title,
            url: window.location.pathname + window.location.search
          }, data);
        }
      }
    }
  };
}

mainViewDirective.$dependencies = ["$", "$app", "$router", "$window", "$rootElement"];
if ( true && module.exports) module.exports = mainViewDirective;

/***/ }),

/***/ "./src/core/providers/routerService.js":
/*!*********************************************!*\
  !*** ./src/core/providers/routerService.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/** 
 * @class RouterService
 * @description Using window.location and window.history,
 * 	serves as router and a URL/Location/History api. 
 *
 * @fires $app#$routeChange 
 * 				- {request: {requesteObject}}
 *				- when new route changed
 * @fires $app#$routeChange.start 
 * 				- {request: {requesteObject}, response: {responseObject}}
 *				- when route is about to be changed by http request
 * @fires $app#$routeChange.end 
 * 				- {request: {requesteObject}[, response: {responseObject} | error: {errorObject}]} 
 *				- when route has been changed by a http request
 * 
 * @example
		`$router.blacklist('/a/path');				// "/a/path" will be ignored
		 $('a').on('click', function (e) {
		 		var path = this.href;
				if ($router.isValidRoute(path)) {	// False if path starts with "/a/path"
					var request = {
						 url: path,
						 state: {
							 targetElement: '[main-view]';
							 method: "GET";
							 data: {g: 'thang'}
						 }
					 };
					e.preventDefault();
					$router.navigate({url: path});
					$router.get(request)
					 .then(function (response) {
						 $(request.state.targetElement).replaceWith(response.data.targetHtml);
					 });
				}
		 });`
 *
 * @requires $<jQuery>
 * @requires $app<ARENA>
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */
function routerProvider($, $app) {
  function RouterService() {
    var router = this,
        _blacklist_ = [];
    router.base = "/";

    router.isInternalRoute = function (path) {
      return path.substring(0, router.base.length) === router.base || path.indexOf(':') === -1;
    };

    router.isValidRoute = function (path) {
      if (!router.isInternalRoute(path)) return false;

      for (var l = _blacklist_.length, i = path === router.base ? l + 1 : 0; i < l; i++) {
        if (path.indexOf(_blacklist_[i]) === 0) return false;
      }

      return true;
    };

    router.blacklist = function (paths) {
      if (Array.isArray(paths)) _blacklist_ = _blacklist_.concat(paths);else _blacklist_.push(paths);
    };
  }

  RouterService.prototype.evalHtmlResponse = function (html, targetSelector, skipSanitization) {
    var data = {
      html: html
    };
    if (!skipSanitization) data.sanitizedHtml = getDocumentHtml(html, true);
    var $html = $('<div>' + (data.sanitizedHtml || html) + '</div>');
    data.metaData = getDocumentMeta($html);
    data.targetHtml = $html.find(targetSelector).get(0);
    data.scripts = getDocumentScript(html);
    $html = null;
    return data;
  };

  RouterService.prototype.navigate = function (request) {
    $app.$trigger({
      type: '$routeChange',
      request: request
    });
    if (!$app.$browser.historyAPI || !$app.$config.html5Mode) return window.location.href = request.url;
    window.history.pushState(request.state, request.title, request.url);
    request.title && $app.updatePageTitle(request.title);
  };

  RouterService.prototype.ajax = function (request) {
    return new $app.Promise(function (resolve, reject) {
      $.ajax({
        url: request.url,
        data: request.data,
        type: request.method,
        headers: request.headers,
        success: function success(data, textStatus, jqXHR) {
          resolve({
            data: data,
            request: request,
            textStatus: textStatus,
            jqXHR: jqXHR
          });
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          reject(jqXHR);
        }
      });
    });
  };

  RouterService.prototype.http = function (request) {
    var router = this;

    if (request.changeAppRoute) {
      $app.$trigger({
        type: '$routeChange.start',
        request: request
      });
      router.navigate(request);
    }

    function onSuccess(response) {
      if (request.state.targetElement) {
        var dataEval = router.evalHtmlResponse(response.data, request.state.targetElement);

        if (!dataEval.targetHtml) {
          var e = new Error('The target html "' + request.state.targetElement + '" was not found.');
          e.status = 500;
          throw e;
        }

        response.data = dataEval;
        if (!request.title && dataEval.metaData && dataEval.metaData.title) $app.updatePageTitle(dataEval.metaData.title);
      }

      if (request.changeAppRoute) $app.$trigger({
        type: '$routeChange.end',
        request: request,
        response: response
      });
      return response;
    }

    function onError(error) {
      if (request.changeAppRoute) $app.$trigger({
        type: '$routeChange.end',
        request: request,
        error: error
      });
      return $app.Promise.reject(error);
    }

    return router.ajax(request).then(onSuccess).catch(onError);
    ;
  };

  return new RouterService();
}

routerProvider.$dependencies = ["$", "$app"];

function getDocumentScript(_html_) {
  return _html_.match(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi);
}

function getDocumentMeta($html) {
  return {
    title: decodeURI($html.find('.document-title:first').text() || "")
  }; // TODO: get more meta...
}

function getDocumentHtml(html, sanitize) {
  var result = String(html);
  if (!result.length) return;

  if (sanitize) {
    if (-1 === result.indexOf('<html')) {
      result = '<html><head></head><body>' + result + '</body></html>';
    }

    result = result.replace(/<\!DOCTYPE[^>]*>/i, '').replace(/<(html|head|body|title|meta|link)([\s\>])/gi, '<div class="document-$1"$2').replace(/<\/(html|head|body|title|meta|link)\>/gi, '</div>').replace(/<script/gi, ' <!-- <script').replace(/\/script>/gi, '/script> --> ');
  }

  return result.trim();
}

if ( true && module.exports) module.exports = routerProvider;

/***/ }),

/***/ "./src/core/scope.js":
/*!***************************!*\
  !*** ./src/core/scope.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/** 
 * @class Scope
 *
 * @description 
 *		Create an application model/context for views and controllers.
 *		All scopes are eventDispatches.
 *		Scopes can be nested, with parents available as $scope.$parent, and array of child scopes 
 *		as $scope.$children.
 * 
 * @example
 		`var $rootScope = new Scope();`
 *
 * @method $create Create a new scope
 *		`var $rootScope = new Scope();				// Has no parent. Cannot be $destroy(ed)
 *		 var $childScope = $rootScope.$create();`	// Child of rootscope. Can be destroyed
 *
 * @method $emit Trigger an event on a scope and all it's decendants
 *		`$childScope.$on('someEvent'); 
 *		 $rootScope.$emit(event);`					// $child will dispatch someEvent
 * 
 * @method $broadcast Trigger an event on a scope and all it's ancestors
 *		`$rootScope.$on('someEvent'); 
 *		 $childScope.$broadcast(event);`			// $rootScope will dispatch someEvent
 *
 * @method $destroy Destroy a scope
 *  `$childScope.$destroy();
 *   $childScope.$trigger('someEvent');`			// Does nothing because scope is destroyed
 *
 * @fires $scope#$destroy
 *		- when $destroy function is called.
 *
 * @requires makeEventDispatch
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */
var Scope = function (makeEventDispatch) {
  'use strict';

  function Scope(parent, callback) {
    var scope = makeEventDispatch(this),
        id = (parent && parent.$children ? parent.$children.length : 0).toString();
    this.$id = parent && parent.$id ? parent.$id + "." + id : id;

    if (parent) {
      this.$parent = parent;
      parent.$children.push(scope);
    }

    this.$children = [];

    function createScope(isolate, callback) {
      var newScope;

      if (isolate) {
        newScope = new Scope(scope, callback);
      } else {
        var S = function S() {
          return Scope.call(this, scope, callback);
        };

        S.prototype = scope;
        newScope = new S();
      }

      if (!newScope.$root) newScope.$root = scope.$root || scope;
      return newScope;
    }

    function destroyScope() {
      if (!scope.$parent) return; // $rootScope is always indestructible
      else scope.$trigger("$destroy");

      for (var c = scope.$children.length; c; c--) {
        scope.$children[c - 1].$destroy();
      }

      var siblings = scope.$parent.$children;
      siblings.splice(siblings.indexOf(scope), 1);
      scope.$destroyDispatch(); // End all event listeners

      scope.$parent = scope.$root = scope.$$watchers = null;
      scope.$destroyed = true;
    }

    function emitEvent(e) {
      if (!e.stopPropagation) try {
        e.stopPropagation = function () {
          e.__propagationStopped__ = true;
        };
      } catch (e) {}
      scope.$trigger(e);
      scope.$children.forEach(function (childScope) {
        if (!e.__propagationStopped__) childScope.$emit(e);
      });
      return scope;
    }

    function broadcastEvent(e) {
      if (!e.stopPropagation) try {
        e.stopPropagation = function () {
          e.__propagationStopped__ = true;
        };
      } catch (e) {}
      scope.$trigger(e);
      if (scope.$parent && !e.__propagationStopped__) scope.$parent.$broadcast(e);
      return scope;
    }

    this.$create = createScope;
    this.$destroy = destroyScope;
    this.$emit = emitEvent;
    this.$broadcast = broadcastEvent;
    if (typeof callback === "function") callback(this);
  } //TODO: dirty checking - $digest option???


  return Scope;
}(__webpack_require__(/*! ../utilities/makeEventDispatch.js */ "./src/utilities/makeEventDispatch.js"));

if ( true && module.exports) module.exports = Scope;
if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  return Scope;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/utilities/BreakpointMonitor.js":
/*!********************************************!*\
  !*** ./src/utilities/BreakpointMonitor.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/** @class BreakpointMonitor
 *
 * @param {Array} breakpoints object literals {name: screenWidth}
 * @param {Element} DOM element to keep annotated with breakpoint classes
 *
 * @fires breakpointMonitor#viewportBreakpointChanged - Event contains: newBreakpoint {String}, oldBreakpoint {String}
 *
 * @example
 		`breakpointMonitor = new BreakpointManger({mobile: 400, desktop: 1200}, <element>);`
 *
 * @returns a function which tracks and reports on the status of the viewport
 *
 * @method breakpointMonitor.breakpoint(operator<String>, breakpoint<String>);
 		`var isDesktop = breakpointMonitor.breakpoint('>', 'mobile');`
 *
 * @requires $
 * @requires makeEventDispatch
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */
var BreakpointMonitor = function ($, makeEventDispatch) {
  var $window = $(window);

  function testThreshold(breakpoints, operator, breakpointName) {
    var w = window.innerWidth || window.clientWidth,
        t = typeof breakpointName == "string" ? breakpointName : false;
    if (!(t && breakpoints[t])) return false;else t = breakpoints[t];
    if (operator === ">") return w > t[1];
    if (operator === "<") return w < t[0];
    if (operator === ">=") return w >= t[0];
    if (operator === "<=") return w <= t[1];else return w >= t[0] && w <= t[1];
  }

  function annotateElement($element, breakpoint, breakpoints, lastBreakpointClassString) {
    var classes = "";
    $element.removeClass(lastBreakpointClassString);
    $element.addClass("viewport-" + breakpoint);

    for (var t in breakpoints) {
      classes += " viewport-" + t;
    }

    return classes;
  }

  function BreakpointMonitor(breakpoints, element) {
    var m = makeEventDispatch(this),
        lastBreakpointClassString = "";

    function resizeHandler() {
      var classString = "",
          oldBreakpoint = m.currentBreakpoint,
          newBreakpoint;

      for (var t in m.breakpoints) {
        if (testThreshold(m.breakpoints, '=', t)) newBreakpoint = t;
      }

      if (newBreakpoint && newBreakpoint !== oldBreakpoint) {
        m.currentBreakpoint = newBreakpoint;
        if (m.$element) lastBreakpointClassString = annotateElement(m.$element, newBreakpoint, m.breakpoints, lastBreakpointClassString);
        m.$trigger({
          type: "viewportBreakpointChanged",
          newBreakpoint: newBreakpoint,
          oldBreakpoint: oldBreakpoint
        });
      }
    }

    this.breakpoints = breakpoints;
    if (element) this.$element = element.addClass ? element : $(element);
    /** @method breakpointMonitor.breakpoint(operator<String>, breakpoint<String>);
     * 	@description Check if the current viewport size is equal to or less/more than one of configured breakpoints 
     * 	@param operator {string} "more/less than" or "equals"
     * 	@param breakpoint {string} name of target breakpoint
     * 	@returns boolean, or name of current breakpoint with no arguments
     */

    this.breakpoint = function (operator, breakpointName) {
      if (!operator && breakpointName) return breakpointName === breakpointName;
      return breakpointName ? testThreshold(m.breakpoints, operator, breakpointName) : m.currentBreakpoint;
    };

    this.refresh = resizeHandler;

    this.destroy = function () {
      $window.off('resize', resizeHandler);
      m.$destroyDispatch();
    };

    $window.on('resize', resizeHandler);
    this.refresh();
  }

  return BreakpointMonitor;
}(jQuery || Zepto, __webpack_require__(/*! ./makeEventDispatch.js */ "./src/utilities/makeEventDispatch.js"));

if ( true && module.exports) module.exports = BreakpointMonitor;
if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  return BreakpointMonitor;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/utilities/Cookie.js":
/*!*********************************!*\
  !*** ./src/utilities/Cookie.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/** @class $cookie: 
 *
 * @example
 	  `$cookie
			.set(<string (name)>, <string (value)>[, <number (days)>, <string (path)>, <string (domain)>, <boolean (secure)>]);`
 * @example
 		`$cookie
			.get(<string (name)>);`
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */
var $cookie = function () {
  function set(cookieName, cookieValue, lifeInDays, path, domain, secure) {
    var expiryDate,
        today = new Date();
    today.setTime(today.getTime());
    if (lifeInDays) lifeInDays = lifeInDays * 1000 * 60 * 60 * 24;
    expiryDate = new Date(today.getTime() + (lifeInDays || 0));
    document.cookie = cookieName + "=" + escape(cookieValue) + (lifeInDays ? ";expires=" + expiryDate.toGMTString() : "") + ";path=" + (path || "/") + (domain ? ";domain=" + domain : "") + (secure ? ";secure" : "");
  }

  function get(cookieName) {
    if (document.cookie.length > 0) {
      var cookieArray = document.cookie.split(";"),
          i,
          l,
          u,
          a;

      for (i = 0, l = cookieArray.length; i < l; i++) {
        u = cookieArray[i].substr(0, cookieArray[i].indexOf("="));
        a = cookieArray[i].substr(cookieArray[i].indexOf("=") + 1);
        u = u.replace(/^\s+|\s+$/g, "");
        if (u == cookieName) return decodeURI(a);
      }
    }
  }

  return {
    set: set,
    get: get
  };
}();

if ( true && module.exports) module.exports = $cookie;
if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  return $cookie;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/utilities/GestureMonitor.js":
/*!*****************************************!*\
  !*** ./src/utilities/GestureMonitor.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/** @class GestureMonitor
 * @description analyses touch events and dispatches swipe events.
 *
 * @param {Element} DOM element to monitor for gestures
 * @param {Object} options object defaults: {
						swipeThreshold: 100,				// Distance moved before a swipe event can be triggered
						tapThreshold: 150,       		// range of time where a tap event could be detected
						dbltapThreshold: 200,    		// delay needed to detect a double tap
						tapPrecision: 60 / 2,    		// touch events boundaries ( 60px by default )
						justTouchEvents: false			// Disable emulating swipe for mouse
					}
 *
 * @fires gestureMonitor#swipeUp - Event contains swipe data: {
 																				originalEvent: {Object} touchend event
																			}
 * @fires gestureMonitor#swipeDown - Event contains swipe data
 * @fires gestureMonitor#swipeLeft - Event contains swipe data
 * @fires gestureMonitor#swipeRight - Event contains swipe data
 *
 * @example
 		`var monitor = new GestureMonitor(<element>, {justTouchEvents: true});
		 monitor.$on("swipeLeft", function doSwipeLeftThing() {...});`
 *
 * @method gestureMonitor.destroy remove the monitor
 *
 * @requires $
 * @requires makeEventDispatch
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */
var GestureMonitor = function ($, makeEventDispatch, util) {
  var msPointerEnabled = !!navigator.msPointerEnabled,
      pointerEnabled = !!(msPointerEnabled || navigator.pointerEnabled),
      msEventType = function msEventType(type) {
    return msPointerEnabled ? 'MS' + type : type.toLowerCase();
  },
      HASTOUCH = pointerEnabled || !!('ontouchstart' in window) && navigator.userAgent.indexOf('PhantomJS') < 0,
      TOUCHEVENTS = {
    touchstart: msEventType('PointerDown') + ' touchstart',
    touchend: msEventType('PointerUp') + ' touchend',
    touchmove: msEventType('PointerMove') + ' touchmove'
  },
      OPTIONS = {
    swipeThreshold: 100,
    // Distance moved before a swipe event can be triggered
    tapThreshold: 150,
    // range of time where a tap event could be detected
    dbltapThreshold: 200,
    // delay needed to detect a double tap
    tapPrecision: 60 / 2,
    // touch events boundaries ( 60px by default )
    justTouchEvents: false // Disable emulating swipe for mouse

  };

  function getPointerEvent(event) {
    return event.targetTouches ? event.targetTouches[0] : event;
  }

  function newTimestamp() {
    return new Date().getTime();
  }

  function setListener(elm, events, callback) {
    var eventsArray = events.split(' '),
        i = eventsArray.length;

    while (i--) {
      elm.addEventListener(eventsArray[i], callback, false);
    }
  }

  function SwipeMonitor(element, opt) {
    var m = makeEventDispatch(this),
        options = util.objectAssign({}, OPTIONS, opt || {}),
        tapNum = 0,
        currX,
        currY,
        cachedX,
        cachedY,
        tapTimer,
        timestamp,
        target;
    if (!document.addEventListener) return this;
    m.element = $(element);
    element = m.element[0];

    function sendEvent(elm, eventName, originalEvent, data) {
      data = data || {};
      data.x = currX;
      data.y = currY;
      data.distance = data.distance;
      $(elm).trigger(eventName, data);
      m.$trigger(eventName, data);
    }

    function onTouchStart(e) {
      var pointer = getPointerEvent(e);
      cachedX = currX = pointer.pageX;
      cachedY = currY = pointer.pageY;
      timestamp = newTimestamp();
      tapNum++;
    }

    function onTouchEnd(e) {
      var eventsArr = [],
          deltaY = cachedY - currY,
          deltaX = cachedX - currX;
      clearTimeout(tapTimer); // clear the previous timer in case it was set

      if (deltaX <= -options.swipeThreshold) eventsArr.push('swipeRight');
      if (deltaX >= options.swipeThreshold) eventsArr.push('swipeLeft');
      if (deltaY <= -options.swipeThreshold) eventsArr.push('swipeDown');
      if (deltaY >= options.swipeThreshold) eventsArr.push('swipeUp');

      if (eventsArr.length) {
        for (var i = 0, eventName; i < eventsArr.length; i++) {
          eventName = eventsArr[i];
          sendEvent(e.target, eventName, e, {
            distance: {
              x: Math.abs(deltaX),
              y: Math.abs(deltaY)
            }
          });
        }
      } else {
        if (timestamp + options.tapThreshold - newTimestamp() >= 0 && cachedX >= currX - options.tapPrecision && cachedX <= currX + options.tapPrecision && cachedY >= currY - options.tapPrecision && cachedY <= currY + options.tapPrecision) {
          // Here you get the Tap event
          sendEvent(e.target, tapNum === 2 && target === e.target ? 'dbltap' : 'tap', e);
          target = e.target;
        } // reset the tap counter


        tapTimer = setTimeout(function () {
          tapNum = 0;
        }, options.dbltapThreshold);
      }
    }

    function onTouchMove(e) {
      var pointer = getPointerEvent(e);
      currX = pointer.pageX;
      currY = pointer.pageY;
    }

    setListener(element, TOUCHEVENTS.touchstart + (options.justTouchEvents ? '' : ' mousedown'), onTouchStart);
    setListener(element, TOUCHEVENTS.touchend + (options.justTouchEvents ? '' : ' mouseup'), onTouchEnd);
    setListener(element, TOUCHEVENTS.touchmove + (options.justTouchEvents ? '' : ' mousemove'), onTouchMove);
  } //  $.fn['gestureMonitor'] = function(opt){
  //    return this.each(function(index, element){
  //      $.data( this, 'gestureMonitor', new SwipeMonitor(element, opt) );
  //    });
  //  };


  return SwipeMonitor;
}(jQuery || Zepto, __webpack_require__(/*! ./makeEventDispatch.js */ "./src/utilities/makeEventDispatch.js"), __webpack_require__(/*! ../utilities/Util.js */ "./src/utilities/Util.js"));

if ( true && module.exports) module.exports = GestureMonitor;
if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  return GestureMonitor;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/utilities/ScrollMonitor.js":
/*!****************************************!*\
  !*** ./src/utilities/ScrollMonitor.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/** 
 * @class ScrollMonitor
 * @description Listes for browser scroll event and dispatches "scroll" event with some useful info.
 *   Provides ElementTracker api for tracking scroll of elements and triggering/subscribing events.
 * 
 * @fires scrollMonitor#scroll - Event contains: position ({Number} scroll position), prvPosition (Number), scrollDirection {String} "down" or "up".
 *
 * @method bind Takes an element and returns an ElementTracker. 
 								Accepts {Number} thresholdX/thresholdY parameters for cropping watched area of viewport axes.
								E.g: `bind(element, 0.5, 0.5)` will treat window as if half its actual size.
 * @method unbind Destroys an ElementTracker produced by this Scrollmonitor.
 * @method destroy Destroys the Scrollmonitor, and any ElementTrackers bound to it.
 * @method scrollTo Scroll to an element: `monitor.scrollTo(element, speed, offset, beforeFn, afterFn)`
 *
 * @requires jQuery
 * @requires MakeEventDispatch
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */
var ScrollMonitor = function ($, makeEventDispatch) {
  var $window = $(window),
      $htmlBody = $('html, body'),
      ids = 0,
      winWidth,
      winHeight;

  function updateWindowDimensions() {
    winWidth = window.innerWidth || window.clientWidth;
    winHeight = window.innerHeight || window.clientHeight;
  }

  $window.on("resize.scrollMonitor", updateWindowDimensions);
  updateWindowDimensions();
  /** 
   * @class ElementTracker
   * @description Listens for "scroll" event from scrollMonitor and tracks element position relative to viewport.
   * 
   * @param {Element} monitoredElement Element to attach scroll listeners to. Default: window.
   * @param {scrollMonitor} scrollMonitor
   * @param {element} thresholdX DOM element to track
   * @param {Number} thresholdX Change active area of viewport. E.g: 0.5 will treat window as if half its actual width.
   * @param {Number} thresholdY Change active area of viewport. E.g: 0.5 will treat window as if half its actual height.
   *
   * @method checkPosition Checks position and triggers relevant events.
   *
   * @fires ElementTracker#inView - Fired on scroll, if any part of element is in viewport.
   * @fires ElementTracker#outOfView - Fired on scroll, if no part of element is in viewport.
   * @fires ElementTracker#enterView - Fired on scroll, if element enters viewport.
   * @fires ElementTracker#exitView - Fired on scroll, if element leaves viewport.
   * @fires ElementTracker#[top, bottom, left, right]EnterView 
   *					- Fired on scroll, if an edge of the element enters the viewport.
   * @fires ElementTracker#[top, bottom, left, right]ExitView 
   *					- Fired on scroll, if an edge of the element exits the viewport.
   */

  function ElementTracker(scrollMonitor, element, thresholdX, thresholdY) {
    var et = makeEventDispatch(this);
    et.element = element.getBoundingClientRect ? element : element[0];
    et.scrollMonitor = scrollMonitor;
    if (typeof thresholdX == "number") et.thresholdX = thresholdX;
    if (typeof thresholdY == "number") et.thresholdY = thresholdY;

    et.checkPosition = function (e) {
      var rect = et.element.getBoundingClientRect(),
          elH = rect.height || et.element.offsetHeight,
          elW = rect.width || et.element.offsetWidth,
          ofsX = winWidth * et.thresholdX,
          ofsY = winHeight * et.thresholdY;
      var state = {
        topInBounds: rect.top <= winHeight - ofsY && rect.top >= ofsY,
        bottomInBounds: rect.bottom >= ofsY && rect.bottom <= winHeight - ofsY,
        rightInBounds: rect.right <= winWidth - ofsX && rect.right >= ofsX,
        leftInBounds: rect.left >= ofsX && rect.left <= winWidth - ofsX,
        xCovered: rect.left < ofsX && rect.right > winWidth - ofsX,
        yCovered: rect.top < ofsY && rect.bottom > winHeight - ofsY
      };
      state.xVisible = state.xCovered || state.rightInBounds || state.leftInBounds;
      state.yVisible = state.yCovered || state.topInBounds || state.bottomInBounds;
      et.triggerEvents(e && e.scrollEvent ? e.scrollEvent : e, state);
      return et;
    };

    var unMonitor = scrollMonitor.$on("scroll", et.checkPosition);
    et.$on("$destroyDispatch", unMonitor);
  }

  ElementTracker.prototype = {
    thresholdX: 0,
    thresholdY: 0,
    topInView: false,
    bottomInView: false,
    rightInView: false,
    leftInView: false,
    xCovered: false,
    yCovered: false,
    isInView: false,
    triggerEvents: function triggerEvents(originalEvent, newState) {
      var et = this,
          wasVisible = et.isInView,
          isVisible = et.isInView = newState.xVisible && newState.yVisible,
          createEvent = function createEvent(eventType) {
        return {
          type: eventType,
          scrollEvent: originalEvent,
          scrollData: et.scrollMonitor
        };
      };

      et.xVisible = newState.xVisible;
      et.yVisible = newState.yVisible;
      ['top', 'bottom', 'left', 'right'].forEach(function (edge) {
        var inBoundsProp = edge + "InBounds",
            inViewProp = edge + "InView";

        if (newState[inBoundsProp] !== et[inViewProp] || isVisible !== wasVisible) {
          var edgeIsVisbible = isVisible && newState[inBoundsProp];

          if (edgeIsVisbible !== et[inViewProp]) {
            et[inViewProp] = edgeIsVisbible;
            et.$trigger(createEvent(edgeIsVisbible ? edge + "EnterView" : edge + "ExitView"));
          }
        }
      });
      if (!wasVisible && isVisible) et.$trigger(createEvent("enterView"));
      if (wasVisible && !isVisible) et.$trigger(createEvent("exitView"));
      if (isVisible) et.$trigger(createEvent("inView"));else et.$trigger(createEvent("outOfView"));
    }
  };

  function ScrollMonitor(monitoredElement) {
    var m = makeEventDispatch(this),
        $el = monitoredElement ? $(monitoredElement) : $window,
        bindingsMap = [];

    function updateScrollData(e) {
      m.prvPosition = m.position || 0;
      m.position = $el.scrollTop();
      m.scrollDirection = m.position > m.prvPosition ? "down" : "up";
      if (m.prvPosition !== m.position) m.$trigger({
        type: "scroll",
        scrollEvent: e,
        scrollData: m
      });
    }

    m.id = "scrollMonitor_" + ++ids;
    m.element = $el;

    m.bind = function (element, thresholdX, thresholdY) {
      var binding = {
        element: element,
        tracker: new ElementTracker(m, element, thresholdX, thresholdY)
      };
      bindingsMap.push(binding);
      return binding.tracker;
    };

    m.unbind = function (tracker) {
      bindingsMap.forEach(function (binding, index) {
        if (binding.tracker === tracker) {
          binding.tracker.$destroyDispatch();
          bindingsMap.splice(index, 1);
        }
      });
    };

    m.destroy = function () {
      $el.off("scroll." + m.id, updateScrollData);
      $window.off("resize." + m.id, updateScrollData);
      m.$destroyDispatch();
      bindingsMap = null;

      m.bind = function () {
        throw "This monitor has been destroyed.";
      };
    };

    $el.on("scroll." + m.id, updateScrollData);
    $window.on("resize." + m.id, updateScrollData);
    updateScrollData({});
  }

  ScrollMonitor.prototype = {
    getOffset: function getOffset($el) {
      return ($el.css("position") === "fixed" ? $el.scrollTop() : $el.offset().top) + $el.height();
    },
    scrollTo: function scrollTo(element, speed, offset, before, after) {
      var sp = speed || 400,
          _o = typeof offset == "number" ? offset : 0;

      if (!_o && offset && offset.jquery) _o = this.getOffset(offset);
      if (typeof element !== "number") element = $(element).offset().top;
      if (before) before();
      $htmlBody.animate({
        scrollTop: element - _o
      }, sp).promise().done(after);
    }
  };
  return ScrollMonitor;
}(jQuery || Zepto, __webpack_require__(/*! ./makeEventDispatch.js */ "./src/utilities/makeEventDispatch.js"));

if ( true && module.exports) module.exports = ScrollMonitor;else if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  return ScrollMonitor;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/utilities/TransitionMonitor.js":
/*!********************************************!*\
  !*** ./src/utilities/TransitionMonitor.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/** @class TransitionMonitor
 * @description dispatches normalised transition/animation start/end end events.
 		Provides utilites for manipulating element and waiting for tranition/animation with promise.
		If no event fired or no transition capability present, promise is rejected after maxDuration.
 *
 * @param {Element} DOM element to monitor for animations/transitions
 * @param {Object} options object: {maxDuration: timeToWaitForEvent}
 *
 * @fires transitionMonitor#transitionStart - Event contains: {originalEvent: {Object} original event}
 * @fires transitionMonitor#transitionEnd - Event contains: {originalEvent: {Object} original event}
 * @fires transitionMonitor#animationStart - Event contains: {originalEvent: {Object} original event}
 * @fires transitionMonitor#animationEnd - Event contains: {originalEvent: {Object} original event}
 *
 * @example
 		`var monitor = new TransitionMonitor(<element>, {maxDuration: 400});
		 var animationPromise = monitor.addClass("fadeIn", "animationEnd", 300).then(someThing);`
 *
 * @returns a function which tracks and reports on the transitions of element
 *
 * @method breakpointMonitor.manipulate(
 			manipulation<string>, className<string>, type<string>, timeout<number>
 		);`
 *
 * @requires $
 * @requires Promise
 * @requires $browser
 * @requires makeEventDispatch
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */
var TransitionMonitor = function ($, Promise, $browser, makeEventDispatch, util) {
  var TRANSITIONEVENT = $browser.transitions,
      ANIMATIONEVENT = $browser.animations;

  function TransitionMonitor(element, options) {
    var tm = makeEventDispatch(this);
    tm.element = $(element);
    tm.options = util.objectAssign({}, TransitionMonitor.prototype.options, options);
    tm.element.on(TRANSITIONEVENT.start, triggerTS);
    tm.element.on(TRANSITIONEVENT.end, triggerTE);
    tm.element.on(ANIMATIONEVENT.start, triggerAS);
    tm.element.on(ANIMATIONEVENT.end, triggerAE);

    tm.destroy = function () {
      tm.element.off(TRANSITIONEVENT.start, triggerTS);
      tm.element.off(TRANSITIONEVENT.end, triggerTE);
      tm.element.off(ANIMATIONEVENT.start, triggerAS);
      tm.element.off(ANIMATIONEVENT.end, triggerAE);
      tm.$destroyDispatch();
    };

    function tmEvnt(t, e) {
      return {
        type: t,
        originalEvent: e
      };
    }

    function isElement(e) {
      return e && (e.target || e.srcElement || e.originalTarget) === tm.element[0];
    }

    function triggerTS(e) {
      isElement(e) && tm.$trigger(tmEvnt("transitionStart", e));
    }

    function triggerTE(e) {
      isElement(e) && tm.$trigger(tmEvnt("transitionEnd", e));
    }

    function triggerAS(e) {
      isElement(e) && tm.$trigger(tmEvnt("animationStart", e));
    }

    function triggerAE(e) {
      isElement(e) && tm.$trigger(tmEvnt("animationEnd", e));
    }
  }

  TransitionMonitor.prototype = {
    options: {
      maxDuration: 3000 // Set timeout in case of failure

    },
    addClass: function addClass(className, type, timeout) {
      return this.manipulate("addClass", className, type, timeout);
    },
    removeClass: function removeClass(className, type, timeout) {
      return this.manipulate("removeClass", className, type, timeout);
    },
    toggleClass: function toggleClass(className, type, timeout) {
      return this.manipulate("toggleClass", className, type, timeout);
    },
    manipulate: function manipulate(manipulation, className, type, timeout) {
      var tm = this;
      if (typeof timeout !== "number") timeout = tm.options.maxDuration;
      return new Promise(function (resolve, reject) {
        var fail = setTimeout(function () {
          reject(new Error("Transition not detected in time..."));
        }, timeout),
            ended = false;

        function resolvePromise(e) {
          if (ended) return;else ended = true;
          clearTimeout(fail);
          resolve(e);
        }

        ;
        tm.$once(type ? type : "transitionEnd", resolvePromise);
        if (!type) tm.$once("animationEnd", resolvePromise);
        tm.element[manipulation](className);
      });
    }
  };
  return TransitionMonitor;
}(jQuery || Zepto, __webpack_require__(/*! ./pLitr.js */ "./src/utilities/pLitr.js"), __webpack_require__(/*! ./browsxr.js */ "./src/utilities/browsxr.js"), __webpack_require__(/*! ./makeEventDispatch.js */ "./src/utilities/makeEventDispatch.js"), __webpack_require__(/*! ../utilities/Util.js */ "./src/utilities/Util.js"));

if ( true && module.exports) module.exports = TransitionMonitor;else if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  return TransitionMonitor;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/utilities/Util.js":
/*!*******************************!*\
  !*** ./src/utilities/Util.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/** 
 * @class util.js
 * @description Collection of useful isht
 *
 * @requires browsxr
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 * @version: 0.1.2
 */
var utils = function (browsxr) {
  var util = {
    requestAnimationFrame: getRaf(),
    cancelAnimationFrame: getCaf()
  };

  util.isUndefined = function (val) {
    return typeof val === 'undefined';
  };

  util.isDefined = function (val) {
    return !util.isUndefined(val);
  };

  util.isFunction = function (val) {
    return typeof val === 'function';
  };

  util.isObject = function (val) {
    return val !== null && _typeof(val) === 'object';
  };

  util.isString = function (val) {
    return typeof val === 'string';
  };

  util.isNumber = function (val) {
    return typeof val === 'number';
  };

  util.isArray = Array.isArray;

  util.arrayDiff = function (A, B) {
    return A.filter(function (x) {
      return B.indexOf(x) < 0;
    });
  };

  util.objectAssign = Object.assign || function (target) {
    var output = Object(target);

    for (var i = 1, l = arguments.length; i < l; i++) {
      var source = arguments[i];

      if (source !== undefined && source !== null) {
        for (var k in source) {
          if (Object.prototype.hasOwnProperty.call(source, k)) output[k] = source[k];
        }
      }
    }

    return output;
  };

  util.copyObject = function (obj) {
    return util.objectAssign({}, obj);
  };

  util.deleteObjProp = function (obj, prop) {
    try {
      delete obj[prop];
    } finally {
      if (obj[prop]) obj[prop] = null;
    }

    return obj;
  };

  util.objectToArray = function (obj, arr) {
    if (obj instanceof Array) return obj;
    arr = arr || [];

    for (var prop in obj) {
      arr.push(obj[prop]);
    }

    return arr;
  };

  util.objectLength = function (obj) {
    if (typeof Object.keys == "function") return Object.keys(obj).length;
    var count = 0;

    for (var i in obj) {
      if (obj && obj.hasOwnProperty && obj.hasOwnProperty(i)) count++;
    }

    return count;
  };

  util.objectKeys = function (obj) {
    var keys = [];

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) keys.push(key);
    }

    return keys;
  };

  util.toCamelCalse = function (input, delimiters) {
    var regX = new RegExp('[' + (delimiters ? delimiters : '-._') + '](.)', 'g');
    return input.toLowerCase().replace(regX, function (match, group1) {
      return group1.toUpperCase();
    });
  };

  util.camelCaseTo = function (str, op) {
    return str.replace(/([a-z])([A-Z])/g, '$1' + (op || '-') + '$2').toLowerCase();
  };

  util.generateHash = function (length, useNumbers) {
    var text = "",
        characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (useNumbers) characters += "0123456789";

    for (var i = 0, rl = length || 5, l = characters.length; i < rl; i++) {
      text += characters.charAt(Math.floor(Math.random() * l));
    }

    return text;
  };

  util.randomNumber = function (max, min) {
    if (util.isUndefined(max)) max = 1;
    if (util.isUndefined(min)) min = 0;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  util.preventEvent = function (e, stopImmediate, allowPropagation) {
    // Block event and bubbling
    if (!e) return false;
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation && !allowPropagation) e.stopPropagation();
    if (stopImmediate && e.stopImmediatePropagation) e.stopImmediatePropagation();
    return e;
  };

  util.debounce = function (fn, delay, range) {
    var timer = null;
    if (!delay) delay = 10;
    if (typeof range == "number") delay += util.randomNumber(range, Math.random() < 0.5);
    return function () {
      var context = this,
          args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  };

  util.addCSSRule = function (selector, rules, index, sheet) {
    try {
      if (typeof sheet == "number") sheet = document.styleSheets[sheet];else if (sheet === undefined) sheet = document.styleSheets[document.styleSheets.length - 1];
      if (typeof index !== "number") index = sheet.cssRules.length;
      if ("insertRule" in sheet) sheet.insertRule(selector + "{" + rules + "}", index);else if ("addRule" in sheet) sheet.addRule(selector, rules, index);
    } catch (e) {}
  };

  util.updatePageTitle = function (title) {
    try {
      var t = title.replace('<', '&lt;').replace('>', '&gt;').replace(' & ', ' &amp; ');
      document.getElementsByTagName('title')[0].innerHTML = t;
    } catch (Exception) {}

    document.title = title;
  };
  /** addNavigatorDataToHtml
   *  @desciption adds window.navigator data to document element as attributes
   *  @example: (target chrome13 on windows in css) 
   *		html[data-useragent*='Chrome/13.0'][data-platform='Win32'] hits chrome13 on windows
   */


  util.addNavigatorDataToHtml = function () {
    document.documentElement.setAttribute('data-useragent', navigator.userAgent);
    document.documentElement.setAttribute('data-platform', navigator.platform);
  };
  /** addJSClass
   *  @desciption Adds "js" class name to element or document while removing "no-js" class
   */


  util.addJSClass = function (e) {
    var h = e || document.documentElement;
    h.className = ('js ' + h.className.replace('no-js', '')).trim();
  };
  /* Damn you mobile browser address bar -__- */


  util.getInnerVH = function () {
    return Math.min(window.innerHeight, document.documentElement.clientHeight, window.screen ? window.screen.height : window.outerHeight);
  };

  util.setInnerVHVar = function (vhVarName) {
    document.documentElement.style.setProperty(vhVarName || '--vh100', "".concat(util.getInnerVH(), "px"));
  };
  /** The following depend on jQuery or a compatible replacement availble as `$`
   */


  util.toggleOverflow = function (classn) {
    function tog(el, _hiding) {
      return $(el)[_hiding === undefined ? "toggleClass" : _hiding ? "addClass" : "removeClass"](classn);
    }

    tog.off = function (l) {
      return tog(l, true);
    };

    tog.on = function (l) {
      return tog(l, false);
    };

    util.addCSSRule("." + classn, "overflow:hidden !important");
    if (browsxr.IOS) util.addCSSRule("html." + classn + ",body." + classn, "position:relative !important");
    return tog;
  }("toggleOverflowClass_overflow-on");

  return util;
}(__webpack_require__(/*! ./browsxr.js */ "./src/utilities/browsxr.js"));

function getRaf() {
  var lastFrameTime = 0;

  var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastFrameTime));
    var id = window.setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastFrameTime = currTime + timeToCall;
    return id;
  };

  return function (cb) {
    return raf.call(window, cb);
  };
}

function getCaf() {
  var caf = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || function (id) {
    clearTimeout(id);
  };

  return function (id) {
    return caf.call(window, id);
  };
}

if ( true && module.exports) module.exports = utils;else if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  return utils;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/utilities/ViewportMonitor.js":
/*!******************************************!*\
  !*** ./src/utilities/ViewportMonitor.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/** 
 * @class viewportMonitor
 * @description Resize events width viewport data in event
 *
 * @fires viewportMonitor#resize - Event contains: viewportDimensions (width, height, prvHWidth, prvHeight (Number)
 *
 * @method viewportDimensionsGet viewport data (width, height, previousWidth, previousHeight)
 			`var dimensions = monitor.viewportDimensions()`
 * @method destroy Kill the viewportMonitor (and remove all remaining handlers)
			`monitor.kill()`
 *
 * @example 
 			`var monitor = new viewportMonitor() 		//Create a monitor`
 *
 * @requires jQuery
 * @requires MakeEventDispatch
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */
var ViewportMonitor = function ($, MakeEventDispatch) {
  var $window = $(window),
      monitorCount = 0,
      viewportDimensions = {},
      monitorDispatch = new MakeEventDispatch(),
      WINDOW_RESIZE_EVENT = "resize";

  function updateviewportDimensions(e) {
    var winWidth = window.innerWidth || window.clientWidth,
        winHeight = window.innerHeight || window.clientHeight;
    if (winWidth === viewportDimensions.prvWidth && winHeight === viewportDimensions.prvHeight) return;
    viewportDimensions.prvWidth = viewportDimensions.width;
    viewportDimensions.prvHeight = viewportDimensions.height;
    viewportDimensions.width = winWidth;
    viewportDimensions.height = winHeight;
    monitorDispatch.$trigger({
      type: WINDOW_RESIZE_EVENT,
      resizeEvent: e,
      viewportDimensions: viewportDimensions
    });
  }

  $window.on("resize.viewportMonitor", updateviewportDimensions);
  updateviewportDimensions();

  function ViewportMonitor() {
    var m = MakeEventDispatch(this);

    function updateListners(e) {
      m.width = e.viewportDimensions.width;
      m.height = e.viewportDimensions.height;
      m.prvHeight = e.viewportDimensions.prvHeight;
      m.prvWidth = e.viewportDimensions.prvWidth;
      e.preventDefault && m.$trigger(e);
    }

    monitorDispatch.$on(WINDOW_RESIZE_EVENT, updateListners);
    updateListners({
      viewportDimensions: viewportDimensions
    });

    m.destroy = function () {
      m.$destroyDispatch();
      monitorDispatch.$off(WINDOW_RESIZE_EVENT, updateListners);

      m.bind = function () {
        throw "This monitor has been destroyed.";
      };
    };
  }

  ViewportMonitor.prototype.viewportDimensions = function () {
    return viewportDimensions;
  };

  return ViewportMonitor;
}(jQuery || Zepto, __webpack_require__(/*! ./makeEventDispatch.js */ "./src/utilities/makeEventDispatch.js"));

if ( true && module.exports) module.exports = ViewportMonitor;else if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  return ViewportMonitor;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/utilities/browsxr.js":
/*!**********************************!*\
  !*** ./src/utilities/browsxr.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/** browsxr.js:  
 * @description object containing some useful info about the browser
 * @example
		 browser.cookiesEnabled @Returns true if cookies are available
		 browser.IE = @Returns a negative value if the browser is not IE or the version number
		 browser.prefix @Returns prefix strings used by the browser		 
		 browser.requestAnimationFrame @Returns window.requestAnimationFrame or polyfill
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 * @version: 1.0
 */
var browsxr = function () {
  var d = document.documentElement,
      ua = navigator.userAgent,
      s = document.body.style,
      documentComputedStyle = window.getComputedStyle ? window.getComputedStyle(d) : [];
  var b = {
    lastAnimationFrame: 0
  };
  b.cookiesEnabled = navigator.cookieEnabled;
  b.IE = /msie/i.test(ua) && parseFloat ? parseFloat(navigator.appVersion.split("MSIE")[1]) : 0;
  b.historyAPI = !!(window.history && history.pushState);
  b.Chrome = !b.IE && /Chrome/i.test(ua); // Not reliable

  b.Webkit = !b.IE && (b.Chrome || /Safari/.test(ua));
  b.Opera = !b.IE && !b.Webkit && /opera/i.test(ua);
  b.IOS = ua.match(/(iPad|iPhone|iPod)/i) || false;
  b.Mobile = Array.prototype.indexOf && (" " + d.className + " ").replace(/[\n\t]/g, " ").indexOf("mobile-browser") > -1;
  b.mediaQueries = !window.Modernizr ? 0 : Modernizr.mq('only all') ? 1 : -1; // Depends on Modernizr

  b.touch = 'ontouchstart' in document.body;
  b.backgroundSizing = !!('backgroundSize' in d.style);

  b.prefix = function () {
    if (documentComputedStyle.length) {
      var pre = (Array.prototype.slice.call(documentComputedStyle).join('').match(/-(moz|webkit|ms|khtml)-/) || documentComputedStyle.OLink === '' && ['', 'o'])[1],
          dom = 'WebKit|Moz|MS|O|Khtml'.match(new RegExp('(' + pre + ')', 'i'))[1];
      return {
        dom: dom,
        lowercase: pre,
        css: '-' + pre + '-',
        js: pre[0].toUpperCase() + pre.substr(1)
      };
    } else {
      return {
        dom: 'MS',
        lowercase: 'ms',
        css: '-ms-',
        js: 'Ms'
      };
    }
  }();

  b.placeholders = 'placeholder' in document.createElement('input');

  b.supports = function (prop) {
    if (prop in documentComputedStyle) return prop;
    prop = prop.replace(/^[a-z]/, function (val) {
      return val.toUpperCase();
    });
    if (b.prefix.js + prop in s) return b.prefix.lowercase + prop;
    return false;
  };

  b.supportsSvgImg = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
  b.transitions = b.supports('transition');
  if (b.transitions) b.transitions = {
    start: b.transitions === 'transition' ? 'transitionstart' : b.transitions + 'Start',
    end: b.transitions === 'transition' ? 'transitionend' : b.transitions + 'End'
  };
  b.animations = b.supports('animation');
  if (b.animations) b.animations = {
    start: b.animations === 'animation' ? 'animationstart' : b.animations + 'Start',
    end: b.animations === 'animation' ? 'animationend' : b.animations + 'End'
  };

  b.requestAnimationFrame = window.requestAnimationFrame || window[b.prefix.lowercase + 'RequestAnimationFrame'] || function (callback) {
    var ct = new Date().getTime(),
        ttc = Math.max(0, 16 - (ct - b.lastAnimationFrame));
    b.lastAnimationFrame = ct + ttc;
    return window.setTimeout(function () {
      callback(ct + ttc);
    }, ttc);
  };

  return b;
}();

if ( true && module.exports) module.exports = browsxr;else if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  return browsxr;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/utilities/loadImgSrc.js":
/*!*************************************!*\
  !*** ./src/utilities/loadImgSrc.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/** 
 * @method loadImgSrc
 * @description Load an image, resolving a promise when done.
 *
 * @example 
 		`loadImgSrc("an/image/url.png").then(doSomeThing)`
 *
 * @returns Promise
 * @requires Promise
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */
var loadImgSrc = function (Promise) {
  return function (src) {
    return new Promise(function (resolve, reject) {
      var image = new Image();
      image.onload = resolve;
      image.onerror = reject;
      image.src = src;
      if (image.complete && image.naturalWidth) resolve(); //Hack for browsers that don't trigger load event for cached content
    });
  };
}(__webpack_require__(/*! ./pLitr */ "./src/utilities/pLitr.js"));

if ( true && module.exports) module.exports = loadImgSrc;else if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  return loadImgSrc;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/utilities/makeEventDispatch.js":
/*!********************************************!*\
  !*** ./src/utilities/makeEventDispatch.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/** 
 * @class viewportMonitor
 * @description Create an event dispatcher, or turn an existing object into one.
 * 
 * @example
 		`var dispatch = new MakeEventDispatch();		// Born with event superpowers
		 var mySingleton = new SomeClass();
		 MakeEventDispatch(mySingleton);				// Enhanced with event superpowers`
 *
 * @method $on Listen for event
    `var stopFn = dispatch.$on("eventName", function callbackFn(event){ ... })
     stopFn()			\\Stop listening for event`
 *
 * @method $once Listen for event and fire callback once. Repeats if callback returns true;
    `var stopFn = dispatch.$once("eventName", function callbackFn(event){ return $onceAgainBoolean })
     stopFn()			\\Stop listening for event`
 * 
 * @method $off Alternative way to stop listening
    `dispatch.$off("eventName", callbackFn)`
 * 
 * @method $trigger Trigger an event using event object
 		`var event = {type: "eventName", someEventData: "xxx"}; 
		 dispatch.$trigger(event);`
 * or:
 * @method $trigger Trigger an event using event name
 		`dispatch.$trigger("eventName");`
 * 
 * @method $destroyDispatch Remove all listeners and destroy the dispatch capabilities
 		`dispatch.$destroyDispatch();`
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */
function MakeEventDispatch(owner) {
  var dispatch = owner || {},
      listeners = {};

  dispatch.$on = function (type, callback) {
    if (!(type in listeners)) listeners[type] = [];
    listeners[type].push(callback);
    return function () {
      dispatch.$off(type, callback);
    };
  };

  dispatch.$once = function (type, callback) {
    var removeListener,
        callbackOnceThen$off = function callbackOnceThen$off() {
      removeListener();
      callback.apply(this, arguments);
    };

    removeListener = dispatch.$on(type, callbackOnceThen$off);
    return removeListener;
  };

  dispatch.$off = function (type, callback) {
    if (!(type in listeners)) return dispatch;
    var stack = listeners[type],
        index = stack.indexOf(callback);
    if (index > -1) stack.splice(index, 1);
    return dispatch;
  };

  dispatch.$trigger = function (event) {
    var _event = typeof event === "string" ? {
      type: event
    } : event,
        _list;

    if (!(_event.type in listeners)) return dispatch;else _list = listeners[_event.type].slice();
    _event.target = dispatch;
    if (!_event.preventDefault) _event.preventDefault = function () {
      _event.__eventStopped__ = true;
    };

    for (var i = 0, l = _list.length; i < l && _event.__eventStopped__ !== true; i++) {
      _list[i].call(dispatch, _event);
    }

    return dispatch;
  };

  dispatch.$destroyDispatch = function () {
    dispatch.$trigger("$destroyDispatch");

    for (var type in listeners) {
      listeners[type].forEach(function (callback) {
        dispatch.$off(type, callback);
      });
    }

    dispatch.$on = dispatch.$trigger = function () {};

    listeners = null;
  };

  return dispatch;
}

if ( true && module.exports) module.exports = MakeEventDispatch;
if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  return MakeEventDispatch;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/utilities/pLitr.js":
/*!********************************!*\
  !*** ./src/utilities/pLitr.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/** 
 * @description: Stripped down ES6 compatible promises.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * @example: 
		`new Promise(function(resolve, reject){ ... } )
					.then(function(result){ ... })
					.catch(function(error){ ... });`
 * @see: Chris Davies https://github.com/chrisdavies/plite
 */
function PLitr(resolver) {
  var promiseChain = function promiseChain() {},
      resultGetter;

  function buildChain(onsuccess, onfailure) {
    var prevChain = promiseChain;

    promiseChain = function promiseChain() {
      prevChain();
      resultGetter(onsuccess, onfailure);
    };
  }

  function processResult(result, callback, reject) {
    if (result && result.then && result.catch) {
      result.then(function (data) {
        processResult(data, callback, reject);
      }).catch(function (err) {
        processResult(err, reject, reject);
      });
    } else {
      callback(result);
    }
  }

  function setResult(callbackRunner) {
    resultGetter = function resultGetter(successCallback, failCallback) {
      try {
        callbackRunner(successCallback, failCallback);
      } catch (ex) {
        failCallback(ex);
      }
    };

    promiseChain();
    promiseChain = undefined;
  }

  function setSuccess(data) {
    setResult(function (success) {
      success(data);
    });
  }

  function setError(err) {
    setResult(function (success, fail) {
      fail(err);
    });
  }

  var p = {
    then: function then(callback) {
      var resolveCallback = resultGetter || buildChain;
      return PLitr(function (resolve, reject) {
        resolveCallback(function (data) {
          resolve(callback(data));
        }, reject);
      });
    },
    catch: function _catch(callback) {
      var resolveCallback = resultGetter || buildChain;
      return PLitr(function (resolve, reject) {
        resolveCallback(resolve, function (err) {
          reject(callback(err));
        });
      });
    },
    resolve: function resolve(result) {
      !resultGetter && processResult(result, setSuccess, setError);
    },
    reject: function reject(err) {
      !resultGetter && processResult(err, setError, setError);
    }
  };
  resolver && resolver(p.resolve, p.reject);
  return p;
}

PLitr.all = function (promises) {
  promises = promises || [];
  return PLitr(function (resolve, reject) {
    var len = promises.length,
        count = len;
    if (!len) return resolve();

    function decrement() {
      --count <= 0 && resolve(promises);
    }

    function waitFor(p, i) {
      if (p && p.then) p.then(function (result) {
        promises[i] = result;
        decrement();
      }).catch(reject);else decrement();
    }

    for (var i = 0; i < len; ++i) {
      waitFor(promises[i], i);
    }
  });
};

if ( true && module.exports) module.exports = window.Promise || PLitr;else if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  return window.Promise || PLitr;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/utilities/provisionaryPromise.js":
/*!**********************************************!*\
  !*** ./src/utilities/provisionaryPromise.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/** 
 * @function provisionaryPromise:
 * @description Runs a test on a loop 
 * 	and resolves a promise when test passes or rejects after time limit exired.
 *
 * @param {String} testName
 * @param {Function} test Test for promise (should return true if test passes)
 * @param {number} timeToWait time to wait before rejecting (default: 5000ms)
 * @param {number} interval frequency at which to repeat (default: 100ms)
 * @returns {Promise} resolved/rejected by success/failure
 * 
 * @example
		`var p = provisionaryPromise("loadGoogleFont", function(){ 
				return $(html).hasClass('wf-active') 
			}, 5000).then(function domSomething() { ... });`
		
 * @requires Promise
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */
var provisionaryPromise = function (Promise) {
  return function (testName, test, timeToWait, interval) {
    return new Promise(function (resolve, reject) {
      var frequency = interval || 100,
          timer = timeToWait || 5000,
          testRunner,
          timeout = setTimeout(function stopTrying() {
        clearInterval(testRunner);
        reject(testName + " timed out in " + timer + "ms.");
      }, timer);
      testRunner = setInterval(function runTest() {
        var passingResult = test();
        if (!passingResult) return;
        clearTimeout(timeout);
        clearInterval(testRunner);
        resolve(passingResult);
      }, frequency);
    });
  };
}(__webpack_require__(/*! ./pLitr */ "./src/utilities/pLitr.js"));

if ( true && module.exports) module.exports = provisionaryPromise;else if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  return provisionaryPromise;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./src/utilities/viewUpdater.js":
/*!**************************************!*\
  !*** ./src/utilities/viewUpdater.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/** 
 * @method viewUpdater
 * @description Load a view from a remote source and replace a target view with it's content, 
 * resolving a promise when done.
 *
 * @example 
		`var updateTarget = viewUpdater($app, $scope, $element, $target);
		$(window).on('popstate', function(event) {
			updateTarget({
				state: event.originalEvent.state, 
				title: event.originalEvent.state.title, 
				url: (window.location.pathname+window.location.search)
			}, {
				mainView: $target.selector,
				scrollTo: true,
				cssTransitions: true,
				requestMethod: 'GET',
				requestHeaders: undefined,
				loadingClass: 'view-loading',
				targetLoadingClass: 'ajax-loading',
				errorPage: '/404',
				onServerError: function (e, request) { alert('Server Error.') }
			})
			.then(function ($newTargetScope) { ... });
		})`
 *
 * @returns Promise
 * @requires $scope<Scope>
 * @requires $app<ARENA>
 * @requires $element<HTMLElement>
 * @requires $target<HTMLElement>
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */
function viewUpdater($app, $scope, $element, $target) {
  return function updateTarget(request, data) {
    var useCssTransitions = data.cssTransitions && $app.$browser.transitions,
        transitionInClass = data.targetLoadingClass + '-transition-in',
        transitionOutClass = data.targetLoadingClass + '-transition-out',
        monitor;
    $scope.$broadcast({
      type: '$viewLoading',
      request: request
    });
    if (!useCssTransitions || $target.hasClass(transitionOutClass)) return htmlUpdate();
    $element.addClass(data.loadingClass);
    monitor = new $app.TransitionMonitor($target.removeClass(transitionInClass));

    function httpSuccess(response) {
      $scope.$broadcast({
        type: '$viewLoaded',
        request: request,
        response: response
      });
      var $replacement = $app.$(response.data.targetHtml).addClass(data.targetLoadingClass);
      $scope.$broadcast({
        type: '$viewExit',
        $target: $target,
        $replacement: $replacement
      });
      $target.triggerHandler('$destroy');
      if ($app.isFunction(data.scrollTo)) data.scrollTo($target) && $app.$scrollMonitor.scrollTo($target, 0);else if (data.scrollTo) window.scrollTo($target.offset().top, $target.offset().left);
      $replacement.insertBefore($target);
      $target.remove();
      return $app.$compiler.compile($replacement[0], null, true).then(function ($targetScope) {
        $target = $replacement;
        $element.removeClass(data.loadingClass);
        $scope.$broadcast({
          type: '$viewEnter',
          $target: $replacement
        });

        if (!useCssTransitions) {
          $replacement.removeClass(data.targetLoadingClass);
          return $targetScope;
        } else {
          return new $app.Promise(function (resolve) {
            monitor = new $app.TransitionMonitor($replacement);
            $app.requestAnimationFrame(function () {
              var endUpdate = function endUpdate() {
                monitor.destroy();
                $replacement.removeClass(data.targetLoadingClass);
                resolve($targetScope);
              };

              monitor.addClass(transitionInClass).then(endUpdate).catch(endUpdate);
            });
          });
        }
      });
    }

    function httpError(e) {
      if (404 === e.status) {
        if (request.url.indexOf(data.errorPage) < 0) {
          return updateTarget({
            state: {
              targetElement: data.mainView
            },
            title: request.state.title,
            url: data.errorPage,
            redirectedUrl: request.url
          }, data);
        } else {
          alert('The path ' + (request.redirectedUrl || request.url) + ' could not be found...');
        }
      } else if (500 === e.status && data.onServerError) {
        data.onServerError(e, request);
      }

      console.error("Http error: ", e);
      $scope.$broadcast({
        type: '$viewEnter',
        error: e
      });
      $target.removeClass(transitionOutClass).addClass(transitionInClass);
      $element.removeClass(data.loadingClass);
    }

    function htmlUpdate() {
      monitor && monitor.destroy();
      return $app.$provider.service("$router").http(request).then(httpSuccess).catch(httpError);
    }

    return monitor.addClass(transitionOutClass).then(htmlUpdate).catch(htmlUpdate);
  };
}

if ( true && module.exports) module.exports = viewUpdater;else if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  return viewUpdater;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ })

/******/ });
//# sourceMappingURL=arena.js.map