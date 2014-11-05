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
			'Core/Extra.js',
			'Core/Global.js',
			'Core/Contrib/Config.js',

			'Core/RegexList.js',
			'Core/Utility.js',
			'Core/Class.js',
			'Core/Evented.js',

			// 'Core/Contrib/Callbacks.js',
			// 'Core/Contrib/Deferred.js',
			// 'Core/Contrib/Store.js',
			// 'Core/Contrib/Parser.js'

			'Core/Contrib/I18n.js',

			// 'Core/Contrib/Console.js',

			'Modules/UserAgent.js'
		],

		desc: 'Core Library.',

		extended_desc: ''
	},

	'Core Extra': {
		src: [
			'YAX.js',

			'Core/Constants.js',
			'Core/Core.js',
			'Core/Extra.js',
			'Core/Global.js',
			'Core/Contrib/Config.js',

			'Core/RegexList.js',
			'Core/Utility.js',
			'Core/Class.js',
			'Core/Evented.js',

			'Core/Contrib/Callbacks.js',
			'Core/Contrib/Deferred.js',
			'Core/Contrib/Store.js',
			'Core/Contrib/Parser.js',

			'Core/Contrib/I18n.js',

			// 'Core/Contrib/Console.js'

			'Modules/UserAgent.js'
		],

		desc: 'Extended Core Library.',

		extended_desc: ''
	},

	'Node': {
		src: [
			'Modules/EnvDetector.js',

			'Modules/Utility.js',

			'Modules/Node/NeoNode.js',

			'Modules/Node/SimpleSelector.js',

			'Modules/Node/NeoData.js',

			'Modules/Node/NeoEvents.js',

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
			'Modules/Node/Contrib/I18n.js',

			'Modules/Node/Extra.js',

			'Modules/Node/Contrib/EventLogger.js',

			'Support/Compatibility.js',

			'Support/IE.js'
		],

		desc: 'Node/DOM module.',

		extended_desc: ''
	},

	'Node Extra': {
		src: [
			'Modules/EnvDetector.js',

			'Modules/Utility.js',

			'Modules/Node/NeoNode.js',

			'Modules/Node/SimpleSelector.js',

			'Modules/Node/Data.js',

			'Modules/Node/ExtendedEvents.js',

			'Modules/Node/SizzleSupport.js',

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
			'Modules/Node/Contrib/I18n.js',

			'Modules/Node/Extra.js',

			'Modules/Node/Contrib/EventLogger.js',

			'Support/Compatibility.js',

			'Support/IE.js'
		],

		desc: 'Extended Node/DOM module.',

		extended_desc: ''
	},

	'Simple DOM': {
		src: [
			'Modules/EnvDetector.js',

			'Modules/Utility.js',

			'Modules/Node/SimpleDOM.js',

			'Modules/Node/SimpleEvents.js'
		],

		desc: 'Simple Node/DOM module.',

		extended_desc: ''
	},

	'LocalStorage': {
		src: [
			'Extensions/LocalStorage.js'
		],

		desc: 'LocalStorage store extension.',

		extended_desc: ''
	},

	'Cookies': {
		src: [
			'Extensions/Cookies.js'
		],

		desc: 'Cookies store extension.',

		extended_desc: ''
	},

	'CSV Parser': {
		src: [
			'Extensions/CSV.js'
		],

		desc: 'CSV Parser extension.',

		extended_desc: ''
	},

	'JSON Parser': {
		src: [
			'Extensions/NeoJSON.js'
		],

		desc: 'JSON Parser extension.',

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