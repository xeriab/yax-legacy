/**
 * YAX
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint undef: true */
/*jshint unused: true */
/*jshint strict: false */
/*global exports, module */

(function () {

	//---

	// 'use strict';

	// var Y = {};

	var isNode = false;

	// Establish the root object, `window` in the browser, or `exports` on the server.
	var root = this;

	// Save the previous value of the `Y` or `YAX` variable.
	var previousYax = root.Y || root.YAX || null;

	/*jshint -W079 */
	/*jshint -W020 */
	var require = null;
	var define = null;

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

	//---

	(function () {
		var modules = {};

		// Stack of moduleIds currently being built.
		var requireStack = [];

		// Map of module ID -> index into requireStack of modules currently being built.
		var inProgressModules = {};

		var SEPARATOR = '.';

		function build(module) {
			var factory = module.factory;

			var localRequire = function (id) {
				var resultantId = id;

				//Its a relative path, so lop off the last portion and add the id (minus './')
				if (id.charAt(0) === '.') {
					resultantId = module.id.slice(0, module.id.lastIndexOf(SEPARATOR)) +
						SEPARATOR + id.slice(2);
				}

				return require(resultantId);
			};

			module.exports = {};

			delete module.factory;

			factory(localRequire, module.exports, module);

			return module.exports;
		}

		require = function (id) {
			if (!modules[id]) {
				throw 'module ' + id + ' not found';
			}

			if (inProgressModules.hasOwnProperty(id)) {
				var cycle = requireStack.slice(inProgressModules[id])
					.join('->') + '->' + id;

				throw 'Cycle in require graph: ' + cycle;
			}

			if (modules[id].factory) {
				try {
					inProgressModules[id] = requireStack.length;
					requireStack.push(id);

					return build(modules[id]);
				} finally {
					delete inProgressModules[id];

					requireStack.pop();
				}
			}

			return modules[id].exports;
		};

		define = function (id, factory) {
			if (modules[id]) {
				throw 'module ' + id + ' already defined';
			}

			modules[id] = {
				id: id,
				factory: factory
			};
		};

		define.remove = function (id) {
			delete modules[id];
		};

		define.moduleMap = modules;
	}());

	//---

	// Export for use in node
	if (typeof module === 'object' && typeof require === 'function') {
		module.exports.require = require;
		module.exports.define = define;
	}

	//---

	root.require = require;
	root.define = define;

	//---

	// Create a safe reference to the `Y` object for use below.
	var Y = function (obj) {
		if (obj instanceof Y) {
			return obj;
		}

		if (!(this instanceof Y)) {
			return new Y(obj);
		}

		this._wrapped = obj;
	};

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
			// module.exports = Y;
			module.exports = Y;
		}

		exports.Y = exports.YAX = Y;

		isNode = true;
	}

	//---

	Y.toString = function () {
		return '[YAX]: Library';
	};

	//---

	// BEGIN OF [Private Functions]

	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};

	String.prototype.toCamel = function () {
		return this.replace(/(\-[a-z])|(\_[a-z])|(\s[a-z])/g, function ($1) {
			return $1.toUpperCase()
				.replace('-', '')
				.replace('_', '')
				.replace(' ', '');
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

	Object.setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
		/*jshint -W103 */
		obj.__proto__ = proto;
		
		return obj;
	};

	//---

	Y._INFO = {};

	//---

	Y.VERSION = 0.20;
	Y.BUILD = 1000;
	Y.STATUS = 'DEV';
	Y.CODENAME = 'RAGHDA';

	Y.hasOwnProp = ({}).hasOwnProperty;

	/**
	 * YAX._CONFIG_STORAGE
	 */
	Y._CONFIG_STORAGE = {};

	/**
	 * YAX._GLOBALS
	 */
	Y._GLOBALS = Y.G = {};

	/**
	 * YAX.Mixin
	 */
	Y.Mixin = {};

	/**
	 * YAX.Settings
	 */
	Y.Settings = {};

	//---

	Y.G.isNodeJs = isNode;
	Y.G.Push = Push;
	Y.G.Slice = Slice;
	Y.G.Concat = Concat;
	Y.G.ToString = toString;
	Y.G.Filter = Filter;

	Y.hasOwn = HasOwnProperty;

	Y.G.FuncProto = FuncProto;
	Y.G.ArrayProto = ArrayProto;
	Y.G.ObjProto = ObjProto;
	Y.G.IndexOf = ArrayProto.indexOf;
	Y.G.Push = ArrayProto.push;

	Y.require = root.require || require || null;
	Y.define = root.define || define || null;

	//---

	if (isNode) {
		isNode = true;
		console.info('[INFO] Running YAX.JS in "Node" Environment!');
	} else {
		isNode = false;
		Y.WIN = this;
		Y.DOC = Y.WIN.document;
		console.info('[INFO] Running YAX.JS in "Browser" Environment!');
	}


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

		isNode = true;
	} else {
		expose();
	}

	//---

}());

// FILE: ./Source/YAX.js

//---