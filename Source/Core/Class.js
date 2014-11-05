/**
 * YAX Class
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function () {

	//---

	'use strict';

	// Throw error if trying to call a super that doesn't exist.
	var unImplementedSuper = function (method) {
		throw 'Super does not implement this method: ' + method;
	};

	// Used to test if the method has a super.
	var superTest = /\b_super\b/;

	// Used to mark a function so it can be unwrapped.
	var REF = '__extndmrk__';

	/**
	 * Y.Class powers the OOP facilities of the library.
	 */
	Y.Class = function () {};

	//---

	Y.CLASSES = [];

	//---

	Y.Class.extend = function (properties) {
		var parent = this;
		var newClass;
		var property;
		var _super = parent.prototype;

		// Allow class inheritance.
		// if (Y.isFunction(properties) && '__super__' in properties) {
		if (Y.isFunction(properties) && properties.hasOwnProperty('__super__')) {
			// Copy parent's prototype.
			var mixin = {};
			var attr;

			for (attr in properties.prototype) {
				if (attr !== 'constructor' &&
					properties.prototype.hasOwnProperty(attr)) {
					mixin[attr] = properties.prototype[attr];
				}
			}

			properties = mixin;
		}

		// The constructor calls the init method - all construction logic happens
		// in this method.
		newClass = function () {
			// Call the initialise constructor
			if (this.initialise) {
				this.initialise.apply(this, arguments);
			}

			/** @namespace this.construct */
			// Call the construct constructor
			if (this.construct) {
				// this.construct.apply(this, arguments);
				return this.construct.apply(this, arguments);
			}

			// Call the _init constructor
			if (this._init) {
				// this._init.apply(this, arguments);
				return this._init.apply(this, arguments);
			}

			// Call the init constructor
			if (this.init) {
				// this.init.apply(this, arguments);
				return this.init.apply(this, arguments);
			}

			// Call all constructor hooks
			if (this.initialHooks.length) {
				this.callInitialHooks();
			}
		};

		var	x;
		var n;
		var len;

		// jshint camelcase: false
		var proto = Y.Util.create(parent);

		proto.constructor = newClass;

		newClass.prototype = proto;

		// Inherit parent's statics
		for (x in this) {
			if (this.hasOwnProperty(x) && x !== 'prototype') {
				newClass[x] = this[x];
			}
		}

		if (properties._class_name) {
			Y.extend(newClass, {
				_class_name: properties._class_name.toString()
			});

			Y.CLASSES.push(properties._class_name.toString());

			delete properties._class_name;
		}

		// Mix static properties into the class
		/** @namespace properties._statics */
		if (properties._statics) {
			Y.extend(newClass, properties._statics);
			delete properties._statics;
		}

		// Mix includes into the prototype
		/** @namespace properties._includes */
		if (properties._includes) {
			Y.extend.apply(null, [proto].concat(properties._includes));
			delete properties._includes;
		}

		//  OPTIONS
		if (proto._options) {
			properties._options = Y.extend(Y.Util.create(proto._options), properties._options);
		}

		// Mix given properties into the prototype
		Y.extend(proto, properties);

		proto.initialHooks = [];

		// Add method for calling all hooks
		proto.callInitialHooks = function () {
			if (this.initialHooksCalled) {
				return;
			}

			if (parent.callInitialHooks) {
				parent.callInitialHooks.call(this);
			}

			this.initialHooksCalled = true;

			for (n = 0, len = proto.initialHooks.length; n < len; n++) {
				proto.initialHooks[n].call(this);
			}
		};

		// Extend `extend` and `__super__` into newClass.
		for (property in parent) {
			if (parent.hasOwnProperty(property)) {
				newClass[property] = parent[property];
			}
		}

		// Set the prototype chain to inherit from `parent`, without calling
		// `parent`'s constructor function.
		var Surrogate = function () {
			this.constructor = newClass;
		};

		Surrogate.prototype = parent.prototype;

		newClass.prototype = new Surrogate();
		newClass.prototype.__unwrappedSuper__ = {};

		// Add prototype properties (instance properties) to the subclass, if supplied.
		if (properties) {
			// Extend parent prototypes into newClass.
			for (property in properties) {
				if (properties.hasOwnProperty(property)) {
					newClass.prototype[property] = properties[property];
				}
			}

			// A function wrapper which assigns this._super for the duration of the call,
			// then marks the function so it can be unwrapped and re-wrapped for the next
			// call which allows for proper multiple inheritance.
			var functionWrapper = function (name, fn) {
				var func = function class_super() {
					var tmp = this._super;

					// Add a new ._super() method that is the same method
					// but on the super-class
					this._super = _super[name] || unImplementedSuper(name);

					// The method only need to be bound temporarily, so we
					// remove it when we're done executing
					var ret;

					try {
						ret = fn.apply(this, arguments);
					} finally {

						this._super = tmp;
					}
					return ret;
				};

				func[REF] = true;

				return func;
			};

			var name;
			var fun;

			// Copy the properties over onto the new prototype
			for (name in properties) {
				if (properties.hasOwnProperty(name)) {
					// Check if we're overwriting an existing function
					if (Y.isFunction(properties[name]) && superTest.test(properties[name])) {
						fun = newClass.prototype[name];

						if (fun[REF]) {
							properties[name] = newClass.prototype.__unwrappedSuper__[name];
						}

						newClass.prototype.__unwrappedSuper__[name] = properties[name];
						newClass.prototype[name] = functionWrapper(name, properties[name]);
					}
				}
			}
		}

		// Set a convenience property in case the parent's prototype is needed later.
		newClass.__super__ = parent.prototype;

		return newClass;
	};

	//---

	// Method for adding properties to prototype
	Y.Class.include = function (properties) {
		Y.extend(this.prototype, properties);
	};

	//---

	//  new default options to the Class
	Y.Class.options = function (options) {
		Y.extend(this.prototype._options, options);
	};

	//---

	//  new default object to the Class
	Y.Class.mergeObject = function (name, object) {
		Y.extend(this.prototype[name], object);
	};

	//---

	// Add a constructor hook
	// (Function) || (String, args...)
	Y.Class.addInitialHook = function (func) {
		var args = Y.G.slice.call(arguments, 1);
		var init;

		if (Y.isFunction(func)) {
			init = func;
		} else {
			init = function () {
				this[func].apply(this, args);
			};
		}

		this.prototype.initialHooks = this.prototype.initialHooks || [];
		this.prototype.initialHooks.push(init);
	};

	//---

	Y.Class.toString = function () {
		return '[YAX] Class:' +
			(this._class_name ? Y.empty + this._class_name + Y.empty : Y.empty) +
			' [C]';
	};

	//---

}());

// FILE: ./Source/Core/Class.js

//---