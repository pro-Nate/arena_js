/** 
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

var ViewportMonitor = (function($, MakeEventDispatch) {
	var $window = $(window)
		,	monitorCount = 0
		,	viewportDimensions = {}
		,	monitorDispatch = new MakeEventDispatch()
		,	WINDOW_RESIZE_EVENT = "resize";
	
	function updateviewportDimensions(e) {
		var winWidth = window.innerWidth || window.clientWidth
			,	winHeight = window.innerHeight ||  window.clientHeight;
		if (winWidth === viewportDimensions.prvWidth && winHeight === viewportDimensions.prvHeight) 
			return;
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
		updateListners({viewportDimensions: viewportDimensions});
		
		m.destroy = function () {
			m.$destroyDispatch();
			monitorDispatch.$off(WINDOW_RESIZE_EVENT, updateListners);
			m.bind = function () { throw "This monitor has been destroyed."; };
		};
	}
		
	ViewportMonitor.prototype.viewportDimensions = function () { return viewportDimensions; };
	
	return ViewportMonitor;
})(jQuery || Zepto, require("./makeEventDispatch.js"));

if (typeof module !== 'undefined' && module.exports) module.exports = ViewportMonitor;
else if (typeof define == 'function' && define.amd) define(function(){ return ViewportMonitor; });
