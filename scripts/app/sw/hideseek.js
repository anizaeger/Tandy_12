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
CLASS:			Hide_N_Seek
DESCRIPTION:		Game logic
----------------------------------------------------------------------------- */
define([], function() {
	return class Hide_N_Seek {
		constructor( os, id ) {
			this.os = os;
			this.id = id;
			this.os.sysMem = this;
			this.seq = [];
			this.presses = [];
			this.gameOver = true;
			this.start();
		}

		btnClick( btnName ) {
			switch( btnName ) {
			case 'start':
				this.start();
				break;
			case 'select':
				this.os.selectPgm( this.id );
				break;
			}
		}

		button( btn, state ) {
			// Only process button press if game isn't over
			if ( this.gameOver || btn < 8 || btn > 11)
				return;
			// Are we accepting presses at this time?
			if ( this.getInput || !state ) {
				this.os.blast( btn, state );
			}
			// Was the button pressed, or released?
			if ( state ) {
				this.presses[ this.tries++ ] = btn;
			} else {
				if ( this.tries == 3) {
					this.getInput = false;
					this.score();
				}
			}
		}

		start() {
			// Generate new sequence
			this.seq.length = 0;
			for ( var idx = 0; idx < 3; idx++ ) {
				var randBtn = this.os.randRange( 8, 11 )
				this.seq[ idx ] = randBtn;
			}

			this.rndCount = this.symCount( this.seq );

			// Begin new game
			this.gameOver = false;
			this.getInput = true;
			this.tries = 0;
		}

		score() {
			var matches = 0;
			var numbers = 0;

			// Count number of matches
			for ( var idx = 0; idx < 3; idx++ ) {
				if ( this.seq[ idx ] == this.presses[ idx ]) {
					matches++;
				}
			}

			if ( matches == 0 ) {
				// No matches
				this.loss();
			} else if ( matches == 3 ) {
				// All matches
				this.win();
			} else {
				// Some matches - count number of correct numbers in wrong position
				var btnCount = this.symCount( this.presses );

				var rndTxt = '';
				var btnTxt = '';

				for ( var idx = 0; idx < 12; idx++ ) {
					var rnd = this.rndCount[ idx ];
					var btn = btnCount[ idx ];


					rndTxt += ' ' + rnd;
					btnTxt += ' ' + btn;

					if ( rnd > 0 && btn > 0 ) {
						if ( rnd > btn ) {
							numbers += btn;
						} else {
							numbers += rnd;
						}
					}
				}

				var matchLights = [];
				switch ( matches ) {
				case 1:
					matchLights = [ 4 ];
					break;
				case 2:
					matchLights = [ 4, 5 ];
					break;
				}

				var numberLights = [];
				switch ( numbers ) {
				case 1:
					numberLights = [ 0 ];
					break;
				case 2:
					numberLights = [ 0, 1 ];
					break;
				case 3:
					numberLights = [ 0, 1, 2 ];
					break;
				}

				var scoreLights = numberLights.concat( matchLights );
				this.os.blink( scoreLights, 'score', 3 );
			}
		}

		symCount( symArray ) {
			var result = [];
			for ( var btn = 0; btn < NUM_BTNS; btn++ ) {
				result[ btn ] = 0;
			}

			for  ( var idx = 0; idx < 3; idx++ ) {
				++result[ symArray[ idx ]]
			}

			return result;
		}

		seqEnd( label ) {
			switch ( label ) {
			case 'score':
				if ( !this.gameOver ) {
					this.tries = 0;
					this.getInput = true;
				}
				break;
			case 'gameOver':
				this.gameOver = true;
				this.start();
				break;	
			}
		}

		win() {
			this.os.seqLoad([ 5, 5, 5, '-', 1, 2, 1, 2 ], 'gameOver' );
		}

		loss() {
			this.os.seqLoad( this.seq, 'gameOver' );
		}
	};
});