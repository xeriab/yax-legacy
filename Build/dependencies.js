/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX, exports */

var Dependencies = {
	'Core': {
		src: [
			'YAX.js',

			'Core/Constants.js',

			'Core/Core.js',

			'Core/Contrib/Config.js',

			'Core/Global.js',
			'Core/RegexList.js',
			'Core/Utility.js',
			'Core/Class.js',
			'Core/Evented.js',

			// 'Core/Contrib/Callbacks.js',
			// 'Core/Contrib/Deferred.js',
			// 'Core/Contrib/Store.js',
			// 'Core/Contrib/Parser.js'

			'Core/Contrib/I18n.js'
			// 'Core/Contrib/Console.js'
		],

		desc: 'Core Library.',

		extended_desc: ''
	},

	'Extended Core': {
		src: [
			'YAX.js',

			'Core/Constants.js',

			'Core/Core.js',

			'Core/Contrib/Config.js',

			'Core/Global.js',
			'Core/RegexList.js',
			'Core/Utility.js',
			'Core/Class.js',
			'Core/Evented.js',

			'Core/Contrib/Callbacks.js',
			'Core/Contrib/Deferred.js',
			'Core/Contrib/Store.js',
			'Core/Contrib/Parser.js',

			'Core/Contrib/I18n.js'
			// 'Core/Contrib/Console.js'
		],

		desc: 'Core Library.',

		extended_desc: ''
	},

	'Node': {
		src: [
			'Modules/EnvDetector.js',
			'Modules/Utility.js',

			'Modules/Node/Node.js',
			'Modules/Node/SimpleSelector.js',
			// 'Modules/Node/SizzleSelector.js',

			'Modules/Node/Data.js',
			'Modules/Node/Events.js',
			'Modules/Node/Ajax.js',
			'Modules/Node/Fx.js',
			'Modules/Node/FxMethods.js',
			'Modules/Node/Form.js',


			// These file are not part of Node but you can
			// add them to empower YAX.Node with some useful stuff :)

			// 'Modules/Node/Contrib/EventPress.js',
			// 'Modules/Node/Contrib/EventTouch.js',
			// 'Modules/Node/Contrib/EventShake.js',
			// 'Modules/Node/Contrib/EventGesture.js',
			// 'Modules/Node/Contrib/Assets.js',
			// 'Modules/Node/Contrib/Stack.js',

			'Modules/Node/Extra.js',

			// 'Modules/Node/Contrib/EventLogger.js',

			// 'Support/Compatibility.js',

			'Support/IE.js'
		],

		desc: 'Node/DOM module.',

		extended_desc: ''
	},

	'Extended Node': {
		src: [
			'Modules/EnvDetector.js',
			'Modules/Utility.js',

			'Modules/Node/Node.js',
			'Modules/Node/SimpleSelector.js',
			'Modules/Node/SizzleSelector.js',

			'Modules/Node/Data.js',
			'Modules/Node/Events.js',
			'Modules/Node/Ajax.js',
			'Modules/Node/Fx.js',
			'Modules/Node/FxMethods.js',
			'Modules/Node/Form.js',

			// These file are not part of Node but you can
			// add them to empower YAX.Node with some useful stuff :)

			// 'Modules/Node/Contrib/EventPress.js',
			// 'Modules/Node/Contrib/EventTouch.js',
			// 'Modules/Node/Contrib/EventShake.js',
			// 'Modules/Node/Contrib/EventGesture.js',
			// 'Modules/Node/Contrib/Assets.js',
			// 'Modules/Node/Contrib/Stack.js',

			'Modules/Node/Extra.js',

			// 'Modules/Node/Contrib/EventLogger.js',

			'Support/Compatibility.js',

			'Support/IE.js'
		],

		desc: 'Node/DOM module.',

		extended_desc: ''
	},

	'LocalStorage': {
		src: [
			'Plugins/LocalStorage.js'
		],

		desc: 'LocalStorage store plugin.',

		extended_desc: ''
	},

	'Cookies': {
		src: [
			'Plugins/Cookies.js'
		],

		desc: 'Cookies store plugin.',

		extended_desc: ''
	},

	'CSV Parser': {
		src: [
			'Plugins/CSV.js'
		],

		desc: 'CSV Parser plugin.',

		extended_desc: ''
	},

	'Hash Router': {
		src: [
			'Plugins/HashRouter.js'
		],

		desc: 'URL/Hash routing plugin.',

		extended_desc: ''
	},

	'AutoFix': {
		src: [
			'Plugins/AutoFix/AutoFix.js'
		],

		desc: 'AutoFix plugin.',

		extended_desc: ''
	},

	'Tooltip': {
		src: [
			'Plugins/Tooltip/Tooltip.js'
		],

		desc: 'Simple tooltip plugin.',

		extended_desc: ''
	},

	'WaitForMe': {
		src: [
			'Plugins/WaitForMe/WaitForMe.js'
		],

		desc: 'WaitForMe plugin.',

		extended_desc: ''
	}
};

if (typeof exports !== 'undefined') {
	exports.Dependencies = Dependencies;
}