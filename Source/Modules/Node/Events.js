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