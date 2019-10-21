/** 
 * @class OnInteraction
 * @constructs directive
 * @description Specify a user interaction and an action to take in repsonse.
 * 
 * @param {string} onInteraction event(s) to listen for
 * @param {string} targetElement Selector of element to target with action
 * @param {boolean} preventDefault Prevent default event if true
 * @param {boolean} catchBubbles Trigger action if interaction event has bubbled from child element 
 * @param {string} toggleClass Toggle a class on interaction
 * @param {string} fireEvent Fire an event on scope
 * @param {string} broadcast Broadcast an event from scope
 * @param {string} emit Emit an event from scope
 * @param {string} executeOnScope Execute a function if it exists on scope
 *
 * @example 
		`<button id="special" on-interaction="click" broadcast="specialEvent" prevent-default />`
 *
 * @requires $
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */

function onInteractionDirective($) {
	return {
    data: {
			onInteraction: 'touchstart, click',
			targetElement: undefined,
			preventDefault: false,
			stopPropagation: false,
			catchBubbles: true,
			toggleClass: "",
			fireEvent: "",
			broadcast: "",
			emit: "",
			executeOnScope: ""
		},
		link: function ($el, $scope, data) {
			var interactionTarget = data.targetElement? $(data.targetElement) : $el
				, interactionEvent = data.onInteraction.length? data.onInteraction : this.data.onInteraction;

			$el.on(interactionEvent, function(e) {
				if (data.catchBubbles || e.target === $el[0]) {
					if(data.toggleClass.length)
							interactionTarget.toggleClass(data.toggleClass);

					if(data.executeOnScope.length && typeof $scope[data.executeOnScope] == "function")
							$scope[data.executeOnScope](e);

					if(data.fireEvent.length)
							interactionTarget.trigger(data.fireEvent);
					if(data.broadcast.length)
							$scope.$broadcast(data.broadcast);
					if(data.emit.length)
							$scope.$emit(data.emit);

					if(data.preventDefault || $el.is('[prevent-default]'))
							e.preventDefault(e);
					if(data.stopPropagation || $el.is('[stop-propagation]'))
							e.stopPropagation && e.stopPropagation(e);
				}
			});
    }
  };
}

onInteractionDirective.$dependencies = ["$"];

if (window.ARENA) ARENA.$directive("onInteraction", onInteractionDirective);
if (typeof module !== 'undefined') module.exports = onInteractionDirective;