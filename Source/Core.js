/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global window, Y, YAX */

//var JSDOM = require('jsdom').jsdom;

//var Window = JSDOM('<html><body><div class="Test1">Test</div></body></html>').parentWindow;

require('./Require.js');

require('./YAX.js');

//Y.Window = Window;
//Y.Document = Y.Window.document;
//Y.Location = Y.Window.location;

require('./Core/Core.js');
require('./Core/Regex.js');
require('./Core/Global.js');
require('./Core/Strings.js');
require('./Core/Utility.js');
require('./Core/Class.js');
require('./Core/Tools.js');
require('./Core/Events.js');
require('./Core/Callbacks.js');
require('./Core/Deferred.js');
require('./Core/Store.js');
require('./Core/Parser.js');

//Y.Define('Lumlim', function (require, exports, module) {
//	var Lumlim = {
//		VERSION: '0.1.9',
//		NAME: 'App'
//	};
//
//	module.exports = Lumlim;
//
//	return Lumlim;
//});

//var lumlim_app = Y.Require('Lumlim');
//Y.LOG(Y.VERSION);
//Y.LOG(Y.CODENAME);
//Y.LOG(Y.Lang.Keys(Y));
//Y.LOG(lumlim_app);
