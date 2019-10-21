/** 
 * @class HideOutsideViewport
 * @constructs directive
 * @description Sets linked element visibility to "hidden" if it is outside the viewport.
 *
 * @param {Number} scrollOffset offset the scroll position. If scrollOffset == 0.3, 
 *								 event will be fired when element has moved 1/3 of the way into viewport. Default: 1.2;
 * @param {String} hideClass CSS class name used to hide the element. Default: ".hide-outside-viewport";
 *
 * @example 
		`<div hide-outside-viewport></div>`
 *
 * @requires util.addCSSRule
 * @requires ScrollMonitor
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */
	
function hideOutsideViewportDirective($app) {
	var existingSelectors = {};
	
	return {
		data: {
			scrollOffset: -0.5,
			hideClass: "hide-outside-viewport"
		},
    link: function ($el, $scope, data) {
			var scrollMonitor = new $app.ScrollMonitor(),
				scrollTracker = scrollMonitor.bind($el, 0, data.scrollOffset);

			if (!existingSelectors[data.hideClass]) {
				$app.addCSSRule(data.hideClass, "visibility:hidden !important");
				existingSelectors[data.hideClass] = true;
			}
			
			if (!scrollTracker.checkPosition().isInView) $el.addClass(data.hideClass);
			scrollTracker.$on("enterView", function () { $el.removeClass(data.hideClass); });
			scrollTracker.$on("exitView", function () { $el.addClass(data.hideClass); });
			$scope.$on("$destroy", scrollMonitor.destroy);
    }
  };
}

hideOutsideViewportDirective.$dependencies = ["$app"];

if (window.ARENA) ARENA.$directive("hideOutsideViewport", hideOutsideViewportDirective);
if (typeof module !== 'undefined') module.exports = hideOutsideViewportDirective;