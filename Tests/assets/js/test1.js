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

	ButtonOne.button('');

	ButtonOne.Tooltip({
		Content: 'Testing Tooltips!',
		Gravity: 'north',
		Theme: 'dark',
		Animation: 'flipIn'
	});

	Wrapper.WaitForMe({
		Effect: 'rotation'
	});

	Wrapper.trigger('WaitForMeCloseEvent');


	TestOneImage.Tooltip({
		Content: 'YAX.js Test!',
		Gravity: 'west',
		Theme: 'dark',
		Animation: 'fadeIn'
	});

	TestOneImage.fadeToggle(350);

//	TestOneImage.bind('bsTransitionEnd', Y.DOM.Proxy(Com, TestOneImage)).emulateTransitionEnd(350);

//	TestOneImage.trigger('bsTransitionEnd');


	Y.LOG('');
	Y.LOG(Y);
//	Y.LOG(Y.DOM.support);
	//Y.LOG('');
	//Y.LOG(Y.Lang.Keys(jQuery));
	//Y.LOG(jQuery.fn);
	//Y.LOG('');
	//Y.LOG(Y.Lang.Keys(Y.DOM));
	//Y.LOG(Y.DOM.Function);

});