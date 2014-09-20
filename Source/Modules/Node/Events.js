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

	specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';

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
		return !(!handler.del || !(!focusinSupported && Y.ObjectHasProperty(focus, handler.e))) || Y.Lang.isSet(captureSetting);
	}

	function realEvent(type) {
		return hover[type] || (focusinSupported && focus[type]) || type;
	}

	function compatible(event, source) {
		if (source || !event.isDefaultPrevented) {
			// source || (source = event);
			source = event;

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
				if (Y.ObjectHasProperty(source, 'returnValue')) {
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

			if (Y.ObjectHasProperty(object, 'addEventListener')) {
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
			} else if (Y.ObjectHasProperty(object, 'attachEvent')) {
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
			} else if (Y.ObjectHasProperty(object, 'removeEventListener')) {
				if (type === 'mousewheel') {
					object.removeEventListener('DOMMouseScroll', handler, false);
					object.removeEventListener(type, handler, false);
				} else {
					object.removeEventListener(
							type === 'mouseenter' ? 'mouseover' :
								type === 'mouseleave' ? 'mouseout' : type, handler, false);
				}
			} else if (Y.ObjectHasProperty(object, 'detachEvent')) {
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

				if (Y.ObjectHasProperty(element, 'addEventListener')) {
					Y.DOM.Event.addListener(element, realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
				}
			});
		},

		remove: function (element, events, func, selector, capture) {
			(events || '').split(/\s/).forEach(function (event) {
				findHandlers(element, event, func, selector).forEach(function (handler) {
					delete eventHandlers(element)[handler.i];

					if (Y.ObjectHasProperty(element, 'removeEventListener')) {
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

		// args = (2 in arguments) && Y.G.Slice.call(arguments, 2);
		args = Y.G.Slice.call(arguments, 2);

		if (Y.Lang.isFunction(callback)) {
			proxyFn = function () {
				return callback.apply(context, args ? args.concat(Y.G.Slice.call(arguments)) : arguments);
			};

			proxyFn.YID = yID(callback);

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
			if (Y.ObjectHasProperty(this, 'dispatchEvent')) {
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
			// e = createProxy(Y.Lang.isString(event) ? Y.Event.Create(event) : event);
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

}());

//---
