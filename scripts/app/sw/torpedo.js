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
CLASS:			Torpedo
DESCRIPTION:		Game logic
----------------------------------------------------------------------------- */
define([], function() {
	return class Torpedo {
		constructor( os, id ) {
			this.os = os;
			this.id = id;
			this.os.sysMem = this;
			this.startGame();
		}

		startGame() {
			this.gameOver = false;
			this.sub = this.os.randBtn();
			this.subRow = this.os.btnRow( this.sub );
			this.subCol = this.os.btnCol( this.sub );
			this.lastHit = null;
			this.tries = 0;
		}

		btnClick( btnName ) {
			switch( btnName ) {
			case 'start':
				this.startGame();
				break;
			case 'select':
				this.os.selectPgm( this.id );
				break;
			}
		}

		button( btn, state ) {
			if ( this.gameOver )
				return;
			this.os.blast( btn, state );

			if ( !state ) {
				this.tries++
				if ( btn == this.sub ) {
					this.win()
				} else if ( this.tries == 3) {
					this.loss();
				} else {
					var btnRow = this.os.btnRow( btn );
					var btnCol = this.os.btnCol( btn );

					if ( btnRow == this.subRow || btnCol == this.subCol ) {
						this.os.flash();
						this.os.playBip( btn );
					}
				}
			}
		}

		win() {
			this.gameOver = true;
			this.os.seqLoad([0,0,2,4,5,2,5,'-',7,7,8,4,7,7,7,'-'], 'win');
		}

		loss() {
			this.gameOver = true;
			this.os.blink( this.sub, 'loss', 3 );
		}

		seqEnd( label ) {
			this.startGame();
		}
	};
});