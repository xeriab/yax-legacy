/*jslint white: true */
/*global Y, YAX, $, Self */

//---



//---

Y.DOM(document).ready(function () {

	'use strict';

	var Wrapper = Y.DOM('body');
	var Button = Y.DOM('.button');
	var TestOneImage = Y.DOM('#TestOneImage');

	TestOneImage.attr('src', '../../../../Media/yax_js_logo_01.svg');

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

	/*Button.Tooltip({
		content: 'Testing Tooltips!',
		gravity: 'west',
		theme: 'dark',
		animation: 'flipIn'
	});*/

	// Wrapper.WaitForMe();

	/*var closeWaitForMe = function closeWaitForMe () {
		Wrapper.WaitForMe('close');
	};*/

	// Wrapper.oneTime(1000, 'closeWaitForMe', closeWaitForMe);

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

	// var url1 = 'http://0.0.0.0:1988/package.json';

	/*Y.DOM.JSON(url1, function (data) {
		Y.LOG(data);
	});*/

	/*Y.DOM.Ajax({
		type: 'GET',

		url: url1,

		data: null,

		dataType: 'json',

		timeout: 300,

		// cache: true,

		// global: true,

		// crossDomain: false,

		contentType: 'text/plain',

		xhrFields: {
			withCredentials: false
		},

		success: function (data) {
			Y.LOG(data);
		},

		beforeSend: function () {
			Wrapper.WaitForMe();
			// Y.LOG('AJAX BEFORE SEND: ', arguments);
		},

		complete: function () {
			Wrapper.WaitForMe('close');
			// Y.LOG('AJAX COMPLETE: ', arguments);
			// Y.LOG('AJAX COMPLETED');
		}
	});*/

	/*Y.DOM(document).ajaxStart(function () {
		Wrapper.WaitForMe();
	});

	Y.DOM(document).ajaxComplete(function () {
		Wrapper.WaitForMe('close');
	});

	Y.DOM(document).ajaxSuccess(function () {
		Wrapper.WaitForMe('close');
	});

	var log = Y.bind(console.log, console);

	Y.delay(log, 1000, 'logged later');

	Y.defer(function () {
		alert('deferred');
	});

	var throttled = Y.throttle(closeWaitForMe, 100);

	Y.DOM(window).scroll(throttled);

	Y.LOG(Y.object(['moe', 'larry', 'curly'], [30, 40, 50]));

	Y.LOG(Y.map([1, 2, 3], function(num) {
		return num * 3;
	}));*/


	//---


	//---

});

//---