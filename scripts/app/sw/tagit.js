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
CLASS:			Tag_It
DESCRIPTION:		Game logic
----------------------------------------------------------------------------- */
define([], function() {
	return class Tag_It {
		constructor( os, id ) {
			this.os = os;
			this.id = id;
			this.os.sysMem = this;
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
			if ( this.inPlay && this.getInput && state ) {
				this.getInput = false;
				if ( this.btnNum == btn ) {
					this.os.playBip( btn );
					this.score++;
				}
			}
		}

		clockTick() {
			if ( this.inPlay ) {	// A game is in progress
				if ( this.newBtn ) {	// Advance light only every other second.
					if ( ++this.count <= 110 ) {
						this.newBtn = false;
						this.btnNum = this.os.randBtn();
						this.os.playBip( this.btnNum, '', true, false );
						this.getInput = true;
					} else {
						this.endGame();
					}
				} else {
					this.newBtn = true;
				}
			}
		}

		start() {
			this.count = 0;
			this.score = 0;
			this.inPlay = true;
		}

		endGame() {
			this.inPlay = false;
			this.os.seqLoad([ 8, 8, 8, 5, 5, 7, 6, 6, 6, 4, 4, 4 ], 'endGame', false, true)
		}

		showScore() {
			if ( this.score < 10 ) {
				this.seqEnd( 'score' );
			} else if ( this.score < 20 ) {
				this.os.blink( 0, 'score', 3 );
			} else if ( this.score < 30 ) {
				this.os.blink( 1, 'score', 3 );
			} else if ( this.score < 40 ) {
				this.os.blink( 2, 'score', 3 );
			} else if ( this.score < 50 ) {
				this.os.blink( 3, 'score', 3 );
			} else if ( this.score < 60 ) {
				this.os.blink( 4, 'score', 3 );
			} else if ( this.score < 70 ) {
				this.os.blink( 5, 'score', 3 );
			} else if ( this.score < 80 ) {
				this.os.blink( 6, 'score', 3 );
			} else if ( this.score < 90 ) {
				this.os.blink( 7, 'score', 3 );
			} else if ( this.score < 100 ) {
				this.os.blink( 8, 'score', 3 );
			} else if ( this.score < 110 ) {
				this.os.blink( 9, 'score', 3 );
			} else {
				this.os.blink( 10, 'score', 3 );
			}
		}

		seqEnd( label ) {
			switch( label ) {
			case 'endGame':
				this.showScore();
				break;
			case 'score':
				this.os.selectPgm( this.id );
				break;
			}
		}
	};
});