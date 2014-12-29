/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global window, Y, YAX, require */


require('./../Distribution/yax.CoreExtra.min');
require('./../Source/Core/Contrib/Console');

// var OS = require('os');
// var fileSystem = require('fs');
// var jsDOM = require('jsdom');



// Y.LOG(Y.toString());
// Y.LOG(OS.hostname());
// Y.LOG(OS.totalmem());
// Y.LOG(Y.size(OS.cpus()));
// Y.LOG(OS.type());
// Y.LOG(fileSystem);
// Y.LOG(Y.noConflict());

Y.config.set('Test.One.What.Test', 1);
Y.config.set('Test.One.What.Rest', 'Hey');

Y.config.set('Console.Message.Colored', false);

// Y.LOG(Y.config.getAll('Test.One', false, true));
// Y.LOG(Y.config.getAll('Test.One', false, true));
Y.INFO('Test');