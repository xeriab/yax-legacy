/**
 * YAX Evented
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function () {

	//---

	'use strict';

	/**
	 * Y.Events is a base class that YAEX classes inherit from to
	 * handle custom events.
	 */
	Y.Evented = Y.Class.extend({
		_class_name: 'Evented',

		eventsArray: [],

		on: function (types, callback, context) {
			var type, i, len;
			// Types can be a map of types/handlers
			if (Y.isObject(types)) {
				for (type in types) {
					if (Y.hasOwn.call(types, type)) {
						// We don't process space-separated events here for performance;
						// It's a hot path since Layer uses the on(obj) syntax
						this._On(type, types[type], callback);
					}
				}

			} else {
				// types can be a string of space-separated words
				types = Y.Util.splitWords(types);

				for (i = 0, len = types.length; i < len; i++) {
					this._On(types[i], callback, context);
				}
			}

			return this;
		},

		off: function (types, callback, context) {
			var type, i, len;
			if (!types) {
				// Clear all listeners if called without arguments
				delete this.eventsArray;
			} else if (Y.isObject(types)) {
				for (type in types) {
					if (Y.hasOwn.call(types, type)) {
						this._Off(type, types[type], callback);
					}
				}
			} else {
				types = Y.Util.splitWords(types);

				for (i = 0, len = types.length; i < len; i++) {
					this._Off(types[i], callback, context);
				}
			}

			return this;
		},

		// Attach listener (without syntactic sugar now)
		_On: function (type, callback, context) {
			// var events = this.eventsArray = this.eventsArray || {},
			var events = this.eventsArray || {},
				contextId = context && context !== this && Y.stamp(context),
				indexKey,
				indexLenKey,
				typeIndex,
				id;

			if (contextId) {
				// Store listeners with custom context in a separate hash (if it has an id);
				// gives a major performance boost when firing and removing events (e.g. on map object)

				indexKey = type + '_idx';
				indexLenKey = type + '_len';
				typeIndex = events[indexKey] = events[indexKey] || {};
				id = Y.stamp(callback) + '_' + contextId;

				if (!typeIndex[id]) {
					typeIndex[id] = {
						callback: callback,
						ctx: context
					};

					// Keep track of the number of keys in the index to quickly check if it's empty
					events[indexLenKey] = (events[indexLenKey] || 0) + 1;
				}

			} else {
				// Individual layers mostly use "this" for context and don't fire listeners too often
				// so simple array makes the memory footprint better while not degrading performance
				events[type] = events[type] || [];
				events[type].push({callback: callback});
			}
		},

		_Off: function (type, callback, context) {
			var events = this.eventsArray,
				indexKey = type + '_idx',
				indexLenKey = type + '_len',
				contextId,
				listeners,
				i,
				len,
				listener,
				id;

			if (!events) {
				return;
			}

			if (!callback) {
				// Clear all listeners for a type if function isn't specified
				delete events[type];
				delete events[indexKey];
				delete events[indexLenKey];
				return;
			}

			contextId = context && context !== this && Y.stamp(context);

			if (contextId) {
				id = Y.stamp(callback) + '_' + contextId;
				listeners = events[indexKey];

				if (listeners && listeners[id]) {
					listener = listeners[id];
					delete listeners[id];
					events[indexLenKey]--;
				}

			} else {
				listeners = events[type];

				for (i = 0, len = listeners.length; i < len; i++) {
					if (listeners[i].callback === callback) {
						listener = listeners[i];
						listeners.splice(i, 1);
						break;
					}
				}
			}

			// Set the removed listener to noop so that's not called if remove happens in fire
			if (listener) {
				listener.callback = Y.noop;
			}
		},

		fire: function (type, data, propagate) {
			if (!this.listens(type, propagate)) {
				return this;
			}

			var event = Y.extend({}, data, {type: type, target: this}),
				events = this.eventsArray,
				typeIndex,
				i,
				len,
				listeners,
				id;

			if (events) {
				typeIndex = events[type + '_idx'];

				if (events[type]) {
					// Make sure adding/removing listeners inside other listeners won't cause infinite loop
					listeners = events[type].slice();

					for (i = 0, len = listeners.length; i < len; i++) {
						listeners[i].callback.call(this, event);
					}
				}

				// Fire event for the context-indexed listeners as well
				for (id in typeIndex) {
					if (typeIndex.hasOwnProperty(id)) {
						typeIndex[id].callback.call(typeIndex[id].ctx, event);
					}
				}
			}

			if (propagate) {
				// Propagate the event to parents (set with addEventParent)
				this.propagateEvent(event);
			}

			return this;
		},

		listens: function (type, propagate) {
			var events = this.eventsArray, id;

			if (events && (events[type] || events[type + '_len'])) {
				return true;
			}

			if (propagate) {
				// Also check parents for listeners if event propagates
				for (id in this.eventParents) {
					if (Y.hasOwn.call(this.eventParents, id)) {
						if (this.eventParents[id].listens(type)) {
							return true;
						}
					}
				}
			}
			return false;
		},

		once: function (types, callback, context) {
			var type, handler;

			if (typeof types === 'object') {
				for (type in types) {
					if (types.hasOwnProperty(type)) {
						this.once(type, types[type], callback);
					}
				}
				return this;
			}

			handler = Y.Bind(function () {
				this
					.off(types, callback, context)
					.off(types, handler, context);
			}, this);

			// Add a listener that's executed once and removed after that
			return this
				.on(types, callback, context)
				.on(types, handler, context);
		},

		// Adds a parent to propagate events to (when you fire with true as a 3rd argument)
		addEventParent: function (obj) {
			this.eventParents = this.eventParents || {};
			this.eventParents[Y.stamp(obj)] = obj;
			return this;
		},

		removeEventParent: function (obj) {
			if (this.eventParents) {
				delete this.eventParents[Y.stamp(obj)];
			}
			return this;
		},

		propagateEvent: function (e) {
			var id;

			for (id in this.eventParents) {
				if (Y.hasOwn.call(this.eventParents, id)) {
					this.eventParents[id].fire(e.type, Y.extend({layer: e.target}, e));
				}
			}
		}
	}); // END OF Y.Evented CLASS

	//---

	var prototype = Y.Evented.prototype;

	// Aliases; we should ditch those eventually
	prototype.addEventListener = prototype.on;
	prototype.removeEventListener = prototype.clearAllEventListeners = prototype.off;
	prototype.addOneTimeEventListener = prototype.once;
	prototype.fireEvent = prototype.fire;
	prototype.hasEventListeners = prototype.listens;

	Y.Mixin.Events = prototype;

	//---

}());

// FILE: ./Source/Core/Evented.js

//---