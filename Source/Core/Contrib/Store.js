/**
 * YAX Store Class [Contrib]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, Y, XMLSerializer, DOMParser, ActiveX */

(function (global, undef) {

	//---

	'use strict';

	Y.Store = Y.Class.extend({
		_class_name: 'Store',

		serialisers: {
			JSON: {
				id: 'Y.Store.serialisers.JSON',

				'initialise': function (encoders, decoders) {
					encoders.push('JSON');
					decoders.push('JSON');
				},

				encode: JSON.stringify,

				decode: JSON.parse
			},

			XML: {
				id: 'Y.Store.serialisers.XML',

				'initialise': function (encoders, decoders) {
					encoders.push('XML');
					decoders.push('XML');
				},

				isXML: function (value) {
					var docElement = (value ? value.ownerDocument || value : 0 ).documentElement;
					return docElement ? docElement.nodeName.toLowerCase() !== 'html' : false;
				},

				// Encodes a XML node to string (taken from $.jStorage, MIT License)
				encode: function (value) {
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
							Y.ERROR(er);
						}

						Y.ERROR(err);
					}

					return value;
				},

				// Decodes a XML node from string (taken from $.jStorage, MIT License)
				decode: function (value) {
					if (!value || value._serialised || value._serialised !== this.ID) {
						return value;
					}

					var domParser = (Y.hasOwn.call(global, 'DOMParser') && (new DOMParser()).parseFromString);

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
						(Y.hasOwn.call(global, 'DOMParser') && (new DOMParser())) || window,
						value.value,
						'text/xml'
					);

					return this.isXML( value.value ) ? value.value : undef;
				}
			}
		},

		drivers: {
			windowName: {
				id: 'Y.Store.drivers.windowName',

				scope: 'Window',

				sache: {

				},

				encodes: true,

				/**
				 *
				 * @returns {boolean}
				 * @constructor
				 */
				available: function () {
					return true;
				},

				initialise: function () {
					this.load();
				},

				save: function () {
					global.name = Y.Store.prototype.serialisers.JSON.encode(this.cache);
				},

				load: function () {
					try {
						this.cache = Y.Store.prototype.serialisers.JSON.decode(global.name + Y.empty);

						if (!Y.isObject(this.cache)) {
							this.cache = {};
						}
					} catch (e) {
						this.cache = {};
						global.name = '{}';
					}
				},

				set: function (key, value) {
					this.cache[key] = value;
					this.save();
				},

				get: function (key) {
					return this.cache[key];
				},

				'delete': function (key) {
					try {
						delete this.cache[key];
					} catch (e) {
						this.cache[key] = undef;
					}

					this.save();
				},

				flush: function () {
					global.name = '{}';
				}
			}
		},

		_init: function () {
			var args = Y.G.slice.call(arguments),
				len = args.length,
				x = 0;

			if (len === 1) {
				// this[args[0]] = this.drivers[args[0]];
				Y.extend(this, this.drivers[args[0]]);

				// delete this.drivers[args[0]];
			} else if (len > 1) {
				for (x; x < len; x++) {
					this[args[x]] = this.drivers[args[x]];
					// delete this.drivers[args[x]];
				}
			} else {
				Y.extend(this, this.drivers);
				// delete this.drivers;
			}
		}
	});

	//---

	// Y.Data = Y.Store.prototype.serialisers;

	//---

}());

// FILE: ./Source/Core/Contrib/Store.js

//---