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
CLASS:			Sequencer
DESCRIPTION:		Handles outputting light and tone sequences.
----------------------------------------------------------------------------- */
define([], function() {
	return class Sequencer{
		constructor( os ) {
			this.os = os;
			this.seq = [];
			this.len = this.seq.length;
			this.MAXLEN = 44;
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Sequencer::load
		DESCRIPTION:		Load desired sequence into memory, and set output mode.
		----------------------------------------------------------------------------- */
		load( tones ) {
			this.clear();

			for ( var idx = 0; idx < tones.length; idx++ ) {
				this.add( tones[ idx ]);
			}
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Sequencer::clockTick
		DESCRIPTION:		Step through sequence one element at a time per clock
		tick.
		----------------------------------------------------------------------------- */
		clockTick() {
			if ( this.run ) {
				this.os.clear();
				if ( this.pos == this.len ) {
					if ( this.repeat ) {
						this.pos = 0;
					} else {
						this.stop();
					}
				} else {
					var note = this.seq[ this.pos++ ];
					if ( note >= 0 && note < window.NUM_BTNS ) {
						this.os.blast( note, true, this.light, this.note );
					}
				}
				return true;
			} else {
				return false;
			}
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Sequencer::add
		DESCRIPTION:		Appends single note to sequence.
		----------------------------------------------------------------------------- */
		add( note ) {
			this.seq.push( note );
			this.len = this.seq.length;
			var overflow = this.len - this.MAXLEN;
			if ( overflow > 0 ) {
				for ( var over = 0; over < overflow; over++ ) {
					this.seq.shift();
				}
			}
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Sequencer::clear
		DESCRIPTION:		Clears the sequence.
		----------------------------------------------------------------------------- */
		clear() {
			this.seq.length = 0;
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Sequencer::start
		DESCRIPTION:		Begin playback of sequence.
		----------------------------------------------------------------------------- */
		start( label, light, note ) {
			this.label = label;
			this.light = light;
			this.note = note;
			this.pos = 0;
			this.run = true;
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Sequencer::stop
		DESCRIPTION:		Stops a running sequence.
		----------------------------------------------------------------------------- */
		stop() {
			this.run = false;
			var tmpThis = this;
			setTimeout( function() {
				tmpThis.os.seqEnd( tmpThis.label );
			}, 125);
		}
	};
});