inlets = 1;
outlets = 1;

include("grid.js");
include("andrew.js");

var g = grid.connect();

var LO = 7;
var HI = 11;

var nav1;
var nav2;
var top = 0;
var bottom = 0;

var controls = {}
controls.tracks = [];
controls.keys = [];

var Track = function(n, pg1, pg2, buffg) {
	var row = [];
	for(var i = 0; i < 15; i++) row[i] = i;
	var rowb = [];
	for(var i = 0; i < 15; i++) rowb[i] = 0;
	
	//this.n = n;
	this.r = new Toggle(0, [0, n], [LO, HI], pg1);
	this.m = new Toggle(0, [1, n], [0, HI], pg1);
	this.p1 = new Pattern(0, [2, n], [0, LO, HI], pg1, update);
	this.p2 = new Pattern(0, [3, n], [0, LO, HI], pg1, update);
	this.rev = new Toggle(0, [4, n], [LO, HI], pg1);
	this.s = new Value(3, [[5, 6, 7, 8, 9, 10], n], [[0, 0, 0, LO, 0, 0], HI], pg1);
	this.b = new Value(n, [[11, 12, 13, 14], n], [[0, 0, 0, 0], HI], pg1);
	this.b.output = function() { return buffg[this.v] }
	
	this.cut = new Value(-1, [[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], n + 4], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], pg2);
	this.cut.look = function() {};
	
	this.jump = new Value(-1, [[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], n + 4], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], pg2);
	this.jump.draw = function() {}
}

var Tuner = function(n, p, keyboard) {
	var kpage = 0;

	this.scale = new Toggles([2,4,6,9,11], [[0, 1,2,3,4,5,6,7,8,9,10,11], 0], [[0,0,0,0,0,0,0,0,0,0,0,0], HI], function() { return page[0] == 3; });
	this.marks = new Toggles([0, 3], [[], 1], [[0,0,0,0,0,0,0,0,0,0,0,0], LO], function() { return page[0] == 3; });
	
	this.kpages =  new Value(0, [[10, 11, 12, 13], 3], [[LO,LO,LO,LO], HI], p);
	this.kpages.event = function(v) {
		kpage = v;
		redraw();
	}
	
	
	this.root0 = new Value(0, [[0,1,2,3,4,5,6,7,8,9,10,11], 2], [[0,0,0,0,0,0,0,0,0,0,0,0], HI], function() { return p() && kpage == 0; });
	this.root1 = new Value(0, [[0,1,2,3,4,5,6,7,8,9,10,11], 2], [[0,0,0,0,0,0,0,0,0,0,0,0], HI], function() { return p() && kpage == 0 });
	this.root2 = new Value(0, [[0,1,2,3,4,5,6,7,8,9,10,11], 2], [[0,0,0,0,0,0,0,0,0,0,0,0], HI], function() { return p() && kpage == 0 });
	this.root3 = new Value(0, [[0,1,2,3,4,5,6,7,8,9,10,11], 2], [[0,0,0,0,0,0,0,0,0,0,0,0], HI], function() { return p() && kpage == 0 });
	
	this.oct0 = new Value(3, [[0,1,2,3,4,5,6,7,8,9], 3], [[0,0,0,0,0,LO,0,0,0,0], HI], function() { return p() && kpage == 0; });
	this.oct1 = new Value(4, [[0,1,2,3,4,5,6,7,8,9], 3], [[0,0,0,0,0,LO,0,0,0,0], HI], function() { return p() && kpage == 1; });
	this.oct2 = new Value(5, [[0,1,2,3,4,5,6,7,8,9], 3], [[0,0,0,0,0,LO,0,0,0,0], HI], function() { return p() && kpage == 2; });
	this.oct3 = new Value(6, [[0,1,2,3,4,5,6,7,8,9], 3], [[0,0,0,0,0,LO,0,0,0,0], HI], function() { return p() && kpage == 3; });
	
	var scale = this.scale;
	var marks = this.marks;
	
	var roots = [this.root0, this.root1, this.root2, this.root3];
	var octs = [this.osct0, this.oct1, this.oct2, this.oct3];
	
	this.scale.event = function() {
		marks.p[0] = [];
		
		for(var i = 0; i < scale.v.length; i++) {
			marks.p[0].push(scale.p[0][controls.scale.v[i]]);
			//controls.marks.p[0].sort();
		}
		
		for(var i = 0; i < 4; i++) {
			roots[i].p[0] = [];
		
			for(var j = 0; j < scale.v.length; j++) {
				roots[i].p[0].push(scale.p[0][scale.v[j]]);
				//controls.marks.p[0].sort();
			}
		}
		
		marks.event();
		redraw();
	}
	
	var keyboard = keyboard;
	
	this.marks.event = function(v) {
		for(var i = 0; i < 4; i++) {
			keyboard["keyb" + i].tune(scale, marks, roots[i], octs[i]);
		}
	}
	
	for(var i = 0; i < 4; i++) {
		roots[i].event = function(v) {
			this.v = v;
			
			scale.event();
		}
		
		octs[i].event = function(v) {
			this.v = v;
			
			scale.event();
		}
	}
	
	scale.event();
}

var Keyboard = function(n, p, o) {
	this.keyb3 = new Momentaries([], [[0,1,2,3,4,5,6,7,8,9,10,11,12,13], n], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], p);
	this.keyb2 = new Momentaries([], [[0,1,2,3,4,5,6,7,8,9,10,11,12,13], n + 1], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], p);
	this.keyb1 = new Momentaries([], [[0,1,2,3,4,5,6,7,8,9,10,11,12,13], n + 2], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], p);
	this.keyb0 = new Momentaries([], [[0,1,2,3,4,5,6,7,8,9,10,11,12,13], n + 3], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], p);
	
	//this.p0 = new Pattern(0, [14, n], [0, LO, HI], p, update);
	//this.p1 = new Pattern(0, [14, n + 1], [0, LO, HI], p, update);
	//this.p2 = new Pattern(0, [14, n + 2], [0, LO, HI], p, update);
	//this.p3 = new Pattern(0, [14, n + 3], [0, LO, HI], p, update);
	
	for(var i = 0; i < 4; i++) {
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
		
		this["keyb" + i].tune([2,4,7,9,11], [0,3], 0, i + 3);
	}
}

var update = function(h, i, j, v) {
	if (controls[h][i][j].v != v) {
		controls[h][i][j].event(v);
		controls[h][i][j].v = v;
		
		output(h, i, j, controls[h][i][j].output());
	}
	
	controls[h][i][j].draw(g);
	
	g.refresh();
}

g.event = function(x, y, z) {
	if(x < 15) {
		for(h in controls) {
			for(var i = 0; i < controls[h].length; i++) {
				for(j in controls[h][i]) {
					if(controls[h][i][j].look(x, y, z)) {
						for(l in controls[h][i]) {
							if(!(controls[h][i][j].ispattern) && controls[h][i][l].ispattern) {
								controls[h][i][l].store(h, i, j, controls[h][i][j].v);
							}
						}
						
						output(h, i, j, controls[h][i][j].output());
					}
					
					controls[h][i][j].draw(g);
				}
			}
		}
		
		g.refresh();
	}
	else {
		nav1.look(x, y, z);
		nav1.draw(g);
		
		nav2.look(x, y, z);
		nav2.draw(g);
		
		g.refresh();
	}
}

var redraw = function() {
	g.all(0);
	for(h in controls) {
		for(var i = 0; i < controls[h].length; i++) {
			for(j in controls[h][i]) {
				if(controls[h][i][j].draw) controls[h][i][j].draw(g);
				output(h, i, j, controls[h][i][j].output());
			}
		}
	}
	
	nav1.draw(g);
	nav2.draw(g);
}

input["tracks"] = function(n) {
	if(n[0] == "pos") {
		if(bottom == 0 || bottom == 1) {
			controls.tracks[n[1]].cut.v = n[2];
			controls.tracks[n[1]].cut.draw(g);
			
			//if(n[0] == 0)
	 		g.refresh();
		}
	}
	else if(n[0] == "m") {
		controls.tracks[n[1]].m.v = n[2];
		controls.tracks[n[1]].m.draw(g);
		
		redraw();
		g.refresh();
	}
}

var init = function() {	
	nav1 = new Value(0, [15, [0, 1, 2, 3]], [[0, 0, 0, 0], HI], function() { return 1 });
	nav1.event = function(v) {
		top = v;
		redraw();
	}
	
	nav2 = new Value(0, [15, [4, 5, 6, 7]], [[0, 0, 0, 0], HI], function() { return 1 } );
	nav2.event = function(v) {
		bottom = v;
		redraw();
	}
	
	for(var i = 0; i < 4; i++) {
 		controls.tracks[i] = new Track(i, function() { return top == 0 }, function() { return bottom == 0 }, [0,1,2,3]);
		
		for(j in controls.tracks[i]) {
			if(controls.tracks[i][j].draw) {
				controls.tracks[i][j].draw(g);
				
				output(i, j, controls.tracks[i][j].output());
			}
		}
	}
	
	for(var i = 4; i < 8; i++) {
 		controls.tracks[i] = new Track(i - 4, function() { return top == 1 }, function() { return bottom == 1 }, [4,5,6,7]);
		
		for(j in controls.tracks[i]) {
			if(controls.tracks[i][j].draw) {
				controls.tracks[i][j].draw(g);
				
				output(i, j, controls.tracks[i][j].output());
			}
		}
	}
	
	controls.keys[0] = new Keyboard(4, function() { return bottom == 2 }, "keys")
	
	nav1.draw(g);
	nav2.draw(g);
	
	g.refresh();
}