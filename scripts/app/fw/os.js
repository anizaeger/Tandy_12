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
CLASS:			OpSys
DESCRIPTION:		Interface between hardware emulator and program logic
execution.
----------------------------------------------------------------------------- */
define([
	'fw/sequencer',
	'sw/boot',
	'sw/picker'
], function(
	Sequencer,
	Boot,
	Picker
) {
	return class OpSys {
		constructor( hw, doc ) {
			this.hw = hw;
			this.doc = doc;
			this.timeStamp = null;
			this.hw.clock.start();
			this.seq = new Sequencer( this );
			this.sysMem = new ( eval( this.getBootProg()))( this );
			this.debug();
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		OpSys::clockTick
		DESCRIPTION:		Logic triggered by hardware clock emulator.  Passes
		clock pulses on to program held in sysMem.
		----------------------------------------------------------------------------- */
		clockTick( timeStamp ) {
			this.timeStamp = timeStamp;

			if ( !this.seq.clockTick()) {
				if ( typeof this.sysMem.clockTick === "function" ) {
					this.sysMem.clockTick( this.timeStamp );
				}
			}

			this.debug();
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		OpSys::clockReset
		DESCRIPTION:		Resets clock pulses to ensure full pulse when clock is
		restarted.
		----------------------------------------------------------------------------- */
		clkReset() {
			this.hw.clock.reset();
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		OpSys::debug
		DESCRIPTION:		Update information in debug pane.
		----------------------------------------------------------------------------- */
		debug() {
			window.DEBUG.clear();
			window.DEBUG.update( this.constructor.name, this );
			window.DEBUG.update( this.sysMem.constructor.name, this.sysMem );
			window.DEBUG.update( this.seq.constructor.name, this.seq );
			window.DEBUG.genTable();
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		OpSys::getBootProg
		DESCRIPTION:		Initialize bootup program selected by dropdown menu in
		debugging pane.
		RETURNS			Identifier of program to boot into.
		----------------------------------------------------------------------------- */
		getBootProg() {
			var bootProg = document.getElementById('STARTUP_PROG');
			var progName = bootProg.options[bootProg.selectedIndex].value;
			return progName;
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		OpSys::selectPgm
		DESCRIPTION:		Load 'Picker' into sysMem.
		----------------------------------------------------------------------------- */
		selectPgm( id = 0 ) {
			this.clear();
			this.sysMem = null;
			this.sysMem = new Picker( this, id );
			this.debug();
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		OpSys::randRange
		DESCRIPTION:		Randomly selects a number between min and max,
		inclusive.
		RETURNS:		Random integer.
		----------------------------------------------------------------------------- */
		randRange( min, max ) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * ( max - min + 1 )) + min;
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		OpSys::randBtn
		DESCRIPTION:		Selects a random button.
		RETURNS:		ID of random button.
		----------------------------------------------------------------------------- */
		randBtn() {
			var btn = this.randRange( 0, NUM_BTNS - 1 );
			return btn;
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		OpSys::button
		DESCRIPTION:		Triggered by pressing/releasing a main button as
		registered by Tandy12 class.
		----------------------------------------------------------------------------- */
		button( btn, state ) {
			if ( typeof this.sysMem.button == "function" ) {
				this.sysMem.button( btn, state );
			}
			this.debug();
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		OpSys::btnCol
		DESCRIPTION:		Determines the column where button in question is
		located.
		RETURNS:		Integer identifying button col.
		----------------------------------------------------------------------------- */
		btnCol( btn ) {
			var col = Math.floor(( btn / NUM_BTNS ) * NUM_COLS );
			return col;
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		OpSys::btnRow
		DESCRIPTION:		Determines the row where button in question is located.
		RETURNS:		Integer identifying button row.
		----------------------------------------------------------------------------- */
		btnRow( btn ) {
			var row = btn - ( this.btnCol( btn ) * NUM_ROWS );
			return row
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		OpSys::seqLoad
		DESCRIPTION:		Loads a sequence into memory, then begins playback.
		----------------------------------------------------------------------------- */
		seqLoad( tones, label, light = true, tone = true ) {
			this.seq.load( tones );
			this.seq.start( label, light, tone );
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		OpSys::seqClear
		DESCRIPTION:		Clear sequence from memory.
		----------------------------------------------------------------------------- */
		seqClear() {
			this.seq.clear();
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		OpSys::seqAdd
		DESCRIPTION:		Appends a single note to sequencer.
		----------------------------------------------------------------------------- */
		seqAdd( btn ) {
			this.seq.add( btn )
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		OpSys::seqStart
		DESCRIPTION:		Begin playback of sequence in memory.
		----------------------------------------------------------------------------- */
		seqStart( label, light = true, tone = true ) {
			this.seq.start( label, light, tone );
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		OpSys::seqEnd
		DESCRIPTION:		Triggered upon sequence completion.
		----------------------------------------------------------------------------- */
		seqEnd( label ) {
			if ( typeof this.sysMem.seqEnd === "function" ) {
				this.sysMem.seqEnd( label );
			}
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		OpSys::playBip
		DESCRIPTION:		Plays a short 'bip' with light, sound, or both.
		----------------------------------------------------------------------------- */
		playBip( btn = 7, label, light = false, tone = true ) {
			var tmpThis = this;
			setTimeout( function() {
				tmpThis.blast( btn, true, light, tone );
				setTimeout( function() {
					tmpThis.blast( btn, false );
					setTimeout( function() {
						if ( typeof tmpThis.sysMem.endBip === "function" ) {
							tmpThis.sysMem.endBip( label )
						}
					}, 500);
				}, 250);
			}, 125);
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		OpSys::flash
		DESCRIPTION:		Bips all lights without sound.
		----------------------------------------------------------------------------- */
		flash() {
			this.playBip( [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ], 'flash', true, false );
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		OpSys::blast
		DESCRIPTION:		Turns on/off a button's associated light/tone.
		----------------------------------------------------------------------------- */
		blast( btn, state = true, light = true, tone = true ) {
			if ( light )
				this.hw.light( btn, state );
			if ( tone )
				this.hw.tone( btn, state );
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		OpSys::blink
		DESCRIPTION:		Blinks a button's light/tone.
		----------------------------------------------------------------------------- */
		blink( btn, label, cycles = 0, light = true, tone = true ) {
			this.hw.blinker.start( btn, label, cycles, light, tone );
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		OpSys::clear
		DESCRIPTION:		Turns off all lights/tones.
		----------------------------------------------------------------------------- */
		clear() {
			this.hw.blinker.stop();
			for ( var num = 0; num < NUM_BTNS; num++ ) {
				this.hw.light( num, false );
				this.hw.tone( num, false );
			}
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		OpSys::btnClick
		DESCRIPTION:		Processes presses of auxiliary buttons (start, select,
		repeat, play, and space).
		----------------------------------------------------------------------------- */
		btnClick( btnName ) {
			if ( typeof this.sysMem.btnClick == "function") {
				this.sysMem.btnClick( btnName );
			}
			this.debug();
		}
	};
});