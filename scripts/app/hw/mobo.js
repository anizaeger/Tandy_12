/**
*
* @source: https://github.com/anizaeger/Tandy-12
*
* @licstart  The following is the entire license notice for the 
* JavaScript code in this page.
*
* Copyright (C) 2017, 2026 Anakin-Marc Zaeger
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
CLASS:			Tandy12
DESCRIPTION:		Simulates the hardware aspects of the Tandy-12
----------------------------------------------------------------------------- */
define([
	'hw/blinker',
	'hw/clock',
	'hw/light',
	'hw/osc',
	'fw/os',
	'ui/manpage'
], function( Blinker, Clock, Light, Osc, OpSys, Manpage) {
	return class Tandy12 {
		constructor() {
			this.clock = new Clock( this );
			this.osc = new Osc( this );
			this.power = false;
			this.os = null;
			this.doc = new Manpage();

			this.lights = new Array( window.NUM_BTNS );
			for ( var btn = 0; btn < window.NUM_BTNS; btn++ ) {
				this.lights[ btn ] = new Light( this, btn );
				this.lights[ btn ].lit( false );

				var btnMain = document.getElementById( 'btnMain' + btn );

				// Workaround for dynamically-created elements with mouse events provided by Stack Overflow user 'posit labs':
				// https://stackoverflow.com/questions/28573631/dynamically-creating-elements-and-adding-onclick-event-not-working
				(function() {
					var _btn = btn;
					btnMain.onmousedown = function() { window.hw.button( _btn, true )};
					btnMain.onmouseup = function() { window.hw.button( _btn, false )};
					btnMain.ontouchstart = function( event ) { window.hw.touch( event, _btn, true )};
					btnMain.ontouchend = function( event ) { window.hw.touch( event, _btn, false )};
				})();
			}

			this.blinker = new Blinker( this );

			this.setPower();
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Tandy12::setPower
		DESCRIPTION:		Generates HTML code for Tandy-12 buttons and adds them
		to the main page.
		----------------------------------------------------------------------------- */
		setPower() {
			this.power = document.getElementById('switch').checked;
			if ( this.power ) {
				this.getInput = true;
				this.os = new OpSys( this, this.doc );
				window.DEBUG.genTable();
			} else {
				this.osc.play( false );
				this.clock.stop();
				this.os = null;
				this.darken();
				this.doc.setManpage('main');
				window.DEBUG.clear();
			}
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Tandy12::button
		DESCRIPTION:		Process presses and releases of main game buttons.
		----------------------------------------------------------------------------- */
		button( btn, state ) {
			// Only accept 
			if ( this.getInput == state ) {
				this.getInput = !state;
				if ( this.power && this.os != null ) {
					this.os.button( btn, state );
				}
			}
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Tandy12::touch
		DESCRIPTION:		Handle touchscreen events for main buttons.
		----------------------------------------------------------------------------- */
		touch( event, btn, state ) {
			event.preventDefault();
			this.button( btn, state );
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Tandy12::light
		DESCRIPTION:		Manipulate individual and groups of lights.
		----------------------------------------------------------------------------- */
		light( num, state ) {
			if ( this.power ) {
				if ( Array.isArray( num )) {	// Perform action on group of lights
					for ( var idx = 0; idx < num.length; idx++ ) {
						if ( num[ idx ] >= 0 && num[ idx ] < window.NUM_BTNS )
							this.lights[ num[ idx ]].lit( state );
					}
				} else {	// Perform action on individual light.
					if ( num >= 0 && num < NUM_BTNS )
						this.lights[ num ].lit( state );
				}
			}
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Tandy12::tone
		DESCRIPTION:		Pass audio commands to Oscillator.
		----------------------------------------------------------------------------- */
		tone( tone, state ) {
			if ( this.power ) {
				if ( !Array.isArray( tone )) {
					this.osc.play( tone, state );
				}
			}
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Tandy12::blast
		DESCRIPTION:		Active light and tone associated with particular button.
		----------------------------------------------------------------------------- */
		blast( btn, state ) {
			this.light( btn, state );
			this.tone( btn, state );
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Tandy12::darken
		DESCRIPTION:		Turn off all lights.
		----------------------------------------------------------------------------- */
		darken() {
			for ( var num = 0; num < NUM_BTNS; num++ ) {
				this.lights[ num ].lit( false );
			}
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Tandy12::clockTick
		DESCRIPTION:		Receive ticks from Clock and pass on to Blinker and OpSys.
		----------------------------------------------------------------------------- */
		clockTick( timeStamp ){
			if ( this.power && this.os != null ) {
				this.osc.wake();
				this.blinker.clockTick();
				this.os.clockTick( timeStamp );
			}
			window.DEBUG.print();
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Tandy12::seqEnd
		DESCRIPTION:		Notify OpSys that Blinker has completed cycle count.
		----------------------------------------------------------------------------- */
		seqEnd( label ) {
			this.os.seqEnd( label )
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Tandy12::click
		DESCRIPTION:		Process auxiliary buttons.
		----------------------------------------------------------------------------- */
		click( type ) {
			if ( this.power && this.os != null ) {
				this.os.btnClick( type );
			}
		}
	};
});