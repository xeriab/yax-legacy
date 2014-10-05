/**
 * Y Plugins | localStorage
 *
 * Cross browser localStorage implementation using Y's API [CORE, Node]
 *
 * @version     0.15
 * @depends:    Core, Node
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

	Y.Store.mergeObject('drivers', {
		localStorage: {
			id: 'Y.Store.drivers.localStorage',

			scope: 'All',

			/**
			 *
			 * @returns {boolean}
			 * @constructor
			 */
			available: function () {
				try {
					// Firefox won't allow localStorage if cookies are disabled
					if (Y.UserAgent.Features.localStorage) {
						// Safari's "Private" mode throws a QUOTA_EXCEEDED_ERR on setItem
						Y.Window.localStorage.setItem('Y.Store.localStorage Availability test', true);
						Y.Window.localStorage.removeItem('Y.Store.localStorage Availability test');

						return true;
					}

					return false;
				} catch (e) {
					Y.ERROR(e);
					return false;
				}
			},

			initialise: Y.Lang.Noop,

			/**
			 * @return {boolean}
			 */
			set: function (key, value) {
				if (this.available()) {
					Y.Window.localStorage.setItem(key, value);
				} else {
					var name;

					Y.Window.localStorage = {};

					if (Y.Lang.isString(key) && Y.Lang.isString(value)) {
						Y.Window.localStorage[key] = value;
						return true;
					}

					if (Y.Lang.isObject(key) && Y.Lang.isUndefined(value)) {
						for (name in key) {
							if (key.hasOwnProperty(name)) {
								Y.Window.localStorage[name] = key[name];
							}
						}

						return true;
					}

					return false;
				}
			},

			get: function (key) {
				if (this.available()) {
					return Y.Window.localStorage.getItem(key);
				}

				return Y.Window.localStorage[key];
			},

			delete: function (key) {
				if (this.available()) {
					Y.Window.localStorage.removeItem(key);
				} else {
					delete Y.Window.localStorage[key];
				}
			},

			flush: function () {
				if (this.available()) {
					Y.Window.localStorage.clear();
				} else {
					Y.Window.localStorage = {};
				}
			}
		}
	});

	//---

}());

//---


