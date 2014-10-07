/**
 * YAX Hash/Router [DOM/NODE][Plugin]
 */

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global Y, YAX */

(function (global) {

	//---

	'use strict';

	// Plugin information

	// Default options for the Plugin
	Y.extend(Y.Settings.DOM, {
		router: {
			defaultPath: '/',
			before: Y.noop,
			on: Y.noop,
			notFound: Y.noop
		}
	});

	var defaultOptions = Y.Settings.DOM.router;

	var location = Y.loc;
	var router;

	router = {
		// routes array
		routes: [],

		current: null,

		previous: null,

		hashRegex: {
			hashStrip: /^#!*/,
			namedArgument: /:([\w\d]+)/g,
			argumentSplat: /\*([\w\d]+)/g,
			escape: /[\-\[\]{}()+?.,\\\^$|#\s]/g
		},

		config: function (options) {
			var option;

			for (option in options) {
				if (options.hasOwnProperty(option)) {
					defaultOptions[option] = options[option];
				} // END if
			} // END for

			return router;
		},

		history: {
			cache: false,
			// support: ('history' in global)
			support: Y.hasOwn.call(global, 'history')
		},

		array: function (args) {
			return Y.G.Slice.call(args, 0);
		},

		go: function (path) {
			location.hash = path;

			return router;
		},

		back: function (path) {
			// Only 1-step back
			if (router.previous) {
				history.back();
				router.previous = null;
				// Fallback if can't go back
			} else if (path) {
				location.hash = path;
			} // END if

			return router;
		},

		proxy: function (object) {
			var self = this,
				func;

			func = function () {
				return object.apply(self, arguments);
			};

			return func;
		},

		proxyAll: function () {
			var functions = this.array(arguments),
				x;

			for (x = 0; x < functions.length; x++) {
				this[functions[x]] = this.proxy(this[functions[x]]);
			}
		},

		add: function (path, callback) {
			var x,
				temp;

			if (Y.isObject(path)) {
				for (x in path) {
					if (path.hasOwnProperty(x)) {
						this.add(x, path[x]);
					}
				}
			} else {
				if (Y.isString(path)) {
					path = path.replace(this.hashRegex.escape, '\\$&').replace(this.hashRegex
						.namedArgument, '([^\/]*)').replace(this.hashRegex.argumentSplat,
						'(.*?)');
					temp = new RegExp('^' + path + '$');
				}

				this.routes.push({
					'Route': temp,
					'Function': callback || function () {
						return false;
					}
				});
			}
		},

		setup: function (options) {
			if (options && options.history) {
				this.history.cache = this.history.support && options.history;
			}

			if (this.history.cache) {
				Y.DOM(global).bind('popstate', this.change);
			} else {
				Y.DOM(global).bind('hashchange', this.change);
			}

			this.proxyAll('change');

			return this.change();
		},

		unbind: function () {
			if (this.history) {
				Y.DOM(global).unbind('popstate', this.change);
			} else {
				Y.DOM(global).unbind('hashchange', this.change);
			}
		},

		navigate: function () {
			var args = this.array(arguments),
				triggers = false,
				path;

			if (Y.isBool(args[args.length - 1])) {
				triggers = args.pop();
			}

			path = args.join('/');

			if (this.Path === path) {
				return;
			}

			if (!triggers) {
				this.Path = path;
			}

			if (this.history.cache) {
				history.cache.pushState({}, Y.doc.title, this.getHost() + path);
			} else {
				location.hash = path;
			}
		},

		/**
		 *
		 * @param path
		 * @param route
		 * @param callback
		 * @returns {boolean}
		 * @constructor
		 */
		match: function (path, route, callback) {
			var match = route.exec(path),
				params;

			if (!match) {
				return false;
			}

			params = match.slice(1);

			callback.apply(callback, params);

			return true;
		},

		getPath: function () {
			return location.pathname;
		},

		getHash: function () {
			return location.hash;
		},

		getHost: function () {
			return ((Y.doc.location + Y.empty()).replace(this.getPath() + this.getHash(),
				''));
		},

		getFragment: function () {
			return this.getHash().replace(this.hashRegex.hashStrip, '');
		},

		change: function () {
			var path = (router.history.cache ? router.getPath() : router.getFragment()),
				hash = router.getHash(),
				found = false,
				current = router.current,
				x, n, route, matches;

			if (path === router.Path) {
				return;
			}

			router.Path = path;

			if (!hash) {
				hash = defaultOptions.defaultPath;
			} // END if

			if (current && current !== router.previous) {
				router.previous = current;
			} // END if

			router.current = hash;

			for (x = 0, n = router.routes.length; x < n && !found; x++) {
				route = router.routes[x];

				// if (router.match(path, route['Route'], route['Function'])) {
				if (router.match(path, route.Route, route.Function)) {
					return;
				}
			}

			for (x = 0, n = router.routes.length; x < n && !found; x++) {
				route = router.routes[x];

				if (Y.isString(path)) {
					if (path.toLowerCase() === hash.toLowerCase().slice(1)) {
						defaultOptions.before.call(router, path);
						// route['Function'].call(router);
						/** @namespace route.Function.call */
						route.Function.call(router);
						defaultOptions.on.call(router, path);
						found = true;
					} // END if
				} else {
					matches = hash.match(path);

					if (matches) {
						defaultOptions.before.call(router, path, matches);
						// route['Function'].apply(router, matches);
						route.Function.apply(router, matches);
						defaultOptions.on.call(router, path, matches);
						found = true;
					} // END if
				} // END if
			} // END for

			if (!found) {
				defaultOptions.notFound.call(router);
			} // END if

			return router;
		}
	}; // END OF router CLASS

	// Assign the router class to YAX's and Window global
	Y.DOM.router = router;

	//---

}(this));

// FILE: ./Source/Plugins/HashRouter.js

//---


