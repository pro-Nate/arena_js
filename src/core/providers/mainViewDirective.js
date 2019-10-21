/** 
 * @class MainView
 * @constructs directive
 * @description Use ajax to update part of your page. 
 *    When Links are clicked within the linked element, a new route is requested with 
 * 		the target being main-view target.
 *    When route has been resolved, main-view target is replaced.
 *		The mainView target should have a scope so it can be safely $destroyed without 
 * 		leaving behind orphaned scopes; if it does not, one will be created.
 *    and compiled with that of the page at new route. 
 *		The page must contain an element matching the main-view target selector.
 *    The http GET response must contain an element matching the main-view target selector.
 *
 * @param {String} mainView Target element selector. Default: "body";
 * @param {Boolean} changeAppRoute Allow $app to change route when updating target content. Default: true;
 * @param {Boolean | Function} scrollTo Scroll to target on update. Default: true;
 * @param {String} linkSelector Only matching links will trigger update. Default: 'a,[ajax-href]';
 * @param {String} linkFilter Matching links will not trigger update. Default: '.ajax-ignore';
 * @param {String} loadingClass Class added to linked element during update. Default: 'view-loading';
 * @param {String} targetLoadingClass Class added to target (and replacement) during update. Default: 'ajax-loading';
 *
 * @fires $scope#$viewLoading - {request: {requesteObject}}
 *						- $broadcasted when new route requested with this target
 * @fires $scope#$viewLoaded - {request: {requesteObject}, response: {responseObject}}
 *						- $broadcasted when new route resolved with this target
 * @fires $scope#$viewExit - {$target: {Element}[, $replacement: {Element}]} 
 *						- $broadcasted when view about to be replaced
 * @fires $scope#$viewEnter - {$target: {Element}}
 *						- $broadcasted when view has been replaced
 * 
 * @example 
		`<body main-view="#target">	//Links in here will update #target
				<header>
					<nav />
				</header>

				<main id="target" controller="view-controller">
					// This content updated via xhr
					<section other-view="[other-view]">
						// This content also updated via xhr but controlled separately
					</section>
				</main>

				<footer />
		 
				<script>
					var APP = new ARENA('YOUR APP');
					APP.$provider.alias('mainView', 'otherView', function (directive) {
						var data = directive.data;
						directive.data = function ($element) {
							return Object.assign({}, data, {mainView: $element.data('other-view')});
						};
						return directive;
					});
				</script>
		 </body>`
 *
 * @requires $<jQuery>
 * @requires $app
 * @requires $router
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */	
	
function mainViewDirective($, $app, $router, $window, $rootElement) {
	var ROOT_VIEW, 
			ACTIVE_VIEWS = {};
	return {
    scope: true,
		data: {
			mainView: 'body',
			scrollTo: true,
			cssTransitions: false,
			changeAppRoute: true,
			linkSelector: 'a,[ajax-href]',
			linkFilter: '.ajax-ignore',
			requestMethod: 'GET',
			requestHeaders: undefined,
			loadingClass: 'view-loading',
			targetLoadingClass: 'ajax-loading',
			errorPage: '/404',
			onServerError: function (e, request) {
				if (window.confirm("There has been a server error, do you want to reload the page?"))
					window.location.replace(request.url)
			}
		},
    link: function ($element, $scope, data) {
			var updateTarget, $target = $rootElement.find(data.mainView);
			if (!$target.length) return;
			else if (!$target.data("controller")) $target.attr("controller", 'mainViewTarget');

			if ($app.$browser.historyAPI && $app.$config.html5Mode && data.changeAppRoute) {
				updateTarget = $app.viewUpdater($app, $scope, $element, $target);
				setInitialState();
			
				$element.on("$compile.end", function () {
					$window.on('popstate', handleStateChange);
					$element.on('click', data.linkSelector, handleClicks);
	
					$scope.$on("$destroy", function () {
						if (ACTIVE_VIEWS[data.mainView]) ACTIVE_VIEWS[data.mainView] = undefined;
						if (ROOT_VIEW === data.mainView) ROOT_VIEW = undefined;
						$window.off('popstate', handleStateChange);
						$element.off('click', data.linkSelector, handleClicks);
					});
				});
			}

			function setInitialState() {
				ACTIVE_VIEWS[data.mainView] = {triggerElement: $element};
				if (ROOT_VIEW && window.history.state && window.history.state.$$ARENA) return; 
				window.history.replaceState(buildStateObject({}, document.title), document.title, window.location.href);
				ROOT_VIEW = data.mainView;
			}	

			function buildStateObject(options, title) {
				var state = {$$ARENA: $app.$config.name, title: title};
				state.targetElement = options.targetElement || data.mainView;
				state.method = options.requestMethod || data.requestMethod;
				state.data = options.requestData || data.requestData;
				state.headers = options.requestHeaders || data.requestHeaders;
				return state;
			}
			
			function handleClicks(event) {
				var $this, clickData,
						request = {changeAppRoute: data.changeAppRoute};
				
				if (event.which == 2 || event.metaKey || ($this = $(this)).is(data.linkFilter))
					return true;
				
				clickData = $this.data();
				
				request.url = $this.attr('href') || clickData.ajaxHref;
				if (request.url.indexOf("#") === 0) return true;	
				if (request.url == window.location.pathname) return false;	
				if (!$router.isValidRoute(request.url)) return true;	
				
				if ($app.isDefined(clickData.changeAppRoute)) 
					request.changeAppRoute = clickData.changeAppRoute;	
				
				if ($app.isFunction(clickData.ajaxRequestCallback)) 
					request.callback = clickData.ajaxRequestCallback;
				
				request.state = buildStateObject(clickData, request.title);
				
				if (request.changeAppRoute && !($app.$browser.historyAPI && $app.$config.html5Mode)) 
					return true;
				
				event.preventDefault();
				if (ROOT_VIEW !== data.mainView) event.stopPropagation();		//Only handle clicks once
				updateTarget(request, data);
			}
			
			function handleStateChange(event) {
				if (!event.originalEvent.state) return;
				var targetView = event.originalEvent.state.targetElement;
				
				//Root view must handle odd cases
				if (ROOT_VIEW === data.mainView && (!targetView || !ACTIVE_VIEWS[targetView] || !$(targetView).length))
						targetView = event.originalEvent.state.targetElement = ROOT_VIEW;
				
				if (targetView === data.mainView) {
						updateTarget({
							state: event.originalEvent.state, 
							title: event.originalEvent.state.title, 
							url: (window.location.pathname+window.location.search)
						}, data);
				}
			}	
    }
  }
}
mainViewDirective.$dependencies = ["$", "$app", "$router", "$window", "$rootElement"];

if (typeof module !== 'undefined' && module.exports) module.exports = mainViewDirective;
