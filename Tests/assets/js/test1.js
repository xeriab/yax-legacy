/*jslint white: true */
/*global Y, YAX, $, Self */

Y.DOM(document).ready(function () {
	'use strict';

	var ButtonOne = Y.DOM('#ButtonOne');
	var TestOneImage = Y.DOM('#TestOneImage');
	var Wrapper = Y.DOM('body');

	TestOneImage.attr('src', 'http://0.0.0.0:8000/Media/yax_js_logo_01-o.svg');

	TestOneImage.width(115);

	TestOneImage.css({
		marginTop: -13
	});

//	ButtonOne.button();

	// Y.Lang.delay(3000);

	ButtonOne.Tooltip({
		Content: 'Testing Tooltips!',
		Gravity: 'north',
		Theme: 'dark',
		Animation: 'fadeIn'
	});

	/*Wrapper.WaitForMe({
		Effect: 'rotation'
	});

	Wrapper.trigger('WaitForMeCloseEvent');*/


	TestOneImage.Tooltip({
		Content: 'YAX.js Test!',
		Gravity: 'west',
		Theme: 'dark',
		Animation: 'fadeIn'
	});

	TestOneImage.fadeToggle(350);

//	TestOneImage.bind('bsTransitionEnd', Y.DOM.Proxy(Com, TestOneImage)).emulateTransitionEnd(350);

//	TestOneImage.trigger('bsTransitionEnd');

//	Y.setConfig('Extension', 'Use.Console');
//	Y.setConfig('Use.Console', 'Off');
//	Y.setConfig('Use.Console', 'On');

//	Y.DOM(Y.Document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
//		Y.LOG(Y.DOM(this).data());
//	});

//	Y.DOM.getJSON('//0.0.0.0:8000/Tests/assets/test1.json', function (data) {
//		Y.LOG(data);
//	});

	Y.setConfig('Console.Timed', true);
	Y.LOG('');
	Y.LOG(Y);
//	Y.LOG(Y.DOM('[data-toggle^="button"]'));
//	Y.LOG(Y.DOM.fx);
//	Y.LOG(Y.DOM.support);
//	Y.LOG(Y.DOM.Function);
//	Y.LOG(Y.DOM.Event.special);
//	Y.LOG(ButtonOne.data());
//	Y.LOG(Y.DOM.support);
	//Y.LOG('');
	//Y.LOG(Y.Lang.Keys(jQuery));
	//Y.LOG(jQuery.fn);
	//Y.LOG('');
	//Y.LOG(Y.Lang.Keys(Y.DOM));
	//Y.LOG(Y.DOM.Function);

});