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
CLASS:			Roulette
DESCRIPTION:		Game logic
----------------------------------------------------------------------------- */
define([], function() {
	return class Roulette {
		constructor( os, id ) {
			this.os = os;
			this.id = id;
			this.os.sysMem = this;
			this.wheel = [4,8,9,10,11,7,3,2,1,0];
			this.btnEnable = true;
			this.spin(); 
		}

		btnClick( btnName ) {
			if ( this.btnEnable ) {
				switch( btnName ) {
				case 'start':
					this.spin();
					break;
				case 'select':
					this.os.selectPgm( this.id );
					break;
				}
			}
		}

		clockTick() {
			if ( !this.btnEnable ) {
				if ( this.count++ < this.ticks ) {
					if ( ++this.idx >= 10 ) {
						this.idx = 0;
					}
					this.os.blinker = true;
					this.os.clear();
					this.os.blast( this.wheel[ this.idx ], true, true, false );
				} else {
					this.os.blink( this.wheel[ this.idx ], 'gameOver', 3 );
					this.btnEnable = true;
				}
			}
		}

		spin() {
			this.btnEnable = false;
			this.ticks = this.os.randRange( 11, 40 );
			this.count = 0;
			this.idx = this.wheel.length;
			this.os.clkReset();
		}

		seqEnd( label ) {
			switch( label ) {
			case 'gameOver':
				this.os.blast( this.wheel[ this.idx ], true, true, false );
				break;
			}
			this.btnEnable = true;
		}

	};
});