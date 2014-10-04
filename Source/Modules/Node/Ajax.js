/**
 * YAX DOM | Data
 *
 * Cross browser Ajax implementation using YAX's API [DOM]
 *
 * @version     0.15
 * @depends:    Core, DOM
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

	var jsonpID = 0,
		document = Y.Document,
		window = Y.Window,
		escape = encodeURIComponent,
		allTypes = '*/'.concat('*');

	//---

	// BEGIN OF [Private Functions]

	Y.DOM.AjaxActive = Y.DOM.active = 0;

	// Trigger a custom event and return false if it was cancelled
	function triggerAndReturn(context, event, data) {
		var eventName = Y.DOM.Event(event);

		Y.DOM(context).trigger(eventName, data);

		/** @namespace eventName.defaultPrevented */
		return !eventName.defaultPrevented;
	}

	// Trigger an Ajax "Global" event
	function triggerGlobal(settings, context, event, data) {
		if (settings.global) {
			return triggerAndReturn(context || document, event, data);
		}
	}

	function ajaxStart(settings) {
		if (settings.global && Y.DOM.active++ === 0) {
			triggerGlobal(settings, null, 'ajaxStart');
		}
	}

	function ajaxStop(settings) {
		if (settings.global) {
			if (!Y.Lang.isSet(--Y.DOM.active)) {
				triggerGlobal(settings, null, 'ajaxStop');
			}
		}
	}

	// Triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
	function ajaxBeforeSend(xhr, settings) {
		var context = settings.context;

		if (settings.beforeSend.call(context, xhr, settings) === false ||
			triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) ===
			false) {
			return false;
		}

		triggerGlobal(settings, context, 'ajaxSend', [xhr, settings]);
	}

	// Status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
	function ajaxComplete(status, xhr, settings) {
		var context = settings.context;

		settings.complete.call(context, xhr, status);

		triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings]);

		ajaxStop(settings);
	}

	function ajaxSuccess(data, xhr, settings, deferred) {
		var context = settings.context,
			status = 'success';

		settings.success.call(context, data, status, xhr);

		if (deferred) {
			deferred.resolveWith(context, [data, status, xhr]);
		}

		triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data]);

		ajaxComplete(status, xhr, settings);
	}

	// Type: "timeout", "error", "abort", "parsererror"
	/** @namespace deferred.rejectWith */
	function ajaxError(error, type, xhr, settings, deferred) {
		var context = settings.context;

		settings.error.call(context, xhr, type, error);

		if (deferred) {
			deferred.rejectWith(context, [xhr, type, error]);
		}

		triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error]);

		ajaxComplete(type, xhr, settings);
	}

	//---

	function getCookie(key) {
		var result = (
			new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)')
		).exec(document.cookie);

		return result ? result[1] : null;
	}

	function sameOrigin(url) {
		// Url could be relative or scheme relative or absolute
		var sr_origin = '//' + document.location.host,
			origin = document.location.protocol + sr_origin;

		// Allow absolute or scheme relative URLs to same origin
		return (url === origin || url.slice(0, origin.length + 1) === origin + '/') ||
			(url === sr_origin || url.slice(0, sr_origin.length + 1) === sr_origin +
			'/') ||
		// or any other URL that isn't scheme relative or absolute i.e relative.
		!(/^(\/\/|http:|https:).*/.test(url));
	}

	function mimeToDataType(mime) {
		//		if (mime) {
		//			mime = mime.split(';', 2)[0];
		//		}

		if (mime) {
			if (mime === Y.RegEx.htmlType) {
				return 'html';
			}

			if (mime === Y.RegEx.jsonTypeReplacement.test(mime)) {
				return 'json';
			}

			if (Y.RegEx.scriptTypeReplacement.test(mime)) {
				return 'script';
			}

			if (Y.RegEx.xmlTypeReplacement.test(mime)) {
				return 'xml';
			}

			return 'text';
		}
	}

	function appendQuery(url, query) {
		if (query === '') {
			return url;
		}

		return (url + '&' + query).replace(/[&?]{1,2}/, '?');
	}

	// Serialise payload and append it to the URL for GET requests
	/** @namespace options.traditional */
	function serialiseData(options) {
		if (options.processData && options.data && !Y.Lang.isString(options.data)) {
			options.data = Y.DOM.Parameters(options.data, options.traditional);
		}

		if (options.data && (!options.type || options.type.toUpperCase() === 'GET')) {
			options.url = appendQuery(options.url, options.data);
			options.data = undefined;
		}
	}

	// Handle optional data/success arguments
	function parseArguments(url, data, success, dataType) {
		var hasData = !Y.Lang.isFunction(data);

		return {
			url: url,
			data: hasData ? data : undefined,
			success: !hasData ? data : Y.Lang.isFunction(success) ? success : undefined,
			dataType: hasData ? dataType || success : success
		};
	}

	// END OF [Private Functions]

	//---

	Y.DOM.AjaxSettings = Object.create(null);

	//---

	Y.Extend(Y.DOM, {
		AjaxSettings: {
			// Default type of request
			type: 'GET',
			// Callback that is executed before request
			beforeSend: Y.Lang.noop,
			// Callback that is executed if the request succeeds
			success: Y.Lang.noop,
			// Callback that is executed the the server drops error
			error: Y.Lang.noop,
			// Callback that is executed on request complete (both: error and success)
			complete: Y.Lang.noop,
			// The context for the callbacks
			context: null,
			// The jsonp
			jsonp: null,
			// The jsonpCallback
			jsonpCallback: null,
			// The mimeType
			mimeType: null,
			// The contentType
			contentType: null,
			// The xhrFields
			xhrFields: null,
			// The username
			username: null,
			// The password
			password: null,
			// Whether to trigger "global" Ajax events
			global: true,
			// Transport
			xhr: function () {
				return new window.XMLHttpRequest({
					mozSystem: true
				});
			},
			// MIME types mapping
			accepts: {
				'*': allTypes,
				script: 'text/javascript, application/javascript, application/x-javascript',
				json: 'application/json, text/json',
				xml: 'application/xml, text/xml',
				html: Y.RegEx.htmlType,
				text: 'text/plain'
			},
			// Whether the request is to another domain
			crossDomain: false,
			// Default timeout
			timeout: 0,
			// Whether data should be serialized to string
			processData: true,
			// Whether the browser should be allowed to cache GET responses
			cache: true
		},

		/**
		 * @return string {params}
		 */
		Parameters: function (object, traditional) {
			var params = [];

			params.add = function (key, value) {
				this.push(escape(key) + '=' + escape(value));
			};

			Y.Utility.Serialise(params, object, traditional);

			return params.join('&').replace(/%20/g, '+');
		}
	});

	//---

	Y.Extend(Y.DOM, {
		getJSON: function () {
			var options = parseArguments.apply(null, arguments);
			options.dataType = 'json';
			return this.Ajax(options);
		},

		getXML: function () {
			var options = parseArguments.apply(null, arguments);
			options.dataType = 'xml';
			return this.Ajax(options);
		},

		getScript: function (url, callback) {
			return this.Get(url, undefined, callback, 'script');
		},

		AjaxJSONP: function (options, deferred) {
			if (!options.hasOwnProperty('type')) {
				return this.Ajax(options);
			}

			//var callbackName = 'jsonp' + (++jsonpID);
			var _callbackName = options.jsonpCallback,
				callbackName = Y.Lang.isFunction(_callbackName) ? _callbackName() :
					_callbackName || ('jsonp' + (++jsonpID)),
				script = document.createElement('script'),
				// originalCallback = window[callbackName],
				originalCallback = window[callbackName],
				responseData,
				abort = function (errorType) {
					Y.DOM(script).triggerHandler('error', errorType || 'abort');
				},

				xhr = {
					abort: abort
				},

				abortTimeout;

			if (deferred) {
				deferred.promise(xhr);
			}

			// Y.DOM(script).on('load error', function(e, errorType) {
			Y.DOM(script).on('load error', function (e, errorType) {
				clearTimeout(abortTimeout);

				Y.DOM(script).off('load error');
				Y.DOM(script).remove();

				if (e.type === 'error' || !responseData) {
					ajaxError(null, errorType || 'error', xhr, options, deferred);
				} else {
					ajaxSuccess(responseData[0], xhr, options, deferred);
				}

				// Y.Window[callbackName] = function (data) {
				//				window[callbackName] = function (data) {
				//					ajaxSuccess(data, xhr, options);
				//				};

				Y.Window[callbackName] = originalCallback;

				if (responseData && Y.Lang.isFunction(originalCallback)) {
					originalCallback(responseData[0]);
				}

				originalCallback = responseData = undefined;
			});

			if (ajaxBeforeSend(xhr, options) === false) {
				abort('abort');
				return xhr;
			}

			Y.Window[callbackName] = function () {
				responseData = arguments;
			};

			script.onerror = function () {
				abort('error');
			};

			//			script.src = options.url.replace(/\?.+=\?/, '=' + callbackName);
			//			script.src = options.url.replace(/=\?/, '=' + callbackName);
			script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName);

			document.head.appendChild(script);

			if (options.timeout > 0) {
				abortTimeout = setTimeout(function () {
					abort('timeout');
				}, options.timeout);
			}

			return xhr;
		},

		Ajax: function (options) {
			var settings = Y.Extend({}, options || {}),
				deferred = Y.G.Deferred && Y.G.Deferred(),
				key,
				dataType,
				hasPlaceholder,
				mime,
				headers,
				setHeader,
				protocol,
				xhr,
				nativeSetHeader,
				abortTimeout,
				name,
				async;

			for (key in this.AjaxSettings) {
				if (this.AjaxSettings.hasOwnProperty(key)) {
					if (settings[key] === undefined) {
						settings[key] = this.AjaxSettings[key];
					}
				}
			}

			ajaxStart(settings);

			if (!settings.crossDomain) {
				settings.crossDomain = /^([\w\-]+:)?\/\/([^\/]+)/.test(settings.url) &&
					RegExp.$2 !== Y.Location.host;
			}

			if (!settings.url) {
				settings.url = Y.Location.toString();
			}

			serialiseData(settings);

			dataType = settings.dataType;

			if (settings.cache === false ||
				((!settings || settings.cache !== true) &&
					('script' === dataType || 'jsonp' === dataType))) {
				settings.url = appendQuery(settings.url, '_=' + Date.now());
			}

			hasPlaceholder = /\?.+=\?/.test(settings.url);

			if (dataType === 'jsonp') {
				if (!hasPlaceholder) {
					settings.url = appendQuery(settings.url, settings.jsonp ? (settings.jsonp +
						'=?') : settings.jsonp === false ? '' : 'callback=?');
				}

				return this.AjaxJSONP(settings, deferred);
			}

			//Y.Log(dataType);

			mime = settings.accepts[dataType];

			headers = {};

			setHeader = function (name, value) {
				// headers[name.toLowerCase()] = [name, value];
				headers[name] = [name, value];
			};

			protocol = /^([\w\-]+:)\/\//.test(settings.url) ? RegExp.$1 : Y.Location.protocol;

			xhr = settings.xhr();

			nativeSetHeader = xhr.setRequestHeader;

			if (deferred) {
				deferred.promise(xhr);
			}

			if (!settings.crossDomain) {
				setHeader('X-Requested-With', 'XMLHttpRequest');
				//setHeader('Access-Control-Allow-Origin', '*');
				//setHeader('Access-Control-Allow-Origin', allTypes);
				//setHeader('Access-Control-Allow-Credentials', 'True');

			}


			setHeader('Accept', mime || allTypes);

			//setHeader('Access-Control-Allow-Origin', '*');
			// setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
			//setHeader('Access-Control-Allow-Credentials', 'True');


			mime = settings.mimeType || mime;

			if (mime) {
				if (mime.indexOf(',') > -1) {
					mime = mime.split(',', 2)[0];
				}

				if (xhr.overrideMimeType) {
					xhr.overrideMimeType(mime);
				}

				//xhr.overrideMimeType && xhr.overrideMimeType(mime);
			}

			if (settings.contentType || (settings.contentType !== false && settings.data &&
				settings.type.toUpperCase() !== 'GET')) {
				setHeader('Content-Type', settings.contentType ||
					'application/x-www-form-urlencoded; charset=UTF-8');
			}

			if (settings.headers) {
				for (name in settings.headers) {
					if (settings.headers.hasOwnProperty(name)) {
						setHeader(name, settings.headers[name]);
					}
				}
			}

			settings.headers = Y.Extend(headers, settings.headers, {});

			xhr.setRequestHeader = setHeader;

			// Y.Log(mime);

			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					xhr.onreadystatechange = Y.Lang.noop;

					clearTimeout(abortTimeout);

					var result, error = false;

					// Y.Log(xhr);

					if (
						(xhr.status >= 200 && xhr.status < 300) ||
						xhr.status === 304 ||
						(xhr.status === 0 && protocol === 'file:')
					) {
						dataType = dataType || mimeToDataType(xhr.getResponseHeader(
							'content-type'));

						result = xhr.responseText;

						try {
							// http://perfectionkills.com/global-eval-what-are-the-options/
							if (dataType === 'script') {
								Y.DOM.globalEval(result);
							}

							if (dataType === 'xml') {
								result = xhr.responseXML;
							}

							if (dataType === 'json') {
								result = Y.RegEx.blankReplacement.test(result) ? 
									null : 
									Y.Lang.parseJSON(result);
							}
						} catch (err) {
							error = err;
							// Y.ERROR(err);
						}

						if (error) {
							//Y.ERROR(error);
							ajaxError(error, 'parsererror', xhr, settings, deferred);
						} else {
							//Y.ERROR(result);
							ajaxSuccess(result, xhr, settings, deferred);
						}
					} else {
						ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr,
							settings, deferred);
					}
				}
			};

			if (ajaxBeforeSend(xhr, settings) === false) {
				xhr.abort();
				ajaxError(null, 'abort', xhr, settings, deferred);
				return xhr;
			}

			if (settings.xhrFields) {
				for (name in settings.xhrFields) {
					if (settings.xhrFields.hasOwnProperty(name)) {
						xhr[name] = settings.xhrFields[name];
					}
				}
			}

			async = settings.hasOwnProperty('async') ? settings.async : true;

			xhr.open(settings.type, settings.url, async, settings.username, settings.password);

			for (name in headers) {
				if (headers.hasOwnProperty(name)) {
					nativeSetHeader.apply(xhr, headers[name]);
				}
			}

			if (settings.timeout > 0) {
				abortTimeout = setTimeout(function () {
					xhr.onreadystatechange = Y.Lang.noop;
					xhr.abort();
					ajaxError(null, 'timeout', xhr, settings, deferred);
				}, settings.timeout);
			}

			// Avoid sending Empty string
			if (settings.data) {
				xhr.send(settings.data);
			} else {
				xhr.send(null);
			}

			return xhr;
		},

		Get: function () {
			return this.Ajax(parseArguments.apply(null, arguments));
		},

		Post: function () {
			var options = parseArguments.apply(null, arguments);
			options.type = 'POST';
			return this.Ajax(options);
		}
	});

	Y.Extend(Y.DOM, {
		get: Y.DOM.Get,
		post: Y.DOM.Post,
		ajax: Y.DOM.Ajax,
		JSON: Y.DOM.getJSON,
		Script: Y.DOM.getScript,
		ajaxJSONP: Y.DOM.AjaxJSONP,
		ajaxSettings: Y.DOM.AjaxSettings
	});

	//---

	Y.DOM.Function.load = function (url, data, success) {
		if (!this.length) {
			return this;
		}

		var self = this,
			parts = url.split(/\s/),
			selector,
			options = parseArguments(url, data, success),
			callback = options.success;

		if (parts.length > 1) {
			options.url = parts[0];
			selector = parts[1];
		}

		options.success = function (response) {
			self.html(selector ? 
				Y.DOM('<div>').html(response.replace(Y.RegEx.scriptReplacement, '')).find(selector) : 
				response);

			if (callback) {
				callback.apply(self, arguments);
			}
		};

		Y.DOM.Ajax(options);

		return this;
	};

	//---

	/**
	 * Extend YAX's AJAX beforeSend method by setting an X-CSRFToken on any
	 * 'unsafe' request methods.
	 **/
	Y.Extend(Y.DOM.AjaxSettings, {
		beforeSend: function (xhr, settings) {
			if (!(/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type)) && sameOrigin(
				settings.url)) {
				xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
			}
		}
	});

	//---

}());

//---
