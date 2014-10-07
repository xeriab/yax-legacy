/*jslint white: true */
/*global Y, YAX, $, Self */

Y.DOM(document).ready(function () {

	'use strict';

	var Wrapper = Y.DOM('body');
	var TestOneImage = Y.DOM('#TestOneImage');
//	var ButtonOne = Y.DOM('#ButtonOne');

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

	Wrapper.waitForMe();

	var closeWaitForMe = function closeWaitForMe () {
		Wrapper.waitForMe('close');
	};

	Wrapper.oneTime(4000, 'closeWaitForMe', closeWaitForMe);

//	Wrapper.stopTranAnim(false, false);

//	var localStorage = new Y.Store('localStorage');
//	var cookies = new Y.Store('cookies');
//	var csv = new Y.Parser('CSV');
//	var csv_data = '"year","age","name","sex","country"\t\n1988,26,Xeriab Nabil,Male,Yemen\t\n1990,24,Radhda Jamal,Female,Yemen\t\n';

//	localStorage.set('YAX.CONFIG', Y.Store.prototype.serialisers.JSON.encode(Y._CONFIG_STORAGE));

//	Y.log('');
//	Y.log(Y);

	Y.log(Y.Env);
//	Y.log(Y.Env.feature);

//	Y.log(localStorage);
//	Y.log(localStorage.available());
//	Y.log(cookies);
//	Y.log(cookies.available());
//	Y.log(csv);
//	Y.log(csv.dataSource(csv_data).parse());


	//	Y.log(Y.size());

//	Y.log(Y.UserAgent);

});