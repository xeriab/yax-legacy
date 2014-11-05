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

	var init;

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
			(display === "none") && (display = "block");
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

	/*Y.DOM.Y = function(dom, selector) {
		dom = dom || [];
		// jshint -W103
		dom.__proto__ = Y.DOM.Function;
		dom.selector = selector || Y.empty;

		return dom;
	};*/

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

	/*Y.DOM.Function.parentsUntil_= function(selector, context) {
		var nodes = this;
		var collection = false;
		var parents = [];

		if (Y.isObject(selector)) {
			collection = Y.DOM(selector);
		}

		// jshint -W083
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
	};*/

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