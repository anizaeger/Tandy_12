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
CLASS:			Picker
DESCRIPTION:		Logic for game selection interface
----------------------------------------------------------------------------- */
define([
	'sw/organ',
	'sw/writer',
	'sw/repeat',
	'sw/torpedo',
	'sw/tagit',
	'sw/roulette',
	'sw/baseball',
	'sw/repeat2',
	'sw/treasure',
	'sw/compete',
	'sw/fireaway',
	'sw/hideseek'
], function(
	Organ,
	Song_Writer,
	Repeat,
	Torpedo,
	Tag_It,
	Roulette,
	Baseball,
	Repeat_Plus,
	Treasure_Hunt,
	Compete,
	Fire_Away,
	Hide_N_Seek
) {
	return class Picker {
		constructor( os, id = 0 ) {
			this.os = os;
			this.os.sysMem = this;
			this.btnNum = id;
			this.select = false;
			this.doPick = true;
			this.manpages = [
				'organ',
				'song-writer',
				'repeat',
				'torpedo',
				'tag-it',
				'roulette',
				'baseball',
				'repeat-plus',
				'treasure-hunt',
				'compete',
				'fire-away',
				'hide-n-seek'
			]
			this.os.blink( this.btnNum, '', 0, true, false );
			this.os.doc.setManpage( 'picker' );
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Picker::clockTick
		DESCRIPTION:		Logic triggered by OpSys clock.  Passes clock pulses on
		to program held in sysMem.
		----------------------------------------------------------------------------- */
		clockTick() {
			if ( !this.select && !hw.blinker.state ) {
				this.select = true;
			}
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Picker::button
		DESCRIPTION:		Processes presses of main game buttons.
		----------------------------------------------------------------------------- */
		button( btn, state ) {
			if ( this.doPick && state ) {
				this.btnNum = btn;
				this.os.blink( this.btnNum, '', 0, true, false );
				this.select = false;
			}
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Picker::btnClick
		DESCRIPTION:		Processes presses of auxiliary buttons (start, select,
		repeat, play, and space).
		----------------------------------------------------------------------------- */
		btnClick( btnName ) {
			switch ( btnName ) {
			case 'start':
				this.doPick = false;
				this.os.clear();
				this.os.playBip( this.btnNum, 'loadPgm', true );
				this.os.doc.setManpage( this.manpages[ this.btnNum ]);
				break;
			case 'select':
				if ( this.select ){
					if ( ++this.btnNum >= NUM_BTNS ) {
						this.btnNum = 0;
					}
					this.os.blink( this.btnNum, '', 0, true, false );
					this.select = false;
				}
				break;
			}
		}

		/* -----------------------------------------------------------------------------
		FUNCTION:		Picker::endBip
		DESCRIPTION:		Triggered by the end of a 'bip'; used trigger program
		loading into os.sysMem.
		----------------------------------------------------------------------------- */
		endBip( label ) {
			switch( label ) {
			case 'loadPgm':
				this.os.sysMem = null;
				this.os.sysMem = new ( eval( window.PROGS[ this.btnNum ]))( this.os, this.btnNum );
				//this.os.sysMem = new Organ( this.os, this.btnNum );
				break;
			}
		}
	};
});