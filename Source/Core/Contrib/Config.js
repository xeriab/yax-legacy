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

	function Config () {
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
			var newVal = args[1];
			var globVal = args[2];
			var valType = null;
			var tmpKey = key.split(':');

			var oldVal;
			var self = this;
			var setArr;

			if (globVal && Y.isSet(globVal) && Y.isTrue(globVal)) {
				valType = 'GLOBAL_VALUE';
			} else {
				valType = 'LOCAL_VALUE';
			}

			if (tmpKey && tmpKey.length > 1 && tmpKey.length == 2) {
				this.STORAGE[tmpKey[0]] = this.STORAGE[tmpKey[0]] || {};

				oldVal = this.STORAGE[tmpKey[0]][valType][tmpKey[1]];

				setArr = function setArr(_oldVal) {
					// Although these are set individually, they are all accumulated
					if (Y.isUndefined(_oldVal)) {
						self.STORAGE[tmpKey[0]][valType][tmpKey[1]] = [];
					}

					self.STORAGE[tmpKey[0]][valType].push(newVal);
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
						this.STORAGE[tmpKey[0]][valType][tmpKey[1]] = newVal;
						break;
				}

				return oldVal;
			}

			this.STORAGE[key] = this.STORAGE[key] || {};

			oldVal = this.STORAGE[key][valType];

			setArr = function setArr(_oldVal) {
				// Although these are set individually, they are all accumulated
				if (Y.isUndefined(_oldVal)) {
					self.STORAGE[key][valType] = [];
				}

				self.STORAGE[key][valType].push(newVal);
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
					this.STORAGE[key][valType] = newVal;
					break;
			}

			return oldVal;
		},

		get: function getConfig() {
			var args = Y.G.slice.call(arguments);

			var key = args[0];
			var globVal = args[1];
			var valType = null;
			var tmpKey = key.split(':');

			if (globVal && Y.isSet(globVal) && Y.isTrue(globVal)) {
				valType = 'GLOBAL_VALUE';
			} else {
				valType = 'LOCAL_VALUE';
			}

			if (tmpKey && tmpKey.length > 1 && tmpKey.length == 2) {
				if (this.STORAGE &&
					this.STORAGE[tmpKey[0]] &&
					!Y.isUndefined(this.STORAGE[tmpKey[0]][valType])) {

					if (Y.isNull(this.STORAGE[tmpKey[0]][valType])) {
						return Y.empty;
					}

					return this.STORAGE[tmpKey[0]][valType][tmpKey[1]];
				}
			}

			if (this.STORAGE &&
				this.STORAGE[key] &&
				!Y.isUndefined(this.STORAGE[key][valType])) {

				if (Y.isNull(this.STORAGE[key][valType])) {
					return Y.empty;
				}

				return this.STORAGE[key][valType];
			}

			return Y.empty;
		},

		getAll: function getAllConfig() {
			var args = Y.G.slice.call(arguments);

			var extension = args[0];
			var details = args[1];
			var keyVals = args[2];
			var extendedResult = args[3];

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

			/*for (key in cfg) {
				if (cfg.hasOwnProperty(key)) {
					noDetails[key] = cfg[key].LOCAL_VALUE;
				}
			}*/


			if (keyVals && Y.isSet(keyVals) && Y.isTrue(keyVals)) {
				for (key in cfg) {
					if (cfg.hasOwnProperty(key)) {
						tmp = key.split('.');
						// Y.LOG(tmp);
						noDetails[tmp[tmp.length - 1]] = cfg[key].LOCAL_VALUE;
					}
				}

				return noDetails;
			}

			if (extendedResult && Y.isSet(extendedResult) && Y.isTrue(extendedResult)) {
				for (key in cfg) {
					if (cfg.hasOwnProperty(key)) {
						tmp = key.split('.');
						// Y.LOG(tmp);
						// noDetails[tmp[tmp.length - 1]] = cfg[key].LOCAL_VALUE;
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
				/** @namespace this.STORAGE[key].GLOBAL_VALUE */
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

	Y.config = new Config();

	//---

}());

// FILE: ./Source/Core/Contrib/Config.js

//---