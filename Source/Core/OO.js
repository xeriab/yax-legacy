/**
 * YAX Core | OO
 *
 * Another YAX's OO tools and shortcuts [CORE]
 *
 * @version     0.15
 * @depends:    Core, Global, Utility, Class
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

	////// ECMAScript 5 style notation
	if (Object.prototype.__defineGetter__ && !Object.defineProperty) {
		Object.defineProperty = function (obj, prop, desc) {
			// if ('get' in desc) {
			if (Y.HasOwnProperty.call(desc, 'get')) {
				obj.__defineGetter__(prop, desc.get);
			}

			// if ('set' in desc) {
			if (Y.HasOwnProperty.call(desc, 'set')) {
				obj.__defineSetter__(prop, desc.set);
			}
		};
	}

	//---

	/**
	 * set accessor like a ES5
	 * @param object{Object} required,
	 * @param props{Object} required, { prop: { set :<function>, get:<function> }, ... }
	 */
	function setAccessor(object, props) {
		if (Y.Lang.isObject(object) && Y.Lang.isObject(props)) {
			// Define setter and getter
			(function (obj, props) {
				var name;

				for (name in props) {
					if (props.hasOwnProperty(name)) {
						Object.defineProperty(obj, name, props[name]);
					}
				}
			}(object, props));
		}
	}

	/**
	 * createClass, Class builder for OOP
	 * implemented `new` operator checker : throw error message when not use `new`.
	 */

	/*
	 * @usage Y.OO.create('className', classMembers);
	 * @param className{string} required, Named oo-class.
	 * @param classMembers{object} required,
	 */

	/**
	 * inherit class, overloaded createClass.
	 * @usage Y.OO.create(className, BaseClass, classMembers);
	 */

	/*
	 * @param {string} required, Named oo-subclass.
	 * @param BaseClass{function} required, superclass created with createClass method.
	 * @param classMembers{string} required, oo-subclass members.
	 */
	function createClass() {
		var len, ooClassName, BaseClass, members, klass = null,
			args;

		args = Y.G.Slice(arguments);

		len = arguments.length;
		ooClassName = args[0];
		BaseClass = args[1];
		members = args[len - 1];

		// check arguments type
		if (!Y.Lang.isString(ooClassName) && Y.Lang.trim(ooClassName) !== '') {
			throw new TypeError(
				'not defined Y.OO ClassName in 1st argument, must be {string}.');
		}

		if (!(len === 2 && Y.Lang.isObject(members)) && !(len === 3 && Y.Lang.isFunction(
			BaseClass) && Y.Lang.isObject(members))) {
			throw new TypeError('wrong arguments.');
		}

		/** @namespace members.initialise */
		if (!members.initialise && !Y.Lang.isFunction(members.initialise)) {
			throw new TypeError('not defined initialise method in member object.');
		}

		/* jshint evil: true */
		// implement `new` operator error check.
		eval('klass=function ' + ooClassName +
			'(){try {this.initialise.apply(this, arguments)}catch(e){console.log(e.stack);throw "required `new` operator in `' +
			ooClassName + '`."}}');

		// inherit
		if (len === 3) {
			klass.prototype = new BaseClass();
			klass.prototype.constructor = klass;
		}

		Y.Extend(klass.prototype, members);

		return klass;
	}

	/**
	 * check `is-a` utility.
	 * @param accessor{object} subClass
	 * @param b{object} superClass
	 */
	function isAccessor(accessor, b) {
		var tmp = (Y.Lang.isFunction(accessor)) ? new accessor() : accessor;

		var result = false;

		while (!result) {
			result = tmp instanceof b;

			if (result || tmp instanceof Object) {
				break;
			}

			// tmp = tmp.__proto__;
			tmp = tmp.prototype;
		}

		return result;
	}

	Y.OO = {
		accessor: setAccessor,
		create: createClass,
		isAccessor: isAccessor
	};

	//---

}());

//---