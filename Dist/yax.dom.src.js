
/**
 * YAX Core | UserAgent
 *
 * Cross browser detector implementation using YAX's API [CORE]
 *
 * @version     0.15
 * @depends:    Core, Global, Utility, Class, Tools
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function () {

	'use strict';

	var retina, matches, msPointer, pointer,
		_ie = Y.Window.hasOwnProperty('ActiveX'),
		ie3d = _ie && (Y.Document.documentElement.style.hasOwnProperty('transition')),
		webkit3d = (Y.Window.hasOwnProperty('WebKitCSSMatrix')) && (new Y.Window.WebKitCSSMatrix().hasOwnProperty('m11')),
		gecko3d = Y.Document.documentElement.style.hasOwnProperty('MozPerspective'),
		opera3d = Y.Document.documentElement.style.hasOwnProperty('OTransition');

	retina = (Y.HasOwnProperty.call(Y.Window, 'devicePixelRatio') && Y.CallProperty(Y.Window, 'devicePixelRatio') > 1);

	if (!retina && Y.HasOwnProperty.call(Y.Window, 'matchMedia')) {
		matches = Y.CallProperty(Y.Window, 'matchMedia');
		retina = (Y.Lang.isSet(matches) && Y.CallProperty(matches, 'matches'));
	}

	msPointer = (Y.HasOwnProperty.call(navigator, 'msPointerEnabled') &&
		Y.HasOwnProperty.call(navigator, 'msMaxTouchPoints') &&
		!Y.HasOwnProperty.call(Y.Window, 'PointerEvent'));

	pointer = (Y.HasOwnProperty.call(Y.Window, 'PointerEvent') &&
		Y.HasOwnProperty.call(navigator, 'pointerEnabled') &&
		!Y.HasOwnProperty.call(navigator, 'maxTouchPoints')) || msPointer;

	//---

	Y.UA = Y.Class.Extend({
		CLASS_NAME: 'UA',

		initialise: function () {
			this.UserAgent = Y.Window.navigator.userAgent;
			this.OS = {};
			this.Browser = {};
			this.Features = {};
			this.Type = {};

			this.detect();
		},

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
		testInput: function (type) {
			var temp = Y.Document.createElement('input');

			temp.setAttribute('type', type);

			return temp.type !== 'text';
		},

		detect: function () {
			var testInput = this.testInput,
				OS = this.OS,
				Browser = this.Browser,
				ua = this.UserAgent,
				features = this.Features,
				type = this.Type,
				webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
				gecko = ua.match(/Gecko[\/]{0,1}([\d.]+)/),
				android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
				ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
				ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
				iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
				webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
				touchpad = webos && ua.match(/TouchPad/),
				kindle = ua.match(/Kindle\/([\d.]+)/),
				silk = ua.match(/Silk\/([\d._]+)/),
				blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
				bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
				rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
				playbook = ua.match(/PlayBook/),
				chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
				firefox = ua.match(/Firefox\/([\d.]+)/),
				ie = ua.match(/MSIE ([\d.]+)/),
				safari = webkit && ua.match(/Mobile\//) && !chrome,
				webview = ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/) && !chrome,
				ie = ua.match(/MSIE\s([\d.]+)/),
				osNames = [
					'Linux',
					'Windows',
					'MacOS',
					'UNIX',
					'Android',
					'iOS',
					'Unknown'
				];



			if (Y.Lang.isSet(webkit)) {
				Browser.Webkit = true;
				Browser.Version = webkit[1];
			}

			if (Y.Lang.isSet(gecko)) {
				Browser.Gecko = true;
				Browser.Version = gecko[1];
			}

			if (android) {
				OS.Android = true;
				OS.Version = android[2];
			}

			if (iphone && !ipod) {
				OS.iOS = OS.iPhone = true;
				OS.Version = iphone[2].replace(/_/g, '.');
			}

			if (ipad) {
				OS.iOS = OS.iPad = true;
				OS.Version = ipad[2].replace(/_/g, '.');
			}

			if (ipod) {
				OS.iOS = OS.iPod = true;
				OS.Version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
			}

			if (webos) {
				OS.webOS = true;
				OS.Version = webos[2];
			}

			if (touchpad) {
				OS.Touchpad = true;
			}

			if (blackberry) {
				OS.Blackberry = true;
				OS.Version = blackberry[2];
			}

			if (bb10) {
				OS.BB10 = true;
				OS.Version = bb10[2];
			}

			if (rimtabletos) {
				OS.Rimtabletos = true;
				OS.Version = rimtabletos[2];
			}

			if (playbook) {
				Browser.Playbook = true;
			}

			if (kindle) {
				OS.Kindle = true;
				OS.Version = kindle[1];
			}

			if (silk) {
				Browser.Silk = true;
				Browser.Version = silk[1];
			}

			if (!silk && OS.Android && ua.match(/Kindle Fire/)) {
				Browser.Silk = true;
			}

			if (chrome) {
				Browser.Chrome = true;
				Browser.Name = 'Chrome';
				Browser.Version = chrome[1];
			}

			if (firefox) {
				Browser.Firefox = true;
				Browser.Name = 'Firefox';
				Browser.Version = firefox[1];
			}

			if (ie) {
				Browser.IE = true;
				Browser.Name = 'Microsoft Internet Explorer';
				Browser.Version = ie[1];
			}

			if (safari && (ua.match(/Safari/) || Y.Lang.isSet(OS.iOS))) {
				Browser.Safari = true;
				Browser.Name = 'Apple Safari';
			}

			if (webview) {
				Browser.WebView = true;
			}

			// OS.Tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) || (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)));
			// OS.Phone = !!(!OS.Tablet && !OS.iPod && (android || iphone || webos || blackberry || bb10 || (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) || (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))));
			// OS.Desktop = !!Browser.IE || Browser.Firefox || Browser.Safari || Browser.Chrome;
			// OS.Platform = navigator.platform;

			Browser.Language = navigator.language;
			Browser.Vendor = Y.CallProperty(navigator, 'vendor');

			Y.Extend(OS, {
				Name: navigator.appVersion.indexOf('Linux') !== -1 ? osNames[0] : osNames[6] ||
					navigator.appVersion.indexOf('Mac') !== -1 ? osNames[2] : osNames[6] ||
					navigator.appVersion.indexOf('X11') !== -1 ? osNames[3] : osNames[6] ||
					navigator.appVersion.indexOf('Win') !== -1 ? osNames[1] : osNames[6]
				// Linux: Y.Lang.isSet(navigator.platform.match(/Linux/)),
				// Windows: Y.Lang.isSet(navigator.platform.match(/Windows/)),
				// Android: Y.Lang.isSet(navigator.platform.match(/Android/)),
				// iOS: Y.Lang.isSet(navigator.platform.match(/iOS/)),
				// Architcture: navigator.platform.split(' ')[1]
			});

			//

			/** @namespace Y.Window.YAX_DISABLE_3D */
			Y.Extend(features, {
				// Elements
				Audio: Y.Lang.isSet(document.createElement('audio').canPlayType),
				Canvas: Y.Lang.isSet(document.createElement('canvas').getContext),
				Command: document.createElement('command').hasOwnProperty('type'),
				Time: document.createElement('time').hasOwnProperty('valueAsDate'),
				Video: Y.Lang.isSet(document.createElement('video').canPlayType),

				// Features and Attributes
				Offline: navigator.hasOwnProperty('onLine') && navigator.onLine,
				ApplicationCache: Y.Lang.isSet(Y.CallProperty(window, 'applicationCache')),
				ContentEditable: document.createElement('span').hasOwnProperty('isContentEditable'),
				DragDrop: document.createElement('span').hasOwnProperty('draggable'),
				Geolocation: Y.Lang.isSet(navigator.geolocation),
				History: (Y.Lang.isSet(window.history) && Y.Lang.isSet(window.history.pushState)),
				WebSockets: Y.Lang.isSet(window.WebSocket),
				WebWorkers: Y.Lang.isSet(window.Worker),
				Retina: retina,
				Pointer: Y.Lang.isUndefined(pointer) ? false : pointer,
				MicrosoftPointer: Y.Lang.isUndefined(msPointer) ? false : msPointer,

				// Forms
				Autofocus: document.createElement('input').hasOwnProperty('autofocus'),
				InputPlaceholder: document.createElement('input').hasOwnProperty('placeholder'),
				TextareaPlaceholder: document.createElement('textarea').hasOwnProperty('placeholder'),
				InputTypeEmail: testInput('email'),
				InputTypeNumber: testInput('number'),
				InputTypeSearch: testInput('search'),
				InputTypeTel: testInput('tel'),
				InputTypeUrl: testInput('url'),

				// Storage
				IndexDB: Y.Lang.isSet(Y.CallProperty(window, 'indexedDB')),
				LocalStorage: (window.window.hasOwnProperty('localStorage') && window.localStorage !== null),
				WebSQL: Y.Lang.isSet(window.openDatabase),

				// Touch and orientation capabilities.
				Orientation: window.window.hasOwnProperty('orientation'),
				Touch: document.hasOwnProperty('ontouchend'),
				ScrollTop: ((window.pageXOffset) || (document.documentElement.hasOwnProperty('scrollTop'))) && (!OS.webOS),

				// Propietary features
				// Standalone: ((window.navigator.hasOwnProperty('standalone')) && (window.navigator.standalone))
				Standalone: Y.Lang.isSet(Y.CallProperty(navigator, 'standalone')),

				Any3D: !Y.Window.YAX_DISABLE_3D && (ie3d || webkit3d || gecko3d || opera3d),

				Cookies: navigator.cookieEnabled

			});

			// Return (boolean) of likely client device classifications.
			Y.Extend(type, {
				Mobile: (screen.width < 768),
				Tablet: (screen.width >= 768 && features.Orientation),
				Desktop: (screen.width >= 800 && !features.Orientation)
			});
		}
	});

	//---

	Y.UserAgent = new Y.UA();

	delete Y.UA;

	//---

}());

//---


/**
 * YAX Core | Utility
 *
 * Another YAX's utilities and shortcuts [CORE]
 *
 * @version     0.15
 * @depends:    Core, Global
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jshint unused: false */
/*jslint browser: true */
/*jslint white: true */
/*jslint node: true */
/*global YAX */

//---

// Check dependence files
//if (typeof YAX !== 'object' || !window.YAX) {
//	throw 'ERROR: YAX is not found. Please ensure `core.js` is referenced before the `utility.js` file.';
//}

//---

(function () {

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
	cancelFunction = Y.CallProperty(window, 'cancelAnimationFrame') ||
		getPrefixed('CancelAnimationFrame') ||
		getPrefixed('CancelRequestAnimationFrame') ||

		function (id) {
			window.clearTimeout(id);
		};

	Y.Utility.requestAnimationFrame = function (func, context, immediate, element) {
		if (immediate && requestFunction === timeoutDefer) {
			func.call(context);
		} else {
			return requestFunction.call(window, Y.Bind(func, context), element);
		}
	};

	Y.Utility.cancelAnimationFrame = function (id) {
		if (id) {
			cancelFunction.call(window, id);
		}
	};

	//---

}());

//---

/**
 * Node/Node Module
 *
 * Cross browser Node utilities using YAX's API.
 *
 * @version     0.15
 * @depends:    Core
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*jshint node: true */
/*global Y, YAX */

(function (undef) {

	'use strict';

	var YAXDOM = Object.create(null),

		ClassList,

		IDsList,

		docElement = Y.Document.documentElement,

		elementDisplay = {},

		ClassCache = {},

		IDsCache = {},

		FragmentReplacement = /^\s*<(\w+|!)[^>]*>/,

		SingleTagReplacement = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

		TagExpanderReplacement =
		/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,

		ReadyReplacement = /complete|loaded|interactive/,

		//SimpleSelectorReplacement = /^[\w-]*$/,
		SimpleSelectorReplacement = /^[\w\-]*$/,

		RootNodeReplacement = /^(?:body|html)$/i,

		SelectorGroupReplacement = /(([\w#:.~>+()\s-]+|\*|\[.*?\])+)\s*(,|$)/g,

		// Special attributes that should be get/set via method calls
		MethodAttributes = [
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
		],

		adjacencyOperators = [
			'after',
			'prepend',
			'before',
			'append'
		],

		Table = Y.Document.createElement('table'),

		TableRow = Y.Document.createElement('tr'),

		Containers = {
			'tr': Y.Document.createElement('tbody'),
			'tbody': Table,
			'thead': Table,
			'tfoot': Table,
			'td': TableRow,
			'th': TableRow,
			'*': Y.Document.createElement('div')
		},

		temporaryParent = Y.Document.createElement('div'),

		ClassTag = 'YAX' + (+new Date()),

		properitiesMap = {
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
		},

		CCSS,

		// Matching numbers
		//pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
		pnum = /[+\-]?(?:\d*\.|)\d+(?:[eE][+\-]?\d+|)/.source,
		//		pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
		//pnum = /[+\-]?\d*\.?\d+(?:e[+\-]?\d+)?/i.source,

		// Swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
		// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/,

		rmargin = /^margin/,

		//rnumsplit = new RegExp('^(' + (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source) + ')(.*)$', 'i'),
		rnumsplit = new RegExp('^(' + pnum + ')(.*)$', 'i'),

		//rnumnonpx = new RegExp('^(' + (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source) + ')(?!px)[a-z%]+$', 'i'),
		rnumnonpx = new RegExp('^(' + pnum + ')(?!px)[a-z%]+$', 'i'),

		//rrelNum = new RegExp('^([+-])=(' + (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source) + ')', 'i'),
		rrelNum = new RegExp('^([+-])=(' + pnum + ')', 'i'),

		cssShow = {
			position: 'absolute',
			visibility: 'hidden',
			display: 'block'
		},

		cssNormalTransform = {
			letterSpacing: 0,
			fontWeight: 400
		},

		cssExpand = [
			'Top',
			'Right',
			'Bottom',
			'Left'
		],

		cssPrefixes = [
			'Webkit',
			'O',
			'Moz',
			'ms'
		],

		DomNode;

	// BEGIN OF [Private Functions]

	function functionArgument(context, argument, index, payload) {
		return Y.Lang.isFunction(argument) ? argument.call(context, index, payload) :
			argument;
	}

	function classReplacement(name) {
		var result;

		if (Y.HasOwnProperty.call(ClassCache, name)) {
			result = ClassCache[name];
		} else {
			ClassCache[name] = new RegExp('(^|\\s)' + name + '(\\s|)');
			result = ClassCache[name];
		}

		return result;
	}

	function idReplacement(name) {
		var result;

		if (Y.HasOwnProperty.call(IDsCache, name)) {
			result = IDsCache[name];
		} else {
			IDsCache[name] = new RegExp('(^|\\s)' + name + '(\\s|)');
			result = IDsCache[name];
		}

		return result;
	}

	function traverseNode(node, func) {
		var key;

		func(node);

		for (key in node.childNodes) {
			// if (Y.HasOwnProperty.call(node.childNodes, key)) {
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
		var args = Y.G.Slice.call(arguments);

		if (!Y.Lang.isUndefined(args[0])) {
			// return window.getComputedStyle(element, null);
			return Y.Window.getComputedStyle(args[0], null);
		}
	}

	function getDocStyles() {
		var args = Y.G.Slice.call(arguments);

		if (!Y.Lang.isUndefined(args[0])) {
			// return window.getComputedStyle(element, null);
			return Y.Document.defaultView.getComputedStyle(args[0], null);
		}
	}

	function getWindow(element) {
		return Y.Lang.isWindow(element) ? element : element.nodeType === 9 &&
			element.defaultView;
	}

	function defaultDisplay(nodeName) {
		var element, display;

		if (!elementDisplay[nodeName]) {
			element = Y.Document.createElement(nodeName);
			Y.Document.body.appendChild(element);
			//display = getComputedStyle(element, Y.Lang.empty()).getPropertyValue("display");
			display = getStyles(element).getPropertyValue('display');
			element.parentNode.removeChild(element);
			// display == 'none' && (display = 'block');

			if (display === 'none') {
				display = 'block';
			}

			elementDisplay[nodeName] = display;
		}

		return elementDisplay[nodeName];
	}

	function flatten(array) {
		var result, len = array.length;

		if (len > 0) {
			result = Y.Node.Function.concat.apply([], array);
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
		svg = Class && Y.CallProperty(Class, 'baseVal') !== undef;

		if (value === undef) {
			// result = svg ? Class.baseVal : Class;
			return svg ? Y.CallProperty(Class, 'baseVal') : Class;
		}

		// result = svg ? Y.Inject(Class, 'baseVal', value) : (node.className = value);
		// svg = svg ? (Class.baseVal = value) : (node.className = value);

		if (svg) {
			result = Y.Lang.inject(Class, 'baseVal', value);
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
		svg = ID && Y.CallProperty(ID, 'baseVal') !== undef;

		if (value === undef) {
			// return svg ? ID.baseVal : ID;
			return svg ? Y.CallProperty(ID, 'baseVal') : ID;
		}

		if (svg) {
			result = Y.Lang.inject(ID, 'baseVal', value);
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

		if (Y.Lang.isArraylike(elements) && !Y.Lang.isUndefined(elements)) {
			for (x; x < len; x++) {
				if (!Y.Lang.isUndefined(elements[x])) {
					value = callback(elements[x], x, arg);

					if (!Y.Lang.isNull(value) && !Y.Lang.isUndefined(value)) {
						// values.push(value);
						values[values.length] = value;
					}
				}
			}
		} else {
			for (key in elements) {
				if (elements.hasOwnProperty(key)) {
					value = callback(elements[key], key, arg);

					if (!Y.Lang.isNull(value) && !Y.Lang.isUndefined(value)) {
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
			Y.G.Slice.call(element.children) :
			map(element.childNodes, function (node) {
				if (node.nodeType === 1) {
					return node;
				}
			});
	}

	CCSS = function (element, name, csssComputed) {
		var width, minWidth, maxWidth,
			computed = csssComputed || getStyles(element),
			// Support: IE9
			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue(name) || computed[name] : undef,
			style = element.style;

		if (computed) {
			if (Y.Lang.isEmpty(ret) && !contains(element.ownerDocument, element)) {
				ret = Y.Node.Style(element, name);
			}

			// Support: Safari 5.1
			// A tribute to the "awesome hack by Dean Edwards"
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if (rnumnonpx.test(ret) && rmargin.test(name)) {

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
		var matches = rnumsplit.exec(value);
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
				val += Y.Node.CSS(element, extra + cssExpand[i], true, styles);
			}

			if (isBorderBox) {
				// border-box includes padding, so remove it if we want content
				if (extra === 'content') {
					val -= Y.Node.CSS(element, 'padding' + cssExpand[i], true, styles);
				}

				// at this point, extra isn't border nor margin, so remove border
				if (extra !== 'margin') {
					val -= Y.Node.CSS(element, 'border' + cssExpand[i] + 'Width', true,
						styles);
				}
			} else {
				// at this point, extra isn't content, so add padding
				val += Y.Node.CSS(element, 'padding' + cssExpand[i], true, styles);

				// at this point, extra isn't content nor padding, so add border
				if (extra !== 'padding') {
					val += Y.Node.CSS(element, 'border' + cssExpand[i] + 'Width', true,
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
			isBorderBox = Y.Node.Support.boxSizing && Y.Node.CSS(element, 'boxSizing',
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
			if (rnumnonpx.test(val.toString())) {
				return val;
			}

			// we need the check for style in case a browser which returns unreliable values
			// for getComputedStyle silently falls back to the reliable element.style
			valueIsBorderBox = isBorderBox && (Y.Node.Support.boxSizingReliable || val ===
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

		code = Y.Lang.trim(code);

		if (code) {
			if (code.indexOf('use strict') === 1) {
				script = Y.Document.createElement('script');
				script.text = code;
				Y.Document.head.appendChild(script).parentNode.removeChild(script);
			} else {
				indirect(code);
			}
		}
	}

	// Given a selector, splits it into groups. Necessary because naively
	// splitting on commas will do the wrong thing.
	//
	// Examples:
	// "div.foo" -> ["div.foo"]
	// "div, p" -> ["div", "p"]
	// "div[title='foo, bar'], p" -> ["div[title='foo, bar']", "p"]
	function splitSelector(selector) {
		var results = [];
		selector.replace(SelectorGroupReplacement, function (m, unit) {
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

	// END OF [Private Functions]

	//---

	YAXDOM = {
		/**
		 *
		 * @param element
		 * @param selector
		 * @returns {*}
		 * @constructor
		 */
		Matches: function (element, selector) {
			var result, matchesSelector, temp, parent;

			if (!element || element.nodeType !== 1) {
				return false;
			}

			matchesSelector = Y.CallProperty(element, 'webkitMatchesSelector') ||
				Y.CallProperty(element, 'mozMatchesSelector') ||
				Y.CallProperty(element, 'oMatchesSelector') ||
				Y.CallProperty(element, 'matchesSelector');

			if (matchesSelector) {
				return matchesSelector.call(element, selector);
			}

			// Fall back to performing a selector:
			parent = element.parentNode;
			//temp = !Y.Lang.isSet(parent);
			temp = !parent;

			if (temp) {
				// parent = temporaryParent;
				// parent.appendChild(element);
				(parent = temporaryParent).appendChild(element);
			}

			// result = ~YAXDOM.QSA(parent, selector).indexOf(element);
			/* jshint -W052 */
			result = ~YAXDOM.QSA(parent, selector).indexOf(element);

			temp && temporaryParent.appendChild(element);

			return result;
		},

		// `YAXDOM.Fragment` takes a html string and an optional tag name
		// to generate Node nodes nodes from the given html string.
		// The generated Node nodes are returned as an array.
		// This function can be overriden in plugins for example to make
		// it compatible with browsers that don't support the Node fully.
		Fragment: function (html, name, properties) {
			var dom, nodes, container;

			// A special case optimization for a single tag
			if (SingleTagReplacement.test(html)) {
				dom = Y.Node(Y.Document.createElement(RegExp.$1));
			}

			if (!dom) {
				if (html.replace) {
					html = html.replace(TagExpanderReplacement, '<$1></$2>');
				}

				if (name === undef) {
					name = FragmentReplacement.test(html) && RegExp.$1;
				}

				if (!(Containers.hasOwnProperty(name))) {
					name = '*';
				}

				container = Containers[name];

				container.innerHTML = Y.Lang.empty() + html;

				dom = Y.Each(Y.G.Slice.call(container.childNodes), function () {
					container.removeChild(this);
				});
			}

			if (Y.Lang.isPlainObject(properties)) {
				nodes = Y.Node(dom);

				Y.Each(properties, function (key, value) {
					if (MethodAttributes.indexOf(key) > -1) {
						nodes[key](value);
					} else {
						nodes.attr(key, value);
					}
				});
			}

			return dom;
		},

		// constructor: YAXDOM,

		// `YAXDOM.init` is Y.Node's counterpart to jQuery's `Y.Node.Function.init` and
		// takes a CSS selector and an optional context (and handles various
		// special cases).
		// This method can be overriden in plugins.
		init: function (selector, context) {
			var dom;

			// If nothing given, return an empty YAX collection
			if (!selector) {
				return YAXDOM.Y();
			}

			if (Y.Lang.isString(selector)) {
				// Optimize for string selectors
				selector = selector.trim();

				// If it's a html Fragment, create nodes from it
				// Note: In both Chrome 21 and Firefox 15, Node error 12
				// is thrown if the Fragment doesn't begin with <
				// if (selector[0] === '<' && FragmentReplacement.test(selector)) {
				if (selector[0] === '<' && selector[selector.length - 1] === '>' &&
					FragmentReplacement.test(selector) && selector.length >= 3) {
					dom = YAXDOM.Fragment(selector, RegExp.$1, context);
					// selector = selector.replace('<', '').replace('>', '');
					selector = null;
				} else if (context !== undef) {
					// If there's a context, create a collection on that context first, and select nodes from there
					return Y.Node(context).find(selector);
				} else {
					// If it's a CSS selector, use it to select nodes.
					dom = YAXDOM.QSA(Y.Document, selector);
				}
			}

			// If a function is given, call it when the Node is ready
			else if (Y.Lang.isFunction(selector)) {
				return Y.Node(Y.Document).ready(selector);
				// If a YAX collection is given, just return it
			} else if (YAXDOM.isY(selector)) {
				return selector;
			} else {
				// normalize array if an array of nodes is given
				if (Y.Lang.isArray(selector)) {
					dom = Y.Lang.compact(selector);
					// dom = Y.Node.makeArray(selector, YAXDOM.Y());
					// Wrap Node nodes.
				} else if (Y.Lang.isObject(selector)) {
					dom = [selector];
					selector = null;
					// If it's a html Fragment, create nodes from it
				} else if (FragmentReplacement.test(selector)) {
					dom = YAXDOM.Fragment(selector.trim(), RegExp.$1, context);
					selector = null;
					// If there's a context, create a collection on that context first, and select
					// nodes from there
				} else if (Y.Lang.isDefined(context)) {
					// return Y.Node(context).find(selector);
					// console.log(context);
					//result = Y.Node(context).find(selector);
					// And last but no least, if it's a CSS selector, use it to select nodes.
				} else {
					dom = YAXDOM.QSA(Y.Document, selector);
				}
			}

			// Create a new YAXDOM collection from the nodes found
			return YAXDOM.Y(dom, selector);
		},

		// `YAXDOM.QSA` is YAX's CSS selector implementation which
		// uses `Y.Document.querySelectorAll` and optimizes for some special cases, like `#id`.
		// This method can be overriden in plugins.
		QSA: function (element, selector) {
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

			isSimple = SimpleSelectorReplacement.test(nameOnly);

			if (Y.Lang.isDocument(element) && isSimple && maybeID) {
				found = element.getElementById(nameOnly);

				if (Y.Lang.isSet(found)) {
					// result = {'res': found};
					result = [found];
				} else {
					// result = {};
					result = [];
				}
			} else {
				result = (!Y.Lang.isUndefined(element) && element.nodeType !== 1 &&
					element.nodeType !== 9) ? {} :
					Y.G.Slice.call(
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
		},

		// `YAXDOM.Y` swaps out the prototype of the given `Node` array
		// of nodes with `Y.Node.Function` and thus supplying all the Y.Node functions
		// to the array. Note that `__proto__` is not supported on Internet
		// Explorer. This method can be overriden in Plugins.
		Y: function (dom, selector) {
			var result;

			result = dom || [];

			/* jshint -W103 */
			result.__proto__ = Y.Node.Function;

			result.selector = selector || Y.Lang.empty();

			return result;
		},

		/**
		 * Y.Node.isY` should return `true` if the given object is a YAX collection. This method can be overriden in plugins.
		 */
		isY: function (object) {
			return object instanceof YAXDOM.Y;
		}
	};

	//---

	Y.Node = function (selector, context) {
		return new YAXDOM.init(selector, context);
	};

	//---

	function filtered(nodes, selector) {
		var result;

		if (Y.Lang.isNull(selector) || Y.Lang.isUndefined(selector) || Y.Lang.isEmpty(
			selector)) {
			result = Y.Node(nodes);
		} else {
			result = Y.Node(nodes).filter(selector);
		}

		return result;
	}

	//---

	/**
	 * Y.DomNode is a Node class that Y.Node classes inherit from.
	 */
	Y.DomNode = Y.Class.Extend({
		CLASS_NAME: 'DOM',

		initialise: function (selector, context) {
			return YAXDOM.init(selector, context);
		},

		getStyle: function (el, style) {
			var value, css;

			value = el.style[style] || (el.currentStyle && el.currentStyle[style]);

			if ((!value || value === 'auto') && Y.Document.defaultView) {
				css = Y.Document.defaultView.getComputedStyle(el, null);
				value = css ? css[style] : null;
			}

			return value === 'auto' ? null : value;
		},

		documentIsLtr: function () {
			Y.Node.docIsLTR = Y.Node.docIsLTR || DomNode.getStyle(Y.Document.body,
				'direction') === 'ltr';
			return Y.Node.docIsLTR;
		},

		'Function': {
			// Because a collection acts like an array
			// copy over these useful array functions.
			forEach: Y.G.ArrayProto.forEach,
			reduce: Y.G.ArrayProto.reduce,
			push: Y.G.Push,
			sort: Y.G.ArrayProto.sort,
			indexOf: Y.G.ArrayProto.indexOf,
			concat: Y.G.Concat,
			extend: Y.Extend,
			// `map` and `slice` in the jQuery API work differently
			// from their array counterparts
			map: function (callback) {
				return Y.Node(map(this, function (el, i) {
					return callback.call(el, i, el);
				}));
			},
			slice: function () {
				return Y.Node(Y.G.Slice.apply(this, arguments));
				// return Y.Node.pushStack(Slice.apply(this, arguments));
			},
			ready: function (callback) {
				// need to check if Y.Document.body exists for IE as that browser reports
				// Y.Document ready when it hasn't yet created the body element
				if (ReadyReplacement.test(Y.CallProperty(Y.Document, 'readyState')) &&
					Y.Document.body) {
					callback(Y.Node);
				} else {
					Y.Document.addEventListener('DOMContentLoaded', function () {
						callback(Y.Node);
					}, false);
				}

				return this;
			},
			get: function (num) {
				// return num === undef ? Slice.call(this) : this[num >= 0 ? num : num + this.length];

				return num === null ?
					// Return a 'Clean' array
					this.toArray() :
					// Return just the object
					(num < 0 ? this[this.length + num] : this[num]);
			},
			toArray: function () {
				// return this.get();
				return Y.G.Slice.call(this);
			},
			size: function () {
				return this.length;
			},
			remove: function () {
				return this.each(function () {
					if (this.parentNode !== null) {
						this.parentNode.removeChild(this);
					}
				});
			},
			error: function (message) {
				throw new Error(message);
			},
			each: function (callback) {
				Y.G.ArrayProto.every.call(this, function (el, index) {
					return callback.call(el, index, el) !== false;
				});

				return this;
			},
			filter: function (selector) {
				if (Y.Lang.isFunction(selector)) {
					return this.not(this.not(selector));
				}

				return Y.Node(Y.G.Filter.call(this, function (element) {
					return YAXDOM.Matches(element, selector);
				}));
			},
			add: function (selector, context) {
				return Y.Node(Y.Lang.unique(this.concat(Y.Node(selector, context))));
			},
			is: function (selector) {
				return this.length > 0 && YAXDOM.Matches(this[0], selector);
			},
			not: function (selector) {
				var nodes = [],
					excludes;

				if (Y.Lang.isFunction(selector) && selector.call !== undef) {
					this.each(function (index) {
						if (!selector.call(this, index)) {
							nodes.push(this);
						}
					});
				} else {
					excludes = Y.Lang.isString(selector) ? this.filter(selector) :
						(Y.Lang.likeArray(selector) && Y.Lang.isFunction(selector.item)) ? Y.G.Slice
						.call(selector) : Y.Node(selector);

					this.forEach(function (el) {
						if (excludes.indexOf(el) < 0) {
							nodes.push(el);
						}
					});
				}

				return Y.Node(nodes);
			},
			has: function (selector) {
				return this.filter(function () {
					return Y.Lang.isObject(selector) ?
						contains(this, selector) :
						Y.Node(this).find(selector).size();
				});
			},
			eq: function (index) {
				return index === -1 ? this.slice(index) : this.slice(index, +index + 1);
			},
			first: function () {
				var el = this[0];
				return el && !Y.Lang.isObject(el) ? el : Y.Node(el);
			},
			last: function () {
				var el = this[this.length - 1];
				return el && !Y.Lang.isObject(el) ? el : Y.Node(el);
			},
			find: function (selector) {
				var result, $this = this,
					error = false,
					node;

				/*if (Y.Lang.isObject(selector)) {
					result = Y.Node(selector).filter(function () {
						node = this;
						return Y.G.ArrayProto.some.call($this, function (parent) {
							return contains(parent, node);
						});
					});
				} else if (this.length === 1) {
					result = Y.Node(YAXDOM.QSA(this[0], selector));
				} else {
					result = this.map(function () {
						return YAXDOM.QSA(this, selector);
					});
				}*/

				if (Y.Lang.isObject(selector)) {
					result = Y.Node(selector).filter(function () {
						node = this;
						return Y.G.ArrayProto.some.call($this, function (parent) {
							return contains(parent, node);
						});
					});
				} else {
					var slow = false;

					selector = splitSelector(selector).map(function (unit) {
						if (hasCombinator(selector)) {
							slow = true;
							return '.' + ClassTag + ' ' + unit;
						}

						return unit;
					}).join(', ');

					var findBySelector = function findBySelector(elem, selector, slow) {
						if (elem.length == 1) {
							if (slow) {
								elem.addClass(ClassTag);
							}

							result = Y.Node(YAXDOM.QSA(elem[0], selector));

							if (slow) {
								elem.removeClass(ClassTag);
							}
						} else {
							result = elem.map(function () {
								if (slow) {
									Y.Node(this).addClass(ClassTag);
								}

								var result = YAXDOM.QSA(this, selector);

								if (slow) {
									Y.Node(this).removeClass(ClassTag);
								}

								return result;
							});
						}

						return result;
					};

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
								Y.Node('.' + ClassTag).removeClass(ClassTag);
							}
						}
					} else {
						result = findBySelector(this, selector, slow);
					}
				}

				return result;
			},
			closest: function (selector, context) {
				var node = this[0],
					collection = false;

				if (Y.Lang.isObject(selector)) {
					collection = Y.Node(selector);
				}

				while (node && Y.Lang.isFalse(collection ? collection.indexOf(node) >= 0 :
					YAXDOM.Matches(node, selector))) {
					node = node !== context && !Y.Lang.isDocument(node) && node.parentNode;
				}

				return Y.Node(node);
			},
			parents: function (selector) {
				var ancestors = [],
					nodes = this,
					tempFunc, x = 0,
					result;

				tempFunc = function (node) {
					node = node.parentNode;

					if (node && !Y.Lang.isDocument(node) && ancestors.indexOf(node) < x) {
						ancestors.push(node);
						// ancestors[x] = node;

						return node;
					}
				};

				while (nodes.length > x) {
					nodes = map(nodes, tempFunc);
				}

				if (Y.Lang.isUndefined(selector) || Y.Lang.isNull(selector) || Y.Lang.isEmpty(
					selector)) {
					result = filtered(ancestors, '*');
				} else {
					result = filtered(ancestors, selector);
				}

				return result;
			},
			parent: function (selector) {
				return filtered(Y.Lang.unique(this.pluck('parentNode')), selector);
			},
			children: function (selector) {
				return filtered(this.map(function () {
					return children(this);
				}), selector);
			},
			contents: function () {
				return this.map(function () {
					return Y.G.Slice.call(this.childNodes);
				});
			},
			siblings: function (selector) {
				return filtered(this.map(function (i, el) {
					return Y.G.Filter.call(children(el.parentNode), function (child) {
						return child !== el;
					});
				}), selector);
			},
			empty: function () {
				return this.each(function () {
					this.innerHTML = Y.Lang.empty();
				});
			},
			// `pluck` is borrowed from Prototype.js
			pluck: function (property) {
				return map(this, function (el) {
					return el[property];
				});
			},
			show: function () {
				return this.each(function () {
					if (this.style.display === 'none') {
						this.style.display = Y.Lang.empty();
					}

					// this.style.display === 'none' && (this.style.display = Y.Lang.empty());

					if (getStyles(this).getPropertyValue('display') === 'none') {
						this.style.display = defaultDisplay(this.nodeName);
					}
				});
			},
			replaceWith: function (newContent) {
				return this.before(newContent).remove();
			},
			wrap: function (structure) {
				var func = Y.Lang.isFunction(structure),
					dom, clone;

				if (this[0] && !func) {
					dom = Y.Node(structure).get(0);
					clone = dom.parentNode || this.length > 1;
				}

				return this.each(function (index) {
					Y.Node(this).wrapAll(
						func ? structure.call(this, index) :
						clone ? dom.cloneNode(true) : dom
					);
				});
			},
			wrapAll: function (structure) {
				if (this[0]) {
					Y.Node(this[0]).before(structure = Y.Node(structure));

					var childreno, self = this;

					// Drill down to the inmost element
					childreno = structure.children();

					while (childreno.length) {
						structure = children.first();
					}

					Y.Node(structure).append(self);
				}

				return this;
			},
			wrapInner: function (structure) {
				var func = Y.Lang.isFunction(structure),
					self, dom, contents;
				return this.each(function (index) {
					self = Y.Node(this);

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
			unwrap: function () {
				this.parent().each(function () {
					Y.Node(this).replaceWith(Y.Node(this).children());
				});

				return this;
			},
			clone: function () {
				return this.map(function () {
					return this.cloneNode(true);
				});
			},
			hide: function () {
				return this.css('display', 'none');
			},
			toggle: function (setting) {
				return this.each(function () {
					var el = Y.Node(this),
						val;

					val = el.css('display') === 'none';

					if (Y.Lang.isUndefined(setting)) {
						if (val) {
							setting = val;
						}
					}

					if (setting) {
						el.show();
					} else {
						el.hide();
					}
				});
			},
			prev: function (selector) {
				return Y.Node(this.pluck('previousElementSibling')).filter(selector ||
					'*');
			},
			next: function (selector) {
				return Y.Node(this.pluck('nextElementSibling')).filter(selector || '*');
			},
			html: function (html) {
				return arguments.length === 0 ?
					(this.length > 0 ? this[0].innerHTML : null) :
					this.each(function (index) {
						var originHtml = this.innerHTML;
						Y.Node(this).empty().append(functionArgument(this, html, index,
							originHtml));
					});
			},
			text: function (text) {
				return arguments.length === 0 ?
					(this.length > 0 ? this[0].textContent : null) :
					this.each(function () {
						this.textContent = (text === undef) ? Y.Lang.empty() : Y.Lang.empty() +
							text;
					});
			},
			title: function (title) {
				return arguments.length === 0 ?
					(this.length > 0 ? this[0].title : null) :
					this.each(function () {
						this.title = (title === undef) ? Y.Lang.empty() : Y.Lang.empty() +
							title;
					});
			},
			attr: function (name, value) {
				var result;

				return (Y.Lang.isString(name) && value === undef) ?
					(this.length === 0 || this[0].nodeType !== 1 ? undef :
						(name === 'value' && this[0].nodeName === 'INPUT') ? this.val() :
						(Y.Lang.isFalse(result = this[0].getAttribute(name)) && this[0].hasOwnProperty(
							name)) ? this[0][name] : result
					) :
					this.each(function (index) {
						if (this.nodeType !== 1) {
							return;
						}

						if (Y.Lang.isObject(name)) {
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
			draggable: function (value) {
				return arguments.length === 0 ?
					(this.length > 0 ? this[0].draggable : null) :
					this.each(function () {
						var tmp = this.draggable;

						if (Y.Lang.isUndefined(value) || !Y.Lang.isBool(value)) {
							this.draggable = tmp;
						} else {
							this.draggable = value;
						}
					});
			},
			removeAttr: function (name) {
				return this.each(function () {
					if (this.nodeType === 1) {
						setAttribute(this, name);
					}

					// this.nodeType === 1 && setAttribute(this, name);
				});
			},
			prop: function (name, value) {
				name = properitiesMap[name] || name;
				return (value === undef) ?
					(this[0] && this[0][name]) :
					this.each(function (index) {
						this[name] = functionArgument(this, value, index, this[name]);
					});
			},
			data: function (name, value) {
				var data = this.attr('data-' + Y.Lang.dasherise(name), value);
				return data !== null ? Y.Lang.deserialiseValue(data) : undef;
			},
			val: function (value) {
				return arguments.length === 0 ?
					(this[0] && (this[0].multiple ?
						Y.Node(this[0]).find('option').filter(function () {
							return this.selected;
						}).pluck('value') :
						this[0].value)) :
					this.each(function (index) {
						this.value = functionArgument(this, value, index, this.value);
					});
			},
			value: function (value) {
				return arguments.length === 0 ?
					(this[0] && (this[0].multiple ?
						Y.Node(this[0]).find('option').filter(function () {
							return this.selected;
						}).pluck('value') :
						this[0].value)) :
					this.each(function (index) {
						this.value = functionArgument(this, value, index, this.value);
					});
			},
			offset: function (coordinates) {
				if (coordinates) {
					return this.each(function (index) {
						var $this = Y.Node(this),
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

				this.offset.toString = function () {
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
			getOffset: function (options) {
				if (arguments.length) {
					return options === undef ?
						this :
						this.each(function (i) {
							Y.Node.offset.setOffset(this, options, i);
						});
				}

				var docElem, win,
					element = this[0],
					box = {
						top: 0,
						left: 0
					},
					doc = element && element.ownerDocument;

				if (!doc) {
					return;
				}

				docElem = Y.Document.documentElement;

				// Make sure it's not a disconnected Node node
				if (!contains(docElem, element)) {
					return box;
				}

				// If we don't have gBCR, just use 0,0 rather than error
				// BlackBerry 5, iOS 3 (original iPhone)
				if (!Y.Lang.isUndefined(element.getBoundingClientRect)) {
					box = element.getBoundingClientRect();
				}

				win = getWindow(doc);

				return {
					top: box.top + win.pageYOffset - docElem.clientTop,
					left: box.left + win.pageXOffset - docElem.clientLeft
				};
			},
			css: function (name, value) {
				var element = this[0],
					computedStyle = getStyles(element),
					props;

				if (arguments.length < 2) {
					if (!element) {
						return;
					}

					if (Y.Lang.isString(name)) {
						return element.style[Y.Lang.camelise(name)] || computedStyle.getPropertyValue(
							name);
					}

					if (Y.Lang.isArray(name)) {
						props = {};

						Y.Each(Y.Lang.isArray(name) ? name : [name], function (tmp, prop) {
							props[prop] = (element.style[Y.Lang.camelise(prop)] || computedStyle.getPropertyValue(
								prop));
						});

						return props;
					}
				}

				if (Y.Lang.type(name) === 'string') {
					if (!value && value !== 0) {
						this.each(function () {
							this.style.removeProperty(Y.Lang.dasherise(name));
						});
					}
				}

				return Y.Node.Access(this, function (element, name, value) {
					var styles, len, mapo = {},
						i = 0;

					if (Y.Lang.isArray(name)) {
						styles = getStyles(element);
						len = name.length;

						for (i; i < len; i++) {
							mapo[name[i]] = Y.Node.CSS(element, name[i], false, styles);
						}

						return mapo;
					}

					return value !== undef ?
						Y.Node.Style(element, name, value) :
						Y.Node.CSS(element, name);
				}, name, value, arguments.length > 1);
			},

			prevAll: function (elem) {
				return Y.Node.dir(elem, "previousSibling");
			},

			index: function (element) {
				//				if (!element) {
				//					return (this[0] && this[0].parentNode) ? this.first().prevAll().length : -1;
				//				}

				//				return this.indexOf(Y.Node(element)[0]);

				//				if (Y.Lang.isString(element)) {
				//					return this.indexOf.call(Y.Node(element), this[0]);
				//				}

				//				return this.indexOf.call(this, element.YAXDOM ? element[0] : element);

				return element ? this.indexOf(Y.Node(element)[0]) : this.parent().children()
					.indexOf(this[0]);
			},
			hasClass: function (name) {
				if (!name) {
					return false;
				}

				return Y.G.ArrayProto.some.call(this, function (el) {
					return this.test(className(el));
				}, classReplacement(name));
			},
			hasId: function (name) {
				if (!name) {
					return false;
				}

				return Y.G.ArrayProto.some.call(this, function (el) {
					return this.test(idName(el));
				}, idReplacement(name));
			},
			addId: function (name) {
				if (!name) {
					return this;
				}

				return this.each(function (index) {
					IDsList = [];

					var id = idName(this),
						newName = functionArgument(this, name, index, id);

					newName.split(/\s+/g).forEach(function (ID) {
						if (!Y.Node(this).hasId(ID)) {
							IDsList.push(ID);
						}
					}, this);

					if (IDsList.length) {
						idName(this, id + (id ? ' ' : Y.Lang.empty()) + IDsList.join(' '));
					}

					// IDsList.length && idName(this, id + (id ? ' ' : Y.Lang.empty()) + IDsList.join(' '));
				});
			},
			addClass: function (name) {
				if (!name) {
					return this;
				}

				return this.each(function (index) {
					if (!('className' in this)) {
						return;
					}

					ClassList = [];

					var cls = className(this),
						newName = functionArgument(this, name, index, cls);

					newName.split(/\s+/g).forEach(function (Class) {
						if (!Y.Node(this).hasClass(Class)) {
							ClassList.push(Class);
						}
					}, this);

					if (ClassList.length) {
						className(this, cls + (cls ? ' ' : Y.Lang.empty()) + ClassList.join(
							' '));
					}

					// ClassList.length && className(this, cls + (cls ? ' ' : Y.Lang.empty()) + ClassList.join(' '));
				});
			},
			removeId: function (name) {
				return this.each(function (index) {
					if (name === undef) {
						return idName(this, Y.Lang.empty());
					}

					IDsList = idName(this);

					functionArgument(this, name, index, IDsList).split(/\s+/g).forEach(
						function (ID) {
							IDsList = IDsList.replace(idReplacement(ID), ' ');
						});

					idName(this, IDsList.trim());
				});
			},
			removeClass: function (name) {
				return this.each(function (index) {
					if (!('className' in this)) {
						return;
					}

					if (name === undef) {
						return className(this, Y.Lang.empty());
					}

					ClassList = className(this);

					functionArgument(this, name, index, ClassList).split(/\s+/g).forEach(
						function (Class) {
							ClassList = ClassList.replace(classReplacement(Class), ' ');
						});

					className(this, ClassList.trim());
				});
			},
			toggleClass: function (name, when) {
				if (!name) {
					return this;
				}

				return this.each(function (index) {
					var $this = Y.Node(this),
						names = functionArgument(this, name, index, className(this));

					names.split(/\s+/g).forEach(function (Class) {
						if (Y.Lang.isUndefined(when) || Y.Lang.isNull(when) || !Y.Lang.isSet(
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
			scrollTop: function (value) {
				if (!this.length) {
					return;
				}

				var hasScrollTop = this[0].hasOwnProperty('scrollTop');

				if (value === undef) {
					return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset;
				}

				return this.each(hasScrollTop ?
					function () {
						this.scrollTop = value;
					} :
					function () {
						this.scrollTo(this.scrollX, value);
					});
			},
			scrollLeft: function (value) {
				if (!this.length) {
					return;
				}

				var hasScrollLeft = this[0].hasOwnProperty('scrollLeft');

				if (value === undef) {
					return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset;
				}

				return this.each(hasScrollLeft ?
					function () {
						this.scrollLeft = value;
					} :
					function () {
						this.scrollTo(value, this.scrollY);
					});
			},
			position: function () {
				if (!this[0]) {
					return;
				}

				var offsetParent, offset, element = this[0],
					parentOffset = {
						top: 0,
						left: 0
					};

				// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
				if (Y.Node.CSS(element, 'position') === "fixed") {
					// We assume that getBoundingClientRect is available when computed position is fixed
					offset = element.getBoundingClientRect();

				} else {
					// Get *real* offsetParent
					offsetParent = this.offsetParent();

					// Get correct offsets
					offset = this.offset();

					if (!Y.Node.nodeName(offsetParent[0], "html")) {
						parentOffset = offsetParent.offset();
					}

					// Add offsetParent borders
					parentOffset.top += Y.Node.CSS(offsetParent[0], "borderTopWidth", true);
					parentOffset.left += Y.Node.CSS(offsetParent[0], "borderLeftWidth", true);
				}

				// Subtract parent offsets and element margins
				return {
					top: offset.top - parentOffset.top - Y.Node.CSS(element, "marginTop",
						true),
					left: offset.left - parentOffset.left - Y.Node.CSS(element, "marginLeft",
						true)
				};
			},
			getPosition: function () {
				if (!this.length) {
					return;
				}

				var element = this[0],
					// Get *real* offsetParent
					offsetParent = this.offsetParent(),
					// Get correct offsets
					offset = this.offset(),
					parentOffset = RootNodeReplacement.test(offsetParent[0].nodeName) ? {
						top: 0,
						left: 0
					} : offsetParent.offset();

				// Subtract element margins
				// note: when an element has margin: auto the offsetLeft and marginLeft
				// are the same in Safari causing offset.left to incorrectly be 0
				offset.top -= parseFloat(Y.Node(element).css('margin-top')) || 0;
				offset.left -= parseFloat(Y.Node(element).css('margin-left')) || 0;

				// Add offsetParent borders
				parentOffset.top += parseFloat(Y.Node(offsetParent[0]).css(
					'border-top-width')) || 0;
				parentOffset.left += parseFloat(Y.Node(offsetParent[0]).css(
					'border-left-width')) || 0;

				// Subtract the two offsets
				return {
					top: offset.top - parentOffset.top,
					left: offset.left - parentOffset.left
				};
			},
			offsetParent: function () {
				return this.map(function () {
					var offsetParent = this.offsetParent || docElement;

					while (offsetParent && (!Y.Node.nodeName(offsetParent, 'html') && Y.Node
						.CSS(offsetParent, 'position') === 'static')) {
						offsetParent = offsetParent.offsetParent;
					}

					return offsetParent || docElement;
				});
			},
			detach: function (selector) {
				return this.remove(selector, true);
				// return this.remove(selector);
			},
			splice: [].splice
		},
		// Y.Lang.unique for each copy of YAX on the page
		Expando: 'YAX' + (Y._INFO.VERSION.toString() + Y._INFO.BUILD.toString() +
			Y.Lang.randomNumber(10000, 70000)).replace(/\D/g, Y.Lang.empty()),
		// Multifunctional method to get and set values of a collection
		// The value/s can optionally be executed if it's a function
		Access: function (elems, callback, key, value, chainable, emptyGet, raw) {
			var i = 0,
				length = elems.length,
				bulk = key === null;

			// Sets many values
			if (Y.Lang.type(key) === 'object') {
				chainable = true;
				for (i in key) {
					if (key.hasOwnProperty(i)) {
						this.Access(elems, callback, i, key[i], true, emptyGet, raw);
					}
				}
				// Sets one value
			} else if (value !== undef) {
				chainable = true;

				if (!Y.Lang.isFunction(value)) {
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
						callback = function (element, key, value) {
							return bulk.call(Y.Node(element), value);
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
		Swap: function (element, options, callback, args) {
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
		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function (elems) {
			// Build a new YAX matched element set
			var ret = Y.Lang.merge(this.constructor(), elems);

			// Add the old object onto the stack (as a reference)
			ret.prev = this;
			ret.context = this.context;

			// Return the newly-formed element set
			return ret;
		},
		nodeName: function (element, name) {
			return element.nodeName && element.nodeName.toLowerCase() === name.toLowerCase();
		},
		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		CSS_Hooks: {
			opacity: {
				get: function (element, computed) {
					if (computed) {
						// We should always get a number back from opacity
						var ret = CCSS(element, 'opacity');
						return Y.Lang.isEmpty(ret) ? '1' : ret;
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
		// Get and set the style property on a Node Node
		Style: function (element, name, value, extra) {
			// Don't set styles on text and comment nodes
			if (!element || element.nodeType === 3 || element.nodeType === 8 || !
				element.style) {
				return;
			}

			// Make sure that we're working with the right name
			var ret, hooks,
				origName = Y.Lang.camelise(name),
				style = element.style,
				newvalue;

			name = this.CSS_Properities[origName] || (this.CSS_Properities[origName] =
				vendorPropName(style, origName));

			// gets hook for the prefixed version
			// followed by the unprefixed version
			hooks = this.CSS_Hooks[name] || this.CSS_Hooks[origName];

			newvalue = value;

			// Check if we're setting a value
			if (value !== undef) {
				ret = rrelNum.exec(value);

				// Convert relative number strings (+= or -=) to relative numbers. #7345
				if (Y.Lang.isString(value) && ret) {
					value = (ret[1] + 1) * ret[2] + parseFloat(this.CSS(element, name));
				}

				// Make sure that NaN and null values aren't set. See: #7116
				if ((value === null || Y.Lang.isNumber(value)) && isNaN(value)) {
					return;
				}

				// If a number was passed in, add 'px' to the (except for certain CSS properties)
				if (Y.Lang.isNumber(value) && !this.CSS_Number[origName]) {
					value += 'px';
				}

				// Fixes #8908, it can be done more correctly by specifying setters in CSS_Hooks,
				// but it would mean to define eight (for every problematic property) identical functions
				if (!this.Support.clearCloneStyle && Y.Lang.isEmpty(value) && name.indexOf(
					'background') === 0) {
					style[name] = 'inherit';
				}

				// If a hook was provided, use that value, otherwise just set the specified value
				if (!hooks || !(hooks.hasOwnProperty('set')) || (value = hooks.set(
					element, value, extra)) !== undef) {
					style[name] = value;

					if (!newvalue && newvalue !== 0) {
						style.setProperty(name, Y.Lang.empty());
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
		CSS: function (element, name, extra, styles) {
			var val, num, hooks,
				origName = Y.Lang.camelise(name);

			// Make sure that we're working with the right name
			name = this.CSS_Properities[origName] || (this.CSS_Properities[origName] =
				vendorPropName(element.style, origName));

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
			if (Y.Lang.isEmpty(extra) || extra) {
				num = parseFloat(val);
				return extra === true || Y.Lang.isNumber(num) ? num || 0 : val;
			}

			return val;
		}
	}); // END OF Y.DomNode CLASS

	//---

	DomNode = Y.DomNode.prototype;

	//---

	Y.Extend(Y.Node, {
		offset: {
			setOffset: function (element, options, i) {
				var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft,
					calculatePosition,
					position = Y.Node.CSS(element, "position"),
					curElem = Y.Node(element),
					props = {};

				// Set position first, in-case top/left are set even on static element
				if (position === "static") {
					element.style.position = "relative";
				}

				curOffset = curElem.offset();
				curCSSTop = Y.Node.CSS(element, "top");
				curCSSLeft = Y.Node.CSS(element, "left");
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

				if (Y.Lang.isFunction(options)) {
					options = options.call(element, i, curOffset);
				}

				if (!Y.Lang.isNull(options.top)) {
					props.top = (options.top - curOffset.top) + curTop;
				}

				if (!Y.Lang.isNull(options.left)) {
					props.left = (options.left - curOffset.left) + curLeft;
				}

				if (options.hasOwnProperty('using')) {
					options.using.call(element, props);
				} else {
					curElem.css(props);
				}
			}
		},

		isLTR: DomNode.documentIsLtr,

		// EC: 0,

		each: Y.Each,

		vardump: Y.Lang.variableDump,

		contains: contains,

		fn: DomNode.Function,

		pushStack: DomNode.pushStack,

		Swap: DomNode.Swap,

		dir: DomNode.dir,

		swap: DomNode.Swap,

		Access: DomNode.Access,

		access: DomNode.Access,

		Style: DomNode.Style,

		style: DomNode.Style,

		CSS_Number: DomNode.CSS_Number,

		nodeName: DomNode.nodeName,

		CSS_Properities: DomNode.CSS_Properities,

		CSS: DomNode.CSS,

		css: DomNode.CSS,

		CSS_Hooks: DomNode.CSS_Hooks,

		Function: DomNode.Function,

		expr: {},

		Expr: {},

		support: {},

		map: map,

		Map: map,

		UUID: 0,

		GUID: 0,

		Expando: DomNode.Expando,

		Timers: [],

		Location: Y.Location,

		parseJSON: Y.Lang.parseJSON
	});

	Y.Node.Support = Y.Node.support;

	//---


	//---

	// Y.Node.prototype = DomNode.prototype;

	//---

	// Create scrollLeft and scrollTop methods
	Y.Each({
		scrollLeft: 'pageXOffset',
		scrollTop: 'pageYOffset'
	}, function (method, prop) {
		var top = 'pageYOffset' === prop;

		Y.Node.Function[method] = function (val) {
			return Y.Node.Access(this, function (element, method, val) {
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

	Y.Node.cssExpand = cssExpand;

	//---

	Y.Each(['height', 'width'], function (i, name) {
		Y.Node.CSS_Hooks[name] = {
			get: function (element, computed, extra) {
				if (computed) {
					// certain elements can have dimension info if we invisibly show them
					// however, it must have a current display style that would benefit from this
					return element.offsetWidth === 0 && rdisplayswap.test(Y.Node.CSS(element,
							'display')) ?
						Y.Node.Swap(element, cssShow, function () {
							return getWidthOrHeight(element, name, extra);
						}) :
						getWidthOrHeight(element, name, extra);
				}
			},
			set: function (element, value, extra) {
				var styles = extra && getStyles(element);
				return setPositiveNumber(element, value, extra ?
					argumentWidthOrHeight(
						element,
						name,
						extra,
						Y.Node.Support.boxSizing && Y.Node.CSS(element, 'boxSizing', false,
							styles) === 'border-box',
						styles
					) : 0
				);
			}
		};
	});

	//---

	Y.Each({
		Height: 'height',
		Width: 'width'
	}, function (name, type) {
		Y.Each({
			padding: 'inner' + name,
			content: type,
			'': 'outer' + name
		}, function (defaultExtra, funcName) {
			// margin is only for outerHeight, outerWidth
			Y.Node.Function[funcName] = function (margin, value) {
				var chainable = arguments.length && (defaultExtra || typeof margin !==
						'boolean'),
					extra = defaultExtra || (margin === true || value === true ? 'margin' :
						'border');

				return Y.Node.Access(this, function (element, type, value) {
					var doc;

					if (Y.Lang.isWindow(element)) {
						// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
						// isn't a whole lot we can do. See pull request at this URL for discussion:
						// https://github.com/jquery/jquery/pull/764
						return element.Y.Document.documentElement['client' + name];
					}

					// Get Y.Document width or height
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
						Y.Node.CSS(element, type, extra) :
						// Set width or height on the element
						Y.Node.Style(element, type, value, extra);
				}, type, chainable ? margin : undef, chainable, null);
			};
		});
	});

	//---

	Y.Node.Extend = Y.Node.extend = Y.Extend;

	//---

	// Generate the `after`, `prepend`, `before`, `append`,
	// `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
	adjacencyOperators.forEach(function (operator, operatorIndex) {
		var inside = operatorIndex % 2; //=> prepend, append

		Y.Node.Function[operator] = function () {
			// Arguments can be nodes, arrays of nodes, YAX objects and HTML strings
			var nodes = map(arguments, function (arg) {
					return Y.Lang.isObject(arg) ||
						Y.Lang.isArray(arg) ||
						Y.Lang.isNull(arg) ?
						arg : YAXDOM.Fragment(arg);
				}),
				parent,
				copyByClone = this.length > 1,
				parentInDocument;

			if (nodes.length < 1) {
				return this;
			}

			return this.each(function (tmp, target) {
				parent = inside ? target : target.parentNode;

				// Convert all methods to a "before" operation
				target = operatorIndex === 0 ? target.nextSibling :
					operatorIndex === 1 ? target.firstChild :
					operatorIndex === 2 ? target :
					null;

				parentInDocument = docElement.contains(parent);

				nodes.forEach(function (node) {
					if (copyByClone) {
						node = node.cloneNode(true);
					} else if (!parent) {
						return Y.Node(node).remove();
					}

					if (parentInDocument) {
						return parent.insertBefore(node, target);
					}

					// for (var ancestor = parent.parentNode; ancestor !== null && ancestor !== Y.Document.createElement; ancestor = ancestor.parentNode);

					traverseNode(parent.insertBefore(node, target), function (el) {
						if (Y.Lang.isNull(el.nodeName) && el.nodeName.toUpperCase() ===
							'SCRIPT' && (!el.type || el.type === 'text/javascript')) {
							if (!el.src) {
								// window['eval'].call(window, el.innerHTML);
								globalEval(window, el.innerHTML);
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
		Y.Node.Function[inside ? operator + 'To' : 'insert' + (operatorIndex ?
			'Before' : 'After')] = function (html) {
			Y.Node(html)[operator](this);
			return this;
		};
	});

	//---

	Y.Settings.DOM = Object.create(null);

	//---

	Y.Extend(YAXDOM.Y.prototype, Y.Node.Function);

	Y.Node.YAXDOM = YAXDOM;
	Y.Node.globalEval = globalEval;
	Y.Node.getStyles = getStyles;
	Y.Node.getDocStyles = getDocStyles;

	//---

	if (typeof window.$ === 'undefined') {
		Y.DOM = Y.Node;
		window.$ = Y.DOM;
	}

	//---

}());

//---

/**
 * YAX Node | Selector
 *
 * Cross browser selector implementation using YAX's API [Node]
 *
 * @version     0.15
 * @depends:    Core, Node
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y */

//---

(function () {

	'use strict';

	var YAXDOM = Y.DOM.YAXDOM,
		oldQSA = YAXDOM.QSA,
		oldMatches = YAXDOM.Matches,
		filterReplacement = new RegExp('(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*'),
		childReplacement = /^\s*>/,
		classTag = 'YAX' + Y.Lang.now,
		Filters;

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
//			console.log('aa')
			if (visible(this)) {
				console.log('aa');
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
			if (Y.DOM.YAXDOM.QSA(this, selector).length) {
				return this;
			}
		}
	};

	function process(selector, callback) {
		// Quote the hash in `a[href^=#]` expression
		selector = selector.replace(/\=#\]/g, '="#"]');

		var filter, argument, match = filterReplacement.exec(selector), num;

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

	YAXDOM.QSA = function (node, selector) {
		var taggedParent, nodes;

		return process(selector, function (_selector, filter, argument) {
			try {
				if (!_selector && filter) {
					_selector = '*';
				} else if (childReplacement.test(_selector)) {
					// support "> *" child queries by tagging the parent node with a
					// unique class and prepending that classname onto the selector
					taggedParent = Y.DOM(node).addClass(classTag);
					_selector = '.' + classTag + ' ' + _selector;
				}

				nodes = oldQSA(node, _selector);
			} catch (e) {
				// console.error('error performing selector: %o', selector);
				Y.ERROR('Error performing selector: ' + selector);
				throw e;
			} finally {
				if (taggedParent) {
					taggedParent.removeClass(classTag);
				}
			}

			return !filter ? nodes :
				Y.Lang.unique(Y.DOM.Map(nodes, function (n, i) {
					return filter.call(n, i, nodes, argument);
				}));
		});
	};

	YAXDOM.Matches = function (node, selector) {
		return process(selector, function (_selector, filter, argument) {
			return (!_selector || oldMatches(node, _selector)) && (!filter || filter.call(node, null, argument) === node);
		});
	};

	//---

}());

//---


/**
 * YAX Node | Data
 *
 * Cross browser data implementation using YAX's API [Node]
 *
 * @version     0.15
 * @depends:    Core, Node
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

//---

(function (undef) {

	'use strict';

	var data = {},
		dataAttr = Y.DOM.Function.data,
		exp = Y.DOM.Expando,
		rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
		rmultiDash = /([A-Z])/g;

	function Data() {
		// Support: Android < 4,
		// Old WebKit does not have .preventExtensions/freeze method,
		// return new empty object instead with no [[set]] accessor
		Object.defineProperty(this.cache = {}, 0, {
			get: function () {
				return {};
			}
		});

		this.Expando = Y.DOM.Expando;
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
			owner.nodeType === 1 || owner.nodeType === 9 : true;
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
				unlock = owner[this.Expando];

			// If not, create one
			if (!unlock) {
				unlock = Data.UID++;

				// Secure it in a non-enumerable, non-writable property
				try {
					descriptor[this.Expando] = {
						value: unlock
					};
					Object.defineProperties(owner, descriptor);

					// Support: Android < 4
					// Fallback to a less secure definition
				} catch (e) {
					descriptor[this.Expando] = unlock;
					Y.Extend(owner, descriptor);
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
			// if there is no entry for this "owner", create one inline
			// and set the unlock as though an owner entry had always existed
				unlock = this.key(owner),
				cache = this.cache[unlock];

			// Handle: [ owner, key, value ] args
			if (typeof data === "string") {
				cache[data] = value;

				// Handle: [ owner, { properties } ] args
			} else {
				// Fresh assignments by object are shallow copied
				if (Y.Lang.isEmpty(cache)) {
					Y.Extend(this.cache[unlock], data);
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

			return key === undef ?
				cache : cache[key];
		},
		access: function (owner, key, value) {
			var stored;
			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if (key === undef ||
				((key && typeof key === "string") && value === undef)) {

				stored = this.get(owner, key);

				return stored !== undef ?
					stored : this.get(owner, Y.Lang.camelise(key));
			}

			// [*]When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set(owner, key, value);

			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undef ? value : key;
		},
		remove: function (owner, key) {
			var i, name, camel,
				unlock = this.key(owner),
				cache = this.cache[unlock];

			if (key === undef) {
				this.cache[unlock] = {};

			} else {
				// Support array or space separated string of keys
				if (Y.Lang.isArray(key)) {
					// If "name" is an array of keys...
					// When data is initially created, via ("key", "val") signature,
					// keys will be converted to camelCase.
					// Since there is no way to tell _how_ a key was added, remove
					// both plain key and camelCase key. #12786
					// This will only penalize the array argument path.
					name = key.concat(key.map(Y.Lang.camelise));
				} else {
					camel = Y.Lang.camelise(key);
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
			return !Y.Lang.isEmpty(
					this.cache[owner[this.Expando]] || {}
			);
		},
		discard: function (owner) {
			if (owner[this.Expando]) {
				delete this.cache[owner[this.Expando]];
			}
		}
	};

	// These may be used throughout the YAX core codebase
	Y.DOM.dataUser = Y.DOM.data_user = new Data();
	Y.DOM.dataPrivative = Y.DOM.data_priv = new Data();

	Y.Extend(Y.DOM, {
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

	function dataAttribute(elem, key, data) {
		var name;

//		console.log(elem)
//		console.log(key)
//		console.log(data)

		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if (data === undef && elem.nodeType === 1) {
			name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();
			data = elem.getAttribute(name);

			if (typeof data === "string") {
				try {
					data = data === "true" ? true :
							data === "false" ? false :
							data === "null" ? null :
						// Only convert to a number if it doesn't change the string
							+ data + Y.Lang.empty() === data ? +data :
						rbrace.test(data) ? JSON.parse(data) :
							data;
				} catch (e) {
					console.log(e);
				}

				// Make sure we set the data so it isn't changed later
				Y.DOM.dataUser.set(elem, key, data);
			} else {
				data = undef;
			}
		}
		return data;
	}

	// Read all "data-*" attributes from a node
	function attributeData(node) {
		var store = {};

		Y.Each(node.attributes || Y.G.ArrayProto, function (i, attr) {
			if (attr.name.indexOf('data-') === 0) {
				store[Y.Lang.camelise(attr.name.replace('data-', ''))] =
					Y.Lang.deserialiseValue(attr.value);
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

		//id = node[exp] || (node[exp] = ++Y.DOM.UUID);
		//store = data[id] || (data[id] = attributeData(node));

		if (name !== undef) {
			store[Y.Lang.camelise(name)] = value;
		}

		return store;
	}

	// Get value from node:
	// 1. first try key as given,
	// 2. then try Camelised key,
	// 3. fall back to reading "data-*" attribute.

	function getData(node, name) {
		var id = node[exp],
			store = id && data[id],
			camelName;

		if (name === undef) {
			return store || setData(node);
		}

		if (store) {
			if (store.hasOwnProperty(name)) {
				return store[name];
			}

			camelName = Y.Lang.camelise(name);

			if (store.hasOwnProperty(camelName)) {
				return store[camelName];
			}
		}

		return dataAttr.call(Y.DOM(node), name);
	}

	Y.DOM.Function.extend({
		data: function (key, value) {
			var attrs, name,
				elem = this[0],
				i = 0,
				datao = null;
			var self = this;

			// Gets all values
			if (key === undef) {
				if (this.length) {
					datao = Y.DOM.dataUser.get(elem);

					if (elem.nodeType === 1 && !Y.DOM.dataPrivative.get(elem, "hasDataAttrs")) {
						attrs = elem.attributes;

						for (i; i < attrs.length; i++) {
							name = attrs[i].name;

							if (name.indexOf("data-") === 0) {
								name = Y.Lang.camelise(name.slice(5));
								dataAttribute(elem, name, datao[name]);
							}
						}

						Y.DOM.dataPrivative.set(elem, "hasDataAttrs", true);
					}
				}

				return datao;
			}

			// Sets multiple values
			if (typeof key === "object") {
				return this.each(function () {
					Y.DOM.dataUser.set(this, key);
				});
			}

			return Y.DOM.Access(this, function (value) {
				var _data,
					camelKey = Y.Lang.camelise(key);

				// The calling YAX object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undef. An empty YAX object
				// will result in `undef` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if (elem && value === undef) {
					// Attempt to get data from the cache
					// with the key as-is
					_data = Y.DOM.dataUser.get(elem, key);

					if (_data !== undef) {
						return _data;
					}

					// Attempt to get data from the cache
					// with the key Camelised
					_data = Y.DOM.dataUser.get(elem, camelKey);
					if (_data !== undef) {
						return _data;
					}

					// Attempt to "discover" the data in
					// HTML5 custom data-* attrs
					_data = dataAttr(elem, camelKey, undef);
					if (_data !== undef) {
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
					if (key.indexOf("-") !== -1 && __data !== undef) {
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
		if (Y.Lang.isUndefined(value)) {
			if (Y.Lang.isPlainObject(name)) {
				result = this.each(function (i, node) {
					Y.Each(name, function (key, value) {
						setData(node, key, value);
					});
				});
			} else {
				// Get value from first element
				if (this.length === 0) {
					result = undef;
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

//		return value === undef ?
//			// set multiple values via object
//			Y.Lang.isPlainObject(name) ?
//				this.each(function (i, node) {
//					Y.Each(name, function (key, value) {
//						setData(node, key, value);
//					});
//				}) :
//				// get value from first element
//					this.length === 0 ? undef : getData(this[0], name) :
//			// set value on all elements
//			this.each(function () {
//				setData(this, name, value);
//			});
	};

	Y.DOM.Function.removeData = function (names) {
		if (typeof names === 'string') {
			names = names.split(/\s+/);
		}
		return this.each(function () {
			var id = this[exp],
				store = id && data[id];

			if (store) {
				Y.Each(names || store, function (key) {
					delete store[names ? Y.Lang.camelise(this) : key];
				});
			}
		});
	};

	// Generate extended `remove` and `empty` functions
	['remove', 'empty'].forEach(function (methodName) {
		var origFn = Y.DOM.Function[methodName];

		Y.DOM.Function[methodName] = function () {
			var elements = this.find('*');

			if (methodName === 'remove') {
				elements = elements.add(this);
			}

			elements.removeData();

			return origFn.call(this);
		};
	});

	//---

}());

//---


/**
 * YAX Node | Events
 *
 * Cross browser events implementation using YAX's API [Node]
 *
 * @version     0.15
 * @depends:    Core, Node
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

	var YID = 1,

		hover = {
			mouseenter: 'mouseover',
			mouseleave: 'mouseout'
		},

		focus = {
			focus: 'focusin',
			blur: 'focusout'
		},

		ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,

		focusinSupported = Y.HasOwnProperty.call(Y.Window, 'onfocusin'),

		eventMethods = {
			preventDefault: 'isDefaultPrevented',
			stopImmediatePropagation: 'isImmediatePropagationStopped',
			stopPropagation: 'isPropagationStopped'
		},

		eventsKey = 'YAX_EVENTS',

		returnTrue,

		returnFalse,

		document = Y.Document,

		specialEvents = Object.create({});

	specialEvents.click =
		specialEvents.mousedown =
			specialEvents.mouseup =
				specialEvents.mousemove = 'MouseEvents';

	//---

	// BEGIN OF [Private Functions]

	function yID(element) {
		element.YID = YID++;

		return element.YID;

		// return element.YID || (element.YID = YID++);
	}

	function parse(event) {
		var parts = (Y.Lang.empty() + event).split('.');

		return {
			e: parts[0],
			ns: parts.slice(1).sort().join(' ')
		};
	}

	function matcherFor(ns) {
		return new RegExp('(?:^|)' + ns.replace(' ', ' .* ?') + '(?: |$)');
	}

	function eventHandlers(element) {
		//element.EventHandlers = [];

		//return element.EventHandlers;

		var result = null;

		if (Y.HasOwnProperty.call(element, 'EventHandlers')) {
			result = element.EventHandlers;
		} else {
			element.EventHandlers = [];

			result = element.EventHandlers;
		}

		return result;

		// return element.EventHandlers || (element.EventHandlers = []);
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

	function eventCapture(handler, captureSetting) {
		return !(!handler.del || !(!focusinSupported && Y.Lang.hasProperty(focus, handler.e))) || Y.Lang.isSet(captureSetting);
	}

	function realEvent(type) {
		return hover[type] || (focusinSupported && focus[type]) || type;
	}

	function compatible(event, source) {
		if (source || !event.isDefaultPrevented) {
			// source || (source = event);
			source = source || event;

			Y.Each(eventMethods, function (name, predicate) {
				var sourceMethod = source[name];

				event[name] = function () {
					this[predicate] = returnTrue;
					return sourceMethod && sourceMethod.apply(source, arguments);
				};

				event[predicate] = returnFalse;
			});

			if (!Y.Lang.isUndefined(source.defaultPrevented)) {
				if (source.defaultPrevented) {
					event.isDefaultPrevented = returnTrue;
				}
			} else {
				if (Y.Lang.hasProperty(source, 'returnValue')) {
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

			/*if (source.defaultPrevented !== undefined ? source.defaultPrevented :
					'returnValue' in source ? source.returnValue === false :
				source.getPreventDefault && source.getPreventDefault()) {
				event.isDefaultPrevented = returnTrue;
			}*/
		}

		return event;
	}

	returnTrue = function () {
		return true;
	};

	returnFalse = function () {
		return false;
	};

	/*function safeActiveElement() {
		try {
			return Y.Document.activeElement;
		} catch (err) {
			Y.ERROR(err);
		}
	}*/

	function createProxy(event) {
		var key, proxy = {
			originalEvent: event
		};

		for (key in event) {
			if (event.hasOwnProperty(key)) {
				if (!ignoreProperties.test(key) && !Y.Lang.isUndefined(event[key])) {
					proxy[key] = event[key];
				}
			}
		}

		return compatible(proxy, event);
	}

	// END OF [Private Functions]

	//---

	Y.DOM.Event = Y.DOM.event = function (type, props) {
		var event, name, bubbles;

		// Allow instantiation without the 'new' keyword
		if (!(this instanceof Y.DOM.Event)) {
			return new Y.DOM.Event(type, props);
		}

		if (!Y.Lang.isString(type)) {
			props = type;
			type = props.type;
		}

		event = Y.Document.createEvent(specialEvents[type] || 'Events');

		bubbles = true;

		if (props) {
			for (name in props) {
				if (props.hasOwnProperty(name)) {
					if (name === 'bubbles') {
						bubbles = Y.Lang.isSet(props[name]);
					} else {
						event[name] = props[name];
					}

					// (name === 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name]);
				}
			}

			Y.DOM.extend(this, props);
		}

		event.initEvent(type, bubbles, true);

		// this.timeStamp = type && type.timeStamp || Y.Lang.now();

		// Mark it as fixed
		this[Y.DOM.expando] = true;

		return compatible(event);
	};

	//---


	//---

	/**
	 * Y.DOM.Event contains functions for working with Node events.
	 */
	Y.Extend(Y.DOM.Event, {
		on: function (object, types, func, context) {
			var type, x, len;

			//console.log(object);
			//console.log(types);
			//console.log(func);

			if (Y.Lang.isObject(types)) {
				for (type in types) {
					if (types.hasOwnProperty(type)) {
						this.addListener(object, type, types[type], func);
					}
				}
			} else {
				types = Y.Utility.splitWords(types);

				for (x = 0, len = types.length; x < len; x++) {
					this.addListener(object, types[x], func, context);
				}
			}
		},

		addListener: function (object, type, callback, context) {
			var id, originalHandler, handler;

			id = type + Y.Stamp(callback) + (context ? '_' + Y.Stamp(context) : '');

			if (object[eventsKey] && object[eventsKey][id]) {
				return this;
			}

			handler = function (event) {
				return callback.call(context || object, event || Y.Window.event);
			};

			originalHandler = handler;

			/** @namespace this.addPointerListener */
			if (Y.UserAgent.Features.Pointer && type.indexOf('touch') === 0) {
				return this.addPointerListener(object, type, handler, id);
			}

			/** @namespace this.addDoubleTapListener */
			if (Y.UserAgent.Features.Touch && (type === 'dblclick') && this.addDoubleTapListener) {
				this.addDoubleTapListener(object, handler, id);
			}

			if (Y.Lang.hasProperty(object, 'addEventListener')) {
				if (type === 'mousewheel') {
					object.addEventListener('DOMMouseScroll', handler, false);
					object.addEventListener(type, handler, false);
				} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
					handler = function (event) {
						event = event || Y.Window.event;
						if (!Y.DOM.Event._checkMouse(object, event)) {
							return;
						}
						return originalHandler(event);
					};

					object.addEventListener(type === 'mouseenter' ? 'mouseover' : 'mouseout', handler, false);
				} else {
					if (type === 'click' && Y.UserAgent.OS.Android) {
						handler = function (event) {
							return Y.DOM.Event._filterClick(event, originalHandler);
						};
					}

					object.addEventListener(type, handler, false);
				}
			} else if (Y.Lang.hasProperty(object, 'attachEvent')) {
				object.attachEvent('on' + type, handler);
			}

			object[eventsKey] = object[eventsKey] || {};
			object[eventsKey][id] = handler;

			return this;
		},

		off: function (object, types, func, context) {
			var type, x, len;

			if (Y.Lang.isObject(types)) {
				for (type in types) {
					if (types.hasOwnProperty(type)) {
						this.removeListener(object, type, types[type], func);
					}
				}
			} else {
				types = Y.Utility.splitWords(types);

				for (x = 0, len = types.length; x < len; x++) {
					this.removeListener(object, types[x], func, context);
				}
			}
		},

		removeListener: function (object, type, callback, context) {
			var id, handler;

			id = type + Y.Stamp(callback) + (context ? '_' + Y.Stamp(context) : '');

			handler = object[eventsKey] && object[eventsKey][id];

			if (!handler) {
				return this;
			}

			/** @namespace this.removePointerListener */
			/** @namespace this.removeDoubleTapListener */
			if (Y.UserAgent.Features.Pointer && type.indexOf('touch') === 0) {
				this.removePointerListener(object, type, id);
			} else if (Y.UserAgent.Features.Touch && (type === 'dblclick') && this.removeDoubleTapListener) {
				this.removeDoubleTapListener(object, id);
			} else if (Y.Lang.hasProperty(object, 'removeEventListener')) {
				if (type === 'mousewheel') {
					object.removeEventListener('DOMMouseScroll', handler, false);
					object.removeEventListener(type, handler, false);
				} else {
					object.removeEventListener(
							type === 'mouseenter' ? 'mouseover' :
								type === 'mouseleave' ? 'mouseout' : type, handler, false);
				}
			} else if (Y.Lang.hasProperty(object, 'detachEvent')) {
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
			// fakes stopPropagation by setting a special event flag, checked/reset with Y.DOM.Event._skipped(e)
			Y.DOM.Event._skipEvents[event.type] = true;
		},

		_skipped: function (event) {
			var skipped = this._skipEvents[event.type];
			// reset when checking, as it's only used in map container and propagates outside of the map
			this._skipEvents[event.type] = false;
			return skipped;
		},

		// check if element really left/entered the event target (for mouseenter/mouseleave)
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

	// Y.DOM.Event.on = Y.DOM.Event.addListener;
	// Y.DOM.Event.off = Y.DOM.Event.removeListener;

	Y.DOM.Event.wheelDelta = Y.DOM.Event.getWheelDelta;

	//---

	Y.Extend(Y.DOM.Event, {
		add: function (element, events, func, data, selector, delegator, capture) {
			var set = eventHandlers(element);
			var callback;

			events.split(/\s/).forEach(function (event) {
				if (event === 'ready') {
					return Y.DOM(document).ready(func);
				}

				var handler = parse(event);

				handler.callback = func;
				handler.selector = selector;

				// Emulate mouseenter, mouseleave
				if (Y.HasOwnProperty.call(hover, handler.e)) {
					func = function (e) {
						var related = e.relatedTarget;

						if (!related || (related !== this && !Y.DOM.contains(this, related))) {
							return handler.callback.apply(this, arguments);
						}
					};
				}

				handler.del = delegator;

				callback = delegator || func;

				handler.proxy = function (e) {
					e = compatible(e);

					if (e.isImmediatePropagationStopped()) {
						return;
					}

					e.data = data;

					var result = callback.apply(element, e._args === undef ? [e] : [e].concat(e._args));

					if (result === false) {
						e.preventDefault();
						e.stopPropagation();
					}

					return result;
				};

				handler.i = set.length;

				set.push(handler);

				if (Y.Lang.hasProperty(element, 'addEventListener')) {
					Y.DOM.Event.addListener(element, realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
				}
			});
		},

		remove: function (element, events, func, selector, capture) {
			(events || '').split(/\s/).forEach(function (event) {
				findHandlers(element, event, func, selector).forEach(function (handler) {
					delete eventHandlers(element)[handler.i];

					if (Y.Lang.hasProperty(element, 'removeEventListener')) {
						Y.DOM.Event.removeListener(element, realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
					}
				});
			});
		},

		special: Object.create({})
	});

	//---

	Y.DOM.proxy = Y.DOM.Proxy = function (callback, context) {
		var result, proxyFn, args;

		args = (2 in arguments) && Y.G.Slice.call(arguments, 2);

		if (Y.Lang.isFunction(callback)) {

			proxyFn = function () {
				return callback.apply(context, args ? args.concat(Y.G.Slice.call(arguments)) : arguments);
			};

			proxyFn.YID = yID(callback);

			proxyFn.GUID = callback.GUID = callback.GUID || proxyFn.GUID || Y.DOM.GUID++;

			result = proxyFn;
		} else if (Y.Lang.isString(context)) {
			//result = Y.DOM.Proxy(callback[context], callback);

			if (args) {
				args.unshift(callback[context], callback);
				result = Y.DOM.Proxy.apply(null, args);
			} else {
				result = Y.DOM.Proxy.apply(callback[context], callback);
			}
		} else {
			throw new TypeError('expected function');
		}

		// Y.LOG(result);

		return result;
	};

	Y.DOM.Function.bind = function (eventName, data, callback) {
		// Y.LOG(arguments);
		// return this.on(eventName, data, callback);
		return this.on(eventName, data, callback);
	};

	Y.DOM.Function.bindEvent = function (eventName, data, callback) {
		// Y.LOG(arguments);
		// return this.on(eventName, data, callback);
		return this.on(eventName, data, callback);
	};

	Y.DOM.Function.unbind = function (event, callback) {
		return this.off(event, callback);
	};

	Y.DOM.Function.one = function (event, selector, data, callback) {
		return this.on(event, selector, data, callback, 1);
	};

	Y.DOM.Function.delegate = function (selector, event, callback) {
		return this.on(event, selector, callback);
	};

	Y.DOM.Function.undelegate = function (selector, event, callback) {
		return this.off(event, selector, callback);
	};

	Y.DOM.Function.live = function (event, callback) {
		Y.DOM(Y.Document.body).delegate(this.selector, event, callback);
		return this;
	};

	Y.DOM.Function.die = function (event, callback) {
		Y.DOM(Y.Document.body).undelegate(this.selector, event, callback);
		return this;
	};

	Y.DOM.Function.on = function (event, selector, data, callback, one) {
		var autoRemove, delegator, $this = this;

		if (event && !Y.Lang.isString(event)) {
			Y.Each(event, function (type, func) {
				$this.on(type, selector, data, func, one);
			});

			return $this;
		}

		if (!Y.Lang.isString(selector) && !Y.Lang.isFunction(callback) && callback !== false) {
			callback = data;
			data = selector;
			selector = undef;
		}

		if (Y.Lang.isFunction(data) || data === false) {
			callback = data;
			data = undef;
		}

		if (callback === false) {
			callback = returnFalse;
		}

		return $this.each(function (_, element) {
			if (one) {
				autoRemove = function (event) {
					Y.DOM.Event.remove(element, event.type, callback);
					return callback.apply(this, arguments);
				};
			}

			if (selector) {
				delegator = function (event) {
					var evt,
						match = Y.DOM(event.target).closest(selector, element).get(0);

					if (match && match !== element) {
						evt = Y.Extend(createProxy(event), {
							currentTarget: match,
							liveFired: element
						});

						return (autoRemove || callback).apply(match, [evt].concat(Y.G.Slice.call(arguments, 1)));
					}
				};
			}

			Y.DOM.Event.add(element, event, callback, data, selector, delegator || autoRemove);
		});
	};

	Y.DOM.Function.off = function (event, selector, callback) {
		var $this = this;

		if (event && !Y.Lang.isString(event)) {
			Y.Each(event, function (type, func) {
				$this.off(type, selector, func);
			});

			return $this;
		}

		if (!Y.Lang.isString(selector) && !Y.Lang.isFunction(callback) && callback !== false) {
			callback = selector;
			selector = undef;
		}

		if (callback === false) {
			callback = returnFalse;
		}

		return $this.each(function () {
			Y.DOM.Event.remove(this, event, callback, selector);
		});
	};

	Y.DOM.Function.trigger = function (event, args) {
		if (Y.Lang.isString(event) || Y.Lang.isPlainObject(event)) {
			event = Y.DOM.Event(event);
		} else {
			event = compatible(event);
		}

		event._args = args;

		return this.each(function () {
			// items in the collection might not be Node elements
			if (Y.Lang.hasProperty(this, 'dispatchEvent')) {
				this.dispatchEvent(event);
			} else {
				Y.DOM(this).triggerHandler(event, args);
			}
		});
	};

	// triggers event handlers on current element just as if an event occurred,
	// doesn't trigger an actual event, doesn't bubble
	Y.DOM.Function.triggerHandler = function (event, args) {
		var e, result = null;

		this.each(function (i, element) {
			e = createProxy(Y.Lang.isString(event) ? Y.DOM.Event(event) : event);
			e._args = args;
			e.target = element;

			Y.Each(findHandlers(element, event.type || event), function (i, handler) {
				result = handler.proxy(e);

				if (e.isImmediatePropagationStopped()) {
					return false;
				}
			});
		});

		return result;
	};

	// Shortcut methods for `.bind(event, func)` for each event type
	[
		'focusin',
		'focusout',
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
	].forEach(function (event) {
		Y.DOM.Function[event] = function (callback) {
			return callback ?
				this.bind(event, callback) :
				this.trigger(event);
		};
	});

	Y.DOM.Function.hashchange = function (callback) {
		return callback ? this.bind('hashchange', callback) : this.trigger('hashchange', callback);
	};

	['focus', 'blur'].forEach(function (name) {
		Y.DOM.Function[name] = function (callback) {
			if (callback) {
				this.bind(name, callback);
			} else {
				this.each(function () {
					try {
						this[name]();
					} catch (err) {
						//...
						Y.ERROR(err);
					}
				});
			}

			return this;
		};
	});

	// Generate extended `remove` and `empty` functions
	['remove', 'empty'].forEach(function (method) {
		var origFn = Y.DOM.Function[method];

		Y.DOM.Function[method] = function () {
			var elements = this.find('*');

			if (method === 'remove') {
				elements = elements.add(this);
			}

			elements.forEach(function (element) {
				Y.DOM.Event.remove(element);
			});

			return origFn.call(this);
		};
	});

	//---

	Y.DOM.Event.prototype.isDefaultPrevented = function () {
		return this.defaultPrevented;
	};

	//---

}());

//---


/**
 * YAX DOM | Data
 *
 * Cross browser Ajax implementation using YAX's API [DOM]
 *
 * @version     0.15
 * @depends:    Core, DOM
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function () {

	'use strict';

	var jsonpID = 0,
		document = Y.Document,
		window = Y.Window,
		escape = encodeURIComponent,
		allTypes = '*/'.concat('*');

	//---

	// BEGIN OF [Private Functions]

	Y.DOM.AjaxActive = Y.DOM.active = 0;

	function globalEval(code) {
		var script, indirect = eval;

		code = Y.Lang.trim(code);

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
			if (!Y.Lang.isSet(--Y.DOM.active)) {
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
			if (mime === Y.RegEx.htmlType) {
				return 'html';
			}

			if (mime === Y.RegEx.jsonTypeReplacement.test(mime)) {
				return 'json';
			}

			if (Y.RegEx.scriptTypeReplacement.test(mime)) {
				return 'script';
			}

			if (Y.RegEx.xmlTypeReplacement.test(mime)) {
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
		if (options.processData && options.data && !Y.Lang.isString(options.data)) {
			options.data = Y.DOM.Parameters(options.data, options.traditional);
		}

		if (options.data && (!options.type || options.type.toUpperCase() === 'GET')) {
			options.url = appendQuery(options.url, options.data);
			options.data = undefined;
		}
	}

	// Handle optional data/success arguments
	function parseArguments(url, data, success, dataType) {
		var hasData = !Y.Lang.isFunction(data);

		return {
			url: url,
			data: hasData ? data : undefined,
			success: !hasData ? data : Y.Lang.isFunction(success) ? success : undefined,
			dataType: hasData ? dataType || success : success
		};
	}

	// END OF [Private Functions]

	//---

	Y.DOM.AjaxSettings = Object.create(null);

	//---

	Y.Extend(Y.DOM, {
		AjaxSettings: {
			// Default type of request
			type: 'GET',
			// Callback that is executed before request
			beforeSend: Y.Lang.noop,
			// Callback that is executed if the request succeeds
			success: Y.Lang.noop,
			// Callback that is executed the the server drops error
			error: Y.Lang.noop,
			// Callback that is executed on request complete (both: error and success)
			complete: Y.Lang.noop,
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
				html: Y.RegEx.htmlType,
				text: 'text/plain'
			},
			// Whether the request is to another domain
			crossDomain: false,
			// Default timeout
			timeout: 0,
			// Whether data should be serialized to string
			processData: true,
			// Whether the browser should be allowed to cache GET responses
			cache: true
		},

		/**
		 * @return string {params}
		 */
		Parameters: function (object, traditional) {
			var params = [];

			params.add = function (key, value) {
				this.push(escape(key) + '=' + escape(value));
			};

			Y.Utility.Serialise(params, object, traditional);

			return params.join('&').replace(/%20/g, '+');
		}
	});

	//---

	Y.Extend(Y.DOM, {
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
				callbackName = Y.Lang.isFunction(_callbackName) ? _callbackName() :
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

				// Y.Window[callbackName] = function (data) {
				//				window[callbackName] = function (data) {
				//					ajaxSuccess(data, xhr, options);
				//				};

				Y.Window[callbackName] = originalCallback;

				if (responseData && Y.Lang.isFunction(originalCallback)) {
					originalCallback(responseData[0]);
				}

				originalCallback = responseData = undefined;
			});

			if (ajaxBeforeSend(xhr, options) === false) {
				abort('abort');
				return xhr;
			}

			Y.Window[callbackName] = function () {
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
			var settings = Y.Extend({}, options || {}),
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
					RegExp.$2 !== Y.Location.host;
			}

			if (!settings.url) {
				settings.url = Y.Location.toString();
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

			//Y.Log(dataType);

			mime = settings.accepts[dataType];

			headers = {};

			setHeader = function (name, value) {
				// headers[name.toLowerCase()] = [name, value];
				headers[name] = [name, value];
			};

			protocol = /^([\w\-]+:)\/\//.test(settings.url) ? RegExp.$1 : Y.Location.protocol;

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

			settings.headers = Y.Extend(headers, settings.headers, {});

			xhr.setRequestHeader = setHeader;

			// Y.Log(mime);

			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					xhr.onreadystatechange = Y.Lang.noop;

					clearTimeout(abortTimeout);

					var result, error = false;

					// Y.Log(xhr);

					if (
						(xhr.status >= 200 && xhr.status < 300) ||
						xhr.status === 304 ||
						(xhr.status === 0 && protocol === 'file:')
					) {
						dataType = dataType || mimeToDataType(xhr.getResponseHeader(
							'content-type'));

						result = xhr.responseText;

						// Y.Log(dataType);

						try {
							// http://perfectionkills.com/global-eval-what-are-the-options/
							if (dataType === 'script') {
								globalEval(result);
							}

							if (dataType === 'xml') {
								result = xhr.responseXML;
							}

							if (dataType === 'json') {
								// globalEval(result);
								result = Y.RegEx.blankReplacement.test(result) ? null : Y.Lang.parseJSON(
									result);
							}
						} catch (err) {
							error = err;
							//							Y.ERROR(err);
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
					xhr.onreadystatechange = Y.Lang.noop;
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

	Y.Extend(Y.DOM, {
		get: Y.DOM.Get,
		post: Y.DOM.Post,
		ajax: Y.DOM.Ajax,
		JSON: Y.DOM.getJSON,
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
			self.html(selector ? Y.DOM('<div>').html(response.replace(Y.RegEx.scriptReplacement,
				'')).find(selector) : response);

			if (callback) {
				callback.apply(self, arguments);
			}

			// callback && callback.apply(self, arguments);
		};

		Y.DOM.Ajax(options);

		return this;
	};

	//---

	/**
	 * Extend YAX's AJAX beforeSend method by setting an X-CSRFToken on any
	 * 'unsafe' request methods.
	 **/
	Y.Extend(Y.DOM.AjaxSettings, {
		beforeSend: function (xhr, settings) {
			if (!(/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type)) && sameOrigin(
				settings.url)) {
				xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
			}
		}
	});

	//---

}());

//---


/**
 * YAX Node | FX
 *
 * Cross browser animation implementation using YAX's API [Node]
 *
 * @version     0.15
 * @depends:    Core, Node
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y */

//---

(function (undef) {

	'use strict';

	var prefix = '',
		eventPrefix = undef,
		vendors = {
			Webkit: 'webkit',
			Moz: 'Moz',
			O: 'o',
			ms: 'MS'
		},

		document = Y.Document,
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

	Y.Each(vendors, function (vendor, event) {
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
		if (Y.Lang.isFunction(duration)) {
			callback = duration;
			ease = undef;
			duration = undef;
		}

		if (Y.Lang.isFunction(ease)) {
			callback = ease;
			ease = undef;
		}

		if (Y.Lang.isPlainObject(duration)) {
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
			if (!Y.Lang.isUndefined(event)) {
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

	Y.Extend(Y.DOM, {
		queue: function (elem, type, data) {
			var queue;

			if (elem) {
				type = (type || 'fx') + 'queue';
				queue = Y.DOM.dataPrivative.get(elem, type);

				// Speed up dequeue by getting out quickly if this is just a lookup
				if (data) {
					if (!queue || Y.Lang.isArray(data)) {
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

	Y.Extend(Y.DOM.Function, {
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

}());

//---

/**
 * YAX Node | FX
 *
 * Cross browser animation implementation using YAX's API [Node]
 *
 * @version     0.15
 * @depends:    Core, Node
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y */

//---

(function (undef) {

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

//---

/**
 * YAX Node | Form
 *
 * Cross browser form implementation using YAX's API [Node]
 *
 * @version     0.15
 * @depends:    Core, Node
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y */

//---

(function () {

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

//---


/**
 * YAX Node | Extra
 *
 * Cross browser extra functions using YAX's API [Node]
 *
 * @version     0.15
 * @depends:    Core, Node
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y, transitionProperty, transitionDuration, transitionTiming*/

(function () {

	'use strict';

	// YAX Timers
	Y.Extend(Y.DOM.Function, {
		everyTime: function (interval, label, fn, times, belay) {
			//console.log(this);
			return this.each(function () {
				Y.DOM.timer.add(this, interval, label, fn, times, belay);
			});
		},
		oneTime: function (interval, label, fn) {
			return this.each(function () {
				Y.DOM.timer.add(this, interval, label, fn, 1);
			});
		},
		stopTime: function (label, fn) {
			return this.each(function () {
				Y.DOM.timer.remove(this, label, fn);
			});
		}
	});

	Y.Extend(Y.DOM, {
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

				result = this.regex.exec(Y.Lang.trim(value.toString()));

				if (result[2]) {
					num = parseInt(result[1], 10);
					mult = this.powers[result[2]] || 1;
					return num * mult;
				}

				return value;
			},
			add: function (element, interval, label, fn, times, belay) {
				var counter = 0,
					handler;

				if (Y.Lang.isFunction(label)) {
					if (!times) {
						times = fn;
					}
					fn = label;
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
				fn.$timerID = fn.$timerID || this.GUID++;

				handler = function () {
					if (belay && handler.inProgress) {
						return;
					}
					handler.inProgress = true;
					if ((++counter > times && times !== 0) ||
						fn.call(element, counter) === false) {
						Y.DOM.timer.remove(element, label, fn);
					}
					handler.inProgress = false;
				};

				handler.$timerID = fn.$timerID;

				if (!element.$timers[label][fn.$timerID]) {
					element.$timers[label][fn.$timerID] = window.setInterval(handler,
						interval);
				}

				if (!this.global[label]) {
					this.global[label] = [];
				}
				this.global[label].push(element);

			},
			remove: function (element, label, fn) {
				var timers = element.$timers,
					ret, lab, _fn;

				if (timers) {

					if (!label) {
						for (lab in timers) {
							if (timers.hasOwnProperty(lab)) {
								this.remove(element, lab, fn);
							}
						}
					} else if (timers[label]) {
						if (fn) {
							if (fn.$timerID) {
								window.clearInterval(timers[label][fn.$timerID]);
								delete timers[label][fn.$timerID];
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
							//if (Y.HasOwnProperty.call(timers, ret)) {
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

	var prefix = Y.DOM.fx.cssPrefix;
	var transitionEnd = Y.DOM.fx.transitionEnd;
	var cssReset = Object.create({});

	var transitionProperty;
	var transitionDuration;
	var transitionTiming;

	cssReset[transitionProperty = prefix + 'transition-property'] =
		cssReset[transitionDuration = prefix + 'transition-duration'] =
		cssReset[transitionTiming = prefix + 'transition-timing-function'] = '';

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
			// style = Y.Document.defaultView.getComputedStyle(this.get(0), '');
			style = Y.DOM.getDocStyles(this.get(0));

			for (x = 0; x < props.length; x++) {
				this.css(props[x], style.getPropertyValue(props[x]));
			}
		}

		if (cancelCallback) {
			this.unbind(transitionEnd).css(cssReset);
		} else {
			this.trigger(transitionEnd);
		}

		return this;
	};

	//---

	Y.Extend(Y.DOM.Function, {
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

	Y.Extend(Y.DOM.Function, {
		role: function () {
			var args = Y.G.Slice.call(arguments);
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

//---

/**
 * YAX Node | Event Logger
 *
 *
 * @version     0.15
 * @depends:    Core, Node, Events
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jshint -W040 */
/*jslint node: false */
/*global YAX, Y */

//---

(function () {

	'use strict';

	//---
	function consoleOutput(e) {
		if (e.data.color) {
			var style = 'color:' + e.data.color;
			Y.LOG('%c' + e.type + ' on ' + this.tagName, style);
		} else {
			Y.LOG(e.type + ' on ' + this.tagName);
		}
	}

	function getCollectionObj(selector) {
		var obj = {};
		switch (typeof selector) {
			case 'string':
				obj = Y.DOM(selector);
				break;
			case 'object':
				obj = selector;
				break;
		}
		return obj;
	}

	Y.DOM.Function.EventLoggerStart = function (event, color) {
		var fontColor = Y.Lang.isString(color) ? color : '';

		this.on(event, {color: fontColor}, consoleOutput);

		return this;
	};

	Y.DOM.Function.EventLoggerEnd = function (event) {
		this.off(event, consoleOutput);

		return this;
	};

	Y.Window.EventLogger = {
		start: function (selector, event, color) {
			var fontColor = Y.Lang.isString(color) ? color : '';

			var obj = getCollectionObj(selector);

			obj.on(event, {
				color: fontColor
			}, consoleOutput);

			return obj;
		},
		end: function (selector, event) {
			var obj = getCollectionObj(selector);

			obj.off(event, consoleOutput);

			return obj;
		}
	};

	//---

}());

//---


/**
 * Node/DOM Compatibility
 *
 * Compatibility Module for YAX's DOM API.
 *
 * @version     0.15
 * @depends:    Core
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*jshint node: true */
/*global Y, YAX */

(function () {

	'use strict';

	//---

	// Map over Yax.DOM in case of overwrite
	var _YaxDOM = Y.Window.Y.Node;

	// Map over the $ in case of overwrite
	var _$ = Y.Window.$;

	_YaxDOM.noConflict = function (deep) {
		if (Y.Window.$ === Y.Node) {
			Y.Window.$ = _$;
		}

		if (deep && Y.Window.Y.Node === Y.Node) {
			Y.Window.Y.Node = _YaxDOM;
		}

		return Y.Node;
	};

	//---

	// Y.G.Compatibility = true;

	// Y.DOM._temp = Object.create({});

	Y.DOM.camelCase = Y.Lang.camelise;
	Y.DOM.isReady = true;
	Y.DOM.isArray = Y.Lang.isArray;
	Y.DOM.isFunction = Y.Lang.isFunction;
	Y.DOM.isWindow = Y.Lang.isWindow;
	Y.DOM.trim = Y.Lang.trim;
	Y.DOM.type = Y.Lang.type;
	Y.DOM.isNumeric = Y.Lang.isNumeric;
	Y.DOM.isEmptyObject = Y.Lang.isObjectEmpty;
	Y.DOM.noop = Y.DOM.Noop = Y.Lang.noop;

	Y.DOM.when = Y.Lang.When;

	Y.DOM.Deferred = Y.G.Deferred;
	Y.DOM.Callbacks = Y.G.Callbacks;

	Y.DOM.cssHooks = Y.DOM.CSS_Hooks;
	Y.DOM.cssNumber = Y.DOM.CSS_Number;
	Y.DOM.cssProps = Y.DOM.CSS_Properities;

	Y.DOM.expando = Y.DOM.Expando;

	// The deferred used on DOM ready
	var readyList = null;

	Y.DOM.Function.ready = function (callback) {
		// Add the callback
		Y.DOM.ready.promise(this).done(callback);

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

			// Abort if there are pending holds or we're already ready
			/*if (wait === true ? --Y.DOM.readyWait : Y.DOM.isReady) {
				return;
			}*/

			// Y.LOG(wait === true ? --Y.DOM.readyWait : Y.DOM.isReady);

			tmp1 = (wait === true ? --Y.DOM.readyWait : Y.DOM.isReady);

			// Y.LOG(tmp)

			// Abort if there are pending holds or we're already ready
			if (tmp1) {
				return;
			}

			// Remember that the DOM is ready
			Y.DOM.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			/*if (wait !== true && --Y.DOM.readyWait > 0) {
				return;
			}*/

			tmp2 = (wait !== true && --Y.DOM.readyWait > 0);

			if (tmp2) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith(Y.Document, [Y.DOM]);

			// Trigger any bound ready events
			if (Y.DOM.fn.triggerHandler) {
				Y.DOM(Y.Document).triggerHandler('ready');
				Y.DOM(Y.Document).off('ready');
			}
		}
	});

	/**
	 * The ready event handler and self cleanup method
	 */
	function completed() {
		Y.Document.removeEventListener('DOMContentLoaded', completed, false);
		Y.Window.removeEventListener('load', completed, false);
		Y.DOM.ready();
	}

	Y.DOM.ready.promise = function (obj) {
		// Y.LOG(readyList);

		if (!readyList) {
			readyList = Y.DOM.Deferred();

			// Catch cases where $(document).ready() is called after the browser event has already occurred.
			// we once tried to use readyState 'interactive' here, but it caused issues like the one
			// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
			if (Y.Document.readyState === 'complete') {
				// Handle it asynchronously to allow scripts the opportunity to delay ready
				setTimeout(Y.DOM.ready);
			} else {
				// Use the handy event callback
				Y.Document.addEventListener('DOMContentLoaded', completed, false);

				// A fallback to Y.Window.onload, that will always work
				Y.Window.addEventListener('load', completed, false);
			}
		}

		return readyList.promise(obj);
	};

	// Kick off the DOM ready check even if the user does not
	Y.DOM.ready.promise();

	if (Y.HasOwnProperty.call(Y.Window, 'Sizzle')) {
		Y.DOM.isXMLDoc = Y.Window.Sizzle.isXML;
		Y.DOM.text = Y.DOM.Text = Y.Window.Sizzle.getText;
	}

	//---

	Y.DOM.event.simulate = function (type, elem, event, bubble) {
		var e = Y.Extend(new Y.DOM.Event(type), event, {
			type: type,
			isSimulated: true,
			originalEvent: {},
			bubbles: true
		});

		Y.DOM(elem).trigger(e);

		if (e.isDefaultPrevented()) {
			event.preventDefault();
		}
	};

	Y.DOM.each({
		focus: 'focusin',
		blur: 'focusout'
	}, function (orig, fix) {
		var attaches = 0;

		var handler = function (event) {
			Y.DOM.event.simulate(fix, event.target, Y.Extend({}, event), true);
		};

		Y.DOM.event.special[fix] = {
			setup: function () {
				if (attaches++ === 0) {
					Y.Document.addEventListener(orig, handler, true);
				}
			},

			teardown: function () {
				if (--attaches === 0) {
					Y.Document.removeEventListener(orig, handler, true);
				}
			}
		};
	});

	//---

	Y.Window.cordova = document.URL.indexOf('http://') === -1 && Y.Document.URL.indexOf('https://') === -1;

	if (Y.Window.cordova === false) {
		Y.DOM(function () {
			Y.DOM(Y.Document).trigger('deviceready');
		});
	}


	//---

}());

//---


/**
 * YAX Node | Special Event
 *
 * Cross browser special event implementation using YAX's API [Node]
 *
 * @version     0.15
 * @depends:    Core, Node, Events
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y */

//---

(function () {

	'use strict';

	//---

	Y.DOM.Function.bind = function (eventName, data, callback) {
		var el = this;
		// var $this = Y.DOM(el);
		var specialEvent;

		if (!Y.Lang.isSet(callback)) {
			callback = data;
			data = null;
		}

		if (Y.DOM.YAXDOM) {
			Y.DOM.each(eventName.split(/\s/), function (i, eventName) {
				eventName = eventName.split(/\./)[0];

				var tmp = Y.HasOwnProperty.call(Y.DOM.Event.special, eventName);

				if (tmp) {
					specialEvent = Y.DOM.event.special[eventName];

					/// init enable special events on Y.DOM
					if (!specialEvent._init) {
						specialEvent._init = true;

						/// intercept and replace the special event handler to add functionality
						specialEvent.originalHandler = specialEvent.handler;

						specialEvent.handler = function () {
							/// make event argument writable, like on jQuery
							var args = Y.G.Slice.call(arguments);

							args[0] = Y.Extend({}, args[0]);

							/// define the event handle, Y.DOM.event.dispatch is only for newer versions of jQuery
							Y.DOM.Event.handle = function () {
								/// make context of trigger the event element
								var args_ = Y.G.Slice.call(arguments);
								var event = args_[0];
								var $target = Y.DOM(event.target);

								$target.trigger.apply($target, arguments);

							};

							specialEvent.originalHandler.apply(this, args);
						};
					}

					//Y.LOG(el);
					//Y.LOG(data);
					//Y.LOG(specialEvent);
					//Y.LOG(eventName);
					//Y.LOG(eventName);

					/// setup special events on Y.DOM
					// specialEvent.setup.apply(el, [data]);
					specialEvent.setup.apply(el, [data]);
				}
			});
		}

		// Y.LOG(bindBeforeSpecialEvents);
//		Y.LOG(callback);

		// return bindBeforeSpecialEvents.apply(this, [eventName, callback]);
		// return Y.Window.bindBeforeSpecialEvents.apply(this, [eventName, callback]);
		// return Y.DOM.Function.bindEvent.apply(this, [eventName, callback]);
		return Y.DOM.Function.bindEvent.apply(this, [eventName, callback]);
	};

	//---

}());

//---


