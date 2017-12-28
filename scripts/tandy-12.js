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

// Program to launch upon powering up Tandy--12
const STARTUP_PROG = 'Picker';

const GAMES = [
	'Organ',
	'Song_Writer',
	'Repeat',
	'Torpedo',
	'Tag_It',
	'Roulette',
	'Baseball',
	'Repeat_Plus',
	'Treasure_Hunt',
	'Compete',
	'Fire_Away',
	'Hide_N_Seek'
];

// Various constants for configuring user interface.
const NUM_BTNS = 12;
const NUM_ROWS = 4;
const NUM_COLS = 3;

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

class Manpage {
	constructor() {
		this.manFrame = document.getElementById('manpage');
	}
	setManpage( app ) {
		this.manFrame.src = 'man/' + app + '.html';
	}
}

/* -----------------------------------------------------------------------------
CLASS:			Tandy12
DESCRIPTION:		Simulates the hardware aspects of the Tandy-12
----------------------------------------------------------------------------- */

class Tandy12 {
	constructor() {
		this.clock = new Clock( this );
		this.osc = new Osc();
		this.power = null;
		this.os = null;
		this.doc = new Manpage();

		this.lights = new Array(NUM_BTNS);
		for ( var light = 0; light < NUM_BTNS; light++ ) {
			this.lights[ light ] = new Light( light );
		}


		this.flasher = new Flasher( this );

		this.setPower();
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Hardware::setPower
	DESCRIPTION:		Generates HTML code for Tandy-12 buttons and adds them
				to the main page.
	----------------------------------------------------------------------------- */
	setPower() {
		this.power = document.getElementById('switch').checked;
		if ( this.power ) {
			this.power = true;
			this.getInput = true;
			this.os = new OpSys( this, this.doc );
		} else {
			this.power = false;
			this.osc.play( false );
			this.clock.stop();
			this.os = null;
			for ( var light = 0; light < NUM_BTNS; light++ ) {
				this.lights[ light ].lit( false );
			}
			this.doc.setManpage('main');
		}
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Hardware::button
	DESCRIPTION:		Process presses and releases of main game buttons.
	----------------------------------------------------------------------------- */
	button( btn, state ) {
		// Only accept 
		if ( this.getInput == state ) {
			this.getInput = !state;
			if ( this.power && this.os != null ) {
				this.os.button( btn, state );
			}
		}
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Hardware::light
	DESCRIPTION:		Manipulate individual and groups of lights.
	----------------------------------------------------------------------------- */
	light( num, state ) {
		if ( this.power ) {
			if ( Array.isArray( num )) {	// Perform action on group of lights
				for ( var idx = 0; idx < num.length; idx++ ) {
					if ( num[ idx ] >= 0 && num[ idx ] < NUM_BTNS )
						this.lights[ num[ idx ]].lit( state );
				}
			} else {	// Perform action on individual light.
				if ( num >= 0 && num < NUM_BTNS )
					this.lights[ num ].lit( state );
			}
		}
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Hardware::tone
	DESCRIPTION:		Pass audio commands to Oscillator.
	----------------------------------------------------------------------------- */
	tone( tone, state ) {
		if ( this.power ) {
			if ( !Array.isArray( tone )) {
				this.osc.play( tone, state );
			}
		}
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Hardware::blast
	DESCRIPTION:		Active light and tone associated with particular button.
	----------------------------------------------------------------------------- */
	blast( btn, state ) {
		this.light( btn, state );
		this.tone( btn, state );
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Hardware::darken
	DESCRIPTION:		Turn off all lights.
	----------------------------------------------------------------------------- */
	darken() {
		for ( var num = 0; num < NUM_BTNS; num++ ) {
			this.light( num, false );
		}
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Hardware::clockTick
	DESCRIPTION:		Receive ticks from Clock and pass on to Flasher and OpSys.
	----------------------------------------------------------------------------- */
	clockTick( timeStamp ){
		if ( this.power && this.os != null ) {
			this.flasher.clockTick();
			this.os.clockTick( timeStamp );
		}
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Hardware::endSeq
	DESCRIPTION:		Notify OpSys that Flasher has completed cycle count.
	----------------------------------------------------------------------------- */
	endSeq( label ) {
		this.os.endSeq( label )
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Hardware::click
	DESCRIPTION:		Process auxiliary buttons.
	----------------------------------------------------------------------------- */
	click( type ) {
		if ( this.power && this.os != null ) {
			this.os.btnClick( type );
		}
	}
}

/* -----------------------------------------------------------------------------
CLASS:			Light
DESCRIPTION:		Simulates Tandy-12 lights.
----------------------------------------------------------------------------- */
class Light {
	constructor(num) {
		this.num = num;
		this.id = 'mainBtn'+this.num
		this.light = document.getElementById(this.id);
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Light::hue
	DESCRIPTION:		Store list of colors for individual lights.
	RETURNS:		Color of associated light number
	----------------------------------------------------------------------------- */
	hue( num ) {
		var hues = ["Indigo","Orange","Magenta","SpringGreen","Blue","Cyan","Yellow","Salmon","Lime","Red","Violet","Brown"];
		return hues[ num ];
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Light::lit
	DESCRIPTION:		Sets state of light by dynamically altering background
				color:
					true - on
					false - off
	----------------------------------------------------------------------------- */
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

	/* -----------------------------------------------------------------------------
	FUNCTION:		Light::shadeBlend
	DESCRIPTION:		Calculate new value for color after applying shading.
	----------------------------------------------------------------------------- */
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

/* -----------------------------------------------------------------------------
CLASS:			Osc
DESCRIPTION:		Simulates Tandy-12 tone generator.
----------------------------------------------------------------------------- */
class Osc {
	constructor() {
		this.context = new (window.AudioContext || window.webkitAudioContext)();
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Osc::tone
	DESCRIPTION:		Store list of tones for individual buttons.
	RETURNS:		Frequency of associated button number
	----------------------------------------------------------------------------- */
	freq( tone ) {	
		var freqs = [ 293, 330, 370, 392, 440, 494, 554, 587, 659, 740, 247, 277 ];
		return freqs[ tone ];
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Osc::play
	DESCRIPTION:		Start/stop tone generator for specied tone.
	RETURNS:		Frequency of associated button number
	----------------------------------------------------------------------------- */
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

/* -----------------------------------------------------------------------------
CLASS:			Clock
DESCRIPTION:		Simulates Tandy-12 clock pulse generator.
----------------------------------------------------------------------------- */
class Clock {
	constructor( hw ) {
		this.hw = hw;
		this.timeStamp = 0;
		this.timer = null;
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Clock::reset
	DESCRIPTION:		Reset clock by stopping and restarting.
	----------------------------------------------------------------------------- */
	reset() {
		this.stop();
		this.tick();
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Clock::tick
	DESCRIPTION:		Generate clock pulse.  After pulsing, set timer to
				generate another pulse.
	----------------------------------------------------------------------------- */
	tick() {
		this.hw.clockTick( this.timeStamp++ );

		var tmpThis = this;
		this.timer = setTimeout( function() {
			tmpThis.tick();
		}, 500);
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Clock::stop
	DESCRIPTION:		Stop clock.
	----------------------------------------------------------------------------- */
	stop() {
		clearTimeout( this.timer );
	}
};

/* -----------------------------------------------------------------------------
CLASS:			Flasher
DESCRIPTION:		Flash light(s) off and on.
----------------------------------------------------------------------------- */
class Flasher {
	constructor( hw ) {
		this.hw = hw;
		this.reset();
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Flasher::clockTick
	DESCRIPTION:		Receive hardware clock pulses and flash lights
				accordingly.
	----------------------------------------------------------------------------- */
	clockTick() {
		if ( this.run ) {
			if ( this.state ) {
				if ( this.cycles )
					++this.count;
				this.on();
				this.state = !this.state;
			} else {
				this.off();
				if ( this.cycles && this.count >= this.cycles ) {
					this.stop();
					this.hw.endSeq( this.label );
				} else {
					this.state = !this.state;
				}
			}
		}
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Flasher::start
	DESCRIPTION:		Set flasher mode, cycle count, and label, then start
				cycling.
	----------------------------------------------------------------------------- */
	start( btn, label, cycles = 0, light, tone ) {
		this.light = light;
		this.tone = tone ;
		this.btn = btn;

		this.label = label;
		this.cycles = cycles;

		if ( !( this.light || this.tone )) {
			this.light = true;
			this.tone = true;
		}

		this.count = 0;
		this.run = true;
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Flasher::stop
	DESCRIPTION:		Stop flasher and reinitialize settings.
	----------------------------------------------------------------------------- */
	stop() {
		this.reset();
		this.off();
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Flasher::reset
	DESCRIPTION:		Initialize settings
	----------------------------------------------------------------------------- */
	reset() {
		this.run = false;
		this.state = false;
		this.light = false;
		this.tone = false;
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Flasher::on
	DESCRIPTION:		Turn on specified lights and tone.
	----------------------------------------------------------------------------- */
	on() {
		if ( this.light )
			this.hw.light( this.btn, true );
		if ( this.tone )
			this.hw.tone( this.btn, true );
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Flasher::off
	DESCRIPTION:		Turn off lights and tone.
	----------------------------------------------------------------------------- */
	off() {
		for ( var btn = 0; btn < NUM_BTNS; btn++ ) {
			this.hw.blast( btn, false );
		}
	}
};

/* -----------------------------------------------------------------------------
CLASS:			Sequencer
DESCRIPTION:		Handles outputting light and tone sequences.
----------------------------------------------------------------------------- */
class Sequencer{
	constructor( os ) {
		this.os = os;
		this.seq = [];
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Flasher::load
	DESCRIPTION:		Load desired sequence into memory, and set output mode.
	----------------------------------------------------------------------------- */
	load( tones, label, light = true, note = true ) {
		this.label = label;
		this.seq.length = 0;
		this.seq = tones.slice();
		this.len = this.seq.length;
		this.light = light;
		this.note = note;
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Flasher::clockTick
	DESCRIPTION:		Step through sequence one element at a time per clock
				tick.
	----------------------------------------------------------------------------- */
	clockTick() {
		if ( this.run ) {
			this.os.clear();
			if ( this.pos == this.len ) {
				if ( this.repeat ) {
					this.pos = 0;
				} else {
					this.stop();
				}
			} else {
				var note = this.seq[ this.pos++ ];
				if ( note >= 0 && note < NUM_BTNS ) {
					this.os.blast( note, true, this.light, this.note );
				}
			}
			return true;
		} else {
			return false;
		}
	}

	/* -----------------------------------------------------------------------------
	FUNCTION:		Flasher::start
	DESCRIPTION:		Begin playback of sequence.
	----------------------------------------------------------------------------- */
	start() {
		this.pos = 0;
		this.os.clkReset();
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
	constructor( hw, doc ) {
		this.hw = hw;
		this.doc = doc;
		this.timeStamp = null;
		this.sysMem = new ( eval( STARTUP_PROG ))( this );
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
		this.clear();
		this.sysMem = null;
		this.sysMem = new Picker( this, id );
	}

	randRange( min, max ) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * ( max - min + 1 )) + min;
	}

	randBtn() {
		var btn = this.randRange( 0, NUM_BTNS - 1 );
		return btn;
	}

	button( btn, state ) {
		if ( typeof this.sysMem.button == "function" ) {
			this.sysMem.button( btn, state );
		}
	}

	btnCol( btn ) {
		var col = Math.floor(( btn / NUM_BTNS ) * NUM_COLS );
		return col;
	}

	btnRow( btn ) {
		var row = btn - ( this.btnCol( btn ) * NUM_ROWS );
		return row
	}

	startSeq( tones, label, light, tone ) {
		this.seq.load( tones, label, light, tone );
		this.seq.start();
	}

	endSeq( label ) {
		if ( typeof this.sysMem.endSeq === "function" ) {
			this.sysMem.endSeq( label );
		}
	}

	playBip( btn = 7, label, light = false, tone = true ) {
		var tmpThis = this;
		setTimeout( function() {
			tmpThis.blast( btn, true, light, tone );
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

	blast( btn, state = true, light = true, tone = true ) {
		if ( light )
			this.hw.light( btn, state );
		if ( tone )
			this.hw.tone( btn, state );
	}

	flash( btn, label, cycles = 0, light = true, tone = true ) {
		this.hw.flasher.reset();
		this.hw.flasher.start( btn, label, cycles, light, tone );
	}

	clear() {
		this.hw.flasher.stop();
		for ( var num = 0; num < NUM_BTNS; num++ ) {
			this.hw.light( num, false );
			this.hw.tone( num, false );
		}
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
		this.os.clear();
		if ( this.btnNum < NUM_BTNS ) {
			this.os.blast(this.btnNum++, true);
		} else {
			this.os.selectPgm();
		}
	}
};

class Picker {
	constructor( os, id = 0 ) {
		this.os = os;
		this.os.sysMem = this;
		this.btnNum = id;
		this.select = false;
		this.pages = [
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
		this.os.doc.setManpage('picker');
	}

	clockTick() {
		if ( !this.select ) {
			this.os.flash( this.btnNum, '', 0, true, false );
			this.select = true;
		}
	}

	button( btn, state ) {
		if ( state ) {
			this.btnNum = btn;
			this.select = false;
		}
	}

	btnClick( btnName ) {
		switch ( btnName ) {
		case 'start':
			this.os.clear();
			this.os.playBip( this.btnNum, 'loadPgm', true );
			break;
		case 'select':
			if ( this.select ){
				this.select = false;
				if ( ++this.btnNum >= NUM_BTNS ) {
					this.btnNum = 0;
				}
			}
			break;
		}
	}

	endBip( label ) {
		switch( label ) {
		case 'loadPgm':
			this.os.sysMem = null;
			this.os.sysMem = new (eval( GAMES[ this.btnNum ]))( this.os, this.btnNum );
			this.os.doc.setManpage( this.pages[ this.btnNum ]);
			break;
		}
	}
};

/*
Organ
*/

class Organ {
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

class Song_Writer {
	constructor( os, id ) {
		this.os = os;
		this.id = id;
		this.os.sysMem = this;
		this.song = [];
		this.newSong = false;
		this.playing = false;
	}

	btnClick( btnName ) {
		switch( btnName ) {
		case 'start':
			this.clear();
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

	clear() {
		this.song.length = 0;
		this.newSong = false;
	}

	addNote( btn ) {
		if ( this.newSong ) {
			this.clear();
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

class Repeat {
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
			this.startGame();
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
				if ( btn == this.seq[ this.count ]) {
					this.count++
				} else {
					this.gameOver = true;
				}
			} else {
				if ( this.gameOver ) {
					this.loss();
				} else if ( this.count >= this.seq.length ) {
					this.os.playBip( 7, 'success' );
				}
			}
		}
	}

	endBip( label ) {
		switch( label ) {
		case 'success':
			this.genSeq();
			break;
		}
	}

	genSeq() {
		this.count = 0;
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

			break;
		}
	}

	flashScore() {
		if (( this.seq.len - 1 ) < 12 ) {
			this.endSeq( 'gameOver' );
		} else if (( this.seq.len - 1 ) >= 12 && ( this.seq.len - 1 ) <= 22 ) {
			this.os.flash( 0, 'gameOver', 3 );
		} else if (( this.seq.len - 1 ) >= 23 && ( this.seq.len - 1 ) <= 33 ) {
			this.os.flash( 1, 'gameOver', 3 );
		} else if (( this.seq.len - 1 ) >= 34 ) {
			this.os.flash( 2, 'gameOver', 3 );
		}
	}
};

/*
Torpedo
*/

class Torpedo {
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
		this.gameOver = true;
		this.os.startSeq([0,0,2,4,5,2,5,'-',7,7,8,4,7,7,7,'-'], 'win');
	}

	loss() {
		this.gameOver = true;
		this.os.flash( this.sub, 'loss', 3 );
	}

	endSeq( label ) {
		this.startGame();
	}
};

/*
Tag-It
*/

class Tag_It {
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
				this.newBtn = false;
				this.btnNum = this.os.randBtn();
				this.os.playBip( this.btnNum, '', true, true );
				this.getInput = true;
			} else {
				this.newBtn = true;
				if ( ++this.count > 110 )
					this.endGame();
			}
		} else if ( this.getScore ) {	// Show final score
			this.getScore = false;
			this.showScore();
		}
	}

	start() {
		this.count = 0;
		this.score = 0;
		this.inPlay = true;
	}

	endGame() {
		this.inPlay = false;
		this.getScore = true;
	}

	showScore() {
		if ( this.score < 10 ) {
			
		} else if ( this.score < 20 ) {
			this.os.flash( 0, '', 3 );
		} else if ( this.score < 30 ) {
			this.os.flash( 1, '', 3 );
		} else if ( this.score < 40 ) {
			this.os.flash( 2, '', 3 );
		} else if ( this.score < 50 ) {
			this.os.flash( 3, '', 3 );
		} else if ( this.score < 60 ) {
			this.os.flash( 4, '', 3 );
		} else if ( this.score < 70 ) {
			this.os.flash( 5, '', 3 );
		} else if ( this.score < 80 ) {
			this.os.flash( 6, '', 3 );
		} else if ( this.score < 90 ) {
			this.os.flash( 7, '', 3 );
		} else if ( this.score < 100 ) {
			this.os.flash( 8, '', 3 );
		} else if ( this.score < 110 ) {
			this.os.flash( 9, '', 3 );
		} else {
			this.os.flash( 10, '', 3 );
		}

		this.os.selectPgm( this.id );
	}
};

/*
Roulette
*/

class Roulette {
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
				this.os.flasher = true;
				this.os.clear();
				this.os.blast( this.wheel[ this.idx ], true);
			} else {
				this.os.flash( this.wheel[ this.idx ], 'gameOver', 3 );
				this.btnEnable = true;
			}
		}
	}

	spin() {
		this.btnEnable = false;
		this.ticks = this.os.randRange(11,40);
		this.count = 0;
		this.idx = this.wheel.length;
		this.os.clkReset();
	}

	endSeq( label ) {
		this.btnEnable = true;
	}

};

/*
Baseball
*/

class Baseball {
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
			this.os.clear();
			this.os.blast( this.btnNum, true );
		} else if ( this.hit ) {
			this.hit = false;
			this.os.flash( this.btnNum, 'hit', 3 );
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
			this.os.flash( this.btnNum, '', 0, true, false );
			this.run = true;
			break;
		}
	}
};

class Scoreboard{
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
		const AWAY_TEAM = 0;
		const HOME_TEAM = 1;
		var manpage = document.getElementById('manpage');
		var scoreboard = manpage.contentDocument? manpage.contentDocument: manpage.contentWindow.document;
		var halfTxt;
		if ( this.half ) {
			halfTxt = "Bottom";
		} else {
			halfTxt = "Top";
		}
		scoreboard.getElementById( 'half' ).innerHTML=halfTxt;
		scoreboard.getElementById( 'inning' ).innerHTML=this.inning;
		for ( var base = 0; base < 4; base++ ) {
			if ( this.bases[base] ) {
				scoreboard.getElementById( 'base'+base ).innerHTML='*';
			} else {
				scoreboard.getElementById( 'base'+base ).innerHTML='&nbsp;';
			}
		}
		scoreboard.getElementById( 'outs' ).innerHTML=this.outs;
		scoreboard.getElementById( 'away' ).innerHTML=this.score[ AWAY_TEAM ];
		scoreboard.getElementById( 'home' ).innerHTML=this.score[ HOME_TEAM ];
	}
}

/*
Repeat Plus
*/

class Repeat_Plus {
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
		this.os.startSeq( this.seq, 'genSeq' )
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
		this.os.startSeq([0,0,0,0,7,0,7,0,7,0], 'loss');
	}

	endBip( label ) {
		switch( label ) {
		case 'success':
			this.endSeq('genSeq');
			break;
		}
	}

	endSeq( type ) {
		switch( type ) {
		case 'genSeq':
			this.count = 0;
			this.newTurn = false;
			this.getInput = true;
			break;
		case 'loss':
			this.flashScore();
			break;
		case 'gameOver':

			break;
		}
	}

	flashScore() {
		if (( this.seq.len - 1 ) < 12 ) {
			this.endSeq( 'gameOver' );
		} else if (( this.seq.len - 1 ) >= 12 && ( this.seq.len - 1 ) <= 22 ) {
			this.os.flash( 0, 'gameOver', 3 );
		} else if (( this.seq.len - 1 ) >= 23 && ( this.seq.len - 1 ) <= 33 ) {
			this.os.flash( 1, 'gameOver', 3 );
		} else if (( this.seq.len - 1 ) >= 34 ) {
			this.os.flash( 2, 'gameOver', 3 );
		}
	}
};

/*
Treasure Hunt
*/

class Treasure_Hunt {
	constructor( os, id ) {
		this.os = os;
		this.id = id;
		this.os.sysMem = this;
		this.seq = [];
		this.presses = [];
		this.gameOver = true;
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
		if ( this.gameOver )
			return;
		if ( this.getInput || !state ) {
			this.os.blast( btn, state );
		}
		if ( state ) {
			this.presses[ this.tries++ ] = btn;
		} else {
			if ( this.tries == 3) {
				this.getInput = false;
				this.score();
			}
		}
	}

	start() {
		for ( var idx = 0; idx < 3; idx++ ) {
			this.seq[ idx ] = this.os.randBtn();
		}
		this.gameOver = false;
		this.getInput = true;
		this.tries = 0;
	}

	score() {
		var matches = 0;
		for ( var idx = 0; idx < 3; idx++ ) {
			if ( this.seq[ idx ] == this.presses[ idx ]) {
				matches++;
			}
		}
		switch( matches ) {
		case 0:
			this.loss();
			break;
		case 1:
			this.os.flash( 0, 'score', 3 );
			break;
		case 2:
			this.os.startSeq([ 1, 0, 1, 0, 1, 0 ], 'score');
			break;
		case 3:
			this.win();
			break;
		}
	}

	endSeq( label ) {
		switch ( label ) {
		case 'score':
			if ( !this.gameOver ) {
				this.tries = 0;
				this.getInput = true;
			}
			break;
		case 'gameOver':
			this.gameOver = true;
			break;	
		}
	}

	win() {
		this.os.startSeq([ 5, 5, 5, '-', 1, 2, 1, 2 ], 'gameOver' );
	}

	loss() {
		this.os.startSeq( this.seq, 'gameOver' );
	}
}

/*
Compete
*/

class Compete {
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
			this.os.startSeq([ 8, 9, 10, 11, 10, 9, 8 ], 'win', true, false );
		} else {
			this.os.startSeq([ 0, 1, 2, 3, 2, 1, 0 ], 'win', true, false );
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
				this.os.flash( this.curBtn, 'inPlay', 3, true, false );
				this.target = [ this.curBtn - 4, this.curBtn + 4 ];
			} else {
				this.steps++;
			}
		}
	}

	endSeq( label ) {
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

/*
Fire Away
*/

class Fire_Away {
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

class Hide_N_Seek {
	constructor( os, id ) {
		this.os = os;
		this.id = id;
		this.os.sysMem = this;
		this.seq = [];
		this.presses = [];
		this.gameOver = true;
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
		// Only process button press if game isn't over
		if ( this.gameOver || btn < 8 || btn > 11)
			return;
		if ( this.getInput || !state ) {
			this.os.blast( btn, state );
		}
		if ( state ) {
			this.presses[ this.tries++ ] = btn;
		} else {
			if ( this.tries == 3) {
				this.getInput = false;
				this.score();
			}
		}
	}

	start() {
		// Generate new sequence
		this.seq.length = 0;
		for ( var idx = 0; idx < 3; idx++ ) {
			var randBtn = this.os.randRange( 8, 11 )
			this.seq[ idx ] = randBtn;
		}

		this.rndCount = this.symCount( this.seq );

		// Begin new game
		this.gameOver = false;
		this.getInput = true;
		this.tries = 0;
	}

	score() {
		var matches = 0;
		var numbers = 0;

		// Count number of matches
		for ( var idx = 0; idx < 3; idx++ ) {
			if ( this.seq[ idx ] == this.presses[ idx ]) {
				matches++;
			}
		}

		if ( matches == 0 ) {
			// No matches
			this.loss();
		} else if ( matches == 3 ) {
			// All matches
			this.win();
		} else {
			// Some matches - count number of correct numbers in wrong position
			var btnCount = this.symCount( this.presses );

			var rndTxt = '';
			var btnTxt = '';

			for ( var idx = 0; idx < 12; idx++ ) {
				var rnd = this.rndCount[ idx ];
				var btn = btnCount[ idx ];


				rndTxt += ' ' + rnd;
				btnTxt += ' ' + btn;

				if ( rnd > 0 && btn > 0 ) {
					if ( rnd > btn ) {
						numbers += btn;
					} else {
						numbers += rnd;
					}
				}
			}

			var matchLights = [];
			switch ( matches ) {
			case 1:
				matchLights = [ 4 ];
				break;
			case 2:
				matchLights = [ 4, 5 ];
				break;
			}

			var numberLights = [];
			switch ( numbers ) {
			case 1:
				numberLights = [ 0 ];
				break;
			case 2:
				numberLights = [ 0, 1 ];
				break;
			case 3:
				numberLights = [ 0, 1, 2 ];
				break;
			}

			var scoreLights = numberLights.concat( matchLights );
			this.os.flash( scoreLights, 'score', 3 );
		}
	}

	symCount( symArray ) {
		var result = [];
		for ( var btn = 0; btn < NUM_BTNS; btn++ ) {
			result[ btn ] = 0;
		}

		for  ( var idx = 0; idx < 3; idx++ ) {
			++result[ symArray[ idx ]]
		}

		return result;
	}

	endSeq( label ) {
		switch ( label ) {
		case 'score':
			if ( !this.gameOver ) {
				this.tries = 0;
				this.getInput = true;
			}
			break;
		case 'gameOver':
			this.gameOver = true;
			this.start();
			break;	
		}
	}

	win() {
		this.os.startSeq([ 5, 5, 5, '-', 1, 2, 1, 2 ], 'gameOver' );
	}

	loss() {
		this.os.startSeq( this.seq, 'gameOver' );
	}
}

/* -----------------------------------------------------------------------------
FUNCTION:		IIFE
DESCRIPTION:		Generates HTML code for Tandy-12 buttons and adds them
			to the main page.
----------------------------------------------------------------------------- */

(function() {
	var btnTxt = ["Organ","Song Writer","Repeat","Torpedo","Tag-It","Roulette","Baseball","Repeat Plus","Treasure Hunt","Compete","Fire Away","Hide'N Seek"];
	var btnNum = 0;
	var boardHtml = ""
	for ( c = 0; c < NUM_COLS; c++ ) {
		boardHtml += '<td align=center>';
		for ( r = 0; r < NUM_ROWS; r++) {
			btnNum = r + ( c * NUM_ROWS );
			boardHtml += '<div class="btnMain" id="mainBtn'+btnNum+'" onMouseDown="hw.button('+btnNum+',true)" onMouseUp="hw.button('+btnNum+',false)">' + (btnNum + 1) + "</div>";
			boardHtml += btnTxt[btnNum];
		}
		boardHtml += "</td>"
	}

	document.getElementById("playfield").innerHTML=boardHtml;

	hw = new Tandy12();
})();
