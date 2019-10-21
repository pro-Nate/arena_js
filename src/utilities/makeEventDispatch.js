/** 
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
		if(!(type in listeners)) listeners[type] = [];
		listeners[type].push(callback);
		return function() { dispatch.$off(type, callback); };
	};

	dispatch.$once = function (type, callback) {
		var removeListener,
			callbackOnceThen$off = function () {
				removeListener();
				callback.apply(this, arguments);
			};
		removeListener = dispatch.$on(type, callbackOnceThen$off);
		return removeListener;
	};

	dispatch.$off = function (type, callback) {
		if(!(type in listeners)) return dispatch; 
		var stack = listeners[type],
			index = stack.indexOf(callback);
		if (index > -1) stack.splice(index, 1);
		return dispatch;
	};

	dispatch.$trigger = function (event) {
		var _event = (typeof event === "string")? {type: event} : event,
			_list;

		if(!(_event.type in listeners)) return dispatch;
		else _list = listeners[_event.type].slice();

		_event.target = dispatch;
		if (!_event.preventDefault)
			_event.preventDefault = function () { _event.__eventStopped__ = true; };

		for(var i = 0, l = _list.length; i < l && _event.__eventStopped__ !== true; i++) {
			_list[i].call(dispatch, _event);
		}
		return dispatch;
	};
	
	dispatch.$destroyDispatch = function () {
		dispatch.$trigger("$destroyDispatch");
		for (var type in listeners) {
			listeners[type].forEach(function (callback) { dispatch.$off(type, callback); });
		}
		dispatch.$on = dispatch.$trigger = function () {};
		listeners = null;
	};

	return dispatch;
}

if (typeof module !== 'undefined' && module.exports) module.exports = MakeEventDispatch;
if (typeof define == 'function' && define.amd) define(function(){ return MakeEventDispatch; });