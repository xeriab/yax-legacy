/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX, exports */

var Dependencies = {
	Core: {
		src: [
			'Require.js',
			'YAX.js',
			'Core/Core.js',
			'Core/Regex.js',
			'Core/Global.js',
			'Core/Strings.js',
			'Core/Utility.js',
			'Core/Class.js',
			'Core/Tools.js',
			'Core/Events.js',

			'Core/Callbacks.js',
			'Core/Deferred.js',
			'Core/Store.js',
			'Core/Parser.js'

//			'Core/Locale.js'

 //			'Core/Console.js'
		],

		desc: 'YAX.JS Core Library.',

		extended_desc: ''
	},

	'Node': {
		src: [
			'Modules/Utility.js',

			'Modules/Node/Node.js',
			'Modules/Node/Selector.js',
			'Modules/Node/Data.js',
			'Modules/Node/Events.js',
			'Modules/Node/Ajax.js',
			'Modules/Node/Fx.js',
			'Modules/Node/FxMethods.js',
			'Modules/Node/Form.js',

			'Modules/UserAgentDetector.js',

			'Modules/Node/Extra.js',

			'Modules/Node/EventLogger.js',

			'Support/Compatibility.js',

			'Modules/Node/EventSpecial.js'
		],

		desc: 'YAX.JS Node/DOM Module.',

		extended_desc: ''
	},

	'Node Full': {
		src: [
			'Modules/Utility.js',

			'Modules/Node/Node.js',
			'Modules/Node/Selector.js',
			'Modules/Node/Data.js',
			'Modules/Node/Events.js',
			'Modules/Node/Ajax.js',
			'Modules/Node/Fx.js',
			'Modules/Node/FxMethods.js',
			'Modules/Node/Form.js',

			'Modules/UserAgentDetector.js',

			// These file are not part of Node but you can
			// add them to empower YAX.Node with some useful stuff :)

			'Modules/Node/EventPress.js',
			'Modules/Node/EventTouch.js',
			'Modules/Node/EventShake.js',
			'Modules/Node/EventGesture.js',
			'Modules/Node/Assets.js',
			'Modules/Node/Stack.js',

			'Modules/Node/Extra.js',

			'Modules/Node/EventLogger.js',

			'Support/Compatibility.js',

			'Modules/Node/EventSpecial.js'
		],

		desc: 'YAX.JS Node/DOM module with extra functionalities.',

		extended_desc: ''
	},

	Bootstrap: {
		src: [
			'Plugins/Bootstrap/Transition.js',
			'Plugins/Bootstrap/Affix.js',
			'Plugins/Bootstrap/Button.js',
			'Plugins/Bootstrap/ProgressBar.js',
			'Plugins/Bootstrap/Dropdown.js',
			'Plugins/Bootstrap/Collapse.js'

		],

		desc: 'YAX.JS Bootstrap Plugins.',

		extended_desc: ''
	},

	Plugins: {
		src: [
			'Plugins/LocalStorage.js',
			'Plugins/Cookies.js',
			'Plugins/CSV.js',
			'Plugins/Tooltip/Tooltip.js',
			'Plugins/WaitForMe/WaitForMe.js',
			'Plugins/AutoFix/AutoFix.js',
			'Plugins/Router.js'
		],

		desc: 'YAX.JS Various Plugins.',

		extended_desc: ''
	}

	/*'Stylesheets': {
		src: [
			'Plugins/yax.js.css',
			'Plugins/Tooltip/Tooltip.css',
			'Plugins/WaitForMe/WaitForMe.css',
			'Plugins/AutoFix/AutoFix.css'
		],

		desc: 'YAX.JS Plugins stylesheets.',

		extended_desc: ''
	},*/
};

if (typeof exports !== 'undefined') {
	exports.Dependencies = Dependencies;
}