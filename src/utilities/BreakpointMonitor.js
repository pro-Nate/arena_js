/** @class BreakpointMonitor
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

var BreakpointMonitor = (function ($, makeEventDispatch) {
	var $window = $(window);
	
	function testThreshold(breakpoints, operator, breakpointName) {
		var w = window.innerWidth || window.clientWidth
			, t = typeof breakpointName == "string"? breakpointName : false;

		if (!(t && breakpoints[t])) return false;
		else t = breakpoints[t];

		if (operator === ">") return w > t[1];
		if (operator === "<") return w < t[0];
		if (operator === ">=") return w >= t[0];
		if (operator === "<=") return w <= t[1];
		else return (w >= t[0] && w <= t[1]);
	}
	
	function annotateElement($element, breakpoint, breakpoints, lastBreakpointClassString) {
		var classes = "";
		$element.removeClass(lastBreakpointClassString);
		$element.addClass("viewport-"+breakpoint);
		for (var t in breakpoints) classes += " viewport-"+t;
		return classes;
	}
	
	
	function BreakpointMonitor(breakpoints, element) {
		var m = makeEventDispatch(this)
			,	lastBreakpointClassString = "";
		
		function resizeHandler() {
			var classString = ""
				, oldBreakpoint = m.currentBreakpoint
				, newBreakpoint;
			
			for (var t in m.breakpoints) {
				if (testThreshold(m.breakpoints, '=', t)) newBreakpoint = t;
			}
			
			if (newBreakpoint && newBreakpoint !== oldBreakpoint) {
				m.currentBreakpoint = newBreakpoint;
				
				if (m.$element)
					lastBreakpointClassString = annotateElement(
						m.$element, newBreakpoint, m.breakpoints, lastBreakpointClassString
					);
				
				m.$trigger({
					type: "viewportBreakpointChanged",
					newBreakpoint: newBreakpoint,
					oldBreakpoint: oldBreakpoint
				});
			}
		}

		this.breakpoints = breakpoints;
		if (element) this.$element = element.addClass? element : $(element);
		
		/** @method breakpointMonitor.breakpoint(operator<String>, breakpoint<String>);
		 * 	@description Check if the current viewport size is equal to or less/more than one of configured breakpoints 
		 * 	@param operator {string} "more/less than" or "equals"
		 * 	@param breakpoint {string} name of target breakpoint
		 * 	@returns boolean, or name of current breakpoint with no arguments
		 */
		this.breakpoint = function (operator, breakpointName) {
			if (!operator && breakpointName) return breakpointName === breakpointName;
			return breakpointName? testThreshold(m.breakpoints, operator, breakpointName) : m.currentBreakpoint;
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
})(jQuery || Zepto, require("./makeEventDispatch.js"));

if (typeof module !== 'undefined' && module.exports) module.exports = BreakpointMonitor;
if (typeof define == 'function' && define.amd) define(function(){ return BreakpointMonitor; });