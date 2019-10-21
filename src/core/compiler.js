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

var Compiler = (function (compilerId, $, Promise, util) {
	'use strict';
	
	function Compiler(provider) {
		var compiler = this,
			testCache = [];
		
		this.provider = provider;
		
		this.findDirectives = function findDirectives(el, locals) {
			var result = [];

			var directiveList = provider.directive();	// Cache tests for supa speed
			if (directiveList.length !== testCache.length) {
				directiveList.slice(testCache.length)
					.forEach(function (name) { 
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
				linkToElement = scope = parent? parentScope : parentScope.$create(directivesRequireIsolatedScope);
			} else if (compilingThisElement && directivesRequireScope && !existingScope) {
				linkToElement = scope = parentScope.$create(directivesRequireIsolatedScope);
			}
			
			var wrappedEl = compilingThisElement || linkToElement? $(el) : null,
				elementData = wrappedEl? wrappedEl.data() : null;
			
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
					scope.$once('$destroy', function () { setCompilerData(el, '$directives', null) });
					wrappedEl.triggerHandler("$compile.end"); 
				}
				return scope;
			}
			
			function linkDirectiveToNode(directive) {
				var directiveData = elementData,
					directiveController;
				if (typeof directive.data === "function") {
					directiveData = util.objectAssign({}, directive.data(wrappedEl, scope), elementData);
				} else if (typeof directive.data === "object") {
					directiveData = util.objectAssign({}, directive.data, elementData);
				}
				if (typeof directive.controller === "function") {
					directiveController = provider.instantiate(directive.controller, {$scope: scope});
				} else if (typeof directive.controller === "string") {
					directiveController = provider.controller(directive.controller, null, {$scope: scope});
				}
				
				try{
					directive.link(wrappedEl, scope, directiveData, directiveController);
				} catch (e) {
					console.error('Error compiling: ', e);	// TODO: Something?	
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
					scope.$deferCompile( compiler.compile(child, scope, null, false, true) );
				}, compiler);
			}
			
			if (autoCompile && !compileDefer.length) endCompileNode();
			else return Promise.all(compileDefer).then(endCompileNode);
		};
	}
	

	function DirectiveTester(name) {
		this.name = name;							// Should not have spaces here
		this.nameSanitized = this.name.replace(/[^0-9a-zA-Z-_]/g, '');
		this.nameDashed = this.nameSanitized.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
		var tests = [];
		
		if (this.name.indexOf('.')===0) {			// Matches Class
			var classRegEx = new RegExp(' '+ this.name.slice(1) +' ');
			tests.push(function checkClass(el) { 
				return (' '+ el.className +' ').indexOf(' '+ this.nameSanitized +' ') > -1;
			});
		} else if (this.name.indexOf('#')===0) {	// Matches Id
			var idTest = this.name.slice(1);
			tests.push(function checkId(el) { return el.getAttribute('id')===idTest });
		} else {
			tests.push(function checkAttribute(el) {
				return el.nodeName.toLowerCase() === this.nameDashed	// Matches Tag
						|| el.hasAttribute(this.nameSanitized)  		// Matches attribute
						|| el.hasAttribute(this.nameDashed)
						|| el.hasAttribute('data-'+this.nameDashed);	// Matches data attribute
			});
		}
		
		this.test = function runAllTests(el) {
			if (el.tagName) {				// node.nodeType === 1 || node.nodeType === 11
				for(var i=0; i < tests.length; i++)
					if (tests[i].call(this, el)) return true;
			}
			return false;
		};
	}

	function diff(A, B) {
		return A.filter(function (x) { return B.indexOf(x) < 0; });
	}
		
	function requiresScope(directives) { 
		return directives.filter(function(directive) {return directive.scope;}).length
	}

	function requiresIsolateScope(directives) { 
		return directives.filter(function(directive) {return typeof directive.scope === "object";}).length
	}
		
	function getCompilerData(el, prop) { 
		return el[compilerId]? el[compilerId][prop] : null; 
	}
	
	function setCompilerData(el, prop, val) {
		if (!el[compilerId]) el[compilerId] = {};
		el[compilerId][prop] = val;
	}
	
	function getScope(element) {
		return getCompilerData(element, '$scope') || getScope(element.parentNode);
	}
		
	return Compiler;
})(
	'$$compiler'+(Math.random() * 10921), 
	jQuery || Zepto, 
	require("../utilities/pLitr.js"), 
	require("../utilities/Util.js")
);

if (typeof module !== 'undefined' && module.exports) module.exports = Compiler;
if (typeof define == 'function' && define.amd) define(function(){ return Compiler; });