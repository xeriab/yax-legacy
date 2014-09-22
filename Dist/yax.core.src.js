/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*jshint undef: false */
/*jshint unused: true */
/*global module */

(function () {
	/*jshint -W079 */
	/*jshint -W020 */
	var require = null;
	var define = null;
	var root = this;

	(function () {
		var modules = {},
			// Stack of moduleIds currently being built.
			requireStack = [],
			// Map of module ID -> index into requireStack of modules currently being built.
			inProgressModules = {},
			SEPARATOR = '.';

		function build(module) {
			var factory = module.factory,
				localRequire = function (id) {
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
				var cycle = requireStack.slice(inProgressModules[id]).join('->') + '->' +
					id;
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

	root.R = require;
	root.D = define;

	//---

}());

//---


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

	// var Y;

	var isNode = false;

	// Establish the root object, `window` in the browser, or `exports` on the server.
	var root = this;

	// Save the previous value of the `Y` variable.
	var previousYax = root.Y || null;

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
		Y.ENV = Object.create(null);

		Y.ENV.Type = 'Nodejs';

		Y.G.isNode = isNode;

		Console.info('[INFO] Running YAX.JS in "Node" Environment!');
	} else {
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

	// Y.G.isNode = isNode;
	Y.G.Push = Push;
	Y.G.Slice = Slice;
	Y.G.Concat = Concat;
	Y.G.ToString = toString;
	Y.G.Filter = Filter;

	Y.HasOwnProperty = HasOwnProperty;

	Y.G.FuncProto = FuncProto;
	Y.G.ArrayProto = ArrayProto;
	Y.G.ObjProto = ObjProto;

	/** @namespace root.R */
	/** @namespace root.D */
	Y.Require = root.R || require || null;
	Y.Define = root.D || define || null;

	//---



	//---

	// AMD registration happens at the end for compatibility with AMD loaders
	// that may not enforce next-turn semantics on modules. Even though general
	// practice for AMD registration is to be anonymous, YAX registers
	// as a named module because, like jQuery, it is a base library that is
	// popular enough to be bundled in a third party lib, but not be part of
	// an AMD load request. Those cases could generate an error when an
	// anonymous define() is called outside of a loader request.
	if (typeof define === 'function' && define.amd) {
		define('YAX', [], function() {
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


/**
 * Y Core
 *
 * The main Y core.
 *
 * @version     0.15
 * @depends:    Y.
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function (undef) {

	'use strict';

	var classToType = Object.create({});
	var False = false;
	var obj = Object.prototype;
	var hasOwn = obj.hasOwnProperty;
	var Console = console;

	//---

	/**
	 * isFloat
	 */
	function isFloat(variable) {
		// return + variable === variable && (!isFinite(variable) || !!(variable % 1));
		// return + variable === variable && (!isFinite(variable) || !!(variable % 1));
		// return variable === +variable && variable !== (variable|0);
		return variable !== '' && !isNaN(variable) && Math.round(variable) !==
			variable;
	}

	/**
	 * getType
	 *
	 * Get the type of
	 */
	function getType(variable) {
		var str = typeof variable,
			name,
			getFuncName = function (func) {
				name = (/\W*function\s+([\w\$]+)\s*\(/).exec(func);

				if (!name) {
					return '(Anonymous)';
				}

				return name[1];
			};

		if (str === 'object') {
			if (variable !== null) {
				// From: http://javascript.crockford.com/remedial.html
				if (typeof variable.length === 'number' && !(variable.propertyIsEnumerable(
					'length')) && typeof variable.splice === 'function') {
					str = 'array';
				} else if (variable.constructor && getFuncName(variable.constructor)) {
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
			str = isFloat(variable) ? 'double' : 'integer';
		}

		return str;
	}

	/**
	 * type
	 *
	 * Get the type of
	 *
	 * @param    variable object Variable to get type
	 * @return    string The object type
	 */
	function type(variable) {
		var myType, myToString;

		myToString = classToType.toString;

		// console.log(classToType);

		if (variable === null) {
			myType = String(variable);
		} else if (({})[myToString.call(variable)]) {
			// myType = myToString.call(variable);
			myType = classToType[myToString.call(variable)];
		} else if (([])[myToString.call(variable)]) {
			// myType = myToString.call(object);
			myType = classToType[myToString.call(variable)];
		} else {
			myType = typeof variable;
		}

		return myType.toString().toLowerCase();
	}

	/**
	 * isString
	 *
	 * Checks if the given object is a String
	 *
	 * @param    object object Variable to check
	 * @return    boolean TRUE|FALSE
	 */
	function isString(object) {
		return type(object) === 'string';
	}

	/**
	 * is
	 *
	 * Checks if the given object is an
	 *
	 * @param    object object Variable to check
	 * @return    boolean TRUE|FALSE
	 */
	function isObject(object) {
		return type(object) === 'object';
	}

	/**
	 * isWindow
	 *
	 * Checks if the given object is a Window
	 *
	 * @param    object object Variable to check
	 * @return    boolean TRUE|FALSE
	 */
	function isWindow(object) {
		return object !== null && object === object.window;
	}

	/**
	 * isPlainObject
	 *
	 * Checks if the given object is a Plain
	 *
	 * @param    object object Variable to check
	 * @return    boolean TRUE|FALSE
	 */
	function isPlainObject(object) {
		return isObject(object) && !isWindow(object) && Object.getPrototypeOf(object) === Object.prototype;
	}

	/**
	 * isArray
	 *
	 * Checks if the given object is an Array
	 *
	 * @param    object object Variable to check
	 * @return    boolean TRUE|FALSE
	 */
	function isArray(object) {
		return Array.isArray(object);
	}

	/**
	 * isFunction
	 *
	 * Checks if the given object is a Function
	 *
	 * @param    object object Variable to check
	 * @return    boolean TRUE|FALSE
	 */
	function isFunction(object) {
		return type(object) === 'function';
	}

	/**
	 * isNumber
	 *
	 * Checks if the given object is a Number
	 *
	 * @param    object object Variable to check
	 * @return    boolean TRUE|FALSE
	 */
	function isNumber(object) {
		// return !isNaN(parseFloat(object)) && isFinite(object);
		return !isNaN(parseFloat(object)) && isFinite(object);
	}

	/**
	 * isInteger
	 *
	 * Checks if the given variable is an integer
	 */
	function isInteger(variable) {
		return !isFloat(variable);
	}

	/**
	 * isInteger
	 *
	 * Checks if the given variable is an integer
	 */
	function isDouble(variable) {
		return isFloat(variable);
	}

	/**
	 * isUndefined
	 *
	 * Checks if the given object is Undefined
	 *
	 * @param    variable object Variable to check
	 * @return    boolean if TRUE| string object type if FALSE
	 */
	function isUndefined(variable) {
		// return type(variable) === type();
		// return type(variable) === 'undefined';
		return type(variable) === type(undef);
	}

	/**
	 * isDefined
	 *
	 * Checks if the given object is Undefined
	 *
	 * @param    object object Variable to check
	 * @return    boolean if TRUE| string object type if FALSE
	 */
	function isDefined(object) {
		return type(object) !== 'undefined';
	}

	/**
	 * likeArray
	 *
	 * Checks if the given object is an Array like
	 *
	 * @param    object object Variable to check
	 * @return    boolean TRUE|FALSE
	 */
	function likeArray(object) {
		// return type(object.length) === 'number';
		return isNumber(object.length);
	}

	/**
	 * isArraylike
	 *
	 * Checks if the given object is an Array like
	 *
	 * @param    object object Variable to check
	 * @return    boolean TRUE|FALSE
	 */
	function isArraylike(object) {
		var len = object.length;

		if (isWindow(object)) {
			return false;
		}

		if (object.nodeType === 1 && len) {
			return true;
		}

		return isArray(object) || !(isFunction(object) || !((len === 0 || isNumber(
			len)) && len > 0 && object.hasOwnProperty(len - 1)));
	}

	/**
	 * isNull
	 *
	 * Checks if the given object is Null
	 *
	 * @param    object object Variable to check
	 * @return   boolean TRUE|FALSE
	 */
	function isNull(object) {
		return type(object) === type(null);
	}

	/**
	 * isEmpty
	 *
	 * Checks if the given object is an empty
	 *
	 * @param    object object Variable to check
	 * @return   boolean TRUE|FALSE
	 */
	function isObjectEmpty(object) {
		var name;

		for (name in object) {
			if (object.hasOwnProperty(name)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * getContainsWordCharRegEx
	 *
	 * @return    string
	 */
	function getContainsWordCharRegEx() {
		if (!Y.ReContainsWordChar) {
			Y.ReContainsWordChar = new RegExp('\\S+', 'g');
		}

		return Y.ReContainsWordChar;
	}

	/**
	 * getGetFunctionBodyRegEx
	 *
	 * @return    string
	 */
	function getGetFunctionBodyRegEx() {
		if (!Y.ReGetFunctionBody) {
			Y.ReGetFunctionBody = new RegExp('{((.|\\s)*)}', 'm');
		}

		return Y.ReGetFunctionBody;
	}

	/**
	 * getRemoveCodeCommentsRegEx
	 *
	 * @return    string
	 */
	function getRemoveCodeCommentsRegEx() {
		if (!Y.ReRemoveCodeComments) {
			Y.ReRemoveCodeComments = new RegExp(
				"(\\/\\*[\\w\\'\\s\\r\\n\\*]*\\*\\/)|(\\/\\/[\\w\\s\\']*)", 'g');
		}

		return Y.ReRemoveCodeComments;
	}

	/**
	 * isFunctionEmpty
	 *
	 * Checks if the given object is an empty Function
	 *
	 * @param    object object Variable to check
	 * @return   boolean TRUE|FALSE
	 */
	function isFunctionEmpty(object) {
		var array, body;

		// Only get RegExs when needed
		array = getGetFunctionBodyRegEx().exec(object);

		if (array && array.length > 1 && array[1] !== undef) {

			body = array[1].replace(getRemoveCodeCommentsRegEx(), '');

			if (body && getContainsWordCharRegEx().test(body)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * isBool
	 *
	 * Checks if the given object is Boolean
	 *
	 * @param    object object Variable to check
	 * @return   boolean TRUE|FALSE
	 */
	function isBool(object) {
		return type(object) === 'boolean';
	}

	function isFalse(variable) {
		return isBool(variable) && variable === false;
	}

	function isTrue(variable) {
		return isBool(variable) && variable === true;
	}

	/**
	 * isEmpty
	 *
	 * Checks if the given value is Empty
	 *
	 * @param    value Variable to check
	 * @return   boolean TRUE|FALSE
	 */
	function isEmpty(value) {
		var key, x, length, empty = [undef, null, false, 0, '', '0'];

		for (x = 0, length = empty.length; x < length; x++) {
			if (value === empty[x]) {
				return true;
			}
		}

		if (isObject(value)) {
			for (key in value) {
				if (value.hasOwnProperty(key)) {
					return false;
				}
			}

			return true;
		}

		return false;
	}

	function empty() {
		var str = ' ';

		return str.trim();
	}

	/**
	 * inArray
	 *
	 * @return    array
	 */
	function inArray(element, array, num) {
		// return array === null ? -1 : EmptyArray.indexOf.call(array, element, num);
		// return EmptyArray.indexOf.call(array, element, num);

		var result;

		if (isNull(array)) {
			result = -1;
		} else {
			result = Y.G.ArrayProto.indexOf.call(array, element, num);
		}

		return result;
	}

	/**
	 * inArray
	 *
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

	function isSet() {
		var arg = arguments,
			len = arg.length,
			x = 0;
		// undef;

		if (len === 0) {
			throw new Error('Empty isSet!');
		}

		while (x !== len) {
			// if (arg[x] === undef || arg[x] === null) {
			if (isUndefined(arg[x]) || isNull(arg[x])) {
				return false;
			}

			x++;
		}

		return true;
	}

	/**
	 * isDocument
	 *
	 * Checks if the given object is a Window Document
	 *
	 * @param    variable object Variable to check
	 * @return   boolean TRUE|FALSE
	 */
	function isDocument(variable) {
		var result;

		if (isNull(variable) || !isObject(variable)) {
			result = false;
		} else if (variable.nodeType === variable.DOCUMENT_NODE) {
			result = true;
		}

		return result;
	}

	function hasProp(obj, prop) {
		return hasOwn.call(obj, prop);
	}

	function hasProperty(object, property) {
		if (isSet(object) && isSet(property)) {
			return isSet(object[property]);
		}
	}

	function getOwn(object, property) {
		if (hasProp(object, property)) {
			return object[property];
		}
	}

	function inject(object, childName) {
		var args = Y.G.Slice.call(arguments, 2);
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
		var tmp = {}, x, n;

		if (type && isNumber(type) && type === 1 && !data) {
			for (x = 0; x < array.length; ++x) {
				if (!isUndefined(array[x]) && !isUndefined(array[x][0]) && !isUndefined(
					array[x][1])) {
					tmp[(array[x][0]).toString()] = array[x][1];
				}
			}
		} else {
			for (n = 0; n < array.length; ++n) {
				if (!isUndefined(array[n])) {
					if (!data || !isNull(data)) {
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
			if (!isUndefined(array[x])) {
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

		if (type && isNumber(type) && type === 1) {
			for (x in object) {
				// if (Y.HasOwnProperty.call(object, x)) {
				if (object.hasOwnProperty(x)) {
					tmp.push([x, object[x]]);
				}
			}
		} else {
			for (n in object) {
				// if (Y.HasOwnProperty.call(object, n)) {
				if (object.hasOwnProperty(n)) {
					tmp.push(object[n]);
				}
			}
		}

		return tmp;
	}

	function toObject(array) {
		var temp = {}, x;

		// temp['__proto__'] = array['__proto__'];

		for (x = 0; x < array.length; ++x) {
			if (isDefined(array[x])) {
				temp[x] = array[x];
				// temp['__proto__'] = array['__proto__'];
			}
		}

		return temp;
	}

	function toArray(string) {
		return string.toArray();
	}

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
			if (isSet(value)) {
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
		if (isObject(object)) {
			for (item in object) {
				if (object.hasOwnProperty(item)) {
					value = object[item];

					// If it is an array,
					if (isObject(value)) {
						dumpedText += levelPadding + "'" + item + "' ...\n";
						dumpedText += variableDump(value, level + 1);
					} else {
						dumpedText += levelPadding + "'" + item + "' => \"" + value + "\"\n";
					}
				}
			}
			// Stings/Chars/Numbers etc.
		} else {
			dumpedText = '===>' + object + '<===(' + type(object) + ')';
			// dumpedText = '==>' + object + '<==(' + type(object) + ')';
		}

		return dumpedText;
	}

	function compact(array) {
		return Y.G.Filter.call(array, function (item) {
			return item !== null;
		});
	}

	function merge(first, second) {
		var l = second.length,
			i = first.length,
			j = 0;

		if (isNumber(l)) {
			for (null; j < l; j++) {
				first[i++] = second[j];
			}
		} else {
			while (!isUndefined(second[j])) {
				first[i++] = second[j++];
			}
		}

		first.length = i;

		return first;
	}

	function unique(array) {
		return Y.G.Filter.call(array, function (item, index) {
			return array.indexOf(item) === index;
		});
	}

	function camelCase(string) {
		return string.toCamel();
	}

	function randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function grep(elements, callback) {
		return Y.G.Filter.call(elements, callback);
	}

	function every(array, func) {
		var x, n;

		for (x = 0, n = array.length; x < n; ++x) {
			if (!func(array[x])) {
				return False;
			}
		}

		return 1;
	}

	function foreach(array, func) {
		every(array, function (element) {
			return !func(element);
		});
	}

	function each(elements, callback) {
		var i, key;

		if (likeArray(elements)) {
			for (i = 0; i < elements.length; i++) {
				if (callback.call(elements[i], i, elements[i]) === false) {
					return elements;
				}
			}
		} else {
			for (key in elements) {
				if (elements.hasOwnProperty(key)) {
					if (callback.call(elements[key], key, elements[key]) === false) {
						return elements;
					}
				}
			}
		}

		return elements;
	}

	function extend(object) {
		if (!isObject(object) && !isFunction(object)) {
			return object;
		}

		var source, prop, x, length = arguments.length;

		for (x = 1; x < length; x++) {
			source = arguments[x];

			for (prop in source) {
				//if (Y.HasOwnProperty.call(source, prop)) {
				if (source.hasOwnProperty(prop)) {
					object[prop] = source[prop];
				}
			}
		}

		return object;
	}

	function configSet() {
		var args = Y.G.Slice.call(arguments);

		var varName = args[0];
		var newValue = args[1];
		var oldValue;
		var self = Y;
		var setArray;

		Y._CONFIG_STORAGE[varName] = Y._CONFIG_STORAGE[varName] || Object.create({});

		oldValue = Y._CONFIG_STORAGE[varName].LOCAL_VALUE;

		setArray = function (_oldValue, _newValue) {
			// Although these are set individually, they are all accumulated
			if (isUndefined(_oldValue)) {
				self._CONFIG_STORAGE[varName].LOCAL_VALUE = [];
			}

			self._CONFIG_STORAGE[varName].LOCAL_VALUE.push(_newValue);
		};

		switch (varName) {
			case 'extension':
				setArray(oldValue, newValue);
				break;

			case 'Extension':
				setArray(oldValue, newValue);
				break;

			default:
				Y._CONFIG_STORAGE[varName].LOCAL_VALUE = newValue;
				break;
		}

		return oldValue;
	}

	function configGet() {
		var args = Y.G.Slice.call(arguments);

		var varName = args[0];

		if (Y._CONFIG_STORAGE &&
			Y._CONFIG_STORAGE[varName] && !isUndefined(Y._CONFIG_STORAGE[varName].LOCAL_VALUE)) {

			if (isNull(Y._CONFIG_STORAGE[varName].LOCAL_VALUE)) {
				return '';
			}

			return Y._CONFIG_STORAGE[varName].LOCAL_VALUE;
		}

		return '';
	}

	// END OF [Private Functions]

	//---

	/*jshint unused: true */
	each([
		'Boolean',
		'Number',
		'String',
		'Function',
		'Array',
		'Date',
		'RegExp',
		'Object',
		'Error',
		'global',
		'HTMLDocument'
	], function (index, name) {
		classToType['[object ' + name + ']'] = name.toLowerCase();
	});

	//---

	extend(Y.Lang, {
		grep: grep,
		merge: merge
	});

	//---

	extend(Y, {
		setConfig: configSet,
		getConfig: configGet,

		Each: each,

		Foreach: foreach,

		Every: every,

		ClassToType: classToType,

		Extend: function (object) {
			if (!isObject(object) && !isFunction(object)) {
				return object;
			}

			var source, prop, x = 1, length = arguments.length;

			// Extend Y itself if only one argument is passed
			if (length === x) {
				object = this;
				// i = i - 1;
				--x;
			}

			for (x; x < length; x++) {
				source = arguments[x];

				for (prop in source) {
					if (Y.HasOwnProperty.call(source, prop)) {
						// if (source.hasOwnProperty(prop)) {
						object[prop] = source[prop];
					}
				}
			}

			return object;
		},
		
		// ObjectHasProperty: hasProperty,

		// HasProperty: hasProp,

		CallProperty: getOwn
	});

	//---

	// Shortcuts for Lang functions
	extend(Y.Lang, {

		variableDump: variableDump,

		type: type,

		getType: getType,

		isArray: isArray,

		isFloat: isFloat,

		isArraylike: isArraylike,

		isObject: isObject,

		isFunction: isFunction,

		isWindow: isWindow,

		isDocument: isDocument,

		isString: isString,

		isPlainObject: isPlainObject,

		isUndefined: isUndefined,

		isDefined: isDefined,

		likeArray: likeArray,

		isNull: isNull,

		isObjectEmpty: isObjectEmpty,

		empty: empty,

		isEmpty: isEmpty,

		isFunctionEmpty: isFunctionEmpty,

		isBool: isBool,

		isFalse: isFalse,

		isTrue: isTrue,

		isNumber: isNumber,

		isNumeric: isNumber,

		isInteger: isInteger,

		isDouble: isDouble,

		inArray: inArray,

		inArrayOther: inArrayOther,

		unique: unique,

		compact: compact,

		camelise: camelCase,

		toUnderscore: toUnderscore,

		toCamel: toCamel,

		toDash: toDash,

		toArray: toArray,

		randomNumber: randomNumber,

		dasherise: dasherise,

		deserialiseValue: deserialiseValue,

		arrayToObject: arrayToObject,

		objectToArray: objectToArray,

		intoArray: intoArray,

		toObject: toObject,

		isSet: isSet,

		makeArray: function (arrayLikeThing) {
			return Y.G.Slice.call(arrayLikeThing);
		},

		inject: inject,

		hasProperty: hasProperty
	});

	//---

	if (Y.Lang.isSet(Console)) {
		var warn = Console.warn;
		var log = Console.log;
		var error = Console.error;
		var info = Console.info;
		var trace = Console.trace;

		Y.WARN = Function.prototype.bind.call(warn, Console);
		Y.LOG = Function.prototype.bind.call(log, Console);
		Y.ERROR = Function.prototype.bind.call(error, Console);
		Y.INFO = Function.prototype.bind.call(info, Console);
		Y.TRACE = Function.prototype.bind.call(trace, Console);

		// Console.warn = undef;
		// Console.log = undef;
		// Console.error = undef;
		// Console.info = undef;
	} else {
		Y.WARN = Y.Lang.Noop;
		Y.LOG = Y.Lang.Noop;
		Y.ERROR = Y.Lang.Noop;
		Y.INFO = Y.Lang.Noop;
		Y.TRACE = Y.Lang.Noop;
	}

	Y.WARN.toString = function () {
		return '[YAX::Console::Warn]';
	};

	Y.LOG.toString = function () {
		return '[YAX::Console::Log]';
	};

	Y.ERROR.toString = function () {
		return '[YAX::Console::Error]';
	};

	Y.INFO.toString = function () {
		return '[YAX::Console::Info]';
	};

	Y.TRACE.toString = function () {
		return '[YAX::Console::Trace]';
	};

	//---

	// Shortcut function for checking if an object has a given property directly
	// on itself (in other words, not on a prototype).
	Y.Lang.Has = function (obj, key) {
		return obj !== null && Y.HasOwnProperty.call(obj, key);
		// return obj !== null && obj.hasOwnProperty(key);
	};

	// Retrieve the names of an object's properties.
	// Delegates to **ECMAScript 5**'s native `.keys`
	Y.Lang.Keys = function (obj) {
		var key;

		if (!isObject(obj) && !isFunction(obj)) {
			return [];
		}

		if (Object.keys) {
			return Object.keys(obj);
		}

		var keys = [];

		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (Y.Lang.Has(obj, key)) {
					keys.push(key);
				}
			}
		}

		//keys.sort();

		//return keys;
		return keys.sort();
	};

	// Retrieve the values of an object's properties.
	Y.Lang.Values = function (obj) {
		var keys = Y.Lang.Keys(obj);
		var length = keys.length;
		var values = new Array(length);
		var x;

		for (x = 0; x < length; x++) {
			values[x] = obj[keys[x]];
		}

		return values;
	};

	// Convert an object into a list of `[key, value]` pairs.
	Y.Lang.Pairs = function (obj) {
		var keys = Y.Lang.Keys(obj);
		var length = keys.length;
		var pairs = new Array(length);
		var x;

		for (x = 0; x < length; x++) {
			pairs[x] = [keys[x], obj[keys[x]]];
		}

		return pairs;
	};

	// Invert the keys and values of an object. The values must be serializable.
	Y.Lang.Invert = function (obj) {
		var result = {};
		var keys = Y.Lang.Keys(obj);
		var x;
		var length;

		for (x = 0, length = keys.length; x < length; x++) {
			result[obj[keys[x]]] = keys[x];
		}

		return result;
	};

	// Return a sorted list of the function names available on the object.
	// Aliased as `methods`
	Y.Lang.Functions = Y.Lang.Methods = function (obj) {
		var names = [];
		var key;

		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (isFunction(obj[key])) {
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

	var unescapeMap = Y.Lang.Invert(escapeMap);

	// Functions for escaping and unescaping strings to/from HTML interpolation.
	var createEscaper = function (map) {
		var escaper = function (match) {
			return map[match];
		};

		// Regexes for identifying a key that needs to be escaped
		var source = '(?:' + Y.Lang.Keys(map).join('|') + ')';
		var testRegexp = new RegExp(source);
		var replaceRegexp = new RegExp(source, 'g');

		return function (string) {
			string = string === null ? '' : Y.Lang.empty() + string;
			return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
		};
	};

	Y.Lang.Escape = createEscaper(escapeMap);
	Y.Lang.UnEscape = createEscaper(unescapeMap);

	//---

	// Fill in a given object with default properties.
	Y.Lang.Defaults = function (obj) {
		var x;
		var length;
		var source;
		var prop;

		if (!isObject(obj)) {
			return obj;
		}

		for (x = 1, length = arguments.length; x < length; x++) {
			source = arguments[x];

			for (prop in source) {
				if (source.hasOwnProperty(prop)) {
					// if (obj[prop] === eval('void 0')) {
					// if (obj[prop] === void 0) {
					if (obj[prop] === undefined) {
						obj[prop] = source[prop];
					}
				}
			}
		}

		return obj;
	};

	// By default, Underscore uses ERB-style template delimiters, change the
	// following template settings to use alternative delimiters.
	Y.Settings.Template = {
		evaluate: /<%([\s\S]+?)%>/g,
		interpolate: /<%=([\s\S]+?)%>/g,
		escape: /<%-([\s\S]+?)%>/g
	};

	// When customizing `Y.Settings.Template`, if you don't want to define an
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

	var escapeChar = function (match) {
		return '\\' + escapes[match];
	};

	// JavaScript micro-templating, similar to John Resig's implementation.
	// Underscore templating handles arbitrary delimiters, preserves whitespace,
	// and correctly escapes quotes within interpolated code.
	// NB: `oldSettings` only exists for backwards compatibility.
	Y.Lang.Template = function (text, settings, oldSettings) {
		if (!settings && oldSettings) {
			settings = oldSettings;
		}

		settings = Y.Lang.Defaults({}, settings, Y.Settings.Template);

		// Combine delimiters into one regular expression via alternation.
		var matcher = new RegExp([
			(settings.escape || noMatch).source,
			(settings.interpolate || noMatch).source,
			(settings.evaluate || noMatch).source
		].join('|') + '|$', 'g');

		// Compile the template source, escaping string literals appropriately.
		var index = 0;
		var source = '__p += \'';

		text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
			source += text.slice(index, offset).replace(escaper, escapeChar);
			index = offset + match.length;

			if (escape) {
				source += "'+\n((__t=(" + escape + "))==null?'':Y.Lang.Escape(__t))+\n'";
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
			source = 'with (obj || {}) {\n' + source + '}\n';
		}

		source = 'var __t, __p = \'\', __j = Array.prototype.join, ' +
			'print = function () { __p += __j.call(arguments, \'\'); };\n' +
			source + 'return __p;\n';

		var render;

		try {
			/*jshint -W054 */
			render = new Function(settings.variable || 'obj', 'Y', source);
		} catch (e) {
			e.source = source;
			throw e;
		}

		var template;

		template = function (data) {
			return render.call(this, data, Y);
		};

		// Provide the compiled source as a convenience for precompilation.
		/** @namespace settings.variable */
		var argument = settings.variable || 'obj';

		template.source = 'function(' + argument + '){\n' + source + '}';

		return template;
	};

	//---


	Y.setConfig('Use.Console', 'Off');
	Y.setConfig('Extension', 'Use.Console');

	//---


}());

//---


/**
 * YAX Core | RegEx
 *
 * Another YAX's RegEx tools and shortcuts [CORE]
 *
 * @version     0.15
 * @depends:    Core, Global, Utility, Class
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

	Y.RegEx = {
		scriptReplacement: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,

		scriptTypeReplacement: /^(?:text|application)\/javascript/i,

		xmlTypeReplacement: /^(?:text|application)\/xml/i,

		jsonTypeReplacement: /^(?:text|application)\/json/i,

		jsonType: 'application/json, text/json',

		htmlType: 'text/html',

		blankReplacement: /^\s*$/,

		FragmentReplacement: /^\s*<(\w+|!)[^>]*>/,

		SingleTagReplacement: /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

		TagExpanderReplacement:
			/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,

		ReadyReplacement: /complete|loaded|interactive/,

		//SimpleSelectorReplacement = /^[\w-]*$/,
		SimpleSelectorReplacement: /^[\w\-]*$/,

		RootNodeReplacement: /^(?:body|html)$/i
	};

	Y.RegEx.toString = function () {
		return '[YAX.js RegEx]';
	};

	//---

}());

//---


/**
 * Y Core | Global
 *
 * Global Y's functions and shortcuts [CORE]
 *
 * @version     0.15
 * @depends:    Core
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX, window, DOMParser */

(function (undef) {

	'use strict';

	//---

	// Shortcuts global functions

	// Number of active Ajax requests
	// Y.AjaxActive = 0;

	//---


	//---

	Y.Extend(Y.Lang, {
		//now: new Date().getTime(),
		now: new Date().getTime(),

		date: new Date(),

		/**
		 * Delay
		 *
		 * A sleep() like function
		 *
		 * @param    milliseconds Time in milliseconds
		 * @return    void
		 */
		delay: function (milliseconds) {
			var self = this;
			var start = self.now;
			var x;

			for (x = 0; x < 1e7; x++) {
				if ((new Date().getTime() - start) > milliseconds) {
					break;
				}
			}
		},

		parseJSON: JSON.parse
	});

	//---

	if (Y.G.isNode) {
		// Cross-browser XML parsing

		Y.Extend(Y.Lang, {
			parseXML: function (data) {
				if (!data || !Y.Lang.isString(data)) {
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

	Y.Lang.Now = Y.Lang.now;

}());

//---


/**
 * Y Core | Store
 *
 * Powers Y's with store capability [CORE]
 *
 * @version     0.15
 * @depends:    Core, Global, Utility
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

	Y.Extend(Y.Lang, {
		lowerCaseFirst: function (string) {
			string += this.empty();

			var t = string.charAt(0).toLowerCase();

			return t + string.substr(1);
		},

		upperCaseFirst: function (string) {
			string += this.empty();

			var t = string.charAt(0).toUpperCase();

			return t + string.substr(1);
		},

		upperCaseWords: function (string) {
			return (string + this.empty()).replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
				return $1.toUpperCase();
			});
		}
	});

	//---

}());

//---


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
		Trim: function (string) {
			return string.trim ? string.trim() : string.replace(/^\s+|\s+$/g, '');
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

/**
 * Y Core | Class
 *
 * Powers the OOP facilities of Y's [CORE]
 *
 * @version     0.15
 * @depends:    Core, Global, Utility
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

	//---

	/**
	 * Y.Class powers the OOP facilities of the library.
	 */
	Y.Class = function () {};
	// END OF Y.Class OBJECT

	//---

	Y.Class.Extend = Y.Class.extend = function (properties) {
		// Extended class with the new prototype
		var newClass = function () {
			// Call the initialise constructor
			if (this.initialise) {
				this.initialise.apply(this, arguments);
			}

			// Call the construct constructor
			if (this.construct) {
				// this.construct.apply(this, arguments);
				return this.construct.apply(this, arguments);
			}

//			Y.LOG(this.initialHooks);

			// Call all constructor hooks
			if (this.initialHooks.length) {
				this.callInitialHooks();
			}
		};

		var	x;
		var n;
		var len;

		// jshint camelcase: false
		var parentProto = newClass.__super__ = this.prototype;
		var proto = Y.Utility.Create(parentProto);

		proto.constructor = newClass;

		newClass.prototype = proto;

		// Inherit parent's statics
		for (x in this) {
			if (this.hasOwnProperty(x) && x !== 'prototype') {
				newClass[x] = this[x];
			}
		}

		// Y.Log(properties.CLASS_NAME);

		if (properties.CLASS_NAME) {
			Y.Extend(newClass, {
				CLASS_NAME: properties.CLASS_NAME.toString()
			});

			delete properties.CLASS_NAME;
		}

		// Mix static properties into the class
		if (properties.STATICS) {
			Y.Extend(newClass, properties.STATICS);
			delete properties.STATICS;
		}

		// Mix includes into the prototype
		if (properties.INCLUDES) {
			Y.Extend.apply(null, [proto].concat(properties.INCLUDES));
			/** @namespace properties.Includes */
			delete properties.INCLUDES;
		}

		//  OPTIONS
		if (proto.OPTIONS) {
			properties.OPTIONS = Y.Extend(Y.Utility.Create(proto.OPTIONS), properties.OPTIONS);
		}

		// Mix given properties into the prototype
		Y.Extend(proto, properties);

		proto.initialHooks = [];

		// Add method for calling all hooks
		proto.callInitialHooks = function () {
			if (this.initialHooksCalled) {
				return;
			}

			if (parentProto.callInitialHooks) {
				parentProto.callInitialHooks.call(this);
			}

			this.initialHooksCalled = true;

			for (n = 0, len = proto.initialHooks.length; n < len; n++) {
				proto.initialHooks[n].call(this);
			}
		};

		return newClass;
	};

	//---

	// Method for adding properties to prototype
	Y.Class.Include = Y.Class.include = function (properties) {
		Y.Extend(this.prototype, properties);
	};

	//---

	//  new default options to the Class
	Y.Class.Options = Y.Class.options = function (options) {
		Y.Extend(this.prototype.OPTIONS, options);
	};

	//---

	//  new default object to the Class
	Y.Class.MergeObject = Y.Class.mergeObject = function (name, object) {
		Y.Extend(this.prototype[name], object);
	};

	//---

	// Add a constructor hook
	// (Function) || (String, args...)
	Y.Class.addInitialHook = function (func) {
		var args = Y.G.Slice.call(arguments, 1);
		var init;

		if (Y.Lang.isFunction(func)) {
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

	// Y.Class.constructor = Y.Lang.Noop;

	//---

	Y.Class.toString = function () {
		return '[YAX::Class' + (this.CLASS_NAME ? '::' + this.CLASS_NAME + ']' : ']');
	};

	//---

}());

//---


/**
 * Y Core | Tools
 *
 * Another Y's tools and shortcuts [CORE]
 *
 * @version     0.15
 * @depends:    Core, Global, Utility, Class
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

	Y.ToolsClass = Y.Class.Extend({
		CLASS_NAME: 'Tools'
	});

	//---

	Y.Tools = Y.ToolsClass.prototype;

	//---

}());

//---


/**
 * Y Core | Events
 *
 * Events implementation using Y [CORE]
 *
 * @version     0.15
 * @depends:    Core, Global, Utility, Class, Tools
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

	/**
	 * Y.Events is a base class that YAEX classes inherit from to
	 * handle custom events.
	 */
	Y.Events = Y.Class.Extend({
		CLASS_NAME: 'Events',

		eventsArray: [],

		on: function (types, callback, context) {
			var type, i, len;
			// Types can be a map of types/handlers
			if (Y.Lang.isObject(types)) {
				for (type in types) {
					if (Y.HasOwnProperty.call(types, type)) {
						// We don't process space-separated events here for performance;
						// It's a hot path since Layer uses the on(obj) syntax
						this.eventOn(type, types[type], callback);
					}
				}

			} else {
				// types can be a string of space-separated words
				types = Y.Utility.splitWords(types);

				for (i = 0, len = types.length; i < len; i++) {
					this.eventOn(types[i], callback, context);
				}
			}

			return this;
		},

		off: function (types, callback, context) {
			var type, i, len;
			if (!types) {
				// Clear all listeners if called without arguments
				delete this.eventsArray;
			} else if (Y.Lang.isObject(types)) {
				for (type in types) {
					if (Y.HasOwnProperty.call(types, type)) {
						this.eventOff(type, types[type], callback);
					}
				}
			} else {
				types = Y.Utility.splitWords(types);

				for (i = 0, len = types.length; i < len; i++) {
					this.eventOff(types[i], callback, context);
				}
			}

			return this;
		},

		// Attach listener (without syntactic sugar now)
		eventOn: function (type, callback, context) {
			// var events = this.eventsArray = this.eventsArray || {},
			var events = this.eventsArray || {},
				contextId = context && context !== this && Y.Stamp(context),
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
				id = Y.Stamp(callback) + '_' + contextId;

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

		eventOff: function (type, callback, context) {
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

			contextId = context && context !== this && Y.Stamp(context);

			if (contextId) {
				id = Y.Stamp(callback) + '_' + contextId;
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
				listener.callback = Y.Lang.noop;
			}
		},

		fire: function (type, data, propagate) {
			if (!this.listens(type, propagate)) {
				return this;
			}

			var event = Y.Extend({}, data, {type: type, target: this}),
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
					if (Y.HasOwnProperty.call(this.eventParents, id)) {
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
			this.eventParents[Y.Stamp(obj)] = obj;
			return this;
		},

		removeEventParent: function (obj) {
			if (this.eventParents) {
				delete this.eventParents[Y.Stamp(obj)];
			}
			return this;
		},

		propagateEvent: function (e) {
			var id;

			for (id in this.eventParents) {
				if (Y.HasOwnProperty.call(this.eventParents, id)) {
					this.eventParents[id].fire(e.type, Y.Extend({layer: e.target}, e));
				}
			}
		}
	}); // END OF Y.Evented CLASS

	//---

	var prototype = Y.Events.prototype;

	// Aliases; we should ditch those eventually
	prototype.addEventListener = prototype.on;
	prototype.removeEventListener = prototype.clearAllEventListeners = prototype.off;
	prototype.addOneTimeEventListener = prototype.once;
	prototype.fireEvent = prototype.fire;
	prototype.hasEventListeners = prototype.listens;

	Y.Mixin.Events = prototype;

	//---

}());

//---


/**
 * Y Core | Callbacks
 *
 * Callbacks implementation using Y's [CORE]
 *
 * @version     0.15
 * @depends:    Core, Global, Utility, Class
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function (undef) {

	'use strict';

	var rnotwhite = (/\S+/g);

	// String to Object options format cache
	var optionsCache = Object.create({});

	// Convert String-formatted options into Object-formatted ones and store in cache
	function createOptions (options) {
		var object = optionsCache[options] = {};

		Y.Each(options.match(rnotwhite) || [], function(_, flag) {
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

		// options = Y.Extend({}, options || {});

		if (Y.Lang.isString(options)) {
			options = optionsCache[options] || createOptions(options);
		} else {
			options = Y.Extend({}, options);
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
						Y.Each(args, function (_, arg) {
							if (Y.Lang.isFunction(arg)) {
								if (!options.unique || !Callbacks.has(arg)) {
									list.push(arg);
								}
							} else if (arg && arg.length && !Y.Lang.isString(arg)) {
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
					Y.Each(arguments, function (_, arg) {
						var index = 0;
						while ((index = Y.Lang.inArray(arg, list, index)) > -1) {
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
				return !!(list && (fn ? Y.Lang.inArray(fn, list) > -1 : list.length));
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

//---


/**
 * Y Core | Deferred
 *
 * Deferred implementation using Y's [CORE]
 *
 * @version     0.15
 * @depends:    Core, Global, Utility, Class
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
					Y.Each(tuples, function (x, tuple) {
						var fn = Y.Lang.isFunction(fns[x]) && fns[x];
						deferred[tuple[1]](function () {
							var returned = fn && fn.apply(this, arguments);
							if (returned && Y.Lang.isFunction(returned.promise)) {
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
				return obj !== null ? Y.Extend(obj, promise) : promise;
			}
		};

		var deferred = Object.create({});

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		Y.Each(tuples, function (x, tuple) {
			var list = tuple[2],
				stateString = tuple[3];

			promise[tuple[1]] = list.add;

			if (stateString) {
				list.add(function () {
					state = stateString;
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

	Y.Lang.When = function (sub) {
		var resolveValues = Y.G.Slice.call(arguments),
			len = resolveValues.length,
			x = 0,
			remain = len !== 1 || (sub && Y.Lang.isFunction(sub.promise)) ? len : 0,
			deferred = remain === 1 ? sub : newDeferred(),
			progressValues, progressContexts, resolveContexts,
			updateFn = function (x, ctx, val) {
				return function (value) {
					ctx[x] = this;

					val[x] = arguments.length > 1 ? Y.G.Slice.call(arguments) : value;

					if (val === progressValues) {
						deferred.notifyWith(ctx, val);
					} else if (!(--remain)) {
						deferred.resolveWith(ctx, val);
					}
				};
			};

		if (len > 1) {
			progressValues = [len];
			progressContexts = [len];
			resolveContexts = [len];

			for (x; x < len; ++x) {
				if (resolveValues[x] && Y.Lang.isFunction(resolveValues[x].promise)) {
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

//---


/**
 * Y Core | Store
 *
 * Powers Y's with store capability [CORE]
 *
 * @version     0.15
 * @depends:    Core, Global, Utility
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, Y, XMLSerializer, DOMParser, ActiveX */

(function (global, undef) {

	'use strict';

	Y.Store = Y.Class.Extend({
		STATICS: {
			// FOO: 'FOOED!!'
		},

		CLASS_NAME: 'Store',

		Serialisers: {
			JSON: {
				ID: 'Y.Store.Serialisers.JSON',

				'Initialise': function (encoders, decoders) {
					encoders.push('JSON');
					decoders.push('JSON');
				},

				Encode: JSON.stringify,

				Decode: JSON.parse
			},

			XML: {
				ID: 'Y.Store.Serialisers.XML',

				'Initialise': function (encoders, decoders) {
					encoders.push('XML');
					decoders.push('XML');
				},

				isXML: function (value) {
					var docElement = (value ? value.ownerDocument || value : 0 ).documentElement;
					return docElement ? docElement.nodeName.toLowerCase() !== 'html' : false;
				},

				// Encodes a XML node to string (taken from $.jStorage, MIT License)
				Encode: function (value) {
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
							console.error(er);
						}

						console.error(err);
					}

					return value;
				},

				// Decodes a XML node from string (taken from $.jStorage, MIT License)
				Decode: function (value) {
					if (!value || value._serialised || value._serialised !== this.ID) {
						return value;
					}

					var domParser = (Y.HasOwnProperty.call(global, 'DOMParser') && (new DOMParser()).parseFromString);

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
						(Y.HasOwnProperty.call(global, 'DOMParser') && (new DOMParser())) || Y.Window,
						value.value,
						'text/xml'
					);

					return this.isXML( value.value ) ? value.value : undef;
				}
			}
		},

		Drivers: {
			WindowName: {
				ID: 'Y.Store.Drivers.WindowName',

				Scope: 'Window',

				Cache: {

				},

				Encodes: true,

				/**
				 *
				 * @returns {boolean}
				 * @constructor
				 */
				Available: function () {
					return true;
				},

				Initialise: function () {
					this.Load();
				},

				Save: function () {
					global.name = Y.Store.prototype.Serialisers.JSON.Encode(this.Cache);
				},

				Load: function () {
					try {
						this.Cache = Y.Store.prototype.Serialisers.JSON.Decode(global.name + Y.Lang.empty);

						if (!Y.Lang.isObject(this.Cache)) {
							this.Cache = {};
						}
					} catch (e) {
						this.Cache = {};
						global.name = '{}';
					}
				},

				Set: function (key, value) {
					this.Cache[key] = value;
					this.Save();
				},

				Get: function (key) {
					return this.Cache[key];
				},

				Delete: function (key) {
					try {
						delete this.Cache[key];
					} catch (e) {
						this.Cache[key] = undef;
					}

					this.Save();
				},

				Flush: function () {
					global.name = '{}';
				}
			}
		},

		construct: function () {
			var args = Y.G.Slice.call(arguments),
				len = args.length,
				x = 0;
//				tmpFunc;

//			tmpFunc = function (variable) {
//				var t = Y.Lang.strReplace('-', ' ', variable);
//
//				t = Y.Lang.upperCaseWords(t);
//				t = Y.Lang.strReplace(' ', '', t);
//
//				return t;
//			};

//			for (x; x < len; x++) {
//				this.loaded_driver = this.Drivers[tmpFunc(args[x])];
//			}

			if (len === 1) {
				// this[args[0]] = this.Drivers[args[0]];
				Y.Extend(this, this.Drivers[args[0]]);

				// delete this.Drivers[args[0]];
			} else if (len > 1) {
				for (x; x < len; x++) {
					this[args[x]] = this.Drivers[args[x]];
					// delete this.Drivers[args[x]];
				}
			} else {
				Y.Extend(this, this.Drivers);
				// delete this.Drivers;
			}
		}
	});

	//---

	// Y.Data = Y.Store.prototype.Serialisers;

	//---

}());

//---


/**
 * Y Core | Parsers
 *
 * Powers Y's with Parsers capability [CORE]
 *
 * @version     0.15
 * @depends:    Core, Global, Utility
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, Y, XMLSerializer, DOMParser, ActiveX */

(function (global, undef) {

	'use strict';

	Y.Parser = Y.Class.Extend({
		STATICS: {
			// FOO: 'FOOED!!'
		},

		CLASS_NAME: 'Parser',

		Serialisers: {
			JSON: {
				ID: 'Y.Store.Serialisers.JSON',

				'Initialise': function (encoders, decoders) {
					encoders.push('JSON');
					decoders.push('JSON');
				},

				Encode: JSON.stringify,

				Decode: JSON.parse
			},

			XML: {
				ID: 'Y.Store.Serialisers.XML',

				'Initialise': function (encoders, decoders) {
					encoders.push('XML');
					decoders.push('XML');
				},

				isXML: function (value) {
					var docElement = (value ? value.ownerDocument || value : 0 ).documentElement;
					return docElement ? docElement.nodeName.toLowerCase() !== 'html' : false;
				},

				// Encodes a XML node to string (taken from $.jStorage, MIT License)
				Encode: function (value) {
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
							console.error(er);
						}

						console.error(err);
					}

					return value;
				},

				// Decodes a XML node from string (taken from $.jStorage, MIT License)
				Decode: function (value) {
					if (!value || value._serialised || value._serialised !== this.ID) {
						return value;
					}

					var domParser = (Y.HasOwnProperty.call(global, 'DOMParser') && (new DOMParser()).parseFromString);

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
							(Y.HasOwnProperty.call(global, 'DOMParser') && (new DOMParser())) || Y.Window,
						value.value,
						'text/xml'
					);

					return this.isXML( value.value ) ? value.value : undef;
				}
			}
		},

		Drivers: {},

		construct: function () {
			var args = Y.G.Slice.call(arguments),
				len = args.length,
				x = 0;

			if (len === 1) {
				Y.Extend(this, this.Drivers[args[0]]);
			} else if (len > 1) {
				for (x; x < len; x++) {
					this[args[x]] = this.Drivers[args[x]];
				}
			} else {
				Y.Extend(this, this.Drivers);
			}
		}
	});

	//---

	//	Y.Parsers = Y.Parser.prototype.Drivers;

	//---

}());

//---


/**
 * Y Core | Store
 *
 * Powers Y's with store capability [CORE]
 *
 * @version     0.15
 * @depends:    Core, Global, Utility
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*jshint unused: false */
/*global YAX, Y */

(function () {

	'use strict';

	Y.Locale = Y.Class.Extend({
		STATICS: {
			// FOO: 'FOOED!!'
		},

		CLASS_NAME: 'I18N',

		construct: function () {
			this.reset();

			this._ = this.Translate;
		},

		globalContext: null,

		data: null,

		languageData: null,

		Translate: function (text, langNumOrFormatting, numOrFormattingOrContext,
			formattingOrContext, context) {

			var formatting,
				lang,
				num;

			if (Y.Lang.isNull(context)) {
				context = this.globalContext;
			}

			if (Y.Lang.isObject(langNumOrFormatting)) {
				lang = null;
				num = null;
				formatting = langNumOrFormatting;
				context = numOrFormattingOrContext || this.globalContext;
			} else {
				if (Y.Lang.isNumber(langNumOrFormatting)) {
					lang = null;
					num = langNumOrFormatting;
					formatting = numOrFormattingOrContext;
					context = formattingOrContext || this.globalContext;
				} else {
					lang = langNumOrFormatting;
					if (Y.Lang.isNumber(numOrFormattingOrContext)) {
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

			//console.log(lang);

			if (Y.Lang.isObject(text)) {
				/** @namespace text.i18n */
				if (Y.Lang.isObject(text.i18n)) {
					text = text.i18n;
				}

				return this.translateHash(text, context, lang);
				//return Y.Locale.prototype.translateHash(text, context, lang);
			}

			return this.translate(text, num, formatting, context, lang);
			//return Y.Locale.prototype.translate(text, num, formatting, context, lang);
		},

		add: function (d, lang) {
			var c, data, k,
				v, _i, _len,
				_ref, _ref1,
				_results;

			if (Y.Lang.isSet(lang)) {
				this.languageData[lang] = null;

				if (Y.Lang.isNull(this.languageData[lang])) {
					this.languageData[lang] = {
						values: {},
						contexts: []
					};
				}

				data = this.languageData[lang];
			} else {
				data = this.data;
			}

			//

			if (Y.Lang.isSet(d.values)) {
				_ref = d.values;

				for (k in _ref) {
					if (_ref.hasOwnProperty(k)) {
						v = _ref[k];

						data.values[k] = v;
					}
				}
			}

			if (Y.Lang.isSet(d.contexts)) {
				_ref1 = d.contexts;
				_results = [];

				for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
					c = _ref1[_i];
					_results.push(data.contexts.push(c));
				}

				return _results;
			}
		},

		setContext: function (key, value) {
			this.globalContext[key] = value;
			return this.globalContext[key];
		},

		clearContext: function (key) {
			this.globalContext[key] = null;
			return this.globalContext[key];
		},

		reset: function () {
			this.data = {
				values: {},
				contexts: []
			};

			this.globalContext = {};
			this.languageData = {};

			return this.languageData;
		},

		resetData: function () {
			this.data = {
				values: {},
				contexts: []
			};

			this.languageData = {};

			return this.languageData;
		},

		resetContext: function () {
			this.globalContext = {};

			return this.globalContext;
		},

		resetLanguage: function (lang) {
			this.languageData[lang] = null;

			return this.languageData[lang];
		},

		translateHash: function (hash, context, language) {
			var k, v;

			for (k in hash) {
				if (hash.hasOwnProperty(k)) {
					v = hash[k];

					if (Y.Lang.isString(v)) {
						hash[k] = this.translate(v, null, null, context, language);
					}
				}
			}

			return hash;
		},

		translate: function (text, num, formatting, context, language) {
			var contextData, data, result;

			if (Y.Lang.isNull(context)) {
				context = this.globalContext;
			}

			if (!Y.Lang.isNull(language)) {
				data = this.languageData[language];
			}

			if (Y.Lang.isUndefined(data)) {
				data = this.data;
			}

			//			if (data == null) {
			//				data = this.data;
			//			}

			//			if (data == null) {
			//				return this.useOriginalText(text, num, formatting);
			//			}

			if (Y.Lang.isNull(data)) {
				return this.useOriginalText(text, num, formatting);
			}

			contextData = this.getContextData(data, context);

			if (!Y.Lang.isNull(contextData)) {
				result = this.findTranslation(text, num, formatting, contextData.values);
			}

			//			if (result == null) {
			//				result = this.findTranslation(text, num, formatting, data.values);
			//			}
			//
			//			if (result == null) {
			//				return this.useOriginalText(text, num, formatting);
			//			}

			if (Y.Lang.isUndefined(result)) {
				result = this.findTranslation(text, num, formatting, data.values);
			}

			if (Y.Lang.isNull(result)) {
				return this.useOriginalText(text, num, formatting);
			}

			return result;
		},

		findTranslation: function (text, num, formatting, data) {
			var result, triple, value, _i, _len;
			value = data[text];


			if (Y.Lang.isNull(value)) {
				return null;
			}

			if (Y.Lang.isNull(num)) {
				if (Y.Lang.isString(value)) {
					return this.applyFormatting(value, num, formatting);
				}
			} else {
				if (value instanceof Array || value.length) {
					for (_i = 0, _len = value.length; _i < _len; _i++) {
						triple = value[_i];

						if ((num >= triple[0] || Y.Lang.isNull(triple[0])) && (num <= triple[1] ||
							Y.Lang.isNull(triple[1]))) {
							result = this.applyFormatting(triple[2].replace("-%n", String(-num)),
								num, formatting);
							return this.applyFormatting(result.replace("%n", String(num)), num,
								formatting);
						}
					}
				}
			}

			return null;
		},

		getContextData: function (data, context) {
			var c, equal, key,
				value, _i, _len,
				_ref, _ref1;

			if (!Y.Lang.isSet(data.contexts) || Y.Lang.isNull(data.contexts)) {
				return null;
			}

			_ref = data.contexts;

			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				c = _ref[_i];

				equal = true;

				/** @namespace c.matches */
				_ref1 = c.matches;

				for (key in _ref1) {
					value = _ref1[key];
					equal = equal && value === context[key];
				}

				if (equal) {
					return c;
				}
			}

			return null;
		},

		useOriginalText: function (text, num, formatting) {
			if (Y.Lang.isNull(num)) {
				return this.applyFormatting(text, num, formatting);
			}

			return this.applyFormatting(text.replace("%n", String(num)), num,
				formatting);
		},

		applyFormatting: function (text, num, formatting) {
			var ind, regex;

			for (ind in formatting) {
				if (formatting.hasOwnProperty(ind)) {
					regex = new RegExp("%{" + ind + "}", "g");
					text = text.replace(regex, formatting[ind]);
				}
			}

			return text;
		}
	});

	//---

	Y.Locale = new Y.Locale();

	// delete Y.Locale;

	//---

}());

//---


