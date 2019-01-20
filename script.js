inlets = 1;
outlets = 1;

include("grid.js");
include("andrew.js");

var g = grid.connect();

var LO = 7;
var HI = 11;

var pages = [];
var page = 0;

var patterns = [];

var nav = new Value(0, [15, [0, 1, 2, 3, 4, 5, 6, 7]], [[0, 0, 0, 0, 0, 0, 0, 0], HI], function() { return 1; });
nav.event = function(v) {
	page = v;
	redraw();
}

var update = function(j, k, v) {
	for(var i = 0; i < pages.length; i++) {
		
		if(pages[i][j] != null) {
			if (pages[i][j][k].v != v) {
				pages[i][j][k].v = v;
				
				output(j, k, pages[i][j][k].v);
			}
			
			pages[i][j][k].draw(g);
			
			g.refresh();
		}
	}
}

g.event = function(x, y, z) {
	if(x < 15) {
		var i = page;
		if(pages[i]) {
			for(j in pages[i]) {
				for(k in pages[i][j]) {
					if(pages[i][j][k].look(x, y, z)) {
						for(l in pages[i][j]) {
							if(!(pages[i][j][k].ispattern) && pages[i][j][l].ispattern) {
								pages[i][j][l].store(j, k, pages[i][j][k].v);
							}
						}
					}
					
					pages[i][j][k].draw(g);
					
					output(j, k, pages[i][j][k].v);
				}
			}
		}
	}
	else if(x == 15) {
		nav.look(x, y, z);
		nav.draw(g);
	}
	
	g.refresh();
}

var redraw = function() {
	g.all(0);
	
	for(i in pages[page]) {
		for(j in pages[page][i]) {
			pages[page][i][j].draw(g);
		}
	}
	
	nav.draw(g);
	
	g.refresh();
}

input = function(n) {
	for(var i = 0; i < pages.length; i++) {
		//for 
	}
}

var Track = function(n, p) {
	var row = [];
	for(var i = 0; i < 15; i++) row[i] = i;
	var rowb = [];
	for(var i = 0; i < 15; i++) rowb[i] = 0;
	
	//this.n = n;
	this.r = new Toggle(0, [0, n], [LO, HI], p);
	this.m = new Toggle(0, [1, n], [0, HI], p);
	this.rev = new Toggle(0, [2, n], [LO, HI], p);
	this.s = new Value(3, [[3, 4, 5, 6, 7, 8], n], [[0, 0, 0, LO, 0, 0], HI], p);
	this.b = new Value(n, [[9, 10, 11, 12], n], [[0, 0, 0, 0], HI], p);
	this.p = new Pattern(0, [14, n], [0, LO, HI], p, update);
}

var Cut = function(n, p) {
	this.cut = new Value(-1, [[0,1,2,3,4,5,6,7,8,9,10,11,12,13], n + 4], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], p);
	
	this.cut.look = function(x, y, z) {
		if(this.pg()) {
			if(y == this.p[1] && z == 1) {
				for(var i = 0; i < this.p[0].length; i++) {
					if(this.p[0][i] == x) {
						output("track", n, "jump", x);
						break;
					}
				}
			}
		}
	}
}

/*
input["track"] = function(n) {
	if(n[0] == "pos") {
		if(page[1] == 0) {
			tracks[n[1]].cut.v = n[2];
			tracks[n[1]].cut.draw(g);
			
			//if(n[0] == 0)
	 		g.refresh();
		}
	}
	else if(n[0] == "m") {
		tracks[n[1]].m.v = n[2];
		tracks[n[1]].m.draw(g);
		g.refresh();
	}
}
*/

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
	
	this.p0 = new Pattern(0, [14, n], [0, LO, HI], p, update);
	this.p1 = new Pattern(0, [14, n + 1], [0, LO, HI], p, update);
	this.p2 = new Pattern(0, [14, n + 2], [0, LO, HI], p, update);
	this.p3 = new Pattern(0, [14, n + 3], [0, LO, HI], p, update);
	
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
			key = this.scale[key % this.scale.length] + ((Math.floor(key / this.scale.length) + this.oct) * this.scale.length);
			
			output(o, "key", key, gate);
			
			/*
			if(gate) {
				controls.kpages.v = this.index;
				controls.kpages.event(this.index);
			}*/
		}
		
		this["keyb" + i].tune([2,4,6,9,11], [0,3], 0, i + 3);
	}
}
var init = function() {
	interfaces = [
		
	]
	
	pages = [
		{
			"track 0": new Track(0, function() { return page == 0; }, "track 0"),
			"track 1": new Track(1, function() { return page == 0; }, "track 1"),
			"track 2": new Track(2, function() { return page == 0; }, "track 2"),
			"track 3": new Track(3, function() { return page == 0; }, "track 3"),
			"keyboard": new Keyboard(4, function() { return page == 0; }, "keyboard")
		}
	];
	
	redraw();
}