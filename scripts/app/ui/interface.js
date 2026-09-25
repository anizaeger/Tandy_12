/**
*
* @source: https://github.com/anizaeger/Tandy-12
*
* @licstart  The following is the entire license notice for the 
* JavaScript code in this page.
*
* Copyright (C) 2026 Anakin-Marc Zaeger
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
CLASS:			Interface
DESCRIPTION:		Interface helpers.
----------------------------------------------------------------------------- */
define([], function() {
	return class Interface {
		constructor() {
			this.ui = true;
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Interface::shadeBlend
		DESCRIPTION:		Calculate new value for color after applying shading.
		ATTRIBUTION:		https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
		----------------------------------------------------------------------------- */
		shadeBlend(p, from, to) {
			if (
				typeof( p ) !="number"
				|| p < -1
				|| p > 1
				|| typeof( from ) != "string"
				|| (
					from[0] != 'r'
					&& from[0] != '#'
				)
				|| (
					typeof( to ) != "string"
					&& typeof( to ) != "undefined"
				)
			) {	//ErrorCheck
				return null;
			}

			if ( !this.sbcRip )this.sbcRip = ( d ) => {
				let l = d.length,
				RGB = new Object();
				if ( l > 9 ) {
					d = d.split( "," );
					if( d.length < 3 || d.length > 4 ) {	//ErrorCheck
						return null;
					}
					RGB[0] = i( d[0].slice( 4 )),
					RGB[1] = i( d[1]),
					RGB[2] = i( d[2]),
					RGB[3] = d[3] ? parseFloat( d[3]) : -1;
				} else {
					if( l == 8 || l == 6 || l < 4 ){	//ErrorCheck
						return null;
					}

					if( l < 6) {	//3 digit
						d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + ( l > 4 ? d[4] + "" + d[4] : "");
					} 

					d = i( d.slice(1) , 16 ),
					RGB[0] = d >> 16 & 255,
					RGB[1] = d >> 8 & 255,
					RGB[2] = d & 255,
					RGB[3] = l == 9 || l == 5 ? r((( d >> 24 & 255 ) / 255 ) * 10000 ) / 10000 : -1;
				}

				return RGB;
			}
			var i = parseInt,
			r = Math.round,
			h = from.length > 9,
			h = typeof( to ) == "string" ? to.length > 9 ? true : to == "c" ? !h : false : h,
			b = p < 0,
			p = b ? p * -1 : p,
			to = to && to != "c" ? to : b ? "#000000" : "#FFFFFF",
			f = this.sbcRip( from ),
			t = this.sbcRip( to );
			if ( !f || !t ) {	//ErrorCheck
				return null;
			}

			if ( h ) {
				return "rgb(" + r(( t[0] - f[0] ) * p + f[0]) + "," + r(( t[1] - f[1] ) * p + f[1]) + "," + r(( t[2] - f[2]) * p + f[2]) + ( f[3] < 0 && t [3] < 0 ? ")" : "," + (f[3] > -1 && t[3]> -1 ? r((( t[3] - f[3]) * p + f[3]) * 10000 ) / 10000 : t[3] < 0 ? f[3] : t[3]) + ")" );
			} else {
				return "#" + ( 0x100000000 + ( f[3] > -1 && t[3] > -1? r((( t[3] - f[3]) * p + f[3]) * 255) : t[3] > -1 ? r( t[3] * 255 ) : f[3] > -1 ? r( f[3] * 255 ) : 255 ) * 0x1000000 + r(( t[0] - f[0]) * p + f[0]) * 0x10000 + r(( t[1] - f[1]) * p + f[1]) * 0x100 + r(( t[2] - f[2]) * p + f[2])).toString(16).slice( f[3] > -1 || t[3]> -1 ? 1 : 3);
			}
		}
	};
});