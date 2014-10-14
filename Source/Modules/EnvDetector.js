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
		var temp = Y.DOC.createElement('input');
		temp.setAttribute('type', type);
		return temp.type !== 'text';
	};

	//---

	var _env = (function () {
		function detect() {
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
			if (!Y.isDocument(Y.DOC) || Y.isUndefined(Y.DOC)) {
				return false;
			}

			return !Y.isUndefined(Y.DOC.documentElement);
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
			if (!Y.isObject(Y.WIN) || Y.isUndefined(Y.WIN)) {
				return false;
			}

			return !Y.isUndefined(Y.WIN.navigator);
		}

		function isNode() {
			/** @namespace process.versions */
			return !isNavigator() && typeof process !== 'undefined' &&
				process.versions && !Y.isUndefined(process.versions.node);
		}

		function isV8() {
			return isNode() || (detect.webkit && !isJsc());
		}

		function newRegEx(pattern, str) {
			return function () {
				return pattern.test(str || (isNode() ?
					process.platform : (isNavigator() ?
					Y.WIN.navigator.userAgent : '')));
			};
		}

		function isOsx() {
			if (isNode()) {
				return (/darwin/i).test(process.platform);
			}

			if (!Y.isUndefined(Y.WIN)) {
				return (/(Mac\sOS\sX)/i).test(Y.WIN.navigator.userAgent);
			}


			/*return isNode() ? /darwin/i.test(process.platform) :
				/(Mac\sOS\sX)/i.test(Y.WIN.navigator.userAgent);*/
		}

		detect.gecko = newRegEx(/Gecko[\/]{0,1}([\d.]+)/i) && detect.firefox;
		detect.webkit = newRegEx(/Web[kK]it[\/]{0,1}([\d.]+)/i);

		detect.v8 = isV8;
		detect.modules = isModules;
		detect.navigator = isNavigator;
		detect.node = isNode;
		detect.dom = isDom;
		detect.jsc = isJsc;

		detect.ie = newRegEx(/msie/i);
		detect.ie6 = newRegEx(/msie 6/i);
		detect.ie7 = newRegEx(/msie 7/i);
		detect.ie8 = newRegEx(/msie 8/i);
		detect.ie9 = newRegEx(/msie 9/i);
		detect.ie10 = newRegEx(/msie 10/i);
		detect.ie11 = newRegEx(/msie 11/i);

		detect.opera = newRegEx(/opera/i);
		detect.chrome = newRegEx(/Web[kK]it[\/]{0,1}([\d.]+)/i) || newRegEx(/CriOS\/([\d.]+)/i);
		detect.firefox = newRegEx(/Firefox\/([\d.]+)/i);
		detect.safari = detect.webkit && newRegEx(/Mobile\//i) && !detect.chrome;

		detect.mobile = newRegEx(/mobile/i);
		detect.kindle = newRegEx(/Kindle\/([\d.]+)/i);

		detect.ipad = newRegEx(/(iPad).*OS\s([\d_]+)/i);
		detect.ipod = newRegEx(/(iPod)(.*OS\s([\d_]+))?/i);
		detect.iphone = !!detect.ipad && newRegEx(/(iPhone\sOS)/i);

		detect.webos = newRegEx(/(webOS|hpwOS)[\s\/]([\d.]+)/);
		detect.touchpad = detect.webos && newRegEx(/TouchPad/);

		detect.silk = newRegEx(/Silk\/([\d._]+)/);
		detect.blackberry = newRegEx(/(BlackBerry).*Version\/([\d.]+)/);
		detect.bb10 = newRegEx(/(BB10).*Version\/([\d.]+)/);
		detect.rimtabletos = newRegEx(/(RIM\sTablet\sOS)\s([\d.]+)/);
		detect.playbook = newRegEx(/PlayBook/);
		detect.webview = newRegEx(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/) && !detect.chrome;

		detect.linux = newRegEx(/linux/i);
		detect.windows = newRegEx(/windows/i);
		detect.osx = detect.mac = isOsx;
		detect.android = newRegEx(/(Android);?[\s\/]+([\d.]+)?/);


//		if (typeof Y.WIN !== 'undefined' && typeof Y.DOC !== 'undefined') {
//			detect.locale = Y.WIN.navigator.language;
//
//			detect.feature.orientation = Y.WIN.hasOwnProperty('orientation');
//			detect.feature.indexedDB = Y.isSet(Y.callProperty(Y.WIN, 'indexedDB'));
//			detect.feature.touch = Y.DOC.hasOwnProperty('ontouchend');
//			detect.feature.standalone = Y.isSet(Y.callProperty(Y.WIN.navigator, 'standalone'));
//		}

		return detect;

		//---

	}());

	//---

	Y.Browser = {};
	Y.OS = {};
	Y.UA = {};
	Y.UA.engine = {};
	Y.UA.features = {};
	Y.UA.type = {};

	// Y.Env = _env();

	Y.OS.node = _env().node || false;
	Y.OS.linux = _env().linux || false;
	Y.OS.windows = _env().windows || false;
	Y.OS.mac = _env().mac || false;
	Y.OS.osx = _env().osx || false;
	Y.OS.android = _env().android || false;
	Y.OS.webos = _env().webos || false;
	Y.OS.kindle = _env().kindle || false;
	Y.OS.blackberry = _env().blackberry || false;
	Y.OS.bb10 = _env().bb10 || false;
	Y.OS.silk = _env().silk || false;
	Y.OS.rimtabletos = _env().rimtabletos || false;
	Y.OS.playbook = _env().playbook || false;
	Y.OS.touchpad = _env().touchpad || false;
	Y.OS.ipad = _env().ipad || false;
	Y.OS.ipod = _env().ipod || false;
	Y.OS.iphone = _env().iphone || false;

	Y.Browser.chrome = _env().chrome || false;
	Y.Browser.opera = _env().opera || false;
	Y.Browser.firefox = _env().firefox || false;
	Y.Browser.safari = _env().safari || false;
	Y.Browser.ie = _env().ie || false;
	Y.Browser.ie6 = _env().ie6 || false;
	Y.Browser.ie7 = _env().ie7 || false;
	Y.Browser.ie8 = _env().ie8 || false;
	Y.Browser.ie9 = _env().ie9 || false;
	Y.Browser.ie10 = _env().ie10 || false;
	Y.Browser.ie11 = _env().ie11 || false;

	Y.UA.engine.gecko = _env().gecko || false;
	Y.UA.engine.webkit = _env().webkit || false;
	Y.UA.engine.v8 = _env().v8 || false;
	Y.UA.engine.webview = _env().webview || false;

	Y.UA.features.modules = _env().modules || false;

	if (Y.isSet(Y.WIN) &&Y.isSet(Y.DOC)) {
		var retina, matches, msPointer, pointer;
		var _ie = Y.WIN.hasOwnProperty('ActiveX');
		var ie3d = _ie && (Y.DOC.documentElement.style.hasOwnProperty('transition'));
		/** @namespace Y.WIN.WebKitCSSMatrix */
		/** @namespace Y.WIN.WebKitCSSMatrix */
		var webkit3d = (Y.WIN.hasOwnProperty('WebKitCSSMatrix')) &&
			(new Y.WIN.WebKitCSSMatrix().hasOwnProperty('m11'));
		var gecko3d = Y.DOC.documentElement.style.hasOwnProperty('MozPerspective');
		var opera3d = Y.DOC.documentElement.style.hasOwnProperty('OTransition');

		retina = (Y.hasOwn.call(Y.WIN, 'devicePixelRatio') &&
			Y.callProperty(Y.WIN, 'devicePixelRatio') > 1);

		if (!retina && Y.hasOwn.call(Y.WIN, 'matchMedia')) {
			matches = Y.callProperty(Y.WIN, 'matchMedia');
			retina = (Y.isSet(matches) && Y.callProperty(matches, 'matches'));
		}

		msPointer = (Y.hasOwn.call(navigator, 'msPointerEnabled') &&
			Y.hasOwn.call(navigator, 'msMaxTouchPoints') &&
			!Y.hasOwn.call(Y.WIN, 'PointerEvent'));

		pointer = (Y.hasOwn.call(Y.WIN, 'PointerEvent') &&
			Y.hasOwn.call(navigator, 'pointerEnabled') &&
			!Y.hasOwn.call(navigator, 'maxTouchPoints')) || msPointer;

		Y.WIN.YAX_DISABLE_3D = false;

		Y.UA.locale = Y.WIN.navigator.language;

		// Elements
		Y.UA.features.audio = Y.isSet(Y.DOC.createElement('audio').canPlayType);
		Y.UA.features.canvas = Y.isSet(Y.DOC.createElement('canvas').getContext);
		Y.UA.features.command = Y.DOC.createElement('command').hasOwnProperty('type');
		Y.UA.features.time = Y.DOC.createElement('time').hasOwnProperty('valueAsDate');
		Y.UA.features.video = Y.isSet(Y.DOC.createElement('video').canPlayType);

		// Features and Attributes
		Y.UA.features.offline = navigator.hasOwnProperty('onLine') && navigator.onLine;
		Y.UA.features.applicationCache = Y.isSet(Y.callProperty(Y.WIN, 'applicationCache'));
		Y.UA.features.contentEditable = Y.DOC.createElement('span')
			.hasOwnProperty('isContentEditable');
		Y.UA.features.dragDrop = Y.DOC.createElement('span').hasOwnProperty('draggable');
		Y.UA.features.geolocation = Y.isSet(navigator.geolocation);
		Y.UA.features.history = (Y.isSet(Y.WIN.history) && Y.isSet(Y.WIN.history.pushState));

		/** @namespace Y.WIN.WebSocket */
		/** @namespace Y.WIN.WebSocket */
		Y.UA.features.webSockets = Y.isSet(Y.WIN.WebSocket);

		/** @namespace Y.WIN.Worker */
		/** @namespace Y.WIN.Worker */
		Y.UA.features.webWorkers = Y.isSet(Y.WIN.Worker);
		Y.UA.features.retina = retina;
		Y.UA.features.pointer = Y.isUndefined(pointer) ? false : pointer;
		Y.UA.features.microsoftPointer = Y.isUndefined(msPointer) ? false : msPointer;

		// Forms
		Y.UA.features.autofocus = Y.DOC.createElement('input').hasOwnProperty('autofocus');
		Y.UA.features.inputPlaceholder = Y.DOC.createElement('input').hasOwnProperty('placeholder');
		Y.UA.features.textareaPlaceholder = Y.DOC.createElement('textarea')
			.hasOwnProperty('placeholder');
		Y.UA.features.inputTypeEmail = testInput('email');
		Y.UA.features.inputTypeNumber = testInput('number');
		Y.UA.features.inputTypeSearch = testInput('search');
		Y.UA.features.inputTypeTel = testInput('tel');
		Y.UA.features.inputTypeUrl = testInput('url');

		// Storage
		Y.UA.features.indexedDB = Y.isSet(Y.callProperty(Y.WIN, 'indexedDB'));
		Y.UA.features.localStorage = (Y.WIN.Y.WIN.hasOwnProperty('localStorage') &&
			Y.WIN.localStorage !== null);
		Y.UA.features.webSQL = Y.isSet(Y.WIN.openDatabase);

		// Touch and orientation capabilities.
		Y.UA.features.orientation = Y.WIN.hasOwnProperty('orientation');
		Y.UA.features.touch = Y.DOC.hasOwnProperty('ontouchend');
		Y.UA.features.scrollTop = ((Y.WIN.pageXOffset) || (Y.DOC.documentElement
			.hasOwnProperty('scrollTop'))) && (!Y.OS.webos);

		// Propietary features
		Y.UA.features.standalone = Y.isSet(Y.callProperty(Y.WIN.navigator, 'standalone'));
		Y.UA.features.any3D = !Y.WIN.YAX_DISABLE_3D && (ie3d || webkit3d || gecko3d || opera3d);
		Y.UA.features.cookies = Y.WIN.navigator.cookieEnabled;

		Y.UA.type.mobile = (screen.width < 768);
		Y.UA.type.tablet = (screen.width >= 768 && Y.UA.features.orientation);
		Y.UA.type.desktop = (screen.width >= 800 && !Y.UA.features.orientation);
	}

	//---

	if (typeof module !== 'undefined') {
		if (module.exports) {
			module.exports = _env;
		}
	}

	//---

}());

// FILE: ./Source/Modules/EnvDetector.js

//---