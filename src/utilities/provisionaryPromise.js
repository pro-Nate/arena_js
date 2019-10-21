/** 
 * @function provisionaryPromise:
 * @description Runs a test on a loop 
 * 	and resolves a promise when test passes or rejects after time limit exired.
 *
 * @param {String} testName
 * @param {Function} test Test for promise (should return true if test passes)
 * @param {number} timeToWait time to wait before rejecting (default: 5000ms)
 * @param {number} interval frequency at which to repeat (default: 100ms)
 * @returns {Promise} resolved/rejected by success/failure
 * 
 * @example
		`var p = provisionaryPromise("loadGoogleFont", function(){ 
				return $(html).hasClass('wf-active') 
			}, 5000).then(function domSomething() { ... });`
		
 * @requires Promise
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */

var provisionaryPromise = (function (Promise) {
	
	return function (testName, test, timeToWait, interval) {
		return new Promise(function (resolve, reject) {
			var frequency = interval || 100
				, timer = timeToWait || 5000
				, testRunner
				, timeout = setTimeout(function stopTrying() {
						clearInterval(testRunner);
						reject(testName+" timed out in "+timer+"ms.");
					}, timer);

			testRunner = setInterval(function runTest() {
				var passingResult = test();
				if(!passingResult) return;
				clearTimeout(timeout);
				clearInterval(testRunner);
				resolve(passingResult);
			}, frequency);
		});
	}
})(require("./pLitr"));

if (typeof module !== 'undefined' && module.exports) module.exports = provisionaryPromise;
else if (typeof define == 'function' && define.amd) define(function(){ return provisionaryPromise; });
