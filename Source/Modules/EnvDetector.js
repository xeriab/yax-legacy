/**
 * YAX Env./System/UserAgent Detector [DOM/NODE][CORE][Module]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX, module */

(function () {

	//---

	'use strict';

	var _env = (function () {

		/**
		 * Detect Suite
		 *
		 * Tests the client against a variety of modern browser features.
		 * These tests are primarily from Mark Pilgrim's "Dive Into HTML5" section
		 * "The All-In-One Almost-Alphabetical No-Bullshit Guide to Detecting Everything."
		 *
		 * You can find "Dive Into HTML5" here: http://www.diveintohtml5.net/
		 *
		 * "Dive Into HTML5" is protected by (CC BY 3.0):
		 * http://creativecommons.org/licenses/by/3.0/
		 */
		var testInput = function testInput(type) {
			var temp = Y.doc.createElement('input');
			temp.setAttribute('type', type);
			return temp.type !== 'text';
		};

		function detectEnv() {
			var res = {};
			var key;

			for (key in _env) {
				if (_env.hasOwnProperty(key)) {
					if (Y.isFunction(_env[key]) && _env[key]()) {
						res[key] = true;
					} else if (!Y.isFunction(_env[key]) && _env[key]) {
						res[key] = _env[key];
					} else if (Y.isObject(_env[key]) && _env[key]) {
						res[key] = _env[key];
					}
				}
			}

			return res;
		}

		function isDom() {
			if (!Y.isDocument(Y.doc) || Y.isUndefined(Y.doc)) {
				return false;
			}

			return !Y.isUndefined(Y.doc.documentElement);
		}

		function isJsc() {
			try {
				throw new Error();
			} catch (err) {
				/** @namespace err.sourceId */
				return Y.isNumber(err.sourceId);
			}
		}

		function isModules() {
			// return !(Y.isUndefined(module) && !Y.isUndefined(module.exports));
			// return module !== undefined && module.exports !== undefined;
			return typeof module !== 'undefined' &&
				typeof module.exports !== 'undefined';
		}

		function isNavigator() {
			if (!Y.isObject(Y.win) || Y.isUndefined(Y.win)) {
				return false;
			}

			return !Y.isUndefined(Y.win.navigator);
		}

		function isNode() {
			/** @namespace process.versions */
			return !isNavigator() && Y.isObject(process) &&
				process.versions && Y.isDefined(process.versions.node);
		}

		function isV8() {
			return isNode() || (detectEnv.webkit() && !isJsc());
		}

		function newRegEx(pattern, str) {
			return function () {
				return pattern.test(str || (isNode() ?
					process.platform : (isNavigator() ?
					Y.win.navigator.userAgent : '')));
			};
		}

		function isOsx() {
			return isNode() ? /darwin/i.test(process.platform) :
				/mac os x/i.test(isNavigator.userAgent);
		}

		detectEnv.feature = {};

		detectEnv.ie = newRegEx(/msie/i);
		detectEnv.ie6 = newRegEx(/msie 6/i);
		detectEnv.ie7 = newRegEx(/msie 7/i);
		detectEnv.ie8 = newRegEx(/msie 8/i);
		detectEnv.ie9 = newRegEx(/msie 9/i);
		detectEnv.ie10 = newRegEx(/msie 10/i);
		detectEnv.ie11 = newRegEx(/msie 11/i);

		detectEnv.opera = newRegEx(/opera/i);
		detectEnv.chrome = newRegEx(/chrome/i);
		detectEnv.firefox = newRegEx(/firefox/i);
		detectEnv.safari = newRegEx(/safari/i) && !detectEnv.chrome;

		detectEnv.gecko = newRegEx(/gecko/i) && detectEnv.firefox;
		detectEnv.webkit = newRegEx(/webkit/i);
		detectEnv.v8 = isV8;

		detectEnv.mobile = newRegEx(/mobile/i);
		detectEnv.kindle = newRegEx(/kindle/i);

		detectEnv.linux = newRegEx(/linux/i);
		detectEnv.windows = newRegEx(/windows/i);
		detectEnv.osx = detectEnv.mac = isOsx;
		detectEnv.android = newRegEx(/android/i);


		detectEnv.modules = isModules;
		detectEnv.navigator = isNavigator;
		detectEnv.node = isNode;
		detectEnv.dom = isDom;
		detectEnv.jsc = isJsc;

//		if (typeof Y.win !== 'undefined' && typeof Y.doc !== 'undefined') {
//			detectEnv.locale = Y.win.navigator.language;
//
//			detectEnv.feature.orientation = Y.win.hasOwnProperty('orientation');
//			detectEnv.feature.indexedDB = Y.isSet(Y.callProperty(Y.win, 'indexedDB'));
//			detectEnv.feature.touch = Y.doc.hasOwnProperty('ontouchend');
//			detectEnv.feature.standalone = Y.isSet(Y.callProperty(Y.win.navigator, 'standalone'));
//		}

		return detectEnv;

		//---

	}());

	//---

	if (typeof module !== 'undefined') {
		if (module.exports) {
			module.exports.yaxEnv = _env;
		}
	}

	//---

//	Y.ENV.browser = {};
//	Y.ENV.os = {};
//	Y.ENV.engine = {};
//
//	Y.ENV.browser.ie = _env().ie || false;
//	Y.ENV.browser.ie6 = _env().ie6 || false;
//	Y.ENV.browser.ie7 = _env().ie7 || false;
//	Y.ENV.browser.ie8 = _env().ie8 || false;
//	Y.ENV.browser.ie9 = _env().ie9 || false;
//	Y.ENV.browser.ie10 = _env().ie10 || false;
//	Y.ENV.browser.ie11 = _env().ie11 || false;
//
//	Y.ENV.browser.chrome = _env().chrome || false;
//	Y.ENV.browser.firefox = _env().firefox || false;
//	Y.ENV.browser.opera = _env().opera || false;
//	Y.ENV.browser.safari = _env().safari || false;

	Y.Env = _env();

	//---

}());

// FILE: ./Source/Modules/EnvDetector.js

//---