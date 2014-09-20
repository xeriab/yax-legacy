/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*jshint undef: false */
/*jshint unused: true */
/*global module */

(function () {
	/*jshint -W079 */
	/*jshint -W020 */
	var require = null;
	var define = null;
	var root = this;

	(function () {
		var modules = {},
			// Stack of moduleIds currently being built.
			requireStack = [],
			// Map of module ID -> index into requireStack of modules currently being built.
			inProgressModules = {},
			SEPARATOR = '.';

		function build(module) {
			var factory = module.factory,
				localRequire = function (id) {
					var resultantId = id;
					//Its a relative path, so lop off the last portion and add the id (minus './')
					if (id.charAt(0) === '.') {
						resultantId = module.id.slice(0, module.id.lastIndexOf(SEPARATOR)) +
							SEPARATOR + id.slice(2);
					}
					return require(resultantId);
				};

			module.exports = {};

			delete module.factory;

			factory(localRequire, module.exports, module);

			return module.exports;
		}

		require = function (id) {
			if (!modules[id]) {
				throw 'module ' + id + ' not found';
			}

			if (inProgressModules.hasOwnProperty(id)) {
				var cycle = requireStack.slice(inProgressModules[id]).join('->') + '->' +
					id;
				throw 'Cycle in require graph: ' + cycle;
			}

			if (modules[id].factory) {
				try {
					inProgressModules[id] = requireStack.length;
					requireStack.push(id);
					return build(modules[id]);
				} finally {
					delete inProgressModules[id];
					requireStack.pop();
				}
			}

			return modules[id].exports;
		};

		define = function (id, factory) {
			if (modules[id]) {
				throw 'module ' + id + ' already defined';
			}

			modules[id] = {
				id: id,
				factory: factory
			};
		};

		define.remove = function (id) {
			delete modules[id];
		};

		define.moduleMap = modules;
	}());

	//---

	// Export for use in node
	if (typeof module === 'object' && typeof require === 'function') {
		module.exports.require = require;
		module.exports.define = define;
	}

	root.R = require;
	root.D = define;

	//---

}());

//---
