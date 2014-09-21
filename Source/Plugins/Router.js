/**
 * YAX Plugins | Autofix
 *
 * Cross browser hash router implementation using YAX's API [Node]
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
/*global Y, YAX */

(function (global) {

	'use strict';

	// Plugin information

	// Default options for the Plugin
	Y.Extend(Y.Settings.DOM, {
		Router: {
			DefaultPath: '/',
			Before: Y.Lang.Noop,
			On: Y.Lang.noop,
			NotFound: Y.Lang.Noop
		}
	});

	var DefaultOptions = Y.Settings.DOM.Router;

	var Location = Y.Location;
	var Router;

	Router = {
		// Routes array
		Routes: [],

		Current: null,

		Previous: null,

		HashRegex: {
			HashStrip: /^#!*/,
			NamedArgument: /:([\w\d]+)/g,
			ArgumentSplat: /\*([\w\d]+)/g,
			Escape: /[\-\[\]{}()+?.,\\\^$|#\s]/g
		},

		Config: function (options) {
			var option;

			for (option in options) {
				if (options.hasOwnProperty(option)) {
					DefaultOptions[option] = options[option];
				} // END if
			} // END for

			return Router;
		},

		History: {
			Cache: false,
			// Support: ('history' in global)
			Support: Y.HasOwnProperty.call(global, 'history')
		},

		Array: function (args) {
			return Array.prototype.slice.call(args, 0);
		},

		Go: function (path) {
			Location.hash = path;

			return Router;
		},

		Back: function (path) {
			// Only 1-step back
			if (Router.Previous) {
				history.back();
				Router.Previous = null;
				// Fallback if can't go back
			} else if (path) {
				Location.hash = path;
			} // END if

			return Router;
		},

		Proxy: function (object) {
			var self = this,
				func;

			func = function () {
				return object.apply(self, arguments);
			};

			return func;
		},

		proxyAll: function () {
			var functions = this.Array(arguments),
				x;

			for (x = 0; x < functions.length; x++) {
				this[functions[x]] = this.Proxy(this[functions[x]]);
			}
		},

		Add: function (path, callback) {
			var x,
				temp;

			if (Y.Lang.isObject(path)) {
				for (x in path) {
					if (path.hasOwnProperty(x)) {
						this.Add(x, path[x]);
					}
				}
			} else {
				if (Y.Lang.isString(path)) {
					path = path.replace(this.HashRegex.Escape, '\\$&').replace(this.HashRegex.NamedArgument, '([^\/]*)').replace(this.HashRegex.ArgumentSplat, '(.*?)');
					temp = new RegExp('^' + path + '$');
				}

				this.Routes.push({
					'Route': temp,
					'Function': callback || function () {return false;}
				});
			}
		},

		Setup: function (options) {
			if (options && options.History) {
				this.History.Cache = this.History.Support && options.History;
			}

			if (this.History.Cache) {
				Y.Node(global).bind('popstate', this.Change);
			} else {
				Y.Node(global).bind('hashchange', this.Change);
			}

			this.proxyAll('Change');

			return this.Change();
		},

		Unbind: function () {
			if (this.History) {
				Y.Node(global).unbind('popstate', this.Change);
			} else {
				Y.Node(global).unbind('hashchange', this.Change);
			}
		},

		Navigate: function () {
			var args = this.Array(arguments),
				triggers = false,
				path;

			if (Y.Lang.isBool(args[args.length - 1])) {
				triggers = args.pop();
			}

			path = args.join('/');

			if (this.Path === path) {
				return;
			}

			if (!triggers) {
				this.Path = path;
			}

			if (this.History.Cache) {
				history.cache.pushState({}, document.title, this.getHost() + path);
			} else {
				Location.hash = path;
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
		Match: function (path, route, callback) {
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
			return Location.pathname;
		},

		getHash: function () {
			return Location.hash;
		},

		getHost: function () {
			return ((document.location + Y.Lang.empty()).replace(this.getPath() + this.getHash(), ''));
		},

		getFragment: function () {
			return this.getHash().replace(this.HashRegex.HashStrip, '');
		},

		Change: function () {
			var path = (Router.History.Cache ? Router.getPath() : Router.getFragment()),
				hash = Router.getHash(),
				found = false,
				current = Router.Current,
				x, n, route, matches;

			if (path === Router.Path) {
				return;
			}

			Router.Path = path;

			if (!hash) {
				hash = DefaultOptions.DefaultPath;
			} // END if

			if (current && current !== Router.Previous) {
				Router.Previous = current;
			} // END if

			Router.Current = hash;

			for (x = 0, n = Router.Routes.length; x < n && !found; x++) {
				route = Router.Routes[x];

				// if (Router.Match(path, route['Route'], route['Function'])) {
				if (Router.Match(path, route.Route, route.Function)) {
					return;
				}
			}

			for (x = 0, n = Router.Routes.length; x < n && !found; x++) {
				route = Router.Routes[x];

				if (Y.Lang.isString(path)) {
					if (path.toLowerCase() === hash.toLowerCase().slice(1)) {
						DefaultOptions.Before.call(Router, path);
						// route['Function'].call(Router);
						route.Function.call(Router);
						DefaultOptions.On.call(Router, path);
						found = true;
					} // END if
				} else {
					matches = hash.match(path);

					if (matches) {
						DefaultOptions.Before.call(Router, path, matches);
						// route['Function'].apply(Router, matches);
						route.Function.apply(Router, matches);
						DefaultOptions.On.call(Router, path, matches);
						found = true;
					} // END if
				} // END if
			} // END for

			if (!found) {
				DefaultOptions.NotFound.call(Router);
			} // END if

			return Router;
		}
	}; // END OF Router CLASS

	// Assign the Router class to YAX's and Window global
	Y.Node.Router = global.Router = Router;

	//---

}(this));

//---
