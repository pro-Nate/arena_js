/** 
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
	
var ScrollMonitor = (function($, makeEventDispatch){
	var $window = $(window)
		, $htmlBody = $('html, body')
		, ids = 0
		, winWidth
		, winHeight;
		
	function updateWindowDimensions() {
		winWidth = window.innerWidth || window.clientWidth;
		winHeight = window.innerHeight ||  window.clientHeight;
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
		
		et.element = element.getBoundingClientRect? element : element[0];
		et.scrollMonitor = scrollMonitor;
		if (typeof thresholdX == "number") et.thresholdX = thresholdX;
		if (typeof thresholdY == "number") et.thresholdY = thresholdY;
		
		et.checkPosition = function (e) { 
			var rect = et.element.getBoundingClientRect()
				, elH = rect.height || et.element.offsetHeight
				, elW = rect.width || et.element.offsetWidth
				, ofsX = winWidth * et.thresholdX
				, ofsY = winHeight * et.thresholdY;
			
			var state = {
					topInBounds: (rect.top <= winHeight - ofsY) && (rect.top >= ofsY),
					bottomInBounds: (rect.bottom >= ofsY) && (rect.bottom <= winHeight - ofsY),
					rightInBounds: (rect.right <= winWidth - ofsX) && (rect.right >= ofsX),
					leftInBounds: (rect.left >= ofsX) && (rect.left <= winWidth - ofsX),
					xCovered: (rect.left < ofsX) && (rect.right > winWidth - ofsX),
					yCovered: (rect.top < ofsY) && (rect.bottom > winHeight - ofsY)
				};	
			state.xVisible = state.xCovered || state.rightInBounds || state.leftInBounds;
			state.yVisible = state.yCovered || state.topInBounds || state.bottomInBounds;
			
			et.triggerEvents((e && e.scrollEvent)? e.scrollEvent : e, state);
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
		triggerEvents: function (originalEvent, newState) {
			var et = this
				, wasVisible = et.isInView
				, isVisible = et.isInView = newState.xVisible && newState.yVisible
				, createEvent = function (eventType) {
					return {type: eventType, scrollEvent: originalEvent, scrollData: et.scrollMonitor}
				};
			et.xVisible = newState.xVisible;
			et.yVisible = newState.yVisible;
			
			['top', 'bottom', 'left', 'right'].forEach(function (edge) {
				var inBoundsProp = edge+"InBounds"
					, inViewProp = edge+"InView";
				if (newState[inBoundsProp] !== et[inViewProp] || isVisible !== wasVisible) {
					var edgeIsVisbible = isVisible && newState[inBoundsProp];	
					if (edgeIsVisbible !== et[inViewProp]) {
						et[inViewProp] = edgeIsVisbible;
						et.$trigger(createEvent(edgeIsVisbible? (edge+"EnterView") : (edge+"ExitView")));
					}
				}
			});
			
			if (!wasVisible && isVisible) et.$trigger(createEvent("enterView"));	
			if (wasVisible && !isVisible) et.$trigger(createEvent("exitView"));			
			if (isVisible) et.$trigger(createEvent("inView"));
			else et.$trigger(createEvent("outOfView"));
		}
	};

	
	function ScrollMonitor(monitoredElement) {
		var m = makeEventDispatch(this)
			, $el = monitoredElement? $(monitoredElement) : $window
			, bindingsMap = [];
		
		function updateScrollData(e) { 
			m.prvPosition = m.position || 0;
			m.position = $el.scrollTop();
			m.scrollDirection = (m.position > m.prvPosition)? "down" : "up";
			if (m.prvPosition !== m.position) m.$trigger({
					type: "scroll",
					scrollEvent: e, 
					scrollData: m
				});
		}
		
		m.id = "scrollMonitor_"+(++ids);
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
			$el.off("scroll."+m.id, updateScrollData);
			$window.off("resize."+m.id, updateScrollData);
			m.$destroyDispatch();
			bindingsMap = null;
			m.bind = function () { throw "This monitor has been destroyed."; };
		};

		$el.on("scroll."+m.id, updateScrollData);
		$window.on("resize."+m.id, updateScrollData);
		updateScrollData({});
	}
	
	ScrollMonitor.prototype = {
		getOffset: function ($el) { 
			return (($el.css("position")==="fixed"? $el.scrollTop() : $el.offset().top)) + $el.height(); 
		},
		scrollTo: function (element, speed, offset, before, after) {
			var sp = speed || 400
				, _o = (typeof(offset)=="number")? offset : 0;
			if (!_o && offset && offset.jquery) _o = this.getOffset(offset);
			if (typeof(element)!=="number") element = $(element).offset().top;
			if (before) before();
			$htmlBody.animate( { scrollTop: element - _o }, sp ).promise().done(after);
		}
	};	
	
	return ScrollMonitor;
})(jQuery || Zepto, require("./makeEventDispatch.js"));

if (typeof module !== 'undefined' && module.exports) module.exports = ScrollMonitor;
else if (typeof define == 'function' && define.amd) define(function(){ return ScrollMonitor; });
