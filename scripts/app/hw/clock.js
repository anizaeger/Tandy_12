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
CLASS:			Clock
DESCRIPTION:		Simulates Tandy-12 clock pulse generator.
----------------------------------------------------------------------------- */
define([], function() {
	return class Clock {
		constructor( hw ) {
			this.hw = hw;
			this.timer = null;

			this.clockRgbMin = '#ff0000';
			this.clockRgbMax = '#00ff00';

			this.clockHz = document.getElementById("clockHz");
			this.clockMs = document.getElementById("clockMs");
			this.clockslide = document.getElementById("clockSlider");

			// Set minimum Hz / maximum Ms
			this.clockHzMin = CONFIG.getClockHzMin();
			if ( this.clockHzMin < 0.1 ) {
				this.clockHzMin = 0.1;
			}
			this.clockMsMax = this.hzToMs( this.clockHzMin );
			this.clockMs.max = this.clockMsMax;

			// Set maximum Hz / minimum Ms
			this.clockHzMax = CONFIG.getClockHzMax();
			if ( this.clockHzMax > 10 ) {
				this.clockHzMax = 10;
			}
			this.clockMsMin = this.hzToMs( this.clockHzMax );
			this.clockMs.min = this.clockMsMin;

			// Represent slider as percentages.
			this.clockPrcn = CONFIG.getClockPrec();
			var minPcnt = Math.round(( this.clockHzMin / this.clockHzMax ) * this.clockPrcn );
			this.clockslide.min = minPcnt;
			this.clockslide.max = 10000;

			document.getElementById("clockHzMin").innerHTML = this.clockHzMin + 'hz';
			document.getElementById("clockHzMax").innerHTML = this.clockHzMax + 'hz';

			this.default();
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Clock::ratioToHz
		DESCRIPTION:		Convert ratio to pulses-per-second based on allowable
		min/max clock Hz.
		----------------------------------------------------------------------------- */
		ratioToHz( ratio ) {
			return ( this.clockHzMax  * ratio );
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Clock::msToHz
		DESCRIPTION:		Convert clock pulse delay in ms to frequency in Hz.
		----------------------------------------------------------------------------- */
		msToHz( ms ) {
			return 1000 / ms;
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Clock::hzToMs
		DESCRIPTION:		Convert clock frequency in Hz to pulse delay in ms.
		----------------------------------------------------------------------------- */
		hzToMs( hz ) {
			return Math.round( 1000 / hz );
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Clock::msToRatio
		DESCRIPTION:		Convert clock pulse delay in ms to decimal ratio.
		----------------------------------------------------------------------------- */
		msToRatio( ms ) {
			return ( ms / this.clockMsMax ) * 10000;
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Clock::hzToRatio
		DESCRIPTION:		Convert clock frequency in Hz to decimal ratio.
		----------------------------------------------------------------------------- */
		hzToRatio( hz ) {
			return ( hz / this.clockHzMax ) * 10000;
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Clock::reset
		DESCRIPTION:		Reset clock by stopping and restarting.
		----------------------------------------------------------------------------- */
		reset() {
			if ( this.hw.power ) {
				this.stop();
				this.run();
			}
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Clock::tick
		DESCRIPTION:		Generate clock pulse.  After pulsing, set timer to
		generate another pulse.
		----------------------------------------------------------------------------- */
		tick() {
			this.hw.clockTick( this.timeStamp++ );
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Clock::start
		DESCRIPTION:		Initialize and seqStart clock.
		----------------------------------------------------------------------------- */
		start() {
			if ( this.hw.power && this.timer == null ) {
				this.timeStamp = 0;
				this.run();
			}
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Clock::stop
		DESCRIPTION:		Pause clock.
		----------------------------------------------------------------------------- */
		stop() {
			if ( typeof this.timer !== 'undefined' ) {
				clearTimeout( this.timer );
				this.timer = null;
			}
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Clock::advance
		DESCRIPTION:		Manually-tick clock, stopping automatic timer if
		necessary.
		----------------------------------------------------------------------------- */
		advance() {
			if ( this.hw.power ) {
				this.stop();
				this.tick();
			}
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Clock::run
		DESCRIPTION:		Resume the clock.
		----------------------------------------------------------------------------- */
		run() {
			this.tick();
			var tmpThis = this;
			this.timer = setTimeout( function() {
				tmpThis.run();
			}, this.clockRate );
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Clock::set
		DESCRIPTION:		Set clock rate to new value based on clock control
		settings.
		----------------------------------------------------------------------------- */
		set() {
			var ms = this.clockMs.value;
			if ( ms >= this.clockMsMin && ms <= this.clockMsMax ) {
				var hz = this.msToHz( ms );
				var ratio = this.hzToRatio( hz );
				this.clockslide.value = ratio;
				this.adjust();
			}
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Clock::Adjust
		DESCRIPTION:		Accepts percentage from slider, and converts it to
		milliseconds.
		----------------------------------------------------------------------------- */
		adjust() {
			// Value of slider as a decimal.
			var ratio = this.clockslide.value / 10000;
			var dispPcnt = Math.round( ratio * 10000 ) / 100;

			var newHz = Math.round( this.ratioToHz( ratio ) * 100 ) / 100;
			var newMs = Math.round( this.hzToMs( newHz ));

			this.clockslide.style.backgroundColor = this.hw.shadeBlend( ratio, this.clockRgbMin,this.clockRgbMax );

			this.clockHz.innerHTML = newHz + 'hz';
			this.clockMs.value = newMs;

			document.getElementById("clockPcnt").innerHTML = dispPcnt + '%';
			this.clockRate = newMs;
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Clock::default
		DESCRIPTION:		Reset clock rate to default value.
		----------------------------------------------------------------------------- */
		default() {
			var ms = this.hzToMs( CONFIG.getClockHzDef());
			var ratio = this.msToRatio( ms )
			this.clockslide.value = ratio;
			this.adjust();
			this.reset();
		}
	};
});