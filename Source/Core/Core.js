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
		return Y.G.ToString.call(object) === '[object Array]';
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

		return Y.G.IndexOf.call(array, element, num);
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
				Y.G.Push.call(ret, arr);
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
		return Y.G.Filter.call(array, function(item) {
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
		return Y.G.Filter.call(array, function(item, index) {
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
		return Y.G.Filter.call(elements, callback);
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

	function configSet() {
		var args = Y.G.Slice.call(arguments);

		var varName = args[0];
		var newValue = args[1];
		var oldValue;
		var self = Y;
		var setArray;

		Y._CONFIG_STORAGE[varName] = Y._CONFIG_STORAGE[varName] || {};

		oldValue = Y._CONFIG_STORAGE[varName].LOCAL_VALUE;

		setArray = function(_oldValue, _newValue) {
			// Although these are set individually, they are all accumulated
			if (Y.isUndefined(_oldValue)) {
				self._CONFIG_STORAGE[varName].LOCAL_VALUE = [];
			}

			self._CONFIG_STORAGE[varName].LOCAL_VALUE.push(_newValue);
		};

		switch (varName) {
			case 'extension':
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
			Y._CONFIG_STORAGE[varName] && !Y.isUndefined(Y._CONFIG_STORAGE[varName].LOCAL_VALUE)) {

			if (Y.isNull(Y._CONFIG_STORAGE[varName].LOCAL_VALUE)) {
				return '';
			}

			return Y._CONFIG_STORAGE[varName].LOCAL_VALUE;
		}

		return '';
	}

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
//		'Function',
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
		setConfig: configSet,
		getConfig: configGet,
		callProperty: getOwn,
		variableDump: variableDump,
		inArrayOther: inArrayOther,
		unique: unique,
		compact: compact,
		camelise: camelCase,
		toUnderscore: toUnderscore,
		toCamel: toCamel,
		toDash: toDash,
		toArray: toArray,
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

		settings = Y.defaults({}, settings, Y.Settings.Template);

		// Combine delimiters into one regular expression via alternation.
		var matcher = new RegExp([
			(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source
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

				Y.G.Push.apply(args, arguments);

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

	//---

	Y.setConfig('YAX.Core.Use.console', false);
	Y.setConfig('extension', 'YAX.Core.Use.console');

	//---

}());

// FILE: ./Source/Core/Core.js

//---