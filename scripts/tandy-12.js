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

var hw;

/* -----------------------------------------------------------------------------
FUNCTION:		gplAlert
DESCRIPTION:		Print GPL license text to alert box
RETURNS:		Nothing (Void Function)
----------------------------------------------------------------------------- */

function gplAlert() {
	var copyTxt = "";
	copyTxt += "Copyright (C) 2017 Anakin-Marc Zaeger\n"
	copyTxt += "\n"
	copyTxt += "\n"
	copyTxt += "The JavaScript code in this page is free software: you can\n"
	copyTxt += "redistribute it and/or modify it under the terms of the GNU\n"
	copyTxt += "General Public License (GNU GPL) as published by the Free Software\n"
	copyTxt += "Foundation, either version 3 of the License, or (at your option)\n"
	copyTxt += "any later version.  The code is distributed WITHOUT ANY WARRANTY;\n"
	copyTxt += "without even the implied warranty of MERCHANTABILITY or FITNESS\n"
	copyTxt += "FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.\n"
	copyTxt += "\n"
	copyTxt += "As additional permission under GNU GPL version 3 section 7, you\n"
	copyTxt += "may distribute non-source (e.g., minimized or compacted) forms of\n"
	copyTxt += "that code without the copy of the GNU GPL normally required by\n"
	copyTxt += "section 4, provided you include this license notice and a URL\n"
	copyTxt += "through which recipients can access the Corresponding Source.\n"
	window.alert(copyTxt)
}

/* -----------------------------------------------------------------------------
FUNCTION:		printBoard
DESCRIPTION:		Generates HTML code for Tandy-12 buttons and adds them
			to the main page.
RETURNS:		int: menuTier - 1
----------------------------------------------------------------------------- */

function printBoard() {
	var btnTxt = ["Organ","Song Writer","Repeat","Torpedo","Tag-It","Roulette","Baseball","Repeat Plus","Treasure Hunt","Compete","Fire Away","Hide'N Seek"];
	var btnNum = 0;
	var boardHtml = ""
	for ( c = 0; c < 3; c++ ) {
		boardHtml += '<td align=center>';
		for ( r = 0; r < 4; r++) {
			btnNum = r + ( c * 4 );
			boardHtml += '<div class="btnMain" id="mainBtn'+btnNum+'" onMouseDown="hw.button('+btnNum+',true)" onMouseUp="hw.button('+btnNum+',false)">' + (btnNum + 1) + "</div>";
			boardHtml += btnTxt[btnNum];
		}
		boardHtml += "</td>"
	}

	document.getElementById("playfield").innerHTML=boardHtml;

	
}

/* -----------------------------------------------------------------------------
CLASS:			Hardware
DESCRIPTION:		Asks user to select an input file
RETURNS:		int: menuTier - 1
----------------------------------------------------------------------------- */

class Hardware {
	constructor() {
		this.clock = new Clock( this );
		this.osc = new Osc();
		this.power = null;
		this.os = null;

		this.lights = new Array(12);
		for ( var light = 0; light < 12; light++ ) {
			this.lights[ light ] = new Light( light );
		}

		this.flasher = new Flasher( this );

		this.setPower();
	}

	setPower() {
		this.power = document.getElementById('switch').checked;
		if ( this.power ) {
			this.power = true;
			this.os = new OpSys( this );
		} else {
			this.power = false;
			this.osc.play( false );
			this.clock.stop();
			this.os = null;
			for ( var light = 0; light < 12; light++ ) {
				this.lights[ light ].lit( false );
			}
			document.getElementById('manpage').src = 'about:blank';
		}
	}

	button( btn, state ) {
		if ( this.power && this.os != null ) {
			this.os.button( btn, state );
		}
	}

	light( num, state ) {
		if ( this.power ) {
			this.lights[ num ].lit( state );
		}
	}

	tone( tone, state ) {
		if ( this.power ) {
			this.osc.play( tone, state );
		}
	}

	blast( btn, state ) {
		this.light( btn, state );
		this.tone( btn, state );
	}

	clockTick( timeStamp ){
		if ( this.power && this.os != null && typeof this.os.clockTick === "function" ) {
			this.flasher.clockTick();
			this.os.clockTick( timeStamp );
		}
	}

	endSeq( label ) {
		this.os.endSeq( label )
	}

	click( type ) {
		if ( this.power && this.os != null ) {
			this.os.btnClick( type );
		}
	}
}

class Light {
	constructor(num) {
		this.num = num;
		this.id = 'mainBtn'+this.num
		this.light = document.getElementById(this.id);
	}

	hue( btn ) {
		var hues = ["Indigo","Orange","Magenta","SpringGreen","Blue","Cyan","Yellow","Salmon","Lime","Red","Violet","Brown"];
		return hues[ btn ];
	}

	lit( state ) {
		if ( state ) {
			this.light.style.backgroundColor = this.hue(this.num);
		} else {
			this.light.style.backgroundColor = this.hue(this.num);
			var origBgColor = window.getComputedStyle(this.light).getPropertyValue('background-color');
			var newBgColor = this.shadeBlend(-.75,origBgColor);
			this.light.style.backgroundColor = newBgColor;
		}
	}

	shadeBlend( p, c0, c1 ) {
		var n = p < 0 ? p * -1 : p,
		u = Math.round,
		w = parseInt;
		if ( c0.length > 7 ) {
			var f = c0.split(","),
			t = ( c1 ? c1 : p < 0 ? "rgb(0,0,0)" : "rgb(255,255,255)" ).split(","),
			R = w( f[0].slice(4)),
			G = w( f[1]),
			B = w(f[2]);
			return "rgb(" + ( u(( w( t[0].slice(4)) - R ) * n ) + R ) + "," + ( u(( w( t[1]) - G ) * n ) + G ) + "," + ( u(( w( t[2]) - B ) * n ) + B ) + ")";
		} else {
			var f = w ( c0.slice(1), 16 ),
			t = w(( c1 ? c1 : p < 0 ? "#000000" : "#FFFFFF" ).slice(1), 16 ),
			R1 = f >> 16,
			G1 = f >> 8 & 0x00FF,
			B1 = f & 0x0000FF;
			return "#" + ( 0x1000000 + ( u ((( t >> 16 ) - R1 ) * n ) + R1 ) * 0x10000 + ( u((( t >> 8 & 0x00FF ) - G1 ) * n ) + G1 ) * 0x100 + ( u ((( t & 0x0000FF ) - B1 ) * n ) + B1 )).toString(16).slice(1);
		}
	}
};

class Osc {
	constructor() {
		this.context = new (window.AudioContext || window.webkitAudioContext)();
	}

	freq( tone ) {	
		var freqs = [ 293, 330, 370, 392, 440, 494, 554, 587, 659, 740, 247, 277 ];
		return freqs[ tone ];
	}

	play( tone, state ) {
		if (!(typeof this.osc === 'undefined' || this.osc === null)) {
			this.osc.stop();
		}
		if ( state ) {
			this.osc = this.context.createOscillator();
			this.osc.type = 'square';
			this.osc.frequency.value = this.freq( tone );
			this.osc.connect(this.context.destination);
			this.osc.start();
		}
	}
};

class Clock {
	constructor( hw ) {
		this.hw = hw;
		this.timeStamp = 0;
		this.timer = null;
	}

	reset() {
		clearTimeout( this.timer );
		this.tick();
	}

	tick() {
		this.hw.clockTick( this.timeStamp++ );

		var tmpThis = this;
		this.timer = setTimeout( function() {
			tmpThis.tick();
		}, 500);
	}

	stop() {
		clearTimeout( this.timer );
	}
};

class Flasher {
	constructor( hw ) {
		this.hw = hw;
		this.reset();
		this.state = true;
	}

	clockTick() {
		if ( this.run ) {
			if ( this.state ) {
				if ( this.cycles )
					++this.count;
				this.on();
				this.state = false;
			} else {
				this.off();
				if ( this.cycles && this.count >= this.cycles ) {
					this.stop();
					if ( typeof this.hw.endSeq === "function" ) {
						this.hw.endSeq( this.label );
					}
				} else {
					this.state = true;
				}
			}
		}
	}

	start( btn, label, cycles = 0 ) {
		if ( btn < 0 || btn > 11 ) {
			return;
		} else {
			this.btn = btn;
		}

		this.label = label;
		this.cycles = cycles;

		if ( !( this.light || this.tone )) {
			this.light = true;
			this.tone = true;
		}

		this.count = 0;
		this.run = true;
	}

	stop() {
		this.run = false;
		this.off();
		this.reset();
	}

	reset() {
		this.run = false;
		this.light = false;
		this.tone = false;
	}

	on() {
		if ( this.light )
			this.hw.light( this.btn, true );
		if ( this.tone )
			this.hw.tone( this.btn, true );
	}

	off() {
		for ( var btn = 0; btn < 12; btn++ ) {
			this.hw.blast( btn, false );
		}
	}
};

class Sequencer{
	constructor( os ) {
		this.os = os;
		this.seq = [];
	}

	load( tones, label ) {
		this.label = label;
		this.seq.length = 0;
		this.seq = tones.slice();
		this.len = this.seq.length;
		this.pos = 0;
		this.os.clkReset();
		this.start();
	}

	clockTick() {
		if ( this.run ) {
			this.os.blastClear();
			if ( this.pos == this.len ) {
				if ( this.repeat ) {
					this.pos = 0;
				} else {
					this.stop();
				}
			} else {
				var note = this.seq[this.pos++];
				if ( note >= 0 && note <= 11 ) {
					this.os.blast( note, true );
				}
			}
			return true;
		} else {
			return false;
		}
	}

	start() {
		this.run = true;
	}

	stop() {
		this.run = false;
		var tmpThis = this;
		setTimeout( function() {
			tmpThis.os.endSeq( tmpThis.label );
		}, 125);
	}
};

class OpSys {
	constructor( hw ) {
		this.hw = hw;
		this.timeStamp = null;
		this.sysMem = new Boot( this );
		this.seq = new Sequencer( this );
		this.clkReset();
	}

	clockTick( timeStamp ) {
		this.timeStamp = timeStamp;

		if ( !this.seq.clockTick()) {
			if ( typeof this.sysMem.clockTick === "function" ) {
				this.sysMem.clockTick( timeStamp );
			}
		}
	}

	clkReset() {
		this.hw.clock.reset();
	}

	selectPgm( id ) {
		this.blastClear();
		this.sysMem = null;
		this.sysMem = new Picker( this, id );
	}

	randRange( min, max ) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	randBtn() {
		var btn = this.randRange(0,11);
		return btn;
	}

	button( btn, state ) {
		if ( typeof this.sysMem.button == "function") {
			this.sysMem.button( btn, state );
		}
	}

	btnCol( btn ) {
		var col = Math.floor(( btn / 12 ) * 3 );
		return col;
	}

	btnRow( btn ) {
		var row = btn - ( this.btnCol( btn ) * 4 );
		return row
	}

	light( num, state ) {
		this.hw.light( num, state );
	}

	lightFlash( btns, label, cycles = 0 ) {
		this.hw.flasher.reset();
		this.hw.flasher.light = true;
		this.hw.flasher.start( btns, label, cycles );
	}

	lightClear() {
		this.hw.flasher.stop();
		for ( var btn = 0; btn < 12; btn++ ) {
			this.light( btn, false );
		}
	}

	tone( num, state ) {
		this.hw.tone( num, state );
	}

	toneFlash( btns, label, cycles = 0 ) {
		this.hw.flasher.reset();
		this.hw.flasher.tone = true;
		this.hw.flasher.start( btns, label, cycles );
	}

	toneClear() {
		this.hw.flasher.stop();
		for ( var num = 0; num < 12; num++ ) {
			this.tone( num, false );
		}
	}

	startSeq( tones, label ) {
		this.seq.load( tones, label );
	}

	endSeq( label ) {
		if ( typeof this.sysMem.endSeq === "function" ) {
			this.sysMem.endSeq( label );
		}
	}

	playBip( label, btn = 7, light = false ) {
		var tmpThis = this;
		setTimeout( function() {
			if ( light ) {
				tmpThis.blast( btn, true );
			} else {
				tmpThis.tone( btn, true );
			}
			setTimeout( function() {
				tmpThis.blast( btn, false );
				setTimeout( function() {
					if ( typeof tmpThis.sysMem.endBip === "function" ) {
						tmpThis.sysMem.endBip( label )
					}
				}, 500);
			}, 250);
		}, 125);
	}

	blast( btn, state ) {
		this.light( btn, state );
		this.tone( btn, state );
	}

	blastFlash( btns, label, cycles = 0 ) {
		this.hw.flasher.reset();
		this.hw.flasher.start( btns, label, cycles );
	}

	blastClear() {
		this.lightClear();
		this.toneClear();
	}

	btnClick( btnName ) {
		if ( typeof this.sysMem.btnClick == "function") {
			this.sysMem.btnClick( btnName );
		}
	}
};

class Boot {
	constructor( os ) {
		this.os = os;
		this.btnNum = 0;
	}

	clockTick() {
		this.os.blastClear();
		if ( this.btnNum < 12 ) {
			this.os.blast(this.btnNum++, true);
		} else {
			this.os.selectPgm();
		}
	}
};

class Manpage {
	constructor( app ) {
		this.manFrame = document.getElementById('manpage');
		this.pages = [
			'picker',
			'organ',
			'song-writer',
			'repeat',
			'torpedo',
			'tag-it',
			'roulette',
			'baseball',
			'repeat-plus',
			'treasure-hunt',
			'compete',
			'fire-away',
			'hide-n-seek'
		]
	}
	setManpage( app ) {
		this.manFrame.src = 'man/' + this.pages[ app ] + '.html';
	}
}

class Picker {
	constructor( os, id = 0 ) {
		this.os = os;
		this.os.sysMem = this;
		this.doc = new Manpage();
		this.btnNum = id;
		this.select = false;
		this.doc.setManpage(0);
	}

	clockTick() {
		if ( !this.select ) {
			this.os.lightFlash( this.btnNum );
			this.select = true;
		}
	}

	button( btn, state ) {
		if ( state ) {
			this.select = false;
			this.btnNum = btn;
		}
	}

	btnClick( btnName ) {
		switch ( btnName ) {
		case 'start':
			this.os.blastClear();
			this.doc.setManpage( this.btnNum + 1);
			this.os.sysMem = null;
			this.os.playBip('picker', this.btnNum, true);
			this.os.sysMem = new (eval( 'Game' +  this.btnNum ))( this.os, this.btnNum );
			break;
		case 'select':
			if ( this.select ){
				this.select = false;
				if ( ++this.btnNum >= 12 ) {
					this.btnNum = 0;
				}
			}
			break;
		}
	}
};

/*
Organ
*/

class Game0 {
	constructor( os, id ) {
		this.os = os;
		this.id = id;
		this.os.sysMem = this;
	}

	btnClick( btnName ) {
		switch( btnName ) {
		case 'select':
			this.os.selectPgm( this.id );
			break;
		}
	}

	button( btn, state ) {
		this.os.blast( btn, state );
	}
};

/*
Song Writer
*/

class Game1 {
	constructor( os, id ) {
		this.os = os;
		this.id = id;
		this.os.sysMem = this;
		this.song = new Array();
		this.newSong = false;
		this.playing = false;
	}

	btnClick( btnName ) {
		switch( btnName ) {
		case 'select':
			if ( !this.playing ) {
				this.os.selectPgm( this.id );
			} else {
				this.os.seq.repeat = false;
			}
			break;
		case 'space':
			if ( !this.playing ){
				this.addNote( '-' );
			}
			break;
		case 'playhit':
			if ( !this.playing ) {
				this.playStart();
			}
			break;
		case 'repeat':
			this.os.seq.repeat = true;
		}
	}

	button( btn, state ) {
		if ( !this.playing ) {
			this.os.blast( btn, state );
			if ( state ) {
				this.addNote( btn );
			}
		}
	}

	addNote( btn ) {
		if ( this.newSong ) {
			this.song.length = 0;
			this.newSong = false;
		}
		if ( this.song.length < 44 ) {
			this.song.push( btn );
		}
	}

	playStart() {
		this.playing = true;
		this.os.startSeq( this.song );
	}

	endSeq() {
		this.playing = false;
		this.newSong = true;
	}
};

/*
Repeat
*/

class Game2 {
	constructor( os, id ) {
		this.os = os;
		this.id = id;
		this.os.sysMem = this;
		this.seq = [];
		this.gameOver = true;
		this.startGame();
	}

	startGame() {
		this.gameOver = false;
		this.seq.length = 0;
		this.genSeq();
	}

	btnClick( btnName ) {
		switch( btnName ) {
		case 'start':
			if ( this.gameOver ) {
				this.startGame();
			}
			break;
		case 'select':
			if ( this.gameOver ) {
				this.os.selectPgm( this.id );
			}
			break;
		}
	}

	button( btn, state ) {
		if ( this.getInput ) {
			this.os.blast( btn, state );
			if ( state ) {
				if ( btn == this.seq[ this.score ]) {
					this.score++
				} else {
					this.gameOver = true;
				}
			} else {
				if ( this.gameOver ) {
					this.loss();
				} else if ( this.score >= this.seq.length ) {
					this.os.playBip();
				}
			}
		}
	}

	endBip() {
		this.genSeq();
	}

	genSeq() {
		this.score = 0;
		this.seq.push( this.os.randBtn());
		this.os.clkReset();
		this.os.startSeq( this.seq, 'genSeq' );
	}

	loss() {
		this.getInput = false;
		this.os.startSeq([0,0,0,0,7,0,7,0,7,0], 'loss');
	}

	endSeq( type ) {
		switch( type ) {
		case 'genSeq':
			this.getInput = true;
			break;
		case 'loss':
			this.flashScore();
			break;
		case 'gameOver':
			this.os.selectPgm( this.id );
			break;
		}
	}

	flashScore() {
		if ( this.score < 12 ) {
			this.os.selectPgm( this.id );
		} else if ( this.score >= 12 && this.score <= 22 ) {
			this.os.blastFlash( 0, 'gameOver',3 );
		} else if ( this.score >= 23 && this.score <= 33 ) {
			this.os.blastFlash( 1, 'gameOver',3 );
		} else if ( this.score >= 34 ) {
			this.os.blastFlash( 2, 'gameOver',3 );
		}
	}
};

/*
Torpedo
*/

class Game3 {
	constructor( os, id ) {
		this.os = os;
		this.id = id;
		this.os.sysMem = this;
		this.startGame();
	}

	startGame() {
		this.sub = this.os.randBtn();
		this.subRow = this.os.btnRow( this.sub );
		this.subCol = this.os.btnCol( this.sub );
		this.lastHit = null;
		this.tries = 0;
	}

	btnClick( btnName ) {
		switch( btnName ) {
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
					this.os.playBip();
				}
			}
		}
	}

	win() {
		this.os.startSeq([0,0,2,4,5,2,5,'-',7,7,8,4,7,7,7,'-'], 'win');
	}

	loss() {
		this.os.blastFlash( this.sub, 'loss', 3 );
	}

	endSeq( label ) {
		this.os.selectPgm( this.id );
	}
};

/*
Tag-It
*/

class Game4 {
	constructor( os, id ) {
		this.os = os;
		this.id = id;
		this.os.sysMem = this;
	}

	btnClick( btnName ) {
		switch( btnName ) {
		case 'select':
			this.os.selectPgm( this.id );
			break;
		}
	}

	showScore() {
		if ( score < 10 ) {
			
		} else if ( score < 20 ) {
			this.os.blastFlash(0,3);
		} else if ( score < 30 ) {
			this.os.blastFlash(1,3);
		} else if ( score < 40 ) {
			this.os.blastFlash(2,3);
		} else if ( score < 50 ) {
			this.os.blastFlash(3,3);
		} else if ( score < 60 ) {
			this.os.blastFlash(4,3);
		} else if ( score < 70 ) {
			this.os.blastFlash(5,3);
		} else if ( score < 80 ) {
			this.os.blastFlash(6,3);
		} else if ( score < 90 ) {
			this.os.blastFlash(7,3);
		} else if ( score < 100 ) {
			this.os.blastFlash(8,3);
		} else if ( score < 110 ) {
			this.os.blastFlash(9,3);
		} else {
			this.os.blastFlash(10,3);
		}
	}
};

/*
Roulette
*/

class Game5 {
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
			}
		}
	}

	clockTick() {
		if ( !this.btnEnable ) {
			if ( this.count++ < this.ticks ) {
				if ( ++this.idx >= 10 ) {
					this.idx = 0;
				}
				this.os.flasher = true;
				this.os.blastClear();
				this.os.blast( this.wheel[ this.idx ], true);
			} else {
				this.os.blastFlash( this.wheel[ this.idx ], 'gameOver', 3 );
				this.btnEnable = true;
			}
		}
	}

	spin() {
		this.btnEnable = false;
		this.ticks = this.os.randRange(11,20);
		this.count = 0;
		this.idx = this.wheel.length;
		this.os.clkReset();
	}

	endSeq( label ) {
		this.os.selectPgm( this.id );
	}

};

/*
Baseball
*/

class Game6 {
	constructor( os, id ) {
		this.os = os;
		this.id = id;
		this.scoreboard = new Baseball( this );
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
			this.pitchBall = true;
			this.hit = false;
			this.run = false;
			this.scoreboard.pitch();
			break;
		case 'playhit':
			this.hitBall();
			break;
		}
	}

	clockTick() {
		this.scoreboard.update();
		if ( this.pitchBall ) {
			this.os.flasher = true;
			this.btnNum = this.os.randBtn();
			this.os.blastClear();
			this.os.blast( this.btnNum, true );
		} else if ( this.hit ) {
			this.hit = false;
			this.os.blastFlash( this.btnNum, 'hit', 3 );
		} else if ( this.run ) {
			this.run = this.scoreboard.run();
		}
	}

	hitBall() {
		this.pitchBall = false;
		this.hit = true;
	}

	endSeq( label ) {
		switch( label ) {
		case 'hit':
			this.scoreboard.hit( this.btnNum );
			this.os.lightFlash( this.btnNum );
			this.run = true;
			break;
		}
	}
};

class Baseball{
	constructor( game ) {
		this.game = game;
		this.outcome = [ 'Triple','Out','Out','Single','Out','Home Run','Out','Out','Single','Out','Double','Out' ];
		this.outs = null;
		this.start()
	}

	start() {
		this.inning = 1;
		this.outs = 0;
		this.half = false;
		this.score = [ 0, 0 ];
		this.bases = [ false, false, false, false ];
	}
	
	pitch() {
		this.bases[0] = true;
	}

	hit( btn ) {
		switch (this.outcome[ btn ]) {
		case 'Single':		// Single
			this.advance = 1;
			break;
		case 'Double':		// Double
			this.advance = 2;
			break;
		case 'Triple':		// Triple
			this.advance = 3;
			break;
		case 'Home Run':	// Home Run
			this.advance = 4;
			break;
		case 'Out':		// Out
			this.outs++
			this.advance = 0;
		}
	}

	run() {
		if ( this.advance-- > 0 ) {
			if ( this.bases.pop()) {
				this.score[ this.half ? 1 : 0 ]++
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
			this.bases = [ false, false, false, false ];
			this.outs = 0;
			this.half = !this.half;
			if ( !this.half ) {
				this.inning++;
			}
		}
		this.update()
	}

	update() {
		var manpage = document.getElementById('manpage');
		var scoreboard = manpage.contentDocument? manpage.contentDocument: manpage.contentWindow.document;
		var halfTxt;
		if ( this.half ) {
			halfTxt = "Bottom";
		} else {
			halfTxt = "Top";
		}
		scoreboard.getElementById('half').innerHTML=halfTxt;
		scoreboard.getElementById('inning').innerHTML=this.inning;
		for ( var base = 0; base < 4; base++ ) {
			if ( this.bases[base] ) {
				scoreboard.getElementById('base'+base).innerHTML='*';
			} else {
				scoreboard.getElementById('base'+base).innerHTML='&nbsp;';
			}
		}
		scoreboard.getElementById('outs').innerHTML=this.outs;
		scoreboard.getElementById('away').innerHTML=this.score[0];
		scoreboard.getElementById('home').innerHTML=this.score[1];
	}
}

/*
Repeat Plus
*/

class Game7 {
	constructor( os, id ) {
		this.os = os;
		this.id = id;
		this.os.sysMem = this;
	}

	btnClick( btnName ) {
		switch( btnName ) {
		case 'select':
			this.os.selectPgm( this.id );
			break;
		}
	}

	start() {
		
	}

	addBtn() {
		
	}
};

/*
Treasure Hunt
*/

class Game8 {
	constructor( os, id ) {
		this.os = os;
		this.id = id;
		this.os.sysMem = this;
	}

	btnClick( btnName ) {
		switch( btnName ) {
		case 'select':
			this.os.selectPgm( this.id );
			break;
		}
	}
}

/*
Compete
*/

class Game9 {
	constructor( os, id ) {
		this.os = os;
		this.id = id;
		this.os.sysMem = this;
	}

	btnClick( btnName ) {
		switch( btnName ) {
		case 'select':
			this.os.selectPgm( this.id );
			break;
		}
	}

	randBtn() {
		var randBtn = os.randRange(4,7);
		alert(randBtn);
	}

};

/*
Fire Away
*/

class Game10 {
	constructor( os, id ) {
		this.os = os;
		this.id = id;
		this.os.sysMem = this;
	}

	btnClick( btnName ) {
		switch( btnName ) {
		case 'select':
			this.os.selectPgm( this.id );
			break;
		}
	}
};

/*
Hide'N Seek
*/

class Game11 {
	constructor( os, id ) {
		this.os = os;
		this.id = id;
		this.os.sysMem = this;
	}

	btnClick( btnName ) {
		switch( btnName ) {
		case 'select':
			this.os.selectPgm( this.id );
			break;
		}
	}
}

function init() {
	printBoard();
	hw = new Hardware();
};
init();