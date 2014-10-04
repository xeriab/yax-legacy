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
			'Core/Strings.js',
			'Core/Utility.js',
			'Core/Class.js',
			'Core/Events.js',

			'Core/Callbacks.js',
			'Core/Deferred.js',
			'Core/Store.js',
			'Core/Parser.js'

			// 'Core/Locale.js'
			// 'Core/Console.js'
		],

		desc: 'YAX.js Core Library.',

		extended_desc: ''
	},

	'Fast DOM': {
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

			// 'Modules/Node/EventPress.js',
			// 'Modules/Node/EventTouch.js',
			// 'Modules/Node/EventShake.js',
			// 'Modules/Node/EventGesture.js',
			// 'Modules/Node/Assets.js',
			// 'Modules/Node/Stack.js',

			'Modules/Node/Extra.js',

			'Modules/Node/EventLogger.js',

			'Support/Compatibility.js',

			// 'Modules/Node/EventSpecial.js'
		],

		desc: 'YAX.js Node/DOM module with extra functionalities.',

		extended_desc: ''
	},

	'Full DOM': {
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

			// 'Modules/Node/EventPress.js',
			// 'Modules/Node/EventTouch.js',
			// 'Modules/Node/EventShake.js',
			// 'Modules/Node/EventGesture.js',
			// 'Modules/Node/Assets.js',
			// 'Modules/Node/Stack.js',

			'Modules/Node/Extra.js',

			'Modules/Node/EventLogger.js',

			'Support/Compatibility.js',

			// 'Modules/Node/EventSpecial.js'
		],

		desc: 'YAX.js Node/DOM module with jQuery compatibility.',

		extended_desc: ''
	},

	'Bootstrap': {
		src: [
			'Plugins/Bootstrap/ProgressBar.js',
		],

		desc: 'YAX.js Bootstrap Plugins.',

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

		desc: 'YAX.js Various Plugins.',

		extended_desc: ''
	}

	/*'Stylesheets': {
		src: [
			'Plugins/yax.js.css',
			'Plugins/Tooltip/Tooltip.css',
			'Plugins/WaitForMe/WaitForMe.css',
			'Plugins/AutoFix/AutoFix.css'
		],

		desc: 'YAX.js Plugins stylesheets.',

		extended_desc: ''
	},*/
};

if (typeof exports !== 'undefined') {
	exports.Dependencies = Dependencies;
}