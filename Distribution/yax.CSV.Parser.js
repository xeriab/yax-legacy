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

