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
//		marginLeft: -9,
//		maxWidth: 100
	});

//	ButtonOne.button();

	// Y.Lang.delay(3000);

	TestOneImage.Tooltip({
		Content: 'Testing Tooltips!',
		Gravity: 'west',
		Theme: 'dark',
		Animation: 'flipIn'
	});

//	Y.DOM('body').toggle();
//	Y.DOM('body').css('display', 'block');
//
//	Y.DOM('body').addClass('north');
//	Y.DOM('body').addClass('animated');
//	Y.DOM('body').addClass('flipIn');

//
//	$('body').WaitForMe({
//		Effect: 'orbit'
//	});

//	Wrapper.trigger('WaitForMeCloseEvent');

//	Y.setConfig('Is.Mohamed.Mega.Man', 'Hell, YES!!');

	Y.LOG('');
	Y.LOG(Y);
//	Y.LOG(Y.Lang);
//	Y.LOG(Y.G);
//	Y.LOG(Y.Util);
//	Y.LOG(Y.DOM.Function);
//	Y.LOG(Y.Lang.Keys(Y));
});