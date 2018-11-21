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
CLASS:			Compete
DESCRIPTION:		Game logic
----------------------------------------------------------------------------- */
define([], function() {
	return class Compete {
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
			if ( this.inPlay ) {
				this.inPlay = false;
				if ( state ) {

					// Determine player who hit their button first
					if ( !( btn >= 4 && btn <= 7 )) {
						this.os.clear();
						this.os.blast( btn, true );
						if ( btn <= 3 ) {
							this.player = 0;
						} else if ( btn >= 8 ) {
							this.player = 1;
						}
					}

					// Determine if button pressed is correct, and if not, award the opposite player.
					if ( btn == this.target[ this.player ]) {
						this.winner = this.player;
					} else {
						this.winner = !this.player * 1;
					}
					this.hit = btn;
				}
			} else if ( !state && btn == this.hit ) {
				this.os.clear();
				if ( ++this.points[ this.winner ] >= 5 ) {
					this.score();
				} else {
					this.run();
				}
			}
		}

		score() {
			if ( this.winner ) {
				this.os.seqLoad([ 8, 9, 10, 11, 10, 9, 8 ], 'win', true, false );
			} else {
				this.os.seqLoad([ 0, 1, 2, 3, 2, 1, 0 ], 'win', true, false );
			}
		}

		clockTick() {
			if ( this.sweep ) {
				this.os.playBip( this.curBtn, '', true, false );
				this.randBtn = this.os.randBtn();

				if ( this.ascend ) {
					this.curBtn++;
				} else {
					this.curBtn--;
				}

				if ( this.curBtn <= 4 || this.curBtn >= 7 ) {
					this.ascend = !this.ascend;
				}

				if ( this.curBtn == this.randBtn && this.steps > 3 ) {
					this.sweep = false;
					this.inPlay = true;
					this.os.blink( this.curBtn, 'inPlay', 3, true, false );
					this.target = [ this.curBtn - 4, this.curBtn + 4 ];
				} else {
					this.steps++;
				}
			}
		}

		seqEnd( label ) {
			switch ( label ) {
			case 'inPlay':
				this.inPlay = false;
				this.run();
			}
		}

		advanceBtn() {
			if ( this.ascend ) {
				this.curBtn++;
			} else {
				this.curBtn--;
			}
			if ( this.curBtn <= 4 || this.curBtn >= 7 ) {
				this.ascend = !this.ascend;
			}
		}

		start() {
			this.gameOver = !this.gameOver;
			this.points = [ 0, 0 ];
			this.run();
		}

		run() {
			this.ascend = true;
			this.curBtn = 4;
			this.steps = 0;
			this.sweep = true;
			this.player = null;
			this.hit = null;
			this.winner = null;
		}

		randBtn() {
			var randBtn = os.randRange(4,7);
			alert(randBtn);
		}

	};
});