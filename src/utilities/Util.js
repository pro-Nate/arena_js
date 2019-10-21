/** 
 * @class util.js
 * @description Collection of useful isht
 *
 * @requires browsxr
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 * @version: 0.1.2
 */

var utils = (function (browsxr) {
	var util = {requestAnimationFrame: getRaf(), cancelAnimationFrame: getCaf()};
	
	util.isUndefined = function(val) {return typeof val === 'undefined'; };
	util.isDefined = function(val) { return !util.isUndefined(val); };
	util.isFunction = function(val) { return typeof val === 'function'; };
	util.isObject = function(val) { return val !== null && typeof val === 'object'; };
	util.isString = function(val) { return typeof val === 'string'; };
	util.isNumber = function(val) { return typeof val === 'number'; };
	util.isArray = Array.isArray;
	
	util.arrayDiff = function (A, B) { return A.filter(function (x) { return B.indexOf(x) < 0; }); };
	
	util.objectAssign = Object.assign || function (target) {
		var output = Object(target);
		for (var i = 1, l = arguments.length; i < l; i++) {
			var source = arguments[i];
			if (source !== undefined && source !== null) {
				for (var k in source) {
					if (Object.prototype.hasOwnProperty.call(source, k))
						output[k] = source[k];
				}
			}
		}
		return output;
	};
	util.copyObject = function(obj) { return util.objectAssign({}, obj); };
	util.deleteObjProp = function(obj, prop) {
		try{ delete obj[prop]; }
		finally{ if(obj[prop]) obj[prop]=null; }
		return obj;
	};
	util.objectToArray = function(obj, arr) {
		if(obj instanceof Array) return obj;
		arr = arr || [];
		for(var prop in obj) arr.push(obj[prop]);
		return arr;
	};
	util.objectLength = function (obj) {
		if(typeof Object.keys == "function") return Object.keys(obj).length;
		var count = 0;
		for(var i in obj)
			if(obj && obj.hasOwnProperty && obj.hasOwnProperty(i)) count++; 
		return count;
	};
	util.objectKeys = function (obj) {
    var keys = [];
    for (var key in obj) if (obj.hasOwnProperty(key)) keys.push(key);
    return keys;
  };
	
	util.toCamelCalse = function(input, delimiters) { 
		var regX = new RegExp('['+(delimiters? delimiters:'-._') + '](.)', 'g');
		return input.toLowerCase().replace(regX, function(match, group1){ return group1.toUpperCase(); });
	};
	util.camelCaseTo = function (str, op) {
		return str.replace(/([a-z])([A-Z])/g, '$1'+(op||'-')+'$2').toLowerCase();
	};
	
	util.generateHash = function (length, useNumbers) {
		var text = "", characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		if(useNumbers) characters += "0123456789";
		for( var i=0, rl=length||5, l=characters.length; i < rl; i++ )
			text += characters.charAt(Math.floor(Math.random() * l));
		return text;
	};
	
	util.randomNumber = function (max, min) {
		if (util.isUndefined(max)) max = 1;
		if (util.isUndefined(min)) min = 0;
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	
	util.preventEvent = function (e, stopImmediate, allowPropagation) { 	// Block event and bubbling
		if(!e) return false;
		if(e.preventDefault) e.preventDefault();
		if(e.stopPropagation && !allowPropagation) e.stopPropagation();
		if (stopImmediate && e.stopImmediatePropagation) e.stopImmediatePropagation();
		return e;
	};
	
	util.debounce = function (fn, delay, range) {
		var timer = null;
		if(!delay) delay = 10;
		if(typeof range == "number") delay += util.randomNumber(range, Math.random()<0.5);
		return function(){
			var context = this, args = arguments;
			clearTimeout(timer);
			timer = setTimeout(function(){ fn.apply(context, args); }, delay);
		};
	};
	
	util.addCSSRule = function (selector, rules, index, sheet) {
		try{
			if(typeof sheet=="number") sheet = document.styleSheets[sheet];
			else if(sheet === undefined) sheet = document.styleSheets[document.styleSheets.length - 1];
			if(typeof index!=="number") index = sheet.cssRules.length;
			if("insertRule" in sheet) sheet.insertRule(selector + "{" + rules + "}", index);
			else if("addRule" in sheet) sheet.addRule(selector, rules, index);
		} catch (e) {}
	};
	
	util.updatePageTitle = function (title) {
		try {
			var t = title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
			document.getElementsByTagName('title')[0].innerHTML = t;
		} catch ( Exception ) { }
		document.title = title;
	};
	
	/** addNavigatorDataToHtml
	 *  @desciption adds window.navigator data to document element as attributes
	 *  @example: (target chrome13 on windows in css) 
	 *		html[data-useragent*='Chrome/13.0'][data-platform='Win32'] hits chrome13 on windows
	 */
	util.addNavigatorDataToHtml = function () {
		document.documentElement.setAttribute('data-useragent', navigator.userAgent);
		document.documentElement.setAttribute('data-platform', navigator.platform);
	};

	/** addJSClass
	 *  @desciption Adds "js" class name to element or document while removing "no-js" class
	 */
	util.addJSClass = function (e) { 
		var h = e||document.documentElement; 
		h.className = ('js '+h.className.replace('no-js','')).trim(); 
	}

	/* Damn you mobile browser address bar -__- */
	util.getInnerVH = function () {	
		return Math.min(window.innerHeight, document.documentElement.clientHeight, window.screen?window.screen.height:window.outerHeight);
	}
	util.setInnerVHVar = function (vhVarName) {	
		document.documentElement.style.setProperty(vhVarName||'--vh100', `${util.getInnerVH()}px`);
	}
	
	/** The following depend on jQuery or a compatible replacement availble as `$`
	 */
	util.toggleOverflow = (function (classn) {
		function tog(el, _hiding){
			return $(el)[_hiding===undefined? "toggleClass" : (_hiding? "addClass":"removeClass")](classn);
		}
		tog.off = function (l) { return tog(l, true) };
		tog.on = function (l) { return tog(l, false) };
		util.addCSSRule("."+classn, "overflow:hidden !important");
		if(browsxr.IOS) util.addCSSRule("html."+classn+",body."+classn, "position:relative !important");
		return tog;
	})("toggleOverflowClass_overflow-on");

	return util;
})(require("./browsxr.js"));

function getRaf() {
	var lastFrameTime = 0;
	var raf = window.requestAnimationFrame
		|| window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame
		|| function (callback) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastFrameTime));
				var id = window.setTimeout(function() { callback(currTime + timeToCall) }, timeToCall);
				lastFrameTime = currTime + timeToCall;
				return id;
		};
	return function (cb) { return raf.call(window, cb) }
}
function getCaf() {
	var caf = window.cancelAnimationFrame
			|| window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame
			|| window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame
			|| function (id) { clearTimeout(id); }
	return function (id) { return caf.call(window, id) }
}

if (typeof module !== 'undefined' && module.exports) module.exports = utils;
else if (typeof define == 'function' && define.amd) define(function(){ return utils; });