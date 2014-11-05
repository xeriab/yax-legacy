/**
 * YAX I18n [Contrib]
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

	Y.define('YAX/I18n', function (require, exports, module) {
		var YAX_I18n;

		YAX_I18n = function (text, langNumOrFormatting, numOrFormattingOrContext, formattingOrContext, context) {
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

				return YAX_I18n.translateHash(text, context, lang);
			}

			return YAX_I18n.translate(text, num, formatting, context, lang);
		};

		YAX_I18n.globalContext = null;
		YAX_I18n.data = null;
		YAX_I18n.languageData = null;

		YAX_I18n.add = function (d, lang) {
			var c, data, k,
				v, _i, _len,
				_ref, _ref1,
				_results;

			if (Y.isSet(lang)) {
				YAX_I18n.languageData[lang] = null;

				if (Y.isNull(YAX_I18n.languageData[lang])) {
					YAX_I18n.languageData[lang] = {
						values: {},
						contexts: []
					};
				}

				data = YAX_I18n.languageData[lang];
			} else {
				data = YAX_I18n.data;
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

		YAX_I18n.setContext = function (key, value) {
			YAX_I18n.globalContext[key] = value;
			return YAX_I18n.globalContext[key];
		};

		YAX_I18n.clearContext = function (key) {
			YAX_I18n.globalContext[key] = null;
			return YAX_I18n.globalContext[key];
		};

		YAX_I18n.reset = function () {
			YAX_I18n.data = {
				values: {},
				contexts: []
			};

			YAX_I18n.globalContext = {};
			YAX_I18n.languageData = {};

			return YAX_I18n.languageData;
		};

		YAX_I18n.resetData = function () {
			YAX_I18n.data = {
				values: {},
				contexts: []
			};

			YAX_I18n.languageData = {};
			return YAX_I18n.languageData;
		};

		YAX_I18n.resetContext = function () {
			YAX_I18n.globalContext = {};
			return YAX_I18n.globalContext;
		};

		YAX_I18n.resetLanguage = function (lang) {
			YAX_I18n.languageData[lang] = null;
			return YAX_I18n.languageData[lang];
		};

		YAX_I18n.translateHash = function (hash, context, language) {
			var k, v;

			for (k in hash) {
				if (hash.hasOwnProperty(k)) {
					v = hash[k];

					if (Y.isString(v)) {
						hash[k] = YAX_I18n.translate(v, null, null, context, language);
					}
				}
			}

			return hash;
		};

		YAX_I18n.translate = function (text, num, formatting, context, language) {
			var contextData, data, result;

			if (Y.isNull(context)) {
				context = YAX_I18n.globalContext;
			}

			if (!Y.isNull(language)) {
				data = YAX_I18n.languageData[language];
			}

			if (Y.isUndefined(data)) {
				data = YAX_I18n.data;
			}

			//if (data == null) {
			//	data = YAX_I18n.data;
			//}

			//if (data == null) {
			//	return YAX_I18n.useOriginalText(text, num, formatting);
			//}

			if (Y.isNull(data)) {
				return YAX_I18n.useOriginalText(text, num, formatting);
			}

			contextData = YAX_I18n.getContextData(data, context);

			if (!Y.isNull(contextData)) {
				result = YAX_I18n.findTranslation(text, num, formatting, contextData.values);
			}

			//if (result == null) {
			//	result = YAX_I18n.findTranslation(text, num, formatting, data.values);
			//}

			//if (result == null) {
			//	return YAX_I18n.useOriginalText(text, num, formatting);
			//}

			if (Y.isUndefined(result)) {
				result = YAX_I18n.findTranslation(text, num, formatting, data.values);
			}

			if (Y.isNull(result)) {
				return YAX_I18n.useOriginalText(text, num, formatting);
			}

			return result;
		};

		YAX_I18n.translateHash = function (hash, context, language) {
			var k, v;

			for (k in hash) {
				if (hash.hasOwnProperty(k)) {
					v = hash[k];

					if (Y.isString(v)) {
						hash[k] = YAX_I18n.translate(v, null, null, context, language);
					}
				}
			}

			return hash;
		};

		YAX_I18n.findTranslation = function (text, num, formatting, data) {
			var result, triple, value, _i, _len;
			value = data[text];


			if (Y.isNull(value)) {
				return null;
			}

			if (Y.isNull(num)) {
				if (Y.isString(value)) {
					return YAX_I18n.applyFormatting(value, num, formatting);
				}
			} else {
				if (value instanceof Array || value.length) {
					for (_i = 0, _len = value.length; _i < _len; _i++) {
						triple = value[_i];

						if ((num >= triple[0] || Y.isNull(triple[0])) && (num <= triple[1] ||
							Y.isNull(triple[1]))) {
							result = YAX_I18n.applyFormatting(triple[2].replace("-%n", String(-num)),
								num, formatting);
							return YAX_I18n.applyFormatting(result.replace("%n", String(num)), num,
								formatting);
						}
					}
				}
			}

			return null;
		};

		YAX_I18n.getContextData = function (data, context) {
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

		YAX_I18n.useOriginalText = function (text, num, formatting) {
			if (Y.isNull(num)) {
				return YAX_I18n.applyFormatting(text, num, formatting);
			}

			return YAX_I18n.applyFormatting(text.replace("%n", String(num)), num,
				formatting);
		};

		YAX_I18n.applyFormatting = function (text, num, formatting) {
			var ind, regex;

			for (ind in formatting) {
				if (formatting.hasOwnProperty(ind)) {
					regex = new RegExp("%{" + ind + "}", "g");
					text = text.replace(regex, formatting[ind]);
				}
			}

			return text;
		};

		module.exports = YAX_I18n;
	});

	//---

	Y.i18n = Y.require('YAX/I18n');

	Y.i18n.reset();

	Y._t = Y.i18n;

	//---

}());

// FILE: ./Source/Core/Contrib/I18n.js

//---
