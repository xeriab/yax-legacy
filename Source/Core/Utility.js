/**
 * YAX Utilities and Tools
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function () {

	//---

	'use strict';

	// Reusable constructor function for prototype setting.
	var rcfunc = function () {};

	// BEGIN OF [Private Functions]

	//...

	// END OF [Private Functions]

	/**
	 * Y.Util contains various utility functions used throughout Y code.
	 */
	Y.Util = {
		lastUID: 0,

		// Create an object from a given prototype
		create: Object.create || (function () {
			/**
			 *
			 * @constructor
			 * @return {null}
			 */
			function tempFunc() {}

			return function (tempPrototype) {
				tempFunc.prototype = tempPrototype;
				return new tempFunc();
			};
		}()),

		// Return unique ID of an object
		stamp: function (object) {
			// jshint camelcase: false
			object.YID = object.YID || ++Y.Util.lastUID;

			return object.YID;
		},

		// Bind a function to be called with a given context
		bind: function (callback, object) {
			var args = Y.G.slice.call(arguments, 2);
			var bound;

			if (Y.G.FuncProto.bind && callback.bind === Y.G.FuncProto.bind) {
				return Y.G.FuncProto.bind.apply(callback, Y.G.slice.call(arguments, 1));
			}

			if (!Y.isFunction(callback)) {
				throw new TypeError('Bind must be called on a function');
			}

			bound = function () {
				if (!(this instanceof bound)) {
					// return callback.apply(object, args.concat(Y.G.slice.call(arguments)));
					return callback.apply(object, args.length ? args.concat(Y.G.slice.call(arguments)) : arguments);
				}

				rcfunc.prototype = callback.prototype;

				var self = new rcfunc();

				rcfunc.prototype = null;

				var result = callback.apply(self, args.concat(Y.G.slice.call(arguments)));

				if (Y.isObject(result)) {
					return result;
				}

				return self;
			};

			return bound;
		},

		// Return a function that won't be called more often than the given interval
		throttle: function (callback, wait, context) {
			var lock;
			var args;
			var wrapperFunc;
			var later;

			later = function () {
				// Reset lock and call if queued
				lock = false;

				if (args) {
					wrapperFunc.apply(context, args);
					args = false;
				}
			};

			wrapperFunc = function () {
				if (lock) {
					// Called too soon, queue to call later
					args = arguments;

				} else {
					// Call and lock until later
					callback.apply(context, arguments);
					setTimeout(later, wait);
					lock = true;
				}
			};

			return wrapperFunc;
		},

		// Return a function that won't be called more often than the given interval
		newThrottle: function (callback, wait, options) {
			// var lock;
			var args;
			var wrapperFunc;
			var later;
			var context;
			var result;
			var timeout = null;
			var previous = 0;

			if (!options) {
				options = {};
			}

			later = function () {
				/** @namespace options.leading */
				/** @namespace options.trailing */
				previous = options.leading === false ? 0 : Y.now();
				timeout = null;
				result = callback.apply(context, args);

				if (!timeout) {
					context = args = null;
				}
			};

			wrapperFunc = function () {
				var now = Y.now();

				if (!previous && options.leading === false) {
					previous = now;
				}

				var remaining = wait - (now - previous);

				context = this;

				args = arguments;

				if (remaining <= 0 || remaining > wait) {
					clearTimeout(timeout);
					timeout = null;
					previous = now;
					result = callback.apply(context, args);

					if (!timeout) {
						context = args = null;
					}
				} else if (!timeout && options.trailing !== false) {
					timeout = setTimeout(later, remaining);
				}

				return result;
			};

			return wrapperFunc;
		},

		// Round a given number to a given precision
		formatNumber: function (num, digits) {
			var pow = Math.pow(10, digits || 5);
			return Math.round(num * pow) / pow;
		},

		/**
		 * Do nothing (used as a noop throughout the code)
		 * @returns {object}
		 * @constructor
		 */
		noop: function () {},

		// Trim whitespace from both sides of a string
		trim: function (str) {
			return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
		},

		// Standard string replace functionality
		stringReplace: function (needle, replacement, haystack) {
			var temp = haystack.split(needle);
			return temp.join(replacement);
		},

		// Needle may be a regular expression
		reStringReplace: function (needle, replacement, haystack) {
			var temp = new RegExp(needle, 'g');
			return haystack.replace(temp, replacement);
		},

		// Split a string into words
		splitWords: function (string) {
			return Y.Util.trim(string).split(/\s+/);
		},

		// Set options to an object, inheriting parent's options as well
		setOptions: function (object, options) {
			var x;

			if (!object.hasOwnProperty('Options')) {
				object.Options = object.Options ? Y.Util.create(object.Options) : {};
			}

			for (x in options) {
				if (options.hasOwnProperty(x)) {
					object.Options[x] = options[x];
				}
			}

			return object.Options;
		},

		isArray: Array.isArray || function (object) {
			return (Object.prototype.toString.call(object) === '[object Array]');
		},

		// Minimal image URI, set to an image when disposing to flush memory
		emptyImageUrl: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',

		serialise: function (parameters, object, traditional, scope) {
			var type,
				array = Y.isArray(object),
				hash = Y.isPlainObject(object);

			Y.each(object, function (key, value) {
				type = Y.type(value);

				if (scope) {
					// key = traditional ? scope : scope + '[' + (array ? '' : key) + ']';
					key = traditional ?
						scope :
						scope + '[' + (hash || Y.isObject(type) || Y.isArray(type) ? key : '') + ']';
				}

				// Handle data in serializeArray() format
				if (!scope && array) {
					parameters.add(value.name, value.value);
				}
				// Recurse into nested objects
				else if (Y.isArray(type) || (!traditional && Y.isObject(type))) {
					Y.Util.serialise(parameters, value, traditional, key);
				} else {
					parameters.add(key, value);
				}
			});
		}
	}; // END OF Y.Util OBJECT

	//---

	// Shortcuts for most used Utility functions
	Y.bind = Y.Util.bind;
	Y.stamp = Y.Util.stamp;
	Y.SetOptions = Y.Util.setOptions;

	Y.noop = Y.Util.noop;
	Y.trim = Y.Util.trim;

	Y.reStrReplace = Y.Util.reStringReplace;
	Y.strReplace = Y.Util.stringReplace;
	Y.throttle = Y.Util.throttle;

	//---

}());

// FILE: ./Source/Core/Utility.js

//---