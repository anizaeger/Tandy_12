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
CLASS:			Fire_Away
DESCRIPTION:		Game logic
----------------------------------------------------------------------------- */
define([], function() {
	return class Fire_Away {
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
			if ( this.sweep ) {
				if ( this.os.btnCol( btn ) == 2 ) {
					if ( !state ) {
						if ( this.target == btn ) {
							this.hit( btn );
						} else {
							var possDir = this.minMaxDir( btn );
							var dir = this.os.randRange( possDir[0], possDir[1] );
							var shot = btn - 4 + dir;
							if ( this.target == shot ) {
								this.hit( btn );
							} else {
								this.miss( btn );
							}
						}
					}
				}
			}
		}

		clockTick() {
			if ( this.sweep ) {
				this.advance = !this.advance;
				if ( this.advance ) {
					if ( ++this.possFire > 1 ) {
						this.missile = null;
						this.target = null;
					}
					if ( this.ascend ) {
						this.curBtn++;
					} else {
						this.curBtn--;
					}

					if ( this.curBtn <= 0 || this.curBtn >= 3 ) {
						this.ascend = !this.ascend;
					}
					this.os.playBip( this.curBtn, '', true, false );
				} else {
					if ( this.possFire > 1 && this.os.randRange( 0, 3 ) == this.curBtn ) {
						this.shots++
						this.possFire = 0;
						var possDir = this.minMaxDir( this.curBtn );
						var dir = this.os.randRange( possDir[0], possDir[1] );
						this.missile = this.curBtn + 4 + dir;
						this.target = this.missile + 4 + dir;
						this.os.playBip( this.missile, '', true, false );
					}
				}
				if ( this.shots >= 13 ) {
					this.sweep = false;
					this.score();
				}
			}
		}

		start() {
			this.gameOver = false;
			this.shots = 0;
			this.hits = 0;

			this.curBtn = 1;
			this.advance = true;
			this.ascend = false;
			this.possFire = 0;

			this.sweep = true;
		}

		minMaxDir( btn ) {
			var min = -1;
			var max = 1;

			var btnRow = this.os.btnRow( btn );
			var btnCol = this.os.btnCol( btn );

			if ( btnCol == 0 ) {
				if ( btnRow <= 1 ) {
					min = 0;
				} else {
					max = 0;
				}
			} else if ( btnCol == 2 ) {
				if ( btnRow == 0 ) {
					min = 0;
				} else if ( btnRow == 3 ) {
					max = 0;
				}
			}
			return [ min, max ];
		}

		hit( btn ) {
			this.os.playBip( btn, '', true, false );
			this.hits++
		}

		miss( btn ) {
			this.os.playBip( btn, '', true, true );
		}

		score() {
			if ( this.hits == 0 ) {
			
			} else if ( this.hits == 13 ) {
			
			} else {
				this.os.blink( this.hits - 1, 'score', 3, true, false );
			}
		}

		seqEnd( label ) {
			switch( label ) {
			case 'score':
				this.os.selectPgm( this.id );
				break;
			}
		}
	};
});