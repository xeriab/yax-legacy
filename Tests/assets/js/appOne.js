/*jslint white: true */
/*global Y, YAX, $, Self */

Y.DOM(document).ready(function () {

	'use strict';

	var Wrapper = Y.DOM('body');
	var Button = Y.DOM('.button');
	var TestOneImage = Y.DOM('#TestOneImage');

	TestOneImage.attr('src', '../../../../Media/yax_js_logo_01-o.svg');

	TestOneImage.width(115);

	TestOneImage.css({
		marginTop: -13
	});

	TestOneImage.Tooltip({
		content: 'Testing Tooltips!',
		gravity: 'west',
		theme: 'dark',
		animation: 'flipIn'
	});

	var onYes = function onYes () {
		alert('YES');
	};

	Button.Tooltip({
		content: 'Testing Tooltips!',
		gravity: 'west',
		theme: 'dark',
		animation: 'flipIn'
	});

	Wrapper.WaitForMe();

	var closeWaitForMe = function closeWaitForMe () {
		Wrapper.WaitForMe('close');
	};

	Wrapper.oneTime(1000, 'closeWaitForMe', closeWaitForMe);

	// Y.LOG(Wrapper);

	// Y.config.setGlobal('Test', 'null');
	// Y.config.setGlobal('Test.One', 'One');
	// Y.config.restore('Test');
	// Y.config.restore('Test.One');
	// Y.config.set('Test', true);
	// Y.config.set('Test.One', 1);
	// Y.config.set('extension', 'Test');
	// Y.config.set('extension', 'Test.One');
	// Y.LOG(Y.config.getAll('Test', true));
	// Y.LOG(Y.config.getAll());
	// Y.LOG(Y.config);

	// Y.LOG(Y.config.getAll('yax.plugins.tooltip', false, true));

	// Y.LOG(Y.config.getAll('yax.plugins', false, false));

	// Y.LOG(Y.config.get('plugins.tooltip'));

	// var compiledTemplate = Y.template('Hello <%= text %>');
	// Y.LOG(compiledTemplate({text: 'World!'}));

	/*var url1 = 'http://0.0.0.0:1988/package.json';

	Y.DOM.JSON(url1, function (data) {
		Y.LOG(data);
	});*/


});
