/* polyfills.js
 * @description Polyfill missing javascript. 
 * @deprecated Should only be required for < ie9/Gecko1.8
 */


//String.startsWith
if (!String.prototype.startsWith) {
	String.prototype.startsWith = function(s) {
    return this.slice(0, s.length) == s
  };
}


//String.endsWith
if (!String.prototype.endsWith) {
	String.prototype.endsWith = function(s) {
    return -1 !== this.indexOf(s, this.length - s.length)
	};
}


// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {
    var k;

    if (this == null) 
      throw new TypeError('"this" is null or not defined');

    var o = Object(this);

    var len = o.length >>> 0;

    if (len === 0)
      return -1;

    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity)
      n = 0;

    if (n >= len)
      return -1;

    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    while (k < len) {
      if (k in o && o[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}


// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {
    var T, A, k;

    if (this == null) 
      throw new TypeError(' this is null or not defined');

    var O = Object(this);
    var len = O.length >>> 0;

    if (typeof callback !== 'function') 
      throw new TypeError(callback + ' is not a function');

    if (arguments.length > 1)
      T = thisArg;

    A = new Array(len);

    k = 0;

    while (k < len) {
      var kValue, mappedValue;

      if (k in O) {
        kValue = O[k];

        mappedValue = callback.call(T, kValue, k, O);

        A[k] = mappedValue;
      }
      k++;
    }

    return A;
  };
}


// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(callback, thisArg) {
    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If isCallable(callback) is false, throw a TypeError exception. // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //    This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty
      //    internal method of O with argument Pk.
      //    This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
if (!Array.prototype.filter) {
  Array.prototype.filter = function(fn, thisArg) {
    'use strict';
    if (this === void 0 || this === null || typeof fn !== 'function') throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    var result = [];
    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i];
        if (fn.call(thisArg || (void 0), val, i, t)) {
          result.push(val);
        }
      }
    }

    return result;
  };
}


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
if (typeof Object.create != 'function') {
  Object.create = (function() {
    var Temp = function() {};
    return function (prototype) {
      if (arguments.length > 1) {
        throw Error('Second argument not supported');
      }
      if(prototype !== Object(prototype) && prototype !== null) {
        throw TypeError('Argument must be an object or null');
      }
      if (prototype === null) { 
        throw Error('null [[Prototype]] not supported');
      }
      Temp.prototype = prototype;
      var result = new Temp();
      Temp.prototype = null;
      return result;
    };
  })();
}


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}
