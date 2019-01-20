inlets = 1;
outlets = 1;

include("grid.js");
include("andrew.js");

var g = grid.connect();

var LO = 7;
var HI = 11;

var pages = [];
var top = 0;
var bottom = 0;

var nav1 = new Value(0, [15, [0, 1, 2, 3]], [[0, 0, 0, 0], HI], function() { return 1; });
nav1.event = function(v) {
	top = v;
	redraw();
}

var nav2 = new Value(0, [15, [4, 5, 6, 7]], [[0, 0, 0, 0], HI], function() { return 1; });
nav2.event = function(v) {
	bottom = v;
	redraw();
}


var update = function(i, j, v) {
	if (pages[i][j].v != v) {
		pages[i][j].v = v;
		
		output(i, j, pages[i][j].v);
	}
	
	pages[i][j].draw(g);
	
	g.refresh();
}

g.event = function(x, y, z) {
	if(x < 15) {
		for(var i = 0; i < pages.length; i++) {
			for(j in pages[i]) {
				if(pages[i][j].look(x, y, z)) {
					for(l in pages[i]) {
						if(!(pages[i][j].ispattern) && pages[i][l].ispattern) {
							pages[i][l].store(i, j, pages[i][j].v);
						}
					}
				}
				
				pages[i][j].draw(g);
				
				output(i, j, pages[i][j].v);
			}
		}
	}
	else if(x == 15) {
		nav1.look(x, y, z);
		nav1.draw(g);
		
		nav2.look(x, y, z);
		nav2.draw(g);
	}
	
	g.refresh();
}

var redraw = function() {
	g.all(0);
	
	for(var i = 0; i < pages.length; i++) {
		for(j in pages[i]) {
			pages[i][j].draw(g);
		}
	}
	
	nav1.draw(g);
	nav2.draw(g);
	
	g.refresh();
}

input = function(n) { //-----------------------
	update(n[0], n[1], n[2]);
}

var Loop = function(n, p) {
	var row = [];
	for(var i = 0; i < 15; i++) row[i] = i;
	var rowb = [];
	for(var i = 0; i < 15; i++) rowb[i] = 0;
	
	//this.n = n;
	
	this.r0 = new Toggle(0, [0, n], [LO, HI], p);
	this.m0 = new Toggle(0, [1, n], [0, HI], p);
	this.rev0 = new Toggle(0, [2, n], [LO, HI], p);
	this.s0 = new Value(3, [[3, 4, 5, 6, 7, 8], n], [[0, 0, 0, LO, 0, 0], HI], p);
	this.b0 = new Value(n, [[9, 10, 11, 12], n], [[0, 0, 0, 0], HI], p);
	this.p0 = new Pattern(0, [14, n], [0, LO, HI], p, update);
	
	this.r1 = new Toggle(0, [0, n + 1], [LO, HI], p);
	this.m1 = new Toggle(0, [1, n + 1], [0, HI], p);
	this.rev1 = new Toggle(0, [2, n + 1], [LO, HI], p);
	this.s1 = new Value(3, [[3, 4, 5, 6, 7, 8], n + 1], [[0, 0, 0, LO, 0, 0], HI], p);
	this.b1 = new Value(n + 1, [[9, 10, 11, 12], n + 1], [[0, 0, 0, 0], HI], p);
	this.p1 = new Pattern(0, [14, n + 1], [0, LO, HI], p, update);
	
	this.r2 = new Toggle(0, [0, n + 2], [LO, HI], p);
	this.m2 = new Toggle(0, [1, n + 2], [0, HI], p);
	this.rev2 = new Toggle(0, [2, n + 2], [LO, HI], p);
	this.s2 = new Value(3, [[3, 4, 5, 6, 7, 8], n + 2], [[0, 0, 0, LO, 0, 0], HI], p);
	this.b2 = new Value(n + 2, [[9, 10, 11, 12], n + 2], [[0, 0, 0, 0], HI], p);
	this.p2 = new Pattern(0, [14, n + 2], [0, LO, HI], p, update);
	
	this.r3 = new Toggle(0, [0, n + 3], [LO, HI], p);
	this.m3 = new Toggle(0, [1, n + 3], [0, HI], p);
	this.rev3 = new Toggle(0, [2, n + 3], [LO, HI], p);
	this.s3 = new Value(3, [[3, 4, 5, 6, 7, 8], n + 3], [[0, 0, 0, LO, 0, 0], HI], p);
	this.b3 = new Value(n + 3, [[9, 10, 11, 12], n + 3], [[0, 0, 0, 0], HI], p);
	this.p3 = new Pattern(0, [14, n + 3], [0, LO, HI], p, update);
}

var Cut = function(n, p) {
	this.cut0 = new Value(-1, [[0,1,2,3,4,5,6,7,8,9,10,11,12,13], n + 0], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], p);
	this.cut1 = new Value(-1, [[0,1,2,3,4,5,6,7,8,9,10,11,12,13], n + 1], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], p);
	this.cut2 = new Value(-1, [[0,1,2,3,4,5,6,7,8,9,10,11,12,13], n + 2], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], p);
	this.cut3 = new Value(-1, [[0,1,2,3,4,5,6,7,8,9,10,11,12,13], n + 3], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], p);
	
	this.cut0.look = function(x, y, z) {
		if(this.pg()) {
			if(y == this.p[1] && z == 1) {
				for(var i = 0; i < this.p[0].length; i++) {
					if(this.p[0][i] == x) {
						output(0, "cut0", x);
						break;
					}
				}
			}
		}
	}
	
	this.cut1.look = function(x, y, z) {
		if(this.pg()) {
			if(y == this.p[1] && z == 1) {
				for(var i = 0; i < this.p[0].length; i++) {
					if(this.p[0][i] == x) {
						output(0, "cut1", x);
						break;
					}
				}
			}
		}
	}
	
	this.cut2.look = function(x, y, z) {
		if(this.pg()) {
			if(y == this.p[1] && z == 1) {
				for(var i = 0; i < this.p[0].length; i++) {
					if(this.p[0][i] == x) {
						output(0, "cut2", x);
						break;
					}
				}
			}
		}
	}
	
	this.cut3.look = function(x, y, z) {
		if(this.pg()) {
			if(y == this.p[1] && z == 1) {
				for(var i = 0; i < this.p[0].length; i++) {
					if(this.p[0][i] == x) {
						output(0, "cut3", x);
						break;
					}
				}
			}
		}
	}
	
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
	pages = [
		new Loop(0, function() { return top == 0; }),
		new Cut(4, function() { return bottom == 0; })
	];
	
	redraw();
}