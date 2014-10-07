/**
 * YAX Cookies [CORE][DOM/NODE][EXTENSION]
 */

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y */

(function () {

	//---

	'use strict';

	Y.Store.mergeObject('drivers', {
		cookies: {
			id: 'Y.Store.drivers.cookies',

			scope: 'Browser',

			/**
			 * @return {boolean}
			 */
			available: function () {
				try {
					return !!Y.UserAgent.Features.cookies;
				} catch (e) {
					Y.error(e);
					return false;
				}
			},

			initialise: Y.noop,

			/**
			 * @return {boolean}
			 */
			set: function (name, value) {
				var date, expire, key;

				date = new Date();
				date.setTime(date.getTime() + 31536000000);

				//expire = '; expires=' + date.toGMTString();
				expire = '; expires=' + date.toUTCString();

				if (Y.isString(name) && Y.isString(value)) {
					Y.doc.cookie = name + '=' + value + expire + '; path=/';
					return true;
				}

				if (Y.isObject(name) && Y.isUndefined(value)) {
					for (key in name) {
						if (name.hasOwnProperty(key)) {
							Y.doc.cookie = key + '=' + name[key] + expire + '; path=/';
						}
					}

					return true;
				}

				return false;
			},

			/**
			 * @return {string}
			 */
			get: function (name) {
				var newName, cookieArray, x, cookie;

				newName = name + '=';
				cookieArray = Y.doc.cookie.split(';');

				for (x = 0; x < cookieArray.length; x++) {
					cookie = cookieArray[x];

					while (cookie.charAt(0) === ' ') {
						cookie = cookie.substring(1, cookie.length);
					}

					if (cookie.indexOf(newName) === 0) {
						return cookie.substring(newName.length, cookie.length);
					}
				}

				return null;
			},

			delete: function (name) {
				this.set(name, '', -1);
			}
		}
	});

	//---

}());

// FILE: ./Source/Plugins/Cookies.js

//---


