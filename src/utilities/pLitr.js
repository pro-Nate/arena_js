/** 
 * @description: Stripped down ES6 compatible promises.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * @example: 
		`new Promise(function(resolve, reject){ ... } )
					.then(function(result){ ... })
					.catch(function(error){ ... });`
 * @see: Chris Davies https://github.com/chrisdavies/plite
 */

function PLitr(resolver) {
  var promiseChain = function () {},
      resultGetter;

  function buildChain(onsuccess, onfailure) {
    var prevChain = promiseChain;
    promiseChain = function () {
      prevChain();
      resultGetter(onsuccess, onfailure);
    };
	}
	
  function processResult(result, callback, reject) {
    if (result && result.then && result.catch) {
      result.then(function (data) { processResult(data, callback, reject) })
						.catch(function (err) { processResult(err, reject, reject) });
    } else {
      callback(result);
		}
	}
	
  function setResult(callbackRunner) {
    resultGetter = function (successCallback, failCallback) {
      try {
        callbackRunner(successCallback, failCallback);
      } catch (ex) {
        failCallback(ex);
      }
    };
    promiseChain();
    promiseChain = undefined;
	}
	
  function setSuccess(data) {
    setResult(function (success) { success(data) });
  }
  function setError(err) {
    setResult(function (success, fail) { fail(err) });
  }

	var p = {
		then: function (callback) {
			var resolveCallback = resultGetter || buildChain;
			return PLitr(function (resolve, reject) {
				resolveCallback(function (data) { resolve(callback(data)) }, reject);
			});
		},
		catch: function (callback) {
			var resolveCallback = resultGetter || buildChain;
			return PLitr(function (resolve, reject) {
				resolveCallback(resolve, function (err) { reject(callback(err)) });
			});
		},
		resolve: function (result) {
			!resultGetter && processResult(result, setSuccess, setError);
		},
		reject: function (err) {
			!resultGetter && processResult(err, setError, setError);
		}
	};

  resolver && resolver(p.resolve, p.reject);
  return p;
}

PLitr.all = function (promises) {
	promises = promises || [];
	return PLitr(function (resolve, reject) {
		var len = promises.length,
				count = len;
		if(!len) return resolve();

		function decrement() { --count <= 0 && resolve(promises); }

		function waitFor(p, i) {
			if (p && p.then)
				p.then(function (result) {
					promises[i] = result;
					decrement();
				}).catch(reject);
			else
				decrement();
		}

		for (var i = 0; i < len; ++i) waitFor(promises[i], i);
	});
};

if (typeof module !== 'undefined' && module.exports) module.exports = window.Promise || PLitr;
else if (typeof define == 'function' && define.amd) define(function(){ return window.Promise || PLitr });