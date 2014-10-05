/*jslint white: true */
/*global Y, YAX, $, Self */

Y.DOM(document).ready(function () {

	'use strict';

	var Wrapper = Y.DOM('body');
	var TestOneImage = Y.DOM('#TestOneImage');
	var ButtonOne = Y.DOM('#ButtonOne');

	TestOneImage.attr('src', '../../../../Media/yax_js_logo_01-o.svg');

	TestOneImage.width(115);

	TestOneImage.css({
		marginTop: -13
	});

	TestOneImage.tooltip({
		content: 'Testing Tooltips!',
		gravity: 'west',
		theme: 'dark',
		animation: 'flipIn'
	});

//	Wrapper.waitForMe();
//
//	var closeWaitForMe = function closeWaitForMe () {
//		Wrapper.waitForMe('close');
//	};

//	Wrapper.oneTime(3000, 'closeWaitForMe', closeWaitForMe);

//	Wrapper.stopTranAnim(false, false);

//	var localStorage = new Y.Store('localStorage');
//	var cookies = new Y.Store('cookies');
//	var csv = new Y.Parser('CSV');



//	Y.LOG('');
	Y.LOG(Y);
//	Y.LOG(localStorage);
//	Y.LOG(cookies);
//	Y.LOG(csv);
	Y.LOG(Wrapper);

});