/**
 * YAX Plugins | Cookies
 *
 * Cross browser Cookies implementation using YAX's API [CORE, Node]
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

	Y.Store.MergeObject('Drivers', {
		Cookies: {
			ID: 'Y.Store.Drivers.Cookies',

			Scope: 'Browser',

			/**
			 * @return {boolean}
			 */
			Available: function () {
				try {
					return !!Y.UserAgent.Features.Cookies;
				} catch (e) {
					Y.ERROR(e);
					return false;
				}
			},

			Initialise: Y.Lang.noop,

			/**
			 * @return {boolean}
			 */
			Set: function (name, value) {
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
			Get: function (name) {
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

			Delete: function (name) {
				this.Set(name, '', -1);
			}
		}
	});

	//---

}());

//---
