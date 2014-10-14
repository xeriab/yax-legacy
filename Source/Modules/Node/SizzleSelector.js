/**
 * YAX Sizzle Selector [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global Y, Y, Sizzle */

(function () {

	//---

	'use strict';

	var yDOM = Y.DOM;

	var tmpYaxDom = Y.DOM;

	var rootYaxDom;

	var version = '0.10';

	var classTag = 'YAX' + Y.now();

	//---

	Y.DOM = function (selector, context) {
		return new yDOM.init(selector, context);
	};

	//---

	Y.extend(Y.DOM, tmpYaxDom);

	//---

	Y.DOM.classTag = classTag;

	var rclass = /[\t\r\n\f]/g;
	var notWhite = (/\S+/g);

	delete Y.DOM.Function.addClass;
	delete Y.DOM.Function.removeClass;
	delete Y.DOM.Function.hasClass;

	Y.DOM.Function = Y.DOM.fn = Y.DOM.prototype = {
		// The current version of Y.DOM being used
		'YAX.DOM': version,

		constructor: Y.DOM,

		// Start with an empty selector
		selector: '',

		// The default length of a Y.DOM object is 0
		length: 0,

		pushStack: tmpYaxDom.pushStack,

		//each: tmpYaxDom.each,
		each: function (callback, args) {
			return Y.each_(this, callback, args);
		},

		addClass: function (value) {
			var classes, elem, cur, clazz, j, finalValue,
				proceed = typeof value === "string" && value,
				i = 0,
				len = this.length;

			if (Y.isFunction(value)) {
				return this.each(function (j) {
					Y.DOM(this).addClass(value.call(this, j, this.className));
				});
			}

			if (proceed) {
				// The disjunction here is for better compressibility (see removeClass)
				classes = (value || "").match(notWhite) || [];

				for (i; i < len; i++) {
					elem = this[i];
					cur = elem.nodeType === 1 && (elem.className ?
						(" " + elem.className + " ").replace(rclass, " ") :
						" "
					);

					if (cur) {
						j = 0;
						while ((clazz = classes[j++])) {
							if (cur.indexOf(" " + clazz + " ") < 0) {
								cur += clazz + " ";
							}
						}

						// only assign if different to avoid unneeded rendering.
						finalValue = Y.trim(cur);
						if (elem.className !== finalValue) {
							elem.className = finalValue;
						}
					}
				}
			}

			return this;
		},

		removeClass: function (value) {
			var classes, elem, cur, clazz, j, finalValue,
				proceed = arguments.length === 0 || typeof value === "string" && value,
				i = 0,
				len = this.length;

			if (Y.isFunction(value)) {
				return this.each(function (j) {
					Y.DOM(this).removeClass(value.call(this, j, this.className));
				});
			}
			if (proceed) {
				classes = (value || "").match(notWhite) || [];

				for (; i < len; i++) {
					elem = this[i];
					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 && (elem.className ?
						(" " + elem.className + " ").replace(rclass, " ") : "");

					if (cur) {
						j = 0;
						while ((clazz = classes[j++])) {
							// Remove *all* instances
							while (cur.indexOf(" " + clazz + " ") >= 0) {
								cur = cur.replace(" " + clazz + " ", " ");
							}
						}

						// only assign if different to avoid unneeded rendering.
						finalValue = value ? Y.trim(cur) : "";
						if (elem.className !== finalValue) {
							elem.className = finalValue;
						}
					}
				}
			}

			return this;
		},

		toggleClass: function (value, stateVal) {
			var type = typeof value;

			if (typeof stateVal === "boolean" && type === "string") {
				return stateVal ? this.addClass(value) : this.removeClass(value);
			}

			if (Y.isFunction(value)) {
				return this.each(function (i) {
					Y.DOM(this).toggleClass(value.call(this, i, this.className, stateVal),
						stateVal);
				});
			}

			return this.each(function () {
				if (type === "string") {
					// toggle individual class names
					var className,
						i = 0,
						self = Y.DOM(this),
						classNames = value.match(notWhite) || [];

					while ((className = classNames[i++])) {
						// check each className given, space separated list
						if (self.hasClass(className)) {
							self.removeClass(className);
						} else {
							self.addClass(className);
						}
					}

					// Toggle whole class name
				} else if (type === typeof undefined || type === "boolean") {
					if (this.className) {
						// store className if set
						Y.DOM.data_priv.set(this, "__className__", this.className);
					}

					// If the element has a class name or if we're passed "false",
					// then remove the whole classname (if there was one, the above saved it).
					// Otherwise bring back whatever was previously saved (if anything),
					// falling back to the empty string if nothing was stored.
					this.className = this.className || value === false ? "" : Y.DOM.data_priv
						.get(this, "__className__") || "";
				}
			});
		},

		hasClass: function (selector) {
			var className = " " + selector + " ",
				i = 0,
				l = this.length;

			for (i; i < l; i++) {
				if (this[i].nodeType === 1 && (" " + this[i].className + " ").replace(
						rclass, " ").indexOf(className) >= 0) {
					return true;
				}
			}

			return false;
		},

		map: function (callback) {
			return this.pushStack(Y.DOM.map(this, function (elem, i) {
				return callback.call(elem, i, elem);
			}));
		},

		// For internal use only.
		// Behaves like an Array's method, not like a Y.DOM method.
		push: Y.G.Push,
		sort: Y.G.ArrayProto.sort,
		splice: Y.G.ArrayProto.splice
	};

	Y.DOM.extend = Y.DOM.Function.extend = tmpYaxDom.extend;

	//---

	Y.DOM.each = tmpYaxDom.each;

	var tmp_ = tmpYaxDom.expr[':'];

	Y.DOM.find = Sizzle;
	Y.DOM.expr = Y.DOM.Expr = Sizzle.selectors;
	Y.DOM.expr[':'] = Y.DOM.Expr[':'] = Y.DOM.expr.pseudos;
	Y.DOM.expr[':'] = Y.extend(Y.DOM.expr[':'], tmp_);
	Y.DOM.unique = Sizzle.uniqueSort;
	Y.DOM.text = Sizzle.getText;
	Y.DOM.isXMLDoc = Sizzle.isXML;
	Y.DOM.contains = Sizzle.contains;

	Y.G.regexList.rneedsContext = Y.DOM.expr.match.needsContext;

	var wrapMap = {
		// Support: IE9
		option: [1, "<select multiple='multiple'>", "</select>"],
		thead: [1, "<table>", "</table>"],
		col: [2, "<table><colgroup>", "</colgroup></table>"],
		tr: [2, "<table><tbody>", "</tbody></table>"],
		td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

		_default: [0, "", ""]
	};

	// Support: IE9
	wrapMap.optgroup = wrapMap.option;

	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;

	Y.extend(Y.DOM.Function, tmpYaxDom.Function);

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	Y.DOM.parseHTML = function (data, context, keepScripts) {
		if (!data || typeof data !== "string") {
			return null;
		}

		if (typeof context === "boolean") {
			keepScripts = context;
			context = false;
		}

		context = context || document;

		var parsed = Y.G.regexList.singleTag.exec(data),
			scripts = !keepScripts && [];

		// Single tag
		if (parsed) {
			return [context.createElement(parsed[1])];
		}

		parsed = Y.DOM.buildFragment([data], context, scripts);

		if (scripts && scripts.length) {
			Y.DOM(scripts).remove();
		}

		return Y.merge([], parsed.childNodes);
	};

	// Implement the identical functionality for filter and not
	function winnow(elements, qualifier, not) {
		if (Y.isFunction(qualifier)) {
			return Y.grep(elements, function (elem, i) {
				/* jshint -W018 */
				return !!qualifier.call(elem, i, elem) !== not;
			});

		}

		if (qualifier.nodeType) {
			return Y.grep(elements, function (elem) {
				return (elem === qualifier) !== not;
			});

		}

		if (typeof qualifier === "string") {
			if (Y.G.regexList.isSimple.test(qualifier)) {
				return Y.DOM.filter(qualifier, elements, not);
			}

			qualifier = Y.DOM.filter(qualifier, elements);
		}

		return Y.grep(elements, function (elem) {
			return (Y.G.IndexOf.call(qualifier, elem) >= 0) !== not;
		});
	}

	Y.DOM.filter = function (expr, elems, not) {
		var elem = elems[0];

		if (not) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			Y.DOM.find.matchesSelector(elem, expr) ? [elem] : [] :
			Y.DOM.find.matches(expr, Y.grep(elems, function (elem) {
				return elem.nodeType === 1;
			}));
	};

	Y.DOM.Function.extend({
		find: function (selector) {
			var x;
			var len = this.length;
			var ret = [];
			var self = this;

			if (!Y.isString(selector)) {
				return this.pushStack(Y.DOM(selector).filter(function () {
					for (x = 0; x < len; x++) {
						if (Y.DOM.contains(self[x], this)) {
							return true;
						}
					}
				}));
			}

			for (x = 0; x < len; x++) {
				Y.DOM.find(selector, self[x], ret);
			}

			// Needed because Y.DOM(selector, context) becomes Y.DOM(context).find(selector)
			ret = this.pushStack(len > 1 ? Y.unique(ret) : ret);

			ret.selector = this.selector ? this.selector + ' ' + selector : selector;

			return ret;
		},

		filter: function (selector) {
			return this.pushStack(winnow(this, selector || [], false));
		},

		not: function (selector) {
			return this.pushStack(winnow(this, selector || [], true));
		},

		is: function (selector) {
			return !!winnow(
				this,
				// If this is a positional/relative selector, check membership in the returned set
				// so Y.DOM("p:first").is("p:last") won't return true for a doc with two "p".
				typeof selector === "string" && Y.G.regexList.rneedsContext.test(selector) ?
				Y.DOM(selector) :
				selector || [],
				false
			).length;
		}
	});

	//---


	// var init = Y.DOM.Function.init = function (selector, context) {
	var init = yDOM.init = function (selector, context) {
		var match, element;

		// HANDLE: Y.DOM(""), Y.DOM(null), Y.DOM(undefined), Y.DOM(false)
		if (!selector) {
			return this;
		}

		// Handle HTML strings
		if (Y.isString(selector)) {
			if (selector[0] === "<" && selector[selector.length - 1] === ">" &&
				selector.length >= 3) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [null, selector, null];
			} else {
				match = Y.G.regexList.quickExpr.exec(selector);
			}

			// Match html or make sure no context is specified for #id
			if (match && (match[1] || !context)) {
				// HANDLE: Y.DOM(html) -> Y.DOM(array)
				if (match[1]) {
					context = context instanceof Y.DOM ? context[0] : context;
					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					Y.merge(this, Y.DOM.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					));

					// HANDLE: Y.DOM(html, props)
					if (Y.G.regexList.singleTag.test(match[1]) && Y.isPlainObject(context)) {
						for (match in context) {
							// Properties of context are called as methods if possible
							if (Y.isFunction(this[match])) {
								this[match](context[match]);
								// ...and otherwise set as attributes
							} else {
								this.attr(match, context[match]);
							}
						}
					}

					return this;
					// HANDLE: Y.DOM(#id)
				} else {
					element = document.getElementById(match[2]);

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if (element && element.parentNode) {
						// Inject the element directly into the Y.DOM object
						this.length = 1;
						this[0] = element;
					}

					this.context = document;
					this.selector = selector;

					return this;
				}
				// HANDLE: Y.DOM(expr, Y.DOM(...))
			} else if (!context || context['YAX.DOM']) {
				return (context || rootYaxDom).find(selector);
				// HANDLE: Y.DOM(expr, context)
				// (which is just equivalent to: Y.DOM(context).find(expr)
			} else {
				return this.constructor(context).find(selector);
			}
			// HANDLE: Y.DOM(DOMElement)
		} else if (selector.nodeType) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
			//return Y.DOM.makeArray(selector, this);
			// HANDLE: Y.DOM(function)
			// Shortcut for document ready
		} else if (Y.isFunction(selector)) {
			if (!Y.isUndefined(rootYaxDom.ready)) {
				return rootYaxDom.ready(selector);
			}

			return selector(Y.DOM);
		}

		if (!Y.isUndefined(selector.selector)) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return Y.makeArray(selector, this);
	};

	// Give the init function the Y.DOM prototype for later instantiation
	init.prototype = Y.DOM.Function;

	// Initialize central reference
	rootYaxDom = Y.DOM(document);

	Y.DOM.Support = Y.DOM.support = {};

	Y.DOM.Support = tmpYaxDom.Support;
	Y.DOM.support = tmpYaxDom.Support;

	Y.DOM.access = tmpYaxDom.Access;
	Y.DOM.Access = tmpYaxDom.Access;
	Y.DOM.style = tmpYaxDom.Style;
	Y.DOM.Style = tmpYaxDom.Style;
	Y.DOM.CSS = tmpYaxDom.CSS;
	Y.DOM.css = tmpYaxDom.CSS;

	Y.DOM.cssHooks = tmpYaxDom.CSS_Hooks;
	Y.DOM.CSS_Hooks = tmpYaxDom.CSS_Hooks;
	Y.DOM.cssNumber = tmpYaxDom.CSS_Number;
	Y.DOM.CSS_Number = tmpYaxDom.CSS_Number;
	Y.DOM.cssProps = tmpYaxDom.CSS_Properities;
	Y.DOM.CSS_Properities = tmpYaxDom.CSS_Properities;

	Y.DOM.expando = tmpYaxDom.expando;
	Y.DOM.nodeName = tmpYaxDom.nodeName;
	Y.DOM.dataPrivative = tmpYaxDom.dataPrivative;
	Y.DOM.dataUser = tmpYaxDom.dataUser;
	Y.DOM.data_priv = tmpYaxDom.dataPrivative;
	Y.DOM.data_user = tmpYaxDom.data_user;

	//	Y.extend(Y.DOM, tmpYaxDom);

	Y.G.regexList.scriptTypeMasked = /^true\/(.*)/;

	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript(elem) {
			elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
			return elem;
	}

	function restoreScript(elem) {
			var match = Y.G.regexList.scriptTypeMasked.exec(elem.type);

			if (match) {
				elem.type = match[1];
			} else {
				elem.removeAttribute("type");
			}

			return elem;
	}


	function getAll(context, tag) {
		// Support: IE9-11+
		// Use typeof to avoid zero-argument method invocation on host objects (#15151)
		var ret = !Y.isUndefined(context.getElementsByTagName) ?
			context.getElementsByTagName(tag || "*") :
			!Y.isUndefined(context.querySelectorAll) ?
			context.querySelectorAll(tag || "*") : [];

		return (Y.isUndefined(tag) || tag) && Y.DOM.nodeName(context, tag) ?
			Y.merge([context], ret) :
			ret;
	}

	// Mark scripts as having already been evaluated
	function setGlobalEval(elems, refElements) {
		var i = 0,
			l = elems.length;

		for (i; i < l; i++) {
			Y.DOM.dataPrivative.set(
				elems[i], "globalEval", !refElements || Y.DOM.dataPrivative.get(
					refElements[i], "globalEval")
			);
		}
	}

	function fixInput(src, dest) {
		var nodeName = dest.nodeName.toLowerCase();

		// Fails to persist the checked state of a cloned checkbox or radio button.
		if (nodeName === "input" && Y.G.regexList.checkableType.test(src.type)) {
			dest.checked = src.checked;

			// Fails to return the selected option to the default selected state when cloning options
		} else if (nodeName === "input" || nodeName === "textarea") {
			dest.defaultValue = src.defaultValue;
		}
	}

	function cloneCopyEvent(src, dest) {
		var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

		if (dest.nodeType !== 1) {
			return;
		}

		// 1. Copy private data: events, handlers, etc.
		if (Y.DOM.dataPrivative.hasData(src)) {
			pdataOld = Y.DOM.dataPrivative.access(src);
			pdataCur = Y.DOM.dataPrivative.set(dest, pdataOld);
			events = pdataOld.events;

			if (events) {
				delete pdataCur.handle;
				pdataCur.events = {};

				for (type in events) {
					for (i = 0, l = events[type].length; i < l; i++) {
						Y.DOM.event.add(dest, type, events[type][i]);
					}
				}
			}
		}

		// 2. Copy user data
		if (Y.DOM.dataUser.hasData(src)) {
			udataOld = Y.DOM.dataUser.access(src);
			udataCur = Y.DOM.extend({}, udataOld);

			Y.DOM.dataUser.set(dest, udataCur);
		}
	}

	function manipulationTarget(elem, content) {
		return Y.DOM.nodeName(elem, "table") &&
			Y.DOM.nodeName(content.nodeType !== 11 ? content : content.firstChild,
				"tr") ?

			elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild(elem.ownerDocument.createElement("tbody")) :
			elem;
	}

	Y.DOM.map = function (elems, callback, arg) {
		var value,
			i = 0,
			length = elems.length,
			isArray = Y.isArraylike(elems),
			ret = [];

		// Go through the array, translating each of the items to their new values
		if (isArray) {
			for (i; i < length; i++) {
				value = callback(elems[i], i, arg);

				if (value !== null) {
					ret.push(value);
				}
			}

			// Go through every key on the object,
		} else {
			for (i in elems) {
				if (elems.hasOwnProperty(i)) {
					value = callback(elems[i], i, arg);

					if (value !== null) {
						ret.push(value);
					}
				}
			}
		}

		// Flatten any nested arrays
		return Y.G.Concat.apply([], ret);
	};

	(function () {
		var fragment = document.createDocumentFragment(),
			div = fragment.appendChild(document.createElement("div")),
			input = document.createElement("input");

		// #11217 - WebKit loses check when the name is after the checked attribute
		// Support: Windows Web Apps (WWA)
		// `name` and `type` need .setAttribute for WWA
		input.setAttribute("type", "radio");
		input.setAttribute("checked", "checked");
		input.setAttribute("name", "t");

		div.appendChild(input);

		// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
		// old WebKit doesn't clone checked state correctly in fragments
		Y.DOM.support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;

		// Make sure textarea (and checkbox) defaultValue is properly cloned
		// Support: IE9-IE11+
		div.innerHTML = "<textarea>x</textarea>";
		Y.DOM.support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
	}());

	Y.DOM.clone = function (elem, dataAndEvents, deepDataAndEvents) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode(true),
			inPage = Y.DOM.contains(elem.ownerDocument, elem);

		// Fix IE cloning issues
		if (!Y.DOM.support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType ===
				11) && !Y.DOM.isXMLDoc(elem)) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll(clone);
			srcElements = getAll(elem);

			for (i = 0, l = srcElements.length; i < l; i++) {
				fixInput(srcElements[i], destElements[i]);
			}
		}

		// Copy the events from the original to the clone
		if (dataAndEvents) {
			if (deepDataAndEvents) {
				srcElements = srcElements || getAll(elem);
				destElements = destElements || getAll(clone);

				for (i = 0, l = srcElements.length; i < l; i++) {
					cloneCopyEvent(srcElements[i], destElements[i]);
				}
			} else {
				cloneCopyEvent(elem, clone);
			}
		}

		// Preserve script evaluation history
		destElements = getAll(clone, "script");
		if (destElements.length > 0) {
			setGlobalEval(destElements, !inPage && getAll(elem, "script"));
		}

		// Return the cloned set
		return clone;
	};

	Y.DOM.buildFragment = function (elems, context, scripts, selection) {
		var elem, tmp, tag, wrap, contains, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;

		for (i; i < l; i++) {
			elem = elems[i];

			if (elem || elem === 0) {

				// Add nodes directly
				if (Y.isObject(elem)) {
					// Support: QtWebKit, PhantomJS
					// push.apply(_, arraylike) throws on ancient WebKit
					Y.merge(nodes, elem.nodeType ? [elem] : elem);

					// Convert non-html into a text node
				} else if (!Y.G.regexList.html.test(elem)) {
					nodes.push(context.createTextNode(elem));
					// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild(context.createElement("div"));

					// Deserialize a standard representation
					tag = (Y.G.regexList.htmlTagName.exec(elem) || ["", ""])[1].toLowerCase();
					wrap = wrapMap[tag] || wrapMap._default;
					tmp.innerHTML = wrap[1] + elem.replace(Y.G.regexList.xhtmlTag, "<$1></$2>") +
						wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];

					while (j--) {
						tmp = tmp.lastChild;
					}

					// Support: QtWebKit, PhantomJS
					// push.apply(_, arraylike) throws on ancient WebKit
					Y.merge(nodes, tmp.childNodes);

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Ensure the created nodes are orphaned (#12392)
					tmp.textContent = '';
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = '';

		i = 0;

		while ((elem = nodes[i++])) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if (selection && Y.inArray(elem, selection) !== -1) {
				continue;
			}

			contains = Y.DOM.contains(elem.ownerDocument, elem);

			// Append to fragment
			tmp = getAll(fragment.appendChild(elem), 'script');

			// Preserve script evaluation history
			if (contains) {
				setGlobalEval(tmp);
			}

			// Capture executables
			if (scripts) {
				j = 0;
				while ((elem = tmp[j++])) {
					if (Y.G.regexList.scriptType.test(elem.type || '')) {
						scripts.push(elem);
					}
				}
			}
		}

		return fragment;
	};

	/**
	 * Determines whether an object can have data
	 */
	Y.DOM.acceptData = function (owner) {
		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		/* jshint -W018 */
		return owner.nodeType === 1 || owner.nodeType === 9 || !(+owner.nodeType);
	};

	Y.DOM.cleanData = function (elems) {
		var data, elem, type, key,
			special = Y.DOM.event.special,
			i = 0;

		for (null;
			(elem = elems[i]) !== undefined; i++) {
			if (Y.DOM.acceptData(elem)) {
				key = elem[Y.DOM.dataPrivative.expando];

				data = Y.DOM.dataPrivative.cache[key];

				if (key && data) {
					if (data.events) {
						for (type in data.events) {
							if (special[type]) {
								Y.DOM.event.remove(elem, type);

								// This is a shortcut to avoid Y.DOM.event.remove's overhead
							} else {
								Y.DOM.removeEvent(elem, type, data.handle);
							}
						}
					}
					if (Y.DOM.dataPrivative.cache[key]) {
						// Discard any remaining `private` data
						delete Y.DOM.dataPrivative.cache[key];
					}
				}
			}
			// Discard any remaining `user` data
			delete Y.DOM.dataUser.cache[elem[Y.DOM.dataUser.expando]];
		}
	};

	Y.extend(Y.DOM.Function, {
		text: function (value) {
			return Y.DOM.Access(this, function (value) {
				return value === undefined ?
					Y.DOM.text(this) :
					this.empty().each(function () {
						if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType ===
							9) {
							this.textContent = value;
						}
					});
			}, null, value, arguments.length);
		},

		append: function () {
			return this.domManip(arguments, function (elem) {
				if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType ===
					9) {
					var target = manipulationTarget(this, elem);
					target.appendChild(elem);
				}
			});
		},

		prepend: function () {
			return this.domManip(arguments, function (elem) {
				if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType ===
					9) {
					var target = manipulationTarget(this, elem);
					target.insertBefore(elem, target.firstChild);
				}
			});
		},

		before: function () {
			return this.domManip(arguments, function (elem) {
				if (this.parentNode) {
					this.parentNode.insertBefore(elem, this);
				}
			});
		},

		after: function () {
			return this.domManip(arguments, function (elem) {
				if (this.parentNode) {
					this.parentNode.insertBefore(elem, this.nextSibling);
				}
			});
		},

		removea: function (selector, keepData /* Internal Use Only */ ) {
			var elem,
				elems = selector ? Y.DOM.filter(selector, this) : this,
				i = 0;

			for (null;
				(elem = elems[i]) !== null; i++) {
				if (!keepData && elem.nodeType === 1) {
					Y.DOM.cleanData(getAll(elem));
				}

				if (elem.parentNode) {
					if (keepData && Y.DOM.contains(elem.ownerDocument, elem)) {
						setGlobalEval(getAll(elem, "script"));
					}
					elem.parentNode.removeChild(elem);
				}
			}

			return this;
		},

		emptya: function () {
			var elem,
				i = 0;

			for (null;
				(elem = this[i]) !== null; i++) {
				if (elem.nodeType === 1) {

					// Prevent memory leaks
					Y.DOM.cleanData(getAll(elem, false));

					// Remove any remaining nodes
					elem.textContent = "";
				}
			}

			return this;
		},

		clone: function (dataAndEvents, deepDataAndEvents) {
			dataAndEvents = dataAndEvents === null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents === null ? dataAndEvents :
				deepDataAndEvents;

			return this.map(function () {
				return Y.DOM.clone(this, dataAndEvents, deepDataAndEvents);
			});
		},

		html: function (value) {
			return Y.DOM.access(this, function (value) {
				var elem = this[0] || {},
					i = 0,
					l = this.length;

				if (value === undefined && elem.nodeType === 1) {
					return elem.innerHTML;
				}

				// See if we can take a shortcut and just use innerHTML
				if (typeof value === "string" && !Y.G.regexList.noInnerHtml.test(value) &&
					!wrapMap[(Y.G.regexList.htmlTagName.exec(value) || ["", ""])[1].toLowerCase()]
				) {

					value = value.replace(Y.G.regexList.xhtmlTag, "<$1></$2>");

					try {
						for (i; i < l; i++) {
							elem = this[i] || {};

							// Remove element nodes and prevent memory leaks
							if (elem.nodeType === 1) {
								Y.DOM.cleanData(getAll(elem, false));
								elem.innerHTML = value;
							}
						}

						elem = 0;

						// If using innerHTML throws an exception, use the fallback method
					} catch (e) {}
				}

				if (elem) {
					this.empty().append(value);
				}
			}, null, value, arguments.length);
		},

		replaceWith: function () {
			var arg = arguments[0];

			// Make the changes, replacing each context element with the new content
			this.domManip(arguments, function (elem) {
				arg = this.parentNode;

				Y.DOM.cleanData(getAll(this));

				if (arg) {
					arg.replaceChild(elem, this);
				}
			});

			// Force removal if there was no new content (e.g., from empty arguments)
			return arg && (arg.length || arg.nodeType) ? this : this.remove();
		},

		detach: function (selector) {
			return this.remove(selector, true);
		},

		domManip: function (args, callback) {
			// Flatten any nested arrays
			args = Y.G.Concat.apply([], args);

			var fragment, first, scripts, hasScripts, node, doc,
				i = 0,
				l = this.length,
				set = this,
				iNoClone = l - 1,
				value = args[0],
				isFunction = Y.isFunction(value);

			// We can't cloneNode fragments that contain checked, in WebKit
			if (isFunction ||
				(l > 1 && typeof value === "string" && !Y.DOM.support.checkClone && Y.G.regexList
					.checked.test(value))) {
				return this.each(function (index) {
					var self = set.eq(index);
					if (isFunction) {
						args[0] = value.call(this, index, self.html());
					}
					self.domManip(args, callback);
				});
			}

			if (l) {
				fragment = Y.DOM.buildFragment(args, this[0].ownerDocument, false, this);
				first = fragment.firstChild;

				if (fragment.childNodes.length === 1) {
					fragment = first;
				}

				if (first) {
					scripts = Y.DOM.map(getAll(fragment, 'script'), disableScript);

					hasScripts = scripts.length;

					// Use the original fragment for the last item instead of the first because it can end up
					// being emptied incorrectly in certain situations (#8070).
					for (i; i < l; i++) {
						node = fragment;

						if (i !== iNoClone) {
							node = Y.DOM.clone(node, true, true);

							// Keep references to cloned scripts for later restoration
							if (hasScripts) {
								// Support: QtWebKit
								// Y.DOM.merge because push.apply(_, arraylike) throws
								Y.DOM.merge(scripts, getAll(node, "script"));
							}
						}

						callback.call(this[i], node, i);
					}

					if (hasScripts) {
						doc = scripts[scripts.length - 1].ownerDocument;

						// Reenable scripts
						Y.DOM.map(scripts, restoreScript);

						// Evaluate executable scripts on first document insertion
						for (i = 0; i < hasScripts; i++) {
							node = scripts[i];
							if (Y.G.regexList.scriptType.test(node.type || "") && !Y.DOM.data_priv.access(
									node, "globalEval") && Y.DOM.contains(doc, node)) {

								if (node.src) {
									// Optional AJAX dependency, but won't run scripts if not present
									if (Y.DOM._evalUrl) {
										Y.DOM._evalUrl(node.src);
									}
								} else {
									Y.DOM.globalEval(node.textContent.replace(Y.G.regexList.cleanScript, ""));
								}
							}
						}
					}
				}
			}

			return this;
		}
	});

	Y.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function (name, original) {
		Y.DOM.Function[name] = function (selector) {
			var elems,
				ret = [],
				insert = Y.DOM(selector),
				last = insert.length - 1,
				i = 0;

			for (i; i <= last; i++) {
				elems = i === last ? this : this.clone(true);
				Y.DOM(insert[i])[original](elems);
				// Support: QtWebKit
				// .get() because push.apply(_, arraylike) throws
				Y.G.Push.apply(ret, elems.get());
			}

			return this.pushStack(ret);
		};
	});

	//---

	Y.DOM.globalEval = tmpYaxDom.globalEval;


	// Y.DOM.yDOM = yDOM;

	window.$ = Y.DOM = Y.DOM;

	//---

	return $;

	//---

}());

// FILE: ./Source/Modules/Node/SizzleSelector.js

//---
