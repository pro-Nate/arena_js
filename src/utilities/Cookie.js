/** @class $cookie: 
 *
 * @example
 	  `$cookie
			.set(<string (name)>, <string (value)>[, <number (days)>, <string (path)>, <string (domain)>, <boolean (secure)>]);`
 * @example
 		`$cookie
			.get(<string (name)>);`
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */

var $cookie = (function () {
	function set(cookieName, cookieValue, lifeInDays, path, domain, secure) {
		var expiryDate
			, today = new Date();
		today.setTime( today.getTime() );
		
		if( lifeInDays ) lifeInDays = lifeInDays * 1000 * 60 * 60 * 24;
		expiryDate = new Date( today.getTime() + (lifeInDays || 0) );
		
		document.cookie = cookieName 
			+ "=" +escape( cookieValue ) 
			+ ( ( lifeInDays ) ? ";expires=" + expiryDate.toGMTString() : "" ) 
			+ ";path=" + ( path || "/" ) 
			+ ( ( domain ) ? ";domain=" + domain : "" ) 
			+ ( ( secure ) ? ";secure" : "" );
	}
	
	function get(cookieName) {
		if(document.cookie.length > 0){
			var cookieArray = document.cookie.split(";")
				, i, l, u, a;
			for (i = 0, l = cookieArray.length; i < l; i++) {
				u = cookieArray[i].substr(0, cookieArray[i].indexOf("="));
				a = cookieArray[i].substr(cookieArray[i].indexOf("=") + 1);
				u = u.replace(/^\s+|\s+$/g,"");
				if (u == cookieName) return decodeURI(a);
			}
		}
	}
	
	return { set: set, get: get };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = $cookie;
if (typeof define == 'function' && define.amd) define(function(){ return $cookie; });