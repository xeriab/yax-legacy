/*global YAX, $, window, console */

var Temp1, Temp2, Temp3, Temp4;

// console.log(YAX);

YAX.Node(function () {

	'use strict';

	var Count,
		Body = YAX.Node('body'),
		Wrapper = YAX.Node('.container'),
		ButtonOne = YAX.Node('#ButtonOne'),
		TestOneImage = YAX.Node('#TestOneImage'),
		CountTwo = 0;

//	YAX.Node.Ajax({
//		type: 'GET',
//		url: 'http://localhost/dev/minerva/api/search.action?',
//		data: {
//			v: 0.10,
//			format: 'json',
//			country: 'ye',
//			locale: 'en'
//		},
//		dataType: 'json',
//		timeout: 300,
//		crossDomain: true,
//		cache: true,
//		context: YAX.Node('#ajaxTestOne'),
//		success: function (data) {
//			var d = YAX.Lang.variableDump(data);
//
//			this.css({
//				'font-family': 'Monospace',
//				'font-size': 14,
//				'color': 'orange',
//				textAlign: 'left'
//			});
//
//			this.text(d);
//		}
//	});

	// console.log(ButtonOne);

	ButtonOne.click(function (e) {
		// YAX.Log(e);

		Wrapper.waitForMe({
			Effect : 'rotateplane',
			Text : 'Please Wait...',
			// Background : 'rgba(255, 255, 255, .7)',
			Color : 'rgba(40, 30, 40, .8)',
			Width : '200',
			Height : '40'
		});

		Count = 1;

		if (Count === 1) {
			YAX.Node('.yax_waitforme').on('click', function (e) {
				YAX.Log(e);

				Wrapper.waitForMe('hide');

				Count = 0;
			});
		}
	});

	

	Temp1 = new YAX.StoreClass('LocalStorage');
	Temp1.Set('YAX.SVG.LOGO', YAX.Logo.SVG);

	delete YAX.Logo.SVG;

	TestOneImage.attr('src', Temp1.Get('YAX.SVG.LOGO'));
	TestOneImage.width(370);
	TestOneImage.css({
		// marginTop: -13
	});

	Body.waitForMe({
		Effect : 'bounce',
		Text : 'LOADING APPLICATION',
		Background : 'rgba(57, 63, 63, 1)',
		Color : 'rgba(207, 213, 213, .8)',
		Width : 400,
		Height : 340
	});

	YAX.Node('.yax_waitforme *').css({
		'font-family': 'Monospace',
		fontSize: 14,
		color: 'bbe1e1'
	});

	Count = 1;

	if (Count === 1) {
		YAX.Node('.yax_waitforme').on('click', function (e) {
			Wrapper.waitForMe('hide');
			Count = 0;
		});
	}

	var _Count = 3.5;
	var _Counter = setInterval(_Timer, 1000);
	
	function _Timer()
	{
		_Count = _Count - 1;
		
		if (_Count <= 0) {
			clearInterval(_Counter);
			// counter ended, do something here

			Body.waitForMe('hide');
			Wrapper.fadeToggle(500);
			YAX.Node('.footer').fadeToggle(550);

			return;
		}
	}

	TestOneImage.draggable = false;


	// YAX.Node('.yax_waitforme').trigger('click');

	// Wrapper.waitForMe('hide');










});
