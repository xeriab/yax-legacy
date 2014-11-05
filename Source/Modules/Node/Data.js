/**
 * YAX Data [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function () {

	//---

	'use strict';

	function Data () {
		// Support: Android < 4,
		// Old WebKit does not have .preventExtensions/freeze method,
		// return new empty object instead with no [[set]] accessor
		Object.defineProperty(this.cache = {}, 0, {
			get: function () {
				return {};
			}
		});

		this.expando = Y.DOM.expando;
	}

	Data.UID = 1;

	Data.accepts = function (owner) {
		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  -
		//    - Any
		return owner.nodeType ?
			owner.nodeType === 1 || owner.nodeType === 9 : 
			true;
	};

	Data.prototype = {
		key: function (owner) {
			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return the key for a frozen object.
			if (!Data.accepts(owner)) {
				return 0;
			}

			var descriptor = {},
			// Check if the owner object already has a cache key
				unlock = owner[this.expando];

			// If not, create one
			if (!unlock) {
				unlock = Data.UID++;

				// Secure it in a non-enumerable, non-writable property
				try {
					descriptor[this.expando] = {
						value: unlock
					};
					Object.defineProperties(owner, descriptor);

					// Support: Android < 4
					// Fallback to a less secure definition
				} catch (e) {
					descriptor[this.expando] = unlock;
					Y.extend(owner, descriptor);
				}
			}

			// Ensure the cache object
			if (!this.cache[unlock]) {
				this.cache[unlock] = {};
			}

			return unlock;
		},
		
		set: function (owner, data, value) {
			var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this 'owner', create one inline
			// and set the unlock as though an owner entry had always existed
				unlock = this.key(owner),
				cache = this.cache[unlock];

			// Handle: [ owner, key, value ] args
			if (typeof data === 'string') {
				cache[data] = value;

				// Handle: [ owner, { properties } ] args
			} else {
				// Fresh assignments by object are shallow copied
				if (Y.isEmpty(cache)) {
					Y.extend(this.cache[unlock], data);
					// Otherwise, copy the properties one-by-one to the cache object
				} else {
					for (prop in data) {
						if (data.hasOwnProperty(prop)) {
							cache[prop] = data[prop];
						}
					}
				}
			}
			return cache;
		},
		
		get: function (owner, key) {
			// Either a valid cache is found, or will be created.
			// New caches will be created and the unlock returned,
			// allowing direct access to the newly created
			// empty data object. A valid owner object must be provided.
			var cache = this.cache[this.key(owner)];

			return key === undefined ?
				cache : cache[key];
		},
		
		access: function (owner, key, value) {
			var stored;
			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the 'read' path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if (key === undefined ||
				((key && typeof key === 'string') && value === undefined)) {

				stored = this.get(owner, key);

				return stored !== undefined ?
					stored : this.get(owner, Y.camelise(key));
			}

			// [*]When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set(owner, key, value);

			// Since the 'set' path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		
		remove: function (owner, key) {
			var i, name, camel,
				unlock = this.key(owner),
				cache = this.cache[unlock];

			if (key === undefined) {
				this.cache[unlock] = {};

			} else {
				// Support array or space separated string of keys
				if (Y.isArray(key)) {
					// If 'name' is an array of keys...
					// When data is initially created, via ('key', 'val') signature,
					// keys will be converted to camelCase.
					// Since there is no way to tell _how_ a key was added, remove
					// both plain key and camelCase key. #12786
					// This will only penalize the array argument path.
					name = key.concat(key.map(Y.camelise));
				} else {
					camel = Y.camelise(key);
					// Try the string as a key before any manipulation
					if (cache.hasOwnProperty(key)) {
						name = [key, camel];
					} else {
						// If a key with the spaces exists, use it.
						// Otherwise, create an array by matching non-whitespace
						name = camel;
						name = cache.hasOwnProperty(name) ? [name] : (name.match(/\S+/g) || []);
					}
				}

				i = name.length;

				while (i--) {
					delete cache[name[i]];
				}
			}
		},
		
		hasData: function (owner) {
			return !Y.isEmpty(
					this.cache[owner[this.expando]] || {}
			);
		},
		
		discard: function (owner) {
			if (owner[this.expando]) {
				delete this.cache[owner[this.expando]];
			}
		}
	};
	
	//---

	// These may be used throughout the YAX core codebase
	Y.DOM.dataUser = Y.DOM.data_user = new Data();
	Y.DOM.dataPrivative = Y.DOM.data_priv = new Data();

	//---

	function dataAttribute(elem, key, data) {
		var name;

		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if (data === undefined && elem.nodeType === 1) {
			name = 'data-' + key.replace(Y.G.regexList.multiDash, '-$1').toLowerCase();
			data = elem.getAttribute(name);

			if (typeof data === 'string') {
				try {
					data = data === 'true' ? true :
							data === 'false' ? false :
							data === 'null' ? null :
						// Only convert to a number if it doesn't change the string
							+ data + Y.empty === data ? +data :
								Y.G.regexList.brace.test(data) ? JSON.parse(data) :
							data;
				} catch (e) {
					console.log(e);
				}

				// Make sure we set the data so it isn't changed later
				Y.DOM.dataUser.set(elem, key, data);
			} else {
				data = undefined;
			}
		}

		return data;
	}
	
	//---

	Y.DOM.extend({
		acceptData: Data.accepts,
		
		hasData: function (elem) {
			return Y.DOM.dataUser.hasData(elem) || Y.DOM.dataPrivative.hasData(elem);
		},
		
		data: function (elem, name, data) {
			return Y.DOM.dataUser.access(elem, name, data);
		},
		
		removeData: function (elem, name) {
			Y.DOM.dataUser.remove(elem, name);
		},

		_data: function (elem, name, data) {
			return Y.DOM.dataPrivative.access(elem, name, data);
		},
		
		_removeData: function (elem, name) {
			Y.DOM.dataPrivative.remove(elem, name);
		}
	});
	
	//---

	Y.DOM.Function.extend({
		data: function (key, value) {
			var attrs, name,
				elem = this[0],
				i = 0,
				datao = null;
			var self = this;

			// Gets all values
			if (key === undefined) {
				if (this.length) {
					datao = Y.DOM.dataUser.get(elem);

					if (elem.nodeType === 1 && !Y.DOM.dataPrivative.get(elem, 'hasDataAttrs')) {
						attrs = elem.attributes;

						for (i; i < attrs.length; i++) {
							name = attrs[i].name;

							if (name.indexOf('data-') === 0) {
								name = Y.camelise(name.slice(5));
								dataAttribute(elem, name, datao[name]);
							}
						}

						Y.DOM.dataPrivative.set(elem, 'hasDataAttrs', true);
					}
				}

				return datao;
			}

			// Sets multiple values
			if (typeof key === 'object') {
				return this.each(function () {
					Y.DOM.dataUser.set(this, key);
				});
			}

			return Y.DOM.Access(this, function (value) {
				var _data,
					camelKey = Y.camelise(key);

				// The calling YAX object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty YAX object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if (elem && value === undefined) {
					// Attempt to get data from the cache
					// with the key as-is
					_data = Y.DOM.dataUser.get(elem, key);

					if (_data !== undefined) {
						return _data;
					}

					// Attempt to get data from the cache
					// with the key Camelised
					_data = Y.DOM.dataUser.get(elem, camelKey);
					if (_data !== undefined) {
						return _data;
					}

					// Attempt to 'discover' the data in
					// HTML5 custom data-* attrs
					_data = dataAttribute(elem, camelKey, undefined);
					if (_data !== undefined) {
						return _data;
					}

					// We tried really hard, but the data doesn't exist.
					return;
				}

				// Set the data...
				self.each(function () {
					// First, attempt to store a copy or reference of any
					// data that might've been store with a camelCased key.
					var __data = Y.DOM.dataUser.get(this, camelKey);

					// For HTML5 data-* attribute interop, we have to
					// store property names with dashes in a camelCase form.
					// This might not apply to all properties...*
					Y.DOM.dataUser.set(this, camelKey, value);

					// *... In the case of properties that might _actually_
					// have dashes, we need to also store a copy of that
					// unchanged property.
					if (key.indexOf('-') !== -1 && __data !== undefined) {
						Y.DOM.dataUser.set(this, key, value);
					}
				});
			}, null, value, arguments.length > 1, null, true);
		},
		
		removeData: function (key) {
			return this.each(function () {
				Y.DOM.dataUser.remove(this, key);
			});
		}
	});

	//---

}());

// FILE: ./Source/Modules/Node/Data.js

//---