/** @class GestureMonitor
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

var GestureMonitor = (function ($, makeEventDispatch, util) {  
  var msPointerEnabled = !!(navigator.msPointerEnabled)
  	, pointerEnabled = !!(msPointerEnabled || navigator.pointerEnabled)
		, msEventType = function (type) { return msPointerEnabled ? 'MS' + type : type.toLowerCase() }
		, HASTOUCH = pointerEnabled || (!!('ontouchstart' in window) && navigator.userAgent.indexOf('PhantomJS') < 0)
		,	TOUCHEVENTS = {
				touchstart: msEventType('PointerDown') + ' touchstart',
				touchend: msEventType('PointerUp') + ' touchend',
				touchmove: msEventType('PointerMove') + ' touchmove'
      }
		, OPTIONS = {
        swipeThreshold: 100,				// Distance moved before a swipe event can be triggered
        tapThreshold: 150,       		// range of time where a tap event could be detected
        dbltapThreshold: 200,    		// delay needed to detect a double tap
        tapPrecision: 60 / 2,    		// touch events boundaries ( 60px by default )
        justTouchEvents: false			// Disable emulating swipe for mouse
      };
	
	function getPointerEvent(event) { return event.targetTouches? event.targetTouches[0] : event; }
	function newTimestamp() { return new Date().getTime(); }
	function setListener(elm, events, callback) {
		var eventsArray = events.split(' ')
			, i = eventsArray.length;
		while (i--) 
			elm.addEventListener(eventsArray[i], callback, false);
	}
  
	
  function SwipeMonitor(element, opt) {
    var m = makeEventDispatch(this)
			, options = util.objectAssign({}, OPTIONS, opt||{})
      , tapNum = 0
			, currX, currY, cachedX, cachedY, tapTimer, timestamp, target;
		
   if(!document.addEventListener) return this;
		
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

			clearTimeout(tapTimer);      // clear the previous timer in case it was set

			if(deltaX <= -options.swipeThreshold) eventsArr.push('swipeRight');
			if(deltaX >= options.swipeThreshold) eventsArr.push('swipeLeft');
			if(deltaY <= -options.swipeThreshold) eventsArr.push('swipeDown');
			if(deltaY >= options.swipeThreshold) eventsArr.push('swipeUp');

			if(eventsArr.length) {
				for(var i = 0, eventName; i < eventsArr.length; i++){
					eventName = eventsArr[i];
					sendEvent(e.target, eventName, e, {
						distance: {
							x: Math.abs(deltaX),
							y: Math.abs(deltaY)
						}
					});
				}
			} else {
				if(
					(timestamp + options.tapThreshold) - newTimestamp() >= 0 &&
					cachedX >= currX - options.tapPrecision &&
					cachedX <= currX + options.tapPrecision &&
					cachedY >= currY - options.tapPrecision &&
					cachedY <= currY + options.tapPrecision
				) {          
					// Here you get the Tap event
					sendEvent(e.target, (tapNum === 2) && (target === e.target) ? 'dbltap' : 'tap', e);
					target = e.target;
				}

				// reset the tap counter
				tapTimer = setTimeout(function(){ tapNum = 0 }, options.dbltapThreshold);
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
  }
	
	
//  $.fn['gestureMonitor'] = function(opt){
//    return this.each(function(index, element){
//      $.data( this, 'gestureMonitor', new SwipeMonitor(element, opt) );
//    });
//  };

	
	return SwipeMonitor;
})(jQuery || Zepto, require("./makeEventDispatch.js"), require("../utilities/Util.js"));

if (typeof module !== 'undefined' && module.exports) module.exports = GestureMonitor;
if (typeof define == 'function' && define.amd) define(function(){ return GestureMonitor; });