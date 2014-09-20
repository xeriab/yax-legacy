
/**
 * YAX Core | UserAgent
 *
 * Cross browser detector implementation using YAX's API [CORE]
 *
 * @version     0.15
 * @depends:    Core, Global, Utility, Class, Tools
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function () {

	'use strict';

	var retina, matches, msPointer, pointer,
		_ie = Y.Window.hasOwnProperty('ActiveX'),
		ie3d = _ie && (Y.Document.documentElement.style.hasOwnProperty('transition')),
		webkit3d = (Y.Window.hasOwnProperty('WebKitCSSMatrix')) && (new Y.Window.WebKitCSSMatrix().hasOwnProperty('m11')),
		gecko3d = Y.Document.documentElement.style.hasOwnProperty('MozPerspective'),
		opera3d = Y.Document.documentElement.style.hasOwnProperty('OTransition');

	retina = (Y.ObjectHasProperty(Y.Window, 'devicePixelRatio') && Y.CallProperty(Y.Window, 'devicePixelRatio') > 1);

	if (!retina && Y.ObjectHasProperty(Y.Window, 'matchMedia')) {
		matches = Y.CallProperty(Y.Window, 'matchMedia');
		retina = (Y.Lang.isSet(matches) && Y.CallProperty(matches, 'matches'));
	}

	msPointer = (Y.ObjectHasProperty(navigator, 'msPointerEnabled') &&
		Y.ObjectHasProperty(navigator, 'msMaxTouchPoints') &&
		!Y.ObjectHasProperty(Y.Window, 'PointerEvent'));

	pointer = (Y.ObjectHasProperty(Y.Window, 'PointerEvent') &&
		Y.ObjectHasProperty(navigator, 'pointerEnabled') &&
		!Y.ObjectHasProperty(navigator, 'maxTouchPoints')) || msPointer;

	//---

	Y.UA = Y.Class.Extend({
		CLASS_NAME: 'UA',

		initialise: function () {
			this.UserAgent = Y.Window.navigator.userAgent;
			this.OS = {};
			this.Browser = {};
			this.Features = {};
			this.Type = {};

			this.detect();
		},

		/**
		 * Detect Suite
		 *
		 * Tests the client against a variety of modern browser features.
		 * These tests are primarily from Mark Pilgrim's "Dive Into HTML5" section
		 * "The All-In-One Almost-Alphabetical No-Bullshit Guide to Detecting Everything."
		 *
		 * You can find "Dive Into HTML5" here: http://www.diveintohtml5.net/
		 *
		 * "Dive Into HTML5" is protected by (CC BY 3.0):
		 * http://creativecommons.org/licenses/by/3.0/
		 */
		testInput: function (type) {
			var temp = Y.Document.createElement('input');

			temp.setAttribute('type', type);

			return temp.type !== 'text';
		},

		detect: function () {
			var testInput = this.testInput,
				OS = this.OS,
				Browser = this.Browser,
				ua = this.UserAgent,
				features = this.Features,
				type = this.Type,
				webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
				gecko = ua.match(/Gecko[\/]{0,1}([\d.]+)/),
				android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
				ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
				ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
				iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
				webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
				touchpad = webos && ua.match(/TouchPad/),
				kindle = ua.match(/Kindle\/([\d.]+)/),
				silk = ua.match(/Silk\/([\d._]+)/),
				blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
				bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
				rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
				playbook = ua.match(/PlayBook/),
				chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
				firefox = ua.match(/Firefox\/([\d.]+)/),
				ie = ua.match(/MSIE ([\d.]+)/),
				safari = webkit && ua.match(/Mobile\//) && !chrome,
				webview = ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/) && !chrome,
				ie = ua.match(/MSIE\s([\d.]+)/),
				osNames = [
					'Linux',
					'Windows',
					'MacOS',
					'UNIX',
					'Android',
					'iOS',
					'Unknown'
				];



			if (Y.Lang.isSet(webkit)) {
				Browser.Webkit = true;
				Browser.Version = webkit[1];
			}

			if (Y.Lang.isSet(gecko)) {
				Browser.Gecko = true;
				Browser.Version = gecko[1];
			}

			if (android) {
				OS.Android = true;
				OS.Version = android[2];
			}

			if (iphone && !ipod) {
				OS.iOS = OS.iPhone = true;
				OS.Version = iphone[2].replace(/_/g, '.');
			}

			if (ipad) {
				OS.iOS = OS.iPad = true;
				OS.Version = ipad[2].replace(/_/g, '.');
			}

			if (ipod) {
				OS.iOS = OS.iPod = true;
				OS.Version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
			}

			if (webos) {
				OS.webOS = true;
				OS.Version = webos[2];
			}

			if (touchpad) {
				OS.Touchpad = true;
			}

			if (blackberry) {
				OS.Blackberry = true;
				OS.Version = blackberry[2];
			}

			if (bb10) {
				OS.BB10 = true;
				OS.Version = bb10[2];
			}

			if (rimtabletos) {
				OS.Rimtabletos = true;
				OS.Version = rimtabletos[2];
			}

			if (playbook) {
				Browser.Playbook = true;
			}

			if (kindle) {
				OS.Kindle = true;
				OS.Version = kindle[1];
			}

			if (silk) {
				Browser.Silk = true;
				Browser.Version = silk[1];
			}

			if (!silk && OS.Android && ua.match(/Kindle Fire/)) {
				Browser.Silk = true;
			}

			if (chrome) {
				Browser.Chrome = true;
				Browser.Name = 'Chrome';
				Browser.Version = chrome[1];
			}

			if (firefox) {
				Browser.Firefox = true;
				Browser.Name = 'Firefox';
				Browser.Version = firefox[1];
			}

			if (ie) {
				Browser.IE = true;
				Browser.Name = 'Microsoft Internet Explorer';
				Browser.Version = ie[1];
			}

			if (safari && (ua.match(/Safari/) || Y.Lang.isSet(OS.iOS))) {
				Browser.Safari = true;
				Browser.Name = 'Apple Safari';
			}

			if (webview) {
				Browser.WebView = true;
			}

			// OS.Tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) || (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)));
			// OS.Phone = !!(!OS.Tablet && !OS.iPod && (android || iphone || webos || blackberry || bb10 || (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) || (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))));
			// OS.Desktop = !!Browser.IE || Browser.Firefox || Browser.Safari || Browser.Chrome;
			// OS.Platform = navigator.platform;

			Browser.Language = navigator.language;
			Browser.Vendor = Y.CallProperty(navigator, 'vendor');

			Y.Extend(OS, {
				Name: navigator.appVersion.indexOf('Linux') !== -1 ? osNames[0] : osNames[6] ||
					navigator.appVersion.indexOf('Mac') !== -1 ? osNames[2] : osNames[6] ||
					navigator.appVersion.indexOf('X11') !== -1 ? osNames[3] : osNames[6] ||
					navigator.appVersion.indexOf('Win') !== -1 ? osNames[1] : osNames[6]
				// Linux: Y.Lang.isSet(navigator.platform.match(/Linux/)),
				// Windows: Y.Lang.isSet(navigator.platform.match(/Windows/)),
				// Android: Y.Lang.isSet(navigator.platform.match(/Android/)),
				// iOS: Y.Lang.isSet(navigator.platform.match(/iOS/)),
				// Architcture: navigator.platform.split(' ')[1]
			});

			//

			/** @namespace Y.Window.YAX_DISABLE_3D */
			Y.Extend(features, {
				// Elements
				Audio: Y.Lang.isSet(document.createElement('audio').canPlayType),
				Canvas: Y.Lang.isSet(document.createElement('canvas').getContext),
				Command: document.createElement('command').hasOwnProperty('type'),
				Time: document.createElement('time').hasOwnProperty('valueAsDate'),
				Video: Y.Lang.isSet(document.createElement('video').canPlayType),

				// Features and Attributes
				Offline: navigator.hasOwnProperty('onLine') && navigator.onLine,
				ApplicationCache: Y.Lang.isSet(Y.CallProperty(window, 'applicationCache')),
				ContentEditable: document.createElement('span').hasOwnProperty('isContentEditable'),
				DragDrop: document.createElement('span').hasOwnProperty('draggable'),
				Geolocation: Y.Lang.isSet(navigator.geolocation),
				History: (Y.Lang.isSet(window.history) && Y.Lang.isSet(window.history.pushState)),
				WebSockets: Y.Lang.isSet(window.WebSocket),
				WebWorkers: Y.Lang.isSet(window.Worker),
				Retina: retina,
				Pointer: Y.Lang.isUndefined(pointer) ? false : pointer,
				MicrosoftPointer: Y.Lang.isUndefined(msPointer) ? false : msPointer,

				// Forms
				Autofocus: document.createElement('input').hasOwnProperty('autofocus'),
				InputPlaceholder: document.createElement('input').hasOwnProperty('placeholder'),
				TextareaPlaceholder: document.createElement('textarea').hasOwnProperty('placeholder'),
				InputTypeEmail: testInput('email'),
				InputTypeNumber: testInput('number'),
				InputTypeSearch: testInput('search'),
				InputTypeTel: testInput('tel'),
				InputTypeUrl: testInput('url'),

				// Storage
				IndexDB: Y.Lang.isSet(Y.CallProperty(window, 'indexedDB')),
				LocalStorage: (window.window.hasOwnProperty('localStorage') && window.localStorage !== null),
				WebSQL: Y.Lang.isSet(window.openDatabase),

				// Touch and orientation capabilities.
				Orientation: window.window.hasOwnProperty('orientation'),
				Touch: document.hasOwnProperty('ontouchend'),
				ScrollTop: ((window.pageXOffset) || (document.documentElement.hasOwnProperty('scrollTop'))) && (!OS.webOS),

				// Propietary features
				// Standalone: ((window.navigator.hasOwnProperty('standalone')) && (window.navigator.standalone))
				Standalone: Y.Lang.isSet(Y.CallProperty(navigator, 'standalone')),

				Any3D: !Y.Window.YAX_DISABLE_3D && (ie3d || webkit3d || gecko3d || opera3d),

				Cookies: navigator.cookieEnabled

			});

			// Return (boolean) of likely client device classifications.
			Y.Extend(type, {
				Mobile: (screen.width < 768),
				Tablet: (screen.width >= 768 && features.Orientation),
				Desktop: (screen.width >= 800 && !features.Orientation)
			});
		}
	});

	//---

	Y.UserAgent = new Y.UA();

	delete Y.UA;

	//---

}());

//---
