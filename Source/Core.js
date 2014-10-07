/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global window, Y, YAX */

// var JSDOM = require('jsdom')dom;
// var Window = JSDOM('<html><body><div class="Test1">Test</div></body></html>').parentWindow;

require('./Require');

require('./YAX');

// Y.win = Window;
// Y.doc = Y.win.document;
// Y.loc = Y.win.location;

require('./Core/Core');
require('./Core/Constants');
require('./Core/Regex');
require('./Core/Global');
require('./Core/Utility');
require('./Core/Class');
require('./Core/Evented');

require('./Core/Contrib/Callbacks');
require('./Core/Contrib/Deferred');
require('./Core/Contrib/Store');
require('./Core/Contrib/Parser');
require('./Core/Contrib/I18n');

require('./Modules/EnvDetector');

// var root = module;

//Y.define('Lumlim', function(require, exports, module) {
//    var Lumlim = {
//        VERSION: '0.1.9',
//        NAME: 'App'
//    };
//
//    // module = root;
//
//    module.exports = Lumlim;
//
//    return Lumlim;
//});

// Y.require('Lumlim');

//var lumlim_app = Y.require('Lumlim');

//Y.log(Y._INFO.VERSION);
//Y.log(Y._INFO.CODENAME);
//Y.log(Y.keys(Y));


//Y.log(Y);

Y.log(Y.Env);

