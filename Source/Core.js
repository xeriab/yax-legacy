/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global window, Y, YAX */

var JSDOM = require('jsdom').jsdom;

var Window = JSDOM('<html><body><div class="Test1">Test</div></body></html>').parentWindow;

require('./Require.js');

require('./YAX.js');

Y.Window = Window;
Y.Document = Y.Window.document;
Y.Location = Y.Window.location;

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
require('./Core/Console.js');
require('./Core/Store.js');
require('./Core/Parser.js');
require('./Core/I18N.js');

// require('./plugins/localstorage.js');
// require('./plugins/cookies.js');
// require('./plugins/csv.js');

// require('./modules/node/node.js');

// require('./')


// require('./plugins/yax.autofix.js');
//
// var Store = new Y.Store('Cookies');
//

//Y.Define('YAXJS', function (require, exports, module) {
//var YAXJS = {
//VERSION: '0.1.9',
//};
//module.exports = YAXJS;
//});
//
//Y.Log(Y.Require('YAXJS'));


// Y.Log(Y.DOM('*'))


Y.LOG(Y.VERSION);
Y.LOG(Y.CODENAME);
