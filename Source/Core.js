/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global window, Y, YAX */

// var JSDOM = require('jsdom')dom;
// var Window = JSDOM('<html><body><div class="Test1">Test</div></body></html>').parentWindow;

require('./Require');

require('./YAX');

// Y.Window = Window;
// Y.Document = Y.Window.document;
// Y.Location = Y.Window.location;

require('./Core/Core');
require('./Core/Regex');
require('./Core/Global');
require('./Core/Strings');
require('./Core/Utility');
require('./Core/Class');
require('./Core/Events');
require('./Core/Callbacks');
require('./Core/Deferred');
require('./Core/Store');
require('./Core/Parser');

var root = module;

Y.Define('Lumlim', function(require, exports, module) {
    var Lumlim = {
        VERSION: '0.1.9',
        NAME: 'App'
    };

    module = root;

    module.exports = Lumlim;

    return Lumlim;
});

Y.Require('Lumlim');

//var lumlim_app = Y.Require('Lumlim');
//Y.LOG(Y.VERSION);
//Y.LOG(Y.CODENAME);
//Y.LOG(Y.Lang.Keys(Y));
Y.LOG(Y);
