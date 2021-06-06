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
CLASS:			Osc
DESCRIPTION:		Simulates Tandy-12 tone generator.
----------------------------------------------------------------------------- */
define([], function() {
	return class Osc {
		/* -----------------------------------------------------------------------------
		FUNCTION:		constructor
		DESCRIPTION:		Initialize web audio oscillator.
		ATTRIBUTION:		https://gist.github.com/laziel/7aefabe99ee57b16081c
		----------------------------------------------------------------------------- */
		constructor() {
			this.context = null;
			this.usingWebAudio = true;
			this.listener = false;
			this.playing = false;

			try {
				if ( typeof AudioContext !== 'undefined' ) {
					this.context = new AudioContext();
				} else if ( typeof webkitAudioContext !== 'undefined' ) {
					this.context = new webkitAudioContext();
				} else {
					this.usingWebAudio = false;
				}
			} catch( e ) {
				alert( "*** BUG - Osc::constructor()\n" + "Error - " + e );
				this.usingWebAudio = false;
			}

			this.wake();
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Osc::tone
		DESCRIPTION:		Store list of tones for individual buttons.
		RETURNS:		Frequency of associated button number
		----------------------------------------------------------------------------- */
		freq( tone ) {	
			var freqs = [ 293, 330, 370, 392, 440, 494, 554, 587, 659, 740, 247, 277 ];
			return freqs[ tone ];
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Osc::play
		DESCRIPTION:		Start/stop tone generator for specied tone.
		RETURNS:		Frequency of associated button number
		----------------------------------------------------------------------------- */
		play( tone, state ) {
			if ( this.usingWebAudio ) {
				try {
					if (!( typeof this.osc === 'undefined' || this.osc === null ) && this.playing == true ) {
						this.osc.stop();
						this.playing = false;
					}
					if ( state ) {
						this.osc = this.context.createOscillator();
						this.osc.type = 'square';
						this.osc.frequency.value = this.freq( tone );
						this.osc.connect( this.context.destination );
						this.osc.start();
						this.playing = true;
					}
				} catch( e ) {
					alert( "*** BUG - Osc::play( " + tone + ", " + state + " )\n" + "Error - " + e );
					this.usingWebAudio = false;
				}
			}
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Osc::wake
		DESCRIPTION:		Resumes web audio in the event that it gets suspended.
		ATTRIBUTION:		https://gist.github.com/laziel/7aefabe99ee57b16081c
		----------------------------------------------------------------------------- */
		wake() {
			if ( this.usingWebAudio && this.context.state === 'suspended' ) {
				var resume = function() {
					this.hw.osc.context.resume();

					setTimeout( function() {
						if ( this.hw.osc.context.state === 'running' ) {
							document.body.removeEventListener( 'touchend', resume, false );
						}
					}, 0 );
				};

				document.body.addEventListener('touchend', resume, false);
			}
		}
	};
});