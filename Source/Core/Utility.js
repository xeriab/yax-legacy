/**
 * Y Core | Utility
 *
 * Another Y's utilities and shortcuts [CORE]
 *
 * @version     0.15
 * @depends:    Core, Global
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function () {

	'use strict';

	var escape = encodeURIComponent;

	//---

	// BEGIN OF [Private Functions]

	//...

	// END OF [Private Functions]

	/**
	 * Y.Utility contains various utility functions used throughout Y code.
	 */
	Y.Utility = {
		LastUID: 0,

		// Create an object from a given prototype
		Create: Object.create || (function () {
			/**
			 *
			 * @constructor
			 * @return {null}
			 */
			function TempFunction() {
				//...
			}

			return function (tempPrototype) {
				TempFunction.prototype = tempPrototype;
				return new TempFunction();
			};
		}()),

		// Return unique ID of an object
		Stamp: function (object) {
			// jshint camelcase: false
			object.YID = object.YID || ++Y.Utility.LastUID;

			return object.YID;
		},

		// Bind a function to be called with a given context
		Bind: function (func, object) {
			var Slice = Array.prototype.slice,
				args = Slice.call(arguments, 2);

			if (func.bind) {
				return func.bind.apply(func, Slice.call(arguments, 1));
			}

			return function () {
				return func.apply(object, args.length ? args.concat(Slice.call(arguments)) : arguments);
			};
		},

		// Return a function that won't be called more often than the given interval
		Throttle: function (func, time, context) {
			var lock,
				args,
				wrapperFunction,
				later;

			later = function () {
				// Reset lock and call if queued
				lock = false;

				if (args) {
					wrapperFunction.apply(context, args);
					args = false;
				}
			};

			wrapperFunction = function () {
				if (lock) {
					// Called too soon, queue to call later
					args = arguments;

				} else {
					// Call and lock until later
					func.apply(context, arguments);
					setTimeout(later, time);
					lock = true;
				}
			};

			return wrapperFunction;
		},

		// Round a given number to a given precision
		formatNumber: function (num, digits) {
			var pow = Math.pow(10, digits || 5);
			return Math.round(num * pow) / pow;
		},

		/**
		 * Do nothing (used as a Noop throughout the code)
		 * @returns {null}
		 * @constructor
		 */
		Noop: function () {},

		// Trim whitespace from both sides of a string
		Trim: function (str) {
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
			return Y.Utility.Trim(string).split(/\s+/);
		},

		// Set options to an object, inheriting parent's options as well
		setOptions: function (object, options) {
			var x;

			if (!object.hasOwnProperty('Options')) {
				object.Options = object.Options ? Y.Utility.Create(object.Options) : {};
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

		Serialise: function (parameters, object, traditional, scope) {
			var type,
				array = Y.Lang.isArray(object),
				hash = Y.Lang.isPlainObject(object);

			Y.Each(object, function (key, value) {
				type = Y.Lang.type(value);

				if (scope) {
					// key = traditional ? scope : scope + '[' + (array ? '' : key) + ']';
					key = traditional ?
						scope :
						scope + '[' + (hash || Y.Lang.isObject(type) || Y.Lang.isArray(type) ? key : '') + ']';
				}

				// Handle data in serializeArray() format
				if (!scope && array) {
					parameters.add(value.name, value.value);
				}
				// Recurse into nested objects
				else if (Y.Lang.isArray(type) || (!traditional && Y.Lang.isObject(type))) {
					Y.Utility.Serialise(parameters, value, traditional, key);
				} else {
					parameters.add(key, value);
				}
			});
		},

		/**
		 * @return {string}
		 */
		Parameters: function (object, traditional) {
			var params = [];

			params.add = function (key, value) {
				this.push(escape(key) + '=' + escape(value));
			};

			Y.Utility.Serialise(params, object, traditional);

			return params.join('&').replace(/%20/g, '+');
		},

		toString: function () {
			return '[YAX Utility]';
		}
	}; // END OF Y.Utility OBJECT

	//---

	Y.Util = Y.Utility;

	// Shortcuts for most used Utility functions
	Y.Bind = Y.Utility.Bind;
	Y.Stamp = Y.Utility.Stamp;
	// Y.SetOptions = Y.Utility.setOptions;

	Y.Lang.noop = Y.Lang.Noop = Y.Utility.Noop;
	Y.Lang.trim = Y.Utility.Trim;

	Y.Lang.reReplace = Y.Utility.reStringReplace;
	Y.Lang.strReplace = Y.Utility.stringReplace;
	Y.Lang.throttle = Y.Utility.Throttle;
	Y.Lang.parameters = Y.Utility.Parameters;

	//---

	Y.Utility.toString = function () {
		return '[YAX Utility]';
	};

	//---

}());

//---