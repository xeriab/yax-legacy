/**
 * YAX JSON Parser [CORE][EXTENSION]
 */

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y */

(function (global) {

	//---

	'use strict';

	Y.config.set('JSON.lastError', 0);
	Y.config.set('JSON.spaces', 0);

	function jsonLastError () {
		/**
			JSON_ERROR_NONE = 0
			JSON_ERROR_DEPTH = 1
			JSON_ERROR_STATE_MISMATCH = 2
			JSON_ERROR_CTRL_CHAR = 3
			JSON_ERROR_SYNTAX = 4
		*/
		return Y.config.get('JSON.lastError');
	}

	function jsonEncode (mixed_val) {
		var retVal;

		var json = global.JSON;

		try {
			if (Y.isObject(json) && Y.isFunction(json.stringify)) {
				// Errors will not be caught here if our own equivalent to resource
				retVal = json.stringify(mixed_val, null, Y.config.get('JSON.spaces'));

				if (Y.isUndefined(retVal)) {
					// throw new SyntaxError('jsonEncode');
					throw new SyntaxError('jsonEncode: Cannot parse undefined variables');
				}

				return retVal;
			}

			var val = mixed_val;

			var quote = function (string) {
				var escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
				var meta = { // table of character substitutions
					'\b': '\\b',
					'\t': '\\t',
					'\n': '\\n',
					'\f': '\\f',
					'\r': '\\r',
					'"': '\\"',
					'\\': '\\\\'
				};

				escapable.lastIndex = 0;

				return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
					var c = meta[a];
					return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				}) + '"' : '"' + string + '"';
			};

			var str = function (key, holder) {
				var gap = '';
				var indent = '    ';
				var i = 0; // The loop counter.
				var k = ''; // The member key.
				var v = ''; // The member value.
				var length = 0;
				var mind = gap;
				var partial = [];
				var value = holder[key];

				// If the value has a toJSON method, call it to obtain a replacement value.
				if (value && Y.isObject(value) &&
					Y.isFunction(value.toJSON)) {
					value = value.toJSON(key);
				}

				// What happens next depends on the value's type.
				switch (Y.typeOf(value)) {
					case 'string':
						return quote(value);

					case 'number':
						// JSON numbers must be finite. Encode non-finite numbers as null.
						return Y.isFinite(value) ? String(value) : 'null';

					case 'boolean':
					case 'null':
						// If the value is a boolean or null, convert it to a string. Note:
						// typeof null does not produce 'null'. The case is included here in
						// the remote chance that this gets fixed someday.
						return String(value);

					case 'object':
						// If the type is 'object', we might be dealing with an object or an array or
						// null.
						// Due to a specification blunder in ECMAScript, typeof null is 'object',
						// so watch out for that case.
						if (!value) {
							return 'null';
						}

						// Make an array to hold the partial results of stringifying this object value.
						gap += indent;
						partial = [];

						// Is the value an array?
						if (Object.prototype.toString.apply(value) === '[object Array]') {
							// The value is an array. Stringify every element. Use null as a placeholder
							// for non-JSON values.
							length = value.length;
							for (i = 0; i < length; i += 1) {
								partial[i] = str(i, value) || 'null';
							}

							// Join all of the elements together, separated with commas, and wrap them in
							// brackets.
							v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
							gap = mind;
							return v;
						}

						// Iterate through all of the keys in the object.
						for (k in value) {
							if (Object.hasOwnProperty.call(value, k)) {
								v = str(k, value);
								if (v) {
									partial.push(quote(k) + (gap ? ': ' : ':') + v);
								}
							}
						}

						// Join all of the member texts together, separated with commas,
						// and wrap them in braces.
						v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
						gap = mind;

						return v;

					case 'function':
						// throw new SyntaxError('jsonEncode');
						throw new SyntaxError('jsonEncode: Cannot parse functions');

					case 'undefined':
						// throw new SyntaxError('jsonEncode');
						throw new SyntaxError('jsonEncode: Cannot parse undefined variables');

					default:
						// throw new SyntaxError('jsonEncode');
						throw new SyntaxError('jsonEncode: Cannot parse unknown variables');
				}
			};

			// Make a fake root object containing our value under the key of ''.
			// Return the result of stringifying the value.
			return str('', {'': val});

		} catch (err) {
			// Todo: ensure error handling above throws a SyntaxError in all cases where it could
			// (i.e., when the JSON global is not available and there is an error)
			if (!(err instanceof SyntaxError)) {
				throw new Error('Unexpected error type in jsonEncode()');
				// Y.ERROR('Unexpected error type in jsonEncode()');
			}

			// usable by jsonLastError()
			Y.config.set('JSON.lastError', 4);

			// Y.ERROR(err.message);

			return null;
		}
	}

	function jsonDecode (str_json) {
		var json = global.JSON;

		if (typeof json === 'object' && typeof json.parse === 'function') {
			try {
				return json.parse(str_json);
			} catch (err) {
				if (!(err instanceof SyntaxError)) {
					throw new Error('Unexpected error type in jsonDecode()');
					// Y.ERROR('Unexpected error type in jsonDecode()');
				}

				// usable by jsonLastError()
				Y.config.set('JSON.lastError', 4);

				return null;
			}
		}

		var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
		var j;
		var text = str_json;

		// Parsing happens in four stages. In the first stage, we replace certain
		// Unicode characters with escape sequences. JavaScript handles many characters
		// incorrectly, either silently deleting them, or treating them as line endings.
		cx.lastIndex = 0;

		if (cx.test(text)) {
			text = text.replace(cx, function (a) {
				return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
			});
		}

		// In the second stage, we run the text against regular expressions that look
		// for non-JSON patterns. We are especially concerned with '()' and 'new'
		// because they can cause invocation, and '=' because it can cause mutation.
		// But just to be safe, we want to reject all unexpected forms.
		// We split the second stage into 4 regexp operations in order to work around
		// crippling inefficiencies in IE's and Safari's regexp engines. First we
		// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
		// replace all simple value tokens with ']' characters. Third, we delete all
		// open brackets that follow a colon or comma or that begin the text. Finally,
		// we look to see that the remaining characters are only whitespace or ']' or
		// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
		if ((/^[\],:{}\s]*$/).
			test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
				replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
				replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

			// In the third stage we use the eval function to compile the text into a
			// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
			// in JavaScript: it can begin a block or an object literal. We wrap the text
			// in parens to eliminate the ambiguity.
			// jshint evil:true
			j = eval('(' + text + ')');

			return j;
		}

		// usable by jsonLastError()
		Y.config.set('JSON.lastError', 4);

		return null;
	}

	Y.Parser.mergeObject('drivers', {
		JSON: {
			id: 'Y.Parser.drivers.JSON',

			lastError: jsonLastError,

			encode: jsonEncode,

			decode: jsonDecode
		}
	});

	//---

}());

// FILE: ./Source/Extensions/NeoJSON.js

//---
