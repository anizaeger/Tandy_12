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
CLASS:			Scoreboard
DESCRIPTION:		Monitors and displays progress for Baseball.
----------------------------------------------------------------------------- */
define([], function() {
	return class Scoreboard{
		constructor( game ) {
			this.game = game;
			this.outcome = [
				'Triple',
				'Out',
				'Out',
				'Single',
				'Out',
				'Home Run',
				'Out',
				'Out',
				'Single',
				'Out',
				'Double',
				'Out'
			];
			this.manpage = document.getElementById('manpage');
			this.scoreboard = this.manpage.contentDocument? this.manpage.contentDocument: this.manpage.contentWindow.document;
			this.outs = null;

			var hitHtml = '';

			for ( var row = 0; row < NUM_ROWS; row++ ) {
				hitHtml += '<tr>';
				for ( var col = 0; col < NUM_COLS; col++ ) {
					var h = col * NUM_ROWS + row;
					hitHtml += '<td>';
					hitHtml += "<div class='hittype' id='outcome" + h + "'>";
					hitHtml += "<div class='hitcaption'>";
					hitHtml += "<span class='hittext'>" + this.outcome[ h ] + '</span>';
					hitHtml += '</div>';
					hitHtml += '</div></td>';
				}
				hitHtml += '</tr>';
			}

			this.scoreboard.getElementById( 'hitType' ).innerHTML = hitHtml;

			for ( var b = 0; b < 4; b++ ) {
				var plateId = 'plate' + b
				var plate = this.scoreboard.getElementById( plateId );
				if ( plate.getContext ) {
					var context = plate.getContext('2d');
					context.beginPath();
					context.moveTo( 0, 30 );
					context.lineTo( 30, 60 );
					context.lineTo( 60, 30 );
					if ( b == 0 ) {
						context.lineTo( 60, 0 );
						context.lineTo( 0, 0 );
					} else {
						context.lineTo( 30, 0 );
					}
					context.closePath();
					context.stroke();
				}
			}

			this.start()
		}

		start() {
			this.gameOver = false;
			this.inning = 1;
			this.outs = 0;
			this.half = false;
			this.score = [[ 'Away' ], [ 'Home' ]];
			this.rhe = [];
			for ( var i = 0; i <= 1; i++ ) {
				this.rhe[ i ] = [];
				this.rhe[ i ][ 'r' ] = 0;
				this.rhe[ i ][ 'h' ] = 0;
				this.rhe[ i ][ 'e' ] = 0;
			}
			this.bases = [ false, false, false, false ];
		}
	
		windup() {
			if ( this.gameOver ) {
				this.start()
			}
			this.bases[0] = true;
		}

		pitch( btn ) {
			for ( var b = 0; b < NUM_BTNS; b++ ) {
				var cell = this.scoreboard.getElementById( 'outcome' + b )
				cell.style.backgroundColor = '';
			}
		
			var cell = this.scoreboard.getElementById( 'outcome' + btn );
			cell.style.backgroundColor = HUES[ btn ];
		}

		hit( btn ) {
			this.advance = 0;
			switch (this.outcome[ btn ]) {
			case 'Home Run':	// Single
				this.advance += 1;
			case 'Triple':		// Double
				this.advance += 1;
			case 'Double':		// Triple
				this.advance += 1;
			case 'Single':		// Home Run
				this.advance += 1;
				this.rhe[ this.half ? 1 : 0 ][ 'h' ] != null ? this.rhe[ this.half ? 1 : 0 ][ 'h' ]++ : this.rhe[ this.half ? 1 : 0 ][ 'h' ] = 1;
				break;
			case 'Out':		// Out
				this.outs++
				this.advance = 0;
			}
		}

		run() {
			if ( this.advance-- > 0 ) {
				if ( this.bases.pop()) {
					var half = this.half ? 1 : 0;
					this.rhe[ half ][ 'r' ]++;
					if ( isNaN( this.score[ half ][ this.inning ])) {
						this.score[ half ][ this.inning ] = 1;
					} else {
						this.score[ half ][ this.inning ]++;
					}
				}
				this.bases.unshift( false );
				return true;
			} else {
				this.endPlay();
				return false;
			}
		}

		endPlay() {
			if ( this.outs == 3 ) {
				this.retire();
			}
			this.update();
		}

		retire() {
			this.bases = [ false, false, false, false ];
			this.outs = 0;
			this.half = !this.half;
			if ( !this.half ) {
				this.endInning();
			}
		}

		endInning() {
			if ( this.inning >= 9 && ( this.rhe[ 0 ][ 'r' ] != this.rhe[ 1 ][ 'r' ])) {
				this.gameOver = true;
			} else {
				this.inning++;
			}
		}

		update() {
			const AWAY_TEAM = 0;
			const HOME_TEAM = 1;

			var lineScore = function( game ) {
				var scorebox = '<table width=100%>';
				scorebox += '<tr>';
				for ( var inning = 0; inning <= ( game.inning <= 9 ? 9 : game.inning ); inning++ ) {
					scorebox += '<td>' + ( inning == 0 ? 'Team' : inning ) + '</td>'
				}
				scorebox += '<td>&nbsp;</td><td>R</td><td>H</td><td>E</td>'
				scorebox += '</tr>';
				for ( var half = 0; half <= 1; half++ ) {
					scorebox += '<tr id=team' + half + '>';
					for ( var inning = 0; inning <= ( game.inning <= 9 ? 9 : game.inning ); inning++ ) {
						scorebox += '<td>' + ( game.score[ half ][ inning ] != null ? game.score[ half ][ inning ] : 0 ) + '</td>'
					}
					scorebox += '<td>&nbsp;</td><td>' + game.rhe[ half ][ 'r' ] + '</td><td>' + game.rhe[ half ][ 'h' ] + '</td><td>' + game.rhe[ half ][ 'e' ] + '</td>'
					scorebox += '</tr>';
				}
				scorebox += '</table>';
				return scorebox;
			};

			var halfTxt;
			if ( this.half ) {
				halfTxt = "Bottom";
			} else {
				halfTxt = "Top";
			}

			for ( var base = 0; base < 4; base++ ) {
				if ( this.bases[base] ) {
					this.scoreboard.getElementById( 'base'+base ).innerHTML='&#x26be;';
				} else {
					this.scoreboard.getElementById( 'base'+base ).innerHTML=null;
				}
			}

			this.scoreboard.getElementById( 'lineScore' ).innerHTML=lineScore( this );
			if ( this.gameOver ) {
				if ( this.rhe[ 0 ][ 'r' ] > this.rhe[ 1 ][ 'r' ]) {
					this.scoreboard.getElementById( 'team0' ).style = "font-weight: bold;";
				} else {
					this.scoreboard.getElementById( 'team1' ).style = "font-weight: bold;";
				}
				this.scoreboard.getElementById( 'half' ).innerHTML='Final';
				this.scoreboard.getElementById( 'outs' ).innerHTML=3;
			} else {
				this.scoreboard.getElementById( 'outs' ).innerHTML=this.outs;
				this.scoreboard.getElementById( 'half' ).innerHTML=halfTxt;
				this.scoreboard.getElementById( 'inning' ).innerHTML=this.inning;
			}
		}
	};
});