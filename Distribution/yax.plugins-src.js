/**
 * YAX.JS 0.19-dev, Yet another extensible Javascript Library.
 * (C) 2013-2014 Xeriab Nabil
 *//**
 * Y Plugins | LocalStorage
 *
 * Cross browser LocalStorage implementation using Y's API [CORE, Node]
 *
 * @version     0.15
 * @depends:    Core, Node
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

	//---

	Y.Store.MergeObject('Drivers', {
		LocalStorage: {
			ID: 'Y.Store.Drivers.LocalStorage',

			Scope: 'All',

			/**
			 *
			 * @returns {boolean}
			 * @constructor
			 */
			Available: function () {
				try {
					// Firefox won't allow localStorage if cookies are disabled
					if (Y.UserAgent.Features.LocalStorage) {
						// Safari's "Private" mode throws a QUOTA_EXCEEDED_ERR on setItem
						Y.Window.localStorage.setItem('Y.Store.LocalStorage Availability test', true);
						Y.Window.localStorage.removeItem('Y.Store.LocalStorage Availability test');

						return true;
					}

					return false;
				} catch (e) {
					Y.ERROR(e);
					return false;
				}
			},

			Initialise: Y.Lang.Noop,

			/**
			 * @return {boolean}
			 */
			Set: function (key, value) {
				if (this.Available()) {
					Y.Window.localStorage.setItem(key, value);
				} else {
					var name;

					Y.Window.LocalStorage = {};

					if (Y.Lang.isString(key) && Y.Lang.isString(value)) {
						Y.Window.LocalStorage[key] = value;
						return true;
					}

					if (Y.Lang.isObject(key) && Y.Lang.isUndefined(value)) {
						for (name in key) {
							if (key.hasOwnProperty(name)) {
								Y.Window.LocalStorage[name] = key[name];
							}
						}

						return true;
					}

					return false;
				}
			},

			Get: function (key) {
				if (this.Available()) {
					return Y.Window.localStorage.getItem(key);
				}

				return Y.Window.LocalStorage[key];
			},

			Delete: function (key) {
				if (this.Available()) {
					Y.Window.localStorage.removeItem(key);
				} else {
					delete Y.Window.LocalStorage[key];
				}
			},

			Flush: function () {
				if (this.Available()) {
					Y.Window.localStorage.clear();
				} else {
					Y.Window.LocalStorage = {};
				}
			}
		}
	});

	//---

}());

//---


/**
 * YAX Plugins | Cookies
 *
 * Cross browser Cookies implementation using YAX's API [CORE, Node]
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
/*global YAX, Y */

(function () {

	'use strict';

	//---

	Y.Store.MergeObject('Drivers', {
		Cookies: {
			ID: 'Y.Store.Drivers.Cookies',

			Scope: 'Browser',

			/**
			 * @return {boolean}
			 */
			Available: function () {
				try {
					return !!Y.UserAgent.Features.Cookies;
				} catch (e) {
					Y.ERROR(e);
					return false;
				}
			},

			Initialise: Y.Lang.noop,

			/**
			 * @return {boolean}
			 */
			Set: function (name, value) {
				var date, expire, key;

				date = new Date();
				date.setTime(date.getTime() + 31536000000);

				//expire = '; expires=' + date.toGMTString();
				expire = '; expires=' + date.toUTCString();

				if (Y.Lang.isString(name) && Y.Lang.isString(value)) {
					Y.Document.cookie = name + '=' + value + expire + '; path=/';
					return true;
				}

				if (Y.Lang.isObject(name) && Y.Lang.isUndefined(value)) {
					for (key in name) {
						if (name.hasOwnProperty(key)) {
							Y.Document.cookie = key + '=' + name[key] + expire + '; path=/';
						}
					}

					return true;
				}

				return false;
			},

			/**
			 * @return {string}
			 */
			Get: function (name) {
				var newName, cookieArray, x, cookie;

				newName = name + '=';
				cookieArray = Y.Document.cookie.split(';');

				for (x = 0; x < cookieArray.length; x++) {
					cookie = cookieArray[x];

					while (cookie.charAt(0) === ' ') {
						cookie = cookie.substring(1, cookie.length);
					}

					if (cookie.indexOf(newName) === 0) {
						return cookie.substring(newName.length, cookie.length);
					}
				}

				return null;
			},

			Delete: function (name) {
				this.Set(name, '', -1);
			}
		}
	});

	//---

}());

//---


/**
 * YAX Plugins | CSV
 *
 * Cross browser CSV parser implementation using YAX's API [CORE, Node]
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
/*global YAX, Y */

(function () {

	'use strict';

	//---

	/**
	 * @return {boolean}
	 */
	var PRESENT = function (possible) {
		return !Y.Lang.isUndefined(possible);
	};

	var FLOAT = /^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/;

	/**
	 * @return {boolean}
	 */
	var BOOL = function (possible) {
		possible = possible.toLowerCase();
		return (possible === "true" || possible === "false");
	};

	var Builder = function (type, schema, sample, shouldCast) {
		var code = "return ",
			cast = shouldCast ? function (element, index) {
				if (FLOAT.test(element)) {
					return "Number(values[" + index + "]),";
				}

				if (BOOL(element)) {
					return "Boolean(values[" + index + "].toLowerCase() === 'true'),";
				}

				return "String(values[" + index + "]),";
			} : function (element, index) {
				return "values[" + index + "],";
			},
			_index;

		if (type === "object") {
			code += "{";
			for (_index = 0; _index < schema.length; ++_index) {
				code += '"' + schema[_index] + '": ' + cast(sample[_index], _index);
			}
			code = code.slice(0, -1) + "}";
		} else {
			code += "[";
			for (_index = 0; _index < schema.length; ++_index) {
				code += cast(sample[_index], _index);
			}
			code = code.slice(0, -1) + "]";
		}

		/** jshint evil: true */
		return new Function("values", code);
	};

	//---

	Y.Parser.MergeObject('Drivers', {
		CSV: {
			ID: 'Y.Parser.Drivers.CSV',

			Options: null,
			Data: null,

			dataSource: function (data, set) {
				var _i, _dataChar, _lineChar;

				set = PRESENT(set) ? set : {};

				this.Options = {
					async: PRESENT(set.async) ? set.async : false,
					cast: PRESENT(set.cast) ? set.cast : true,
					line: PRESENT(set.line) ? set.line : '\r\n',
					delimiter: PRESENT(set.delimiter) ? set.delimiter : ',',
					header: PRESENT(set.header) ? set.header : false,
					done: PRESENT(set.done) ? set.done : undefined
				};

				this.Data = data;

				if (this.Data instanceof Array) {
					return this;
				}

				for (_i = 0; _i < this.Options.line.length; _i++) {
					_dataChar = data.charCodeAt(data.length - this.Options.line.length + _i);

					_lineChar = this.Options.line.charCodeAt(_i);

					if (_dataChar !== _lineChar) {
						this.Data += this.Options.line.charAt(_i);
					}
				}

				// this.Parse = Y.Parser.prototype.Drivers.CSV.Parse;
				// this.forEach = Y.Parser.prototype.Drivers.CSV.forEach;
				// this.Set = Y.Parser.prototype.Drivers.CSV.Set;
				// this.Encode = Y.Parser.prototype.Drivers.CSV.Encode;

				return this;
			},

			/**
			 * @return {object}
			 */
			set: function (option, value) {
				this.Options[option] = value;
				return this;
			},

			/**
			 * @return {Array}
			 */
			encode: function (stream) {
				if (this.Data.length === 0) {
					return Y.Lang.empty();
				}

				var data = this.Data,
					response = [],
					delimiter = this.Options.delimiter,
					kind = data[0] instanceof Array ? 'array' : 'object',
					header = this.Options.header,
					complete = this.Options.done,

					stringify = function (value) {
						if (!value) {
							return null;
						}

						return (typeof value !== 'string') ? value : '"' + value.replace(/\"/g,
							'""') + '"';
					},

					sendLine = stream ? function (line) {
						stream(line.join(delimiter));
					} : function (line) {
						response.push(line.join(delimiter));
					},

					_dataLength = data.length,
					_index, _keys, fields, _fieldsLength, line, record;

				if (kind === "object") {
					fields = Object.keys(data[0]);
					_fieldsLength = fields.length;
				} else {
					_fieldsLength = data[0].length;
				}

				record = new Array(_fieldsLength);

				if (header) {
					var columns = header instanceof Array ? header : fields;
					for (_keys = 0; _keys < _fieldsLength; ++_keys) {
						record[_keys] = stringify(columns[_keys]);
					}
					sendLine(record);
				}

				if (kind === "object") {
					for (_index = 0; _index < _dataLength; ++_index) {
						line = data[_index];
						for (_keys = 0; _keys < _fieldsLength; ++_keys) {
							record[_keys] = stringify(line[fields[_keys]]);
						}
						sendLine(record);
					}
				} else {
					for (_index = 0; _index < _dataLength; ++_index) {
						line = data[_index];
						for (_keys = 0; _keys < _fieldsLength; ++_keys) {
							record[_keys] = stringify(line[_keys]);
						}
						sendLine(record);
					}
				}

				// Return as appropriate
				response = response.join(this.Options.line);

				if (complete) {
					complete(response);
				}

				return response;
			},

			/**
			 * @return {Array}
			 */
			forEach: function (stream) {
				return this.Data instanceof Array ? this.encode(stream) : this.parse(
					stream);
			},

			parse: function (stream) {
				if (this.Data.trim().length === 0) {
					return [];
				}

				var data = this.Data,
					response = [],
					complete = this.Options.done,
					shouldCast = this.Options.cast,
					header = this.Options.header,
					fields = header instanceof Array ? header : [],

					_line = this.Options.line,
					_fieldsLength = fields.length,

					current = {
						row: [],
						cell: ""
					},
					flag = {
						escaped: false,
						quote: false,
						cell: true
					},

					Record,
					saveCell = function (cell) {
						current.row.push(
							(flag.escaped ? cell.slice(1, -1).replace(/""/g, '"') : cell).trim()
						);
						current.cell = "";
						flag = {
							escaped: false,
							quote: false,
							cell: true
						};
					},
					saveLastCell = _line.length === 1 ? saveCell : function (cell) {
						saveCell(cell.slice(0, 1 - _line.length));
					},
					apply = stream ? function () {
						stream(new Record(current.row));
					} : function () {
						response.push(new Record(current.row));
					},
					sendRow = function () {
						if (header) {
							if (_fieldsLength) {
								Record = new Builder("object", fields, current.row, shouldCast);
								apply();
								sendRow = apply;
							} else {
								fields = current.row;
								_fieldsLength = fields.length;
							}
						} else {

							if (!Record) {
								Record = new Builder("array", current.row, current.row, shouldCast);
							}

							apply();

							sendRow = apply;
						}
					},

					start,
					_index,
					_dataLength = data.length,
					_lineDelim = _line.charCodeAt(_line.length - 1),
					_cellDelim = this.Options.delimiter.charCodeAt(0),
					currentChar;

				for (start = 0, _index = 0; _index <= _dataLength; ++_index) {
					currentChar = data.charCodeAt(_index);

					if (flag.cell) {
						flag.cell = false;
						if (currentChar === 34) {
							flag.escaped = true;
							continue;
						}
					}

					if (flag.escaped && currentChar === 34) {
						flag.quote = !flag.quote;
						continue;
					}

					if ((flag.escaped && flag.quote) || !flag.escaped) {
						if (currentChar === _cellDelim) {
							saveCell(current.cell + data.slice(start, _index));
							start = _index + 1;
						} else if (currentChar === _lineDelim) {
							saveLastCell(current.cell + data.slice(start, _index));
							start = _index + 1;
							sendRow();
							current.row = [];
						}
					}
				}

				// Return as appropriate
				if (complete) {
					complete(response);
				}

				return response;
			}
		}
	});

	//---

}());

//---

/**
 * YAX Plugins | Tooltip
 *
 * Cross browser Tooltip implementation using YAX's API [DOM]
 *
 * @version     0.15
 * @depends:    Core, DOM
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global Y, YAX */

(function () {

	'use strict';

	Y.Extend(Y.Settings.DOM, {
		Tooltip: {
			Opacity: 1,
			Content: '',
			Size: 'small',
			Gravity: 'north',
			Theme: 'dark',
			Trigger: 'hover',
			Animation: 'flipIn',
			Confirm: false,
			Yes: 'Yes',
			No: 'No',
			FinalMessage: '',
			FinalMessageDuration: 500,
			OnYes: Y.Lang.noop,
			OnNo: Y.Lang.noop,
			Container: 'body'
		}
	});

	var PluginOptions = Y.Settings.DOM.Tooltip;

	function Tooltip(element, options) {
		this.Element = element;
		this.Options = options;
		this.Delay = null;
		this.init();
	}

	Tooltip.prototype = {
		init: function () {
			this.setContent();

			if (this.Content) {
				this.setEvents();
			}
		},

		Show: function () {
			Y.DOM(this.Element).css('cursor', 'pointer');

			// Close all other Tooltips
			// Y.DOM('div.yax-tooltip').hide();
			Y.DOM('div.yax-tooltip').remove();
			Y.Window.clearTimeout(this.Delay);
			this.setContent();
			this.setPositions();

			this.Tooltip.css('display', 'block');
		},

		Hide: function () {
			// this.Tooltip.hide();
			this.Tooltip.remove();
			window.clearTimeout(this.Delay);
			// this.Tooltip.css('display', 'none');
			this.Tooltip.css('display', 'none');
		},

		Toggle: function () {
			if (this.Tooltip.is(':visible')) {
				this.Hide();
			} else {
				this.Show();
			}
		},

		addAnimation: function () {
			switch (this.Options.Animation) {
			case 'none':
				break;

			case 'fadeIn':
				this.Tooltip.addClass('animated');
				this.Tooltip.addClass('fadeIn');
				break;

			case 'flipIn':
				this.Tooltip.addClass('animated');
				this.Tooltip.addClass('flipIn');
				break;
			}
		},

		setContent: function () {
			// Get Tooltip content
			if (this.Options.Content) {
				this.Content = this.Options.Content;
			} else if (this.Element.data('tooltip')) {
				this.Content = this.Element.data('tooltip');
			} else if (this.Element.title()) {
				this.Content = this.Element.title();
				this.Element.title('');
			} else {
				Y.ERROR('No content for Tooltip: ' + this.Element.selector);
				return;
			}

			if (this.Content.charAt(0) === '#') {
				Y.DOM(this.Content).hide();
				this.Content = Y.DOM(this.Content).html();
				this.contentType = 'html';
			} else {
				this.contentType = 'text';
			}

			// Create Tooltip container
			this.Tooltip = Y.DOM('<div class="yax-tooltip ' +
				this.Options.Theme + ' ' +
				this.Options.Size + ' ' +
				this.Options.Gravity +
				'"><div class="tooltiptext">' +
				this.Content +
				'</div><div class="tip"></div></div>'
			);

			this.Tip = this.Tooltip.find('.tip');


			// this.Tooltip.insertBefore(this.Element.parent());

			// this.Options.Container ? this.Tooltip.prependTo(this.Options.Container) : this.Tooltip.insertAfter(this.Element.parent());
			if (this.Options.Container !== '' || this.Options.Container) {
				this.Tooltip.prependTo(this.Options.Container);
				// this.Tooltip.appendTo(this.Options.Container);
			} else {
				// this.Tooltip.insertAfter(this.Element.parent());
				// this.Tooltip.insertBefore(this.Element.parent());
				this.Tooltip.insertBefore(this.Element.parent());
			}


			// this.Tooltip.insertBefore(Y.DOM(this.Element));

			// Y.DOM(this.Element).parent().append(this.Tooltip);

			// this.Element.append(this.Tooltip);


			// Adjust size for html Tooltip
			if (this.contentType === 'html') {
				this.Tooltip.css('max-width', 'none');
			}

			this.Tooltip.css('opacity', this.Options.Opacity);

			this.addAnimation();

			if (this.Options.Confirm) {
				this.addConfirm();
			}
		},

		getPosition: function () {
			var Element = this.Element[0];
			return Y.Extend({}, (Y.Lang.isFunction(Element.getBoundingClientRect)) ? Element.getBoundingClientRect() : {
				width: Element.offsetWidth,
				height: Element.offsetHeight
			}, this.Element.offset());
		},

		setPositions: function () {
			// var pos = this.getPosition();

			var leftPos = 0,
				topPos = 0,
				ElementTop = this.Element.offset().top,
				ElementLeft = this.Element.offset().left;

			if (this.Element.css('position') === 'fixed' || this.Element.css('position') ===
				'absolute') {
				ElementTop = 0;
				ElementLeft = 0;
			}

			switch (this.Options.Gravity) {
				case 'south':
					leftPos = ElementLeft + this.Element.outerWidth() / 2 - this.Tooltip.outerWidth() /
						2;
					topPos = ElementTop - this.Tooltip.outerHeight() - this.Tip.outerHeight() /
						2;
					break;

				case 'west':
					leftPos = ElementLeft + this.Element.outerWidth() + this.Tip.outerWidth() /
						2;
					topPos = ElementTop + this.Element.outerHeight() / 2 - (this.Tooltip.outerHeight() /
						2);
					break;

				case 'north':
					leftPos = ElementLeft + this.Element.outerWidth() / 2 - (this.Tooltip.outerWidth() /
						2);
					topPos = ElementTop + this.Element.outerHeight() + this.Tip.outerHeight() /
						2;
					break;

				case 'east':
					leftPos = ElementLeft - this.Tooltip.outerWidth() - this.Tip.outerWidth() /
						2;
					topPos = ElementTop + this.Element.outerHeight() / 2 - this.Tooltip.outerHeight() /
						2;
					break;

				case 'center':
					leftPos = ElementLeft + this.Element.outerWidth() / 2 - (this.Tooltip.outerWidth() /
						2);
					topPos = ElementTop + this.Element.outerHeight() / 2 - this.Tip.outerHeight() /
						2;
					break;
			}

			this.Tooltip.css('left', leftPos);
			this.Tooltip.css('top', topPos);
		},

		setEvents: function () {
			var self = this;

			if (this.Options.Trigger === 'hover' || this.Options.Trigger ===
				'mouseover' || this.Options.Trigger === 'onmouseover') {
				this.Element.mouseover(function () {
					self.setPositions();
					self.Show();
				}).mouseout(function () {
					self.Hide();
				});
			} else if (this.Options.Trigger === 'click' || this.Options.Trigger ===
				'onclick') {
				this.Tooltip.click(function (event) {
					event.stopPropagation();
				});

				this.Element.click(function (event) {
					event.preventDefault();
					self.setPositions();
					self.Toggle();
					event.stopPropagation();
				});

				Y.DOM('html').click(function () {
					self.Hide();
				});
			}
		},

		activate: function () {
			this.setContent();

			if (this.Content) {
				this.setEvents();
			}
		},

		addConfirm: function () {
			this.Tooltip.append('<ul class="confirm"><li class="yax-tooltip-yes">' +
				this.Options.Yes + '</li><li class="yax-tooltip-no">' + this.Options.No +
				'</li></ul>');
			this.setConfirmEvents();
		},

		setConfirmEvents: function () {
			var self = this;

			this.Tooltip.find('li.yax-tooltip-yes').click(function (event) {
				self.onYes();
				event.stopPropagation();
			});
			this.Tooltip.find('li.yax-tooltip-no').click(function (event) {
				self.onNo();
				event.stopPropagation();
			});
		},

		finalMessage: function () {
			if (this.Options.FinalMessage) {
				var self = this;
				self.Tooltip.find('div:first').html(this.Options.FinalMessage);
				self.Tooltip.find('ul').remove();
				self.setPositions();
				setTimeout(function () {
					self.Hide();
					self.setContent();
				}, self.Options.FinalMessageDuration);
			} else {
				this.Hide();
			}
		},

		onYes: function () {
			this.Options.OnYes(this.Element);
			this.finalMessage();
		},

		onNo: function () {
			this.Options.OnNo(this.Element);
			this.Hide();
		}
	};

	Y.DOM.Function.Tooltip = function (options) {
		options = Y.Extend({}, PluginOptions, options);

		return this.each(function () {
			return new Tooltip(Y.DOM(this), options);
		});
	};

	//---

}());

//---

/**
 * YAX DOM | WiatForMe Plugin
 *
 *
 * @version     0.15
 * @depends:    Core, DOM, Events
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global Y, YAX */

(function () {

	'use strict';

	//---

	Y.Extend(Y.Settings.DOM, {
		WaitForMe: {
			Opacity: 1.0,
			Effect: 'bounce',
			Content: '',
			Background: 'rgba(245, 245, 245, .75)',
			Color: 'rgba(10, 20, 30, .9)',
			Width: 0,
			Height: 0,
			Container: 'body',
			Trigger: 'yax.waitformeclose'
		}
	});

	var PluginOptions = Y.Settings.DOM.WaitForMe;

	function WaitForMe(element, option) {
		this.Element = element;
		this.Options = option;
		this.CSS_Class = 'yax-waitforme';
		this.Effects = null;
		this.EffectElementCount = null;
		this.CreateSubElement = false;
		this.SpecificAttr = 'background-color';
		this.EffectElementHTML = '';
		this.ContainerSize = null;
		this.ElementSize = null;
		this.Div = null;
		this.Content = null;

		this.init();
	}

	WaitForMe.prototype = {
		init: function () {
			this.setContent();

			this._init_();

			//			if (this.Content) {
			//				this.setEvents();
			//			}

			this.setEvents();
		},

		Show: function () {
			// Y.DOM(this.Element).css('cursor', 'none');

			// Close all other WaitForMe
			Y.DOM('div.yax-waitforme').hide();
			this.WaitForMe.css('display', 'block');
		},

		Hide: function () {
			this.WaitForMe.hide();
			this.WaitForMe.css('display', 'none');
		},

		Toggle: function () {
			if (this.WaitForMe.is(':visible')) {
				this.Hide();
			} else {
				this.Show();
			}
		},

		_init_: function () {
			var x;

			switch (this.Options.Effect) {
			case 'none':
				this.EffectElementCount = 0;
				break;

			case 'bounce':
				this.EffectElementCount = 3;
				this.ContainerSize = '';

				this.ElementSize = {
					width: this.Options.Width.toString() + 'px',
					height: this.Options.Height.toString() + 'px'
				};

				break;

			case 'rotateplane':
				this.EffectElementCount = 1;
				this.ContainerSize = '';

				this.ElementSize = {
					width: this.Options.Width.toString() + 'px',
					height: this.Options.Height.toString() + 'px'
				};

				break;

			case 'stretch':
				this.EffectElementCount = 5;
				this.ContainerSize = '';

				this.ElementSize = {
					width: this.Options.Width.toString() + 'px',
					height: this.Options.Height.toString() + 'px'
				};

				break;

			case 'orbit':
				this.EffectElementCount = 2;

				this.ContainerSize = {
					width: this.Options.Width.toString() + 'px',
					height: this.Options.Height.toString() + 'px'
				};

				this.ElementSize = '';

				break;

			case 'roundBounce':
				this.EffectElementCount = 12;

				this.ContainerSize = {
					width: this.Options.Width.toString() + 'px',
					height: this.Options.Height.toString() + 'px'
				};

				this.ElementSize = '';

				break;

			case 'win8':
				this.EffectElementCount = 5;
				this.CreateSubElement = true;

				// this.ContainerSize = 'width:' + this.Options.Width + '; height:' + this.Options.Height;
				// this.ElementSize = 'width:' + this.Options.Width + '; height:' + this.Options.Height;

				this.ContainerSize = {
					width: this.Options.Width.toString() + 'px',
					height: this.Options.Height.toString() + 'px'
				};

				this.ElementSize = {
					width: this.Options.Width.toString() + 'px',
					height: this.Options.Height.toString() + 'px'
				};

				break;

			case 'win8_linear':
				this.EffectElementCount = 5;
				this.CreateSubElement = true;

				// this.ContainerSize = 'width:' + this.Options.Width + '; height:' + this.Options.Height;

				this.ContainerSize = {
					width: this.Options.Width.toString() + 'px',
					height: this.Options.Height.toString() + 'px'
				};

				this.ElementSize = '';

				break;

			case 'ios':
				this.EffectElementCount = 12;

				// this.ContainerSize = 'width:' + this.Options.Width + '; height:' + this.Options.Height;

				this.ContainerSize = {
					width: this.Options.Width.toString() + 'px',
					height: this.Options.Height.toString() + 'px'
				};

				this.ElementSize = '';

				break;

			case 'facebook':
				this.EffectElementCount = 3;
				this.ContainerSize = '';

				// this.ElementSize = 'width:' + this.Options.Width + '; height:' + this.Options.Height;

				this.ElementSize = {
					width: this.Options.Width.toString() + 'px',
					height: this.Options.Height.toString() + 'px'
				};

				break;

			case 'rotation':
				this.EffectElementCount = 1;
				this.SpecificAttr = 'border-color';
				this.ContainerSize = '';

				// this.ElementSize = 'width:' + this.Options.Width + '; height:' + this.Options.Height;

				this.ElementSize = {
					width: this.Options.Width.toString() + 'px',
					height: this.Options.Height.toString() + 'px'
				};

				break;
			}

			this.ElementSize = 'width: ' + this.ElementSize.width + '; height: ' + this
				.ElementSize.height;
			this.ContainerSize = 'width: ' + this.ContainerSize.width + '; height: ' +
				this.ContainerSize.height;

			if (Y.Lang.isEmpty(this.Options.Width) && Y.Lang.isEmpty(this.Options.Height)) {
				this.ElementSize = Y.Lang.empty();
				this.ContainerSize = Y.Lang.empty();
			}

			this.Effects = Y.DOM('<div class="' + this.CSS_Class + '-progress ' + this
				.Options.Effect + '"></div>');

			if (this.EffectElementCount > 0) {


				for (x = 1; x <= this.EffectElementCount; ++x) {
					if (this.CreateSubElement) {
						this.EffectElementHTML += '<div class="' + this.CSS_Class +
							'-progress-element' + x + '" style="' + this.ElementSize +
							'"><div style="' + this.SpecificAttr + ': ' +
							this.Options.Color + '"></div></div>';
					} else {
						this.EffectElementHTML += '<div class="' + this.CSS_Class +
							'-progress-element' + x + '" style="' + this.SpecificAttr +
							': ' + this.Options.Color + '; ' + this.ElementSize + '"></div>';
					}

				}

				this.Effects = Y.DOM('<div class="' + this.CSS_Class + '-progress ' +
					this.Options.Effect + '" style="' + this.ContainerSize + '">' + this.EffectElementHTML +
					'</div>');

				//				this.Effects = Y.DOM('<div></div>').addClass(this.CSS_Class + '-progress ' + this.Options.Effect).css(this.ContainerSize);
				//				this.Effects.append(this.EffectElementHTML);
			}

			if (this.Options.Content) {
				this.Content = Y.DOM('<div class="' + this.CSS_Class +
					'-text" style="color: ' + this.Options.Color + ';">' + this.Options.Content +
					'</div>');
			}

			if (this.Element.find('> .' + this.CSS_Class)) {
				this.Element.find('> .' + this.CSS_Class).remove();
			}

			this.Div = Y.DOM('<div class="' + this.CSS_Class + '-content"></div>');

			this.Div.append(this.Effects, this.Content);

			this.Div.appendTo(this.WaitForMe);

			if (this.Element[0].tagName === 'HTML') {
				this.Element = Y.DOM('body');
			}

			this.Element.addClass(this.CSS_Class + '-container').append(this.WaitForMe);

			this.Element.find('> .' + this.CSS_Class).css({
				background: this.Options.Background
			});

			this.Element.find('.' + this.CSS_Class + '-content').css({
				marginTop: -this.Element.find('.' + this.CSS_Class + '-content').outerHeight() /
					2 + 'px'
			});
		},

		Close: function () {
			this.Element.removeClass(this.CSS_Class + '-container');
			this.Element.find('.' + this.CSS_Class).remove();
		},

		setContent: function () {
			// Get WaitForMe content
			if (this.Options.Content) {
				this.Content = this.Options.Content;
			} else if (this.Element.data('YAX-WaitForMe')) {
				this.Content = this.Element.data('YAX-WaitForMe');
			} else if (Y.Lang.isEmpty(this.Options.Content)) {
				this.Content = Y.Lang.empty();
			} else if (Y.Lang.isNull(this.Options.Content)) {
				this.Content = Y.Lang.empty();
			} else {
				Y.ERROR('No content for WaitForMe: ' + this.Element.selector);
				return;
			}

			if (this.Content.charAt(0) === '#') {
				Y.DOM(this.Content).hide();
				this.Content = Y.DOM(this.Content).html();
				this.contentType = 'html';
			} else {
				this.contentType = 'text';
			}

			// Create WaitForMe container
			this.WaitForMe = Y.DOM('<div></div>').addClass(this.CSS_Class);

			if (this.Options.Container) {
				this.WaitForMe.prependTo(this.Options.Container);
			} else {
				this.WaitForMe.insertAfter(this.Element.parent());
			}

			// Adjust size for html WaitForMe
			if (this.contentType === 'html') {
				this.WaitForMe.css('max-width', 'none');
			}

			this.WaitForMe.css('opacity', this.Options.Opacity);
		},

		setEvents: function () {
			var self = this;

			if (this.Options.Trigger === 'yax.waitformeclose') {
				this.WaitForMe.on('yax.waitformeclose', function () {
					self.Close();
				});

				this.Element.on('yax.waitformeclose', function () {
					self.Close();
				});
			}
		}
	};

	Y.DOM.Function.WaitForMe = function (option) {
		var options = Y.Extend({}, PluginOptions, option);

		if (option === 'close') {
			return new WaitForMe(Y.DOM(this), options).Close();
		}

		return this.each(function () {
			return new WaitForMe(Y.DOM(this), options);
		});
	};

	//---

}());

//---

/**
 * YAX Plugins | Autofix
 *
 *
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
/*global YAX, Y */

//---

(function () {

	'use strict';

	Y.Extend(Y.Settings.DOM, {
		AutoFix: {
			CustomOffset: true,
			Manual: true,
			OnlyInContainer: true
		}
	});

	var PluginOptions = Y.Settings.DOM.AutoFix;

	Y.DOM.Function.AutoFix = function (options) {
		var settings = Y.Extend(PluginOptions, options, {}),
			el = Y.DOM(this),
			curpos = el.position(),
			offset = settings.CustomOffset,
			pos = el.offset(),
			fixAll;

		el.addClass('yax-autofix');

		Y.DOM.Function.ManualFix = function () {
			el = Y.DOM(this);
			pos = el.offset();

			if (el.hasClass('_fixed')) {
				el.removeClass('_fixed');
			} else {
				el.addClass('_fixed').css({
					top: 0,
					left: pos.left,
					right: 'auto',
					bottom: 'auto'
				});
			}
		};

		fixAll = function (el, settings, curpos, pos) {
			if (settings.customOffset === false) {
				offset = el.parent().offset().top;
			}

			if (Y.DOM(Y.Document).scrollTop() > offset &&
				Y.DOM(Y.Document).scrollTop() <= (el.parent().height() +
				(offset - Y.DOM(Y.Window).height()))) {
				el.removeClass('_bottom').addClass('_fixed').css({
					top: 0,
					left: pos.left,
					right: 'auto',
					bottom: 'auto'
				});
			} else {
				if (Y.DOM(Y.Document).scrollTop() > offset) {
					if (settings.OnlyInContainer === true) {
						if (Y.DOM(Y.Document).scrollTop() > (el.parent().height() - Y.DOM(Y.Window).height())) {
							el.addClass('_bottom _fixed').removeAttr('style').css({
								left: curpos.left
							});
						} else {
							el.removeClass('_bottom _fixed').removeAttr('style');

						}
					}
				} else {
					el.removeClass('_bottom _fixed').removeAttr('style');
				}
			}
		};

		if (settings.Manual === false) {
			Y.DOM(Y.Window).scroll(function () {
				fixAll(el, settings, curpos, pos);
			});
		}
	};

	//---

}());

//---


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
					path = path.replace(this.HashRegex.Escape, '\\$&').replace(this.HashRegex
						.NamedArgument, '([^\/]*)').replace(this.HashRegex.ArgumentSplat,
						'(.*?)');
					temp = new RegExp('^' + path + '$');
				}

				this.Routes.push({
					'Route': temp,
					'Function': callback || function () {
						return false;
					}
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
			return ((document.location + Y.Lang.empty()).replace(this.getPath() + this.getHash(),
				''));
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
						/** @namespace route.Function.call */
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
	Y.DOM.Router = Router;

	//---

}(this));

//---

