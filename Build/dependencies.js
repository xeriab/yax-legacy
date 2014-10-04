/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX, exports */

var Dependencies = {
	'Core': {
		src: [
			'Require.js',
			'YAX.js',

			'Core/Core.js',
			'Core/Regex.js',
			'Core/Global.js',
			'Core/Utility.js',
			'Core/Class.js',
			'Core/Evented.js'

			// 'Core/Contrib/Callbacks.js',
			// 'Core/Contrib/Deferred.js',
			// 'Core/Contrib/Store.js',
			// 'Core/Contrib/Parser.js'

			// 'Core/Contrib/Locale.js'
			// 'Core/Contrib/Console.js'
		],

		desc: 'Core Library.',

		extended_desc: ''
	},

	'Extended Core': {
		src: [
			'Require.js',
			'YAX.js',

			'Core/Core.js',
			'Core/Regex.js',
			'Core/Global.js',
			'Core/Utility.js',
			'Core/Class.js',
			'Core/Evented.js',

			'Core/Contrib/Callbacks.js',
			'Core/Contrib/Deferred.js',
			'Core/Contrib/Store.js',
			'Core/Contrib/Parser.js'

			// 'Core/Contrib/Locale.js'
			// 'Core/Contrib/Console.js'
		],

		desc: 'Core Library.',

		extended_desc: ''
	},

	'Node': {
		src: [
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

			'Modules/UserAgentDetector.js',


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

			'Support/Compatibility.js'

			// 'Modules/Node/Contrib/EventSpecial.js'
		],

		desc: 'Node/DOM module.',

		extended_desc: ''
	},

	'Extended Node': {
		src: [
			'Modules/Utility.js',

			'Modules/Node/Node.js',
			// 'Modules/Node/SimpleSelector.js',
			'Modules/Node/SizzleSelector.js',
			'Modules/Node/Data.js',
			'Modules/Node/TestEvents.js',
			'Modules/Node/Ajax.js',
			'Modules/Node/Fx.js',
			'Modules/Node/FxMethods.js',
			'Modules/Node/Form.js',

			'Modules/UserAgentDetector.js',

			// These file are not part of Node but you can
			// add them to empower YAX.Node with some useful stuff :)

			// 'Modules/Node/Contrib/EventPress.js',
			// 'Modules/Node/Contrib/EventTouch.js',
			// 'Modules/Node/Contrib/EventShake.js',
			// 'Modules/Node/Contrib/EventGesture.js',
			// 'Modules/Node/Contrib/Assets.js',
			// 'Modules/Node/Contrib/Stack.js',

			'Modules/Node/Extra.js',

			'Modules/Node/Contrib/EventLogger.js',

			'Support/Compatibility.js'

			// 'Modules/Node/Contrib/EventSpecial.js'
		],

		desc: 'Node/DOM module.',

		extended_desc: ''
	},

	'LocalStorage': {
		src: [
			'Plugins/LocalStorage.js'
		],

		desc: 'LocalStorage Plugin.',

		extended_desc: ''
	},

	'Cookies': {
		src: [
			'Plugins/Cookies.js'
		],

		desc: 'Cookies Plugin.',

		extended_desc: ''
	},

	'CSV Parser': {
		src: [
			'Plugins/CSV.js'
		],

		desc: 'CSV Parser Plugin.',

		extended_desc: ''
	},

	'Router': {
		src: [
			'Plugins/Router.js'
		],

		desc: 'Router Plugin.',

		extended_desc: ''
	},

	'AutoFix': {
		src: [
			'Plugins/AutoFix/AutoFix.js'
		],

		desc: 'AutoFix Plugin.',

		extended_desc: ''
	},

	'Tooltip': {
		src: [
			'Plugins/Tooltip/Tooltip.js'
		],

		desc: 'Tooltip Plugin.',

		extended_desc: ''
	},

	'WaitForMe': {
		src: [
			'Plugins/WaitForMe/WaitForMe.js'
		],

		desc: 'WaitForMe Plugin.',

		extended_desc: ''
	},


	/*'Bootstrap': {
		src: [
			'Plugins/Bootstrap/ProgressBar.js',
		],

		desc: 'Bootstrap Plugins.',

		extended_desc: ''
	},

	'Extra Plugins': {
		src: [
			'Plugins/LocalStorage.js',
			'Plugins/Cookies.js',
			'Plugins/CSV.js',
			'Plugins/Tooltip/Tooltip.js',
			'Plugins/WaitForMe/WaitForMe.js',
			'Plugins/AutoFix/AutoFix.js',
			'Plugins/Router.js'
		],

		desc: 'Various Plugins.',

		extended_desc: ''
	}*/

	/*'Stylesheets': {
		src: [
			'Plugins/yax.js.css',
			'Plugins/Tooltip/Tooltip.css',
			'Plugins/WaitForMe/WaitForMe.css',
			'Plugins/AutoFix/AutoFix.css'
		],

		desc: 'Plugins stylesheets.',

		extended_desc: ''
	},*/
};

if (typeof exports !== 'undefined') {
	exports.Dependencies = Dependencies;
}