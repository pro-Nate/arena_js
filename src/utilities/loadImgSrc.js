/** 
 * @method loadImgSrc
 * @description Load an image, resolving a promise when done.
 *
 * @example 
 		`loadImgSrc("an/image/url.png").then(doSomeThing)`
 *
 * @returns Promise
 * @requires Promise
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */

var loadImgSrc = (function(Promise){
	
	return function (src) {
		return new Promise(function (resolve, reject) {
			var image = new Image();		
			image.onload = resolve;
			image.onerror = reject;
  		image.src = src;
			if (image.complete && image.naturalWidth) 
				resolve(); 			//Hack for browsers that don't trigger load event for cached content
		});
	};
	
})(require("./pLitr"));

if (typeof module !== 'undefined' && module.exports) module.exports = loadImgSrc;
else if (typeof define == 'function' && define.amd) define(function(){ return loadImgSrc; });