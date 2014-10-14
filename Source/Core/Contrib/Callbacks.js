/**
 * YAX Callbacks [Contrib]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function (undef) {

	//---

	'use strict';

	// String to Object options format cache
	var optionsCache = {};

	// Convert String-formatted options into Object-formatted ones and store in cache
	function createOptions (options) {
		var object = optionsCache[options] = {};

		Y.each(options.match(Y.G.regexList.notWhite) || [], function(_, flag) {
			object[flag] = true;
		});

		return object;
	}

	// Create a collection of callbacks to be fired in a sequence, with configurable behaviour
	// Option flags:
	//   - once: Callbacks fired at most one time.
	//   - memory: Remember the most recent context and arguments
	//   - stopOnFalse: Cease iterating over callback list
	//   - unique: Permit adding at most one instance of the same callback

	/**
	 * Y.Callbacks
	 */
	Y.G.Callbacks = function (options) {

		// options = Y.extend({}, options || {});

		if (Y.isString(options)) {
			options = optionsCache[options] || createOptions(options);
		} else {
			options = Y.extend({}, options);
		}

		// Y.LOG(options);

		// Last fire value (for non-forgettable lists)
		var memory,
			// Flag to know if list was already fired
			fired,

			// Flag to know if list is currently firing
			firing,

			// First callback to fire (used internally by add and fireWith)
			firingStart,

			// End of the loop when firing
			firingLength,

			// Index of currently firing callback (modified by remove if needed)
			firingIndex,

			// Actual callback list
			list = [],

			// Stack of fire calls for repeatable lists
			stack = !options.once && [],

			fire,

			Callbacks;

		fire = function (data) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			/*jshint unused: true */
			firing = true;

			for (list; list && firingIndex < firingLength; ++firingIndex) {
				if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
					memory = false;
					break;
				}
			}

			firing = false;

			if (list) {
				if (stack) {
					// stack.length && fire(stack.shift());
					if (stack.length) {
						fire(stack.shift());
					}
				} else if (memory) {
					list.length = 0;
				} else {
					Callbacks.disable();
				}
			}
		};

		Callbacks = {
			add: function () {
				if (list) {
					var start = list.length,
						add;
					add = function (args) {
						Y.each(args, function (_, arg) {
							if (Y.isFunction(arg)) {
								if (!options.unique || !Callbacks.has(arg)) {
									list.push(arg);
								}
							} else if (arg && arg.length && !Y.isString(arg)) {
								add(arg);
							}
						});
					};

					add(arguments);

					if (firing) {
						firingLength = list.length;
					} else if (memory) {
						firingStart = start;
						fire(memory);
					}
				}

				return this;
			},
			remove: function () {
				if (list) {
					Y.each(arguments, function (_, arg) {
						var index = 0;
						while ((index = Y.inArray(arg, list, index)) > -1) {
							list.splice(index, 1);
							// Handle firing indexes
							if (firing) {
								if (index <= firingLength) {
									--firingLength;
								}

								if (index <= firingIndex) {
									--firingIndex;
								}
							}
						}
					});
				}
				return this;
			},
			has: function (fn) {
				return !!(list && (fn ? Y.inArray(fn, list) > -1 : list.length));
			},
			empty: function () {
				firingLength = list.length = 0;
				return this;
			},
			disable: function () {
				list = stack = memory = undef;
				return this;
			},
			disabled: function () {
				return !list;
			},
			lock: function () {
				stack = undef;

				if (!memory) {
					Callbacks.disable();
				}

				return this;
			},
			locked: function () {
				return !stack;
			},
			fireWith: function (context, args) {
				if (list && (!fired || stack)) {
					args = args || [];
					args = [context, args.slice ? args.slice() : args];

					if (firing) {
						stack.push(args);
					} else {
						fire(args);
					}
				}
				return this;
			},
			fire: function () {
				return Callbacks.fireWith(this, arguments);
			},
			fired: function () {
				return !!fired;
			}
		};

		return Callbacks;
	}; // END OF Y.Callbacks FUNCTION

	//---

}());

// FILE: ./Source/Core/Contrib/Callbacks.js

//---
