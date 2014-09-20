/*global Dependencies */
/*jshint strict: false */

(function (global) {

	'use strict';

	var document = global.document;

	var $ = function (id) {
		return document.getElementById(id);
	};

	var dependenciesList = $('dependencies-list');

	var commandInput = $('command');

	function updateCommand () {
		var files = {};
		var checkBoxes = dependenciesList.getElementsByTagName('input');
		var compsStr = '';
		var type = '';

		for (var i = 0, len = checkBoxes.length; i < len; i++) {
			if (checkBoxes[i].checked) {
				var srcs = Dependencies[checkBoxes[i].id].src;

				for (var j = 0, len2 = srcs.length; j < len2; j++) {
					files[srcs[j]] = true;
				}

				compsStr = '1' + compsStr;
			} else {
				compsStr = '0' + compsStr;
			}
		}

//		alert(compsStr)
		console.log(compsStr)

		// Stupid but will fix it later
		// TODO: Fix me :D
//		if (compsStr === '001') {
//			type = 'core';
//		} else if (compsStr === '011') {
//			type = 'node_dom';
//		} else if (compsStr === '101') {
//			type = 'extra_core';
//		} else if (compsStr === '100') {
//			type = 'plugins';
//		} else if (compsStr === '010') {
//			type = 'node_dom';
//		} else if (compsStr === '111') {
//			type = 'all';
//		} else {
//			type = 'library';
//		}

		switch (compsStr) {
			case '0000':
				type = 'core';
				break;

			case '0001':
				type = 'core';
				break;

			case '0010':
				type = 'dom';
				break;

			case '0100':
				type = 'bootstrap';
				break;

			case '1000':
				type = 'plugins';
				break;
		}


		// console.log(compsStr);
		// console.log(parseInt(compsStr, 2).toString(32));

		commandInput.value = 'jake \'build[' + parseInt(compsStr, 2).toString(32) + ',' + type + ']\'';
	}

	function inputSelect () {
		// console.log(this);
		this.focus();
		this.select();
	};


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

			if (depDeps) {
				for (var i = 0; i < depDeps.length; i++) {
					var check = document.getElementById(depDeps[i]);
					if (!check.checked) {
						check.checked = true;
						check.onchange();
					}
				}
			}
		} else {
			var checkBoxes = dependenciesList.getElementsByTagName('input');

			for (var i = 0; i < checkBoxes.length; i++) {
				var dep = Dependencies[checkBoxes[i].id];

				if (!dep.Dependencies) {
					continue;
				}

				for (var j = 0; j < dep.Dependencies.length; j++) {
					if (dep.Dependencies[j] === this.id) {
						if (checkBoxes[i].checked) {
							checkBoxes[i].checked = false;
							checkBoxes[i].onchange();
						}
					}
				}
			}
		}

		updateCommand();
	}

	commandInput.onclick = inputSelect;

	for (var name in Dependencies) {
		var li = document.createElement('li');

		if (Dependencies[name].heading) {
			var heading = document.createElement('li');
			heading.className = 'heading';
			heading.appendChild(document.createTextNode(Dependencies[name].heading));
			dependenciesList.appendChild(heading);
		}

		var div = document.createElement('div');

		var label = document.createElement('label');

		var check = document.createElement('input');

		check.type = 'checkbox';
		check.id = name;
		label.appendChild(check);
		check.onchange = onCheckboxChange;

//		if (name == 'Core') {
//			check.checked = true;
//			check.disabled = true;
//		}

		label.appendChild(document.createTextNode(name));
		label.htmlFor = name;

		li.appendChild(label);

		var desc = document.createElement('span');

		var xdesc = document.createElement('span');

		desc.className = 'desc';

		xdesc.className = 'desc';

		desc.appendChild(document.createTextNode(Dependencies[name].desc));

//		for (var x = 0; x < Dependencies[name].src.length; x++) {
//			xdesc.appendChild(document.createTextNode(Dependencies[name].src[x].replace('core/', '')));
//			xdesc.appendChild(document.createElement('br'));
//		}

		xdesc.appendChild(document.createTextNode(Dependencies[name].extended_desc));

		var depText = Dependencies[name].Dependencies && Dependencies[name].Dependencies.join(', ');

		if (depText) {
			var depspan = document.createElement('span');
			depspan.className = 'Dependencies';
			depspan.appendChild(document.createTextNode('Deps: ' + depText));
		}

		div.appendChild(desc);
		div.appendChild(document.createElement('br'));
		div.appendChild(xdesc);
		// div.appendChild(document.createElement('br'));

		if (depText) {
			div.appendChild(depspan);
		}

		li.appendChild(div);

		dependenciesList.appendChild(li);
	}

	updateCommand();

})(this);
