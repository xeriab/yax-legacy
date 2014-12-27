/**
 * YAX Events [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

if (typeof Sizzle === 'undefined') {
	throw new Error('YAX.js DOM [Extended Events] requires YAX.DOM and Sizzle');
}

(function () {

	//---

	'use strict';

	var eventMethods = {
		preventDefault: 'isDefaultPrevented',
		stopImmediatePropagation: 'isImmediatePropagationStopped',
		stopPropagation: 'isPropagationStopped'
	};

	// var eventsKey = 'YAX.Event.Handlers';

	var returnTrue;

	var returnFalse;

	//---

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

	// END OF [Private Functions]

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
				console.trace();
				return;
			}

			// Y.LOG(elemData);

			// Caller can pass in an object of custom data in lieu of the handler
			if (handler.handler) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}

			// Make sure that the handler has a unique ID, used to find/remove it later
			if (!handler.guid) {
				handler.guid = Y.DOM.guid++;
			}

			// Init the element's event structure and main handler, if this is the first
			if (!(events = elemData.events)) {
				events = elemData.events = {};
			}

			if (!(eventHandle = elemData.handle)) {
				eventHandle = elemData.handle = function (e) {
					// Discard the second event of a Y.DOM.event.trigger() and
					// when an event is called after a page has unloaded
					return !Y.isUndefined(Y.DOM) && Y.DOM.event.triggered !== e.type ?
						Y.DOM.event.dispatch.apply(elem, arguments) : undefined;
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
							elem.addEventListener(type, eventHandle, false);
							// Y.DOM.Event.add(elem, type, eventHandle, false);
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
			event.result = undefined;

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
						Y.DOM.event.triggered = undefined;

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

						if (ret !== undefined) {
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

							if (matches[sel] === undefined) {
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
				if (!event.which && button !== undefined) {
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
					if (event.result !== undefined && event.originalEvent) {
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
			elem.removeEventListener(type, handle, false);
			// Y.DOM.Event.remove(elem, type, handle, false);
		}
	};

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

	Y.DOM.Function.bind = function (types, data, callback) {
		return this.on(types, null, data, callback);
	};

	Y.DOM.Function.bindEvent = function (types, data, callback) {
		return this.on(types, null, data, callback);
	};

	Y.DOM.Function.unbind = function (types, callback) {
		return this.off(types, null, callback);
	};

	Y.DOM.Function.one = function (types, selector, data, callback) {
		return this.on(types, selector, data, callback, 1);
	};

	Y.DOM.Function.delegate = function (selector, types, data, callback) {
		return this.on(types, selector, data, callback);
	};

	Y.DOM.Function.undelegate = function (selector, types, callback) {
		// (namespace) or (selector, types [, cb])
		return arguments.length === 1 ?
			this.off(selector, '**') :
			this.off(types, selector || '**', callback);
	};

	Y.DOM.Function.live = function (event, callback) {
		Y.DOM(document.body).delegate(this.selector, event, callback);
		return this;
	};

	Y.DOM.Function.die = function (event, callback) {
		Y.DOM(document.body).undelegate(this.selector, event, callback);
		return this;
	};

	Y.DOM.Function.on = function on(types, selector, data, cb, /*INTERNAL*/ one) {
		var origFn, type;

		// Types can be a map of types/handlers
		if (typeof types === 'object') {
			// (types-Object, selector, data)
			if (typeof selector !== 'string') {
				// (types-Object, data)
				data = data || selector;
				selector = undefined;
			}

			for (type in types) {
				if (types.hasOwnProperty(type)) {
					this.on(type, selector, data, types[type], one);
				}
			}

			return this;
		}

		// jshint -W041
		if (data == null && cb == null) {
			// (types, cb)
			cb = selector;
			data = selector = undefined;
		} else if (cb == null) {
			if (typeof selector === 'string') {
				// (types, selector, cb)
				cb = data;
				data = undefined;
			} else {
				// (types, data, cb)
				cb = data;
				data = selector;
				selector = undefined;
			}
		}
		if (cb === false) {
			cb = returnFalse;
		} else if (!cb) {
			return this;
		}

		if (one === 1) {
			origFn = cb;
			cb = function(event) {
				// Can use an empty set, since event contains the info
				Y.DOM().off(event);
				return origFn.apply(this, arguments);
			};

			// Use same guid so caller can remove using origFn
			/*if (origFn.guid) {
				cb.guid = origFn.guid;
			} else {
				origFn.guid = Y.DOM.guid++;
				cb.guid = origFn.guid;
			}*/

			cb.guid = origFn.guid || (origFn.guid = Y.DOM.guid++);

			// cb.guid = origFn.guid || (origFn.guid = Y.DOM.guid++);
		}

		return this.each(function() {
			Y.DOM.event.add(this, types, cb, data, selector);
		});
	};

	Y.DOM.Function.off = function (types, selector, callback) {
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
			// (types [, cb])
			callback = selector;
			selector = undefined;
		}

		if (callback === false) {
			callback = returnFalse;
		}

		return this.each(function() {
			Y.DOM.event.remove(this, types, callback, selector);
		});
	};

	Y.DOM.Function.trigger = function (type, data) {
		return this.each(function() {
			Y.DOM.event.trigger(type, data, this);
		});
	};

	Y.DOM.Function.triggerHandler = function (type, data) {
		var element = this[0];

		if (element) {
			return Y.DOM.event.trigger(type, data, element, true);
		}
	};

	//---



	//---

	// Shortcut methods for `.bind(event, func)` for each event type
	Y.forEach([
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
		// 'hashchange',
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
		'contextmenu'
		// 'mousewheel',
		// 'wheel'
	], function (name) {
		Y.DOM.Function[name] = function (data, callback) {
			return arguments.length > 0 ?
				this.on(name, null, data, callback) :
				this.trigger(name);
		};
	});

	Y.DOM.Function.hashchange = function (callback) {
		if (Y.isWindow(this[0])) {
			return arguments.length > 0 ?
				this.bind('hashchange', callback) :
				this.trigger('hashchange', callback);
		}
	};

	Y.DOM.Function.hover = function(over, out) {
		return this.mouseenter(over)
			.mouseleave(out || over);
	};

	//---

	// Create mouseenter/leave events using mouseover/out and event-time checks
	// Support: Chrome 15+
	Y.forEach({
		mouseenter: 'mouseover',
		mouseleave: 'mouseout',
		pointerenter: 'pointerover',
		pointerleave: 'pointerout'
	}, function (fixer, original) {
		var orig = fixer;
		var fix = original;

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

	// Support: Firefox, Chrome, Safari
	// Create 'bubbling' focus and blur events
	if (!Y.DOM.support.focusinBubbles) {
		Y.forEach({
			focus: 'focusin',
			blur: 'focusout'
		}, function (fixer, original) {
			var orig = fixer;
			var fix = original;

			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function (event) {
				Y.DOM.event.simulate(fix, event.target, Y.DOM.event.fix(event), true);
			};

			Y.DOM.event.special[fix] = {
				setup: function () {
					var doc = this.ownerDocument || this,
						attaches = Y.DOM.dataPrivative.access(doc, fix);

					if (!attaches) {
						doc.addEventListener(orig, handler, true);
						// YAX.DOM.Event.add(doc, orig, handler, true);
					}

					Y.DOM.dataPrivative.access(doc, fix, (attaches || 0) + 1);
				},

				teardown: function () {
					var doc = this.ownerDocument || this,
						attaches = Y.DOM.dataPrivative.access(doc, fix) - 1;

					if (!attaches) {
						doc.removeEventListener(orig, handler, true);
						// YAX.DOM.Event.remove(doc, orig, handler, true);
						Y.DOM.dataPrivative.remove(doc, fix);
					} else {
						Y.DOM.dataPrivative.access(doc, fix, attaches);
					}
				}
			};
		});
	} else {
		Y.forEach([
			'focus', 
			'blur'
		], function (name) {
			Y.DOM.Function[name] = function (callback) {
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
	}

	//---

	Y.forEach([
		'focus', 
		'blur'
	], function (name) {
		Y.DOM.Function[name] = function (callback) {
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

	Y.DOM.Event.prototype.isDefaultPrevented = function() {
		return this.defaultPrevented;
	};

	//---

}());

// FILE: ./Source/Modules/Node/Events.js

//---