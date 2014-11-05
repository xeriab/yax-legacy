/**
 * YAX NeoEvents [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function () {

	//---

	'use strict';

	var YID = 1;

	var hover = {
		mouseenter: 'mouseover',
		mouseleave: 'mouseout'
	};

	var focus = {
		focus: 'focusin',
		blur: 'focusout'
	};

	var focusinSupported = Y.hasOwn.call(window, 'onfocusin');

	var eventMethods = {
		preventDefault: 'isDefaultPrevented',
		stopImmediatePropagation: 'isImmediatePropagationStopped',
		stopPropagation: 'isPropagationStopped'
	};

	var eventsKey = 'Y.DOM.EventHandlers';

	var returnTrue;

	var returnFalse;

	var specialEvents = {};

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
		if (Y.hasOwn.call(element, 'EventHandlers')) {
			return element.EventHandlers;
		}
		
		element.EventHandlers = [];

		return element.EventHandlers;
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
		return !(!handler.del || !(!focusinSupported && Y.hasProperty(focus, handler.e))) || Y.isSet(captureSetting);
	}

	function realEvent(type) {
		return hover[type] || (focusinSupported && focus[type]) || type;
	}

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

		event.isImmediatePropagationStopped = returnFalse;

		return event;
	}

	returnTrue = function () {
		return true;
	};

	returnFalse = function () {
		return false;
	};

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

	//---

	function addPolyfill(e) {
		var type = e.type === 'focus' ? 'focusin' : 'focusout';

		var event = new CustomEvent(type, {
			bubbles: true,
			cancelable: false
		});

		event.c1Generated = true;

		e.target.dispatchEvent(event);
	}

	function removePolyfill(e) {
		if (!e.c1Generated) {
			document.removeEventListener('focus', addPolyfill, true);
			document.removeEventListener('blur', addPolyfill, true);
			document.removeEventListener('focusin', removePolyfill, true);
			document.removeEventListener('focusout', removePolyfill, true);
		}

		setTimeout(function() {
			document.removeEventListener('focusin', removePolyfill, true);
			document.removeEventListener('focusout', removePolyfill, true);
		});
	}

	if (window.onfocusin === undefined){
		document.addEventListener('focus', addPolyfill, true);
		document.addEventListener('blur', addPolyfill, true);
		document.addEventListener('focusin', removePolyfill, true);
		document.addEventListener('focusout', removePolyfill, true);
	}

	// END OF [Private Functions]

	//---

	Y.DOM.Event = function (src, props) {
		// Allow instantiation without the 'new' keyword
		if (!(this instanceof Y.DOM.Event)) {
			return new Y.DOM.Event(src, props);
		}

		var event, name, bubbles;

		//---

		if (!Y.isString(src)) {
			props = src;
			src = props.type;
		}

		event = document.createEvent(specialEvents[src] || 'Events');

		if (props) {
			for (name in props) {
				if (props.hasOwnProperty(name)) {
					if (name === 'bubbles') {
						bubbles = Y.isSet(props[name]);
					} else {
						event[name] = props[name];
					}
					// (name === 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name]);
				}
			}

			Y.extend(event, props);
		}

		event.initEvent(src, bubbles, true);

		// Create a timestamp if incoming event doesn't have one
		// event.timeStamp = (src && src.timeStamp) || Y.now();

		// Mark it as fixed
		event[Y.DOM.expando] = true;

		return compatible(event);
	};

	//---

	/**
	 * Y.DOM.Event contains functions for working with Node events.
	 */
	Y.extend(Y.DOM.Event, {
		on: function (object, types, func, context) {
			var type, x, len;

			if (Y.isObject(types)) {
				for (type in types) {
					if (types.hasOwnProperty(type)) {
						this.addListener(object, type, types[type], func);
					}
				}
			} else {
				types = Y.Util.splitWords(types);

				for (x = 0, len = types.length; x < len; x++) {
					this.addListener(object, types[x], func, context);
				}
			}
		},

		addListener: function (object, type, callback, context) {
			var id, originalHandler, handler;

			if (Y.isFunction(callback)) {
				id = type + Y.stamp(callback) + (context ? '_' + Y.stamp(context) : '');
			}

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

		off: function (object, types, func, context) {
			var type, x, len;

			if (Y.isObject(types)) {
				for (type in types) {
					if (types.hasOwnProperty(type)) {
						this.removeListener(object, type, types[type], func);
					}
				}
			} else {
				types = Y.Util.splitWords(types);

				for (x = 0, len = types.length; x < len; x++) {
					this.removeListener(object, types[x], func, context);
				}
			}
		},

		removeListener: function (object, type, callback, context) {
			var id, handler;

			if (Y.isFunction(callback)) {
				id = type + Y.stamp(callback) + (context ? '_' + Y.stamp(context) : '');
			}

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

	Y.DOM.event = {};

	Y.extend(Y.DOM.event, {
		special: {},

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
				if (Y.hasOwn.call(hover, handler.e)) {
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

					var result = callback.apply(element, e._args === undefined ? [e] : [e].concat(e._args));

					if (result === false) {
						e.preventDefault();
						e.stopPropagation();
					}

					return result;
				};

				handler.i = set.length;

				set.push(handler);

				if (Y.hasProperty(element, 'addEventListener')) {
					Y.DOM.Event.on(element, realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
				}
			});
		},

		remove: function (element, events, func, selector, capture) {
			(events || '').split(/\s/).forEach(function (event) {
				findHandlers(element, event, func, selector).forEach(function (handler) {
					delete eventHandlers(element)[handler.i];

					if (Y.hasProperty(element, 'removeEventListener')) {
						Y.DOM.Event.off(element, realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
					}
				});
			});
		},
	});

	//---

	Y.DOM.proxy = function (cb, context) {
		var tmp, args, proxy;

		if (Y.isString(context)) {
			tmp = cb[context];
			context = cb;
			cb = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if (!Y.isFunction(cb)) {
			return undefined;
		}

		// Simulated bind
		args = Y.G.slice.call(arguments, 2);

		proxy = function() {
			return cb.apply(context || this, args.concat(Y.G.slice.call(arguments)));
		};

		// Set the guid of unique handler to the same 
		// of original handler, so it can be removed
		proxy.guid = cb.guid = cb.guid || proxy.guid || Y.DOM.guid++;

		return proxy;
	};

	Y.DOM.Function.bind = function (eventName, data, callback) {
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
		Y.DOM(document.body).delegate(this.selector, event, callback);
		return this;
	};

	Y.DOM.Function.die = function (event, callback) {
		Y.DOM(document.body).undelegate(this.selector, event, callback);
		return this;
	};

	Y.DOM.Function.on = function (event, selector, data, callback, one) {
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
			selector = undefined;
		}

		if (Y.isFunction(data) || data === false) {
			callback = data;
			data = undefined;
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

	Y.DOM.Function.off = function (event, selector, callback) {
		var $this = this;

		if (event && !Y.isString(event)) {
			Y.each(event, function (type, func) {
				$this.off(type, selector, func);
			});

			return $this;
		}

		if (!Y.isString(selector) && !Y.isFunction(callback) && callback !== false) {
			callback = selector;
			selector = undefined;
		}

		if (callback === false) {
			callback = returnFalse;
		}

		return $this.each(function () {
			Y.DOM.event.remove(this, event, callback, selector);
		});
	};

	Y.DOM.Function.trigger = function (event, args) {
		if (Y.isString(event) || Y.isPlainObject(event)) {
			event = Y.DOM.Event(event);
		} else {
			event = compatible(event);
		}

		event._args = args;

		return this.each(function () {
			// items in the collection might not be Node elements
			// if (Y.hasProperty(this, 'dispatchEvent')) {
			if (Y.hasOwn.call(this, 'dispatchEvent')) {
			// if ('dispatchEvent' in this) {
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
			// e = createProxy(Y.isString(event) ? Y.Event.Create(event) : event);
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

	Y.DOM.Function.hover = function(over, out) {
		return this.mouseenter(over)
			.mouseleave(out || over);
	};

	// Shortcut methods for `.bind(event, func)` for each event type
	[
		'blur',
		'focus',
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
				Y.DOM.event.remove(element);
			});

			return origFn.call(this);
		};
	});

	Y.DOM.Event.prototype.isDefaultPrevented = function () {
		return this.defaultPrevented;
	};

	//---

}());

//---
