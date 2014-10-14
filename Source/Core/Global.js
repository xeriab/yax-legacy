/**
 * YAX Global Shortcuts
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX, window, DOMParser */

(function (undef) {

	//---

	'use strict';

	Y.extend({
		now: Date.now || function() {
			return new Date().getTime();
		},

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
		Y.extend({
			parseXML: function (data) {
				if (!data || !Y.isString(data)) {
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

	Y.extend({
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

	//---

}());

// FILE: ./Source/Core/Global.js

//---
