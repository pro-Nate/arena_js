/** 
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

var Scope = (function (makeEventDispatch) {
	'use strict';
	
	function Scope(parent, callback) {
		var scope = makeEventDispatch(this),
			id = (parent && parent.$children? parent.$children.length : 0).toString();
		this.$id = (parent && parent.$id)? parent.$id+"."+id : id;
		
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
				var S = function(){ return Scope.call(this, scope, callback); };
				S.prototype = scope;
				newScope = new S();
			}
			
			if (!newScope.$root) 
				newScope.$root = scope.$root || scope;
			return newScope;
		}

		function destroyScope() {
			if (!scope.$parent) return;					// $rootScope is always indestructible
			else scope.$trigger("$destroy");
			
			for (var c = scope.$children.length; c; c--) 
				scope.$children[c-1].$destroy();

			var siblings = scope.$parent.$children;
			siblings.splice(siblings.indexOf(scope), 1);
			scope.$destroyDispatch();					// End all event listeners
			scope.$parent = scope.$root = scope.$$watchers = null;
			scope.$destroyed = true;
		}

		function emitEvent(e) {
			if (!e.stopPropagation) 
				try{
					e.stopPropagation = function () { e.__propagationStopped__ = true; };
				} catch (e) {}
			scope.$trigger(e);
			scope.$children.forEach(function (childScope) {
				if (!e.__propagationStopped__) childScope.$emit(e);
			});
			return scope;
		}

		function broadcastEvent(e) {
			if (!e.stopPropagation) 
				try {
					e.stopPropagation = function () { e.__propagationStopped__ = true; };
				} catch (e) {}
			scope.$trigger(e);
			if (scope.$parent && !e.__propagationStopped__) 
				scope.$parent.$broadcast(e);
			return scope;
		}
		
		this.$create = createScope;
		this.$destroy = destroyScope;
		this.$emit = emitEvent;
		this.$broadcast = broadcastEvent;
		
		if (typeof callback === "function") callback(this);
	}
	
	//TODO: dirty checking - $digest option???
	return Scope;
})(require("../utilities/makeEventDispatch.js"));

if (typeof module !== 'undefined' && module.exports) module.exports = Scope;
if (typeof define == 'function' && define.amd) define(function(){ return Scope; });