/** 
 * @class RouterService
 * @description Using window.location and window.history,
 * 	serves as router and a URL/Location/History api. 
 *
 * @fires $app#$routeChange 
 * 				- {request: {requesteObject}}
 *				- when new route changed
 * @fires $app#$routeChange.start 
 * 				- {request: {requesteObject}, response: {responseObject}}
 *				- when route is about to be changed by http request
 * @fires $app#$routeChange.end 
 * 				- {request: {requesteObject}[, response: {responseObject} | error: {errorObject}]} 
 *				- when route has been changed by a http request
 * 
 * @example
		`$router.blacklist('/a/path');				// "/a/path" will be ignored
		 $('a').on('click', function (e) {
		 		var path = this.href;
				if ($router.isValidRoute(path)) {	// False if path starts with "/a/path"
					var request = {
						 url: path,
						 state: {
							 targetElement: '[main-view]';
							 method: "GET";
							 data: {g: 'thang'}
						 }
					 };
					e.preventDefault();
					$router.navigate({url: path});
					$router.get(request)
					 .then(function (response) {
						 $(request.state.targetElement).replaceWith(response.data.targetHtml);
					 });
				}
		 });`
 *
 * @requires $<jQuery>
 * @requires $app<ARENA>
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */

function routerProvider($, $app) {
	
	function RouterService() {
		var router = this, 
			_blacklist_ = [];
		router.base = "/";
		router.isInternalRoute = function (path) {
			return path.substring(0, router.base.length) === router.base
					|| path.indexOf(':') === -1;
		};
		router.isValidRoute = function (path) {
			if (!router.isInternalRoute(path)) return false;
			for (var l = _blacklist_.length, i = (path === router.base) ? l + 1 : 0; i < l; i++)
				if (path.indexOf(_blacklist_[i]) === 0) return false;
			return true;
		};
		router.blacklist = function (paths) { 
			if (Array.isArray(paths)) _blacklist_ = _blacklist_.concat(paths);
			else _blacklist_.push(paths);
		};
	}
	
	RouterService.prototype.evalHtmlResponse = function (html, targetSelector, skipSanitization) {
		var data = {html: html};
		if (!skipSanitization) data.sanitizedHtml = getDocumentHtml(html, true);
		var $html = $('<div>'+ (data.sanitizedHtml || html) +'</div>');
		data.metaData = getDocumentMeta($html);
		data.targetHtml = $html.find(targetSelector).get(0);
		data.scripts = getDocumentScript(html);
		$html = null;
		return data;
	};
	
	RouterService.prototype.navigate = function (request) {
		$app.$trigger({type: '$routeChange', request: request});
		
		if (!$app.$browser.historyAPI || !$app.$config.html5Mode)
			return window.location.href = request.url;

		window.history.pushState(request.state, request.title, request.url);	
		request.title && $app.updatePageTitle(request.title);
	};
	
	RouterService.prototype.ajax = function (request) {
		return new $app.Promise(function (resolve, reject) {
			$.ajax({
				url: request.url,
				data: request.data,
				type: request.method,
				headers: request.headers,
				success: function (data, textStatus, jqXHR) {
					resolve({
						data: data,
						request: request,
						textStatus: textStatus,
						jqXHR: jqXHR
					});
				},
				error: function (jqXHR, textStatus, errorThrown) {
					reject(jqXHR);
				}
			});
		});
	};
	
	RouterService.prototype.http = function (request) {
		var router = this;
		
		if (request.changeAppRoute) {
			$app.$trigger({type: '$routeChange.start', request: request});
			router.navigate(request);
		}
		
		function onSuccess(response) {
			if (request.state.targetElement) {
				var dataEval = router.evalHtmlResponse(response.data, request.state.targetElement);
				if (!dataEval.targetHtml) {
					var e = new Error('The target html "'+request.state.targetElement+'" was not found.');
					e.status = 500;
					throw e;
				}
				response.data = dataEval;
				if (!request.title && dataEval.metaData && dataEval.metaData.title)
					$app.updatePageTitle(dataEval.metaData.title);
			}
			if (request.changeAppRoute)
				$app.$trigger({type: '$routeChange.end', request: request, response: response});
			return response;
		}
		function onError(error) {
			if (request.changeAppRoute)
				$app.$trigger({type: '$routeChange.end', request: request, error: error});
			return $app.Promise.reject(error);
		}

		return router.ajax(request).then(onSuccess).catch(onError);;
	};
	
	return new RouterService();
}
routerProvider.$dependencies = ["$", "$app"];


function getDocumentScript(_html_) { 
	return _html_.match(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi) 
}

function getDocumentMeta($html) {
	return {
		title: decodeURI($html.find('.document-title:first').text()||"")
	};	// TODO: get more meta...
}

function getDocumentHtml(html, sanitize) {
	var result = String(html);
	if (!result.length) return;
	if (sanitize) {
		if (-1 === result.indexOf('<html')) {
			result = '<html><head></head><body>' + result + '</body></html>';
		}
		result = result.replace(/<\!DOCTYPE[^>]*>/i, '')
			.replace(/<(html|head|body|title|meta|link)([\s\>])/gi, '<div class="document-$1"$2')
			.replace(/<\/(html|head|body|title|meta|link)\>/gi, '</div>')
			.replace(/<script/gi, ' <!-- <script')
			.replace(/\/script>/gi, '/script> --> ');
	}
	return result.trim();
}

if (typeof module !== 'undefined' && module.exports) module.exports = routerProvider;