/** 
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

var Provider = (function (undefined) {
	'use strict';
	
	var DIRECTIVE_SUFFIX = ' _DIRECTIVE_',
		CONTROLLER_SUFFIX = ' _CONTROLLER_';
		
	function extractParamNames(fn) {
		var params= fn.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '').match(/\((.*?)\)/);
		if (params && params[1]) return params[1].split(',').map(function (p) { return p.trim(); });
		else return [];
	}

	function construct(constructor, args) {
		function C() { return constructor.apply(this, args); }
		C.prototype = constructor.prototype;
		return new C();
	}
	
	
	function Provider(_components_) {
		var provider = this,
			providers = {},
			cache = {$$directiveSelectors: []};
	
		/* Dependency names must be attched to class using static $dependencies array: 
			`function myService(){}; myService.$dependencies = ["aDependencyName"];` */
		function getDependencies(f, locals) {
    		locals = locals || {};
			return (Array.isArray(f.$dependencies)? f.$dependencies : extractParamNames(f))
					.map(function (s) { return locals[s] || provider.service(s, null, locals) });
		}
	
		/* Do not allow providers to be replaced */
		function checkSecurity(name) { 				
			if (providers[name]) throw new Error("Provider already exists: "+name);
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
				if (typeof cached === "function") cached = {link: cached};
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
				if(providr) return provider.instantiate(providr, locals);
				else return;
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

				if (typeof cached !== 'undefined'){
					return cached;
				} else if (typeof providr === 'function') {
					var service = provider.instantiate(providr, locals);
					if(providr.$cache !== false) cache[name] = service;
					return service;
				} else {
					return;
				}
			} else if(checkSecurity(name)) {
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
					if (typeof extendFn === "function")
						return extendFn(Object.create(originalDirective));
					else
						return originalDirective;
				});
			}
			
			["service", "directive", "controller"].forEach(aliasType);
			
			if (!hasAlias) throw new Error(name+" has not been provided.");
			return provider;
		};
	
		if (_components_)
			'directive controller service'.split(' ')
				.forEach(function (providerName) {
					for (var componentName in _components_[providerName])
						provider[providerName](componentName, _components_[providerName][componentName]);
				});
	}
	
	return Provider;
}());

if (typeof module !== 'undefined' && module.exports) module.exports = Provider;
if (typeof define == 'function' && define.amd) define(function(){ return Provider });