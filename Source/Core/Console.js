/**
 * YAX Core | Console
 *
 * Another YAX's Console tools and shortcuts [CORE]
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

	// 'use strict';

	Y.CLE = Y.Class.Extend({
		CLASS_NAME: 'Console',

		CONSOLE_STYLES: {
			'reset': ['\x1B[0m', '\x1B[0m'],

			'bold': ['\x1B[1m', '\x1B[22m'],
			'italic': ['\x1B[3m', '\x1B[23m'],
			'underline': ['\x1B[4m', '\x1B[24m'],
			'inverse': ['\x1B[7m', '\x1B[27m'],
			'strikethrough': ['\x1B[9m', '\x1B[29m'],

			// Text colors

			// Grayscale
			'white': ['\x1B[37m', '\x1B[39m'],
			'grey': ['\x1B[90m', '\x1B[39m'],
			'black': ['\x1B[30m', '\x1B[39m'],

			// Colors
			'blue': ['\x1B[34m', '\x1B[39m'],
			'cyan': ['\x1B[36m', '\x1B[39m'],
			'green': ['\x1B[32m', '\x1B[39m'],
			'magenta': ['\x1B[35m', '\x1B[39m'],
			'red': ['\x1B[31m', '\x1B[39m'],
			'yellow': ['\x1B[33m', '\x1B[39m'],

			// Background Colors

			// Grayscale
			'whiteBG': ['\x1B[47m', '\x1B[49m'],
			'greyBG': ['\x1B[49;5;8m', '\x1B[49m'],
			'blackBG': ['\x1B[40m', '\x1B[49m'],

			// Colors
			'blueBG': ['\x1B[44m', '\x1B[49m'],
			'cyanBG': ['\x1B[46m', '\x1B[49m'],
			'greenBG': ['\x1B[42m', '\x1B[49m'],
			'magentaBG': ['\x1B[45m', '\x1B[49m'],
			'redBG': ['\x1B[41m', '\x1B[49m'],
			'yellowBG': ['\x1B[43m', '\x1B[49m']
		},

		FORMATS: [
			{
				REGEX: /\*([^\*]+)\*/,
				/**
				 * @return {string}
				 */
				REPLACER: function (match, content) {
					return '%c' + content + '%c';
				},
				STYLES: function () {
					return ['font-style: italic', ''];
				}
			},

			{
				REGEX: /\_([^\_]+)\_/,
				/**
				 * @return {string}
				 */
				REPLACER: function (match, content) {
					return '%c' + content + '%c';
				},
				STYLES: function () {
					return ['font-weight: bold', ''];
				}
			},

			{
				REGEX: /\`([^\`]+)\`/,
				/**
				 * @return {string}
				 */
				REPLACER: function (match, content) {
					return '%c' + content + '%c';
				},
				STYLES: function () {
					return ['background: rgb(255, 255, 219); padding: 1px 5px; border: 1px solid rgba(0, 0, 0, 0.1)', ''];
				}
			},

			{
				REGEX: /\[c\=(?:\"|\')?((?:(?!(?:\"|\')\]).)*)(?:\"|\')?\]((?:(?!\[c\]).)*)\[c\]/,
				/**
				 * @return {string}
				 */
				REPLACER: function (match, content) {
					return '%c' + content + '%c';
				},
				STYLES: function (match) {
					return [match[1], ''];
				}
			}
		],

		LEVELS: {
			NONE: 0,
			OFF: 0,
			ERROR: 1,
			WARN: 2,
			WARNING: 2,
			INFO: 3,
			INFORMATION: 3,
			DEBUG: 4
		},

		LEVEL_COLORS: [
			'NOCOLOR',
			'red',
			'yellow',
			'cyan',
			'green'
		],

		LEVEL_NAMES: [
			'NONE',
			'ERROR',
			'WARN',
			'INFO',
			'DEBUG'
		],

		CONSOLE: {
			ERROR: Y.ERROR,
			WARN: Y.WARN,
			INFO: Y.INFO,
			DEBUG: Y.LOG,
			LOG: Y.LOG
		},

		construct: function () {
			Y.setConfig('Console.Log.Extended', true);
			Y.setConfig('Console.Level', this.LEVELS.DEBUG);
			Y.setConfig('Console.Colored', false);
			Y.setConfig('Console.Message.Colored', false);
			Y.setConfig('Console.Print.Level', true);
			Y.setConfig('Console.Timed', false);
			Y.setConfig('Console.On.Output', null);
		},

		setLevel: function (level) {
			Y.setConfig('Console.Level', level);
		},

		getLevel: function () {
			return Y.getConfig('Console.Level');
		},

		getLevelName: function (level) {
			if (!Y.Lang.isSet(level)) {
				return this.LEVEL_NAMES[Y.getConfig('Console.Level')];
			}

			return this.LEVEL_NAMES[level];
		},

		getLevelColor: function (level) {
			if (!Y.Lang.isSet(level)) {
				return this.LEVEL_COLORS[Y.getConfig('Console.Level')];
			}

			return this.LEVEL_COLORS[level];
		},

		isLevelVisible: function (levelToCompare) {
			return Y.getConfig('Console.Level') >= levelToCompare;
		},

		// Enable/Disable Colored Output
		enableColor: function () {
			Y.setConfig('Console.Colored', true);
		},

		disableColor: function () {
			Y.setConfig('Console.Colored', false);
		},

		isColored: function () {
			return Y.getConfig('Console.Colored');
		},

		// Enable/Disable Colored Message Output
		enableMessageColor: function () {
			Y.setConfig('Console.Message.Colored', true);
		},

		disableMessageColor: function () {
			Y.setConfig('Console.Message.Colored', false);
		},

		isMessageColored: function () {
			return Y.getConfig('Console.Message.Colored');
		},

		// Enable/Disable Level Printing in Output
		enableLevelMessage: function () {
			Y.setConfig('Console.Print.Level', true);
		},

		disableMessageMessage: function () {
			Y.setConfig('Console.Print.Level', false);
		},

		isLevelMessagePrinted: function () {
			return Y.getConfig('Console.Print.Level');
		},

		// Enable/Disable Timestamped Output
		enableTimestamp: function () {
			Y.setConfig('Console.Timed', true);
		},

		disableTimestamp: function () {
			Y.setConfig('Console.Timed', false);
		},

		isTimestamped: function () {
			return Y.getConfig('Console.Timed');
		},

		/**
		 * Set OnOutput Callback (useful to write to file or something)
		 * Callback: `function(formattedMessage, levelName)`
		 */
		onOutput: function (callback) {
			Y.setConfig('Console.On.Output', callback);
		},

		/**
		 * Decodes coloring markup in string
		 */
		stringToColor: function (string) {
			if (this.isColored()) {
				return this.applyColors(string);
			}

			return string;
		},

		/**
		 * Take a string and apply console ANSI colors for expressions "#color{message}"
		 * NOTE: Does nothing if "console.colored === false".
		 *
		 * @param string Input String
		 * @returns Same string but with colors applied
		 */
		applyColors: function (string) {
			var tag = /#([a-z]+)\{|\}/,
				cstack = [],
				matches = null,
				orig = null,
				name = null,
				code = null;

			while (tag.test(string)) {
				matches = tag.exec(string);
				orig = matches[0];

				if (this.isColored()) {
					if (orig === '}') {
						cstack.pop();
					} else {
						name = matches[1];

						/*if (name in this.ANSI_CODES) {
							code = this.ANSI_CODES[name];
							cstack.push(code);
						}*/

						/*if (name in this.BROWSER_STYLES) {
							code = this.BROWSER_STYLES[name];
							cstack.push(code);
						}*/

						// if (name in this.CONSOLE_STYLES) {
						if (Y.HasOwnProperty.call(this.CONSOLE_STYLES, name)) {
							code = this.CONSOLE_STYLES[name][0];
							cstack.push(code);
						}
					}

					// string = string.replace(orig, this.ANSI_CODES.reset + cstack.join(''));
					// string = string.replace(orig, this.BROWSER_STYLES.reset + cstack.join(''));
					string = string.replace(orig, this.CONSOLE_STYLES.reset[0] + cstack.join(''));
				} else {
					string = string.replace(orig, '');
				}
			}

			return string;
		},

		/**
		 * Decorate the Arguments passed to the console methods we override.
		 * First element, the message, is now colored, timed and more (based on config).
		 *
		 * @param argsArray Array of arguments to decorate
		 * @param level Logging level to apply (regulates coloring and text)
		 * @returns Array of Arguments, decorated.
		 */
		decorateArgs: function (argsArray, level) {
			var args = Y.G.Slice.call(argsArray, 1),
				message = argsArray[0],
				levelMessage;

			if (this.isColored()) {
				levelMessage = this.applyColors('#' + this.getLevelColor(level) + '{' + this.getLevelName(level) + '}');
				message = this.applyColors(message);

				if (this.isMessageColored()) {
					message = this.applyColors('#' + this.getLevelColor(level) + '{' + message + '}');
				}
			} else {
				levelMessage = this.getLevelName(level);
			}

			message = this.formatMessage(message, levelMessage);

			args.splice(0, 0, message);

			return args;
		},

		/**
		 * Formats the Message content.
		 * @param message The message itself
		 * @param levelMessage The portion of message that contains the Level (maybe colored)
		 * @retuns The formatted message
		 */
		formatMessage: function (message, levelMessage) {
			var printLevelMessage = this.isLevelMessagePrinted(),
				printTimestamp = this.isTimestamped(),
				formatted;

			if (printLevelMessage && printTimestamp) {
				formatted = '[' + levelMessage + ' - ' + new Date().toJSON() + '] ' + message;
			} else if (printLevelMessage) {
				formatted = '[' + levelMessage + '] ' + message;
			} else if (printTimestamp) {
				formatted = '[' + new Date().toJSON() + '] ' + message;
			} else {
				formatted = message;
			}

			return formatted;
		},

		/**
		 * Invokes the "this.onOutput()" callback, if it was set by user.
		 * This is useful in case the user wants to write the console output to another media as well.
		 *
		 * The callback is invoked with 2 parameters:
		 * - formattedMessage: formatted message, ready for output
		 * - levelName: the name of the logging level, to inform the user
		 *
		 * @param message The Message itself
		 * @param level The Message Level (Number)
		 */
		invokeOnOutput: function (message, level) {
			var formattedMessage,
				levelName;

			if (!Y.Lang.isNull(Y.getConfig('Console.On.Output')) && Y.Lang.isFunction(Y.getConfig('Console.On.Output'))) {
				levelName = this.getLevelName(level);
				formattedMessage = this.formatMessage(message, levelName);

				Y.getConfig('Console.On.Output').call(null, formattedMessage, levelName);
			}
		},

		hasMatches: function (str) {
			var _hasMatches = false;

			this.FORMATS.forEach(function (format) {
				if (format.REGEX.test(str)) {
					_hasMatches = true;
					return _hasMatches;
				}
			});

			return _hasMatches;
		},

		getOrderedMatches: function (str) {
			var matches = [];

			this.FORMATS.forEach(function (format) {
				var match = str.match(format.REGEX);

				if (match) {
					return matches.push({
						FORMAT: format,
						MATCH: match
					});
				}
			});

			return matches.sort(function (a, b) {
				return a.MATCH.index - b.MATCH.index;
			});
		},

		stringToArgs: function (str) {
			var firstMatch;
			var matches;
			var styles = [];

			while (this.hasMatches(str)) {
				matches = this.getOrderedMatches(str);
				firstMatch = matches[0];
				str = str.replace(firstMatch.FORMAT.REGEX, firstMatch.FORMAT.REPLACER);
				styles = styles.concat(firstMatch.FORMAT.STYLES(firstMatch.MATCH));
			}

			return [str].concat(styles);
		}

		/*_log: function () {
			return Y.LOG.apply(this, Y.Lang.makeArray(arguments));
		},

		log: function () {
			var args = [];

			Y.Lang.makeArray(arguments).forEach(function(arg) {
				if (Y.Lang.isString(arg)) {
					args = args.concat(Y.Console.stringToArgs(arg));
					return args;
				} else {
					return args.push(arg);
				}
			});

			return this._log.apply(window, args);
		},*/
	});

	//---

	Y.Console = new Y.CLE();
	
	delete Y.CLE;

	//---

	// Overrides some key "YAX" Object methods
	Y.ERROR = function (message) {
		if (arguments.length > 0 && Y.Console.isLevelVisible(Y.Console.LEVELS.ERROR)) {
			Y.Console.CONSOLE.ERROR.apply(this, Y.Console.decorateArgs(arguments, Y.Console.LEVELS.ERROR));
			Y.Console.invokeOnOutput(message, Y.Console.LEVELS.ERROR);
		}
	};

	Y.WARN = function (message) {
		if (arguments.length > 0 && Y.Console.isLevelVisible(Y.Console.LEVELS.WARN)) {
			Y.Console.CONSOLE.WARN.apply(this, Y.Console.decorateArgs(arguments, Y.Console.LEVELS.WARN));
			Y.Console.invokeOnOutput(message, Y.Console.LEVELS.WARN);
		}
	};

	Y.INFO = function (message) {
		if (arguments.length > 0 && Y.Console.isLevelVisible(Y.Console.LEVELS.INFO)) {
			Y.Console.CONSOLE.INFO.apply(this, Y.Console.decorateArgs(arguments, Y.Console.LEVELS.INFO));
			Y.Console.invokeOnOutput(message, Y.Console.LEVELS.INFO);
		}
	};

	Y.DEBUG = function (message) {
		if (arguments.length > 0 && Y.Console.isLevelVisible(Y.Console.LEVELS.DEBUG)) {
			Y.Console.CONSOLE.DEBUG.apply(this, Y.Console.decorateArgs(arguments, Y.Console.LEVELS.DEBUG));
			Y.Console.invokeOnOutput(message, Y.Console.LEVELS.DEBUG);
		}
	};

	Y.LOG = function () {
		/*if (arguments.length > 0) {
			Y.Console.CONSOLE.LOG.apply(this, arguments);
		}*/

		var args = [];

		if (arguments.length > 0) {
			Y.Lang.makeArray(arguments).forEach(function (arg) {
				if (Y.Lang.isString(arg)) {
					args = args.concat(Y.Console.stringToArgs(arg));

					return args;
				}

				return args.push(arg);
			});

			Y.Console.CONSOLE.LOG.apply(this, args);
		}
	};

	//---

}());

//---
