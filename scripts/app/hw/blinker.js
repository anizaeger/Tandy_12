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
CLASS:			Blinker
DESCRIPTION:		Blink light(s) off and on.
----------------------------------------------------------------------------- */
define([], function() {
	return class Blinker {
		constructor( hw ) {
			this.hw = hw;
			this.reset();
			this.btn = null;
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Blinker::clockTick
		DESCRIPTION:		Receive hardware clock pulses and blink lights
		accordingly.
		----------------------------------------------------------------------------- */
		clockTick() {
			if ( this.blinking ) {
				if ( this.state ) {
					if ( this.cycles )
						++this.count;
					this.on();
				} else {
					this.off();
					if ( this.cycles && this.count >= this.cycles ) {
						this.stop();
						this.hw.seqEnd( this.label );
					}
				}
			}
			this.state = !this.state;
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Blinker::start
		DESCRIPTION:		Set blinker mode, cycle count, and label, then start
		cycling.
		----------------------------------------------------------------------------- */
		start( btn, label, cycles, light, tone ) {
			this.reset();
			this.light = light;
			this.tone = tone ;
			this.btn = btn;

			this.label = label;
			this.cycles = cycles;

			this.count = 0;
			this.run();
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Begin cycling blinker.
		----------------------------------------------------------------------------- */
		run() {
			this.blinking = true;
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Blinker::stop
		DESCRIPTION:		Stop blinker and reinitialize settings.
		----------------------------------------------------------------------------- */
		stop() {
			this.off();
			this.blinking = false;
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Blinker::reset
		DESCRIPTION:		Initialize settings
		----------------------------------------------------------------------------- */
		reset() {
			this.light = false;
			this.tone = false;
			this.blinking = false;
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Blinker::on
		DESCRIPTION:		Turn on specified lights and tone.
		----------------------------------------------------------------------------- */
		on() {
			if ( this.light ) {
				this.hw.light( this.btn, true );
			}
			if ( this.tone ) {
				this.hw.tone( this.btn, true );
			}
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Blinker::off
		DESCRIPTION:		Turn off lights and tone.
		----------------------------------------------------------------------------- */
		off() {
			for ( var btn = 0; btn < NUM_BTNS; btn++ ) {
				this.hw.blast( btn, false );
			}
		}
	};
});