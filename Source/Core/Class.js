/**
 * Y Core | Class
 *
 * Powers the OOP facilities of Y's [CORE]
 *
 * @version     0.15
 * @depends:    Core, Global, Utility
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function () {

	'use strict';

	//---

	/**
	 * Y.Class powers the OOP facilities of the library.
	 */
	Y.Class = function () {

	};
	// END OF Y.Class OBJECT

	//---

	Y.Class.Extend = Y.Class.extend = function (properties) {
		// Extended class with the new prototype
		var newClass = function () {
			// Call the initialise constructor
			if (this.initialise) {
				this.initialise.apply(this, arguments);
			}

			// Call the construct constructor
			/** @namespace this.construct */
			if (this.construct) {
				// this.construct.apply(this, arguments);
				return this.construct.apply(this, arguments);
			}

//			Y.LOG(this.initialHooks);

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
		var proto = Y.Utility.Create(parentProto);

		proto.constructor = newClass;

		newClass.prototype = proto;

		// Inherit parent's statics
		for (x in this) {
			if (this.hasOwnProperty(x) && x !== 'prototype') {
				newClass[x] = this[x];
			}
		}

		// Y.Log(properties.CLASS_NAME);

		if (properties.CLASS_NAME) {
			Y.Extend(newClass, {
				CLASS_NAME: properties.CLASS_NAME.toString()
			});

			delete properties.CLASS_NAME;
		}

		// Mix static properties into the class
		if (properties.STATICS) {
			Y.Extend(newClass, properties.STATICS);
			delete properties.STATICS;
		}

		// Mix includes into the prototype
		/** @namespace properties.INCLUDES */
		if (properties.INCLUDES) {
			Y.Extend.apply(null, [proto].concat(properties.INCLUDES));
			/** @namespace properties.Includes */
			delete properties.INCLUDES;
		}

		//  OPTIONS
		if (proto.OPTIONS) {
			properties.OPTIONS = Y.Extend(Y.Utility.Create(proto.OPTIONS), properties.OPTIONS);
		}

		// Mix given properties into the prototype
		Y.Extend(proto, properties);

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
	Y.Class.Include = Y.Class.include = function (properties) {
		Y.Extend(this.prototype, properties);
	};

	//---

	//  new default options to the Class
	Y.Class.Options = Y.Class.options = function (options) {
		Y.Extend(this.prototype.OPTIONS, options);
	};

	//---

	//  new default object to the Class
	Y.Class.MergeObject = Y.Class.mergeObject = function (name, object) {
		Y.Extend(this.prototype[name], object);
	};

	//---

	// Add a constructor hook
	// (Function) || (String, args...)
	Y.Class.addInitialHook = function (func) {
		var args = Y.G.Slice.call(arguments, 1);
		var init;

		if (Y.Lang.isFunction(func)) {
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

	// Y.Class.constructor = Y.Lang.Noop;

	//---

	Y.Class.toString = function () {
		return '[YAX::Class' + (this.CLASS_NAME ? '::' + this.CLASS_NAME + ']' : ']');
	};

	//---

}());

//---
