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
CLASS:			Treasure_Hunt
DESCRIPTION:		Game logic
----------------------------------------------------------------------------- */
define([], function() {
	return class Treasure_Hunt {
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
			if ( this.gameOver )
				return;
			if ( this.getInput || !state ) {
				this.os.blast( btn, state );
			}
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
			for ( var idx = 0; idx < 3; idx++ ) {
				this.seq[ idx ] = this.os.randBtn();
			}
			this.gameOver = false;
			this.getInput = true;
			this.tries = 0;
		}

		score() {
			var matches = 0;
			for ( var idx = 0; idx < 3; idx++ ) {
				if ( this.seq[ idx ] == this.presses[ idx ]) {
					matches++;
				}
			}
			switch( matches ) {
			case 0:
				this.loss();
				break;
			case 1:
				this.os.blink( 0, 'score', 3, true, false );
				break;
			case 2:
				this.os.blink([ 0, 1 ], 'score', 3, true, false );
				break;
			case 3:
				this.win();
				break;
			}
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
			this.os.seqLoad( this.seq, 'gameOver', true, false );
		}
	};
});