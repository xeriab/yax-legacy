/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global window, Y, YAX, require */



var JSDOM = require('jsdom').jsdom;
var Window = JSDOM('<html><body><div class="Test1">Test</div></body></html>').parentWindow;

require('./YAX');

Y.WIN = Window;
Y.DOC = Window.document;

require('./Core/Core');
require('./Core/Constants');
require('./Core/RegexList');
require('./Core/Global');
require('./Core/Utility');
require('./Core/Class');
require('./Core/Evented');

require('./Core/Contrib/Callbacks');
require('./Core/Contrib/Deferred');
require('./Core/Contrib/Store');
require('./Core/Contrib/Parser');
require('./Core/Contrib/I18n');

//require('./Modules/EnvDetector');

//Y.define('Lumlim', function (require, exports, module) {
//	var Lumlim = {
//		VERSION: '0.1.9',
//		NAME: 'App'
//	};
//
//	module.exports = Lumlim;
//
//	global.Lumlim = Lumlim;
//
//	return Lumlim;
//});
//
//Y.require('Lumlim');

//Y.LOG(Y.keys(Y));