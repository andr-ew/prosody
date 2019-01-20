inlets = 1;
outlets = 1;

include("grid.js");
include("andrew.js");

var g = grid.connect();

var LO = 7;
var HI = 11;

var page = [0, 0];
var kpage = 0;

var pages = [];
var patterns = [];

var tracks = [];

var controls = [];

var update = function(x, y, z) {
	for(i in controls) {
		if(controls[i].look) controls[i].look(x, y, z);
		if(controls[i].draw) controls[i].draw(g);
		
		output(i, controls[i].v);
	}
	
	for(i in tracks[y % 4]) {
		if(tracks[y % 4][i].look) tracks[y % 4][i].look(x, y, z);
		if(tracks[y % 4][i].draw) tracks[y % 4][i].draw(g);
		
		output("track", y % 4, i, tracks[y % 4][i].v);
	}
	
	g.refresh();
}

g.event = function(x, y, z) {
	if(x < 15) {

		for(var i = 0; i < patterns.length; i++) {
			patterns[i].look(x, y, z);
		}
		
		update(x, y, z);
	}
	else {
		pages[0].look(x, y, z);
		pages[0].draw(g);
		
		pages[1].look(x, y, z);
		pages[1].draw(g);
		
		g.refresh();
	}
}

var redraw = function() {
	g.all(0);
	for(i in controls) {
		if(controls[i].draw) controls[i].draw(g);
	}
	
	for(var i = 0; i < tracks.length; i++) {
		for(j in tracks[i]) {
			if(tracks[i][j].draw) tracks[i][j].draw(g);
		}
	}
	
	pages[0].draw(g);
	pages[1].draw(g);
	
	g.refresh();
}

pages[0] = new Value(0, [15, [0, 1, 2, 3]], [[0, 0, 0, 0], HI], function() { return 1; });
pages[0].event = function(v) {
	page[0] = v;
	redraw();
}

pages[1] = new Value(0, [15, [4, 5, 6, 7]], [[0, 0, 0, 0], HI], function() { return 1; });
pages[1].event = function(v) {
	page[1] = v;
	redraw();
}

controls["p" + 0 + 0] = new Toggle(0, [14, ((0) * 4) + 0], [0, LO, HI], function() { return page[0] == 0; });

for(var i = 0; i < 8; i++) {
	
	for(var j = 0; j < 4; j++) {
		var top = Number(i >= 4);
		
		post((top * 4) + j);
		
		controls["p" + i + j] = new Toggle(0, [14, (top * 4) + j], [0, LO, HI], function() { 
			return page[this.top] == this.page;
		});
		controls["p" + i + j].page = i % 4;
		controls["p" + i + j].top = top;
			
		controls["p" + i + j].draw(g);
		
		patterns[(i * 4) + j] = new Pattern(controls["p" + i + j], update, function() { return page[this.top] == this.page; });
		controls["p" + i + j].page = i % 4;
		controls["p" + i + j].top = top;
		
	}
}

var Track = function(n, p, cp) {
	var row = [];
	for(var i = 0; i < 15; i++) row[i] = i;
	var rowb = [];
	for(var i = 0; i < 15; i++) rowb[i] = 0;
	
	//this.n = n;
	this.r = new Toggle(0, [0, n], [LO, HI], function() { return page[0] == p; });
	this.m = new Toggle(0, [1, n], [0, HI], function() { return page[0] == p; });
	this.rev = new Toggle(0, [2, n], [LO, HI], function() { return page[0] == p; });
	this.s = new Value(3, [[3, 4, 5, 6, 7, 8], n], [[0, 0, 0, LO, 0, 0], HI], function() { return page[0] == p; });
	this.b = new Value(n, [[9, 10, 11, 12], n], [[0, 0, 0, 0], HI], function() { return page[0] == p; });
	this.cut = new Value(-1, [[0,1,2,3,4,5,6,7,8,9,10,11,12,13], n + 4], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], function() { return page[1] == cp; });
	
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

controls.scale = new Toggles([2,4,6,9,11], [[0, 1,2,3,4,5,6,7,8,9,10,11], 0], [[0,0,0,0,0,0,0,0,0,0,0,0], HI], function() { return page[0] == 3; });
controls.marks = new Toggles([0, 3], [[], 1], [[0,0,0,0,0,0,0,0,0,0,0,0], LO], function() { return page[0] == 3; });

controls.kpages =  new Value(0, [[10, 11, 12, 13], 3], [[LO,LO,LO,LO], HI], function() { return page[0] == 3; });
controls.kpages.event = function(v) {
	kpage = v;
	redraw();
}

controls.rows = {}

controls.rows.root = [];
controls.rows.root[0] = new Value(0, [[0,1,2,3,4,5,6,7,8,9,10,11], 2], [[0,0,0,0,0,0,0,0,0,0,0,0], HI], function() { return page[0] == 3 && kpage == 0; });
controls.rows.root[1] = new Value(0, [[0,1,2,3,4,5,6,7,8,9,10,11], 2], [[0,0,0,0,0,0,0,0,0,0,0,0], HI], function() { return page[0] == 3 && kpage == 1; });
controls.rows.root[2] = new Value(0, [[0,1,2,3,4,5,6,7,8,9,10,11], 2], [[0,0,0,0,0,0,0,0,0,0,0,0], HI], function() { return page[0] == 3 && kpage == 2; });
controls.rows.root[3] = new Value(0, [[0,1,2,3,4,5,6,7,8,9,10,11], 2], [[0,0,0,0,0,0,0,0,0,0,0,0], HI], function() { return page[0] == 3 && kpage == 3; });

controls.rows.oct = [];
controls.rows.oct[0] = new Value(3, [[0,1,2,3,4,5,6,7,8,9], 3], [[0,0,0,0,0,LO,0,0,0,0], HI], function() { return page[0] == 3 && kpage == 0; });
controls.rows.oct[1] = new Value(4, [[0,1,2,3,4,5,6,7,8,9], 3], [[0,0,0,0,0,LO,0,0,0,0], HI], function() { return page[0] == 3 && kpage == 1; });
controls.rows.oct[2] = new Value(5, [[0,1,2,3,4,5,6,7,8,9], 3], [[0,0,0,0,0,LO,0,0,0,0], HI], function() { return page[0] == 3 && kpage == 2; });
controls.rows.oct[3] = new Value(6, [[0,1,2,3,4,5,6,7,8,9], 3], [[0,0,0,0,0,LO,0,0,0,0], HI], function() { return page[0] == 3 && kpage == 3; });

controls.rows.keyb = [];
controls.rows.keyb[3] = new Momentaries([], [[0,1,2,3,4,5,6,7,8,9,10,11,12,13], 4], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], function() { return page[1] == 1; });
controls.rows.keyb[2] = new Momentaries([], [[0,1,2,3,4,5,6,7,8,9,10,11,12,13], 5], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], function() { return page[1] == 1; });
controls.rows.keyb[1] = new Momentaries([], [[0,1,2,3,4,5,6,7,8,9,10,11,12,13], 6], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], function() { return page[1] == 1; });
controls.rows.keyb[0] = new Momentaries([], [[0,1,2,3,4,5,6,7,8,9,10,11,12,13], 7], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], function() { return page[1] == 1; });

controls.rows.draw = function(g) {
	for(var i = 0; i < 4; i++) {
		controls.rows.root[i].draw(g);
		controls.rows.oct[i].draw(g);
		controls.rows.keyb[i].draw(g);
	}
}

controls.rows.look = function(x, y, z) {
	for(var i = 0; i < 4; i++) {
		controls.rows.root[i].look(x, y, z);
		controls.rows.oct[i].look(x, y, z);
		controls.rows.keyb[i].look(x, y, z);
	}
}

controls.scale.event = function() {
	controls.marks.p[0] = [];
	
	for(var i = 0; i < controls.scale.v.length; i++) {
		controls.marks.p[0].push(controls.scale.p[0][controls.scale.v[i]]);
		//controls.marks.p[0].sort();
	}
	
	for(var i = 0; i < 4; i++) {
		controls.rows.root[i].p[0] = [];
	
		for(var j = 0; j < controls.scale.v.length; j++) {
			controls.rows.root[i].p[0].push(controls.scale.p[0][controls.scale.v[j]]);
			//controls.marks.p[0].sort();
		}
	}
	
	controls.marks.event();
	redraw();
}

controls.marks.event = function(v, last) {
	for(var i = 0; i < 4; i++) {
		controls.rows.keyb[i].b[0] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		
		for(var j = -Math.ceil(controls.rows.keyb[0].p[0].length / controls.scale.v.length); j < Math.ceil(controls.rows.keyb[0].p[0].length / controls.scale.v.length); j++) {
			for(var k = 0; k < controls.marks.v.length; k++) {
				controls.rows.keyb[i].b[0][controls.marks.v[k] + (j * controls.scale.v.length) - controls.rows.root[i].v] = LO;
			}
		}
	}
	
	redraw();
}

for(var i = 0; i < 4; i++) {
	controls.rows.keyb[i].index = i;
	
	controls.rows.keyb[i].event = function(v, last, add, rem) {
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
		key += controls.rows.root[this.index].v;
		key = controls.scale.v[key % controls.scale.v.length] + ((Math.floor(key / controls.scale.v.length) + controls.rows.oct[this.index].v) * controls.scale.p[0].length);
		
		output("key", key, gate);
		
		/*
		if(gate) {
			controls.kpages.v = this.index;
			controls.kpages.event(this.index);
		}*/
	}
	
	controls.rows.root[i].event = function(v) {
		this.v = v;
		
		controls.scale.event();
	}
	
	controls.rows.oct[i].event = function(v) {
		this.v = v;
		
		controls.scale.event();
	}
}
/*
for(var i = 0; i < 4; i++) {
	controls.p0 = new Toggle(0, [14, 4], [0, LO, HI], function() { return 1; });
	controls.p1 = new Toggle(0, [14, 5], [0, LO, HI], function() { return 1; });
	controls.p2 = new Toggle(0, [14, 6], [0, LO, HI], function() { return 1; });
	controls.p3 = new Toggle(0, [14, 7], [0, LO, HI], function() { return 1; });
}

patterns[0] = new Pattern(controls.p0, update);
patterns[1] = new Pattern(controls.p1, update);
patterns[2] = new Pattern(controls.p2, update);
patterns[3] = new Pattern(controls.p3, update);
*/

var init = function() {
	controls.scale.event();
	controls.marks.event();
	
	for(i in controls) {
		if(controls[i].draw) controls[i].draw(g);
	}
	
	for(var i = 0; i < 4; i++) {
 		tracks[i] = new Track(i, 0, 0);

		for(j in tracks[i]) {
			if(tracks[i][j].draw) {
				tracks[i][j].draw(g);
				output(i, j, tracks[i][j].v);
			}
		}	
	}
	
	pages[0].draw(g);
	pages[1].draw(g);
	
	g.refresh();
}