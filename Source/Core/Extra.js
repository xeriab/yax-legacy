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

	//---

}());

// FILE: ./Source/Core/Extra.js

//---