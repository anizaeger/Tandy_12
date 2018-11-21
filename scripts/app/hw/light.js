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
CLASS:			Light
DESCRIPTION:		Simulates Tandy-12 lights.
----------------------------------------------------------------------------- */
define([],function() {
	return class Light {
		constructor( hw, num ) {
			this.hw = hw;
			this.num = num;
			this.id = 'btnMain'+this.num
			this.light = document.getElementById(this.id);
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Light::hue
		DESCRIPTION:		Store list of colors for individual lights.
		RETURNS:		Color of associated light number
		----------------------------------------------------------------------------- */
		hue( num ) {
			return HUES[ num ];
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Light::lit
		DESCRIPTION:		Sets state of light by dynamically altering background
		color:
		true - on
		false - off
		----------------------------------------------------------------------------- */
		lit( state ) {
			var brightness;

			if ( state ) {
				brightness = 0.25;
			} else {
				brightness = -0.75;
			}

			this.light.style.backgroundColor = this.hue( this.num );
			var origBgColor = window.getComputedStyle( this.light ).getPropertyValue( 'background-color' );
			var newBgColor = this.hw.shadeBlend( brightness ,origBgColor );
			this.light.style.backgroundColor = newBgColor;
		}
	};
});