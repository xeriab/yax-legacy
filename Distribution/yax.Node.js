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

/**
 * YAX Utilities and Tools [DOM/NODE]
 */

/*jslint indent: 4 */
/*jshint unused: false */
/*jslint browser: true */
/*jslint white: true */
/*jslint node: true */
/*global YAX, Y */

(function () {

	//---

	'use strict';

	var lastTime = 0,
		requestFunction,
		cancelFunction;

	// Inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	function getPrefixed(name) {
		return window['webkit' + name] || window['moz' + name] || window['ms' + name];
	}

	// Fallback for IE 7-8
	function timeoutDefer(func) {
		var time = +new Date(),
			timeToCall = Math.max(0, 16 - (time - lastTime));

		lastTime = time + timeToCall;

		return window.setTimeout(func, timeToCall);
	}

	requestFunction = window.requestAnimationFrame ||
		getPrefixed('RequestAnimationFrame') ||
		timeoutDefer;

	// cancelFunction = window.cancelAnimationFrame ||
	// cancelFunction = window.cancelRequestAnimationFrame ||
	cancelFunction = Y.callProperty(window, 'cancelAnimationFrame') ||
		getPrefixed('CancelAnimationFrame') ||
		getPrefixed('CancelRequestAnimationFrame') ||

		function (id) {
			window.clearTimeout(id);
		};

	Y.Util.requestAnimationFrame = function (func, context, immediate, element) {
		if (immediate && requestFunction === timeoutDefer) {
			func.call(context);
		} else {
			return requestFunction.call(window, Y.Bind(func, context), element);
		}
	};

	Y.Util.cancelAnimationFrame = function (id) {
		if (id) {
			cancelFunction.call(window, id);
		}
	};

	//---

}());

// FILE: ./Source/Modules/Utility.js

//---

/**
 * YAX DOM/NODE
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*jshint node: true */
/*global Y, YAX */

(function(undef) {

	//---

	'use strict';

	var init = undef;

	var classList;

	var idList;

	var document = window.document;

	var docElem = document.documentElement;

	var elementDisplay = {};

	var classCache = {};

	var idCache = {};

	// Special attributes that should be get/set via method calls
	var MethodAttributes = [
		'title',
		'value',
		'val',
		'css',
		'html',
		'text',
		'data',
		'width',
		'height',
		'offset'
	];

	var adjacencyOperators = [
		'after',
		'prepend',
		'before',
		'append'
	];

	var _table = document.createElement('table');

	var _tableRow = document.createElement('tr');

	var _containers = {
		'tr': document.createElement('tbody'),
		'tbody': _table,
		'thead': _table,
		'tfoot': _table,
		'td': _tableRow,
		'th': _tableRow,
		'*': document.createElement('div')
	};

	var tempParent = document.createElement('div');

	var propsMap = {
		'tabindex': 'tabIndex',
		'readonly': 'readOnly',
		'for': 'htmlFor',
		'class': 'className',
		'maxlength': 'maxLength',
		'cellspacing': 'cellSpacing',
		'cellpadding': 'cellPadding',
		'rowspan': 'rowSpan',
		'colspan': 'colSpan',
		'usemap': 'useMap',
		'frameborder': 'frameBorder',
		'contenteditable': 'contentEditable',
		'scrollw': 'scrollWidth',
		'scrollh': 'scrollHeight',
		'tagname': 'tagName'
	};

	var CCSS;

	var cssShow = {
		position: 'absolute',
		visibility: 'hidden',
		display: 'block'
	};

	var cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	};

	var cssExpand = [
		'Top',
		'Right',
		'Bottom',
		'Left'
	];

	var cssPrefixes = [
		'Webkit',
		'O',
		'Moz',
		'ms'
	];

	var classTag = 'YAX' + Y.now();

	//---

	// BEGIN OF [Private Functions]

	function functionArgument(context, argument, index, payload) {
		return Y.isFunction(argument) ? argument.call(context, index, payload) :
			argument;
	}

	function classReplacement(name) {
		var result;

		if (Y.hasOwn.call(classCache, name)) {
			result = classCache[name];
		} else {
			classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|)');
			result = classCache[name];
		}

		return result;
	}

	function idReplacement(name) {
		var result;

		if (Y.hasOwn.call(idCache, name)) {
			result = idCache[name];
		} else {
			idCache[name] = new RegExp('(^|\\s)' + name + '(\\s|)');
			result = idCache[name];
		}

		return result;
	}

	function traverseNode(node, func) {
		var key;

		func(node);

		for (key in node.childNodes) {
			// if (Y.hasOwn.call(node.childNodes, key)) {
			if (node.childNodes.hasOwnProperty(key)) {
				traverseNode(node.childNodes[key], func);
			}
		}
	}

	// Return a CSS property mapped to a potentially vendor prefixed property

	function vendorPropName(style, name) {
		// shortcut for names that are not vendor prefixed
		if (style.hasOwnProperty(name)) {
			return name;
		}

		// check for vendor prefixed names
		var capName = name.charAt(0).toUpperCase() + name.slice(1),
			origName = name,
			i = cssPrefixes.length;

		while (i--) {
			name = cssPrefixes[i] + capName;

			if (style.hasOwnProperty(name)) {
				return name;
			}
		}

		return origName;
	}

	// NOTE: I have included the "window" in window.getComputedStyle
	// because jsdom on node.js will be bitch and break without it.

	function getStyles() {
		var args = Y.G.slice.call(arguments);

		if (!Y.isUndefined(args[0])) {
			// return window.getComputedStyle(element, null);
			return window.getComputedStyle(args[0], null);
		}
	}

	function getDocStyles() {
		var args = Y.G.slice.call(arguments);

		if (!Y.isUndefined(args[0])) {
			// return window.getComputedStyle(element, null);
			return document.defaultView.getComputedStyle(args[0], null);
		}
	}

	function getWindow(element) {
		return Y.isWindow(element) ? element : element.nodeType === 9 &&
			element.defaultView;
	}

	function defaultDisplay(nodeName) {
		var element;
		var display;

		if (!elementDisplay[nodeName]) {
			element = document.createElement(nodeName);
			document.body.appendChild(element);
			// display = getComputedStyle(element, '').getPropertyValue("display");
			display = getDocStyles(element).getPropertyValue("display");
			element.parentNode.removeChild(element);
			display === "none" && (display = "block");
			elementDisplay[nodeName] = display;
		}

		return elementDisplay[nodeName];
	}

	// Given a selector, splits it into groups. Necessary because naively
	// splitting on commas will do the wrong thing.
	// Examples:
	// "div.foo" -> ["div.foo"]
	// "div, p" -> ["div", "p"]
	// "div[title='foo, bar'], p" -> ["div[title='foo, bar']", "p"]
	function splitSelector(selector) {
		var results = [];

		selector.replace(Y.G.regexList.selectorGroup, function(m, unit) {
			results.push(unit.trim());
		});

		return results;
	}

	// Checks whether the selector has a combinator in it. If not, it's a
	// "simple selector" and can be optimized in some cases.
	// This logic isn't exhaustive, but it doesn't have to be. False
	// positives are OK.
	function hasCombinator(selector) {
		return selector.match(/[\s>~+]/);
	}

	function flatten(array) {
		var result, len = array.length;

		if (len > 0) {
			result = Y.DOM.Function.concat.apply([], array);
		} else {
			result = array;
		}

		return result;
	}

	function contains(parent, node) {
		return parent !== node && parent.contains(node);
	}

	function setAttribute(node, name, value) {
		if (value === null) {
			node.removeAttribute(name);
		} else {
			node.setAttribute(name, value);
		}
	}

	// Access className property while respecting SVGAnimatedString
	function className(node, value) {
		var Class, svg, result;

		Class = node.className || '';

		//svg = Class && Class.baseVal !== undef;
		svg = Class && Y.callProperty(Class, 'baseVal') !== undef;

		if (value === undef) {
			// result = svg ? Class.baseVal : Class;
			return svg ? Y.callProperty(Class, 'baseVal') : Class;
		}

		// result = svg ? Y.Inject(Class, 'baseVal', value) : (node.className = value);
		// svg = svg ? (Class.baseVal = value) : (node.className = value);

		if (svg) {
			result = Y.inject(Class, 'baseVal', value);
		} else {
			node.className = value;

			result = node.className;
		}

		return result;
	}

	function idName(node, value) {
		var ID, svg, result;

		ID = node.id || '';

		// svg = ID && ID.baseVal !== undef;
		svg = ID && Y.callProperty(ID, 'baseVal') !== undef;

		if (value === undef) {
			// return svg ? ID.baseVal : ID;
			return svg ? Y.callProperty(ID, 'baseVal') : ID;
		}

		if (svg) {
			result = Y.inject(ID, 'baseVal', value);
		} else {
			node.ID = value;

			result = node.ID;
		}

		return result;
	}

	function map(elements, callback, arg) {
		var value,
			values = [],
			x = 0,
			key,
			len = elements.length;

		if (Y.isArraylike(elements) && !Y.isUndefined(elements)) {
			for (x; x < len; x++) {
				if (!Y.isUndefined(elements[x])) {
					value = callback(elements[x], x, arg);

					if (!Y.isNull(value) && !Y.isUndefined(value)) {
						// values.push(value);
						values[values.length] = value;
					}
				}
			}
		} else {
			for (key in elements) {
				if (elements.hasOwnProperty(key)) {
					value = callback(elements[key], key, arg);

					if (!Y.isNull(value) && !Y.isUndefined(value)) {
						// values.push(value);
						values[values.length] = value;
					}
				}
			}
		}

		return flatten(values);
	}

	function children(element) {
		return element.hasOwnProperty('children') ?
			Y.G.slice.call(element.children) :
			map(element.childNodes, function(node) {
				if (node.nodeType === 1) {
					return node;
				}
			});
	}

	CCSS = function(element, name, csssComputed) {
		var width, minWidth, maxWidth,
			computed = csssComputed || getStyles(element),
		// Support: IE9
		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue(name) || computed[name] : undef,
			style = element.style;

		if (computed) {
			if (Y.isEmpty(ret) && !contains(element.ownerDocument, element)) {
				ret = Y.DOM.Style(element, name);
			}

			// Support: Safari 5.1
			// A tribute to the "awesome hack by Dean Edwards"
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if (Y.G.regexList.numNonPx.test(ret) && Y.G.regexList.margin.test(name)) {
				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};

	function setPositiveNumber(element, value, subtract) {
		var matches = Y.G.regexList.numSplit.exec(value);
		return matches ?
			// Guard against undefined "subtract", e.g., when used as in CSS_Hooks
			Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || 'px') :
			value;
	}

	function argumentWidthOrHeight(element, name, extra, isBorderBox, styles) {
		var i = extra === (isBorderBox ? 'border' : 'content') ?
				// If we already have the right measurement, avoid augmentation
				4 :
				// Otherwise initialise for horizontal or vertical properties
					name === 'width' ? 1 : 0,
			val = 0;

		for (null; i < 4; i += 2) {
			// both box models exclude margin, so add it if we want it
			if (extra === 'margin') {
				val += Y.DOM.CSS(element, extra + cssExpand[i], true, styles);
			}

			if (isBorderBox) {
				// border-box includes padding, so remove it if we want content
				if (extra === 'content') {
					val -= Y.DOM.CSS(element, 'padding' + cssExpand[i], true, styles);
				}

				// at this point, extra isn't border nor margin, so remove border
				if (extra !== 'margin') {
					val -= Y.DOM.CSS(element, 'border' + cssExpand[i] + 'Width', true,
						styles);
				}
			} else {
				// at this point, extra isn't content, so add padding
				val += Y.DOM.CSS(element, 'padding' + cssExpand[i], true, styles);

				// at this point, extra isn't content nor padding, so add border
				if (extra !== 'padding') {
					val += Y.DOM.CSS(element, 'border' + cssExpand[i] + 'Width', true,
						styles);
				}
			}
		}

		return val;
	}

	function getWidthOrHeight(element, name, extra) {
		// Start with offset property, which is equivalent to the border-box value
		var valueIsBorderBox = true,
			val = name === 'width' ? element.offsetWidth : element.offsetHeight,
			styles = getStyles(element),
			isBorderBox = Y.DOM.Support.boxSizing && Y.DOM.CSS(element, 'boxSizing',
				false, styles) === 'border-box';

		// val = val.toString();

		// some non-html elements return undefinedined for offsetWidth, so check for null/undefinedined
		// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
		// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
		if (val <= 0 || val === null) {
			// Fall back to computed then uncomputed css if necessary
			val = CCSS(element, name, styles);

			if (val < 0 || val === null) {
				val = element.style[name];
			}

			// Computed unit is not pixels. Stop here and return.
			if (Y.G.regexList.numNonPx.test(val.toString())) {
				return val;
			}

			// we need the check for style in case a browser which returns unreliable values
			// for getComputedStyle silently falls back to the reliable element.style
			valueIsBorderBox = isBorderBox && (Y.DOM.Support.boxSizingReliable || val ===
				element.style[name]);

			// Normalize "", auto, and prepare for extra
			val = parseFloat(val) || 0;
		}

		// use the active box-sizing model to add/subtract irrelevant styles
		return (val +
			argumentWidthOrHeight(
				element,
				name,
					extra || (isBorderBox ? 'border' : 'content'),
				valueIsBorderBox,
				styles
			)
			) + 'px';
	}

	function globalEval(code) {
		var script, indirect = eval;

		code = Y.trim(code);

		if (code) {
			if (code.indexOf('use strict') === 1) {
				script = document.createElement('script');
				script.text = code;
				document.head.appendChild(script).parentNode.removeChild(script);
			} else {
				indirect(code);
			}
		}
	}

	// END OF [Private Functions]

	//---

	/**
	 * @param selector
	 * @param context
	 * @returns {Y.DOM.Function.init}
	 * @constructor init
	 */
	Y.DOM = function (selector, context) {
		return new Y.DOM.Function.init(selector, context);
	};

	Y.DOM.Function = Y.DOM.prototype = {
		'YAX.DOM': '0.11',

		constructor: Y.DOM,

		// Start with an empty selector
		selector: '',

		// The default length of a Y.DOM object is 0
		length: 0,

		pushStack: function(elems) {
			// Build a new YAX matched element set
			var ret = Y.merge(this.constructor(), elems);

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
			// ret.context = this.context;

			// Return the newly-formed element set
			return ret;
		},

		get: function(num) {
			// return num === undef ? Slice.call(this) : this[num >= 0 ? num : num + this.length];

			return num === null ?
				// Return a 'Clean' array
				this.toArray() :
				// Return just the object
				(num < 0 ? this[this.length + num] : this[num]);
		},

		toArray: function() {
			// return this.get();
			return Y.G.slice.call(this);
		},

		size: function() {
			return this.length;
		},

		remove: function() {
			return this.each(function() {
				if (this.parentNode !== null) {
					this.parentNode.removeChild(this);
				}
			});
		},

		error: function(message) {
			throw new Error(message);
		},

		each_: function(callback) {
			Y.G.ArrayProto.every.call(this, function(elem, index) {
				return callback.call(elem, index, elem) !== false;
			});

			return this;
		},

		each: function(callback, args) {
			return Y.each(this, callback, args);
		},

		// `map` and `slice` in the jQuery API work differently
		// from their array counterparts
		map: function(callback) {
			return Y.DOM(map(this, function(elem, i) {
				return callback.call(elem, i, elem);
			}));
		},

		slice: function() {
			// return Y.DOM(Y.G.slice.apply(this, arguments));
			return Y.DOM.pushStack(Y.G.slice.apply(this, arguments));
		},

		first: function() {
			return this.eq(0);
		},

		last: function() {
			return this.eq(-1);
		},

		eq: function(i) {
			var len = this.length;
			var j = +i + (i < 0 ? len : 0);

			return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
		},

		end: function() {
			return this.prevObject || this.constructor(null);
		},

		// Because a collection acts like an array
		// copy over these useful array functions.
		forEach: Y.G.ArrayProto.forEach,
		reduce: Y.G.ArrayProto.reduce,
		push: Y.G.push,
		sort: Y.G.ArrayProto.sort,
		indexOf: Y.G.indexOf,
		concat: Y.G.concat,
		splice: Y.G.ArrayProto.splice
	};

	//---

	Y.DOM.matches = function matches(element, selector) {
		var result, matchesSelector, temp, parent;

		if (!element || element.nodeType !== 1) {
			return false;
		}

		matchesSelector = Y.callProperty(element, 'webkitMatchesSelector') ||
			Y.callProperty(element, 'mozMatchesSelector') ||
			Y.callProperty(element, 'oMatchesSelector') ||
			Y.callProperty(element, 'matchesSelector');

		if (matchesSelector) {
			return matchesSelector.call(element, selector);
		}

		// Fall back to performing a selector:
		parent = element.parentNode;
		//temp = !Y.isSet(parent);
		temp = !parent;

		if (temp) {
			// parent = tempParent;
			// parent.appendChild(element);
			(parent = tempParent).appendChild(element);
		}

		// result = ~Y.DOM.qsa(parent, selector).indexOf(element);
		/* jshint -W052 */
		result = ~Y.DOM.qsa(parent, selector).indexOf(element);

		// temp && tempParent.appendChild(element);

		if (temp) {
			tempParent.appendChild(element);
		}

		return result;
	};

	Y.DOM.fragment = function fragment(html, name, properties) {
		var dom, nodes, container;

		// A special case optimization for a single tag
		if (Y.G.regexList.singleTagReplacement.test(html)) {
			dom = Y.DOM(document.createElement(RegExp.$1));
		}

		if (!dom) {
			if (html.replace) {
				html = html.replace(Y.G.regexList.tagExpanderReplacement, '<$1></$2>');
			}

			if (name === undef) {
				name = Y.G.regexList.fragmentReplacement.test(html) && RegExp.$1;
			}

			if (!(Y.hasOwn.call(_containers, name))) {
				name = '*';
			}

			container = _containers[name];

			container.innerHTML = Y.empty + html;

			dom = Y.each(Y.G.slice.call(container.childNodes), function() {
				container.removeChild(this);
			});
		}

		if (Y.isPlainObject(properties)) {
			nodes = Y.DOM(dom);

			Y.each(properties, function(key, value) {
				if (MethodAttributes.indexOf(key) > -1) {
					nodes[key](value);
				} else {
					nodes.attr(key, value);
				}
			});
		}

		return dom;
	};

	init = Y.DOM.Function.init = function(selector, context) {
		var dom;

		// If nothing given, return an empty Y.DOM collection
		if (!selector) {
			// return Y.DOM.Y();
			return this;
		} else if (Y.isString(selector)) {
			// Optimize for string selectors
			selector = selector.trim();

			// If it's a html Fragment, create nodes from it
			// Note: In both Chrome 21 and Firefox 15, DOM error 12
			// is thrown if the Fragment doesn't begin with <
			// if (selector[0] === '<' && Y.G.regexList.fragmentReplacement.test(selector)) {
			if (selector[0] === '<' && selector[selector.length - 1] === '>' &&
				selector.length >= 3) {
				Y.G.regexList.fragmentReplacement.test(selector);
				dom = Y.DOM.fragment(selector, RegExp.$1, context);
				// selector = selector.replace('<', '').replace('>', '');
				selector = null;
			} else if (context !== undef) {
				// If there's a context, create a collection on that context first, and select nodes from there
				return Y.DOM(context).find(selector);
			} else {
				// If it's a CSS selector, use it to select nodes.
				dom = Y.DOM.qsa(document, selector);
			}

			dom = Y.isArraylike(dom) ? dom : [dom];
		}
		// If a function is given, call it when the DOM is ready
		else if (Y.isFunction(selector)) {
			return Y.DOM(document).ready(selector);
			// If a YAX collection is given, just return it
		} else if (Y.DOM.isY(selector)) {
			return selector;
		} else if (Y.isArraylike(selector)) {
			dom = selector;
		} else if (Y.isArray(selector)) {
			dom = Y.compact(selector);
			// dom = Y.DOM.makeArray(selector, this);
			// Wrap DOM nodes.
		} else if (Y.isObject(selector)) {
			dom = [selector];
			selector = null;

			if (Y.isWindow(selector)) {
				selector = 'window';
			} else if (Y.isDocument(selector)) {
				selector = selector.nodeName.replace('#', Y.empty) || Y.empty;
			} else {
				selector = null;
			}
			// If it's a html Fragment, create nodes from it
		} else if (Y.G.regexList.fragmentReplacement.test(selector)) {
			dom = Y.DOM.fragment(selector.trim(), RegExp.$1, context);
			selector = null;
			// If there's a context, create a collection on that context first, and select
			// nodes from there
		} else if (Y.isDefined(context)) {
			return Y.DOM(context).find(selector);
			// And last but no least, if it's a CSS selector, use it to select nodes.
		} else {
			dom = Y.DOM.qsa(document, selector);
		}

		// Y.LOG(dom);

		dom = dom || [];

		Y.merge(this, dom);

		this.selector = selector || '';

		// return Y.makeArray(dom, this);
		// return this.Y(dom, selector);
	};

	Y.DOM.qsa = function qsa(element, selector) {
		var found, maybeID, maybeClass, nameOnly, isSimple, result;

		if (selector[0] === '#') {
			maybeID = '#';
		}

		if (!maybeID && selector[0] === '.') {
			maybeClass = '.';
		}

		// Ensure that a 1 char tag name still gets checked
		if (maybeID || maybeClass) {
			nameOnly = selector.slice(1);
		} else {
			nameOnly = selector;
		}

		isSimple = Y.G.regexList.simpleSelectorReplacement.test(nameOnly);

		if (Y.isDocument(element) && isSimple && maybeID) {
			found = element.getElementById(nameOnly);

			if (Y.isSet(found)) {
				// result = {'res': found};
				result = [found];
			} else {
				// result = {};
				result = [];
			}
		} else {
			result = (!Y.isUndefined(element) && element.nodeType !== 1 &&
				element.nodeType !== 9) ? [] :

				Y.G.slice.call(
						isSimple && !maybeID ?
						// If it's simple, it could be a class
						maybeClass ? element.getElementsByClassName(nameOnly) :
							// Or a tag
							element.getElementsByTagName(selector) :
						// Or it's not simple, and we need to query all
						element.querySelectorAll(selector)
				);
		}

		return result;
	};

	Y.DOM.Y = function(dom, selector) {
		dom = dom || [];
		// jshint -W103
		dom.__proto__ = Y.DOM.Function;
		dom.selector = selector || Y.empty;

		return dom;
	};

	Y.DOM.isY = function(object) {
		return object instanceof Y.DOM;
	};

	function filtered(nodes, selector) {
		var result;

		if (Y.isNull(selector) || Y.isUndefined(selector) || Y.isEmpty(
			selector)) {
			result = Y.DOM(nodes);
		} else {
			result = Y.DOM(nodes).filter(selector);
		}

		return result;
	}

	//---

	// Give the init function the Y.DOM prototype for later instantiation
	init.prototype = Y.DOM.Function;

	//---

	Y.DOM.extend = Y.DOM.Function.extend = Y.extend;

	//---

	Y.DOM.extend({
		// Unique for each copy of Y.DOM on the page
		expando: 'YAX' + (Y.VERSION.toString() +
			Y.random(1000, 7000)).replace(/\D/g, Y.empty),

		getStyle: function(elem, style) {
			var value, css;

			value = elem.style[style] || (elem.currentStyle && elem.currentStyle[style]);

			if ((!value || value === 'auto') && document.defaultView) {
				css = document.defaultView.getComputedStyle(elem, null);
				value = css ? css[style] : null;
			}

			return value === 'auto' ? null : value;
		},

		documentIsLtr: function() {
			Y.DOM.docIsLTR = Y.DOM.docIsLTR || this.getStyle(document.body,
				'direction') === 'ltr';
			return Y.DOM.docIsLTR;
		}
	});

	//---

	Y.DOM.Function.extend({
		ready: function(callback) {
			// need to check if document.body exists for IE as that browser reports
			// document ready when it hasn't yet created the body element
			if (Y.G.regexList.readyReplacement.test(Y.callProperty(document, 'readyState')) &&
				document.body) {
				callback(Y.DOM);
			} else {
				document.addEventListener('DOMContentLoaded', function() {
					callback(Y.DOM);
				}, false);
			}

			return this;
		},

		filter: function(selector) {
			if (Y.isFunction(selector)) {
				return this.not(this.not(selector));
			}

			return Y.DOM(Y.G.filter.call(this, function(element) {
				return Y.DOM.matches(element, selector);
			}));
		},
		
		add: function(selector, context) {
			return Y.DOM(Y.unique(this.concat(Y.DOM(selector, context))));
		},

		is: function(selector) {
			return this.length > 0 && Y.DOM.matches(this[0], selector);
		},

		not: function(selector) {
			var nodes = [],
				excludes;

			if (Y.isFunction(selector) && selector.call !== undef) {
				this.each(function(index) {
					if (!selector.call(this, index)) {
						nodes.push(this);
					}
				});
			} else {
				excludes = Y.isString(selector) ? this.filter(selector) :
					(Y.likeArray(selector) && Y.isFunction(selector.item)) ? Y.G.slice
						.call(selector) : Y.DOM(selector);

				this.forEach(function(elem) {
					if (excludes.indexOf(elem) < 0) {
						nodes.push(elem);
					}
				});
			}

			return Y.DOM(nodes);
		},

		has: function(selector) {
			return this.filter(function() {
				return Y.isObject(selector) ?
					contains(this, selector) :
					Y.DOM(this).find(selector).size();
			});
		},

		find: function(selector) {
			var result;
			var self = this;
			var error = false;

			if (Y.isObject(selector)) {
				result = Y.DOM(selector).filter(function () {
					var node = this;

					return Y.G.ArrayProto.some.call(self, function(parent) {
						return Y.DOM.contains(parent, node);
					});
				});
			} else {
				var slow = false;

				selector = splitSelector(selector).map(function(unit) {
					if (hasCombinator(selector)) {
						slow = true;
						return '.' + classTag + ' ' + unit;
					}

					return unit;
				}).join(', ');

				var findBySelector = function findBySelector(elem, selector, slow) {
					if (elem.length == 1) {
						if (slow) {
							elem.addClass(classTag);
						}

						result = Y.DOM(Y.DOM.qsa(elem[0], selector));

						if (slow) {
							elem.removeClass(classTag);
						}
					} else {
						result = elem.map(function() {
							if (slow) {
								Y.DOM(this).addClass(classTag);
							}

							var _result = Y.DOM.qsa(this, selector);

							if (slow) {
								Y.DOM(this).removeClass(classTag);
							}

							return _result;
						});
					}

					return result;
				};

				// If we have to do DOM manipulation, we should wrap in a try/catch;
				// otherwise, we shouldn't bother with the overhead.
				if (slow) {
					try {
						result = findBySelector(this, selector, slow);
					} catch (e) {
						Y.ERROR('error performing selector: %o', selector);
						error = true;
						throw e;
					} finally {
						// If an error was thrown, we should assume that the class name
						// cleanup didn't happen, and do it ourselves.
						if (error) {
							Y.DOM('.' + classTag).removeClass(classTag);
						}
					}
				} else {
					result = findBySelector(this, selector, slow);
				}
			}

			return result;
		},

		closest: function(selector, context) {
			var node = this[0],
				collection = false;

			if (Y.isObject(selector)) {
				collection = Y.DOM(selector);
			}

			while (node && Y.isFalse(collection ? collection.indexOf(node) >= 0 :
				Y.DOM.matches(node, selector))) {
				node = node !== context && !Y.isDocument(node) && node.parentNode;
			}

			return Y.DOM(node);
		},

		parents: function(selector) {
			var ancestors = [],
				nodes = this,
				tempFunc, x = 0,
				result;

			tempFunc = function(node) {
				node = node.parentNode;

				if (node && !Y.isDocument(node) && ancestors.indexOf(node) < x) {
					ancestors.push(node);
					// ancestors[x] = node;

					return node;
				}
			};

			while (nodes.length > x) {
				nodes = map(nodes, tempFunc);
			}

			if (Y.isUndefined(selector) || Y.isNull(selector) || Y.isEmpty(
				selector)) {
				result = filtered(ancestors, '*');
			} else {
				result = filtered(ancestors, selector);
			}

			return result;
		},
		parent: function(selector) {
			return filtered(Y.unique(this.pluck('parentNode')), selector);
		},
		children: function(selector) {
			return filtered(this.map(function() {
				return children(this);
			}), selector);
		},
		contents: function() {
			return this.map(function() {
				return Y.G.slice.call(this.childNodes);
			});
		},
		siblings: function(selector) {
			return filtered(this.map(function(i, elem) {
				return Y.G.filter.call(children(elem.parentNode), function(child) {
					return child !== elem;
				});
			}), selector);
		},
		empty: function() {
			return this.each(function() {
				this.innerHTML = Y.empty;
			});
		},
		// `pluck` is borrowed from Prototype.js
		pluck: function(property) {
			return map(this, function(elem) {
				return elem[property];
			});
		},
		show: function() {
			return this.each(function() {
				if (this.style.display === 'none') {
					this.style.display = Y.empty;
				}

				// this.style.display === 'none' && (this.style.display = Y.empty);

				if (getStyles(this).getPropertyValue('display') === 'none') {
					this.style.display = defaultDisplay(this.nodeName);
				}
			});
		},
		replaceWith: function(newContent) {
			return this.before(newContent).remove();
		},
		wrap: function(structure) {
			var func = Y.isFunction(structure),
				dom, clone;

			if (this[0] && !func) {
				dom = Y.DOM(structure).get(0);
				clone = dom.parentNode || this.length > 1;
			}

			return this.each(function(index) {
				Y.DOM(this).wrapAll(
					func ? structure.call(this, index) :
						clone ? dom.cloneNode(true) : dom
				);
			});
		},
		wrapAll: function(structure) {
			if (this[0]) {
				Y.DOM(this[0]).before(structure = Y.DOM(structure));

				var childreno, self = this;

				// Drill down to the inmost element
				childreno = structure.children();

				while (childreno.length) {
					structure = children.first();
				}

				Y.DOM(structure).append(self);
			}

			return this;
		},
		wrapInner: function(structure) {
			var func = Y.isFunction(structure),
				self, dom, contents;
			return this.each(function(index) {
				self = Y.DOM(this);

				contents = self.contents();

				dom = func ? structure.call(this, index) : structure;

				if (contents.length) {
					contents.wrapAll(dom);
				} else {
					self.append(dom);
				}

				// contents.length ? contents.wrapAll(dom) : self.append(dom);
			});
		},
		unwrap: function() {
			this.parent().each(function() {
				Y.DOM(this).replaceWith(Y.DOM(this).children());
			});

			return this;
		},
		clone: function() {
			return this.map(function() {
				return this.cloneNode(true);
			});
		},
		hide: function() {
			return this.css('display', 'none');
		},
		toggle: function(setting) {
			return this.each(function() {
				var elem = Y.DOM(this),
					val;

				val = elem.css('display') === 'none';

				if (Y.isUndefined(setting)) {
					if (val) {
						setting = val;
					}
				}

				if (setting) {
					elem.show();
				} else {
					elem.hide();
				}
			});
		},
		prev: function(selector) {
			return Y.DOM(this.pluck('previousElementSibling')).filter(selector ||
				'*');
		},
		next: function(selector) {
			return Y.DOM(this.pluck('nextElementSibling')).filter(selector || '*');
		},
		html: function(html) {
			return arguments.length === 0 ?
				(this.length > 0 ? this[0].innerHTML : null) :
				this.each(function(index) {
					var originHtml = this.innerHTML;
					Y.DOM(this).empty().append(functionArgument(this, html, index,
						originHtml));
				});
		},
		text: function(text) {
			return arguments.length === 0 ?
				(this.length > 0 ? this[0].textContent : null) :
				this.each(function() {
					this.textContent = (text === undef) ? Y.empty : Y.empty +
						text;
				});
		},
		title: function(title) {
			return arguments.length === 0 ?
				(this.length > 0 ? this[0].title : null) :
				this.each(function() {
					this.title = (title === undef) ? Y.empty : Y.empty +
						title;
				});
		},
		attr: function(name, value) {
			var result;

			return (Y.isString(name) && value === undef) ?
				(this.length === 0 || this[0].nodeType !== 1 ? undef :
					(name === 'value' && this[0].nodeName === 'INPUT') ? this.val() :
						(Y.isFalse(result = this[0].getAttribute(name)) && this[0].hasOwnProperty(
							name)) ? this[0][name] : result
					) :
				this.each(function(index) {
					if (this.nodeType !== 1) {
						return;
					}

					if (Y.isObject(name)) {
						var key;

						for (key in name) {
							if (name.hasOwnProperty(key)) {
								setAttribute(this, key, name[key]);
							}
						}
					} else {
						setAttribute(this, name, functionArgument(this, value, index, this.getAttribute(
							name)));
					}
				});
		},
		draggable: function(value) {
			return arguments.length === 0 ?
				(this.length > 0 ? this[0].draggable : null) :
				this.each(function() {
					var tmp = this.draggable;

					if (Y.isUndefined(value) || !Y.isBool(value)) {
						this.draggable = tmp;
					} else {
						this.draggable = value;
					}
				});
		},
		removeAttr: function(name) {
			return this.each(function() {
				if (this.nodeType === 1) {
					setAttribute(this, name);
				}

				// this.nodeType === 1 && setAttribute(this, name);
			});
		},
		prop: function(name, value) {
			name = propsMap[name] || name;
			return (value === undef) ?
				(this[0] && this[0][name]) :
				this.each(function(index) {
					this[name] = functionArgument(this, value, index, this[name]);
				});
		},
		data: function(name, value) {
			var data = this.attr('data-' + Y.dasherise(name), value);
			return data !== null ? Y.deserialiseValue(data) : undef;
		},
		val: function(value) {
			return arguments.length === 0 ?
				(this[0] && (this[0].multiple ?
					Y.DOM(this[0]).find('option').filter(function() {
						return this.selected;
					}).pluck('value') :
					this[0].value)) :
				this.each(function(index) {
					this.value = functionArgument(this, value, index, this.value);
				});
		},
		value: function(value) {
			return arguments.length === 0 ?
				(this[0] && (this[0].multiple ?
					Y.DOM(this[0]).find('option').filter(function() {
						return this.selected;
					}).pluck('value') :
					this[0].value)) :
				this.each(function(index) {
					this.value = functionArgument(this, value, index, this.value);
				});
		},
		offset: function(coordinates) {
			if (coordinates) {
				return this.each(function(index) {
					var $this = Y.DOM(this),
						coords = functionArgument(this, coordinates, index, $this.offset()),
						parentOffset = $this.offsetParent().offset(),
						props = {
							top: coords.top - parentOffset.top,
							left: coords.left - parentOffset.left
						};

					if ($this.css('position') === 'static') {
						props.position = 'relative';
					}

					$this.css(props);
				});
			}

			if (this.length === 0) {
				return null;
			}

			var obj = this[0].getBoundingClientRect();

			this.offset.toString = function() {
				return {
					left: obj.left + window.pageXOffset + 'px',
					top: obj.top + window.pageYOffset + 'px',
					width: Math.round(obj.width) + 'px',
					height: Math.round(obj.height) + 'px'
				};
			};

			return {
				left: obj.left + window.pageXOffset,
				top: obj.top + window.pageYOffset,
				width: Math.round(obj.width),
				height: Math.round(obj.height)
			};
		},
		getOffset: function(options) {
			if (arguments.length) {
				return options === undef ?
					this :
					this.each(function(i) {
						Y.DOM.offset.setOffset(this, options, i);
					});
			}

			var win,
				element = this[0],
				box = {
					top: 0,
					left: 0
				},
				doc = element && element.ownerDocument;

			if (!doc) {
				return;
			}

			docElem = document.documentElement;

			// Make sure it's not a disconnected DOM node
			if (!contains(docElem, element)) {
				return box;
			}

			// If we don't have gBCR, just use 0,0 rather than error
			// BlackBerry 5, iOS 3 (original iPhone)
			if (!Y.isUndefined(element.getBoundingClientRect)) {
				box = element.getBoundingClientRect();
			}

			win = getWindow(doc);

			return {
				top: box.top + win.pageYOffset - docElem.clientTop,
				left: box.left + win.pageXOffset - docElem.clientLeft
			};
		},
		css: function(name, value) {
			var element = this[0],
				computedStyle = getStyles(element),
				props;

			if (arguments.length < 2) {
				if (!element) {
					return;
				}

				if (Y.isString(name)) {
					return element.style[Y.camelise(name)] || computedStyle.getPropertyValue(
						name);
				}

				if (Y.isArray(name)) {
					props = {};

					Y.each(Y.isArray(name) ? name : [name], function(tmp, prop) {
						props[prop] = (element.style[Y.camelise(prop)] || computedStyle.getPropertyValue(
							prop));
					});

					return props;
				}
			}

			if (Y.type(name) === 'string') {
				if (!value && value !== 0) {
					this.each(function() {
						this.style.removeProperty(Y.dasherise(name));
					});
				}
			}

			return Y.DOM.Access(this, function(element, name, value) {
				var styles, len, mapo = {},
					i = 0;

				if (Y.isArray(name)) {
					styles = getStyles(element);
					len = name.length;

					for (i; i < len; i++) {
						mapo[name[i]] = Y.DOM.CSS(element, name[i], false, styles);
					}

					return mapo;
				}

				return value !== undef ?
					Y.DOM.Style(element, name, value) :
					Y.DOM.CSS(element, name);
			}, name, value, arguments.length > 1);
		},

		index: function(element) {
			return element ?
				this.indexOf(Y.DOM(element)[0]) :
				this.parent().children().indexOf(this[0]);
		},

		hasClass: function(name) {
			if (!name) {
				return false;
			}

			return Y.G.ArrayProto.some.call(this, function(elem) {
				return this.test(className(elem));
			}, classReplacement(name));
		},
		hasId: function(name) {
			if (!name) {
				return false;
			}

			return Y.G.ArrayProto.some.call(this, function(elem) {
				return this.test(idName(elem));
			}, idReplacement(name));
		},
		addId: function(name) {
			if (!name) {
				return this;
			}

			return this.each(function(index) {
				idList = [];

				var id = idName(this),
					newName = functionArgument(this, name, index, id);

				newName.split(/\s+/g).forEach(function(ID) {
					if (!Y.DOM(this).hasId(ID)) {
						idList.push(ID);
					}
				}, this);

				if (idList.length) {
					idName(this, id + (id ? ' ' : Y.empty) + idList.join(' '));
				}

				// idList.length && idName(this, id + (id ? ' ' : Y.empty) + idList.join(' '));
			});
		},
		addClass: function(name) {
			if (!name) {
				return this;
			}

			return this.each(function(index) {
				if (!('className' in this)) {
					return;
				}

				classList = [];

				var cls = className(this),
					newName = functionArgument(this, name, index, cls);

				newName.split(/\s+/g).forEach(function(Class) {
					if (!Y.DOM(this).hasClass(Class)) {
						classList.push(Class);
					}
				}, this);

				if (classList.length) {
					className(this, cls + (cls ? ' ' :
						Y.empty) + classList.join(' '));
				}

				// classList.length && className(this, cls + (cls ? ' ' : Y.empty) + classList.join(' '));
			});
		},
		removeId: function(name) {
			return this.each(function(index) {
				if (name === undef) {
					return idName(this, Y.empty);
				}

				idList = idName(this);

				functionArgument(this, name, index, idList).split(/\s+/g).forEach(
					function(ID) {
						idList = idList.replace(idReplacement(ID), ' ');
					});

				idName(this, idList.trim());
			});
		},
		removeClass: function(name) {
			return this.each(function(index) {
				if (!('className' in this)) {
					return;
				}

				if (name === undef) {
					return className(this, Y.empty);
				}

				classList = className(this);

				functionArgument(this, name, index, classList).split(/\s+/g).forEach(
					function(Class) {
						classList = classList.replace(classReplacement(Class), ' ');
					});

				className(this, classList.trim());
			});
		},
		toggleClass: function(name, when) {
			if (!name) {
				return this;
			}

			return this.each(function(index) {
				var $this = Y.DOM(this),
					names = functionArgument(this, name, index, className(this));

				names.split(/\s+/g).forEach(function(Class) {
					if (Y.isUndefined(when) || Y.isNull(when) || !Y.isSet(
						when)) {
						if (!$this.hasClass(Class)) {
							$this.addClass(Class);
						} else {
							$this.removeClass(Class);
						}
					}

					// (when === undef ? !$this.hasClass(Class) : when) ? $this.addClass(Class) : $this.removeClass(Class);
				});
			});
		},
		scrollTop: function(value) {
			if (!this.length) {
				return;
			}

			var hasScrollTop = this[0].hasOwnProperty('scrollTop');

			if (value === undef) {
				return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset;
			}

			return this.each(hasScrollTop ?
				function() {
					this.scrollTop = value;
				} :
				function() {
					this.scrollTo(this.scrollX, value);
				});
		},
		scrollLeft: function(value) {
			if (!this.length) {
				return;
			}

			var hasScrollLeft = this[0].hasOwnProperty('scrollLeft');

			if (value === undef) {
				return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset;
			}

			return this.each(hasScrollLeft ?
				function() {
					this.scrollLeft = value;
				} :
				function() {
					this.scrollTo(value, this.scrollY);
				});
		},
		position: function() {
			if (!this[0]) {
				return;
			}

			var offsetParent, offset, element = this[0],
				parentOffset = {
					top: 0,
					left: 0
				};

			// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
			if (Y.DOM.CSS(element, 'position') === "fixed") {
				// We assume that getBoundingClientRect is available when computed position is fixed
				offset = element.getBoundingClientRect();

			} else {
				// Get *real* offsetParent
				offsetParent = this.offsetParent();

				// Get correct offsets
				offset = this.offset();

				if (!Y.DOM.nodeName(offsetParent[0], "html")) {
					parentOffset = offsetParent.offset();
				}

				// Add offsetParent borders
				parentOffset.top += Y.DOM.CSS(offsetParent[0], "borderTopWidth", true);
				parentOffset.left += Y.DOM.CSS(offsetParent[0], "borderLeftWidth", true);
			}

			// Subtract parent offsets and element margins
			return {
				top: offset.top - parentOffset.top - Y.DOM.CSS(element, "marginTop",
					true),
				left: offset.left - parentOffset.left - Y.DOM.CSS(element, "marginLeft",
					true)
			};
		},

		getPosition: function() {
			if (!this.length) {
				return;
			}

			var element = this[0],
			// Get *real* offsetParent
				offsetParent = this.offsetParent(),
			// Get correct offsets
				offset = this.offset(),
				parentOffset = Y.G.regexList.rootNodeReplacement.test(offsetParent[0].nodeName) ? {
					top: 0,
					left: 0
				} : offsetParent.offset();

			// Subtract element margins
			// note: when an element has margin: auto the offsetLeft and marginLeft
			// are the same in Safari causing offset.left to incorrectly be 0
			offset.top -= parseFloat(Y.DOM(element).css('margin-top')) || 0;
			offset.left -= parseFloat(Y.DOM(element).css('margin-left')) || 0;

			// Add offsetParent borders
			parentOffset.top += parseFloat(Y.DOM(offsetParent[0]).css(
				'border-top-width')) || 0;
			parentOffset.left += parseFloat(Y.DOM(offsetParent[0]).css(
				'border-left-width')) || 0;

			// Subtract the two offsets
			return {
				top: offset.top - parentOffset.top,
				left: offset.left - parentOffset.left
			};
		},

		offsetParent: function() {
			return this.map(function() {
				var offsetParent = this.offsetParent || docElem;

				while (offsetParent && 
					(!Y.DOM.nodeName(offsetParent, 'html') && 
						Y.DOM.CSS(offsetParent, 'position') === 'static')) {
					offsetParent = offsetParent.offsetParent;
				}

				return offsetParent || docElem;
			});
		},

		detach: function(selector) {
			return this.remove(selector, true);
			// return this.remove(selector);
		}
	});

	//---
	
	Y.DOM.extend({
		// Multifunctional method to get and set values of a collection
		// The value/s can optionally be executed if it's a function
		Access: function(elems, callback, key, value, chainable, emptyGet, raw) {
			var i = 0,
				length = elems.length,
				bulk = key === null;

			// Sets many values
			if (Y.type(key) === 'object') {
				chainable = true;
				for (i in key) {
					if (key.hasOwnProperty(i)) {
						this.Access(elems, callback, i, key[i], true, emptyGet, raw);
					}
				}
				// Sets one value
			} else if (value !== undef) {
				chainable = true;

				if (!Y.isFunction(value)) {
					raw = true;
				}

				if (bulk) {
					// Bulk operations run against the entire set
					if (raw) {
						callback.call(elems, value);
						callback = null;

						// ...except when executing function values
					} else {
						bulk = callback;
						callback = function(element, key, value) {
							return bulk.call(Y.DOM(element), value);
						};
					}
				}

				if (callback) {
					for (i; i < length; i++) {
						callback(elems[i], key, raw ? value : value.call(elems[i], i, callback(
							elems[i], key)));
					}
				}
			}

			return chainable ? elems :
				// Gets
				bulk ? callback.call(elems) : length ? callback(elems[0], key) : emptyGet;
		},
		// A method for quickly swapping in/out CSS properties to get correct calculations.
		// Note: this method belongs to the css module but it's needed here for the support module.
		// If support gets modularized, this method should be moved back to the css module.
		Swap: function(element, options, callback, args) {
			var ret, name,
				old = {};

			// Remember the old values, and insert the new ones
			for (name in options) {
				if (options.hasOwnProperty(name)) {
					old[name] = element.style[name];
					element.style[name] = options[name];
				}
			}

			ret = callback.apply(element, args || []);

			// Revert the old values
			for (name in options) {
				if (options.hasOwnProperty(name)) {
					element.style[name] = old[name];
				}
			}

			return ret;
		},
		nodeName: function(element, name) {
			if (Y.isSet(element) && !Y.isSet(name)) {
				return element.nodeName;
			}

			if (Y.isSet(element) && Y.isSet(name)) {
				return element.nodeName && element.nodeName.toLowerCase() === name.toLowerCase();
			}
		},
		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		CSS_Hooks: {
			opacity: {
				get: function(element, computed) {
					if (computed) {
						// We should always get a number back from opacity
						var ret = CCSS(element, 'opacity');
						return Y.isEmpty(ret) ? '1' : ret;
					}
				}
			}
		},
		// Don't automatically add "px" to these possibly-unitless properties
		CSS_Number: {
			'columnCount': true,
			'fillOpacity': true,
			'fontWeight': true,
			'lineHeight': true,
			'opacity': true,
			'order': true,
			'orphans': true,
			'widows': true,
			'zIndex': true,
			'zoom': true
		},
		
		// Add in properties whose names you wish to fix before
		// setting or getting the value
		CSS_Properities: {
			// normalize float css property
			'float': 'cssFloat'
		},
		
		// Get and set the style property on a DOM DOM
		Style: function(element, name, value, extra) {
			// Don't set styles on text and comment nodes
			if (!element || element.nodeType === 3 || 
				element.nodeType === 8 || !element.style) {
				return;
			}

			// Make sure that we're working with the right name
			var ret, hooks,
				origName = Y.camelise(name),
				style = element.style,
				newvalue;

			name = this.CSS_Properities[origName] ||
				(this.CSS_Properities[origName] = vendorPropName(style, origName));

			// gets hook for the prefixed version
			// followed by the unprefixed version
			hooks = this.CSS_Hooks[name] || this.CSS_Hooks[origName];

			newvalue = value;

			// Check if we're setting a value
			if (value !== undef) {
				ret = Y.G.regexList.relNum.exec(value);

				// Convert relative number strings (+= or -=) to relative numbers. #7345
				if (Y.isString(value) && ret) {
					value = (ret[1] + 1) * ret[2] + parseFloat(this.CSS(element, name));
				}

				// Make sure that NaN and null values aren't set. See: #7116
				if ((value === null || Y.isNumber(value)) && isNaN(value)) {
					return;
				}

				// If a number was passed in, add 'px' to the (except for certain CSS properties)
				if (Y.isNumber(value) && !this.CSS_Number[origName]) {
					value += 'px';
				}

				// Fixes #8908, it can be done more correctly by specifying setters in CSS_Hooks,
				// but it would mean to define eight (for every problematic property) identical functions
				if (!this.Support.clearCloneStyle && Y.isEmpty(value) && name.indexOf(
					'background') === 0) {
					style[name] = 'inherit';
				}

				// If a hook was provided, use that value, otherwise just set the specified value
				if (!hooks || !(hooks.hasOwnProperty('set')) || (value = hooks.set(
					element, value, extra)) !== undef) {
					style[name] = value;

					if (!newvalue && newvalue !== 0) {
						// style.setProperty(name, Y.empty);
						style.setProperty(name, Y.empty, Y.empty);
						style.removeProperty(name);
					}
				}
			} else {
				// If a hook was provided get the non-computed value from there
				if (hooks && hooks.hasOwnProperty('get') && (ret = hooks.get(element,
					false, extra)) !== undef) {
					return ret;
				}

				// Otherwise just get the value from the style object
				return style[name];
			}
		},
		
		CSS: function(element, name, extra, styles) {
			var val, num, hooks,
				origName = Y.camelise(name);

			// Make sure that we're working with the right name
			name = this.CSS_Properities[origName] ||
				(this.CSS_Properities[origName] = vendorPropName(element.style, origName));

			// gets hook for the prefixed version
			// followed by the unprefixed version
			hooks = this.CSS_Hooks[name] || this.CSS_Hooks[origName];

			// If a hook was provided get the computed value from there
			if (hooks && hooks.hasOwnProperty('get')) {
				val = hooks.get(element, true, extra);
			}

			// Otherwise, if a way to get the computed value exists, use that
			if (val === undef) {
				val = CCSS(element, name, styles);
			}

			// Converts "normal" to a computed value
			if (val === 'normal' && cssNormalTransform.hasOwnProperty(name)) {
				val = cssNormalTransform[name];
			}

			// Return, converting to number if forced or a qualifier was provided and val looks numeric
			if (Y.isEmpty(extra) || extra) {
				num = parseFloat(val);
				return extra === true || Y.isNumber(num) ? num || 0 : val;
			}

			return val;
		},

		offset: {
			setOffset: function(element, options, i) {
				var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft,
					calculatePosition,
					position = Y.DOM.CSS(element, "position"),
					curElem = Y.DOM(element),
					props = {};

				// Set position first, in-case top/left are set even on static element
				if (position === "static") {
					element.style.position = "relative";
				}

				curOffset = curElem.offset();
				curCSSTop = Y.DOM.CSS(element, "top");
				curCSSLeft = Y.DOM.CSS(element, "left");
				calculatePosition = (position === "absolute" || position === "fixed") &&
					(curCSSTop + curCSSLeft).indexOf("auto") > -1;

				// Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
				if (calculatePosition) {
					curPosition = curElem.position();
					curTop = curPosition.top;
					curLeft = curPosition.left;
				} else {
					curTop = parseFloat(curCSSTop) || 0;
					curLeft = parseFloat(curCSSLeft) || 0;
				}

				if (Y.isFunction(options)) {
					options = options.call(element, i, curOffset);
				}

				if (!Y.isNull(options.top)) {
					props.top = (options.top - curOffset.top) + curTop;
				}

				if (!Y.isNull(options.left)) {
					props.left = (options.left - curOffset.left) + curLeft;
				}

				if (options.hasOwnProperty('using')) {
					options.using.call(element, props);
				} else {
					curElem.css(props);
				}
			}
		}
	});
	
	//---

	Y.DOM.Support = Y.DOM.support = {};
	Y.DOM.Expr = Y.DOM.expr = {};
	Y.DOM.Map = Y.DOM.map = map;
	Y.DOM.each = Y.each;

	//---

	// Create scrollLeft and scrollTop methods
	Y.each({
		scrollLeft: 'pageXOffset',
		scrollTop: 'pageYOffset'
	}, function(method, prop) {
		var top = 'pageYOffset' === prop;

		Y.DOM.Function[method] = function(val) {
			return Y.DOM.Access(this, function(element, method, val) {
				var win = getWindow(element);

				if (val === undef) {
					return win ? win[prop] : element[method];
				}

				if (win) {
					win.scrollTo(!top ? val : window.pageXOffset, top ? val : window.pageYOffset);

				} else {
					element[method] = val;
				}
			}, method, val, arguments.length, null);
		};
	});

	//---

	Y.DOM.cssExpand = cssExpand;

	//---

	Y.each(['height', 'width'], function(i, name) {
		Y.DOM.CSS_Hooks[name] = {
			get: function(element, computed, extra) {
				if (computed) {
					// certain elements can have dimension info if we invisibly show them
					// however, it must have a current display style that would benefit from this
					return element.offsetWidth === 0 && Y.G.regexList.displaySwap.test(Y.DOM.CSS(element,
						'display')) ?
						Y.DOM.Swap(element, cssShow, function() {
							return getWidthOrHeight(element, name, extra);
						}) :
						getWidthOrHeight(element, name, extra);
				}
			},
			set: function(element, value, extra) {
				var styles = extra && getStyles(element);
				return setPositiveNumber(element, value, extra ?
						argumentWidthOrHeight(
							element,
							name,
							extra,
								Y.DOM.Support.boxSizing && Y.DOM.CSS(element, 'boxSizing', false,
								styles) === 'border-box',
							styles
						) : 0
				);
			}
		};
	});

	//---

	Y.each({
		Height: 'height',
		Width: 'width'
	}, function(name, type) {
		Y.each({
			padding: 'inner' + name,
			content: type,
			'': 'outer' + name
		}, function(defaultExtra, funcName) {
			// margin is only for outerHeight, outerWidth
			Y.DOM.Function[funcName] = function(margin, value) {
				var chainable = arguments.length && (defaultExtra || typeof margin !==
						'boolean'),
					extra = defaultExtra || (margin === true || value === true ? 'margin' :
						'border');

				return Y.DOM.Access(this, function(element, type, value) {
					var doc;

					if (Y.isWindow(element)) {
						// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
						// isn't a whole lot we can do. See pull request at this URL for discussion:
						// https://github.com/jquery/jquery/pull/764
						return element.document.documentElement['client' + name];
					}

					// Get document width or height
					if (element.nodeType === 9) {
						doc = element.documentElement;

						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						return Math.max(
							element.body['scroll' + name], doc['scroll' + name],
							element.body['offset' + name], doc['offset' + name],
							doc['client' + name]
						);
					}

					return value === undef ?
						// Get width or height on the element, requesting but not forcing parseFloat
						Y.DOM.CSS(element, type, extra) :
						// Set width or height on the element
						Y.DOM.Style(element, type, value, extra);
				}, type, chainable ? margin : undef, chainable, null);
			};
		});
	});
	
	//---

	// Generate the `after`, `prepend`, `before`, `append`,
	// `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
	adjacencyOperators.forEach(function(operator, operatorIndex) {
		var inside = operatorIndex % 2; //=> prepend, append

		Y.DOM.Function[operator] = function() {
			// Arguments can be nodes, arrays of nodes, YAX objects and HTML strings
			var nodes = map(arguments, function(arg) {
					return Y.isObject(arg) ||
						Y.isArray(arg) ||
						Y.isNull(arg) ?
						arg : Y.DOM.fragment(arg);
				}),
				parent,
				copyByClone = this.length > 1,
				parentInDocument;

			if (nodes.length < 1) {
				return this;
			}

			return this.each(function(tmp, target) {
				parent = inside ? target : target.parentNode;

				// Convert all methods to a "before" operation
				target = operatorIndex === 0 ? target.nextSibling :
						operatorIndex === 1 ? target.firstChild :
						operatorIndex === 2 ? target :
					null;

				parentInDocument = docElem.contains(parent);

				nodes.forEach(function(node) {
					if (copyByClone) {
						node = node.cloneNode(true);
					} else if (!parent) {
						return Y.DOM(node).remove();
					}

					if (parentInDocument) {
						return parent.insertBefore(node[0], target);
					}

					// for (var ancestor = parent.parentNode; ancestor !== null && ancestor !== document.createElement; ancestor = ancestor.parentNode);

					traverseNode(parent.insertBefore(node, target), function(elem) {
						if (Y.isNull(elem.nodeName) && elem.nodeName.toUpperCase() ===
							'SCRIPT' && (!elem.type || elem.type === 'text/javascript')) {
							if (!elem.src) {
								// globalEval(window, elem.innerHTML);
								/*jshint evil:true */
								// eval(window, elem.innerHTML);
								eval.call(window, elem.innerHTML);
							}
						}
					});
				});
			});
		};

		// after	=> insertAfter
		// prepend  => prependTo
		// before   => insertBefore
		// append   => appendTo
		Y.DOM.Function[inside ? operator + 'To' : 'insert' + (operatorIndex ?
			'Before' : 'After')] = function (html) {
			Y.DOM(html)[operator](this);
			return this;
		};
	});

	//---

	/*var guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};
	var rparentsprev = /^(?:parents|prev(?:Until|All))/;

	Y.DOM.extend({
		dir: function(elem, dir, until) {
			var matched = [],
				truncate = until !== undefined;

			while ((elem = elem[dir]) && elem.nodeType !== 9) {
				if (elem.nodeType === 1) {
					if (truncate && Y.DOM(elem).is(until)) {
						break;
					}

					matched.push(elem);
				}
			}

			return matched;
		},

		sibling: function (n, elem) {
			var matched = [];

			for (n; n; n = n.nextSibling) {
				if (n.nodeType === 1 && n !== elem) {
					matched.push(n);
				}
			}

			return matched;
		}
	});

	function sibling (cur, dir) {
		// jshint -W035
		while ((cur = cur[dir]) && cur.nodeType !== 1) {}
		return cur;
	}

	Y.each(
		{
			parent: function(elem) {
				var parent = elem.parentNode;
				return parent && parent.nodeType !== 11 ? parent : null;
			},

			parents: function(elem) {
				return Y.DOM.dir(elem, "parentNode");
			},

			parentsUntil: function(elem, i, until) {
				return Y.DOM.dir(elem, "parentNode", until);
			},

			next: function(elem) {
				return sibling(elem, "nextSibling");
			},

			prev: function(elem) {
				return sibling(elem, "previousSibling");
			},

			nextAll: function(elem) {
				return Y.DOM.dir(elem, "nextSibling");
			},

			prevAll: function(elem) {
				return Y.DOM.dir(elem, "previousSibling");
			},

			nextUntil: function(elem, i, until) {
				return Y.DOM.dir(elem, "nextSibling", until);
			},

			prevUntil: function(elem, i, until) {
				return Y.DOM.dir(elem, "previousSibling", until);
			},

			siblings: function(elem) {
				return Y.DOM.sibling((elem.parentNode || {}).firstChild, elem);
			},

			children: function(elem) {
				return Y.DOM.sibling(elem.firstChild);
			},

			contents: function(elem) {
				return elem.contentDocument || Y.DOM.merge([], elem.childNodes);
			}
		}, function (name, fn) {
			Y.DOM.Function[name] = function(until, selector) {
				var matched = Y.DOM.map(this, fn, until);

				if (name.slice(-5) !== "Until") {
					selector = until;
				}

				if (selector && Y.isString(selector)) {
					// matched = Y.DOM.filter(selector, matched);
					matched = Y.DOM.matches(matched, selector);
				}

				if (this.length > 1) {
					// Remove duplicates
					if (!guaranteedUnique[ name ]) {
						Y.unique(matched);
					}

					// Reverse order for parents* and prev-derivatives
					if (rparentsprev.test(name)) {
						matched.reverse();
					}
				}

				Y.LOG('AAAA', until, matched, selector);

				return this.pushStack(matched);
			};
		}
	);*/

	//---

	Y.DOM.Function.parentsUntil_= function(selector, context) {
		var nodes = this;
		var collection = false;
		var parents = [];

		if (Y.isObject(selector)) {
			collection = Y.DOM(selector);
		}

		/*jshint -W083 */
		while (nodes.length > 0) {
			nodes = Y.DOM.map(nodes, function (node) {
				while (node && !(collection ? collection.indexOf(node) >= 0 : Y.DOM.matches(node, selector))) {
					node = node !== context && !Y.isDocument(node) && node.parentNode;
					parents.push(node);
				}
			});
		}

		if (context && Y.isString(context)) {
			return Y.DOM(parents).find(context);
		}

		if (selector && Y.isString(selector)) {
			Y.LOG(Y.DOM(parents))
			return Y.DOM(parents[1]);
		}

		//return Y.DOM(parents);




	};

	//---

	Y.DOM.fn = Y.DOM.Function;

	//---

	Y.DOM.globalEval = globalEval;
	Y.DOM.getStyles = getStyles;
	Y.DOM.getDocStyles = getDocStyles;

	//---

	window.$ = Y.DOM;

	return Y.DOM;

	//---

}());

// FILE: ./Source/Modules/Node/Node.js

//---


/**
 * YAX Simple Selector [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y */

(function () {

	//---

	'use strict';

	// var tmpYaxDom = Y.DOM;

	var oldQSA = Y.DOM.qsa;
	var oldMatches = Y.DOM.matches;
	var classTag = Y.DOM.classTag;
	var Filters;

	//---

	Y.DOM.expr.match = {};

	Y.DOM.expr.match.needsContext = new RegExp( "^" + Y.G.regexList.whitespace +
		"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
		Y.G.regexList.whitespace + "*((?:-\\d)?\\d*)" + Y.G.regexList.whitespace +
		"*\\)|)(?=[^-]|$)", "i" );

	//---

	function visible(element) {
		element = Y.DOM(element);
		return !!(element.width() || element.height()) && element.css('display') !== 'none';
	}

	// Complex selectors are not supported:
	//   li:has(label:contains("foo")) + li:has(label:contains("bar"))
	//   ul.inner:first > li
	Filters = Y.DOM.Expr[':'] = Y.DOM.expr[':'] = {
		visible: function () {
			if (visible(this)) {
				return this;
			}
		},
		hidden: function () {
			if (visible(this)) {
				return this;
			}
		},
		selected: function () {
			if (visible(this)) {
				return this;
			}
		},
		checked: function () {
			if (visible(this)) {
				return this;
			}
		},
		parent: function () {
			return this.parentNode;
		},
		first: function (index) {
			if (index === 0) {
				return this;
			}
		},
		last: function (index, nodes) {
			if (index === nodes.length - 1) {
				return this;
			}
		},
		eq: function (index, _, value) {
			if (index === value) {
				return this;
			}
		},
		contains: function (index, _, text) {
			if (Y.DOM(this).text().indexOf(text) > -1) {
				return this;
			}
		},
		has: function (index, _, selector) {
			if (Y.DOM.qsa(this, selector).length) {
				return this;
			}
		}
	};

	function process(selector, callback) {
		// Quote the hash in `a[href^=#]` expression
		selector = selector.replace(/\=#\]/g, '="#"]');

		var filter, argument, match = Y.G.regexList.filterReplacement.exec(selector), num;

		if (match && Filters.hasOwnProperty(match[2])) {
			filter = Filters[match[2]];
			argument = match[3];
			selector = match[1];

			if (argument) {
				num = Number(argument);

				if (isNaN(num)) {
					argument = argument.replace(/^["']|["']$/g, '');
				} else {
					argument = num;
				}
			}
		}

		return callback(selector, filter, argument);
	}

	Y.DOM.qsa = function (node, selector) {
		var taggedParent, nodes;

		return process(selector, function (_selector, filter, argument) {
			try {
				if (!_selector && filter) {
					_selector = '*';
				} else if (Y.G.regexList.childReplacement.test(_selector)) {
					// support "> *" child queries by tagging the parent node with a
					// unique class and prepending that classname onto the selector
					taggedParent = Y.DOM(node).addClass(classTag);
					_selector = '.' + classTag + ' ' + _selector;
				}

				nodes = oldQSA(node, _selector);
			} catch (e) {
				Y.ERROR('Error performing selector: %o', selector);
				throw e;
			} finally {
				if (taggedParent) {
					taggedParent.removeClass(classTag);
				}
			}

			return !filter ? nodes :
				Y.unique(Y.DOM.map(nodes, function (n, i) {
					return filter.call(n, i, nodes, argument);
				}));
		});
	};

	Y.DOM.matches = function (node, selector) {
		return process(selector, function (_selector, filter, argument) {
			return (!_selector || oldMatches(node, _selector)) && (!filter || filter.call(node, null, argument) === node);
		});
	};

	//---

}());

// FILE: ./Source/Modules/Node/SimpleSelector.js

//---

/**
 * YAX Data [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function () {

	//---

	'use strict';

	var data = {};
	var dataAttr = Y.DOM.Function.data;
	var exp = Y.DOM.expando;

	//---

	function Data() {
		// Support: Android < 4,
		// Old WebKit does not have .preventExtensions/freeze method,
		// return new empty object instead with no [[set]] accessor
		Object.defineProperty(this.cache = {}, 0, {
			get: function () {
				return {};
			}
		});

		this.expando = Y.DOM.expando;
	}

	Data.UID = 1;

	Data.accepts = function (owner) {
		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  -
		//    - Any
		return owner.nodeType ?
			owner.nodeType === 1 || owner.nodeType === 9 : 
			true;
	};

	Data.prototype = {
		key: function (owner) {
			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return the key for a frozen object.
			if (!Data.accepts(owner)) {
				return 0;
			}

			var descriptor = {},
			// Check if the owner object already has a cache key
				unlock = owner[this.expando];

			// If not, create one
			if (!unlock) {
				unlock = Data.UID++;

				// Secure it in a non-enumerable, non-writable property
				try {
					descriptor[this.expando] = {
						value: unlock
					};
					Object.defineProperties(owner, descriptor);

					// Support: Android < 4
					// Fallback to a less secure definition
				} catch (e) {
					descriptor[this.expando] = unlock;
					Y.extend(owner, descriptor);
				}
			}

			// Ensure the cache object
			if (!this.cache[unlock]) {
				this.cache[unlock] = {};
			}

			return unlock;
		},
		
		set: function (owner, data, value) {
			var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this 'owner', create one inline
			// and set the unlock as though an owner entry had always existed
				unlock = this.key(owner),
				cache = this.cache[unlock];

			// Handle: [ owner, key, value ] args
			if (typeof data === 'string') {
				cache[data] = value;

				// Handle: [ owner, { properties } ] args
			} else {
				// Fresh assignments by object are shallow copied
				if (Y.isEmpty(cache)) {
					Y.extend(this.cache[unlock], data);
					// Otherwise, copy the properties one-by-one to the cache object
				} else {
					for (prop in data) {
						if (data.hasOwnProperty(prop)) {
							cache[prop] = data[prop];
						}
					}
				}
			}
			return cache;
		},
		
		get: function (owner, key) {
			// Either a valid cache is found, or will be created.
			// New caches will be created and the unlock returned,
			// allowing direct access to the newly created
			// empty data object. A valid owner object must be provided.
			var cache = this.cache[this.key(owner)];

			return key === undefined ?
				cache : cache[key];
		},
		
		access: function (owner, key, value) {
			var stored;
			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the 'read' path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if (key === undefined ||
				((key && typeof key === 'string') && value === undefined)) {

				stored = this.get(owner, key);

				return stored !== undefined ?
					stored : this.get(owner, Y.camelise(key));
			}

			// [*]When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set(owner, key, value);

			// Since the 'set' path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		
		remove: function (owner, key) {
			var i, name, camel,
				unlock = this.key(owner),
				cache = this.cache[unlock];

			if (key === undefined) {
				this.cache[unlock] = {};

			} else {
				// Support array or space separated string of keys
				if (Y.isArray(key)) {
					// If 'name' is an array of keys...
					// When data is initially created, via ('key', 'val') signature,
					// keys will be converted to camelCase.
					// Since there is no way to tell _how_ a key was added, remove
					// both plain key and camelCase key. #12786
					// This will only penalize the array argument path.
					name = key.concat(key.map(Y.camelise));
				} else {
					camel = Y.camelise(key);
					// Try the string as a key before any manipulation
					if (cache.hasOwnProperty(key)) {
						name = [key, camel];
					} else {
						// If a key with the spaces exists, use it.
						// Otherwise, create an array by matching non-whitespace
						name = camel;
						name = cache.hasOwnProperty(name) ? [name] : (name.match(/\S+/g) || []);
					}
				}

				i = name.length;

				while (i--) {
					delete cache[name[i]];
				}
			}
		},
		
		hasData: function (owner) {
			return !Y.isEmpty(
					this.cache[owner[this.expando]] || {}
			);
		},
		
		discard: function (owner) {
			if (owner[this.expando]) {
				delete this.cache[owner[this.expando]];
			}
		}
	};
	
	//---

	// These may be used throughout the YAX core codebase
	Y.DOM.dataUser = Y.DOM.data_user = new Data();
	Y.DOM.dataPrivative = Y.DOM.data_priv = new Data();
	
	//---

	Y.extend(Y.DOM, {
		acceptData: Data.accepts,
		
		hasData: function (elem) {
			return Y.DOM.dataUser.hasData(elem) || Y.DOM.dataPrivative.hasData(elem);
		},
		
		data: function (elem, name, data) {
			return Y.DOM.dataUser.access(elem, name, data);
		},
		
		removeData: function (elem, name) {
			Y.DOM.dataUser.remove(elem, name);
		},

		_data: function (elem, name, data) {
			return Y.DOM.dataPrivative.access(elem, name, data);
		},
		
		_removeData: function (elem, name) {
			Y.DOM.dataPrivative.remove(elem, name);
		}
	});
	
	//---

	function dataAttribute(elem, key, data) {
		var name;

		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if (data === undefined && elem.nodeType === 1) {
			name = 'data-' + key.replace(Y.G.regexList.multiDash, '-$1').toLowerCase();
			data = elem.getAttribute(name);

			if (typeof data === 'string') {
				try {
					data = data === 'true' ? true :
							data === 'false' ? false :
							data === 'null' ? null :
						// Only convert to a number if it doesn't change the string
							+ data + Y.empty === data ? +data :
								Y.G.regexList.brace.test(data) ? JSON.parse(data) :
							data;
				} catch (e) {
					console.log(e);
				}

				// Make sure we set the data so it isn't changed later
				Y.DOM.dataUser.set(elem, key, data);
			} else {
				data = undefined;
			}
		}

		return data;
	}

	// Read all 'data-*' attributes from a node
	function attributeData(node) {
		var store = {};

		Y.each(node.attributes || Y.G.ArrayProto, function (i, attr) {
			if (attr.name.indexOf('data-') === 0) {
				store[Y.camelise(attr.name.replace('data-', ''))] =
					Y.deserialiseValue(attr.value);
			}
		});

		return store;
	}

	// Store value under Camelised key on node
	function setData(node, name, value) {
		var id, store;

		if (node[exp]) {
			id = node[exp];
		} else {
			node[exp] = ++Y.DOM.UUID;
			id = node[exp];
		}

		if (data[id]) {
			store = data[id];
		} else {
			data[id] = attributeData(node);
			store = data[id];
		}

		if (name !== undefined) {
			store[Y.camelise(name)] = value;
		}

		return store;
	}

	// Get value from node:
	// 1. first try key as given,
	// 2. then try Camelised key,
	// 3. fall back to reading 'data-*' attribute.
	function getData(node, name) {
		var id = node[exp],
			store = id && data[id],
			camelName;

		if (name === undefined) {
			return store || setData(node);
		}

		if (store) {
			if (store.hasOwnProperty(name)) {
				return store[name];
			}

			camelName = Y.camelise(name);

			if (store.hasOwnProperty(camelName)) {
				return store[camelName];
			}
		}

		return dataAttr.call(Y.DOM(node), name);
	}

	Y.extend(Y.DOM.Function, {
		data: function (key, value) {
			var attrs, name,
				elem = this[0],
				i = 0,
				datao = null;
			var self = this;

			// Gets all values
			if (key === undefined) {
				if (this.length) {
					datao = Y.DOM.dataUser.get(elem);

					if (elem.nodeType === 1 && !Y.DOM.dataPrivative.get(elem, 'hasDataAttrs')) {
						attrs = elem.attributes;

						for (i; i < attrs.length; i++) {
							name = attrs[i].name;

							if (name.indexOf('data-') === 0) {
								name = Y.camelise(name.slice(5));
								dataAttribute(elem, name, datao[name]);
							}
						}

						Y.DOM.dataPrivative.set(elem, 'hasDataAttrs', true);
					}
				}

				return datao;
			}

			// Sets multiple values
			if (typeof key === 'object') {
				return this.each(function () {
					Y.DOM.dataUser.set(this, key);
				});
			}

			return Y.DOM.Access(this, function (value) {
				var _data,
					camelKey = Y.camelise(key);

				// The calling YAX object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty YAX object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if (elem && value === undefined) {
					// Attempt to get data from the cache
					// with the key as-is
					_data = Y.DOM.dataUser.get(elem, key);

					if (_data !== undefined) {
						return _data;
					}

					// Attempt to get data from the cache
					// with the key Camelised
					_data = Y.DOM.dataUser.get(elem, camelKey);
					if (_data !== undefined) {
						return _data;
					}

					// Attempt to 'discover' the data in
					// HTML5 custom data-* attrs
					_data = dataAttr(elem, camelKey, undefined);
					if (_data !== undefined) {
						return _data;
					}

					// We tried really hard, but the data doesn't exist.
					return;
				}

				// Set the data...
				self.each(function () {
					// First, attempt to store a copy or reference of any
					// data that might've been store with a camelCased key.
					var __data = Y.DOM.dataUser.get(this, camelKey);

					// For HTML5 data-* attribute interop, we have to
					// store property names with dashes in a camelCase form.
					// This might not apply to all properties...*
					Y.DOM.dataUser.set(this, camelKey, value);

					// *... In the case of properties that might _actually_
					// have dashes, we need to also store a copy of that
					// unchanged property.
					if (key.indexOf('-') !== -1 && __data !== undefined) {
						Y.DOM.dataUser.set(this, key, value);
					}
				});
			}, null, value, arguments.length > 1, null, true);
		},
		
		removeData: function (key) {
			return this.each(function () {
				Y.DOM.dataUser.remove(this, key);
			});
		}
	});

	Y.DOM.Function.data = function (name, value) {
		var result;

		// Set multiple values via object
		if (Y.isUndefined(value)) {
			if (Y.isPlainObject(name)) {
				result = this.each(function (i, node) {
					Y.each(name, function (key, value) {
						setData(node, key, value);
					});
				});
			} else {
				// Get value from first element
				if (this.length === 0) {
					result = undefined;
				} else {
					result = getData(this[0], name);
				}
			}
		} else {
			// Set value on all elements
			result = this.each(function () {
				setData(this, name, value);
			});
		}

		return result;
	};

	Y.DOM.Function.removeData = function (names) {
		if (typeof names === 'string') {
			names = names.split(/\s+/);
		}
		return this.each(function () {
			var id = this[exp],
				store = id && data[id];

			if (store) {
				Y.each(names || store, function (key) {
					delete store[names ? Y.camelise(this) : key];
				});
			}
		});
	};

	// Generate extended `remove` and `empty` functions
	/*['remove', 'empty'].forEach(function (methodName) {
		var origFn = Y.DOM.Function[methodName];

		Y.DOM.Function[methodName] = function () {
			var elements = this.find('*');

			if (methodName === 'remove') {
				elements = elements.add(this);
			}

			elements.removeData();

			return origFn.call(this);
		};
	});*/

	//---

}());

// FILE: ./Source/Modules/Node/Data.js

//---

/**
 * YAX Events [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function (window, document, undef) {

	//---

	'use strict';

	var YID = 1;

	/*var hover = {
		mouseenter: 'mouseover',
		mouseleave: 'mouseout'
	};*/

	var inputEvents = ['focus', 'blur'];

	/*var focus = {
		focus: 'focusin',
		blur: 'focusout'
	};*/

	// var focusinSupported = Y.hasOwn.call(window, 'onfocusin');

	var eventMethods = {
		preventDefault: 'isDefaultPrevented',
		stopImmediatePropagation: 'isImmediatePropagationStopped',
		stopPropagation: 'isPropagationStopped'
	};

	var eventsKey = 'YAX.Event.Handlers';

	var returnTrue;

	var returnFalse;

	var specialEvents = {};

	//---

	specialEvents.click =
		specialEvents.mousedown =
			specialEvents.mouseup =
				specialEvents.mousemove = 'MouseEvents';

	Y.DOM.support.focusinBubbles = Y.hasOwn.call(window, 'onfocusin');

	//---

	// BEGIN OF [Private Functions]

	returnTrue = function returnTrue() {
		return true;
	};

	returnFalse = function returnFalse() {
		return false;
	};

	function safeActiveElement () {
		try {
			return document.activeElement;
		} catch (err) {
			Y.ERROR(err);
		}
	}

	function yID(element) {
		element.YID = YID++;

		return element.YID;

		// return element.YID || (element.YID = YID++);
	}

	function parse(event) {
		var parts = (Y.empty + event).split('.');

		return {
			e: parts[0],
			ns: parts.slice(1).sort().join(' ')
		};
	}

	function matcherFor(ns) {
		return new RegExp('(?:^|)' + ns.replace(' ', ' .* ?') + '(?: |$)');
	}

	function eventHandlers(element) {
		if (Y.hasOwn.call(element, 'Y.Event.Handlers')) {
			return element['Y.Event.Handlers'];
		}

		element['Y.Event.Handlers'] = [];

		return element['Y.Event.Handlers'];
	}

	function findHandlers(element, event, func, selector) {
		var result = parse(event), matcher;

		if (result.ns) {
			matcher = matcherFor(result.ns);
		}

		return (eventHandlers(element) || []).filter(function (handler) {
			return handler && (!result.e || handler.e === result.e) && (!result.ns || matcher.test(handler.ns)) && (!func || yID(handler.callback) === yID(func)) && (!selector || handler.selector === selector);
		});
	}

	/*function eventCapture(handler, captureSetting) {
		return !(!handler.del || !(!focusinSupported && Y.hasProperty(focus, handler.e))) || Y.isSet(captureSetting);
	}

	function realEvent(type) {
		return hover[type] || (focusinSupported && focus[type]) || type;
	}*/

	function compatible(event, source) {
		if (source || !event.isDefaultPrevented) {
			// source || (source = event);
			source = source || event;

			Y.each(eventMethods, function (name, predicate) {
				var sourceMethod = source[name];

				event[name] = function () {
					this[predicate] = returnTrue;
					return sourceMethod && sourceMethod.apply(source, arguments);
				};

				event[predicate] = returnFalse;
			});

			if (!Y.isUndefined(source.defaultPrevented)) {
				if (source.defaultPrevented) {
					event.isDefaultPrevented = returnTrue;
				}
			} else {
				if (Y.hasProperty(source, 'returnValue')) {
					if (source.returnValue === false) {
						event.isDefaultPrevented = returnTrue;
					}
				} else {
					/** @namespace source.getPreventDefault */
					if (source.getPreventDefault && source.getPreventDefault()) {
						event.isDefaultPrevented = returnTrue;
					}
				}
			}
		}

		return event;
	}

	function createProxy(event) {
		var key, proxy = {
			originalEvent: event
		};

		for (key in event) {
			if (event.hasOwnProperty(key)) {
				if (!Y.G.regexList.ignoreProperties.test(key) && !Y.isUndefined(event[key])) {
					proxy[key] = event[key];
				}
			}
		}

		return compatible(proxy, event);
	}

	// END OF [Private Functions]

	//---


	Y.DOM.Event = function (src, props) {
		// Allow instantiation without the 'new' keyword
		if (!(this instanceof Y.DOM.Event)) {
			return new Y.DOM.Event(src, props);
		}

		//---

		// Event object
		if (src && src.type) {
			this.originalEvent = src;
			this.type = src.type;

			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			if (src.defaultPrevented ||
				(Y.isUndefined(src.defaultPrevented) &&
					src.returnValue === false)) {
				this.isDefaultPrevented = returnTrue();
			} else {
				this.isDefaultPrevented = returnFalse();
			}
			// Event type
		} else {
			this.type = src;
		}

		//

		if (props) {
			Y.extend(this, props);
		}

		//

		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = (src && src.timeStamp) || Y.now();

		// Mark it as fixed
		this[Y.DOM.expando] = true;

		compatible(this);
	};

	//---

	// Y.DOM.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	Y.DOM.Event.prototype = {
		constructor: Y.DOM.Event,

		isDefaultPrevented: returnFalse,

		isPropagationStopped: returnFalse,

		isImmediatePropagationStopped: returnFalse,

		preventDefault: function () {
			var e = this.originalEvent;

			this.isDefaultPrevented = returnTrue;

			if (e && e.preventDefault) {
				e.preventDefault();
			}
		},

		stopPropagation: function () {
			var e = this.originalEvent;

			this.isPropagationStopped = returnTrue;

			if (e && e.stopPropagation) {
				e.stopPropagation();
			}
		},

		stopImmediatePropagation: function () {
			var e = this.originalEvent;

			this.isImmediatePropagationStopped = returnTrue;

			if (e && e.stopImmediatePropagation) {
				e.stopImmediatePropagation();
			}

			this.stopPropagation();
		}
	};

	//---

	/**
	 * Y.DOM.Event contains functions for working with Node events.
	 */
	Y.extend(Y.DOM.Event, {
		add: function (object, types, func, context) {
			var type, x, len;

			if (Y.isObject(types)) {
				for (type in types) {
					if (types.hasOwnProperty(type)) {
						this._on(object, type, types[type], func);
					}
				}
			} else {
				types = Y.Util.splitWords(types);

				for (x = 0, len = types.length; x < len; x++) {
					this._on(object, types[x], func, context);
				}
			}
		},

		_on: function (object, type, callback, context) {
			var id, originalHandler, handler;

			id = type + Y.stamp(callback) + (context ? '_' + Y.stamp(context) : '');

			if (object[eventsKey] && object[eventsKey][id]) {
				return this;
			}

			handler = function (event) {
				return callback.call(context || object, event || window.event);
			};

			originalHandler = handler;

			/** @namespace this.addPointerListener */
			if (Y.UA.features.pointer && type.indexOf('touch') === 0) {
				return this.addPointerListener(object, type, handler, id);
			}

			/** @namespace this.addDoubleTapListener */
			if (Y.UA.features.touch && (type === 'dblclick') && this.addDoubleTapListener) {
				this.addDoubleTapListener(object, handler, id);
			}

			if (Y.hasProperty(object, 'addEventListener')) {
				if (type === 'mousewheel') {
					object.addEventListener('DOMMouseScroll', handler, false);
					object.addEventListener(type, handler, false);
				} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
					handler = function (event) {
						event = event || window.event;
						if (!Y.DOM.Event._checkMouse(object, event)) {
							return;
						}
						return originalHandler(event);
					};

					object.addEventListener(type === 'mouseenter' ? 'mouseover' : 'mouseout', handler, false);
				} else {
					if (type === 'click' && Y.OS.android) {
						handler = function (event) {
							return Y.DOM.Event._filterClick(event, originalHandler);
						};
					}

					object.addEventListener(type, handler, false);
				}
			} else if (Y.hasProperty(object, 'attachEvent')) {
				object.attachEvent('on' + type, handler);
			}

			object[eventsKey] = object[eventsKey] || {};
			object[eventsKey][id] = handler;

			return this;
		},

		remove: function (object, types, func, context) {
			var type, x, len;

			if (Y.isObject(types)) {
				for (type in types) {
					if (types.hasOwnProperty(type)) {
						this._off(object, type, types[type], func);
					}
				}
			} else {
				types = Y.Util.splitWords(types);

				for (x = 0, len = types.length; x < len; x++) {
					this._off(object, types[x], func, context);
				}
			}
		},

		_off: function (object, type, callback, context) {
			var id, handler;

			id = type + Y.stamp(callback) + (context ? '_' + Y.stamp(context) : '');

			handler = object[eventsKey] && object[eventsKey][id];

			if (!handler) {
				return this;
			}

			/** @namespace this.removePointerListener */
			/** @namespace this.removeDoubleTapListener */
			if (Y.UA.features.pointer && type.indexOf('touch') === 0) {
				this.removePointerListener(object, type, id);
			} else if (Y.UA.features.touch && (type === 'dblclick') && this.removeDoubleTapListener) {
				this.removeDoubleTapListener(object, id);
			} else if (Y.hasProperty(object, 'removeEventListener')) {
				if (type === 'mousewheel') {
					object.removeEventListener('DOMMouseScroll', handler, false);
					object.removeEventListener(type, handler, false);
				} else {
					object.removeEventListener(
							type === 'mouseenter' ? 'mouseover' :
								type === 'mouseleave' ? 'mouseout' : type, handler, false);
				}
			} else if (Y.hasProperty(object, 'detachEvent')) {
				object.detachEvent('on' + type, handler);
			}

			object[eventsKey][id] = null;

			return this;
		},

		stopPropagation: function (event) {
			if (event.stopPropagation) {
				event.stopPropagation();
			} else {
				event.cancelBubble = true;
			}

			Y.DOM.Event._skipped(event);

			return this;
		},

		disableScrollPropagation: function (el) {
			var stop = Y.DOM.Event.stopPropagation;

			return Y.DOM.Event
				.on(el, 'mousewheel', stop)
				.on(el, 'MozMousePixelScroll', stop);
		},

//		disableClickPropagation: function (el) {
//
//		},

//		disableClickPropagation: function (el) {
//			var stop = Y.DOM.Event.stopPropagation, i;
//
//			for (i = Y.DOM.Event.Draggable.prototype.START.length - 1; i >= 0; i--) {
//				Y.DOM.Event.on(el, Y.DOM.Event.Draggable.prototype.START[i], stop);
//			}
//
//			return Y.DOM.Event
//				.on(el, 'click', Y.DOM.Event._fakeStop)
//				.on(el, 'dblclick', stop);
//		},

		preventDefault: function (event) {
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}

			return this;
		},

		stop: function (event) {
			return Y.DOM.Event
				.preventDefault(event)
				.stopPropagation(event);
		},

		getWheelDelta: function (event) {
			var delta = 0;

			if (event.wheelDelta) {
				delta = event.wheelDelta / 120;
			}

			if (event.detail) {
				delta = -event.detail / 3;
			}

			return delta;
		},

		_skipEvents: {},

		_fakeStop: function (event) {
			// fakes stopPropagation by setting a special event flag,
			// checked/reset with Y.DOM.Event._skipped(e)
			Y.DOM.Event._skipEvents[event.type] = true;
		},

		_skipped: function (event) {
			var skipped = this._skipEvents[event.type];
			// reset when checking
			this._skipEvents[event.type] = false;
			return skipped;
		},

		// check if element really left/entered
		// the event target (for mouseenter/mouseleave)
		_checkMouse: function (el, event) {
			var related = event.relatedTarget;

			if (!related) {
				return true;
			}

			try {
				while (related && (related !== el)) {
					related = related.parentNode;
				}
			} catch (err) {
				return false;
			}

			return (related !== el);
		},

		// this is a horrible workaround for a bug in Android where a single touch triggers two click events
		_filterClick: function (event, handler) {
			var timeStamp = (event.timeStamp || event.originalEvent.timeStamp),
				elapsed = Y.DOM.Event._lastClick && (timeStamp - Y.DOM.Event._lastClick);

			// are they closer together than 1000ms yet more than 100ms?
			// Android typically triggers them ~300ms apart while multiple listeners
			// on the same event should be triggered far faster;
			// or check if click is simulated on the element, and if it is, reject any non-simulated events

			/** @namespace event.target._simulatedClick */
			/** @namespace event._simulated */
			if ((elapsed && elapsed > 100 && elapsed < 1000) || (event.target._simulatedClick && !event._simulated)) {
				Y.DOM.Event.stop(event);
				return;
			}

			Y.DOM.Event._lastClick = timeStamp;

			return handler(event);
		}
	});

	//---

	Y.DOM.Event.wheelDelta = Y.DOM.Event.getWheelDelta;

	//---

	Y.DOM.event = {};

	//---

	Y.extend(Y.DOM.event, {
		global: {},

		add: function(elem, types, handler, data, selector) {
			var handleObjIn, eventHandle, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = Y.DOM.data_priv.get(elem);

			// Don't attach events to noData or text/comment nodes (but allow plain objects)
			if (!elemData) {
				return;
			}

			// Caller can pass in an object of custom data in lieu of the handler
			if (handler.handler) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}

			// Make sure that the handler has a unique ID, used to find/remove it later
			if (!handler.guid) {
				handler.guid = Y.DOM.GUID++;
			}

			// Init the element's event structure and main handler, if this is the first
			events = elemData.events;
			if (!events) {
				events = elemData.events = {};
			}

			eventHandle = elemData.handle;

			if (!eventHandle) {
				eventHandle = elemData.handle = function (e) {
					// Discard the second event of a Y.DOM.event.trigger() and
					// when an event is called after a page has unloaded
					return !Y.isUndefined(Y.DOM) && Y.DOM.event.triggered !== e.type ?
						Y.DOM.event.dispatch.apply(elem, arguments) : undef;
				};
			}

			// Handle multiple events separated by a space
			types = (types || '').match(Y.G.regexList.notWhite) || [''];

			t = types.length;

			while (t--) {
				tmp = Y.G.regexList.typeNamespace.exec(types[t]) || [];
				type = origType = tmp[1];
				namespaces = (tmp[2] || '').split('.').sort();

				// There *must* be a type, no attaching namespace-only handlers
				if (!type) {
					continue;
				}

				// If event changes its type, use the special event handlers for the changed type
				special = Y.DOM.event.special[type] || {};

				// If selector defined, determine special event api type, otherwise given type
				// type = (selector ? special.delegateType : special.bindType) || type;
				if (selector) {
					type = special.delegateType || type;
				} else {
					type = special.bindType || type;
				}

				// Update special based on newly reset type
				special = Y.DOM.event.special[type] || {};

				// handleObj is passed to all event handlers
				handleObj = Y.DOM.extend({
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && Y.DOM.expr.match.needsContext.test(selector),
					namespace: namespaces.join('.')
				}, handleObjIn);

				// Init the event handler queue if we're the first
				handlers = events[type];

				if (!handlers) {
					handlers = events[type] = [];
					handlers.delegateCount = 0;

					// Only use addEventListener if the special events handler returns false
					if (!special.setup ||
						special.setup.call(elem, data, namespaces, eventHandle) === false) {

						if (elem.addEventListener) {
							// elem.addEventListener(type, eventHandle, false);
							// add: function (object, types, func, context)

							Y.DOM.Event.add(elem, type, eventHandle, false);
						}
					}
				}

				if (special.add) {
					special.add.call(elem, handleObj);

					if (!handleObj.handler.guid) {
						handleObj.handler.guid = handler.guid;
					}
				}

				// Add to the element's handler list, delegates in front
				if (selector) {
					handlers.splice(handlers.delegateCount++, 0, handleObj);
				} else {
					handlers.push(handleObj);
				}

				// Keep track of which events have ever been used, for event optimization
				Y.DOM.event.global[type] = true;
			}

		},

		// Detach an event or set of events from an element
		remove: function(elem, types, handler, selector, mappedTypes) {

			var j, origCount, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = Y.DOM.data_priv.hasData(elem) && Y.DOM.data_priv.get(elem);

			events = elemData.events;

			if (!elemData || !events) {
				return;
			}

			// Once for each type.namespace in types; type may be omitted
			types = (types || '').match(Y.G.regexList.notWhite) || [''];

			t = types.length;

			while (t--) {
				tmp = Y.G.regexList.typeNamespace.exec(types[t]) || [];
				type = origType = tmp[1];
				namespaces = (tmp[2] || '').split('.').sort();

				// Unbind all events (on this namespace, if provided) for the element
				if (!type) {
					for (type in events) {
						/** @namespace events.hasOwnProperty */
						// if (Y.hasOwn.call(events, type)) {
						if (events.hasOwnProperty(type)) {
							Y.DOM.event.remove(elem, type + types[t], handler, selector, true);
						}
					}

					continue;
				}

				special = Y.DOM.event.special[type] || {};

				// type = (selector ? special.delegateType : special.bindType) || type;

				if (selector) {
					type = special.delegateType || type;
				} else {
					type = special.bindType || type;
				}

				handlers = events[type] || [];

				tmp = tmp[2] && new RegExp('(^|\\.)' + namespaces.join('\\.(?:.*\\.|)') + '(\\.|$)');

				// Remove matching events
				origCount = j = handlers.length;

				while (j--) {
					handleObj = handlers[j];

					if ((mappedTypes || origType === handleObj.origType) &&
						(!handler || handler.guid === handleObj.guid) &&
						(!tmp || tmp.test(handleObj.namespace)) &&
						(!selector || selector === handleObj.selector || (selector === '**' && handleObj.selector))) {
						handlers.splice(j, 1);

						if (handleObj.selector) {
							handlers.delegateCount--;
						}

						if (special.remove) {
							special.remove.call(elem, handleObj);
						}
					}
				}

				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if (origCount && !handlers.length) {
					if (!special.teardown ||
						special.teardown.call(elem, namespaces, elemData.handle) === false) {

						Y.DOM.removeEvent(elem, type, elemData.handle);
					}

					delete events[type];
				}
			}

			// Remove the expando if it's no longer used
			if (Y.isEmptyObject(events)) {
				delete elemData.handle;
				Y.DOM.data_priv.remove(elem, 'events');
			}
		},

		trigger: function(event, data, elem, onlyHandlers) {
			var i, cur, tmp, bubbleType, ontype, handle, special,
				eventPath = [elem || document],
				type = Y.hasOwn.call(event, 'type') ? event.type : event,
				namespaces = Y.hasOwn.call(event, 'namespace') ? event.namespace.split('.') : [];

			cur = tmp = elem = elem || document;

			// Don't do events on text and comment nodes
			if (elem.nodeType === 3 || elem.nodeType === 8) {
				return;
			}

			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if (Y.G.regexList.focusMorph.test(type + Y.DOM.event.triggered)) {
				return;
			}

			if (type.indexOf('.') >= 0) {
				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split('.');
				type = namespaces.shift();
				namespaces.sort();
			}

			ontype = type.indexOf(':') < 0 && 'on' + type;

			// Caller can pass in a Y.DOM.Event object, Object, or just an event type string
			event = event[Y.DOM.expando] ?
				event :
				// new Y.DOM.Event(type, typeof event === 'object' && event);
				new Y.DOM.Event(type, Y.isObject(event) && event);

			// Trigger bitmask: & 1 for native handlers; & 2 for Y.DOM (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join('.');
			event.rnamespace = event.namespace ?
				new RegExp('(^|\\.)' + namespaces.join('\\.(?:.*\\.|)') + '(\\.|$)') :
				null;

			// Clean up the event in case it is being reused
			event.result = undef;

			if (!event.target) {
				event.target = elem;
			}

			/*jshint -W041 */
			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ?
				[event] :
				Y.makeArray(data, [event]);

			// Allow special events to draw outside the lines
			special = Y.DOM.event.special[type] || {};

			if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
				return;
			}

			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if (!onlyHandlers && !special.noBubble && !Y.isWindow(elem)) {

				bubbleType = special.delegateType || type;
				if (!Y.G.regexList.focusMorph.test(bubbleType + type)) {
					cur = cur.parentNode;
				}
				for (null; cur; cur = cur.parentNode) {
					eventPath.push(cur);
					tmp = cur;
				}

				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if (tmp === (elem.ownerDocument || document)) {
					eventPath.push(tmp.defaultView || tmp.parentWindow || window);
				}
			}

			// Fire handlers on the event path
			i = 0;

			while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
				event.type = i > 1 ?
					bubbleType :
					special.bindType || type;

				// Y.DOM handler
				handle = (Y.DOM.data_priv.get(cur, 'events') || {})[event.type] &&
					Y.DOM.data_priv.get(cur, 'handle');

				if (handle) {
					handle.apply(cur, data);
				}

				// Native handler
				handle = ontype && cur[ontype];

				if (handle && handle.apply && Y.DOM.acceptData(cur)) {
					event.result = handle.apply(cur, data);
					if (event.result === false) {
						event.preventDefault();
					}
				}
			}

			event.type = type;

			// If nobody prevented the default action, do it now
			if (!onlyHandlers && !event.isDefaultPrevented()) {

				if ((!special._default || special._default.apply(eventPath.pop(), data) === false) &&
					Y.DOM.acceptData(elem)) {

					// Call a native DOM method on the target with the same name name as the event.
					// Don't do default actions on window, that's where global variables be (#6170)
					if (ontype && Y.isFunction(elem[type]) && !Y.isWindow(elem)) {

						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ontype];

						if (tmp) {
							elem[ontype] = null;
						}

						// Prevent re-triggering of the same event, since we already bubbled it above
						Y.DOM.event.triggered = type;
						elem[type]();
						Y.DOM.event.triggered = undef;

						if (tmp) {
							elem[ontype] = tmp;
						}
					}
				}
			}

			return event.result;
		},

		dispatch: function (event) {
			// Make a writable Y.DOM.Event from the native event object
			event = Y.DOM.event.fix(event);

			var i, j, ret, matched, handleObj,
				handlerQueue,
				args = Y.G.slice.call(arguments),
				handlers = (Y.DOM.data_priv.get(this, 'events') || {})[event.type] || [],
				special = Y.DOM.event.special[event.type] || {};

			// Use the fix-ed Y.DOM.Event rather than the (read-only) native event
			args[0] = event;
			event.delegateTarget = this;

			/** @namespace special.preDispatch */
			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if (special.preDispatch && special.preDispatch.call(this, event) === false) {
				return;
			}

			// Determine handlers
			handlerQueue = Y.DOM.event.handlers.call(this, event, handlers);

			// Run delegates first; they may want to stop propagation beneath us
			i = 0;

			while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
				event.currentTarget = matched.elem;

				j = 0;

				while ((handleObj = matched.handlers[j++]) &&
					!event.isImmediatePropagationStopped()) {
					// Triggered event must either 1) have no namespace, or 2) have namespace(s)
					// a subset or equal to those in the bound event (both can have no namespace).
					if (!event.rnamespace || event.rnamespace.test(handleObj.namespace)) {

						event.handleObj = handleObj;
						event.data = handleObj.data;

						ret = ((Y.DOM.event.special[handleObj.origType] || {}).handle ||
							handleObj.handler).apply(matched.elem, args);

						if (ret !== undef) {
							if ((event.result = ret) === false) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}

			// Call the postDispatch hook for the mapped type
			if (special.postDispatch) {
				special.postDispatch.call(this, event);
			}

			return event.result;
		},

		handlers: function (event, handlers) {
			var i, matches, sel, handleObj,
				handlerQueue = [],
				delegateCount = handlers.delegateCount,
				cur = event.target;

			// Find delegate handlers
			// Black-hole SVG <use> instance trees (#13180)
			// Avoid non-left-click bubbling in Firefox (#3861)
			if (delegateCount && cur.nodeType && (!event.button || event.type !== 'click')) {

				for (null; cur !== this; cur = cur.parentNode || this) {

					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if (cur.disabled !== true || event.type !== 'click') {
						matches = [];

						for (i = 0; i < delegateCount; i++) {
							handleObj = handlers[i];

							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + ' ';

							if (matches[sel] === undef) {
								matches[sel] = handleObj.needsContext ?
									Y.DOM(sel, this).index(cur) >= 0 :
									Y.DOM.find(sel, this, null, [cur]).length;
							}

							if (matches[sel]) {
								matches.push(handleObj);
							}
						}

						if (matches.length) {
							handlerQueue.push({ elem: cur, handlers: matches });
						}
					}
				}
			}

			// Add the remaining (directly-bound) handlers
			if (delegateCount < handlers.length) {
				handlerQueue.push({
					elem: this,
					handlers: handlers.slice(delegateCount)
				});
			}

			return handlerQueue;
		},

		// Includes some event props shared by KeyEvent and MouseEvent
		props: [
			'altKey',
			'bubbles',
			'cancelable',
			'ctrlKey',
			'currentTarget',
			'eventPhase',
			'metaKey',
			'relatedTarget',
			'shiftKey',
			'target',
			'timeStamp',
			'view',
			'which'
		],

		fixHooks: {},

		keyHooks: {
			props: [
				'char',
				'charCode',
				'key',
				'keyCode'
			],

			filter: function(event, original) {
				// Add which for key events
				/*jshint -W041 */
				if (event.which == null) {
					event.which = original.charCode != null ? original.charCode : original.keyCode;
				}

				return event;
			}
		},

		mouseHooks: {
			props: [
				'button',
				'buttons',
				'clientX',
				'clientY',
				'offsetX',
				'offsetY',
				'pageX',
				'pageY',
				'screenX',
				'screenY',
				'toElement'
			],

			filter: function(event, original) {
				var eventDoc, doc, body,
					button = original.button;

				// Y.LOG(event)

				// Calculate pageX/Y if missing and clientX/Y available
				/*jshint -W041 */
				if (event.pageX == null && original.clientX != null) {
					eventDoc = event.target.ownerDocument || document;
					doc = eventDoc.documentElement;
					body = eventDoc.body;

					event.pageX = original.clientX + ((doc && doc.scrollLeft) ||
						(body && body.scrollLeft) || 0) -
						((doc && doc.clientLeft) || (body && body.clientLeft) || 0);

					event.pageY = original.clientY +
						((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
						((doc && doc.clientTop) || (body && body.clientTop) || 0);
				}

				// Add which for click: 1 === left; 2 === middle; 3 === right
				// Note: button is not normalized, so don't use it
				if (!event.which && button !== undef) {
					/* jshint -W016 */
					// event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
					event.which = (button && 1 ? 1 : (button && 2 ? 3 : (button && 4 ? 2 : 0)));
				}

				return event;
			}
		},

		fix: function (event) {
			if (event[Y.DOM.expando]) {
				return event;
			}

			// Create a writable copy of the event object and normalize some properties
			var i, prop, copy,
				type = event.type,
				originalEvent = event,
				fixHook = this.fixHooks[type];

			if (!fixHook) {
				this.fixHooks[type] = fixHook =
					Y.G.regexList.mouseEvent.test(type) ? this.mouseHooks :
						Y.G.regexList.keyEvent.test(type) ? this.keyHooks :
						{};
			}

			copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;

			event = new Y.DOM.Event(originalEvent);

			i = copy.length;

			while (i--) {
				prop = copy[i];
				event[prop] = originalEvent[prop];
			}

			// Support: Cordova 2.5 (WebKit) (#13255)
			// All events should have a target; Cordova deviceready doesn't
			if (!event.target) {
				event.target = document;
			}

			// Support: Safari 6.0+, Chrome<28
			// Target should not be a text node (#504, #13143)
			if (event.target.nodeType === 3) {
				event.target = event.target.parentNode;
			}

			return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
		},

		special: {
			load: {
				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},

			focus: {
				// Fire native event if possible so blur/focus sequence is correct
				trigger: function () {
					if (this !== safeActiveElement() && this.focus) {
						this.focus();
						return false;
					}
				},

				delegateType: 'focusin'
			},

			blur: {
				trigger: function () {
					if (this === safeActiveElement() && this.blur) {
						this.blur();
						return false;
					}
				},

				delegateType: 'focusout'
			},

			click: {
				// For checkbox, fire native event so checked state will be right
				trigger: function () {
					if (this.type === 'checkbox' &&
						this.click && Y.DOM.nodeName(this, 'input')) {
						this.click();
						return false;
					}
				},

				// For cross-browser consistency, don't fire native .click() on links
				_default: function (event) {
					return Y.DOM.nodeName(event.target, 'a');
				}
			},

			beforeunload: {
				postDispatch: function (event) {
					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if (event.result !== undef && event.originalEvent) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		},

		simulate: function (type, elem, event, bubble) {
			// var e = Y.extend(new Y.DOM.Event(type), event, {
			var e = Y.extend(new Y.DOM.Event(), event, {
				type: type,
				isSimulated: true,
				originalEvent: {},
				bubbles: true
			});

			if (bubble) {
				Y.DOM.event.trigger(e, null, elem);
			} else {
				Y.DOM.event.dispatch.call(elem, e);
			}

			if (e.isDefaultPrevented()) {
				event.preventDefault();
			}
		}
	});

	//---

	Y.DOM.removeEvent = function(elem, type, handle) {
		if (elem.removeEventListener) {
			// elem.removeEventListener(type, handle, false);
			Y.DOM.Event.remove(elem, type, handle, false);
		}
	};

	//---

	Y.DOM.proxy = function proxy(callback, context) {
		var result, proxyFn, args;

		// args = (2 in arguments) && Y.G.slice.call(arguments, 2);
		// args = _in(2, arguments) && Y.G.slice.call(arguments, 2);
		args = Y.G.slice.call(arguments, 2);

		if (Y.isFunction(callback)) {

			proxyFn = function () {
				return callback.apply(context, args ? args.concat(Y.G.slice.call(arguments)) : arguments);
			};

			proxyFn.YID = yID(callback);

			proxyFn.guid = callback.guid = callback.guid || proxyFn.guid || Y.DOM.GUID++;

			result = proxyFn;
		} else if (Y.isString(context)) {
			//result = Y.DOM.Proxy(callback[context], callback);

			if (args) {
				args.unshift(callback[context], callback);
				result = Y.DOM.proxy.apply(null, args);
			} else {
				result = Y.DOM.proxy.apply(callback[context], callback);
			}
		} else {
			throw new TypeError('expected function');
		}

		return result;
	};

	Y.DOM.fn.bind = function (types, data, callback) {
		// return this.on(types, data, callback);
		return this.on(types, null, data, callback);
	};

	Y.DOM.fn.bindEvent = function (types, data, callback) {
		// return this.on(types, data, callback);
		return this.on(types, null, data, callback);
	};

	Y.DOM.fn.unbind = function (types, callback) {
		// return this.off(types, callback);
		return this.off(types, null, callback);
	};

	Y.DOM.fn.one = function (types, selector, data, callback) {
		return this.on(types, selector, data, callback, 1);
	};

	Y.DOM.fn.delegate = function (selector, types, data, callback) {
		return this.on(types, selector, data, callback);
	};

	Y.DOM.fn.undelegate = function (selector, types, callback) {
		// (namespace) or (selector, types [, fn])
		return arguments.length === 1 ?
			this.off(selector, '**') :
			this.off(types, selector || '**', callback);
	};

	Y.DOM.fn.live = function (event, callback) {
		Y.DOM(document.body).delegate(this.selector, event, callback);
		return this;
	};

	Y.DOM.fn.die = function (event, callback) {
		Y.DOM(document.body).undelegate(this.selector, event, callback);
		return this;
	};

	Y.DOM.fn.on = function on(types, selector, data, fn, /*INTERNAL*/ one) {
		var origFn, type;

		// Types can be a map of types/handlers
		if (typeof types === 'object') {
			// (types-Object, selector, data)
			if (typeof selector !== 'string') {
				// (types-Object, data)
				data = data || selector;
				selector = undef;
			}

			for (type in types) {
				if (types.hasOwnProperty(type)) {
					this.on(type, selector, data, types[type], one);
				}
			}

			return this;
		}

		/*jshint -W041 */
		if (data == null && fn == null) {
			// (types, fn)
			fn = selector;
			data = selector = undef;
		} else if (fn == null) {
			if (typeof selector === 'string') {
				// (types, selector, fn)
				fn = data;
				data = undef;
			} else {
				// (types, data, fn)
				fn = data;
				data = selector;
				selector = undef;
			}
		}
		if (fn === false) {
			fn = returnFalse;
		} else if (!fn) {
			return this;
		}

		if (one === 1) {
			origFn = fn;
			fn = function(event) {
				// Can use an empty set, since event contains the info
				Y.DOM().off(event);
				return origFn.apply(this, arguments);
			};
			// Use same guid so caller can remove using origFn
			if (origFn.guid) {
				fn.guid = origFn.guid;
			} else {
				origFn.guid = Y.DOM.GUID++;
				fn.guid = origFn.guid;
			}

			// fn.guid = origFn.guid || (origFn.guid = Y.DOM.GUID++);
		}
		return this.each(function() {
			Y.DOM.event.add(this, types, fn, data, selector);
		});
	};

	Y.DOM.fn.on_ = function (event, selector, data, callback, one) {
		var autoRemove, delegator, $this = this;

		if (event && !Y.isString(event)) {
			Y.each(event, function (type, func) {
				$this.on(type, selector, data, func, one);
			});

			return $this;
		}

		if (!Y.isString(selector) && !Y.isFunction(callback) && callback !== false) {
			callback = data;
			data = selector;
			selector = undef;
		}

		if (Y.isFunction(data) || data === false) {
			callback = data;
			data = undef;
		}

		if (callback === false) {
			callback = returnFalse;
		}

		return $this.each(function (_, element) {
			if (one) {
				autoRemove = function (event) {
					Y.DOM.event.remove(element, event.type, callback);
					return callback.apply(this, arguments);
				};
			}

			if (selector) {
				delegator = function (event) {
					var evt,
						match = Y.DOM(event.target).closest(selector, element).get(0);

					if (match && match !== element) {
						evt = Y.extend(createProxy(event), {
							currentTarget: match,
							liveFired: element
						});

						return (autoRemove || callback).apply(match, [evt].concat(Y.G.slice.call(arguments, 1)));
					}
				};
			}

			Y.DOM.event.add(element, event, callback, data, selector, delegator || autoRemove);
		});
	};

	Y.DOM.fn.off = function (types, selector, callback) {
		var handleObj, type;

		if (types && types.preventDefault && types.handleObj) {
			// (event)  dispatched Y.DOM.Event
			handleObj = types.handleObj;

			Y.DOM(types.delegateTarget).off(
				handleObj.namespace ?
					handleObj.origType + '.' + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);

			return this;
		}

		if (typeof types === 'object') {
			// (types-object [, selector])
			for (type in types) {
				if (types.hasOwnProperty(type)) {
					this.off(type, selector, types[type]);
				}
			}

			return this;
		}

		if (selector === false || typeof selector === 'function') {
			// (types [, fn])
			callback = selector;
			selector = undef;
		}

		if (callback === false) {
			callback = returnFalse;
		}

		return this.each(function() {
			Y.DOM.event.remove(this, types, callback, selector);
		});
	};

	Y.DOM.fn.off_ = function (event, selector, callback) {
		var $this = this;

		if (event && !Y.isString(event)) {
			Y.each(event, function (type, func) {
				$this.off(type, selector, func);
			});

			return $this;
		}

		if (!Y.isString(selector) && !Y.isFunction(callback) && callback !== false) {
			callback = selector;
			selector = undef;
		}

		if (callback === false) {
			callback = returnFalse;
		}

		return $this.each(function () {
			Y.DOM.event.remove(this, event, callback, selector);
		});
	};

	Y.DOM.fn.trigger = function (type, data) {
		return this.each(function() {
			Y.DOM.event.trigger(type, data, this);
		});
	};

	Y.DOM.fn.trigger_ = function (event, args) {
		if (Y.isString(event) || Y.isPlainObject(event)) {
			event = Y.DOM.Event(event);
		} else {
			event = compatible(event);
		}

		event._args = args;

		return this.each(function () {
			// items in the collection might not be Node elements
			/*jshint -W052 */
			if (event.type && ~inputEvents.indexOf(event.type)) {
				this[event.type]();
			} else if (Y.hasProperty(this, 'dispatchEvent')) {
				this.dispatchEvent(event);
			} else {
				Y.DOM(this).triggerHandler(event, args);
			}
		});
	};

	Y.DOM.fn.triggerHandler = function (type, data) {
		var element = this[0];

		if (element) {
			return Y.DOM.event.trigger(type, data, element, true);
		}
	};

	// triggers event handlers on current element just as if an event occurred,
	// doesn't trigger an actual event, doesn't bubble
	Y.DOM.fn.triggerHandler_ = function (event, args) {
		var e, result = null;

		this.each(function (i, element) {
			e = createProxy(Y.isString(event) ? Y.DOM.Event(event) : event);
			e._args = args;
			e.target = element;

			Y.each(findHandlers(element, event.type || event), function (i, handler) {
				result = handler.proxy(e);

				if (e.isImmediatePropagationStopped()) {
					return false;
				}
			});
		});

		return result;
	};

	// Shortcut methods for `.bind(event, func)` for each event type
	Y.forEach([
		// 'focusin',
		// 'focusout',
		'load',
		'resize',
		'scroll',
		'unload',
		'click',
		'dblclick',
		'hashchange',
		'mousedown',
		'mouseup',
		'mousemove',
		'mouseover',
		'mouseout',
		'mouseenter',
		'mouseleave',
		'change',
		'select',
		'submit',
		'keydown',
		'keypress',
		'keyup',
		'error',
		'contextmenu',
		'mousewheel',
		'wheel'
	], function (name) {
		Y.DOM.fn[name] = function (data, callback) {
			return arguments.length > 0 ?
				this.on(name, null, data, callback) :
				this.trigger(name);
		};
	});

	Y.DOM.fn.hashchange = function (callback) {
		if (Y.isWindow(this[0])) {
			return arguments.length > 0 ?
				this.bind('hashchange', callback) :
				this.trigger('hashchange', callback);
		}
	};

	Y.DOM.fn.hover = function(over, out) {
		return this.mouseenter(over).mouseleave(out || over);
	};

	Y.forEach(inputEvents, function (name) {
		Y.DOM.fn[name] = function (callback) {
			if (callback) {
				this.bind(name, callback);
			} else {
				this.each(function () {
					try {
						this[name]();
					} catch (err) {
						Y.ERROR(err);
					}
				});
			}

			return this;
		};
	});

	//---

	// Support: Firefox, Chrome, Safari
	// Create 'bubbling' focus and blur events
	if (!Y.DOM.support.focusinBubbles) {
		Y.DOM.each({
			focus: 'focusin',
			blur: 'focusout'
		}, function (orig, fix) {
			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function (event) {
				Y.DOM.event.simulate(fix, event.target, Y.DOM.event.fix(event), true);
			};

			Y.DOM.event.special[fix] = {
				setup: function () {
					var doc = this.ownerDocument || this,
						attaches = Y.DOM.dataPrivative.access(doc, fix);

					if (!attaches) {
						//doc.addEventListener(orig, handler, true);

						YAX.DOM.Event.add(doc, orig, handler, true);
					}

					Y.DOM.dataPrivative.access(doc, fix, (attaches || 0) + 1);
				},

				teardown: function () {
					var doc = this.ownerDocument || this,
						attaches = Y.DOM.dataPrivative.access(doc, fix) - 1;

					if (!attaches) {

						// doc.removeEventListener(orig, handler, true);

						YAX.DOM.Event.remove(doc, orig, handler, true);

						Y.DOM.dataPrivative.remove(doc, fix);

					} else {
						Y.DOM.dataPrivative.access(doc, fix, attaches);
					}
				}
			};
		});
	}

	//---

	// Create mouseenter/leave events using mouseover/out and event-time checks
	// Support: Chrome 15+
	Y.each({
		mouseenter: 'mouseover',
		mouseleave: 'mouseout',
		pointerenter: 'pointerover',
		pointerleave: 'pointerout'
	}, function (orig, fix) {
		Y.DOM.event.special[orig] = {
			delegateType: fix,
			bindType: fix,

			handle: function (event) {
				var ret,
					target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj;

				// For mousenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if (!related || (related !== target && !Y.DOM.contains(target, related))) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply(this, arguments);
					event.type = fix;
				}

				return ret;
			}
		};
	});

	//---

	//---

	// Attach a bunch of functions for handling common AJAX events
	Y.forEach([
		'ajaxStart',
		'ajaxStop',
		'ajaxComplete',
		'ajaxError',
		'ajaxSuccess',
		'ajaxSend'
	], function(name) {
		Y.DOM.fn[name] = function(callback) {
			return this.on(name, callback);
		};
	});

	//---

	/*['remove', 'empty'].forEach(function (method) {
		var origFn = Y.DOM.fn[method];

		Y.DOM.fn[method] = function () {
			var elements = this.find('*');

			if (method === 'remove') {
				elements = elements.add(this);
			}

			elements.forEach(function (element) {
				Y.DOM.event.remove(element);
			});

			return origFn.call(this);
		};
	});*/

	//---

}(window, document));

// FILE: ./Source/Modules/Node/Events.js

//---

/**
 * YAX Ajax [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function (window) {

	//---

	'use strict';

	var jsonpID = 0,
		document = window.document,
		escape = encodeURIComponent,
		allTypes = '*/'.concat('*');

	//---

	// BEGIN OF [Private Functions]

	Y.DOM.AjaxActive = Y.DOM.active = 0;

	// Trigger a custom event and return false if it was cancelled
	function triggerAndReturn(context, event, data) {
		var eventName = Y.DOM.Event(event);

		Y.DOM(context).trigger(eventName, data);

		/** @namespace eventName.defaultPrevented */
		return !eventName.defaultPrevented;
	}

	// Trigger an Ajax "Global" event
	function triggerGlobal(settings, context, event, data) {
		if (settings.global) {
			return triggerAndReturn(context || document, event, data);
		}
	}

	function ajaxStart(settings) {
		if (settings.global && Y.DOM.active++ === 0) {
			triggerGlobal(settings, null, 'ajaxStart');
		}
	}

	function ajaxStop(settings) {
		if (settings.global) {
			if (!Y.isSet(--Y.DOM.active)) {
				triggerGlobal(settings, null, 'ajaxStop');
			}
		}
	}

	// Triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
	function ajaxBeforeSend(xhr, settings) {
		var context = settings.context;

		if (settings.beforeSend.call(context, xhr, settings) === false ||
			triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) ===
			false) {
			return false;
		}

		triggerGlobal(settings, context, 'ajaxSend', [xhr, settings]);
	}

	// Status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
	function ajaxComplete(status, xhr, settings) {
		var context = settings.context;

		settings.complete.call(context, xhr, status);

		triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings]);

		ajaxStop(settings);
	}

	function ajaxSuccess(data, xhr, settings, deferred) {
		var context = settings.context,
			status = 'success';

		settings.success.call(context, data, status, xhr);

		if (deferred) {
			deferred.resolveWith(context, [data, status, xhr]);
		}

		triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data]);

		ajaxComplete(status, xhr, settings);
	}

	// Type: "timeout", "error", "abort", "parsererror"
	/** @namespace deferred.rejectWith */
	function ajaxError(error, type, xhr, settings, deferred) {
		var context = settings.context;

		settings.error.call(context, xhr, type, error);

		if (deferred) {
			deferred.rejectWith(context, [xhr, type, error]);
		}

		triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error]);

		ajaxComplete(type, xhr, settings);
	}

	//---

	function getCookie(key) {
		var result = (
			new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)')
		).exec(document.cookie);

		return result ? result[1] : null;
	}

	function sameOrigin(url) {
		// Url could be relative or scheme relative or absolute
		var sr_origin = '//' + document.location.host,
			origin = document.location.protocol + sr_origin;

		// Allow absolute or scheme relative URLs to same origin
		return (url === origin || url.slice(0, origin.length + 1) === origin + '/') ||
			(url === sr_origin || url.slice(0, sr_origin.length + 1) === sr_origin +
			'/') ||
		// or any other URL that isn't scheme relative or absolute i.e relative.
		!(/^(\/\/|http:|https:).*/.test(url));
	}

	function mimeToDataType(mime) {
		//		if (mime) {
		//			mime = mime.split(';', 2)[0];
		//		}

		if (mime) {
			if (mime === Y.G.regexList.htmlType) {
				return 'html';
			}

			if (mime === Y.G.regexList.jsonTypeReplacement.test(mime)) {
				return 'json';
			}

			if (Y.G.regexList.scriptTypeReplacement.test(mime)) {
				return 'script';
			}

			if (Y.G.regexList.xmlTypeReplacement.test(mime)) {
				return 'xml';
			}

			return 'text';
		}
	}

	function appendQuery(url, query) {
		if (query === '') {
			return url;
		}

		return (url + '&' + query).replace(/[&?]{1,2}/, '?');
	}

	// Serialise payload and append it to the URL for GET requests
	/** @namespace options.traditional */
	function serialiseData(options) {
		if (options.processData && options.data && !Y.isString(options.data)) {
			options.data = Y.DOM.parameters(options.data, options.traditional);
		}

		if (options.data && (!options.type || options.type.toUpperCase() === 'GET')) {
			options.url = appendQuery(options.url, options.data);
			options.data = undefined;
		}
	}

	// Handle optional data/success arguments
	function parseArguments(url, data, success, dataType) {
		var hasData = !Y.isFunction(data);

		return {
			url: url,
			data: hasData ? data : undefined,
			success: !hasData ? data : Y.isFunction(success) ? success : undefined,
			dataType: hasData ? dataType || success : success
		};
	}

	// END OF [Private Functions]

	//---

	Y.DOM.AjaxSettings = {};

	//---

	Y.extend(Y.DOM, {
		AjaxSettings: {
			// Default type of request
			type: 'GET',
			// Callback that is executed before request
			beforeSend: Y.noop,
			// Callback that is executed if the request succeeds
			success: Y.noop,
			// Callback that is executed the the server drops error
			error: Y.noop,
			// Callback that is executed on request complete (both: error and success)
			complete: Y.noop,
			// The context for the callbacks
			context: null,
			// The jsonp
			jsonp: null,
			// The jsonpCallback
			jsonpCallback: null,
			// The mimeType
			mimeType: null,
			// The contentType
			contentType: null,
			// The xhrFields
			xhrFields: null,
			// The username
			username: null,
			// The password
			password: null,
			// Whether to trigger "global" Ajax events
			global: true,
			// Transport
			xhr: function () {
				return new window.XMLHttpRequest({
					mozSystem: true
				});
			},
			// MIME types mapping
			accepts: {
				'*': allTypes,
				script: 'text/javascript, application/javascript, application/x-javascript',
				json: 'application/json, text/json',
				xml: 'application/xml, text/xml',
				html: Y.G.regexList.htmlType,
				text: 'text/plain'
			},
			// Whether the request is to another domain
			crossDomain: false,
			// Default timeout
			timeout: 0,
			// Whether data should be serialized to string
			processData: false,
			// Whether the browser should be allowed to cache GET responses
			cache: true
		},

		/**
		 * @return string {params}
		 */
		parameters: function (object, traditional) {
			var params = [];

			params.add = function (key, value) {
				this.push(escape(key) + '=' + escape(value));
			};

			Y.Util.serialise(params, object, traditional);

			return params.join('&').replace(/%20/g, '+');
		}
	});

	//---

	Y.extend(Y.DOM, {
		getJSON: function () {
			var options = parseArguments.apply(null, arguments);
			options.dataType = 'json';
			return this.Ajax(options);
		},

		getXML: function () {
			var options = parseArguments.apply(null, arguments);
			options.dataType = 'xml';
			return this.Ajax(options);
		},

		getScript: function (url, callback) {
			return this.Get(url, undefined, callback, 'script');
		},

		AjaxJSONP: function (options, deferred) {
			if (!options.hasOwnProperty('type')) {
				return this.Ajax(options);
			}

			//var callbackName = 'jsonp' + (++jsonpID);
			var _callbackName = options.jsonpCallback,
				callbackName = Y.isFunction(_callbackName) ? _callbackName() :
					_callbackName || ('jsonp' + (++jsonpID)),
				script = document.createElement('script'),
				// originalCallback = window[callbackName],
				originalCallback = window[callbackName],
				responseData,
				abort = function (errorType) {
					Y.DOM(script).triggerHandler('error', errorType || 'abort');
				},

				xhr = {
					abort: abort
				},

				abortTimeout;

			if (deferred) {
				deferred.promise(xhr);
			}

			// Y.DOM(script).on('load error', function(e, errorType) {
			Y.DOM(script).on('load error', function (e, errorType) {
				clearTimeout(abortTimeout);

				Y.DOM(script).off('load error');
				Y.DOM(script).remove();

				if (e.type === 'error' || !responseData) {
					ajaxError(null, errorType || 'error', xhr, options, deferred);
				} else {
					ajaxSuccess(responseData[0], xhr, options, deferred);
				}

				// window[callbackName] = function (data) {
				//				window[callbackName] = function (data) {
				//					ajaxSuccess(data, xhr, options);
				//				};

				window[callbackName] = originalCallback;

				if (responseData && Y.isFunction(originalCallback)) {
					originalCallback(responseData[0]);
				}

				originalCallback = responseData = undefined;
			});

			if (ajaxBeforeSend(xhr, options) === false) {
				abort('abort');
				return xhr;
			}

			window[callbackName] = function () {
				responseData = arguments;
			};

			script.onerror = function () {
				abort('error');
			};

			//			script.src = options.url.replace(/\?.+=\?/, '=' + callbackName);
			//			script.src = options.url.replace(/=\?/, '=' + callbackName);
			script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName);

			document.head.appendChild(script);

			if (options.timeout > 0) {
				abortTimeout = setTimeout(function () {
					abort('timeout');
				}, options.timeout);
			}

			return xhr;
		},

		Ajax: function (options) {
			var settings = Y.extend({}, options || {}),
				deferred = Y.G.Deferred && Y.G.Deferred(),
				key,
				dataType,
				hasPlaceholder,
				mime,
				headers,
				setHeader,
				protocol,
				xhr,
				nativeSetHeader,
				abortTimeout,
				name,
				async;

			for (key in this.AjaxSettings) {
				if (this.AjaxSettings.hasOwnProperty(key)) {
					if (settings[key] === undefined) {
						settings[key] = this.AjaxSettings[key];
					}
				}
			}

			ajaxStart(settings);

			if (!settings.crossDomain) {
				settings.crossDomain = /^([\w\-]+:)?\/\/([^\/]+)/.test(settings.url) &&
					RegExp.$2 !== window.location.host;
			}

			if (!settings.url) {
				settings.url = window.location.toString();
			}

			serialiseData(settings);

			dataType = settings.dataType;

			if (settings.cache === false ||
				((!settings || settings.cache !== true) &&
					('script' === dataType || 'jsonp' === dataType))) {
				settings.url = appendQuery(settings.url, '_=' + Date.now());
			}

			hasPlaceholder = /\?.+=\?/.test(settings.url);

			if (dataType === 'jsonp') {
				if (!hasPlaceholder) {
					settings.url = appendQuery(settings.url, settings.jsonp ? (settings.jsonp +
						'=?') : settings.jsonp === false ? '' : 'callback=?');
				}

				return this.AjaxJSONP(settings, deferred);
			}

			//Y.LOG(dataType);

			mime = settings.accepts[dataType];

			headers = {};

			setHeader = function (name, value) {
				// headers[name.toLowerCase()] = [name, value];
				headers[name] = [name, value];
			};

			protocol = /^([\w\-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;

			xhr = settings.xhr();

			nativeSetHeader = xhr.setRequestHeader;

			if (deferred) {
				deferred.promise(xhr);
			}

			if (!settings.crossDomain) {
				setHeader('X-Requested-With', 'XMLHttpRequest');
				//setHeader('Access-Control-Allow-Origin', '*');
				//setHeader('Access-Control-Allow-Origin', allTypes);
				//setHeader('Access-Control-Allow-Credentials', 'True');

			}


			setHeader('Accept', mime || allTypes);

			//setHeader('Access-Control-Allow-Origin', '*');
			// setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
			//setHeader('Access-Control-Allow-Credentials', 'True');


			mime = settings.mimeType || mime;

			if (mime) {
				if (mime.indexOf(',') > -1) {
					mime = mime.split(',', 2)[0];
				}

				if (xhr.overrideMimeType) {
					xhr.overrideMimeType(mime);
				}

				//xhr.overrideMimeType && xhr.overrideMimeType(mime);
			}

			if (settings.contentType || (settings.contentType !== false && settings.data &&
				settings.type.toUpperCase() !== 'GET')) {
				setHeader('Content-Type', settings.contentType ||
					'application/x-www-form-urlencoded; charset=UTF-8');
			}

			if (settings.headers) {
				for (name in settings.headers) {
					if (settings.headers.hasOwnProperty(name)) {
						setHeader(name, settings.headers[name]);
					}
				}
			}

			settings.headers = Y.extend(headers, settings.headers, {});

			xhr.setRequestHeader = setHeader;

			// Y.LOG(mime);

			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					xhr.onreadystatechange = Y.noop;

					clearTimeout(abortTimeout);

					var result, error = false;

					// Y.LOG(xhr);

					if (
						(xhr.status >= 200 && xhr.status < 300) ||
						xhr.status === 304 ||
						(xhr.status === 0 && protocol === 'file:')
					) {
						dataType = dataType || mimeToDataType(xhr.getResponseHeader(
							'content-type'));

						result = xhr.responseText;

						try {
							// http://perfectionkills.com/global-eval-what-are-the-options/
							if (dataType === 'script') {
								Y.DOM.globalEval(result);
							}

							if (dataType === 'xml') {
								result = xhr.responseXML;
							}

							if (dataType === 'json') {
								result = Y.G.regexList.blankReplacement.test(result) ?
									null : 
									Y.parseJSON(result);
							}
						} catch (err) {
							error = err;
							// Y.ERROR(err);
						}

						if (error) {
							//Y.ERROR(error);
							ajaxError(error, 'parsererror', xhr, settings, deferred);
						} else {
							//Y.ERROR(result);
							ajaxSuccess(result, xhr, settings, deferred);
						}
					} else {
						ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr,
							settings, deferred);
					}
				}
			};

			if (ajaxBeforeSend(xhr, settings) === false) {
				xhr.abort();
				ajaxError(null, 'abort', xhr, settings, deferred);
				return xhr;
			}

			if (settings.xhrFields) {
				for (name in settings.xhrFields) {
					if (settings.xhrFields.hasOwnProperty(name)) {
						xhr[name] = settings.xhrFields[name];
					}
				}
			}

			async = settings.hasOwnProperty('async') ? settings.async : true;

			xhr.open(settings.type, settings.url, async, settings.username, settings.password);

			for (name in headers) {
				if (headers.hasOwnProperty(name)) {
					nativeSetHeader.apply(xhr, headers[name]);
				}
			}

			if (settings.timeout > 0) {
				abortTimeout = setTimeout(function () {
					xhr.onreadystatechange = Y.noop;
					xhr.abort();
					ajaxError(null, 'timeout', xhr, settings, deferred);
				}, settings.timeout);
			}

			// Avoid sending Empty string
			if (settings.data) {
				xhr.send(settings.data);
			} else {
				xhr.send(null);
			}

			return xhr;
		},

		Get: function () {
			return this.Ajax(parseArguments.apply(null, arguments));
		},

		Post: function () {
			var options = parseArguments.apply(null, arguments);
			options.type = 'POST';
			return this.Ajax(options);
		}
	});

	Y.extend(Y.DOM, {
		get: Y.DOM.Get,
		post: Y.DOM.Post,
		ajax: Y.DOM.Ajax,
		JSON: Y.DOM.getJSON,
		XML: Y.DOM.getXML,
		Script: Y.DOM.getScript,
		ajaxJSONP: Y.DOM.AjaxJSONP,
		ajaxSettings: Y.DOM.AjaxSettings
	});

	//---

	Y.DOM.Function.load = function (url, data, success) {
		if (!this.length) {
			return this;
		}

		var self = this,
			parts = url.split(/\s/),
			selector,
			options = parseArguments(url, data, success),
			callback = options.success;

		if (parts.length > 1) {
			options.url = parts[0];
			selector = parts[1];
		}

		options.success = function (response) {
			self.html(selector ? 
				Y.DOM('<div>').html(response.replace(Y.G.regexList.scriptReplacement, '')).find(selector) :
				response);

			if (callback) {
				callback.apply(self, arguments);
			}
		};

		Y.DOM.Ajax(options);

		return this;
	};

	//---

	/**
	 * Extend YAX's AJAX beforeSend method by setting an X-CSRFToken on any
	 * 'unsafe' request methods.
	 **/
	Y.extend(Y.DOM.AjaxSettings, {
		beforeSend: function (xhr, settings) {
			if (!(/^(GET|HEAD|OPTIONS|trace)$/.test(settings.type)) && sameOrigin(
				settings.url)) {
				xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
			}
		}
	});

	//---

}(window));

// FILE: ./Source/Modules/Node/Ajax.js

//---

/**
 * YAX Effects [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y */

(function (window, document, undef) {

	//---

	'use strict';

	var prefix = '',
		eventPrefix = undef,
		vendors = {
			Webkit: 'webkit',
			Moz: 'Moz',
			O: 'o',
			ms: 'MS'
		},
		testEl = document.createElement('div'),
		supportedTransforms =
		/^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
		transform,
		transitionProperty,
		transitionDuration,
		transitionTiming,
		transitionDelay,
		animationName,
		animationDuration,
		animationTiming,
		animationDelay,
		cssReset = {};

	//--

	function dasherize(str) {
		return str.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase();
	}

	function normalizeEvent(name) {
		return eventPrefix ? eventPrefix + name : name.toLowerCase();
	}

	Y.each(vendors, function (vendor, event) {
		if (testEl.style[vendor + 'TransitionProperty'] !== undef) {
			prefix = '-' + vendor.toLowerCase() + '-';
			eventPrefix = event;
			return false;
		}
	});

	transform = prefix + 'transform';

	cssReset[transitionProperty = prefix + 'transition-property'] =
		cssReset[transitionDuration = prefix + 'transition-duration'] =
		cssReset[transitionDelay = prefix + 'transition-delay'] =
		cssReset[transitionTiming = prefix + 'transition-timing-function'] =
		cssReset[animationName = prefix + 'animation-name'] =
		cssReset[animationDuration = prefix + 'animation-duration'] =
		cssReset[animationDelay = prefix + 'animation-delay'] =
		cssReset[animationTiming = prefix + 'animation-timing-function'] = '';

	/** @namespace testEl.style.transitionProperty */
	Y.DOM.fx = {
		off: (eventPrefix === undef && testEl.style.transitionProperty === undef),
		speeds: {
			_default: 400,
			fast: 200,
			slow: 600
		},
		cssPrefix: prefix,
		transitionEnd: normalizeEvent('TransitionEnd'),
		animationEnd: normalizeEvent('AnimationEnd')
	};

	Y.DOM.Function.animate = function (properties, duration, ease, callback,
		delay) {
		if (Y.isFunction(duration)) {
			callback = duration;
			ease = undef;
			duration = undef;
		}

		if (Y.isFunction(ease)) {
			callback = ease;
			ease = undef;
		}

		if (Y.isPlainObject(duration)) {
			/** @namespace duration.easing */
			ease = duration.easing;
			callback = duration.complete;
			delay = duration.delay;
			duration = duration.duration;
		}

		if (duration) {
			duration = (typeof duration === 'number' ? duration :
				(Y.DOM.fx.speeds[duration] || Y.DOM.fx.speeds._default)) / 1000;
		}

		if (delay) {
			delay = parseFloat(delay) / 1000;
		}

		return this.anim(properties, duration, ease, callback, delay);
	};

	Y.DOM.Function.anim = function (properties, duration, ease, callback, delay) {
		var key, cssValues = {},
			cssProperties, transforms = '',
			that = this,
			wrappedCallback, endEvent = Y.DOM.fx.transitionEnd,
			fired = false;

		if (duration === undef) {
			duration = Y.DOM.fx.speeds._default / 1000;
		}

		if (delay === undef) {
			delay = 0;
		}

		if (Y.DOM.fx.off) {
			duration = 0;
		}

		if (typeof properties === 'string') {
			// keyframe animation
			cssValues[animationName] = properties;
			cssValues[animationDuration] = duration + 's';
			cssValues[animationDelay] = delay + 's';
			cssValues[animationTiming] = (ease || 'linear');
			endEvent = Y.DOM.fx.animationEnd;
		} else {
			cssProperties = [];
			// CSS transitions
			for (key in properties) {
				if (properties.hasOwnProperty(key)) {
					if (supportedTransforms.test(key)) {
						transforms += key + '(' + properties[key] + ') ';
					} else {
						cssValues[key] = properties[key];
						cssProperties.push(dasherize(key));
					}
				}
			}

			if (transforms) {
				cssValues[transform] = transforms;
				cssProperties.push(transform);
			}

			if (duration > 0 && typeof properties === 'object') {
				cssValues[transitionProperty] = cssProperties.join(', ');
				cssValues[transitionDuration] = duration + 's';
				cssValues[transitionDelay] = delay + 's';
				cssValues[transitionTiming] = (ease || 'linear');
			}
		}

		wrappedCallback = function (event) {
			if (!Y.isUndefined(event)) {
				// makes sure the event didn't bubble from 'below'
				if (event.target !== event.currentTarget) {
					return;
				}

				Y.DOM(event.target).unbind(endEvent, wrappedCallback);
			} else {
				// triggered by setTimeout
				Y.DOM(this).unbind(endEvent, wrappedCallback);
			}

			fired = true;

			Y.DOM(this).css(cssReset);

			if (callback) {
				callback.call(this);
			}

			// callback && callback.call(this);
		};

		if (duration > 0) {
			this.bind(endEvent, wrappedCallback);
			// transitionEnd is not always firing on older Android phones
			// so make sure it gets fired
			setTimeout(function () {

				if (fired) {
					return;
				}

				wrappedCallback.call(that);

			}, (duration * 1000) + 25);
		}


		// Trigger page reflow so new elements can animate
		if (this.size()) {
			/*jshint -W030 */
			this.get(0).clientLeft;
		}

		// this.size() && this.get(0).clientLeft;

		this.css(cssValues);

		if (duration <= 0) {
			setTimeout(function () {
				that.each(function () {
					wrappedCallback.call(this);
				});
			}, 0);
		}

		return this;
	};

	testEl = null;

	//---

	Y.extend(Y.DOM, {
		queue: function (elem, type, data) {
			var queue;

			if (elem) {
				type = (type || 'fx') + 'queue';
				queue = Y.DOM.dataPrivative.get(elem, type);

				// Speed up dequeue by getting out quickly if this is just a lookup
				if (data) {
					if (!queue || Y.isArray(data)) {
						queue = Y.DOM.dataPrivative.access(elem, type, Y.DOM.makeArray(data));
					} else {
						queue.push(data);
					}
				}
				return queue || [];
			}
		},

		dequeue: function (elem, type) {
			type = type || 'fx';

			var queue = Y.DOM.queue(elem, type),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = Y.DOM._queueHooks(elem, type),
				next = function () {
					Y.DOM.dequeue(elem, type);
				};

			// If the fx queue is dequeued, always remove the progress sentinel
			if (fn === 'inprogress') {
				fn = queue.shift();
				startLength--;
			}

			if (fn) {

				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if (type === 'fx') {
					queue.unshift('inprogress');
				}

				// clear up the last queue stop function
				delete hooks.stop;
				fn.call(elem, next, hooks);
			}

			if (!startLength && hooks) {
				hooks.empty.fire();
			}
		},

		// not intended for public consumption - generates a queueHooks object, or returns the current one
		_queueHooks: function (elem, type) {
			var key = type + 'queueHooks';
			return Y.DOM.dataPrivative.get(elem, key) || Y.DOM.dataPrivative.access(
				elem, key, {
					empty: Y.G.Callbacks('once memory').add(function () {
						Y.DOM.dataPrivative.remove(elem, [type + 'queue', key]);
					})
				});
		}
	});

	//---

	Y.extend(Y.DOM.Function, {
		queue: function (type, data) {
			var setter = 2;

			if (typeof type !== 'string') {
				data = type;
				type = 'fx';
				setter--;
			}

			if (arguments.length < setter) {
				return Y.DOM.queue(this[0], type);
			}

			return data === undef ?
				this :
				this.each(function () {
					var queue = Y.DOM.queue(this, type, data);

					// ensure a hooks for this queue
					Y.DOM._queueHooks(this, type);

					if (type === 'fx' && queue[0] !== 'inprogress') {
						Y.DOM.dequeue(this, type);
					}
				});
		},
		dequeue: function (type) {
			return this.each(function () {
				Y.DOM.dequeue(this, type);
			});
		},
		// Based off of the plugin by Clint Helfers, with permission.
		// http://blindsignals.com/index.php/2009/07/jquery-delay/
		delay: function (time, type) {
			time = Y.DOM.fx ? Y.DOM.fx.speeds[time] || time : time;
			type = type || 'fx';

			return this.queue(type, function (next, hooks) {
				var timeout = setTimeout(next, time);
				hooks.stop = function () {
					clearTimeout(timeout);
				};
			});
		},
		clearQueue: function (type) {
			return this.queue(type || 'fx', []);
		},
		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function (type, obj) {
			var tmp,
				count = 1,
				defer = Y.G.Deferred(),
				elements = this,
				i = this.length,
				resolve;

			resolve = function () {
				var tmp1 = --count;

				// if (!(--count)) {
				if (!tmp1) {
					/** @namespace defer.resolveWith */
					defer.resolveWith(elements, [elements]);
				}
			};

			if (typeof type !== 'string') {
				obj = type;
				type = undef;
			}

			type = type || 'fx';

			while (i--) {
				tmp = Y.DOM.dataPrivative.get(elements[i], type + 'queueHooks');

				if (tmp && tmp.empty) {
					count++;
					tmp.empty.add(resolve);
				}
			}

			resolve();

			return defer.promise(obj);
		}
	});

	//---

	Y.DOM.Function.stopTranAnim = function (jumpToEnd, cancelCallback) {
		var props;
		var style;
		// var cssValues = {};
		var x;

		props = this.css(prefix + 'transition-property').split(', ');

		if (!props.length) {
			return this;
		}

		if (!jumpToEnd) {
			style = Y.DOM.getDocStyles(this.get(0));

			for (x = 0; x < props.length; x++) {
				this.css(props[x], style.getPropertyValue(props[x]));
			}
		}

		if (cancelCallback) {
			this.unbind(Y.DOM.fx.transitionEnd).css(cssReset);
		} else {
			this.trigger(Y.DOM.fx.transitionEnd);
		}

		return this;
	};

	//---

}(window, document));

// FILE: ./Source/Modules/Node/Fx.js

//---

/**
 * YAX Effect Methods [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y */

(function (undef) {

	//---

	'use strict';

	var origShow = Y.DOM.Function.show,
		origHide = Y.DOM.Function.hide,
		origToggle = Y.DOM.Function.toggle,
		rrun = /queueHooks$/;

	function anim(el, speed, opacity, scale, callback) {
		if (typeof speed === 'function' && !callback) {
			callback = speed;
			speed = undef;
		}

		var props = {
			opacity: opacity
		};

		if (scale) {
			props.scale = scale;
			el.css(Y.DOM.fx.cssPrefix + 'transform-origin', '0 0');
		}

		return el.animate(props, speed, null, callback);
	}

	function hide(el, speed, scale, callback) {
		return anim(el, speed, 0, scale, function () {
			origHide.call(Y.DOM(this));

			if (callback) {
				callback.call(this);
			}

			// callback && callback.call(this);
		});
	}

	Y.DOM.Function.show = function (speed, callback) {
		origShow.call(this);

		if (speed === undef) {
			speed = 0;
		} else {
			this.css('opacity', 0);
		}

		return anim(this, speed, 1, '1,1', callback);
	};

	Y.DOM.Function.hide = function (speed, callback) {
		if (speed === undef) {
			return origHide.call(this);
		}

		return hide(this, speed, '0,0', callback);
	};

	Y.DOM.Function.toggle = function (speed, callback) {
		if (speed === undef || typeof speed === 'boolean') {
			return origToggle.call(this, speed);
		}

		return this.each(function () {
			var el = Y.DOM(this);
			el[el.css('display') === 'none' ? 'show' : 'hide'](speed, callback);
		});
	};

	Y.DOM.Function.fadeTo = function (speed, opacity, callback) {
		return anim(this, speed, opacity, null, callback);
	};

	Y.DOM.Function.fadeIn = function (speed, callback) {
		var target = this.css('opacity');

		if (target > 0) {
			this.css('opacity', 0);
		} else {
			target = 1;
		}

		return origShow.call(this).fadeTo(speed, target, callback);
	};

	Y.DOM.Function.fadeOut = function (speed, callback) {
		return hide(this, speed, null, callback);
	};

	Y.DOM.Function.fadeToggle = function (speed, callback) {
		return this.each(function () {
			var el = Y.DOM(this);
			el[(el.css('opacity') === 0 || el.css('display') === 'none') ? 'fadeIn' : 'fadeOut'](speed, callback);
		});
	};

	Y.DOM.Function.stop = function (type, clearQueue, gotoEnd) {
		var stopQueue = function (hooks) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop(gotoEnd);
		};

		if (typeof type !== 'string') {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undef;
		}

		if (clearQueue && type !== false) {
			this.queue(type || 'fx', []);
		}

		return this.each(function () {
			var dequeue = true,
				index = type !== null && type + 'queueHooks',
				timers = Y.DOM.Timers,
				data = Y.DOM.dataPrivative.get(this);

			if (index) {
				if (data[index] && data[index].stop) {
					stopQueue(data[index]);
				}
			} else {
				for (index in data) {
					if (data.hasOwnProperty(index)) {
						if (data[index] && data[index].stop && rrun.test(index)) {
							stopQueue(data[index]);
						}
					}
				}
			}

			for (index = timers.length; index--; index) {
				/** @namespace timers[index].elem */
				if (timers[index].elem === this && (type === null || timers[index].queue === type)) {
					timers[index].anim.stop(gotoEnd);
					dequeue = false;
					timers.splice(index, 1);
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if (dequeue || !gotoEnd) {
				Y.DOM.dequeue(this, type);
			}
		});
	};

	//---

}());

// FILE: ./Source/Modules/Node/FxMethods.js

//---

/**
 * YAX Form [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y */

(function () {

	//---

	'use strict';

	Y.DOM.Function.serialiseArray = function () {
		var result = [], el, type;

		Y.DOM([].slice.call(this.get(0).elements)).each(function () {
			el = Y.DOM(this);

			type = el.attr('type');

			if (this.nodeName.toLowerCase() !== 'fieldset' &&
				!this.disabled && type !== 'submit' && type !== 'reset' &&
				type !== 'button' && ((type !== 'radio' && type !== 'checkbox') || this.checked)) {
				result.push({
					name: el.attr('name'),
					value: el.val()
				});
			}
		});

		return result;
	};

	Y.DOM.Function.serialise = function () {
		var result = [];

		this.serialiseArray().forEach(function (elm) {
			result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value));
		});

		return result.join('&');
	};

	Y.DOM.Function.submit = function (callback) {
		if (callback) {
			this.bind('submit', callback);
		} else if (this.length) {
			var event = Y.DOM.Event('submit');

			this.eq(0).trigger(event);

			if (!event.defaultPrevented) {
				this.get(0).submit();
			}
		}

		return this;
	};

	//---

}());

// FILE: ./Source/Modules/Node/Form.js

//---

/**
 * YAX Extra Stuff [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y, transitionProperty, transitionDuration, transitionTiming*/

(function () {

	//---

	'use strict';

	Y.DOM.extend({
		timer: {
			GUID: 1,

			global: {},

			regex: /^([0-9]+)\s*(.*s)?$/,

			powers: {
				// Yeah this is major overkill...
				'ms': 1,
				'cs': 10,
				'ds': 100,
				's': 1000,
				'das': 10000,
				'hs': 100000,
				'ks': 1000000
			},

			timeParse: function (value) {
				var num, mult, result;

				if (value === undefined || value === null) {
					return null;
				}

				result = this.regex.exec(Y.trim(value.toString()));

				if (result[2]) {
					num = parseInt(result[1], 10);
					mult = this.powers[result[2]] || 1;
					return num * mult;
				}

				return value;
			},

			add: function (element, interval, label, callback, times, belay) {
				var counter = 0,
					handler;

				if (Y.isFunction(label)) {
					if (!times) {
						times = callback;
					}
					callback = label;
					label = interval;
				}

				interval = Y.DOM.timer.timeParse(interval);

				if (typeof interval !== 'number' ||
					isNaN(interval) ||
					interval <= 0) {
					return;
				}
				if (times && times.constructor !== Number) {
					belay = !!times;
					times = 0;
				}

				times = times || 0;
				belay = belay || false;

				if (!element.$timers) {
					element.$timers = {};
				}

				if (!element.$timers[label]) {
					element.$timers[label] = {};
				}

				callback.$timerID = callback.$timerID || this.GUID++;

				handler = function () {
					if (belay && handler.inProgress) {
						return;
					}
					handler.inProgress = true;
					if ((++counter > times && times !== 0) ||
						callback.call(element, counter) === false) {
						Y.DOM.timer.remove(element, label, callback);
					}
					handler.inProgress = false;
				};

				handler.$timerID = callback.$timerID;

				if (!element.$timers[label][callback.$timerID]) {
					element.$timers[label][callback.$timerID] = window.setInterval(handler,
						interval);
				}

				if (!this.global[label]) {
					this.global[label] = [];
				}
				this.global[label].push(element);

			},

			remove: function (element, label, callback) {
				var timers = element.$timers,
					ret, lab, _fn;

				if (timers) {

					if (!label) {
						for (lab in timers) {
							if (timers.hasOwnProperty(lab)) {
								this.remove(element, lab, callback);
							}
						}
					} else if (timers[label]) {
						if (callback) {
							if (callback.$timerID) {
								window.clearInterval(timers[label][callback.$timerID]);
								delete timers[label][callback.$timerID];
							}
						} else {
							for (_fn in timers[label]) {
								if (timers[label].hasOwnProperty(_fn)) {
									window.clearInterval(timers[label][_fn]);
									delete timers[label][_fn];
								}
							}
						}

						for (ret in timers[label]) {
							if (timers[label].hasOwnProperty(ret)) {
								break;
							}
						}
						if (!ret) {
							/*jshint unused: true */
							// ret = null;
							delete timers[label];
						}
					}

					for (ret in timers) {
						if (timers.hasOwnProperty(ret)) {
							//if (Y.hasOwn.call(timers, ret)) {
							break;
						}
					}

					if (!ret) {
						element.$timers = null;
					}
				}
			}
		}
	});

	// YAX Timers
	Y.DOM.Function.extend({
		everyTime: function (interval, label, callback, times, belay) {
			return this.each(function () {
				Y.DOM.timer.add(this, interval, label, callback, times, belay);
			});
		},
		
		oneTime: function (interval, label, callback) {
			return this.each(function () {
				Y.DOM.timer.add(this, interval, label, callback, 1);
			});
		},
		
		stopTime: function (label, callback) {
			return this.each(function () {
				Y.DOM.timer.remove(this, label, callback);
			});
		}
	});

	//---

	Y.extend(Y.DOM.Function, {
		cycleNext: function () {
			if (this.next().length > 0) {
				return this.next();
			}

			return this.siblings().first();
		},

		cyclePrev: function () {
			if (this.prev().length > 0) {
				return this.prev();
			}

			return this.siblings().last();
		}
	});

	//---

	Y.extend(Y.DOM.Function, {
		role: function () {
			var args = Y.G.slice.call(arguments);
			var data;

			if (args[0] === undefined || args[0] === null) {
				data = this.attr('role');
			} else {
				data = this.attr('role', args[0]);
			}

			return data;
		}
	});

	//---

}());

// FILE: ./Source/Modules/Node/Extra.js

//---

/**
 * YAX Compatibilities [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*jshint node: true */
/*global Y, YAX */

(function () {

	//---

	'use strict';

	// Map over Yax.DOM in case of overwrite
	var _YaxDOM = window.Y.DOM;

	// Map over the $ in case of overwrite
	var _$ = window.$;

	_YaxDOM.noConflict = function (deep) {
		if (window.$ === Y.DOM) {
			window.$ = _$;
		}

		if (deep && window.Y.DOM === Y.DOM) {
			window.Y.DOM = _YaxDOM;
		}

		return Y.DOM;
	};

	//---

	// Y.G.Compatibility = true;

	// Y.DOM._temp = {};

	Y.DOM.camelCase = Y.camelise;
	Y.DOM.isReady = true;
	Y.DOM.isArray = Y.isArray;
	Y.DOM.isFunction = Y.isFunction;
	Y.DOM.isWindow = Y.isWindow;
	Y.DOM.trim = Y.trim;
	Y.DOM.type = Y.type;
	Y.DOM.isNumeric = Y.isNumeric;
	Y.DOM.isEmptyObject = Y.isObjectEmpty;
	Y.DOM.noop = Y.noop;
	Y.DOM.grep = Y.grep;
	Y.DOM.merge = Y.merge;

	Y.DOM.when = Y.When;

	Y.DOM.Deferred = Y.G.Deferred;
	Y.DOM.Callbacks = Y.G.Callbacks;

	Y.DOM.cssHooks = Y.DOM.CSS_Hooks;
	Y.DOM.cssNumber = Y.DOM.CSS_Number;
	Y.DOM.cssProps = Y.DOM.CSS_Properities;

	// The deferred used on DOM ready
	var readyList = null;

	Y.DOM.Function.ready = function (callback) {
		// Add the callback
		Y.DOM.ready.promise().done(callback);
		return this;
	};

	Y.DOM.extend({
		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,

		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,

		// Hold (or release) the ready event
		holdReady: function (hold) {
			if (hold) {
				Y.DOM.readyWait++;
			} else {
				Y.DOM.ready(true);
			}
		},

		// Handle when the DOM is ready
		ready: function (wait) {
			var tmp1;
			var tmp2;

			tmp1 = (wait === true ? --Y.DOM.readyWait : Y.DOM.isReady);

			// Abort if there are pending holds or we're already ready
			if (tmp1) {
				return;
			}

			// Remember that the DOM is ready
			Y.DOM.isReady = true;

			tmp2 = (wait !== true && --Y.DOM.readyWait > 0);

			if (tmp2) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith(document, [Y.DOM]);

			// Trigger any bound ready events
			if (Y.DOM.Function.triggerHandler) {
				Y.DOM(document).triggerHandler('ready');
				Y.DOM(document).off('ready');
			}
		}
	});

	/**
	 * The ready event handler and self cleanup method
	 */
	function completed() {
		document.removeEventListener('DOMContentLoaded', completed, false);
		window.removeEventListener('load', completed, false);
		Y.DOM.ready();
	}

	Y.DOM.ready.promise = function (obj) {
		if (!readyList) {
			readyList = Y.DOM.Deferred();

			// Catch cases where $(document).ready() is called after the browser event has already occurred.
			// we once tried to use readyState 'interactive' here, but it caused issues like the one
			// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
			if (document.readyState === 'complete') {
				// Handle it asynchronously to allow scripts the opportunity to delay ready
				setTimeout(Y.DOM.ready);
			} else {
				// Use the handy event callback
				document.addEventListener('DOMContentLoaded', completed, false);
				// A fallback to window.onload, that will always work
				window.addEventListener('load', completed, false);
			}
		}

		return readyList.promise(obj);
	};

	// Kick off the DOM ready check even if the user does not
	Y.DOM.ready.promise();

	//---

	window.cordova = document.URL.indexOf('http://') === -1 &&
		document.URL.indexOf('https://') === -1;

	if (window.cordova === false) {
		Y.DOM(function () {
			Y.DOM(document).trigger('deviceready');
		});
	}

	//---

}());

// FILE: ./Source/Support/Compatibility.js

//---


/**
 * YAX IE10+ Support [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*jshint node: true */
/*global Y, YAX */

(function () {

	//---

	'use strict';

	// __proto__ doesn't exist on IE < 11, so redefine
	// the Y.DOM.YAXDOM.Y function to use object extension instead
	if (!('__proto__' in {})) {
		Y.extend(Y.DOM, {
			Y: function(dom, selector) {
				dom = dom || [];

				Y.extend(dom, Y.DOM.Function);

				dom.selector = selector || '';

				dom.__Y = true;

				return dom;
			},

			// this is a kludge but works
			isY: function(object) {
				return Y.type(object) === 'array' && '__Y' in object;
			}
		});
	}

	//---

}());

// FILE: ./Source/Support/IE.js

//---


