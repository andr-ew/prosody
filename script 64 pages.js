inlets = 1;
outlets = 1;

include("grid.js");
include("andrew.js");

var g = grid.connect();

var LO = 7;
var HI = 11;

var controls = {}
controls.tracks = [];
controls.keys = [];

var pager;

var update = function(h, i, j, v) {
	if (controls[h][i][j].v != v) {
		controls[h][i][j].event(v);
		controls[h][i][j].v = v;
		
		output(h, i, j, controls[h][i][j].output(controls.tracks[i][j].v));
	}
	
	controls[h][i][j].draw(g);
	
	g.refresh();
}


g.event = function(x, y, z) {
	for(h in controls) {
		for(var i = 0; i < controls[h].length; i++) {
			for(j in controls[h][i]) {
				if(controls[h][i][j].look(x, y, z)) {
					for(l in controls[h][i]) {
						if(!(controls[h][i][j].ispattern) && controls[h][i][l].ispattern) {
							controls[h][i][l].store(h, i, j, controls[h][i][j].v);
						}
					}
					
					output(h, i, j, controls[h][i][j].output(controls.tracks[i][j].v));
				}
				
				controls[h][i][j].draw(g);
			}
		}
	}
	
	pager.look(x, y, z);
	pager.draw(g);
	
	g.refresh();
}

var redraw = function() {
	g.all(0);
	for(h in controls) {
		for(var i = 0; i < controls[h].length; i++) {
			for(j in controls[h][i]) {
				if(controls[h][i][j].draw) controls[h][i][j].draw(g);
				//output(h, i, j, controls[h][i][j].output(controls.tracks[i][j].v));
			}
		}
	}
	
	pager.draw(g);
}

var refresh = function() {
	g.all(0);
	for(h in controls) {
		for(var i = 0; i < controls[h].length; i++) {
			for(j in controls[h][i]) {
				if(controls[h][i][j].draw) controls[h][i][j].draw(g);
				output(h, i, j, controls[h][i][j].output(controls.tracks[i][j].v));
			}
		}
	}
	
	pager.draw(g);
}

input["tracks"] = function(n) {
	if(n[0] == "pos") {
		if(1) {
			controls.tracks[n[1]].cut.v = Math.round(n[2] * (7/16));
			controls.tracks[n[1]].cut.draw(g);
			
			//if(n[0] == 0)
	 		g.refresh();
		}
	}
	else if(n[0] == "m") {
		controls.tracks[n[1]].m.v = n[2];
		controls.tracks[n[1]].m.draw(g);
		output("tracks", n[1], "m", controls.tracks[n[1]].m.output(controls.tracks[n[1]].m.v));
		
		refresh();
		g.refresh();
	}
}

var Track = function(n, pg1, pg2, buffg) {
	var row = [];
	for(var i = 0; i < 7; i++) row[i] = i;
	var rowb = [];
	for(var i = 0; i < 7; i++) rowb[i] = 0;
	
	//this.n = n;
	this.r = new Toggle(0, [8, n], [LO, HI], pg1);
	this.m = new Toggle(0, [9, n], [0, HI], pg1);
	this.p1 = new Pattern(0, [10, n], [0, LO, HI], pg1, update);
	//this.p2 = new Pattern(0, [11, n], [0, LO, HI], pg1, update);
	this.rev = new Toggle(0, [11, n], [LO, HI], pg1);
	this.s = new Value(2, [[12, 13, 14, 15], n], [[0, 0, LO, 0, 0], HI], pg1);
	this.s.output = function(v) { return v - 2; }
	
	//this.b = new Value(n, [[11, 12, 13, 14], n], [[0, 0, 0, 0], HI], pg1);
	
	this.cut = new Value(-1, [[8,9,10,11,12,13,14], n + 4], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], pg2);
	this.cut.look = function() {};
	
	this.jump = new Value(-1, [[8,9,10,11,12,13,14], n + 4], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], pg2);
	this.jump.draw = function() {}
	this.jump.output = function(v) { return Math.round(v * (16/7)); }
		
	this.lvl = new Fader(6, [[8, 14], n + 4], [0, HI, LO], function() { return pager.v == 1; });
	this.lvl.output = function(v) { return v / 6; }
		
	this.pan = new Crossfader(3, [[8, 14], n + 4], [0, HI, LO], function() { return pager.v == 2; });
	this.pan.output = function(v) { return v / 14; }
		
	//this.fb = new Fader(0, [[0, 10], n + 4], [0, HI, LO], function() { return pager.v == 3; });
	//this.fb.output = function(v) { return v / 10; }
		
	//this.route = new Value(n, [[11, 12, 13, 14], n + 4], [[0,0,0,0], HI], function() { return pager.v == 3; });
}

var Keyboard = function(n, p, o) {
	this.keyb7 = new Momentaries([], [[0,1,2,3,4,5,6,7], 7], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], p);
	this.keyb6 = new Momentaries([], [[0,1,2,3,4,5,6,7], 6], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], p);
	this.keyb5 = new Momentaries([], [[0,1,2,3,4,5,6,7], 5], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], p);
	this.keyb4 = new Momentaries([], [[0,1,2,3,4,5,6,7], 4], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], p);
	this.keyb3 = new Momentaries([], [[0,1,2,3,4,5,6,7], 3], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], p);
	this.keyb2 = new Momentaries([], [[0,1,2,3,4,5,6,7], 2], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], p);
	this.keyb1 = new Momentaries([], [[0,1,2,3,4,5,6,7], 1], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], p);
	this.keyb0 = new Momentaries([], [[0,1,2,3,4,5,6,7], 0], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], p);
	
	//this.p0 = new Pattern(0, [14, n], [0, LO, HI], p, update);
	//this.p1 = new Pattern(0, [14, n + 1], [0, LO, HI], p, update);
	//this.p2 = new Pattern(0, [14, n + 2], [0, LO, HI], p, update);
	//this.p3 = new Pattern(0, [14, n + 3], [0, LO, HI], p, update);
	
	for(var i = 0; i < 7; i++) {
		this["keyb" + i].scale = [];
		this["keyb" + i].marks = [];
		this["keyb" + i].root = 0;
		this["keyb" + i].oct = 0;
		
		this["keyb" + i].tune = function(scale, marks, root, oct) {
			this.scale = scale;
			this.marks = marks;
			this.root = root;
			this.oct = oct;
			
			this.b[0] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			
			for(var j = -Math.ceil(this.p[0].length / this.scale.length); j < Math.ceil(this.p[0].length / this.scale.length); j++) {
				for(var k = 0; k < this.marks.length; k++) {
					this.b[0][this.marks[k] + (j * this.scale.length) - this.root] = LO;
				}
			}
		
			redraw();
		}
			
		this["keyb" + i].event = function(v, last, add, rem) {
			var key;
			var gate;
			
			if(add != -1) {
				key = add;
				gate = 1;
			}
			else if(rem != -1) {
				key = rem;
				gate = 0;
			}
			key += this.root;
			key = this.scale[key % this.scale.length] + ((Math.floor(key / this.scale.length) + this.oct) * 12);
			
			output(o, "midi", "midievent", 144, key, gate * 64);
		}
		
		this["keyb" + i].tune([2,4,7,9,11], [0,3], 0, i + 2);
	}
}

var init = function() {	
	pager = new Value(0, [15, [4, 5, 6, 7]], [[LO, LO, LO, LO], HI], function() { return 1 }); 
	pager.event = function(v) {
		this.v = v;
		
		redraw();
	}
	
	for(var i = 0; i < 4; i++) {
 		controls.tracks[i] = new Track(i, function() { return 1; }, function() { return pager.v == 0; }, [0,1,2,3]);
		
		for(j in controls.tracks[i]) {
			if(controls.tracks[i][j].draw) {
				controls.tracks[i][j].draw(g);
				
				output(i, j, controls.tracks[i][j].output(controls.tracks[i][j].v));
			}
		}
	}
	
	controls.keys[0] = new Keyboard(4, function() { return 1; }, "keys");
	
	pager.draw(g);

	g.refresh();
}