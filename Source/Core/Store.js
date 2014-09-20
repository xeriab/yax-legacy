/**
 * Y Core | Store
 *
 * Powers Y's with store capability [CORE]
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

	Y.Store = Y.Class.Extend({
		STATICS: {
			// FOO: 'FOOED!!'
		},

		CLASS_NAME: 'Store',

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

					var domParser = (Y.ObjectHasProperty(global, 'DOMParser') && (new DOMParser()).parseFromString);

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
						(Y.ObjectHasProperty(global, 'DOMParser') && (new DOMParser())) || Y.Window,
						value.value,
						'text/xml'
					);

					return this.isXML( value.value ) ? value.value : undef;
				}
			}
		},

		Drivers: {
			WindowName: {
				ID: 'Y.Store.Drivers.WindowName',

				Scope: 'Window',

				Cache: {

				},

				Encodes: true,

				/**
				 *
				 * @returns {boolean}
				 * @constructor
				 */
				Available: function () {
					return true;
				},

				Initialise: function () {
					this.Load();
				},

				Save: function () {
					global.name = Y.Store.prototype.Serialisers.JSON.Encode(this.Cache);
				},

				Load: function () {
					try {
						this.Cache = Y.Store.prototype.Serialisers.JSON.Decode(global.name + Y.Lang.empty);

						if (!Y.Lang.isObject(this.Cache)) {
							this.Cache = {};
						}
					} catch (e) {
						this.Cache = {};
						global.name = '{}';
					}
				},

				Set: function (key, value) {
					this.Cache[key] = value;
					this.Save();
				},

				Get: function (key) {
					return this.Cache[key];
				},

				Delete: function (key) {
					try {
						delete this.Cache[key];
					} catch (e) {
						this.Cache[key] = undef;
					}

					this.Save();
				},

				Flush: function () {
					global.name = '{}';
				}
			}
		},

		construct: function () {
			var args = Y.G.Slice.call(arguments),
				len = args.length,
				x = 0;
//				tmpFunc;

//			tmpFunc = function (variable) {
//				var t = Y.Lang.strReplace('-', ' ', variable);
//
//				t = Y.Lang.upperCaseWords(t);
//				t = Y.Lang.strReplace(' ', '', t);
//
//				return t;
//			};

//			for (x; x < len; x++) {
//				this.loaded_driver = this.Drivers[tmpFunc(args[x])];
//			}

			if (len === 1) {
				// this[args[0]] = this.Drivers[args[0]];
				Y.Extend(this, this.Drivers[args[0]]);

				// delete this.Drivers[args[0]];
			} else if (len > 1) {
				for (x; x < len; x++) {
					this[args[x]] = this.Drivers[args[x]];
					// delete this.Drivers[args[x]];
				}
			} else {
				Y.Extend(this, this.Drivers);
				// delete this.Drivers;
			}
		}
	});

	//---

	// Y.Data = Y.Store.prototype.Serialisers;

	//---

}());

//---
