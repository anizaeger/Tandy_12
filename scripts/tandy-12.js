/**
 *
 * @source: https://github.com/anizaeger/Tandy-12
 *
 * @licstart  The following is the entire license notice for the 
 * JavaScript code in this page.
 *
 * Copyright (C) 2016 Anakin-Marc Zaeger
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

function gplAlert() {
	var copyTxt = "";
	copyTxt += "Copyright (C) 2016 Anakin-Marc Zaeger\n"
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

var btnNames = ["Organ","Song Writer","Repeat","Torpedo","Tag-It","Roulette","Baseball","Repeat Plus","Treasure Hunt","Compete","Fire Away","Hide 'n Seek"]

var btnColors = ["Indigo","Orange","Magenta","SpringGreen","Blue","Cyan","Yellow","Salmon","Lime","Red","Violet","Brown"]

function printBoard() {
	var btnNum = 0;
	var boardHtml = ""
	for ( c = 0; c < 3; c++ ) {
		boardHtml += '<td align=center>';
		for ( r = 0; r < 4; r++) {
			boardHtml += '<div class="btnMain" id="mainBtn'+btnNum+'" style="background-color:'+btnColors[btnNum]+'">' + (btnNum + 1) + "</div>";
			boardHtml += btnNames[btnNum];
			btnNum++;
		}
		boardHtml += "</td>"
	}
	document.getElementById("playfield").innerHTML=boardHtml;
}

function init() {
	printBoard();
}
