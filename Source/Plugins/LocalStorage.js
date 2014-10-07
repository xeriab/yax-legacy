/**
 * YAX LocalStorage [CORE][DOM/NODE][EXTENSION]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function () {

	//---

	'use strict';

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
					if (Y.UserAgent.Features.LocalStorage) {
						// Safari's "Private" mode throws a QUOTA_EXCEEDED_ERR on setItem
						localStorage.setItem('Y.Store.localStorage Availability test', true);
						localStorage.removeItem('Y.Store.localStorage Availability test');

						return true;
					}

					return false;
				} catch (e) {
					Y.error(e);
					return false;
				}
			},

			initialise: Y.noop,

			/**
			 * @return {boolean}
			 */
			set: function (key, value) {
				if (this.available()) {
					localStorage.setItem(key, value);
				} else {
					var name;

					Y.win.localStorage = {};

					if (Y.isString(key) && Y.isString(value)) {
						Y.win.localStorage[key] = value;
						return true;
					}

					if (Y.isObject(key) && Y.isUndefined(value)) {
						for (name in key) {
							if (key.hasOwnProperty(name)) {
								Y.win.localStorage[name] = key[name];
							}
						}

						return true;
					}

					return false;
				}
			},

			get: function (key) {
				if (this.available()) {
					return localStorage.getItem(key);
				}

				return Y.win.localStorage[key];
			},

			delete: function (key) {
				if (this.available()) {
					localStorage.removeItem(key);
				} else {
					delete Y.win.localStorage[key];
				}
			},

			flush: function () {
				if (this.available()) {
					localStorage.clear();
				} else {
					Y.win.localStorage = {};
				}
			}
		}
	});

	//---

}());

// FILE: ./Source/Plugins/LocalStorage.js

//---
