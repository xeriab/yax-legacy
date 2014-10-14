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

	// Button.Tooltip({
	// 	content: 'Testing Tooltips!',
	// 	gravity: 'west',
	// 	theme: 'dark',
	// 	animation: 'flipIn'
	// });

	// Wrapper.waitForMe();

	// var closeWaitForMe = function closeWaitForMe () {
	// 	Wrapper.waitForMe('close');
	// };
	
	// Wrapper.oneTime(6000, 'closeWaitForMe', closeWaitForMe);

	Y.LOG(Wrapper);
});
