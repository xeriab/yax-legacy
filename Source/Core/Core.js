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
				if (Y.HasOwnProperty.call(object, x)) {
					tmp.push([x, object[x]]);
				}
			}
		} else {
			for (n in object) {
				if (Y.HasOwnProperty.call(object, n)) {
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

		for (x = 0; x < length; x++) {
			source = arguments[x];

			for (prop in source) {
				if (Y.HasOwnProperty.call(source, prop)) {
					object[prop] = source[prop];
				}
			}
		}

		return object;
	}

	function configSet(varname, newvalue) {
		var oldval;
		var self = Y;
		var setArr;

		Y._CONFIG_STORAGE[varname] = Y._CONFIG_STORAGE[varname] || Object.create({});

		oldval = Y._CONFIG_STORAGE[varname].LOCAL_VALUE;

		setArr = function (oldval) {
			// Although these are set individually, they are all accumulated
			if (isUndefined(oldval)) {
				self._CONFIG_STORAGE[varname].LOCAL_VALUE = [];
			}

			self._CONFIG_STORAGE[varname].LOCAL_VALUE.push(newvalue);
		};

		switch (varname) {
			case 'extension':
				setArr(oldval, newvalue);
				break;

			case 'Extension':
				setArr(oldval, newvalue);
				break;

			default:
				Y._CONFIG_STORAGE[varname].LOCAL_VALUE = newvalue;
				break;
		}

		return oldval;
	}

	function configGet(varname) {
		if (Y._CONFIG_STORAGE &&
			Y._CONFIG_STORAGE[varname] && !isUndefined(Y._CONFIG_STORAGE[varname].LOCAL_VALUE)) {

			if (isNull(Y._CONFIG_STORAGE[varname].LOCAL_VALUE)) {
				return '';
			}

			return Y._CONFIG_STORAGE[varname].LOCAL_VALUE;
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
				object = this || Y;
				// i = i - 1;
				--x;
			}

			for (x; x < length; x++) {
				source = arguments[x];

				for (prop in source) {
					if (Y.HasOwnProperty.call(source, prop)) {
						object[prop] = source[prop];
					}
				}
			}

			return object;
		},

		ObjectHasProperty: hasProperty,

		HasProperty: hasProp,

		CallProperty: getOwn,

		Inject: inject
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
		}
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
	Y.Lang.Has = function(obj, key) {
		return obj !== null && Y.HasOwnProperty.call(obj, key);
	};

	// Retrieve the names of an object's properties.
	// Delegates to **ECMAScript 5**'s native `.keys`
	Y.Lang.Keys = function(obj) {
		var key;

		if (!isObject(obj) && !isFunction(obj)) {
			return [];
		}

		if (Object.keys) {
			return Object.keys(obj);
		}

		var keys = [];

		for (key in obj) {
			if (Y.Lang.Has(obj, key)) {
				keys.push(key);
			}
		}

		//keys.sort();

		//return keys;
		return keys.sort();
	};

	// Retrieve the values of an object's properties.
	Y.Lang.Values = function(obj) {
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
	Y.Lang.Pairs = function(obj) {
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
	Y.Lang.Invert = function(obj) {
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
	Y.Lang.Functions = Y.Lang.Methods = function(obj) {
		var names = [];
		var key;

		for (key in obj) {
			if (isFunction(obj[key])) {
				names.push(key);
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
				// if (obj[prop] === eval('void 0')) {
				if (obj[prop] === void 0) {
					obj[prop] = source[prop];
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
			// jslint eval: false
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

}());

//---
