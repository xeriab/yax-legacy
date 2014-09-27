/**
 * Y Core | Locale
 *
 * Powers Y's with Localisation capability [CORE]
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
