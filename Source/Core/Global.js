/**
 * Y Core | Global
 *
 * Global Y's functions and shortcuts [CORE]
 *
 * @version     0.15
 * @depends:    Core
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX, window, DOMParser */

(function (undef) {

	'use strict';

	//---

	// Shortcuts global functions

	// Number of active Ajax requests
	// Y.AjaxActive = 0;

	//---


	//---

	Y.extend(Y.Lang, {
		// now: new Date().getTime(),
		// now: new Date().getTime(),
		now: Date.now,

		date: new Date(),

		/**
		 * Delay
		 *
		 * A sleep() like function
		 *
		 * @param    milliseconds Time in milliseconds
		 * @return    void
		 */
		delay: function (milliseconds) {
			var self = this;
			var start = self.now;
			var x;

			for (x = 0; x < 1e7; x++) {
				if ((new Date().getTime() - start) > milliseconds) {
					break;
				}
			}
		},

		parseJSON: JSON.parse
	});

	//---

	// Cross-browser XML parsing
	if (!Y.G.isNodeJs) {
		Y.extend(Y.Lang, {
			parseXML: function (data) {
				if (!data || !Y.Lang.isString(data)) {
					return null;
				}

				var xml, temp;

				// Support: IE9
				try {
					temp = new DOMParser();
					xml = temp.parseFromString(data, 'text/xml');
				} catch (e) {
					xml = undef;
					Y.ERROR(e);
				}

				if (!xml || xml.getElementsByTagName('parsererror').length) {
					Y.ERROR('Invalid XML: ' + data);
				}

				return xml;
			}
		});
	}

	Y.Lang.Now = Y.Lang.now();

	Y.extend(Y.Lang, {
		lowerCaseFirst: function (string) {
			string += this.empty();

			var t = string.charAt(0).toLowerCase();

			return t + string.substr(1);
		},

		upperCaseFirst: function (string) {
			string += this.empty();

			var t = string.charAt(0).toUpperCase();

			return t + string.substr(1);
		},

		upperCaseWords: function (string) {
			return (string + this.empty()).replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
				return $1.toUpperCase();
			});
		}
	});

}());

//---
