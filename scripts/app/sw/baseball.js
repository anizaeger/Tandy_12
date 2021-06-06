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
CLASS:			Baseball
DESCRIPTION:		Game logic
----------------------------------------------------------------------------- */
define(['ui/scoreboard'], function(Scoreboard) {
	return class Baseball {
		constructor( os, id ) {
			this.os = os;
			this.id = id;
			this.scoreboard = new Scoreboard( this );
			this.os.sysMem = this;
			this.pitchBall = false;
			this.hit = false;
			this.run = false;
		}

		btnClick( btnName ) {
			switch( btnName ) {
			case 'select':
				this.os.selectPgm( this.id );
				break;
			case 'start':
				this.windup();
				break;
			case 'playhit':
				this.swing();
				break;
			}
		}

		clockTick() {
			this.scoreboard.update();
			if ( this.pitchBall ) {
				this.os.blinker = true;
				this.btnNum = this.os.randBtn();
				this.os.clear();
				this.os.blast( this.btnNum, true, true, false );
				this.scoreboard.pitch( this.btnNum );
			} else if ( this.hit ) {
				this.hit = false;
				this.os.blink( this.btnNum, 'hit', 3 );
			} else if ( this.run ) {
				this.run = this.scoreboard.run();
			}
		}

		windup() {
			this.pitchBall = true;
			this.hit = false;
			this.run = false;
			this.scoreboard.windup();
		}

		swing() {
			this.pitchBall = false;
			this.hit = true;
		}

		seqEnd( label ) {
			switch( label ) {
			case 'hit':
				this.scoreboard.hit( this.btnNum );
				this.os.blink( this.btnNum, '', 0, true, false );
				this.run = true;
				break;
			}
		}
	};
});