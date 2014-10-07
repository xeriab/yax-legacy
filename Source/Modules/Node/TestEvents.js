/**
 * YAX Another Events [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function (undef) {

	//---

	'use strict';

	var
		rkeyEvent = /^key/,
		rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
		rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
		rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

	var rnotwhite = (/\S+/g);

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch (err) {
			Y.error(err);
		}
	}

	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	Y.DOM.event = {

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
				handler.guid = Y.DOM.guid++;
			}

			// Init the element's event structure and main handler, if this is the first
			if (!(events = elemData.events)) {
				events = elemData.events = {};
			}
			if (!(eventHandle = elemData.handle)) {
				eventHandle = elemData.handle = function(e) {
					// Discard the second event of a Y.DOM.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof Y.DOM !== "undefined" && Y.DOM.event.triggered !== e.type ?
						Y.DOM.event.dispatch.apply(elem, arguments) : undef;
				};
			}

			// Handle multiple events separated by a space
			types = (types || "").match(rnotwhite) || [""];
			t = types.length;
			while (t--) {
				tmp = rtypenamespace.exec(types[t]) || [];
				type = origType = tmp[1];
				namespaces = (tmp[2] || "").split(".").sort();

				// There *must* be a type, no attaching namespace-only handlers
				if (!type) {
					continue;
				}

				// If event changes its type, use the special event handlers for the changed type
				special = Y.DOM.event.special[type] || {};

				// If selector defined, determine special event api type, otherwise given type
				type = (selector ? special.delegateType : special.bindType) || type;

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
					namespace: namespaces.join(".")
				}, handleObjIn);

				// Init the event handler queue if we're the first
				if (!(handlers = events[type])) {
					handlers = events[type] = [];
					handlers.delegateCount = 0;

					// Only use addEventListener if the special events handler returns false
					if (!special.setup ||
						special.setup.call(elem, data, namespaces, eventHandle) === false) {

						if (elem.addEventListener) {
							elem.addEventListener(type, eventHandle, false);
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

			if (!elemData || !(events = elemData.events)) {
				return;
			}

			// Once for each type.namespace in types; type may be omitted
			types = (types || "").match(rnotwhite) || [""];
			t = types.length;
			while (t--) {
				tmp = rtypenamespace.exec(types[t]) || [];
				type = origType = tmp[1];
				namespaces = (tmp[2] || "").split(".").sort();

				// Unbind all events (on this namespace, if provided) for the element
				if (!type) {
					for (type in events) {
						Y.DOM.event.remove(elem, type + types[t], handler, selector, true);
					}
					continue;
				}

				special = Y.DOM.event.special[type] || {};
				type = (selector ? special.delegateType : special.bindType) || type;
				handlers = events[type] || [];
				tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");

				// Remove matching events
				origCount = j = handlers.length;
				while (j--) {
					handleObj = handlers[j];

					if ((mappedTypes || origType === handleObj.origType) &&
						(!handler || handler.guid === handleObj.guid) &&
						(!tmp || tmp.test(handleObj.namespace)) &&
						(!selector || selector === handleObj.selector ||
							selector === "**" && handleObj.selector)) {
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
			if (Y.DOM.isEmptyObject(events)) {
				delete elemData.handle;
				Y.DOM.data_priv.remove(elem, "events");
			}
		},

		trigger: function(event, data, elem, onlyHandlers) {

			var i, cur, tmp, bubbleType, ontype, handle, special,
				eventPath = [elem || document],
				type = Y.hasOwn.call(event, "type") ? event.type : event,
				namespaces = Y.hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];

			cur = tmp = elem = elem || document;

			// Don't do events on text and comment nodes
			if (elem.nodeType === 3 || elem.nodeType === 8) {
				return;
			}

			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if (rfocusMorph.test(type + Y.DOM.event.triggered)) {
				return;
			}

			if (type.indexOf(".") >= 0) {
				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split(".");
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf(":") < 0 && "on" + type;

			// Caller can pass in a Y.DOM.Event object, Object, or just an event type string
			event = event[Y.DOM.expando] ?
				event :
				new Y.DOM.Event(type, typeof event === "object" && event);

			// Trigger bitmask: & 1 for native handlers; & 2 for Y.DOM (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join(".");
			event.rnamespace = event.namespace ?
				new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") :
				null;

			// Clean up the event in case it is being reused
			event.result = undef;
			if (!event.target) {
				event.target = elem;
			}

			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ?
				[event] :
				Y.DOM.makeArray(data, [event]);

			// Allow special events to draw outside the lines
			special = Y.DOM.event.special[type] || {};
			if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
				return;
			}

			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if (!onlyHandlers && !special.noBubble && !Y.DOM.isWindow(elem)) {

				bubbleType = special.delegateType || type;
				if (!rfocusMorph.test(bubbleType + type)) {
					cur = cur.parentNode;
				}
				for (; cur; cur = cur.parentNode) {
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
				handle = (Y.DOM.data_priv.get(cur, "events") || {})[event.type] &&
					Y.DOM.data_priv.get(cur, "handle");
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
					if (ontype && Y.DOM.isFunction(elem[type]) && !Y.DOM.isWindow(elem)) {

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

		dispatch: function(event) {

			// Make a writable Y.DOM.Event from the native event object
			event = Y.DOM.event.fix(event);

			var i, j, ret, matched, handleObj,
				handlerQueue = [],
				args = Y.G.Slice.call(arguments),
				handlers = (Y.DOM.data_priv.get(this, "events") || {})[event.type] || [],
				special = Y.DOM.event.special[event.type] || {};

			// Use the fix-ed Y.DOM.Event rather than the (read-only) native event
			args[0] = event;
			event.delegateTarget = this;

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

		handlers: function(event, handlers) {
			var i, matches, sel, handleObj,
				handlerQueue = [],
				delegateCount = handlers.delegateCount,
				cur = event.target;

			// Find delegate handlers
			// Black-hole SVG <use> instance trees (#13180)
			// Avoid non-left-click bubbling in Firefox (#3861)
			if (delegateCount && cur.nodeType && (!event.button || event.type !== "click")) {

				for (; cur !== this; cur = cur.parentNode || this) {

					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if (cur.disabled !== true || event.type !== "click") {
						matches = [];
						for (i = 0; i < delegateCount; i++) {
							handleObj = handlers[i];

							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";

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
				handlerQueue.push({ elem: this, handlers: handlers.slice(delegateCount) });
			}

			return handlerQueue;
		},

		// Includes some event props shared by KeyEvent and MouseEvent
		props: ("altKey bubbles cancelable ctrlKey currentTarget eventPhase " +
			"metaKey relatedTarget shiftKey target timeStamp view which").split(" "),

		fixHooks: {},

		keyHooks: {
			props: "char charCode key keyCode".split(" "),
			filter: function(event, original) {

				// Add which for key events
				if (event.which == null) {
					event.which = original.charCode != null ? original.charCode : original.keyCode;
				}

				return event;
			}
		},

		mouseHooks: {
			props: ("button buttons clientX clientY offsetX offsetY pageX pageY " +
				"screenX screenY toElement").split(" "),
			filter: function(event, original) {
				var eventDoc, doc, body,
					button = original.button;

				// Calculate pageX/Y if missing and clientX/Y available
				if (event.pageX == null && original.clientX != null) {
					eventDoc = event.target.ownerDocument || document;
					doc = eventDoc.documentElement;
					body = eventDoc.body;

					event.pageX = original.clientX +
						(doc && doc.scrollLeft || body && body.scrollLeft || 0) -
						(doc && doc.clientLeft || body && body.clientLeft || 0);
					event.pageY = original.clientY +
						(doc && doc.scrollTop  || body && body.scrollTop  || 0) -
						(doc && doc.clientTop  || body && body.clientTop  || 0);
				}

				// Add which for click: 1 === left; 2 === middle; 3 === right
				// Note: button is not normalized, so don't use it
				if (!event.which && button !== undef) {
					event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
				}

				return event;
			}
		},

		fix: function(event) {
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
					rmouseEvent.test(type) ? this.mouseHooks :
						rkeyEvent.test(type) ? this.keyHooks :
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
				trigger: function() {
					if (this !== safeActiveElement() && this.focus) {
						this.focus();
						return false;
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function() {
					if (this === safeActiveElement() && this.blur) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {
				// For checkbox, fire native event so checked state will be right
				trigger: function() {
					if (this.type === "checkbox" && this.click && Y.DOM.nodeName(this, "input")) {
						this.click();
						return false;
					}
				},

				// For cross-browser consistency, don't fire native .click() on links
				_default: function(event) {
					return Y.DOM.nodeName(event.target, "a");
				}
			},

			beforeunload: {
				postDispatch: function(event) {

					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if (event.result !== undef && event.originalEvent) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		},

		simulate: function(type, elem, event, bubble) {
			// Piggyback on a donor event to simulate a different one.
			// Fake originalEvent to avoid donor's stopPropagation, but if the
			// simulated event prevents default then we do the same on the donor.
			var e = Y.DOM.extend(
				new Y.DOM.Event(),
				event,
				{
					type: type,
					isSimulated: true,
					originalEvent: {}
				}
			);
			if (bubble) {
				Y.DOM.event.trigger(e, null, elem);
			} else {
				Y.DOM.event.dispatch.call(elem, e);
			}
			if (e.isDefaultPrevented()) {
				event.preventDefault();
			}
		}
	};

	Y.DOM.removeEvent = function(elem, type, handle) {
		if (elem.removeEventListener) {
			elem.removeEventListener(type, handle, false);
		}
	};

	Y.DOM.Event = function(src, props) {
		// Allow instantiation without the 'new' keyword
		if (!(this instanceof Y.DOM.Event)) {
			return new Y.DOM.Event(src, props);
		}

		// Event object
		if (src && src.type) {
			this.originalEvent = src;
			this.type = src.type;

			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undef &&
				// Support: Android<4.0
				src.returnValue === false ?
				returnTrue :
				returnFalse;

			// Event type
		} else {
			this.type = src;
		}

		// Put explicitly provided properties onto the event object
		if (props) {
			Y.DOM.extend(this, props);
		}

		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || Y.now();

		// Mark it as fixed
		this[Y.DOM.expando] = true;
	};

// Y.DOM.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	Y.DOM.Event.prototype = {
		constructor: Y.DOM.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,

		preventDefault: function() {
			var e = this.originalEvent;

			this.isDefaultPrevented = returnTrue;

			if (e && e.preventDefault) {
				e.preventDefault();
			}
		},
		stopPropagation: function() {
			var e = this.originalEvent;

			this.isPropagationStopped = returnTrue;

			if (e && e.stopPropagation) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function() {
			var e = this.originalEvent;

			this.isImmediatePropagationStopped = returnTrue;

			if (e && e.stopImmediatePropagation) {
				e.stopImmediatePropagation();
			}

			this.stopPropagation();
		}
	};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
	Y.DOM.each({
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function(orig, fix) {
		Y.DOM.event.special[orig] = {
			delegateType: fix,
			bindType: fix,

			handle: function(event) {
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

// Support: Firefox, Chrome, Safari
// Create "bubbling" focus and blur events
	if (!Y.DOM.support.focusinBubbles) {
		Y.DOM.each({ focus: "focusin", blur: "focusout" }, function(orig, fix) {

			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function(event) {
				Y.DOM.event.simulate(fix, event.target, Y.DOM.event.fix(event), true);
			};

			Y.DOM.event.special[fix] = {
				setup: function() {
					var doc = this.ownerDocument || this,
						attaches = dataPriv.access(doc, fix);

					if (!attaches) {
						doc.addEventListener(orig, handler, true);
					}
					dataPriv.access(doc, fix, (attaches || 0) + 1);
				},
				teardown: function() {
					var doc = this.ownerDocument || this,
						attaches = dataPriv.access(doc, fix) - 1;

					if (!attaches) {
						doc.removeEventListener(orig, handler, true);
						dataPriv.remove(doc, fix);

					} else {
						dataPriv.access(doc, fix, attaches);
					}
				}
			};
		});
	}

	Y.DOM.fn.extend({

		on: function(types, selector, data, fn, /*INTERNAL*/ one) {
			var origFn, type;

			// Types can be a map of types/handlers
			if (typeof types === "object") {
				// (types-Object, selector, data)
				if (typeof selector !== "string") {
					// (types-Object, data)
					data = data || selector;
					selector = undef;
				}
				for (type in types) {
					this.on(type, selector, data, types[type], one);
				}
				return this;
			}

			if (data == null && fn == null) {
				// (types, fn)
				fn = selector;
				data = selector = undef;
			} else if (fn == null) {
				if (typeof selector === "string") {
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
				fn.guid = origFn.guid || (origFn.guid = Y.DOM.guid++);
			}
			return this.each(function() {
				Y.DOM.event.add(this, types, fn, data, selector);
			});
		},
		one: function(types, selector, data, fn) {
			return this.on(types, selector, data, fn, 1);
		},
		off: function(types, selector, fn) {
			var handleObj, type;
			if (types && types.preventDefault && types.handleObj) {
				// (event)  dispatched Y.DOM.Event
				handleObj = types.handleObj;
				Y.DOM(types.delegateTarget).off(
					handleObj.namespace ?
						handleObj.origType + "." + handleObj.namespace :
						handleObj.origType,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}
			if (typeof types === "object") {
				// (types-object [, selector])
				for (type in types) {
					this.off(type, selector, types[type]);
				}
				return this;
			}
			if (selector === false || typeof selector === "function") {
				// (types [, fn])
				fn = selector;
				selector = undef;
			}
			if (fn === false) {
				fn = returnFalse;
			}
			return this.each(function() {
				Y.DOM.event.remove(this, types, fn, selector);
			});
		},

		trigger: function(type, data) {
			return this.each(function() {
				Y.DOM.event.trigger(type, data, this);
			});
		},
		triggerHandler: function(type, data) {
			var elem = this[0];
			if (elem) {
				return Y.DOM.event.trigger(type, data, elem, true);
			}
		}
	});

	//---

	Y.DOM.each(("blur focus focusin focusout load resize scroll unload click dblclick " +
			"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
			"change select submit keydown keypress keyup error contextmenu").split(" "),
		function(i, name) {

			// Handle event binding
			Y.DOM.fn[name] = function(data, fn) {
				return arguments.length > 0 ?
					this.on(name, null, data, fn) :
					this.trigger(name);
			};
		});

	Y.DOM.fn.extend({
		hover: function(fnOver, fnOut) {
			return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
		},

		bind: function(types, data, fn) {
			return this.on(types, null, data, fn);
		},
		unbind: function(types, fn) {
			return this.off(types, null, fn);
		},

		delegate: function(selector, types, data, fn) {
			return this.on(types, selector, data, fn);
		},
		undelegate: function(selector, types, fn) {
			// (namespace) or (selector, types [, fn])
			return arguments.length === 1 ?
				this.off(selector, "**") :
				this.off(types, selector || "**", fn);
		}
	});

	// Attach a bunch of functions for handling common AJAX events
	Y.DOM.each([
		"ajaxStart",
		"ajaxStop",
		"ajaxComplete",
		"ajaxError",
		"ajaxSuccess",
		"ajaxSend"
	], function(i, type) {
		Y.DOM.fn[type] = function(fn) {
			return this.on(type, fn);
		};
	});

	//---

}());

// FILE: ./Source/Modules/Node/AnotherEvents.js

//---