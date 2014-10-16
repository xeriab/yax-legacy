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
	 * YAX._GLOBALS
	 */
	Y._GLOBALS = Y.G = {};

	/**
	 * YAX.Mixin
	 */
	Y.Mixin = {};

	/**
	 * YAX._GLOBALS.regexList
	 */
	Y.G.regexList = {};

	//---

	Y.G.isNode = isNode;
	Y.G.push = Push;
	Y.G.slice = Slice;
	Y.G.concat = Concat;
	Y.G.toString = toString;
	Y.G.filter = Filter;

	Y.hasOwn = HasOwnProperty;

	Y.G.FuncProto = FuncProto;
	Y.G.ArrayProto = ArrayProto;
	Y.G.ObjProto = ObjProto;
	Y.G.indexOf = ArrayProto.indexOf;

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
		
		define('Y', [], function () {
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

/**
 * YAX Constants
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint undef: true */
/*jshint unused: true */
/*global Y, YAX, exports, define, module */

(function () {

	//---

	'use strict';

	//---

}());

// FILE: ./Source/Core/Constants.js

//---

/**
 * YAX Core
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function () {

	//---

	'use strict';

	var classToType = {};
	
	//---

	/**
	 * isFloat
	 */
	Y.isFloat = function isFloat(variable) {
		// return + variable === variable && (!isFinite(variable) || !!(variable % 1));
		// return + variable === variable && (!isFinite(variable) || !!(variable % 1));
		// return variable === +variable && variable !== (variable|0);
		return variable !== '' && !isNaN(variable) &&
			Math.round(variable) !== variable;
	};

	/**
	 * getType
	 *
	 * Get the type of
	 */
	Y.typeOf = function getType(variable) {
		var str = typeof variable;
		var name;
		var getFuncName = function(func) {
			name = (/\W*function\s+([\w\$]+)\s*\(/).exec(func);

			if (!name) {
				return '(Anonymous)';
			}

			return name[1];
		};

		if (str === 'object') {
			if (variable !== null) {
				// From: http://javascript.crockford.com/remedial.html
				if (typeof variable.length === 'number' &&
					!(variable.propertyIsEnumerable('length')) &&
					typeof variable.splice === 'function') {
					str = 'array';
				} else if (variable.constructor &&
					getFuncName(variable.constructor)) {
					name = getFuncName(variable.constructor);

					if (name === 'Date') {
						str = 'date';
					} else if (name === 'RegExp') {
						str = 'regexp';
					} else if (name === 'YAEX_Resource') {
						// Check against our own resource constructor
						str = 'resource';
					}
				}
			} else {
				str = 'null';
			}
		} else if (str === 'number') {
			// str = this.is_float(variable) ? 'double' : 'integer';
			str = Y.isFloat(variable) ? 'double' : 'integer';
		}

		return str;
	};

	/**
	 * type
	 *
	 * Get the type of
	 *
	 * @param    variable object Variable to get type
	 * @return    string The object type
	 */
	Y.type = function type(variable) {
		var _type;
		var __ToString = classToType.toString;

		/*jshint -W041 */
		if (variable === null) {
			_type = String(variable);
		} else if (({})[__ToString.call(variable)]) {
			_type = classToType[__ToString.call(variable)];
		} else if (([])[__ToString.call(variable)]) {
			_type = classToType[__ToString.call(variable)];
		} else {
			_type = typeof variable;
		}

		/*if (variable === null) {
			_type = String(variable);
		} else if (typeof variable === 'object' ||
			typeof variable === 'function') {
			_type = classToType[__ToString.call(variable)] || 'object';
		} else if (({})[__ToString.call(variable)]) {
			_type = classToType[__ToString.call(variable)];
		} else if (([])[__ToString.call(variable)]) {
			_type = classToType[__ToString.call(variable)];
		} else {
			_type = typeof variable;
		}*/

		return _type.toString().toLowerCase();
	};

	/**
	 * isString
	 *
	 * Checks if the given object is a String
	 *
	 * @param    object object Variable to check
	 * @return    boolean TRUE|FALSE
	 */
	Y.isString = function isString(object) {
		return Y.type(object) === 'string';
	};

	/**
	 * isObject
	 *
	 * Checks if the given var is an object
	 *
	 * @param    object object Variable to check
	 * @return    boolean TRUE|FALSE
	 */
	Y.isObject = function isObject(object) {
		//var _type = typeof object;
		//return _type === 'function' || (_type === 'object' && !!object);
		return Y.type(object) === 'object';
	};

	/**
	 * isWindow
	 *
	 * Checks if the given object is a Window
	 *
	 * @param    object object Variable to check
	 * @return    boolean TRUE|FALSE
	 */
	Y.isWindow = function isWindow(object) {
		return object !== null && object === object.window;
	};

	/**
	 * isPlainObject
	 *
	 * Checks if the given object is a Plain
	 *
	 * @param    object object Variable to check
	 * @return    boolean TRUE|FALSE
	 */
	Y.isPlainObject = function isPlainObject(object) {
		return Y.isObject(object) && !Y.isWindow(object) &&
			Object.getPrototypeOf(object) === Object.prototype;
	};

	Y.isEmptyObject = function isEmptyObject(object) {
		var name;

		for (name in object) {
			if (object.hasOwnProperty(name)) {
				return false;
			}
		}

		return true;
	};

	/**
	 * isArray
	 * Checks if the given object is an Array
	 * @return    boolean
	 */
	Y.isArray = Array.isArray || function (object) {
		// return Array.isArray(object);
		return Y.G.toString.call(object) === '[object Array]';
	};

	/**
	 * isNumber
	 *
	 * Checks if the given object is a Number
	 *
	 * @param    object object Variable to check
	 * @return    boolean TRUE|FALSE
	 */
	Y.isNumber = function isNumber(object) {
		// return !isNaN(parseFloat(object)) && isFinite(object);
		return !isNaN(parseFloat(object)) && isFinite(object);
	};

	/**
	 * isInteger
	 *
	 * Checks if the given variable is an integer
	 */
	Y.isInteger = function isInteger(variable) {
		return !Y.isFloat(variable);
	};

	/**
	 * isDouble
	 *
	 * Checks if the given variable is an integer
	 */
	Y.isDouble = function isDouble(variable) {
		return Y.isFloat(variable);
	};

	/**
	 * isUndefined
	 *
	 * Checks if the given object is Undefined
	 *
	 * @param    variable object Variable to check
	 * @return    boolean if TRUE| string object type if FALSE
	 */
	Y.isUndefined = function isUndefined(variable) {
		// return Y.type(variable) === Y.type();
		return Y.type(variable) === 'undefined';
	};

	/**
	 * isDefined
	 * Checks if the given object is Undefined
	 * @return    boolean
	 */
	Y.isDefined = function isDefined(variable) {
		return Y.type(variable) !== 'undefined';
	};

	/**
	 * likeArray
	 *
	 * Checks if the given object is an Array like
	 *
	 * @param    object object Variable to check
	 * @return    boolean TRUE|FALSE
	 */
	Y.likeArray = function likeArray(object) {
		// return Y.type(object.length) === 'number';
		return Y.isNumber(object.length);
	};

	/**
	 * isArraylike
	 *
	 * Checks if the given object is an Array like
	 *
	 * @param    object object Variable to check
	 * @return    boolean TRUE|FALSE
	 */
	Y.isArraylike = function isArraylike(object) {
		var len = object.length;
		var _type = Y.type(object);

		if (_type === 'function' || Y.isWindow(object)) {
			return false;
		}

		if (object.nodeType === 1 && len) {
			return true;
		}

		/*return _type === 'array' || len === 0 ||
			(typeof len === 'number' && len > 0) && (len - 1) in object;*/

		return _type === 'array' || len === 0 ||
			((typeof len === 'number' && len > 0) &&
				object.hasOwnProperty(len - 1));

		/*return isArray(object) || !(isFunction(object) ||
			!((len === 0 || isNumber(len)) && len > 0 && object.hasOwnProperty(len - 1)));*/
	};

	/**
	 * isNull
	 *
	 * Checks if the given object is Null
	 *
	 * @param    object object Variable to check
	 * @return   boolean TRUE|FALSE
	 */
	Y.isNull = function isNull(object) {
		return Y.type(object) === Y.type(null);
	};

	/**
	 * isEmpty
	 *
	 * Checks if the given object is an empty
	 *
	 * @param    object object Variable to check
	 * @return   boolean TRUE|FALSE
	 */
	Y.isObjectEmpty = function isObjectEmpty(object) {
		var name;

		for (name in object) {
			if (object.hasOwnProperty(name)) {
				return false;
			}
		}

		return true;
	};

	/**
	 * getContainsWordCharRegEx
	 *
	 * @return    string
	 */
	function getContainsWordCharRegEx() {
		if (!Y.reContainsWordChar) {
			Y.reContainsWordChar = new RegExp('\\S+', 'g');
		}

		return Y.reContainsWordChar;
	}

	/**
	 * getGetFunctionBodyRegEx
	 *
	 * @return    string
	 */
	function getGetFunctionBodyRegEx() {
		if (!Y.reGetFunctionBody) {
			Y.reGetFunctionBody = new RegExp('{((.|\\s)*)}', 'm');
		}

		return Y.reGetFunctionBody;
	}

	/**
	 * getRemoveCodeCommentsRegEx
	 *
	 * @return    string
	 */
	function getRemoveCodeCommentsRegEx() {
		if (!Y.reRemoveCodeComments) {
			Y.reRemoveCodeComments = new RegExp(
				"(\\/\\*[\\w\\'\\s\\r\\n\\*]*\\*\\/)|(\\/\\/[\\w\\s\\']*)", 'g');
		}

		return Y.reRemoveCodeComments;
	}

	/**
	 * isFunctionEmpty
	 *
	 * Checks if the given object is an empty Function
	 *
	 * @param    object object Variable to check
	 * @return   boolean TRUE|FALSE
	 */
	Y.isFunctionEmpty = function isFunctionEmpty(object) {
		var array, body;

		// Only get RegExs when needed
		array = getGetFunctionBodyRegEx().exec(object);

		if (array && array.length > 1 && array[1] !== undefined) {

			body = array[1].replace(getRemoveCodeCommentsRegEx(), '');

			if (body && getContainsWordCharRegEx().test(body)) {
				return false;
			}
		}

		return true;
	};

	/**
	 * isBool
	 *
	 * Checks if the given object is Boolean
	 *
	 * @param    object object Variable to check
	 * @return   boolean TRUE|FALSE
	 */
	Y.isBool = Y.isBoolean = function isBool(object) {
		return Y.type(object) === 'boolean';
	};

	Y.isFalse = function isFalse(variable) {
		return Y.isBool(variable) && variable === false;
	};

	Y.isTrue = function isTrue(variable) {
		return Y.isBool(variable) && variable === true;
	};

	/**
	 * isEmpty
	 *
	 * Checks if the given value is Empty
	 *
	 * @param    value Variable to check
	 * @return   boolean TRUE|FALSE
	 */
	Y.isEmpty = function isEmpty(value) {
		var key, x, length, empty = [undefined, null, false, 0, '', '0'];

		for (x = 0, length = empty.length; x < length; x++) {
			if (value === empty[x]) {
				return true;
			}
		}

		if (Y.isObject(value)) {
			for (key in value) {
				if (value.hasOwnProperty(key)) {
					return false;
				}
			}

			return true;
		}

		return false;
	};

	Y.empty = (function empty() {
		var str = ' ';

		return str.trim();
	}());

	/**
	 * inArray
	 * @return
	 */
	Y.inArray = function inArray(element, array, num) {
		if (Y.isNull(array)) {
			return -1;
		}

		return Y.G.indexOf.call(array, element, num);
	};

	/**
	 * inArrayOther
	 * @return    array
	 */
	function inArrayOther(needle, haystack, argStrict) {
		var key = '',
			strict = !!argStrict,
			result;

		if (strict) {
			for (key in haystack) {
				if (haystack.hasOwnProperty(key)) {
					//if (haystack.hasOwnProperty(key) || haystack[key]) {
					if (haystack[key] === needle) {
						result = true;
					}
				}
			}
		} else {
			for (key in haystack) {
				if (haystack.hasOwnProperty(key)) {
					//if (haystack.hasOwnProperty(key) || haystack[key]) {
					if (haystack[key] === needle) {
						result = true;
					}
				}
			}
		}

		return result;
	}

	Y.isSet = function isSet() {
		var arg = arguments;
		var len = arg.length;
		var x = 0;

		if (len === 0) {
			throw new Error('Empty isSet!');
		}

		while (x !== len) {
			if (Y.isUndefined(arg[x]) || Y.isNull(arg[x])) {
				return false;
			}

			x++;
		}

		return true;
	};

	/**
	 * isDocument
	 *
	 * Checks if the given object is a Window Document
	 *
	 * @param    variable object Variable to check
	 * @return   boolean TRUE|FALSE
	 */
	Y.isDocument = function isDocument(variable) {
		var result;

		if (Y.isNull(variable) || !Y.isObject(variable)) {
			result = false;
		} else if (variable.nodeType === variable.DOCUMENT_NODE) {
			result = true;
		}

		return result;
	};

	Y.makeArray = function makeArray(arr, results) {
		var ret = results || [];

		if (arr !== null) {
			if (Y.isArraylike(arr)) {
				Y.merge(ret, typeof arr === 'string' ? [arr] : arr);
			} else {
				Y.G.push.call(ret, arr);
			}
		}

		return ret;
	};

	function hasProp(object, prop) {
		return Y.hasOwn.call(object, prop);
	}

	function hasProperty(object, property) {
		if (Y.isSet(object) && Y.isSet(property)) {
			return Y.isSet(object[property]);
		}
	}

	function getOwn(object, property) {
		if (hasProp(object, property)) {
			return object[property];
		}
	}

	function inject(object, childName) {
		var args = Y.G.slice.call(arguments, 2);
		object[childName] = args[0];
	}

	/**
	 * Dasherise
	 *
	 * Add dashes to string.
	 *
	 * @param    string string String to dasherise
	 * @return    string The dasherised string
	 */
	function dasherise(string) {
		return string.replace(/::/g, '/')
			.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
			.replace(/([a-z\d])([A-Z])/g, '$1_$2')
			.replace(/_/g, '-')
			.toLowerCase();
	}

	function toUnderscore(string) {
		return string.toUnderscore();
	}

	function toDash(string) {
		return string.toDash();
	}

	function toCamel(string) {
		return string.toCamel();
	}

	function arrayToObject(array, type, data) {
		var tmp = {},
			x, n;

		if (type && Y.isNumber(type) && type === 1 && !data) {
			for (x = 0; x < array.length; ++x) {
				if (!Y.isUndefined(array[x]) && !Y.isUndefined(array[x][0]) && !Y.isUndefined(
						array[x][1])) {
					tmp[(array[x][0]).toString()] = array[x][1];
				}
			}
		} else {
			for (n = 0; n < array.length; ++n) {
				if (!Y.isUndefined(array[n])) {
					if (!data || !Y.isNull(data)) {
						tmp[(array[n][0]).toString()] = array[n][1];
					} else {
						// tmp[array[n]] = null;
						tmp[n] = array[n];
					}
				}
			}
		}

		return tmp;
	}

	function intoArray(array, data) {
		var tmp = [],
			x;

		for (x = 0; x < array.length; ++x) {
			if (!Y.isUndefined(array[x])) {
				if (data !== null) {
					tmp[array[x]] = data;
				} else {
					tmp[array[x]] = null;
				}
			}
		}

		return tmp;
	}

	function objectToArray(object, type) {
		var tmp = [],
			x, n;

		if (type && Y.isNumber(type) && type === 1) {
			for (x in object) {
				// if (Y.hasOwn.call(object, x)) {
				if (object.hasOwnProperty(x)) {
					tmp.push([x, object[x]]);
				}
			}
		} else {
			for (n in object) {
				// if (Y.hasOwn.call(object, n)) {
				if (object.hasOwnProperty(n)) {
					tmp.push(object[n]);
				}
			}
		}

		return tmp;
	}

	function toObject(array) {
		var temp = {},
			x;

		// temp['__proto__'] = array['__proto__'];

		for (x = 0; x < array.length; ++x) {
			if (Y.isDefined(array[x])) {
				temp[x] = array[x];
				// temp['__proto__'] = array['__proto__'];
			}
		}

		return temp;
	}

	/*function toArray(string) {
		return string.toArray();
	}*/

	/**
	 * deserialiseValue
	 *
	 * Deserialise a given value
	 *
	 * "true"    => true
	 * "false"    => false
	 * "null"    => null
	 * "42"    => 42
	 * "42.5"    => 42.5
	 * "08"    => "08"
	 * JSON    => parse if valid
	 * String    => self
	 *
	 * @param    value The value to Deserialise
	 * @return   string The deserialised value
	 */
	function deserialiseValue(value) {
		var num, result;

		try {
			if (Y.isSet(value)) {
				if (value === 'true') {
					result = true;
				} else if (value === 'false') {
					result = false;
				} else if (value === 'null') {
					result = null;
				} else {
					num = Number(value);

					if (!/^0/.test(value) && !isNaN(num)) {
						result = num;
					} else {
						if (/^[\[\{]/.test(value)) {
							result = JSON.parse(value);
						} else {
							result = value;
						}
					}
				}
			}

			return result;
		} catch (e) {
			return value;
		}
	}

	/**
	 * variableDump
	 *
	 * Dump variables as text
	 *
	 * @param    object  to dump
	 * @param    level Level padding
	 * @return    string The dumped text
	 */
	function variableDump(object, level) {
		var dumpedText = '',
			item,
			j,
			value,
			// The padding given at the beginning of the line.
			levelPadding = '';

		if (!level) {
			level = 0;
		}

		for (j = 0; j < level + 1; j++) {
			levelPadding += ' ';
		}

		// Array/Hashes/s
		if (Y.isObject(object)) {
			for (item in object) {
				if (object.hasOwnProperty(item)) {
					value = object[item];

					// If it is an array,
					if (Y.isObject(value)) {
						dumpedText += levelPadding + "'" + item + "' ...\n";
						dumpedText += variableDump(value, level + 1);
					} else {
						dumpedText += levelPadding + "'" + item + "' => \"" + value + "\"\n";
					}
				}
			}
			// Stings/Chars/Numbers etc.
		} else {
			dumpedText = '===>' + object + '<===(' + Y.type(object) + ')';
			// dumpedText = '==>' + object + '<==(' + Y.type(object) + ')';
		}

		return dumpedText;
	}

	function compact(array) {
		return Y.G.filter.call(array, function(item) {
			return item !== null;
		});
	}

	Y.merge = function merge(first, second) {
		var len = second.length;
		var x = first.length;
		var n = 0;

		if (Y.isNumber(len)) {
			for (len; n < len; n++) {
				first[x++] = second[n];
			}
		} else {
			while (!Y.isUndefined(second[n])) {
				first[x++] = second[n++];
			}
		}

		first.length = x;

		return first;
	};

	function unique(array) {
		return Y.G.filter.call(array, function(item, index) {
			return array.indexOf(item) === index;
		});
	}

	function camelCase(string) {
		return string.toCamel();
	}

	Y.random = function random(min, max) {
		if (max === null) {
			max = min;
			min = 0;
		}

		// return Math.floor(Math.random() * (max - min + 1) + min);
		return min + Math.floor(Math.random() * (max - min + 1));
	};

	Y.grep = function grep(elements, callback) {
		return Y.G.filter.call(elements, callback);
	};

	// Internal function that returns an efficient (for current engines) version
	// of the passed-in callback, to be repeatedly applied in other YAX
	// functions.
	var createCallback = function (func, context, argc) {
		if (context === undefined) {
			return func;
		}

		var tmp = (argc === null ? 3 : argc);

		switch (tmp) {
			case 1:
				return function(value) {
					return func.call(context, value);
				};

			case 2:
				return function(value, other) {
					return func.call(context, value, other);
				};

			case 3:
				return function(value, index, collection) {
					return func.call(context, value, index, collection);
				};

			case 4:
				return function(accumulator, value, index, collection) {
					return func.call(context, accumulator, value, index, collection);
				};
		}

		return function() {
			return func.apply(context, arguments);
		};
	};

	Y.each = function each(object, callback, args) {
		var value;
		var x = 0;
		var length = object.length;
		var _isArray = Y.isArraylike(object);

		if (args) {
			if (_isArray) {
				for (x; x < length; x++) {
					value = callback.apply(object[x], args);

					if (value === false) {
						break;
					}
				}
			} else {
				for (x in object) {
					if (object.hasOwnProperty(x)) {
						value = callback.apply(object[x], args);

						if (value === false) {
							break;
						}
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if (_isArray) {
				for (x; x < length; x++) {
					value = callback.call(object[x], x, object[x]);

					if (value === false) {
						break;
					}
				}
			} else {
				for (x in object) {
					if (object.hasOwnProperty(x)) {
						value = callback.call(object[x], x, object[x]);

						if (value === false) {
							break;
						}
					}
				}
			}
		}

		return object;
	};

	// The cornerstone, an `each` implementation, aka `forEach`.
	// Handles raw objects in addition to array-likes. Treats all
	// sparse array-likes as if they were dense.
	Y.forEach = function forEach (object, iteratee, context) {
		/*jshint -W041 */
		if (object == null) {
			return object;
		}

		var x = 0;
		var length = object.length;

		iteratee = createCallback(iteratee, context);

		if (length === +length) {
			for (x; x < length; x++) {
				iteratee(object[x], x, object);
			}
		} else {
			var keys = Y.keys(object);

			for (x, length = keys.length; x < length; x++) {
				iteratee(object[keys[x]], keys[x], object);
			}
		}

		return object;
	};

	// A mostly-internal function to generate callbacks that can be applied
	// to each element in a collection, returning the desired result — either
	// identity, an arbitrary callback, a property matcher, or a property accessor.
	Y.iteratee = function (value, context, argc) {
		if (value === null) {
			return Y.identity;
		}

		if (Y.isFunction(value)) {
			return createCallback(value, context, argc);
		}

		if (Y.isObject(value)) {
			return Y.matches(value);
		}

		return Y.property(value);
	};

	Y.extend = function extend (object) {
		if (!Y.isObject(object) && !Y.isFunction(object)) {
			return object;
		}

		var source, prop, x = 1,
			length = arguments.length;

		// Extend Y itself if only one argument is passed
		if (length === x) {
			object = this;
			// i = i - 1;
			--x;
		}

		for (x; x < length; x++) {
			source = arguments[x];

			for (prop in source) {
				if (source.hasOwnProperty(prop)) {
					// if (source.hasOwnProperty(prop)) {
					object[prop] = source[prop];
				}
			}
		}

		return object;
	};

	// END OF [Private Functions]

	//---

	/*each([
		'Boolean',
		'RegExp',
		'Error',
		'global',
		'Date',
		'Error',
		'HTMLDocument'
	], function(x, name) {
		classToType['[object ' + name + ']'] = name.toLowerCase();
	});*/

	Y.forEach([
		'HTMLDocument',
		'Arguments',
		'String',
		'Function',
		'Array',
		'Object',
		'Error',
		'Boolean',
		'RegExp',
		'Error',
		'global',
		'Date',
		'Error'
	], function (name) {
		classToType['[object ' + name + ']'] = name.toLowerCase();
	});

	Y.forEach([
		'Arguments',
		'Function',
//		'String',
//		'Number',
//		'Date',
		'RegExp'
	], function (name) {
		Y['is' + name] = function (object) {
			return Y.G.ObjProto.toString.call(object) === '[object ' + name + ']';
		};
	});

	// Define a fallback version of the method in browsers (ahem, IE), where
	// there isn't any inspectable "Arguments" type.
	if (!Y.isArguments(arguments)) {
		Y.isArguments = function (object) {
			return Y.has(object, 'callee');
		};
	}

	// Optimize `isFunction` if appropriate.
	if (typeof (/./) !== 'function') {
		Y.isFunction = function (object) {
			return Y.type(object) === 'function';
		};
	}

	// Is the given value `NaN`? (NaN is the only number which does not equal itself).
	Y.isNaN = function (object) {
		return Y.isNumber(object) && object != +object;
	};

	// Is a given value a DOM element?
	Y.isElement = function isElement (object) {
		return !!(object && object.nodeType === 1);
	};

	// Is a given object a finite number?
	Y.isFinite = function (object) {
		return isFinite(object) && !isNaN(parseFloat(object));
	};

	// Is the given value `NaN`? (NaN is the only number which does not equal itself).
	Y.isNaN = function (object) {
		return Y.isNumber(object) && object !== +object;
	};

	// Is a given value a boolean?
	Y.isBoolean = function (object) {
		return object === true || object === false ||
			Y.G.ObjProto.toString.call(object) === '[object Boolean]';
	};

	//---

	Y.extend({
		callProperty: getOwn,
		variableDump: variableDump,
		inArrayOther: inArrayOther,
		unique: unique,
		compact: compact,
		camelise: camelCase,
		toUnderscore: toUnderscore,
		toCamel: toCamel,
		toDash: toDash,
		dasherise: dasherise,
		deserialiseValue: deserialiseValue,
		arrayToObject: arrayToObject,
		objectToArray: objectToArray,
		intoArray: intoArray,
		toObject: toObject,
		inject: inject,
		hasProperty: hasProperty
	});

	//--

	if (Y.isSet(console)) {
		var warn = console.warn;
		var log = console.log;
		var error = console.error;
		var info = console.info;

		Y.WARN = Function.prototype.bind.call(warn, console);
		Y.LOG = Function.prototype.bind.call(log, console);
		Y.ERROR = Function.prototype.bind.call(error, console);
		Y.INFO = Function.prototype.bind.call(info, console);
	} else {
		Y.WARN = Y.noop;
		Y.LOG = Y.noop;
		Y.ERROR = Y.noop;
		Y.INFO = Y.noop;
	}

	//---

}());

// FILE: ./Source/Core/Core.js

//---

/**
 * YAX Extra
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint undef: true */
/*jshint unused: true */
/*global Y */

(function () {

	//---

	'use strict';


	// Shortcut function for checking if an object has a given property directly
	// on itself (in other words, not on a prototype).
	Y.has = function(object, key) {
		return object !== null && Y.hasOwn.call(object, key);
		// return object !== null && object.hasOwnProperty(key);
	};

	// Retrieve the names of an object's properties.
	// Delegates to **ECMAScript 5**'s native `.keys`
	Y.keys = function(object) {
		var key;

		if (!Y.isObject(object) && !Y.isFunction(object)) {
			return [];
		}

		if (Object.keys) {
			return Object.keys(object);
		}

		var keys = [];

		for (key in object) {
			if (object.hasOwnProperty(key)) {
				if (Y.has(object, key)) {
					keys.push(key);
				}
			}
		}

		// keys.sort();

		return keys;
		// return keys.sort();
	};

	// Retrieve the values of an object's properties.
	Y.values = function(object) {
		var keys = Y.keys(object);
		var length = keys.length;
		var values = new Array(length);
		var x;

		for (x = 0; x < length; x++) {
			values[x] = object[keys[x]];
		}

		return values;
	};

	// Convert an object into a list of `[key, value]` pairs.
	Y.pairs = function(object) {
		var keys = Y.keys(object);
		var length = keys.length;
		var pairs = new Array(length);
		var x;

		for (x = 0; x < length; x++) {
			pairs[x] = [keys[x], object[keys[x]]];
		}

		return pairs;
	};

	// Invert the keys and values of an object. The values must be serializable.
	Y.invert = function(object) {
		var result = {};
		var keys = Y.keys(object);
		var x;
		var length;

		for (x = 0, length = keys.length; x < length; x++) {
			result[object[keys[x]]] = keys[x];
		}

		return result;
	};

	// Return a sorted list of the function names available on the object.
	// Aliased as `methods`
	Y.functions = Y.methods = function(object) {
		var names = [];
		var key;

		for (key in object) {
			if (object.hasOwnProperty(key)) {
				if (Y.isFunction(object[key])) {
					names.push(key);
				}
			}
		}

		return names.sort();
	};

	// List of HTML entities for escaping.
	var escapeMap = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;',
		'`': '&#x60;'
	};

	var unescapeMap = Y.invert(escapeMap);

	// Functions for escaping and unescaping strings to/from HTML interpolation.
	var createEscaper = function(map) {
		var escaper = function(match) {
			return map[match];
		};

		// Regexes for identifying a key that needs to be escaped
		var source = '(?:' + Y.keys(map).join('|') + ')';
		var testRegexp = new RegExp(source);
		var replaceRegexp = new RegExp(source, 'g');

		return function(string) {
			string = string === null ? '' : Y.empty + string;
			return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
		};
	};

	Y.escape = createEscaper(escapeMap);
	Y.unescape = createEscaper(unescapeMap);

	// If the value of the named `property` is a function then invoke it with the
	// `object` as context; otherwise, return it.
	Y.result = function (object, property) {
		if (object === null) {
			return undefined;
		}

		var value = object[property];

		return Y.isFunction(value) ? object[property]() : value;
	};

	// Generate a unique integer id (unique within the entire client session).
	// Useful for temporary DOM ids.
	var idCounter = 0;

	Y.uniqueId = function (prefix) {
		var id = ++idCounter + Y.empty;
		return prefix ? prefix + id : id;
	};

	//---

	// Fill in a given object with default properties.
	Y.defaults = function(object) {
		var x;
		var length;
		var source;
		var prop;

		if (!Y.isObject(object)) {
			return object;
		}

		for (x = 1, length = arguments.length; x < length; x++) {
			source = arguments[x];

			for (prop in source) {
				if (source.hasOwnProperty(prop)) {
					// if (object[prop] === eval('void 0')) {
					// if (object[prop] === void 0) {
					if (object[prop] === undefined) {
						object[prop] = source[prop];
					}
				}
			}
		}

		return object;
	};

	// By default, YAX uses ERB-style template delimiters, change the
	// following template settings to use alternative delimiters.
	Y.G.regexList.template = {
		evaluate: /<%([\s\S]+?)%>/g,
		interpolate: /<%=([\s\S]+?)%>/g,
		escape: /<%-([\s\S]+?)%>/g
	};

	// Another YAX template delimiters
	/*Y.G.regexList.template = {
		evaluate: /\{\{([\s\S]+?)\}\}/g,
		interpolate: /\{\{=([\s\S]+?)\}\}/g,
		escape: /\{\{-([\s\S]+?)\}\}/g
	};*/

	// When customizing `Y.G.regexList.template`, if you don't want to define an
	// interpolation, evaluation or escaping regex, we need one that is
	// guaranteed not to match.
	var noMatch = /(.)^/;

	// Certain characters need to be escaped so that they can be put into a
	// string literal.
	var escapes = {
		"'": "'",
		'\\': '\\',
		'\r': 'r',
		'\n': 'n',
		'\u2028': 'u2028',
		'\u2029': 'u2029'
	};

	var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

	var escapeChar = function(match) {
		return '\\' + escapes[match];
	};

	// JavaScript micro-templating, similar to John Resig's implementation.
	// YAX templating handles arbitrary delimiters, preserves whitespace,
	// and correctly escapes quotes within interpolated code.
	// NB: `oldSettings` only exists for backwards compatibility.
	Y.template = function(text, settings, oldSettings) {
		if (!settings && oldSettings) {
			settings = oldSettings;
		}

		settings = Y.defaults({}, settings, Y.G.regexList.template);

		// Combine delimiters into one regular expression via alternation.
		var matcher = new RegExp([
			(settings.escape || noMatch).source,
			(settings.interpolate || noMatch).source,
			(settings.evaluate || noMatch).source
		].join('|') + '|$', 'g');

		// Compile the template source, escaping string literals appropriately.
		var index = 0;
		var source = '__p += \'';

		text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
			source += text.slice(index, offset).replace(escaper, escapeChar);
			index = offset + match.length;

			if (escape) {
				source += "'+\n((__t=(" + escape + "))==null?'':Y.escape(__t))+\n'";
			} else if (interpolate) {
				source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
			} else if (evaluate) {
				source += "';\n" + evaluate + "\n__p+='";
			}

			// Adobe VMs need the match returned to produce the correct offest.
			return match;
		});

		source += "';\n";

		// If a variable is not specified, place data values in local scope.
		if (!settings.variable) {
			source = 'with (object || {}) {\n' + source + '}\n';
		}

		source = 'var __t, __p = \'\', __j = Array.prototype.join, ' +
			'print = function () { __p += __j.call(arguments, \'\'); };\n' +
			source + 'return __p;\n';

		var render;

		try {
			/*jshint -W054 */
			render = new Function(settings.variable || 'object', 'Y', source);
		} catch (e) {
			e.source = source;
			throw e;
		}

		var template;

		template = function(data) {
			return render.call(this, data, Y);
		};

		// Provide the compiled source as a convenience for precompilation.
		/** @namespace settings.variable */
		var argument = settings.variable || 'object';

		template.source = 'function(' + argument + '){\n' + source + '}';

		return template;
	};

	Y.size = function (object) {
		if (Y.isNull(object)) {
			return 0;
		}

		return object.length === +object.length ? object.length : Y.keys(object).length;
	};

	//---

	Y.property = function (key) {
		return function (object) {
			return object[key];
		};
	};

	//---

	// Add a "chain" function. Start chaining a wrapped YAX object.
	Y.chain = function (object) {
		var _Y = Y;
		var instance = _Y(object);

		instance._chain = true;

		return instance;
	};

	// OOP
	// ---------------
	// If YAX is called as a function, it returns a wrapped object that
	// can be used OO-style. This wrapper holds altered versions of all the
	// YAX functions. Wrapped objects may be chained.

	// Helper function to continue chaining intermediate results.
	var result = function (instance, object) {
		var _Y = Y;
		return instance._chain ? _Y(object).chain() : object;
	};

	// Add your own custom functions to the YAX object.
	Y.mixin = function (object) {
		Y.forEach(Y.methods(object), function(name) {
			var func = Y[name] = object[name];

			Y.prototype[name] = function() {
				var args = [this._wrapped];

				Y.G.push.apply(args, arguments);

				return result(this, func.apply(Y, args));
			};
		});
	};

	// Add all of the YAX functions to the wrapper object.
	Y.mixin(Y);

	// Add all mutator Array functions to the wrapper.
	Y.forEach(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
		var method = Y.G.ArrayProto[name];

		Y.prototype[name] = function() {
			var object = this._wrapped;

			method.apply(object, arguments);

			if ((name === 'shift' || name === 'splice') && object.length === 0) {
				delete object[0];
			}

			return result(this, object);
		};
	});

	// Add all accessor Array functions to the wrapper.
	Y.forEach(['concat', 'join', 'slice'], function (name) {
		var method =  Y.G.ArrayProto[name];

		Y.prototype[name] = function() {
			return result(this, method.apply(this._wrapped, arguments));
		};
	});

	// Extracts the result from a wrapped and chained object.
	Y.prototype.value = function() {
		return this._wrapped;
	};

	// Keep the identity function around for default iteratees.
	Y.identity = function (value) {
		return value;
	};

	// Return the results of applying the iteratee to each element.
	Y.map = Y.collect = function(object, iteratee, context) {
		if (object === null) {
			return [];
		}

		iteratee = Y.iteratee(iteratee, context);

		var keys = object.length !== +object.length && Y.keys(object);
		var length = (keys || object).length;
		var results = new Array(length);
		var currentKey;
		var index;

		for (index = 0; index < length; index++) {
			currentKey = keys ? keys[index] : index;
			results[index] = iteratee(object[currentKey], currentKey, object);
		}
		
		return results;
	};

	// Safely create a real, live array from anything iterable.
	Y.toArray = function(object) {
		if (!object) {
			return [];
		}

		if (Y.isArray(object)) {
			return Y.G.slice.call(object);
		}

		if (object.length === +object.length) {
			return Y.map(object, Y.identity);
		}

		return Y.values(object);
	};

	// Converts lists into objects. Pass either a single array of `[key, value]`
	// pairs, or two parallel arrays of the same length -- one of keys, and one of
	// the corresponding values.
	Y.object = function(list, values) {
		if (list === null) {
			return {};
		}

		var res = {};
		var x;
		var length;

		for (x = 0, length = list.length; x < length; x++) {
			if (values) {
				res[list[x]] = values[x];
			} else {
				res[list[x][0]] = list[x][1];
			}
		}

		return res;
	};

	//---

}());

// FILE: ./Source/Core/Extra.js

//---

/**
 * YAX Global Shortcuts
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX, window, DOMParser */

(function (undef) {

	//---

	'use strict';

	Y.extend({
		now: Date.now || function() {
			return new Date().getTime();
		},

		/*delay: function (milliseconds) {
			var self = this;
			var start = self.now;
			var x;

			for (x = 0; x < 1e7; x++) {
				if ((new Date().getTime() - start) > milliseconds) {
					break;
				}
			}
		},*/

		// Delays a function for the given number of milliseconds, and then calls
		// it with the arguments supplied.
		delay: function (callback, wait) {
			var args = Y.G.slice.call(arguments, 2);

			return setTimeout(function () {
				return callback.apply(null, args);
			}, wait);
		},

		// Defers a function, scheduling it to run after the current call stack has
		// cleared.
		defer: function (callback) {
			return Y.delay.apply(Y, [callback, 1].concat(Y.G.slice.call(arguments, 1)));
		},

		parseJSON: JSON.parse
	});

	//---

	// Cross-browser XML parsing
	if (!Y.G.isNode) {
		Y.extend({
			parseXML: function (data) {
				if (!data || !Y.isString(data)) {
					return null;
				}

				var xml, temp;

				// Support: IE9
				try {
					temp = new DOMParser();
					xml = temp.parseFromString(data, 'text/xml');
				} catch (e) {
					xml = undef;
					Y.ERROR(e);
				}

				if (!xml || xml.getElementsByTagName('parsererror').length) {
					Y.ERROR('Invalid XML: ' + data);
				}

				return xml;
			}
		});
	}

	Y.extend({
		lcfirst: function (string) {
			string += this.empty();

			var t = string.charAt(0).toLowerCase();

			return t + string.substr(1);
		},

		ucfirst: function (string) {
			string += this.empty();

			var t = string.charAt(0).toUpperCase();

			return t + string.substr(1);
		},

		ucwords: function (string) {
			return (string + this.empty()).replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
				return $1.toUpperCase();
			});
		}
	});

	//---

}());

// FILE: ./Source/Core/Global.js

//---


/**
 * YAX Config
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint unused: true */
/*global Y */

(function () {

	//---

	'use strict';

	function Config() {
		var args = Y.G.slice.call(arguments);

		Object.defineProperty(this.STORAGE = {}, 0, {
			get: function () {
				return {};
			}
		});

		/*this.EXPANDO = 'YAX' + (Y.VERSION.toString() +
			Y.random(1000000, 20000000)).replace(/\D/g, Y.empty);*/

		this.dl = null;

		if (Y.isUndefined(args)) {
			return this.STORAGE;
		}
	}

	Config.prototype = {
		set: function setConfig() {
			var args = Y.G.slice.call(arguments);

			var key = args[0];
			var tmpKey = key.split(':');
			var newVal = args[1];

			var oldVal;
			var self = this;
			var setArr;

			if (tmpKey && tmpKey.length > 1 && tmpKey.length == 2) {
				this.STORAGE[tmpKey[0]] = this.STORAGE[tmpKey[0]] || {};

				oldVal = this.STORAGE[tmpKey[0]].LOCAL_VALUE[tmpKey[1]];

				setArr = function setArr(_oldVal) {
					// Although these are set individually, they are all accumulated
					if (Y.isUndefined(_oldVal)) {
						self.STORAGE[tmpKey[0]].LOCAL_VALUE[tmpKey[1]] = [];
					}

					self.STORAGE[tmpKey[0]].LOCAL_VALUE.push(newVal);
				};

				switch (key) {
					case 'EXTENSION':
					case 'extension':
						// This function is only experimental in YAX.js
						if (Y.isFunction(this.dl)) {
							this.dl(newVal);
						}

						setArr(oldVal, newVal);

						break;

					default:
						this.STORAGE[tmpKey[0]].LOCAL_VALUE[tmpKey[1]] = newVal;
						break;
				}

				return oldVal;
			}

			this.STORAGE[key] = this.STORAGE[key] || {};

			oldVal = this.STORAGE[key].LOCAL_VALUE;

			setArr = function setArr(_oldVal) {
				// Although these are set individually, they are all accumulated
				if (Y.isUndefined(_oldVal)) {
					self.STORAGE[key].LOCAL_VALUE = [];
				}

				self.STORAGE[key].LOCAL_VALUE.push(newVal);
			};

			switch (key) {
				case 'EXTENSION':
				case 'extension':
					// This function is only experimental in YAX.js
					if (Y.isFunction(this.dl)) {
						this.dl(newVal);
					}

					setArr(oldVal, newVal);

					break;

				default:
					this.STORAGE[key].LOCAL_VALUE = newVal;
					break;
			}

			return oldVal;
		},

		setGlobal: function setGlobal() {
			var args = Y.G.slice.call(arguments);

			var key = args[0];
			var tmpKey = key.split(':');
			var newVal = args[1];

			var oldVal;
			var self = this;
			var setArr;

			if (tmpKey && tmpKey.length > 1 && tmpKey.length == 2) {
				this.STORAGE[tmpKey[0]] = this.STORAGE[tmpKey[0]] || {};

				oldVal = this.STORAGE[tmpKey[0]].GLOBAL_VALUE[tmpKey[1]];

				setArr = function setArr(_oldVal) {
					// Although these are set individually, they are all accumulated
					if (Y.isUndefined(_oldVal)) {
						self.STORAGE[tmpKey[0]].GLOBAL_VALUE[tmpKey[1]] = [];
					}

					self.STORAGE[tmpKey[0]].GLOBAL_VALUE.push(newVal);
				};

				switch (key) {
					case 'EXTENSION':
					case 'extension':
						// This function is only experimental in YAX.js
						if (Y.isFunction(this.dl)) {
							this.dl(newVal);
						}

						setArr(oldVal, newVal);

						break;

					default:
						this.STORAGE[tmpKey[0]].GLOBAL_VALUE[tmpKey[1]] = newVal;
						break;
				}

				return oldVal;
			}

			this.STORAGE[key] = this.STORAGE[key] || {};

			oldVal = this.STORAGE[key].GLOBAL_VALUE;

			setArr = function setArr(_oldVal) {
				// Although these are set individually, they are all accumulated
				if (Y.isUndefined(_oldVal)) {
					self.STORAGE[key].GLOBAL_VALUE = [];
				}

				self.STORAGE[key].GLOBAL_VALUE.push(newVal);
			};

			switch (key) {
				case 'EXTENSION':
				case 'extension':
					// This function is only experimental in YAX.js
					if (Y.isFunction(this.dl)) {
						this.dl(newVal);
					}

					setArr(oldVal, newVal);

					break;

				default:
					this.STORAGE[key].GLOBAL_VALUE = newVal;
					break;
			}

			return oldVal;
		},

		get: function getConfig() {
			var args = Y.G.slice.call(arguments);

			var key = args[0];
			var tmpKey = key.split(':');

			if (tmpKey && tmpKey.length > 1 && tmpKey.length == 2) {
				if (this.STORAGE &&
					this.STORAGE[tmpKey[0]] &&
					!Y.isUndefined(this.STORAGE[tmpKey[0]].LOCAL_VALUE)) {

					if (Y.isNull(this.STORAGE[tmpKey[0]].LOCAL_VALUE)) {
						return Y.empty;
					}

					return this.STORAGE[tmpKey[0]].LOCAL_VALUE[tmpKey[1]];
				}
			}

			if (this.STORAGE &&
				this.STORAGE[key] &&
				!Y.isUndefined(this.STORAGE[key].LOCAL_VALUE)) {

				if (Y.isNull(this.STORAGE[key].LOCAL_VALUE)) {
					return Y.empty;
				}

				return this.STORAGE[key].LOCAL_VALUE;
			}

			return Y.empty;
		},

		getGlobal: function getGlobal() {
			var args = Y.G.slice.call(arguments);

			var key = args[0];
			var tmpKey = key.split(':');

			if (tmpKey && tmpKey.length > 1 && tmpKey.length == 2) {
				if (this.STORAGE &&
					this.STORAGE[tmpKey[0]] &&
					!Y.isUndefined(this.STORAGE[tmpKey[0]].GLOBAL_VALUE)) {

					if (Y.isNull(this.STORAGE[tmpKey[0]].GLOBAL_VALUE)) {
						return Y.empty;
					}

					return this.STORAGE[tmpKey[0]].GLOBAL_VALUE[tmpKey[1]];
				}
			}

			if (this.STORAGE &&
				this.STORAGE[key] &&
				!Y.isUndefined(this.STORAGE[key].GLOBAL_VALUE)) {

				if (Y.isNull(this.STORAGE[key].GLOBAL_VALUE)) {
					return Y.empty;
				}

				return this.STORAGE[key].GLOBAL_VALUE;
			}

			return Y.empty;
		},

		getAll: function getAllConfig() {
			var args = Y.G.slice.call(arguments);

			var extension = args[0];
			var details = args[1];
			var keyVals = args[2];

			var key = '';
			var cfg = {};
			var noDetails = {};
			var extPattern;

			var tmp;

			// BEGIN REDUNDANT
			this.STORAGE = this.STORAGE || {};
			// END REDUNDANT

			if (extension) {
				extPattern = new RegExp('^' + extension + '\\.');

				for (key in this.STORAGE) {
					if (this.STORAGE.hasOwnProperty(key)) {
						extPattern.lastIndex = 0;

						if (extPattern.test(key)) {
							cfg[key] = this.STORAGE[key];
						}
					}
				}
			} else {
				for (key in this.STORAGE) {
					if (this.STORAGE.hasOwnProperty(key)) {
						cfg[key] = this.STORAGE[key];
					}
				}
			}

			// Default is true
			if (details !== false) {
				// {GLOBAL_VALUE: '', LOCAL_VALUE: '', ACCESS: ''};
				return cfg;
			}

			for (key in cfg) {
				if (cfg.hasOwnProperty(key)) {
					noDetails[key] = cfg[key].LOCAL_VALUE;
				}
			}

			if (Y.isSet(keyVals) && Y.isTrue(keyVals)) {
				for (key in cfg) {
					if (cfg.hasOwnProperty(key)) {
						tmp = key.split('.');
						noDetails[tmp[tmp.length - 1]] = cfg[key].LOCAL_VALUE;
					}
				}

				return noDetails;
			}

			return noDetails;
		},

		remove: function removeConfig() {
			var args = Y.G.slice.call(arguments);

			var key = args[0];

			if (this.STORAGE &&
				this.STORAGE[key] &&
				!Y.isUndefined(this.STORAGE[key].LOCAL_VALUE)) {

				if (Y.isNull(this.STORAGE[key].LOCAL_VALUE)) {
					return Y.empty;
				}

				// return this.STORAGE[key].LOCAL_VALUE;
				delete this.STORAGE[key];
			}

			return Y.empty;
		},

		restore: function restoreConfig() {
			var args = Y.G.slice.call(arguments);

			var key = args[0];

			if (this.STORAGE &&
				this.STORAGE[key] &&
				!Y.isUndefined(this.STORAGE[key])) {
				this.STORAGE[key].LOCAL_VALUE = this.STORAGE[key].GLOBAL_VALUE;
			}
		},

		alter: function alterConfig() {
			var args = Y.G.slice.call(arguments);

			var key = args[0];
			var value = args[1];

			return this.set(key, value);
		}
	};

	//---

	Y.config = Y.C = new Config();

	//---

	/*var _CoreConsole = {
		'Console.Log.Extended': true,
		'Console.Level': null,
		'Console.Colored': false,
		'Console.Colored.Message': false,
		'Console.Print.Level': true,
		'Console.Timed': false,
		'Console.On.Output': null
	};

	Y.C.set('yax.core.console', _CoreConsole);
	Y.C.set('extension', 'yax.core.console');*/

	//---

}());

// FILE: ./Source/Core/Contrib/Config.js

//---

/**
 * YAX Regex Object
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function () {

	//---

	'use strict';

	Y.extend(Y.G.regexList, {
		whitespace: "[\\x20\\t\\r\\n\\f]",

		scriptReplacement: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,

		scriptTypeReplacement: /^(?:text|application)\/javascript/i,

		xmlTypeReplacement: /^(?:text|application)\/xml/i,

		jsonTypeReplacement: /^(?:text|application)\/json/i,

		jsonType: 'application/json, text/json',

		htmlType: 'text/html',

		blankReplacement: /^\s*$/,

		fragmentReplacement: /^\s*<(\w+|!)[^>]*>/,

		singleTagReplacement: /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

		tagExpanderReplacement:
			/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,

		readyReplacement: /complete|loaded|interactive/,

		simpleSelectorReplacement: /^[\w\-]*$/,

		rootNodeReplacement: /^(?:body|html)$/i,

		selectorGroupReplacement: /(([\w#:.~>+()\s\-]+|\*|\[.*?\])+)\s*(,|$)/g,

		filterReplacement: new RegExp('(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*'),

		childReplacement: /^\s*>/,

		// Matching numbers
		num: /[+\-]?(?:\d*\.|)\d+(?:[eE][+\-]?\d+|)/.source,

		// Swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
		// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		displaySwap: /^(none|table(?!-c[ea]).+)/,

		margin: /^margin/,

		quickExpr: /^(?:\s*(<[\w\W]+>)[^>]*|#([\w\-]*))$/,

		singleTag: (/^<(\w+)\s*\/?>(?:<\/\1>|)$/),

		html: /<|&#?\w+;/,

		htmlTagName: /<([\w:]+)/,

		noInnerHtml: /<(?:script|style|link)/i,

		xhtmlTag: /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,

		scriptType: /^$|\/(?:java|ecma)script/i,

		checkableType: (/^(?:checkbox|radio)$/i),

		isSimple: /^.[^:#\[\.,]*$/,

		checked: /checked\s*(?:[^=]|=\s*.checked.)/i,

		cleanScript: /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

		keyEvent: /^key/,

		mouseEvent: /^(?:mouse|pointer|contextmenu)|click/,

		focusMorph: /^(?:focusinfocus|focusoutblur)$/,

		typeNamespace: /^([^.]*)(?:\.(.+)|)$/,

		notWhite: (/\S+/g),

		ignoreProperties: /^([A-Z]|returnValue$|layer[XY]$)/,

		selectorGroup: /(([\w#:.~>+()\s\-]+|\*|\[.*?\])+)\s*(,|$)/g,

		multiDash: /([A-Z])/g,

		brace: /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,

		hashStrip: /^#!*/,

		namedArgument: /:([\w\d]+)/g,

		argumentSplat: /\*([\w\d]+)/g,

		escape: /[\-\[\]{}()+?.,\\\^$|#\s]/g
	});

	//---

	Y.extend(Y.G.regexList, {
		numSplit: new RegExp('^(' + Y.G.regexList.num + ')(.*)$', 'i'),
		numNonPx: new RegExp('^(' + Y.G.regexList.num + ')(?!px)[a-z%]+$', 'i'),
		relNum: new RegExp('^([+-])=(' + Y.G.regexList.num + ')', 'i')
	});

	//---

}());

// FILE: ./Source/Core/RegexList.js

//---

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

/**
 * YAX Class
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function () {

	//---

	'use strict';

	// Throw error if trying to call a super that doesn't exist.
	var unImplementedSuper = function (method) {
		throw 'Super does not implement this method: ' + method;
	};

	// Used to test if the method has a super.
	var superTest = /\b_super\b/;

	// Used to mark a function so it can be unwrapped.
	var REF = '__extndmrk__';

	/**
	 * Y.Class powers the OOP facilities of the library.
	 */
	Y.Class = function () {};

	//---

	Y.Class.extend = function (properties) {
		var parent = this;
		var newClass;
		var property;
		var _super = parent.prototype;

		// Allow class inheritance.
		// if (Y.isFunction(properties) && '__super__' in properties) {
		if (Y.isFunction(properties) && properties.hasOwnProperty('__super__')) {
			// Copy parent's prototype.
			var mixin = {};
			var attr;

			for (attr in properties.prototype) {
				if (attr !== 'constructor' &&
					properties.prototype.hasOwnProperty(attr)) {
					mixin[attr] = properties.prototype[attr];
				}
			}

			properties = mixin;
		}

		// The constructor calls the init method - all construction logic happens
		// in this method.
		newClass = function () {
			// Call the initialise constructor
			if (this.initialise) {
				this.initialise.apply(this, arguments);
			}

			/** @namespace this.construct */
			// Call the construct constructor
			if (this.construct) {
				// this.construct.apply(this, arguments);
				return this.construct.apply(this, arguments);
			}

			// Call the _init constructor
			if (this._init) {
				// this._init.apply(this, arguments);
				return this._init.apply(this, arguments);
			}

			// Call the init constructor
			if (this.init) {
				// this.init.apply(this, arguments);
				return this.init.apply(this, arguments);
			}

			// Call all constructor hooks
			if (this.initialHooks.length) {
				this.callInitialHooks();
			}
		};

		var	x;
		var n;
		var len;

		// jshint camelcase: false
		var proto = Y.Util.create(parent);

		proto.constructor = newClass;

		newClass.prototype = proto;

		// Inherit parent's statics
		for (x in this) {
			if (this.hasOwnProperty(x) && x !== 'prototype') {
				newClass[x] = this[x];
			}
		}

		if (properties._class_name) {
			Y.extend(newClass, {
				_class_name: properties._class_name.toString()
			});

			delete properties._class_name;
		}

		// Mix static properties into the class
		/** @namespace properties._statics */
		if (properties._statics) {
			Y.extend(newClass, properties._statics);
			delete properties._statics;
		}

		// Mix includes into the prototype
		/** @namespace properties._includes */
		if (properties._includes) {
			Y.extend.apply(null, [proto].concat(properties._includes));
			delete properties._includes;
		}

		//  OPTIONS
		if (proto._options) {
			properties._options = Y.extend(Y.Util.create(proto._options), properties._options);
		}

		// Mix given properties into the prototype
		Y.extend(proto, properties);

		proto.initialHooks = [];

		// Add method for calling all hooks
		proto.callInitialHooks = function () {
			if (this.initialHooksCalled) {
				return;
			}

			if (parent.callInitialHooks) {
				parent.callInitialHooks.call(this);
			}

			this.initialHooksCalled = true;

			for (n = 0, len = proto.initialHooks.length; n < len; n++) {
				proto.initialHooks[n].call(this);
			}
		};

		// Extend `extend` and `__super__` into newClass.
		for (property in parent) {
			if (parent.hasOwnProperty(property)) {
				newClass[property] = parent[property];
			}
		}

		// Set the prototype chain to inherit from `parent`, without calling
		// `parent`'s constructor function.
		var Surrogate = function () {
			this.constructor = newClass;
		};

		Surrogate.prototype = parent.prototype;

		newClass.prototype = new Surrogate();
		newClass.prototype.__unwrappedSuper__ = {};

		// Add prototype properties (instance properties) to the subclass, if supplied.
		if (properties) {
			// Extend parent prototypes into newClass.
			for (property in properties) {
				if (properties.hasOwnProperty(property)) {
					newClass.prototype[property] = properties[property];
				}
			}

			// A function wrapper which assigns this._super for the duration of the call,
			// then marks the function so it can be unwrapped and re-wrapped for the next
			// call which allows for proper multiple inheritance.
			var functionWrapper = function (name, fn) {
				var func = function class_super() {
					var tmp = this._super;

					// Add a new ._super() method that is the same method
					// but on the super-class
					this._super = _super[name] || unImplementedSuper(name);

					// The method only need to be bound temporarily, so we
					// remove it when we're done executing
					var ret;

					try {
						ret = fn.apply(this, arguments);
					} finally {

						this._super = tmp;
					}
					return ret;
				};

				func[REF] = true;

				return func;
			};

			var name;
			var fun;

			// Copy the properties over onto the new prototype
			for (name in properties) {
				if (properties.hasOwnProperty(name)) {
					// Check if we're overwriting an existing function
					if (Y.isFunction(properties[name]) && superTest.test(properties[name])) {
						fun = newClass.prototype[name];

						if (fun[REF]) {
							properties[name] = newClass.prototype.__unwrappedSuper__[name];
						}

						newClass.prototype.__unwrappedSuper__[name] = properties[name];
						newClass.prototype[name] = functionWrapper(name, properties[name]);
					}
				}
			}
		}

		// Set a convenience property in case the parent's prototype is needed later.
		newClass.__super__ = parent.prototype;

		return newClass;
	};

	//---

	// Method for adding properties to prototype
	Y.Class.include = function (properties) {
		Y.extend(this.prototype, properties);
	};

	//---

	//  new default options to the Class
	Y.Class.options = function (options) {
		Y.extend(this.prototype._options, options);
	};

	//---

	//  new default object to the Class
	Y.Class.mergeObject = function (name, object) {
		Y.extend(this.prototype[name], object);
	};

	//---

	// Add a constructor hook
	// (Function) || (String, args...)
	Y.Class.addInitialHook = function (func) {
		var args = Y.G.slice.call(arguments, 1);
		var init;

		if (Y.isFunction(func)) {
			init = func;
		} else {
			init = function () {
				this[func].apply(this, args);
			};
		}

		this.prototype.initialHooks = this.prototype.initialHooks || [];
		this.prototype.initialHooks.push(init);
	};

	//---

	Y.Class.toString = function () {
		return '[YAX] ' + (this._class_name ? '::' + this._class_name + Y.empty : '');
	};

	//---

}());

// FILE: ./Source/Core/Class.js

//---

/**
 * YAX Evented
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function () {

	//---

	'use strict';

	/**
	 * Y.Events is a base class that YAEX classes inherit from to
	 * handle custom events.
	 */
	Y.Evented = Y.Class.extend({
		_class_name: 'Evented',

		eventsArray: [],

		on: function (types, callback, context) {
			var type, i, len;
			// Types can be a map of types/handlers
			if (Y.isObject(types)) {
				for (type in types) {
					if (Y.hasOwn.call(types, type)) {
						// We don't process space-separated events here for performance;
						// It's a hot path since Layer uses the on(obj) syntax
						this._On(type, types[type], callback);
					}
				}

			} else {
				// types can be a string of space-separated words
				types = Y.Util.splitWords(types);

				for (i = 0, len = types.length; i < len; i++) {
					this._On(types[i], callback, context);
				}
			}

			return this;
		},

		off: function (types, callback, context) {
			var type, i, len;
			if (!types) {
				// Clear all listeners if called without arguments
				delete this.eventsArray;
			} else if (Y.isObject(types)) {
				for (type in types) {
					if (Y.hasOwn.call(types, type)) {
						this._Off(type, types[type], callback);
					}
				}
			} else {
				types = Y.Util.splitWords(types);

				for (i = 0, len = types.length; i < len; i++) {
					this._Off(types[i], callback, context);
				}
			}

			return this;
		},

		// Attach listener (without syntactic sugar now)
		_On: function (type, callback, context) {
			// var events = this.eventsArray = this.eventsArray || {},
			var events = this.eventsArray || {},
				contextId = context && context !== this && Y.stamp(context),
				indexKey,
				indexLenKey,
				typeIndex,
				id;

			if (contextId) {
				// Store listeners with custom context in a separate hash (if it has an id);
				// gives a major performance boost when firing and removing events (e.g. on map object)

				indexKey = type + '_idx';
				indexLenKey = type + '_len';
				typeIndex = events[indexKey] = events[indexKey] || {};
				id = Y.stamp(callback) + '_' + contextId;

				if (!typeIndex[id]) {
					typeIndex[id] = {
						callback: callback,
						ctx: context
					};

					// Keep track of the number of keys in the index to quickly check if it's empty
					events[indexLenKey] = (events[indexLenKey] || 0) + 1;
				}

			} else {
				// Individual layers mostly use "this" for context and don't fire listeners too often
				// so simple array makes the memory footprint better while not degrading performance
				events[type] = events[type] || [];
				events[type].push({callback: callback});
			}
		},

		_Off: function (type, callback, context) {
			var events = this.eventsArray,
				indexKey = type + '_idx',
				indexLenKey = type + '_len',
				contextId,
				listeners,
				i,
				len,
				listener,
				id;

			if (!events) {
				return;
			}

			if (!callback) {
				// Clear all listeners for a type if function isn't specified
				delete events[type];
				delete events[indexKey];
				delete events[indexLenKey];
				return;
			}

			contextId = context && context !== this && Y.stamp(context);

			if (contextId) {
				id = Y.stamp(callback) + '_' + contextId;
				listeners = events[indexKey];

				if (listeners && listeners[id]) {
					listener = listeners[id];
					delete listeners[id];
					events[indexLenKey]--;
				}

			} else {
				listeners = events[type];

				for (i = 0, len = listeners.length; i < len; i++) {
					if (listeners[i].callback === callback) {
						listener = listeners[i];
						listeners.splice(i, 1);
						break;
					}
				}
			}

			// Set the removed listener to noop so that's not called if remove happens in fire
			if (listener) {
				listener.callback = Y.noop;
			}
		},

		fire: function (type, data, propagate) {
			if (!this.listens(type, propagate)) {
				return this;
			}

			var event = Y.extend({}, data, {type: type, target: this}),
				events = this.eventsArray,
				typeIndex,
				i,
				len,
				listeners,
				id;

			if (events) {
				typeIndex = events[type + '_idx'];

				if (events[type]) {
					// Make sure adding/removing listeners inside other listeners won't cause infinite loop
					listeners = events[type].slice();

					for (i = 0, len = listeners.length; i < len; i++) {
						listeners[i].callback.call(this, event);
					}
				}

				// Fire event for the context-indexed listeners as well
				for (id in typeIndex) {
					if (typeIndex.hasOwnProperty(id)) {
						typeIndex[id].callback.call(typeIndex[id].ctx, event);
					}
				}
			}

			if (propagate) {
				// Propagate the event to parents (set with addEventParent)
				this.propagateEvent(event);
			}

			return this;
		},

		listens: function (type, propagate) {
			var events = this.eventsArray, id;

			if (events && (events[type] || events[type + '_len'])) {
				return true;
			}

			if (propagate) {
				// Also check parents for listeners if event propagates
				for (id in this.eventParents) {
					if (Y.hasOwn.call(this.eventParents, id)) {
						if (this.eventParents[id].listens(type)) {
							return true;
						}
					}
				}
			}
			return false;
		},

		once: function (types, callback, context) {
			var type, handler;

			if (typeof types === 'object') {
				for (type in types) {
					if (types.hasOwnProperty(type)) {
						this.once(type, types[type], callback);
					}
				}
				return this;
			}

			handler = Y.Bind(function () {
				this
					.off(types, callback, context)
					.off(types, handler, context);
			}, this);

			// Add a listener that's executed once and removed after that
			return this
				.on(types, callback, context)
				.on(types, handler, context);
		},

		// Adds a parent to propagate events to (when you fire with true as a 3rd argument)
		addEventParent: function (obj) {
			this.eventParents = this.eventParents || {};
			this.eventParents[Y.stamp(obj)] = obj;
			return this;
		},

		removeEventParent: function (obj) {
			if (this.eventParents) {
				delete this.eventParents[Y.stamp(obj)];
			}
			return this;
		},

		propagateEvent: function (e) {
			var id;

			for (id in this.eventParents) {
				if (Y.hasOwn.call(this.eventParents, id)) {
					this.eventParents[id].fire(e.type, Y.extend({layer: e.target}, e));
				}
			}
		}
	}); // END OF Y.Evented CLASS

	//---

	var prototype = Y.Evented.prototype;

	// Aliases; we should ditch those eventually
	prototype.addEventListener = prototype.on;
	prototype.removeEventListener = prototype.clearAllEventListeners = prototype.off;
	prototype.addOneTimeEventListener = prototype.once;
	prototype.fireEvent = prototype.fire;
	prototype.hasEventListeners = prototype.listens;

	Y.Mixin.Events = prototype;

	//---

}());

// FILE: ./Source/Core/Evented.js

//---

/**
 * YAX Callbacks [Contrib]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function (undef) {

	//---

	'use strict';

	// String to Object options format cache
	var optionsCache = {};

	// Convert String-formatted options into Object-formatted ones and store in cache
	function createOptions (options) {
		var object = optionsCache[options] = {};

		/*Y.each(options.match(Y.G.regexList.notWhite) || [], function(_, flag) {
			object[flag] = true;
		});*/

		Y.forEach(options.match(Y.G.regexList.notWhite) || [], function(flag) {
			object[flag] = true;
		});

		return object;
	}

	// Create a collection of callbacks to be fired in a sequence, with configurable behaviour
	// Option flags:
	//   - once: Callbacks fired at most one time.
	//   - memory: Remember the most recent context and arguments
	//   - stopOnFalse: Cease iterating over callback list
	//   - unique: Permit adding at most one instance of the same callback

	/**
	 * Y.Callbacks
	 */
	Y.G.Callbacks = function (options) {

		// options = Y.extend({}, options || {});

		if (Y.isString(options)) {
			options = optionsCache[options] || createOptions(options);
		} else {
			options = Y.extend({}, options);
		}

		// Y.LOG(options);

		// Last fire value (for non-forgettable lists)
		var memory,
			// Flag to know if list was already fired
			fired,

			// Flag to know if list is currently firing
			firing,

			// First callback to fire (used internally by add and fireWith)
			firingStart,

			// End of the loop when firing
			firingLength,

			// Index of currently firing callback (modified by remove if needed)
			firingIndex,

			// Actual callback list
			list = [],

			// Stack of fire calls for repeatable lists
			stack = !options.once && [],

			fire,

			Callbacks;

		fire = function (data) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			/*jshint unused: true */
			firing = true;

			for (list; list && firingIndex < firingLength; ++firingIndex) {
				if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
					memory = false;
					break;
				}
			}

			firing = false;

			if (list) {
				if (stack) {
					// stack.length && fire(stack.shift());
					if (stack.length) {
						fire(stack.shift());
					}
				} else if (memory) {
					list.length = 0;
				} else {
					Callbacks.disable();
				}
			}
		};

		Callbacks = {
			add: function () {
				if (list) {
					var start = list.length,
						add;
					add = function (args) {
						Y.forEach(args, function (arg) {
							if (Y.isFunction(arg)) {
								if (!options.unique || !Callbacks.has(arg)) {
									list.push(arg);
								}
							} else if (arg && arg.length && !Y.isString(arg)) {
								add(arg);
							}
						});
					};

					add(arguments);

					if (firing) {
						firingLength = list.length;
					} else if (memory) {
						firingStart = start;
						fire(memory);
					}
				}

				return this;
			},
			remove: function () {
				if (list) {
					Y.forEach(arguments, function (arg) {
						var index = 0;
						while ((index = Y.inArray(arg, list, index)) > -1) {
							list.splice(index, 1);
							// Handle firing indexes
							if (firing) {
								if (index <= firingLength) {
									--firingLength;
								}

								if (index <= firingIndex) {
									--firingIndex;
								}
							}
						}
					});
				}
				return this;
			},
			has: function (fn) {
				return !!(list && (fn ? Y.inArray(fn, list) > -1 : list.length));
			},
			empty: function () {
				firingLength = list.length = 0;
				return this;
			},
			disable: function () {
				list = stack = memory = undef;
				return this;
			},
			disabled: function () {
				return !list;
			},
			lock: function () {
				stack = undef;

				if (!memory) {
					Callbacks.disable();
				}

				return this;
			},
			locked: function () {
				return !stack;
			},
			fireWith: function (context, args) {
				if (list && (!fired || stack)) {
					args = args || [];
					args = [context, args.slice ? args.slice() : args];

					if (firing) {
						stack.push(args);
					} else {
						fire(args);
					}
				}
				return this;
			},
			fire: function () {
				return Callbacks.fireWith(this, arguments);
			},
			fired: function () {
				return !!fired;
			}
		};

		return Callbacks;
	}; // END OF Y.Callbacks FUNCTION

	//---

}());

// FILE: ./Source/Core/Contrib/Callbacks.js

//---


/**
 * YAX Deferred [Contrib]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function () {

	//---

	'use strict';

	function newDeferred(callback) {
		var tuples = [
			// action, add listener, listener list, final state
			['resolve', 'done', Y.G.Callbacks({
				once: 1,
				memory: 1
			}), 'resolved'],
			//['resolve', 'done', Y.G.Callbacks('once memory'), 'resolved'],
			['reject', 'fail', Y.G.Callbacks({
				once: 1,
				memory: 1
			}), 'rejected'],
			['notify', 'progress', Y.G.Callbacks({
				memory: 1
			})]
		];

		var state = 'pending';

		var deferred = {};

		var promise = {
			state: function () {
				return state;
			},

			always: function () {
				deferred.done(arguments).fail(arguments);
				return this;
			},

			then: function () {
				var fns = arguments, context, values;

				return newDeferred(function (defer) {
					Y.forEach(tuples, function (tuple, x) {
						var fn = Y.isFunction(fns[x]) && fns[x];
						deferred[tuple[1]](function () {
							var returned = fn && fn.apply(this, arguments);
							if (returned && Y.isFunction(returned.promise)) {
								returned.promise()
									.done(defer.resolve)
									.fail(defer.reject)
									.progress(defer.notify);
							} else {
								context = this === promise ? defer.promise() : this;
								values = fn ? [returned] : arguments;
								defer[tuple[0] + 'With'](context, values);
							}
						});
					});

					fns = null;

				}).promise();
			},

			promise: function (obj) {
				if (Y.isSet(obj)) {
					return Y.extend(obj, promise);
				}

				return promise;

				// return obj !== null ? Y.extend(obj, promise) : promise;
			}
		};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		Y.forEach(tuples, function (tuple, x) {
			var list = tuple[2],
				stateString = tuple[3];

			promise[tuple[1]] = list.add;

			if (stateString) {
				list.add(function () {
					state = stateString;
					/* jshint -W016 */
				}, tuples[x ^ 1][2].disable, tuples[2][2].lock);
			}

			deferred[tuple[0]] = function () {
				deferred[tuple[0] + 'With'](this === deferred ? promise : this, arguments);
				return this;
			};

			deferred[tuple[0] + 'With'] = list.fireWith;
		});

		promise.promise(deferred);

		if (callback) {
			callback.call(deferred, deferred);
		}

		return deferred;
	}

	//---

	Y.When = function (sub) {
		var resolveValues = Y.G.slice.call(arguments),
			len = resolveValues.length,
			x = 0,
			remain = len !== 1 || (sub && Y.isFunction(sub.promise)) ? len : 0,
			deferred = remain === 1 ? sub : newDeferred(),
			progressValues, progressContexts, resolveContexts,
			updateFn = function (x, ctx, val) {
				return function (value) {
					ctx[x] = this;

					val[x] = arguments.length > 1 ? Y.G.slice.call(arguments) : value;

					var tmp = --remain;

					if (val === progressValues) {
						deferred.notifyWith(ctx, val);
					} else if (!tmp) {
						deferred.resolveWith(ctx, val);
					}
				};
			};

		if (len > 1) {
			progressValues = [len];
			progressContexts = [len];
			resolveContexts = [len];

			for (x; x < len; ++x) {
				if (resolveValues[x] && Y.isFunction(resolveValues[x].promise)) {
					resolveValues[x].promise()
						.done(updateFn(x, resolveContexts, resolveValues))
						.fail(deferred.reject)
						.progress(updateFn(x, progressContexts, progressValues));
				} else {
					--remain;
				}
			}
		}

		if (!remain) {
			deferred.resolveWith(resolveContexts, resolveValues);
		}

		return deferred.promise();
	};

	Y.G.Deferred = newDeferred;

	//---

}());

// FILE: ./Source/Core/Contrib/Deferred.js

//---

/**
 * YAX Store Class [Contrib]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, Y, XMLSerializer, DOMParser, ActiveX */

(function (global, undef) {

	//---

	'use strict';

	Y.Store = Y.Class.extend({
		_class_name: 'Store',

		serialisers: {
			JSON: {
				id: 'Y.Store.serialisers.JSON',

				'initialise': function (encoders, decoders) {
					encoders.push('JSON');
					decoders.push('JSON');
				},

				encode: JSON.stringify,

				decode: JSON.parse
			},

			XML: {
				id: 'Y.Store.serialisers.XML',

				'initialise': function (encoders, decoders) {
					encoders.push('XML');
					decoders.push('XML');
				},

				isXML: function (value) {
					var docElement = (value ? value.ownerDocument || value : 0 ).documentElement;
					return docElement ? docElement.nodeName.toLowerCase() !== 'html' : false;
				},

				// Encodes a XML node to string (taken from $.jStorage, MIT License)
				encode: function (value) {
					if (!value || value._serialised || !this.isXML(value)) {
						return value;
					}

					var _value = {
						_serialised: this.ID,
						value: value
					};

					try {
						// Mozilla, Webkit, Opera
						_value.value = new XMLSerializer().serializeToString(value);

						return _value;
					} catch (err) {
						try {
							// Internet Explorer
							_value.value = value.xml;

							return _value;
						} catch (er) {
							Y.ERROR(er);
						}

						Y.ERROR(err);
					}

					return value;
				},

				// Decodes a XML node from string (taken from $.jStorage, MIT License)
				decode: function (value) {
					if (!value || value._serialised || value._serialised !== this.ID) {
						return value;
					}

					var domParser = (Y.hasOwn.call(global, 'DOMParser') && (new DOMParser()).parseFromString);

					/** @namespace global.ActiveX */
					if (!domParser && global.ActiveX) {
						domParser = function (xmlString) {
							var xmlDoc = new ActiveX('Microsoft.XMLDOM');

							xmlDoc.async = 'false';
							xmlDoc.loadXML(xmlString);

							return xmlDoc;
						};
					}

					if (!domParser) {
						return undef;
					}

					value.value = domParser.call(
						(Y.hasOwn.call(global, 'DOMParser') && (new DOMParser())) || window,
						value.value,
						'text/xml'
					);

					return this.isXML( value.value ) ? value.value : undef;
				}
			}
		},

		drivers: {
			windowName: {
				id: 'Y.Store.drivers.windowName',

				scope: 'Window',

				sache: {

				},

				encodes: true,

				/**
				 *
				 * @returns {boolean}
				 * @constructor
				 */
				available: function () {
					return true;
				},

				initialise: function () {
					this.Load();
				},

				save: function () {
					global.name = Y.Store.prototype.serialisers.JSON.encode(this.cache);
				},

				load: function () {
					try {
						this.cache = Y.Store.prototype.serialisers.JSON.decode(global.name + Y.empty);

						if (!Y.isObject(this.cache)) {
							this.cache = {};
						}
					} catch (e) {
						this.cache = {};
						global.name = '{}';
					}
				},

				set: function (key, value) {
					this.cache[key] = value;
					this.Save();
				},

				get: function (key) {
					return this.cache[key];
				},

				delete: function (key) {
					try {
						delete this.cache[key];
					} catch (e) {
						this.cache[key] = undef;
					}

					this.Save();
				},

				flush: function () {
					global.name = '{}';
				}
			}
		},

		_init: function () {
			var args = Y.G.slice.call(arguments),
				len = args.length,
				x = 0;

			if (len === 1) {
				// this[args[0]] = this.drivers[args[0]];
				Y.extend(this, this.drivers[args[0]]);

				// delete this.drivers[args[0]];
			} else if (len > 1) {
				for (x; x < len; x++) {
					this[args[x]] = this.drivers[args[x]];
					// delete this.drivers[args[x]];
				}
			} else {
				Y.extend(this, this.drivers);
				// delete this.drivers;
			}
		}
	});

	//---

	// Y.Data = Y.Store.prototype.serialisers;

	//---

}());

// FILE: ./Source/Core/Contrib/Store.js

//---

/**
 * YAX Parser Class [Contrib]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, Y, XMLSerializer, DOMParser, ActiveX */

(function () {

	//---

	'use strict';

	Y.Parser = Y.Class.extend({
		_class_name: 'Parser',

		drivers: {},

		_init: function () {
			var args = Y.G.slice.call(arguments),
				len = args.length,
				x = 0;

			if (len === 1) {
				Y.extend(this, this.drivers[args[0]]);
			} else if (len > 1) {
				for (x; x < len; x++) {
					this[args[x]] = this.drivers[args[x]];
				}
			} else {
				Y.extend(this, this.drivers);
			}
		}
	});

	//---

	//	Y.Parsers = Y.Parser.prototype.drivers;

	//---

}());

// FILE: ./Source/Core/Contrib/Parser.js

//---

/**
 * YAX i18n [Contrib]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*jshint unused: false */
/*global YAX, Y */

(function () {

	//---

	'use strict';

	Y.i18n = function (text, langNumOrFormatting, numOrFormattingOrContext, formattingOrContext, context) {
		var formatting;
		var lang;
		var num;

		if (Y.isNull(context)) {
			context = this.globalContext;
		}

		if (Y.isObject(langNumOrFormatting)) {
			lang = null;
			num = null;
			formatting = langNumOrFormatting;
			context = numOrFormattingOrContext || this.globalContext;
		} else {
			if (Y.isNumber(langNumOrFormatting)) {
				lang = null;
				num = langNumOrFormatting;
				formatting = numOrFormattingOrContext;
				context = formattingOrContext || this.globalContext;
			} else {
				lang = langNumOrFormatting;
				if (Y.isNumber(numOrFormattingOrContext)) {
					num = numOrFormattingOrContext;
					formatting = formattingOrContext;
					var _context;
					// context = context;
					_context = context;
					context = _context;
				} else {
					num = null;
					formatting = numOrFormattingOrContext;
					context = formattingOrContext || this.globalContext;
				}
			}
		}

		if (Y.isObject(text)) {
			/** @namespace text.i18n */
			if (Y.isObject(text.i18n)) {
				text = text.i18n;
			}

			return Y.i18n.translateHash(text, context, lang);
		}

		return Y.i18n.translate(text, num, formatting, context, lang);
	};

	Y.i18n.globalContext = null;
	Y.i18n.data = null;
	Y.i18n.languageData = null;

	Y.i18n.add = function (d, lang) {
		var c, data, k,
			v, _i, _len,
			_ref, _ref1,
			_results;

		if (Y.isSet(lang)) {
			Y.i18n.languageData[lang] = null;

			if (Y.isNull(Y.i18n.languageData[lang])) {
				Y.i18n.languageData[lang] = {
					values: {},
					contexts: []
				};
			}

			data = Y.i18n.languageData[lang];
		} else {
			data = Y.i18n.data;
		}

		if (Y.isSet(d.values)) {
			_ref = d.values;

			for (k in _ref) {
				if (_ref.hasOwnProperty(k)) {
					v = _ref[k];

					data.values[k] = v;
				}
			}
		}

		if (Y.isSet(d.contexts)) {
			_ref1 = d.contexts;
			_results = [];

			for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
				c = _ref1[_i];
				_results.push(data.contexts.push(c));
			}

			return _results;
		}
	};

	Y.i18n.setContext = function (key, value) {
		Y.i18n.globalContext[key] = value;
		return Y.i18n.globalContext[key];
	};

	Y.i18n.clearContext = function (key) {
		Y.i18n.globalContext[key] = null;
		return Y.i18n.globalContext[key];
	};

	Y.i18n.reset = function () {
		Y.i18n.data = {
			values: {},
			contexts: []
		};

		Y.i18n.globalContext = {};
		Y.i18n.languageData = {};

		return Y.i18n.languageData;
	};

	Y.i18n.resetData = function () {
		Y.i18n.data = {
			values: {},
			contexts: []
		};

		Y.i18n.languageData = {};
		return Y.i18n.languageData;
	};

	Y.i18n.resetContext = function () {
		Y.i18n.globalContext = {};
		return Y.i18n.globalContext;
	};

	Y.i18n.resetLanguage = function (lang) {
		Y.i18n.languageData[lang] = null;
		return Y.i18n.languageData[lang];
	};

	Y.i18n.translateHash = function (hash, context, language) {
		var k, v;

		for (k in hash) {
			if (hash.hasOwnProperty(k)) {
				v = hash[k];

				if (Y.isString(v)) {
					hash[k] = Y.i18n.translate(v, null, null, context, language);
				}
			}
		}

		return hash;
	};

	Y.i18n.translate = function (text, num, formatting, context, language) {
		var contextData, data, result;

		if (Y.isNull(context)) {
			context = Y.i18n.globalContext;
		}

		if (!Y.isNull(language)) {
			data = Y.i18n.languageData[language];
		}

		if (Y.isUndefined(data)) {
			data = Y.i18n.data;
		}

		//if (data == null) {
		//	data = Y.i18n.data;
		//}

		//if (data == null) {
		//	return Y.i18n.useOriginalText(text, num, formatting);
		//}

		if (Y.isNull(data)) {
			return Y.i18n.useOriginalText(text, num, formatting);
		}

		contextData = Y.i18n.getContextData(data, context);

		if (!Y.isNull(contextData)) {
			result = Y.i18n.findTranslation(text, num, formatting, contextData.values);
		}

		//if (result == null) {
		//	result = Y.i18n.findTranslation(text, num, formatting, data.values);
		//}

		//if (result == null) {
		//	return Y.i18n.useOriginalText(text, num, formatting);
		//}

		if (Y.isUndefined(result)) {
			result = Y.i18n.findTranslation(text, num, formatting, data.values);
		}

		if (Y.isNull(result)) {
			return Y.i18n.useOriginalText(text, num, formatting);
		}

		return result;
	};

	Y.i18n.translateHash = function (hash, context, language) {
		var k, v;

		for (k in hash) {
			if (hash.hasOwnProperty(k)) {
				v = hash[k];

				if (Y.isString(v)) {
					hash[k] = Y.i18n.translate(v, null, null, context, language);
				}
			}
		}

		return hash;
	};

	Y.i18n.findTranslation = function (text, num, formatting, data) {
		var result, triple, value, _i, _len;
		value = data[text];


		if (Y.isNull(value)) {
			return null;
		}

		if (Y.isNull(num)) {
			if (Y.isString(value)) {
				return Y.i18n.applyFormatting(value, num, formatting);
			}
		} else {
			if (value instanceof Array || value.length) {
				for (_i = 0, _len = value.length; _i < _len; _i++) {
					triple = value[_i];

					if ((num >= triple[0] || Y.isNull(triple[0])) && (num <= triple[1] ||
						Y.isNull(triple[1]))) {
						result = Y.i18n.applyFormatting(triple[2].replace("-%n", String(-num)),
							num, formatting);
						return Y.i18n.applyFormatting(result.replace("%n", String(num)), num,
							formatting);
					}
				}
			}
		}

		return null;
	};

	Y.i18n.getContextData = function (data, context) {
		var c, equal, key,
			value, _i, _len,
			_ref, _ref1;

		if (!Y.isSet(data.contexts) || Y.isNull(data.contexts)) {
			return null;
		}

		_ref = data.contexts;

		for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			c = _ref[_i];

			equal = true;

			/** @namespace c.matches */
			_ref1 = c.matches;

			for (key in _ref1) {
				if (_ref1.hasOwnProperty(key)) {
					value = _ref1[key];
					equal = equal && value === context[key];
				}
			}

			if (equal) {
				return c;
			}
		}

		return null;
	};

	Y.i18n.useOriginalText = function (text, num, formatting) {
		if (Y.isNull(num)) {
			return Y.i18n.applyFormatting(text, num, formatting);
		}

		return Y.i18n.applyFormatting(text.replace("%n", String(num)), num,
			formatting);
	};

	Y.i18n.applyFormatting = function (text, num, formatting) {
		var ind, regex;

		for (ind in formatting) {
			if (formatting.hasOwnProperty(ind)) {
				regex = new RegExp("%{" + ind + "}", "g");
				text = text.replace(regex, formatting[ind]);
			}
		}

		return text;
	};

	//---

	Y.i18n.reset();

	Y._t = Y.i18n;

	//---

}());

// FILE: ./Source/Core/Contrib/i18n.js

//---


