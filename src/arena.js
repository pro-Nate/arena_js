/** 
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
			html5Mode: true,					// Will be ignored if html5 history api missing
			autoBootstrap: true,				// Bootstrap automatically (use $app.$bootstrap() elsewise)
			rootElementSelector: 'html',		// Bind app to this DOM element
			defaultTransitionSpeed: 300			// Transitions will take this long by default
		};
	
	var Scope = require("./core/scope.js"),
		Provider = require("./core/provider.js"),
		Compiler = require("./core/compiler.js"),
		Util = require("./utilities/Util.js"),
		components = {directive: {}, controller: {}, service: {}};
	
	Util.$ = $;
	Util.$browser = require("./utilities/browsxr.js");
	Util.$cookie = require("./utilities/Cookie.js");
	Util.Promise = require("./utilities/pLitr.js");
	Util.provisionaryPromise = require("./utilities/provisionaryPromise.js");
	Util.MakeEventDispatch = require("./utilities/makeEventDispatch.js");
	Util.ViewportMonitor = require("./utilities/ViewportMonitor.js");
	Util.ScrollMonitor = require("./utilities/ScrollMonitor.js");
	Util.BreakpointMonitor = require("./utilities/BreakpointMonitor.js");
	Util.TransitionMonitor = require("./utilities/TransitionMonitor.js");
	Util.GestureMonitor = require("./utilities/GestureMonitor.js");
	Util.viewUpdater = require("./utilities/viewUpdater.js");
	Util.loadImgSrc = require("./utilities/loadImgSrc.js");
	Util.addNavigatorDataToHtml();
	Util.addJSClass();
	
	function Arena(_config_) {
		var a = new Util.MakeEventDispatch(this),
			rootScope = new Scope(),
			startupPromises = [];

		a.deleteObjProp(a, '$destroyDispatch');	
		a.$config = a.objectAssign({}, defaultConfig, a.isString(_config_)? {name: _config_} : _config_);
		a.$provider = new Provider(components);
		a.$compiler = new Compiler(a.$provider);
		a.$directive = function () { return a.$provider.directive.apply(a, arguments) };
		a.$controller = function () { return a.$provider.controller.apply(a, arguments) };
		a.$service = function () { return a.$provider.service.apply(a, arguments) };
		
		a.$provider.service('$app', function () { return a; }).alias('$app', a.$config.name);
		
		/* Exclusive local storage for this app */
		["sessionStorage", "localStorage"].forEach(function (storage) {
			var storageId = a.$config.name+"_$$storage_",
				storageName = '$'+storage;
			a[storageName] = {
				setItem: function (key, val) { window[storage].setItem(storageId+key, val) },
				getItem: function (key) { return window[storage].getItem(storageId+key) }
			};
			a.$provider.service(storageName, function () { return a[storageName] });
		});
		
		/* Accept promises which must resolve for bootstrap to be completed. */
		a.$bootstrapDefer = function (p) {
			if (Array.isArray(p)) startupPromises = startupPromises.concat(p);
			else if (p.then) startupPromises.push(p);
		};
		
		a.$service('$rootScope', function () { return rootScope })
			.$service('$config', function () { return a.$config });
		
		/* Setup the app and compile the DOM. */
		a.$bootstrap = function () {
			var $rootElement = $(a.$config.rootElementSelector).eq(0);
			a.$bootstrap = false;
			a.$service('$rootElement', function () { return $rootElement });
			a.$viewportMonitor = new a.ViewportMonitor();
			a.$scrollMonitor = new a.ScrollMonitor(window);
			a.$breakpointMonitor = new a.BreakpointMonitor({mobile: [0, 540], desktop: [541, 16384]}, $rootElement);
			a.$breakpointMonitor.$on("viewportBreakpointChanged", a.$trigger);
			a.$service('$viewportMonitor', function () { return a.$viewportMonitor })
			 .$service('$scrollMonitor', function () { return a.$scrollMonitor })
			 .$service('$breakpointMonitor', function () { return a.$breakpointMonitor });
			
			function compileDOM(bootstrapResolutions) {
				a.$compiler.compile($rootElement[0], rootScope);
				return bootstrapResolutions;
			}
			
			a.$trigger("$bootstrapStart");
			return a.Promise.all(startupPromises)
				.then(compileDOM).catch(compileDOM)
				.then(function (bootstrapResolutions) {
					a.$bootstrap = true;
					a.$trigger("$bootstrapEnd");
					return bootstrapResolutions;
				});
		};
		
		if (a.$config.autoBootstrap) $doc.ready(a.$bootstrap);
	}

	Arena.prototype = Util;
	
	'directive controller service'.split(' ').forEach(function (providerName) {
		Arena['$'+providerName] = function (name, fn) {
			if (components[providerName][name]) throw new Error("Provider already exists: "+name);
			else components[providerName][name] = fn;
			return Arena;
		};
	});
	
	Util.objectKeys(Util).forEach(function (utilName) {
		Arena.$service(utilName, function () { return Util[utilName] });
	});	
	
	Arena
		.$service('$html', function () { return $html })
		.$service('$window', function () { return $win })
		.$service('$document', function () { return $doc })
		.$service("$router", require("./core/providers/routerService.js"))
		.$directive("controller", require("./core/providers/controllerDirective.js"))
		.$directive("mainView", require("./core/providers/mainViewDirective.js"));
	
	window.ARENA = Arena;
	if (typeof module !== 'undefined' && module.exports) module.exports = Arena;
	if (typeof define == 'function' && define.amd) define(function(){ return Arena });
})(jQuery);