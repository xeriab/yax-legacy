/*global Dependencies */

(function (global) {

	'use strict';

	var document = global.document;

	var $ = function (id) {
		return document.getElementById(id);
	};

	var dependenciesList = $('dependencies-list');

	var commandInput = $('command');
	var commandInput2 = $('command2');

	function updateCommand () {
		var files = {};
		var checkBoxes = dependenciesList.getElementsByTagName('input');
		var compsStr = '';
		var type = '';
		var i = 0;
		var len;
		var srcs;
		var j = 0;
		var len2;

		for (i, len = checkBoxes.length; i < len; i++) {
			if (checkBoxes[i].checked) {
				srcs = Dependencies[checkBoxes[i].id].src;

				for (j, len2 = srcs.length; j < len2; j++) {
					files[srcs[j]] = true;
				}

				compsStr = '1' + compsStr;
			} else {
				compsStr = '0' + compsStr;
			}
		}

//		console.log(compsStr);

		switch (compsStr) {
			case '00000000000':
				type = 'Core';
				break;

			case '00000000001':
				type = 'Core';
				break;

			case '00000000010':
				type = 'ExtendedCore';
				break;

			case '00000000100':
				type = 'Node';
				break;

			case '00000001000':
				type = 'ExtendedNode';
				break;

			case '00000010000':
				type = 'LocalStorage';
				break;

			case '00000100000':
				type = 'Cookies';
				break;

			case '00001000000':
				type = 'CSV.Parser';
				break;

			case '00010000000':
				type = 'Router';
				break;

			case '00100000000':
				type = 'AutoFix';
				break;

			case '01000000000':
				type = 'Tooltip';
				break;

			case '10000000000':
				type = 'WaitForMe';
				break;
		}

		// commandInput.value = 'jake \'build[' + parseInt(compsStr, 2).toString(32) + ',' + type + ']\'';
		commandInput.value = 'jake \'build[' + parseInt(compsStr, 2).toString(32) + ',' + type + ']\'';
		commandInput2.value = 'jake \'build[' + parseInt(compsStr, 2).toString(32) + ',' + type + ']\'';
	}

	function inputSelect () {
		this.focus();
		this.select();
	}

	$('select-all').onclick = function () {
		var checkBoxes = dependenciesList.getElementsByTagName('input'),
			i;

		for (i = 0; i < checkBoxes.length; i++) {
			checkBoxes[i].checked = true;
		}

		updateCommand();

		return false;
	};

	$('deselect-all').onclick = function () {
		var checkBoxes = dependenciesList.getElementsByTagName('input'),
			i;

		for (i = 0; i < checkBoxes.length; i++) {
			if (!checkBoxes[i].disabled) {
				checkBoxes[i].checked = false;
			}
		}

		updateCommand();

		return false;
	};

	function onCheckboxChange () {
		if (this.checked) {
			var depDeps = Dependencies[this.id].Dependencies;
			var i = 0;
			var check;

			if (depDeps) {
				for (i; i < depDeps.length; i++) {
					check = document.getElementById(depDeps[i]);
					if (!check.checked) {
						check.checked = true;
						check.onchange();
					}
				}
			}
		} else {
			var checkBoxes = dependenciesList.getElementsByTagName('input');
			var x = 0;
			var j = 0;
			var dep;

			for (x; x < checkBoxes.length; x++) {
				dep = Dependencies[checkBoxes[x].id];

				if (!dep.Dependencies) {
					continue;
				}

				for (j; j < dep.Dependencies.length; j++) {
					if (dep.Dependencies[j] === this.id) {
						if (checkBoxes[x].checked) {
							checkBoxes[x].checked = false;
							checkBoxes[x].onchange();
						}
					}
				}
			}
		}

		updateCommand();
	}

	function onLiClick (e) {
		var self = this.firstChild.firstChild;

		if (self.checked) {
			self.checked = false;
			self.onchange = onCheckboxChange;
			updateCommand();
		} else {
			self.checked = true;
			self.onchange = onCheckboxChange;
			updateCommand();
		}
	}

	commandInput.onclick = inputSelect;
	commandInput2.onclick = inputSelect;

	var name;
	var li;
	var heading;
	var div;
	var label;
	var check;
	var desc;
	var xdesc;
	var depText;
	var depspan;

	/* jshint -W089 */
	for (name in Dependencies) {
		li = document.createElement('li');

		if (Dependencies[name].heading) {
			heading = document.createElement('li');
			heading.className = 'heading';
			heading.appendChild(document.createTextNode(Dependencies[name].heading));
			dependenciesList.appendChild(heading);
		}

		div = document.createElement('div');

		label = document.createElement('label');

		check = document.createElement('input');

		check.type = 'checkbox';
		check.id = name;
		label.appendChild(check);
		check.onchange = onCheckboxChange;

		li.onclick = onLiClick;

//		if (name == 'Core') {
//			check.checked = true;
//			check.disabled = true;
//		}

		label.appendChild(document.createTextNode(name));
		label.htmlFor = name;

		li.appendChild(label);

		desc = document.createElement('div');

		xdesc = document.createElement('span');

		desc.className = 'desc';

		xdesc.className = 'Desc';

		desc.appendChild(document.createTextNode(Dependencies[name].desc));

//		for (var x = 0; x < Dependencies[name].src.length; x++) {
//			xdesc.appendChild(document.createTextNode(Dependencies[name].src[x].replace('core/', '')));
//			xdesc.appendChild(document.createElement('br'));
//		}

		xdesc.appendChild(document.createTextNode(Dependencies[name].extended_desc));

		depText = Dependencies[name].Dependencies && Dependencies[name].Dependencies.join(', ');

		if (depText) {
			depspan = document.createElement('span');
			depspan.className = 'Dependencies';
			depspan.appendChild(document.createTextNode('Deps: ' + depText));
		}

		div.appendChild(desc);
//		div.appendChild(document.createElement('br'));
//		div.appendChild(document.createElement('br'));
		div.appendChild(xdesc);
		// div.appendChild(document.createElement('br'));

		if (depText) {
			div.appendChild(depspan);
		}

		li.appendChild(div);

		dependenciesList.appendChild(li);
	}

	updateCommand();

}(this));
