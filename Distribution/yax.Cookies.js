/**
 * YAX Plugins | cookies
 *
 * Cross browser cookies implementation using YAX's API [CORE, Node]
 *
 * @version     0.15
 * @depends:    Core, Node
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y */

(function () {

	'use strict';

	//---

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
					Y.ERROR(e);
					return false;
				}
			},

			initialise: Y.Lang.noop,

			/**
			 * @return {boolean}
			 */
			set: function (name, value) {
				var date, expire, key;

				date = new Date();
				date.setTime(date.getTime() + 31536000000);

				//expire = '; expires=' + date.toGMTString();
				expire = '; expires=' + date.toUTCString();

				if (Y.Lang.isString(name) && Y.Lang.isString(value)) {
					Y.Document.cookie = name + '=' + value + expire + '; path=/';
					return true;
				}

				if (Y.Lang.isObject(name) && Y.Lang.isUndefined(value)) {
					for (key in name) {
						if (name.hasOwnProperty(key)) {
							Y.Document.cookie = key + '=' + name[key] + expire + '; path=/';
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
				cookieArray = Y.Document.cookie.split(';');

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

//---


