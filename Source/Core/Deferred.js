/**
 * Y Core | Deferred
 *
 * Deferred implementation using Y's [CORE]
 *
 * @version     0.15
 * @depends:    Core, Global, Utility, Class
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function () {

	'use strict';

	function newDeferred(callback) {
		var tuples = [
			// action, add listener, listener list, final state
			['resolve', 'done', Y.G.Callbacks({
				once: 1,
				memory: 1
			}), 'resolved'],
			//['resolve', 'done', Y.G.Callbacks('once memory'), 'resolved'],
			['reject', 'fail', Y.G.Callbacks({
				once: 1,
				memory: 1
			}), 'rejected'],
			['notify', 'progress', Y.G.Callbacks({
				memory: 1
			})]
		];

		var state = 'pending';

		var deferred = Object.create({});

		var promise = {
			state: function () {
				return state;
			},

			always: function () {
				deferred.done(arguments).fail(arguments);
				return this;
			},

			then: function () {
				var fns = arguments, context, values;

				return newDeferred(function (defer) {
					Y.Each(tuples, function (x, tuple) {
						var fn = Y.Lang.isFunction(fns[x]) && fns[x];
						deferred[tuple[1]](function () {
							var returned = fn && fn.apply(this, arguments);
							if (returned && Y.Lang.isFunction(returned.promise)) {
								returned.promise()
									.done(defer.resolve)
									.fail(defer.reject)
									.progress(defer.notify);
							} else {
								context = this === promise ? defer.promise() : this;
								values = fn ? [returned] : arguments;
								defer[tuple[0] + 'With'](context, values);
							}
						});
					});

					fns = null;

				}).promise();
			},

			promise: function (obj) {
				return obj !== null ? Y.Extend(obj, promise) : promise;
			}
		};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		Y.Each(tuples, function (x, tuple) {
			var list = tuple[2],
				stateString = tuple[3];

			promise[tuple[1]] = list.add;

			if (stateString) {
				list.add(function () {
					state = stateString;
					/* jshint -W016 */
				}, tuples[x ^ 1][2].disable, tuples[2][2].lock);
			}

			deferred[tuple[0]] = function () {
				deferred[tuple[0] + 'With'](this === deferred ? promise : this, arguments);
				return this;
			};

			deferred[tuple[0] + 'With'] = list.fireWith;
		});

		promise.promise(deferred);

		if (callback) {
			callback.call(deferred, deferred);
		}

		return deferred;
	}

	//---

	Y.Lang.When = function (sub) {
		var resolveValues = Y.G.Slice.call(arguments),
			len = resolveValues.length,
			x = 0,
			remain = len !== 1 || (sub && Y.Lang.isFunction(sub.promise)) ? len : 0,
			deferred = remain === 1 ? sub : newDeferred(),
			progressValues, progressContexts, resolveContexts,
			updateFn = function (x, ctx, val) {
				return function (value) {
					ctx[x] = this;

					val[x] = arguments.length > 1 ? Y.G.Slice.call(arguments) : value;

					var tmp = --remain;

					if (val === progressValues) {
						deferred.notifyWith(ctx, val);
					} else if (!tmp) {
						deferred.resolveWith(ctx, val);
					}
				};
			};

		if (len > 1) {
			progressValues = [len];
			progressContexts = [len];
			resolveContexts = [len];

			for (x; x < len; ++x) {
				if (resolveValues[x] && Y.Lang.isFunction(resolveValues[x].promise)) {
					resolveValues[x].promise()
						.done(updateFn(x, resolveContexts, resolveValues))
						.fail(deferred.reject)
						.progress(updateFn(x, progressContexts, progressValues));
				} else {
					--remain;
				}
			}
		}

		if (!remain) {
			deferred.resolveWith(resolveContexts, resolveValues);
		}

		return deferred.promise();
	};

	Y.G.Deferred = newDeferred;

	//---

}());

//---
