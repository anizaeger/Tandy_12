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
define([], function() {
	return class Debug {
		constructor() {
			this.registers = {};
			this.doDebug = false;
		}

		clear() {
			delete this.registers;
			this.registers = {};
			document.getElementById('registers').innerHTML = '';
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Debug::bug
		CALL:			DEBUG.bug( error, this, this.function.name, arguments );
		DESCRIPTION:		Print exception report in alert box
		RETURNS:		Nothing (Void Function)
		----------------------------------------------------------------------------- */

		bug( err, obj, func, args ) {
			var alertTxt = '*** BUG - ';
			alertTxt += obj.constructor.name + '::' + func + '( ';

			var first = true;
			for ( var arg of args ) {
				if ( first ) {
					first = false;
				} else {
					alertTxt += ', ';
				}
				alertTxt += arg
			}

			alertTxt += ' )\n';

			alertTxt += 'Error - ' + err;

			alert( alertTxt );
		}

		genTable() {
			if ( this.doDebug ) {
				var dbgHtml = 'Registers:<br />';
				dbgHtml += '<table width=100%>';
				for ( var label in this.registers ) {
					dbgHtml += '<tr><th colspan=2 align=left>' + label + '</th></tr>';
					for ( var key in this.registers[ label ]) {
						dbgHtml += '<tr><td align=right>' + key + ':</td><td width=100% id=' + key + '>' +'</td></tr>'
					}
				}
				dbgHtml += '</table>';
				document.getElementById('registers').innerHTML = dbgHtml;
			}
		}

		update( label, memory ) {
			this.registers[ label ] = {};
			for ( var key in memory ) {
				if ( typeof memory[ key ] !== 'function' && memory[ key ] != '[object Object]' ){
					this.registers[ label ][ key ] = memory[ key ];
				}
			}
		}

		print() {
			if ( this.doDebug ) {
				for ( var label in this.registers ) {
					for ( var key in this.registers[ label ]) {
						if ( hw.power ) {
							document.getElementById( key ).innerHTML = this.registers[ label ][ key ];
						}
					}
				}
			}
		}

		toggle() {
			this.doDebug = !this.doDebug;
			var dbgBtn = document.getElementById('dbgBtn');
			if ( this.doDebug ) {
				dbgBtn.innerHTML = 'Enabled';
				this.genTable();
				this.update();
				this.print();
			} else {
				dbgBtn.innerHTML = 'Disabled'
				this.clear();
			}
		}
	};
});