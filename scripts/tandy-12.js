/**
*
* @source: https://github.com/anizaeger/Tandy-12
*
* @licstart  The following is the entire license notice for the 
* JavaScript code in this page.
*
* Copyright (C) 2017 Anakin-Marc Zaeger
*
*
* The JavaScript code in this page is free software: you can
* redistribute it and/or modify it under the terms of the GNU
* General Public License (GNU GPL) as published by the Free Software
* Foundation, either version 3 of the License, or (at your option)
* any later version.  The code is distributed WITHOUT ANY WARRANTY;
* without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
*
* As additional permission under GNU GPL version 3 section 7, you
* may distribute non-source (e.g., minimized or compacted) forms of
* that code without the copy of the GNU GPL normally required by
* section 4, provided you include this license notice and a URL
* through which recipients can access the Corresponding Source.
*
*
* @licend The above is the entire license notice
* for the JavaScript code in this page.
*
*/
/* -----------------------------------------------------------------------------
FUNCTION:		gplAlert
DESCRIPTION:		Print GPL license text to alert box
RETURNS:		Nothing (Void Function)
----------------------------------------------------------------------------- */

function gplAlert() {
	var copyTxt = "";
	copyTxt += "Copyright (C) 2017 Anakin-Marc Zaeger\n"
	copyTxt += "\n"
	copyTxt += "\n"
	copyTxt += "The JavaScript code in this page is free software: you can\n"
	copyTxt += "redistribute it and/or modify it under the terms of the GNU\n"
	copyTxt += "General Public License (GNU GPL) as published by the Free Software\n"
	copyTxt += "Foundation, either version 3 of the License, or (at your option)\n"
	copyTxt += "any later version.  The code is distributed WITHOUT ANY WARRANTY;\n"
	copyTxt += "without even the implied warranty of MERCHANTABILITY or FITNESS\n"
	copyTxt += "FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.\n"
	copyTxt += "\n"
	copyTxt += "As additional permission under GNU GPL version 3 section 7, you\n"
	copyTxt += "may distribute non-source (e.g., minimized or compacted) forms of\n"
	copyTxt += "that code without the copy of the GNU GPL normally required by\n"
	copyTxt += "section 4, provided you include this license notice and a URL\n"
	copyTxt += "through which recipients can access the Corresponding Source.\n"
	window.alert(copyTxt)
}


requirejs.config({
	paths: {
		hw: "app/hw",
		fw: "app/fw",
		sw: "app/sw",
		ui: "app/ui"
	}
});

/* -----------------------------------------------------------------------------
FUNCTION:		IIFE
DESCRIPTION:		Generates HTML code for Tandy-12 buttons and adds them
			to the main page.
----------------------------------------------------------------------------- */

require(['hw/config', 'hw/mobo', 'fw/debug'], function(Config, Tandy12, Debug) {
	window.PROGS = [
		'Organ',
		'Song_Writer',
		'Repeat',
		'Torpedo',
		'Tag_It',
		'Roulette',
		'Baseball',
		'Repeat_Plus',
		'Treasure_Hunt',
		'Compete',
		'Fire_Away',
		'Hide_N_Seek'
	];

	window.HUES = [
		'Indigo',
		'Orange',
		'Magenta',
		'SpringGreen',
		'Blue',
		'Cyan',
		'Yellow',
		'Salmon',
		'Lime',
		'Red',
		'Violet',
		'Brown'
	];

	// Various constants for configuring user interface.
	window.NUM_BTNS = 12;
	window.NUM_ROWS = 4;
	window.NUM_COLS = 3;
	var btnTxt = [
		"Organ",
		"Song Writer",
		"Repeat",
		"Torpedo",
		"Tag-It",
		"Roulette",
		"Baseball",
		"Repeat Plus",
		"Treasure Hunt",
		"Compete",
		"Fire Away",
		"Hide'N Seek"
	];
	var boardHtml = ""

	/*
	* Generate Boot Selector
	*/
	var progs = [
		'Boot',
		'Picker'
	]

	var dbgBootprog = document.getElementById('STARTUP_PROG');

	for ( var progIdx = 0; progIdx < progs.length; progIdx++ ) {
		var opt = document.createElement("option");
		opt.text = progs[ progIdx ];
		dbgBootprog.add( opt );
	}

	/*
	* Generate Main Console
	*/
	var playfield = document.getElementById("playfield");

	for ( var r = 0; r < window.NUM_ROWS; r++ ) {
		var row = playfield.insertRow( r );
		for ( var c = 0; c < window.NUM_COLS; c++ ) {

			// Retrieve elements
			var cell = row.insertCell( c );
			var btnNum = ( c * window.NUM_ROWS ) + r;
			var btnMain = document.createElement('div');
			var btnCaption = document.createElement('div');
			var btnCaptionTxt = document.createTextNode( btnTxt [ btnNum ] );

			btnMain.className = 'btnMain';
			btnMain.id = 'btnMain' + btnNum;
			btnMain.innerHTML = btnNum + 1;

			btnCaption.className = 'btnCaption';
			btnCaption.appendChild( btnCaptionTxt );

			cell.appendChild( btnMain );
			cell.appendChild( btnCaption );
		}
	}
	window.CONFIG = new Config();
	window.DEBUG = new Debug();
	window.hw = new Tandy12();
});
