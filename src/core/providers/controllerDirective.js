/** 
 * @class controller
 * @constructs directive
 * @description Create scope and instantiate a controller. Optionally attach to scope.
 *  
 * @param {String} controller name of controller (Controller must be provided to app);
 * @param {String} controllerAs name of variable to add to scope as controller;
 *
 * @example 
		`<body>
				<header data-controller="headerController" controller-as="cx">
					<button on-interaction="click" execute-on-scope="cx.clickFn" />
				</header>
				<div>
					// ...
				</div>
				<footer />
		 </body>`
 *
 * @requires $app<ARENA>
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */
	
function controllerDirective($app) {
	return {
    scope: true,
		data: {
			controller: undefined,
			controllerAs: undefined,
		},
    link: function ($element, $scope, data) {
			var contoller;
			if ($app.isFunction(data.controller)) {
				contoller = $app.$provider.instantiate(data.controller, {$scope: $scope});
			} else if ($app.isString(data.controller)) {
				contoller = $app.$provider.controller(data.controller, null, {$scope: $scope});
			}
			if (contoller && $app.isString(data.controllerAs)) 
				$scope[data.controllerAs] = contoller;		
    }
  };
}
controllerDirective.$dependencies = ["$app"];

if (typeof module !== 'undefined' && module.exports) module.exports = controllerDirective;