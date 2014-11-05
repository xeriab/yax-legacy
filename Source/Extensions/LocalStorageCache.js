/**
 * YAX LocalStorageCache [CORE][DOM/NODE][EXTENSION]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function (global) {

	//---

	'use strict';

	Y.Store.mergeObject('drivers', {
		localStorageCache: {
			id: 'Y.Store.drivers.localStorageCache',

			t: (function () {
				return this;
			}),

			scope: 'All',

			/**
			 *
			 * @returns {boolean}
			 * @constructor
			 */
			available: function () {
				try {
					// Firefox won't allow localStorage if cookies are disabled
					if (Y.UA.features.localStorage) {
						// Safari's "Private" mode throws a QUOTA_EXCEEDED_ERR on setItem
						localStorage.setItem('Y.Store.localStorageCache Availability test', true);
						localStorage.removeItem('Y.Store.localStorageCache Availability test');

						return true;
					}

					return false;
				} catch (e) {
					Y.ERROR(e);
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

					if (!Y.isSet(global.localStorage)) {
						global.localStorage = {};
					}

					if (Y.isString(key) && Y.isString(value)) {
						global.localStorage[key] = value;
						return true;
					}

					if (Y.isObject(key) && Y.isUndefined(value)) {
						for (name in key) {
							if (key.hasOwnProperty(name)) {
								global.localStorage[name] = key[name];
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

				return global.localStorage[key];
			},

			'delete': function (key) {
				if (this.available()) {
					localStorage.removeItem(key);
				} else {
					delete global.localStorage[key];
				}
			},

			flush: function () {
				if (this.available()) {
					localStorage.clear();
				} else {
					global.localStorage = {};
				}
			}
		}
	});

	//---

}());

// FILE: ./Source/Extensions/LocalStorageCache.js

//---
