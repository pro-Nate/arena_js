/** 
 * @method viewUpdater
 * @description Load a view from a remote source and replace a target view with it's content, 
 * resolving a promise when done.
 *
 * @example 
		`var updateTarget = viewUpdater($app, $scope, $element, $target);
		$(window).on('popstate', function(event) {
			updateTarget({
				state: event.originalEvent.state, 
				title: event.originalEvent.state.title, 
				url: (window.location.pathname+window.location.search)
			}, {
				mainView: $target.selector,
				scrollTo: true,
				cssTransitions: true,
				requestMethod: 'GET',
				requestHeaders: undefined,
				loadingClass: 'view-loading',
				targetLoadingClass: 'ajax-loading',
				errorPage: '/404',
				onServerError: function (e, request) { alert('Server Error.') }
			})
			.then(function ($newTargetScope) { ... });
		})`
 *
 * @returns Promise
 * @requires $scope<Scope>
 * @requires $app<ARENA>
 * @requires $element<HTMLElement>
 * @requires $target<HTMLElement>
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */

function viewUpdater ($app, $scope, $element, $target) {
	return function updateTarget(request, data) {
		var useCssTransitions = data.cssTransitions && $app.$browser.transitions,
			transitionInClass = data.targetLoadingClass+'-transition-in',
			transitionOutClass = data.targetLoadingClass+'-transition-out',
			monitor;

		$scope.$broadcast({
			type: '$viewLoading', 
			request: request
		});
		
		if (!useCssTransitions || $target.hasClass(transitionOutClass)) return htmlUpdate();
		
		$element.addClass(data.loadingClass);
		monitor = new $app.TransitionMonitor($target.removeClass(transitionInClass));
		
		function httpSuccess(response) {	
			$scope.$broadcast({
				type: '$viewLoaded',
				request: request,
				response: response
			});

			var $replacement = $app.$(response.data.targetHtml).addClass(data.targetLoadingClass);
			$scope.$broadcast({
				type: '$viewExit',
				$target: $target,
				$replacement: $replacement
			});
			$target.triggerHandler('$destroy');

			if ($app.isFunction(data.scrollTo)) 
				data.scrollTo($target) && $app.$scrollMonitor.scrollTo($target, 0);
			else if (data.scrollTo) 
				window.scrollTo($target.offset().top, $target.offset().left);

			$replacement.insertBefore($target);
			$target.remove();

			return $app.$compiler
				.compile($replacement[0], null, true)
				.then(function ($targetScope) {
					$target = $replacement;
					$element.removeClass(data.loadingClass);
					$scope.$broadcast({
						type: '$viewEnter',
						$target: $replacement
					});
					
					if (!useCssTransitions) {
						$replacement.removeClass(data.targetLoadingClass);
						return $targetScope;
					} else {
						return new $app.Promise(function (resolve) {
							monitor = new $app.TransitionMonitor($replacement);
							$app.requestAnimationFrame(function () {
								var endUpdate = function () {
									monitor.destroy();
									$replacement.removeClass(data.targetLoadingClass);
									resolve($targetScope);
								}
								monitor.addClass(transitionInClass).then(endUpdate).catch(endUpdate);
							});
						});
					}
				});
		}

		function httpError(e) { 
			if (404===e.status) {
				if (request.url.indexOf(data.errorPage) < 0) {
					return updateTarget({
						state: {targetElement: data.mainView}, 
						title: request.state.title, 
						url: data.errorPage,
						redirectedUrl: request.url
					}, data);
				} else {
					alert('The path '+ (request.redirectedUrl || request.url) +' could not be found...');
				}
			} else if(500===e.status && data.onServerError) {
				data.onServerError(e, request);
			}
			console.error("Http error: ", e);
			$scope.$broadcast({
				type: '$viewEnter',
				error: e
			});
			$target.removeClass(transitionOutClass).addClass(transitionInClass);
			$element.removeClass(data.loadingClass);
		}

		function htmlUpdate() {
			monitor && monitor.destroy();
			return $app.$provider.service("$router").http(request).then(httpSuccess).catch(httpError);
		}

		return monitor.addClass(transitionOutClass).then(htmlUpdate).catch(htmlUpdate);
	}
}

if (typeof module !== 'undefined' && module.exports) module.exports = viewUpdater;
else if (typeof define == 'function' && define.amd) define(function(){ return viewUpdater });