/**
 * Y Plugins | LocalStorage
 *
 * Cross browser LocalStorage implementation using Y's API [CORE, Node]
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

	Y.Store.MergeObject('Drivers', {
		LocalStorage: {
			ID: 'Y.Store.Drivers.LocalStorage',

			Scope: 'All',

			/**
			 *
			 * @returns {boolean}
			 * @constructor
			 */
			Available: function () {
				try {
					// Firefox won't allow localStorage if cookies are disabled
					if (Y.UserAgent.Features.LocalStorage) {
						// Safari's "Private" mode throws a QUOTA_EXCEEDED_ERR on setItem
						Y.Window.localStorage.setItem('Y.Store.LocalStorage Availability test', true);
						Y.Window.localStorage.removeItem('Y.Store.LocalStorage Availability test');

						return true;
					}

					return false;
				} catch (e) {
					Y.ERROR(e);
					return false;
				}
			},

			Initialise: Y.Lang.Noop,

			/**
			 * @return {boolean}
			 */
			Set: function (key, value) {
				if (this.Available()) {
					Y.Window.localStorage.setItem(key, value);
				} else {
					var name;

					Y.Window.LocalStorage = {};

					if (Y.Lang.isString(key) && Y.Lang.isString(value)) {
						Y.Window.LocalStorage[key] = value;
						return true;
					}

					if (Y.Lang.isObject(key) && Y.Lang.isUndefined(value)) {
						for (name in key) {
							if (key.hasOwnProperty(name)) {
								Y.Window.LocalStorage[name] = key[name];
							}
						}

						return true;
					}

					return false;
				}
			},

			Get: function (key) {
				if (this.Available()) {
					return Y.Window.localStorage.getItem(key);
				}

				return Y.Window.LocalStorage[key];
			},

			Delete: function (key) {
				if (this.Available()) {
					Y.Window.localStorage.removeItem(key);
				} else {
					delete Y.Window.LocalStorage[key];
				}
			},

			Flush: function () {
				if (this.Available()) {
					Y.Window.localStorage.clear();
				} else {
					Y.Window.LocalStorage = {};
				}
			}
		}
	});

	//---

}());

//---
