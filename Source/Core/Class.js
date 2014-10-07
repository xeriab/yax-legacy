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


	/**
	 * Y.Class powers the OOP facilities of the library.
	 */
	Y.Class = function () {};

	//---

	Y.Class.extend = function (properties) {
		// Extended class with the new prototype
		var newClass = function () {
			// Call the initialise constructor
			if (this.initialise) {
				this.initialise.apply(this, arguments);
			}

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

			// Call all constructor hooks
			if (this.initialHooks.length) {
				this.callInitialHooks();
			}
		};

		var	x;
		var n;
		var len;

		// jshint camelcase: false
		var parentProto = newClass.__super__ = this.prototype;
		var proto = Y.Util.create(parentProto);

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

			if (parentProto.callInitialHooks) {
				parentProto.callInitialHooks.call(this);
			}

			this.initialHooksCalled = true;

			for (n = 0, len = proto.initialHooks.length; n < len; n++) {
				proto.initialHooks[n].call(this);
			}
		};

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
		var args = Y.G.Slice.call(arguments, 1);
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
		return '[Y: Class' + (this._class_name ? '::' + this._class_name + ']' : ']');
	};

	//---

}());

// FILE: ./Source/Core/Class.js

//---