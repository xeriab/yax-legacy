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
