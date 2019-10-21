/** @class TransitionMonitor
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

var TransitionMonitor = (function ($, Promise, $browser, makeEventDispatch, util) {
	
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
		}
		
		function tmEvnt(t, e) { return {type: t, originalEvent: e} }
		function isElement(e) { return e && (e.target || e.srcElement || e.originalTarget) === tm.element[0] }
		function triggerTS(e) { isElement(e) && tm.$trigger(tmEvnt("transitionStart", e)) }
		function triggerTE(e) { isElement(e) && tm.$trigger(tmEvnt("transitionEnd", e)) }		
		function triggerAS(e) { isElement(e) && tm.$trigger(tmEvnt("animationStart", e)) }
		function triggerAE(e) { isElement(e) && tm.$trigger(tmEvnt("animationEnd", e)) }
	}
	
	TransitionMonitor.prototype = {
		options: {
			maxDuration: 3000		// Set timeout in case of failure
		},
		addClass: function (className, type, timeout) {
			return this.manipulate("addClass", className, type, timeout)
		},
		removeClass: function (className, type, timeout) {
			return this.manipulate("removeClass", className, type, timeout)
		},
		toggleClass: function (className, type, timeout) {
			return this.manipulate("toggleClass", className, type, timeout)
		},
		manipulate: function (manipulation, className, type, timeout) {
			var tm = this;
			if (typeof timeout !== "number") timeout = tm.options.maxDuration;
			
			return new Promise(function (resolve, reject) {
				var fail = setTimeout(function () { reject(new Error("Transition not detected in time...")) }, timeout),
					ended = false;
				function resolvePromise(e) {
					if (ended) return;
					else ended = true;
					clearTimeout(fail);
					resolve(e);
				};
				tm.$once(type? type : "transitionEnd", resolvePromise);
				if (!type) tm.$once("animationEnd", resolvePromise);
				tm.element[manipulation](className);
			});
		}
	};
	
	return TransitionMonitor;
	
})(jQuery || Zepto, require("./pLitr.js"), require("./browsxr.js"), require("./makeEventDispatch.js"), require("../utilities/Util.js"));

if (typeof module !== 'undefined' && module.exports) module.exports = TransitionMonitor;
else if (typeof define == 'function' && define.amd) define(function(){ return TransitionMonitor; });