/**
 * YAX Simple DOM/NODE Events
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*jshint node: true */
/*global Y, YAX */

(function(window, document, undef) {

	//---

	'use strict';

	var eventsKey = 'Y.DOM.EventHandlers';

	var eventMethods = {
		preventDefault: 'isDefaultPrevented',
		stopImmediatePropagation: 'isImmediatePropagationStopped',
		stopPropagation: 'isPropagationStopped'
	};

	var specialEvents = {};

	specialEvents.click =
		specialEvents.mousedown =
			specialEvents.mouseup =
				specialEvents.mousemove = 'MouseEvents';

	// BEGIN OF [Private Functions]

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

		window.setTimeout(function() {
			document.removeEventListener('focusin', removePolyfill, true);
			document.removeEventListener('focusout', removePolyfill, true);
		});
	}

	/** @namespace window.onfocusin */
	if (window.onfocusin === undef){
		document.addEventListener('focus', addPolyfill, true);
		document.addEventListener('blur', addPolyfill, true);
		document.addEventListener('focusin', removePolyfill, true);
		document.addEventListener('focusout', removePolyfill, true);
	}

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
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

	// END OF [Private Functions]

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
				}
			}

			Y.extend(event, props);
		}

		event.initEvent(src, bubbles, true);

		// Create a timestamp if incoming event doesn't have one
		// event.timeStamp = (src && src.timeStamp) || Y.now();

		// Mark it as fixed
		// event[Y.DOM.expando] = true;

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

					object.addEventListener(type === 'mouseenter' ?
						'mouseover' :
						'mouseout', handler, false);
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
			} else if (Y.UA.features.touch && (type === 'dblclick') &&
				this.removeDoubleTapListener) {
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

	Y.DOM.Event.addListener = Y.DOM.Event.on;
	Y.DOM.Event.removeListener = Y.DOM.Event.off;

	// Y.DOM.Event.wheelDelta = Y.DOM.Event.getWheelDelta;


	//---

}(window, window.document));

// FILE: ./Source/Modules/Node/SimpleEvents.js

//---
