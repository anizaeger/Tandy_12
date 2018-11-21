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
/*
Repeat Plus
*/

define([], function() {
	return class Repeat_Plus {
		constructor( os, id ) {
			this.os = os;
			this.id = id;
			this.os.sysMem = this;
			this.seq = [];
			this.gameOver = true;
			this.start();
		}

		start() {
			this.gameOver = false;
			this.seq.length = 0;
			var randBtn = this.os.randBtn();
			this.seq.push( randBtn );
			this.os.seqLoad( this.seq, 'genSeq' )
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
			if ( this.getInput ) {
				this.os.blast( btn, state );
				if ( state ) {
					if ( this.count >= this.seq.length ) {
						this.seq.push( btn );
						this.newTurn = true
					} else if ( btn == this.seq[ this.count ]) {
						this.count++
					} else {
						this.gameOver = true;
					}
				} else {
					if ( this.gameOver ) {
						this.loss();
					} else if ( this.newTurn ) {
						this.getInput = false;
						this.os.playBip( 7, 'success' );
					}
				}
			}
		}

		loss() {
			this.getInput = false;
			this.os.seqLoad([0,0,0,0,7,0,7,0,7,0], 'loss');
		}

		endBip( label ) {
			switch( label ) {
			case 'success':
				this.seqEnd('genSeq');
				break;
			}
		}

		seqEnd( type ) {
			switch( type ) {
			case 'genSeq':
				this.count = 0;
				this.newTurn = false;
				this.getInput = true;
				break;
			case 'loss':
				this.blinkScore();
				break;
			case 'gameOver':

				break;
			}
		}

		blinkScore() {
			if (( this.seq.len - 1 ) < 12 ) {
				this.seqEnd( 'gameOver' );
			} else if (( this.seq.len - 1 ) >= 12 && ( this.seq.len - 1 ) <= 22 ) {
				this.os.blink( 0, 'gameOver', 3 );
			} else if (( this.seq.len - 1 ) >= 23 && ( this.seq.len - 1 ) <= 33 ) {
				this.os.blink( 1, 'gameOver', 3 );
			} else if (( this.seq.len - 1 ) >= 34 ) {
				this.os.blink( 2, 'gameOver', 3 );
			}
		}
	};
});