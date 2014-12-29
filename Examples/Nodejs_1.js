/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global window, Y, YAX, require */



var JSDOM = require('jsdom').jsdom;
var Window = JSDOM('<html><body><div class="Test1">Test</div></body></html>').parentWindow;

require('./../Source/YAX');

Y.WIN = Window;
Y.DOC = Window.document;

require('./../Source/Core/Core');
require('./../Source/Core/Constants');
require('./../Source/Core/RegexList');
require('./../Source/Core/Global');
require('./../Source/Core/Utility');
require('./../Source/Core/Class');
require('./../Source/Core/Evented');

require('./../Source/Core/Contrib/Callbacks');
require('./../Source/Core/Contrib/Deferred');
require('./../Source/Core/Contrib/Config');
require('./../Source/Core/Contrib/Store');
require('./../Source/Core/Contrib/Parser');
require('./../Source/Core/Contrib/I18n');

//require('./Modules/EnvDetector');

// Y.define('Lumlim', [require, exports, module], function () {
Y.define('Lumlim', [require, exports, module], function () {
	var Lumlim = {
		VERSION: '0.1.9',
		NAME: 'App'
	};

	// module.exports = Lumlim;
	// exports = Lumlim;

	// global.Lumlim = Lumlim;

	// return Lumlim;
	Y.LOG(e.toString());
});

var Lumlim = Y.require('Lumlim');

//Y.LOG(Y.keys(Y));

Y.LOG(Lumlim);