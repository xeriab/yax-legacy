/**
 * YAX Config
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint unused: true */
/*global Y */

(function () {

	//---

	'use strict';

	function Config() {
		var args = Y.G.slice.call(arguments);

		Object.defineProperty(this.STORAGE = {}, 0, {
			get: function () {
				return {};
			}
		});

		/*this.EXPANDO = 'YAX' + (Y.VERSION.toString() +
			Y.random(1000000, 20000000)).replace(/\D/g, Y.empty);*/

		this.dl = null;

		if (Y.isUndefined(args)) {
			return this.STORAGE;
		}
	}

	Config.prototype = {
		set: function setConfig() {
			var args = Y.G.slice.call(arguments);

			var key = args[0];
			var tmpKey = key.split(':');
			var newVal = args[1];

			var oldVal;
			var self = this;
			var setArr;

			if (tmpKey && tmpKey.length > 1 && tmpKey.length == 2) {
				this.STORAGE[tmpKey[0]] = this.STORAGE[tmpKey[0]] || {};

				oldVal = this.STORAGE[tmpKey[0]].LOCAL_VALUE[tmpKey[1]];

				setArr = function setArr(_oldVal) {
					// Although these are set individually, they are all accumulated
					if (Y.isUndefined(_oldVal)) {
						self.STORAGE[tmpKey[0]].LOCAL_VALUE[tmpKey[1]] = [];
					}

					self.STORAGE[tmpKey[0]].LOCAL_VALUE.push(newVal);
				};

				switch (key) {
					case 'EXTENSION':
					case 'extension':
						// This function is only experimental in YAX.js
						if (Y.isFunction(this.dl)) {
							this.dl(newVal);
						}

						setArr(oldVal, newVal);

						break;

					default:
						this.STORAGE[tmpKey[0]].LOCAL_VALUE[tmpKey[1]] = newVal;
						break;
				}

				return oldVal;
			}

			this.STORAGE[key] = this.STORAGE[key] || {};

			oldVal = this.STORAGE[key].LOCAL_VALUE;

			setArr = function setArr(_oldVal) {
				// Although these are set individually, they are all accumulated
				if (Y.isUndefined(_oldVal)) {
					self.STORAGE[key].LOCAL_VALUE = [];
				}

				self.STORAGE[key].LOCAL_VALUE.push(newVal);
			};

			switch (key) {
				case 'EXTENSION':
				case 'extension':
					// This function is only experimental in YAX.js
					if (Y.isFunction(this.dl)) {
						this.dl(newVal);
					}

					setArr(oldVal, newVal);

					break;

				default:
					this.STORAGE[key].LOCAL_VALUE = newVal;
					break;
			}

			return oldVal;
		},

		setGlobal: function setGlobal() {
			var args = Y.G.slice.call(arguments);

			var key = args[0];
			var tmpKey = key.split(':');
			var newVal = args[1];

			var oldVal;
			var self = this;
			var setArr;

			if (tmpKey && tmpKey.length > 1 && tmpKey.length == 2) {
				this.STORAGE[tmpKey[0]] = this.STORAGE[tmpKey[0]] || {};

				oldVal = this.STORAGE[tmpKey[0]].GLOBAL_VALUE[tmpKey[1]];

				setArr = function setArr(_oldVal) {
					// Although these are set individually, they are all accumulated
					if (Y.isUndefined(_oldVal)) {
						self.STORAGE[tmpKey[0]].GLOBAL_VALUE[tmpKey[1]] = [];
					}

					self.STORAGE[tmpKey[0]].GLOBAL_VALUE.push(newVal);
				};

				switch (key) {
					case 'EXTENSION':
					case 'extension':
						// This function is only experimental in YAX.js
						if (Y.isFunction(this.dl)) {
							this.dl(newVal);
						}

						setArr(oldVal, newVal);

						break;

					default:
						this.STORAGE[tmpKey[0]].GLOBAL_VALUE[tmpKey[1]] = newVal;
						break;
				}

				return oldVal;
			}

			this.STORAGE[key] = this.STORAGE[key] || {};

			oldVal = this.STORAGE[key].GLOBAL_VALUE;

			setArr = function setArr(_oldVal) {
				// Although these are set individually, they are all accumulated
				if (Y.isUndefined(_oldVal)) {
					self.STORAGE[key].GLOBAL_VALUE = [];
				}

				self.STORAGE[key].GLOBAL_VALUE.push(newVal);
			};

			switch (key) {
				case 'EXTENSION':
				case 'extension':
					// This function is only experimental in YAX.js
					if (Y.isFunction(this.dl)) {
						this.dl(newVal);
					}

					setArr(oldVal, newVal);

					break;

				default:
					this.STORAGE[key].GLOBAL_VALUE = newVal;
					break;
			}

			return oldVal;
		},

		get: function getConfig() {
			var args = Y.G.slice.call(arguments);

			var key = args[0];
			var tmpKey = key.split(':');

			if (tmpKey && tmpKey.length > 1 && tmpKey.length == 2) {
				if (this.STORAGE &&
					this.STORAGE[tmpKey[0]] &&
					!Y.isUndefined(this.STORAGE[tmpKey[0]].LOCAL_VALUE)) {

					if (Y.isNull(this.STORAGE[tmpKey[0]].LOCAL_VALUE)) {
						return Y.empty;
					}

					return this.STORAGE[tmpKey[0]].LOCAL_VALUE[tmpKey[1]];
				}
			}

			if (this.STORAGE &&
				this.STORAGE[key] &&
				!Y.isUndefined(this.STORAGE[key].LOCAL_VALUE)) {

				if (Y.isNull(this.STORAGE[key].LOCAL_VALUE)) {
					return Y.empty;
				}

				return this.STORAGE[key].LOCAL_VALUE;
			}

			return Y.empty;
		},

		getGlobal: function getGlobal() {
			var args = Y.G.slice.call(arguments);

			var key = args[0];
			var tmpKey = key.split(':');

			if (tmpKey && tmpKey.length > 1 && tmpKey.length == 2) {
				if (this.STORAGE &&
					this.STORAGE[tmpKey[0]] &&
					!Y.isUndefined(this.STORAGE[tmpKey[0]].GLOBAL_VALUE)) {

					if (Y.isNull(this.STORAGE[tmpKey[0]].GLOBAL_VALUE)) {
						return Y.empty;
					}

					return this.STORAGE[tmpKey[0]].GLOBAL_VALUE[tmpKey[1]];
				}
			}

			if (this.STORAGE &&
				this.STORAGE[key] &&
				!Y.isUndefined(this.STORAGE[key].GLOBAL_VALUE)) {

				if (Y.isNull(this.STORAGE[key].GLOBAL_VALUE)) {
					return Y.empty;
				}

				return this.STORAGE[key].GLOBAL_VALUE;
			}

			return Y.empty;
		},

		getAll: function getAllConfig() {
			var args = Y.G.slice.call(arguments);

			var extension = args[0];
			var details = args[1];
			var keyVals = args[2];

			var key = '';
			var cfg = {};
			var noDetails = {};
			var extPattern;

			var tmp;

			// BEGIN REDUNDANT
			this.STORAGE = this.STORAGE || {};
			// END REDUNDANT

			if (extension) {
				extPattern = new RegExp('^' + extension + '\\.');

				for (key in this.STORAGE) {
					if (this.STORAGE.hasOwnProperty(key)) {
						extPattern.lastIndex = 0;

						if (extPattern.test(key)) {
							cfg[key] = this.STORAGE[key];
						}
					}
				}
			} else {
				for (key in this.STORAGE) {
					if (this.STORAGE.hasOwnProperty(key)) {
						cfg[key] = this.STORAGE[key];
					}
				}
			}

			// Default is true
			if (details !== false) {
				// {GLOBAL_VALUE: '', LOCAL_VALUE: '', ACCESS: ''};
				return cfg;
			}

			for (key in cfg) {
				if (cfg.hasOwnProperty(key)) {
					noDetails[key] = cfg[key].LOCAL_VALUE;
				}
			}

			if (Y.isSet(keyVals) && Y.isTrue(keyVals)) {
				for (key in cfg) {
					if (cfg.hasOwnProperty(key)) {
						tmp = key.split('.');
						noDetails[tmp[tmp.length - 1]] = cfg[key].LOCAL_VALUE;
					}
				}

				return noDetails;
			}

			return noDetails;
		},

		remove: function removeConfig() {
			var args = Y.G.slice.call(arguments);

			var key = args[0];

			if (this.STORAGE &&
				this.STORAGE[key] &&
				!Y.isUndefined(this.STORAGE[key].LOCAL_VALUE)) {

				if (Y.isNull(this.STORAGE[key].LOCAL_VALUE)) {
					return Y.empty;
				}

				// return this.STORAGE[key].LOCAL_VALUE;
				delete this.STORAGE[key];
			}

			return Y.empty;
		},

		restore: function restoreConfig() {
			var args = Y.G.slice.call(arguments);

			var key = args[0];

			if (this.STORAGE &&
				this.STORAGE[key] &&
				!Y.isUndefined(this.STORAGE[key])) {
				this.STORAGE[key].LOCAL_VALUE = this.STORAGE[key].GLOBAL_VALUE;
			}
		},

		alter: function alterConfig() {
			var args = Y.G.slice.call(arguments);

			var key = args[0];
			var value = args[1];

			return this.set(key, value);
		}
	};

	//---

	Y.config = Y.C = new Config();

	//---

	/*var _CoreConsole = {
		'Console.Log.Extended': true,
		'Console.Level': null,
		'Console.Colored': false,
		'Console.Colored.Message': false,
		'Console.Print.Level': true,
		'Console.Timed': false,
		'Console.On.Output': null
	};

	Y.C.set('yax.core.console', _CoreConsole);
	Y.C.set('extension', 'yax.core.console');*/

	//---

}());

// FILE: ./Source/Core/Contrib/Config.js

//---