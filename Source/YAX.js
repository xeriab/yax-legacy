/**
 * YAX
 *
 * The main YAX.
 *
 * @version     0.15
 * @depends:    None
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint undef: true */
/*jshint unused: true */
/*global exports, define, module */

(function () {
	// 'use strict';

	var Y = Object.create({});

	var isNode = false;

	// Establish the root object, `window` in the browser, or `exports` on the server.
	var root = this;

	// Save the previous value of the `Y` or `YAX` variable.
	var previousYax = root.Y || root.YAX || null;

	// Save bytes in the minified (but not gzipped) version:
	var ArrayProto = Array.prototype;
	var ObjProto = Object.prototype;
	var FuncProto = Function.prototype;

	// Create quick reference variables for speed access to core prototypes.
	var Push = ArrayProto.push;
	var Filter = ArrayProto.filter;
	var Slice = ArrayProto.slice;
	var Concat = ArrayProto.concat;
	var toString = ObjProto.toString;
	var HasOwnProperty = ObjProto.hasOwnProperty;

	var Console = root.console;

	//---

	// Create a safe reference to the YAX object for use below.
	/*Y = function (object) {
		if (object instanceof Y) {
			return object;
		}

		if (!(this instanceof Y)) {
			return new Y(object);
		}

		this._WRAPPED = object;
	};*/

	//---

	function expose() {
		// Save the previous value of the `Y` variable.
		Y.noConflict = function () {
			root.Y = previousYax;
			return this;
		};

		root.Y = root.YAX = Y;

		isNode = false;
	}

	//---

	// Export the YAX object for **Node.js**, with
	// backwards-compatibility for the old `require()` API. If we're in
	// the browser, add `Y` as a global object.
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			// exports = module.exports = Y;
			module.exports = Y;
		}

		exports.Y = exports.YAX = Y;

		isNode = true;
	}

	//---

	Y.toString = function () {
		return '[YAX]';
	};

	//---

	if (isNode) {
		isNode = true;

		Y.ENV = Object.create(null);
		Y.ENV.Type = 'Nodejs';

		Console.info('[INFO] Running YAX.JS in "Node" Environment!');
	} else {
		isNode = false;

		Y.ENV = Object.create(null);
		Y.ENV.Type = 'Browser';

		Y.Window = this;
		Y.Document = Y.Window.document;
		Y.Location = Y.Window.location;

		Console.info('[INFO] Running YAX.JS in "Browser" Environment!');
	}

	//---

	// BEGIN OF [Private Functions]

	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};

	String.prototype.toCamel = function () {
		return this.replace(/(\-[a-z])/g, function ($1) {
			return $1.toUpperCase().replace('-', '');
		});
	};

	String.prototype.toDash = function () {
		return this.replace(/([A-Z])/g, function ($1) {
			return '-' + $1.toLowerCase();
		});
	};

	String.prototype.toUnderscore = function () {
		return this.replace(/([A-Z])/g, function ($1) {
			return '_' + $1.toLowerCase();
		});
	};

	String.prototype.toArray = function () {
		var array = [],
			x;

		for (x = 0; x < this.length; x++) {
			array.push(this.charAt(x));
		}

		return array;
	};

	//---

	Y._INFO = Object.create({});

	//---

	Y.VERSION = Y._INFO.VERSION = 0.18;
	Y._INFO.BUILD = 4352;
	Y._INFO.STATUS = 'dev';
	Y._INFO.CODENAME = 'Raghda';

	Y.hasProperty = ({}).hasOwnProperty;

	/**
	 * YAX._CONFIG_STORAGE
	 */
	Y._CONFIG_STORAGE = Object.create({});

	/**
	 * YAX.Lang
	 */
	Y.Lang = Object.create({});

	/**
	 * YAX._GLOBALS
	 */
	Y._GLOBALS = Y.G = Object.create({});

	/**
	 * YAX.Mixin
	 */
	Y.Mixin = Object.create({});

	/**
	 * YAX.Settings
	 */
	Y.Settings = Object.create({});

	//---

	Y.G.isNodeJs = isNode;
	Y.G.Push = Push;
	Y.G.Slice = Slice;
	Y.G.Concat = Concat;
	Y.G.ToString = toString;
	Y.G.Filter = Filter;

	Y.HasOwnProperty = HasOwnProperty;

	Y.G.FuncProto = FuncProto;
	Y.G.ArrayProto = ArrayProto;
	Y.G.ObjProto = ObjProto;
	Y.G.IndexOf = ArrayProto.indexOf;
	Y.G.Push = ArrayProto.push;

	/** @namespace root.R */
	/** @namespace root.D */
	Y.Require = root.R || null;
	Y.Define = root.D || null;

	//---

	/** @namespace define.amd */

	// AMD registration happens at the end for compatibility with AMD loaders
	// that may not enforce next-turn semantics on modules. Even though general
	// practice for AMD registration is to be anonymous, YAX registers
	// as a named module because, like jQuery, it is a base library that is
	// popular enough to be bundled in a third party lib, but not be part of
	// an AMD load request. Those cases could generate an error when an
	// anonymous define() is called outside of a loader request.
	if (typeof define === 'function' && define.amd) {
		define('YAX', [], function () {
			return Y;
		});
	} else {
		expose();
	}

	//---

	delete root.R;
	delete root.D;

	//---

}());

//---