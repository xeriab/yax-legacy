/*jslint white: true */
/*global Y, YAX, $, Self */

Y.DOM(document).ready(function () {
	'use strict';

	var ButtonOne = Y.DOM('#ButtonOne');
	var TestOneImage = Y.DOM('#TestOneImage');
	// var Wrapper = Y.DOM('body');

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
		Animation: 'flipIn'
	}).button();

//	Y.DOM('body').toggle();
//	Y.DOM('body').css('display', 'block');
//
//	Y.DOM('body').addClass('north');
//	Y.DOM('body').addClass('animated');
//	Y.DOM('body').addClass('flipIn');


//	Wrapper.WaitForMe({
//		Effect: 'rotation'
//	});

//	Wrapper.trigger('WaitForMeCloseEvent');

	Y.LOG('');
	Y.LOG(Y);
});