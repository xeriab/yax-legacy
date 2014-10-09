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

	var YAXDOM = {};

	var $ = null;

	var classList;

	var idList;

	var docElem = Y.doc.documentElement;

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

	var _table = Y.doc.createElement('table');

	var _tableRow = Y.doc.createElement('tr');

	var _containers = {
		'tr': Y.doc.createElement('tbody'),
		'tbody': _table,
		'thead': _table,
		'tfoot': _table,
		'td': _tableRow,
		'th': _tableRow,
		'*': Y.doc.createElement('div')
	};

	var tempParent = Y.doc.createElement('div');

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

	var domNode;

	var classTag = 'YAX' + Y.now();

	//---

	$ = function(selector, context) {
		return YAXDOM.init(selector, context);
	};

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
		var args = Y.G.Slice.call(arguments);

		if (!Y.isUndefined(args[0])) {
			// return window.getComputedStyle(element, null);
			return Y.win.getComputedStyle(args[0], null);
		}
	}

	function getDocStyles() {
		var args = Y.G.Slice.call(arguments);

		if (!Y.isUndefined(args[0])) {
			// return window.getComputedStyle(element, null);
			return Y.doc.defaultView.getComputedStyle(args[0], null);
		}
	}

	function getWindow(element) {
		return Y.isWindow(element) ? element : element.nodeType === 9 &&
			element.defaultView;
	}

	function defaultDisplay(nodeName) {
		var element, display;

		if (!elementDisplay[nodeName]) {
			element = Y.doc.createElement(nodeName);
			Y.doc.body.appendChild(element);
			//display = getComputedStyle(element, Y.empty()).getPropertyValue("display");
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
			result = $.Function.concat.apply([], array);
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
			Y.G.Slice.call(element.children) :
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
				ret = $.Style(element, name);
			}

			// Support: Safari 5.1
			// A tribute to the "awesome hack by Dean Edwards"
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if (Y.RegEx.rnumnonpx.test(ret) && Y.RegEx.rmargin.test(name)) {
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
		var matches = Y.RegEx.rnumsplit.exec(value);
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
				val += $.CSS(element, extra + cssExpand[i], true, styles);
			}

			if (isBorderBox) {
				// border-box includes padding, so remove it if we want content
				if (extra === 'content') {
					val -= $.CSS(element, 'padding' + cssExpand[i], true, styles);
				}

				// at this point, extra isn't border nor margin, so remove border
				if (extra !== 'margin') {
					val -= $.CSS(element, 'border' + cssExpand[i] + 'Width', true,
						styles);
				}
			} else {
				// at this point, extra isn't content, so add padding
				val += $.CSS(element, 'padding' + cssExpand[i], true, styles);

				// at this point, extra isn't content nor padding, so add border
				if (extra !== 'padding') {
					val += $.CSS(element, 'border' + cssExpand[i] + 'Width', true,
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
			isBorderBox = $.Support.boxSizing && $.CSS(element, 'boxSizing',
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
			if (Y.RegEx.rnumnonpx.test(val.toString())) {
				return val;
			}

			// we need the check for style in case a browser which returns unreliable values
			// for getComputedStyle silently falls back to the reliable element.style
			valueIsBorderBox = isBorderBox && ($.Support.boxSizingReliable || val ===
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
				script = Y.doc.createElement('script');
				script.text = code;
				Y.doc.head.appendChild(script).parentNode.removeChild(script);
			} else {
				indirect(code);
			}
		}
	}

	// END OF [Private Functions]

	//---

	Y.extend(YAXDOM, {
		/**
		 *
		 * @param element
		 * @param selector
		 * @returns {*}
		 * @constructor
		 */
		Matches: function(element, selector) {
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

			// result = ~YAXDOM.QSA(parent, selector).indexOf(element);
			/* jshint -W052 */
			result = ~YAXDOM.QSA(parent, selector).indexOf(element);

			// temp && tempParent.appendChild(element);

			if (temp) {
				tempParent.appendChild(element);
			}

			return result;
		},

		// `YAXDOM.Fragment` takes a html string and an optional tag name
		// to generate DOM nodes from the given html string.
		// The generated DOM nodes are returned as an array.
		// This function can be overriden in plugins for example to make
		// it compatible with browsers that don't support the DOM fully.
		Fragment: function(html, name, properties) {
			var dom, nodes, container, self;

			// A special case optimization for a single tag
			if (Y.RegEx.SingleTagReplacement.test(html)) {
				dom = $(Y.doc.createElement(RegExp.$1));
			}

			if (!dom) {
				if (html.replace) {
					html = html.replace(Y.RegEx.TagExpanderReplacement, '<$1></$2>');
				}

				if (name === undef) {
					name = Y.RegEx.FragmentReplacement.test(html) && RegExp.$1;
				}

				if (!(Y.hasOwn.call(_containers, name))) {
					name = '*';
				}

				container = _containers[name];

				container.innerHTML = Y.empty() + html;

				dom = Y.each(Y.G.Slice.call(container.childNodes), function() {
					self = this;
					// container.removeChild(this);
					container.removeChild(self);
				});
			}

			if (Y.isPlainObject(properties)) {
				nodes = $(dom);

				Y.each(properties, function(key, value) {
					if (MethodAttributes.indexOf(key) > -1) {
						nodes[key](value);
					} else {
						nodes.attr(key, value);
					}
				});
			}

			return dom;
		},

		// `YAXDOM.init` is $'s counterpart to jQuery's `$.Function.init` and
		// takes a CSS selector and an optional context (and handles various
		// special cases).
		// This method can be overriden in plugins.
		init: function(selector, context) {
			var dom;

			// If nothing given, return an empty YAX collection
			if (!selector) {
				return YAXDOM.Y();
			}

			if (Y.isString(selector)) {
				// Optimize for string selectors
				selector = selector.trim();

				// If it's a html Fragment, create nodes from it
				// Note: In both Chrome 21 and Firefox 15, DOM error 12
				// is thrown if the Fragment doesn't begin with <
				// if (selector[0] === '<' && Y.RegEx.FragmentReplacement.test(selector)) {
				if (selector[0] === '<' && selector[selector.length - 1] === '>' &&
					Y.RegEx.FragmentReplacement.test(selector) && selector.length >= 3) {
					dom = YAXDOM.Fragment(selector, RegExp.$1, context);
					// selector = selector.replace('<', '').replace('>', '');
					selector = null;
				} else if (context !== undef) {
					// If there's a context, create a collection on that context first, and select nodes from there
					return $(context).find(selector);
				} else {
					// If it's a CSS selector, use it to select nodes.
					dom = this.QSA(Y.doc, selector);
				}
			}

			// If a function is given, call it when the DOM is ready
			else if (Y.isFunction(selector)) {
				return $(Y.doc).ready(selector);
				// If a YAX collection is given, just return it
			} else if (this.isY(selector)) {
				return selector;
			} else {
				// normalize array if an array of nodes is given
				if (Y.isArray(selector)) {
					dom = Y.compact(selector);
					// dom = $.makeArray(selector, this.Y());
					// Wrap DOM nodes.
				} else if (Y.isObject(selector)) {
					dom = [selector];
					selector = null;
					// If it's a html Fragment, create nodes from it
				} else if (Y.RegEx.FragmentReplacement.test(selector)) {
					dom = this.Fragment(selector.trim(), RegExp.$1, context);
					selector = null;
					// If there's a context, create a collection on that context first, and select
					// nodes from there
				} else if (Y.isDefined(context)) {
					return $(context).find(selector);
					// console.log(context);
					//result = $(context).find(selector);
					// And last but no least, if it's a CSS selector, use it to select nodes.
				} else {
					dom = this.QSA(Y.doc, selector);
				}
			}

			// Create a new YAXDOM collection from the nodes found
			return this.Y(dom, selector);
		},

		// `YAXDOM.QSA` is YAX's CSS selector implementation which
		// uses `Y.doc.querySelectorAll` and optimizes for some special cases, like `#id`.
		// This method can be overriden in plugins.
		QSA: function(element, selector) {
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

			isSimple = Y.RegEx.SimpleSelectorReplacement.test(nameOnly);

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

		// `YAXDOM.Y` swaps out the prototype of the given `DOM` array
		// of nodes with `$.Function` and thus supplying all the $ functions
		// to the array. Note that `__proto__` is not supported on Internet
		// Explorer. This method can be overriden in Plugins.
		Y: function(dom, selector) {
			var result;

			result = dom || [];
			// result = dom || {};
			/* jshint -W103 */
			// result.__proto__ = $.Function;
			/** @namespace Object.setPrototypeOf */
			Object.setPrototypeOf(result, $.Function);
			result.selector = selector || Y.empty();
			result.size = result.length;

			return result;
		},

		/**
		 * YAXDOM.isY` should return `true` if the given object is
		 * a YAX.DOM collection. This method can be overriden in plugins.
		 */
		isY: function(object) {
			return object instanceof this.Y;
		}
	});

	//---

	function filtered(nodes, selector) {
		var result;

		if (Y.isNull(selector) || Y.isUndefined(selector) || Y.isEmpty(
			selector)) {
			result = $(nodes);
		} else {
			result = $(nodes).filter(selector);
		}

		return result;
	}

	//---

	/**
	 * Y.domNode is a DOM class that $ classes inherit from.
	 */
	Y.domNode = Y.Class.extend({
		_class_name: 'DOM',

		getStyle: function(elem, style) {
			var value, css;

			value = elem.style[style] || (elem.currentStyle && elem.currentStyle[style]);

			if ((!value || value === 'auto') && Y.doc.defaultView) {
				css = Y.doc.defaultView.getComputedStyle(elem, null);
				value = css ? css[style] : null;
			}

			return value === 'auto' ? null : value;
		},

		documentIsLtr: function() {
			$.docIsLTR = $.docIsLTR || domNode.getStyle(Y.doc.body,
				'direction') === 'ltr';
			return $.docIsLTR;
		},

		Function: {
			'YAX.DOM': '0.10',
			// Because a collection acts like an array
			// copy over these useful array functions.
			forEach: Y.G.ArrayProto.forEach,
			reduce: Y.G.ArrayProto.reduce,
			push: Y.G.Push,
			sort: Y.G.ArrayProto.sort,
			indexOf: Y.G.IndexOf,
			concat: Y.G.Concat,
			extend: Y.extend,
			// `map` and `slice` in the jQuery API work differently
			// from their array counterparts
			map: function(callback) {
				return $(map(this, function(elem, i) {
					return callback.call(elem, i, elem);
				}));
			},
			slice: function() {
				return $(Y.G.Slice.apply(this, arguments));
				// return $.pushStack(Slice.apply(this, arguments));
			},
			ready: function(callback) {
				// need to check if Y.doc.body exists for IE as that browser reports
				// Y.doc ready when it hasn't yet created the body element
				if (Y.RegEx.ReadyReplacement.test(Y.callProperty(Y.doc, 'readyState')) &&
					Y.doc.body) {
					callback($);
				} else {
					Y.doc.addEventListener('DOMContentLoaded', function() {
						callback($);
					}, false);
				}

				return this;
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
				return Y.G.Slice.call(this);
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
			each: function(callback) {
				Y.G.ArrayProto.every.call(this, function(elem, index) {
					return callback.call(elem, index, elem) !== false;
				});

				return this;
			},
			filter: function(selector) {
				if (Y.isFunction(selector)) {
					return this.not(this.not(selector));
				}

				return $(Y.G.Filter.call(this, function(element) {
					return YAXDOM.Matches(element, selector);
				}));
			},
			add: function(selector, context) {
				return $(Y.unique(this.concat($(selector, context))));
			},
			is: function(selector) {
				return this.length > 0 && YAXDOM.Matches(this[0], selector);
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
						(Y.likeArray(selector) && Y.isFunction(selector.item)) ? Y.G.Slice
							.call(selector) : $(selector);

					this.forEach(function(elem) {
						if (excludes.indexOf(elem) < 0) {
							nodes.push(elem);
						}
					});
				}

				return $(nodes);
			},
			has: function(selector) {
				return this.filter(function() {
					return Y.isObject(selector) ?
						contains(this, selector) :
						$(this).find(selector).size();
				});
			},
			eq: function(index) {
				return index === -1 ? this.slice(index) : this.slice(index, +index + 1);
			},
			first: function() {
				var elem = this[0];
				return elem && !Y.isObject(elem) ? elem : $(elem);
			},
			last: function() {
				var elem = this[this.length - 1];
				return elem && !Y.isObject(elem) ? elem : $(elem);
			},

			find: function(selector) {
				var result;
				var self = this;

				if (!selector) {
					result = [];
				} else if (Y.isObject(selector)) {
					result = $(selector).filter(function() {
						var node = this;

						return Y.G.ArrayProto.some.call(self, function(parent) {
							return $.contains(parent, node);
						});
					});
				} else if (this.length === 1) {
					result = $(YAXDOM.QSA(this[0], selector));
				} else {
					result = this.map(function() {
						return YAXDOM.QSA(this, selector);
					});
				}

				return result;
			},

			closest: function(selector, context) {
				var node = this[0],
					collection = false;

				if (Y.isObject(selector)) {
					collection = $(selector);
				}

				while (node && Y.isFalse(collection ? collection.indexOf(node) >= 0 :
					YAXDOM.Matches(node, selector))) {
					node = node !== context && !Y.isDocument(node) && node.parentNode;
				}

				return $(node);
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
					return Y.G.Slice.call(this.childNodes);
				});
			},
			siblings: function(selector) {
				return filtered(this.map(function(i, elem) {
					return Y.G.Filter.call(children(elem.parentNode), function(child) {
						return child !== elem;
					});
				}), selector);
			},
			empty: function() {
				return this.each(function() {
					this.innerHTML = Y.empty();
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
						this.style.display = Y.empty();
					}

					// this.style.display === 'none' && (this.style.display = Y.empty());

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
					dom = $(structure).get(0);
					clone = dom.parentNode || this.length > 1;
				}

				return this.each(function(index) {
					$(this).wrapAll(
						func ? structure.call(this, index) :
							clone ? dom.cloneNode(true) : dom
					);
				});
			},
			wrapAll: function(structure) {
				if (this[0]) {
					$(this[0]).before(structure = $(structure));

					var childreno, self = this;

					// Drill down to the inmost element
					childreno = structure.children();

					while (childreno.length) {
						structure = children.first();
					}

					$(structure).append(self);
				}

				return this;
			},
			wrapInner: function(structure) {
				var func = Y.isFunction(structure),
					self, dom, contents;
				return this.each(function(index) {
					self = $(this);

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
					$(this).replaceWith($(this).children());
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
					var elem = $(this),
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
				return $(this.pluck('previousElementSibling')).filter(selector ||
					'*');
			},
			next: function(selector) {
				return $(this.pluck('nextElementSibling')).filter(selector || '*');
			},
			html: function(html) {
				return arguments.length === 0 ?
					(this.length > 0 ? this[0].innerHTML : null) :
					this.each(function(index) {
						var originHtml = this.innerHTML;
						$(this).empty().append(functionArgument(this, html, index,
							originHtml));
					});
			},
			text: function(text) {
				return arguments.length === 0 ?
					(this.length > 0 ? this[0].textContent : null) :
					this.each(function() {
						this.textContent = (text === undef) ? Y.empty() : Y.empty() +
							text;
					});
			},
			title: function(title) {
				return arguments.length === 0 ?
					(this.length > 0 ? this[0].title : null) :
					this.each(function() {
						this.title = (title === undef) ? Y.empty() : Y.empty() +
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
						$(this[0]).find('option').filter(function() {
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
						$(this[0]).find('option').filter(function() {
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
						var $this = $(this),
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
						left: obj.left + Y.win.pageXOffset + 'px',
						top: obj.top + Y.win.pageYOffset + 'px',
						width: Math.round(obj.width) + 'px',
						height: Math.round(obj.height) + 'px'
					};
				};

				return {
					left: obj.left + Y.win.pageXOffset,
					top: obj.top + Y.win.pageYOffset,
					width: Math.round(obj.width),
					height: Math.round(obj.height)
				};
			},
			getOffset: function(options) {
				if (arguments.length) {
					return options === undef ?
						this :
						this.each(function(i) {
							$.offset.setOffset(this, options, i);
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

				docElem = Y.doc.documentElement;

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

				return $.Access(this, function(element, name, value) {
					var styles, len, mapo = {},
						i = 0;

					if (Y.isArray(name)) {
						styles = getStyles(element);
						len = name.length;

						for (i; i < len; i++) {
							mapo[name[i]] = $.CSS(element, name[i], false, styles);
						}

						return mapo;
					}

					return value !== undef ?
						$.Style(element, name, value) :
						$.CSS(element, name);
				}, name, value, arguments.length > 1);
			},

			index: function(element) {
				//				if (!element) {
				//					return (this[0] && this[0].parentNode) ? this.first().prevAll().length : -1;
				//				}

				//				return this.indexOf($(element)[0]);

				//				if (Y.isString(element)) {
				//					return this.indexOf.call($(element), this[0]);
				//				}

				//				return this.indexOf.call(this, element.YAXDOM ? element[0] : element);

				return element ? this.indexOf($(element)[0]) : this.parent().children()
					.indexOf(this[0]);
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
						if (!$(this).hasId(ID)) {
							idList.push(ID);
						}
					}, this);

					if (idList.length) {
						idName(this, id + (id ? ' ' : Y.empty()) + idList.join(' '));
					}

					// idList.length && idName(this, id + (id ? ' ' : Y.empty()) + idList.join(' '));
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
						if (!$(this).hasClass(Class)) {
							classList.push(Class);
						}
					}, this);

					if (classList.length) {
						className(this, cls + (cls ? ' ' : Y.empty()) + classList.join(
							' '));
					}

					// classList.length && className(this, cls + (cls ? ' ' : Y.empty()) + classList.join(' '));
				});
			},
			removeId: function(name) {
				return this.each(function(index) {
					if (name === undef) {
						return idName(this, Y.empty());
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
						return className(this, Y.empty());
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
					var $this = $(this),
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
				if ($.CSS(element, 'position') === "fixed") {
					// We assume that getBoundingClientRect is available when computed position is fixed
					offset = element.getBoundingClientRect();

				} else {
					// Get *real* offsetParent
					offsetParent = this.offsetParent();

					// Get correct offsets
					offset = this.offset();

					if (!$.nodeName(offsetParent[0], "html")) {
						parentOffset = offsetParent.offset();
					}

					// Add offsetParent borders
					parentOffset.top += $.CSS(offsetParent[0], "borderTopWidth", true);
					parentOffset.left += $.CSS(offsetParent[0], "borderLeftWidth", true);
				}

				// Subtract parent offsets and element margins
				return {
					top: offset.top - parentOffset.top - $.CSS(element, "marginTop",
						true),
					left: offset.left - parentOffset.left - $.CSS(element, "marginLeft",
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
					parentOffset = Y.RegEx.RootNodeReplacement.test(offsetParent[0].nodeName) ? {
						top: 0,
						left: 0
					} : offsetParent.offset();

				// Subtract element margins
				// note: when an element has margin: auto the offsetLeft and marginLeft
				// are the same in Safari causing offset.left to incorrectly be 0
				offset.top -= parseFloat($(element).css('margin-top')) || 0;
				offset.left -= parseFloat($(element).css('margin-left')) || 0;

				// Add offsetParent borders
				parentOffset.top += parseFloat($(offsetParent[0]).css(
					'border-top-width')) || 0;
				parentOffset.left += parseFloat($(offsetParent[0]).css(
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

					while (offsetParent && (!$.nodeName(offsetParent, 'html') && $
						.CSS(offsetParent, 'position') === 'static')) {
						offsetParent = offsetParent.offsetParent;
					}

					return offsetParent || docElem;
				});
			},
			detach: function(selector) {
				return this.remove(selector, true);
				// return this.remove(selector);
			},
			splice: [].splice
		},
		// Y.unique for each copy of YAX on the page
		Expando: 'YAX' + (Y._INFO.VERSION.toString() + Y._INFO.BUILD.toString() +
			Y.randomNumber(10000, 70000)).replace(/\D/g, Y.empty()),
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
							return bulk.call($(element), value);
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
		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function(elems) {
			// Build a new YAX matched element set
			var ret = Y.merge(this.constructor(), elems);

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
			ret.context = this.context;

			// Return the newly-formed element set
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
			if (!element || element.nodeType === 3 || element.nodeType === 8 || !
				element.style) {
				return;
			}

			// Make sure that we're working with the right name
			var ret, hooks,
				origName = Y.camelise(name),
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
				ret = Y.RegEx.rrelNum.exec(value);

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
						// style.setProperty(name, Y.empty());
						style.setProperty(name, Y.empty(), Y.empty());
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
			if (Y.isEmpty(extra) || extra) {
				num = parseFloat(val);
				return extra === true || Y.isNumber(num) ? num || 0 : val;
			}

			return val;
		}
	}); // END OF Y.domNode CLASS

	//---

	domNode = Y.domNode.prototype;

	//---

	$.classTag = classTag;

	//---

	Y.extend($, {
		offset: {
			setOffset: function(element, options, i) {
				var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft,
					calculatePosition,
					position = $.CSS(element, "position"),
					curElem = $(element),
					props = {};

				// Set position first, in-case top/left are set even on static element
				if (position === "static") {
					element.style.position = "relative";
				}

				curOffset = curElem.offset();
				curCSSTop = $.CSS(element, "top");
				curCSSLeft = $.CSS(element, "left");
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
		},

		isLTR: domNode.documentIsLtr,

		each: Y.each,

		vardump: Y.variableDump,

		contains: contains,

		fn: domNode.Function,

		pushStack: domNode.pushStack,

		Swap: domNode.Swap,

		swap: domNode.Swap,

		Access: domNode.Access,

		access: domNode.Access,

		Style: domNode.Style,

		style: domNode.Style,

		CSS_Number: domNode.CSS_Number,

		nodeName: domNode.nodeName,

		CSS_Properities: domNode.CSS_Properities,

		CSS: domNode.CSS,

		css: domNode.CSS,

		CSS_Hooks: domNode.CSS_Hooks,

		Function: domNode.Function,

		UUID: 0,

		GUID: 0,

		Expando: domNode.Expando,

		Timers: [],

		Location: Y.loc,

		parseJSON: Y.parseJSON
	});

	$.Support = $.support = {};
	$.Expr = $.expr = {};
	$.Map = $.map = map;

	//---


	//---

	$.prototype = domNode.prototype;

	//---

	// Create scrollLeft and scrollTop methods
	Y.each({
		scrollLeft: 'pageXOffset',
		scrollTop: 'pageYOffset'
	}, function(method, prop) {
		var top = 'pageYOffset' === prop;

		$.Function[method] = function(val) {
			return $.Access(this, function(element, method, val) {
				var win = getWindow(element);

				if (val === undef) {
					return win ? win[prop] : element[method];
				}

				if (win) {
					win.scrollTo(!top ? val : Y.win.pageXOffset, top ? val : Y.win.pageYOffset);

				} else {
					element[method] = val;
				}
			}, method, val, arguments.length, null);
		};
	});

	//---

	$.cssExpand = cssExpand;

	//---

	Y.each(['height', 'width'], function(i, name) {
		$.CSS_Hooks[name] = {
			get: function(element, computed, extra) {
				if (computed) {
					// certain elements can have dimension info if we invisibly show them
					// however, it must have a current display style that would benefit from this
					return element.offsetWidth === 0 && Y.RegEx.rdisplayswap.test($.CSS(element,
						'display')) ?
						$.Swap(element, cssShow, function() {
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
								$.Support.boxSizing && $.CSS(element, 'boxSizing', false,
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
			$.Function[funcName] = function(margin, value) {
				var chainable = arguments.length && (defaultExtra || typeof margin !==
						'boolean'),
					extra = defaultExtra || (margin === true || value === true ? 'margin' :
						'border');

				return $.Access(this, function(element, type, value) {
					var doc;

					if (Y.isWindow(element)) {
						// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
						// isn't a whole lot we can do. See pull request at this URL for discussion:
						// https://github.com/jquery/jquery/pull/764
						return element.Y.doc.documentElement['client' + name];
					}

					// Get Y.doc width or height
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
						$.CSS(element, type, extra) :
						// Set width or height on the element
						$.Style(element, type, value, extra);
				}, type, chainable ? margin : undef, chainable, null);
			};
		});
	});

	//---

	$.Extend = $.extend = Y.extend;
	$.Function.extend = Y.extend;

	//---

	// Generate the `after`, `prepend`, `before`, `append`,
	// `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
	adjacencyOperators.forEach(function(operator, operatorIndex) {
		var inside = operatorIndex % 2; //=> prepend, append

		$.Function[operator] = function() {
			// Arguments can be nodes, arrays of nodes, YAX objects and HTML strings
			var nodes = map(arguments, function(arg) {
					return Y.isObject(arg) ||
						Y.isArray(arg) ||
						Y.isNull(arg) ?
						arg : YAXDOM.Fragment(arg);
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
						return $(node).remove();
					}

					if (parentInDocument) {
						return parent.insertBefore(node, target);
					}

					// for (var ancestor = parent.parentNode; ancestor !== null && ancestor !== Y.doc.createElement; ancestor = ancestor.parentNode);

					traverseNode(parent.insertBefore(node, target), function(elem) {
						if (Y.isNull(elem.nodeName) && elem.nodeName.toUpperCase() ===
							'SCRIPT' && (!elem.type || elem.type === 'text/javascript')) {
							if (!elem.src) {
								// Y.win['eval'].call(Y.win, elem.innerHTML);
								// globalEval(Y.win, elem.innerHTML);
								/* jshint evil:true */
								eval(Y.win, elem.innerHTML);
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
		$.Function[inside ? operator + 'To' : 'insert' + (operatorIndex ?
			'Before' : 'After')] = function(html) {
			$(html)[operator](this);
			return this;
		};
	});

	//---

	Y.Settings.DOM = {};

	//---

	//Y.extend(YAXDOM.Y.prototype, $.Function);

	YAXDOM.Y.prototype = $.Function;
	$.prototype = $.Function;

	$.YAXDOM = YAXDOM;
	$.globalEval = globalEval;
	$.getStyles = getStyles;
	$.getDocStyles = getDocStyles;

	//---


	Y.win.$ = Y.DOM = $;

	//---

	return $;

	//---

}());

// FILE: ./Source/Modules/Node/Node.js

//---