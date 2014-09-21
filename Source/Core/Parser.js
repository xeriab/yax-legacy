/**
 * Y Core | Parsers
 *
 * Powers Y's with Parsers capability [CORE]
 *
 * @version     0.15
 * @depends:    Core, Global, Utility
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, Y, XMLSerializer, DOMParser, ActiveX */

(function (global, undef) {

	'use strict';

	Y.Parser = Y.Class.Extend({
		STATICS: {
			// FOO: 'FOOED!!'
		},

		CLASS_NAME: 'Parser',

		Serialisers: {
			JSON: {
				ID: 'Y.Store.Serialisers.JSON',

				'Initialise': function (encoders, decoders) {
					encoders.push('JSON');
					decoders.push('JSON');
				},

				Encode: JSON.stringify,

				Decode: JSON.parse
			},

			XML: {
				ID: 'Y.Store.Serialisers.XML',

				'Initialise': function (encoders, decoders) {
					encoders.push('XML');
					decoders.push('XML');
				},

				isXML: function (value) {
					var docElement = (value ? value.ownerDocument || value : 0 ).documentElement;
					return docElement ? docElement.nodeName.toLowerCase() !== 'html' : false;
				},

				// Encodes a XML node to string (taken from $.jStorage, MIT License)
				Encode: function (value) {
					if (!value || value._serialised || !this.isXML(value)) {
						return value;
					}

					var _value = {
						_serialised: this.ID,
						value: value
					};

					try {
						// Mozilla, Webkit, Opera
						_value.value = new XMLSerializer().serializeToString(value);

						return _value;
					} catch (err) {
						try {
							// Internet Explorer
							_value.value = value.xml;

							return _value;
						} catch (er) {
							console.error(er);
						}

						console.error(err);
					}

					return value;
				},

				// Decodes a XML node from string (taken from $.jStorage, MIT License)
				Decode: function (value) {
					if (!value || value._serialised || value._serialised !== this.ID) {
						return value;
					}

					var domParser = (Y.HasOwnProperty.call(global, 'DOMParser') && (new DOMParser()).parseFromString);

					/** @namespace global.ActiveX */
					if (!domParser && global.ActiveX) {
						domParser = function (xmlString) {
							var xmlDoc = new ActiveX('Microsoft.XMLDOM');

							xmlDoc.async = 'false';
							xmlDoc.loadXML(xmlString);

							return xmlDoc;
						};
					}

					if (!domParser) {
						return undef;
					}

					value.value = domParser.call(
							(Y.HasOwnProperty.call(global, 'DOMParser') && (new DOMParser())) || Y.Window,
						value.value,
						'text/xml'
					);

					return this.isXML( value.value ) ? value.value : undef;
				}
			}
		},

		Drivers: {},

		construct: function () {
			var args = Y.G.Slice.call(arguments),
				len = args.length,
				x = 0;

			if (len === 1) {
				Y.Extend(this, this.Drivers[args[0]]);
			} else if (len > 1) {
				for (x; x < len; x++) {
					this[args[x]] = this.Drivers[args[x]];
				}
			} else {
				Y.Extend(this, this.Drivers);
			}
		}
	});

	//---

	//	Y.Parsers = Y.Parser.prototype.Drivers;

	//---

}());

//---
