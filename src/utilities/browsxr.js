/** browsxr.js:  
 * @description object containing some useful info about the browser
 * @example
		 browser.cookiesEnabled @Returns true if cookies are available
		 browser.IE = @Returns a negative value if the browser is not IE or the version number
		 browser.prefix @Returns prefix strings used by the browser		 
		 browser.requestAnimationFrame @Returns window.requestAnimationFrame or polyfill
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 * @version: 1.0
 */

var browsxr = (function (){
	var d = document.documentElement 
		, ua = navigator.userAgent 
		, s = document.body.style
		, documentComputedStyle = window.getComputedStyle? window.getComputedStyle(d) : [];
	
	var b = {
		lastAnimationFrame: 0
	};
	
	b.cookiesEnabled = navigator.cookieEnabled;
	b.IE = (/msie/i.test(ua) && parseFloat)? parseFloat(navigator.appVersion.split("MSIE")[1]) : 0;
	b.historyAPI = !!(window.history && history.pushState);
	b.Chrome = (!b.IE && /Chrome/i.test(ua));						// Not reliable
	b.Webkit = (!b.IE && (b.Chrome || /Safari/.test(ua)));
	b.Opera = (!b.IE && !b.Webkit && /opera/i.test(ua));
	b.IOS = ua.match(/(iPad|iPhone|iPod)/i) || false;
	b.Mobile = (Array.prototype.indexOf && (" " + d.className + " ").replace(/[\n\t]/g, " ").indexOf("mobile-browser") > -1);
	b.mediaQueries = !window.Modernizr? 0 : (Modernizr.mq('only all'))? 1 : -1;	// Depends on Modernizr
	b.touch = 'ontouchstart' in document.body;
	b.backgroundSizing = !!('backgroundSize' in d.style);
	b.prefix = (function(){
		if (documentComputedStyle.length) {
			var pre = ( 
						Array.prototype.slice.call(documentComputedStyle).join('').match(/-(moz|webkit|ms|khtml)-/) 
						|| (documentComputedStyle.OLink === '' && ['', 'o']) 
					)[1]
				, dom = ('WebKit|Moz|MS|O|Khtml').match(new RegExp('(' + pre + ')', 'i'))[1];
			return { dom: dom, lowercase: pre, css: '-' + pre + '-', js: pre[0].toUpperCase() + pre.substr(1) };
		} else {
			return { dom: 'MS', lowercase: 'ms', css: '-ms-', js: 'Ms' };
		}
	})();
	b.placeholders = ('placeholder' in document.createElement('input'));
	b.supports = function(prop){
		if(prop in documentComputedStyle) return prop;
		prop = prop.replace(/^[a-z]/, function(val){ return val.toUpperCase(); });
		if(b.prefix.js + prop in s) return b.prefix.lowercase + prop;
		return false;
	};
	b.supportsSvgImg = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
	b.transitions = b.supports('transition');
	if(b.transitions) b.transitions = {
		start: (b.transitions==='transition'? 'transitionstart' : b.transitions+'Start'),
		end: (b.transitions==='transition'? 'transitionend' : b.transitions+'End')
	}
	b.animations = b.supports('animation');
	if(b.animations) b.animations = {
		start: (b.animations==='animation'? 'animationstart' : b.animations+'Start'),
		end: (b.animations==='animation'? 'animationend' : b.animations+'End')
	}
	b.requestAnimationFrame = window.requestAnimationFrame
		|| window[b.prefix.lowercase+'RequestAnimationFrame']
		|| function(callback) {
				var ct = new Date().getTime(), ttc = Math.max(0, 16 - (ct - b.lastAnimationFrame));
				b.lastAnimationFrame = ct + ttc;
				return window.setTimeout(function(){ callback(ct + ttc); }, ttc);
			};

	return b;
})();

if (typeof module !== 'undefined' && module.exports) module.exports = browsxr;
else if (typeof define == 'function' && define.amd) define(function(){ return browsxr; });