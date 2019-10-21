/** 
 * @class AppLoadingIndicator
 * @constructs directive
 * @description Listen for bootstrap/updateView events and reflect in state of element.
 *
 * @param {String} stopClass CSS class name used by default handlers to toggle state. Default: "stop";
 * @param {Function} onLoadStart handler for $bootstrapStart/$routeChange. Default: function which adds stopClass;
 * @param {Function} onLoadEnd handler for $bootstrapEnd/$routeChangeEnd. Default: function which removes stopClass;
 *
 * @example 
		`<div app-loading-indicator></div>`
 *
 * @requires ScrollMonitor
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */
	
function appLoadingIndicatorDirective($app, $rootScope) {
	return {
		data: {
			stopClass: 'stop',
			onLoadStart: function ($element, data, e) { $element.removeClass(data.stopClass); },
  			onLoadEnd: function ($element, data, e) { $element.addClass(data.stopClass); }
		},
		link: function ($el, $scope, data) {
			var shxw = function (e) { data.onLoadStart($el, data, e); },
				hxde = function (e) { data.onLoadEnd($el, data, e); },
				listeners = [
					$app.$on("$bootstrapStart", shxw),
					$app.$on("$bootstrapEnd", hxde),
					$rootScope.$on("$viewLoading", shxw),
					$rootScope.$on("$viewEnter", hxde)
				];
			
			$scope.$on("$destroy", function () {
				listeners.forEach(function ($off) { $off(); });
			});
    }
  };
}

appLoadingIndicatorDirective.$dependencies = ["$app", "$rootScope"];

if (window.ARENA) ARENA.$directive("appLoadingIndicator", appLoadingIndicatorDirective);
if (typeof module !== 'undefined') module.exports = appLoadingIndicatorDirective;