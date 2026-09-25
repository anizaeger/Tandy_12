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
CLASS:			Song_Writer
DESCRIPTION:		Game logic
----------------------------------------------------------------------------- */
define([], function() {
	return class Song_Writer {
		constructor( os, id ) {
			this.os = os;
			this.id = id;
			this.os.sysMem = this;
			this.song = [];
			this.playing = false;
			this.os.seqClear();
		}

		btnClick( btnName ) {
			switch( btnName ) {
			case 'start':
				this.os.seqClear();
				this.newSong = true;
				this.playing = false;
				break;
			case 'select':
				if ( !this.playing ) {
					this.os.selectPgm( this.id );
				} else {
					this.os.seq.repeat = false;
				}
				break;
			case 'space':
				if ( !this.playing ){
					this.os.seqAdd( '-' );
				}
				break;
			case 'playhit':
				if ( !( this.playing || this.newSong )) {
					this.playing = true;
					this.os.seqStart();
				}
				break;
			case 'repeat':
				this.os.seq.repeat = true;
				break;
			}
		}

		button( btn, state ) {
			if ( !this.playing ) {
				this.newSong = false;
				this.os.blast( btn, state );
				if ( state ) {
					this.os.seqAdd( btn );
				}
			}
		}

		seqEnd() {
			this.playing = false;
		}
	};
});